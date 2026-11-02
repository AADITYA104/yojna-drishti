# ADR-0017: One professional light design system across the product

- **Status:** ACCEPTED (owner direction)
- **Date:** 2026-11-01

## Context
The owner provided a final set of Yojana Drishti dashboard references and explicitly selected one consistent visual system from the public/landing portal through administration. Earlier exploratory references included dark treatments and left the theme open.

## Problem
Prevent design drift between map, analytics, public and administrative screens while retaining a readable government-intelligence interface.

## Options considered
(a) One professional light system; (b) dark map with light dashboards; (c) user-selectable light/dark themes.

## Selected decision
Use one professional light theme throughout: deep-navy sidebar, Government Blue primary actions, teal secondary accent, white/light-grey canvas and cards, green success, amber warning, consistent Inter and Noto Sans Gujarati typography. Use Apache ECharts for charts and MapLibre GL JS for production maps. Motion stays subtle and respects reduced-motion preferences.

## Reasoning
This follows the owner's final direction and keeps navigation, branding, components and interaction consistent across all product areas.

## Advantages
One component styling system, coherent navigation, fewer theme-specific accessibility and QA cases.

## Disadvantages
Dark-mode preference is not supported. Production GIS still needs real, licensed boundaries and map-provider configuration.

## Consequences
Remove theme switching from the product UI. Keep any retired dark-theme tokens only if needed for historical reference; do not use them in current screens. Update every design spec and route to the same shell. Screenshot figures remain illustrative; never copy them as official data.

## Related documentation
ADR-0015, docs/07-design/ui-ux-spec.md, docs/07-design/design-system.md, docs/07-design/dashboard-layouts.md, docs/07-design/animation-spec.md, docs/07-design/reference-design-analysis.md.
