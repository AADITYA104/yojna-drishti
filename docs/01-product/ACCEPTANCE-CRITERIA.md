# Acceptance Criteria

Each criterion is testable (Given/When/Then) and has exactly one verifying test case in test-cases.md.

## FR-GEO-01 - State map renders every current district polygon from the verified boundary data...
- **Criterion:** Given verified boundaries are published, when the home map loads, then one selectable polygon exists per active district row (expected 34 as of 2 Oct 2025) and a count mismatch raises a data-quality alert.
- **Verified by:** TC-GEO-01 (E2E+GIS)

## FR-GEO-02 - Selecting a district fits the camera to its bounds and reveals its taluka bounda...
- **Criterion:** Given the state view, when a district is clicked, then within 1.5 s the camera fits the district bounds, taluka polygons for that district are drawn, and the breadcrumb reads Gujarat > District.
- **Verified by:** TC-GEO-02 (E2E)

## FR-GEO-03 - Selecting a taluka fits the camera and makes its villages selectable.
- **Criterion:** Given a district view, when a taluka is clicked, then village polygons of that taluka are loaded and selectable and the breadcrumb extends by one level.
- **Verified by:** TC-GEO-03 (E2E)

## FR-GEO-04 - Selecting a village opens the Village Intelligence panel for that LGD code.
- **Criterion:** Given a taluka view, when a village is clicked, then the panel opens showing the village LGD code, names, parents and the five scheme cards, each in a data or an unavailable state.
- **Verified by:** TC-GEO-04 (E2E)

## FR-GEO-05 - Backward navigation Village > Taluka > District > State via breadcrumb and Back ...
- **Criterion:** Given any level below state, when Back or a breadcrumb item is used, then the selection and camera return to that level and deeper selections are cleared.
- **Verified by:** TC-GEO-05 (E2E)

## FR-GEO-06 - Search by Gujarati or English name resolves to LGD-coded units and disambiguates...
- **Criterion:** Given two villages share a name, when searched, then both appear with taluka and district labels, and choosing one selects the correct LGD code.
- **Verified by:** TC-GEO-06 (Integration+E2E)

## FR-GEO-07 - Hover highlights the boundary and shows a tooltip with name and the active metri...
- **Criterion:** Given a pointer device, when hovering a polygon, then outline highlight and tooltip appear within 100 ms; touch devices use tap-to-preview.
- **Verified by:** TC-GEO-07 (E2E)

## FR-GEO-08 - Map selection, level, scheme and financial year are encoded in the URL so views ...
- **Criterion:** Given a village selected, when the URL is opened in a new session, then the same unit, scheme filter and financial year are restored.
- **Verified by:** TC-GEO-08 (E2E)

## FR-GEO-09 - Choropleth colouring by chosen metric, scheme and financial year with legend; nu...
- **Criterion:** Given metric, scheme and FY chosen, when applied, then each polygon is classed per the legend, and polygons with null are hatched grey and listed as Not available in the legend.
- **Verified by:** TC-GEO-09 (E2E)

## FR-GEO-10 - Optional satellite or cartographic basemap switch, available only when a license...
- **Criterion:** Given no provider key, then the switch is hidden and a plain vector fallback is used; given a key, the switch works and attribution updates.
- **Verified by:** TC-GEO-10 (E2E)

## FR-GEO-11 - Map attribution and boundary-source attribution are always visible.
- **Criterion:** Given any map view, then basemap and boundary-source attribution text with date is visible and not removable by the user.
- **Verified by:** TC-GEO-11 (E2E)

## FR-GEO-12 - Hierarchy and boundaries are time-aware: units have valid_from/valid_to and the ...
- **Criterion:** Given Vav-Tharad was created 2 Oct 2025, when viewing a period before that date, then its talukas appear under Banaskantha. Statistics keep a stable unit identity across hierarchy changes: the same taluka has one unit id before and after it moves district, with different parent versions.
- **Verified by:** TC-GEO-12 (Integration)

## FR-DAT-01 - Every screen, API response and export shows its data mode (VERIFIED, DEMO or ARC...
- **Criterion:** Given DEMO rows are shown, then a persistent DEMO DATA badge is visible on the page, in tooltips, in exports and in API meta.data_mode.
- **Verified by:** TC-DAT-01 (E2E+Integration)

## FR-DAT-02 - Unavailable values display Official data not available and are returned as null ...
- **Criterion:** Given a statistic with no published row, then API returns null plus reason_code and UI shows the unavailable text in the active language.
- **Verified by:** TC-DAT-02 (Unit+E2E)

