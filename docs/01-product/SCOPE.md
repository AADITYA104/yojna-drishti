# Scope

## In scope - Version 1 (pilot)
| Area | Included |
|---|---|
| Geography | Gujarat state and all districts (count from data; 34 as of 2 Oct 2025); talukas for all districts if boundary data is available; Bhavnagar villages complete |
| Schemes | Five candidate schemes, after official verification |
| Statistics | Aggregate applications, beneficiaries, financial, population (with reference year) |
| Modules | State overview, map explorer, district, taluka, village, scheme, coverage, financial, comparison, admin and data management |
| Languages | Gujarati and English |
| Data modes | VERIFIED, DEMO, ARCHIVED |
| Roles | Public Viewer, Analyst, Data Manager, Department Reviewer, Super Administrator |
| Exports | CSV, Excel, PDF with provenance |

## Out of scope - Version 1
Individual beneficiary data; citizen login and applications; native app; advertising; payments; real-time integration with department MIS (until authorised); predictive analytics; schemes beyond the five; village polygons for districts other than Bhavnagar.

## Deferred (version 2 candidates)
Remaining 33 districts at village level; additional schemes from the user's notebook list (central schemes: PM Matru Vandana Yojana, Beti Bachao Beti Padhao, PM Mudra Yojana, Sukanya Samriddhi Yojana, Mahila Samman Savings Certificate, Mukhyamantri Mahila Utkarsh Yojana) - requires user decision OQ-01; API-based data feeds; vector tile server; urban ward level.

## Scope control
Any change to scope requires an entry in changelog.md, an update of this file, PRD.md, traceability and an ADR if architectural.

## Pilot geography
Bhavnagar district. The district website lists 11 talukas. Its At-a-Glance figure of 699 revenue villages differs from the taluka-wise sum of 692 (blueprint observation, not yet re-verified). Resolution happens only through LGD reconciliation (TASK-032). Neither number may be hard-coded.
