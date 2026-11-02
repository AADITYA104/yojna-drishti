"use client";

import React, { useState } from "react";
import {
  X,
  FileText,
  CheckCircle2,
  Download,
  MapPin,
  Building2,
  Calendar,
  Wallet,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { type Scheme } from "@/lib/demo-data";

interface SchemeDetailModalProps {
  scheme: Scheme | null;
  onClose: () => void;
  gu: boolean;
}

export function SchemeDetailModal({ scheme, onClose, gu }: SchemeDetailModalProps) {
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  if (!scheme) return null;

  const docs = gu ? scheme.documentsGu : scheme.documents;
  const totalDocs = docs.length;
  const checkedCount = docs.filter((d) => checkedDocs[d]).length;
  const readinessPct = totalDocs > 0 ? Math.round((checkedCount / totalDocs) * 100) : 0;

  const toggleDoc = (doc: string) => {
    setCheckedDocs((prev) => ({ ...prev, [doc]: !prev[doc] }));
  };

  return (
    <div className="scheme-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="scheme-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="scheme-modal-header">
          <div className="smh-badge-row">
            <span className="psc-badge">{gu ? scheme.categoryGu : scheme.category}</span>
            <span className="psc-code">{scheme.id}</span>
            <span className="smh-verified-pill">
              <ShieldCheck size={13} />
              {gu ? "ગુજરાત સરકાર અધિકૃત" : "Govt of Gujarat Verified"}
            </span>
          </div>

          <button className="smh-close-btn" onClick={onClose} aria-label={gu ? "બંધ કરો" : "Close"}>
            <X size={18} />
          </button>
        </div>

        <div className="scheme-modal-body">
          <h2 className="smh-title">{gu ? scheme.gu : scheme.name}</h2>
          <span className="smh-subtitle">{gu ? scheme.name : scheme.gu}</span>

          {/* Department & Budget Bar */}
          <div className="smh-meta-strip">
            <span>
              <Building2 size={15} />
              <b>{gu ? scheme.departmentGu : scheme.department}</b>
            </span>
            <span>
              <Wallet size={15} />
              <b>₹ {scheme.budgetAllocatedCr} Cr {gu ? "વાર્ષિક બજેટ" : "Budget"}</b>
            </span>
            <span>
              <Calendar size={15} />
              <b>{scheme.launchYear} {gu ? "થી અમલમાં" : "Launched"}</b>
            </span>
          </div>

          {/* Benefit Highlight Box */}
          <div className="smh-benefit-card">
            <div className="sbc-left">
              <span className="sbc-label">{gu ? "સરકારી સહાય અને લાભ:" : "Financial Benefit:"}</span>
              <strong className="sbc-value">{gu ? scheme.benefitAmountGu : scheme.benefitAmount}</strong>
            </div>
            <div className="sbc-type-badge">
              {scheme.category === "Girl Child" || scheme.category === "Widow Welfare" || scheme.category === "Social Security"
                ? gu ? "💳 સીધા બેંક ખાતામાં (DBT)" : "Direct Bank Transfer"
                : gu ? "📦 પોષણ / કીટ સહાય" : "Welfare Assistance"}
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="smh-section">
            <h3 className="smh-section-title">
              {gu ? "પાત્રતાના માપદંડ (Eligibility Criteria):" : "Eligibility Criteria:"}
            </h3>
            <ul className="smh-criteria-list">
              {(gu ? scheme.eligibilityGu : scheme.eligibility).map((item, idx) => (
                <li key={idx}>
                  <CheckCircle2 size={16} className="text-emerald" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Document Checklist */}
          <div className="smh-section smh-docs-section">
            <div className="smh-docs-head">
              <div>
                <h3 className="smh-section-title" style={{ margin: 0 }}>
                  <FileText size={16} />
                  {gu ? "જરૂરી દસ્તાવેજો ચેકલિસ્ટ (Interactive Checklist):" : "Mandatory Documents Checklist:"}
                </h3>
                <small className="smh-docs-hint">
                  {gu
                    ? "તમારી પાસે ઉપલબ્ધ દસ્તાવેજો પર ટીક કરો અને અરજી માટેની તૈયારી ચકાસો"
                    : "Check off the documents you have ready to apply"}
                </small>
              </div>

              <div className="smh-readiness-badge">
                <span>{gu ? "તૈયારી:" : "Ready:"}</span>
                <strong>{checkedCount} / {totalDocs} ({readinessPct}%)</strong>
              </div>
            </div>

            {/* Progress bar */}
            <div className="smh-progress-bar-bg">
              <div
                className="smh-progress-bar-fill"
                style={{
                  width: `${readinessPct}%`,
                  background: readinessPct === 100 ? "#059669" : readinessPct > 50 ? "#0284c7" : "#d97706",
                }}
              />
            </div>

            <div className="smh-docs-grid">
              {docs.map((doc, idx) => {
                const isChecked = !!checkedDocs[doc];
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`smh-doc-checkbox-btn ${isChecked ? "is-checked" : ""}`}
                    onClick={() => toggleDoc(doc)}
                  >
                    <span className="smh-checkbox-square">
                      {isChecked ? "✓" : ""}
                    </span>
                    <span className="smh-doc-text">{doc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Where to apply & Help */}
          <div className="smh-apply-box">
            <MapPin size={20} className="text-emerald" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>{gu ? "અરજી કરવાની પ્રક્રિયા અને સ્થળ:" : "Application Procedure & Offices:"}</strong>
              <p>
                {gu
                  ? "૧. તમારા ગામની સ્થાનિક આંગણવાડી કાર્યકર અથવા ગ્રામ પંચાયતના તલાટી-કમ-મંત્રીનો સંપર્ક કરો."
                  : "1. Contact your local Anganwadi Worker or Gram Panchayat Talati."}
                <br />
                {gu
                  ? "૨. ડિજિટલ સેવા સેતુ (Digital Seva Setu) અથવા ઇ-સમાજ કલ્યાણ (e-Samaj Kalyan) પોર્ટલ પર ઓનલાઈન અરજી થઈ શકે છે."
                  : "2. Apply online via Digital Seva Setu or e-Samaj Kalyan portal."}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="scheme-modal-footer">
          <button className="btn-modal-download" onClick={() => alert(gu ? "અધિકૃત અરજી ફોર્મ PDF ડાઉનલોડ થાય છે..." : "Downloading official application form PDF...")}>
            <Download size={16} />
            <span>{gu ? "અરજી ફોર્મ ડાઉનલોડ (PDF)" : "Download Form (PDF)"}</span>
          </button>
          <button className="btn-modal-portal" onClick={() => window.open("https://digitalgujarat.gov.in", "_blank")}>
            <ExternalLink size={16} />
            <span>{gu ? "ઓનલાઇન પોર્ટલ પર જાઓ" : "Open Digital Gujarat"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
