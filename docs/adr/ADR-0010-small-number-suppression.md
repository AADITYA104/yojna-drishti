# ADR-0010: Small-number suppression thresholds and complementary suppression

- **Status:** PROPOSED
- **Date:** 2026-10-31

## Context
Village counts for sensitive schemes can identify individuals.

## Problem
Protect privacy while keeping utility.

## Options considered
(a) No suppression; (b) k=10 default and k=20 for sensitive schemes with complementary suppression; (c) Aggregate only to taluka.

## Selected decision
(b), thresholds configurable, pending legal review.

## Reasoning
Simplest option that satisfies the requirements and Part 0/Part 1 constraints; see Advantages.

## Advantages
Reduces re-identification risk.

## Disadvantages
Lower local insight; extra logic.

## Consequences
Implemented once in metrics module.

## Related documentation
privacy.md; analytics-metric-definitions.md
