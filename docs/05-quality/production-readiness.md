# Production Readiness Checklist

Each item: PASS or FAIL with evidence link and date. All items default to NOT CHECKED. A single FAIL in a critical (C) item blocks release.

| # | Item | Crit | Pass criterion | Result |
|---|---|---|---|---|
| 1 | Environment configuration | C | All required variables present and validated; production DEMO_MODE_ENABLED=false | NOT CHECKED |
| 2 | Database connection | C | App connects with least-privilege role; migrator role separate | NOT CHECKED |
| 3 | Migration status | C | No pending migrations; migration check job passed | NOT CHECKED |
| 4 | Secrets | C | No secrets in repo (scan clean); rotated since staging | NOT CHECKED |
| 5 | TLS | C | HTTPS only; HSTS; certificate valid over 21 days | NOT CHECKED |
| 6 | Secure headers | C | Header test passes (CSP, HSTS, nosniff, frame-ancestors, referrer) | NOT CHECKED |
| 7 | CORS | C | Only approved origins | NOT CHECKED |
| 8 | Access controls | C | Bypass tests pass; audit_logs grants verified | NOT CHECKED |
| 9 | Logging | M | Logs structured, redaction verified | NOT CHECKED |
| 10 | Monitoring and alerts | C | Alerts fire in a test | NOT CHECKED |
| 11 | Backups | C | Last backup within 26 h | NOT CHECKED |
| 12 | Restore verification | C | Restore drill within 90 days, counts match | NOT CHECKED |
| 13 | Health checks | C | /health and /health/ready correct under DB failure test | NOT CHECKED |
| 14 | Smoke tests | C | Journey: state > village > panel passes on production URL | NOT CHECKED |
| 15 | Error monitoring | M | Test exception captured without PII | NOT CHECKED |
| 16 | Rollback readiness | C | Previous release deployable; DB rollback plan tested | NOT CHECKED |
| 17 | Data-source freshness | C | No source older than its interval without visible age indicator | NOT CHECKED |
| 18 | Map provider availability | M | Fallback verified by blocking provider | NOT CHECKED |
| 19 | Build verification | C | Reproducible build from tagged commit; lockfile frozen | NOT CHECKED |
| 20 | DEMO leakage | C | Scan finds no DEMO row without badge; production has no DEMO rows | NOT CHECKED |
| 21 | Data licences | C | Every published dataset has licence note and redistribution check | NOT CHECKED |
| 22 | Privacy | C | No personal data; privacy notice live; suppression tests pass | NOT CHECKED |
| 23 | Accessibility | M | No AA failure on core journeys | NOT CHECKED |
| 24 | Performance | M | Budgets met or accepted risk recorded | NOT CHECKED |
| 25 | Documentation | M | Completeness matrix has no unexplained gaps | NOT CHECKED |

"The site opens in a browser" satisfies none of these.
