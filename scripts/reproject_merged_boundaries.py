"""Convert the existing merged village boundaries to MapLibre-ready WGS84."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

try:
    from .geo_projection import transform_geometry
except ImportError:
    from geo_projection import transform_geometry


ROOT = Path(__file__).resolve().parents[1]


def first_position(value):
    if not isinstance(value, list):
        return None
    if value and isinstance(value[0], (int, float)):
        return value
    for child in value:
        position = first_position(child)
        if position:
            return position
    return None


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=Path("public/data/boundaries/gujarat-villages"))
    parser.add_argument("--output", type=Path, default=Path("public/data/boundaries/gujarat-villages-wgs84"))
    parser.add_argument("--tolerance-m", type=float, default=25.0)
    args = parser.parse_args()
    source = args.input if args.input.is_absolute() else ROOT / args.input
    output = args.output if args.output.is_absolute() else ROOT / args.output
    output.mkdir(parents=True, exist_ok=True)
    transformed = preserved = total_features = 0

    for path in sorted(source.glob("*.geojson")):
        payload = json.loads(path.read_text(encoding="utf-8"))
        features = []
        for feature in payload.get("features", []):
            total_features += 1
            position = first_position(feature.get("geometry", {}).get("coordinates"))
            if position and (abs(float(position[0])) > 180 or abs(float(position[1])) > 90):
                feature["geometry"] = transform_geometry(feature["geometry"], args.tolerance_m)
                transformed += 1
            else:
                preserved += 1
            point = first_position(feature.get("geometry", {}).get("coordinates"))
            if not point or not (-180 <= point[0] <= 180 and -90 <= point[1] <= 90):
                raise ValueError(f"Coordinate is not WGS84 after conversion: {path.name} {feature.get('properties', {}).get('villageCode')}")
            features.append(feature)
        (output / path.name).write_text(
            json.dumps({"type": "FeatureCollection", "features": features}, ensure_ascii=False, separators=(",", ":")),
            encoding="utf-8",
        )

    print(f"Wrote {total_features:,} WGS84 features to {output}")
    print(f"Reprojected {transformed:,} EPSG:7755 features; preserved {preserved:,} existing WGS84 fallback features.")


if __name__ == "__main__":
    main()
