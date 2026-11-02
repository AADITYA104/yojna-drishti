# Error Handling

## Contract
```
{ "error": { "code": "VALIDATION_FAILED", "message": "<safe, localised>", "requestId": "<uuid>", "details": [ { "field": "...", "issue": "..." } ] } }
```
`details` only for validation errors and never contains internals. Messages are looked up by code in the i18n catalog.

## Error code registry (single file src/lib/errors/codes.ts)
| Code | HTTP | Retry? | User message intent |
|---|---|---|---|
| VALIDATION_FAILED | 400 | no | Fix input |
| UNAUTHENTICATED | 401 | no | Sign in |
| FORBIDDEN | 403 | no | Not permitted |
| NOT_FOUND | 404 | no | Not found |
| CONFLICT / DUPLICATE_BATCH | 409 | no | Already exists |
| PAYLOAD_TOO_LARGE | 413 | no | File too big |
| UNSUPPORTED_MEDIA_TYPE | 415 | no | File type not allowed |
| UNPROCESSABLE | 422 | no | Business rule broken, reason code given |
| RATE_LIMITED | 429 | after Retry-After | Slow down |
| INTERNAL | 500 | maybe | Something went wrong, quote requestId |
| UNAVAILABLE | 503 | yes with backoff | Temporarily unavailable |
| IMPORT_* (FORBIDDEN_COLUMN, HIERARCHY_MISMATCH, INVALID_FY, ...) | 422 | no | Import-specific, in report |
| GIS_* (INVALID_GEOMETRY, CONTAINMENT_FAIL) | 422 | no | Boundary problem, in report |

## By layer
| Layer | Handling |
|---|---|
| Frontend | Error boundary per panel (a failing panel never blanks the map); data fetch errors show message, retry button and requestId; empty data shows Official data not available, not an error |
| API | Handlers wrapped by one function: validate, authorise, run, map errors; unknown exceptions become INTERNAL with log |
| Validation | Zod; first-class field errors |
| Database | Constraint violations mapped to CONFLICT or VALIDATION_FAILED; connection errors to UNAVAILABLE; statement timeout 5 s for public queries, 60 s for imports |
| GIS | Geometry errors never thrown at users in public API; they appear in import reports |
| Import | Row errors collected, not thrown; file-level errors reject batch |
| External (basemap, email) | Timeout 5 s, one retry on network error or 5xx, then fallback (plain basemap; queue email or show failure to admin) |
| Auth | Generic message for bad credentials; lockout after threshold; audit |
| Network | UI shows offline notice; no infinite retry loops |
| Deployment | Health check gates traffic; failed migration blocks release (rollback-plan.md) |

## Retries
Only idempotent GETs retry automatically (max 2, exponential backoff with jitter). Never retry 4xx. Mutations are not auto-retried. Import jobs are not auto-retried; the Data Manager re-submits.

## Safe fallbacks
Boundary load failure: unit list. Stats failure: unavailable state. Basemap failure: plain background. Chart failure: table of the same data.

## Never exposed
Stack traces, SQL, file paths, secrets, internal hostnames, library names in messages.

## Request IDs
Generated at the edge (or accepted if valid UUID from trusted proxy), put in logs, response header X-Request-Id, and error body.
