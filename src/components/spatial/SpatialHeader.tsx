"use client";

import React from "react";
import { Search } from "lucide-react";
import { GUJARAT_DISTRICT_POLYGONS } from "@/lib/gujarat-svg-paths";
import type { AppLanguage } from "@/lib/i18n";
import { localizeText } from "@/lib/i18n";

interface SpatialHeaderProps {
  gu: boolean;
  lang: AppLanguage;
  onSelectLanguage: (language: AppLanguage) => void;
  onOpenSearch?: () => void;
}

export function SpatialHeader({
  gu,
  lang,
  onSelectLanguage,
  onOpenSearch,
}: SpatialHeaderProps) {
  return (
    <header className="spatial-header-bar">
      {/* Left Title and Subtitle Badge */}
      <div className="spatial-brand-group">
        <span className="spatial-gujarat-mark" aria-hidden="true">
          <svg viewBox="20 20 910 680" role="presentation">
            {GUJARAT_DISTRICT_POLYGONS.map((district) => (
              <path key={district.name} d={district.path} />
            ))}
          </svg>
        </span>
        <div className="spatial-brand-titles">
          <h1 className="spatial-brand-heading">
            {localizeText(lang, gu ? "યોજના દૃષ્ટિ" : lang === "hi" ? "योजना दृष्टि" : "Yojana Drishti")}
          </h1>
          <span className="spatial-brand-badge">
            <span className="spatial-brand-status-dot" />
            {gu ? "ગુજરાત રાજ્ય · જાહેર માહિતી" : lang === "hi" ? "गुजरात राज्य · सार्वजनिक जानकारी" : "Gujarat · Public information"}
          </span>
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="spatial-header-actions">
        {/* Search is available from the keyboard shortcut and this button. */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="spatial-search-trigger"
          aria-label={localizeText(lang, gu ? "શોધખોળ" : "Search")}
        >
          <Search size={16} strokeWidth={1.8} className="text-white/70" />
          <span className="spatial-search-placeholder">
            {gu ? "યોજના, ગામ અથવા શહેર શોધો" : lang === "hi" ? "योजना, गाँव या शहर खोजें" : "Search schemes, villages, or cities"}
          </span>
        </button>

        {/* Language switcher uses each language's native name. */}
        <div className="spatial-lang-pill" role="group" aria-label={gu ? "ભાષા પસંદ કરો" : lang === "hi" ? "भाषा चुनें" : "Choose language"}>
          {(["gu", "en", "hi"] as const).map((language) => (
            <button
              key={language}
              type="button"
              className={lang === language ? "active-lang" : "muted-lang"}
              aria-pressed={lang === language}
              aria-label={language === "gu" ? "ગુજરાતી" : language === "en" ? "English" : "हिन्दी"}
              onClick={() => onSelectLanguage(language)}
            >
              {language === "gu" ? "ગુજરાતી" : language === "en" ? "English" : "हिन्दी"}
            </button>
          ))}
        </div>

        <span className="spatial-region-chip" aria-label={localizeText(lang, gu ? "ગુજરાત" : "Gujarat")}>
          {gu ? "ગુજરાત" : lang === "hi" ? "गुजरात" : "Gujarat"}
        </span>
      </div>
    </header>
  );
}
