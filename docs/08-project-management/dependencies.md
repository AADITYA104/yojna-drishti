# Dependencies

## Prototype lock (checked 2026-11-01)

The Next.js/React prototype is installed and locked in `package-lock.json`. Exact resolved versions below came from `npm ls --depth=0`; production dependency audit returned zero advisories on 2026-11-01. The full audit reports moderate advisories in development tooling; review before a production release. Packages marked **foundation** are installed for the selected stack but are not yet wired to official GIS/analytics data.

| Package | Resolved | Purpose/status |
|---|---:|---|
| Node.js | 24.12.0 in build environment; minimum 20.9.0 | Runtime |
| Next.js | 16.4.3 | App Router + API |
| React / React DOM | 19.3.1 | UI |
| TypeScript | 5.9.3 | Strict typecheck |
| lucide-react | 0.468.0 | Icons |
| MapLibre GL JS | 6.16.0 | **Foundation:** official GIS boundary files and basemap decision still pending |
| Apache ECharts | 6.1.0 | Synthetic dashboard charts |
| Zod | 4.6.7 | **Foundation:** request validation not yet wired to the API routes |
| pg | 8.23.1 | PostgreSQL connection in `src/server/db` and local scripts |
| ESLint / eslint-config-next | 9.39.5 / 16.4.3 | Lint |
| @types/node / @types/pg / @types/react / @types/react-dom | 22.20.5 / 8.23.1 / 19.3.0 / 19.3.0 | Type definitions |

The prototype does not yet include authentication, next-intl, an ORM, upload parsers, PDF/XLSX exporters, or the test tools listed in the intended list below. Add them only with their dependent implementation tasks. Licensing and bundle-size review are still required before production.

## Intended production list

The rows below are future decisions and are not installed unless listed in the lock above. At the relevant task, record version, licence, size and reason.

| Package / service | Role | Why needed | Alternative considered | Status |
|---|---|---|---|---|
| Node.js LTS | Runtime | Next.js | Bun, Deno (not chosen) | Node 20.9+ |
| Next.js, React | App framework | UI and API in one deploy | Separate backend | Prototype installed; production support policy still applies |
| TypeScript | Language | Type safety | - | Prototype installed |
| Tailwind CSS | Styling | Token-driven utility styling | CSS modules | TBD |
| Accessible headless UI primitives | Dialogs, menus, tabs | A11y | Hand-built | choice TBD |
| MapLibre GL JS | Map | Open-source WebGL maps | Leaflet, Mapbox GL | TBD |
| Apache ECharts | Charts | Rich, accessible-able charts | Recharts, Chart.js | TBD |
| next-intl | i18n | App Router support | Custom | TBD |
| Zod | Validation | Shared schemas | Valibot | TBD |
| Drizzle ORM + pg driver | DB access | Typed queries plus raw SQL | Prisma (weaker PostGIS) | TBD (ADR-0006) |
| Auth library (Auth.js or equivalent) | Authentication | Maintained, sessions, MFA support | Hand-rolled (rejected) | TBD (ADR-0005) |
| PostgreSQL, PostGIS, pg_trgm, unaccent, citext | Database | Spatial and search | - | version TBD |
| Spreadsheet parser, CSV parser | Import | XLSX and CSV | - | TBD, audit required |
| PDF generation library | Export | PDF reports | Headless browser print | TBD |
| Vitest, Playwright, axe | Testing | Per testing.md | Jest, Cypress | TBD |
| ESLint, Prettier, jscpd-like duplicate check | Quality | Low-LOC enforcement | - | TBD |
| GitHub Actions | CI/CD | Part 0 s11 | - | n/a |
| Fonts: Inter, Noto Sans Gujarati | Typography | Per design | System fonts | licences to record |
| Basemap provider | Tiles | Optional | Plain fallback | OQ-05 |

Policy: no package added without a row and a reason; remove unused packages in each release.
