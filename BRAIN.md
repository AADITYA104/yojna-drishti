# BRAIN.md - YOJANA DRISHTI Project Brain

Central index, governance control and single source of truth for engineering decisions. Detailed specifications reside in `/docs`.

1. **Product Identity:** YOJANA DRISHTI (યોજના દૃષ્ટિ) – Gujarat Government Scheme Geo-Intelligence & Grassroots Monitoring Platform. "Mapping Government Schemes. Measuring Ground-Level Impact."
2. **Project Objective:** Provide an interactive geographic intelligence system that explores aggregate scheme reach across Gujarat: State (34 Districts) → District (all 34 districts) → Sub-district/Taluka (309 Talukas) → Village Level (19,201 Villages). Displays beneficiary participation, financial disbursements, and application statuses with strict privacy preservation. [PRD](docs/01-product/PRD.md).
3. **Current Project Phase:** Phase 2 (Implementation & Master Hierarchy Ingestion) Complete. Full 34-District, 309-Taluka, 19,201-Village LGD master directory parsed and integrated; notebook-specified 4-tier drill-down active.
4. **Approved Project Scope:** Interactive 4-level administrative drilldown (State → District → Taluka → Village); 5 Core Gujarat State WCD schemes + 7 notebook-specified schemes for women, housewives, and women entrepreneurs. [SCOPE](docs/01-product/SCOPE.md).
5. **Current Architecture Summary:** Next.js 16 App Router, React 19, TypeScript 5.8+, modular component architecture (`src/components/layout`, `src/components/map`, `src/components/pages`, `src/components/shared`), Apache ECharts 6.1+ for data analytics, interactive SVG multi-tier drilldown GIS system, and PostgreSQL 16 + PostGIS schema readiness. [TRD](docs/02-technical/TRD.md) and [Architecture](docs/02-technical/architecture.md).
6. **Approved Technology Stack:** Next.js 16.4+, React 19, TypeScript 5.8+, Apache ECharts 6.1+, PostgreSQL 16 + PostGIS, Node.js pg client, Lucide icons, Zod validation. [ADR Index](docs/adr/README.md).
7. **Current Database Design Reference:** 14 relational tables in 3NF covering `admin_units`, `admin_unit_boundaries`, `schemes`, `scheme_versions`, `beneficiary_aggregates`, `scheme_applications_stats`, `scheme_financial_stats`, `data_sources`, `data_import_batches`, and `audit_logs`. [Data Model](docs/02-technical/data-model.md).
8. **Geographic Hierarchy:** Gujarat State (34 Districts including Vav-Tharad) → Bhavnagar Pilot District (11 Talukas: Bhavnagar Urban/Rural, Sihor, Umrala, Gariadhar, Palitana, Mahuva, Talaja, Ghogha, Jesar, Vallabhipur, Songadh) → Ghogha Pilot Taluka (48 Villages with school/panchayat venue mapping from user notebook, including Sarvodaya High School) → Village Level Scheme Intelligence. [Geographic Research](docs/03-data-gis/geographic-data-research.md).
9. **Scheme Scope:** 
   - *5 Core State WCD Pilot Schemes:* Vahali Dikri Yojana, Ganga Swarupa Arthik Sahay Yojana, Mahila Swavlamban Yojana, Mukhyamantri Matrushakti Yojana (MMY), Ganga Swarupa Punarlagna Arthik Sahay Yojana.
   - *5 Extended Schemes from User Notebook:* Pradhan Mantri Matru Vandana Yojana (PMMVY), Stand-Up India for Women, Pradhan Mantri Mudra Yojana (PMMY), Sukanya Samriddhi Yojana, Beti Bachao Beti Padhao (BBBP). [Scheme Research](docs/03-data-gis/scheme-research.md).
