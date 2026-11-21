"use client";

import React from "react";

export interface MapLegendProps {
  reachedLabel?: string;
  zeroLabel?: string;
  unknownLabel?: string;
  className?: string;
}

export function MapLegend({
  reachedLabel = "યોજના પહોંચેલ (Reached)",
  zeroLabel = "0 પહોંચ / બાકી (Not Reached)",
  unknownLabel = "માહિતી ઉપલબ્ધ નથી (Unknown)",
  className = "",
}: MapLegendProps) {
  return (
    <div
      className={`map-legend flex items-center flex-wrap gap-4 p-3 ${className}`}
      style={{
        backgroundColor: "var(--color-surface, rgba(255, 255, 255, 0.07))",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid var(--color-border, rgba(255, 255, 255, 0.14))",
        borderRadius: "var(--radius-sm, 8px)",
        fontSize: "0.78rem",
      }}
      aria-label="નકશા સૂચકાંક (Map Legend)"
    >
      <div className="flex items-center gap-2">
        <span
          className="w-3.5 h-3.5 rounded-sm inline-block"
          style={{
            backgroundColor: "var(--color-success, #15803D)",
            border: "1px solid rgba(74, 222, 128, 0.6)",
          }}
          aria-hidden="true"
        />
        <span style={{ color: "var(--color-text-muted, rgba(255, 255, 255, 0.85))" }}>
          {reachedLabel}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span
          className="w-3.5 h-3.5 rounded-sm inline-block"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            border: "1px solid var(--color-border, rgba(255, 255, 255, 0.20))",
          }}
          aria-hidden="true"
        />
        <span style={{ color: "var(--color-text-muted, rgba(255, 255, 255, 0.85))" }}>
          {zeroLabel}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span
          className="w-3.5 h-3.5 rounded-sm inline-block"
          style={{
            backgroundColor: "rgba(100, 116, 139, 0.2)",
            border: "1.5px dashed var(--color-unknown, #64748B)",
          }}
          aria-hidden="true"
        />
        <span style={{ color: "var(--color-text-subtle, rgba(255, 255, 255, 0.65))" }}>
          {unknownLabel}
        </span>
      </div>
    </div>
  );
}
