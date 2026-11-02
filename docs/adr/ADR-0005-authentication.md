# ADR-0005: Authentication via a maintained library with MFA for admin roles

- **Status:** PROPOSED
- **Date:** 2026-10-31

## Context
Admin features need secure sessions; hand-rolled auth is a risk.

## Problem
Choose auth approach.

## Options considered
(a) Auth.js; (b) another maintained library; (c) external IdP (government SSO) ; (d) custom.

## Selected decision
Provisional (a) with TOTP; final choice at TASK-080 after checking maintenance status and government SSO availability.

## Reasoning
Simplest option that satisfies the requirements and Part 0/Part 1 constraints; see Advantages.

## Advantages
Less security-critical custom code.

## Disadvantages
Library churn; MFA support varies.

## Consequences
Role guard is library-agnostic (src/server/auth/guard).

## Related documentation
security.md; roles-and-permissions.md