## FR-DAT-03 - Every published statistic carries source_id, financial_year, reporting_period, d...
- **Criterion:** Given any figure, when its info control is opened, then source name, URL or reference, FY, period, as-of date and verification status are shown.
- **Verified by:** TC-DAT-03 (Integration+E2E)

## FR-DAT-04 - Allocated, sanctioned, disbursed amounts and in-kind units are separate fields a...
- **Criterion:** Given a scheme with cash and in-kind benefits, then the UI shows separate figures per benefit type and no aggregate rupee figure that mixes loans, subsidy, recurring cash and in-kind.
- **Verified by:** TC-DAT-04 (Unit+E2E)

## FR-DAT-05 - Rates are computed only when numerator and denominator exist with matching geogr...
- **Criterion:** Given eligible population is missing, then coverage is null with reason NO_ELIGIBLE_DENOMINATOR and the card says Data not available.
- **Verified by:** TC-DAT-05 (Unit)

## FR-DAT-06 - Small-number suppression: counts below the configured threshold are shown as a r...
- **Criterion:** Given a village count below threshold, then API and UI return suppressed=true with label less-than-threshold, and totals up the hierarchy do not allow back-calculation by differencing (complementary suppression rule applied).
- **Verified by:** TC-DAT-06 (Unit+Security)

## FR-DAT-07 - No individual-level beneficiary data is stored or exposed; no public individual ...
- **Criterion:** Given the schema and API, then no column or endpoint holds names, Aadhaar, mobile, bank or address; import rejects files containing such columns.
- **Verified by:** TC-DAT-07 (Security+Integration)

## FR-STA-01 - State Overview shows KPIs: administrative unit counts, active verified schemes, ...
- **Criterion:** Given published data, then each KPI shows value or unavailable, a definition tooltip, source and as-of date; KPI values equal direct SQL aggregates in tests.
- **Verified by:** TC-STA-01 (Integration+E2E)

## FR-STA-02 - State charts: district beneficiary comparison, scheme-wise financial distributio...
- **Criterion:** Given a selected FY, then each chart renders from API data, has a text alternative, and omits districts with null rather than plotting zero.
- **Verified by:** TC-STA-02 (E2E)

## FR-STA-03 - Financial year and reporting-period filters apply consistently to all widgets.
- **Criterion:** Given FY changed, then all widgets and the map refetch with the same parameters and the URL updates.
- **Verified by:** TC-STA-03 (E2E)

## FR-DIS-01 - District Intelligence panel: profile, taluka list, village count, population wit...
- **Criterion:** Given a district selected, then all listed blocks render or show unavailable, and village count equals count of active child villages.
- **Verified by:** TC-DIS-01 (Integration+E2E)

## FR-TAL-01 - Taluka Intelligence panel: parent, code, village list, scheme distribution, bene...
- **Criterion:** Given a taluka selected, then the village table is sortable by each metric and nulls sort last.
- **Verified by:** TC-TAL-01 (E2E)

## FR-VIL-01 - Village Intelligence panel: Gujarati and English names, LGD code, district, talu...
- **Criterion:** Given a village selected, then exactly the five approved schemes appear as cards, each with beneficiaries, application status, benefit type amounts or in-kind units, or an unavailable state.
- **Verified by:** TC-VIL-01 (E2E)

## FR-VIL-02 - Village vs taluka-average comparison shown only for metrics that are comparable ...
- **Criterion:** Given incomparable data, then the comparison is hidden with a reason message.
- **Verified by:** TC-VIL-02 (Unit+E2E)

## FR-SCH-01 - Scheme page: objectives, eligibility, benefits, documents, application route, of...
- **Criterion:** Given a scheme, then every field shows source and verified date; fields lacking an official source show Not yet verified.
- **Verified by:** TC-SCH-01 (E2E)

## FR-SCH-02 - Scheme versioning with effective dates; statistics map to the version in force f...
- **Criterion:** Given a benefit amount changed on a date, then both versions are viewable and a period uses the matching version.
- **Verified by:** TC-SCH-02 (Integration)

## FR-COV-01 - Coverage analytics (eligible, registered, approved, active, unserved, coverage %...
- **Criterion:** Given no verified denominator, then the module lists the unit as Not computable with reason; total population is never used as denominator.
- **Verified by:** TC-COV-01 (Unit+E2E)

## FR-FIN-01 - Financial Intelligence: allocated, approved, sanctioned, disbursed, remaining, i...
- **Criterion:** Given data, then each measure has its own series, label, definition and source.
- **Verified by:** TC-FIN-01 (E2E)

