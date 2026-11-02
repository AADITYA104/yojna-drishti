# ADR-0001: Modular monolith on Next.js with TypeScript

- **Status:** PROPOSED
- **Date:** 2026-10-31

## Context
Part 1 prefers the simplest architecture that reliably serves the project; the team is small and the dataset is modest.

## Problem
Choose application architecture and backend approach.

## Options considered
(a) Next.js modular monolith with route handlers; (b) Next.js frontend + separate NestJS API (blueprint suggestion); (c) microservices.

## Selected decision
(a), with Python used only if a spatial/ETL task cannot be done in SQL or TypeScript.

## Reasoning
Simplest option that satisfies the requirements and Part 0/Part 1 constraints; see Advantages.

## Advantages
One deployable, shared types and validation schemas, fewer moving parts, lower LOC.

## Disadvantages
Long-running jobs and heavy ETL are less natural; framework coupling.

## Consequences
Import module kept in src/server/import with clear boundaries so it can be extracted later. Revisit if job volume grows.

## Related documentation
architecture.md; TRD.md; project-structure.md
