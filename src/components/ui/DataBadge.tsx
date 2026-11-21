"use client";

import React from "react";

export type DataBadgeType = "DEMO" | "VERIFIED" | "UNKNOWN";

interface DataBadgeProps {
  type: DataBadgeType;
  label?: string;
  className?: string;
}

export function DataBadge({ type, label, className = "" }: DataBadgeProps) {
  const config = {
    DEMO: {
      defaultLabelGu: "નમૂનો (DEMO)",
      defaultLabelEn: "DEMO",
      bg: "rgba(217, 119, 6, 0.16)",
      border: "rgba(245, 158, 11, 0.40)",
      color: "#FBBF24",
    },
    VERIFIED: {
      defaultLabelGu: "સત્તાવાર (VERIFIED)",
      defaultLabelEn: "VERIFIED",
      bg: "rgba(21, 128, 61, 0.16)",
      border: "rgba(34, 197, 94, 0.40)",
      color: "#4ADE80",
    },
    UNKNOWN: {
      defaultLabelGu: "અજ્ઞાત (UNKNOWN)",
      defaultLabelEn: "UNKNOWN",
      bg: "rgba(100, 116, 139, 0.16)",
      border: "rgba(148, 163, 184, 0.40)",
      color: "#94A3B8",
    },
  }[type];

  const displayLabel = label || config.defaultLabelGu;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 font-medium tracking-wide uppercase ${className}`}
      style={{
        backgroundColor: config.bg,
        borderColor: config.border,
        color: config.color,
        borderWidth: "1px",
        borderStyle: type === "UNKNOWN" ? "dashed" : "solid",
        borderRadius: "var(--radius-sm, 8px)",
        fontSize: "0.72rem",
        letterSpacing: "0.04em",
        lineHeight: "1.4",
      }}
      role="status"
    >
      {displayLabel}
    </span>
  );
}
