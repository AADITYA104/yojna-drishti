# Disaster Recovery

## Objectives (provisional; confirm with owner)
RPO 24 hours, RTO 4 hours. Public read-only mode acceptable during recovery.

## Backups
Daily full logical or snapshot backup of PostgreSQL; WAL archiving if the host supports point-in-time recovery (recommended). Raw upload store replicated or backed up daily. Encrypted, separate credentials, stored in a different failure domain. Retention 30 daily, 12 monthly (provisional).

## Restore procedure (to be executed and timed in TASK-102)
1. Provision scratch database with PostGIS extensions.
2. Restore latest backup.
3. Run migration status check.
4. Compare row counts for key tables against production snapshot; run boundary validity check; run lineage sample check.
5. Record duration and result below.

| Drill date | Duration | Result | Notes |
|---|---|---|---|
| - | - | NOT RUN | - |

## Incident types and first actions
| Incident | First actions |
|---|---|
| Bad data published | Rollback batch (rollback-plan.md); audit; notify reviewer |
| DEMO data visible as real | Unpublish immediately, run leak scan, post-incident review |
| Database loss | Switch to maintenance page, restore, verify |
| Credential leak | Rotate secrets, invalidate sessions, review audit log |
| Boundary data licence complaint | Unpublish dataset, escalate to owner |
| Basemap outage | Automatic fallback; no action |

## Communication
Owner contact list and escalation path are required inputs (OQ-08).

## Post-incident
Blameless review within 5 working days; update risk-register.md and runbook.
