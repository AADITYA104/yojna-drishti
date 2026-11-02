# ADR-0014: Animation approach: CSS and map camera API first

- **Status:** PROPOSED
- **Date:** 2026-10-31

## Context
Owner's Part 2 prompt mentions the Motion library; Part 1 forbids unneeded libraries.

## Problem
Decide animation tooling.

## Options considered
(a) CSS transitions plus MapLibre camera API; (b) add Motion; (c) other library.

## Selected decision
(a) by default; add Motion only if a documented interaction cannot be done cleanly otherwise, with bundle size recorded.

## Reasoning
Smallest change that satisfies Part 0, Part 1 and the owner's supplied references.

## Advantages
Smaller bundle, fewer dependencies.

## Disadvantages
Complex orchestration may need more code.

## Consequences
Revisit at TASK-064 with measured impact.

## Related documentation
animation-spec.md; dependencies.md
