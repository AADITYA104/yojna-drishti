# Open Questions and Required Decisions

| ID | Question | Why it matters | Needed by | Provisional choice | Status |
|---|---|---|---|---|---|
| OQ-01 | Final five schemes: state WCD five, or schemes from the notebook (central), or both? | Defines data and research | before TASK-004 | State WCD five | OPEN |
| OQ-02 | Will the department provide aggregate statistics? Who is the contact and what is the authorisation route? | Real vs DEMO mode | before TASK-041 real import | DEMO mode | OPEN |
| OQ-03 | Auth library and MFA method | Admin security | TASK-080 | Auth.js + TOTP | OPEN |
| OQ-04 | ORM choice | Data layer | TASK-010 | Drizzle + raw SQL | OPEN |
| OQ-05 | Basemap provider and key | Satellite view, attribution | TASK-060 | Plain fallback | OPEN |
| OQ-06 | Hosting for staging and production; any government hosting requirement | Security and compliance | TASK-101 | Undecided | OPEN |
| OQ-07 | Email provider for admin invites | Account flows | TASK-080 | None, manual invites | OPEN |
| OQ-08 | Owning organisation, grievance contact, incident escalation contacts | Privacy notice, DR | before production | Placeholder | OPEN |
| OQ-09 | Repository URL and branch policy | CI/CD | TASK-010 | - | OPEN |
| OQ-10 | Number grouping: Indian (lakh, crore) or international | UX | TASK-076 | Locale-based Indian grouping for en-IN and gu-IN | OPEN |
| OQ-11 | Which districts besides Bhavnagar for taluka-level boundaries in v1? | Data effort | TASK-031 | All districts if boundary file exists | OPEN |
| OQ-12 | Suppression thresholds and sensitive-scheme list | Privacy vs utility | TASK-050 | k=10, sensitive k=20 | OPEN |
| OQ-13 | Is a public (no login) deployment intended, or officer-only? | Risk and hosting | before deploy | Public aggregate, admin login | OPEN |
| OQ-14 | Who is the Department Reviewer in practice? | Separation of duties | before TASK-082 | Placeholder role | OPEN |
| OQ-15 | Resolve Bhavnagar 699 vs 692 village difference | Master data | TASK-032 | Use LGD | OPEN |
| OQ-16 | Naming: product branding, logo | Design | design phase | Text wordmark | OPEN |
| OQ-17 | Default theme: dark for Map Explorer and light elsewhere (ADR-0015), or one theme everywhere? | Visual identity | design phase | One professional light theme across the entire product; owner direction recorded in ADR-0017 | RESOLVED |
| OQ-18 | Who operates the platform, and is it an official government site? Is written authorisation for any government branding available? | Disclaimer, emblem rules, hosting | before TASK-068 | Independent platform, text wordmark | OPEN |
| OQ-19 | Notebook items: what do the numbered program lists (items 1 to 12) beside the village diagram mean, and should Housewife and Women Entrepreneur categories map to specific schemes? | Scheme scope | before TASK-004 | Ignored until clarified | OPEN |
| OQ-20 | Numerals: Latin digits or Gujarati digits in the Gujarati UI? | UI | TASK-076 | Latin digits | OPEN |
| OQ-21 | Should the public be able to report data issues (FR-UX-07)? | Scope and moderation load | TASK-069 | Yes, P2 | OPEN |
| OQ-22 | Is a Right to Information request an acceptable route to obtain aggregate data? | Data acquisition | TASK-041 | Allowed, owner to decide | OPEN |

