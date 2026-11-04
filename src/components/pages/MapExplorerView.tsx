"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowDown, Building2, Info, MapPinned, Compass, Layers } from "lucide-react";
import { demoDistricts, type District } from "@/lib/demo-data";
import { NOTEBOOK_WOMEN_SCHEMES } from "@/lib/master-hierarchy";
import { PureGujaratDistrictMap } from "../map/PureGujaratDistrictMap";
import { VillageSchemeAnalyticsHub } from "../map/VillageSchemeAnalyticsHub";
import { GujaratInteractiveMap } from "../map/GujaratInteractiveMap";

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
  const [mapEngine, setMapEngine] = useState<"pure-gujarat" | "satellite">("pure-gujarat");

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
            {gu ? "ગુજરાત ૩૩ જિલ્લા નકશો અને ગામવાર યોજના વપરાશ" : "Gujarat 33 Districts & Village Scheme Saturation"}
          </h1>
          <p className="text-xs md:text-sm text-white/65 mt-1 max-w-3xl">
            {gu
              ? "નકશામાં માત્ર ગુજરાત રાજ્ય દેખાશે. કોઈપણ જિલ્લા પર ક્લિક કરો અથવા નીચે આપેલ સર્ચ બાર દ્વારા કોઈપણ ગામનું નામ શોધીને ત્યાં કઈ યોજનાઓ પહોંચી અને કેટલા રૂપિયા વપરાયા તે જુઓ."
              : "Strictly Gujarat-only vector map. Click any district or use the search bar below to inspect village-level scheme coverage, expenditure, and beneficiary rosters."}
          </p>
        </div>

        <div className="geo-explorer-filters flex flex-wrap items-center gap-3 mt-4">
          {/* Map Engine Toggle */}
          <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl border border-white/20">
            <button
              type="button"
              onClick={() => setMapEngine("pure-gujarat")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                mapEngine === "pure-gujarat"
                  ? "bg-amber-400 text-slate-950 shadow-md font-extrabold"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <Compass size={13} />
              <span>{gu ? "માત્ર ગુજરાત (Pure Map)" : "Strictly Gujarat"}</span>
            </button>
            <button
              type="button"
              onClick={() => setMapEngine("satellite")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                mapEngine === "satellite"
                  ? "bg-white/25 text-white shadow-md font-bold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Layers size={13} />
              <span>{gu ? "વિગતવાર એક્સપ્લોરર" : "Street Tiles"}</span>
            </button>
          </div>

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
        {mapEngine === "pure-gujarat" ? (
          <PureGujaratDistrictMap
            gu={gu}
            fy={fy}
            selectedDistrictId={activeDistrictId}
            onSelectDistrict={(dId) => setActiveDistrictId(dId)}
            onExploreVillages={(dId) => {
              setActiveDistrictId(dId);
              document.getElementById("village-analytics-hub")?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        ) : (
          <div className="full-map-wrapper rounded-[28px] overflow-hidden border border-white/20">
            <GujaratInteractiveMap
              key={selectedRegion}
              gu={gu}
              fy={fy}
              selectedDistrictId={activeDistrictId}
              regionFilter={selectedRegion}
              schemeFilter={selectedSchemeId}
              focusRequest={focusRequest}
              variant="explorer"
            />
          </div>
        )}
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
