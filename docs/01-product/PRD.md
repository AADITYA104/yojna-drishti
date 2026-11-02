# PRD - YOJANA DRISHTI

Version 0.1.0 | Date 2026-10-31 | Status: DRAFT for user approval

## 1. Purpose
YOJANA DRISHTI is a read-mostly analytics platform that lets a user navigate Gujarat's administrative hierarchy on a real map (State > District > Taluka > Village) and see, for a defined set of state government schemes, how many people are covered, application status, and financial assistance, using aggregate statistics only.

Tagline: Mapping Government Schemes. Measuring Ground-Level Impact.

## 2. Problem
Scheme monitoring data sits in department MIS systems and PDF reports. Officers cannot easily see where a scheme has reached, where applications stall, or whether coverage differs between talukas and villages. Citizens cannot see what is available locally.

## 3. Goals
1. Accurate, drillable administrative map keyed by LGD codes.
2. Trustworthy aggregates with visible provenance (source, period, as-of date, verification status).
3. Clear separation of real, demo and archived data.
4. Practical analytics that answer: where is reach low, where are applications pending, how much money moved.
5. Maintainable, low-LOC codebase.

## 4. Non-goals (Version 1)
- Individual-level beneficiary lookup or any personal data.
- Citizen application submission or status tracking for individuals.
- Native mobile app (AdMob therefore NOT APPLICABLE).
- Predictive or ML scoring of districts.
- Statewide village-level coverage on day one (pilot is Bhavnagar).
- Scraping any source without permission.

<a id="personas"></a>
## 5. Personas
| Persona | Description | Main needs |
|---|---|---|
| Public Viewer | Citizen, journalist, researcher | See schemes and area-level reach, understand eligibility, read sources |
| Analyst / Government Officer | District or state staff | Compare areas, find gaps, export reports |
| Data Manager | Department data staff | Upload, validate, reconcile datasets |
| Department Reviewer | Senior officer | Approve or reject datasets before publication |
| Super Administrator | Platform owner | Users, roles, sources, audit, recovery |

## 6. Scope summary
Pilot: Gujarat state map + Bhavnagar full drill-down + five candidate schemes. See SCOPE.md.

## 7. The five candidate schemes
Candidate, not verified active: Vahali Dikri Yojana; Ganga Swarupa Arthik Sahay Yojana; Mahila Swavlamban Yojana; Mukhyamantri Matrushakti Yojana; Ganga Swarupa Punarlagna Arthik Sahay Yojana. Status and facts live only in scheme-research.md. The product must work when a scheme is later renamed, merged or discontinued (scheme versions and status field).

## 8. User journeys
1. Citizen: open map > search own village > read village panel > open a scheme page > follow official link.
2. Officer: state overview > filter FY > choropleth by coverage > open low district > taluka table > village comparison > export.
3. Data Manager: upload CSV (dry run) > fix errors > submit for review.
4. Reviewer: open batch > compare with previous > approve or reject with reason.
5. Super Admin: add user > assign role > review audit log.

## 9. Non-functional requirements
Performance, security, accessibility, error handling, observability, recovery and maintainability requirements are in the catalogue below (NFR-*) and in their specialist documents.

## 10. Data truth principles
1. Three modes: VERIFIED, DEMO, ARCHIVED, visible everywhere.
2. Null is shown as unavailable, never zero.
3. Provenance on every statistic.
4. No rate without a valid denominator.
5. No personal data.

## 11. Success measures (provisional)
- 100 percent of displayed statistics carry provenance (automated check).
- 0 DEMO rows reachable without a badge (automated check).
- Pilot geography reconciliation report with 0 unexplained mismatches.
- All P0 requirements verified with recorded evidence before release.

## 12. Assumptions and dependencies
See open-questions.md and risk-register.md. Critical: availability of village boundaries (R-01), beneficiary aggregates (R-02), licence terms (R-03).

## 13. Known limitations
Real village-level scheme statistics may not be obtainable without department authorisation. Until then, the platform runs real geography with DEMO statistics, clearly labelled, or shows unavailable.

<a id="requirement-catalogue"></a>
## Requirement catalogue (generated from one source; IDs are stable)

