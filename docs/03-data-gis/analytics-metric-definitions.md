# Analytics Metric Definitions

All formulas live in one module (src/lib/metrics, TASK-050). UI, API and exports call it. Every metric returns { value, unit, reason_code, inputs, period, source_ids, data_mode }.

General rules: same geography and same period for numerator and denominator; no rate when either input is null; zero denominator returns null with reason; never clamp or hide impossible values silently, flag them; rounding at display only (1 decimal for percentages).

| Metric | Numerator | Denominator | Unit | Reason codes when null |
|---|---|---|---|---|
| Approval rate | approved | approved + rejected (decided) | % | NO_DECIDED_APPLICATIONS, INPUT_NULL |
| Pending rate | pending | received | % | NO_APPLICATIONS, INPUT_NULL, INCONSISTENT_COUNTS |
| Rejection rate | rejected | approved + rejected | % | as approval |
| Beneficiary coverage | active_count | verified eligible_count for same scheme, unit, period | % | NO_ELIGIBLE_DENOMINATOR, PERIOD_MISMATCH |
| Average assistance | disbursed_inr (one benefit_type) | unique_paid_count | INR per person | NO_PAID_BENEFICIARIES, MIXED_BENEFIT_TYPES |
| Disbursement rate | disbursed_inr | sanctioned_inr (also optionally allocated_inr, labelled separately) | % | NO_SANCTIONED_AMOUNT |
| Year-over-year growth | current FY value minus previous FY value | previous FY value | % | NO_PREVIOUS_BASE, VERSION_CHANGED (warning) |
| Scheme utilisation | disbursed_inr | allocated_inr | % | NO_ALLOCATION |
| Reporting completeness | units reporting a value | units expected | % (data quality only) | NO_EXPECTED_UNITS |

## Edge cases
- Approval rate uses decided applications, so a rising pending count does not change it; pending rate covers that.
- Coverage can exceed 100 percent if the denominator is an estimate or definitions differ: value shown with flag OVER_100; investigate.
- Average assistance across benefit types is refused (MIXED_BENEFIT_TYPES).
- YoY across a scheme version change that altered benefit amounts or eligibility returns the value with a VERSION_CHANGED warning.
- Cumulative versus periodic counts must not be mixed: each import column declares its basis (period or cumulative).

## <a id="coverage"></a>Coverage and eligible population
Eligible population requires: verified source, same geography, same period, a stated method (for example census age-sex group intersected with income limit estimate), and a denominator_basis note. Total population is never used. If the method is an estimate it is labelled Estimated eligible population. Without it: Not computable.

## <a id="financial"></a>Financial separation
Allocated, approved/sanctioned and disbursed are three series. Benefit types (cash recurring, cash one-time, loan, subsidy, in-kind) are never summed. In-kind is reported in units with a unit label. A card may show several figures side by side, each with its own definition tooltip.

## <a id="comparability"></a>Comparability rules
Two units or periods are comparable for a metric only if: same metric definition; same scheme version family; same period type; both values non-null; both VERIFIED (or both DEMO); denominators from the same basis. Otherwise no ranking, no delta, show warning.

## Small-number suppression
Counts below threshold k (ADR-0010) return suppressed=true and label. To prevent differencing, if a parent total is shown and exactly one child is suppressed, a second child (smallest unsuppressed) is also suppressed in tabular child lists (complementary suppression). Rates computed from suppressed inputs are null with reason SUPPRESSED.

## Dashboard KPI mapping
Total beneficiaries = sum of active_count over published rows per scheme (sum across schemes is allowed only with the label "beneficiary-scheme enrolments", because one person may be in several schemes; people are not de-duplicated across schemes). This is stated on the KPI tooltip.
