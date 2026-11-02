# Readiness Levels - what "100 percent working" means

A dashboard cannot be 100 percent working with real statistics until real statistics exist. This document defines honest levels so progress and claims are precise.

| Level | Name | Definition | Needs from owner | Achievable by agent alone? |
|---|---|---|---|---|
| L1 | Functionally complete, DEMO data | Every page, filter, map level, chart, import, approval and admin function works end to end; all statistics are labelled DEMO | Basic inputs (repo, database, decisions) | Yes, if real or prototype geography exists |
| L2 | Verified geography | Real LGD hierarchy and approved boundaries loaded and reconciled; scheme facts verified from official pages | LGD files, boundary files and licences, official scheme verification | Partly (verification needs web access) |
| L3 | Verified statistics, pilot | Real aggregate statistics for Bhavnagar loaded via the import pipeline with authorisation and licence | Department authorisation and data files | No |
| L4 | Statewide | Remaining districts at taluka and village level | Boundaries and data for all districts | No |
| L5 | Production-operated | Hosting, monitoring, backups, restore drill, owner, support process | Hosting, owner organisation, legal review | Partly |

Rule: every status claim in BRAIN.md and reports names its level. Marketing words such as fully working are not used without a level.

## What blocks L1 right now
Prototype or official boundaries for at least the pilot; database; repo; decisions OQ-01, OQ-03 to OQ-06. Without any boundary file the map can only be built against a clearly labelled synthetic test polygon set, which proves the code but not the product.
