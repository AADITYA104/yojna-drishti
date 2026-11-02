"""Create compact WGS84 village-boundary files from the Survey of India GeoJSON."""

from __future__ import annotations

import json
import math
import re
import sys
import tempfile
import urllib.request
import zipfile
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_URL = (
    "https://nwdp.nwic.gov.in/dataset/9bad17f2-9d88-428d-98ad-831ef01ae2e4/"
    "resource/4ce4dc83-fe99-4394-b4db-55b51554828c/download/vb_soi_gj_geojson.zip"
)
SOURCE_NAME = "vb_soi_gj.GeoJSON"
OUTPUT_DIR = ROOT / "public" / "data" / "boundaries" / "soi-villages"
EPSG7755_EPSG4326 = (6378137.0, 1 / 298.257223563, 12.472955, 35.1728044444444, 24.0, 80.0, 4_000_000.0)


def projection_coefficients() -> tuple[float, float, float, float, float, float, float]:
    a, flattening, parallel_1, parallel_2, latitude_0, longitude_0, false_origin = EPSG7755_EPSG4326
    radians = math.pi / 180
    eccentricity = math.sqrt(flattening * (2 - flattening))
    phi_1, phi_2 = parallel_1 * radians, parallel_2 * radians
    phi_0, lambda_0 = latitude_0 * radians, longitude_0 * radians

    def m(phi: float) -> float:
        return math.cos(phi) / math.sqrt(1 - eccentricity**2 * math.sin(phi) ** 2)

    def t(phi: float) -> float:
        ratio = (1 - eccentricity * math.sin(phi)) / (1 + eccentricity * math.sin(phi))
        return math.tan(math.pi / 4 - phi / 2) / ratio ** (eccentricity / 2)

    n = (math.log(m(phi_1)) - math.log(m(phi_2))) / (math.log(t(phi_1)) - math.log(t(phi_2)))
    factor = m(phi_1) / (n * t(phi_1) ** n)
    rho_0 = a * factor * t(phi_0) ** n
    return a, eccentricity, n, factor, rho_0, lambda_0, false_origin


A, ECCENTRICITY, LCC_N, LCC_FACTOR, RHO_0, LAMBDA_0, FALSE_ORIGIN = projection_coefficients()


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


def inverse_lcc(x: float, y: float) -> tuple[float, float]:
    radians = math.pi / 180
    delta_x, delta_y = x - FALSE_ORIGIN, y - FALSE_ORIGIN
    rho = math.copysign(math.hypot(delta_x, RHO_0 - delta_y), LCC_N)
    theta = math.atan2(delta_x, RHO_0 - delta_y)
    conformal_t = (rho / (A * LCC_FACTOR)) ** (1 / LCC_N)
    latitude = math.pi / 2 - 2 * math.atan(conformal_t)
    for _ in range(6):
        ratio = (1 - ECCENTRICITY * math.sin(latitude)) / (1 + ECCENTRICITY * math.sin(latitude))
        latitude = math.pi / 2 - 2 * math.atan(conformal_t * ratio ** (ECCENTRICITY / 2))
    longitude = LAMBDA_0 + theta / LCC_N
    return round(longitude / radians, 6), round(latitude / radians, 6)


def simplify_open(points: list[list[float]], tolerance: float) -> list[list[float]]:
    if len(points) < 3:
        return points
    tolerance_squared = tolerance * tolerance
    keep = {0, len(points) - 1}
    pending = [(0, len(points) - 1)]
    while pending:
        start, end = pending.pop()
        x1, y1 = points[start]
        x2, y2 = points[end]
        dx, dy = x2 - x1, y2 - y1
        length_squared = dx * dx + dy * dy
        farthest, farthest_index = tolerance_squared, -1
        for index in range(start + 1, end):
            x, y = points[index]
            fraction = max(0.0, min(1.0, ((x - x1) * dx + (y - y1) * dy) / length_squared)) if length_squared else 0.0
            distance = (x - (x1 + fraction * dx)) ** 2 + (y - (y1 + fraction * dy)) ** 2
            if distance > farthest:
                farthest, farthest_index = distance, index
        if farthest_index >= 0:
            keep.add(farthest_index)
            pending.extend(((start, farthest_index), (farthest_index, end)))
    return [points[index] for index in sorted(keep)]


def simplify_ring(ring: list[list[float]], tolerance: float) -> list[list[float]]:
    vertices = ring[:-1]
    if len(vertices) < 5:
        return ring
    first_x, first_y = vertices[0]
    split = max(range(1, len(vertices)), key=lambda index: (vertices[index][0] - first_x) ** 2 + (vertices[index][1] - first_y) ** 2)
    first_half = simplify_open(vertices[: split + 1], tolerance)
    second_half = simplify_open(vertices[split:] + [vertices[0]], tolerance)
    simplified = first_half[:-1] + second_half[:-1]
    if len(simplified) < 3:
        return ring
    return simplified + [simplified[0]]


def transform_geometry(geometry: dict[str, object], tolerance: float) -> dict[str, object]:
    geometry_type = str(geometry["type"])
    coordinates = geometry["coordinates"]

    def transform_ring(ring: list[list[float]]) -> list[list[float]]:
        return [list(inverse_lcc(x, y)) for x, y in simplify_ring(ring, tolerance)]

    if geometry_type == "Polygon":
        transformed = [[transform_ring(ring) for ring in coordinates]]
        return {"type": "Polygon", "coordinates": transformed[0]}
    if geometry_type == "MultiPolygon":
        transformed = [[transform_ring(ring) for ring in polygon] for polygon in coordinates]
        return {"type": "MultiPolygon", "coordinates": transformed}
    raise ValueError(f"Unsupported boundary geometry: {geometry_type}")


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
