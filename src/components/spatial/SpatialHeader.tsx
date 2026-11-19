"use client";

import React from "react";
import { MapPinned, Search } from "lucide-react";
import type { AppLanguage } from "@/lib/i18n";

interface SpatialHeaderProps {
  lang: AppLanguage;
  onSelectLanguage: (language: AppLanguage) => void;
  onOpenSearch?: () => void;
}

const copy = {
  gu: {
    subtitle: "ગુજરાતની યોજનાઓ અને વહીવટી નકશો",
    search: "યોજના, જિલ્લો અથવા ગામ શોધો",
    searchLabel: "યોજના, જિલ્લો, તાલુકો, ગામ અથવા શહેર શોધો",
    languages: { gu: "ગુજરાતી", en: "English", hi: "हिन्दी" },
    languageShort: { gu: "ગુ", en: "EN", hi: "हि" },
  },
  hi: {
    subtitle: "गुजरात की योजनाएँ और प्रशासनिक नक्शा",
    search: "योजना, जिला या गाँव खोजें",
    searchLabel: "योजना, जिला, तालुका, गाँव या शहर खोजें",
    languages: { gu: "ગુજરાતી", en: "English", hi: "हिन्दी" },
    languageShort: { gu: "ગુ", en: "EN", hi: "हि" },
  },
  en: {
    subtitle: "Gujarat schemes and administrative map",
    search: "Search schemes, districts, or villages",
    searchLabel: "Search schemes, districts, talukas, villages, or cities",
    languages: { gu: "ગુજરાતી", en: "English", hi: "हिन्दी" },
    languageShort: { gu: "ગુ", en: "EN", hi: "हि" },
  },
} as const;

const languageNames: Record<AppLanguage, string> = {
  gu: "Gujarati",
  en: "English",
  hi: "Hindi",
};

export function SpatialHeader({ lang, onSelectLanguage, onOpenSearch }: SpatialHeaderProps) {
  const text = copy[lang];
  const title = lang === "gu" ? "યોજના દૃષ્ટિ" : lang === "hi" ? "योजना दृष्टि" : "Yojana Drishti";

  return (
    <header className="spatial-top-vision-bar spatial-header-bar" aria-label={title}>
      <div className="spatial-brand-group">
        <span className="spatial-brand-mark" aria-hidden="true"><MapPinned size={20} strokeWidth={1.8} /></span>
        <span className="spatial-brand-copy">
          <strong className="spatial-brand-heading">{title}</strong>
          <span className="spatial-header-subtitle">{text.subtitle}</span>
        </span>
      </div>

      <div className="spatial-header-actions">
        <button
          type="button"
          className="spatial-search-trigger spatial-header-search"
          disabled={!onOpenSearch}
          onClick={onOpenSearch}
          aria-label={text.searchLabel}
        >
          <Search size={17} aria-hidden="true" />
          <span className="spatial-search-placeholder">{text.search}</span>
          <kbd aria-hidden="true">Ctrl / ⌘ K</kbd>
        </button>

        <div className="spatial-lang-pill spatial-header-languages" role="group" aria-label={lang === "gu" ? "ભાષા પસંદ કરો" : lang === "hi" ? "भाषा चुनें" : "Choose language"}>
          {(["gu", "en", "hi"] as const).map((language) => (
            <button
              key={language}
              type="button"
              className={lang === language ? "active-lang" : "muted-lang"}
              onClick={() => onSelectLanguage(language)}
              aria-label={text.languages[language]}
              aria-pressed={lang === language}
              title={text.languages[language]}
            >
              <span className="spatial-lang-short" aria-hidden="true">{text.languageShort[language]}</span>
              <span className="spatial-lang-full">{languageNames[language]}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
