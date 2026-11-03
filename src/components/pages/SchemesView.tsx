"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  Building2,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { demoSchemes, type Scheme } from "@/lib/demo-data";
import { SchemeDetailModal } from "../shared/SchemeDetailModal";

interface SchemesViewProps {
  gu: boolean;
  fy: string;
  initialSearchTerm?: string;
}

export function SchemesView({ gu, fy, initialSearchTerm = "" }: SchemesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState(initialSearchTerm);
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>("YD-CAND-01");
  const [selectedModalScheme, setSelectedModalScheme] = useState<Scheme | null>(null);

  const fmt = (num: number) => new Intl.NumberFormat(gu ? "gu-IN" : "en-IN").format(num);

  const filteredSchemes = useMemo(() => {
    return demoSchemes.filter((s) => {
      const matchCat = selectedCategory === "all" || s.category === selectedCategory;
      const matchSearch = [
        s.name, s.gu, s.shortName, s.shortNameGu, s.department, s.departmentGu,
        s.id, s.category, s.categoryGu, s.benefitAmount, s.benefitAmountGu,
        s.targetGroup, s.targetGroupGu, ...s.eligibility, ...s.eligibilityGu,
        ...s.documents, ...s.documentsGu,
      ].join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, search]);

  const categories = useMemo(
    () => Array.from(new Set(demoSchemes.map((scheme) => scheme.category))),
    [],
  );

  const categoryLabels = useMemo(() => {
    const labels = new Map<string, string>();
    demoSchemes.forEach((scheme) => labels.set(scheme.category, scheme.categoryGu));
    return labels;
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedSchemeId(expandedSchemeId === id ? null : id);
  };
  const expandedSchemeIsVisible = filteredSchemes.some((scheme) => scheme.id === expandedSchemeId);

  return (
    <div className="schemes-page-container">
      {/* Hero */}
      <div className="page-hero-gov">
        <div>
          <span className="hero-kicker-tag">
            {gu ? "યોજના નિર્દેશિકા · પૂર્વદર્શન" : "SCHEME DIRECTORY · PREVIEW"}
          </span>
          <h1>{gu ? "સરકારી યોજનાઓ શોધો" : "Find government schemes"}</h1>
          <p>
            {gu
              ? `હાલની નમૂના નિર્દેશિકામાં ${fmt(demoSchemes.length)} યોજનાઓ છે. નામ, લાભ અથવા પાત્રતા પ્રમાણે શોધો; આ સૂચિ સંપૂર્ણ સરકારી નોંધણી નથી.`
              : `${fmt(demoSchemes.length)} entries are in the current preview catalogue. Search by name, benefit, or eligibility; this is not a complete government register.`}
          </p>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="table-filter-strip">
        <label className="search-box-gov">
          <Search size={15} />
          <input
            type="search"
            aria-label={gu ? "યોજનાઓ શોધો" : "Search schemes"}
            placeholder={gu ? "યોજનાનું નામ અથવા કીવર્ડ શોધો..." : "Search scheme by name or benefit..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <div className="filter-pills-row">
          {[
            { key: "all", en: `All schemes (${demoSchemes.length})`, gu: `બધી યોજનાઓ (${fmt(demoSchemes.length)})` },
            ...categories.map((key) => ({ key, en: key, gu: categoryLabels.get(key) || key })),
          ].map((cat) => (
            <button
              key={cat.key}
              type="button"
              aria-pressed={selectedCategory === cat.key}
              className={`cat-pill-btn ${selectedCategory === cat.key ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.key)}
            >
              {gu ? cat.gu : cat.en}
            </button>
          ))}
        </div>
      </div>

      {/* Scheme Cards Grid */}
      <div className="schemes-list-column">
        {filteredSchemes.length === 0 && (
          <div className="scheme-empty-state" role="status">
            <Search size={22} aria-hidden="true" />
            <h2>{gu ? "કોઈ યોજના મળી નથી" : "No schemes found"}</h2>
            <p>{gu ? "શોધ શબ્દ અથવા શ્રેણી બદલીને ફરી પ્રયાસ કરો." : "Try another search term or category."}</p>
            <button
              type="button"
              className="spatial-link-btn"
              onClick={() => { setSearch(""); setSelectedCategory("all"); }}
            >
              {gu ? "બધી યોજનાઓ બતાવો" : "Show all schemes"}
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
                    <span className="smc-year-tag">{gu ? `શરૂઆત: ${s.launchYear}` : `Since ${s.launchYear}`}</span>
                  </div>
                  <h3>{gu ? s.gu : s.name}</h3>
                  <small className="smc-dept">{gu ? s.departmentGu : s.department}</small>
                </div>

                <div className="smc-header-stats">
                  <span className="scheme-preview-label">{gu ? "નમૂનાની વિગતો" : "Sample details"}</span>
                  <span className="expand-chevron-btn" aria-hidden="true">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </div>
              </div>

              {/* Collapsible In-Depth Drawer */}
              {isExpanded && (
                <div className="smc-expanded-body">
                  <div className="smc-benefit-highlight">
                    <span className="benefit-label">{gu ? "સહાય ધોરણ (લાભ):" : "Financial Benefit / Norm:"}</span>
                    <strong className="benefit-val">{gu ? s.benefitAmountGu : s.benefitAmount}</strong>
                  </div>

                  <div className="smc-two-columns">
                    {/* Eligibility List */}
                    <div className="smc-col">
                      <h4>
                        <CheckCircle2 size={16} className="text-teal" />
                        <span>{gu ? "પાત્રતાના માપદંડ (Eligibility):" : "Eligibility Criteria:"}</span>
                      </h4>
                      <ul className="gov-bullet-list">
                        {(gu ? s.eligibilityGu : s.eligibility).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Required Documents */}
                    <div className="smc-col">
                      <h4>
                        <FileText size={16} className="text-amber" />
                        <span>{gu ? "જરૂરી આધાર-પુરાવા (Documents):" : "Required Documents:"}</span>
                      </h4>
                      <ul className="gov-bullet-list">
                        {(gu ? s.documentsGu : s.documents).map((doc, i) => (
                          <li key={i}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="smc-footer-bar">
                    <div className="target-summary">
                      <span className="ts-label">{gu ? "લક્ષિત જૂથ:" : "Target Beneficiary Group:"}</span>
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
                      <span>{gu ? "દસ્તાવેજ ચેકલિસ્ટ & વિગત" : "Document Checklist"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Document Checklist Modal */}
      <SchemeDetailModal
        key={selectedModalScheme?.id ?? "closed"}
        scheme={selectedModalScheme}
        onClose={() => setSelectedModalScheme(null)}
        gu={gu}
      />
    </div>
  );
}
