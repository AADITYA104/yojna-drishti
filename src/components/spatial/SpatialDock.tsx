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

type Lang = "gu" | "en" | "hi";

interface SpatialDockProps {
  activeKey: SpatialNavKey;
  onSelect: (key: SpatialNavKey) => void;
  gu?: boolean;
  lang?: Lang;
}

export function SpatialDock({
  activeKey,
  onSelect,
  gu = true,
  lang = gu ? "gu" : "en",
}: SpatialDockProps) {
  const currentLang: Lang = lang || (gu ? "gu" : "en");

  const navItems = [
    {
      key: "schemes" as const,
      labelGu: "બધી યોજનાઓ",
      labelEn: "All schemes",
      labelHi: "सभी योजनाएं",
      icon: Compass,
    },
    {
      key: "dashboard" as const,
      labelGu: "સારાંશ",
      labelEn: "Overview",
      labelHi: "सारांश",
      icon: LayoutDashboard,
    },
    {
      key: "map" as const,
      labelGu: "ગુજરાત ભૌગોલિક નકશો",
      labelEn: "Gujarat map",
      labelHi: "गुजरात नक्शा",
      icon: MapPin,
    },
    {
      key: "wizard" as const,
      labelGu: "પાત્રતા પૂર્વદર્શન",
      labelEn: "Eligibility preview",
      labelHi: "पात्रता पूर्वदर्शन",
      icon: Sparkles,
    },
    {
      key: "saved" as const,
      labelGu: "લાભાર્થી વિશ્લેષણ · ડેમો",
      labelEn: "Beneficiary analytics · demo",
      labelHi: "लाभार्थी विश्लेषण · डेमो",
      icon: BookmarkCheck,
    },
    {
      key: "settings" as const,
      labelGu: "વહીવટી પૂર્વદર્શન",
      labelEn: "Administration preview",
      labelHi: "प्रशासन पूर्वदर्शन",
      icon: Settings,
    },
  ];

  return (
    <aside className="spatial-dock-anchor" aria-label="Spatial Navigation Dock">
      <nav className="spatial-dock-capsule">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeKey === item.key;
          const title =
            currentLang === "gu"
              ? item.labelGu
              : currentLang === "hi"
              ? item.labelHi
              : item.labelEn;

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
              <span className="spatial-dock-label-text" aria-hidden="true">
                {title}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
