"use client";

import React from "react";
import {
  LayoutDashboard,
  Compass,
  MapPin,
  Sparkles,
  BookmarkCheck,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";

export type SpatialNavKey =
  | "dashboard"
  | "schemes"
  | "map"
  | "wizard"
  | "saved"
  | "settings";

interface SpatialDockProps {
  activeKey: SpatialNavKey;
  onSelect: (key: SpatialNavKey) => void;
  gu?: boolean;
}

export function SpatialDock({ activeKey, onSelect, gu = true }: SpatialDockProps) {
  const navItems = [
    {
      key: "dashboard" as const,
      labelGu: "મુખ્ય ડેશબોર્ડ",
      labelEn: "Main Dashboard",
      icon: LayoutDashboard,
    },
    {
      key: "schemes" as const,
      labelGu: "યોજનાઓ શોધો",
      labelEn: "Explore Yojnas",
      icon: Compass,
    },
    {
      key: "map" as const,
      labelGu: "ગુજરાત ભૌગોલિક નકશો",
      labelEn: "33-District Map",
      icon: MapPin,
    },
    {
      key: "wizard" as const,
      labelGu: "પાત્રતા ચકાસણી",
      labelEn: "Smart Eligibility",
      icon: Sparkles,
    },
    {
      key: "saved" as const,
      labelGu: "સાચવેલ & લાગુ યોજનાઓ",
      labelEn: "Saved & Applied",
      icon: BookmarkCheck,
    },
    {
      key: "settings" as const,
      labelGu: "સેટિંગ્સ & પ્રોફાઇલ",
      labelEn: "Settings & Profile",
      icon: Settings,
    },
  ];

  return (
    <aside className="spatial-dock-anchor" aria-label="Spatial Navigation Dock">
      <nav className="spatial-dock-capsule">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeKey === item.key;
          const title = gu ? item.labelGu : item.labelEn;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              title={title}
              aria-label={title}
              className={`spatial-dock-item ${isActive ? "active" : ""}`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeDockBubble"
                  className="spatial-dock-active-pill"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="spatial-dock-icon-wrap">
                <Icon size={20} strokeWidth={1.75} />
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
