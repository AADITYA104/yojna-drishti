# Risk Register

Likelihood and impact: L, M, H. Status OPEN unless noted.

| ID | Risk | L | I | Mitigation | Owner | Status |
|---|---|---|---|---|---|---|
| R-01 | Official village boundary polygons for Bhavnagar are unavailable or licensed against redistribution | H | H | Identify source early (TASK-006); fallback: taluka polygons plus village points; request permission; ADR before choosing prototype boundaries | Product owner | OPEN |
| R-02 | Village-wise beneficiary data cannot be obtained | H | H | Formal request to department; DEMO mode clearly labelled; show unavailable; design works with partial data | Product owner | OPEN |
| R-03 | Data licence or terms forbid republication | M | H | Record licence per source; legal check before publish; attribution; publish aggregates only | Product owner | OPEN |
| R-04 | Scheme facts outdated (pages dated 2023; status unknown) | H | H | TASK-004 primary-source verification; versioning; verified-on date visible | Researcher | OPEN |
| R-05 | Re-identification from small counts | M | H | Suppression thresholds, complementary suppression, legal review | Security lead | OPEN |
| R-06 | Wrong data published (import error) | M | H | Dry-run, validation, reviewer approval by second person, rollback, DQ rules | Data owner | OPEN |
| R-07 | DEMO data mistaken for real | M | H | Badges, API meta, DB checks, leak scans, production DEMO disabled | Engineering | OPEN |
| R-08 | Admin account compromise | L | H | MFA, lockout, short sessions, audit, least privilege | Security lead | OPEN |
| R-09 | Supply-chain vulnerability | M | M | Lockfile, audit in CI, minimal dependencies, SHA-pinned actions | Engineering | OPEN |
| R-10 | Map performance with village polygons | M | M | Simplification, per-parent loading, vector tiles upgrade path | Engineering | OPEN |
| R-11 | Hierarchy changes (new districts, mergers) break history | M | M | Effective-dated admin_units | Engineering | MITIGATED IN DESIGN |
| R-12 | Name mismatches across sources (Gujarati/English) | H | M | LGD codes as keys, alias table, human review of name-based matches | Data manager | OPEN |
| R-13 | Eligible-population denominators unavailable, coverage module empty | H | M | Show Not computable; do not estimate silently; research methods with department | Analyst | OPEN |
| R-14 | Hosting restrictions for government data | M | H | Decision OQ-06; keep production data off general platforms | Product owner | OPEN |
| R-15 | Scope creep (extra schemes, central schemes from notebook) | M | M | Scope control process; OQ-01 | Product owner | OPEN |
| R-16 | Gujarati text quality | M | M | Native reviewer, glossary, long-string tests | Product owner | OPEN |
| R-17 | Library versions in docs outdated | M | L | Verify at TASK-010, record in dependencies.md | Engineering | OPEN |
| R-18 | Single-person bus factor | M | M | Documentation, ADRs, microtasks | Product owner | OPEN |
| R-19 | Legal obligations under DPDP misread | L | H | Counsel review of privacy.md | Product owner | OPEN |
| R-20 | Agent environment cannot reach official sites | M | M | User supplies files; mark class F items unresolved | Product owner | OPEN |
| R-21 | Gujarati conjuncts render incorrectly in map text layers | M | M | Spike TASK-065; HTML overlay fallback (ADR-0016) | Engineering | OPEN |
| R-22 | Partial data read as statewide totals | H | H | FR-DAT-08 coverage indicator, Partial label, loaded-vs-expected counts | Engineering | MITIGATED IN DESIGN |
| R-23 | Census codes mismatch LGD codes, wrong population attached | H | M | Crosswalk table, reviewed matches (TASK-007), no name-only joins | Data manager | OPEN |
| R-24 | Platform mistaken for an official government site or misuses emblems | M | H | Disclaimer, no emblem assets, legal review (legal-notices.md) | Product owner | OPEN |
| R-25 | Urban taluka (Bhavnagar city) or villages without polygons cause dead ends | M | M | FR-GEO-13, FR-GEO-14 | Engineering | MITIGATED IN DESIGN |
| R-26 | Agent loses context across sessions and drifts from the Brain | H | M | session-protocol.md, handoff notes, stage gates | Product owner | OPEN |
| R-27 | WebGL unavailable on low-end devices | M | M | List and table fallback, device matrix | Engineering | OPEN |
