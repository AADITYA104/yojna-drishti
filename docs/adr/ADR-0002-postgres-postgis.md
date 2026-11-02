# ADR-0002: PostgreSQL with PostGIS as the only datastore

- **Status:** PROPOSED
- **Date:** 2026-10-31

## Context
Hierarchical relational data, spatial queries, aggregation, auditability.

## Problem
Pick the database.

## Options considered
(a) PostgreSQL+PostGIS; (b) MongoDB; (c) SQLite/SpatiaLite; (d) add Redis/Elasticsearch.

## Selected decision
(a) alone; trigram and unaccent for search; HTTP caching instead of Redis.

## Reasoning
Simplest option that satisfies the requirements and Part 0/Part 1 constraints; see Advantages.

## Advantages
Transactions, constraints, spatial indexes, mature tooling.

## Disadvantages
Needs a host with PostGIS; operational burden.

## Consequences
No Redis, Kafka or search engine until a measured need exists.

## Related documentation
data-model.md; performance.md
