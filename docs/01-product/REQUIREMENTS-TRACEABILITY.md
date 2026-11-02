# Requirements Traceability

Chain: Requirement > User story > Acceptance criteria > Technical design > DB/API > Microtask > Source code > Test case > Result.

Source code and Evidence columns are intentionally empty until Part 2 implementation; a requirement is never marked DONE without evidence.

| Req ID | Priority | PRD ref | Technical spec ref | Implementation tasks | Test case | Status | Evidence |
|---|---|---|---|---|---|---|---|
| FR-GEO-01 | P0 | PRD.md#requirement-catalogue | gis-data-spec.md#state-level; api-spec.md#geo-boundaries | TASK-031, TASK-051, TASK-060 | TC-GEO-01 | NOT STARTED | - |
| FR-GEO-02 | P0 | PRD.md#requirement-catalogue | ui-ux-spec.md#map-explorer; system-flows.md#drilldown | TASK-061, TASK-060, TASK-064 | TC-GEO-02 | NOT STARTED | - |
| FR-GEO-03 | P0 | PRD.md#requirement-catalogue | ui-ux-spec.md#map-explorer | TASK-061 | TC-GEO-03 | NOT STARTED | - |
| FR-GEO-04 | P0 | PRD.md#requirement-catalogue | dashboard-layouts.md#village-panel | TASK-061, TASK-072 | TC-GEO-04 | NOT STARTED | - |
| FR-GEO-05 | P0 | PRD.md#requirement-catalogue | system-flows.md#drilldown | TASK-061 | TC-GEO-05 | NOT STARTED | - |
| FR-GEO-06 | P1 | PRD.md#requirement-catalogue | api-spec.md#geo-search | TASK-063, TASK-051 | TC-GEO-06 | NOT STARTED | - |
| FR-GEO-07 | P1 | PRD.md#requirement-catalogue | ui-ux-spec.md#interactions | TASK-060 | TC-GEO-07 | NOT STARTED | - |
| FR-GEO-08 | P1 | PRD.md#requirement-catalogue | system-flows.md#deep-links | TASK-061 | TC-GEO-08 | NOT STARTED | - |
| FR-GEO-09 | P1 | PRD.md#requirement-catalogue | design-system.md#map-colour | TASK-062, TASK-052 | TC-GEO-09 | NOT STARTED | - |
| FR-GEO-10 | P2 | PRD.md#requirement-catalogue | adr/ADR-0004-map-rendering-strategy.md | TASK-060 | TC-GEO-10 | NOT STARTED | - |
| FR-GEO-11 | P0 | PRD.md#requirement-catalogue | gis-data-spec.md#attribution | TASK-060 | TC-GEO-11 | NOT STARTED | - |
| FR-GEO-12 | P1 | PRD.md#requirement-catalogue | data-model.md#admin_units; ADR-0003 | TASK-020, TASK-030 | TC-GEO-12 | NOT STARTED | - |
| FR-DAT-01 | P0 | PRD.md#requirement-catalogue | privacy.md; data-quality.md#modes | TASK-023, TASK-052, TASK-055, TASK-024 | TC-DAT-01 | NOT STARTED | - |
| FR-DAT-02 | P0 | PRD.md#requirement-catalogue | data-dictionary.md#nulls | TASK-050, TASK-052, TASK-072 | TC-DAT-02 | NOT STARTED | - |
| FR-DAT-03 | P0 | PRD.md#requirement-catalogue | data-lineage.md | TASK-021, TASK-052, TASK-072, TASK-085 | TC-DAT-03 | NOT STARTED | - |
| FR-DAT-04 | P0 | PRD.md#requirement-catalogue | analytics-metric-definitions.md#financial | TASK-021, TASK-074 | TC-DAT-04 | NOT STARTED | - |
| FR-DAT-05 | P0 | PRD.md#requirement-catalogue | analytics-metric-definitions.md | TASK-050 | TC-DAT-05 | NOT STARTED | - |
| FR-DAT-06 | P1 | PRD.md#requirement-catalogue | privacy.md#small-number-suppression | TASK-050 | TC-DAT-06 | NOT STARTED | - |
| FR-DAT-07 | P0 | PRD.md#requirement-catalogue | privacy.md; import-pipeline.md#forbidden-columns | TASK-022, TASK-041, TASK-085 | TC-DAT-07 | NOT STARTED | - |
| FR-STA-01 | P0 | PRD.md#requirement-catalogue | dashboard-layouts.md#state-overview | TASK-070, TASK-052 | TC-STA-01 | NOT STARTED | - |
| FR-STA-02 | P1 | PRD.md#requirement-catalogue | dashboard-layouts.md#state-overview | TASK-070 | TC-STA-02 | NOT STARTED | - |
| FR-STA-03 | P1 | PRD.md#requirement-catalogue | api-spec.md#common-query | TASK-070, TASK-061 | TC-STA-03 | NOT STARTED | - |
| FR-DIS-01 | P0 | PRD.md#requirement-catalogue | dashboard-layouts.md#district-panel | TASK-071, TASK-052 | TC-DIS-01 | NOT STARTED | - |
| FR-TAL-01 | P0 | PRD.md#requirement-catalogue | dashboard-layouts.md#taluka-panel | TASK-071 | TC-TAL-01 | NOT STARTED | - |
| FR-VIL-01 | P0 | PRD.md#requirement-catalogue | dashboard-layouts.md#village-panel | TASK-072 | TC-VIL-01 | NOT STARTED | - |
| FR-VIL-02 | P1 | PRD.md#requirement-catalogue | analytics-metric-definitions.md#comparability | TASK-072, TASK-050 | TC-VIL-02 | NOT STARTED | - |
| FR-SCH-01 | P0 | PRD.md#requirement-catalogue | ui-ux-spec.md#scheme-page | TASK-073, TASK-053 | TC-SCH-01 | NOT STARTED | - |
| FR-SCH-02 | P1 | PRD.md#requirement-catalogue | data-model.md#scheme_versions | TASK-021, TASK-040 | TC-SCH-02 | NOT STARTED | - |
| FR-COV-01 | P1 | PRD.md#requirement-catalogue | analytics-metric-definitions.md#coverage | TASK-074, TASK-050 | TC-COV-01 | NOT STARTED | - |
| FR-FIN-01 | P1 | PRD.md#requirement-catalogue | analytics-metric-definitions.md#financial | TASK-074 | TC-FIN-01 | NOT STARTED | - |
| FR-CMP-01 | P2 | PRD.md#requirement-catalogue | api-spec.md#compare | TASK-054, TASK-075 | TC-CMP-01 | NOT STARTED | - |
| FR-EXP-01 | P2 | PRD.md#requirement-catalogue | api-spec.md#export | TASK-055 | TC-EXP-01 | NOT STARTED | - |
| FR-I18N-01 | P0 | PRD.md#requirement-catalogue | design-system.md#typography | TASK-076 | TC-I18N-01 | NOT STARTED | - |
| FR-ADM-01 | P0 | PRD.md#requirement-catalogue | roles-and-permissions.md | TASK-080, TASK-084 | TC-ADM-01 | NOT STARTED | - |
| FR-ADM-02 | P0 | PRD.md#requirement-catalogue | import-pipeline.md | TASK-041, TASK-082 | TC-ADM-02 | NOT STARTED | - |
| FR-ADM-03 | P0 | PRD.md#requirement-catalogue | import-pipeline.md#duplicates | TASK-042 | TC-ADM-03 | NOT STARTED | - |
| FR-ADM-04 | P0 | PRD.md#requirement-catalogue | admin-spec.md#workflow | TASK-043, TASK-082 | TC-ADM-04 | NOT STARTED | - |
| FR-ADM-05 | P0 | PRD.md#requirement-catalogue | import-pipeline.md#rollback | TASK-043 | TC-ADM-05 | NOT STARTED | - |
| FR-ADM-06 | P0 | PRD.md#requirement-catalogue | security.md#audit | TASK-022, TASK-083 | TC-ADM-06 | NOT STARTED | - |
| FR-ADM-07 | P1 | PRD.md#requirement-catalogue | admin-spec.md | TASK-081, TASK-040 | TC-ADM-07 | NOT STARTED | - |
| FR-ADM-08 | P1 | PRD.md#requirement-catalogue | import-pipeline.md#reconciliation | TASK-032 | TC-ADM-08 | NOT STARTED | - |
| NFR-PERF-01 | P1 | PRD.md#requirement-catalogue | performance.md | TASK-095 | TC-NPERF-01 | NOT STARTED | - |
| NFR-SEC-01 | P0 | PRD.md#requirement-catalogue | security.md | TASK-096 | TC-NSEC-01 | NOT STARTED | - |
| NFR-A11Y-01 | P1 | PRD.md#requirement-catalogue | accessibility.md | TASK-094 | TC-NA11Y-01 | NOT STARTED | - |
| NFR-ERR-01 | P0 | PRD.md#requirement-catalogue | error-handling.md | TASK-012 | TC-NERR-01 | NOT STARTED | - |
| NFR-OBS-01 | P1 | PRD.md#requirement-catalogue | logging-and-monitoring.md | TASK-013, TASK-085 | TC-NOBS-01 | NOT STARTED | - |
| NFR-DR-01 | P1 | PRD.md#requirement-catalogue | disaster-recovery.md | TASK-102, TASK-085 | TC-NDR-01 | NOT STARTED | - |
| NFR-MNT-01 | P1 | PRD.md#requirement-catalogue | coding-standards.md | TASK-010, TASK-100 | TC-NMNT-01 | NOT STARTED | - |
| NFR-ADV-01 | P0 | PRD.md#requirement-catalogue | admob-spec.md | TASK-100 | TC-NADV-01 | NOT STARTED | - |
| FR-GEO-13 | P0 | PRD.md#requirement-catalogue | ui-ux-spec.md#empty-children | TASK-061, TASK-071 | TC-GEO-13 | NOT STARTED | - |
| FR-GEO-14 | P1 | PRD.md#requirement-catalogue | gis-data-spec.md | TASK-031, TASK-071 | TC-GEO-14 | NOT STARTED | - |
| FR-GEO-15 | P0 | PRD.md#requirement-catalogue | ui-ux-spec.md#map-labels; ADR-0016 | TASK-065 | TC-GEO-15 | NOT STARTED | - |
| FR-DAT-08 | P0 | PRD.md#requirement-catalogue | data-model.md#views | TASK-050, TASK-070 | TC-DAT-08 | NOT STARTED | - |
| FR-SCH-03 | P1 | PRD.md#requirement-catalogue | ui-ux-spec.md#scheme-page | TASK-073, TASK-040 | TC-SCH-03 | NOT STARTED | - |
| FR-UX-01 | P0 | PRD.md#requirement-catalogue | ui-ux-spec.md#app-shell | TASK-066 | TC-UX-01 | NOT STARTED | - |
| FR-UX-02 | P1 | PRD.md#requirement-catalogue | api-spec.md#common-query | TASK-052, TASK-070 | TC-UX-02 | NOT STARTED | - |
| FR-UX-03 | P2 | PRD.md#requirement-catalogue | animation-spec.md AN-11 | TASK-067 | TC-UX-03 | NOT STARTED | - |
| FR-UX-04 | P1 | PRD.md#requirement-catalogue | api-spec.md#geo-search | TASK-063 | TC-UX-04 | NOT STARTED | - |
| FR-UX-05 | P0 | PRD.md#requirement-catalogue | ui-ux-spec.md#sitemap | TASK-068 | TC-UX-05 | NOT STARTED | - |
| FR-UX-06 | P2 | PRD.md#requirement-catalogue | ui-ux-spec.md#print | TASK-055 | TC-UX-06 | NOT STARTED | - |
| FR-UX-07 | P2 | PRD.md#requirement-catalogue | admin-spec.md#issues | TASK-069 | TC-UX-07 | NOT STARTED | - |
| FR-LEG-01 | P0 | PRD.md#requirement-catalogue | legal-notices.md | TASK-068 | TC-LEG-01 | NOT STARTED | - |
| FR-ADM-09 | P0 | PRD.md#requirement-catalogue | data-model.md#admin_unit_code_crosswalk; import-pipeline.md#crosswalk | TASK-007, TASK-041 | TC-ADM-09 | NOT STARTED | - |

## Coverage check (computed at generation)
- Requirements: 63
- Requirements with at least one task: 63
- Tasks referencing no requirement: TASK-001, TASK-002, TASK-003, TASK-004, TASK-005, TASK-006, TASK-011, TASK-090, TASK-091, TASK-092, TASK-093, TASK-101, TASK-103, TASK-104, TASK-097 (documentation, research and audit tasks are governance tasks)
