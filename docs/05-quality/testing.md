# Testing Strategy (TESTING_STRATEGY)

Principle: a test counts only after it has been executed and its result recorded. No test is deleted or weakened to pass.

| Layer | Scope | Tooling (provisional) | Gate |
|---|---|---|---|
| Unit | Metrics, suppression, validators, formatters, role guard, error mapping | Vitest | All pass; metrics module branch coverage target 100 percent of listed edge cases (TC-M-*) |
| Integration | DB constraints, migrations up/down, repositories, API contracts, import (success, duplicates, bad codes, idempotent rerun), auth, audit grants | Vitest + PostGIS test container | All pass in CI |
| GIS | ST_IsValid, containment, overlap, SRID, bbox, selection by lgd, simplification size | SQL assertions via test runner | All pass; report archived |
| Data quality | DQ-01 to DQ-12, lineage trace of 20 samples, DEMO leakage | Test runner + scheduled job | 0 leaks |
| End-to-end | Gujarat > Bhavnagar > taluka > village > panel > back; search; deep link; language switch; admin import, approve, publish, rollback; role restrictions | Playwright | Core journeys pass on Chromium; Firefox and WebKit smoke |
| Security | Authorisation bypass, SQLi/XSS payloads, upload attacks, headers, rate limits, secret scan, dependency audit | Test suite + audit tools | No open critical or high without exception |
| Accessibility | Keyboard, contrast, semantics, reduced motion, screen-reader spot checks | axe in Playwright + manual | No AA failure on core journeys |
| Performance | Budgets in performance.md | Lighthouse CI, Playwright timing, EXPLAIN | Budgets pass or risk logged |
| Visual regression (optional) | Panels, legend | Playwright snapshots | Reviewed diffs |
| Operational | Backup restore, health checks, rollback | Manual drill | Recorded |

## Test data
Unit: inline. Integration: deterministic fixtures. DEMO seed for E2E. No real government statistics in fixtures unless licence allows; never personal data.

## Environments
Local (container DB), CI (service container), staging (smoke only).

## Traceability
Every requirement has a TC in test-cases.md; results recorded there with command, commit, date. REQUIREMENTS-TRACEABILITY.md Evidence column links results.

## Exit criteria for release
All P0 requirements verified; no failing or skipped tests without a written reason; production-readiness checklist PASS.

## Cross-browser and device matrix (v0.2.0, TASK-097)
| Class | Targets |
|---|---|
| Desktop browsers | Current and previous major of Chrome, Edge, Firefox, Safari |
| Mobile | Android mid and low-end device (Chrome), iPhone Safari; 360 px and 390 px widths |
| Network | Fast, slow-4G, offline fallback message |
| Text | Gujarati rendering with and without installed Gujarati system fonts (web font fallback), 200 percent zoom |
| Input | Mouse, touch, keyboard only, screen reader spot check |
| Display | Single light theme, forced-colors mode, print preview |
| WebGL | Device without WebGL: fallback to list and table view with an explanatory message |
Each run is recorded in this file with date and results.

