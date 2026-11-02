# ADR-0011: Hosting: deferred; production data only on approved hosting

- **Status:** PROPOSED
- **Date:** 2026-10-31

## Context
Blueprint cautions on government data hosting.

## Problem
Where to host.

## Options considered
(a) General platform for demo only; (b) government-approved cloud/data centre for production; (c) self-managed VM.

## Selected decision
Use (a) for DEMO only; production decision awaits OQ-06.

## Reasoning
Simplest option that satisfies the requirements and Part 0/Part 1 constraints; see Advantages.

## Advantages
Avoids placing sensitive data on unapproved platforms.

## Disadvantages
Delays production planning.

## Consequences
TASK-101 blocked until decided.

## Related documentation
deployment.md
