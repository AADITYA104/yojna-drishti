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

type WizardPreviewContent = {
  kicker: string;
  title: string;
  description: string;
  points: readonly string[];
};

function WizardPreviewBoundary({ copy }: { copy: WizardPreviewContent }) {
  return (
    <aside className="wizard-preview-boundary" role="note" aria-label={copy.title}>
      <span className="wizard-preview-icon" aria-hidden="true"><ShieldCheck size={18} /></span>
      <span className="wizard-preview-kicker">{copy.kicker}</span>
      <h2>{copy.title}</h2>
      <p>{copy.description}</p>
      <ul>
        {copy.points.map((point) => <li key={point}><CheckCircle2 size={14} aria-hidden="true" />{point}</li>)}
      </ul>
    </aside>
  );
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

  const previewBoundary = {
    gu: {
      kicker: "પૂર્વદર્શનની મર્યાદા",
      title: "આ સાધન શું કરે છે",
      description: "પસંદગીઓ ફક્ત નમૂના નોંધોની સૂચિ ગોઠવે છે. તે સત્તાવાર પાત્રતા કે અરજીનો નિર્ણય નથી.",
      points: ["સત્તાવાર પાત્રતા નિર્ણય નથી", "કોઈ અરજી સબમિટ થતી નથી", "ચકાસેલ લાભની માહિતી જોડાયેલી નથી"],
    },
    hi: {
      kicker: "पूर्वावलोकन की सीमा",
      title: "यह उपकरण क्या करता है",
      description: "आपकी पसंद केवल नमूना प्रविष्टियों की सूची को व्यवस्थित करती है। यह आधिकारिक पात्रता या आवेदन का निर्णय नहीं है।",
      points: ["आधिकारिक पात्रता निर्णय नहीं", "कोई आवेदन जमा नहीं होता", "सत्यापित लाभ जानकारी जुड़ी नहीं है"],
    },
    en: {
      kicker: "PREVIEW BOUNDARY",
      title: "What this tool does",
      description: "Your choices only organize the sample entries shown here. They do not determine official eligibility or submit an application.",
      points: ["No official eligibility decision", "No application is submitted", "Verified benefit information is not connected"],
    },
  }[lang];

  return (
    <div className="public-portal-page w-full">
      {/* Page Hero */}
      <div className="page-hero-gov citizen-hero reveal">
        <div>
          <span className="hero-kicker-tag citizen-tag">
            <Sparkles size={14} className="inline mr-1" />
            {gu ? "યોજના શોધ · નમૂનાનું પૂર્વદર્શન" : lang === "hi" ? "योजना खोज · नमूना पूर्वावलोकन" : "SCHEME FINDER · SAMPLE PREVIEW"}
          </span>
          <h1>
            {gu ? "તમારા પરિવારને લગતી યોજના નોંધો શોધો" : lang === "hi" ? "अपने परिवार से जुड़ी योजना प्रविष्टियाँ खोजें" : "Explore scheme entries for your household"}
          </h1>
          <p>
            {gu
              ? "શ્રેણી, આવક જૂથ અને જિલ્લો પસંદ કરીને નમૂનાની સૂચિ ગોઠવો. આ સાધન સત્તાવાર પાત્રતા તપાસતું નથી અને અરજીની ખાતરી આપતું નથી."
              : lang === "hi"
                ? "श्रेणी, आय वर्ग और जिला चुनकर नमूना सूची देखें। यह उपकरण आधिकारिक पात्रता नहीं जाँचता और आवेदन की पुष्टि नहीं करता।"
                : "Choose a category, income group, and district to browse sample entries. This preview does not check official eligibility or confirm an application."}
          </p>
        </div>
      </div>

      {/* Progressive Step Indicator */}
      <div className="wizard-step-progress-bar reveal">
        {[
          { num: 1, titleGu: "લાભાર્થી શ્રેણી", titleEn: "Category", titleHi: "लाभार्थी श्रेणी" },
          { num: 2, titleGu: "આવક મર્યાદા", titleEn: "Income Bracket", titleHi: "आय सीमा" },
          { num: 3, titleGu: "જિલ્લો પસંદગી", titleEn: "District", titleHi: "जिला चयन" },
          { num: 4, titleGu: "નમૂનાની સૂચિ", titleEn: "Sample entries", titleHi: "नमूना सूची" },
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
        <div className="finder-wizard-box reveal">
          <div className="wizard-workspace">
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
            <WizardPreviewBoundary copy={previewBoundary} />
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
        <div className="finder-wizard-box reveal">
          <div className="wizard-workspace">
            <div className="wizard-question-group">
              <label className="wizard-label">
                {gu ? "૨. આવક જૂથ (માત્ર પૂર્વદર્શન માટે)" : lang === "hi" ? "२. आय वर्ग (केवल पूर्वावलोकन के लिए)" : "2. Income group (preview only):"}
              </label>
              <p className="wizard-field-hint">{gu ? "યોજનાવાર સત્તાવાર આવક મર્યાદા અહીં જોડાયેલી નથી. આ પસંદગી પરિણામો અથવા પાત્રતાને અસર કરતી નથી." : lang === "hi" ? "योजना-विशिष्ट आधिकारिक आय सीमा यहाँ उपलब्ध नहीं है। यह चयन परिणामों या पात्रता को प्रभावित नहीं करता।" : "Official income limits vary by scheme and are not connected here. This choice does not affect results or eligibility."}</p>
              <div className="wizard-options-grid">
              {[
                { id: "all", labelGu: "ઉલ્લેખ ન કરવો", labelEn: "Prefer not to specify", labelHi: "न बताना चाहें", IconComponent: Layers },
                { id: "below_2l", labelGu: "નીચું આવક જૂથ (નમૂનાનો વિકલ્પ)", labelEn: "Lower income group (sample option)", labelHi: "निम्न आय वर्ग (नमूना विकल्प)", IconComponent: Wallet },
                { id: "above_2l", labelGu: "બીજું આવક જૂથ (નમૂનાનો વિકલ્પ)", labelEn: "Another income group (sample option)", labelHi: "अन्य आय वर्ग (नमूना विकल्प)", IconComponent: Landmark },
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
            <WizardPreviewBoundary copy={previewBoundary} />
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
        <div className="finder-wizard-box reveal">
          <div className="wizard-workspace">
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
            <WizardPreviewBoundary copy={previewBoundary} />
          </div>

          <div className="wizard-nav-actions">
            <button className="btn-wizard-prev" onClick={() => setStep(2)}>
              <ArrowLeft size={16} />
              <span>{gu ? "પાછા જાઓ" : lang === "hi" ? "पीछे जाएँ" : "Back"}</span>
            </button>
            <button className="btn-wizard-next btn-wizard-view-results" onClick={() => setStep(4)}>
              <Search size={16} />
              <span>{gu ? `નમૂનાની સૂચિ જુઓ (${matchedSchemes.length})` : lang === "hi" ? `नमूना सूची देखें (${matchedSchemes.length})` : `View sample entries (${matchedSchemes.length})`}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: MATCHED RESULTS LIST */}
      {step === 4 && (
        <div className="wizard-results-view reveal">
          <div className="matched-results-header">
            <div>
              <h2>
                {gu
                  ? `તમારી પસંદગીની શ્રેણી માટે નમૂનાની નોંધો (${matchedSchemes.length})`
                  : lang === "hi"
                    ? `चुनी हुई श्रेणी की नमूना प्रविष्टियाँ (${matchedSchemes.length})`
                    : `Sample entries in the selected category (${matchedSchemes.length})`}
              </h2>
              <small>
                {gu
                  ? `પસંદ કરેલો જિલ્લો: ${demoDistricts.find((d) => d.id === selectedDistrict)?.gu || selectedDistrict} · આવક અને જિલ્લાની પસંદગી પાત્રતા ફિલ્ટર નથી; સત્તાવાર પાત્રતાની ચકાસણી થતી નથી.`
                  : lang === "hi"
                    ? `चुना हुआ जिला: ${demoDistricts.find((d) => d.id === selectedDistrict)?.name || selectedDistrict} · आय और जिले के विकल्प पात्रता फ़िल्टर नहीं हैं; आधिकारिक पात्रता की जाँच नहीं होती।`
                    : `Selected district: ${demoDistricts.find((d) => d.id === selectedDistrict)?.name || selectedDistrict} · income and district are not eligibility filters; no official eligibility check is performed.`}
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
                  <span className="psc-badge">{gu ? s.categoryGu : localizeText(lang, s.category)}</span>
                  <span className="psc-code">{s.id}</span>
                </div>

                <h3>{gu ? s.gu : s.name}</h3>
                <small style={{ color: "rgba(255,255,255,0.65)", display: "block", marginBottom: "8px" }}>
                  {gu ? "નમૂનાની નોંધ · સત્તાવાર સ્ત્રોત જોડાયેલો નથી" : lang === "hi" ? "नमूना प्रविष्टि · आधिकारिक स्रोत जुड़ा नहीं" : "Sample entry · no official source connected"}
                </small>

                <div className="psc-benefit-highlight">
                  <span className="psc-ben-lbl">
                    {gu ? "સત્તાવાર લાભ / પાત્રતા:" : lang === "hi" ? "आधिकारिक लाभ / पात्रता:" : "Official benefit / eligibility:"}
                  </span>
                  <strong className="psc-ben-val">{gu ? "ચકાસેલ માહિતી ઉપલબ્ધ નથી" : lang === "hi" ? "सत्यापित जानकारी उपलब्ध नहीं" : "Verified details unavailable"}</strong>
                </div>

                {/* Card CTA */}
                <div className="psc-action-row">
                  <button
                    type="button"
                    className="btn-card-checklist"
                    onClick={() => setSelectedModalScheme(s)}
                  >
                    <FileText size={14} />
                    <span>{gu ? "ચકાસણી સ્થિતિ જુઓ" : lang === "hi" ? "सत्यापन स्थिति देखें" : "View verification status"}</span>
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
