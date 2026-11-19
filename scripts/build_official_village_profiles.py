#!/usr/bin/env python3
"""Join open Survey of India village boundaries and 2011 census attributes by exact village code.

The source ZIP is published by India's National Water Data Portal. This builder
only accepts a unique exact `vlcode` to `Location_Code` match. It preserves old
project boundaries for unmatched map features and never invents a geometry.
"""

from __future__ import annotations

import argparse
import csv
import gzip
import json
import re
import zipfile
from collections import defaultdict
from pathlib import Path

try:
    from .geo_projection import transform_geometry
except ImportError:
    from geo_projection import transform_geometry


def read_csv(path: Path):
    with path.open("r", encoding="utf-8-sig", newline="") as source:
        yield from csv.DictReader(source)


def clean_properties(properties: dict) -> dict[str, object]:
    cleaned: dict[str, object] = {}
    for key, value in properties.items():
        name = re.sub(r"\s+", " ", str(key).replace("\r", " ").replace("\n", " ")).strip()
        cleaned[name] = value
    return cleaned


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dataset-dir", required=True, type=Path, help="Supplied Gujarat 10 Schemes dataset folder")
    parser.add_argument("--soi-zip", required=True, type=Path, help="Survey of India Gujarat village-boundary GeoJSON ZIP")
    parser.add_argument("--legacy-boundaries", default=Path("public/data/boundaries/soi-villages"), type=Path)
    parser.add_argument("--boundary-output", default=Path("public/data/boundaries/gujarat-villages-wgs84"), type=Path)
    parser.add_argument("--profile-output", default=Path("data/processed/village-census-2011.json.gz"), type=Path)
    parser.add_argument("--district-master", default=Path("src/lib/master-hierarchy.ts"), type=Path)
    args = parser.parse_args()

    locations_path = args.dataset_dir.resolve() / "Location_Master.csv"
    if not locations_path.is_file() or not args.soi_zip.is_file():
        raise SystemExit("Location_Master.csv and the official Survey of India ZIP are both required.")

    locations: dict[str, dict[str, str]] = {}
    for row in read_csv(locations_path):
        if row.get("Settlement_Status", "").strip().casefold() == "inhabitant":
            code = str(row.get("Location_Code", "")).strip()
            if not code or code in locations:
                raise SystemExit(f"Missing or duplicate inhabited Location_Code: {code!r}")
            locations[code] = row

    districts: dict[str, str] = {}
    legacy_by_code: dict[str, dict] = {}
    legacy_features: list[dict] = []
    for path in sorted(args.legacy_boundaries.glob("*.geojson")):
        payload = json.loads(path.read_text(encoding="utf-8"))
        for feature in payload.get("features", []):
            properties = feature.get("properties", {})
            code = str(properties.get("villageCode", "")).strip()
            legacy_features.append(feature)
            if code:
                if code in legacy_by_code:
                    raise SystemExit(f"Duplicate legacy boundary location code: {code}")
                legacy_by_code[code] = feature
            district_code = str(properties.get("districtCode", "")).strip()
            if district_code:
                previous = districts.setdefault(district_code, path.stem)
                if previous != path.stem:
                    raise SystemExit(f"District {district_code} appears in multiple legacy boundary files.")

    hierarchy = args.district_master.read_text(encoding="utf-8")
    district_section = hierarchy.split("export const MASTER_DISTRICTS", 1)[1].split("export const MASTER_SUBDISTRICTS", 1)[0]
    for code, district_id in re.findall(r'"code"\s*:\s*(\d+)\s*,\s*"id"\s*:\s*"([^"]+)"', district_section):
        districts[code] = district_id

    with zipfile.ZipFile(args.soi_zip) as source_zip:
        geojson_members = [name for name in source_zip.namelist() if name.lower().endswith((".geojson", ".json"))]
        if len(geojson_members) != 1:
            raise SystemExit(f"Expected one GeoJSON file in Survey of India ZIP; found {len(geojson_members)}")
        with source_zip.open(geojson_members[0]) as source:
            official = json.load(source)

    by_code: dict[str, list[dict]] = defaultdict(list)
    for feature in official.get("features", []):
        properties = clean_properties(feature.get("properties", {}))
        code = str(properties.get("vlcode", "")).strip()
        if code:
            by_code[code].append({"geometry": feature.get("geometry"), "properties": properties})

    profile_locations: dict[str, dict[str, object]] = {}
    features_by_district: dict[str, dict[str, dict]] = defaultdict(dict)
    duplicate_matched_codes = [code for code, rows in by_code.items() if code in locations and len(rows) != 1]
    if duplicate_matched_codes:
        raise SystemExit(f"Survey of India has ambiguous codes that match the dataset: {duplicate_matched_codes[:5]}")

    for code, location in locations.items():
        source_rows = by_code.get(code, [])
        if not source_rows:
            continue
        source = source_rows[0]
        properties = source["properties"]
        district_code = str(location.get("District_ID", "")).strip()
        taluka_code = str(location.get("Taluka_ID", "")).strip()
        district_file = districts.get(district_code)
        if not district_file:
            raise SystemExit(f"No current boundary district file can place Location_Code {code} ({district_code}).")
        if source["geometry"] is None:
            raise SystemExit(f"Survey of India boundary geometry is empty for Location_Code {code}.")

        fields = {key: value for key, value in properties.items() if key not in {"objectid", "objectid_1", "shape_leng", "shape_length", "shape_area"}}
        profile_locations[code] = {
            "locationCode": code,
            "locationName": location.get("Settlement_Name", ""),
            "districtCode": district_code,
            "talukaCode": taluka_code,
            "sourceFields": fields,
        }
        features_by_district[district_file][code] = {
            "type": "Feature",
            # NWIC distributes these SOI polygons in EPSG:7755 projected meters.
            # Reproject and simplify before saving GeoJSON for MapLibre/WGS84.
            "geometry": transform_geometry(source["geometry"], 25.0),
            "properties": {
                "villageCode": code,
                "locationCode": code,
                "subdistrictCode": int(taluka_code),
                "districtCode": int(district_code),
                "nameEn": location.get("Settlement_Name", properties.get("village", "")),
                "category": location.get("Settlement_Category", "Settlement"),
                "boundarySource": "Survey of India (SOI), via NWIC National Water Data Portal; exact village-code match",
            },
        }

    # Keep any project boundary that has no exact official source match. This
    # also preserves the 2011-era non-inhabited features already in the map.
    for feature in legacy_features:
        properties = feature.get("properties", {})
        code = str(properties.get("villageCode", "")).strip()
        if not code:
            continue
        district_code = str(properties.get("districtCode", "")).strip()
        if code in locations:
            location = locations[code]
            district_file = districts.get(str(location["District_ID"]).strip())
            if not district_file:
                continue
            if code in features_by_district[district_file]:
                continue
            feature = {
                **feature,
                "properties": {
                    **properties,
                    "locationCode": code,
                    "districtCode": int(location["District_ID"]),
                    "subdistrictCode": int(location["Taluka_ID"]),
                    "nameEn": location.get("Settlement_Name", properties.get("nameEn", "")),
                    "category": location.get("Settlement_Category", "Settlement"),
                    "boundarySource": "Existing project boundary; official village-code match unavailable",
                },
            }
        else:
            district_file = districts.get(district_code)
            if not district_file or code in features_by_district[district_file]:
                continue
        features_by_district[district_file][code] = feature

    args.boundary_output.mkdir(parents=True, exist_ok=True)
    for district_file, features in features_by_district.items():
        payload = {"type": "FeatureCollection", "features": list(features.values())}
        out = args.boundary_output / f"{district_file}.geojson"
        out.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    meta = {
        "source": "Survey of India village-boundary data distributed by the National Water Data Portal (NWIC)",
        "sourceUrl": "https://nwdp.nwic.gov.in/dataset/village-boundary",
        "sourceAgency": "Survey of India (SOI)",
        "publishedAt": "2025-05-01",
        "referencePeriod": "2011 Census village attributes; historical baseline, not current population or service status",
        "inhabitedLocationCount": len(locations),
        "exactCodeMatchCount": len(profile_locations),
        "locationsWithoutProfile": len(locations) - len(profile_locations),
        "boundaryLocationCount": sum(len(items) for items in features_by_district.values()),
        "classification": "Official historical village attributes where exact codes match; project fallback boundaries are marked separately.",
    }
    args.profile_output.parent.mkdir(parents=True, exist_ok=True)
    with gzip.open(args.profile_output, "wt", encoding="utf-8", newline="", compresslevel=8) as output:
        json.dump({"meta": meta, "locations": profile_locations}, output, ensure_ascii=False, separators=(",", ":"))

    print(json.dumps({
        "meta": meta,
        "boundaryFiles": len(features_by_district),
        "sourceBoundaryCodes": len(by_code),
        "legacyInhabitedBoundaryCodes": len(set(legacy_by_code) & set(locations)),
        "output": str(args.profile_output),
        "boundaryOutput": str(args.boundary_output),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
