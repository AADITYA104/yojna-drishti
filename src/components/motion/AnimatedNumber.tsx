"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  locale?: string; // "gu-IN" | "en-IN"
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/** Counts up once when scrolled into view, then tweens between values (e.g. when the FY filter changes). */
export function AnimatedNumber({ value, locale = "en-IN", duration = 1100, decimals = 0, prefix = "", suffix = "", className }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(0);
  const started = useRef(false);
  // Frozen so React never rewrites the text node that we update imperatively.
  const [initial] = useState(() => `${prefix}${(0).toFixed(decimals)}${suffix}`);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fmt = new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    const write = (n: number) => { el.textContent = `${prefix}${fmt.format(n)}${suffix}`; };
    let raf = 0;
    let io: IntersectionObserver | undefined;

    const run = () => {
      const from = shown.current;
      const to = value;
      if (reduce || from === to) { shown.current = to; write(to); return; }
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 4);
        const n = from + (to - from) * eased;
        shown.current = n;
        write(decimals ? n : Math.round(n));
        if (p < 1) raf = requestAnimationFrame(tick);
        else { shown.current = to; write(to); }
      };
      raf = requestAnimationFrame(tick);
    };

    if (started.current) run();
    else {
      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { started.current = true; io?.disconnect(); run(); }
      }, { threshold: 0.3 });
      io.observe(el);
    }
    return () => { cancelAnimationFrame(raf); io?.disconnect(); };
  }, [value, locale, duration, decimals, prefix, suffix]);

  return <span ref={ref} className={className} aria-label={`${prefix}${value}${suffix}`} suppressHydrationWarning>{initial}</span>;
}
