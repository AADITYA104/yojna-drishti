"use client";

import { useEffect, useState } from "react";

interface ProgressRingProps {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
}

export function ProgressRing({ value, size = 72, stroke = 8, color = "var(--mor-600)", label }: ProgressRingProps) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - (on ? Math.min(100, Math.max(0, value)) : 0) / 100);
  return (
    <div style={{ position: "relative", width: size, height: size }} role="img" aria-label={label ?? `${value}%`}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--salt-200)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 1s var(--ease-out)" }} />
      </svg>
      <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontWeight: 700, fontSize: size * 0.24, color: "var(--ink-900)" }}>
        {Math.round(value)}%
      </span>
    </div>
  );
}
