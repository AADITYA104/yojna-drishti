"use client";

import React, { useState, useMemo, useRef } from "react";
import Image from "next/image";
import { getLocale, localizeText } from "@/lib/i18n";
import {
  Search,
  CheckCircle2,
  Building2,
  FileText,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Map as MapIcon,
  ShieldCheck,
  Award,
} from "lucide-react";
import { demoSchemes, type Scheme } from "@/lib/demo-data";
import { SchemeDetailModal } from "../shared/SchemeDetailModal";
import type { AppLanguage } from "@/lib/i18n";

interface SchemesViewProps {
  gu: boolean;
  lang: AppLanguage;
  fy: string;
  initialSearchTerm?: string;
  onOpenMap?: () => void;
}

export function SchemesView({ gu, lang, fy, initialSearchTerm = "", onOpenMap }: SchemesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState(initialSearchTerm);
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>("YD-CAND-01");
  const [selectedModalScheme, setSelectedModalScheme] = useState<Scheme | null>(null);
  const schemeSearchRef = useRef<HTMLInputElement>(null);

  const fmt = (num: number) => new Intl.NumberFormat(getLocale(lang)).format(num);
  const intro = {
    gu: {
      kicker: "ગુજરાત સત્તાવાર યોજના નિર્દેશિકા",
      title: "ગુજરાતની સરકારી યોજનાઓ, હવે એક જ સ્થળે.",
      description: "તમારી જરૂરિયાત, પાત્રતા અને જિલ્લાને અનુરૂપ તમામ કલ્યાણકારી યોજનાઓની અધિકૃત માહિતી મેળવો અને ઓનલાઇન અરજી કરો.",
      directory: "યોજનાઓ શોધો",
      map: "ગુજરાતનો નકશો જુઓ",
      imageAlt: "ખેતરમાં ટપક સિંચાઈની પદ્ધતિ સાથે ઊભેલા ખેડૂતનું દૃશ્ય",
      photoLabel: "ગુજરાતનાં પ્રમુખ સ્થળો",
      places: ["રાણીની વાવ · પાટણ", "સ્ટેચ્યુ ઑફ યુનિટી · નર્મદા", "કચ્છનું રણ", "સાબરમતી રિવરફ્રન્ટ · અમદાવાદ"],
    },
    en: {
      kicker: "Gujarat Official Scheme Directory",
      title: "Government schemes in Gujarat, all in one place.",
      description: "Find verified scheme information, eligibility rules, benefit amounts, and application pathways across Gujarat.",
      directory: "Explore schemes",
      map: "Explore Gujarat map",
      imageAlt: "A farmer walking through a field with drip irrigation lines",
      photoLabel: "Landmarks of Gujarat",
      places: ["Rani ki Vav · Patan", "Statue of Unity · Narmada", "The Rann of Kutch", "Sabarmati Riverfront · Ahmedabad"],
    },
    hi: {
      kicker: "गुजरात आधिकारिक योजना सूची",
      title: "गुजरात की सरकारी योजनाएँ, अब एक ही जगह।",
      description: "अपनी ज़रूरत, पात्रता और ज़िले के अनुसार सभी कल्याणकारी योजनाओं की प्रामाणिक जानकारी खोजें और आवेदन करें।",
      directory: "योजनाएँ खोजें",
      map: "गुजरात का नक्शा देखें",
      imageAlt: "ड्रिप सिंचाई वाले खेत में चलते किसान का दृश्य",
      photoLabel: "गुजरात के प्रमुख स्थान",
      places: ["रानी की वाव · पाटन", "स्टैच्यू ऑफ यूनिटी · नर्मदा", "कच्छ का रण", "साबरमती रिवरफ्रंट · अहमदाबाद"],
    },
  }[lang];

  const filteredSchemes = useMemo(() => {
    return demoSchemes.filter((s) => {
      const matchCat = selectedCategory === "all" || s.category === selectedCategory;
      const matchSearch = [
        s.name, s.gu, s.shortName, s.shortNameGu, s.id, s.category, s.categoryGu,
        localizeText("hi", s.name), localizeText("hi", s.category),
      ].join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, search]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    demoSchemes.forEach((s) => set.add(s.category));
    return Array.from(set);
  }, []);

  const categoryLabels = useMemo(() => {
    const map = new Map<string, string>();
    demoSchemes.forEach((s) => map.set(s.category, s.categoryGu));
    return map;
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedSchemeId((prev) => (prev === id ? null : id));
  };

  const focusSearch = () => {
    schemeSearchRef.current?.focus();
    schemeSearchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const expandedSchemeIsVisible = filteredSchemes.some((s) => s.id === expandedSchemeId);

  return (
    <div className="schemes-page w-full">
      {/* Visual Header with Real Gujarat Photography */}
      <section className="gujarat-glass-hero" aria-label={intro.title}>
        <div className="gujarat-glass-hero-copy">
          <span className="gujarat-hero-kicker">
            <Award size={14} className="inline mr-1" />
            {intro.kicker}
          </span>
          <h1>{intro.title}</h1>
          <p>{intro.description}</p>
          <div className="gujarat-hero-action-row">
            <button
              type="button"
              className="spatial-glowing-frosted-btn"
              onClick={focusSearch}
              aria-label={intro.directory}
            >
              <Search size={15} />
              <span>{intro.directory}</span>
            </button>
            {onOpenMap && (
              <button
                type="button"
                className="spatial-link-btn"
                onClick={onOpenMap}
                aria-label={intro.map}
              >
                <MapIcon size={15} />
                <span>{intro.map}</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

        <figure className="gujarat-glass-hero-frame">
          <Image
            src="/images/gujarat-farmer.webp"
            alt={intro.imageAlt}
            width={640}
            height={440}
            priority
            sizes="(max-width: 900px) 100vw, 420px"
          />
          <figcaption className="gujarat-hero-caption">
            <strong>{gu ? "કિસાન કલ્યાણ & કૃષિ વિકાસ" : lang === "hi" ? "किसान कल्याण एवं कृषि विकास" : "Farmer Welfare & Agriculture"}</strong>
            <span>{gu ? "ટપક સિંચાઈ અને મુખ્યમંત્રી કિસાન સહાય યોજના" : lang === "hi" ? "ड्रिप सिंचाई और मुख्यमंत्री किसान सहाय योजना" : "Micro-irrigation & Kisan Sahay"}</span>
          </figcaption>
        </figure>
      </section>

      {/* 4 Landmark Photo Strip */}
      <section className="gujarat-photo-strip" aria-label={intro.photoLabel}>
        <h2>{intro.photoLabel}</h2>
        <div className="gujarat-photo-strip-grid">
          {[
            { src: "/images/gujarat-stepwell.webp", alt: intro.places[0] },
            { src: "/images/gujarat-unity.webp", alt: intro.places[1] },
            { src: "/images/gujarat-rann.webp", alt: intro.places[2] },
            { src: "/images/gujarat-riverfront.webp", alt: intro.places[3] },
          ].map((place) => (
            <figure className="gujarat-photo-tile" key={place.src}>
              <Image src={place.src} alt={place.alt} width={420} height={156} sizes="(max-width: 640px) 50vw, 25vw" />
              <figcaption>{place.alt}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Filter Strip */}
      <div className="table-filter-strip">
        <label className="search-box-gov">
          <Search size={15} />
          <input
            ref={schemeSearchRef}
            type="search"
            aria-label={gu ? "યોજનાઓ શોધો" : lang === "hi" ? "योजनाएँ खोजें" : "Search schemes"}
            placeholder={gu ? "યોજનાનું નામ અથવા શ્રેણી શોધો..." : lang === "hi" ? "योजना का नाम या श्रेणी खोजें..." : "Search scheme name or category..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <div className="filter-pills-row">
          {[
            { key: "all", en: `All schemes (${demoSchemes.length})`, gu: `બધી યોજનાઓ (${fmt(demoSchemes.length)})`, hi: `सभी योजनाएँ (${fmt(demoSchemes.length)})` },
            ...categories.map((key) => ({ key, en: key, gu: categoryLabels.get(key) || key, hi: key })),
          ].map((cat) => (
            <button
              key={cat.key}
              type="button"
              aria-pressed={selectedCategory === cat.key}
              className={`cat-pill-btn ${selectedCategory === cat.key ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.key)}
            >
              {gu ? cat.gu : lang === "hi" ? cat.hi : cat.en}
            </button>
          ))}
        </div>
      </div>

      {/* Scheme Cards Grid */}
      <div className="schemes-list-column">
        {filteredSchemes.length === 0 && (
          <div className="scheme-empty-state" role="status">
            <Search size={22} aria-hidden="true" />
            <h2>{gu ? "કોઈ યોજના મળી નથી" : lang === "hi" ? "कोई योजना नहीं मिली" : "No schemes found"}</h2>
            <p>{gu ? "શોધ શબ્દ અથવા શ્રેણી બદલીને ફરી પ્રયાસ કરો." : lang === "hi" ? "खोज शब्द या श्रेणी बदलकर पुनः प्रयास करें।" : "Try another search term or category."}</p>
            <button
              type="button"
              className="spatial-link-btn"
              onClick={() => { setSearch(""); setSelectedCategory("all"); }}
            >
              {gu ? "બધી યોજનાઓ બતાવો" : lang === "hi" ? "सभी योजनाएँ दिखाएँ" : "Show all schemes"}
            </button>
          </div>
        )}
        {filteredSchemes.map((s, index) => {
          const isExpanded = expandedSchemeId === s.id || (!expandedSchemeIsVisible && s.id === filteredSchemes[0]?.id);
          return (
            <div key={s.id} className={`scheme-master-card ${isExpanded ? "expanded" : ""}`}>
              <div
                className="smc-header"
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                onClick={() => toggleExpand(s.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    toggleExpand(s.id);
                  }
                }}
              >
                <div className="smc-index-badge">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>

                <div className="smc-titles">
                  <div className="smc-top-meta">
                    <span className="smc-code">{s.id}</span>
                    <span className="smc-category-tag">{gu ? s.categoryGu : s.category}</span>
                    <span className="smc-year-tag">FY {fy} · {s.launchYear}</span>
                  </div>
                  <h3>{gu ? s.gu : s.name}</h3>
                  <small className="smc-dept">{gu ? s.departmentGu : s.department}</small>
                </div>

                <div className="smc-header-stats">
                  <span className="scheme-preview-label">{gu ? s.benefitAmountGu : s.benefitAmount}</span>
                  <span className="expand-chevron-btn" aria-hidden="true">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </div>
              </div>

              {/* Collapsible In-Depth Drawer */}
              {isExpanded && (
                <div className="smc-expanded-body">
                  <div className="smc-benefit-highlight">
                    <span className="benefit-label">
                      {gu ? "સહાય / લાભની રકમ:" : lang === "hi" ? "सहायता / लाभ राशि:" : "Benefit Amount:"}
                    </span>
                    <strong className="benefit-val">{gu ? s.benefitAmountGu : s.benefitAmount}</strong>
                  </div>

                  <div className="smc-two-columns">
                    {/* Eligibility List */}
                    <div className="smc-col">
                      <h4>
                        <CheckCircle2 size={16} className="text-teal" />
                        <span>{gu ? "પાત્રતાના માપદંડ (Eligibility Criteria):" : lang === "hi" ? "पात्रता मापदंड:" : "Eligibility Criteria:"}</span>
                      </h4>
                      <ul className="scheme-bullet-list">
                        {(gu ? s.eligibilityGu : s.eligibility).map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Required Documents */}
                    <div className="smc-col">
                      <h4>
                        <FileText size={16} className="text-amber" />
                        <span>{gu ? "જરૂરી આધાર-પુરાવા (Required Documents):" : lang === "hi" ? "आवश्यक दस्तावेज़:" : "Required Documents:"}</span>
                      </h4>
                      <ul className="scheme-bullet-list">
                        {(gu ? s.documentsGu : s.documents).map((doc, idx) => (
                          <li key={idx}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="smc-footer-bar">
                    <div className="target-summary">
                      <span className="ts-label">{gu ? "લક્ષિત જૂથ:" : lang === "hi" ? "लक्षित समूह:" : "Target Beneficiary Group:"}</span>
                      <span className="ts-val">{gu ? s.targetGroupGu : s.targetGroup}</span>
                    </div>

                    <button
                      type="button"
                      className="btn-open-checklist-modal"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedModalScheme(s);
                      }}
                    >
                      <FileText size={14} />
                      <span>{gu ? "વિગતવાર માહિતી & અરજી" : lang === "hi" ? "विस्तृत विवरण और आवेदन" : "View Details & Apply"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Scheme Detail Modal */}
      {selectedModalScheme && (
        <SchemeDetailModal
          scheme={selectedModalScheme}
          onClose={() => setSelectedModalScheme(null)}
          gu={gu}
          lang={lang}
        />
      )}
    </div>
  );
}
