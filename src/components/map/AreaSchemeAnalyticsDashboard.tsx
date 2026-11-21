"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Activity, BarChart3, Building2, Info, Layers3, MapPin, ShieldAlert } from "lucide-react";
import { localizeText, type AppLanguage } from "@/lib/i18n";
import type { MapSelectedArea, MapSelectedLocation } from "./GujaratInteractiveMap";

type AreaPayload = {
  status: string;
  meta?: { classification: string; dataset: string; referenceDate: string; metricsNote: string };
  data?: {
    area: MapSelectedArea;
    locationCount: number;
    urbanCount?: number;
    ruralCount?: number;
    sampleRecordCount: number;
    urbanLocations?: Array<{
      code: string;
      nameEn: string;
      nameGu: string;
      talukaEn: string;
      talukaGu: string;
      sampleRows: number;
    }>;
    schemes: { id: string; nameEn: string; nameGu: string; sampleRows: number; locationsWithRows: number }[];
  };
};

const copy = {
  en: {
    loading: "Loading area sample analysis…", error: "Area analysis could not be loaded.",
    emptyTitle: "No linked sample locations", empty: "This administrative code has no linked settlement records in the supplied dataset, so no figures are estimated. For a city/town, select its populated city/town location code from the map or search.",
    demo: "Synthetic dataset sample · not official", title: "Area scheme sample analysis", district: "District", taluka: "Taluka",
    locations: "Settlements represented in sample", locationsHint: "Exact location codes included in the dataset",
    rows: "Synthetic sample rows", rowsHint: "Not people, applications, payments or services",
    schemes: "Schemes with sample rows", schemesHint: "Catalogue entries represented in the sample",
    chart: "Sample rows by scheme", source: "Dataset", reference: "Dataset reference date",
    scope: "Data scope", districtScope: "District-wide aggregate", talukaScope: "Taluka-wide aggregate", cityScope: "Whole city/town aggregate", scopeDetail: "All linked location codes inside this administrative area are included. This is a sample-row aggregate, not a count of people or scheme coverage.",
    noteTitle: "How to read these figures", note: "These are synthetic demonstration rows aggregated from the supplied dataset. A row under a scheme does not confirm that the scheme is available, active, funded, or used in this district or taluka. No real beneficiary or coverage totals are connected.",
    citiesTitle: "Cities and towns in this area:",
  },
  gu: {
    loading: "વિસ્તારના નમૂનાનું વિશ્લેષણ લોડ થાય છે…", error: "વિસ્તારનું વિશ્લેષણ લોડ થઈ શક્યું નથી.",
    emptyTitle: "જોડાયેલા નમૂના સ્થળો નથી", empty: "આ વહીવટી કોડ માટે આપેલા માહિતી સમૂહમાં કોઈ વસાહત જોડાયેલી નથી, તેથી કોઈ આંકડો દર્શાવેલ નથી. શહેર અથવા નગર માટે નકશા કે શોધમાંથી તેનો ચોક્કસ સ્થળ કોડ પસંદ કરો.",
    demo: "કૃત્રિમ માહિતીનો નમૂનો · સત્તાવાર નથી", title: "વિસ્તારવાર યોજના નમૂના વિશ્લેષણ", district: "જિલ્લો", taluka: "તાલુકો",
    locations: "નમૂનામાં દર્શાવેલાં ગામ અને શહેર", locationsHint: "માહિતી સમૂહમાં સમાવાયેલા ચોક્કસ સ્થળ કોડ",
    rows: "કૃત્રિમ નમૂના હરોળો", rowsHint: "વ્યક્તિ, અરજી, ચુકવણી કે સેવા નથી",
    schemes: "નમૂનામાં યોજનાઓ", schemesHint: "નમૂનામાં દર્શાવેલી યોજના સૂચિની એન્ટ્રીઓ",
    chart: "યોજનાવાર નમૂના હરોળો", source: "માહિતી સમૂહ", reference: "માહિતી સમૂહની સંદર્ભ તારીખ",
    scope: "માહિતી ક્ષેત્ર", districtScope: "આખા જિલ્લાનો સરવાળો", talukaScope: "આખા તાલુકાનો સરવાળો", cityScope: "આખા શહેર/નગરનો સરવાળો", scopeDetail: "આ વહીવટી વિસ્તારમાં જોડાયેલા બધા સ્થળ કોડનો સમાવેશ થાય છે. આ નમૂના હરોળોનો સરવાળો છે, વ્યક્તિઓ કે યોજના-પહોંચનો આંકડો નથી.",
    noteTitle: "આ આંકડા કેવી રીતે સમજવા", note: "આ આપેલા માહિતી સમૂહની કૃત્રિમ નમૂના હરોળોનો સરવાળો છે. કોઈ યોજના હેઠળ હરોળ હોવી એ યોજના આ જિલ્લામાં કે તાલુકામાં ઉપલબ્ધ, ચાલુ, ભંડોળવાળી અથવા વપરાયેલી હોવાનો પુરાવો નથી. વાસ્તવિક લાભાર્થી કે પહોંચના આંકડા જોડાયેલા નથી.",
    citiesTitle: "આ વિસ્તારમાં સમાવિષ્ટ મુખ્ય શહેરો / નગરો:",
  },
  hi: {
    loading: "क्षेत्र का नमूना विश्लेषण लोड हो रहा है…", error: "क्षेत्र का विश्लेषण लोड नहीं हो सका।",
    emptyTitle: "कोई जुड़ा हुआ sample location नहीं", empty: "इस प्रशासनिक code के लिए दिए गए dataset में कोई बस्ती record नहीं जुड़ा है, इसलिए कोई संख्या अनुमान से नहीं बनाई गई है। शहर/नगर के लिए नक्शे या खोज से उसका सटीक location code चुनें।",
    demo: "कृत्रिम डेटा नमूना · आधिकारिक नहीं", title: "क्षेत्रवार योजना नमूना विश्लेषण", district: "जिला", taluka: "तालुका",
    locations: "नमूने में शामिल गाँव/शहर", locationsHint: "डेटा संग्रह में शामिल सटीक स्थान कोड",
    rows: "कृत्रिम नमूना पंक्तियाँ", rowsHint: "लोग, आवेदन, भुगतान या सेवाएँ नहीं",
    schemes: "नमूने में योजनाएँ", schemesHint: "नमूने में मौजूद सूची प्रविष्टियाँ",
    chart: "योजनावार नमूना पंक्तियाँ", source: "डेटा संग्रह", reference: "डेटा संग्रह की संदर्भ तिथि",
    scope: "data scope", districtScope: "पूरे जिले का योग", talukaScope: "पूरे तालुका का योग", cityScope: "पूरे शहर/नगर का योग", scopeDetail: "इस प्रशासनिक क्षेत्र में जुड़े सभी location codes शामिल हैं। यह नमूना पंक्तियों का योग है, लोगों या योजना पहुँच की संख्या नहीं।",
    noteTitle: "इन आँकड़ों को कैसे समझें", note: "ये दिए गए डेटा संग्रह की कृत्रिम नमूना पंक्तियों का योग हैं। किसी योजना की पंक्ति यह साबित नहीं करती कि योजना इस जिले या तालुका में उपलब्ध, चालू, वित्तपोषित या उपयोग में है। वास्तविक लाभार्थी या पहुँच के आँकड़े जुड़े नहीं हैं।",
    citiesTitle: "इस क्षेत्र में शामिल प्रमुख शहर / नगर:",
  },
} as const;

