# API Specification (API_SPECIFICATION)

Base path /api/v1. JSON, UTF-8. Dates ISO 8601. LGD codes are strings. Status: DESIGN, nothing implemented.

## <a id="common-query"></a>Common
Query parameters on statistics endpoints: `fy` (YYYY-YY, default latest published), `period` (fy|quarter|month), `scheme` (scheme code, optional), `mode` (VERIFIED default; DEMO only if the server has DEMO_MODE_ENABLED=true; ARCHIVED needs `asof`), `lang` (en|gu), `asof` (date for hierarchy).
Pagination: `page` (default 1), `pageSize` (default 50, max 200). Response meta.pagination { page, pageSize, total }.
Response envelope: see TRD s4. Errors: see error-handling.md, body `{ "error": { "code", "message", "requestId", "details"? } }`.
Auth: Public endpoints need none. Admin endpoints need a session cookie, CSRF header on mutations, and the listed role. Rate limits (provisional): public 120/min/IP, search 60/min, admin 60/min/user, auth 10/min/IP.

## Common errors
400 VALIDATION_FAILED; 401 UNAUTHENTICATED; 403 FORBIDDEN; 404 NOT_FOUND; 409 CONFLICT (e.g. DUPLICATE_BATCH); 413 PAYLOAD_TOO_LARGE; 415 UNSUPPORTED_MEDIA_TYPE; 422 UNPROCESSABLE (business rule); 429 RATE_LIMITED; 500 INTERNAL; 503 UNAVAILABLE.

## <a id="geo-boundaries"></a>Geography (public)
| Method | URL | Purpose | Key params | Response |
|---|---|---|---|---|
| GET | /geo/units | List units | level (required), parent (lgd), q, asof, page | [{ lgd_code, level, name_en, name_gu, parent_lgd, rural_urban, valid_from, valid_to }] |
| GET | /geo/units/{level}/{lgd} | One unit with ancestors and child counts | asof | unit + ancestors[] + children_count |
| GET | /geo/<a id="geo-search"></a>search | Name search, Gujarati or English | q (min 2 chars), level?, limit (max 20) | [{ lgd_code, level, name_en, name_gu, path: [{level, lgd, name}] }] |
| GET | /geo/boundaries | GeoJSON FeatureCollection | level (required), parent (required for taluka, village), detail (low\|mid\|full), asof | FeatureCollection; properties: lgd_code, level, name_en, name_gu; ETag, immutable cache per boundary_version |
Validation: level in enum; parent must exist and be the correct level; q trimmed, max 80 chars. 404 if parent unknown.

## Schemes (public)
| GET | /schemes | List with status and latest version summary | status? | [{ code, name_en, name_gu, department, status, verification_status, verified_on }] |
| GET | /schemes/{code} | Detail: versions, eligibility rules, benefits (by type), documents, sources | version? | scheme with versions[], rules[], benefits[], sources[] |
Fields lacking an official source return `verification_status: unverified` and the UI shows Not yet verified.

## Statistics (public)
| Method | URL | Purpose | Response data |
|---|---|---|---|
| GET | /stats/overview | State KPIs | { units: {districts, talukas, villages}, active_schemes, applications: {received, approved, pending, rejected}, beneficiary_enrolments, sanctioned_inr, disbursed_inr } each a metric value; plus per-scheme and per-district series |
| GET | /stats/districts/{lgd} | District panel | profile, children summary, per-scheme stats, financial by benefit_type, trend, state comparison |
| GET | /stats/talukas/{lgd} | Taluka panel | similarly + village table |
| GET | /stats/villages/{lgd} | Village panel | profile, population (+reference_year), 5 scheme cards, trend, taluka comparison where comparable |
| GET | /stats/choropleth | Values per child unit for map colouring | level, parent, scheme, metric (beneficiaries, coverage, approval_rate, pending_rate, disbursed_inr...), fy | { classes: [..breaks..], values: [{ lgd_code, value, reason_code, suppressed }] } |
| GET | /stats/series | Time series | unit, level, scheme, metric, from_fy, to_fy | [{ period, value, reason_code }] |
Every response has meta (mode, FY, sources, as_of). Unavailable values are null with reason_code.

