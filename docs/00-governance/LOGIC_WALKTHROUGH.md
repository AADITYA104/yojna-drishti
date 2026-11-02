# Logic Walkthrough (v0.3.0)

Method: trace realistic scenarios step by step through requirement, endpoint, table and rule, and write down every point where the design breaks, is ambiguous or would mislead. Defects found were fixed in the documents; the fix location is listed. This is a design-level walkthrough, not a test of software.

## Scenario 1 - Citizen searches a village in Gujarati and opens its panel (nothing yet published)
Steps: type name > GET /geo/search > pick result (disambiguated by taluka and district) > explorer deep link > GET /stats/villages/{lgd}.
Check: every scheme card returns null with reason NOT_PUBLISHED; panel shows Official data not available per figure and the five scheme cards with scheme facts marked verified or Not yet verified; coverage indicator says nothing loaded. Result: honest, not blank. Defect found: the explorer could open on an all-hatched coverage layer. Fixed: default metric follows computable data (ui-ux-spec).

## Scenario 2 - Officer colours Bhavnagar by coverage
Coverage needs a verified eligible-population denominator; none exists. Result: all units Not computable. Fix: coverage disabled with reason, default metric changes (above). Coverage shows only where computable.

## Scenario 3 - Partial data read as statewide
Only Bhavnagar loaded; state overview KPIs would show Bhavnagar numbers as Gujarat. Defect. Fixed: FR-DAT-08, coverage block in every rollup and API response, Partial label, loaded versus expected unit counts.

## Scenario 4 - District split (Vav-Tharad, 2 Oct 2025)
Talukas move from Banaskantha to Vav-Tharad. With one row per unit and version, a moved taluka got a new id and its history split. Defect. Fixed: stable admin_units plus admin_unit_versions; statistics join the version valid at period end. Check: Banaskantha statistics for FY 2024-25 roll up the old district; FY 2025-26 split by effective date. Remaining caution: a financial year that straddles 2 Oct 2025 spans two hierarchies; roll-ups for such a year use period-end hierarchy unless monthly data exists, and the UI shows a Hierarchy changed in period note.

## Scenario 5 - Data Manager imports applications for FY 2025-26
Steps: upload > forbidden-column check > header and LGD validation > duplicates > dry-run report > submit > reviewer approves > publish > rollups.
Defects found: (a) stats tables lacked scheme_version_id although the unique key used it; (b) counts could be period or cumulative with no column saying which, so metrics could mix them; (c) an annual figure across a scheme-version change had no rule; (d) rollback of an older batch after a newer one superseded it was undefined; (e) approval needed an authenticated reviewer but TASK-043 did not depend on authentication. Fixed: schema columns, count_basis, version_spans_period flag, rollback order rule, task dependency.

## Scenario 6 - One-person team
The owner is developer, data manager and reviewer; separation of duties would block every import in development. Defect. Fixed: SOLO_OWNER_MODE (non-production, DEMO only, audited, refuses to start in production).

## Scenario 7 - First login
Nobody can log in to create the first admin. Defect. Fixed: TASK-084 bootstrap CLI, MFA enrolment at first login, recovery rules (security.md).

## Scenario 8 - Development without licensed boundaries
Demo seed needed units, units needed LGD files, which are blocked. Defect: L1 unreachable without data. Fixed: TASK-024 synthetic TEST GEOMETRY fixture with reserved codes and visible ribbon.

## Scenario 9 - Suppression and totals
A village count below threshold is hidden but the taluka total is exact, so the village can be recovered by subtraction. Handled by complementary suppression in child tables (metrics module). Remaining caution: totals shown across several levels and several downloads can still be differenced across exports; export applies the same suppression and refuses a request whose result set would leave exactly one suppressed cell per parent.

## Scenario 10 - Scheduled controls
Documents promised daily DQ checks, DEMO leak scans, retention purges and freshness checks, but no task built them. Defect. Fixed: TASK-085.

## Scenario 11 - Urban taluka and polygon-less villages
Bhavnagar city taluka has no revenue villages; some villages may lack polygons. Fixed earlier: FR-GEO-13, FR-GEO-14.

## Scenario 12 - Cross-reference integrity
Automated check found two READY tasks with unfinished prerequisites, eight broken anchors, and a PRD catalogue missing 14 requirements. All fixed; the checks pass.

## Open logic risks (not fixable by documents)
1. Definition of active beneficiary differs by scheme and department; each import must record the department's definition (data-dictionary) and the UI shows it. Unknown until data arrives.
2. Whether a village-level count is derived from beneficiary residence or from anganwadi location is unknown; a wrong assumption would misplace people. Must be asked of the department.
3. Eligible-population methodology for each scheme has not been designed; coverage may stay non-computable for a long time.
4. Gujarati map labels depend on a rendering spike (TASK-065).
5. Boundary and population data may have different vintages (2011 population on 2025 boundaries); every display shows the reference year and the UI warns when vintages differ by more than a set number of years (provisional 5).
6. Legal and licence questions (R-03, R-19, R-24).
