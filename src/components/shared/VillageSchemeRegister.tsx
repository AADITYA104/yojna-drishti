"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Database, Search, ShieldCheck, CheckCircle2, XCircle, HelpCircle, Download, Printer } from "lucide-react";
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
  gu: { title: "ગામના માહિતી સમૂહ રેકોર્ડ્સ", subtitle: "પસંદ કરેલા ગામ માટે માહિતી સમૂહમાં મળેલી દરેક યોજના હરોળ જુઓ.", demo: "કૃત્રિમ નમૂના ડેટા", warning: "આ રેકોર્ડ્સ સંપૂર્ણપણે કૃત્રિમ છે. તેઓ વાસ્તવિક લાભાર્થીઓ, યોજના અમલ, પાત્રતા અથવા ચુકવણીનો પુરાવો નથી.", rows: "કુલ પંક્તિઓ", schemes: "યોજના કોડ", search: "પંક્તિઓ શોધો…", all: "બધી યોજનાઓ", loading: "ગામના રેકોર્ડ્સ લોડ થાય છે…", empty: "આ સ્થળ માટે માહિતી સમૂહમાં પંક્તિઓ નથી.", error: "આ સ્થળના રેકોર્ડ્સ હમણાં મળી શક્યા નથી.", page: "પાનું", of: "માંથી", previous: "પાછલું", next: "આગળ", source: "સ્રોત: જોડાયેલ કૃત્રિમ માહિતી સમૂહ", date: "માહિતી સંદર્ભ", noDate: "તારીખ ઉપલબ્ધ નથી", reachTitle: "મહિલા કલ્યાણ યોજના પહોંચ (૫ મુખ્ય યોજનાઓ)", reached: "પહોંચેલ", notReached: "પહોંચેલ નથી", unknown: "માહિતી અપ્રાપ્ય", enrolled: "નોંધાયેલ", exportCsv: "CSV ડાઉનલોડ", printPdf: "PDF પ્રિન્ટ" },
  hi: { title: "गाँव के dataset records", subtitle: "चुने गए गाँव के लिए dataset में मिली प्रत्येक scheme row देखें।", demo: "कृत्रिम नमूना डेटा", warning: "ये records पूरी तरह synthetic हैं। ये वास्तविक लाभार्थी, योजना क्रियान्वयन, पात्रता या भुगतान का प्रमाण नहीं हैं।", rows: "कुल पंक्तियाँ", schemes: "योजना कोड", search: "पंक्तियाँ खोजें…", all: "सभी योजनाएँ", loading: "गाँव के records लोड हो रहे हैं…", empty: "इस स्थान के लिए dataset में कोई पंक्ति नहीं है।", error: "इस स्थान के dataset records अभी उपलब्ध नहीं हैं।", page: "पृष्ठ", of: "में से", previous: "पिछला", next: "अगला", source: "स्रोत: जुड़ा synthetic dataset", date: "Dataset संदर्भ", noDate: "तारीख उपलब्ध नहीं", reachTitle: "महिला कल्याण योजना पहुँच स्थिति (5 मुख्य योजनाएँ)", reached: "पहुँच स्थापित", notReached: "पहुँच नहीं", unknown: "जानकारी अप्राप्य", enrolled: "दर्ज", exportCsv: "CSV डाउनलोड", printPdf: "PDF प्रिंट" },
  en: { title: "Village dataset records", subtitle: "Inspect every scheme row found in the dataset for the selected village.", demo: "Synthetic sample data", warning: "These records are entirely synthetic. They are not evidence of real beneficiaries, scheme delivery, eligibility, or payments.", rows: "Total rows", schemes: "Scheme codes", search: "Search rows…", all: "All schemes", loading: "Loading village records…", empty: "No rows are present for this place in the dataset.", error: "Dataset records for this place could not be loaded.", page: "Page", of: "of", previous: "Previous", next: "Next", source: "Source: connected synthetic dataset", date: "Dataset reference", noDate: "Date unavailable", reachTitle: "Women Welfare Scheme Reach (5 Core Schemes)", reached: "Reached", notReached: "Not Reached", unknown: "Unknown / Not Surveyed", enrolled: "Enrolled", exportCsv: "Export CSV", printPdf: "Print PDF" },
} as const;

