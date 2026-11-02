# Environment Variables

All variables are validated at startup by src/lib/config/env.ts. Secret classes: PUBLIC (safe in browser), INTERNAL (server config), SECRET (credential). Environments: L local, S staging, P production.

| Name | Purpose | Required | Placeholder | Format | Env | Class |
|---|---|---|---|---|---|---|
| NODE_ENV | Runtime mode | yes | production | development, test, production | L S P | INTERNAL |
| APP_BASE_URL | Canonical URL | yes | https://example.invalid | https URL | L S P | INTERNAL |
| DATABASE_URL | PostgreSQL connection | yes | postgres://user:pass@host:5432/db | URL | L S P | SECRET |
| DATABASE_URL_MIGRATE | Migration role connection | CI/deploy | postgres://migrator:... | URL | S P | SECRET |
| DB_STATEMENT_TIMEOUT_MS | Public query timeout | no (5000) | 5000 | integer | L S P | INTERNAL |
| AUTH_SECRET | Session signing key | yes | change-me-32-bytes-min | 32+ random bytes | S P | SECRET |
| AUTH_URL | Auth callback base | yes | https://example.invalid | URL | S P | INTERNAL |
| MFA_ISSUER | MFA issuer label | no | YojanaDrishti | text | S P | INTERNAL |
| DEMO_MODE_ENABLED | Allow DEMO data | no (false) | false | true or false | L S (P false) | INTERNAL |
| SUPPRESSION_K_DEFAULT | Small-number threshold | no (10) | 10 | integer | L S P | INTERNAL |
| SUPPRESSION_K_SENSITIVE | Threshold for sensitive schemes | no (20) | 20 | integer | L S P | INTERNAL |
| UPLOAD_MAX_MB | Max import size | no (25) | 25 | integer | L S P | INTERNAL |
| UPLOAD_STORAGE_PATH or STORAGE_BUCKET | Raw upload store | yes | /var/data/uploads | path or name | S P | INTERNAL |
| STORAGE_CREDENTIALS | Bucket credentials if used | conditional | ... | provider specific | S P | SECRET |
| NEXT_PUBLIC_BASEMAP_STYLE_URL | Basemap style | no | https://example.invalid/style.json | URL | L S P | PUBLIC (no key inside URL unless provider allows domain-restricted public keys) |
| BASEMAP_API_KEY | Server-side proxy key if proxied | no | ... | string | S P | SECRET |
| EMAIL_PROVIDER_API_KEY | Transactional email | conditional | ... | string | S P | SECRET |
| ERROR_MONITOR_DSN | Error monitoring | no | ... | URL | S P | SECRET |
| LOG_LEVEL | Log verbosity | no (info) | info | error, warn, info, debug | L S P | INTERNAL |
| RATE_LIMIT_PUBLIC_PER_MIN | Public limit | no (120) | 120 | integer | S P | INTERNAL |

Rules: `.env.example` lists names and placeholders only; `.env*` real files are git-ignored; secrets live in the host or GitHub environment secrets; any new variable updates this table, env.ts, and .env.example in the same change. Placeholders above are not valid credentials.

| SOLO_OWNER_MODE | Allow self-approval of DEMO batches in non-production | no (false) | false | true or false; startup fails if true in production | L S | INTERNAL |
