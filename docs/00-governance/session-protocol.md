# Agent Session Protocol

AI coding agents lose context between sessions and run out of context inside long ones. The Project Brain compensates only if every session follows this protocol.

## Start of every session
1. Read BRAIN.md, progress-report.md, the top of microtasks.md (status summary), open-questions.md.
2. Run repository inspection: git status, last commits, installed dependencies, which scripts exist. Never assume earlier files exist; verify.
3. Pick the next READY task whose dependencies are DONE. Announce its ID and acceptance criteria.

## During work
- One task at a time; commit at each green checkpoint (TASK ID in message).
- Run the task's tests; paste the command and a result summary into the task's Test results field.
- When a decision is needed, write the ADR before coding.
- If context is running low: stop starting new tasks, finish or revert the current one, write the handoff note.

## End of every session (handoff note appended to progress-report.md)
Completed tasks with evidence; tasks in progress and exact state; blockers and the exact input needed; commands to resume; failing tests and why; documents updated; next three tasks.

## Stage gates (user review points)
After Stage A (foundation), B (geography), E (map core), F (dashboards), G (admin), I (production readiness) the agent produces the Part 0 s17 report and waits for user acknowledgement only if a gate item failed or a decision is needed; otherwise it continues.

## Forbidden
Claiming completion from memory; skipping the verification of file existence; large unreviewed rewrites; editing ADR decisions silently.
