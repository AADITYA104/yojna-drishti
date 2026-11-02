# Test Cases

Status of every case: NOT RUN (no implementation exists). Results are recorded here only after execution, with the command and date.

| TC | Requirement | Type | Expected result (from acceptance criteria) | Last result |
|---|---|---|---|---|
| TC-GEO-01 | FR-GEO-01 | E2E+GIS | Given verified boundaries are published, when the home map loads, then one selectable polygon exists per active district row (expected 34 as of 2 Oct 2025) and a count mismatch raises a data-quality alert. | NOT RUN |
| TC-GEO-02 | FR-GEO-02 | E2E | Given the state view, when a district is clicked, then within 1.5 s the camera fits the district bounds, taluka polygons for that district are drawn, and the breadcrumb reads Gujarat > District. | NOT RUN |
| TC-GEO-03 | FR-GEO-03 | E2E | Given a district view, when a taluka is clicked, then village polygons of that taluka are loaded and selectable and the breadcrumb extends by one level. | NOT RUN |
| TC-GEO-04 | FR-GEO-04 | E2E | Given a taluka view, when a village is clicked, then the panel opens showing the village LGD code, names, parents and the five scheme cards, each in a data or an unavailable state. | NOT RUN |
| TC-GEO-05 | FR-GEO-05 | E2E | Given any level below state, when Back or a breadcrumb item is used, then the selection and camera return to that level and deeper selections are cleared. | NOT RUN |
| TC-GEO-06 | FR-GEO-06 | Integration+E2E | Given two villages share a name, when searched, then both appear with taluka and district labels, and choosing one selects the correct LGD code. | NOT RUN |
| TC-GEO-07 | FR-GEO-07 | E2E | Given a pointer device, when hovering a polygon, then outline highlight and tooltip appear within 100 ms; touch devices use tap-to-preview. | NOT RUN |
| TC-GEO-08 | FR-GEO-08 | E2E | Given a village selected, when the URL is opened in a new session, then the same unit, scheme filter and financial year are restored. | NOT RUN |
| TC-GEO-09 | FR-GEO-09 | E2E | Given metric, scheme and FY chosen, when applied, then each polygon is classed per the legend, and polygons with null are hatched grey and listed as Not available in the legend. | NOT RUN |
| TC-GEO-10 | FR-GEO-10 | E2E | Given no provider key, then the switch is hidden and a plain vector fallback is used; given a key, the switch works and attribution updates. | NOT RUN |
| TC-GEO-11 | FR-GEO-11 | E2E | Given any map view, then basemap and boundary-source attribution text with date is visible and not removable by the user. | NOT RUN |
| TC-GEO-12 | FR-GEO-12 | Integration | Given Vav-Tharad was created 2 Oct 2025, when viewing a period before that date, then its talukas appear under Banaskantha. Statistics keep a stable unit identity across hierarchy changes: the same taluka has one unit id before and after it moves district, with different parent versions. | NOT RUN |
| TC-DAT-01 | FR-DAT-01 | E2E+Integration | Given DEMO rows are shown, then a persistent DEMO DATA badge is visible on the page, in tooltips, in exports and in API meta.data_mode. | NOT RUN |
| TC-DAT-02 | FR-DAT-02 | Unit+E2E | Given a statistic with no published row, then API returns null plus reason_code and UI shows the unavailable text in the active language. | NOT RUN |
| TC-DAT-03 | FR-DAT-03 | Integration+E2E | Given any figure, when its info control is opened, then source name, URL or reference, FY, period, as-of date and verification status are shown. | NOT RUN |
| TC-DAT-04 | FR-DAT-04 | Unit+E2E | Given a scheme with cash and in-kind benefits, then the UI shows separate figures per benefit type and no aggregate rupee figure that mixes loans, subsidy, recurring cash and in-kind. | NOT RUN |
| TC-DAT-05 | FR-DAT-05 | Unit | Given eligible population is missing, then coverage is null with reason NO_ELIGIBLE_DENOMINATOR and the card says Data not available. | NOT RUN |
| TC-DAT-06 | FR-DAT-06 | Unit+Security | Given a village count below threshold, then API and UI return suppressed=true with label less-than-threshold, and totals up the hierarchy do not allow back-calculation by differencing (complementary suppression rule applied). | NOT RUN |
| TC-DAT-07 | FR-DAT-07 | Security+Integration | Given the schema and API, then no column or endpoint holds names, Aadhaar, mobile, bank or address; import rejects files containing such columns. | NOT RUN |
| TC-STA-01 | FR-STA-01 | Integration+E2E | Given published data, then each KPI shows value or unavailable, a definition tooltip, source and as-of date; KPI values equal direct SQL aggregates in tests. | NOT RUN |
| TC-STA-02 | FR-STA-02 | E2E | Given a selected FY, then each chart renders from API data, has a text alternative, and omits districts with null rather than plotting zero. | NOT RUN |
| TC-STA-03 | FR-STA-03 | E2E | Given FY changed, then all widgets and the map refetch with the same parameters and the URL updates. | NOT RUN |
| TC-DIS-01 | FR-DIS-01 | Integration+E2E | Given a district selected, then all listed blocks render or show unavailable, and village count equals count of active child villages. | NOT RUN |
| TC-TAL-01 | FR-TAL-01 | E2E | Given a taluka selected, then the village table is sortable by each metric and nulls sort last. | NOT RUN |
| TC-VIL-01 | FR-VIL-01 | E2E | Given a village selected, then exactly the five approved schemes appear as cards, each with beneficiaries, application status, benefit type amounts or in-kind units, or an unavailable state. | NOT RUN |
| TC-VIL-02 | FR-VIL-02 | Unit+E2E | Given incomparable data, then the comparison is hidden with a reason message. | NOT RUN |
| TC-SCH-01 | FR-SCH-01 | E2E | Given a scheme, then every field shows source and verified date; fields lacking an official source show Not yet verified. | NOT RUN |
| TC-SCH-02 | FR-SCH-02 | Integration | Given a benefit amount changed on a date, then both versions are viewable and a period uses the matching version. | NOT RUN |
| TC-COV-01 | FR-COV-01 | Unit+E2E | Given no verified denominator, then the module lists the unit as Not computable with reason; total population is never used as denominator. | NOT RUN |
| TC-FIN-01 | FR-FIN-01 | E2E | Given data, then each measure has its own series, label, definition and source. | NOT RUN |
| TC-CMP-01 | FR-CMP-01 | E2E | Given two units with incomparable bases, then a warning is shown and no rank is produced. | NOT RUN |
| TC-EXP-01 | FR-EXP-01 | Integration | Given an export of DEMO data, then every file contains a visible DEMO DATA marker. | NOT RUN |
| TC-I18N-01 | FR-I18N-01 | Unit+E2E | Given the language switched, then all static text, chart labels and tooltips change, with no untranslated keys in either catalog (checked by test). | NOT RUN |
| TC-ADM-01 | FR-ADM-01 | Security+Integration | Given a user without permission, when calling an admin endpoint directly, then 403 FORBIDDEN is returned and an audit entry is written; UI hiding alone is never relied on. | NOT RUN |
| TC-ADM-02 | FR-ADM-02 | Integration | Given a file with invalid LGD codes, then the batch is REJECTED or PARTIAL per policy with a downloadable error report and nothing is published. | NOT RUN |
| TC-ADM-03 | FR-ADM-03 | Integration | Given a duplicate key, then it is flagged and blocks publish until resolved. | NOT RUN |
| TC-ADM-04 | FR-ADM-04 | Integration | Given the same user who uploaded a batch, when approving it, then the action is refused. Exception: when SOLO_OWNER_MODE=true in a non-production environment and the batch data_mode is DEMO, a Super Administrator may approve their own upload; the action is audited with flag solo_owner=true. In production and for VERIFIED data the refusal always applies. | NOT RUN |
| TC-ADM-05 | FR-ADM-05 | Integration | Given a published batch is rolled back, then previous published rows return and the rollback is audited. | NOT RUN |
| TC-ADM-06 | FR-ADM-06 | Security+Integration | Given any admin mutation, then exactly one audit row exists; no endpoint can update or delete audit rows. | NOT RUN |
| TC-ADM-07 | FR-ADM-07 | E2E | Given a scheme edit, then a new scheme_versions row is created, not an in-place overwrite of history. | NOT RUN |
| TC-ADM-08 | FR-ADM-08 | Integration+GIS | Given a reconciliation run, then a report lists count mismatches, unmatched codes and orphan polygons. | NOT RUN |
| TC-NPERF-01 | NFR-PERF-01 | Performance | Given the pilot dataset, then measured values are recorded in performance.md and each budget passes or is logged as a risk. | NOT RUN |
| TC-NSEC-01 | NFR-SEC-01 | Security | Given the security test suite, then no critical finding remains open and dependency audit has no unresolved high or critical issue without a documented exception. | NOT RUN |
| TC-NA11Y-01 | NFR-A11Y-01 | Accessibility | Given automated and manual checks, then no AA failure is open for core journeys. | NOT RUN |
| TC-NERR-01 | NFR-ERR-01 | Integration | Given a forced server error, then the response matches the contract and contains no internals. | NOT RUN |
| TC-NOBS-01 | NFR-OBS-01 | Integration | Given a request, then logs for it share one requestId across layers. | NOT RUN |
| TC-NDR-01 | NFR-DR-01 | Operational | Given a restore drill, then the recorded restore succeeds and row counts match. | NOT RUN |
| TC-NMNT-01 | NFR-MNT-01 | Static | Given the lint config, then duplicate-code and max-file-size rules run in CI and violations fail the build. | NOT RUN |
| TC-NADV-01 | NFR-ADV-01 | Static | Given the production build, then no ad scripts are present (checked by test). | NOT RUN |
| TC-GEO-13 | FR-GEO-13 | E2E | Given a taluka with zero child polygons, when selected, then the panel shows unit statistics, a message naming the reason (urban unit or boundary not loaded) and a child list if rows exist. | NOT RUN |
| TC-GEO-14 | FR-GEO-14 | Integration+E2E | Given village rows without geometry, then the taluka table lists them, selecting one opens its panel, and the map shows no polygon for it. | NOT RUN |
| TC-GEO-15 | FR-GEO-15 | E2E+Manual | Given Gujarati names with conjunct consonants, then a visual check at three zoom levels confirms correct shaping; label collision is handled by zoom thresholds. | NOT RUN |
| TC-DAT-08 | FR-DAT-08 | Unit+E2E | Given only Bhavnagar data is loaded, then state-level KPIs display the covered-unit count and a Partial coverage label; unit-count KPIs show loaded and expected counts. | NOT RUN |
| TC-SCH-03 | FR-SCH-03 | E2E | Given a target group selected, then only schemes tagged with it are listed; a group with no scheme shows an explicit none-in-scope message. | NOT RUN |
| TC-UX-01 | FR-UX-01 | E2E | Given any public page, then the shell is present; each layer toggle changes map layers and the state is kept in the URL; keyboard operable. | NOT RUN |
| TC-UX-02 | FR-UX-02 | E2E | Given a range chosen, then all widgets refetch with the same from and to; unavailable granularity is disabled with a reason. | NOT RUN |
| TC-UX-03 | FR-UX-03 | E2E | Given at least 3 periods, then play, pause and step work and the map shows only data for the current step with the period label. | NOT RUN |
| TC-UX-04 | FR-UX-04 | E2E | Given a query matching a scheme and a village, then both groups appear and each result navigates correctly. | NOT RUN |
| TC-UX-05 | FR-UX-05 | E2E | Given a missing route, a forbidden route and a forced error, then each shows its dedicated bilingual page with requestId where relevant. | NOT RUN |
| TC-UX-06 | FR-UX-06 | Manual | Given print preview, then navigation is hidden and badge, sources and date appear on every page. | NOT RUN |
| TC-UX-07 | FR-UX-07 | Integration | Given a submitted issue, then it appears in the admin queue with unit, metric, period and requestId; rate limited. | NOT RUN |
| TC-LEG-01 | FR-LEG-01 | Static+Manual | Given the footer on every page, then a link to the disclaimer exists; a repository scan finds no emblem assets without an authorisation record. | NOT RUN |
| TC-ADM-09 | FR-ADM-09 | Integration | Given a census-keyed file, then each row resolves through the crosswalk; unmatched rows appear in the error report and nothing is name-joined silently. | NOT RUN |

