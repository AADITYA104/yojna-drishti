import { flushSync } from "react-dom";

/** Wrap any state update that swaps a page. Falls back to a plain update when unsupported / reduced motion. */
export function withViewTransition(update: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reduce) {
    update();
    return;
  }
  doc.startViewTransition(() => {
    flushSync(update);
  });
}