const humanizeFilename = (value: string) => value.replace(/^\d+_/, "").replace(/\.csv$/i, "").replaceAll("_", " ");
const number = (value: number, lang: AppLanguage) => new Intl.NumberFormat(lang === "gu" ? "gu-IN" : lang === "hi" ? "hi-IN" : "en-IN").format(value);

const CORE_WOMEN_SCHEMES = [
  { id: "S01", nameGu: "વ્હાલી દીકરી યોજના", nameEn: "Vahali Dikri Scheme" },
  { id: "S02", nameGu: "ગંગા સ્વરૂપા આર્થિક સહાય", nameEn: "Ganga Swarupa Economic Assistance" },
  { id: "S03", nameGu: "મહિલા સ્વાવલંબન યોજના", nameEn: "Mahila Swavalamban Yojana" },
  { id: "S04", nameGu: "મુખ્યમંત્રી માતૃશક્તિ યોજના", nameEn: "Mukhyamantri Matrushakti Yojana" },
  { id: "S05", nameGu: "ગંગા સ્વરૂપા પુનર્લગ્ન સહાય", nameEn: "Ganga Swarupa Punah Lagna Sahay" },
];

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
  const schemeCoverage = useMemo(() => {
    if (!rows || rows.length === 0) return [];
    return CORE_WOMEN_SCHEMES.map((scheme) => {
      const schemeRows = rows.filter((r) => r.Scheme_ID === scheme.id);
      if (schemeRows.length === 0) {
        return {
          ...scheme,
          status: "unknown" as const,
          count: null,
        };
      }
      const eligibleRows = schemeRows.filter((r) => {
        const elig = (r.Eligibility_Status || "").toLowerCase();
        const stat = (r.Application_or_Activity_Status || "").toLowerCase();
        return elig.includes("eligible") || elig.includes("પાત્ર") || stat.includes("approved") || stat.includes("મંજૂર") || stat.includes("complete");
      });
      if (eligibleRows.length === 0) {
        return {
          ...scheme,
          status: "not_reached" as const,
          count: 0,
        };
      }
      return {
        ...scheme,
        status: "reached" as const,
        count: eligibleRows.length,
      };
    });
  }, [rows]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const visibleRows = filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const place = language === "gu" ? villageNameGu : language === "hi" ? villageNameEn : villageNameEn;
  const district = language === "gu" ? districtNameGu : districtNameEn;
  const taluka = language === "gu" ? talukaNameGu : talukaNameEn;

  const handleExportCsv = () => {
    if (!rows || rows.length === 0) return;
    const headerLine = columns.join(",");
    const rowLines = rows.map((r) =>
      columns.map((col) => `"${String(r[col] || "").replace(/"/g, '""')}"`).join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headerLine, ...rowLines].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Yojana_Drishti_Village_${villageCode}_Schemes.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return <section className="vsa-card village-records" aria-labelledby="vsa-title">
    <header className="village-records-header">
      <div><span className="data-dashboard-eyebrow"><Database size={14} />{text.demo}</span><h2 id="vsa-title">{place || villageNameGu || villageCode}</h2>
        <p>{district} · {taluka} · LGD {villageCode}</p><p>{text.subtitle}</p>
      </div><div className="village-records-location"><strong>{text.schemes}: {number(schemes.length, language)}</strong><strong>{text.rows}: {number(rows.length, language)}</strong></div>
    </header>
    <aside className="data-integrity-note village-integrity" role="note"><ShieldCheck size={19} /><div><strong>{text.demo}</strong><p>{text.warning}</p></div></aside>

    {loading ? <div className="data-panel data-loading" role="status">{text.loading}</div> : payload?.status !== "success" ? <div className="village-record-empty" role="status"><AlertCircle size={20} />{payload?.status === "not_found" ? text.empty : text.error}</div> : <>
      <div className="village-reach-summary" style={{ margin: "16px 0 20px" }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 10px", color: "var(--holst-900, #223A5E)", display: "flex", alignItems: "center", gap: 6 }}>
          {text.reachTitle}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" }}>
          {schemeCoverage.map((sc) => {
            const isReached = sc.status === "reached";
            const isUnknown = sc.status === "unknown";
            const isNotReached = sc.status === "not_reached";

            return (
              <div
                key={sc.id}
                style={{
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: isUnknown
                    ? "1.5px dashed rgba(110, 158, 204, 0.45)"
                    : isReached
                    ? "1px solid rgba(46, 125, 82, 0.3)"
                    : "1px solid rgba(148, 163, 184, 0.35)",
                  background: isUnknown
                    ? "rgba(243, 248, 253, 0.5)"
                    : isReached
                    ? "rgba(46, 125, 82, 0.06)"
                    : "rgba(241, 245, 249, 0.7)",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--holst-500, #4D79A8)" }}>
                    {sc.id}
                  </span>
                  {isReached ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.72rem", fontWeight: 700, color: "#2E7D52" }}>
                      <CheckCircle2 size={13} />
                      {text.reached}
                    </span>
                  ) : isNotReached ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.72rem", fontWeight: 700, color: "#64748B" }}>
                      <XCircle size={13} />
                      {text.notReached}
                    </span>
                  ) : (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.72rem", fontWeight: 700, color: "var(--holst-500, #4D79A8)" }}>
                      <HelpCircle size={13} />
                      {text.unknown}
                    </span>
                  )}
                </div>
                <strong style={{ display: "block", fontSize: "0.82rem", color: "var(--holst-900, #223A5E)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {language === "gu" ? sc.nameGu : sc.nameEn}
                </strong>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: isReached ? "#2E7D52" : isUnknown ? "var(--holst-500, #4D79A8)" : "#64748B" }}>
                  {isUnknown ? "—" : `${number(sc.count ?? 0, language)} ${text.enrolled}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="village-records-controls" style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", flex: 1 }}>
          <label className="village-record-search"><Search size={16} /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(0); }} placeholder={text.search} /></label>
          <label className="village-record-filter"><span>{text.schemes}</span><select value={schemeFilter} onChange={(event) => { setSchemeFilter(event.target.value); setPage(0); }}><option value="all">{text.all}</option>{schemes.map((id) => <option key={id} value={id}>{id} · {humanizeFilename(payload.meta?.schemes?.[id] ?? id)}</option>)}</select></label>
        </div>
        <div style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={rows.length === 0}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "7px 12px",
              borderRadius: "8px",
              border: "1px solid var(--holst-200, #D0E1F2)",
              background: "#FFFFFF",
              color: "var(--holst-900, #223A5E)",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: rows.length === 0 ? "not-allowed" : "pointer",
              opacity: rows.length === 0 ? 0.5 : 1,
            }}
            title={text.exportCsv}
          >
            <Download size={14} />
            <span>{text.exportCsv}</span>
          </button>
          <button
            type="button"
            onClick={handlePrintPdf}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "7px 12px",
              borderRadius: "8px",
              border: "1px solid var(--holst-200, #D0E1F2)",
              background: "#FFFFFF",
              color: "var(--holst-900, #223A5E)",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
            title={text.printPdf}
          >
            <Printer size={14} />
            <span>{text.printPdf}</span>
          </button>
        </div>
      </div>
      <div className="village-record-table-wrap" role="region" aria-label={`${text.title} ${place ?? villageCode}`} tabIndex={0}><table className="village-record-table"><thead><tr>{columns.map((column) => <th key={column} scope="col">{column.replaceAll("_", " ")}</th>)}</tr></thead><tbody>
        {visibleRows.map((row, index) => <tr key={row.Record_ID || `${row.Scheme_ID}-${page * pageSize + index}`}>{columns.map((column) => <td key={column}>{row[column] || "—"}</td>)}</tr>)}
      </tbody></table></div>
      <footer className="village-records-footer"><span>{text.source} · {text.date}: {payload.meta?.referenceDate ?? text.noDate}</span><div><span>{text.page} {number(currentPage + 1, language)} {text.of} {number(pageCount, language)}</span><button type="button" disabled={currentPage <= 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>{text.previous}</button><button type="button" disabled={currentPage + 1 >= pageCount} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}>{text.next}</button></div></footer>
    </>}
  </section>;
}
