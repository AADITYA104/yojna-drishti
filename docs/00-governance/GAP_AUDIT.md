# Gap Audit (v0.2.0, 2026-11-01)

Scope: owner's Part 0, Part 1 and Part 2 prompts; notebook photos; two reference dashboard images; the 0.1.0 documentation set. Method: line-by-line comparison of what each source requires against what the document set delivers, plus checks for dead ends in user journeys and for hidden data-truth risks. "Fixed" means a document, requirement or task now exists; it does not mean the feature is built.

## A. Conflicts between the prompts
| ID | Gap | Impact | Resolution |
|---|---|---|---|
| G-01 | Owner's Part 2 tells the agent to read UPPER_CASE Part 1 files; Part 0 and the delivered docs use lowercase files in folders | Agent reports "files missing" or recreates duplicates | DOCUMENTATION_MAP.md plus docs/00-governance/PART_2_ADDENDUM.md (read BRAIN.md first) |
| G-02 | Part 2 never mentions Part 0 (BRAIN, microtasks, ADR, changelog) | Governance silently dropped during coding | Addendum states Part 0 governs Part 2 |
| G-03 | Part 2 says do not stop; the core inputs (boundaries, data) are blocked | Agent may fabricate boundaries or data to keep moving | Addendum defines readiness levels and the DEMO or prototype path (readiness-levels.md) |
| G-04 | Part 2 asks to "begin the first complete development phase" while Part 1 facts are unverified | Building on unverified scheme facts | TASK-004 verification runs in parallel; scheme pages show Not yet verified until done |
| G-05 | Part 2 names the Motion library; Part 1 forbids unneeded dependencies | Unjustified dependency | ADR-0014 |
| G-06 | Part 2 asks for a header and sidebar; 0.1.0 spec had no sidebar or layer panel | Missing core shell | FR-UX-01, TASK-066, ui-ux-spec app shell |
| G-07 | Part 2's 17 pages vs 0.1.0 sitemap | Landing, login, user management, privacy info, source registry, beneficiary analytics not mapped | Sitemap mapping table added (ui-ux-spec) |
| G-08 | Part 0 doc list has no session or handoff process | Context loss across agent sessions | session-protocol.md |

## B. Requirements that were missing or too thin
| ID | Gap | Fix |
|---|---|---|
| G-09 | Partial data (only Bhavnagar loaded) could display as statewide totals | FR-DAT-08, coverage block in rollups and API, risk R-22 |
| G-10 | Urban taluka (Bhavnagar city) or villages without polygons gave a dead-end or invisible villages | FR-GEO-13, FR-GEO-14 |
| G-11 | Gujarati text on the map (conjunct shaping) not specified or tested | FR-GEO-15, TASK-065, ADR-0016 (unverified risk: the engine's Indic text shaping must be tested) |
| G-12 | Census codes versus LGD codes: population and many boundary files use census codes | FR-ADM-09, crosswalk table, TASK-007 |
| G-13 | Date range and period granularity (Part 1 asks for reporting date filters) absent beyond FY | FR-UX-02, API from/to |
| G-14 | Target groups from the notebook (women, housewife, women entrepreneur) not a filter | FR-SCH-03, scheme_target_groups table; whether any scheme fits Housewife is open (OQ-19) |
| G-15 | Landing, login, 403, 404, 500, maintenance pages, favicon, metadata | FR-UX-05, TASK-068 |
| G-16 | Disclaimer, terms, emblem policy; risk of looking like an official site | FR-LEG-01, legal-notices.md, R-24 |
| G-17 | Blueprint features: print reports, global search, share | FR-UX-06, FR-UX-04, deep link already FR-GEO-08 |
| G-18 | No way for users to report a wrong number | FR-UX-07 (optional P2), issues table, admin queue |
| G-19 | Time playback seen in reference 2 | FR-UX-03 (P2) |
| G-20 | Sensitive-scheme suppression exists but no numeral or language rule | OQ-20, gujarati-glossary.md |

## C. Design and reference-image gaps
| ID | Gap | Fix |
|---|---|---|
| G-21 | Owner's references are dark and glow-heavy; Part 0 forbids glow and fake live data; no decision recorded | reference-design-analysis.md (adopt, adapt, reject table), ADR-0015, dark palette in design-system.md |
| G-22 | Per-element decisions on gauges, alerts, heat insets, feeds | Rejected or adapted in the analysis (no fake alerts or live feeds) |

## D. Data and research gaps
| ID | Gap | Fix |
|---|---|---|
| G-23 | No concrete leads for boundary data | Lead table with cautions in geographic-data-research.md (none verified) |
| G-24 | No route if the department will not share aggregates | SRC-DWCO and RTI route (owner decision OQ-22) |
| G-25 | Notebook numbered program lists (items 1 to 12 near the village sketch) unreadable or unexplained | OQ-19 asks the owner |
| G-26 | Scheme facts remain unverified; no primary official page retrieved | TASK-004 (READY); this is the single biggest content gap and cannot be closed by documents alone |

## E. Engineering and quality gaps
| ID | Gap | Fix |
|---|---|---|
| G-27 | Local infrastructure and repo hygiene files unspecified | local-infra.md |
| G-28 | Device and browser matrix, WebGL-less devices, low-end Android with Gujarati fonts | testing.md matrix, TASK-097, R-27 |
| G-29 | Definition of "100 percent working" is ambiguous and invites overclaiming | readiness-levels.md (L1 to L5) |

## F. Gaps that remain open (cannot be solved by writing documents)
1. Official scheme verification (TASK-004).
2. Real boundaries, especially village polygons, with licences (TASK-006, R-01).
3. Real beneficiary aggregates (department authorisation, R-02).
4. Hosting and operating entity decisions (OQ-06, OQ-18).
5. Native Gujarati review (R-16).
6. Legal review of privacy, suppression and branding.

## G. Honest limits of this audit
It compares documents, not running software. No library, source or legal claim was newly verified except as marked in scheme-research.md and geographic-data-research.md. Anything described as a lead is a lead only.

