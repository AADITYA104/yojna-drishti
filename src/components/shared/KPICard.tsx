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
}

export function KPICard({
  title,
  value,
  changePercent = 4.8,
  changeLabel,
  icon: Icon,
  tone = 0,
  tooltip,
  gu = false,
}: KPICardProps) {
  const isPositive = changePercent >= 0;

  return (
    <article className="kpi-card">
      <div className={`kpi-icon tone-${tone % 4}`}>
        <Icon size={18} />
      </div>

      <div className="kpi-top">
        <span className="kpi-title">{title}</span>
        {tooltip && (
          <span className="metric-help" title={tooltip}>
            <CircleHelp size={13} />
          </span>
        )}
      </div>

      <strong className="kpi-value">{value}</strong>

      <div className="kpi-foot">
        <span className={isPositive ? "trend-up" : "trend-down"}>
          {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {Math.abs(changePercent)}%
        </span>
        <span className="kpi-foot-label">
          {changeLabel ?? (gu ? "પાછલા સમયગાળા સામે" : "vs previous FY")}
        </span>
      </div>
    </article>
  );
}
