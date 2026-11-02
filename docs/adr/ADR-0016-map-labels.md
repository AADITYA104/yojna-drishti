# ADR-0016: Map labels: engine labels only if Gujarati shaping is verified, else HTML overlays

- **Status:** PROPOSED
- **Date:** 2026-10-31

## Context
Map engines may not shape Indic conjunct consonants correctly; this must be tested, not assumed.

## Problem
Render unit names reliably in Gujarati.

## Options considered
(a) Engine symbol layers with glyph fonts; (b) HTML overlay labels from centroids; (c) English-only map labels.

## Selected decision
Decide after spike TASK-065; default to (b) if any shaping defect is found.

## Reasoning
Smallest change that satisfies Part 0, Part 1 and the owner's supplied references.

## Advantages
Correct Gujarati text.

## Disadvantages
HTML overlays cost performance at many labels; collision handling needed.

## Consequences
Labels limited by zoom thresholds; only the current level is labelled.

## Related documentation
ui-ux-spec.md; FR-GEO-15
