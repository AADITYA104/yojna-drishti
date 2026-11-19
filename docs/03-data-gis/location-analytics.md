# Location analytics dataset

The map explorer uses the supplied Gujarat 10 Schemes dataset to show a **synthetic demonstration sample** for an inhabited village or urban settlement. It is not a government data feed and does not describe real people, beneficiaries, scheme availability, applications, payments, or services.

## Build the aggregate index

Run the builder against the `Gujarat_10_Schemes_Demo_Dataset` directory:

```powershell
python scripts/build_location_analytics.py --dataset-dir "C:\path\to\Gujarat_10_Schemes_Demo_Dataset"
```

It writes two artifacts:

- `data/processed/location-analytics.json.gz`: location and scheme aggregates used by the dashboard charts.
- `data/processed/location-record-index.json.gz`: byte offsets for the original 39-column CSV rows, grouped by exact location code and scheme ID. The index is small; the source CSVs are not copied into the project.

The row-detail API reads only the selected map location's source blocks from the supplied dataset folder. Set `YOJANA_DATASET_DIR` to the extracted `Gujarat_10_Schemes_Demo_Dataset` folder before starting the app. The map dashboard's expandable table shows the source rows and all 39 source columns, with 15 rows per scheme and paging. Empty source cells remain empty markers in the table; values are not inferred. Every displayed name, amount, status, record ID, and note is synthetic demo content.

The location and row-detail API routes include their compressed indexes in production output tracing. The `/api/v1/analytics/area` route aggregates the same exact location index by district or taluka code; its counts remain synthetic sample rows and are never presented as official scheme operations. The row CSVs remain at the configured dataset folder and must be available to the server at runtime.

For the historical Government of India village baseline and merged Survey of India/NWIC boundaries, see [official-village-profiles.md](official-village-profiles.md). These historical values are kept separate from the synthetic scheme samples.

## Location matching and interpretation

The map sends the exact village/settlement `Location_Code`. The builder indexes inhabited rows from `Location_Master.csv` and aggregates the ten scheme files by `Location_Code` and `Scheme_ID`. It also checks that each source CSV has the same 39-column schema, exactly 15 contiguous rows per inhabited location, matching scheme IDs, and no missing/orphan location blocks before it writes the row-offset index. Forest and uninhabited rows are not included; if a map location has no sample, the dashboard says so without estimating values.

The official historic-profile join matches `Location_Code` to Survey of India `vlcode` exactly. It matched 18,110/18,818 inhabited locations in the downloaded NWIC resource; other locations remain unfilled. Boundary geometry has a different match status from Census attributes and unmatched geometry remains explicitly labeled as the prior reference layer.

Counts are labelled as synthetic sample records or demo-rule/status labels. No beneficiary totals, percentages, coverage rates, or cross-scheme financial sums are calculated. The scheme filter limits every chart and the row table to one scheme when selected. The dataset reference date and demo-only disclosure are shown in the dashboard. The add-on availability matrix marks all 192,010 scheme-location combinations `NOT_VERIFIED`; synthetic row presence never means official scheme availability. The add-on geographic templates contain no coordinates, and several proper-name translations remain pending review.
