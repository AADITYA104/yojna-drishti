# Local Infrastructure Specification

Purpose: a reproducible local development stack. This is a specification; the files are created at TASK-010 and TASK-020.

## Services
| Service | Purpose | Notes |
|---|---|---|
| PostgreSQL with PostGIS | Database | Container image that includes PostGIS; port bound to localhost only; named volume for data; extensions created by migration |
| Test database | Isolated integration tests | Separate database name or container, recreated per run |
| Application | Next.js dev server | Runs on host or container |
| Mail catcher (optional) | Capture admin emails | Only if email flows exist |

## Files to be created
docker-compose.yml (services above, healthcheck on database), .dockerignore, Dockerfile for production build (multi-stage, non-root user, no dev dependencies), .nvmrc or engines field, .editorconfig, .gitignore (env files, data/raw, uploads, build output), .gitattributes (normalise line endings), LICENSE decision (OQ), CODEOWNERS, PR template, issue templates, dependabot or renovate config (update policy).

## Rules
No credentials in compose file beyond local throwaway defaults documented as local-only; uploads directory outside web root and git-ignored; data/raw never committed (contains licensed data) but file hashes are recorded.

## Verification
A fresh clone reaches a running app with DEMO data using only documented commands (setup.md); this is a release gate (TASK-103).