## FR-CMP-01 - Comparison module: district, taluka, village, scheme and financial-year comparis...
- **Criterion:** Given two units with incomparable bases, then a warning is shown and no rank is produced.
- **Verified by:** TC-CMP-01 (E2E)

## FR-EXP-01 - Export to CSV, Excel and PDF carrying data-mode badge, source, as-of date and de...
- **Criterion:** Given an export of DEMO data, then every file contains a visible DEMO DATA marker.
- **Verified by:** TC-EXP-01 (Integration)

## FR-I18N-01 - Gujarati and English UI with a language switch; Gujarati text renders with Noto ...
- **Criterion:** Given the language switched, then all static text, chart labels and tooltips change, with no untranslated keys in either catalog (checked by test).
- **Verified by:** TC-I18N-01 (Unit+E2E)

## FR-ADM-01 - Authentication and server-side RBAC for roles Public Viewer, Analyst, Data Manag...
- **Criterion:** Given a user without permission, when calling an admin endpoint directly, then 403 FORBIDDEN is returned and an audit entry is written; UI hiding alone is never relied on.
- **Verified by:** TC-ADM-01 (Security+Integration)

## FR-ADM-02 - CSV/Excel import with schema validation, LGD lookup, dry-run and row-level error...
- **Criterion:** Given a file with invalid LGD codes, then the batch is REJECTED or PARTIAL per policy with a downloadable error report and nothing is published.
- **Verified by:** TC-ADM-02 (Integration)

## FR-ADM-03 - Duplicate detection within a file and against existing published rows for the sa...
- **Criterion:** Given a duplicate key, then it is flagged and blocks publish until resolved.
- **Verified by:** TC-ADM-03 (Integration)

## FR-ADM-04 - Approval workflow: draft, in_review, published, unpublished, superseded with sep...
- **Criterion:** Given the same user who uploaded a batch, when approving it, then the action is refused. Exception: when SOLO_OWNER_MODE=true in a non-production environment and the batch data_mode is DEMO, a Super Administrator may approve their own upload; the action is audited with flag solo_owner=true. In production and for VERIFIED data the refusal always applies.
- **Verified by:** TC-ADM-04 (Integration)

## FR-ADM-05 - Data version history and batch rollback restoring the previous published state.
- **Criterion:** Given a published batch is rolled back, then previous published rows return and the rollback is audited.
- **Verified by:** TC-ADM-05 (Integration)

## FR-ADM-06 - Immutable audit log of every state-changing action with actor, entity, before/af...
- **Criterion:** Given any admin mutation, then exactly one audit row exists; no endpoint can update or delete audit rows.
- **Verified by:** TC-ADM-06 (Security+Integration)

## FR-ADM-07 - Scheme and data-source management screens.
- **Criterion:** Given a scheme edit, then a new scheme_versions row is created, not an in-place overwrite of history.
- **Verified by:** TC-ADM-07 (E2E)

## FR-ADM-08 - Master geography management and reconciliation reports (LGD vs district website ...
- **Criterion:** Given a reconciliation run, then a report lists count mismatches, unmatched codes and orphan polygons.
- **Verified by:** TC-ADM-08 (Integration+GIS)

## NFR-PERF-01 - Performance budgets: LCP <= 3.0 s (desktop, slow-4G emulation) on state view; ma...
- **Criterion:** Given the pilot dataset, then measured values are recorded in performance.md and each budget passes or is logged as a risk.
- **Verified by:** TC-NPERF-01 (Performance)

## NFR-SEC-01 - OWASP ASVS-aligned baseline: parameterised SQL, output encoding, secure headers,...
- **Criterion:** Given the security test suite, then no critical finding remains open and dependency audit has no unresolved high or critical issue without a documented exception.
- **Verified by:** TC-NSEC-01 (Security)

## NFR-A11Y-01 - WCAG 2.2 AA target: keyboard operability including map controls, contrast, label...
- **Criterion:** Given automated and manual checks, then no AA failure is open for core journeys.
- **Verified by:** TC-NA11Y-01 (Accessibility)

## NFR-ERR-01 - Single error contract { code, message, requestId, details? }, safe messages, req...
- **Criterion:** Given a forced server error, then the response matches the contract and contains no internals.
- **Verified by:** TC-NERR-01 (Integration)

## NFR-OBS-01 - Structured logs with request IDs, health endpoint, error monitoring hook, import...
- **Criterion:** Given a request, then logs for it share one requestId across layers.
- **Verified by:** TC-NOBS-01 (Integration)

## NFR-DR-01 - Backups with tested restore; provisional RPO 24 h, RTO 4 h.
- **Criterion:** Given a restore drill, then the recorded restore succeeds and row counts match.
- **Verified by:** TC-NDR-01 (Operational)

