"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowRight, BarChart3, Building2, Database, MapPinned, ShieldCheck, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { localizeText, type AppLanguage } from "@/lib/i18n";

interface SpatialBentoDashboardProps {
  gu: boolean;
  lang: AppLanguage;
  fy?: string;
  onNavigate: (view: "map" | "schemes" | "wizard" | "saved" | "settings") => void;
  onSelectScheme?: (name: string) => void;
}

type Overview = {
  status: string;
  meta: { classification: string; referenceDate: string; locationCount: number; districtCount: number; schemeCount: number; sourceRows: number };
  data: {
    schemes: Array<{ id: string; nameEn: string; nameGu: string; count: number }>;
    districts: Array<{ districtCode: string; nameEn: string; nameGu: string; locationCount: number; sampleRows: number; schemeCount: number }>;
  };
};

const copy = {
  gu: {
    eyebrow: "ગુજરાત · ખુલ્લો ડેટા પૂર્વદર્શન", title: "યોજના દૃષ્ટિ", subtitle: "ગામ અને શહેરના સ્તરે datasetમાં રહેલી યોજના પંક્તિઓ જુઓ.",
    noticeTitle: "મહત્વપૂર્ણ ડેટા નોંધ", notice: "આ આંકડા synthetic demo rows છે. તે વાસ્તવિક લાભાર્થી, પાત્રતા, ચુકવણી અથવા સરકારી યોજના પહોંચ દર્શાવતા નથી.",
    rows: "નમૂના પંક્તિઓ", places: "સ્થળો સાથે જોડાયેલા", schemes: "યોજનાના કોડ", districts: "જિલ્લા", ref: "ડેટાસેટ સંદર્ભ તારીખ",
    schemeTitle: "યોજનાવાર નમૂના પંક્તિઓ", districtTitle: "જિલ્લાવાર dataset પંક્તિઓ", count: "પંક્તિઓ", locations: "સ્થળો", openMap: "નકશો ખોલો", openSchemes: "યોજનાઓ જુઓ",
    loading: "માહિતી સમૂહ વિશ્લેષણ લોડ થાય છે…", error: "હાલમાં માહિતી વિશ્લેષણ ઉપલબ્ધ નથી.", retry: "ફરી પ્રયાસ કરો", retryHint: "નેટવર્ક તપાસો અને ડેટા ફરીથી લોડ કરો.", source: "સ્રોત: જોડાયેલ માહિતી સમૂહ · ગણતરી: કાચા નમૂના રેકોર્ડ્સ; વ્યક્તિઓની સંખ્યા નહીં.", viewAll: "બધા જિલ્લાઓ નકશામાં જુઓ",
    journeyKicker: "શરૂઆત માટે માર્ગ", journeyTitle: "આ workspace કેવી રીતે કામ કરે છે", journeyText: "સ્થળ પસંદ કરો, જોડાયેલી નમૂના પંક્તિઓ તપાસો અને યોજના માહિતી અલગથી વાંચો.",
    journeySteps: ["સ્થળ પસંદ કરો", "પંક્તિઓ તપાસો", "યોજનાની માહિતી વાંચો"],
  },
  hi: {
    eyebrow: "गुजरात · खुला डेटा पूर्वावलोकन", title: "योजना दृष्टि", subtitle: "गाँव और शहर के स्तर पर dataset में मौजूद योजना पंक्तियाँ देखें।",
    noticeTitle: "महत्वपूर्ण डेटा सूचना", notice: "ये synthetic demo rows हैं। ये वास्तविक लाभार्थी, पात्रता, भुगतान या सरकारी योजना पहुँच नहीं दर्शातीं।",
    rows: "नमूना पंक्तियाँ", places: "स्थान शामिल", schemes: "योजना कोड", districts: "जिले", ref: "डेटासेट संदर्भ तिथि",
    schemeTitle: "योजनावार नमूना पंक्तियाँ", districtTitle: "जिलेवार dataset पंक्तियाँ", count: "पंक्तियाँ", locations: "स्थान", openMap: "नक्शा खोलें", openSchemes: "योजनाएँ देखें",
    loading: "डेटा संग्रह विश्लेषण लोड हो रहा है…", error: "अभी विश्लेषण उपलब्ध नहीं है।", retry: "पुनः प्रयास करें", retryHint: "नेटवर्क जाँचें और डेटा पुनः लोड करें।", source: "स्रोत: जुड़ा स्थान डेटा संग्रह · गणना: कच्चे नमूना रिकॉर्ड; लोगों की संख्या नहीं।", viewAll: "सभी जिले नक्शे पर देखें",
    journeyKicker: "शुरुआती मार्ग", journeyTitle: "यह workspace कैसे काम करता है", journeyText: "स्थान चुनें, उससे जुड़ी नमूना पंक्तियाँ जाँचें और योजना की जानकारी अलग से पढ़ें।",
    journeySteps: ["स्थान चुनें", "पंक्तियाँ जाँचें", "योजना जानकारी पढ़ें"],
  },
  en: {
    eyebrow: "GUJARAT · OPEN DATA PREVIEW", title: "Yojana Drishti", subtitle: "Explore scheme rows present in the connected dataset, down to a village or city.",
    noticeTitle: "Important data note", notice: "These are synthetic demo rows. They do not represent real beneficiaries, eligibility, payments, or official scheme reach.",
    rows: "Sample rows", places: "Places represented", schemes: "Scheme codes", districts: "Districts", ref: "Dataset reference date",
    schemeTitle: "Sample rows by scheme", districtTitle: "Dataset rows by district", count: "rows", locations: "places", openMap: "Explore map", openSchemes: "Browse schemes",
    loading: "Loading dataset analytics…", error: "Dataset analytics are currently unavailable.", retry: "Retry", retryHint: "Check connectivity and reload the data.", source: "Source: connected location dataset · Counts are source sample records, not people.", viewAll: "Explore all districts on map",
    journeyKicker: "START HERE", journeyTitle: "How this workspace works", journeyText: "Choose a place, inspect its connected sample rows, then read scheme information separately.",
    journeySteps: ["Choose a place", "Inspect the rows", "Read scheme information"],
  },
} as const;

