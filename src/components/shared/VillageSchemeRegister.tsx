"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Database, Search, ShieldCheck } from "lucide-react";
import type { AppLanguage } from "@/lib/i18n";

interface VillageSchemeRegisterProps {
  villageCode: string;
  villageNameGu?: string;
  villageNameEn?: string;
  talukaNameGu?: string;
  talukaNameEn?: string;
  districtNameGu?: string;
  districtNameEn?: string;
  gu: boolean;
  lang?: AppLanguage;
}

type DatasetResponse = {
  status: string;
  meta?: { classification: string; referenceDate?: string; rowCount: number; columns: string[]; schemes: Record<string, string> };
  data?: { columns: string[]; rows: Record<string, string>[] };
  message?: string;
};

const labels = {
  gu: { title: "ગામના dataset records", subtitle: "પસંદ કરેલા ગામ માટે datasetમાં મળેલી દરેક scheme row જુઓ.", demo: "કૃત્રિમ નમૂના ડેટા", warning: "આ records સંપૂર્ણપણે synthetic છે. તેઓ વાસ્તવિક લાભાર્થીઓ, યોજના અમલ, પાત્રતા અથવા ચુકવણીનો પુરાવો નથી.", rows: "કુલ પંક્તિઓ", schemes: "યોજના કોડ", search: "પંક્તિઓ શોધો…", all: "બધી યોજનાઓ", loading: "ગામના records લોડ થાય છે…", empty: "આ સ્થળ માટે datasetમાં પંક્તિઓ નથી.", error: "આ સ્થળના dataset records હમણાં મળી શક્યા નથી.", page: "પાનું", of: "માંથી", previous: "પાછલું", next: "આગળ", source: "સ્રોત: જોડાયેલ synthetic dataset", date: "Dataset સંદર્ભ", noDate: "તારીખ ઉપલબ્ધ નથી" },
  hi: { title: "गाँव के dataset records", subtitle: "चुने गए गाँव के लिए dataset में मिली प्रत्येक scheme row देखें।", demo: "कृत्रिम नमूना डेटा", warning: "ये records पूरी तरह synthetic हैं। ये वास्तविक लाभार्थी, योजना क्रियान्वयन, पात्रता या भुगतान का प्रमाण नहीं हैं।", rows: "कुल पंक्तियाँ", schemes: "योजना कोड", search: "पंक्तियाँ खोजें…", all: "सभी योजनाएँ", loading: "गाँव के records लोड हो रहे हैं…", empty: "इस स्थान के लिए dataset में कोई पंक्ति नहीं है।", error: "इस स्थान के dataset records अभी उपलब्ध नहीं हैं।", page: "पृष्ठ", of: "में से", previous: "पिछला", next: "अगला", source: "स्रोत: जुड़ा synthetic dataset", date: "Dataset संदर्भ", noDate: "तारीख उपलब्ध नहीं" },
  en: { title: "Village dataset records", subtitle: "Inspect every scheme row found in the dataset for the selected village.", demo: "Synthetic sample data", warning: "These records are entirely synthetic. They are not evidence of real beneficiaries, scheme delivery, eligibility, or payments.", rows: "Total rows", schemes: "Scheme codes", search: "Search rows…", all: "All schemes", loading: "Loading village records…", empty: "No rows are present for this place in the dataset.", error: "Dataset records for this place could not be loaded.", page: "Page", of: "of", previous: "Previous", next: "Next", source: "Source: connected synthetic dataset", date: "Dataset reference", noDate: "Date unavailable" },
} as const;

const humanizeFilename = (value: string) => value.replace(/^\d+_/, "").replace(/\.csv$/i, "").replaceAll("_", " ");
const number = (value: number, lang: AppLanguage) => new Intl.NumberFormat(lang === "gu" ? "gu-IN" : lang === "hi" ? "hi-IN" : "en-IN").format(value);

