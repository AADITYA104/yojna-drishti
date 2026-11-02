# YOJANA DRISHTI — Final Dashboard Layouts

All layouts use the same light application shell, navy sidebar, global header, typography, card styles, filters, source badges and responsive behavior. The provided reference values are illustrative; production metrics require authorized verified sources.

## Shared layout

Header: product brand, global search, data/notification status, help, Gujarati/English switch and read-only/user profile. Sidebar: 14-section sitemap. Data screens place breadcrumb, financial year, scheme and geography filters in a consistent row beneath the page title. Content uses reusable KPI cards, panels, tables, charts, map legend, data-source/freshness labels, and explicit empty/loading/error states.

## 01 State Overview

State KPIs and source completeness; Gujarat map; district comparison; scheme aggregates and trend charts. Keep beneficiary, application, approval and financial measures distinct. No KPIs are populated from synthetic numbers in production.

## 02 GIS Map Explorer

State → district → taluka → village drilldown. Keep breadcrumb, filters, selected boundary, legend and information panel in consistent positions. Production geometry requires licensed official boundaries. A demo schematic is labelled and cannot claim boundary accuracy.

## 03 District Intelligence

District profile and code, source/as-of, available scheme aggregates, taluka table, financial measures and trends. Respect district-level access scope.

## 04 Taluka Intelligence

Taluka profile, village comparison, available scheme and financial summaries, sources and reporting completeness. Do not fill missing villages or metrics with invented values.

## 05 Village Intelligence

Village identity and administrative parent, source/as-of, scheme cards and aggregate measures. No personal beneficiary records. A village with missing geometry still has a profile and an explicit boundary-unavailable state.

## 06 Scheme Intelligence

Scheme identity, department, official GR/source, effective period, eligibility, benefits and application method. Mark each unverified field. The dashboard does not accept or approve applications.

## 07 Beneficiary Analytics

Aggregate counts by verified scheme and geography, with suppression for small groups where policy requires. No public person-level beneficiary search.

## 08 Financial Intelligence

Budget, sanctioned, disbursed and remaining amounts as separate measures. Keep benefit types separate unless a published methodology supports a total. Show period and source.

## 09 Analytics & Comparison

Compare up to a bounded number of comparable geographies or schemes. Use a bar chart for comparison, line chart for trends and table alternative. Explain incomparable definitions and unavailable denominators.

## 10 Reports Center

Filters define the authorized export scope. CSV, PDF and Excel are offered only when the respective export path is implemented. Demo CSVs carry an explicit synthetic-data notice. Do not create blank-looking or misleading downloads.

## 11 Data Management

Import → field mapping → validation → reviewer check → publish. Show validation findings, source/license, duplicates, errors and audit trail. Upload alone never marks data verified.

## 12 Administration

User, role, permission and audit views. Enforce least privilege and scope access. Confirm sensitive changes and record actor/time; hide actions a role cannot perform.

## 13 System Monitoring

API, database and GIS health panels sourced from actual health signals, timestamp and error state. Unconnected services show “Not connected”; do not imply live production readiness.

## 14 Public Portal

Publicly available scheme information, verified sources, methodology, data freshness, privacy and accessibility statements. No private records or unsupported application status lookup.

## Empty, loading and error states

Use shared skeletons during loading; explain why data are unavailable; offer a relevant next step when possible. Distinguish empty result, missing source, permission denied and service failure.
