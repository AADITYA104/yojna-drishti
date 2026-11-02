# Data Lineage

## Chain
Official source (data_sources) > raw file (stored, sha256) > import_batch > validated rows > reviewed and approved batch > published statistics row > API response > UI card or export.

## Recorded for every published statistic
source_id; import_batch_id; file_sha256 (via batch); uploaded_by, approved_by (batch); data_as_of; financial_year; period; verification_status; data_mode; publish timestamps; superseded_by (when replaced).

## User-visible lineage
Every figure has an info control showing source name, reference URL, FY, period, as-of date, verification status, last verified date. Exports include a Sources sheet.

## Supersession
New batch for same key: old rows become superseded, never deleted. Rollback of a batch: its rows become unpublished and the previous superseded rows return to published, in one transaction.

## Raw capture retention
Raw uploads kept in restricted storage 12 months (provisional) with hash in database; hash proves what was imported.

## Lineage test
For a sample of 20 published figures, trace back to raw file row (TASK-091). Pass criterion: 20 of 20.
