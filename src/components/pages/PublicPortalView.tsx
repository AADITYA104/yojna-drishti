"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Search,
  CheckCircle2,
  FileText,
  Building2,
  MapPin,
  ExternalLink,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  School,
  Heart,
  ChevronRight,
  ShieldCheck,
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
            🌟 {gu ? "નાગરિક સહાય કેન્દ્ર · સ્માર્ટ પાત્રતા વિઝાર્ડ" : "CITIZEN SMART ELIGIBILITY WIZARD"}
          </span>
          <h1>{gu ? "તમારા માટે કઈ સરકારી યોજના યોગ્ય છે? તે શોધો" : "Find Eligible Government Schemes For You"}</h1>
          <p>
            {gu
              ? "ફક્ત ૩ સરળ પગલાંમાં તમારી શ્રેણી, આવક અને જિલ્લો પસંદ કરો અને જાણો કે તમને કઈ કઈ સરકારી સહાય મળશે તથા ફોર્મ ક્યાં જમા કરાવવું."
              : "Interactive step-by-step wizard matching citizens to Gujarat welfare schemes and direct application requirements."}
          </p>
        </div>
      </div>

      {/* Progressive Step Indicator */}
      <div className="wizard-step-progress-bar">
        {[
          { num: 1, titleGu: "લાભાર્થી શ્રેણી", titleEn: "Category" },
          { num: 2, titleGu: "આવક મર્યાદા", titleEn: "Income" },
          { num: 3, titleGu: "જિલ્લો પસંદગી", titleEn: "District" },
          { num: 4, titleGu: "મળવાપાત્ર યોજનાઓ", titleEn: "Results" },
        ].map((s) => (
          <button
            key={s.num}
            type="button"
            className={`wizard-step-pill ${step === s.num ? "is-current" : step > s.num ? "is-completed" : ""}`}
            onClick={() => setStep(s.num)}
          >
            <span className="wsp-num">{step > s.num ? "✓" : s.num}</span>
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
                { id: "all", labelGu: "તમામ યોજનાઓ", labelEn: "All Beneficiaries", icon: "🌐" },
                { id: "girl", labelGu: "દીકરી / કન્યા (શાળા-શિક્ષણ)", labelEn: "Girl Child / Student", icon: "👧" },
                { id: "maternal", labelGu: "સગર્ભા / ધાત્રી માતા (૧૦૦૦ દિવસ)", labelEn: "Pregnant / Mother", icon: "🤱" },
                { id: "widow", labelGu: "ગંગા સ્વરૂપા બહેન (વિધવા સહાય)", labelEn: "Widowed Sister", icon: "🙏" },
                { id: "entrepreneur", labelGu: "મહિલા સાહસિક / ગૃહિણી (સ્વરોજગાર)", labelEn: "Woman Entrepreneur", icon: "💼" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`wizard-opt-btn ${lifeStage === opt.id ? "active" : ""}`}
                  onClick={() => setLifeStage(opt.id)}
                >
                  <span className="w-icon">{opt.icon}</span>
                  <span className="w-text">{gu ? opt.labelGu : opt.labelEn}</span>
                  <span className="w-check">{lifeStage === opt.id ? "✓" : "○"}</span>
                </button>
              ))}
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
                { id: "all", labelGu: "કોઈપણ આવક જૂથ (બધી યોજનાઓ)", labelEn: "Any Income Bracket", icon: "📊" },
                { id: "below_2l", labelGu: "₹૨ લાખથી ઓછી (BPL / સામાન્ય)", labelEn: "Under ₹2 Lakhs / BPL", icon: "🌾" },
                { id: "above_2l", labelGu: "₹૨ લાખથી વધુ (પોષણ/બચત યોજનાઓ)", labelEn: "Above ₹2 Lakhs (Nutrition/Savings)", icon: "🏦" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`wizard-opt-btn ${incomeGroup === opt.id ? "active" : ""}`}
                  onClick={() => setIncomeGroup(opt.id)}
                >
                  <span className="w-icon">{opt.icon}</span>
                  <span className="w-text">{gu ? opt.labelGu : opt.labelEn}</span>
                  <span className="w-check">{incomeGroup === opt.id ? "✓" : "○"}</span>
                </button>
              ))}
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
            <div className="wizard-district-select-grid">
              {demoDistricts.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={`wizard-dist-pill ${selectedDistrict === d.id ? "active" : ""}`}
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
              <Sparkles size={16} />
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
                  ? `તમારા માટે યોગ્ય સરકારી યોજનાઓ (${matchedSchemes.length})`
                  : `Matched Schemes For You (${matchedSchemes.length})`}
              </h2>
              <small>
                {gu
                  ? "વિગતવાર માહિતી અને દસ્તાવેજ ચેકલિસ્ટ જોવા માટે કોઈપણ યોજના પર ક્લિક કરો"
                  : "Click any scheme card to review requirements and interactive document checklist"}
              </small>
            </div>

            <button className="btn-wizard-restart" onClick={() => setStep(1)}>
              {gu ? "🔄 ફરીથી શોધ કરો" : "🔄 Restart Wizard"}
            </button>
          </div>

          <div className="public-schemes-cards-list">
            {matchedSchemes.map((s) => (
              <div
                key={s.id}
                className="public-scheme-card"
                onClick={() => setSelectedModalScheme(s)}
                style={{ cursor: "pointer" }}
              >
                <div className="psc-top">
                  <span className="psc-badge">{gu ? s.categoryGu : s.category}</span>
                  <span className="psc-code">{s.id}</span>
                </div>

                <h3>{gu ? s.gu : s.name}</h3>

                <div className="psc-benefit-highlight">
                  <span className="psc-ben-lbl">{gu ? "સરકારી સહાય:" : "Assistance:"}</span>
                  <strong className="psc-ben-val">{gu ? s.benefitAmountGu : s.benefitAmount}</strong>
                </div>

                <div className="psc-docs-box">
                  <strong>
                    <FileText size={15} />
                    <span>{gu ? "જરૂરી પુરાવા:" : "Documents:"}</span>
                  </strong>
                  <div className="psc-docs-pills">
                    {(gu ? s.documentsGu : s.documents).map((doc, i) => (
                      <span key={i} className="doc-pill">
                        ✓ {doc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="psc-action-row">
                  <button
                    type="button"
                    className="btn-card-checklist"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedModalScheme(s);
                    }}
                  >
                    <FileText size={14} />
                    <span>{gu ? "📋 દસ્તાવેજ ચેકલિસ્ટ & ફોર્મ" : "Document Checklist"}</span>
                  </button>
                  <span className="psc-click-hint">
                    {gu ? "વિગત જુઓ →" : "View Details →"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Scheme Detail Modal */}
      <SchemeDetailModal
        scheme={selectedModalScheme}
        onClose={() => setSelectedModalScheme(null)}
        gu={gu}
      />
    </div>
  );
}
