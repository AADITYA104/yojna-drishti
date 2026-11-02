# Project Structure

Target repository layout (created in TASK-010; no code exists yet).

```
yojana-drishti/
  BRAIN.md
  README.md
  .env.example
  docs/                      (this documentation set)
  db/
    migrations/              SQL migrations only, ordered
    seed/demo.ts             deterministic DEMO seed
  data/
    raw/                     git-ignored; LGD, GIS inputs (hashes recorded in docs)
  src/
    app/
      (public)/              state overview, schemes, compare pages
      (admin)/               admin screens
      api/v1/                route handlers: geo, stats, schemes, compare, admin, auth, export
    features/
      map/                   Map component, useMapDrilldown, choropleth, motion
      panels/                district, taluka, village panels, SchemeCard
      analytics/ compare/ search/
    server/
      db/                    repositories (only DB access)
      import/                lgd, boundaries, schemes, stats, duplicates, workflow, reconcile
      auth/                  guard, sessions
      export/
    lib/
      config/ errors/ logger/ constants/ metrics/ format/ schemas/
    i18n/                    en.json, gu.json, request config
    styles/                  tokens.css
  tests/ unit/ integration/ gis/ e2e/
  .github/workflows/
```

## Rules
- Only src/server/db imports the database driver.
- Only src/lib/metrics computes rates.
- Only src/lib/config reads process.env.
- Features import from lib and server API clients, not from each other.
- A file over about 250 lines requires a justification in review.
- Every new file is placed according to this document; changes here are logged in changelog.md.

## Package scripts expected (must be created, not assumed)
dev, build, start, lint, typecheck, test, test:integration, test:gis, test:e2e, db:migrate, db:seed:demo, import:lgd, import:boundaries. setup.md uses only scripts that exist at the time it is written; until TASK-010 completes, setup.md is marked PLANNED.
