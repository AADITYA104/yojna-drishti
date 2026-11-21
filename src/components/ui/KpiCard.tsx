"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import { DataBadge, type DataBadgeType } from "./DataBadge";

export interface KpiCardProps {
  title: string;
  value: string | number;
  sublabel?: string;
  icon?: LucideIcon;
  badge?: DataBadgeType;
  accent?: "saffron" | "teal" | "green" | "neutral";
  className?: string;
}

export function KpiCard({
  title,
  value,
  sublabel,
  icon: Icon,
  badge = "DEMO",
  accent = "saffron",
  className = "",
}: KpiCardProps) {
  const accentColors = {
    saffron: { iconBg: "rgba(217, 119, 6, 0.15)", iconColor: "#F59E0B", border: "rgba(217, 119, 6, 0.3)" },
    teal: { iconBg: "rgba(45, 125, 132, 0.15)", iconColor: "#38BDF8", border: "rgba(56, 189, 248, 0.3)" },
    green: { iconBg: "rgba(21, 128, 61, 0.15)", iconColor: "#4ADE80", border: "rgba(74, 222, 128, 0.3)" },
    neutral: { iconBg: "rgba(255, 255, 255, 0.08)", iconColor: "#E2E8F0", border: "rgba(255, 255, 255, 0.15)" },
  }[accent];

  return (
    <article
      className={`kpi-card relative flex flex-col justify-between p-5 transition-all duration-200 ${className}`}
      style={{
        backgroundColor: "var(--color-surface, rgba(255, 255, 255, 0.07))",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid var(--color-border, rgba(255, 255, 255, 0.14))",
        borderRadius: "var(--radius-lg, 16px)",
        boxShadow: "var(--shadow-sm, 0 2px 8px -2px rgba(0, 0, 0, 0.35))",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className="flex items-center justify-center w-9 h-9"
              style={{
                backgroundColor: accentColors.iconBg,
                color: accentColors.iconColor,
                borderRadius: "var(--radius-sm, 8px)",
                border: `1px solid ${accentColors.border}`,
              }}
              aria-hidden="true"
            >
              <Icon size={18} strokeWidth={2} />
            </div>
          )}
          <h3
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-text-muted, rgba(255, 255, 255, 0.78))" }}
          >
            {title}
          </h3>
        </div>
        {badge && <DataBadge type={badge} />}
      </div>

      <div className="mt-1">
        <div
          className="text-2xl md:text-3xl font-bold tracking-tight"
          style={{ color: "var(--color-text, #F8FAFC)", fontFamily: "var(--font-display, inherit)" }}
        >
          {value}
        </div>
        {sublabel && (
          <p
            className="text-xs mt-1.5 font-normal"
            style={{ color: "var(--color-text-subtle, rgba(255, 255, 255, 0.60))" }}
          >
            {sublabel}
          </p>
        )}
      </div>
    </article>
  );
}
