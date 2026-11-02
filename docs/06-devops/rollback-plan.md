# Rollback Plan

## Application rollback
Redeploy the previous tagged build; health check and smoke test; time target under 15 minutes (to be verified in a drill).

## Database rollback
- Additive migrations: leave in place, redeploy old app (backward compatible by expand-contract).
- Destructive or irreversible migration: restore from the backup taken immediately before deploy into a new instance and switch over; accept data loss since backup (state it in the release note).
Every migration PR states: reversible yes/no and how.

## Data rollback
Use batch rollback in the admin (import-pipeline.md): previous published rows are restored and the batch is marked rolled_back; audited. Verified by integration test (FR-ADM-05).

## Configuration rollback
Environment changes are versioned in the host; revert to previous values; restart.

## Triggers
Failed smoke test; error rate above threshold for 10 minutes; DEMO leak; wrong data published; security incident.

## Decision owner
Release approver (named in OQ-08). Rollback does not require a second approval during an incident.

## After rollback
Record in changelog, open an incident review, add a regression test.
