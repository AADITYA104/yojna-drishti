"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { BarChart3, CalendarDays, Database, FileSpreadsheet, Info, Layers3, ShieldCheck } from "lucide-react";
import type { AppLanguage } from "@/lib/i18n";

interface BeneficiaryAnalyticsViewProps { gu: boolean; lang: AppLanguage; fy: string }
type Group = Record<string, number>;
type Overview = {
  status: string;
  meta: { sourceRows: number; locationCount: number; schemeCount: number; districtCount: number; referenceDate: string; classification: string };
  data: { demographics: { ageBands: Group; gender: Group; eligibility: Group; activity: Group; documents: Group } };
};

const text = {
  gu: {
    eyebrow: "માહિતી ગુણવત્તા · નમૂનો",
    title: "માહિતી સમૂહનું બંધારણ અને વર્ગીકરણ",
    desc: "આ પૃષ્ઠ સ્રોત હરોળોમાં કયા ખાનાઓ અને વર્ગો છે તે સમજાવે છે. ગામ સુધી યોજના પહોંચ જાણવા માટે નકશા પર સ્થાન પસંદ કરો; આ પૃષ્ઠ વાસ્તવિક લાભાર્થી પરિણામ દર્શાવતું નથી.",
    note: "દરેક ગણતરી કૃત્રિમ નમૂના હરોળ પર આધારિત છે. આથી પાત્રતા, મંજૂરી, પ્રવૃત્તિ અથવા દસ્તાવેજ વર્ગીકરણને સરકારી નિર્ણય માનવા નહીં.",
    fields: "સ્રોત ક્ષેત્રો",
    dimensions: "વર્ગીકરણ પરિમાણો",
    mode: "માહિતી સ્થિતિ",
    synthetic: "કૃત્રિમ નમૂનો",
    age: "નોંધાયેલ વયજૂથ",
    gender: "નોંધાયેલ લિંગ શ્રેણી",
    eligibility: "નમૂના પાત્રતા વર્ગો",
    activity: "નમૂના પ્રવૃત્તિ વર્ગો",
    documents: "નમૂના દસ્તાવેજ વર્ગો",
    loading: "માહિતી વિશ્લેષણ લોડ થાય છે…",
    error: "માહિતી વિશ્લેષણ ઉપલબ્ધ નથી.",
    share: "હરોળોનો હિસ્સો",
    rowsLabel: "હરોળો",
    date: "સંદર્ભ તારીખ",
    source: "સ્રોત: જોડાયેલ કૃત્રિમ માહિતી સમૂહ; સત્તાવાર વહીવટી આંકડા નહીં."
  },
  hi: { eyebrow: "डेटासेट गुणवत्ता · नमूना", title: "Dataset संरचना और labels", desc: "यह पृष्ठ बताता है कि source rows में कौन-से fields और labels हैं। गाँव तक योजना पहुँच देखने के लिए नक्शे पर स्थान चुनें; यह पृष्ठ वास्तविक लाभार्थी परिणाम नहीं दिखाता।", note: "हर गणना synthetic sample row पर है। eligibility, approval, activity या document labels को सरकारी निर्णय न मानें।", fields: "source fields", dimensions: "classification dimensions", mode: "data mode", synthetic: "synthetic sample", age: "Dataset में दर्ज आयु वर्ग", gender: "Dataset में दर्ज लिंग श्रेणी", eligibility: "Demo पात्रता labels", activity: "Demo गतिविधि labels", documents: "Demo दस्तावेज़ labels", loading: "Dataset विश्लेषण लोड हो रहा है…", error: "Dataset विश्लेषण उपलब्ध नहीं है।", share: "पंक्तियों का हिस्सा", rowsLabel: "पंक्तियाँ", date: "Dataset संदर्भ तिथि", source: "स्रोत: जुड़ा synthetic dataset; आधिकारिक प्रशासनिक आँकड़े नहीं।" },
  en: { eyebrow: "DATA QUALITY · SAMPLE", title: "Dataset structure and labels", desc: "This page explains the fields and labels in the source rows. Select a place on the map to explore scheme rows down to village level; this page does not report real beneficiary outcomes.", note: "Every calculation is based on a synthetic sample row. Do not treat eligibility, approval, activity, or document labels as government decisions.", fields: "Source fields", dimensions: "Classification dimensions", mode: "Data mode", synthetic: "Synthetic sample", age: "Age bands in dataset", gender: "Gender categories in dataset", eligibility: "Demo eligibility labels", activity: "Demo activity labels", documents: "Demo document labels", loading: "Loading dataset analytics…", error: "Dataset analytics are unavailable.", share: "Share of rows", rowsLabel: "rows", date: "Dataset reference date", source: "Source: connected synthetic dataset; not official administrative figures." },
} as const;

