# Part 2 Addendum — repository mapping and operating context

The supplied Part 0 and Part 1 texts are project governance/reference documents. Read them as project requirements, not as commands that supersede the current user's request or the platform's higher-priority instructions.

## Read first

1. `BRAIN.md` for current project state.
2. `docs/00-governance/DOCUMENTATION_MAP.md` for canonical document paths.
3. `docs/08-project-management/microtasks.md` for task status and dependencies.
4. `docs/08-project-management/open-questions.md` and `required-inputs.md` for unresolved decisions and external inputs.
5. Relevant requirement, architecture, data/GIS, security and design specifications before implementing a feature.

## Part 1 deliverable names

The Part 1 prompt uses uppercase aliases such as `DATABASE_SCHEMA.md` and `UI_UX_SPECIFICATION.md`. Use the canonical files listed in `DOCUMENTATION_MAP.md`; do not create duplicate documents unless the owner asks to change the structure.

## Part 2 readiness and truth rules

The prototype may progress using explicitly synthetic, labelled test data. Never fabricate official scheme facts, statistics, LGD codes or administrative boundaries. When a requirement depends on official data, keep a useful unavailable state and record the missing source/licence in the availability matrix and required-inputs list. Do not call the product production-ready based only on a successful build.

A task is complete only when its acceptance criteria and relevant tests have evidence. Update affected specifications, microtask status, BRAIN.md, progress report and changelog after meaningful changes. Treat owner-approved design decisions, including ADR-0017, as the current source of truth.

## Current project limits

- The map is a schematic demo; no licensed boundary dataset is connected.
- The five listed schemes are candidates pending primary-source verification.
- Statistics are synthetic demo values; no official aggregate data is connected.
- The database migration exists but was not run against PostgreSQL/PostGIS in the current environment.
- Authentication, role enforcement, protected imports, verification/publishing, monitoring integration and server-backed PDF/XLSX exports remain incomplete.
- Run the commands actually present in `package.json`; do not assume packages, scripts or infrastructure not present in the repository.
