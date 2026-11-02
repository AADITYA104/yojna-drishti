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
  School,
  Heart,
} from "lucide-react";
import { demoSchemes, type Scheme } from "@/lib/demo-data";

interface PublicPortalViewProps {
  gu: boolean;
}

export function PublicPortalView({ gu }: PublicPortalViewProps) {
  const [lifeStage, setLifeStage] = useState<string>("all");
  const [incomeGroup, setIncomeGroup] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("bhavnagar");

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
            🌟 {gu ? "નાગરિક સહાય કેન્દ્ર · યોજના શોધક" : "CITIZEN SCHEME FINDER"}
          </span>
          <h1>{gu ? "તમારા માટે કઈ સરકારી યોજના યોગ્ય છે? તે શોધો" : "Find Eligible Government Schemes For You"}</h1>
          <p>
            {gu
              ? "તમારી શ્રેણી, ઉંમર કે વ્યવસાય પસંદ કરો અને જાણો કે તમને કઈ કઈ સરકારી સહાય મળશે તથા ફોર્મ ક્યાં જમા કરાવવું."
              : "Interactive citizen-friendly eligibility questionnaire matching women, mothers, housewives, and girls to benefits."}
          </p>
        </div>
      </div>

      {/* Interactive Finder Questionnaire */}
      <div className="finder-wizard-box">
        <div className="wizard-question-group">
          <label className="wizard-label">
            {gu ? "૧. લાભાર્થીનો પ્રકાર પસંદ કરો:" : "1. Select Beneficiary Category / Life Stage:"}
          </label>
          <div className="wizard-options-grid">
            {[
              { id: "all", labelGu: "તમામ યોજનાઓ", labelEn: "All Beneficiaries" },
              { id: "girl", labelGu: "દીકરી / કન્યા (શાળા-શિક્ષણ)", labelEn: "Girl Child / Student" },
              { id: "maternal", labelGu: "સગર્ભા / ધાત્રી માતા (૧૦૦૦ દિવસ)", labelEn: "Pregnant / Lactating Mother" },
              { id: "widow", labelGu: "ગંગા સ્વરૂપા બહેન (વિધવા સહાય)", labelEn: "Widowed Sister" },
              { id: "entrepreneur", labelGu: "મહિલા સાહસિક / ગૃહિણી (સ્વરોજગાર)", labelEn: "Woman Entrepreneur / Self-Help" },
            ].map((opt) => (
              <button
                key={opt.id}
                className={`wizard-opt-btn ${lifeStage === opt.id ? "active" : ""}`}
                onClick={() => setLifeStage(opt.id)}
              >
                <span className="w-check">{lifeStage === opt.id ? "✓" : "○"}</span>
                <span>{gu ? opt.labelGu : opt.labelEn}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="wizard-question-group">
          <label className="wizard-label">
            {gu ? "૨. કુટુંબની વાર્ષિક આવક મર્યાદા:" : "2. Family Annual Income Group:"}
          </label>
          <div className="wizard-options-grid">
            {[
              { id: "all", labelGu: "કોઈપણ આવક જૂથ", labelEn: "Any Income Bracket" },
              { id: "below_2l", labelGu: "₹૨ લાખથી ઓછી (BPL / સામાન્ય)", labelEn: "Under ₹2 Lakhs / BPL" },
              { id: "above_2l", labelGu: "₹૨ લાખથી વધુ (પોષણ/બચત યોજનાઓ)", labelEn: "Above ₹2 Lakhs (Nutrition/Savings)" },
            ].map((opt) => (
              <button
                key={opt.id}
                className={`wizard-opt-btn ${incomeGroup === opt.id ? "active" : ""}`}
                onClick={() => setIncomeGroup(opt.id)}
              >
                <span className="w-check">{incomeGroup === opt.id ? "✓" : "○"}</span>
                <span>{gu ? opt.labelGu : opt.labelEn}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Matched Schemes Results */}
      <div className="matched-results-header">
        <h2>
          {gu
            ? `તમારા માટે ઉપલબ્ધ યોજનાઓ (${matchedSchemes.length})`
            : `Matched Schemes For You (${matchedSchemes.length})`}
        </h2>
        <small>
          {gu
            ? "લાભ મેળવવા માટે નીચે દર્શાવેલા સરનામે અને દસ્તાવેજો સાથે સંપર્ક કરો"
            : "Review scheme requirements, financial amounts, and application steps below"}
        </small>
      </div>

      <div className="public-schemes-cards-list">
        {matchedSchemes.map((s, idx) => (
          <div key={s.id} className="public-scheme-card">
            <div className="psc-top">
              <span className="psc-badge">{gu ? s.categoryGu : s.category}</span>
              <span className="psc-code">{s.id}</span>
            </div>

            <h3>{gu ? s.gu : s.name}</h3>

            <div className="psc-benefit-highlight">
              <span className="psc-ben-lbl">{gu ? "આ યોજના હેઠળ મળતી સરકારી સહાય:" : "Government Assistance Provided:"}</span>
              <strong className="psc-ben-val">{gu ? s.benefitAmountGu : s.benefitAmount}</strong>
            </div>

            <div className="psc-docs-box">
              <strong>
                <FileText size={15} />
                <span>{gu ? "સાથે રાખવાના જરૂરી પુરાવા:" : "Mandatory Documents Required:"}</span>
              </strong>
              <div className="psc-docs-pills">
                {(gu ? s.documentsGu : s.documents).map((doc, i) => (
                  <span key={i} className="doc-pill">
                    ✓ {doc}
                  </span>
                ))}
              </div>
            </div>

            {/* Where to apply box */}
            <div className="psc-apply-box">
              <School size={16} className="text-teal" />
              <div>
                <b>{gu ? "અરજી ક્યાં જમા કરાવવી?" : "Where to apply?"}</b>
                <p>
                  {gu
                    ? "તમારા ગામની સ્થાનિક આંગણવાડી કાર્યકર, ગ્રામ પંચાયતના તલાટી-કમ-મંત્રી, ઈ-ગ્રામ કેન્દ્ર અથવા તાલુકા પંચાયત (WCD શાખા) નો સંપર્ક કરો."
                    : "Visit your local Village Anganwadi Worker, Gram Panchayat Talati / e-Gram Center, or Taluka Development Office."}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
