# Integrations

| Integration | Direction | Purpose | Status | Notes |
|---|---|---|---|---|
| LGD downloads | in, manual | Geography master | Planned (TASK-005) | Record hash and date; no scraping |
| data.gov.in | in, manual or API | Possible boundary/census datasets | To evaluate | API registration if used; licence per dataset |
| WCD portal / GR PDFs | in, manual | Scheme facts | Planned (TASK-004) | Citation required |
| Department MIS aggregates | in, file | Applications, beneficiaries, financial | Blocked on authorisation | Delivered as CSV via import pipeline; no live feed in v1 |
| Basemap provider | out (browser) | Tiles/imagery | Optional | Needs key and licence compliance; privacy note: browser contacts provider |
| Error monitoring | out | Exceptions | Optional, ADR needed | Must scrub PII and secrets |
| Email (for admin invites, resets) | out | Account flows | TBD | Provider decision OQ-07 |
| GitHub Actions | CI/CD | Build and deploy | Planned | Secrets only in GitHub environments |
| Object storage | internal | Raw uploads | Planned | Private bucket, encrypted |
| AdMob | none | NOT APPLICABLE | n/a | See admob-spec.md |

## Rules
No integration is activated without an entry here, an environment variable entry, and (if it processes user data) a privacy review. Third-party scripts are not loaded on public pages except the map provider's tile requests; no analytics trackers in v1 unless approved by ADR with privacy review.
