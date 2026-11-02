# Data Quality

<a id="modes"></a>
## Data modes
| Mode | Meaning | Visibility |
|---|---|---|
| VERIFIED | Published, official or department-authorised, verified | Default public |
| DEMO | Synthetic seed for demonstration | Only when DEMO mode is enabled; badge everywhere |
| ARCHIVED | Superseded or historical | Only via history views |
Modes are never mixed in one aggregate. Rollups are computed per mode.

## Quality rules (enforced in import and by scheduled checks)
| ID | Rule | Action |
|---|---|---|
| DQ-01 | Unit exists for lgd_code and level | reject row |
| DQ-02 | No duplicate key (scheme, unit, period, benefit_type, version) | block publish |
| DQ-03 | approved+rejected+pending <= received | flag row, require reviewer note |
| DQ-04 | Child sums vs parent: sum of village values vs taluka report within tolerance | warn with delta |
| DQ-05 | Period is a valid FY and not in the future | reject |
| DQ-06 | disbursed <= sanctioned (cumulative) | flag |
| DQ-07 | Month-on-month change greater than configured factor | flag outlier |
| DQ-08 | Missing expected units (completeness) | report reporting_completeness |
| DQ-09 | Forbidden personal columns | reject batch |
| DQ-10 | Hierarchy: parent of unit is correct as of period | reject |
| DQ-11 | Scheme version in force during period | warn |
| DQ-12 | Source licence recorded | block publish if missing |

## Completeness is not performance
Reporting completeness (share of expected unit-scheme-period cells reported) is a data-quality measure. It must never be presented as scheme performance. A data quality score, if introduced later, needs a documented methodology and a separate label.

## Scheduled checks
Daily: row-count drift, orphan stats, DEMO leakage (a DEMO row visible with VERIFIED label), freshness (data_as_of older than source update interval), boundary validity.

## Freshness
Each source has an expected update interval; a stale source shows an age indicator, not a hidden warning.

## Known data issues (initial)
Bhavnagar village count mismatch (699 vs 692). Some government pages still show 33 districts. Spelling variance in Gujarati names. Scheme pages dated 2023.
