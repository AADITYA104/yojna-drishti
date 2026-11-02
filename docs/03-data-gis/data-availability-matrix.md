# Data Availability Matrix (DATA_AVAILABILITY_MATRIX)

Classes: A public and directly downloadable; B public, manual extraction; C API with registration; D needs department authorisation; E not publicly available; F not yet verified.

Honesty note: no class has been confirmed by testing access in this pass. "Expected" is a hypothesis to test in TASK-004/005/006. Class F rows must be resolved before the dependent task starts.

| Dataset | Level | Expected class | Current class | Source | Dependent tasks | Fallback |
|---|---|---|---|---|---|---|
| District list and codes | District | A | F | LGD | TASK-030 | Cross-check district website |
| Taluka list and codes | Taluka | A | F | LGD | TASK-030 | District website |
| Village list and codes | Village | A | F | LGD | TASK-030 | Collector/district site (reconcile) |
| Gram Panchayat and village mapping | GP/Village | A or B | F | LGD, district panchayat | TASK-030 | Omit GP link, mark unavailable |
| District boundaries | District | A or B | F | SRC-GIS | TASK-031 | OSM-derived prototype only, flagged non-official |
| Taluka boundaries | Taluka | B | F | SRC-GIS | TASK-031 | As above |
| Village boundaries | Village | D or E | F | SRC-GIS | TASK-031 | Village centroids (points) with lower fidelity; or taluka-level map only |
| Scheme rules and GRs | Scheme | B | F | WCD | TASK-004 | Mark unverified |
| Village population | Village | A or B | F | Census | TASK-041 | Mark unavailable |
| Eligible population per scheme | Village/Taluka | E | F | Derived or dept | TASK-074 | Coverage not computable |
| Applications by status | Village | D | F | Dept MIS | TASK-041 | DEMO mode |
| Beneficiaries (active) | Village | D | F | Dept MIS | TASK-041 | DEMO mode |
| Disbursement | Village/District | D | F | Treasury/DBT | TASK-041 | DEMO mode |
| Budget allocation | District/State | B | F | Budget documents | TASK-041 | Unavailable |
| Historical series | Any | B or D | F | Annual reports | TASK-041 | Unavailable |
| Individual beneficiary records | Person | E | n/a | n/a | Never | Not collected, by design |

## Consequence
Realistic expectation: geography and scheme rules reach VERIFIED; scheme statistics remain DEMO or unavailable until department data arrives. The product is built to be useful and honest in that state (see PRD s13).
