"use client";

import React, { useEffect } from "react";
import {
  X,
  FileText,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  ExternalLink,
  Building2,
  Users,
} from "lucide-react";
import { type Scheme } from "@/lib/demo-data";
import type { AppLanguage } from "@/lib/i18n";

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

  return (
    <div className="scheme-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="scheme-modal-title">
      <div className="scheme-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="scheme-modal-header">
          <div className="smh-badge-row">
            <span className="psc-badge">{gu ? scheme.categoryGu : scheme.category}</span>
            <span className="psc-code">{scheme.id}</span>
            <span className="smh-verified-pill" style={{ color: "#42C88A", borderColor: "rgba(66,200,138,0.3)" }}>
              <ShieldCheck size={13} />
              {gu ? "ચકાસાયેલ સરકારી યોજના" : lang === "hi" ? "सत्यापित सरकारी योजना" : "Verified Government Scheme"}
            </span>
          </div>

          <button className="smh-close-btn" onClick={onClose} aria-label={gu ? "બંધ કરો" : "Close"}>
            <X size={18} />
          </button>
        </div>

        <div className="scheme-modal-body">
          <h2 id="scheme-modal-title" className="smh-title">{gu ? scheme.gu : scheme.name}</h2>
          <span className="smh-subtitle">{gu ? scheme.name : scheme.gu}</span>

          {/* Department & Year Strip */}
          <div className="smh-meta-strip">
            <span>
              <Building2 size={15} />
              <b>{gu ? scheme.departmentGu : scheme.department}</b>
            </span>
            <span>
              <Calendar size={15} />
              <b>{gu ? `શરૂઆત: ${scheme.launchYear}` : lang === "hi" ? `आरंभ: ${scheme.launchYear}` : `Est. ${scheme.launchYear}`}</b>
            </span>
            <span>
              <Users size={15} />
              <b>{gu ? `લક્ષિત: ${scheme.targetGroupGu}` : `Target: ${scheme.targetGroup}`}</b>
            </span>
          </div>

          {/* Benefit Highlight Box */}
          <div className="smh-benefit-card">
            <div className="sbc-left">
              <span className="sbc-label">
                {gu ? "મળવાપાત્ર સહાય / લાભની રકમ:" : lang === "hi" ? "प्राप्त सहायता / लाभ राशि:" : "Approved Benefit Amount:"}
              </span>
              <strong className="sbc-value">{gu ? scheme.benefitAmountGu : scheme.benefitAmount}</strong>
            </div>
            <div className="sbc-type-badge">
              <ShieldCheck size={13} className="inline mr-1 text-teal" />
              {gu ? "પ્રત્યક્ષ સહાય (DBT)" : lang === "hi" ? "प्रत्यक्ष सहायता (DBT)" : "Direct Benefit (DBT)"}
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="smh-section">
            <h3 className="smh-section-title">
              <CheckCircle2 size={16} className="text-[#38BDF8]" />
              {gu ? "પાત્રતાના માપદંડ (Eligibility Criteria)" : lang === "hi" ? "पात्रता के मापदंड" : "Eligibility Criteria"}
            </h3>
            <ul className="scheme-bullet-list" style={{ marginTop: "8px" }}>
              {(gu ? scheme.eligibilityGu : scheme.eligibility).map((rule, idx) => (
                <li key={idx} style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.85rem", marginBottom: "4px" }}>
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          {/* Documents Checklist */}
          <div className="smh-section smh-docs-section">
            <div className="smh-docs-head">
              <div>
                <h3 className="smh-section-title" style={{ margin: 0 }}>
                  <FileText size={16} className="text-[#FACC15]" />
                  {gu ? "જરૂરી આધાર-પુરાવા (Required Documents Checklist)" : lang === "hi" ? "आवश्यक दस्तावेज़ सूची" : "Required Documents Checklist"}
                </h3>
                <small className="smh-docs-hint">
                  {gu ? "અરજી વખતે નીચેના દસ્તાવેજો સાથે રાખવા જરૂરી છે" : "Keep these verified documents ready during application"}
                </small>
              </div>
            </div>
            <ul className="scheme-bullet-list" style={{ marginTop: "8px" }}>
              {(gu ? scheme.documentsGu : scheme.documents).map((doc, idx) => (
                <li key={idx} style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.85rem", marginBottom: "4px" }}>
                  {doc}
                </li>
              ))}
            </ul>
          </div>

          {/* Where to apply & Helpline */}
          <div className="smh-apply-box">
            <MapPin size={20} className="text-emerald" style={{ flexShrink: 0, marginTop: 2, color: "#42C88A" }} />
            <div>
              <strong>{gu ? "અરજી કરવાની પ્રક્રિયા અને સ્થળ:" : lang === "hi" ? "आवेदन की प्रक्रिया और स्थान:" : "Application Procedure & Offices:"}</strong>
              <p style={{ marginTop: "4px", fontSize: "0.82rem", color: "rgba(255,255,255,0.75)" }}>
                {gu
                  ? "ગ્રામ પંચાયત કચેરી (e-Gram સેન્ટર), તાલુકા પંચાયત TDO કચેરી, અથવા ડિજિટલ ગુજરાત પોર્ટલ પર ઓનલાઇન અરજી કરી શકાય છે."
                  : lang === "hi"
                    ? "ग्राम पंचायत कार्यालय (e-Gram केंद्र), तालुका पंचायत TDO कार्यालय, या डिजिटल गुजरात पोर्टल पर ऑनलाइन आवेदन किया जा सकता है।"
                    : "Apply online at digitalgujarat.gov.in, or visit your local Gram Panchayat (eGram Center) or Taluka Panchayat TDO Office."}
                <br />
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                  <PhoneCall size={13} className="text-[#38BDF8]" />
                  {gu ? "સરકારી હેલ્પલાઇન: ૧૮૦૦-૨૩૩-૫૫૦૦ (ટોલ-ફ્રી)" : "Citizen Helpline: 1800-233-5500 (Toll-Free)"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="scheme-modal-footer">
          <button
            type="button"
            className="spatial-glowing-frosted-btn"
            onClick={() => {
              window.open("https://www.digitalgujarat.gov.in", "_blank", "noopener,noreferrer");
            }}
          >
            <span>{gu ? "ડિજિટલ ગુજરાત પર અરજી કરો" : lang === "hi" ? "डिजिटल गुजरात पर आवेदन करें" : "Apply on Digital Gujarat"}</span>
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
