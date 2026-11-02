# ADR-0003: Generalised admin_units table for geography

- **Status:** PROPOSED
- **Date:** 2026-10-31

## Context
Statistics must attach to any level; hierarchy changes over time (Vav-Tharad).

## Problem
Model districts, talukas, villages.

## Options considered
(a) One admin_units table with level and parent_id; (b) separate tables per level.

## Selected decision
(a) refined: a stable identity table admin_units plus admin_unit_versions for parent, names and status over time, plus gram_panchayats and village_gp_map separately. Revised 2026-11-01 after logic audit: keying statistics to a row that changes with each hierarchy change would split one unit's history.

## Reasoning
Simplest option that satisfies the requirements and Part 0/Part 1 constraints; see Advantages.

## Advantages
Single FK target, one search index, simple effective dating and re-parenting, less code.

## Disadvantages
Weaker per-level typing; needs CHECKs and a parent-level trigger.

## Consequences
All geography queries go through repositories; uniqueness (level, lgd_code) for identity and non-overlapping validity for versions.

## Related documentation
data-model.md; geographic-data-research.md