## NFR-MNT-01 - Low-LOC rules enforced by lint and review: single source of truth for constants,...
- **Criterion:** Given the lint config, then duplicate-code and max-file-size rules run in CI and violations fail the build.
- **Verified by:** TC-NMNT-01 (Static)

## NFR-ADV-01 - No advertising in the web dashboard; AdMob documented as NOT APPLICABLE.
- **Criterion:** Given the production build, then no ad scripts are present (checked by test).
- **Verified by:** TC-NADV-01 (Static)

## FR-GEO-13 - A unit with no child polygons (for example an urban taluka without revenue villa...
- **Criterion:** Given a taluka with zero child polygons, when selected, then the panel shows unit statistics, a message naming the reason (urban unit or boundary not loaded) and a child list if rows exist.
- **Verified by:** TC-GEO-13 (E2E)

## FR-GEO-14 - Villages that exist in the master list but have no boundary polygon appear in ta...
- **Criterion:** Given village rows without geometry, then the taluka table lists them, selecting one opens its panel, and the map shows no polygon for it.
- **Verified by:** TC-GEO-14 (Integration+E2E)

## FR-GEO-15 - Gujarati and English unit names render correctly on the map; if the map engine c...
- **Criterion:** Given Gujarati names with conjunct consonants, then a visual check at three zoom levels confirms correct shaping; label collision is handled by zoom thresholds.
- **Verified by:** TC-GEO-15 (E2E+Manual)

## FR-DAT-08 - Geographic completeness indicator: every aggregate and KPI states how much geogr...
- **Criterion:** Given only Bhavnagar data is loaded, then state-level KPIs display the covered-unit count and a Partial coverage label; unit-count KPIs show loaded and expected counts.
- **Verified by:** TC-DAT-08 (Unit+E2E)

## FR-SCH-03 - Target-group filter on scheme list and map: girl child, married women, widows, p...
- **Criterion:** Given a target group selected, then only schemes tagged with it are listed; a group with no scheme shows an explicit none-in-scope message.
- **Verified by:** TC-SCH-03 (E2E)

## FR-UX-01 - Application shell: header, collapsible left navigation sidebar and a map layer p...
- **Criterion:** Given any public page, then the shell is present; each layer toggle changes map layers and the state is kept in the URL; keyboard operable.
- **Verified by:** TC-UX-01 (E2E)

## FR-UX-02 - Reporting date range and period granularity (month, quarter, financial year) sel...
- **Criterion:** Given a range chosen, then all widgets refetch with the same from and to; unavailable granularity is disabled with a reason.
- **Verified by:** TC-UX-02 (E2E)

## FR-UX-03 - Optional time playback slider stepping through reporting periods and animating t...
- **Criterion:** Given at least 3 periods, then play, pause and step work and the map shows only data for the current step with the period label.
- **Verified by:** TC-UX-03 (E2E)

## FR-UX-04 - Global search covers geography, schemes and help or methodology pages with group...
- **Criterion:** Given a query matching a scheme and a village, then both groups appear and each result navigates correctly.
- **Verified by:** TC-UX-04 (E2E)

## FR-UX-05 - Landing/entry page, login page, 403, 404, 500 and maintenance pages, favicon and...
- **Criterion:** Given a missing route, a forbidden route and a forced error, then each shows its dedicated bilingual page with requestId where relevant.
- **Verified by:** TC-UX-05 (E2E)

## FR-UX-06 - Print-ready stylesheet for panels and reports with data mode badge, sources and ...
- **Criterion:** Given print preview, then navigation is hidden and badge, sources and date appear on every page.
- **Verified by:** TC-UX-06 (Manual)

## FR-UX-07 - Report a data issue control on figures creates an admin queue item without colle...
- **Criterion:** Given a submitted issue, then it appears in the admin queue with unit, metric, period and requestId; rate limited.
- **Verified by:** TC-UX-07 (Integration)

## FR-LEG-01 - Disclaimer, terms of use and attribution page states who operates the platform a...
- **Criterion:** Given the footer on every page, then a link to the disclaimer exists; a repository scan finds no emblem assets without an authorisation record.
- **Verified by:** TC-LEG-01 (Static+Manual)

## FR-ADM-09 - Census-code to LGD-code crosswalk is stored and used when importing population o...
- **Criterion:** Given a census-keyed file, then each row resolves through the crosswalk; unmatched rows appear in the error report and nothing is name-joined silently.
- **Verified by:** TC-ADM-09 (Integration)

