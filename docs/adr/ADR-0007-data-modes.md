# ADR-0007: Three data modes enforced in schema and API

- **Status:** ACCEPTED
- **Date:** 2026-10-31

## Context
Part 1 requires VERIFIED, DEMO and ARCHIVED separation and no synthetic data presented as real.

## Problem
How to keep demo data safe.

## Options considered
(a) Column data_mode with CHECKs and views per mode; (b) separate databases; (c) separate schemas.

## Selected decision
(a); production disables DEMO; DEMO sources flagged is_demo.

## Reasoning
Simplest option that satisfies the requirements and Part 0/Part 1 constraints; see Advantages.

## Advantages
Simple, testable, one codebase.

## Disadvantages
Risk of leakage if a query forgets the filter, hence views and leak scans.

## Consequences
Rollups never mix modes; scheduled leak check.

## Related documentation
data-quality.md; privacy.md; FR-DAT-01
