"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ClipboardList,
  Search,
  Filter,
  CheckCircle2,
  Users,
  Wallet,
  Building2,
  FileText,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { demoSchemes, type Scheme } from "@/lib/demo-data";
import { scaleDemoValue } from "@/lib/metrics.mjs";
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

  useEffect(() => {
    if (initialSearchTerm) {
      setSearch(initialSearchTerm);
    }
  }, [initialSearchTerm]);

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
            {gu ? "સત્તાવાર યોજના નિર્દેશિકા" : "SCHEMES CATALOGUE"}
          </span>
          <h1>{gu ? "મહિલા અને બાળ કલ્યાણ સરકારી યોજનાઓ" : "Government Schemes for Women & Children"}</h1>
          <p>
            {gu
              ? "તમારા નોંધપોથીમાં નોંધાયેલી તમામ યોજનાઓ: દીકરી કલ્યાણ, વિધવા સહાય, મહિલા ઉદ્યોગસાહસિકતા અને પોષણ યોજનાઓની સંપૂર્ણ માહિતી."
              : "Comprehensive inventory covering 10 major state & central welfare schemes for women, children, housewives, and entrepreneurs."}
          </p>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="table-filter-strip">
        <label className="search-box-gov">
          <Search size={15} />
          <input
            type="search"
            placeholder={gu ? "યોજનાનું નામ અથવા કીવર્ડ શોધો..." : "Search scheme by name or benefit..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <div className="filter-pills-row">
          {[
            { key: "all", en: "All Schemes (10)", gu: "બધી યોજનાઓ (૧૦)" },
            { key: "Girl Child", en: "Girl Child", gu: "દીકરી કલ્યાણ" },
            { key: "Widow Welfare", en: "Widow Support", gu: "ગંગા સ્વરૂપા" },
            { key: "Entrepreneurship", en: "Women Entrepreneurs", gu: "મહિલા સાહસિક" },
            { key: "Maternal & Child Health", en: "Mother & Child", gu: "માતૃ-બાળ સ્વાસ્થ્ય" },
          ].map((cat) => (
            <button
              key={cat.key}
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
        {filteredSchemes.map((s, index) => {
          const isExpanded = expandedSchemeId === s.id || (!expandedSchemeIsVisible && s.id === filteredSchemes[0]?.id);
          const beneficiaries = scaleDemoValue(s.beneficiariesStatewide, fy);
          const allocated = scaleDemoValue(s.budgetAllocatedCr, fy);
          const disbursed = scaleDemoValue(s.budgetDisbursedCr, fy);
          const utilization = allocated > 0 ? Math.round((disbursed / allocated) * 100) : 0;

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
                  <div className="stat-pill-sm">
                    <Users size={14} />
                    <span><b>{fmt(beneficiaries)}</b> {gu ? "લાભાર્થી" : "Beneficiaries"}</span>
                  </div>
                  <div className="stat-pill-sm teal">
                    <Wallet size={14} />
                    <span><b>₹ {fmt(disbursed)} Cr</b> {gu ? "ચૂકવણી" : "Disbursed"}</span>
                  </div>
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

                    <div className="budget-progress-box">
                      <span>{gu ? "બજેટ ઉપયોગ:" : "Budget Utilization:"}</span>
                      <div className="bar-track">
                        <span
                          style={{
                            width: `${utilization}%`,
                          }}
                        />
                      </div>
                      <small>
                        ₹{fmt(disbursed)} Cr / ₹{fmt(allocated)} Cr ({utilization}%)
                      </small>
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
        scheme={selectedModalScheme}
        onClose={() => setSelectedModalScheme(null)}
        gu={gu}
      />
    </div>
  );
}