export function VillageSchemeRegister({ villageCode, villageNameGu, villageNameEn, talukaNameGu = "", talukaNameEn = "", districtNameGu = "", districtNameEn = "", gu, lang }: VillageSchemeRegisterProps) {
  const language = lang ?? (gu ? "gu" : "en");
  const text = labels[language];
  const [result, setResult] = useState<{ locationCode: string; payload: DatasetResponse } | null>(null);
  const [search, setSearch] = useState("");
  const [schemeFilter, setSchemeFilter] = useState("all");
  const [page, setPage] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/v1/analytics/location/records?locationCode=${encodeURIComponent(villageCode)}`, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (response.status === 404) return { status: "not_found" } as DatasetResponse;
        if (!response.ok) throw new Error("dataset unavailable");
        return response.json() as Promise<DatasetResponse>;
      })
      .then((payload) => { if (!controller.signal.aborted) setResult({ locationCode: villageCode, payload }); })
      .catch((error: Error) => { if (error.name !== "AbortError" && !controller.signal.aborted) setResult({ locationCode: villageCode, payload: { status: "unavailable" } }); });
    return () => controller.abort();
  }, [villageCode]);

  const loading = result?.locationCode !== villageCode;
  const payload = loading ? null : result.payload;
  const columns = payload?.data?.columns ?? [];
  const rows = useMemo(() => payload?.data?.rows ?? [], [payload]);
  const schemes = useMemo(() => [...new Set(rows.map((row) => row.Scheme_ID).filter(Boolean))].sort(), [rows]);
  const filtered = useMemo(() => rows.filter((row) => {
    if (schemeFilter !== "all" && row.Scheme_ID !== schemeFilter) return false;
    const query = search.trim().toLocaleLowerCase();
    return !query || Object.values(row).some((value) => String(value).toLocaleLowerCase().includes(query));
  }), [rows, schemeFilter, search]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const visibleRows = filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const place = language === "gu" ? villageNameGu : language === "hi" ? villageNameEn : villageNameEn;
  const district = language === "gu" ? districtNameGu : districtNameEn;
  const taluka = language === "gu" ? talukaNameGu : talukaNameEn;

  return <section className="vsa-card village-records" aria-labelledby="vsa-title">
    <header className="village-records-header">
      <div><span className="data-dashboard-eyebrow"><Database size={14} />{text.demo}</span><h2 id="vsa-title">{place || villageNameGu || villageCode}</h2>
        <p>{district} · {taluka} · LGD {villageCode}</p><p>{text.subtitle}</p>
      </div><div className="village-records-location"><strong>{text.schemes}: {number(schemes.length, language)}</strong><strong>{text.rows}: {number(rows.length, language)}</strong></div>
    </header>
    <aside className="data-integrity-note village-integrity" role="note"><ShieldCheck size={19} /><div><strong>{text.demo}</strong><p>{text.warning}</p></div></aside>

    {loading ? <div className="data-panel data-loading" role="status">{text.loading}</div> : payload?.status !== "success" ? <div className="village-record-empty" role="status"><AlertCircle size={20} />{payload?.status === "not_found" ? text.empty : text.error}</div> : <>
      <div className="village-records-controls">
        <label className="village-record-search"><Search size={16} /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(0); }} placeholder={text.search} /></label>
        <label className="village-record-filter"><span>{text.schemes}</span><select value={schemeFilter} onChange={(event) => { setSchemeFilter(event.target.value); setPage(0); }}><option value="all">{text.all}</option>{schemes.map((id) => <option key={id} value={id}>{id} · {humanizeFilename(payload.meta?.schemes?.[id] ?? id)}</option>)}</select></label>
      </div>
      <div className="village-record-table-wrap" role="region" aria-label={`${text.title} ${place ?? villageCode}`} tabIndex={0}><table className="village-record-table"><thead><tr>{columns.map((column) => <th key={column} scope="col">{column.replaceAll("_", " ")}</th>)}</tr></thead><tbody>
        {visibleRows.map((row, index) => <tr key={row.Record_ID || `${row.Scheme_ID}-${page * pageSize + index}`}>{columns.map((column) => <td key={column}>{row[column] || "—"}</td>)}</tr>)}
      </tbody></table></div>
      <footer className="village-records-footer"><span>{text.source} · {text.date}: {payload.meta?.referenceDate ?? text.noDate}</span><div><span>{text.page} {number(currentPage + 1, language)} {text.of} {number(pageCount, language)}</span><button type="button" disabled={currentPage <= 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>{text.previous}</button><button type="button" disabled={currentPage + 1 >= pageCount} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}>{text.next}</button></div></footer>
    </>}
  </section>;
}
