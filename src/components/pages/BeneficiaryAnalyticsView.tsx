"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { BarChart3, Database, Info, MapPinned, ShieldCheck } from "lucide-react";
import type { AppLanguage } from "@/lib/i18n";

interface BeneficiaryAnalyticsViewProps { gu: boolean; lang: AppLanguage; fy: string }
type Group = Record<string, number>;
type Overview = {
  status: string;
  meta: { sourceRows: number; locationCount: number; schemeCount: number; districtCount: number; referenceDate: string; classification: string };
  data: { demographics: { ageBands: Group; gender: Group; eligibility: Group; activity: Group; documents: Group } };
};

const text = {
  gu: { eyebrow: "નમૂના પંક્તિ વિશ્લેષણ", title: "ડેટાસેટ વર્ગીકરણ", desc: "આ પેજ datasetના sample recordsમાં રહેલા વર્ગીકરણોનું સારાંશ આપે છે. આ લાભાર્થી વસ્તી કે સત્તાવાર યોજના પરિણામ નથી.", note: "સત્તાવાર વસ્તી, DBT કે આવરણના આંકડા જોડાયેલા નથી. દરેક ગણતરી scheme-wise sample rows પર છે; એક જ કલ્પિત record અલગ schemeમાં હોય તો અલગ ગણાય છે.", rows: "કુલ sample rows", places: "સ્થળો", schemes: "યોજનાઓ", districts: "જિલ્લા", age: "Datasetમાં નોંધાયેલ વયજૂથ", gender: "Datasetમાં નોંધાયેલ લિંગ શ્રેણી", eligibility: "Demo eligibility labels", activity: "Demo activity labels", documents: "Demo document labels", loading: "Dataset વિશ્લેષણ લોડ થાય છે…", error: "Dataset વિશ્લેષણ ઉપલબ્ધ નથી.", share: "પંક્તિઓનો હિસ્સો", rowsLabel: "પંક્તિઓ", date: "Dataset સંદર્ભ તારીખ", source: "સ્રોત: જોડાયેલ synthetic dataset; સત્તાવાર વહીવટી આંકડા નહીં." },
  hi: { eyebrow: "नमूना पंक्ति विश्लेषण", title: "Dataset वर्गीकरण", desc: "यह पृष्ठ dataset के sample records में मौजूद वर्गीकरणों का सार देता है। यह लाभार्थी जनसंख्या या आधिकारिक योजना परिणाम नहीं है।", note: "आधिकारिक जनसंख्या, DBT या कवरेज आँकड़े जुड़े नहीं हैं। प्रत्येक गणना scheme-wise sample rows पर है; एक ही काल्पनिक record अलग schemes में अलग गिना जा सकता है।", rows: "कुल sample rows", places: "स्थान", schemes: "योजनाएँ", districts: "जिले", age: "Dataset में दर्ज आयु वर्ग", gender: "Dataset में दर्ज लिंग श्रेणी", eligibility: "Demo पात्रता labels", activity: "Demo गतिविधि labels", documents: "Demo दस्तावेज़ labels", loading: "Dataset विश्लेषण लोड हो रहा है…", error: "Dataset विश्लेषण उपलब्ध नहीं है।", share: "पंक्तियों का हिस्सा", rowsLabel: "पंक्तियाँ", date: "Dataset संदर्भ तिथि", source: "स्रोत: जुड़ा synthetic dataset; आधिकारिक प्रशासनिक आँकड़े नहीं।" },
  en: { eyebrow: "SAMPLE ROW ANALYTICS", title: "Dataset classifications", desc: "This page summarizes classifications in the dataset sample records. It is not a beneficiary population or official scheme outcome report.", note: "Official population, DBT, and coverage figures are not connected. Counts are scheme-wise sample rows; the same fictional record can appear separately under different schemes.", rows: "Total sample rows", places: "Places", schemes: "Schemes", districts: "Districts", age: "Age bands in dataset", gender: "Gender categories in dataset", eligibility: "Demo eligibility labels", activity: "Demo activity labels", documents: "Demo document labels", loading: "Loading dataset analytics…", error: "Dataset analytics are unavailable.", share: "Share of rows", rowsLabel: "rows", date: "Dataset reference date", source: "Source: connected synthetic dataset; not official administrative figures." },
} as const;

