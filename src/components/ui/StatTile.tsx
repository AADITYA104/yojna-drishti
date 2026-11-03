import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { AnimatedNumber } from "../motion/AnimatedNumber";

interface StatTileProps {
  label: string;
  value: number;
  locale?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta?: number; // percent
  deltaLabel?: string;
  series?: number[]; // optional sparkline
  accent?: "indigo" | "haldi" | "mor" | "neem";
}

function sparkPath(series: number[], w = 96, h = 34) {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  return series
    .map((v, i) => `${i === 0 ? "M" : "L"}${((i / (series.length - 1)) * w).toFixed(1)} ${(h - 3 - ((v - min) / span) * (h - 6)).toFixed(1)}`)
    .join(" ");
}

export function StatTile({ label, value, locale, prefix, suffix, decimals, delta, deltaLabel, series, accent = "indigo" }: StatTileProps) {
  const up = (delta ?? 0) >= 0;
  return (
    <article className="dr-stat" data-accent={accent}>
      <span className="dr-stat__label">{label}</span>
      <AnimatedNumber className="dr-stat__value" value={value} locale={locale} prefix={prefix} suffix={suffix} decimals={decimals} />
      {delta !== undefined && (
        <div className="dr-stat__foot">
          <span className={`dr-delta ${up ? "dr-delta--up" : "dr-delta--down"}`}>
            {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(delta)}%
          </span>
          {deltaLabel && <span>{deltaLabel}</span>}
        </div>
      )}
      {series && series.length > 1 && (
        <svg className="dr-stat__spark" viewBox="0 0 96 34" aria-hidden="true">
          <path d={sparkPath(series)} pathLength={1} />
        </svg>
      )}
    </article>
  );
}
