# ADR-0008: Apache ECharts via a single wrapper component

- **Status:** PROPOSED
- **Date:** 2026-10-31

## Context
Blueprint and Part 1 prefer ECharts.

## Problem
Pick charting library.

## Options considered
(a) ECharts; (b) Recharts; (c) Chart.js.

## Selected decision
(a), lazy-loaded.

## Reasoning
Simplest option that satisfies the requirements and Part 0/Part 1 constraints; see Advantages.

## Advantages
Rich chart types, theming from tokens.

## Disadvantages
Bundle size; accessibility must be added by text alternatives.

## Consequences
Every chart has a table alternative.

## Related documentation
design-system.md; accessibility.md