## <a id="compare"></a>Comparison (public)
GET /compare?level=district&units=bhavnagar_lgd,amreli_lgd&metric=approval_rate&scheme=...&fy=... > { rows: [{ lgd_code, value, reason_code }], comparable: boolean, warnings: [codes], rank: null if not comparable }. Limit 5 units. Taluka and village comparison require the same parent family.

## <a id="export"></a>Export (public, rate limited)
GET /export?type=csv|xlsx|pdf&view=<view id>&unit=&fy=&scheme= > file with data mode badge, sources sheet, definitions. Max rows 50,000. CSV cells starting with = + - @ are prefixed with an apostrophe.

## Sources (public)
GET /sources > registered sources with name, authority, URL, access class public-safe fields only. GET /sources/{id}.

## Health
GET /health > { status, version, db: ok|fail, migrations: current|pending } without internals; GET /health/ready for orchestration.

## Auth
POST /auth/login, POST /auth/logout, POST /auth/mfa/verify, GET /auth/me. Exact shape depends on library (ADR-0005). Lockout after 5 failures for 15 minutes (provisional).

## Admin (all require session; role in brackets)
| Method | URL | Role | Purpose |
|---|---|---|---|
| POST | /admin/imports | data_manager | multipart upload: file, dataset_type, source_id, data_mode; returns batch id |
| GET | /admin/imports | data_manager, reviewer, super_admin | list batches, filters |
| GET | /admin/imports/{id} | same | detail, counts, errors (paged), delta vs published |
| POST | /admin/imports/{id}/validate | data_manager | (re)run dry-run |
| POST | /admin/imports/{id}/submit | data_manager | move to in_review |
| POST | /admin/imports/{id}/approve | department_reviewer | approve; refused if actor = uploader |
| POST | /admin/imports/{id}/reject | department_reviewer | reject with reason |
| POST | /admin/imports/{id}/publish | department_reviewer, super_admin | publish transaction |
| POST | /admin/imports/{id}/rollback | department_reviewer, super_admin | rollback |
| GET/POST/PATCH | /admin/schemes, /admin/schemes/{code} | data_manager (edit), reviewer (approve versions) | create new version, never overwrite |
| GET/POST/PATCH | /admin/sources | data_manager | manage data_sources |
| GET | /admin/geo/reconciliation | data_manager | latest reconciliation report |
| GET/POST/PATCH | /admin/users, /admin/users/{id}/roles | super_admin | user and role management |
| GET | /admin/audit-logs | super_admin, reviewer (read) | filter by actor, entity, date; no write endpoints exist |
Validation: every body validated by Zod; unknown fields rejected; ids are UUIDs; file allow-list and size limits per import-pipeline.md. All mutations write exactly one audit row.

## Versioning and compatibility
Breaking changes create /api/v2; additive changes allowed within v1. Changes trigger review of this file, tests, changelog and frontend contracts.

## Additions v0.2.0
- Common query: `from` and `to` (ISO dates) with `granularity` (month, quarter, fy) in addition to `fy`; invalid combinations return 400 with reason; unsupported granularity returns 422 GRANULARITY_UNAVAILABLE.
- Global search: GET /search?q= returns groups { geography: [...], schemes: [...], pages: [...] } (FR-UX-04); /geo/search remains for map-only search.
- Coverage block: every statistics response includes meta.coverage { units_expected, units_with_boundary, units_reporting, coverage_label } (FR-DAT-08).
- Scheme filter: GET /schemes?target_group= (FR-SCH-03).
- Time playback: GET /stats/choropleth accepts `period` identifiers and GET /periods lists available periods for a scheme and level (FR-UX-03).
- Issues: POST /issues (public, rate limit 5 per hour per IP) body { unit, scheme?, metric, period?, message, contact? }; admin GET/PATCH /admin/issues.
- Taluka children: GET /geo/units?parent=<taluka>&include=no_boundary returns villages lacking polygons (FR-GEO-14).
