# Reference Design Analysis

Two reference screenshots were supplied by the owner. This document records what is adopted, adapted or rejected, so the design stays purposeful (Part 0 s14).

## Reference 1: dark regional geospatial dashboard
Observed: left navigation sidebar with a Map Layers checklist and data source plus last-updated at the foot; header with title, subtitle, date picker, Share and Filters; a row of six KPI tiles with delta versus previous period; large satellite-style map with zoom controls, in-map legend and a scale bar; right column with a heat-density inset and gauge cards; bottom row with progress bars by category, ranked bars, donut distribution, and a recent-alerts list.
| Element | Decision | Reason |
|---|---|---|
| Left sidebar with sections and layer checklist | ADOPT (FR-UX-01) | Clear navigation, map layer control |
| Data source and last-updated in sidebar foot | ADOPT | Provenance always visible |
| KPI tile row with previous-period delta | ADAPT: delta only when the previous period has a comparable, verified value (else hidden) | Avoid misleading comparisons |
| Date picker and Share | ADOPT: reporting range selector (FR-UX-02) and Share link (deep link FR-GEO-08) | |
| Filters button | ADOPT as filter drawer on mobile | |
| In-map legend and scale bar | ADOPT | |
| Ranked bar chart, donut, progress bars | ADAPT: ranked bars for districts and talukas; donut only up to 5 slices (applications by status); progress bars for coverage only when computable | Design system chart rules |
| Heat-density and tourism flow inset | REJECT | No analytical meaning for scheme statistics |
| Gauge cards (air quality, water quality) | REJECT | No equivalent metric; gauges invite fake precision |
| Recent alerts list | ADAPT as Recent data publications and data-quality alerts (real events only) | No fake alerts |
| Glow, neon pins, satellite imagery as default | REJECT as default; satellite optional | Part 0 s14, boundary legibility |
| Dark theme | REJECTED for the current product; use one light theme per ADR-0017 | The owner's final master design direction supersedes earlier exploratory references |

## Reference 2: city operations dashboard (dark)
Observed: central district map with small glyph bars per district, hover tooltip card with four counts, left KPI blocks, right news and time slider by hour, lower panels with a local map, camera feeds, related-agency table and similar-incident table.
| Element | Decision | Reason |
|---|---|---|
| District map as the hero with hover card of counts | ADOPT: hover card showing selected metric and scheme counts | Fast comparison |
| Per-district glyph bars on map | OPTIONAL P3: small scheme-count glyphs; off by default | Clutter risk at 34 districts and impossible for villages |
| Time slider on the right | ADAPT: reporting-period playback (FR-UX-03) | |
| Live news feed, CCTV, live incident blocks | REJECT | Not relevant; would imply real-time data we do not have |
| Dense multi-panel layout | ADAPT: information-dense panels, but one primary task per screen | |
| Related agencies table | ADAPT: Responsible office and official links block on scheme pages | |

## Resulting visual principles
1. Map is the hero; panels are secondary and collapsible.
2. One professional light theme from public portal through administration; no theme switch.
3. Colour encodes meaning only (status, scale, null).
4. No element implies real-time unless the data is real-time (no live pulse indicators).
5. Every tile carries definition, source and as-of date.


## Final master design direction (2026-11-01)
The owner supplied a final dashboard design system: professional light canvas, deep navy sidebar, Government Blue primary, teal secondary, green success, amber warning, Inter + Noto Sans Gujarati, Apache ECharts, MapLibre GL JS for production maps, subtle motion and Gujarati/English content. This decision is recorded in ADR-0017. Earlier mockup statistics and stylized maps are visual references only, not official records or licensed boundaries.


