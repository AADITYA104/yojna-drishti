"use client";

import React from "react";
import { Search } from "lucide-react";
import { GUJARAT_DISTRICT_POLYGONS } from "@/lib/gujarat-svg-paths";

interface SpatialHeaderProps {
  gu: boolean;
  onToggleLanguage: () => void;
  onOpenSearch?: () => void;
}

export function SpatialHeader({
  gu,
  onToggleLanguage,
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
            {gu ? "યોજના દૃષ્ટિ" : "Yojna Drishti"}
          </h1>
          <span className="spatial-brand-badge">
            <span className="spatial-tricolor-pip" />
            {gu ? "ગુજરાત રાજ્ય · યોજના પૂર્વદર્શન" : "GUJARAT STATE · SCHEME PREVIEW"}
          </span>
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="spatial-header-actions">
        {/* Minimalist Glass Search Trigger (Cmd + K) */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="spatial-search-trigger"
          aria-label={gu ? "શોધખોળ (Cmd + K)" : "Quick Search (Cmd + K)"}
        >
          <Search size={16} strokeWidth={1.8} className="text-white/70" />
          <span className="spatial-search-placeholder">
            {gu ? "યોજના અથવા જિલ્લો શોધો..." : "Search yojna or district..."}
          </span>
          <kbd className="spatial-kbd-chip">Ctrl K</kbd>
        </button>

        {/* Language Switcher Pill (ગુજરાતી | EN) */}
        <button
          type="button"
          onClick={onToggleLanguage}
          className="spatial-lang-pill"
          aria-label={gu ? "Switch to English" : "ગુજરાતીમાં બદલો"}
        >
          <span className={gu ? "active-lang" : "muted-lang"}>ગુજરાતી</span>
          <span className="spatial-lang-divider">|</span>
          <span className={!gu ? "active-lang" : "muted-lang"}>EN</span>
        </button>

        <span className="spatial-avatar-circle" aria-label={gu ? "ગુજરાત" : "Gujarat"}>
          <span className="spatial-avatar-text">GJ</span>
        </span>
      </div>
    </header>
  );
}
