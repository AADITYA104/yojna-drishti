# Microtasks

Control document for execution (Part 0 s5). Statuses: BACKLOG, READY, IN_PROGRESS, BLOCKED, IN_REVIEW, TESTING, DONE, CANCELLED.
The original governance tasks remain in review until the user approves them. Prototype work and executed verification are recorded separately; older feature tasks remain open until their full acceptance criteria are met.

**Status summary (reconciled 2026-11-01):** BACKLOG: 59, BLOCKED: 3, IN_REVIEW: 3, DONE: 1 (total 66). TASK-105 records the latest prototype verification; older tasks remain in their original states until their full acceptance criteria are met.

## TASK-001 - Create BRAIN.md and documentation tree
- **Description:** Create root BRAIN.md, docs tree, glossary, ownership map, documentation map.
- **Objective:** Establish the Project Brain.
- **Requirement reference:** Governance task (no product requirement)
- **Relevant document:** docs/00-governance/*
- **Dependencies:** none
- **Files affected:** BRAIN.md, docs/**
- **Expected output:** Index and governance docs
- **Implementation details:** Author per Part 0 s1-3.
- **Acceptance criteria:** All mandatory Part 0 files exist with substantive content; links resolve.
- **Tests to execute:** Link-check script (manual until TASK-100)
- **Test results:** not run
- **Status:** IN_REVIEW
- **Blockers:** User review pending
- **Completion notes:** -

## TASK-002 - Part 1 research and requirement docs
- **Description:** PRD, scope, requirements, scheme research, data availability, geographic research.
- **Objective:** Complete blueprint without code.
- **Requirement reference:** Governance task (no product requirement)
- **Relevant document:** docs/01-product, docs/03-data-gis
- **Dependencies:** TASK-001
- **Files affected:** docs/**
- **Expected output:** Blueprint
- **Implementation details:** Author per Part 1 s4-8.
- **Acceptance criteria:** Docs consistent; unverified items flagged.
- **Tests to execute:** Manual consistency review
- **Test results:** not run
- **Status:** IN_REVIEW
- **Blockers:** Official-source verification outstanding (TASK-004)
- **Completion notes:** -

## TASK-003 - Architecture decision records
- **Description:** ADR-0001 onward for all major decisions.
- **Objective:** Control decisions.
- **Requirement reference:** Governance task (no product requirement)
- **Relevant document:** docs/adr/*
- **Dependencies:** TASK-002
- **Files affected:** docs/adr/*
- **Expected output:** ADRs
- **Implementation details:** Author per Part 0 s2J.
- **Acceptance criteria:** Each ADR has all required sections.
- **Tests to execute:** Manual review
- **Test results:** not run
- **Status:** IN_REVIEW
- **Blockers:** User approval of PROPOSED ADRs
- **Completion notes:** -

## TASK-004 - Verify five schemes against primary official sources
- **Description:** Retrieve wcd.gujarat.gov.in pages, latest GRs and guidelines; record URLs, dates, amounts, eligibility, status.
- **Objective:** Move scheme facts from UNVERIFIED/SECONDARY to OFFICIAL.
- **Requirement reference:** Governance task (no product requirement)
- **Relevant document:** docs/03-data-gis/scheme-research.md
- **Dependencies:** TASK-002
- **Files affected:** scheme-research.md, data-sources.md
- **Expected output:** Verified scheme register
- **Implementation details:** Fetch official pages and GR PDFs; screenshot hash optional; record retrieved_at.
- **Acceptance criteria:** Each scheme field has official URL and date or remains marked unverified.
- **Tests to execute:** Manual dual review
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** Becomes READY when the owner approves TASK-001 to TASK-003 (they are IN_REVIEW, not DONE); official portal access unconfirmed
- **Completion notes:** -

## TASK-005 - Obtain LGD master exports
- **Description:** Obtain district, sub-district, village, GP and mapping CSVs from LGD.
- **Objective:** Provide geography master input.
- **Requirement reference:** Governance task (no product requirement)
- **Relevant document:** data/raw/lgd/
- **Dependencies:** TASK-002
- **Files affected:** data/raw/lgd/*
- **Expected output:** LGD files with checksums
- **Implementation details:** User or agent downloads; record file hash and download date.
- **Acceptance criteria:** Files present, hashes recorded, licence noted.
- **Tests to execute:** Checksum recorded
- **Test results:** not run
- **Status:** BLOCKED
- **Blockers:** Needs user-provided files or confirmed download path
- **Completion notes:** -

## TASK-006 - Obtain boundary datasets and licences
- **Description:** Identify and obtain district, taluka and village boundary files with licence terms.
- **Objective:** Provide GIS input.
- **Requirement reference:** Governance task (no product requirement)
- **Relevant document:** data/raw/gis/
- **Dependencies:** TASK-002
- **Files affected:** data/raw/gis/*, gis-data-spec.md
- **Expected output:** Boundary files and licence record
- **Implementation details:** Evaluate official and community sources; record licence and CRS.
- **Acceptance criteria:** Licence permits intended use or item is escalated.
- **Tests to execute:** Licence review
- **Test results:** not run
- **Status:** BLOCKED
- **Blockers:** Village-level boundary source not yet identified
- **Completion notes:** -

## TASK-010 - Scaffold application
- **Description:** Next.js App Router, strict TypeScript, Tailwind, lint, format, test runners.
- **Objective:** Runnable skeleton matching project-structure.md.
- **Requirement reference:** NFR-MNT-01
- **Relevant document:** Repository root
- **Dependencies:** TASK-001
- **Files affected:** package.json, tsconfig, eslint, src/**
- **Expected output:** Skeleton that builds
- **Implementation details:** Verify current stable versions before pinning; record in dependencies.md.
- **Acceptance criteria:** install, lint, typecheck, build commands pass.
- **Tests to execute:** pnpm lint; pnpm typecheck; pnpm build
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** Becomes READY when the owner approves TASK-001 to TASK-003 and answers OQ-03, OQ-04, OQ-09
- **Completion notes:** -

## TASK-011 - Typed environment validation
- **Description:** Validate env vars at startup per environment.md.
- **Objective:** Fail fast on bad config.
- **Requirement reference:** Governance task (no product requirement)
- **Relevant document:** src/lib/config/env.ts
- **Dependencies:** TASK-010
- **Files affected:** env.ts, .env.example
- **Expected output:** Env module
- **Implementation details:** Schema validation with zod.
- **Acceptance criteria:** Missing required var stops startup with clear message.
- **Tests to execute:** Unit tests
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-012 - Error contract and request IDs
- **Description:** Central AppError, error codes, request-ID middleware, safe responses.
- **Objective:** Single error contract.
- **Requirement reference:** NFR-ERR-01
- **Relevant document:** src/lib/errors/*
- **Dependencies:** TASK-010
- **Files affected:** errors/*, middleware
- **Expected output:** Error layer
- **Implementation details:** Implement per error-handling.md.
- **Acceptance criteria:** Forced error returns contract without internals.
- **Tests to execute:** Integration test
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-013 - Structured logging
- **Description:** JSON logger with requestId and redaction.
- **Objective:** Observability baseline.
- **Requirement reference:** NFR-OBS-01
- **Relevant document:** src/lib/logger/*
- **Dependencies:** TASK-012
- **Files affected:** logger/*
- **Expected output:** Logger
- **Implementation details:** Implement per logging-and-monitoring.md.
- **Acceptance criteria:** Secrets redacted; same requestId across layers.
- **Tests to execute:** Unit and integration tests
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-020 - Migrations: geography core
- **Description:** admin_units (stable identity), admin_unit_versions (parent and names with validity), gram_panchayats, village_gp_map, admin_boundaries, admin_unit_aliases, admin_unit_code_crosswalk with constraints and GiST indexes.
- **Objective:** Geography schema.
- **Requirement reference:** FR-GEO-12
- **Relevant document:** db/migrations/*
- **Dependencies:** TASK-010
- **Files affected:** migrations
- **Expected output:** Schema
- **Implementation details:** SQL migrations per data-model.md.
- **Acceptance criteria:** Migration up/down succeeds; constraints reject invalid rows.
- **Tests to execute:** Migration tests
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-021 - Migrations: statistics and schemes
- **Description:** schemes, versions, rules, benefits, periods, stats tables with provenance columns.
- **Objective:** Statistics schema.
- **Requirement reference:** FR-DAT-03, FR-DAT-04, FR-SCH-02
- **Relevant document:** db/migrations/*
- **Dependencies:** TASK-020
- **Files affected:** migrations
- **Expected output:** Schema
- **Implementation details:** Per data-model.md.
- **Acceptance criteria:** All stats tables carry provenance and data_mode checks.
- **Tests to execute:** Migration tests
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-022 - Migrations: admin, audit, imports
- **Description:** users, roles, import_batches, errors, audit_logs (append-only).
- **Objective:** Admin schema.
- **Requirement reference:** FR-DAT-07, FR-ADM-06
- **Relevant document:** db/migrations/*
- **Dependencies:** TASK-020
- **Files affected:** migrations
- **Expected output:** Schema
- **Implementation details:** Revoke UPDATE/DELETE on audit_logs for app role.
- **Acceptance criteria:** Update on audit_logs fails for app role.
- **Tests to execute:** Migration and security tests
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-023 - Deterministic DEMO seed
- **Description:** Single seed script generating clearly flagged DEMO statistics for pilot geography.
- **Objective:** Demo mode without fake-as-real.
- **Requirement reference:** FR-DAT-01
- **Relevant document:** db/seed/demo.ts
- **Dependencies:** TASK-021, TASK-024
- **Files affected:** seed
- **Expected output:** Demo data
- **Implementation details:** Fixed random seed; data_mode=DEMO on every row.
- **Acceptance criteria:** No DEMO row is visible without badge; seed idempotent.
- **Tests to execute:** Integration tests
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-030 - LGD import pipeline
- **Description:** Idempotent import of LGD master: upsert stable unit by (level, lgd_code); add a new version row only when parent, names or status change; log batch.
- **Objective:** Load geography.
- **Requirement reference:** FR-GEO-12
- **Relevant document:** src/server/import/lgd.ts
- **Dependencies:** TASK-020, TASK-005
- **Files affected:** importer
- **Expected output:** Loaded hierarchy
- **Implementation details:** Upsert by (level, lgd_code, valid_from); log batch.
- **Acceptance criteria:** Re-run yields no changes; counts logged.
- **Tests to execute:** Integration tests
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** Needs TASK-005
- **Completion notes:** -

## TASK-031 - Boundary import and validation
- **Description:** Import polygons; validity, CRS, containment, overlap checks; simplified variants.
- **Objective:** Trusted boundaries.
- **Requirement reference:** FR-GEO-01, FR-GEO-14
- **Relevant document:** src/server/import/boundaries.ts
- **Dependencies:** TASK-020, TASK-006, TASK-030
- **Files affected:** importer
- **Expected output:** Validated boundaries
- **Implementation details:** PostGIS ST_IsValid, ST_Within, simplification per level.
- **Acceptance criteria:** Validation report generated; invalid geometry blocked.
- **Tests to execute:** GIS tests
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** Needs TASK-006
- **Completion notes:** -

## TASK-032 - Geography reconciliation report
- **Description:** Compare LGD counts, district-site figures, boundary features.
- **Objective:** Expose discrepancies (e.g. Bhavnagar 699 vs 692).
- **Requirement reference:** FR-ADM-08
- **Relevant document:** src/server/import/reconcile.ts
- **Dependencies:** TASK-030, TASK-031
- **Files affected:** reconcile
- **Expected output:** Report
- **Implementation details:** SQL diff plus report writer.
- **Acceptance criteria:** Report lists every mismatch with codes.
- **Tests to execute:** Integration+GIS tests
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-040 - Scheme master import and versioning
- **Description:** Load verified scheme data as versions with sources.
- **Objective:** Scheme catalogue.
- **Requirement reference:** FR-SCH-02, FR-ADM-07, FR-SCH-03
- **Relevant document:** src/server/import/schemes.ts
- **Dependencies:** TASK-021, TASK-004
- **Files affected:** importer
- **Expected output:** Schemes
- **Implementation details:** Version rows only; never overwrite.
- **Acceptance criteria:** Edit creates new version.
- **Tests to execute:** Integration tests
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** Needs TASK-004
- **Completion notes:** -

## TASK-041 - Statistics import pipeline
- **Description:** CSV/Excel parsing, schema validation, LGD resolution, forbidden-column rejection, dry-run.
- **Objective:** Safe ingestion.
- **Requirement reference:** FR-DAT-07, FR-ADM-02, FR-ADM-09
- **Relevant document:** src/server/import/stats.ts
- **Dependencies:** TASK-021, TASK-022
- **Files affected:** importer
- **Expected output:** Batches
- **Implementation details:** Stream parse; validators in one module.
- **Acceptance criteria:** Invalid files rejected with row-level errors.
- **Tests to execute:** Integration tests
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-042 - Duplicate detection
- **Description:** Within-file and against-published duplicate keys.
- **Objective:** Prevent double counting.
- **Requirement reference:** FR-ADM-03
- **Relevant document:** src/server/import/duplicates.ts
- **Dependencies:** TASK-041
- **Files affected:** module
- **Expected output:** Duplicate flags
- **Implementation details:** Unique key (scheme, unit, period, benefit_type, version).
- **Acceptance criteria:** Duplicates block publish.
- **Tests to execute:** Integration tests
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-043 - Approval, publish, rollback
- **Description:** State machine with separation of duties and audit.
- **Objective:** Controlled publication.
- **Requirement reference:** FR-ADM-04, FR-ADM-05
- **Relevant document:** src/server/import/workflow.ts
- **Dependencies:** TASK-041, TASK-022, TASK-080
- **Files affected:** module
- **Expected output:** Workflow
- **Implementation details:** Transactional status transitions.
- **Acceptance criteria:** Self-approval refused; rollback restores prior state.
- **Tests to execute:** Integration tests
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-050 - Metrics module
- **Description:** Single module for all formulas, suppression, null handling and reason codes.
- **Objective:** One source of truth for analytics.
- **Requirement reference:** FR-DAT-02, FR-DAT-05, FR-DAT-06, FR-VIL-02, FR-COV-01, FR-DAT-08
- **Relevant document:** src/lib/metrics/*
- **Dependencies:** TASK-010
- **Files affected:** metrics
- **Expected output:** Module
- **Implementation details:** Pure functions per analytics-metric-definitions.md.
- **Acceptance criteria:** All edge cases in test-cases pass.
- **Tests to execute:** Unit tests
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-051 - Geography API
- **Description:** Units, hierarchy, search, boundaries endpoints.
- **Objective:** Serve geography.
- **Requirement reference:** FR-GEO-01, FR-GEO-06
- **Relevant document:** src/app/api/v1/geo/*
- **Dependencies:** TASK-020, TASK-012
- **Files affected:** routes
- **Expected output:** Endpoints
- **Implementation details:** Per api-spec.md; parameterised SQL.
- **Acceptance criteria:** Contract tests pass.
- **Tests to execute:** Integration tests
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-052 - Statistics API
- **Description:** Overview, district, taluka, village, choropleth endpoints with meta block.
- **Objective:** Serve stats.
- **Requirement reference:** FR-GEO-09, FR-DAT-01, FR-DAT-02, FR-DAT-03, FR-STA-01, FR-DIS-01, FR-UX-02
- **Relevant document:** src/app/api/v1/stats/*
- **Dependencies:** TASK-021, TASK-050, TASK-012
- **Files affected:** routes
- **Expected output:** Endpoints
- **Implementation details:** Server-side aggregation.
- **Acceptance criteria:** Aggregates equal direct SQL; meta present.
- **Tests to execute:** Integration tests
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-053 - Scheme API
- **Description:** Scheme list and detail.
- **Objective:** Serve schemes.
- **Requirement reference:** FR-SCH-01
- **Relevant document:** src/app/api/v1/schemes/*
- **Dependencies:** TASK-021, TASK-012
- **Files affected:** routes
- **Expected output:** Endpoints
- **Implementation details:** Per api-spec.md.
- **Acceptance criteria:** Contract tests pass.
- **Tests to execute:** Integration tests
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-054 - Comparison API
- **Description:** Comparison with comparability check.
- **Objective:** Serve comparisons.
- **Requirement reference:** FR-CMP-01
- **Relevant document:** src/app/api/v1/compare/*
- **Dependencies:** TASK-050, TASK-052
- **Files affected:** routes
- **Expected output:** Endpoint
- **Implementation details:** Per api-spec.md.
- **Acceptance criteria:** Incomparable returns warning and no rank.
- **Tests to execute:** Integration tests
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-055 - Export module
- **Description:** CSV, XLSX, PDF with badge and definitions.
- **Objective:** Exports.
- **Requirement reference:** FR-DAT-01, FR-EXP-01, FR-UX-06
- **Relevant document:** src/server/export/*
- **Dependencies:** TASK-052
- **Files affected:** module
- **Expected output:** Exports
- **Implementation details:** Single export module.
- **Acceptance criteria:** DEMO marker in every file.
- **Tests to execute:** Integration tests
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-060 - Map base component
- **Description:** MapLibre map, sources, layers, attribution, basemap config, fallback.
- **Objective:** Map foundation.
- **Requirement reference:** FR-GEO-01, FR-GEO-02, FR-GEO-07, FR-GEO-10, FR-GEO-11
- **Relevant document:** src/features/map/*
- **Dependencies:** TASK-010
- **Files affected:** components
- **Expected output:** Map
- **Implementation details:** Per ui-ux-spec.md and ADR-0004.
- **Acceptance criteria:** Renders state polygons from API.
- **Tests to execute:** E2E
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-061 - Drill-down state machine
- **Description:** useMapDrilldown hook with URL sync and camera targets.
- **Objective:** Navigation logic.
- **Requirement reference:** FR-GEO-02, FR-GEO-03, FR-GEO-04, FR-GEO-05, FR-GEO-08, FR-STA-03, FR-GEO-13
- **Relevant document:** src/features/map/useMapDrilldown.ts
- **Dependencies:** TASK-060, TASK-051
- **Files affected:** hook
- **Expected output:** Hook
- **Implementation details:** Finite state machine; URL as source of truth.
- **Acceptance criteria:** Full journey passes in E2E.
- **Tests to execute:** E2E
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-062 - Choropleth layer and legend
- **Description:** Metric classing, null style, legend.
- **Objective:** Coverage colouring.
- **Requirement reference:** FR-GEO-09
- **Relevant document:** src/features/map/choropleth.ts
- **Dependencies:** TASK-052, TASK-060
- **Files affected:** module
- **Expected output:** Layer
- **Implementation details:** Class breaks computed server-side.
- **Acceptance criteria:** Null hatched and in legend.
- **Tests to execute:** E2E
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-063 - Search
- **Description:** Gujarati and English search over geo search API.
- **Objective:** Find units.
- **Requirement reference:** FR-GEO-06, FR-UX-04
- **Relevant document:** src/features/search/*
- **Dependencies:** TASK-051
- **Files affected:** components
- **Expected output:** Search
- **Implementation details:** Trigram or unaccent search.
- **Acceptance criteria:** Duplicate names disambiguated.
- **Tests to execute:** Integration and E2E
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-064 - Animations per spec
- **Description:** Implement only animations listed in animation-spec.md with reduced-motion handling.
- **Objective:** Functional motion.
- **Requirement reference:** FR-GEO-02
- **Relevant document:** src/features/map/motion.ts
- **Dependencies:** TASK-061
- **Files affected:** module
- **Expected output:** Motion
- **Implementation details:** Respect prefers-reduced-motion.
- **Acceptance criteria:** No motion when reduced-motion set.
- **Tests to execute:** E2E
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-070 - State overview dashboard
- **Description:** KPIs and charts.
- **Objective:** Overview.
- **Requirement reference:** FR-STA-01, FR-STA-02, FR-STA-03, FR-DAT-08, FR-UX-02
- **Relevant document:** src/app/(public)/page.tsx
- **Dependencies:** TASK-052, TASK-050
- **Files affected:** pages
- **Expected output:** Dashboard
- **Implementation details:** ECharts wrapper.
- **Acceptance criteria:** KPIs equal SQL aggregates.
- **Tests to execute:** Integration and E2E
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-071 - District and taluka panels
- **Description:** Panels per dashboard-layouts.md.
- **Objective:** Drill panels.
- **Requirement reference:** FR-DIS-01, FR-TAL-01, FR-GEO-13, FR-GEO-14
- **Relevant document:** src/features/panels/*
- **Dependencies:** TASK-052, TASK-061
- **Files affected:** components
- **Expected output:** Panels
- **Implementation details:** Shared panel shell.
- **Acceptance criteria:** Blocks render or show unavailable.
- **Tests to execute:** E2E
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-072 - Village intelligence panel
- **Description:** Profile, five scheme cards, financials, trend, sources.
- **Objective:** Core module.
- **Requirement reference:** FR-GEO-04, FR-DAT-02, FR-DAT-03, FR-VIL-01, FR-VIL-02
- **Relevant document:** src/features/panels/village/*
- **Dependencies:** TASK-052, TASK-061
- **Files affected:** components
- **Expected output:** Panel
- **Implementation details:** Shared SchemeCard.
- **Acceptance criteria:** Five cards; null shown as unavailable.
- **Tests to execute:** E2E
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-073 - Scheme pages
- **Description:** Scheme detail and analytics.
- **Objective:** Scheme module.
- **Requirement reference:** FR-SCH-01, FR-SCH-03
- **Relevant document:** src/app/(public)/schemes/*
- **Dependencies:** TASK-053
- **Files affected:** pages
- **Expected output:** Pages
- **Implementation details:** Per ui-ux-spec.md.
- **Acceptance criteria:** Unverified fields flagged.
- **Tests to execute:** E2E
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-074 - Coverage and financial analytics UI
- **Description:** Coverage and financial views.
- **Objective:** Analytics.
- **Requirement reference:** FR-DAT-04, FR-COV-01, FR-FIN-01
- **Relevant document:** src/features/analytics/*
- **Dependencies:** TASK-050, TASK-052
- **Files affected:** components
- **Expected output:** Views
- **Implementation details:** Per metric definitions.
- **Acceptance criteria:** Non-computable units listed with reasons.
- **Tests to execute:** E2E
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-075 - Comparison UI
- **Description:** Comparison screens.
- **Objective:** Compare.
- **Requirement reference:** FR-CMP-01
- **Relevant document:** src/features/compare/*
- **Dependencies:** TASK-054
- **Files affected:** components
- **Expected output:** Screens
- **Implementation details:** Per ui-ux-spec.md.
- **Acceptance criteria:** Warning shown for incomparable.
- **Tests to execute:** E2E
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-076 - Internationalisation
- **Description:** Gujarati and English catalogs, switch, formatter.
- **Objective:** Bilingual UI.
- **Requirement reference:** FR-I18N-01
- **Relevant document:** src/i18n/*
- **Dependencies:** TASK-010
- **Files affected:** catalogs
- **Expected output:** i18n
- **Implementation details:** Single catalog per language.
- **Acceptance criteria:** No missing keys.
- **Tests to execute:** Unit test
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** Native Gujarati review needed
- **Completion notes:** -

## TASK-080 - Authentication and RBAC
- **Description:** Auth library, sessions, role guard used by every admin route.
- **Objective:** Secure access.
- **Requirement reference:** FR-ADM-01
- **Relevant document:** src/server/auth/*
- **Dependencies:** TASK-022, TASK-012
- **Files affected:** auth
- **Expected output:** Auth
- **Implementation details:** Central guard function.
- **Acceptance criteria:** Direct calls without role get 403.
- **Tests to execute:** Security tests
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-081 - Admin: schemes and sources
- **Description:** Admin screens.
- **Objective:** Manage catalogue.
- **Requirement reference:** FR-ADM-07
- **Relevant document:** src/app/(admin)/*
- **Dependencies:** TASK-080, TASK-040
- **Files affected:** pages
- **Expected output:** Screens
- **Implementation details:** Per admin-spec.md.
- **Acceptance criteria:** Edit creates version.
- **Tests to execute:** E2E
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-082 - Admin: imports and approvals UI
- **Description:** Upload, preview, errors, approve, publish.
- **Objective:** Import workflow UI.
- **Requirement reference:** FR-ADM-02, FR-ADM-04
- **Relevant document:** src/app/(admin)/imports/*
- **Dependencies:** TASK-043, TASK-080
- **Files affected:** pages
- **Expected output:** Screens
- **Implementation details:** Per admin-spec.md.
- **Acceptance criteria:** Journey passes in E2E.
- **Tests to execute:** E2E
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-083 - Audit log viewer
- **Description:** Read-only viewer with filters.
- **Objective:** Accountability.
- **Requirement reference:** FR-ADM-06
- **Relevant document:** src/app/(admin)/audit/*
- **Dependencies:** TASK-080
- **Files affected:** pages
- **Expected output:** Viewer
- **Implementation details:** Read-only.
- **Acceptance criteria:** No mutation endpoints exist.
- **Tests to execute:** Security tests
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-090 - Unit test suite
- **Description:** Metrics, validators, formatters, guards.
- **Objective:** Unit coverage.
- **Requirement reference:** Governance task (no product requirement)
- **Relevant document:** tests/unit/*
- **Dependencies:** TASK-050
- **Files affected:** tests
- **Expected output:** Suite
- **Implementation details:** Vitest.
- **Acceptance criteria:** All pass; critical modules covered.
- **Tests to execute:** pnpm test
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-091 - Integration test suite
- **Description:** DB, API, imports.
- **Objective:** Integration coverage.
- **Requirement reference:** Governance task (no product requirement)
- **Relevant document:** tests/integration/*
- **Dependencies:** TASK-052, TASK-041
- **Files affected:** tests
- **Expected output:** Suite
- **Implementation details:** PostGIS test container.
- **Acceptance criteria:** All pass.
- **Tests to execute:** pnpm test:integration
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-092 - GIS test suite
- **Description:** Geometry validity, containment, selection.
- **Objective:** GIS coverage.
- **Requirement reference:** Governance task (no product requirement)
- **Relevant document:** tests/gis/*
- **Dependencies:** TASK-031
- **Files affected:** tests
- **Expected output:** Suite
- **Implementation details:** SQL assertions.
- **Acceptance criteria:** All pass.
- **Tests to execute:** pnpm test:gis
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-093 - E2E test suite
- **Description:** Playwright journeys.
- **Objective:** E2E coverage.
- **Requirement reference:** Governance task (no product requirement)
- **Relevant document:** tests/e2e/*
- **Dependencies:** TASK-072, TASK-082
- **Files affected:** tests
- **Expected output:** Suite
- **Implementation details:** Playwright.
- **Acceptance criteria:** All pass.
- **Tests to execute:** pnpm test:e2e
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-094 - Accessibility audit
- **Description:** Automated plus manual keyboard and screen-reader checks.
- **Objective:** WCAG target.
- **Requirement reference:** NFR-A11Y-01
- **Relevant document:** docs/05-quality/accessibility.md
- **Dependencies:** TASK-072
- **Files affected:** report
- **Expected output:** Report
- **Implementation details:** axe plus manual.
- **Acceptance criteria:** No open AA failure on core journeys.
- **Tests to execute:** axe; manual
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-095 - Performance measurement
- **Description:** Measure budgets on pilot data.
- **Objective:** Performance evidence.
- **Requirement reference:** NFR-PERF-01
- **Relevant document:** docs/04-engineering/performance.md
- **Dependencies:** TASK-072
- **Files affected:** report
- **Expected output:** Report
- **Implementation details:** Lighthouse and EXPLAIN.
- **Acceptance criteria:** Budgets pass or risks logged.
- **Tests to execute:** Measured
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-096 - Security testing
- **Description:** Authorisation bypass, upload, headers, dependency audit.
- **Objective:** Security evidence.
- **Requirement reference:** NFR-SEC-01
- **Relevant document:** docs/09-security/security.md
- **Dependencies:** TASK-082
- **Files affected:** report
- **Expected output:** Report
- **Implementation details:** Automated plus manual.
- **Acceptance criteria:** No open critical.
- **Tests to execute:** Security suite
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-100 - CI pipeline
- **Description:** Create CI incrementally: after TASK-010 only lint, typecheck and build jobs exist; each later test suite adds its job in the same change that adds the suite. Never add an empty job.
- **Objective:** Automated gates.
- **Requirement reference:** NFR-MNT-01, NFR-ADV-01
- **Relevant document:** .github/workflows/*
- **Dependencies:** TASK-010
- **Files affected:** workflows
- **Expected output:** Pipeline
- **Implementation details:** Only real checks.
- **Acceptance criteria:** Pipeline passes on main; fails on injected failure.
- **Tests to execute:** Pipeline run
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-101 - Deployment pipeline
- **Description:** Protected deployment workflow.
- **Objective:** Controlled release.
- **Requirement reference:** Governance task (no product requirement)
- **Relevant document:** .github/workflows/deploy.yml
- **Dependencies:** TASK-100
- **Files affected:** workflow
- **Expected output:** Pipeline
- **Implementation details:** Environment protection and approval.
- **Acceptance criteria:** Staging deploy verified.
- **Tests to execute:** Deploy run
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** Hosting decision (OQ-06)
- **Completion notes:** -

## TASK-102 - Backup and restore drill
- **Description:** Configure automated backups, then execute and time a restore drill into a scratch database; record results.
- **Objective:** Recovery proof.
- **Requirement reference:** NFR-DR-01
- **Relevant document:** docs/05-quality/disaster-recovery.md
- **Dependencies:** TASK-101
- **Files affected:** report
- **Expected output:** Record
- **Implementation details:** pg_dump and restore into scratch DB.
- **Acceptance criteria:** Counts match.
- **Tests to execute:** Drill
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-103 - Production readiness audit
- **Description:** Run production checklist with PASS/FAIL evidence.
- **Objective:** Release gate.
- **Requirement reference:** Governance task (no product requirement)
- **Relevant document:** docs/05-quality/production-readiness.md
- **Dependencies:** TASK-102, TASK-096, TASK-095
- **Files affected:** report
- **Expected output:** Checklist
- **Implementation details:** Per checklist.
- **Acceptance criteria:** All critical items PASS.
- **Tests to execute:** Checklist
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-104 - Final completeness audit
- **Description:** Documentation Completeness Matrix and traceability closure.
- **Objective:** Close Part 2.
- **Requirement reference:** Governance task (no product requirement)
- **Relevant document:** docs/08-project-management/*
- **Dependencies:** TASK-103
- **Files affected:** report
- **Expected output:** Matrix
- **Implementation details:** Per Part 0 s18.
- **Acceptance criteria:** No silent omission.
- **Tests to execute:** Audit
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-007 - Obtain census-to-LGD code crosswalk
- **Description:** Obtain or build a mapping from census village codes to LGD codes with review of every name-based match.
- **Objective:** Allow census-keyed population and boundary files to attach to LGD units.
- **Requirement reference:** FR-ADM-09
- **Relevant document:** data/raw/crosswalk/
- **Dependencies:** TASK-005
- **Files affected:** crosswalk files, docs
- **Expected output:** Reviewed crosswalk
- **Implementation details:** Use official mapping if one exists; otherwise name plus parent matching with human review.
- **Acceptance criteria:** Every pilot village mapped or listed as unmatched with reason.
- **Tests to execute:** Reviewer sign-off; counts
- **Test results:** not run
- **Status:** BLOCKED
- **Blockers:** Needs LGD files and a mapping source
- **Completion notes:** -

## TASK-065 - Map label rendering spike
- **Description:** Test Gujarati label shaping in the map engine at three zoom levels; decide engine labels vs HTML overlay.
- **Objective:** Prove Gujarati names render correctly.
- **Requirement reference:** FR-GEO-15
- **Relevant document:** docs/adr/ADR-0016
- **Dependencies:** TASK-060
- **Files affected:** spike report
- **Expected output:** Decision and ADR update
- **Implementation details:** Render 30 sample names with conjuncts; compare with reference rendering.
- **Acceptance criteria:** Decision recorded with screenshots.
- **Tests to execute:** Manual visual check
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-066 - Application shell and layer panel
- **Description:** Header, sidebar navigation, layer toggles, in-map legend and status indicators.
- **Objective:** Consistent shell.
- **Requirement reference:** FR-UX-01
- **Relevant document:** src/components/layout/*
- **Dependencies:** TASK-010, TASK-076
- **Files affected:** components
- **Expected output:** Shell
- **Implementation details:** Single layout component used by all public routes.
- **Acceptance criteria:** All routes use shell; toggles work and persist in URL.
- **Tests to execute:** E2E
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-067 - Time playback control
- **Description:** Play, pause and step through reporting periods.
- **Objective:** Temporal exploration.
- **Requirement reference:** FR-UX-03
- **Relevant document:** src/features/map/playback.ts
- **Dependencies:** TASK-062
- **Files affected:** module
- **Expected output:** Control
- **Implementation details:** Uses existing choropleth endpoint per period; prefetch next period.
- **Acceptance criteria:** Works with 3 or more periods; reduced-motion steps manually.
- **Tests to execute:** E2E
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-068 - Static, legal and error pages
- **Description:** Landing, login page shell, disclaimer, privacy, about, 403, 404, 500, maintenance.
- **Objective:** Complete page set.
- **Requirement reference:** FR-UX-05, FR-LEG-01
- **Relevant document:** src/app/**
- **Dependencies:** TASK-066
- **Files affected:** pages
- **Expected output:** Pages
- **Implementation details:** Content from legal-notices.md and privacy.md; bilingual.
- **Acceptance criteria:** Each page reachable and bilingual; no emblem assets.
- **Tests to execute:** E2E and static scan
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** Owner organisation details (OQ-08)
- **Completion notes:** -

## TASK-069 - Data issue reporting queue
- **Description:** Public report control and admin queue.
- **Objective:** Feedback loop.
- **Requirement reference:** FR-UX-07
- **Relevant document:** src/app/api/v1/issues/*
- **Dependencies:** TASK-080
- **Files affected:** routes
- **Expected output:** Queue
- **Implementation details:** Rate limited, no personal data required.
- **Acceptance criteria:** Report appears in admin queue.
- **Tests to execute:** Integration
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-097 - Cross-browser and device matrix run
- **Description:** Run the matrix in testing.md on real or emulated devices including low-end Android with Gujarati fonts.
- **Objective:** Real-device confidence.
- **Requirement reference:** Governance task (no product requirement)
- **Relevant document:** docs/05-quality/testing.md
- **Dependencies:** TASK-093
- **Files affected:** report
- **Expected output:** Matrix results
- **Implementation details:** Execute and record.
- **Acceptance criteria:** No blocking defect on supported matrix.
- **Tests to execute:** Manual plus automation
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-024 - Synthetic test geography fixture
- **Description:** Create a tiny labelled TEST GEOMETRY hierarchy (one state, 3 districts, 6 talukas, about 20 villages incl. one urban taluka with no villages and villages without polygons) for development and tests.
- **Objective:** Let L1 development and tests run without licensed boundary data, without being mistaken for real geography.
- **Requirement reference:** FR-DAT-01
- **Relevant document:** db/seed/test-geography.ts
- **Dependencies:** TASK-020
- **Files affected:** seed
- **Expected output:** Fixture
- **Implementation details:** Fake LGD-style codes with a reserved TEST prefix that can never collide with real codes; flagged is_demo source; map shows TEST GEOMETRY ribbon.
- **Acceptance criteria:** Fixture loads idempotently; no TEST row can be published as VERIFIED; map ribbon visible.
- **Tests to execute:** Integration tests
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-084 - Admin bootstrap and role seeding
- **Description:** Seed the five roles; CLI to create the first Super Administrator; account recovery and MFA recovery procedure.
- **Objective:** Make the first login possible safely.
- **Requirement reference:** FR-ADM-01
- **Relevant document:** scripts/create-super-admin, db/seed/roles
- **Dependencies:** TASK-022, TASK-080
- **Files affected:** cli, seed
- **Expected output:** Bootstrap
- **Implementation details:** CLI requires database access, refuses when a Super Admin already exists unless forced with an audited flag; forces password change and MFA enrolment at first login.
- **Acceptance criteria:** First admin can log in only after MFA enrolment; second run refused.
- **Tests to execute:** Integration and security tests
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -

## TASK-085 - Scheduled maintenance jobs
- **Description:** Retention purge, daily data-quality checks, DEMO leak scan, freshness check, boundary validity check, backup age check.
- **Objective:** Make documented scheduled controls real.
- **Requirement reference:** FR-DAT-03, FR-DAT-07, NFR-OBS-01, NFR-DR-01
- **Relevant document:** src/server/jobs/*, .github/workflows/scheduled.yml
- **Dependencies:** TASK-052, TASK-043
- **Files affected:** jobs
- **Expected output:** Jobs
- **Implementation details:** Each job idempotent, logged with requestId, results visible in admin dashboard; run by platform scheduler or protected CLI.
- **Acceptance criteria:** Each job runs against test data and reports pass or alert; retention purge removes only expired rows.
- **Tests to execute:** Integration tests
- **Test results:** not run
- **Status:** BACKLOG
- **Blockers:** none
- **Completion notes:** -


## TASK-105 - Prototype build and local dashboard recheck
- **Description:** Re-run repository checks, build the prototype and confirm the local dashboard responds and exposes the agreed navigation shell.
- **Objective:** Record reproducible evidence for the current prototype without implying production readiness.
- **Requirement reference:** FR-UX-01 and engineering governance.
- **Relevant document:** BRAIN.md; docs/08-project-management/progress-report.md.
- **Dependencies:** TASK-010.
- **Files affected:** verification record and any defects found.
- **Expected output:** Current checks and limitations recorded.
- **Implementation details:** Run npm test, typecheck, lint and production build; start the local app and confirm HTTP response plus home-page accessibility tree.
- **Acceptance criteria:** All commands pass; page responds; state limitations and unvisited routes explicitly.
- **Tests to execute:** `npm test`; `npm run typecheck`; `npm run lint`; `npm run build`; local HTTP/browser smoke.
- **Test results:** Pass — 4/4 unit tests; typecheck, lint and build passed; local HTTP 200; all 14 destinations opened; Gujarati scheme search, empty search result, Ctrl+K focus, district selection, and Administration/Data Management routing checked; project Markdown file links validated.
- **Status:** DONE
- **Blockers:** Production readiness remains out of scope for this verification task.
- **Completion notes:** Project status and final light-theme decision reconciled in BRAIN.md, ADR-0017, progress report and changelog. All 14 navigation destinations and Gujarati scheme search manually verified in the browser.





