"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Building2, Info, MapPinned, Users, Wallet, TrendingUp, Map, Home, BarChart2 } from "lucide-react";
import { demoDistricts, demoTalukas, type District } from "@/lib/demo-data";
import { MASTER_DISTRICTS, NOTEBOOK_WOMEN_SCHEMES, getSubdistrictsForDistrict } from "@/lib/master-hierarchy";
import dynamic from "next/dynamic";

const GujaratInteractiveMap = dynamic(
  () => import("../map/GujaratInteractiveMap").then((m) => ({ default: m.GujaratInteractiveMap })),
  {
    ssr: false,
    loading: () => (
      <div className="map-loading-skeleton" role="status" aria-label="Loading map...">
        <div className="map-loading-pulse" />
        <span className="map-loading-text">નકશો લોડ થઈ રહ્યો છે... / Loading Gujarat Map...</span>
      </div>
    ),
  }
);

const VillageSchemeAnalyticsHub = dynamic(
  () => import("../map/VillageSchemeAnalyticsHub").then((m) => ({ default: m.VillageSchemeAnalyticsHub })),
  {
    ssr: false,
    loading: () => (
      <div className="map-loading-skeleton" role="status" aria-label="Loading analytics...">
        <div className="map-loading-pulse" />
        <span className="map-loading-text">ગામવાર ડેટા લોડ થઈ રહ્યો છે... / Loading village analytics...</span>
      </div>
    ),
  }
);

const DEFAULT_DISTRICT_ID = "bhavnagar" as const;

interface MapExplorerViewProps {
  gu: boolean;
  fy: string;
  focusRequest: {
    id: number;
    target: {
      id: string;
      kind: "district" | "taluka" | "village" | "scheme";
      districtId?: string;
      subdistrictCode?: number;
      villageCode?: string;
    };
  } | null;
}

const regions: { id: District["region"]; labelGu: string; labelEn: string }[] = [
  { id: "Saurashtra", labelGu: "સૌરાષ્ટ્ર", labelEn: "Saurashtra" },
  { id: "North Gujarat", labelGu: "ઉત્તર ગુજરાત", labelEn: "North Gujarat" },
  { id: "Central Gujarat", labelGu: "મધ્ય ગુજરાત", labelEn: "Central Gujarat" },
  { id: "South Gujarat", labelGu: "દક્ષિણ ગુજરાત", labelEn: "South Gujarat" },
  { id: "Kutch", labelGu: "કચ્છ", labelEn: "Kutch" },
];

function fmt(n: number, gu: boolean) {
  return new Intl.NumberFormat(gu ? "gu-IN" : "en-IN").format(n);
}

