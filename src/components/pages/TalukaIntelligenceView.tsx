"use client";

import React, { useState, useMemo } from "react";
import {
  Home,
  ArrowRight,
  Search,
  CheckCircle2,
} from "lucide-react";
import {
  MASTER_DISTRICTS,
  MASTER_SUBDISTRICTS,
  GHOGHA_48_VILLAGES,
} from "@/lib/master-hierarchy";
import { scaleDemoValue } from "@/lib/metrics.mjs";

interface TalukaIntelligenceViewProps {
  gu: boolean;
  fy: string;
  initialDistrictId?: string;
  initialSearchTerm?: string;
  onNavigateToVillages: (districtId: string, subdistrictCode: number) => void;
}

export function TalukaIntelligenceView({
  gu,
  fy,
  initialDistrictId = "bhavnagar",
  initialSearchTerm = "",
  onNavigateToVillages,
}: TalukaIntelligenceViewProps) {
  const [districtFilter, setDistrictFilter] = useState(initialDistrictId);
  const [search, setSearch] = useState(initialSearchTerm);

  const fmt = (num: number) => new Intl.NumberFormat(gu ? "gu-IN" : "en-IN").format(num);
  const ghoghaTotals = GHOGHA_48_VILLAGES.reduce((totals, village) => ({
    beneficiaries: totals.beneficiaries + village.beneficiaries,
    applications: totals.applications + village.applications,
    approved: totals.approved + village.approved,
    disbursedLakhs: totals.disbursedLakhs + village.disbursedLakhs,
  }), { beneficiaries: 0, applications: 0, approved: 0, disbursedLakhs: 0 });
  const yearFactor = fy === "2024–25" ? 0.88 : fy === "2023–24" ? 0.75 : 1;

  const activeSubdistricts = useMemo(() => {
    return MASTER_SUBDISTRICTS.filter((s) => {
      const matchDist = districtFilter === "all" || s.districtId === districtFilter;
      const matchSearch = `${s.nameEn} ${s.nameGu} ${s.districtNameEn} ${s.code}`
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchDist && matchSearch;
    });
  }, [districtFilter, search]);

  return (
    <div className="taluka-intel-page">
      {/* Page Hero */}
      <div className="page-hero-gov">
        <div>
          <span className="hero-kicker-tag">
            {gu ? "તાલુકા કક્ષાનું વિશ્લેષણ · ૩૦૯ તાલુકા નિર્દેશિકા" : "TALUKA INTELLIGENCE · 309 SUB-DISTRICT DIRECTORY"}
          </span>
          <h1>{gu ? "ગુજરાતના તમામ ૩૦૯ તાલુકાઓનું જમીની વિશ્લેષણ" : "Sub-District Level Welfare Analytics"}</h1>
          <p>
            {gu
              ? "અધિકૃત LGD માસ્ટર નિર્દેશિકા મુજબ ગુજરાતના ૩૪ જિલ્લાઓના ૩૦૯ તાલુકાઓ અને ૧૯,૨૦૧ ગામોનું સંપૂર્ણ વિશ્લેષણ."
              : "Official LGD Master Directory covering all 309 sub-districts across 34 districts of Gujarat with village counts and welfare coverage."}
          </p>
        </div>

        <div className="hero-actions-wrap">
          <button className="btn-primary-gov" onClick={() => onNavigateToVillages("bhavnagar", 3855)}>
            <Home size={16} />
            <span>{gu ? "ઘોઘાના ૪૮ ગામો જુઓ (નોંધપોથી)" : "View Ghogha's 48 Villages"}</span>
          </button>
        </div>
      </div>

      {/* Filter and Switcher Strip */}
      <div className="table-filter-strip">
        <label className="search-box-gov">
          <Search size={15} />
          <input
            type="search"
            placeholder={gu ? "તાલુકો શોધો (દા.ત. ઘોઘા, સિહોર, બાવળા, મહુવા)..." : "Search subdistrict (e.g. Ghogha, Sihor, Bavla)..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <div className="filter-dropdown-gov">
          <span>{gu ? "જિલ્લો પસંદ કરો:" : "District:"}</span>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            aria-label="Filter talukas by district"
          >
            <option value="all">{gu ? "બધા ૩૪ જિલ્લાઓ (૩૦૯ તાલુકા)" : "All 34 Districts (309 Talukas)"}</option>
            {MASTER_DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                [{d.officialNo}] {gu ? d.nameGu : d.nameEn} ({d.subDistrictCount} {gu ? "તાલુકા" : "Talukas"})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ghogha Featured Spotlight Card */}
      {districtFilter === "bhavnagar" && (
        <div className="featured-taluka-spotlight">
          <div className="spotlight-left">
            <span className="spotlight-tag">⭐ {gu ? "નોંધપોથી પાયલટ તાલુકો" : "NOTEBOOK PILOT TALUKA"}</span>
            <h2>{gu ? "ઘોઘા તાલુકો (Ghogha Taluka · કોડ: 3855)" : "Ghogha Taluka (Pilot Focus · LGD: 3855)"}</h2>
            <p>
              {gu
                ? "નોંધપોથીમાં દર્શાવેલા Ghogha pilot માટે ૪૮ ગામોની directory છે. તેની સાથેના લાભાર્થી અને નાણાકીય આંકડા prototype demo છે; શાળા/પંચાયત અને scheme coverageની સત્તાવાર પુષ્ટિ હજી ઉપલબ્ધ નથી."
                : "The Ghogha pilot contains a 48-village directory. Its beneficiary and financial figures are prototype demo data; official facility and scheme coverage records are not yet available."}
            </p>
            <div className="spotlight-pills">
              <span><b>48</b> {gu ? "ગામો (Villages)" : "Villages"}</span>
              <span><b>{fmt(scaleDemoValue(ghoghaTotals.beneficiaries, fy))}</b> {gu ? "લાભાર્થી · ડેમો" : "Beneficiaries · demo"}</span>
              <span><b>₹ {Number((ghoghaTotals.disbursedLakhs * yearFactor / 100).toFixed(1))} Cr</b> {gu ? "ચૂકવણી · ડેમો" : "Disbursed · demo"}</span>
              <span><b>{Math.round((ghoghaTotals.approved / ghoghaTotals.applications) * 100)}%</b> {gu ? "મંજૂરી · ડેમો" : "Approval · demo"}</span>
            </div>
          </div>
          <button className="btn-spotlight-action" onClick={() => onNavigateToVillages("bhavnagar", 3855)}>
            <span>{gu ? "૪૮ ગામોનું વિશ્લેષણ ખોલો" : "Explore 48 Villages"}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Subdistricts Grid */}
      <div className="taluka-cards-grid">
        {activeSubdistricts.map((t) => {
          const isGhogha = t.code === 3855;
          const isPilot = isGhogha;
          const benCount = isPilot ? scaleDemoValue(ghoghaTotals.beneficiaries, fy) : null;
          const disbCr = isPilot ? Number((ghoghaTotals.disbursedLakhs * yearFactor / 100).toFixed(1)) : null;
          const approvalRate = isPilot ? Math.round((ghoghaTotals.approved / ghoghaTotals.applications) * 100) : null;

          return (
            <div key={t.code} className={`taluka-grid-card ${isGhogha ? "ghogha-card" : ""}`}>
              <div className="tgc-top">
                <div>
                  <span className="tgc-dist-badge">{gu ? t.districtNameGu : t.districtNameEn}</span>
                  <h3>{gu ? t.nameGu : t.nameEn}</h3>
                </div>
                <span className="tgc-code">LGD: {t.code}</span>
              </div>

              <div className="tgc-stats-row">
                <div className="tgc-stat">
                  <small>{gu ? "ગામડાં" : "Villages"}</small>
                  <strong>{t.villageCount}</strong>
                </div>
                <div className="tgc-stat">
                  <small>{gu ? "લાભાર્થી" : "Beneficiaries"}</small>
                  <strong>{benCount === null ? "—" : fmt(benCount)}</strong>
                  {isPilot && <small>{gu ? "ડેમો" : "Demo"}</small>}
                </div>
                <div className="tgc-stat">
                  <small>{gu ? "ચૂકવણી" : "Disbursed"}</small>
                  <strong className="text-teal">{disbCr === null ? "—" : `₹${disbCr} Cr`}</strong>
                  {isPilot && <small>{gu ? "ડેમો" : "Demo"}</small>}
                </div>
              </div>

              <div className="tgc-footer">
                <span className="tgc-clearance">
                  {isPilot && <CheckCircle2 size={13} className="text-teal" />}
                  <span>{approvalRate === null ? (gu ? "યોજના આંકડા ઉપલબ્ધ નથી" : "Scheme metrics unavailable") : `${approvalRate}% ${gu ? "મંજૂરી · ડેમો" : "approval · demo"}`}</span>
                </span>

                <button
                  className="tgc-drill-btn"
                  onClick={() => onNavigateToVillages(t.districtId, t.code)}
                  title="Drill down to village level"
                >
                  <span>{gu ? "ગામો જુઓ" : "Villages"}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
