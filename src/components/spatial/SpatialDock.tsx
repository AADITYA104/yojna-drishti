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
import type { AppLanguage } from "@/lib/i18n";
import { localizeText } from "@/lib/i18n";

export type SpatialNavKey =
  | "dashboard"
  | "schemes"
  | "map"
  | "wizard"
  | "saved"
  | "settings"
  | "villages"
  | "financials";

interface SpatialDockProps {
  activeKey: SpatialNavKey;
  onSelect: (key: SpatialNavKey) => void;
  gu?: boolean;
  lang?: AppLanguage;
}

export function SpatialDock({ activeKey, onSelect, gu = true, lang }: SpatialDockProps) {
  const language = lang ?? (gu ? "gu" : "en");

  const navItems = [
    {
      key: "dashboard" as const,
      labelGu: "મુખ્ય ડેશબોર્ડ",
      labelEn: "Main Dashboard",
      labelHi: "मुख्य डैशबोर्ड",
      icon: LayoutDashboard,
    },
    {
      key: "schemes" as const,
      labelGu: "બધી યોજનાઓ",
      labelEn: "All Schemes",
      labelHi: "सभी योजनाएँ",
      icon: Compass,
    },
    {
      key: "map" as const,
      labelGu: "ગુજરાત ભૌગોલિક નકશો",
      labelEn: "Gujarat Map",
      labelHi: "गुजरात नक्शा",
      icon: MapPin,
    },
    {
      key: "wizard" as const,
      labelGu: "સ્માર્ટ પાત્રતા નિર્ધારક",
      labelEn: "Smart Eligibility",
      labelHi: "स्मार्ट पात्रता",
      icon: Sparkles,
    },
    {
      key: "saved" as const,
      labelGu: "લાભાર્થી વિશ્લેષણ",
      labelEn: "Beneficiary Analytics",
      labelHi: "लाभार्थी विश्लेषण",
      icon: BookmarkCheck,
    },
    {
      key: "settings" as const,
      labelGu: "વહીવટી વ્યવસ્થાપન",
      labelEn: "Administration",
      labelHi: "प्रशासनिक प्रबंधन",
      icon: Settings,
    },
  ];

  return (
    <aside className="spatial-dock-anchor" aria-label={language === "gu" ? "મુખ્ય નેવિગેશન" : language === "hi" ? "मुख्य नेविगेशन" : "Main navigation"}>
      <nav className="spatial-dock-capsule">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeKey === item.key;
          const title = language === "gu" ? item.labelGu : language === "hi" ? item.labelHi : item.labelEn;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              title={title}
              aria-label={title}
              aria-current={isActive ? "page" : undefined}
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
