# YOJANA DRISHTI — Animation Specification

Motion is subtle, consistent and functional across the single light UI. It signals selection, navigation or loading; it never implies data freshness. Honor `prefers-reduced-motion` and an in-product reduce-motion setting if/when provided.

| Event | Motion | Timing | Reduced motion |
|---|---|---:|---|
| Sidebar drawer | Translate from edge with opacity | 180ms ease-out | Instant |
| Dropdown/popover | Short opacity and small vertical reveal | 120ms ease-out | Instant |
| Card hover/focus | Border/background emphasis; no lift required | 120ms | Keep focus indication, no transition |
| Map hover | Boundary outline/fill emphasis | 120ms | Immediate state |
| Map selection/drill | MapLibre fitBounds to selected geography | 450–700ms, cap at 900ms | Jump to bounds |
| Breadcrumb update | Color/opacity change | 120ms | Immediate |
| Loading | Static skeleton; optional restrained shimmer | 1.2s cycle | Static skeleton |
| Filter change | Update values and map colors | 180ms | Immediate |
| Toast | Fade/short slide in and out | 160ms | Immediate |

No looping decorative animation, count-up for statistics, pulsing “live” dots, glow, parallax, auto-rotating globe or 3D tilt. Do not animate unknown or synthetic values as if they are real. Use transform/opacity or MapLibre camera transitions; avoid layout thrash. Motion must not block interaction or hide state from assistive technology.