const keyLabels: Record<AppLanguage, Record<string, string>> = {
  gu: { under18: "18 વર્ષથી ઓછી", "18to29": "18–29 વર્ષ", "30to44": "30–44 વર્ષ", "45to59": "45–59 વર્ષ", "60plus": "60+ વર્ષ", unknown: "અજ્ઞાત", female: "સ્ત્રી", male: "પુરુષ", community: "સમુદાય", eligible: "પાત્ર (demo label)", notEligible: "પાત્ર નહીં (demo label)", review: "સમીક્ષા જરૂરી", potential: "સંભવિત", notApplicable: "લાગુ નથી", approved: "મંજૂર label", rejected: "નામંજૂર label", documentsPending: "દસ્તાવેજ બાકી", pending: "બાકી", notApplied: "અરજી નથી", serviceDelivered: "સેવા label", activityRecorded: "પ્રવૃત્તિ નોંધાયેલ", complete: "પૂર્ણ label", activityLog: "પ્રવૃત્તિ નોંધ" },
  hi: { under18: "18 वर्ष से कम", "18to29": "18–29 वर्ष", "30to44": "30–44 वर्ष", "45to59": "45–59 वर्ष", "60plus": "60+ वर्ष", unknown: "अज्ञात", female: "महिला", male: "पुरुष", community: "समुदाय", eligible: "पात्र (demo label)", notEligible: "अपात्र (demo label)", review: "समीक्षा आवश्यक", potential: "संभावित", notApplicable: "लागू नहीं", approved: "स्वीकृत label", rejected: "अस्वीकृत label", documentsPending: "दस्तावेज़ लंबित", pending: "लंबित", notApplied: "आवेदन नहीं", serviceDelivered: "सेवा label", activityRecorded: "गतिविधि दर्ज", complete: "पूर्ण label", activityLog: "गतिविधि लॉग" },
  en: { under18: "Under 18", "18to29": "18–29 years", "30to44": "30–44 years", "45to59": "45–59 years", "60plus": "60+ years", unknown: "Unknown", female: "Female", male: "Male", community: "Community", eligible: "Eligible (demo label)", notEligible: "Not eligible (demo label)", review: "Review required", potential: "Potential", notApplicable: "Not applicable", approved: "Approved label", rejected: "Rejected label", documentsPending: "Documents pending", pending: "Pending", notApplied: "Not applied", serviceDelivered: "Service label", activityRecorded: "Activity recorded", complete: "Complete label", activityLog: "Activity log" },
};

const format = (value: number, lang: AppLanguage) => new Intl.NumberFormat(lang === "gu" ? "gu-IN" : lang === "hi" ? "hi-IN" : "en-IN").format(value);

export function BeneficiaryAnalyticsView({ lang }: BeneficiaryAnalyticsViewProps) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [failed, setFailed] = useState(false);
  const labels = text[lang];
  const kpis = overview ? [
    { label: labels.rows, value: overview.meta.sourceRows, icon: Database },
    { label: labels.places, value: overview.meta.locationCount, icon: MapPinned },
    { label: labels.schemes, value: overview.meta.schemeCount, icon: BarChart3 },
    { label: labels.districts, value: overview.meta.districtCount, icon: MapPinned },
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
        {kpis.map(({ label, value, icon: Icon }, index) => <article className="data-kpi-card reveal" key={label} style={{ "--reveal-delay": `${index * 60}ms` } as CSSProperties}><span className="data-kpi-icon"><Icon size={18} /></span><small>{label}</small><strong>{format(value, lang)}</strong></article>)}
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
