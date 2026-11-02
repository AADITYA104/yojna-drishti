# Deployment

## Environments
| Env | Purpose | Data | Hosting |
|---|---|---|---|
| local | Development | DEMO seed | Developer machine |
| staging | Verification, demo to stakeholders | DEMO plus test imports | TBD (OQ-06) |
| production | Public service | VERIFIED only; DEMO disabled | TBD: must satisfy government hosting and security requirements for the data it holds |

## Hosting decision
Not made. Demo with synthetic data may use a general platform. Any deployment carrying real unpublished or sensitive departmental data requires approved government hosting (blueprint caution). Managed Postgres with PostGIS support is mandatory. Recorded in ADR-0011 (PROPOSED).

## Release steps
1. Tag release candidate on main; CI green.
2. Deploy to staging via deploy.yml; run migrations; smoke tests; manual checks.
3. Run production-readiness checklist items relevant to the change.
4. Approver approves production environment.
5. Backup, migrate, deploy, smoke test.
6. Monitor 30 minutes; record in changelog and progress-report.

## Migrations
Expand-then-contract: additive changes first, application deploy, then cleanup in a later release. Every migration has a documented rollback or is explicitly irreversible with backup requirement.

## Configuration
Per environment variables (environment.md). DEMO_MODE_ENABLED false in production.

## Zero-downtime
Blue/green or rolling on platform; health checks gate traffic.

## Post-deploy verification
Health, smoke journey, data freshness, alert test, DEMO leak scan.
