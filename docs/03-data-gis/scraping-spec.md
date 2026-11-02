# Scraping and Acquisition Specification

## Position
Scraping is the lowest-priority acquisition method. Default is manual, documented retrieval of public pages and authorised downloads. No automated scraping job is part of Version 1. This document defines the conditions under which one may be added.

## Preconditions for any automated extraction
1. The source is public and its terms or robots rules do not prohibit automated access.
2. The data is non-personal and aggregate or reference data.
3. A written entry exists in data-sources.md with licence and owner.
4. An ADR approves the extractor.
5. Rate limit no higher than one request per 5 seconds, identified user agent, daily cap.

## Prohibited
Bypassing login, CAPTCHA, IP blocks or rate limits; scraping personal beneficiary details; using a browser session of another person; republishing data whose terms forbid it.

## Per-source specification template
Source ID; URL pattern; method (manual, download, API, HTML); selectors or parameters; fields; expected row counts; schedule; timeout 20 s; retries 3 with exponential backoff on 429/5xx only; non-retryable on 401/403/404; checksum of raw capture; storage path; failure notification.

## Outputs of any extraction
Raw capture file stored unchanged with sha256; extraction log (start, end, URL, status, bytes, rows); parsed rows go through the normal import pipeline (dry-run, validation, approval). Data lineage row links published figures to the raw capture.

## Current sources
Only manual retrieval is planned: scheme pages (SRC-WCD), district site tables (SRC-DIST-BHV), LGD downloads (SRC-LGD).