| ID | Priority | Module | Requirement |
|---|---|---|---|
| FR-GEO-01 | P0 | GIS Map | State map renders every current district polygon from the verified boundary dataset; the count shown comes from the database, never a hard-coded number. |
| FR-GEO-02 | P0 | GIS Map | Selecting a district fits the camera to its bounds and reveals its taluka boundaries. |
| FR-GEO-03 | P0 | GIS Map | Selecting a taluka fits the camera and makes its villages selectable. |
| FR-GEO-04 | P0 | GIS Map | Selecting a village opens the Village Intelligence panel for that LGD code. |
| FR-GEO-05 | P0 | GIS Map | Backward navigation Village > Taluka > District > State via breadcrumb and Back control, restoring the previous camera extent. |
| FR-GEO-06 | P1 | GIS Map | Search by Gujarati or English name resolves to LGD-coded units and disambiguates duplicate village names by taluka and district. |
| FR-GEO-07 | P1 | GIS Map | Hover highlights the boundary and shows a tooltip with name and the active metric value or Not available. |
| FR-GEO-08 | P1 | GIS Map | Map selection, level, scheme and financial year are encoded in the URL so views can be shared. |
| FR-GEO-09 | P1 | GIS Map | Choropleth colouring by chosen metric, scheme and financial year with legend; null values use a distinct neutral style. |
| FR-GEO-10 | P2 | GIS Map | Optional satellite or cartographic basemap switch, available only when a licensed provider key is configured. |
| FR-GEO-11 | P0 | GIS Map | Map attribution and boundary-source attribution are always visible. |
| FR-GEO-12 | P1 | GIS Map | Hierarchy and boundaries are time-aware: units have valid_from/valid_to and the UI uses the active version unless an as-of date is chosen. |
| FR-DAT-01 | P0 | Data Truth | Every screen, API response and export shows its data mode (VERIFIED, DEMO or ARCHIVED); DEMO is visibly badged. |
| FR-DAT-02 | P0 | Data Truth | Unavailable values display Official data not available and are returned as null with a reason code; never rendered as zero. |
| FR-DAT-03 | P0 | Data Truth | Every published statistic carries source_id, financial_year, reporting_period, data_as_of, upload date and verification_status, and the UI exposes them. |
| FR-DAT-04 | P0 | Data Truth | Allocated, sanctioned, disbursed amounts and in-kind units are separate fields and are never summed across benefit types. |
| FR-DAT-05 | P0 | Data Truth | Rates are computed only when numerator and denominator exist with matching geography and period; otherwise null with reason. |
| FR-DAT-06 | P1 | Data Truth | Small-number suppression: counts below the configured threshold are shown as a range label instead of exact value. |
| FR-DAT-07 | P0 | Data Truth | No individual-level beneficiary data is stored or exposed; no public individual search exists. |
| FR-STA-01 | P0 | Dashboards | State Overview shows KPIs: administrative unit counts, active verified schemes, beneficiaries, applications (total, approved, pending, rejected), sanctioned and disbursed amounts, each with definition and source. |
| FR-STA-02 | P1 | Dashboards | State charts: district beneficiary comparison, scheme-wise financial distribution, monthly growth, approved vs pending, top and bottom districts. |
| FR-STA-03 | P1 | Dashboards | Financial year and reporting-period filters apply consistently to all widgets. |
| FR-DIS-01 | P0 | Dashboards | District Intelligence panel: profile, taluka list, village count, population with reference year, scheme-wise stats, financials, application status, coverage where valid, trend, comparison with state, source and update dates. |
| FR-TAL-01 | P0 | Dashboards | Taluka Intelligence panel: parent, code, village list, scheme distribution, beneficiary and financial stats, village comparison, pending applications where available. |
| FR-VIL-01 | P0 | Dashboards | Village Intelligence panel: Gujarati and English names, LGD code, district, taluka, Gram Panchayat, rural/urban class, population with reference year, five scheme cards, applications, financials, trend, sources, last verified date. |
| FR-VIL-02 | P1 | Dashboards | Village vs taluka-average comparison shown only for metrics that are comparable (same period, valid denominators). |
| FR-SCH-01 | P0 | Schemes | Scheme page: objectives, eligibility, benefits, documents, application route, official links, department, status, last verified date, plus district, taluka and village distribution and trends. |
| FR-SCH-02 | P1 | Schemes | Scheme versioning with effective dates; statistics map to the version in force for their period. |
| FR-COV-01 | P1 | Analytics | Coverage analytics (eligible, registered, approved, active, unserved, coverage %) only where a verified eligible-population denominator exists for matching geography and period. |
| FR-FIN-01 | P1 | Analytics | Financial Intelligence: allocated, approved, sanctioned, disbursed, remaining, in-kind, monthly spend, district allocation, kept separate. |
| FR-CMP-01 | P2 | Analytics | Comparison module: district, taluka, village, scheme and financial-year comparisons with comparability warnings. |
| FR-EXP-01 | P2 | Analytics | Export to CSV, Excel and PDF carrying data-mode badge, source, as-of date and definitions sheet. |
| FR-I18N-01 | P0 | Platform | Gujarati and English UI with a language switch; Gujarati text renders with Noto Sans Gujarati; numbers and dates are formatted by one formatter. |
| FR-ADM-01 | P0 | Admin | Authentication and server-side RBAC for roles Public Viewer, Analyst, Data Manager, Department Reviewer, Super Administrator. |
| FR-ADM-02 | P0 | Admin | CSV/Excel import with schema validation, LGD lookup, dry-run and row-level error report. |
| FR-ADM-03 | P0 | Admin | Duplicate detection within a file and against existing published rows for the same unit, scheme and period. |
| FR-ADM-04 | P0 | Admin | Approval workflow: draft, in_review, published, unpublished, superseded with separation of duties. |
| FR-ADM-05 | P0 | Admin | Data version history and batch rollback restoring the previous published state. |
| FR-ADM-06 | P0 | Admin | Immutable audit log of every state-changing action with actor, entity, before/after summary and request ID. |
| FR-ADM-07 | P1 | Admin | Scheme and data-source management screens. |
| FR-ADM-08 | P1 | Admin | Master geography management and reconciliation reports (LGD vs district website counts vs boundary file). |
| NFR-PERF-01 | P1 | Non-functional | Performance budgets: LCP <= 3.0 s (desktop, slow-4G emulation) on state view; map interaction response <= 200 ms; stats API p95 <= 500 ms on pilot dataset; GeoJSON payload per level within budgets in performance.md. |
| NFR-SEC-01 | P0 | Non-functional | OWASP ASVS-aligned baseline: parameterised SQL, output encoding, secure headers, CSRF, rate limits, upload hardening, secret hygiene. |
| NFR-A11Y-01 | P1 | Non-functional | WCAG 2.2 AA target: keyboard operability including map controls, contrast, labels, chart text alternatives, reduced motion. |
| NFR-ERR-01 | P0 | Non-functional | Single error contract { code, message, requestId, details? }, safe messages, request IDs, no stack traces to clients. |
| NFR-OBS-01 | P1 | Non-functional | Structured logs with request IDs, health endpoint, error monitoring hook, import and job logs. |
| NFR-DR-01 | P1 | Non-functional | Backups with tested restore; provisional RPO 24 h, RTO 4 h. |
| NFR-MNT-01 | P1 | Non-functional | Low-LOC rules enforced by lint and review: single source of truth for constants, metrics, errors, roles, messages; no duplicate components. |
| NFR-ADV-01 | P0 | Non-functional | No advertising in the web dashboard; AdMob documented as NOT APPLICABLE. |
| FR-GEO-13 | P0 | GIS Map | A unit with no child polygons (for example an urban taluka without revenue villages, or a taluka whose village boundaries are not loaded) shows an explanatory state with its own statistics and a child list; the drill-down never dead-ends on a blank map. |
| FR-GEO-14 | P1 | GIS Map | Villages that exist in the master list but have no boundary polygon appear in taluka lists with a Boundary unavailable marker and remain selectable from the list. |
| FR-GEO-15 | P0 | GIS Map | Gujarati and English unit names render correctly on the map; if the map engine cannot shape Gujarati conjuncts correctly, labels are drawn as HTML overlays instead. |
| FR-DAT-08 | P0 | Data Truth | Geographic completeness indicator: every aggregate and KPI states how much geography it covers (for example 1 of 34 districts loaded; 412 of 692 villages reporting) so partial loads are never read as statewide totals. |
| FR-SCH-03 | P1 | Schemes | Target-group filter on scheme list and map: girl child, married women, widows, pregnant and lactating mothers, women entrepreneurs, working women. |
| FR-UX-01 | P0 | Platform | Application shell: header, collapsible left navigation sidebar and a map layer panel (boundaries, labels, choropleth, villages, basemap) with in-map legend, last-updated and source indicators. |
| FR-UX-02 | P1 | Platform | Reporting date range and period granularity (month, quarter, financial year) selectors apply consistently to map, KPIs and charts. |
| FR-UX-03 | P2 | Platform | Optional time playback slider stepping through reporting periods and animating the choropleth; disabled when fewer than 3 periods exist. |
| FR-UX-04 | P1 | Platform | Global search covers geography, schemes and help or methodology pages with grouped results. |
| FR-UX-05 | P0 | Platform | Landing/entry page, login page, 403, 404, 500 and maintenance pages, favicon and page metadata exist and are bilingual. |
| FR-UX-06 | P2 | Platform | Print-ready stylesheet for panels and reports with data mode badge, sources and as-of date. |
| FR-UX-07 | P2 | Platform | Report a data issue control on figures creates an admin queue item without collecting personal data beyond an optional contact the user chooses to type. |
| FR-LEG-01 | P0 | Platform | Disclaimer, terms of use and attribution page states who operates the platform and whether it is an official government site; no State Emblem or government logo is used unless written authorisation exists. |
| FR-ADM-09 | P0 | Admin | Census-code to LGD-code crosswalk is stored and used when importing population or boundary files keyed by census codes; unmatched rows are flagged, never joined by name alone. |
