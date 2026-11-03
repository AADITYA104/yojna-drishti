"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  FileText,
  Building2,
  MapPin,
  ExternalLink,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Baby,
  Users,
  Briefcase,
  Wallet,
  Landmark,
  Layers,
  RotateCcw,
  Check,
  ChevronRight,
} from "lucide-react";
import { demoSchemes, demoDistricts, type Scheme } from "@/lib/demo-data";
import { SchemeDetailModal } from "../shared/SchemeDetailModal";

interface PublicPortalViewProps {
  gu: boolean;
}

export function PublicPortalView({ gu }: PublicPortalViewProps) {
  const [step, setStep] = useState<number>(1);
  const [lifeStage, setLifeStage] = useState<string>("all");
  const [incomeGroup, setIncomeGroup] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("bhavnagar");
  const [selectedModalScheme, setSelectedModalScheme] = useState<Scheme | null>(null);

  const matchedSchemes = useMemo(() => {
    return demoSchemes.filter((s) => {
      if (lifeStage === "girl" && s.category !== "Girl Child") return false;
      if (lifeStage === "widow" && s.category !== "Widow Welfare") return false;
      if (lifeStage === "maternal" && s.category !== "Maternal & Child Health") return false;
      if (lifeStage === "entrepreneur" && s.category !== "Entrepreneurship") return false;
      if (incomeGroup !== "all") {
        const criteria = s.eligibility.join(" ").toLocaleLowerCase();
        const thresholds = Array.from(criteria.matchAll(/₹\s*([\d,]+)/g), (match) =>
          Number(match[1].replaceAll(",", "")),
        );
        const hasBplCriteria = /\b(bpl|ews)\b/.test(criteria);
        const hasNoIncomeLimit = /no income limit|no income criteria/.test(criteria);
        if (incomeGroup === "below_2l" && !hasBplCriteria && !thresholds.some((amount) => amount <= 200_000)) {
          return false;
        }
        if (incomeGroup === "above_2l" && !hasNoIncomeLimit && !thresholds.some((amount) => amount > 200_000)) {
          return false;
        }
      }
      return true;
    });
  }, [lifeStage, incomeGroup]);

  return (
    <div className="public-portal-page">
      {/* Page Hero */}
      <div className="page-hero-gov citizen-hero">
        <div>
          <span className="hero-kicker-tag citizen-tag">
            <Search size={14} className="inline mr-1" />
            {gu ? "યોજના શોધ · નમૂનાનું પૂર્વદર્શન" : "SCHEME FINDER · PREVIEW"}
          </span>
          <h1>
            {gu ? "યોજનાઓ શોધો · પાત્રતાની પુષ્ટિ સત્તાવાર સ્ત્રોતે કરો" : "Explore schemes · confirm eligibility with official sources"}
          </h1>
          <p>
            {gu
              ? "આ નમૂનાની સૂચિમાં શ્રેણી અને આવક પ્રમાણે શોધો. તે પાત્રતા નક્કી કરતી નથી; લાભ, નિયમો અને દસ્તાવેજો સંબંધિત વિભાગ પાસે ચકાસો."
              : "Browse this sample catalogue by category and income. It does not determine eligibility; confirm benefits, rules, and documents with the responsible department."}
          </p>
        </div>
      </div>

      {/* Progressive Step Indicator */}
      <div className="wizard-step-progress-bar">
        {[
          { num: 1, titleGu: "લાભાર્થી શ્રેણી", titleEn: "Category" },
          { num: 2, titleGu: "આવક મર્યાદા", titleEn: "Income" },
          { num: 3, titleGu: "જિલ્લો પસંદગી", titleEn: "District" },
          { num: 4, titleGu: "સંભવિત મેળ · નમૂનો", titleEn: "Possible matches · sample" },
        ].map((s) => (
          <button
            key={s.num}
            type="button"
            className={`wizard-step-pill ${step === s.num ? "is-current" : step > s.num ? "is-completed" : ""}`}
            aria-current={step === s.num ? "step" : undefined}
            onClick={() => setStep(s.num)}
          >
            <span className="wsp-num">
              {step > s.num ? <Check size={14} /> : s.num}
            </span>
            <span className="wsp-title">{gu ? s.titleGu : s.titleEn}</span>
          </button>
        ))}
      </div>

      {/* STEP 1: LIFE STAGE / CATEGORY */}
      {step === 1 && (
        <div className="finder-wizard-box">
          <div className="wizard-question-group">
            <label className="wizard-label">
              {gu ? "૧. લાભાર્થીનો પ્રકાર અથવા જીવન તબક્કો પસંદ કરો:" : "1. Select Beneficiary Category / Life Stage:"}
            </label>
            <div className="wizard-options-grid">
              {[
                { id: "all", labelGu: "તમામ યોજનાઓ", labelEn: "All Beneficiaries", IconComponent: Layers },
                { id: "girl", labelGu: "દીકરી / કન્યા (શાળા-શિક્ષણ)", labelEn: "Girl Child / Student", IconComponent: GraduationCap },
                { id: "maternal", labelGu: "સગર્ભા / ધાત્રી માતા (૧૦૦૦ દિવસ)", labelEn: "Pregnant / Mother", IconComponent: Baby },
                { id: "widow", labelGu: "ગંગા સ્વરૂપા બહેન (વિધવા સહાય)", labelEn: "Widowed Sister", IconComponent: Users },
                { id: "entrepreneur", labelGu: "મહિલા સાહસિક / ગૃહિણી (સ્વરોજગાર)", labelEn: "Woman Entrepreneur", IconComponent: Briefcase },
              ].map((opt) => {
                const Icon = opt.IconComponent;
                const isSelected = lifeStage === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`wizard-opt-btn ${isSelected ? "active" : ""}`}
                    aria-pressed={isSelected}
                    onClick={() => setLifeStage(opt.id)}
                  >
                    <span className="w-icon">
                      <Icon size={18} />
                    </span>
                    <span className="w-text">{gu ? opt.labelGu : opt.labelEn}</span>
                    <span className="w-check">
                      {isSelected ? <Check size={15} /> : <span className="w-dot-empty" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="wizard-nav-actions">
            <div />
            <button className="btn-wizard-next" onClick={() => setStep(2)}>
              <span>{gu ? "આગળનું પગલું (આવક મર્યાદા)" : "Next: Income Group"}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: INCOME BRACKET */}
      {step === 2 && (
        <div className="finder-wizard-box">
          <div className="wizard-question-group">
            <label className="wizard-label">
              {gu ? "૨. તમારા કુટુંબની અંદાજિત વાર્ષિક આવક કેટલી છે?" : "2. Select Family Annual Income Bracket:"}
            </label>
            <div className="wizard-options-grid">
              {[
                { id: "all", labelGu: "કોઈપણ આવક જૂથ (બધી યોજનાઓ)", labelEn: "Any Income Bracket", IconComponent: Layers },
                { id: "below_2l", labelGu: "₹૨ લાખથી ઓછી (BPL / EWS)", labelEn: "Under ₹2 Lakhs / BPL", IconComponent: Wallet },
                { id: "above_2l", labelGu: "₹૨ લાખથી વધુ (પોષણ/બચત યોજનાઓ)", labelEn: "Above ₹2 Lakhs (Nutrition/Savings)", IconComponent: Landmark },
              ].map((opt) => {
                const Icon = opt.IconComponent;
                const isSelected = incomeGroup === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`wizard-opt-btn ${isSelected ? "active" : ""}`}
                    aria-pressed={isSelected}
                    onClick={() => setIncomeGroup(opt.id)}
                  >
                    <span className="w-icon">
                      <Icon size={18} />
                    </span>
                    <span className="w-text">{gu ? opt.labelGu : opt.labelEn}</span>
                    <span className="w-check">
                      {isSelected ? <Check size={15} /> : <span className="w-dot-empty" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="wizard-nav-actions">
            <button className="btn-wizard-prev" onClick={() => setStep(1)}>
              <ArrowLeft size={16} />
              <span>{gu ? "પાછા જાઓ" : "Back"}</span>
            </button>
            <button className="btn-wizard-next" onClick={() => setStep(3)}>
              <span>{gu ? "આગળનું પગલું (જિલ્લો)" : "Next: District"}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DISTRICT SELECTION */}
      {step === 3 && (
        <div className="finder-wizard-box">
          <div className="wizard-question-group">
            <label className="wizard-label">
              {gu ? "૩. તમે ગુજરાતના કયા જિલ્લામાં રહો છો?" : "3. Select Your Gujarat District:"}
            </label>
            <small className="wizard-preview-note">
              {gu
                ? "જિલ્લાની પસંદગી અહીં પરિણામ પરિચય માટે છે; જિલ્લા પ્રમાણેના પાત્રતા નિયમો જોડાયેલા નથી."
                : "District selection is shown for context; district-specific eligibility rules are not connected."}
            </small>
            <div className="wizard-district-select-grid">
              {demoDistricts.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={`wizard-dist-pill ${selectedDistrict === d.id ? "active" : ""}`}
                  aria-pressed={selectedDistrict === d.id}
                  onClick={() => setSelectedDistrict(d.id)}
                >
                  <b>[{d.officialNo}]</b>
                  <span>{gu ? d.gu : d.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="wizard-nav-actions">
            <button className="btn-wizard-prev" onClick={() => setStep(2)}>
              <ArrowLeft size={16} />
              <span>{gu ? "પાછા જાઓ" : "Back"}</span>
            </button>
            <button className="btn-wizard-next btn-wizard-view-results" onClick={() => setStep(4)}>
              <Search size={16} />
              <span>{gu ? `યોજનાઓ જુઓ (${matchedSchemes.length} મળેલ)` : `View Results (${matchedSchemes.length})`}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: MATCHED RESULTS LIST */}
      {step === 4 && (
        <div className="wizard-results-view">
          <div className="matched-results-header">
            <div>
              <h2>
                {gu
                  ? `સંભવિત નમૂના મેળ (${matchedSchemes.length})`
                  : `Possible sample matches (${matchedSchemes.length})`}
              </h2>
              <small>
                {gu
                  ? `આ પાત્રતાની પુષ્ટિ નથી · જિલ્લાવાર નિયમો જોડાયેલા નથી · ${demoDistricts.find((d) => d.id === selectedDistrict)?.gu || selectedDistrict}`
                  : `Not an eligibility decision · district rules are not connected · ${demoDistricts.find((d) => d.id === selectedDistrict)?.name || selectedDistrict}`}
              </small>
            </div>

            <button className="btn-wizard-restart" onClick={() => setStep(1)}>
              <RotateCcw size={14} className="inline mr-1" />
              <span>{gu ? "નવી શોધ શરૂ કરો" : "Reset Selection"}</span>
            </button>
          </div>

          <div className="public-schemes-cards-list">
            {matchedSchemes.map((s) => (
              <article
                key={s.id}
                className="public-scheme-card"
              >
                <div className="psc-top">
                  <span className="psc-badge">{gu ? s.categoryGu : s.category}</span>
                  <span className="psc-code">{s.id}</span>
                </div>

                <h3>{gu ? s.gu : s.name}</h3>

                <div className="psc-benefit-highlight">
                  <span className="psc-ben-lbl">{gu ? "લાભ · નમૂનાની માહિતી:" : "Benefit · sample details:"}</span>
                  <strong className="psc-ben-val">{gu ? s.benefitAmountGu : s.benefitAmount}</strong>
                </div>

                <div className="psc-docs-box">
                  <strong>
                    <FileText size={15} />
                    <span>{gu ? "દસ્તાવેજો · નમૂનાની યાદી:" : "Documents · sample list:"}</span>
                  </strong>
                  <div className="psc-docs-pills">
                    {(gu ? s.documentsGu : s.documents).map((doc, i) => (
                      <span key={i} className="doc-pill">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="psc-action-row">
                  <button
                    type="button"
                    className="btn-card-checklist"
                    onClick={() => setSelectedModalScheme(s)}
                  >
                    <FileText size={14} />
                    <span>{gu ? "નમૂનાની વિગત જુઓ" : "View sample details"}</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Scheme Detail Modal */}
      <SchemeDetailModal
        key={selectedModalScheme?.id ?? "closed"}
        scheme={selectedModalScheme}
        onClose={() => setSelectedModalScheme(null)}
        gu={gu}
      />
    </div>
  );
}
