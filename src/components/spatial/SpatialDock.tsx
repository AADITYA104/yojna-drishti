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
      shortGu: "ડેશબોર્ડ",
      shortEn: "Dashboard",
      shortHi: "डैशबोर्ड",
      icon: LayoutDashboard,
    },
    {
      key: "schemes" as const,
      labelGu: "બધી યોજનાઓ",
      labelEn: "All Schemes",
      labelHi: "सभी योजनाएँ",
      shortGu: "યોજનાઓ",
      shortEn: "Schemes",
      shortHi: "योजनाएँ",
      icon: Compass,
    },
    {
      key: "map" as const,
      labelGu: "ગુજરાત ભૌગોલિક નકશો",
      labelEn: "Gujarat Map",
      labelHi: "गुजरात नक्शा",
      shortGu: "નકશો",
      shortEn: "Map",
      shortHi: "नक्शा",
      icon: MapPin,
    },
    {
      key: "wizard" as const,
      labelGu: "સ્માર્ટ પાત્રતા નિર્ધારક",
      labelEn: "Smart Eligibility",
      labelHi: "स्मार्ट पात्रता",
      shortGu: "વિઝાર્ડ",
      shortEn: "Wizard",
      shortHi: "विज़ार्ड",
      icon: Sparkles,
    },
    {
      key: "saved" as const,
      labelGu: "માહિતી વિશ્લેષણ",
      labelEn: "Dataset Analytics",
      labelHi: "डेटासेट विश्लेषण",
      shortGu: "વિશ્લેષણ",
      shortEn: "Analytics",
      shortHi: "विश्लेषण",
      icon: BarChart3,
    },
    {
      key: "settings" as const,
      labelGu: "માહિતી શાસન અને વહીવટ",
      labelEn: "Data Governance",
      labelHi: "डेटा गवर्नेंस",
      shortGu: "શાસન",
      shortEn: "Governance",
      shortHi: "शासन",
      icon: Settings,
    },
  ];

  return (
    <aside className="spatial-dock-anchor">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (min-width: 641px) and (max-width: 860px) {
              .spatial-dock-capsule {
                gap: 2px !important;
                padding: 4px !important;
                max-width: calc(100vw - 20px) !important;
              }
              .spatial-dock-item {
                min-width: 0 !important;
                flex: 1 1 0% !important;
                padding: 0 5px !important;
                gap: 4px !important;
              }
              .spatial-dock-label {
                font-size: 0.70rem !important;
                white-space: nowrap !important;
              }
              .spatial-dock-icon-wrap {
                margin-right: 2px !important;
              }
            }
            @media (max-width: 640px) {
              .spatial-dock-item.active {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                min-width: 54px !important;
                padding: 2px 2px !important;
              }
              .spatial-dock-item.active .spatial-dock-label {
                position: static !important;
                width: auto !important;
                height: auto !important;
                overflow: visible !important;
                clip: auto !important;
                clip-path: none !important;
                font-size: 0.625rem !important;
                font-weight: 700 !important;
                line-height: 1.1 !important;
                color: #011f65 !important;
                text-align: center !important;
                margin-top: 1px !important;
                white-space: nowrap !important;
                display: block !important;
              }
              .spatial-dock-item.active .spatial-dock-icon-wrap {
                width: 20px !important;
                height: 20px !important;
                margin: 0 !important;
              }
              .spatial-dock-item.active .spatial-dock-icon-wrap svg {
                width: 16px !important;
                height: 16px !important;
              }
            }
          `,
        }}
      />
      <nav className="spatial-dock-capsule" aria-label={language === "gu" ? "મુખ્ય નેવિગેશન" : language === "hi" ? "मुख्य नेविगेशन" : "Main navigation"}>
        <span className="spatial-dock-heading" aria-hidden="true">
          {language === "gu" ? "વિભાગો" : language === "hi" ? "सेक्शन" : "SECTIONS"}
        </span>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeKey === item.key;
          const fullTitle = language === "gu" ? item.labelGu : language === "hi" ? item.labelHi : item.labelEn;
          const shortTitle = language === "gu" ? item.shortGu : language === "hi" ? item.shortHi : item.shortEn;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setPulse((current) => current + 1);
                onSelect(item.key);
              }}
              title={fullTitle}
              data-tooltip={fullTitle}
              aria-label={fullTitle}
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
              <span className="spatial-dock-label">{shortTitle}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
