# YOJANA DRISHTI — Final UI/UX Specification

Status: master visual reference for the whole product. The supplied dashboard mockups define the visual direction; their figures, badges and map shapes are illustrative and are not official data.

## Product experience

Use one professional light interface from the landing/public portal through administration. Keep the same deep-navy sidebar, white/light-grey canvas, Government Blue primary actions, teal secondary emphasis, typography, card geometry, and interaction patterns on every screen. The product is Gujarati and English; Gujarati content is first-class and must be reviewed by a native speaker.

## Sitemap (14 workspaces)

1. State Overview — Gujarat KPIs, geographic view, trends and verified source status.
2. GIS Map Explorer — state → district → taluka → village selection and information panel.
3. District Intelligence — district profile, available schemes, geography and trends.
4. Taluka Intelligence — taluka profile and village comparisons.
5. Village Intelligence — scheme details and aggregate statistics only.
6. Scheme Intelligence — eligibility, benefits, official GR/source and geography.
7. Beneficiary Analytics — scheme/geography aggregate statistics only.
8. Financial Intelligence — budget, sanctioned and disbursed as separate measures.
9. Analytics & Comparison — comparable metrics, trends and coverage.
10. Reports Center — filter-scoped CSV, PDF and Excel when supported by authorized data.
11. Data Management — import, validation, verification and publication workflow.
12. Administration — users, roles, permissions and audit history.
13. System Monitoring — API, database and GIS status from actual health signals.
14. Public Portal — public scheme information and methodology/privacy notices.

## Shared shell and navigation

`AppSidebar` and `TopHeader` persist across all screens. Header includes brand, global search, notifications/data status, help, language, profile and shared financial-year context. The sidebar groups all 14 workspaces and uses the same labels, active state and responsive collapse behavior. Shared data screens use `GeographyBreadcrumb`, `FinancialYearFilter`, `SchemeFilter` and `GeographyFilter` in a consistent position. Filters with no supporting data are visibly disabled with a reason.

## Shared components

`AppSidebar`, `TopHeader`, `GlobalSearch`, `GeographyBreadcrumb`, `FinancialYearFilter`, `SchemeFilter`, `GeographyFilter`, `KpiCard`, `InteractiveMap`, `MapLegend`, `AnalyticsChart`, `DataTable`, `SchemeCard`, `FinancialSummary`, `DataSourceBadge`, `LastUpdated`, `EmptyState`, `LoadingSkeleton`, `ErrorPanel`, `ExportMenu`.

Every control must work, navigate, download, or clearly communicate why it is unavailable. Use Apache ECharts for charts and MapLibre GL JS for production maps. A schematic/demo map must be labelled as such and must never imply official boundaries. Data values must include definition, unit, period, provenance and freshness where available. Missing or suppressed values are not zero.

## Map interaction

The same breadcrumb, search, filters, selected-boundary treatment, legend and right-side information panel stay in place at every geography level. Selecting a district opens its profile and taluka boundaries; selecting a taluka opens villages; selecting a village opens scheme-level aggregate information. Breadcrumbs return to parent levels. Do not claim automatic boundary correction. If authorized boundaries are not loaded, show an unavailable state and keep the schematic explicitly illustrative.

## Screen and data rules

- State, district, taluka, village and scheme views use the common shell and cards. Geography views show only scopes the viewer may access.
- Beneficiary analytics are aggregated; never expose public individual beneficiary search or private personal details.
- Financial metrics remain separate: budget, sanction and disbursement are not combined without a documented definition.
- Reports export only the selected, authorized scope. Demo exports retain a DEMO marker. Unsupported formats are disabled with a clear reason.
- Upload does not equal verification or publication. Imports have validation and reviewer states.
- Administration uses role-based permissions; never imply every user is a super-admin.
- Monitoring reflects real health checks only. If a signal is not connected, show “Not connected” rather than “Live/Healthy”.
- Public scheme information includes official source and effective date; the application does not approve government applications.

## Accessibility and responsive behavior

Keyboard access, visible focus, semantic headings, labelled controls, table alternatives for charts, sufficient contrast and reduced-motion support are required. Touch targets should be at least 44px. Desktop uses fixed sidebar with a flexible content canvas; tablet uses a collapsible sidebar and responsive grids; mobile uses a drawer, stacked cards and horizontally scrollable tables.

## Content and data integrity

Use Indian number formatting for Gujarati/Indian English. Identify demo and synthetic content beside the value and in exports. Never copy mockup figures into the product as government facts. Do not infer fraud, causality or eligibility outcomes from incomplete data. Provide source/as-of labels and explicit empty, loading and error states.
