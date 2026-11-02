# Release Process

Versioning: semantic versioning, starting 0.1.0 (documentation baseline). 1.0.0 only when the production-readiness checklist passes.

1. Scope: list tasks and requirement IDs included.
2. Freeze: no new features on the release branch.
3. Verify: CI, E2E, security and accessibility checks, relevant checklist items, data-licence check for any new dataset.
4. Documents: changelog, BRAIN.md version, ADR statuses, traceability evidence.
5. Approve: Department Reviewer or product owner signs release note.
6. Deploy per deployment.md.
7. Announce internally with known issues.
8. Hotfix path: branch from tag, minimal fix, same checks (reduced scope allowed for critical fixes with later full run).

Data releases (new datasets) follow admin-spec.md workflow and are separate from code releases.
