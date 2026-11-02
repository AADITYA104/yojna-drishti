# Admin Specification

## Screens
1. **Dashboard**: pending batches, recent publishes, data freshness by source, DQ alerts.
2. **Imports**: list (filter by status, dataset type, source); upload wizard (select type, source, mode; DEMO uploads require Super Admin); validation report with downloadable error CSV; delta view versus current published; submit.
3. **Review**: reviewer queue, comparison table, outlier flags, approve or reject with mandatory reason, publish.
4. **Schemes**: list; edit creates a new draft version with effective_from; fields show verification status and source; reviewer approves the version.
5. **Sources**: manage data_sources with access class, licence note, last checked.
6. **Geography**: reconciliation report; boundary validation report; manual correction requests (no in-place geometry editing in v1).
7. **Users and roles** (Super Admin).
8. **Audit log** (read-only, filterable, exportable).
9. **Settings**: suppression thresholds, DEMO mode toggle, FY list (Super Admin; audited).

## <a id="workflow"></a>Dataset workflow
draft > validating > validated or rejected > in_review > approved > published. Unpublish returns to approved; rollback marks rolled_back. Each transition: who, when, reason; one audit row.

## Rules
- No hard deletion of statistics or schemes; only supersede or unpublish.
- Publishing requires: licence note present on source, no unresolved duplicate, no forbidden column, reviewer approval by another person.
- DEMO batches cannot be published as VERIFIED and cannot share a source with official data.
- Every admin page shows the current data mode and environment.

## Error reporting
Failed imports and DQ alerts appear on the dashboard with requestId and a link to logs for Super Admin.

## Accessibility
Admin UI meets the same WCAG target (accessibility.md); tables keyboard navigable.

## <a id="issues"></a>Data issue queue (FR-UX-07)
Screen /admin/issues: list with filters (status, unit, scheme), detail with the figure context, actions: triage, link to import batch, resolve with note, reject with reason. Public submit endpoint is rate limited, validates length and strips markup, collects no personal data unless the user types a contact voluntarily.
