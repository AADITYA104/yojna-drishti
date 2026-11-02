# Coding Standards

## Language and tooling
TypeScript strict (no implicit any, noUncheckedIndexedAccess); ESLint with duplicate-code and max-lines rules; formatter run in CI; SQL formatted consistently; migrations are plain SQL.

## Low-LOC rules
1. One source of truth for: constants and enums (src/lib/constants), metric formulas (src/lib/metrics), error codes, role permissions, i18n messages, design tokens (src/styles/tokens.css), env (src/lib/config).
2. Reuse before create: before adding a component, search for an existing one; panels share a PanelShell; scheme display uses one SchemeCard; charts use one EChart wrapper; exports use one module.
3. No duplicate queries: shared repository functions.
4. No abstraction until the second real use (rule of two), no premature generic frameworks.
5. Components under about 200 lines and files under about 250; split by responsibility.
6. No dead code, no commented-out code, no TODO without a task ID.
7. Prefer platform and existing dependencies; every new package needs a reason and size note in dependencies.md.
8. Readability beats brevity: no code golf.

## Types and contracts
Zod schemas define request, response and import shapes; TypeScript types derived from them. API envelopes typed once.

## Naming
Files kebab-case; React components PascalCase; DB snake_case; constants UPPER_SNAKE only for true constants; use domain terms exactly as in data-dictionary.md (lgd_code, data_mode, sanctioned_inr).

## Errors
Throw AppError with a registered code; never throw strings; no empty catch.

## SQL
Parameterised only; no string concatenation of values; geospatial queries use PostGIS functions with explicit SRID; every new query has an index review.

## React and UI
Server components by default; client components only for map and interactive widgets; accessible names for every control; no color-only meaning; respect reduced motion.

## Security
No secrets in code; no dangerouslySetInnerHTML without review; validate all input at boundaries.

## Tests
Naming `<unit>.<case>.test`; one behaviour per test; no network in unit tests; deterministic seeds.

## Review checklist
Acceptance criteria met; tests meaningful (not just coverage); no duplicate logic; docs updated; accessibility and Gujarati text checked where UI changed.
