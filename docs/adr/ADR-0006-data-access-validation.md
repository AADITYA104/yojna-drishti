# ADR-0006: Drizzle ORM with parameterised raw SQL, Zod for validation

- **Status:** PROPOSED
- **Date:** 2026-10-31

## Context
PostGIS support matters; shared validation reduces duplicate logic.

## Problem
Choose data access and validation.

## Options considered
(a) Drizzle + raw SQL; (b) Prisma; (c) Kysely; (d) raw pg only.

## Selected decision
(a); Zod schemas as single contracts.

## Reasoning
Simplest option that satisfies the requirements and Part 0/Part 1 constraints; see Advantages.

## Advantages
Typed queries with SQL escape hatch for spatial work.

## Disadvantages
Smaller ecosystem than Prisma.

## Consequences
All SQL isolated in src/server/db.

## Related documentation
TRD.md; coding-standards.md