## Cross-cutting edge-case tests (metrics module, TASK-090)
| TC | Case | Expected |
|---|---|---|
| TC-M-01 | approval_rate with approved=0, rejected=0 | null, reason NO_DECIDED_APPLICATIONS |
| TC-M-02 | approval_rate with approved=5, rejected=5 | 50.0 |
| TC-M-03 | pending_rate with received=0 | null, reason NO_APPLICATIONS |
| TC-M-04 | pending greater than received (data error) | null, reason INCONSISTENT_COUNTS, DQ alert |
| TC-M-05 | coverage with eligible=0 | null, reason NO_ELIGIBLE_DENOMINATOR |
| TC-M-06 | coverage with active greater than eligible | value returned and flagged OVER_100 for review, never clamped silently |
| TC-M-07 | average_assistance with unique_paid=0 | null, reason NO_PAID_BENEFICIARIES |
| TC-M-08 | disbursement_rate where sanctioned is null | null, reason NO_SANCTIONED_AMOUNT |
| TC-M-09 | yoy_growth with previous=0 | null, reason NO_PREVIOUS_BASE |
| TC-M-10 | yoy across different scheme versions | warning VERSION_CHANGED |
| TC-M-11 | suppression of count=3 with threshold 10 | suppressed=true, label shown, differencing blocked by complementary suppression |
| TC-M-12 | rate across mismatched periods | null, reason PERIOD_MISMATCH |
## Data-quality tests (TASK-091/092)
| TC | Case | Expected |
|---|---|---|
| TC-D-01 | duplicate village LGD code in import | row rejected |
| TC-D-02 | village whose parent taluka belongs to another district | batch REJECTED, HIERARCHY_MISMATCH |
| TC-D-03 | boundary self-intersection | geometry flagged invalid, not published |
| TC-D-04 | village polygon outside taluka polygon beyond tolerance | flagged CONTAINMENT_FAIL |
| TC-D-05 | file containing columns aadhaar, mobile, bank_account, beneficiary_name | batch REJECTED FORBIDDEN_COLUMN |
| TC-D-06 | same file uploaded twice (same sha256) | second batch refused DUPLICATE_BATCH |
| TC-D-07 | financial year outside allowed range | row rejected INVALID_FY |
| TC-D-08 | negative amounts | row rejected |
