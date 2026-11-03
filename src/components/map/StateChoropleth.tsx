"use client";

import { useMemo, useState, type PointerEvent } from "react";
import { GUJARAT_DISTRICT_POLYGONS } from "@/lib/gujarat-svg-paths";
import type { District } from "@/lib/demo-data";

interface StateChoroplethProps {
  districts: District[];
  metric: (d: District) => number;
  format: (n: number) => string;
  metricLabel: string;
  gu: boolean;
  pilotId?: string;
  selectedId?: string;
  onSelect?: (d: District) => void;
}

const RAMP = ["var(--map-1)", "var(--map-2)", "var(--map-3)", "var(--map-4)", "var(--map-5)"];

/**
 * Hero map: real district polygons, 5-step quantile ramp, a reveal that ripples outward from the pilot district,
 * keyboard-accessible, with a pointer tooltip. Replaces the plain "open map" banner on Overview.
 */
export function StateChoropleth({ districts, metric, format, metricLabel, gu, pilotId = "bhavnagar", selectedId, onSelect }: StateChoroplethProps) {
  const [hover, setHover] = useState<{ d: District; x: number; y: number } | null>(null);

  const { byName, bin, delay, breaks } = useMemo(() => {
    const byName = new Map(districts.map((d) => [d.name, d]));
    const sorted = [...districts].sort((a, b) => metric(a) - metric(b));
    const bin = new Map<string, number>();
    sorted.forEach((d, i) => bin.set(d.id, Math.min(4, Math.floor((i / sorted.length) * 5))));
    const pilotPoly = GUJARAT_DISTRICT_POLYGONS.find((p) => byName.get(p.name)?.id === pilotId);
    const origin = pilotPoly?.centroid ?? { x: 500, y: 400 };
    const dist = (p: { x: number; y: number }) => Math.hypot(p.x - origin.x, p.y - origin.y);
    const max = Math.max(...GUJARAT_DISTRICT_POLYGONS.map((p) => dist(p.centroid)), 1);
    const delay = new Map(GUJARAT_DISTRICT_POLYGONS.map((p) => [p.name, Math.round((dist(p.centroid) / max) * 900)]));
    const vals = sorted.map(metric);
    const breaks = [0, 1, 2, 3, 4].map((k) => vals[Math.floor((k / 5) * vals.length)] ?? 0);
    return { byName, bin, delay, breaks };
  }, [districts, metric, pilotId]);

  const onMove = (e: PointerEvent<SVGPathElement>, d: District) => {
    const box = e.currentTarget.ownerSVGElement?.parentElement?.getBoundingClientRect();
    if (!box) return;
    setHover({ d, x: e.clientX - box.left, y: e.clientY - box.top });
  };

  const ordered = [...GUJARAT_DISTRICT_POLYGONS].sort((a, b) => {
    const rank = (n: string) => (byName.get(n)?.id === selectedId ? 2 : byName.get(n)?.id === hover?.d.id ? 1 : 0);
    return rank(a.name) - rank(b.name);
  });

  return (
    <div className="dr-map-wrap">
      <svg className="dr-map" viewBox="20 20 910 680" role="group" aria-label={gu ? "ગુજરાત જિલ્લા નકશો" : "Gujarat district map"}>
        {ordered.map((p) => {
          const d = byName.get(p.name);
          if (!d) return null;
          const isPilot = d.id === pilotId;
          return (
            <path
              key={p.name}
              d={p.path}
              className={`dr-dist${isPilot ? " dr-pilot-ring" : ""}`}
              style={{ fill: RAMP[bin.get(d.id) ?? 0], ["--d" as string]: `${delay.get(p.name) ?? 0}ms` }}
              role="button"
              tabIndex={0}
              aria-pressed={selectedId === d.id}
              aria-label={`${gu ? d.gu : d.name}: ${format(metric(d))} ${metricLabel}`}
              onPointerMove={(e) => onMove(e, d)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(null)}
              onClick={() => onSelect?.(d)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect?.(d); } }}
            />
          );
        })}
      </svg>
      {hover && (
        <div className="dr-map-tip" style={{ left: hover.x, top: hover.y }}>
          <b>{gu ? hover.d.gu : hover.d.name}</b>
          {format(metric(hover.d))} {metricLabel}
        </div>
      )}
      <div className="dr-legend" aria-hidden="true">
        {RAMP.map((c, i) => (<span key={c} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><i style={{ background: c }} />{format(breaks[i])}+</span>))}
      </div>
    </div>
  );
}