const keyLabels: Record<AppLanguage, Record<string, string>> = {
  gu: { under18: "18 વર્ષથી ઓછી", "18to29": "18–29 વર્ષ", "30to44": "30–44 વર્ષ", "45to59": "45–59 વર્ષ", "60plus": "60+ વર્ષ", unknown: "અજ્ઞાત", female: "સ્ત્રી", male: "પુરુષ", community: "સમુદાય", eligible: "પાત્ર (નમૂનો)", notEligible: "અપાત્ર (નમૂનો)", review: "સમીક્ષા જરૂરી", potential: "સંભવિત", notApplicable: "લાગુ નથી", approved: "મંજૂર (નમૂનો)", rejected: "નામંજૂર (નમૂનો)", documentsPending: "દસ્તાવેજ બાકી", pending: "બાકી", notApplied: "અરજી નથી", serviceDelivered: "સેવા પૂર્ણ", activityRecorded: "પ્રવૃત્તિ નોંધાયેલ", complete: "સંપૂર્ણ", activityLog: "પ્રવૃત્તિ નોંધ" },
  hi: { under18: "18 वर्ष से कम", "18to29": "18–29 वर्ष", "30to44": "30–44 वर्ष", "45to59": "45–59 वर्ष", "60plus": "60+ वर्ष", unknown: "अज्ञात", female: "महिला", male: "पुरुष", community: "समुदाय", eligible: "पात्र (demo label)", notEligible: "अपात्र (demo label)", review: "समीक्षा आवश्यक", potential: "संभावित", notApplicable: "लागू नहीं", approved: "स्वीकृत label", rejected: "अस्वीकृत label", documentsPending: "दस्तावेज़ लंबित", pending: "लंबित", notApplied: "आवेदन नहीं", serviceDelivered: "सेवा label", activityRecorded: "गतिविधि दर्ज", complete: "पूर्ण label", activityLog: "गतिविधि लॉग" },
  en: { under18: "Under 18", "18to29": "18–29 years", "30to44": "30–44 years", "45to59": "45–59 years", "60plus": "60+ years", unknown: "Unknown", female: "Female", male: "Male", community: "Community", eligible: "Eligible (demo label)", notEligible: "Not eligible (demo label)", review: "Review required", potential: "Potential", notApplicable: "Not applicable", approved: "Approved label", rejected: "Rejected label", documentsPending: "Documents pending", pending: "Pending", notApplied: "Not applied", serviceDelivered: "Service label", activityRecorded: "Activity recorded", complete: "Complete label", activityLog: "Activity log" },
};

const format = (value: number, lang: AppLanguage) => new Intl.NumberFormat(lang === "gu" ? "gu-IN" : lang === "hi" ? "hi-IN" : "en-IN").format(value);

export function BeneficiaryAnalyticsView({ lang }: BeneficiaryAnalyticsViewProps) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [failed, setFailed] = useState(false);
  const labels = text[lang];
  const kpis = overview ? [
    { label: labels.fields, value: "39", icon: FileSpreadsheet },
    { label: labels.dimensions, value: "5", icon: Layers3 },
    { label: labels.mode, value: labels.synthetic, icon: ShieldCheck },
    { label: labels.date, value: overview.meta.referenceDate, icon: CalendarDays },
  ] : [];
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/v1/analytics/overview", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => { if (!response.ok) throw new Error("analytics unavailable"); return response.json() as Promise<Overview>; })
      .then((payload) => { if (payload.status !== "success") throw new Error("analytics unavailable"); setOverview(payload); })
      .catch((error: Error) => { if (error.name !== "AbortError") setFailed(true); });
    return () => controller.abort();
  }, []);

  const groups = useMemo(() => {
    if (!overview) return [];
    return [
      [labels.age, overview.data.demographics.ageBands],
      [labels.gender, overview.data.demographics.gender],
      [labels.eligibility, overview.data.demographics.eligibility],
      [labels.activity, overview.data.demographics.activity],
      [labels.documents, overview.data.demographics.documents],
    ] as Array<[string, Group]>;
  }, [labels, overview]);

  return <div className="data-dashboard analytics-dashboard">
    <header className="data-dashboard-hero reveal"><div><span className="data-dashboard-eyebrow"><BarChart3 size={14} />{labels.eyebrow}</span><h1>{labels.title}</h1><p>{labels.desc}</p></div></header>
    <aside className="data-integrity-note reveal" role="note"><Info size={20} /><div><strong>{lang === "gu" ? "આંકડાનો યોગ્ય અર્થ સમજો" : lang === "hi" ? "आँकड़ों का सही अर्थ समझें" : "Read these counts in context"}</strong><p>{labels.note}</p></div></aside>
    {overview ? <>
      <section className="data-kpi-grid analytics-kpis">
        {kpis.map(({ label, value, icon: Icon }, index) => <article className="data-kpi-card reveal data-quality-kpi" key={label} style={{ "--reveal-delay": `${index * 60}ms` } as CSSProperties}><span className="data-kpi-icon"><Icon size={18} /></span><small>{label}</small><strong>{typeof value === "number" ? format(value, lang) : value}</strong></article>)}
      </section>
      <div className="data-chart-grid analytics-group-grid">{groups.map(([title, group]) => {
        const total = Object.values(group).reduce((sum, value) => sum + value, 0);
        return <section className="data-panel analytics-group-panel reveal" key={title}><div className="data-panel-heading"><h2>{title}</h2><span>{format(total, lang)} {labels.rowsLabel}</span></div>
          <p className="analytics-denominator">{labels.share}: {format(total, lang)} {labels.rowsLabel}</p>
          <div className="data-bar-list">{Object.entries(group).sort((a, b) => b[1] - a[1]).map(([key, value]) => <div className="data-bar-row" key={key}><div className="data-bar-label"><span>{keyLabels[lang][key] ?? key}</span><strong>{format(value, lang)} <small>· {total ? `${((value / total) * 100).toFixed(1)}%` : "0%"}</small></strong></div><div className="data-bar-track"><span style={{ width: `${total ? Math.max(1, (value / total) * 100) : 0}%` }} /></div></div>)}</div>
        </section>;
      })}</div>
      <footer className="data-dashboard-footer"><span>{labels.source}</span><span>{labels.date}: {overview.meta.referenceDate}</span></footer>
    </> : <div className="data-panel data-loading" role={failed ? "alert" : "status"}>{failed ? labels.error : labels.loading}</div>}
  </div>;
}
