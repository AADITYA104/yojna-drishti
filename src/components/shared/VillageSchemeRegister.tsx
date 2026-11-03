"use client";

import React, { useState, useMemo } from "react";
import {
  Building2,
  Users,
  Wallet,
  CheckCircle2,
  Search,
  Filter,
  FileText,
  School,
  Download,
  ShieldCheck,
  Clock,
  AlertCircle,
  Award,
  ChevronRight,
  MapPin,
  ExternalLink,
} from "lucide-react";
import {
  getVillageBeneficiaryRegister,
  type VillageBeneficiaryRecord,
} from "@/lib/village-beneficiary-registry";
import {
  getVillageSchemes,
  getVillageSchemeSummary,
  type VillageSchemeAssignment,
} from "@/lib/village-scheme-demo";
import { GHOGHA_48_VILLAGES, MASTER_DISTRICTS } from "@/lib/master-hierarchy";

interface VillageSchemeRegisterProps {
  villageCode: string;
  fy?: string;
  villageNameGu?: string;
  villageNameEn?: string;
  talukaNameGu?: string;
  talukaNameEn?: string;
  districtNameGu?: string;
  districtNameEn?: string;
  gu: boolean;
  onSelectScheme?: (schemeId: string) => void;
}

export function VillageSchemeRegister({
  villageCode,
  villageNameGu,
  villageNameEn,
  talukaNameGu = "ઘોઘા",
  talukaNameEn = "Ghogha",
  districtNameGu = "ભાવનગર",
  districtNameEn = "Bhavnagar",
  gu,
  fy,
  onSelectScheme,
}: VillageSchemeRegisterProps) {
  const [activeTab, setActiveTab] = useState<"schemes" | "beneficiaries" | "gap">("schemes");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "in_progress" | "pending_docs">("all");
  const [selectedSchemeFilter, setSelectedSchemeFilter] = useState<string>("all");

  // Lookup village in Ghogha master if available
  const matchedGhoghaVillage = useMemo(() => {
    return GHOGHA_48_VILLAGES.find((v) => v.code === villageCode);
  }, [villageCode]);

  const vNameGu = villageNameGu || matchedGhoghaVillage?.nameGu || "નવાનગર";
  const vNameEn = villageNameEn || matchedGhoghaVillage?.nameEn || "Nawanagar";
  const venue = matchedGhoghaVillage?.venueGu || "પ્રાથમિક શાળા અને આંગણવાડી કેન્દ્ર";
  const venueEn = (matchedGhoghaVillage as any)?.venueEn || (matchedGhoghaVillage as any)?.venue || "Primary School & Anganwadi Center";
  const population = matchedGhoghaVillage?.population || 1840;
  const femalePopulation = matchedGhoghaVillage?.femalePopulation || 912;
  const anganwadiCount = (matchedGhoghaVillage as any)?.anganwadis || (matchedGhoghaVillage as any)?.anganwadiCount || 3;

  // Schemes & Summary
  const schemeSummary = useMemo(() => {
    return getVillageSchemeSummary(villageCode);
  }, [villageCode]);

  // Beneficiary Registry
  const allBeneficiaries = useMemo(() => {
    return getVillageBeneficiaryRegister(villageCode);
  }, [villageCode]);

  // Filtered Beneficiaries
  const filteredBeneficiaries = useMemo(() => {
    return allBeneficiaries.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (selectedSchemeFilter !== "all" && b.schemeId !== selectedSchemeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = b.nameGu.toLowerCase().includes(q) || b.nameEn.toLowerCase().includes(q);
        const matchesScheme = b.schemeNameGu.toLowerCase().includes(q) || b.schemeNameEn.toLowerCase().includes(q);
        const matchesId = b.id.toLowerCase().includes(q) || b.utrNumber.toLowerCase().includes(q);
        if (!matchesName && !matchesScheme && !matchesId) return false;
      }
      return true;
    });
  }, [allBeneficiaries, statusFilter, selectedSchemeFilter, searchQuery]);

  const approvedCount = allBeneficiaries.filter((b) => b.status === "approved").length;
  const inProgressCount = allBeneficiaries.filter((b) => b.status === "in_progress").length;
  const pendingDocsCount = allBeneficiaries.filter((b) => b.status === "pending_docs").length;

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Age", "Scheme", "Category", "Status", "Account", "UTR", "Disbursed_Date"];
    const rows = filteredBeneficiaries.map((b) => [
      b.id,
      b.nameGu,
      b.age,
      b.schemeNameGu,
      b.categoryGu,
      b.statusGu,
      b.dbtAccount,
      b.utrNumber,
      b.disbursedDate,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `village_schemes_${villageCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="village-scheme-register-card">
      {/* 1. Grand Official Village Banner */}
      <div className="vsr-header-strip">
        <div className="vsr-title-left">
          <div className="vsr-tag-line">
            <span className="vsr-lgd-pill">LGD: {villageCode}</span>
            <span className="vsr-geo-crumb">
              <MapPin size={13} className="text-teal inline mr-1" />
              {gu
                ? `${districtNameGu} જિલ્લો · ${talukaNameGu} તાલુકો`
                : `${districtNameEn} District · ${talukaNameEn} Taluka`}
            </span>
          </div>

          <h2 className="vsr-village-name">
            {gu ? `ગામ: ${vNameGu}` : `Village: ${vNameEn}`}
            {vNameGu !== vNameEn && (
              <span className="vsr-name-alt">({gu ? vNameEn : vNameGu})</span>
            )}
          </h2>

          <div className="vsr-demographics-strip">
            <span>
              <Users size={14} className="text-slate-500 inline mr-1" />
              {gu ? `કુલ વસ્તી: ${population.toLocaleString("gu-IN")}` : `Population: ${population}`}
            </span>
            <span className="vsr-dot-sep">·</span>
            <span>
              {gu ? `મહિલા વસ્તી: ${femalePopulation.toLocaleString("gu-IN")}` : `Female: ${femalePopulation}`}
            </span>
            <span className="vsr-dot-sep">·</span>
            <span>
              <School size={14} className="text-sky inline mr-1" />
              {gu ? `આંગણવાડી: ${anganwadiCount} કેન્દ્રો` : `Anganwadis: ${anganwadiCount}`}
            </span>
            <span className="vsr-dot-sep">·</span>
            <span className="vsr-venue-text" title={gu ? venue : venueEn}>
              {gu ? `કેન્દ્ર: ${venue}` : `Venue: ${venueEn}`}
            </span>
          </div>
        </div>

        <div className="vsr-header-right">
          <button type="button" className="btn-vsr-export" onClick={handleExportCSV}>
            <Download size={14} />
            <span>{gu ? "રજિસ્ટર ડાઉનલોડ (CSV)" : "Export CSV"}</span>
          </button>
        </div>
      </div>

      {/* 2. Four Grand Grassroots KPI Cards */}
      <div className="vsr-kpi-quad">
        <div className="vsr-kpi-card tone-emerald">
          <div className="vkc-icon">
            <Award size={20} />
          </div>
          <div className="vkc-meta">
            <small>{gu ? "ગામમાં સક્રિય યોજનાઓ" : "Active Schemes Reached"}</small>
            <strong>{schemeSummary.totalSchemesReached} {gu ? "મુખ્ય યોજનાઓ" : "Schemes"}</strong>
          </div>
        </div>

        <div className="vsr-kpi-card tone-sky">
          <div className="vkc-icon">
            <Users size={20} />
          </div>
          <div className="vkc-meta">
            <small>{gu ? "કુલ નોંધાયેલ લાભાર્થીઓ" : "Beneficiaries Benefited"}</small>
            <strong>{schemeSummary.totalBeneficiaries.toLocaleString(gu ? "gu-IN" : "en-IN")} {gu ? "બહેનો & બાળકો" : "Citizens"}</strong>
          </div>
        </div>

        <div className="vsr-kpi-card tone-amber">
          <div className="vkc-icon">
            <Wallet size={20} />
          </div>
          <div className="vkc-meta">
            <small>{gu ? "જમીની સ્તર ચુકવાયેલ DBT" : "Public Spending Disbursed"}</small>
            <strong>₹ {schemeSummary.totalGrantLakhs} {gu ? "લાખ ફાળવેલ" : "Lakh Disbursed"}</strong>
          </div>
        </div>

        <div className="vsr-kpi-card tone-purple">
          <div className="vkc-icon">
            <CheckCircle2 size={20} />
          </div>
          <div className="vkc-meta">
            <small>{gu ? "યોજના સંતૃપ્તિ દર (Saturation)" : "Village Saturation Rate"}</small>
            <div className="vkc-sat-row">
              <strong>{schemeSummary.overallSaturation}%</strong>
              <div className="vkc-sat-bar">
                <span style={{ width: `${schemeSummary.overallSaturation}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Deep-Dive Section Tabs */}
      <div className="vsr-tabs-bar">
        <button
          type="button"
          className={`vsr-tab-btn ${activeTab === "schemes" ? "active" : ""}`}
          onClick={() => setActiveTab("schemes")}
        >
          <Award size={15} />
          <span>{gu ? "૧. ગામમાં ચાલતી યોજનાઓ અને ફાળવણી" : "1. Schemes Delivered & Allocation"}</span>
          <span className="vsr-tab-count">{schemeSummary.schemes.length}</span>
        </button>

        <button
          type="button"
          className={`vsr-tab-btn ${activeTab === "beneficiaries" ? "active" : ""}`}
          onClick={() => setActiveTab("beneficiaries")}
        >
          <FileText size={15} />
          <span>{gu ? "૨. ગામનું અધિકૃત લાભાર્થી રજિસ્ટર (નામવાર વિગત)" : "2. Beneficiary Transparency Register (Names)"}</span>
          <span className="vsr-tab-count">{allBeneficiaries.length}</span>
        </button>

        <button
          type="button"
          className={`vsr-tab-btn ${activeTab === "gap" ? "active" : ""}`}
          onClick={() => setActiveTab("gap")}
        >
          <AlertCircle size={15} />
          <span>{gu ? "૩. બાકી રહેલ લાભાર્થીઓ & ચકાસણી" : "3. Pending Verifications & Inclusion Gap"}</span>
          <span className="vsr-tab-count">{inProgressCount + pendingDocsCount}</span>
        </button>
      </div>

      {/* TAB 1: SCHEME DELIVERY DETAILS */}
      {activeTab === "schemes" && (
        <div className="vsr-schemes-deck">
          <div className="vsr-section-intro">
            <div>
              <h3>{gu ? "આ ગામમાં પહોંચેલી સરકારી કલ્યાણકારી યોજનાઓ" : "Government Welfare Schemes Delivered to this Village"}</h3>
              <p>
                {gu
                  ? "દરેક યોજના માટે ગામ દીઠ ફાળવેલ બજેટ, વાસ્તવિક ચૂકવણી, લાભાર્થી સંખ્યા અને સંતૃપ્તિ સ્તર નીચે મુજબ છે:"
                  : "Detailed breakdown of budget disbursement, citizen coverage, and saturation percentage for each scheme."}
              </p>
            </div>
          </div>

          <div className="vsr-schemes-grid">
            {schemeSummary.schemes.map((scheme) => (
              <div key={scheme.schemeId} className="vsr-scheme-card">
                <div className="vsc-top">
                  <div>
                    <span className="vsc-code">{scheme.schemeId}</span>
                    <h4 className="vsc-title">{gu ? scheme.schemeNameGu : scheme.schemeNameEn}</h4>
                  </div>
                  <span className={`vsc-status-pill ${scheme.status}`}>
                    {scheme.status === "completed"
                      ? gu ? "સંપૂર્ણ પહોંચ" : "Fully Delivered"
                      : gu ? "પ્રગતિ હેઠળ" : "Under Delivery"}
                  </span>
                </div>

                <div className="vsc-metrics-row">
                  <div className="vsc-metric-unit">
                    <small>{gu ? "લાભાર્થી સંખ્યા" : "Beneficiaries"}</small>
                    <strong>{scheme.beneficiaries.toLocaleString(gu ? "gu-IN" : "en-IN")} {gu ? "નાગરિકો" : ""}</strong>
                  </div>
                  <div className="vsc-metric-unit">
                    <small>{gu ? "ચુકવેલ સહાય (DBT)" : "Disbursed"}</small>
                    <strong className="text-teal">₹ {scheme.grantLakhs} {gu ? "લાખ" : "Lakh"}</strong>
                  </div>
                  <div className="vsc-metric-unit">
                    <small>{gu ? "સંતૃપ્તિ (Saturation)" : "Saturation"}</small>
                    <strong>{scheme.saturationPct}%</strong>
                  </div>
                </div>

                <div className="vsc-progress-wrap">
                  <div className="vsc-bar-bg">
                    <div
                      className="vsc-bar-fill"
                      style={{
                        width: `${scheme.saturationPct}%`,
                        background: scheme.saturationPct >= 90 ? "#059669" : "#0284c7",
                      }}
                    />
                  </div>
                </div>

                <div className="vsc-footer-actions">
                  <button
                    type="button"
                    className="btn-vsc-filter-beneficiaries"
                    onClick={() => {
                      setSelectedSchemeFilter(scheme.schemeId);
                      setActiveTab("beneficiaries");
                    }}
                  >
                    <span>{gu ? "આ યોજનાના લાભાર્થીઓની યાદી જુઓ" : "View Beneficiaries Roster"}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: GRANULAR NAME-BY-NAME BENEFICIARY REGISTER */}
      {activeTab === "beneficiaries" && (
        <div className="vsr-beneficiaries-deck">
          <div className="vsr-beneficiary-controls-bar">
            {/* Search Input */}
            <label className="vsr-ben-search-box">
              <Search size={15} />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  gu
                    ? "લાભાર્થીનું નામ, UTR નંબર અથવા યોજના શોધો..."
                    : "Search by beneficiary name, UTR number, or scheme..."
                }
                aria-label="Search beneficiaries"
              />
            </label>

            {/* Scheme Filter */}
            <div className="vsr-select-wrap">
              <Filter size={14} />
              <select
                value={selectedSchemeFilter}
                onChange={(e) => setSelectedSchemeFilter(e.target.value)}
                aria-label="Filter by scheme"
              >
                <option value="all">{gu ? "તમામ યોજનાઓ" : "All Schemes"}</option>
                {schemeSummary.schemes.map((s) => (
                  <option key={s.schemeId} value={s.schemeId}>
                    {gu ? s.schemeNameGu : s.schemeNameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Pills */}
            <div className="vsr-status-filter-pills">
              <button
                type="button"
                className={`vsr-pill-btn ${statusFilter === "all" ? "active" : ""}`}
                onClick={() => setStatusFilter("all")}
              >
                {gu ? "તમામ" : "All"} ({allBeneficiaries.length})
              </button>
              <button
                type="button"
                className={`vsr-pill-btn pill-approved ${statusFilter === "approved" ? "active" : ""}`}
                onClick={() => setStatusFilter("approved")}
              >
                {gu ? "મંજૂર & DBT જમા" : "Approved"} ({approvedCount})
              </button>
              <button
                type="button"
                className={`vsr-pill-btn pill-progress ${statusFilter === "in_progress" ? "active" : ""}`}
                onClick={() => setStatusFilter("in_progress")}
              >
                {gu ? "ચકાસણી હેઠળ" : "In Progress"} ({inProgressCount})
              </button>
              <button
                type="button"
                className={`vsr-pill-btn pill-pending ${statusFilter === "pending_docs" ? "active" : ""}`}
                onClick={() => setStatusFilter("pending_docs")}
              >
                {gu ? "દાખલો બાકી" : "Pending Docs"} ({pendingDocsCount})
              </button>
            </div>
          </div>

          {/* Transparent Government Beneficiary Data Table */}
          <div className="vsr-table-container">
            <table className="vsr-data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{gu ? "લાભાર્થીનું નામ" : "Beneficiary Name"}</th>
                  <th>{gu ? "યોજનાનું નામ" : "Scheme"}</th>
                  <th>{gu ? "લાભાર્થી શ્રેણી" : "Category"}</th>
                  <th>{gu ? "અરજી સ્થિતિ" : "Status"}</th>
                  <th>{gu ? "સહાય રકમ (DBT)" : "Benefit Amount"}</th>
                  <th>{gu ? "બેંક ખાતું & UTR" : "Bank & UTR"}</th>
                  <th>{gu ? "આંગણવાડી / કચેરી" : "Center / Verification"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredBeneficiaries.length > 0 ? (
                  filteredBeneficiaries.map((b, idx) => (
                    <tr key={b.id} className={`row-status-${b.status}`}>
                      <td className="col-idx">{idx + 1}</td>
                      <td className="col-name">
                        <div className="ben-name-block">
                          <strong>{gu ? b.nameGu : b.nameEn}</strong>
                          <small className="ben-sub-meta">
                            {b.id} · {b.age} {gu ? "વર્ષ" : "yrs"}
                          </small>
                        </div>
                      </td>
                      <td className="col-scheme">
                        <div className="ben-scheme-tag">
                          <span>{gu ? b.schemeNameGu : b.schemeNameEn}</span>
                        </div>
                      </td>
                      <td className="col-category">
                        <span className="ben-cat-badge">{gu ? b.categoryGu : b.categoryEn}</span>
                      </td>
                      <td className="col-status">
                        <span className={`ben-status-badge badge-${b.status}`}>
                          {b.status === "approved" ? (
                            <CheckCircle2 size={12} className="inline mr-1" />
                          ) : (
                            <Clock size={12} className="inline mr-1" />
                          )}
                          {gu ? b.statusGu : b.statusEn}
                        </span>
                      </td>
                      <td className="col-amount">
                        <strong className="text-teal">{b.benefitAmountGu}</strong>
                      </td>
                      <td className="col-bank">
                        <div className="ben-bank-block">
                          <span className="ben-ac">{b.dbtAccount}</span>
                          <span className="ben-utr">{b.utrNumber}</span>
                        </div>
                      </td>
                      <td className="col-center">
                        <div className="ben-center-block">
                          <small className="ben-center-name">{b.anganwadiCenterGu}</small>
                          <small className="ben-remarks">{gu ? b.remarksGu : b.remarksEn}</small>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="vsr-table-empty">
                      {gu
                        ? "પસંદ કરેલા ફિલ્ટરમાં કોઈ લાભાર્થી મળ્યા નથી."
                        : "No beneficiaries found matching current search and filters."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INCLUSION GAP & PENDING VERIFICATIONS */}
      {activeTab === "gap" && (
        <div className="vsr-gap-deck">
          <div className="vsr-section-intro">
            <div>
              <h3>{gu ? "ગામમાં બાકી રહેલ અરજીઓ અને દસ્તાવેજ પૂર્તતા" : "Pending Verifications & Citizen Inclusion Gap"}</h3>
              <p>
                {gu
                  ? "જે નાગરિકોની અરજી કચેરી સ્તરે ચકાસણી હેઠળ છે અથવા આવકનો દાખલો/આધાર સીડિંગ બાકી છે તેની વિગત:"
                  : "List of citizens with pending documentation or departmental verifications to achieve 100% saturation."}
              </p>
            </div>
          </div>

          <div className="vsr-gap-list">
            {allBeneficiaries
              .filter((b) => b.status !== "approved")
              .map((b) => (
                <div key={b.id} className="vsr-gap-item-card">
                  <div className="vgic-left">
                    <span className={`vgic-status-tag tag-${b.status}`}>
                      <AlertCircle size={14} className="inline mr-1" />
                      {gu ? b.statusGu : b.statusEn}
                    </span>
                    <h4>{gu ? b.nameGu : b.nameEn} ({b.age} {gu ? "વર્ષ" : "yrs"})</h4>
                    <p className="vgic-scheme-line">
                      <b>{gu ? "યોજના:" : "Scheme:"}</b> {gu ? b.schemeNameGu : b.schemeNameEn} · {b.benefitAmountGu}
                    </p>
                    <p className="vgic-action-needed">
                      <b>{gu ? "જરૂરી કાર્યવાહી:" : "Required Action:"}</b> {gu ? b.remarksGu : b.remarksEn}
                    </p>
                  </div>

                  <div className="vgic-right">
                    <span className="vgic-contact-center">
                      <School size={13} className="inline mr-1 text-slate-500" />
                      {b.anganwadiCenterGu}
                    </span>
                    <button
                      type="button"
                      className="btn-vgic-remind"
                      onClick={() => alert(gu ? `અરજદાર ${b.nameGu} ને SMS/સૂચના મોકલાઈ છે.` : `Notification dispatched for ${b.nameEn}.`)}
                    >
                      {gu ? "સુચના મોકલો (SMS / તલાટી)" : "Notify / Expedite"}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </section>
  );
}
