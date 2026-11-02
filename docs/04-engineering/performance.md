# Performance Strategy (PERFORMANCE_STRATEGY)

## Budgets (provisional; to be measured in TASK-095)
| Metric | Budget |
|---|---|
| LCP, state view, desktop, slow-4G emulation | <= 3.0 s |
| Initial JS (excluding map library, lazy-loaded) | <= 250 KB gzip (to be revisited) |
| Boundary payload: state (districts, geom_low) | <= 400 KB gzip |
| Boundary payload: district (talukas, geom_mid) | <= 600 KB gzip |
| Boundary payload: taluka (villages, full) | <= 1.5 MB gzip |
| Stats API p95 (pilot data) | <= 500 ms |
| Map interaction (hover, select response) | <= 200 ms |
| Choropleth refetch after filter change | <= 800 ms |
Budgets are measured, recorded here with date and commit, and failures logged to risk-register.md.

## Techniques
- Lazy-load MapLibre, ECharts and admin bundles.
- Boundary simplification per zoom level; tolerances recorded in ADR-0004.
- Per-parent boundary fetch, cached by (parent, version) with immutable headers.
- Geometry separate from statistics so boundaries cache independently.
- SQL aggregation in views; indexes per data-model.md; EXPLAIN reviewed for each endpoint.
- Pagination caps; export row cap.
- Choropleth classes computed server-side.
- Optional upgrade: vector tiles (ST_AsMVT or pre-built PMTiles) if village payload budget fails.
- Avoid rendering all villages statewide; render only the selected taluka's villages plus lightweight markers if needed.
- Charts render from aggregated series, not raw rows.

## Measurement plan
Lighthouse CI on state, district and village views; Playwright timing for drill-down; pg_stat_statements for slow queries; synthetic dataset scaled to statewide size (about 18,000 villages assumed; verify) for load tests.

## Known risk
Full-fidelity village polygons may exceed payload budgets; mitigation in ADR-0004.
