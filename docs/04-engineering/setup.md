# Setup Guide

**Status: PLANNED. No application code exists yet.** Commands below describe the intended flow and become real only after TASK-010 and later tasks create the scripts; each section is marked with the task that makes it true. Never run a command from this guide that is not yet implemented.

## 1. Prerequisites (available now)
Git; Node.js LTS (version recorded at TASK-010); a package manager (recorded in dependencies.md); PostgreSQL with PostGIS (local or container); Python only if ADR-0001 exception is used.

## 2. Clone (available now)
`git clone <repository URL>` then `cd yojana-drishti`. Repository URL is a required input (OQ-09).

## 3. Install (after TASK-010)
Install with the lockfile frozen (command per chosen package manager).

## 4. Environment (after TASK-011)
Copy `.env.example` to `.env.local`, fill values per environment.md. Startup fails with a clear message if a required value is missing.

## 5. Database (after TASK-020)
Create database; enable extensions postgis, pg_trgm, unaccent, citext, pgcrypto (migrations perform CREATE EXTENSION IF NOT EXISTS where permitted).

## 6. Migrations (after TASK-020 to TASK-022)
Run the migrate script. Verify with the migration status check.

## 7. Synthetic seed (after TASK-023)
Run the demo seed script; sets DEMO mode data only. Requires DEMO_MODE_ENABLED=true to be visible.

## 8. GIS data (after TASK-005, 006, 030, 031)
Place raw files under data/raw (git-ignored), record sha256 in docs, run the LGD and boundary importers; read the validation report before publishing.

## 9. Development server (after TASK-010)
Run the dev script; open the printed local URL.

## 10. Tests (after TASK-090 to TASK-093)
Unit, integration (needs PostGIS container), GIS, end-to-end scripts.

## 11. Production build (after TASK-010, TASK-101)
Run build and start scripts; deployment per deployment.md.

## Troubleshooting log
To be filled with real issues as they occur.
