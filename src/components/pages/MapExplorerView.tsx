"use client";

import React, { useState, useEffect } from "react";
import { Building2, Info, MapPinned } from "lucide-react";
import { demoDistricts, type District } from "@/lib/demo-data";
import { NOTEBOOK_WOMEN_SCHEMES } from "@/lib/master-hierarchy";
import { GujaratInteractiveMap } from "../map/GujaratInteractiveMap";
import { VillageSchemeAnalyticsHub } from "../map/VillageSchemeAnalyticsHub";

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

export function MapExplorerView({ gu, fy, focusRequest }: MapExplorerViewProps) {
  const [selectedRegion, setSelectedRegion] = useState<"all" | District["region"]>("all");
  const [selectedSchemeId, setSelectedSchemeId] = useState("all");
  const [activeDistrictId, setActiveDistrictId] = useState<string>("bhavnagar");

  // Sync focusRequest from global search
  useEffect(() => {
    if (focusRequest?.target?.districtId) {
      setActiveDistrictId(focusRequest.target.districtId);
    }
  }, [focusRequest]);

  // Handle region filter change
  const handleRegionChange = (newRegion: "all" | District["region"]) => {
    setSelectedRegion(newRegion);
    if (newRegion !== "all") {
      const dist = demoDistricts.find((d) => d.region === newRegion);
      if (dist) setActiveDistrictId(dist.id);
    }
  };

  return (
    <div className="map-explorer-page w-full">
      {/* Header Bar */}
      <header className="geo-explorer-header mb-6">
        <div className="geo-explorer-title">
          <span className="geo-explorer-eyebrow flex items-center gap-1.5 text-xs font-bold text-cyan-300">
            <MapPinned size={14} />
            {gu ? "ગુજરાત ભૌગોલિક એક્સપ્લોરર" : "GUJARAT GEOGRAPHIC EXPLORER"}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
            {gu ? "ગુજરાત નકશો અને ક્ષેત્રીય યોજના વિશ્લેષણ" : "Gujarat Interactive Map & Area Intelligence"}
          </h1>
          <p className="text-xs md:text-sm text-white/65 mt-1 max-w-3xl">
            {gu
              ? "નકશામાં જિલ્લા, તાલુકા અને ગામડાઓ શોધો. નીચે આપેલ સર્ચ બાર દ્વારા કોઈપણ ગામનું નામ શોધીને ત્યાં કઈ યોજનાઓ પહોંચી અને કેટલા રૂપિયા વપરાયા તે જુઓ."
              : "Explore districts, talukas, and villages on the map. Search any village below to inspect scheme reach, DBT funds disbursed, and recipient citizen rosters."}
          </p>
        </div>

        <div className="geo-explorer-filters flex flex-wrap items-center gap-3 mt-4">
          {/* Scheme Filter */}
          <label className="geo-filter-control">
            <span className="text-xs text-white/60 mr-1.5">{gu ? "યોજના:" : "Scheme:"}</span>
            <span className="geo-filter-select">
              <Info size={15} aria-hidden="true" />
              <select
                value={selectedSchemeId}
                onChange={(event) => setSelectedSchemeId(event.target.value)}
                aria-label={gu ? "યોજના ફિલ્ટર" : "Filter schemes"}
                className="bg-slate-900 text-white text-xs py-1.5 px-3 rounded-lg border border-white/20"
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

          {/* Region Filter */}
          <label className="geo-filter-control">
            <span className="text-xs text-white/60 mr-1.5">{gu ? "વિસ્તાર:" : "Region:"}</span>
            <span className="geo-filter-select">
              <Building2 size={15} />
              <select
                value={selectedRegion}
                onChange={(event) => handleRegionChange(event.target.value as typeof selectedRegion)}
                aria-label={gu ? "વિસ્તાર પસંદ કરો" : "Filter by region"}
                className="bg-slate-900 text-white text-xs py-1.5 px-3 rounded-lg border border-white/20"
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

      {/* 1. MAIN INTERACTIVE MAP CONTAINER */}
      <section className="map-showcase-section mb-6" id="gujarat-map-canvas">
        <div className="full-map-wrapper rounded-[28px] overflow-hidden border border-white/20">
          <GujaratInteractiveMap
            key={selectedRegion}
            gu={gu}
            fy={fy}
            selectedDistrictId={activeDistrictId}
            regionFilter={selectedRegion}
            schemeFilter={selectedSchemeId}
            focusRequest={focusRequest}
            onDistrictSelect={(district) => setActiveDistrictId(district.id)}
            variant="explorer"
          />
        </div>
      </section>

      {/* 2. DIRECTLY UNDER MAP: COMPREHENSIVE VILLAGE-BY-VILLAGE SCHEME REACH & DBT FUNDS INTELLIGENCE */}
      <VillageSchemeAnalyticsHub
        gu={gu}
        fy={fy}
        selectedDistrictId={activeDistrictId}
        onDistrictChange={(dId) => setActiveDistrictId(dId)}
      />
    </div>
  );
}
