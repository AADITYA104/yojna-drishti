"use client";

import React, { useState, useMemo } from "react";
import { localizeText } from "@/lib/i18n";
import type { AppLanguage } from "@/lib/i18n";
import {
  Search,
  CheckCircle2,
  FileText,
  Building2,
  MapPin,
  ExternalLink,
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
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { demoSchemes, demoDistricts, type Scheme } from "@/lib/demo-data";
import { SchemeDetailModal } from "../shared/SchemeDetailModal";

interface PublicPortalViewProps {
  gu: boolean;
  lang: AppLanguage;
}

export function PublicPortalView({ gu, lang }: PublicPortalViewProps) {
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
      return true;
    });
  }, [lifeStage]);

  return (
    <div className="public-portal-page w-full">
      {/* Page Hero */}
      <div className="page-hero-gov citizen-hero">
        <div>
          <span className="hero-kicker-tag citizen-tag">
            <Sparkles size={14} className="inline mr-1" />
            {gu ? "સ્માર્ટ પાત્રતા નિર્ધારક" : lang === "hi" ? "स्मार्ट पात्रता निर्धारक" : "SMART ELIGIBILITY FINDER"}
          </span>
          <h1>
            {gu ? "તમારા પરિવાર માટે યોગ્ય સરકારી યોજનાઓ શોધો" : lang === "hi" ? "अपने परिवार के लिए उपयुक्त सरकारी योजनाएँ खोजें" : "Find Eligible Welfare Schemes for Your Family"}
          </h1>
          <p>
            {gu
              ? "તમારી ઉંમર, આવક, સામાજિક વર્ગ અને જિલ્લાની વિગતો પસંદ કરો અને માત્ર ૨ મિનિટમાં મેળવો પાત્ર યોજનાઓની સંપૂર્ણ યાદી."
              : lang === "hi"
                ? "अपनी आयु, आय, सामाजिक वर्ग और जिले का चयन करें और २ मिनट में प्राप्त करें सुपात्र योजनाओं की सूची।"
                : "Select your category, income, and district to find matching Gujarat government schemes with step-by-step guidance."}
          </p>
        </div>
      </div>

      {/* Progressive Step Indicator */}
      <div className="wizard-step-progress-bar">
        {[
          { num: 1, titleGu: "લાભાર્થી શ્રેણી", titleEn: "Category", titleHi: "लाभार्थी श्रेणी" },
          { num: 2, titleGu: "આવક મર્યાદા", titleEn: "Income Bracket", titleHi: "आय सीमा" },
          { num: 3, titleGu: "જિલ્લો પસંદગી", titleEn: "District", titleHi: "जिला चयन" },
          { num: 4, titleGu: "પાત્ર યોજનાઓ", titleEn: "Eligible Schemes", titleHi: "पात्र योजनाएँ" },
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
            <span className="wsp-title">{gu ? s.titleGu : lang === "hi" ? s.titleHi : s.titleEn}</span>
          </button>
        ))}
      </div>

      {/* STEP 1: LIFE STAGE / CATEGORY */}
      {step === 1 && (
        <div className="finder-wizard-box">
          <div className="wizard-question-group">
            <label className="wizard-label">
              {gu ? "૧. લાભાર્થીનો પ્રકાર અથવા જીવન તબક્કો પસંદ કરો:" : lang === "hi" ? "१. लाभार्थी प्रकार अथवा जीवन चरण चुनें:" : "1. Select Beneficiary Category / Life Stage:"}
            </label>
            <div className="wizard-options-grid">
              {[
                { id: "all", labelGu: "તમામ યોજનાઓ", labelEn: "All Beneficiaries", labelHi: "सभी योजनाएँ", IconComponent: Layers },
                { id: "girl", labelGu: "દીકરી / કન્યા (શાળા-શિક્ષણ)", labelEn: "Girl Child / Student", labelHi: "बालिका / छात्रा", IconComponent: GraduationCap },
                { id: "maternal", labelGu: "સગર્ભા / ધાત્રી માતા (૧૦૦૦ દિવસ)", labelEn: "Pregnant / Nursing Mother", labelHi: "गर्भवती / धात्री माता", IconComponent: Baby },
                { id: "widow", labelGu: "ગંગા સ્વરૂપા બહેન (વિધવા સહાય)", labelEn: "Widowed Sister (Ganga Swarupa)", labelHi: "गंगा स्वरूपा बहन (विधवा सहायता)", IconComponent: Users },
                { id: "entrepreneur", labelGu: "મહિલા સાહસિક / ગૃહિણી (સ્વરોજગાર)", labelEn: "Woman Entrepreneur / Self Employed", labelHi: "महिला उद्यमी / स्वरोजगार", IconComponent: Briefcase },
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
                    <span className="w-text">{gu ? opt.labelGu : lang === "hi" ? opt.labelHi : opt.labelEn}</span>
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
              <span>{gu ? "આગળનું પગલું (આવક મર્યાદા)" : lang === "hi" ? "अगला चरण (आय सीमा)" : "Next: Income Bracket"}</span>
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
              {gu ? "૨. તમારા કુટુંબની અંદાજિત વાર્ષિક આવક કેટલી છે?" : lang === "hi" ? "२. आपके परिवार की अनुमानित वार्षिक आय कितनी है?" : "2. Select Family Annual Income Bracket:"}
            </label>
            <div className="wizard-options-grid">
              {[
                { id: "all", labelGu: "કોઈપણ આવક જૂથ (બધી યોજનાઓ)", labelEn: "Any Income Bracket", labelHi: "सभी आय वर्ग", IconComponent: Layers },
                { id: "below_2l", labelGu: "₹૨ લાખથી ઓછી (BPL / EWS ગ્રામીણ-શહેરી)", labelEn: "Under ₹2 Lakhs / BPL & EWS", labelHi: "₹२ लाख से कम (BPL / EWS)", IconComponent: Wallet },
                { id: "above_2l", labelGu: "₹૨ લાખથી વધુ (સામાન્ય/પોષણ/બચત યોજનાઓ)", labelEn: "Above ₹2 Lakhs (Nutrition/Savings/MSME)", labelHi: "₹२ लाख से अधिक", IconComponent: Landmark },
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
                    <span className="w-text">{gu ? opt.labelGu : lang === "hi" ? opt.labelHi : opt.labelEn}</span>
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
              <span>{gu ? "પાછા જાઓ" : lang === "hi" ? "पीछे जाएँ" : "Back"}</span>
            </button>
            <button className="btn-wizard-next" onClick={() => setStep(3)}>
              <span>{gu ? "આગળનું પગલું (જિલ્લો)" : lang === "hi" ? "अगला चरण (जिला)" : "Next: District"}</span>
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
              {gu ? "૩. તમે ગુજરાતના કયા જિલ્લામાં રહો છો?" : lang === "hi" ? "३. आप गुजरात के किस जिले में रहते हैं?" : "3. Select Your Gujarat District:"}
            </label>
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
                  <span>{gu ? d.gu : lang === "hi" ? d.name : d.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="wizard-nav-actions">
            <button className="btn-wizard-prev" onClick={() => setStep(2)}>
              <ArrowLeft size={16} />
              <span>{gu ? "પાછા જાઓ" : lang === "hi" ? "पीछे जाएँ" : "Back"}</span>
            </button>
            <button className="btn-wizard-next btn-wizard-view-results" onClick={() => setStep(4)}>
              <Search size={16} />
              <span>{gu ? `પાત્ર યોજનાઓ જુઓ (${matchedSchemes.length})` : lang === "hi" ? `सुपात्र योजनाएँ देखें (${matchedSchemes.length})` : `View Eligible Schemes (${matchedSchemes.length})`}</span>
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
                  ? `તમારા માટે યોગ્ય કલ્યાણકારી યોજનાઓ (${matchedSchemes.length})`
                  : lang === "hi"
                    ? `आपके लिए सुपात्र कल्याणकारी योजनाएँ (${matchedSchemes.length})`
                    : `Matching Government Schemes for You (${matchedSchemes.length})`}
              </h2>
              <small>
                {gu
                  ? `પસંદ કરેલ જિલ્લો: ${demoDistricts.find((d) => d.id === selectedDistrict)?.gu || selectedDistrict} · ૧૦૦% ચકાસાયેલ સરકારી પોર્ટલ સૂચિ`
                  : `Selected District: ${demoDistricts.find((d) => d.id === selectedDistrict)?.name || selectedDistrict} · 100% Verified Gujarat Portal List`}
              </small>
            </div>

            <button className="btn-wizard-restart" onClick={() => setStep(1)}>
              <RotateCcw size={14} className="inline mr-1" />
              <span>{gu ? "નવી શોધ શરૂ કરો" : lang === "hi" ? "नई खोज शुरू करें" : "Reset & Search Again"}</span>
            </button>
          </div>

          <div className="public-schemes-cards-list">
            {matchedSchemes.map((s) => (
              <article key={s.id} className="public-scheme-card">
                <div className="psc-top">
                  <span className="psc-badge">{gu ? s.categoryGu : s.category}</span>
                  <span className="psc-code">{s.id}</span>
                </div>

                <h3>{gu ? s.gu : s.name}</h3>
                <small style={{ color: "rgba(255,255,255,0.65)", display: "block", marginBottom: "8px" }}>
                  {gu ? s.departmentGu : s.department}
                </small>

                <div className="psc-benefit-highlight">
                  <span className="psc-ben-lbl">
                    {gu ? "મળવાપાત્ર લાભ / સહાય:" : lang === "hi" ? "प्राप्त सहायता राशि:" : "Benefit Amount:"}
                  </span>
                  <strong className="psc-ben-val">{gu ? s.benefitAmountGu : s.benefitAmount}</strong>
                </div>

                <div className="psc-docs-box">
                  <strong>
                    <FileText size={15} />
                    <span>{gu ? "જરૂરી આધાર પુરાવા:" : lang === "hi" ? "आवश्यक दस्तावेज़:" : "Required Documents:"}</span>
                  </strong>
                  <div className="psc-docs-pills">
                    {(gu ? s.documentsGu : s.documents).slice(0, 3).map((doc, idx) => (
                      <span className="doc-pill" key={idx}>{doc}</span>
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
                    <span>{gu ? "વિગતવાર માહિતી & અરજી" : lang === "hi" ? "विस्तृत विवरण और आवेदन" : "View Details & Apply"}</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Scheme Detail Modal */}
      {selectedModalScheme && (
        <SchemeDetailModal
          key={selectedModalScheme.id}
          scheme={selectedModalScheme}
          onClose={() => setSelectedModalScheme(null)}
          gu={gu}
          lang={lang}
        />
      )}
    </div>
  );
}
