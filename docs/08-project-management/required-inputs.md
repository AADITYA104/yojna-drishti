# Consolidated List of Required Inputs (what the user must provide)

Priority: P0 blocks the next stage; P1 blocks later stages; P2 improves quality.

## Data files
| # | Input | Priority | Used by | Notes |
|---|---|---|---|---|
| 1 | LGD exports: district, sub-district, village, Gram Panchayat and village-to-GP mapping (CSV/Excel), with download date | P0 | TASK-005, 030 | Keep original file names |
| 2 | Boundary files for districts and talukas (GeoJSON/Shapefile) with source name and licence text | P0 | TASK-006, 031 | Also CRS if known |
| 3 | Village boundary file for Bhavnagar (or confirmation it is unavailable) with licence | P1 | TASK-031 | Highest risk |
| 4 | Village population (Census or latest official) with reference year | P1 | TASK-041 | |
| 5 | Typed list of Ghogha villages from the notebook, plus any other taluka lists | P2 | TASK-032 | Check list only |
| 6 | Any real aggregate scheme data you already have permission to use, with the permission document | P1 | TASK-041 | Else DEMO |

## Scheme information
| 7 | Decision on which five schemes (OQ-01) | P0 | TASK-004 | |
| 8 | Official GR and guideline PDFs or links for each scheme, if you have them | P1 | TASK-004 | Agent also tries official sites |
| 9 | Department contact or letter route for aggregate data (OQ-02) | P1 | TASK-041 | |

## Accounts and technical decisions
| 10 | GitHub repository URL; branch policy (OQ-09) | P0 | TASK-010 | |
| 11 | PostgreSQL with PostGIS: local Docker acceptable, or hosted service choice | P0 | TASK-020 | |
| 12 | Basemap provider and key, or approval of plain fallback (OQ-05) | P2 | TASK-060 | |
| 13 | Hosting decision for staging and production (OQ-06) | P1 | TASK-101 | |
| 14 | Domain name, if any | P2 | deploy | |
| 15 | Email provider for admin invites (OQ-07), or manual invites | P2 | TASK-080 | |
| 16 | Agent environment: internet access, ability to install packages, run PostGIS | P0 | all | |

## Product and governance
| 17 | Approval or changes for ADR-0001 to ADR-0013 | P0 | TASK-010 | |
| 18 | Suppression thresholds approval (OQ-12) | P1 | TASK-050 | |
| 19 | Owning organisation name, grievance contact, escalation contacts (OQ-08) | P1 | privacy notice, DR | |
| 20 | Admin user list and roles; who is the Department Reviewer (OQ-14) | P1 | TASK-080 | |
| 21 | Is the site public or officer-only (OQ-13) | P1 | deploy | |
| 22 | Branding: logo or confirmation of text wordmark (OQ-16) | P2 | design | |
| 23 | Native Gujarati reviewer for UI text | P1 | TASK-076 | |
| 24 | Number grouping preference (OQ-10) | P2 | TASK-076 | |
| 25 | Legal review contact for DPDP and data licences | P1 | before publish | |

## Additional inputs (v0.2.0)
| # | Input | Priority | Used by |
|---|---|---|---|
| 26 | Answers to remaining OQ-18 to OQ-22 (OQ-17 is resolved by ADR-0017) | P1 | legal, scope, operations |
| 27 | Census-to-LGD mapping file if available, or approval to build it with manual review | P1 | TASK-007 |
| 28 | Operating entity details and any written authorisation for government branding | P1 | TASK-068 |
| 29 | Clarification of the notebook's numbered program lists | P1 | scheme scope |
| 30 | Devices available for testing (Android model, iPhone) or approval to use emulation | P2 | TASK-097 |
| 31 | District Women and Child Development Office contact or RTI decision | P1 | TASK-041 |

