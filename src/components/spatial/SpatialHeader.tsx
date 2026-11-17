"use client";

import React from "react";
import { Search } from "lucide-react";

export type SupportedLang = "gu" | "en" | "hi";

interface SpatialHeaderProps {
  gu: boolean;
  lang?: SupportedLang;
  onToggleLanguage?: () => void;
  onSelectLang?: (lang: SupportedLang) => void;
  onOpenSearch?: () => void;
}

export function SpatialHeader({
  gu,
  lang = gu ? "gu" : "en",
  onToggleLanguage,
  onSelectLang,
  onOpenSearch,
}: SpatialHeaderProps) {
  const currentLang: SupportedLang = lang || (gu ? "gu" : "en");

  const handleLangClick = (selected: SupportedLang) => {
    if (onSelectLang) {
      onSelectLang(selected);
    } else if (onToggleLanguage) {
      onToggleLanguage();
    }
  };

  return (
    <header className="spatial-header-bar">
      {/* Left Title and Subtitle Badge */}
      <div className="spatial-brand-group">
        <span className="spatial-gujarat-mark" aria-hidden="true">
          <svg viewBox="0 0 44 44" fill="none" role="presentation" aria-hidden="true">
            {/* Gujarat State Geographic Emblem */}
            <path
              d="M17 6C11 8 5 12 4 17C3 20 7 22 13 22C16 22 17 19 20 20C22 21 16 26 12 28C7 31 8 36 13 38C18 39 24 37 27 33C29 30 28 26 26 24C25 22 27 20 29 22C32 24 33 30 35 34C36 36 38 35 38 32C38 25 35 18 33 14C30 9 26 6 22 5C19 4 18 5 17 6Z"
              fill="#2078CF"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div className="spatial-brand-titles">
          <h1 className="spatial-brand-heading">
            {currentLang === "gu"
              ? "યોજના દૃષ્ટિ"
              : currentLang === "hi"
              ? "योजना दृष्टि"
              : "Yojana Drishti"}
          </h1>
          <span className="spatial-brand-badge">
            <span className="spatial-tricolor-pip" />
            {currentLang === "gu"
              ? "ગુજરાત રાજ્ય · યોજના પૂર્વદર્શન"
              : currentLang === "hi"
              ? "गुजरात राज्य · योजना पूर्वदर्शन"
              : "GUJARAT STATE · SCHEME PREVIEW"}
          </span>
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="spatial-header-actions">
        {/* Minimalist Search Trigger (Cmd + K) */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="spatial-search-trigger"
          aria-label={
            currentLang === "gu"
              ? "શોધખોળ (Ctrl + K)"
              : currentLang === "hi"
              ? "खोजें (Ctrl + K)"
              : "Quick Search (Ctrl + K)"
          }
        >
          <Search size={16} strokeWidth={1.8} />
          <span className="spatial-search-placeholder">
            {currentLang === "gu"
              ? "યોજના અથવા જિલ્લો શોધો..."
              : currentLang === "hi"
              ? "योजना या जिला खोजें..."
              : "Search scheme or district..."}
          </span>
          <kbd className="spatial-kbd-chip">Ctrl K</kbd>
        </button>

        {/* 3-Language Switcher Pill (ગુજરાતી | English | हिन्दी) */}
        <div
          className="spatial-lang-pill"
          role="group"
          aria-label="Language selector"
        >
          <button
            type="button"
            onClick={() => handleLangClick("gu")}
            className={`spatial-lang-btn ${currentLang === "gu" ? "active-lang" : "muted-lang"}`}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 6px",
              borderRadius: "4px",
              color: currentLang === "gu" ? "#FFFFFF" : "rgba(232, 238, 248, 0.6)",
              fontWeight: currentLang === "gu" ? 700 : 500,
            }}
          >
            ગુ
          </button>
          <span className="spatial-lang-divider">|</span>
          <button
            type="button"
            onClick={() => handleLangClick("en")}
            className={`spatial-lang-btn ${currentLang === "en" ? "active-lang" : "muted-lang"}`}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 6px",
              borderRadius: "4px",
              color: currentLang === "en" ? "#FFFFFF" : "rgba(232, 238, 248, 0.6)",
              fontWeight: currentLang === "en" ? 700 : 500,
            }}
          >
            EN
          </button>
          <span className="spatial-lang-divider">|</span>
          <button
            type="button"
            onClick={() => handleLangClick("hi")}
            className={`spatial-lang-btn ${currentLang === "hi" ? "active-lang" : "muted-lang"}`}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 6px",
              borderRadius: "4px",
              color: currentLang === "hi" ? "#FFFFFF" : "rgba(232, 238, 248, 0.6)",
              fontWeight: currentLang === "hi" ? 700 : 500,
            }}
          >
            हिं
          </button>
        </div>

        <span className="spatial-avatar-circle" aria-label="Gujarat Portal">
          <span className="spatial-avatar-text">GJ</span>
        </span>
      </div>
    </header>
  );
}
