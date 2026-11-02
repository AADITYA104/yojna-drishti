"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Users,
  Wallet,
  ShieldCheck,
  Eye,
  Download,
  Printer,
} from "lucide-react";
import {
  demoDistricts,
  demoTalukas,
  demoVillages,
  demoSchemes,
} from "@/lib/demo-data";
import { scaleDemoValue } from "@/lib/metrics.mjs";

function scaleDemoAmount(value: number, fy: string) {
  const factor = fy === "2024–25" ? 0.88 : fy === "2023–24" ? 0.75 : 1;
  return Number((value * factor).toFixed(1));
}

interface ReportsCenterViewProps {
  gu: boolean;
  fy: string;
}

export function ReportsCenterView({ gu, fy }: ReportsCenterViewProps) {
  const [reportType, setReportType] = useState<"districts" | "talukas" | "villages" | "schemes">("districts");
  const [search, setSearch] = useState("");

  const fmt = (num: number) => new Intl.NumberFormat(gu ? "gu-IN" : "en-IN").format(num);

  const filteredDistricts = useMemo(() => {
    return demoDistricts.filter(
      (d) =>
        `${d.officialNo} ${d.name} ${d.gu} ${d.region}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const filteredTalukas = useMemo(() => {
    return demoTalukas.filter(
      (t) => `${t.name} ${t.gu} ${t.code}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const filteredVillages = useMemo(() => {
    return demoVillages.filter(
      (v) => `${v.name} ${v.gu} ${v.code} ${v.venue}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const filteredSchemes = useMemo(() => {
    return demoSchemes.filter(
      (s) => `${s.id} ${s.name} ${s.gu} ${s.category}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const reportRows = useMemo(() => {
    if (reportType === "districts") return {
      headers: ["District code", "District", "Area km2", "Region", "Talukas", "Villages", "Beneficiaries demo", "Applications demo", "Disbursed Cr demo"],
      rows: filteredDistricts.map((d) => [d.officialNo, gu ? d.gu : d.name, d.areaKm2, gu ? d.regionGu : d.region, d.talukaCount, d.villageCount, scaleDemoValue(d.beneficiaries, fy), scaleDemoValue(d.applications, fy), scaleDemoAmount(d.disbursed, fy)]),
    };
    if (reportType === "talukas") return {
      headers: ["Taluka code", "Taluka", "Villages", "Population demo", "Beneficiaries demo", "Applications demo", "Approved demo", "Disbursed Cr demo"],
      rows: filteredTalukas.map((t) => [t.code, gu ? t.gu : t.name, t.villageCount, t.population, scaleDemoValue(t.beneficiaries, fy), scaleDemoValue(t.applications, fy), scaleDemoValue(t.approved, fy), scaleDemoAmount(t.disbursed, fy)]),
    };
    if (reportType === "villages") return {
      headers: ["Village code", "Village", "Programme venue", "Households demo", "Population demo", "Anganwadi count", "Beneficiaries demo", "Disbursed lakh demo"],
      rows: filteredVillages.map((v) => [v.code, gu ? v.gu : v.name, gu ? v.venueGu : v.venue, v.households, v.population, v.anganwadiCount, scaleDemoValue(v.totalBeneficiaries, fy), scaleDemoAmount(v.disbursedLakhs, fy)]),
    };
    return {
      headers: ["Scheme ID", "Scheme", "Category", "Department", "Launch year", "Beneficiaries demo", "Budget allocated Cr demo", "Disbursed Cr demo"],
      rows: filteredSchemes.map((s) => [s.id, gu ? s.gu : s.name, gu ? s.categoryGu : s.category, gu ? s.departmentGu : s.department, s.launchYear, scaleDemoValue(s.beneficiariesStatewide, fy), scaleDemoValue(s.budgetAllocatedCr, fy), scaleDemoValue(s.budgetDisbursedCr, fy)]),
    };
  }, [filteredDistricts, filteredSchemes, filteredTalukas, filteredVillages, fy, gu, reportType]);

  const exportCsv = () => {
    const safeCell = (value: string | number) => {
      const text = String(value);
      const safe = /^[=+@\-]/.test(text) ? `'${text}` : text;
      return `"${safe.replaceAll('"', '""')}"`;
    };
    const csv = [
      ["Yojana Drishti", "DEMO DATA", `FY ${fy}`],
      reportRows.headers,
      ...reportRows.rows,
    ].map((row) => row.map(safeCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `yojana-drishti-${reportType}-demo-${fy.replace(/–/g, "-")}.csv`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="reports-center-page">
      {/* Page Hero */}
      <div className="page-hero-gov">
        <div>
          <span className="hero-kicker-tag">
            {gu ? "ડેમો અહેવાલ પૂર્વદર્શન" : "DEMO REPORT PREVIEW"}
          </span>
          <h1>{gu ? "અહેવાલો અને આંકડા નિકાસ" : "Reports & Data Export"}</h1>
          <p>
            {gu
              ? "પસંદ કરેલા report અને search filter પ્રમાણે aggregate demo data CSVમાં લો અથવા print dialogથી PDF બનાવો."
              : "Export the selected aggregate demo report as CSV or use the print dialog to save it as PDF."}
          </p>
        </div>

        <div className="reports-export-actions">
          <button className="btn-secondary-gov" onClick={() => window.print()} aria-label={gu ? "અહેવાલની PDF બનાવવા print કરો" : "Print or save report as PDF"}>
            <Printer size={15} /> {gu ? "PDF / Print" : "PDF / Print"}
          </button>
          <button className="btn-primary-gov" onClick={exportCsv} disabled={reportRows.rows.length === 0}>
            <Download size={15} /> {gu ? "CSV ડાઉનલોડ" : "Download CSV"}
          </button>
        </div>
      </div>

      {/* Security Governance Notice */}
      <div className="data-security-alert-bar">
        <ShieldCheck size={18} className="text-teal" />
        <div>
          <strong>{gu ? "ડેટા ગવર્નન્સ અને ગોપનીયતા સુરક્ષા:" : "Data Governance & Privacy Security:"}</strong>{" "}
          <span>
            {gu
              ? "આ નિકાસમાં માત્ર આ પ્રોજેક્ટના synthetic demo aggregate છે; આંકડા સત્તાવાર સરકારી રેકોર્ડ નથી અને વ્યક્તિગત વિગતો સામેલ નથી."
              : "Exports contain only this project's synthetic demo aggregates. They are not official government records and include no individual beneficiary details."}
          </span>
        </div>
      </div>

      {/* Report Type Selector Pills */}
      <div className="report-type-bar">
        {[
          { key: "districts" as const, en: "1. Districts (34)", gu: "૧. જિલ્લા (૩૪)" },
          { key: "talukas" as const, en: "2. Talukas (sample)", gu: "૨. તાલુકા (નમૂનો)" },
          { key: "villages" as const, en: "3. Villages (sample)", gu: "૩. ગામો (નમૂનો)" },
          { key: "schemes" as const, en: "4. Scheme catalogue", gu: "૪. યોજના સૂચિ" },
        ].map((t) => (
          <button
            key={t.key}
            className={`report-tab-pill ${reportType === t.key ? "active" : ""}`}
            onClick={() => setReportType(t.key)}
          >
            {gu ? t.gu : t.en}
          </button>
        ))}
      </div>

      {/* Table Filter Controls */}
      <div className="table-filter-strip">
        <label className="search-box-gov" style={{ flex: 1 }}>
          <Search size={15} />
          <input
            type="search"
            placeholder={gu ? "અહેવાલમાં સર્ચ કરો..." : "Search inside report table..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
          <span className="badge-pill">
          <Eye size={13} />
          <span>{gu ? "ડેમો ડેટા · FY " + fy : "Demo data · FY " + fy}</span>
        </span>
      </div>

      {/* Report tables use the same filter rows as the downloadable CSV. */}
      <div className="report-table-wrapper card-gov">
        {reportRows.rows.length === 0 && (
          <div className="data-validation-error" role="status">{gu ? "આ શોધ સાથે કોઈ રેકોર્ડ મળ્યો નથી." : "No records match this search."}</div>
        )}
        {reportType === "districts" && (
          <table className="gov-data-table">
            <thead>
              <tr>
                <th>{gu ? "નંબર" : "No."}</th>
                <th>{gu ? "જિલ્લો" : "District"}</th>
                <th>{gu ? "વિસ્તાર" : "Area"}</th>
                <th>{gu ? "વિસ્તાર (Region)" : "Region"}</th>
                <th>{gu ? "તાલુકા" : "Talukas"}</th>
                <th>{gu ? "ગામડાં" : "Villages"}</th>
                <th>{gu ? "લાભાર્થી" : "Beneficiaries"}</th>
                <th>{gu ? "અરજીઓ" : "Applications"}</th>
                <th>{gu ? "ચૂકવણી" : "Disbursed"}</th>
              </tr>
            </thead>
            <tbody>
              {filteredDistricts.map((d) => (
                <tr key={d.officialNo}>
                  <td><b>[{d.officialNo}]</b></td>
                  <td>
                    <strong>{gu ? d.gu : d.name}</strong>
                  </td>
                  <td>{fmt(d.areaKm2)} km²</td>
                  <td>{gu ? d.regionGu : d.region}</td>
                  <td>{d.talukaCount}</td>
                  <td>{fmt(d.villageCount)}</td>
                  <td><b>{fmt(scaleDemoValue(d.beneficiaries, fy))}</b></td>
                  <td>{fmt(scaleDemoValue(d.applications, fy))}</td>
                  <td className="text-teal"><b>₹{fmt(scaleDemoAmount(d.disbursed, fy))} Cr</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reportType === "talukas" && (
          <table className="gov-data-table">
            <thead>
              <tr>
                <th>{gu ? "તાલુકો" : "Taluka"}</th>
                <th>{gu ? "કોડ" : "Code"}</th>
                <th>{gu ? "ગામો" : "Villages"}</th>
                <th>{gu ? "વસ્તી" : "Population"}</th>
                <th>{gu ? "લાભાર્થી" : "Beneficiaries"}</th>
                <th>{gu ? "અરજીઓ" : "Applications"}</th>
                <th>{gu ? "મંજૂર" : "Approved"}</th>
                <th>{gu ? "ચૂકવણી" : "Disbursed"}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTalukas.map((t) => (
                <tr key={t.id}>
                  <td><strong>{gu ? t.gu : t.name}</strong></td>
                  <td><code>{t.code}</code></td>
                  <td>{t.villageCount}</td>
                  <td>{fmt(t.population)}</td>
                  <td><b>{fmt(scaleDemoValue(t.beneficiaries, fy))}</b></td>
                  <td>{fmt(scaleDemoValue(t.applications, fy))}</td>
                  <td>{fmt(scaleDemoValue(t.approved, fy))}</td>
                  <td className="text-teal"><b>₹{fmt(scaleDemoAmount(t.disbursed, fy))} Cr</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reportType === "villages" && (
          <table className="gov-data-table">
            <thead>
              <tr>
                <th>{gu ? "ગામનું નામ" : "Village"}</th>
                <th>{gu ? "LGD કોડ" : "LGD Code"}</th>
                <th>{gu ? "કાર્યક્રમ સ્થળ / શાળા" : "Programme Venue"}</th>
                <th>{gu ? "ઘર" : "Households"}</th>
                <th>{gu ? "વસ્તી" : "Population"}</th>
                <th>{gu ? "આંગણવાડી" : "Anganwadi"}</th>
                <th>{gu ? "લાભાર્થી" : "Beneficiaries"}</th>
                <th>{gu ? "ગામ ગ્રાન્ટ" : "Disbursed"}</th>
              </tr>
            </thead>
            <tbody>
              {filteredVillages.map((v) => (
                <tr key={v.id}>
                  <td><strong>{gu ? v.gu : v.name}</strong></td>
                  <td><code>{v.code}</code></td>
                  <td>{gu ? v.venueGu : v.venue}</td>
                  <td>{v.households}</td>
                  <td>{fmt(v.population)}</td>
                  <td>{v.anganwadiCount}</td>
                  <td><b>{fmt(scaleDemoValue(v.totalBeneficiaries, fy))}</b></td>
                  <td className="text-teal"><b>₹{fmt(scaleDemoAmount(v.disbursedLakhs, fy))} Lakh</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reportType === "schemes" && (
          <table className="gov-data-table">
            <thead>
              <tr>
                <th>{gu ? "કોડ" : "Scheme ID"}</th>
                <th>{gu ? "યોજનાનું નામ" : "Scheme Name"}</th>
                <th>{gu ? "કેટેગરી" : "Category"}</th>
                <th>{gu ? "વિભાગ" : "Department"}</th>
                <th>{gu ? "શરૂઆત" : "Launched"}</th>
                <th>{gu ? "રાજ્ય લાભાર્થી" : "Statewide Beneficiaries"}</th>
                <th>{gu ? "બજેટ ફાળવણી" : "Allocated"}</th>
                <th>{gu ? "વિતરણ" : "Disbursed"}</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchemes.map((s) => (
                <tr key={s.id}>
                  <td><code>{s.id}</code></td>
                  <td>
                    <strong>{gu ? s.gu : s.name}</strong>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{gu ? s.targetGroupGu : s.targetGroup}</div>
                  </td>
                  <td><span className="badge-pill">{gu ? s.categoryGu : s.category}</span></td>
                  <td>{gu ? s.departmentGu : s.department}</td>
                  <td>{s.launchYear}</td>
                  <td><b>{fmt(scaleDemoValue(s.beneficiariesStatewide, fy))}</b></td>
                  <td>₹{fmt(scaleDemoValue(s.budgetAllocatedCr, fy))} Cr</td>
                  <td className="text-teal"><b>₹{fmt(scaleDemoValue(s.budgetDisbursedCr, fy))} Cr</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
