# YOJANA DRISHTI — Final Design System

One professional light theme is used throughout the landing/public pages, dashboard and administration. No theme switch or alternate visual system. The supplied mockups define branding and layout only; illustrative values are not production data.

## Visual tokens

| Token | Value | Purpose |
|---|---|---|
| Navy 950 | `#071A31` | Sidebar / deep brand surface |
| Navy 900 | `#0B2545` | Sidebar, strong headings |
| Government Blue | `#1769AA` | Primary buttons, links, active navigation |
| Teal 600 | `#138681` | Secondary emphasis, map selection |
| Canvas | `#F2F5F8` | Main application background |
| Surface | `#FFFFFF` | Cards, panels, menus |
| Border | `#DCE4EC` | Dividers and control outlines |
| Text | `#172638` | Primary copy |
| Muted | `#65758A` | Secondary copy and metadata |
| Success | `#228557` | Verified/positive state |
| Warning | `#A76A18` | Pending/attention state |
| Error | `#B3261E` | Failed/rejected state |
| Demo | `#7545A5` | DEMO label only |
| Unavailable | `#7C8794` | Missing values/status |

Tokens in `src/styles/tokens.css` are the implementation source of truth. Check text contrast against WCAG AA. Color must not be the only way to convey status.

## Typography

Inter for English and Noto Sans Gujarati for Gujarati, with appropriate fallbacks. Body text 14–16px; compact dense data labels can be 12px minimum. Headings use a consistent 20/24/32px scale. Gujarati line height is at least 1.5. Use tabular numerals in data tables and consistent Indian grouping for displayed figures.

## Layout and shape

Use a 4px spacing scale (4, 8, 12, 16, 24, 32). Panels and controls use 6–8px corner radius and a 1px border. Use restrained elevation only for menus/drawers. Sidebar is deep navy; the page canvas stays white/light grey. Keep header, filters and card spacing consistent across all 14 sections.

## Components

Use the components defined in `ui-ux-spec.md`: shared shell, filters, KPI cards, map/legend, ECharts wrapper, tables, scheme and financial cards, source/freshness badges, loading/empty/error states and export menu. Avoid duplicate one-off versions. Controls need keyboard focus, labels, disabled reasons and clear feedback.

## Maps

Production map rendering uses MapLibre GL JS with licensed, verified boundaries. Use Government Blue/teal for selection and sequential single-hue ramps for metric layers, with a visible legend. Null and suppressed values have distinct neutral patterns and labels. Selected boundary uses an outline; hover is subtle. Schematic geography must be labelled “Illustrative / DEMO” and not be presented as a valid state boundary.

## Charts and data cards

Apache ECharts follows the same blue/teal palette. Use bars for comparisons and lines for time trends; avoid 3D and decorative gradients. Every chart has title, unit, period, data source and an accessible table/summary alternative. Do not show a chart as live when its source is demo or disconnected. Nulls remain gaps; never coerce them to zero.

## Status and content

Green = verified/positive, amber = pending/attention, red = failure, purple = demo, neutral = unavailable. Status text accompanies color. Each displayed metric includes definition, unit and period; source and last-updated date appear where available. Never present mockup statistics as official values.

## Implementation

Keep CSS variables in `src/styles/tokens.css`, component rules in `src/styles/app.css`, and shared UI behavior in reusable components. No dark palette or theme toggle is part of this master system.
