# Logging and Monitoring

## Log format
One JSON object per line: timestamp, level, requestId, route, method, status, durationMs, userId (internal id only), role, message, and context (batchId, unit lgd, etc.). Levels: error, warn, info, debug (debug off in production).

## Redaction
Never log: passwords, tokens, cookies, Authorization headers, full IPs (hash), uploaded file contents, email addresses outside audit contexts. Redaction list in one module.

## What is logged
Requests (info, sampled for health), errors (error with stack in server logs only), auth events, import stages, publish and rollback, slow queries over 500 ms (warn), rate-limit hits, CSP reports (if enabled).

## Monitoring
| Signal | Method | Alert (provisional) |
|---|---|---|
| Availability | /health/ready probe every 1 min | 3 consecutive failures |
| Error rate | 5xx share | greater than 2 percent over 5 min |
| Latency | p95 of stats endpoints | greater than 1 s over 10 min |
| DB | connections, slow queries, disk | disk above 80 percent |
| Imports | failed batches | any failure notifies Data Manager |
| Data freshness | data_as_of age vs source interval | stale source flagged |
| Boundary validity | scheduled check | any invalid geometry |
| DEMO leakage check | scheduled | any hit is critical |
| Backups | last success time | older than 26 h |
| TLS expiry | certificate check | 21 days |
| Dependency advisories | CI audit and weekly job | high or critical |

## Error monitoring
Optional hosted service requires an ADR and PII scrubbing configuration (integrations.md).

## Dashboards
Operational dashboard in the chosen platform; not part of the public product.

## Retention
Application logs 90 days; audit logs per security.md.

## Scheduled jobs (TASK-085)
| Job | Frequency | Action on failure |
|---|---|---|
| Retention purge (issue contacts 90 days, raw uploads 12 months, logs per policy) | daily | alert; never purge audit logs |
| Data-quality checks DQ-04, DQ-07, DQ-08 on published data | daily | admin dashboard alert |
| DEMO leak scan (DEMO row visible without badge; DEMO in production) | daily | critical alert, unpublish |
| Source freshness | daily | stale marker on UI |
| Boundary validity | weekly | alert |
| Backup age and last restore drill age | daily | alert |
Jobs are idempotent, logged with requestId and run by the platform scheduler or a protected CLI invoked from a scheduled workflow.
