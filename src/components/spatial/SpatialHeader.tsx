"use client";

import React from "react";
import { Search } from "lucide-react";

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
          <svg viewBox="0 0 44 44" fill="none" role="presentation" aria-hidden="true">
            {/* Optimized Gujarat State Geographic Emblem */}
            <path
              d="M17 6C11 8 5 12 4 17C3 20 7 22 13 22C16 22 17 19 20 20C22 21 16 26 12 28C7 31 8 36 13 38C18 39 24 37 27 33C29 30 28 26 26 24C25 22 27 20 29 22C32 24 33 30 35 34C36 36 38 35 38 32C38 25 35 18 33 14C30 9 26 6 22 5C19 4 18 5 17 6Z"
              fill="#e8c98e"
              stroke="#153d53"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
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
