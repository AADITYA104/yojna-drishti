"use client";

import React, { useEffect } from "react";
import { X, ShieldAlert, FileText, ExternalLink } from "lucide-react";
import { type Scheme } from "@/lib/demo-data";
import { localizeText, type AppLanguage } from "@/lib/i18n";

interface SchemeDetailModalProps {
  scheme: Scheme | null;
  onClose: () => void;
  gu: boolean;
  lang: AppLanguage;
}

export function SchemeDetailModal({ scheme, onClose, gu, lang }: SchemeDetailModalProps) {
  useEffect(() => {
    if (!scheme) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scheme, onClose]);

  if (!scheme) return null;

  const copy = {
    gu: {
      sample: "કેટલોગનો નમૂનો · સત્તાવાર રીતે ચકાસાયેલો નથી",
      eyebrow: "માહિતીની સ્થિતિ",
      title: "સત્તાવાર વિગતો ઉપલબ્ધ નથી",
      body: "આ પ્રોજેક્ટમાં આ યોજના માટે અધિકૃત સરકારી સ્રોત અથવા તાજી ચકાસણી જોડાયેલી નથી. તેથી અહીં લાભની રકમ, પાત્રતાના નિયમો, દસ્તાવેજોની યાદી, અરજીની રીત, સમયમર્યાદા કે હેલ્પલાઇન દર્શાવવામાં આવતી નથી.",
      next: "ચકાસવા જેવી વિગતો",
      details: ["સંબંધિત સરકારી વિભાગની અધિકૃત યોજના સૂચના", "હાલના પાત્રતા નિયમો અને લાભની શરતો", "અરજી પોર્ટલ અથવા સ્થાનિક કચેરીની પુષ્ટિ"],
      source: "અધિકૃત સ્રોત જોડાયેલો નથી",
      close: "બંધ કરો",
    },
    en: {
      sample: "Catalogue sample · not officially verified",
      eyebrow: "Information status",
      title: "Official details are unavailable",
      body: "No official government source or recent verification is connected to this entry. For that reason, this preview does not state a benefit amount, eligibility rules, document list, application route, deadline, or helpline.",
      next: "What to verify",
      details: ["The scheme notification from the responsible government department", "Current eligibility rules and benefit conditions", "The official application portal or local office"],
      source: "No official source connected",
      close: "Close",
    },
    hi: {
      sample: "सूची का नमूना · आधिकारिक रूप से सत्यापित नहीं",
      eyebrow: "जानकारी की स्थिति",
      title: "आधिकारिक विवरण उपलब्ध नहीं हैं",
      body: "इस प्रविष्टि से कोई आधिकारिक सरकारी स्रोत या हाल की जाँच जुड़ी नहीं है। इसलिए इस पूर्वावलोकन में लाभ राशि, पात्रता नियम, दस्तावेज़ सूची, आवेदन प्रक्रिया, समय-सीमा या हेल्पलाइन नहीं दी गई है।",
      next: "क्या सत्यापित करें",
      details: ["संबंधित सरकारी विभाग की आधिकारिक योजना अधिसूचना", "वर्तमान पात्रता नियम और लाभ की शर्तें", "आधिकारिक आवेदन पोर्टल या स्थानीय कार्यालय"],
      source: "कोई आधिकारिक स्रोत जुड़ा नहीं",
      close: "बंद करें",
    },
  }[lang];

  return (
    <div className="scheme-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="scheme-modal-title">
      <div className="scheme-modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="scheme-modal-header">
          <div className="smh-badge-row">
            <span className="psc-badge">{gu ? scheme.categoryGu : localizeText(lang, scheme.category)}</span>
            <span className="psc-code">{scheme.id}</span>
            <span className="smh-verified-pill" style={{ color: "#8a5b00", borderColor: "rgba(198,137,27,0.38)" }}>
              <ShieldAlert size={13} />{copy.sample}
            </span>
          </div>
          <button className="smh-close-btn" onClick={onClose} aria-label={copy.close}><X size={18} /></button>
        </div>

        <div className="scheme-modal-body">
          <h2 id="scheme-modal-title" className="smh-title">{gu ? scheme.gu : localizeText(lang, scheme.name)}</h2>
          <section className="smh-section" role="note">
            <h3 className="smh-section-title"><ShieldAlert size={17} />{copy.eyebrow}</h3>
            <h4>{copy.title}</h4>
            <p>{copy.body}</p>
          </section>
          <section className="smh-section">
            <h3 className="smh-section-title"><FileText size={17} />{copy.next}</h3>
            <ul className="scheme-bullet-list">
              {copy.details.map((detail) => <li key={detail}>{detail}</li>)}
            </ul>
          </section>
          <div className="smh-apply-box" role="note">
            <ExternalLink size={18} aria-hidden="true" />
            <span>{copy.source}</span>
          </div>
        </div>

        <div className="scheme-modal-footer">
          <button type="button" className="spatial-glowing-frosted-btn" onClick={onClose}>{copy.close}</button>
        </div>
      </div>
    </div>
  );
}
