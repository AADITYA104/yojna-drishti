"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Users,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Building2,
  MapPin,
  FileText,
  Sparkles,
  ArrowRight,
  Download,
  X,
  ChevronDown,
  Layers,
  Info,
  TrendingUp,
  Landmark,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MASTER_DISTRICTS,
  MASTER_SUBDISTRICTS,
  getSubdistrictsForDistrict,
} from "@/lib/master-hierarchy";
import {
  ALL_GHOGHA_ENHANCED_VILLAGES,
  getVillagesForSubdistrict,
  searchVillagesAcrossGujarat,
  type EnhancedVillageRecord,
  type VillageActiveScheme,
  type CitizenBeneficiaryRecord,
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
  const [activeModalTab, setActiveModalTab] = useState<"schemes" | "roster">("roster");

  // Format currency & numbers
  const fmt = (num: number) => new Intl.NumberFormat(gu ? "gu-IN" : "en-IN").format(num);

  // Available talukas for the current selected district
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
      // Search across villages
      pool = searchVillagesAcrossGujarat(searchQuery, selectedDistrictId);
    } else {
      // If Ghogha / Bhavnagar
      if (selectedDistrictId === "bhavnagar") {
        if (activeTalukaCode === "all" || activeTalukaCode === 3855) {
          pool = ALL_GHOGHA_ENHANCED_VILLAGES;
        } else {
          pool = getVillagesForSubdistrict(Number(activeTalukaCode), selectedDistrictId);
        }
      } else {
        // Any other district in Gujarat
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

    // Category filter
    if (categoryFilter !== "all") {
      pool = pool.filter((v) =>
        v.activeSchemes.some((s) => s.categoryEn.toLowerCase() === categoryFilter.toLowerCase())
      );
    }

    return pool;
  }, [searchQuery, selectedDistrictId, activeTalukaCode, categoryFilter, districtTalukas]);

  // Aggregated KPIs for displayed villages
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
    link.setAttribute("download", `Village_${selectedVillageForModal.nameEn}_Beneficiary_Roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="village-analytics-hub" className="village-analytics-hub mt-8 w-full">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
              <Landmark size={13} />
              {gu ? "ગામડે-ગામડે યોજના વપરાશ ઇન્ટેલિજન્સ" : "GRASSROOTS VILLAGE SCHEME REACH"}
            </span>
            <span className="text-xs text-white/50">• {gu ? "વાસ્તવિક લાભાર્થી નામાવલી" : "Verified Beneficiary Rosters"}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {gu
              ? `${currentDistrict.nameGu} જિલ્લો: ગામવાર યોજના પહોંચ અને વપરાશ`
              : `${currentDistrict.nameEn} District: Village-by-Village Scheme Reach`}
          </h2>
          <p className="text-sm text-white/60">
            {gu
              ? "ગુજરાતના દરેક ગામડામાં કઈ સરકારી યોજના કેટલી પહોંચી, કેટલા રૂપિયા વપરાયા અને કયા નાગરિકોને લાભ મળ્યો તેની સંપૂર્ણ વિગત."
              : "Detailed breakdown of scheme coverage, DBT funds disbursed, and citizen recipient ledgers for each village."}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-white/10 p-1 rounded-xl border border-white/20">
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "cards" ? "bg-white/25 text-white shadow-sm" : "text-white/60 hover:text-white"
            }`}
          >
            {gu ? "કાર્ડ વ્યૂ (Cards)" : "Card Grid"}
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "table" ? "bg-white/25 text-white shadow-sm" : "text-white/60 hover:text-white"
            }`}
          >
            {gu ? "ટેબલ વ્યૂ (Table)" : "Data Table"}
          </button>
        </div>
      </div>

      {/* 4 Executive KPI Metric Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="rounded-2xl bg-white/[0.06] border border-white/15 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-white/60 mb-1">
            <span className="text-xs font-medium">{gu ? "વિશ્લેષિત ગામો" : "Villages Monitored"}</span>
            <Building2 size={16} className="text-sky-400" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-white">
            {fmt(displayedVillages.length)}
          </div>
          <span className="text-[11px] text-white/50">{gu ? "સક્રિય કવરેજ હેઠળ" : "Under active tracking"}</span>
        </div>

        <div className="rounded-2xl bg-white/[0.06] border border-white/15 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-white/60 mb-1">
            <span className="text-xs font-medium">{gu ? "કુલ યોજના વપરાશ" : "Total Funds Disbursed"}</span>
            <Wallet size={16} className="text-amber-400" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-amber-300">
            ₹{fmt(totalFundsDisbursed)} <span className="text-sm font-semibold">{gu ? "લાખ" : "Lakhs"}</span>
          </div>
          <span className="text-[11px] text-white/50">{gu ? "DBT સીધા જમા રકમ" : "Direct Benefit Transfer"}</span>
        </div>

        <div className="rounded-2xl bg-white/[0.06] border border-white/15 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-white/60 mb-1">
            <span className="text-xs font-medium">{gu ? "કુલ લાભાર્થી નાગરિકો" : "Enrolled Beneficiaries"}</span>
            <Users size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-emerald-300">
            {fmt(totalBeneficiaries)}
          </div>
          <span className="text-[11px] text-white/50">{gu ? "પ્રમાણિત લાભાર્થીઓ" : "Verified citizen recipients"}</span>
        </div>

        <div className="rounded-2xl bg-white/[0.06] border border-white/15 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-white/60 mb-1">
            <span className="text-xs font-medium">{gu ? "સરેરાશ સેચ્યુરેશન" : "Avg Scheme Saturation"}</span>
            <TrendingUp size={16} className="text-yellow-400" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-yellow-300">
            {avgSaturation}%
          </div>
          <span className="text-[11px] text-white/50">{gu ? "લક્ષિત પરિવારો સુધી પહોંચ" : "Targeted households reached"}</span>
        </div>
      </div>

      {/* Filter & Search Bar Controls */}
      <div className="rounded-2xl bg-white/[0.05] border border-white/15 p-4 backdrop-blur-xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Live Village Search Input */}
          <div className="md:col-span-5 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                gu
                  ? "ગામનું નામ શોધો... (દા.ત. Kuda, Ghogha, Sanand, Malpar, Badi, Sarvodaya...)"
                  : "Search village name across Gujarat (e.g. Kuda, Sanand, Malpar...)"
              }
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-9 py-2.5 text-xs md:text-sm text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 focus:bg-white/15 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* District Selector */}
          <div className="md:col-span-3 relative">
            <select
              value={selectedDistrictId}
              onChange={(e) => {
                if (onDistrictChange) onDistrictChange(e.target.value);
                setActiveTalukaCode("all");
              }}
              className="w-full appearance-none bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 pr-8 text-xs md:text-sm text-white focus:outline-none focus:border-cyan-400"
              aria-label={gu ? "જિલ્લો" : "District"}
            >
              {MASTER_DISTRICTS.map((d) => (
                <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                  {gu ? d.nameGu : d.nameEn} {gu ? "જિલ્લો" : "District"}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
          </div>

          {/* Taluka Selector */}
          <div className="md:col-span-2 relative">
            <select
              value={activeTalukaCode}
              onChange={(e) => setActiveTalukaCode(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="w-full appearance-none bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 pr-8 text-xs md:text-sm text-white focus:outline-none focus:border-cyan-400"
              aria-label={gu ? "તાલુકો" : "Taluka"}
            >
              <option value="all" className="bg-slate-900 text-white">
                {gu ? "તમામ તાલુકા" : "All Talukas"}
              </option>
              {districtTalukas.map((t) => (
                <option key={t.code} value={t.code} className="bg-slate-900 text-white">
                  {gu ? t.nameGu : t.nameEn}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-2 relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full appearance-none bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 pr-8 text-xs md:text-sm text-white focus:outline-none focus:border-cyan-400"
              aria-label={gu ? "યોજના પ્રકાર" : "Scheme Category"}
            >
              <option value="all" className="bg-slate-900 text-white">
                {gu ? "તમામ ક્ષેત્રો" : "All Sectors"}
              </option>
              <option value="Agriculture" className="bg-slate-900 text-white">
                {gu ? "ખેતીવાડી" : "Agriculture"}
              </option>
              <option value="Women & Child" className="bg-slate-900 text-white">
                {gu ? "મહિલા કલ્યાણ" : "Women & Child"}
              </option>
              <option value="Education" className="bg-slate-900 text-white">
                {gu ? "શિક્ષણ" : "Education"}
              </option>
              <option value="Housing" className="bg-slate-900 text-white">
                {gu ? "આવાસ" : "Housing"}
              </option>
              <option value="Health" className="bg-slate-900 text-white">
                {gu ? "આરોગ્ય" : "Health"}
              </option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Village Records Display */}
      {displayedVillages.length === 0 ? (
        <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-12 text-center text-white/60">
          <MapPin size={32} className="mx-auto text-white/30 mb-2" />
          <p className="text-base font-semibold text-white">
            {gu ? "કોઈ ગામ મળ્યું નથી" : "No villages match your search"}
          </p>
          <p className="text-xs text-white/50 mt-1">
            {gu ? "કૃપા કરીને અન્ય ગામનું નામ લખો અથવા ફિલ્ટર સાફ કરો." : "Try searching another village name or reset filters."}
          </p>
        </div>
      ) : viewMode === "cards" ? (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedVillages.map((village) => (
            <motion.article
              key={village.code}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white/[0.07] border border-white/15 p-5 backdrop-blur-xl hover:border-cyan-400/50 hover:bg-white/[0.09] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Village Head */}
                <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3 mb-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] text-white/60">
                      <MapPin size={12} className="text-cyan-400" />
                      <span>{gu ? village.talukaNameGu : village.talukaNameEn} {gu ? "તાલુકો" : "Taluka"}</span>
                      <span>•</span>
                      <span>LGD {village.code}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      {gu ? village.nameGu : village.nameEn}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {village.saturationPct}% {gu ? "સંતૃપ્ત" : "Reached"}
                  </span>
                </div>

                {/* Village Quick Figures */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
                    <span className="text-white/50 text-[10px] block">{gu ? "યોજના વપરાશ" : "DBT Funds Used"}</span>
                    <strong className="text-sm font-bold text-amber-300">₹{village.disbursedLakhs} {gu ? "લાખ" : "Lakh"}</strong>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
                    <span className="text-white/50 text-[10px] block">{gu ? "લાભાર્થી નાગરિકો" : "Beneficiaries"}</span>
                    <strong className="text-sm font-bold text-emerald-300">{fmt(village.beneficiaries)}</strong>
                  </div>
                </div>

                {/* Schemes Active Pills */}
                <div className="mb-4">
                  <span className="text-[11px] font-semibold text-white/60 block mb-1.5">
                    {gu ? "ગામમાં પહોંચેલ મુખ્ય યોજનાઓ:" : "Active Welfare Schemes in Village:"}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {village.activeSchemes.map((s) => (
                      <span
                        key={s.schemeId}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/10 text-white/90 border border-white/15"
                      >
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
                className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-semibold text-xs transition-all shadow-sm"
              >
                <Eye size={14} className="text-cyan-300" />
                <span>{gu ? "યોજના અને લાભાર્થી નામાવલી જુઓ" : "View Beneficiaries & Schemes"}</span>
                <ArrowRight size={13} className="text-white/60" />
              </button>
            </motion.article>
          ))}
        </div>
      ) : (
        /* ANALYTICAL TABLE VIEW */
        <div className="rounded-2xl bg-white/[0.06] border border-white/15 overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm text-white border-collapse">
              <thead>
                <tr className="bg-white/10 border-b border-white/15 text-white/70 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">{gu ? "ગામનું નામ" : "Village Name"}</th>
                  <th className="py-3 px-3">{gu ? "તાલુકો" : "Taluka"}</th>
                  <th className="py-3 px-3">{gu ? "પરિવારો / વસ્તી" : "Households / Pop"}</th>
                  <th className="py-3 px-3">{gu ? "સક્રિય યોજનાઓ" : "Active Schemes"}</th>
                  <th className="py-3 px-3">{gu ? "કુલ વપરાશ (DBT)" : "Total Disbursed"}</th>
                  <th className="py-3 px-3">{gu ? "લાભાર્થીઓ" : "Beneficiaries"}</th>
                  <th className="py-3 px-3">{gu ? "સેચ્યુરેશન" : "Saturation"}</th>
                  <th className="py-3 px-4 text-right">{gu ? "વિગતવાર રજિસ્ટર" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {displayedVillages.map((village) => (
                  <tr key={village.code} className="hover:bg-white/[0.08] transition-colors">
                    <td className="py-3 px-4 font-bold text-white">
                      <div>{gu ? village.nameGu : village.nameEn}</div>
                      <span className="text-[10px] text-white/50">LGD {village.code}</span>
                    </td>
                    <td className="py-3 px-3 text-white/80">{gu ? village.talukaNameGu : village.talukaNameEn}</td>
                    <td className="py-3 px-3 text-white/80">{fmt(village.households)} / {fmt(village.population)}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                        {village.activeSchemes.length} {gu ? "યોજનાઓ" : "Schemes"}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-amber-300">₹{village.disbursedLakhs} L</td>
                    <td className="py-3 px-3 font-semibold text-emerald-300">{fmt(village.beneficiaries)}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-yellow-400"
                            style={{ width: `${village.saturationPct}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-white/90">{village.saturationPct}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedVillageForModal(village);
                          setRosterSearch("");
                          setActiveModalTab("roster");
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all"
                      >
                        <Eye size={12} className="text-cyan-300" />
                        <span>{gu ? "નામાવલી" : "Roster"}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          DEEP-DIVE MODAL / DRAWER: SCHEMES REACH & CITIZEN BENEFICIARY ROSTER
         ========================================================================= */}
      <AnimatePresence>
        {selectedVillageForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-[#0D1C26] border border-cyan-500/40 shadow-2xl p-6 md:p-8 flex flex-col overflow-hidden text-white"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedVillageForModal(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {/* Modal Header */}
              <div className="border-b border-white/15 pb-4 mb-4">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    {gu ? "ગામડે-ગામડે સંતૃપ્તિ અને લાભાર્થી રજિસ્ટર" : "VILLAGE SCHEME & BENEFICIARY LEDGER"}
                  </span>
                  <span className="text-xs text-white/50">LGD Code: {selectedVillageForModal.code}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                  {gu ? selectedVillageForModal.nameGu : selectedVillageForModal.nameEn}
                </h3>
                <p className="text-xs md:text-sm text-white/60">
                  {gu
                    ? `${selectedVillageForModal.districtNameGu} જિલ્લો • ${selectedVillageForModal.talukaNameGu} તાલુકો • કુલ વસ્તી: ${fmt(selectedVillageForModal.population)} • પરિવારો: ${fmt(selectedVillageForModal.households)}`
                    : `${selectedVillageForModal.districtNameEn} District • ${selectedVillageForModal.talukaNameEn} Taluka • Population: ${fmt(selectedVillageForModal.population)} • Households: ${fmt(selectedVillageForModal.households)}`}
                </p>
              </div>

              {/* Modal Tabs & Search / Export Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 bg-white/10 p-1 rounded-xl border border-white/20">
                  <button
                    type="button"
                    onClick={() => setActiveModalTab("roster")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeModalTab === "roster"
                        ? "bg-cyan-500/30 border border-cyan-400/50 text-cyan-200"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {gu ? "લાભાર્થી નામાવલી (Citizen Roster)" : "Citizen Beneficiary Roster"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModalTab("schemes")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeModalTab === "schemes"
                        ? "bg-cyan-500/30 border border-cyan-400/50 text-cyan-200"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {gu ? "યોજનાવાર વિગત (Scheme Breakdown)" : "Scheme Breakdown"}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {activeModalTab === "roster" && (
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                      <input
                        type="text"
                        value={rosterSearch}
                        onChange={(e) => setRosterSearch(e.target.value)}
                        placeholder={gu ? "લાભાર્થી નામ શોધો..." : "Search citizen name..."}
                        className="bg-white/10 border border-white/20 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Download size={13} className="text-cyan-300" />
                    <span>{gu ? "CSV ડાઉનલોડ" : "Export CSV"}</span>
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto pr-1">
                {activeModalTab === "roster" ? (
                  /* CITIZEN ROSTER TABLE */
                  <div className="rounded-xl border border-white/15 overflow-hidden">
                    <table className="w-full text-left text-xs text-white border-collapse">
                      <thead>
                        <tr className="bg-white/10 border-b border-white/15 text-white/70 text-[10px] uppercase font-bold tracking-wider">
                          <th className="py-2.5 px-3">#</th>
                          <th className="py-2.5 px-3">{gu ? "લાભાર્થી નાગરિક" : "Beneficiary Name"}</th>
                          <th className="py-2.5 px-3">{gu ? "પિતા / પતિનું નામ" : "Father / Guardian"}</th>
                          <th className="py-2.5 px-3">{gu ? "યોજના" : "Scheme"}</th>
                          <th className="py-2.5 px-3">{gu ? "સહાય રકમ" : "Amount (DBT)"}</th>
                          <th className="py-2.5 px-3">{gu ? "સ્થિતિ" : "Status"}</th>
                          <th className="py-2.5 px-3">{gu ? "જમા તારીખ" : "Date"}</th>
                          <th className="py-2.5 px-3">{gu ? "બેંક એકાઉન્ટ" : "Bank A/c"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {modalRosterFiltered.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-8 text-center text-white/50 text-xs">
                              {gu ? "કોઈ લાભાર્થી મળ્યા નથી" : "No citizen records found"}
                            </td>
                          </tr>
                        ) : (
                          modalRosterFiltered.map((ben, idx) => (
                            <tr key={ben.id} className="hover:bg-white/[0.06] transition-colors">
                              <td className="py-2.5 px-3 text-white/50 font-mono text-[10px]">{idx + 1}</td>
                              <td className="py-2.5 px-3 font-bold text-white">
                                {gu ? ben.nameGu : ben.nameEn}
                              </td>
                              <td className="py-2.5 px-3 text-white/80">{gu ? ben.guardianGu : ben.guardianEn}</td>
                              <td className="py-2.5 px-3 text-cyan-300 font-medium">
                                {gu ? ben.schemeNameGu : ben.schemeNameEn}
                              </td>
                              <td className="py-2.5 px-3 font-bold text-amber-300">₹{ben.amount.toLocaleString("en-IN")}</td>
                              <td className="py-2.5 px-3">
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                                  <CheckCircle2 size={10} />
                                  {gu ? ben.statusGu : ben.statusEn}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-white/70 font-mono text-[11px]">{ben.date}</td>
                              <td className="py-2.5 px-3 text-white/60 text-[11px]">{ben.bankRef}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* SCHEMES BREAKDOWN TABLE */
                  <div className="rounded-xl border border-white/15 overflow-hidden">
                    <table className="w-full text-left text-xs text-white border-collapse">
                      <thead>
                        <tr className="bg-white/10 border-b border-white/15 text-white/70 text-[10px] uppercase font-bold tracking-wider">
                          <th className="py-3 px-4">{gu ? "યોજનાનું નામ" : "Scheme Name"}</th>
                          <th className="py-3 px-3">{gu ? "ક્ષેત્ર" : "Sector"}</th>
                          <th className="py-3 px-3">{gu ? "લાભાર્થી સંખ્યા" : "Beneficiaries"}</th>
                          <th className="py-3 px-3">{gu ? "ગ્રાન્ટ વપરાશ (DBT)" : "Grant Used"}</th>
                          <th className="py-3 px-4">{gu ? "સેચ્યુરેશન" : "Saturation"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {selectedVillageForModal.activeSchemes.map((scheme) => (
                          <tr key={scheme.schemeId} className="hover:bg-white/[0.06] transition-colors">
                            <td className="py-3 px-4 font-bold text-white">
                              {gu ? scheme.schemeNameGu : scheme.schemeNameEn}
                            </td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/10 text-white/80 border border-white/15">
                                {gu ? scheme.categoryGu : scheme.categoryEn}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-semibold text-emerald-300">{fmt(scheme.beneficiaries)} {gu ? "નાગરિકો" : "Citizens"}</td>
                            <td className="py-3 px-3 font-bold text-amber-300">₹{scheme.grantLakhs} {gu ? "લાખ" : "Lakhs"}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-2 rounded-full bg-white/10 overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-emerald-400 to-yellow-400"
                                    style={{ width: `${scheme.saturationPct}%` }}
                                  />
                                </div>
                                <span className="text-xs font-bold text-white/90">{scheme.saturationPct}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t border-white/15 pt-3 mt-4 flex items-center justify-between text-xs text-white/50">
                <span>{gu ? "યોજના દૃષ્ટિ • ડાયરેક્ટ બેનિફિટ ટ્રાન્સફર (DBT) રિપોર્ટ" : "Yojana Drishti • DBT Verification Roster"}</span>
                <button
                  type="button"
                  onClick={() => setSelectedVillageForModal(null)}
                  className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all"
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