function formatNumber(value: number, lang: AppLanguage) {
  return new Intl.NumberFormat(lang === "gu" ? "gu-IN" : lang === "hi" ? "hi-IN" : "en-IN").format(value);
}

function schemeName(scheme: { id: string; nameEn: string; nameGu: string }, lang: AppLanguage) {
  if (lang === "gu") return scheme.nameGu || scheme.nameEn;
  const hindi = localizeText("hi", scheme.nameEn);
  return lang === "hi" ? hindi : scheme.nameEn;
}

export function AreaSchemeAnalyticsDashboard({
  area,
  lang,
  onSelectLocation,
}: {
  area: MapSelectedArea;
  lang: AppLanguage;
  onSelectLocation?: (loc: MapSelectedLocation) => void;
}) {
  const t = copy[lang];
  const [payload, setPayload] = useState<AreaPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ districtCode: area.districtCode });
    if (area.subdistrictCode) query.set("subdistrictCode", area.subdistrictCode);
    fetch(`/api/v1/analytics/area?${query.toString()}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Area analytics unavailable");
        return response.json() as Promise<AreaPayload>;
      })
      .then(setPayload)
      .catch((reason: Error) => { if (reason.name !== "AbortError") setError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [area.districtCode, area.subdistrictCode]);

  const data = payload?.data;
  const displayArea = lang === "gu" ? area.areaNameGu || area.areaNameEn : lang === "hi" ? localizeText("hi", area.areaNameEn) : area.areaNameEn;
  const displayDistrict = lang === "gu" ? area.districtNameGu || area.districtNameEn : lang === "hi" ? localizeText("hi", area.districtNameEn) : area.districtNameEn;
  const schemeRows = data?.schemes || [];
  const maxRows = Math.max(1, ...schemeRows.map((scheme) => scheme.sampleRows));
  const levelLabel = area.level === "taluka" ? t.taluka : t.district;
  const isCityArea = area.level === "taluka" && /city|urban/i.test(area.areaNameEn);

  return <section className="location-analytics area-analytics" aria-labelledby="area-analytics-title" aria-live="polite">
    <AnimatePresence mode="wait">
      {loading ? <motion.div key="loading" className="location-state-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Activity size={18} />{t.loading}</motion.div>
        : error ? <motion.div key="error" className="location-state-card location-state-card--error" role="alert"><ShieldAlert size={20} />{t.error}</motion.div>
          : !data || !data.locationCount ? <motion.div key="empty" className="location-state-card location-state-card--empty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><MapPin size={20} /><div><h2>{t.emptyTitle}</h2><p>{t.empty}</p></div></motion.div>
            : <motion.div key={`${area.districtCode}-${area.subdistrictCode || "all"}`} className="location-analytics-content" initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.24 }}>
              <header className="location-analytics-header">
                <div className="location-analytics-title-wrap">
                  <span className="location-demo-badge"><span aria-hidden="true" />{t.demo}</span>
                  <h2 id="area-analytics-title">{displayArea} <span>{t.title}</span></h2>
                  <p className="location-breadcrumb"><MapPin size={15} />{levelLabel}: {displayArea} · {t.district}: {displayDistrict}{area.subdistrictCode ? ` · LGD ${area.subdistrictCode}` : ""}</p>
                </div>
              </header>

              <div className="area-data-scope" role="note">
                <span>{t.scope}</span>
                <strong>{isCityArea ? t.cityScope : area.level === "taluka" ? t.talukaScope : t.districtScope}</strong>
                <p>{t.scopeDetail}</p>
              </div>

              <div className="location-kpi-grid area-kpi-grid">
                {[
                  { icon: <MapPin size={18} />, label: t.locations, value: data.locationCount, hint: t.locationsHint },
                  { icon: <BarChart3 size={18} />, label: t.rows, value: data.sampleRecordCount, hint: t.rowsHint },
                  { icon: <Layers3 size={18} />, label: t.schemes, value: schemeRows.filter((scheme) => scheme.sampleRows > 0).length, hint: t.schemesHint },
                ].map((card, index) => <motion.article className="location-kpi-card" key={card.label} initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.22, delay: reducedMotion ? 0 : index * 0.04 }}>
                  <span className="location-kpi-icon">{card.icon}</span><span className="location-kpi-label">{card.label}</span><strong>{formatNumber(card.value, lang)}</strong><small>{card.hint}</small>
                </motion.article>)}
              </div>

              {data.urbanLocations && data.urbanLocations.length > 0 && (
                <article style={{ margin: "16px 0", padding: "16px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.8)", border: "1px solid #dbe3ee" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", fontWeight: 700, fontSize: "0.875rem", color: "#16385c" }}>
                    <Building2 size={16} />
                    <span>{t.citiesTitle} ({data.urbanLocations.length})</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {data.urbanLocations.map((u) => (
                      <button
                        key={u.code}
                        type="button"
                        onClick={() => {
                          onSelectLocation?.({
                            locationCode: u.code,
                            nameEn: u.nameEn,
                            nameGu: u.nameGu,
                            category: "Urban",
                            talukaCode: "",
                            talukaNameEn: u.talukaEn,
                            talukaNameGu: u.talukaGu,
                            districtCode: area.districtCode,
                            districtNameEn: area.districtNameEn,
                            districtNameGu: area.districtNameGu,
                          });
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "5px 12px",
                          borderRadius: "9999px",
                          border: "1px solid #cbd5e1",
                          background: "#ffffff",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          color: "#1e293b",
                          transition: "all 140ms ease",
                        }}
                      >
                        <span>{lang === "gu" && u.nameGu ? u.nameGu : u.nameEn}</span>
                        <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 400 }}>({formatNumber(u.sampleRows, lang)})</span>
                      </button>
                    ))}
                  </div>
                </article>
              )}

              <article className="location-chart-card area-scheme-chart">
                <div className="location-chart-heading"><div><h3>{t.chart}</h3><p>{t.rows}</p></div></div>
                <div className="location-bar-list" role="list">
                  {schemeRows.map((scheme, index) => <div className="location-bar-row" role="listitem" key={scheme.id}>
                    <div className="location-bar-label"><span>{scheme.id} · {schemeName(scheme, lang)}</span><strong>{formatNumber(scheme.sampleRows, lang)}</strong></div>
                    <div className="location-bar-track"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: Math.max(0.025, scheme.sampleRows / maxRows) }} transition={{ duration: reducedMotion ? 0 : 0.38, delay: reducedMotion ? 0 : index * 0.025, ease: "easeOut" }} /></div>
                    <small className="area-scheme-locations">{formatNumber(scheme.locationsWithRows, lang)} · {t.locations.toLocaleLowerCase(lang === "gu" ? "gu-IN" : lang === "hi" ? "hi-IN" : "en-IN")}</small>
                  </div>)}
                </div>
              </article>

              <footer className="location-analytics-footnote">
                <Info size={19} aria-hidden="true" />
                <div><strong>{t.noteTitle}</strong><p>{t.note}</p><small>{t.source}: {payload?.meta?.dataset} · {t.reference}: {payload?.meta?.referenceDate}</small></div>
              </footer>
            </motion.div>}
    </AnimatePresence>
  </section>;
}
