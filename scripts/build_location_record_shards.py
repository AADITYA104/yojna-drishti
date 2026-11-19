#!/usr/bin/env python3
"""Pack each settlement's synthetic source rows into range-readable district shards.

Each location is a separate gzip member inside its district shard. The companion
index stores compressed byte offsets, so object storage only returns the selected
location while retaining all source rows and columns.
"""

from __future__ import annotations

import argparse
import csv
import gzip
import io
import json
from contextlib import ExitStack
from pathlib import Path


def load_gzip_json(path: Path) -> dict:
    with gzip.open(path, "rt", encoding="utf-8") as source:
        return json.load(source)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dataset-dir", required=True, type=Path)
    parser.add_argument("--records-index", default=Path("data/processed/location-record-index.json.gz"), type=Path)
    parser.add_argument("--analytics", default=Path("data/processed/location-analytics.json.gz"), type=Path)
    parser.add_argument("--output-dir", default=Path("data/raw/location-record-shards"), type=Path)
    parser.add_argument("--output-index", default=Path("data/processed/location-record-shard-index.json.gz"), type=Path)
    args = parser.parse_args()

    root = args.dataset_dir.resolve()
    record_index = load_gzip_json(args.records_index)
    analytics = load_gzip_json(args.analytics)
    locations = record_index["locations"]
    analytics_locations = analytics["locations"]
    columns = record_index["meta"]["columns"]
    scheme_files = record_index["meta"]["schemes"]
    if len(columns) != 39 or set(locations) != set(analytics_locations):
        raise SystemExit("The source indexes do not agree on the 39-column inhabited-location set.")

    args.output_dir.mkdir(parents=True, exist_ok=True)
    args.output_index.parent.mkdir(parents=True, exist_ok=True)
    shard_index: dict[str, dict] = {}
    shard_sizes: dict[str, int] = {}
    ordered_codes = sorted(locations, key=lambda code: (analytics_locations[code]["districtCode"], code))

    with ExitStack() as stack:
        source_files = {
            scheme_id: stack.enter_context((root / "scheme_data" / filename).open("rb"))
            for scheme_id, filename in scheme_files.items()
        }
        output_files = {}

        for position, code in enumerate(ordered_codes, start=1):
            location_analytics = analytics_locations[code]
            district_code = str(location_analytics["districtCode"])
            shard_name = f"{district_code}.bin"
            if shard_name not in output_files:
                output_files[shard_name] = stack.enter_context((args.output_dir / shard_name).open("wb"))
                shard_sizes[shard_name] = 0

            row_blocks = locations[code]
            if set(row_blocks) != set(scheme_files):
                raise SystemExit(f"Location {code} does not have one row block for each scheme.")

            raw_rows = bytearray()
            total_rows = 0
            for scheme_id in sorted(scheme_files):
                block = row_blocks[scheme_id]
                if block["rows"] != 15 or block["length"] < 1:
                    raise SystemExit(f"Invalid row block for location {code}, scheme {scheme_id}.")
                source = source_files[scheme_id]
                source.seek(block["offset"])
                content = source.read(block["length"])
                if len(content) != block["length"]:
                    raise SystemExit(f"Truncated source block for location {code}, scheme {scheme_id}.")

                try:
                    parsed_rows = list(csv.reader(io.StringIO(content.decode("utf-8"), newline=""), strict=True))
                except (UnicodeDecodeError, csv.Error) as error:
                    raise SystemExit(f"Invalid CSV block for location {code}, scheme {scheme_id}: {error}") from error
                if len(parsed_rows) != 15 or any(len(row) != len(columns) for row in parsed_rows):
                    raise SystemExit(f"Unexpected row or column count for location {code}, scheme {scheme_id}.")
                if any(row[columns.index("Location_Code")] != code or row[columns.index("Scheme_ID")] != scheme_id for row in parsed_rows):
                    raise SystemExit(f"Location or scheme mismatch for location {code}, scheme {scheme_id}.")

                raw_rows.extend(content)
                total_rows += len(parsed_rows)

            if total_rows != len(scheme_files) * 15:
                raise SystemExit(f"Unexpected total row count for location {code}: {total_rows}.")

            compressed = gzip.compress(bytes(raw_rows), compresslevel=6, mtime=0)
            output = output_files[shard_name]
            offset = output.tell()
            output.write(compressed)
            shard_index[code] = {
                "file": shard_name,
                "districtCode": district_code,
                "offset": offset,
                "length": len(compressed),
                "rows": total_rows,
            }
            shard_sizes[shard_name] += len(compressed)
            if position % 1000 == 0:
                print(f"Packed {position:,}/{len(ordered_codes):,} locations")

    payload = {
        "meta": {
            "classification": "SYNTHETIC DEMO ONLY — ALL SOURCE ROWS ARE FICTIONAL",
            "sourceRows": record_index["meta"]["sourceRows"],
            "locationCount": len(shard_index),
            "schemeCount": len(scheme_files),
            "columns": columns,
            "schemes": scheme_files,
            "format": "Concatenated independent gzip members; each location index range is one complete member.",
        },
        "locations": shard_index,
        "shards": sorted(shard_sizes),
    }
    with gzip.open(args.output_index, "wt", encoding="utf-8", newline="", compresslevel=8) as output:
        json.dump(payload, output, ensure_ascii=False, separators=(",", ":"))

    raw_total = sum((args.output_dir / name).stat().st_size for name in shard_sizes)
    print(
        f"Wrote {len(shard_index):,} locations, {record_index['meta']['sourceRows']:,} source rows, "
        f"{len(shard_sizes)} district shards ({raw_total:,} bytes) and {args.output_index}."
    )


if __name__ == "__main__":
    main()
