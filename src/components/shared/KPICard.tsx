"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, CircleHelp, LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  changePercent?: number;
  changeLabel?: string;
  icon: LucideIcon;
  tone?: number;
  tooltip?: string;
  gu?: boolean;
  accentColor?: string;
  index?: number;
}

const TONE_STYLES = [
  { bg: "rgba(77, 121, 168, 0.12)", icon: "#4D79A8", border: "rgba(77, 121, 168, 0.25)" }, // Holst 500
  { bg: "rgba(45, 125, 132, 0.12)", icon: "#2D7D84", border: "rgba(45, 125, 132, 0.25)" }, // Teal
  { bg: "rgba(107, 78, 174, 0.12)", icon: "#6B4EAE", border: "rgba(107, 78, 174, 0.25)" }, // Purple
  { bg: "rgba(192, 120, 32, 0.12)", icon: "#C07820", border: "rgba(192, 120, 32, 0.25)" }, // Amber
];

export function KPICard({
  title,
  value,
  changePercent = 4.8,
  changeLabel,
  icon: Icon,
  tone = 0,
  tooltip,
  gu = false,
  accentColor,
  index = 0,
}: KPICardProps) {
  const isPositive = changePercent >= 0;
  const toneStyle = TONE_STYLES[tone % 4];
  const delayMs = index * 70;

  return (
    <article
      className="kpi-card kpi-card-animate card-lift"
      style={{
        animationDelay: `${delayMs}ms`,
        position: "relative",
        background: "rgba(255, 255, 255, 0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRadius: "16px",
        border: "1px solid rgba(110, 158, 204, 0.24)",
        padding: "18px 20px",
        boxShadow: "0 2px 10px rgba(34, 58, 94, 0.05)",
        transition: "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease, border-color 0.22s ease",
      }}
    >
      <div
        className="kpi-icon"
        style={{
          background: accentColor ? `${accentColor}18` : toneStyle.bg,
          color: accentColor ?? toneStyle.icon,
          border: `1px solid ${accentColor ? `${accentColor}30` : toneStyle.border}`,
          width: 42,
          height: 42,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <Icon size={20} />
      </div>

      <div className="kpi-top" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <span
          className="kpi-title"
          style={{
            fontSize: "0.78rem",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--holst-700, #355982)",
            fontWeight: 600,
          }}
        >
          {title}
        </span>
        {tooltip && (
          <span
            className="metric-help"
            title={tooltip}
            style={{ color: "var(--holst-400, #6E9ECC)", cursor: "help", display: "inline-flex" }}
          >
            <CircleHelp size={13} />
          </span>
        )}
      </div>

      <strong
        className="kpi-value"
        style={{
          display: "block",
          fontSize: "1.85rem",
          fontWeight: 700,
          color: "var(--holst-900, #223A5E)",
          lineHeight: 1.15,
          marginBottom: 10,
          fontFamily: "var(--font-display, inherit)",
        }}
      >
        {value}
      </strong>

      <div className="kpi-foot" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            padding: "2px 8px",
            borderRadius: 999,
            fontSize: "0.74rem",
            fontWeight: 600,
            background: isPositive ? "rgba(46, 125, 82, 0.12)" : "rgba(198, 59, 90, 0.12)",
            color: isPositive ? "#2E7D52" : "#C63B5A",
            border: `1px solid ${isPositive ? "rgba(46, 125, 82, 0.24)" : "rgba(198, 59, 90, 0.24)"}`,
          }}
        >
          {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {Math.abs(changePercent)}%
        </span>
        <span style={{ fontSize: "0.74rem", color: "var(--holst-500, #4D79A8)" }}>
          {changeLabel ?? (gu ? "પાછલા વર્ષ સામે" : "vs previous FY")}
        </span>
      </div>
    </article>
  );
}
