"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { DataBadge, type DataBadgeType } from "./DataBadge";

export interface KpiCardProps {
  title: string;
  /** Pass a node (e.g. <AnimatedNumber/>) or a plain string/number. */
  value: ReactNode;
  sublabel?: string;
  icon?: LucideIcon;
  badge?: DataBadgeType;
  badgeLabel?: string;
  accent?: "saffron" | "teal" | "blue";
  className?: string;
}

export function KpiCard({ title, value, sublabel, icon: Icon, badge, badgeLabel, accent = "saffron", className = "" }: KpiCardProps) {
  const modifier = accent === "saffron" ? "" : ` dx-kpi--${accent}`;
  return (
    <article className={`dx-kpi${modifier} ${className}`.trim()}>
      <div className="dx-kpi__head">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          {Icon && (
            <span className="dx-kpi__icon" aria-hidden="true">
              <Icon size={17} strokeWidth={2} />
            </span>
          )}
          <h3 style={{ margin: 0, fontSize: "inherit", fontWeight: "inherit" }}>{title}</h3>
        </span>
        {badge && <DataBadge type={badge} label={badgeLabel} />}
      </div>
      <div className="dx-kpi__value">{value}</div>
      {sublabel && <p className="dx-kpi__sub" style={{ margin: 0 }}>{sublabel}</p>}
    </article>
  );
}