10. **Data Availability Status:** All active dashboard figures and coordinates currently use synthetic demo fixtures with verified administrative names. Status: `DEMO PREVIEW · HIGH FIDELITY`. [Data Availability Matrix](docs/03-data-gis/data-availability-matrix.md).
11. **Official Data Source References:** Local Government Directory (LGD), Gujarat WCD Department, Digital Gujarat Portal, CM Dashboard / GIL MIS, data.gov.in, Survey of India. [Data Sources](docs/03-data-gis/data-sources.md).
12. **Security & Privacy Principles:** Strictly aggregate counts; no PII (no Aadhaar, phone numbers, bank accounts, or names). Automatic small-number suppression ($k < 10$) applied to sensitive categories per DPDP Act 2023. [Security](docs/09-security/security.md) & [Privacy](docs/09-security/privacy.md).
13. **Coding Standards:** Strict TypeScript, clean component boundaries, modular pages, reusable KPICards, centralized business metrics (`src/lib/metrics.mjs`). [Coding Standards](docs/04-engineering/coding-standards.md).
14. **Design Principles:** Professional Government Geo-Intelligence theme (Deep Navy `#091e38`, Government Blue `#147da0`, Accent Teal `#0f766e`, Saffron/Gold `#f59e0b`, Clean Slate background); dual font pairing (Inter + Noto Sans Gujarati); responsive mobile drawer; reduced-motion compliance. [Design System](docs/07-design/design-system.md).
15. **Current Implementation Status:** Complete enterprise rebuild verified on Next.js 16 (Turbopack) at `http://localhost:3000`. Features:
    - Authentic Gujarat RTO Codes (`GJ-01` through `GJ-37` and `GJ-39`): Completely aligned with official RTO directory (GJ-01 Ahmedabad, GJ-02 Mehsana, GJ-03 Rajkot, GJ-04 Bhavnagar ⭐, GJ-05 Surat, GJ-06 Vadodara, GJ-07 Kheda/Nadiad, GJ-18 Gandhinagar, GJ-39 Vav-Tharad, etc.).
    - Zero Poster Clutter: All static graphic posters, poster cards, and fullscreen zoom modals permanently removed per user directive.
    - Realistic 3D Satellite GIS Map for Bhavnagar: High-definition 3D realistic satellite terrain cutout with white glowing border, yellow highway roads, Gulf of Khambhat waters, and accurate town coordinate markers (Bhavnagar, Ghogha, Sihor, Palitana, Talaja, Mahuva, Vallabhipur, Umrala, Gariadhar, Jesar, Vartej, Alang).
    - Thematic Administrative Taluka Map for Bhavnagar: Dedicated color-coded taluka boundary map view (`bhavnagar_thematic.png`) with interactive clickable taluka badges.
    - High-Definition Satellite Assets for Major Districts: Authentic satellite imagery wired for Ahmedabad (GJ-01), Gandhinagar (GJ-18), Vadodara (GJ-06), and all 34 districts.
    - View-Only Data Governance: All export/download triggers eliminated per government data policy; secure on-screen inspection audit mode active.
    - Seamless 4-Tier Drill-Down & Smooth Animations: State (34 Districts) → District (real subdistricts) → Taluka (real villages) → Village Venue (શાળા / પંચાયત) → Active Women, Housewife & Entrepreneur Schemes.
    - CM Dashboard CCU 2.0 & Digital Gujarat Indicators: Integrated DBT Aadhaar Bridge (ABPS 99.4%), Application Clearance Rate (82.6%), and Jan Samvad Feedback.
    - 100% Bilingual Gujarati (ગુજરાતી) and English.
    - 4/4 Tests Pass; Typecheck Clean (0 errors); Next.js Production Build succeeds in ~2s.
16. **Pending Microtasks:** Connecting live backend database and department data feeds. [Microtasks](docs/08-project-management/microtasks.md).
17. **Completed Microtasks:** TASK-001 through TASK-135 (Authentic RTO Codes GJ-01..GJ-39, Realistic 3D Satellite & Thematic Taluka Maps, Poster Elimination, Verification Pass).
18. **Known Blockers:** None for prototype evaluation. Official department data approvals (WCD/Panchayat) required for production government statistics.
19. **Open Technical Decisions:** Single Light/Dark Hybrid GIS Theme accepted; 4-tier drill-down architecture accepted; View-Only Data Policy enforced.
20. **Links to Project Documentation:** Complete index in [Documentation Map](docs/00-governance/DOCUMENTATION_MAP.md) and [Completeness Matrix](docs/00-governance/completeness-matrix.md).
21. **Last Updated Date:** 2026-11-01.
22. **Current Project Version:** 0.9.4 (Pixel-Perfect Node-to-Image Calibration, Strict Image-Fitted GIS Layer, Pure Satellite Cutouts for All Districts, Zero Posters).

---

## Readiness Levels
Current status is **L1-Prototype Complete & Verified** (runs on port 3000, 4/4 tests pass, typecheck clean, production build succeeds, all 14 workspaces fully interactive). Reference: [Readiness Levels](docs/00-governance/readiness-levels.md).
