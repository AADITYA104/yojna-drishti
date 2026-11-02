# GitHub Actions

**Status: PLANNED.** Workflows are created only for checks that exist (TASK-100, TASK-101). A workflow with skipped or empty test steps is not allowed.

## ci.yml (triggers: pull_request, push to main)
Permissions: contents read only. Concurrency: cancel superseded runs. Jobs:
1. install: frozen lockfile install (fails if lockfile out of date).
2. lint-format: lint, formatter check, duplicate-code check.
3. typecheck.
4. unit: unit tests.
5. integration: PostGIS service container; run migrations then integration and GIS tests.
6. build: production build.
7. audit: dependency audit (fail on high or critical), secret scan.
8. migration-check: apply all migrations to empty DB and roll back last; confirm schema matches expected.
9. e2e: Playwright against a built app with DEMO seed (main and release branches; on PRs when relevant paths change).
Environment variables in CI: test-only values; no production secrets. Failure behaviour: any failed required job blocks merge via branch protection.

## deploy.yml (trigger: manual dispatch or tag)
Separate from CI. Uses GitHub Environments (staging, production). Production requires reviewer approval and is restricted to protected tags. Steps: checkout tag, build, run migrations with migrator credentials (backup first), deploy, run smoke test, post result. Secrets only from environment secrets, masked in logs; no printing of env.

## scheduled.yml (cron)
Weekly dependency audit; daily data-quality and DEMO-leak check against staging.

## Rules
Pin third-party actions by commit SHA; least-privilege tokens; no pull_request_target with untrusted code; artifacts exclude secrets; caches keyed by lockfile.
