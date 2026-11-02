# Import Pipeline

## Dataset types
lgd, boundaries, schemes, applications, beneficiaries, financial, population, eligible.

## Stages
1. **Upload** (Data Manager): file type allow-list (csv, xlsx, geojson, zip for shapefile), size limit (provisional 25 MB), filename sanitised, stored outside web root, sha256 computed. Same hash and dataset type is refused (DUPLICATE_BATCH).
2. **Parse** in a restricted worker path: CSV streamed; XLSX first sheet only, macros ignored, formulas read as values; no formula evaluation of cell content; strings beginning with =, +, -, @ are neutralised on export to prevent CSV injection.
3. **Validate** (dry-run default): header check (required, unknown, forbidden columns), type check, range check, LGD resolution, hierarchy check as of period, duplicate detection, DQ rules. Output: counts and row-level errors in import_batch_errors.
4. **Decision policy**: any forbidden column or file-level error rejects the batch. Row errors: configured per dataset: STRICT (reject batch, default for statistics) or PARTIAL (publish valid rows after reviewer approval, only for geography).
5. **Submit for review** (status in_review). Reviewer sees counts, errors, deltas versus previous published data, outliers.
6. **Approve** by a different user than the uploader (DB CHECK and service check).
7. **Publish** in a transaction: new rows published, prior rows superseded, audit entry, cache invalidation.
8. **Rollback** (Super Administrator or Department Reviewer): reverse the publish transaction.

<a id="rollback"></a>
## Idempotency
Batch identity = (dataset_type, sha256). Row identity = natural key. Re-running a validated batch performs no duplicate inserts (UPSERT on natural key within batch scope).

## Duplicates
Within file: same natural key twice. Against database: same key already published. Both listed; publish blocked until resolved by re-upload (no in-UI row editing in v1).

<a id="reconciliation"></a>
## Reconciliation (geography)
Compare LGD counts per parent against district-website figures and boundary features; report mismatches with codes; resolution notes stored in open-questions.md or the batch record.

## Forbidden columns
See data-dictionary.md. Matching is on normalised header (lowercase, trimmed, Gujarati equivalents). The check runs before any row is read into memory beyond the header.

## Failure handling
Parse timeout 60 s; failure moves batch to rejected with message; no partial writes to published tables; staging tables are transaction-scoped or truncated by batch id.

## Observability
Each stage logs requestId, batchId, counts, duration. Failed batches visible in the admin import list with downloadable error CSV.

## Logging of extraction (for any acquisition)
Source id, URL or file name, retrieved_at, sha256, rows, operator.

## <a id="crosswalk"></a>Crosswalk handling (v0.2.0, FR-ADM-09)
Census 2011 village codes and LGD codes are different systems. Population files and many community boundary files use census codes. The pipeline resolves each row through admin_unit_code_crosswalk; a name-and-parent match proposed by the pipeline is held as a suggestion that a reviewer must confirm (TASK-007) and is never auto-applied. Unmatched rows are reported. Villages created, merged or renamed since the census appear as unmatched and are listed for manual decision.

## v0.3.0 notes
- LGD import upserts the stable unit by (level, lgd_code) and writes a new admin_unit_versions row only when parent, names or status changed; unchanged rows produce no write (idempotent).
- Statistics files must include count_basis (period or cumulative) and scheme version is resolved from the period date and scheme code; a period with no matching scheme version is a validation error.
- Import runs under the uploader's identity; CLI imports during development use a service account recorded in audit as such.

## Logic rules added after the walkthrough (v0.3.0)
1. **Version spanning a period.** The scheme version is resolved from period_start. If another version takes effect inside the period (for example an annual figure across a benefit change), the row is flagged version_spans_period = true; YoY and average-assistance metrics then return a VERSION_CHANGED warning, and the reviewer sees the flag. Preferred fix at the source: supply monthly rows.
2. **Rollback order.** A batch can be rolled back only if no later published batch supersedes any of its keys; otherwise ROLLBACK_BLOCKED_BY_NEWER_BATCH, and the later batch must be rolled back first. Rollback of a batch restores exactly the rows it superseded.
3. **Coexisting modes.** A DEMO and a VERIFIED row may exist for the same key (data_mode is part of the unique key); every read selects exactly one mode and never merges.
4. **Publish and cache.** Publish invalidates cached boundaries only if boundaries changed; statistics responses are revalidated by publish timestamp. Readers never see a half-published batch (single transaction).