const number = (value: number, lang: AppLanguage) => new Intl.NumberFormat(lang === "gu" ? "gu-IN" : lang === "hi" ? "hi-IN" : "en-IN").format(value);

export function SpatialBentoDashboard({ lang, onNavigate }: SpatialBentoDashboardProps) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [failed, setFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const text = copy[lang];

  useEffect(() => {
    let active = true;
    fetch("/api/v1/analytics/overview", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("overview unavailable");
        return response.json() as Promise<Overview>;
      })
      .then((payload) => {
        if (!active) return;
        if (payload.status !== "success") throw new Error("overview unavailable");
        setOverview(payload);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [retryCount]);

  const handleRetry = () => {
    setFailed(false);
    setOverview(null);
    setRetryCount((c) => c + 1);
  };

  const topSchemes = useMemo(() => (overview?.data.schemes ?? []).slice().sort((a, b) => b.count - a.count), [overview]);
  const topDistricts = useMemo(() => (overview?.data.districts ?? []).slice(0, 8), [overview]);
  const maxScheme = Math.max(1, ...topSchemes.map((item) => item.count));
  const maxDistrict = Math.max(1, ...topDistricts.map((item) => item.sampleRows));

  return (
    <div className="data-dashboard">
      <motion.header className="data-dashboard-hero reveal" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div>
          <span className="data-dashboard-eyebrow"><MapPinned size={14} />{text.eyebrow}</span>
          <h1>{text.title}</h1>
          <p>{text.subtitle}</p>
        </div>
        <div className="data-dashboard-actions">
          <button type="button" className="data-action-primary" onClick={() => onNavigate("map")}><MapPinned size={16} />{text.openMap}<ArrowRight size={15} /></button>
          <button type="button" className="data-action-secondary" onClick={() => onNavigate("schemes")}>{text.openSchemes}<ArrowRight size={15} /></button>
        </div>
      </motion.header>



      <section className="data-purpose-strip reveal" aria-labelledby="workspace-flow-title">
        <div className="data-purpose-copy">
          <span>{text.journeyKicker}</span>
          <h2 id="workspace-flow-title">{text.journeyTitle}</h2>
          <p>{text.journeyText}</p>
        </div>
        <ol className="data-purpose-steps">
          {[
            { icon: MapPinned, label: text.journeySteps[0] },
            { icon: Database, label: text.journeySteps[1] },
            { icon: ShieldCheck, label: text.journeySteps[2] },
          ].map(({ icon: Icon, label }, index) => (
            <li key={label}>
              <span className="data-purpose-index">0{index + 1}</span>
              <span className="data-purpose-icon"><Icon size={17} /></span>
              <strong>{label}</strong>
            </li>
          ))}
        </ol>
      </section>

      {overview ? (
        <>
          <section className="data-kpi-grid" aria-label={text.title}>
            {[
              { label: text.rows, value: overview.meta.sourceRows, icon: Database },
              { label: text.places, value: overview.meta.locationCount, icon: MapPinned },
              { label: text.schemes, value: overview.meta.schemeCount, icon: BarChart3 },
              { label: text.districts, value: overview.meta.districtCount, icon: Building2 },
            ].map(({ label, value, icon: Icon }, index) => (
              <article className="data-kpi-card reveal" key={label} style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}>
                <span className="data-kpi-icon"><Icon size={18} /></span><small>{label}</small><strong>{number(value, lang)}</strong>
              </article>
            ))}
          </section>

          <section className="data-chart-grid">
            <article className="data-panel reveal">
              <div className="data-panel-heading"><div><span className="data-panel-kicker">10 · {text.schemes}</span><h2>{text.schemeTitle}</h2></div><BarChart3 size={19} /></div>
              <div className="data-bar-list">{topSchemes.map((scheme) => (
                <div className="data-bar-row" key={scheme.id}>
                  <div className="data-bar-label"><span>{lang === "gu" ? scheme.nameGu : localizeText(lang, scheme.nameEn)}</span><strong>{number(scheme.count, lang)}</strong></div>
                  <div className="data-bar-track"><span style={{ width: `${Math.max(2, (scheme.count / maxScheme) * 100)}%` }} /></div>
                </div>
              ))}</div>
            </article>
            <article className="data-panel reveal">
              <div className="data-panel-heading"><div><span className="data-panel-kicker">{overview.meta.districtCount} · {text.districts}</span><h2>{text.districtTitle}</h2></div><Building2 size={19} /></div>
              <div className="data-bar-list">{topDistricts.map((district) => (
                <div className="data-bar-row" key={district.districtCode}>
                  <div className="data-bar-label"><span>{lang === "gu" ? district.nameGu : localizeText(lang, district.nameEn)}</span><strong>{number(district.sampleRows, lang)} <small>{text.count}</small></strong></div>
                  <div className="data-bar-track"><span style={{ width: `${Math.max(2, (district.sampleRows / maxDistrict) * 100)}%` }} /></div>
                  <small className="data-row-meta">{number(district.locationCount, lang)} {text.locations}</small>
                </div>
              ))}</div>
            </article>
          </section>
          <footer className="data-dashboard-footer">
            <span>{text.source}</span>
            <span>{text.ref}: {overview.meta.referenceDate}</span>
            <button type="button" onClick={() => onNavigate("map")}>{text.viewAll}<ArrowRight size={14} /></button>
          </footer>
        </>
      ) : failed ? (
        <div className="data-panel" role="alert" style={{ textAlign: "center", padding: "40px 24px", margin: "16px 0" }}>
          <div style={{ display: "inline-flex", padding: 12, borderRadius: "50%", background: "rgba(239, 68, 68, 0.1)", color: "#EF4444", marginBottom: 12 }}>
            <AlertCircle size={28} />
          </div>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0 0 6px", color: "var(--holst-900, #223A5E)" }}>
            {text.error}
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--holst-500, #4D79A8)", margin: "0 0 16px" }}>
            {text.retryHint}
          </p>
          <button
            type="button"
            className="data-action-primary"
            onClick={handleRetry}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, margin: "0 auto", cursor: "pointer" }}
          >
            <RefreshCw size={15} />
            {text.retry}
          </button>
        </div>
      ) : (
        <div className="data-skeleton-wrapper" role="status" aria-label={text.loading}>
          <div className="data-kpi-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="data-kpi-card" style={{ opacity: 0.65 }}>
                <span className="data-kpi-icon" style={{ background: "rgba(110, 158, 204, 0.2)", width: 28, height: 28, borderRadius: 8, display: "inline-block" }} />
                <div style={{ height: 12, width: 80, background: "rgba(110, 158, 204, 0.2)", borderRadius: 4, margin: "8px 0 6px" }} />
                <div style={{ height: 22, width: 64, background: "rgba(110, 158, 204, 0.3)", borderRadius: 4 }} />
              </div>
            ))}
          </div>
          <div className="data-chart-grid" style={{ marginTop: 20 }}>
            {[1, 2].map((i) => (
              <div key={i} className="data-panel" style={{ minHeight: 220, opacity: 0.65 }}>
                <div style={{ height: 16, width: 140, background: "rgba(110, 158, 204, 0.2)", borderRadius: 4, marginBottom: 16 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} style={{ height: 24, background: "rgba(110, 158, 204, 0.15)", borderRadius: 6 }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", color: "var(--holst-500, #4D79A8)", fontSize: "0.85rem", marginTop: 14 }}>
            {text.loading}
          </p>
        </div>
      )}
    </div>
  );
}
