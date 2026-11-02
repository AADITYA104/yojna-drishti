# ADR-0004: Map rendering: per-level GeoJSON with simplification; vector tiles as upgrade

- **Status:** PROPOSED
- **Date:** 2026-10-31

## Context
Real data size is unknown (village boundaries unobtained).

## Problem
Choose delivery of boundaries to MapLibre.

## Options considered
(a) Per-parent GeoJSON with three simplification levels; (b) PostGIS ST_AsMVT tiles on demand; (c) pre-built PMTiles.

## Selected decision
(a) first; move to (b) or (c) if budgets in performance.md fail on real data.

## Reasoning
Simplest option that satisfies the requirements and Part 0/Part 1 constraints; see Advantages.

## Advantages
Simple, cacheable, no tile server; geometry separated from stats.

## Disadvantages
Large villages payloads for dense taluka; client memory.

## Consequences
Measure real payloads at TASK-031/095 and amend this ADR with numbers.

## Related documentation
gis-data-spec.md; performance.md
