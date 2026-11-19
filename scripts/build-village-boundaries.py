"""Create compact WGS84 village-boundary files from the Survey of India GeoJSON."""

from __future__ import annotations

import json
import re
import sys
import tempfile
import urllib.request
import zipfile
from collections import defaultdict
from pathlib import Path

try:
    from .geo_projection import transform_geometry
except ImportError:
    from geo_projection import transform_geometry


ROOT = Path(__file__).resolve().parents[1]
SOURCE_URL = (
    "https://nwdp.nwic.gov.in/dataset/9bad17f2-9d88-428d-98ad-831ef01ae2e4/"
    "resource/4ce4dc83-fe99-4394-b4db-55b51554828c/download/vb_soi_gj_geojson.zip"
)
SOURCE_NAME = "vb_soi_gj.GeoJSON"
OUTPUT_DIR = ROOT / "public" / "data" / "boundaries" / "soi-villages"
def code(value: object) -> str:
    text = str(value or "").strip()
    if not text:
        return ""
    try:
        number = float(text)
        return str(int(number)) if number.is_integer() else text
    except ValueError:
        return text


def local_hierarchy() -> tuple[dict[str, dict[str, object]], dict[int, dict[str, object]]]:
    villages: dict[str, dict[str, object]] = {}
    for filename in (ROOT / "public" / "data" / "hierarchy" / "villages").glob("*.json"):
        subdistrict_code = int(filename.stem)
        for village in json.loads(filename.read_text(encoding="utf-8")):
            villages[str(village["code"])] = {
                "nameEn": village["nameEn"],
                "subdistrictCode": subdistrict_code,
            }

    source = (ROOT / "src" / "lib" / "master-hierarchy.ts").read_text(encoding="utf-8")
    match = re.search(
        r"export const MASTER_SUBDISTRICTS:[\s\S]*?=\s*\[([\s\S]*?)\];",
        source,
    )
    if not match:
        raise RuntimeError("Could not read the master subdistrict directory.")
    subdistricts: dict[int, dict[str, object]] = {}
    for entry in re.finditer(
        r'"?code"?\s*:\s*(\d+),[\s\S]{0,500}?"?districtCode"?\s*:\s*(\d+),'
        r'[\s\S]{0,160}?"?districtId"?\s*:\s*"([^"]+)"',
        match.group(1),
    ):
        subdistricts[int(entry.group(1))] = {
            "districtCode": int(entry.group(2)),
            "districtId": entry.group(3),
        }
    if not villages or not subdistricts:
        raise RuntimeError("The local LGD hierarchy is empty or could not be parsed.")
    return villages, subdistricts


def main() -> None:
    archive = Path(sys.argv[1]).expanduser() if len(sys.argv) > 1 else None
    tolerance = float(sys.argv[2]) if len(sys.argv) > 2 else 25.0
    if tolerance < 0:
        raise ValueError("Simplification tolerance must be zero or greater.")
    if archive is None:
        archive = Path(tempfile.gettempdir()) / "yojana-drishti-gujarat-village-boundaries.zip"
        if not archive.exists():
            urllib.request.urlretrieve(SOURCE_URL, archive)

    villages, subdistricts = local_hierarchy()
    grouped: dict[str, list[dict[str, object]]] = defaultdict(list)
    skipped_missing_code = skipped_changed_admin = 0
    matched_codes: set[str] = set()

    with zipfile.ZipFile(archive) as source_zip:
        source = json.load(source_zip.open(SOURCE_NAME))
    for feature in source["features"]:
        properties = feature.get("properties", {})
        village_code = code(properties.get("vlcode"))
        local_village = villages.get(village_code)
        if not local_village:
            skipped_missing_code += 1
            continue
        subdistrict_code = int(local_village["subdistrictCode"])
        source_subdistrict_code = code(properties.get("sdcode"))
        subdistrict = subdistricts.get(subdistrict_code)
        if (
            not subdistrict
            or source_subdistrict_code != str(subdistrict_code)
            or code(properties.get("dtcode")) != str(subdistrict["districtCode"])
        ):
            skipped_changed_admin += 1
            continue
        matched_codes.add(village_code)
        grouped[str(subdistrict["districtId"])].append({
            "type": "Feature",
            "properties": {
                "villageCode": village_code,
                "subdistrictCode": subdistrict_code,
                "districtCode": int(subdistrict["districtCode"]),
                "nameEn": local_village["nameEn"],
            },
            "geometry": transform_geometry(feature["geometry"], tolerance),
        })

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    total_bytes = 0
    for district_id, features in grouped.items():
        output = OUTPUT_DIR / f"{district_id}.geojson"
        output.write_text(json.dumps({"type": "FeatureCollection", "features": features}, separators=(",", ":")), encoding="utf-8")
        total_bytes += output.stat().st_size

    print(
        f"Wrote {sum(map(len, grouped.values())):,} SOI boundary parts for "
        f"{len(matched_codes):,} LGD village codes across {len(grouped)} districts "
        f"({total_bytes / 1024 / 1024:.1f} MiB; tolerance {tolerance:g} m)."
    )
    print(f"Skipped {skipped_missing_code:,} codes absent from the current hierarchy and {skipped_changed_admin:,} changed district/taluka assignments.")


if __name__ == "__main__":
    main()
