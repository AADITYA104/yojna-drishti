"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  FileText,
  CheckCircle2,
  MapPin,
  Calendar,
  Wallet,
  ShieldCheck,
  Check,
  Info,
} from "lucide-react";
import { type Scheme } from "@/lib/demo-data";

interface SchemeDetailModalProps {
  scheme: Scheme | null;
  onClose: () => void;
  gu: boolean;
}

export function SchemeDetailModal({ scheme, onClose, gu }: SchemeDetailModalProps) {
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!scheme) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scheme, onClose]);

  if (!scheme) return null;

  const docs = gu ? scheme.documentsGu : scheme.documents;
  const totalDocs = docs.length;
  const checkedCount = docs.filter((d) => checkedDocs[d]).length;
  const readinessPct = totalDocs > 0 ? Math.round((checkedCount / totalDocs) * 100) : 0;

  const toggleDoc = (doc: string) => {
    setCheckedDocs((prev) => ({ ...prev, [doc]: !prev[doc] }));
  };

  return (
    <div className="scheme-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="scheme-modal-title">
      <div className="scheme-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="scheme-modal-header">
          <div className="smh-badge-row">
            <span className="psc-badge">{gu ? scheme.categoryGu : scheme.category}</span>
            <span className="psc-code">{scheme.id}</span>
            <span className="smh-verified-pill">
              <Info size={13} />
              {gu ? "નમૂનાની વિગતો · ચકાસાયેલ નથી" : "Sample details · unverified"}
            </span>
          </div>

          <button className="smh-close-btn" onClick={onClose} aria-label={gu ? "બંધ કરો" : "Close"}>
            <X size={18} />
          </button>
        </div>

        <div className="scheme-modal-body">
          <h2 id="scheme-modal-title" className="smh-title">{gu ? scheme.gu : scheme.name}</h2>
          <span className="smh-subtitle">{gu ? scheme.name : scheme.gu}</span>

          {/* Scheme metadata. Sample budget figures are intentionally omitted. */}
          <div className="smh-meta-strip">
            <span>
              <MapPin size={15} />
              <b>{gu ? scheme.departmentGu : scheme.department}</b>
            </span>
            <span>
              <Calendar size={15} />
              <b>{scheme.launchYear} {gu ? "થી અમલમાં" : "Launched"}</b>
            </span>
          </div>

          {/* Benefit Highlight Box */}
          <div className="smh-benefit-card">
            <div className="sbc-left">
              <span className="sbc-label">{gu ? "લાભ · નમૂનાની માહિતી:" : "Benefit · sample information:"}</span>
              <strong className="sbc-value">{gu ? scheme.benefitAmountGu : scheme.benefitAmount}</strong>
            </div>
            <div className="sbc-type-badge">
              {scheme.category === "Girl Child" || scheme.category === "Widow Welfare" || scheme.category === "Social Security" ? (
                <>
                  <Wallet size={13} className="inline mr-1 text-teal" />
                  {gu ? "સીધા બેંક ખાતામાં (DBT)" : "Direct Bank Transfer"}
                </>
              ) : (
                <>
                  <ShieldCheck size={13} className="inline mr-1 text-teal" />
                  {gu ? "પોષણ / કીટ સહાય" : "Welfare Assistance"}
                </>
              )}
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
                      {isChecked ? <Check size={12} /> : null}
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
                  ? "અરજીની જગ્યા અને પ્રક્રિયા યોજના પ્રમાણે અલગ હોઈ શકે છે."
                  : "Application office and process vary by scheme."}
                <br />
                {gu
                  ? "અરજી કરતાં પહેલાં સંબંધિત સરકારી વિભાગની સત્તાવાર વેબસાઇટ પર પાત્રતા અને દસ્તાવેજોની પુષ્ટિ કરો."
                  : "Before applying, confirm eligibility and documents on the responsible department’s official website."}
              </p>
            </div>
          </div>
        </div>

        <div className="scheme-modal-footer scheme-modal-preview-note" role="note">
          {gu
            ? "આ પૂર્વદર્શન અરજી સ્વીકારતું નથી. સત્તાવાર યોજના પાનું અને અરજી લિંક અહીં જોડાયેલી નથી."
            : "This preview does not accept applications. An official scheme page or application link is not connected here."}
        </div>
      </div>
    </div>
  );
}
