# Technical Requirements Document (TRD)

Version 0.1.0 | 2026-10-31 | Status DRAFT. Library versions below are policy only; exact versions are chosen and recorded in dependencies.md at TASK-010 after checking current stable releases (not verified in this pass).

## 1. Architecture summary
Modular monolith: one Next.js (App Router, TypeScript strict) application serving UI and a versioned JSON API under /api/v1, PostgreSQL with PostGIS, server-side aggregation, a small import module. No microservices, Redis, Kafka or search engine (ADR-0001).

## 2. Stack
| Concern | Choice | ADR |
|---|---|---|
| UI | Next.js App Router, React, TypeScript strict, Tailwind CSS, accessible headless components | ADR-0001 |
| Map | MapLibre GL JS, GeoJSON per level, vector tiles if needed | ADR-0004 |
| Database | PostgreSQL + PostGIS, pg_trgm, unaccent | ADR-0002 |
| Data access | Drizzle ORM plus parameterised raw SQL for spatial queries (provisional) | ADR-0006 |
| Validation | Zod schemas shared by server and client | ADR-0006 |
| Charts | Apache ECharts via one wrapper component | ADR-0008 |
| i18n | next-intl with one catalog per language | ADR-0009 |
| Auth | Maintained library chosen at TASK-080 (provisional Auth.js), MFA for admin roles | ADR-0005 |
| ETL | TypeScript importers; Python only if a spatial task cannot be done in SQL (decision recorded if used) | ADR-0001 |
| Tests | Vitest, Playwright, axe | testing.md |
| CI | GitHub Actions | github-actions.md |

## 3. Cross-cutting requirements
- Single error contract; request IDs on every request (error-handling.md).
- Server-side authorisation on every admin route using one guard function (roles-and-permissions.md).
- Config only through the typed env module; no direct process.env use elsewhere.
- Constants (levels, enums, thresholds, colours via tokens) defined once and imported.
- Metric formulas only in the metrics module.
- No unused dependencies; each package justified in dependencies.md.

## 4. Data contracts
Every statistics response has the envelope:
```
{ "data": <payload>, "meta": { "data_mode": "VERIFIED|DEMO|ARCHIVED", "financial_year": "2025-26", "period": {...},
  "sources": [ { "id": "...", "name": "...", "url": "...", "verification_status": "..." } ],
  "data_as_of": "YYYY-MM-DD", "generated_at": "ISO", "requestId": "..." } }
```
Each metric value: `{ "value": number|null, "unit": "count|inr|percent", "reason_code": string|null, "suppressed": boolean }`.

## 5. Performance requirements
See NFR-PERF-01 and performance.md. Server-side SQL aggregation with indexes; pagination on lists (default 50, max 200); ETag and Cache-Control for boundaries; revalidation on publish.

## 6. Security requirements
See security.md. Parameterised SQL only; Zod validation at every boundary; CSRF protection on cookie-authenticated mutations; secure headers (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, frame-ancestors); rate limiting; upload hardening; least-privilege DB roles (app role cannot alter schema, cannot modify audit_logs).

## 7. Reliability
Idempotent imports, transactional publish, health endpoint, backups with restore drills, safe fallback states in UI (data unavailable, map fallback).

## 8. Failure scenarios
| Scenario | Behaviour |
|---|---|
| Boundary payload fails to load | Retry once, then list view of units with error banner |
| Stats API 5xx | Panel shows Could not load, retry, requestId; map remains usable |
| Basemap provider down | Fallback plain background |
| Import crash | Batch marked rejected, no published change |
| DB unavailable | Health fails, static error page, no stack trace |

## 9. Testing requirements
Test pyramid and gates in testing.md; trace in REQUIREMENTS-TRACEABILITY.md.

## 10. Known limitations
Village boundary availability unknown (R-01). Library versions unverified. Hosting undecided (OQ-06).

## 11. Open questions
OQ-03 auth library; OQ-04 ORM; OQ-05 basemap provider; OQ-06 hosting.
