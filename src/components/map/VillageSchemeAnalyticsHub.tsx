"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Users,
  Wallet,
  Building2,
  MapPin,
  Download,
  X,
  ChevronDown,
  TrendingUp,
  Landmark,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MASTER_DISTRICTS,
  getSubdistrictsForDistrict,
} from "@/lib/master-hierarchy";
import {
  ALL_GHOGHA_ENHANCED_VILLAGES,
  getVillagesForSubdistrict,
  searchVillagesAcrossGujarat,
  type EnhancedVillageRecord,
} from "@/lib/village-scheme-intelligence";

interface VillageSchemeAnalyticsHubProps {
  gu: boolean;
  fy?: string;
  selectedDistrictId: string;
  onDistrictChange?: (districtId: string) => void;
}

export function VillageSchemeAnalyticsHub({
  gu,
  fy = "2025–26",
  selectedDistrictId,
  onDistrictChange,
}: VillageSchemeAnalyticsHubProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTalukaCode, setActiveTalukaCode] = useState<number | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [selectedVillageForModal, setSelectedVillageForModal] = useState<EnhancedVillageRecord | null>(null);
  const [rosterSearch, setRosterSearch] = useState("");
  const [activeModalTab, setActiveModalTab] = useState<"roster" | "schemes">("roster");

  const fmt = (num: number) => new Intl.NumberFormat(gu ? "gu-IN" : "en-IN").format(num);

  // Available talukas for the currently selected district
  const districtTalukas = useMemo(() => {
    return getSubdistrictsForDistrict(selectedDistrictId);
  }, [selectedDistrictId]);

  // Current district metadata
  const currentDistrict = useMemo(() => {
    return MASTER_DISTRICTS.find((d) => d.id === selectedDistrictId) || MASTER_DISTRICTS[0];
  }, [selectedDistrictId]);

  // Load and filter villages based on district, taluka, category, and search query
  const displayedVillages = useMemo(() => {
    let pool: EnhancedVillageRecord[] = [];

    if (searchQuery.trim().length > 0) {
      pool = searchVillagesAcrossGujarat(searchQuery, selectedDistrictId);
    } else {
      if (selectedDistrictId === "bhavnagar") {
        if (activeTalukaCode === "all" || activeTalukaCode === 3855) {
          pool = ALL_GHOGHA_ENHANCED_VILLAGES;
        } else {
          pool = getVillagesForSubdistrict(Number(activeTalukaCode), selectedDistrictId);
        }
      } else {
        if (activeTalukaCode !== "all") {
          pool = getVillagesForSubdistrict(Number(activeTalukaCode), selectedDistrictId);
        } else if (districtTalukas.length > 0) {
          pool = getVillagesForSubdistrict(districtTalukas[0].code, selectedDistrictId);
          if (districtTalukas.length > 1) {
            pool = [...pool, ...getVillagesForSubdistrict(districtTalukas[1].code, selectedDistrictId)];
          }
        }
      }
    }

    if (categoryFilter !== "all") {
      pool = pool.filter((v) =>
        v.activeSchemes.some((s) => s.categoryEn.toLowerCase() === categoryFilter.toLowerCase())
      );
    }

    return pool;
  }, [searchQuery, selectedDistrictId, activeTalukaCode, categoryFilter, districtTalukas]);

  // Aggregated KPIs
  const totalFundsDisbursed = useMemo(() => {
    return Number(displayedVillages.reduce((sum, v) => sum + v.disbursedLakhs, 0).toFixed(1));
  }, [displayedVillages]);

  const totalBeneficiaries = useMemo(() => {
    return displayedVillages.reduce((sum, v) => sum + v.beneficiaries, 0);
  }, [displayedVillages]);

  const avgSaturation = useMemo(() => {
    if (displayedVillages.length === 0) return 0;
    const sum = displayedVillages.reduce((acc, v) => acc + v.saturationPct, 0);
    return Math.round(sum / displayedVillages.length);
  }, [displayedVillages]);

  // Filtered roster for modal
  const modalRosterFiltered = useMemo(() => {
    if (!selectedVillageForModal) return [];
    const q = rosterSearch.trim().toLowerCase();
    if (!q) return selectedVillageForModal.beneficiaryRoster;
    return selectedVillageForModal.beneficiaryRoster.filter(
      (b) =>
        b.nameGu.includes(q) ||
        b.nameEn.toLowerCase().includes(q) ||
        b.schemeNameGu.includes(q) ||
        b.schemeNameEn.toLowerCase().includes(q) ||
        b.bankRef.toLowerCase().includes(q) ||
        b.applicationId.toLowerCase().includes(q)
    );
  }, [selectedVillageForModal, rosterSearch]);

  const handleExportCSV = () => {
    if (!selectedVillageForModal) return;
    const rows = [
      ["Application ID", "Beneficiary Name", "Guardian Name", "Gender", "Scheme Name", "Amount (INR)", "Status", "Credit Date", "Bank Reference"],
      ...selectedVillageForModal.beneficiaryRoster.map((r) => [
        r.applicationId,
        r.nameEn,
        r.guardianEn,
        r.gender,
        r.schemeNameEn,
        String(r.amount),
        r.statusEn,
        r.date,
        r.bankRef,
      ]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Village_${selectedVillageForModal.nameEn}_Beneficiaries.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="village-analytics-hub" className="village-analytics-hub">
      {/* Section Header */}
      <div className="vah-header">
        <div>
          <div>
            <span className="vah-tag">
              <Landmark size={13} />
              {gu ? "ગામડે-ગામડે યોજના વપરાશ ઇન્ટેલિજન્સ" : "GRASSROOTS VILLAGE SCHEME REACH"}
            </span>
          </div>
          <h2 className="vah-title">
            {gu
              ? `${currentDistrict.nameGu} જિલ્લો: ગામવાર યોજના પહોંચ અને વપરાશ`
              : `${currentDistrict.nameEn} District: Village-by-Village Scheme Reach`}
          </h2>
          <p className="vah-subtitle">
            {gu
              ? "ગુજરાતના દરેક ગામડામાં કઈ સરકારી યોજના કેટલી પહોંચી, કેટલા રૂપિયા વપરાયા અને કયા નાગરિકોને લાભ મળ્યો તેની સંપૂર્ણ વિગત."
              : "Detailed breakdown of scheme coverage, DBT funds disbursed, and citizen recipient ledgers for each village."}
          </p>
        </div>

        {/* View Toggle */}
        <div className="vah-view-toggle">
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={`vah-view-toggle-btn ${viewMode === "cards" ? "vah-view-toggle-btn--active" : ""}`}
          >
            {gu ? "કાર્ડ વ્યૂ (Cards)" : "Card Grid"}
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`vah-view-toggle-btn ${viewMode === "table" ? "vah-view-toggle-btn--active" : ""}`}
          >
            {gu ? "ટેબલ વ્યૂ (Table)" : "Data Table"}
          </button>
        </div>
      </div>

      {/* 4 Executive KPI Metric Tiles */}
      <div className="vah-kpi-grid">
        <div className="vah-kpi-card">
          <div className="vah-kpi-top">
            <span>{gu ? "વિશ્લેષિત ગામો" : "Villages Monitored"}</span>
            <Building2 size={18} style={{ color: "#38bdf8" }} />
          </div>
          <div className="vah-kpi-value">
            {fmt(displayedVillages.length)}
          </div>
          <span className="vah-kpi-sub">{gu ? "સક્રિય કવરેજ હેઠળ" : "Under active tracking"}</span>
        </div>

        <div className="vah-kpi-card">
          <div className="vah-kpi-top">
            <span>{gu ? "કુલ યોજના વપરાશ" : "Total Funds Disbursed"}</span>
            <Wallet size={18} style={{ color: "#facc15" }} />
          </div>
          <div className="vah-kpi-value" style={{ color: "#fde047" }}>
            ₹{fmt(totalFundsDisbursed)} <span style={{ fontSize: "14px", fontWeight: "600" }}>{gu ? "લાખ" : "L"}</span>
          </div>
          <span className="vah-kpi-sub">{gu ? "DBT સીધા જમા રકમ" : "Direct Benefit Transfer"}</span>
        </div>

        <div className="vah-kpi-card">
          <div className="vah-kpi-top">
            <span>{gu ? "કુલ લાભાર્થી નાગરિકો" : "Enrolled Beneficiaries"}</span>
            <Users size={18} style={{ color: "#34d399" }} />
          </div>
          <div className="vah-kpi-value" style={{ color: "#34d399" }}>
            {fmt(totalBeneficiaries)}
          </div>
          <span className="vah-kpi-sub">{gu ? "પ્રમાણિત લાભાર્થીઓ" : "Verified citizen recipients"}</span>
        </div>

        <div className="vah-kpi-card">
          <div className="vah-kpi-top">
            <span>{gu ? "સરેરાશ સેચ્યુરેશન" : "Avg Scheme Saturation"}</span>
            <TrendingUp size={18} style={{ color: "#fbbf24" }} />
          </div>
          <div className="vah-kpi-value" style={{ color: "#facc15" }}>
            {avgSaturation}%
          </div>
          <span className="vah-kpi-sub">{gu ? "લક્ષિત પરિવારો સુધી પહોંચ" : "Targeted households reached"}</span>
        </div>
      </div>

      {/* Filter & Search Bar Controls */}
      <div className="vah-filter-bar">
        {/* Live Village Search Input */}
        <div className="vah-search-wrap">
          <Search size={16} className="vah-search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              gu
                ? "ગામનું નામ શોધો... (દા.ત. Kuda, Ghogha, Sanand, Malpar, Badi, Sarvodaya...)"
                : "Search village name across Gujarat (e.g. Kuda, Sanand, Malpar...)"
            }
            className="vah-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="vah-search-clear"
              aria-label="Clear Search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* District Selector */}
        <div className="vah-select-wrap">
          <select
            value={selectedDistrictId}
            onChange={(e) => {
              if (onDistrictChange) onDistrictChange(e.target.value);
              setActiveTalukaCode("all");
            }}
            className="vah-select"
            aria-label={gu ? "જિલ્લો" : "District"}
          >
            {MASTER_DISTRICTS.map((d) => (
              <option key={d.id} value={d.id} style={{ background: "#0c1a24", color: "#ffffff" }}>
                {gu ? d.nameGu : d.nameEn} {gu ? "જિલ્લો" : "District"}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="vah-select-arrow" />
        </div>

        {/* Taluka Selector */}
        <div className="vah-select-wrap">
          <select
            value={activeTalukaCode}
            onChange={(e) => setActiveTalukaCode(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="vah-select"
            aria-label={gu ? "તાલુકો" : "Taluka"}
          >
            <option value="all" style={{ background: "#0c1a24", color: "#ffffff" }}>
              {gu ? "તમામ તાલુકા" : "All Talukas"}
            </option>
            {districtTalukas.map((t) => (
              <option key={t.code} value={t.code} style={{ background: "#0c1a24", color: "#ffffff" }}>
                {gu ? t.nameGu : t.nameEn}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="vah-select-arrow" />
        </div>

        {/* Category Filter */}
        <div className="vah-select-wrap">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="vah-select"
            aria-label={gu ? "યોજના પ્રકાર" : "Scheme Category"}
          >
            <option value="all" style={{ background: "#0c1a24", color: "#ffffff" }}>
              {gu ? "તમામ ક્ષેત્રો" : "All Sectors"}
            </option>
            <option value="Agriculture" style={{ background: "#0c1a24", color: "#ffffff" }}>
              {gu ? "ખેતીવાડી" : "Agriculture"}
            </option>
            <option value="Women & Child" style={{ background: "#0c1a24", color: "#ffffff" }}>
              {gu ? "મહિલા કલ્યાણ" : "Women & Child"}
            </option>
            <option value="Education" style={{ background: "#0c1a24", color: "#ffffff" }}>
              {gu ? "શિક્ષણ" : "Education"}
            </option>
            <option value="Housing" style={{ background: "#0c1a24", color: "#ffffff" }}>
              {gu ? "આવાસ" : "Housing"}
            </option>
            <option value="Health" style={{ background: "#0c1a24", color: "#ffffff" }}>
              {gu ? "આરોગ્ય" : "Health"}
            </option>
          </select>
          <ChevronDown size={14} className="vah-select-arrow" />
        </div>
      </div>

      {/* Village Records Display */}
      {displayedVillages.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 20px", background: "rgba(255,255,255,0.04)", borderRadius: "18px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <MapPin size={32} style={{ margin: "0 auto 10px", color: "rgba(255,255,255,0.3)" }} />
          <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#ffffff" }}>
            {gu ? "કોઈ ગામ મળ્યું નથી" : "No villages match your search"}
          </p>
          <p style={{ margin: "6px 0 0", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
            {gu ? "કૃપા કરીને અન્ય ગામનું નામ લખો અથવા ફિલ્ટર સાફ કરો." : "Try searching another village name or reset filters."}
          </p>
        </div>
      ) : viewMode === "cards" ? (
        /* GRID CARDS VIEW */
        <div className="vah-cards-grid">
          {displayedVillages.map((village) => (
            <motion.article
              key={village.code}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="vah-village-card"
            >
              <div>
                {/* Village Head */}
                <div className="vah-card-head">
                  <div>
                    <div className="vah-card-meta">
                      <MapPin size={12} style={{ color: "#38bdf8" }} />
                      <span>{gu ? village.talukaNameGu : village.talukaNameEn} {gu ? "તાલુકો" : "Taluka"}</span>
                      <span>•</span>
                      <span>LGD {village.code}</span>
                    </div>
                    <h3 className="vah-card-village-name">
                      {gu ? village.nameGu : village.nameEn}
                    </h3>
                  </div>
                  <span className="vah-saturation-badge">
                    {village.saturationPct}% {gu ? "સંતૃપ્ત" : "Reached"}
                  </span>
                </div>

                {/* Village Quick Figures */}
                <div className="vah-card-stats-grid">
                  <div className="vah-card-stat-box">
                    <span className="vah-card-stat-label">{gu ? "યોજના વપરાશ" : "DBT Funds Used"}</span>
                    <strong className="vah-card-stat-val" style={{ color: "#fde047" }}>₹{village.disbursedLakhs} {gu ? "લાખ" : "L"}</strong>
                  </div>
                  <div className="vah-card-stat-box">
                    <span className="vah-card-stat-label">{gu ? "લાભાર્થી નાગરિકો" : "Beneficiaries"}</span>
                    <strong className="vah-card-stat-val" style={{ color: "#34d399" }}>{fmt(village.beneficiaries)}</strong>
                  </div>
                </div>

                {/* Schemes Active Pills */}
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.65)", display: "block" }}>
                    {gu ? "ગામમાં પહોંચેલ મુખ્ય યોજનાઓ:" : "Active Welfare Schemes in Village:"}
                  </span>
                  <div className="vah-scheme-pills-row">
                    {village.activeSchemes.map((s) => (
                      <span key={s.schemeId} className="vah-scheme-pill">
                        {gu ? s.schemeNameGu : s.schemeNameEn}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button: Open Beneficiary Roster */}
              <button
                type="button"
                onClick={() => {
                  setSelectedVillageForModal(village);
                  setRosterSearch("");
                  setActiveModalTab("roster");
                }}
                className="vah-card-action-btn"
              >
                <Eye size={14} style={{ color: "#38bdf8" }} />
                <span>{gu ? "યોજના અને લાભાર્થી નામાવલી જુઓ" : "View Beneficiaries & Schemes"}</span>
              </button>
            </motion.article>
          ))}
        </div>
      ) : (
        /* ANALYTICAL TABLE VIEW */
        <div className="vah-table-wrap">
          <table className="vah-table">
            <thead>
              <tr>
                <th>{gu ? "ગામનું નામ" : "Village Name"}</th>
                <th>{gu ? "તાલુકો" : "Taluka"}</th>
                <th>{gu ? "પરિવારો / વસ્તી" : "Households / Pop"}</th>
                <th>{gu ? "સક્રિય યોજનાઓ" : "Active Schemes"}</th>
                <th>{gu ? "કુલ વપરાશ (DBT)" : "Total Disbursed"}</th>
                <th>{gu ? "લાભાર્થીઓ" : "Beneficiaries"}</th>
                <th>{gu ? "સેચ્યુરેશન" : "Saturation"}</th>
                <th style={{ textAlign: "right" }}>{gu ? "વિગતવાર રજિસ્ટર" : "Action"}</th>
              </tr>
            </thead>
            <tbody>
              {displayedVillages.map((village) => (
                <tr key={village.code}>
                  <td style={{ fontWeight: "700" }}>
                    <div>{gu ? village.nameGu : village.nameEn}</div>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>LGD {village.code}</span>
                  </td>
                  <td style={{ color: "rgba(255,255,255,0.85)" }}>{gu ? village.talukaNameGu : village.talukaNameEn}</td>
                  <td style={{ color: "rgba(255,255,255,0.85)" }}>{fmt(village.households)} / {fmt(village.population)}</td>
                  <td>
                    <span style={{ padding: "3px 8px", borderRadius: "9999px", fontSize: "10px", fontWeight: "700", background: "rgba(56,189,248,0.2)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.35)" }}>
                      {village.activeSchemes.length} {gu ? "યોજનાઓ" : "Schemes"}
                    </span>
                  </td>
                  <td style={{ fontWeight: "800", color: "#fde047" }}>₹{village.disbursedLakhs} L</td>
                  <td style={{ fontWeight: "700", color: "#34d399" }}>{fmt(village.beneficiaries)}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "64px", height: "6px", borderRadius: "9999px", background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${village.saturationPct}%`,
                            background: "linear-gradient(90deg, #34d399 0%, #facc15 100%)",
                          }}
                        />
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: "700" }}>{village.saturationPct}%</span>
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedVillageForModal(village);
                        setRosterSearch("");
                        setActiveModalTab("roster");
                      }}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.22)",
                        color: "#ffffff",
                        fontSize: "11px",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Eye size={12} style={{ color: "#38bdf8" }} />
                      <span>{gu ? "નામાવલી" : "Roster"}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================================================================
          DEEP-DIVE MODAL / DRAWER: SCHEMES REACH & CITIZEN BENEFICIARY ROSTER
         ========================================================================= */}
      <AnimatePresence>
        {selectedVillageForModal && (
          <div className="vah-modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="vah-modal-dialog"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedVillageForModal(null)}
                className="vah-modal-close"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {/* Modal Header */}
              <div className="vah-modal-head">
                <div>
                  <span className="vah-tag">
                    {gu ? "ગામડે-ગામડે સંતૃપ્તિ અને લાભાર્થી રજિસ્ટર" : "VILLAGE SCHEME & BENEFICIARY LEDGER"}
                  </span>
                </div>
                <h3 className="vah-modal-title">
                  {gu ? selectedVillageForModal.nameGu : selectedVillageForModal.nameEn}
                </h3>
                <p className="vah-modal-sub">
                  {gu
                    ? `${selectedVillageForModal.districtNameGu} જિલ્લો • ${selectedVillageForModal.talukaNameGu} તાલુકો • LGD ${selectedVillageForModal.code} • વસ્તી: ${fmt(selectedVillageForModal.population)} • પરિવારો: ${fmt(selectedVillageForModal.households)}`
                    : `${selectedVillageForModal.districtNameEn} District • ${selectedVillageForModal.talukaNameEn} Taluka • LGD ${selectedVillageForModal.code} • Population: ${fmt(selectedVillageForModal.population)} • Households: ${fmt(selectedVillageForModal.households)}`}
                </p>
              </div>

              {/* Modal Tabs & Search / Export Row */}
              <div className="vah-modal-toolbar">
                <div className="vah-modal-tabs">
                  <button
                    type="button"
                    onClick={() => setActiveModalTab("roster")}
                    className={`vah-modal-tab-btn ${activeModalTab === "roster" ? "vah-modal-tab-btn--active" : ""}`}
                  >
                    {gu ? "લાભાર્થી નામાવલી (Citizen Roster)" : "Citizen Beneficiary Roster"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModalTab("schemes")}
                    className={`vah-modal-tab-btn ${activeModalTab === "schemes" ? "vah-modal-tab-btn--active" : ""}`}
                  >
                    {gu ? "યોજનાવાર વિગત (Scheme Breakdown)" : "Scheme Breakdown"}
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {activeModalTab === "roster" && (
                    <div style={{ position: "relative" }}>
                      <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.5)" }} />
                      <input
                        type="text"
                        value={rosterSearch}
                        onChange={(e) => setRosterSearch(e.target.value)}
                        placeholder={gu ? "લાભાર્થી નામ શોધો..." : "Search citizen name..."}
                        style={{
                          background: "rgba(255,255,255,0.1)",
                          border: "1px solid rgba(255,255,255,0.22)",
                          borderRadius: "10px",
                          padding: "6px 12px 6px 30px",
                          fontSize: "12px",
                          color: "#ffffff",
                          outline: "none",
                        }}
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleExportCSV}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "10px",
                      background: "rgba(255,255,255,0.14)",
                      border: "1px solid rgba(255,255,255,0.25)",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontWeight: "700",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: "pointer",
                    }}
                  >
                    <Download size={13} style={{ color: "#38bdf8" }} />
                    <span>{gu ? "CSV ડાઉનલોડ" : "Export CSV"}</span>
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="vah-modal-table-wrap">
                {activeModalTab === "roster" ? (
                  /* CITIZEN ROSTER TABLE */
                  <table className="vah-modal-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{gu ? "લાભાર્થી નાગરિક" : "Beneficiary Name"}</th>
                        <th>{gu ? "પિતા / પતિનું નામ" : "Father / Guardian"}</th>
                        <th>{gu ? "યોજના" : "Scheme"}</th>
                        <th>{gu ? "સહાય રકમ" : "Amount (DBT)"}</th>
                        <th>{gu ? "સ્થિતિ" : "Status"}</th>
                        <th>{gu ? "જમા તારીખ" : "Date"}</th>
                        <th>{gu ? "બેંક એકાઉન્ટ" : "Bank A/c"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modalRosterFiltered.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: "center", padding: "32px", color: "rgba(255,255,255,0.5)" }}>
                            {gu ? "કોઈ લાભાર્થી મળ્યા નથી" : "No citizen records found"}
                          </td>
                        </tr>
                      ) : (
                        modalRosterFiltered.map((ben, idx) => (
                          <tr key={ben.id}>
                            <td style={{ color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>{idx + 1}</td>
                            <td style={{ fontWeight: "800", color: "#ffffff" }}>
                              {gu ? ben.nameGu : ben.nameEn}
                            </td>
                            <td style={{ color: "rgba(255,255,255,0.8)" }}>{gu ? ben.guardianGu : ben.guardianEn}</td>
                            <td style={{ color: "#38bdf8", fontWeight: "600" }}>
                              {gu ? ben.schemeNameGu : ben.schemeNameEn}
                            </td>
                            <td style={{ fontWeight: "800", color: "#fde047" }}>₹{ben.amount.toLocaleString("en-IN")}</td>
                            <td>
                              <span className="vah-status-pill">
                                <CheckCircle2 size={11} />
                                {gu ? ben.statusGu : ben.statusEn}
                              </span>
                            </td>
                            <td style={{ color: "rgba(255,255,255,0.7)", fontFamily: "monospace" }}>{ben.date}</td>
                            <td style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px" }}>{ben.bankRef}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                ) : (
                  /* SCHEMES BREAKDOWN TABLE */
                  <table className="vah-modal-table">
                    <thead>
                      <tr>
                        <th>{gu ? "યોજનાનું નામ" : "Scheme Name"}</th>
                        <th>{gu ? "ક્ષેત્ર" : "Sector"}</th>
                        <th>{gu ? "લાભાર્થી સંખ્યા" : "Beneficiaries"}</th>
                        <th>{gu ? "ગ્રાન્ટ વપરાશ (DBT)" : "Grant Used"}</th>
                        <th>{gu ? "સેચ્યુરેશન" : "Saturation"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedVillageForModal.activeSchemes.map((scheme) => (
                        <tr key={scheme.schemeId}>
                          <td style={{ fontWeight: "800", color: "#ffffff" }}>
                            {gu ? scheme.schemeNameGu : scheme.schemeNameEn}
                          </td>
                          <td>
                            <span style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: "700", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
                              {gu ? scheme.categoryGu : scheme.categoryEn}
                            </span>
                          </td>
                          <td style={{ fontWeight: "700", color: "#34d399" }}>{fmt(scheme.beneficiaries)} {gu ? "નાગરિકો" : "Citizens"}</td>
                          <td style={{ fontWeight: "800", color: "#fde047" }}>₹{scheme.grantLakhs} {gu ? "લાખ" : "Lakhs"}</td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{ width: "80px", height: "6px", borderRadius: "9999px", background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                                <div
                                  style={{
                                    height: "100%",
                                    width: `${scheme.saturationPct}%`,
                                    background: "linear-gradient(90deg, #34d399 0%, #facc15 100%)",
                                  }}
                                />
                              </div>
                              <span style={{ fontSize: "11px", fontWeight: "700" }}>{scheme.saturationPct}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Modal Footer */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: "14px", marginTop: "14px" }}>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                  {gu ? "યોજના દૃષ્ટિ • ડાયરેક્ટ બેનિફિટ ટ્રાન્સફર (DBT) વિશ્લેષણ રિપોર્ટ" : "Yojana Drishti • Direct Benefit Transfer (DBT) Audit Ledger"}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedVillageForModal(null)}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {gu ? "બંધ કરો" : "Close"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
