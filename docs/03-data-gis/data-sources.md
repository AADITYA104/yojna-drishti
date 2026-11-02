# Data Source Register (DATA_SOURCE_REGISTER)

Register date: 2026-10-31. Last-checked is the date a human or agent actually opened the source; "not checked" means no verification in this pass. Governance rules: Part 0 s7. Access class A to F as defined in data-availability-matrix.md.

| ID | Source | Authority | URL (as known) | Data | Format expected | Method | Update | Access / restrictions | Licence | Owner | Validation | Last checked | Failure handling |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SRC-LGD | Local Government Directory | MoPR / national LGD team | lgdirectory.gov.in | District, sub-district, village, GP codes and mappings | CSV/Excel downloads | Authorised bulk download | Periodic (blueprint: regularly updated) | Public portal; terms to be confirmed | Not confirmed | LGD team | Hierarchy, uniqueness, count reconciliation | not checked | Keep last good batch; alert on count drift |
| SRC-OGD | data.gov.in | MeitY / NIC | data.gov.in | Possible datasets: boundaries, census, scheme data | CSV/JSON/API | API with registration where offered | Varies | Registration for API | Per dataset (GODL-India typical; confirm each) | Dataset owner | Per dataset | not checked | Fallback to manual download |
| SRC-WCD | WCD Gujarat portal | Dept of Women and Child Development | wcd.gujarat.gov.in | Scheme rules, forms, GRs | HTML/PDF | Manual reading; no scraping of personal data | Ad hoc | Public pages | Not confirmed for republication; attribute and link | WCD | Dual human review | not checked | Mark scheme field unverified |
| SRC-MARI | Gujarat schemes directory | Government of Gujarat | mariyojana.gujarat.gov.in | Scheme listing | HTML | Manual | Ad hoc | Public | Not confirmed | GoG | Cross-check with WCD | not checked | - |
| SRC-DG | Digital Gujarat | Government of Gujarat | digitalgujarat.gov.in | Service and application information | HTML | Manual | Ad hoc | Beneficiary data needs authorisation | n/a | GoG | - | not checked | Mark unavailable |
| SRC-DIST-BHV | Bhavnagar district site | District administration | Official Bhavnagar district website | Taluka list, At a Glance counts, villages and panchayat lists | HTML | Manual reading | Ad hoc | Public | Attribute | Collector office | Cross-check vs LGD | not checked | Prefer LGD on conflict, log discrepancy |
| SRC-CMD | Gujarat CM Dashboard | GoG / GIL | cmdashboard.gujarat.gov.in (as known) | Monitoring dashboards | Web views | None assumed; no public API assumed | Unknown | Do not assume API | Unknown | GoG/GIL | - | not checked | Do not use unless authorised |
| SRC-CENSUS | Census of India | Registrar General | censusindia.gov.in | Population by village and age group, reference 2011 or later release | PDF/Excel | Download | Decadal | Public | Check terms | RGI | Match to LGD or census codes | not checked | Mark population unavailable |
| SRC-GIS | Boundary datasets | Survey of India / state revenue GIS / open community sets | to be identified | Polygons by level | GeoJSON/Shapefile | Obtain with permission | Varies | Possibly restricted | Critical; may forbid redistribution | TBD | gis-data-spec.md | not checked | Block TASK-031 |
| SRC-DBT | DBT / treasury reporting | Finance / DBT Bharat | to be identified | Disbursement aggregates | Reports | Department authorisation | Monthly or FY | Likely restricted | Needs permission | Department | Reconciliation to scheme MIS | not checked | Mark financial unavailable |
| SRC-DEPT-MIS | Scheme MIS aggregates | Implementing department | n/a | Applications, beneficiaries by village | CSV via letter | Formal request | Per agreement | Requires authorisation (class D) | Per agreement | Department | Import pipeline | not checked | Run in DEMO mode |
| SRC-DPDP | DPDP Act 2023 and Rules 2025 | MeitY / PIB | pib.gov.in | Legal obligations | PDF | Reading | Static | Public | Public | MeitY | Counsel review | not checked | - |

## Source rules
Prefer official APIs, then authorised bulk downloads, then official CSV/Excel, then approved datasets, then public HTML only where permitted. Never bypass authentication or CAPTCHA, ignore robots or rate limits, or scrape personal beneficiary details. Accessibility of a page is not permission to republish.

## Additions v0.2.0
| ID | Source | Notes |
|---|---|---|
| SRC-DWCO | District Women and Child Development Office (Bhavnagar) and ICDS/Anganwadi reporting | Probable holder of village or anganwadi-level counts for WCD schemes; formal request route; class D expected; record contact (OQ-02) |
| SRC-RTI | Right to Information request | Lawful route to obtain aggregate figures if the department does not release them voluntarily; response may exclude data; outcome and reply date recorded; legal advice recommended; answers published only within licence |
| SRC-CENSUS-XW | Census to LGD crosswalk | Needed before any census-keyed file is imported (TASK-007) |