export function MapExplorerView({ gu, fy, focusRequest }: MapExplorerViewProps) {
  const [selectedRegion, setSelectedRegion] = useState<"all" | District["region"]>("all");
  const [selectedSchemeId, setSelectedSchemeId] = useState("all");
  const [activeDistrictId, setActiveDistrictId] = useState<string>(
    () => focusRequest?.target?.districtId || DEFAULT_DISTRICT_ID
  );
  const [targetVillageCode, setTargetVillageCode] = useState<string | null>(
    () => (focusRequest?.target?.kind === "village" ? focusRequest.target.villageCode || null : null)
  );
  const [lastFocusId, setLastFocusId] = useState<number | null>(() => focusRequest?.id || null);

  if (focusRequest && focusRequest.id !== lastFocusId) {
    setLastFocusId(focusRequest.id);
    if (focusRequest.target.districtId && focusRequest.target.districtId !== activeDistrictId) {
      setActiveDistrictId(focusRequest.target.districtId);
    }
    if (focusRequest.target.kind === "village" && focusRequest.target.villageCode) {
      setTargetVillageCode(focusRequest.target.villageCode);
    }
  }

  // Handle region filter change
  const handleRegionChange = (newRegion: "all" | District["region"]) => {
    setSelectedRegion(newRegion);
    if (newRegion !== "all") {
      const dist = demoDistricts.find((d) => d.region === newRegion);
      if (dist) setActiveDistrictId(dist.id);
    }
  };

  // Active district rich data — from demoDistricts + MASTER_DISTRICTS
  const activeDistrict = useMemo(() => {
    return demoDistricts.find((d) => d.id === activeDistrictId) || demoDistricts[0];
  }, [activeDistrictId]);

  const masterDistrict = useMemo(() => {
    return MASTER_DISTRICTS.find((d) => d.id === activeDistrictId) || MASTER_DISTRICTS[0];
  }, [activeDistrictId]);

  // All talukas for the active district
  const activeTalukas = useMemo(() => {
    return demoTalukas.filter((t) => t.districtId === activeDistrictId);
  }, [activeDistrictId]);

  const masterTalukas = useMemo(() => {
    return getSubdistrictsForDistrict(activeDistrictId);
  }, [activeDistrictId]);

  // Aggregate stats for district card
  const districtStats = useMemo(() => {
    const totalBenef = activeDistrict.beneficiaries;
    const totalApps = activeDistrict.applications;
    const totalApproved = activeDistrict.approved;
    const totalDisbursed = activeDistrict.disbursed;
    const approvalRate = totalApps > 0 ? Math.round((totalApproved / totalApps) * 100) : 0;
    return { totalBenef, totalApps, totalApproved, totalDisbursed, approvalRate };
  }, [activeDistrict]);

  return (
    <div className="map-explorer-page">
      {/* Header Bar */}
      <header className="geo-explorer-header">
        <div className="geo-explorer-title">
          <span className="geo-explorer-eyebrow">
            <MapPinned size={14} aria-hidden="true" />
            {gu ? "ગુજરાત ભૌગોલિક એક્સપ્લોરર" : "GUJARAT GEOGRAPHIC EXPLORER"}
          </span>
          <h1 className="geo-explorer-h1">
            {gu ? "ગુજરાત નકશો અને ક્ષેત્રીય યોજના વિશ્લેષણ" : "Gujarat Interactive Map & Area Intelligence"}
          </h1>
          <p className="geo-explorer-lead">
            {gu
              ? "નકશામાં કોઈપણ જિલ્લો, તાલુકો અથવા ગામ પર ક્લિક કરો — ક્લિક કરતાં જ કલર બદલાશે અને નીચે વિગતો ખુલશે."
              : "Click any district, taluka, or village on the map — selection highlights in teal and displays full details below."}
          </p>
        </div>

        <div className="geo-explorer-filters">
          <label className="geo-filter-control" htmlFor="scheme-filter-select">
            <span className="geo-filter-label">{gu ? "યોજના:" : "Scheme:"}</span>
            <span className="geo-filter-select-wrap">
              <Info size={15} aria-hidden="true" />
              <select
                id="scheme-filter-select"
                value={selectedSchemeId}
                onChange={(event) => setSelectedSchemeId(event.target.value)}
                aria-label={gu ? "યોજના ફિલ્ટર" : "Filter schemes"}
                className="geo-filter-select"
              >
                <option value="all">{gu ? "તમામ યોજનાઓ" : "All schemes"}</option>
                {NOTEBOOK_WOMEN_SCHEMES.map((scheme) => (
                  <option key={scheme.id} value={scheme.id}>
                    {gu ? scheme.nameGu : scheme.nameEn}
                  </option>
                ))}
              </select>
            </span>
          </label>

          <label className="geo-filter-control" htmlFor="region-filter-select">
            <span className="geo-filter-label">{gu ? "વિસ્તાર:" : "Region:"}</span>
            <span className="geo-filter-select-wrap">
              <Building2 size={15} aria-hidden="true" />
              <select
                id="region-filter-select"
                value={selectedRegion}
                onChange={(event) => handleRegionChange(event.target.value as typeof selectedRegion)}
                aria-label={gu ? "વિસ્તાર પસંદ કરો" : "Filter by region"}
                className="geo-filter-select"
              >
                <option value="all">{gu ? "સમગ્ર ગુજરાત (All Gujarat)" : "All Gujarat"}</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {gu ? region.labelGu : region.labelEn}
                  </option>
                ))}
              </select>
            </span>
          </label>
        </div>
      </header>

      {/* 1. MAIN INTERACTIVE MAP CONTAINER — FULL SPREAD */}
      <section className="map-showcase-section" id="gujarat-map-canvas">
        <div className="full-map-wrapper">
          <GujaratInteractiveMap
            key={selectedRegion}
            gu={gu}
            fy={fy}
            selectedDistrictId={activeDistrictId}
            regionFilter={selectedRegion}
            schemeFilter={selectedSchemeId}
            focusRequest={focusRequest}
            onDistrictSelect={(district) => setActiveDistrictId(district.id)}
            onVillageSelectForAnalysis={(vCode) => setTargetVillageCode(vCode)}
            variant="explorer"
          />
        </div>
      </section>

      {/* 2. DISTRICT INFO PANEL — Dynamic Glass Box for the Selected District */}
      <div className="geo-district-info-panel" aria-live="polite" aria-atomic="true">
        <div className="geo-district-info-left">
          <div className="geo-district-info-badge">
            <Map size={16} aria-hidden="true" />
            <span>{gu ? "પસંદ કરેલ જિલ્લો (ક્લિક કરેલ)" : "Selected District (Active Highlight)"}</span>
          </div>
          <div className="geo-district-name-row">
            <h2 className="geo-district-name-en">{activeDistrict.name}</h2>
            <span className="geo-district-name-gu">{activeDistrict.gu}</span>
          </div>
          <div className="geo-district-meta-row">
            <span className="geo-district-meta-chip">
              <Home size={12} aria-hidden="true" />
              {gu ? `${masterDistrict.subDistrictCount} તાલુકા` : `${masterDistrict.subDistrictCount} Talukas`}
            </span>
            <span className="geo-district-meta-chip">
              <Building2 size={12} aria-hidden="true" />
              {gu ? `${fmt(masterDistrict.villageCount, gu)} ગામ` : `${fmt(masterDistrict.villageCount, gu)} Villages`}
            </span>
            <span className="geo-district-meta-chip">
              <Map size={12} aria-hidden="true" />
              {`${fmt(activeDistrict.areaKm2, gu)} km²`}
            </span>
            <span className="geo-district-meta-chip geo-district-region-chip">
              {activeDistrict.region}
            </span>
          </div>
        </div>

        <div className="geo-district-info-stats">
          <div className="geo-district-stat-card">
            <Users size={18} className="geo-district-stat-icon" aria-hidden="true" />
            <div className="geo-district-stat-value">{fmt(activeDistrict.population, gu)}</div>
            <div className="geo-district-stat-label">{gu ? "વસ્તી" : "Population"}</div>
          </div>
          <div className="geo-district-stat-card geo-district-stat-card--accent">
            <TrendingUp size={18} className="geo-district-stat-icon" aria-hidden="true" />
            <div className="geo-district-stat-value">{fmt(districtStats.totalBenef, gu)}</div>
            <div className="geo-district-stat-label">{gu ? "લાભાર્થી" : "Beneficiaries"}</div>
          </div>
          <div className="geo-district-stat-card">
            <Wallet size={18} className="geo-district-stat-icon" aria-hidden="true" />
            <div className="geo-district-stat-value">₹{fmt(districtStats.totalDisbursed, gu)} Cr</div>
            <div className="geo-district-stat-label">{gu ? "ચૂકવણી" : "Disbursed"}</div>
          </div>
          <div className="geo-district-stat-card">
            <BarChart2 size={18} className="geo-district-stat-icon" aria-hidden="true" />
            <div className="geo-district-stat-value">{districtStats.approvalRate}%</div>
            <div className="geo-district-stat-label">{gu ? "મંજૂરી દર" : "Approval Rate"}</div>
          </div>
        </div>

        {/* Taluka chips list for active district */}
        {masterTalukas.length > 0 && (
          <div className="geo-taluka-mini-list">
            <div className="geo-taluka-mini-list-header">
              <Building2 size={14} aria-hidden="true" />
              <span>{gu ? "આ જિલ્લાના તમામ તાલુકાઓ" : "Talukas in this District"}</span>
              <span className="geo-taluka-mini-count">{masterTalukas.length}</span>
            </div>
            <div className="geo-taluka-chips-row">
              {masterTalukas.map((taluka) => {
                const demoT = activeTalukas.find((t) => t.id === taluka.id);
                return (
                  <div key={taluka.code} className="geo-taluka-chip" title={`${taluka.nameEn} — ${taluka.villageCount} villages`}>
                    <span className="geo-taluka-chip-name">{gu ? taluka.nameGu : taluka.nameEn}</span>
                    <span className="geo-taluka-chip-count">{taluka.villageCount} {gu ? "ગામ" : "vil."}</span>
                    {demoT && (
                      <span className="geo-taluka-chip-benef">
                        {gu ? `${fmt(demoT.beneficiaries, gu)} લા.` : `${fmt(demoT.beneficiaries, gu)} benef.`}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. DIRECTLY UNDER MAP & DISTRICT PANEL: FULL VILLAGE-BY-VILLAGE SCHEME REACH & DBT FUNDS INTELLIGENCE */}
      <VillageSchemeAnalyticsHub
        gu={gu}
        fy={fy}
        selectedDistrictId={activeDistrictId}
        onDistrictChange={(dId) => setActiveDistrictId(dId)}
        targetVillageCode={targetVillageCode}
        onClearTargetVillage={() => setTargetVillageCode(null)}
      />
    </div>
  );
}
