# Development Workflow

1. **Pick** the next READY task from microtasks.md whose dependencies are DONE.
2. **Branch** `task/TASK-0xx-short-name` from main.
3. **Read** the task's relevant documents; if a decision is needed, write or update an ADR first.
4. **Implement** the smallest change satisfying the acceptance criteria; follow coding-standards.md.
5. **Test**: run the task's tests; add tests before or with code. Record the exact command and result in the task.
6. **Docs**: apply the documentation update rule (Part 0 s16): database change > data-model, api-spec, data-dictionary, migrations, tests, BRAIN; API change > api-spec, contracts, tests, changelog; geographic source change > data-sources, gis-data-spec, data-quality, import-pipeline, ADR.
7. **Pull request** with template: task ID, requirement IDs, tests run, docs updated, risks. At least one review; reviewer checks acceptance criteria, not style only.
8. **CI** must pass (no skipped tests to get green).
9. **Merge** (squash) to main; update task status, BRAIN.md, changelog.
10. **Release** per release-process.md.

## Commit messages
`TASK-0xx: imperative summary`. Database migrations are separate commits.

## Branch protection
Main requires PR, passing checks, no force-push, signed or verified commits if available.

## Definition of Done
Acceptance criteria met; tests executed and recorded; docs and traceability updated; no new lint, type or audit warnings; no TODO without a task ID; evidence linked.

## Definition of Ready
Dependencies done; inputs available; acceptance criteria testable; relevant ADR approved.

## Blocked work
Set BLOCKED with the exact missing input; continue with the next independent task; list in open-questions.md.
