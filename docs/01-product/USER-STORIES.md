# User Stories

Format: As a <persona>, I want <capability>, so that <outcome>. Each story maps to one requirement ID.

Personas are defined in PRD.md#personas.

| Story | Requirement | Persona | Story text | Priority |
|---|---|---|---|---|
| US-001 | FR-GEO-01 | Public Viewer | As a Public Viewer, I want to see all districts of Gujarat on one map, so that I can pick the area I care about. | P0 |
| US-002 | FR-GEO-02 | Public Viewer | As a Public Viewer, I want to click Bhavnagar and see its talukas, so that I can drill down. | P0 |
| US-003 | FR-GEO-03 | Public Viewer | As a Public Viewer, I want to click a taluka and see its villages, so that I can reach a village. | P0 |
| US-004 | FR-GEO-04 | Public Viewer | As a Public Viewer, I want to click a village and see scheme information, so that I can understand local scheme reach. | P0 |
| US-005 | FR-GEO-05 | Public Viewer | As a Public Viewer, I want to go back one level, so that I can explore another area. | P0 |
| US-006 | FR-GEO-06 | Public Viewer | As a Public Viewer, I want to search a village by name, so that I do not need to hunt on the map. | P1 |
| US-007 | FR-GEO-07 | Public Viewer | As a Public Viewer, I want to preview an area on hover, so that I can compare areas quickly. | P1 |
| US-008 | FR-GEO-08 | Analyst / Government Officer | As a Analyst / Government Officer, I want to share a link to a specific village view, so that colleagues see exactly what I see. | P1 |
| US-009 | FR-GEO-09 | Analyst / Government Officer | As a Analyst / Government Officer, I want to colour the map by a metric, so that I can see where coverage is low. | P1 |
| US-010 | FR-GEO-10 | Public Viewer | As a Public Viewer, I want to switch the basemap, so that I can see terrain context. | P2 |
| US-011 | FR-GEO-11 | Public Viewer | As a Public Viewer, I want to see data and map credits, so that I can trust and cite the data. | P0 |
| US-012 | FR-GEO-12 | Analyst / Government Officer | As a Analyst / Government Officer, I want to view a past period with the then-current hierarchy, so that historical statistics map to the correct parents. | P1 |
| US-013 | FR-DAT-01 | Public Viewer | As a Public Viewer, I want to know whether data is real, so that I am never misled by synthetic data. | P0 |
| US-014 | FR-DAT-02 | Public Viewer | As a Public Viewer, I want to see when data is missing, so that I do not read a gap as zero. | P0 |
| US-015 | FR-DAT-03 | Analyst / Government Officer | As a Analyst / Government Officer, I want to see where a number came from, so that I can cite and audit it. | P0 |
| US-016 | FR-DAT-04 | Analyst / Government Officer | As a Analyst / Government Officer, I want to see financial figures separately, so that I do not misread totals. | P0 |
| US-017 | FR-DAT-05 | Analyst / Government Officer | As a Analyst / Government Officer, I want to trust displayed rates, so that no rate is built on a missing or mismatched base. | P0 |
| US-018 | FR-DAT-06 | Public Viewer | As a Public Viewer, I want to be protected from re-identification, so that no individual can be inferred. | P1 |
| US-019 | FR-DAT-07 | Public Viewer | As a Public Viewer, I want to know my data is not exposed, so that I trust the platform. | P0 |
| US-020 | FR-STA-01 | Analyst / Government Officer | As a Analyst / Government Officer, I want to see the state picture, so that I can assess reach at a glance. | P0 |
| US-021 | FR-STA-02 | Analyst / Government Officer | As a Analyst / Government Officer, I want to compare districts and trends, so that I can find where to act. | P1 |
| US-022 | FR-STA-03 | Analyst / Government Officer | As a Analyst / Government Officer, I want to change the period, so that everything updates together. | P1 |
| US-023 | FR-DIS-01 | Analyst / Government Officer | As a Analyst / Government Officer, I want to review a district, so that I can brief decision makers. | P0 |
| US-024 | FR-TAL-01 | Analyst / Government Officer | As a Analyst / Government Officer, I want to review a taluka, so that I can compare villages. | P0 |
| US-025 | FR-VIL-01 | Public Viewer | As a Public Viewer, I want to see a village's scheme position, so that I know what reaches my area. | P0 |
| US-026 | FR-VIL-02 | Analyst / Government Officer | As a Analyst / Government Officer, I want to compare a village with its taluka, so that I can spot outliers. | P1 |
| US-027 | FR-SCH-01 | Public Viewer | As a Public Viewer, I want to read what a scheme offers, so that I know if I qualify. | P0 |
| US-028 | FR-SCH-02 | Analyst / Government Officer | As a Analyst / Government Officer, I want to see rule changes over time, so that historic figures are interpreted correctly. | P1 |
| US-029 | FR-COV-01 | Analyst / Government Officer | As a Analyst / Government Officer, I want to measure coverage, so that I find under-served areas. | P1 |
| US-030 | FR-FIN-01 | Analyst / Government Officer | As a Analyst / Government Officer, I want to track money flow, so that I can find leakage or delay. | P1 |
| US-031 | FR-CMP-01 | Analyst / Government Officer | As a Analyst / Government Officer, I want to compare two areas, so that I can benchmark. | P2 |
| US-032 | FR-EXP-01 | Analyst / Government Officer | As a Analyst / Government Officer, I want to export a view, so that I can use it in reports. | P2 |
| US-033 | FR-I18N-01 | Public Viewer | As a Public Viewer, I want to use the app in Gujarati, so that I can understand it fully. | P0 |
| US-034 | FR-ADM-01 | Super Administrator | As a Super Administrator, I want to control who can do what, so that sensitive operations are restricted. | P0 |
| US-035 | FR-ADM-02 | Data Manager | As a Data Manager, I want to upload a dataset safely, so that bad data never reaches the public. | P0 |
| US-036 | FR-ADM-03 | Data Manager | As a Data Manager, I want to avoid double counting, so that totals stay correct. | P0 |
| US-037 | FR-ADM-04 | Department Reviewer | As a Department Reviewer, I want to approve before publication, so that data is checked by a second person. | P0 |
| US-038 | FR-ADM-05 | Super Administrator | As a Super Administrator, I want to undo a bad publish, so that the public never stays on bad data. | P0 |
| US-039 | FR-ADM-06 | Super Administrator | As a Super Administrator, I want to see who changed what, so that there is accountability. | P0 |
| US-040 | FR-ADM-07 | Data Manager | As a Data Manager, I want to maintain schemes and sources, so that the catalogue stays current. | P1 |
| US-041 | FR-ADM-08 | Data Manager | As a Data Manager, I want to reconcile geography, so that I can trust the hierarchy. | P1 |
| US-042 | NFR-PERF-01 | Public Viewer | As a Public Viewer, I want to use a fast app, so that I am not blocked on slow networks. | P1 |
| US-043 | NFR-SEC-01 | Super Administrator | As a Super Administrator, I want to be protected from common attacks, so that the platform is safe to expose. | P0 |
| US-044 | NFR-A11Y-01 | Public Viewer | As a Public Viewer, I want to use the app with keyboard or assistive tech, so that it is accessible. | P1 |
| US-045 | NFR-ERR-01 | Public Viewer | As a Public Viewer, I want to see helpful errors, so that I know what to do next. | P0 |
| US-046 | NFR-OBS-01 | Super Administrator | As a Super Administrator, I want to observe the system, so that incidents are diagnosable. | P1 |
| US-047 | NFR-DR-01 | Super Administrator | As a Super Administrator, I want to recover from failure, so that data is not lost. | P1 |
| US-048 | NFR-MNT-01 | Super Administrator | As a Super Administrator, I want to keep the code small, so that maintenance stays cheap. | P1 |
| US-049 | NFR-ADV-01 | Public Viewer | As a Public Viewer, I want to use a neutral government tool, so that there is no commercial influence. | P0 |
| US-050 | FR-GEO-13 | Public Viewer | As a Public Viewer, I want to understand why no villages are shown, so that I am not confused by an empty map. | P0 |
| US-051 | FR-GEO-14 | Analyst / Government Officer | As a Analyst / Government Officer, I want to reach every village even without a polygon, so that no village is silently missing. | P1 |
| US-052 | FR-GEO-15 | Public Viewer | As a Public Viewer, I want to read place names in Gujarati, so that names are not garbled. | P0 |
| US-053 | FR-DAT-08 | Analyst / Government Officer | As a Analyst / Government Officer, I want to know what a total covers, so that I do not misread a Bhavnagar-only total as Gujarat. | P0 |
| US-054 | FR-SCH-03 | Public Viewer | As a Public Viewer, I want to find schemes for my situation, so that I find relevant schemes quickly. | P1 |
| US-055 | FR-UX-01 | Public Viewer | As a Public Viewer, I want to navigate the whole platform consistently, so that I always know where I am. | P0 |
| US-056 | FR-UX-02 | Analyst / Government Officer | As a Analyst / Government Officer, I want to choose a date range, so that I analyse a specific period. | P1 |
| US-057 | FR-UX-03 | Analyst / Government Officer | As a Analyst / Government Officer, I want to see change over time, so that I spot trends spatially. | P2 |
| US-058 | FR-UX-04 | Public Viewer | As a Public Viewer, I want to search everything from one box, so that I find things fast. | P1 |
| US-059 | FR-UX-05 | Public Viewer | As a Public Viewer, I want to get clear pages in every situation, so that I am never stranded. | P0 |
| US-060 | FR-UX-06 | Analyst / Government Officer | As a Analyst / Government Officer, I want to print a report, so that I can share on paper. | P2 |
| US-061 | FR-UX-07 | Public Viewer | As a Public Viewer, I want to flag a wrong number, so that errors get corrected. | P2 |
| US-062 | FR-LEG-01 | Public Viewer | As a Public Viewer, I want to know who runs the site, so that I do not mistake it for an official portal. | P0 |
| US-063 | FR-ADM-09 | Data Manager | As a Data Manager, I want to import census-keyed files safely, so that population attaches to the right village. | P0 |
