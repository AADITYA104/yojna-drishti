"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Compass,
  MapPin,
  Sparkles,
  BarChart3,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import type { AppLanguage } from "@/lib/i18n";

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
  const [pulse, setPulse] = useState(0);

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
      labelGu: "ડેટાસેટ વિશ્લેષણ",
      labelEn: "Dataset analytics",
      labelHi: "डेटासेट विश्लेषण",
      icon: BarChart3,
    },
    {
      key: "settings" as const,
      labelGu: "ડેટા ગવર્નન્સ",
      labelEn: "Data Governance",
      labelHi: "डेटा गवर्नेंस",
      icon: Settings,
    },
  ];

  return (
    <aside className="spatial-dock-anchor">
      <nav className="spatial-dock-capsule" aria-label={language === "gu" ? "મુખ્ય નેવિગેશન" : language === "hi" ? "मुख्य नेविगेशन" : "Main navigation"}>
        <span className="spatial-dock-heading" aria-hidden="true">
          {language === "gu" ? "વિભાગો" : language === "hi" ? "सेक्शन" : "SECTIONS"}
        </span>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeKey === item.key;
          const title = language === "gu" ? item.labelGu : language === "hi" ? item.labelHi : item.labelEn;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setPulse((current) => current + 1);
                onSelect(item.key);
              }}
              title={title}
              data-tooltip={title}
              aria-label={title}
              aria-current={isActive ? "page" : undefined}
              className={`spatial-dock-item ${isActive ? "active" : ""}`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeDockBubble"
                  className="spatial-dock-active-pill"
                  initial={{ opacity: 0, scale: 0.72 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 440, damping: 22, mass: 0.68 }}
                />
              )}
              <motion.span
                key={`${item.key}-${isActive}-${isActive ? pulse : 0}`}
                className="spatial-dock-icon-wrap"
                initial={false}
                animate={isActive ? { y: [0, -5, 0], scale: [1, 1.08, 1] } : { y: 0, scale: 1 }}
                transition={{ duration: 0.34, times: [0, 0.38, 1], ease: [0.22, 1, 0.36, 1] }}
              >
                <Icon size={20} strokeWidth={1.75} />
              </motion.span>
              <span className="spatial-dock-label">{title}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
