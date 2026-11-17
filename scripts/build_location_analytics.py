#!/usr/bin/env python3
"""Build location analytics and a byte index for the synthetic Gujarat dataset.

The analytics artifact contains aggregates. A separate offset index points to
source rows so the app can fetch just one map location at a time without copying
the multi-gigabyte source CSVs into the project or loading them into memory.
"""

from __future__ import annotations

import argparse
import csv
import gzip
import json
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path


def read_csv(path: Path):
    return csv.DictReader(path.open("r", encoding="utf-8-sig", newline=""))


def count_bucket(value: str, mapping: dict[str, str], fallback: str) -> str:
    normalized = (value or "").strip().casefold()
    if normalized in mapping:
        return mapping[normalized]
    for label, bucket in mapping.items():
        if normalized.startswith(label + " ") or normalized.startswith(label + " ("):
            return bucket
    return fallback


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dataset-dir", required=True, type=Path, help="Gujarat_10_Schemes_Demo_Dataset directory")
    parser.add_argument("--output", default=Path("data/processed/location-analytics.json.gz"), type=Path)
    parser.add_argument("--records-index", default=Path("data/processed/location-record-index.json.gz"), type=Path)
    args = parser.parse_args()
    root = args.dataset_dir.resolve()
    locations_file = root / "Location_Master.csv"
    schemes_file = root / "Scheme_Master.csv"
    scheme_dir = root / "scheme_data"
    if not locations_file.is_file() or not schemes_file.is_file() or not scheme_dir.is_dir():
        raise SystemExit(f"Dataset structure not found under {root}")

    schemes = {}
    expected_scheme_by_file = {}
    for row in read_csv(schemes_file):
        dataset_file = Path(row.get("Dataset_CSV_File", "")).name
        if dataset_file:
            expected_scheme_by_file[dataset_file] = row["Scheme_ID"]
        schemes[row["Scheme_ID"]] = {
            "id": row["Scheme_ID"],
            "nameEn": row["Scheme_Name_English"],
            "nameGu": row["Scheme_Name_Gujarati"],
        }

    locations = {}
    for row in read_csv(locations_file):
        code = str(row["Location_Code"]).strip()
        if row.get("Settlement_Status", "").strip().casefold() != "inhabitant":
            continue
        locations[code] = {
            "code": code,
            "nameEn": row["Settlement_Name"],
            "nameGu": row.get("Settlement_Name_Gujarati", ""),
            "category": row.get("Settlement_Category", "Settlement"),
            "talukaCode": str(row.get("Taluka_ID", "")),
            "talukaEn": row.get("Taluka_Name", ""),
            "talukaGu": row.get("Taluka_Name_Gujarati", ""),
            "districtCode": str(row.get("District_ID", "")),
            "districtEn": row.get("District_Name", ""),
            "districtGu": row.get("District_Name_Gujarati", ""),
            "schemes": {},
        }

    eligibility_map = {
        "eligible": "eligible",
        "not eligible": "notEligible",
        "potentially eligible": "potential",
        "not applicable": "notApplicable",
        "pending verification": "review",
        "pending manual review": "review",
    }
    activity_map = {
        "approved": "approved",
        "pending": "pending",
        "under verification": "pending",
        "documents pending": "documentsPending",
        "rejected": "rejected",
        "not eligible": "rejected",
        "service delivered": "serviceDelivered",
        "activity recorded": "activityRecorded",
        "not applied / awareness lead": "notApplied",
    }
    document_map = {
        "complete": "complete", "pending": "review", "incomplete": "review",
        "not applicable": "notApplicable", "attendance / activity log": "activityLog",
    }
    gender_map = {
        "સ્ત્રી": "female", "female": "female", "મહિલા": "female",
        "પુરુષ": "male", "male": "male", "પુરૂષ": "male",
        "સમુદાય": "community", "community": "community",
    }

    def new_aggregate():
        return {
            "count": 0,
            "eligibility": Counter(),
            "activity": Counter(),
            "documents": Counter(),
            "gender": Counter(),
            "ageBands": Counter(),
            "months": Counter(),
        }

    aggregates = defaultdict(new_aggregate)
    input_rows = 0
    scheme_files = sorted(scheme_dir.glob("*.csv"))
    if not scheme_files:
        raise SystemExit(f"No scheme CSV files found in {scheme_dir}")
    source_columns: list[str] | None = None
    scheme_file_map: dict[str, str] = {}
    record_offsets: dict[str, dict[str, dict[str, int | str]]] = defaultdict(dict)
    for path in scheme_files:
        print(f"Aggregating and indexing {path.name} ...", flush=True)
        current_code = ""
        group_start = 0
        group_end = 0
        group_count = 0
        group_scheme = ""
        group_codes: set[str] = set()

        def save_group() -> None:
            if not current_code:
                return
            if group_count != 15:
                raise SystemExit(f"Expected 15 rows for {current_code}/{group_scheme}; found {group_count}")
            if current_code not in locations:
                raise SystemExit(f"Unknown Location_Code {current_code} in {path.name}")
            if locations[current_code]["category"] == "Forest" or not locations[current_code]["category"]:
                raise SystemExit(f"Unexpected non-inhabited location {current_code} in {path.name}")
            if group_scheme not in schemes:
                raise SystemExit(f"Unknown Scheme_ID {group_scheme} in {path.name}")
            record_offsets[current_code][group_scheme] = {
                "file": path.name,
                "offset": group_start,
                "length": group_end - group_start,
                "rows": group_count,
            }

        with path.open("rb", buffering=1024 * 1024) as handle:
            header_line = handle.readline()
            try:
                header = next(csv.reader([header_line.decode("utf-8-sig").rstrip("\r\n")], strict=True))
            except (UnicodeDecodeError, csv.Error) as error:
                raise SystemExit(f"Cannot read CSV header in {path.name}: {error}") from error
            if len(header) != 39 or not {"Record_ID", "Scheme_ID", "Location_Code", "Record_Date"}.issubset(header):
                raise SystemExit(f"Unexpected scheme CSV schema in {path.name}: expected the 39-column source schema")
            if source_columns is None:
                source_columns = header
            elif header != source_columns:
                raise SystemExit(f"Column mismatch in {path.name}")
            while True:
                row_offset = handle.tell()
                line = handle.readline()
                if not line:
                    break
                try:
                    values = next(csv.reader([line.decode("utf-8").rstrip("\r\n")], strict=True))
                except (UnicodeDecodeError, csv.Error) as error:
                    raise SystemExit(f"Cannot parse a source row in {path.name} at byte {row_offset}: {error}") from error
                if len(values) != len(header):
                    raise SystemExit(f"Column count mismatch in {path.name} at byte {row_offset}: expected {len(header)}, found {len(values)}")
                row = dict(zip(header, values))
                code = str(row.get("Location_Code", "")).strip()
                scheme_id = str(row.get("Scheme_ID", "")).strip()
                if scheme_id not in schemes:
                    raise SystemExit(f"Unknown Scheme_ID {scheme_id} in {path.name}")
                if current_code != code:
                    save_group()
                    if code in group_codes:
                        raise SystemExit(f"Location_Code {code} is not contiguous in {path.name}")
                    group_codes.add(code)
                    current_code = code
                    group_scheme = scheme_id
                    group_start = row_offset
                    group_count = 0
                if scheme_id != group_scheme:
                    raise SystemExit(f"Scheme_ID changed within a location block in {path.name}")
                if code not in locations or locations[code].get("category", "").casefold() == "forest":
                    raise SystemExit(f"Unexpected Location_Code {code} in {path.name}")
                group_count += 1
                group_end = handle.tell()
                aggregate = aggregates[(code, scheme_id)]
                aggregate["count"] += 1
                input_rows += 1
                aggregate["eligibility"][count_bucket(row.get("Eligibility_Status", ""), eligibility_map, "other")] += 1
                aggregate["activity"][count_bucket(row.get("Application_or_Activity_Status", ""), activity_map, "other")] += 1
                aggregate["documents"][count_bucket(row.get("Document_Verification_Status", ""), document_map, "other")] += 1
                aggregate["gender"][count_bucket(row.get("Gender", ""), gender_map, "other")] += 1
                try:
                    age = int(float(row.get("Age_Years", "")))
                    age_band = "under18" if age < 18 else "18to29" if age < 30 else "30to44" if age < 45 else "45to59" if age < 60 else "60plus"
                except (TypeError, ValueError):
                    age_band = "unknown"
                aggregate["ageBands"][age_band] += 1
                record_date = row.get("Record_Date", "")
                try:
                    month = date.fromisoformat(record_date).strftime("%Y-%m")
                    aggregate["months"][month] += 1
                except (TypeError, ValueError):
                    pass
            save_group()
        if group_scheme != expected_scheme_by_file.get(path.name):
            raise SystemExit(f"Scheme ID in {path.name} does not match Scheme_Master mapping")
        if len(group_codes) != len([location for location in locations.values() if location.get("category", "").casefold() != "forest"]):
            raise SystemExit(f"Location coverage mismatch in {path.name}: found {len(group_codes)} inhabited codes")
        scheme_file_map[group_scheme] = path.name

    expected_location_codes = set(locations)
    if any(set(index) != set(scheme_file_map) for index in record_offsets.values()):
        raise SystemExit("One or more locations are missing one or more scheme row blocks")
    if set(record_offsets) != expected_location_codes:
        raise SystemExit("Location row index does not exactly match inhabited Location_Master rows")
    if input_rows != len(locations) * len(schemes) * 15:
        raise SystemExit(f"Unexpected total source rows: {input_rows}")

    for (code, scheme_id), aggregate in aggregates.items():
        location = locations[code]
        location["schemes"][scheme_id] = {
            **schemes[scheme_id],
            "count": aggregate["count"],
            "eligibility": dict(aggregate["eligibility"]),
            "activity": dict(aggregate["activity"]),
            "documents": dict(aggregate["documents"]),
            "gender": dict(aggregate["gender"]),
            "ageBands": dict(aggregate["ageBands"]),
            "months": dict(sorted(aggregate["months"].items())),
        }

    payload = {
        "meta": {
            "classification": "SYNTHETIC DEMO ONLY — NOT REAL BENEFICIARY, APPLICATION, SERVICE OR PAYMENT DATA",
            "dataset": "Yojana Drishti Gujarat 10 Schemes Demo Dataset",
            "referenceDate": "2026-11-09",
            "sourceRowsAggregated": input_rows,
            "locationCount": len(locations),
            "schemeCount": len(schemes),
            "metricsNote": "Counts describe synthetic sample records and demo-rule labels only. They are not people, actual scheme coverage, eligibility decisions, services delivered, or financial totals.",
        },
        "locations": locations,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with gzip.open(args.output, "wt", encoding="utf-8", newline="", compresslevel=8) as output:
        json.dump(payload, output, ensure_ascii=False, separators=(",", ":"))
    records_payload = {
        "meta": {
            "classification": "SYNTHETIC DEMO ONLY — SOURCE ROWS ARE NOT REAL BENEFICIARY OR SERVICE RECORDS",
            "sourceRows": input_rows,
            "locationCount": len(locations),
            "schemeCount": len(schemes),
            "columns": source_columns or [],
            "schemes": scheme_file_map,
            "datasetDirectoryEnvironmentVariable": "YOJANA_DATASET_DIR",
        },
        "locations": record_offsets,
    }
    args.records_index.parent.mkdir(parents=True, exist_ok=True)
    with gzip.open(args.records_index, "wt", encoding="utf-8", newline="", compresslevel=8) as output:
        json.dump(records_payload, output, ensure_ascii=False, separators=(",", ":"))
    print(f"Wrote {len(locations):,} locations, {input_rows:,} source rows, and a 39-column row index to {args.output} and {args.records_index}")


if __name__ == "__main__":
    main()
