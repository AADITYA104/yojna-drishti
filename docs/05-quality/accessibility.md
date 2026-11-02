# Accessibility

Target: WCAG 2.2 Level AA for public and admin interfaces.

## Requirements
- Keyboard: every map action has a keyboard path: focusable unit list alongside the map (also the fallback), arrow keys to move between children, Enter to select, Escape or Backspace to go up a level; visible focus ring; no keyboard trap in the map.
- Map alternative: a data table/list of the same units and values is always available (toggle), satisfying non-visual access.
- Contrast: text 4.5:1, UI components and map boundaries 3:1; choropleth palette tested for colour-blindness; never colour alone (patterns for null, labels, values in tooltip and table).
- Semantics: landmarks, heading order, buttons as buttons, form labels, error association, language attribute set per locale (lang en or gu), aria-live for panel load announcements.
- Charts: title, summary sentence, and data table alternative.
- Motion: respect prefers-reduced-motion (instant camera jumps, no count-up, no sequential draw); a manual Reduce motion toggle.
- Gujarati: Noto Sans Gujarati, line-height at least 1.6, no truncating conjuncts, test with long strings.
- Touch targets at least 44 px; zoom to 200 percent without loss; reflow at 320 px width.
- Time: no auto-refresh that moves content.

## Testing
axe in E2E on key screens; manual keyboard walk-through of the full drill-down; screen-reader spot check (NVDA or VoiceOver) of village panel; reduced-motion test. Results recorded here after execution; currently NOT RUN.
