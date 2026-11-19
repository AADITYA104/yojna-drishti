"use client";

import React, { useState } from "react";
import { localizeText, type AppLanguage } from "@/lib/i18n";
import { Building2, Info, MapPinned, Map, Layers } from "lucide-react";
import { demoDistricts, type District } from "@/lib/demo-data";
import { GujaratInteractiveMap, type MapSelectedArea, type MapSelectedLocation } from "../map/GujaratInteractiveMap";
import { CleanGujaratSvgMap } from "../map/CleanGujaratSvgMap";
import { VillageSchemeAnalyticsHub } from "../map/VillageSchemeAnalyticsHub";
import { LocationAnalyticsDashboard } from "../map/LocationAnalyticsDashboard";
import { AreaSchemeAnalyticsDashboard } from "../map/AreaSchemeAnalyticsDashboard";
import districtDefaultLocations from "@/lib/district-default-locations.json";

interface MapExplorerViewProps {
  gu: boolean;
  lang: AppLanguage;
  fy: string;
  focusRequest?: {
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

const regions: { id: District["region"]; labelGu: string; labelEn: string; labelHi: string }[] = [
  { id: "Saurashtra", labelGu: "સૌરાષ્ટ્ર", labelEn: "Saurashtra", labelHi: "सौराष्ट्र" },
  { id: "North Gujarat", labelGu: "ઉત્તર ગુજરાત", labelEn: "North Gujarat", labelHi: "उत्तर गुजरात" },
  { id: "Central Gujarat", labelGu: "મધ્ય ગુજરાત", labelEn: "Central Gujarat", labelHi: "मध्य गुजरात" },
  { id: "South Gujarat", labelGu: "દક્ષિણ ગુજરાત", labelEn: "South Gujarat", labelHi: "दक्षिण गुजरात" },
  { id: "Kutch", labelGu: "કચ્છ", labelEn: "Kutch", labelHi: "कच्छ" },
];

export function MapExplorerView({ gu, lang, fy, focusRequest = null }: MapExplorerViewProps) {
  const [selectedRegion, setSelectedRegion] = useState<"all" | District["region"]>("all");
  const [activeDistrictId, setActiveDistrictId] = useState<string>(
    focusRequest?.target?.districtId || "bhavnagar",
  );
  const [previousFocusRequestId, setPreviousFocusRequestId] = useState(focusRequest?.id);
  const [selectedArea, setSelectedArea] = useState<MapSelectedArea | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapSelectedLocation | null>(null);
  const [mapMode, setMapMode] = useState<"svg" | "gis">("svg");

  // Sync a new global map focus before rendering the updated explorer state.
  if (focusRequest?.target?.districtId && focusRequest.id !== previousFocusRequestId) {
    setPreviousFocusRequestId(focusRequest.id);
    setActiveDistrictId(focusRequest.target.districtId);
  }

  // Handle region filter change
  const handleRegionChange = (newRegion: "all" | District["region"]) => {
    setSelectedRegion(newRegion);
    setSelectedLocation(null);
    setSelectedArea(null);
    if (newRegion !== "all") {
      const dist = demoDistricts.find((d) => d.region === newRegion);
      if (dist) setActiveDistrictId(dist.id);
    }
  };

  const activeLocation: MapSelectedLocation =
    selectedLocation ||
    (districtDefaultLocations as Record<string, MapSelectedLocation>)[activeDistrictId] ||
    (districtDefaultLocations as Record<string, MapSelectedLocation>)["bhavnagar"];

  return (
    <div className="map-explorer-page w-full space-y-8">
      {/* Header Bar */}
      <header className="geo-explorer-header flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/10">
        <div className="geo-explorer-title">
          <span className="geo-explorer-eyebrow flex items-center gap-1.5 text-xs font-bold text-cyan-300">
            <MapPinned size={14} />
            {lang === "gu" ? "ગુજરાત ભૌગોલિક એક્સપ્લોરર" : lang === "hi" ? "गुजरात भौगोलिक एक्सप्लोरर" : "GUJARAT GEOGRAPHIC EXPLORER"}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
            {lang === "gu" ? "ગુજરાત નકશો અને ગ્રામીણ યોજના વિશ્લેષણ" : lang === "hi" ? "गुजरात नक्शा और ग्रामीण योजना विश्लेषण" : "Gujarat Interactive Map & Grassroots Welfare Intelligence"}
          </h1>
          <p className="text-xs md:text-sm text-white/65 mt-1 max-w-3xl">
            {lang === "gu"
              ? "ગુજરાતના તમામ ૩૩ જિલ્લાઓ, ૨૫૨ તાલુકાઓ અને ૧૮,૦૦૦+ ગામોમાં યોજનાઓની પહોંચ અને વાસ્તવિક પ્રગતિ જુઓ. કોઈપણ જિલ્લા પર ક્લિક કરો અથવા નીચે સીધા ગામનું નામ શોધો."
              : lang === "hi"
                ? "गुजरात के सभी ३३ जिलों, २५२ तालुकों और १८,०००+ गाँवों में योजनाओं की पहुँच और वास्तविक प्रगति देखें।"
                : "Explore scheme penetration and grassroots welfare delivery across all 33 districts, 252 talukas, and 18,000+ villages of Gujarat."}
          </p>
        </div>

        {/* View Mode Toggle: Clean Vector Gujarat Map vs Full GIS OpenStreetMap */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/15 self-start md:self-auto shadow-lg">
          <button
            type="button"
            onClick={() => setMapMode("svg")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              mapMode === "svg"
                ? "bg-[#38BDF8] text-slate-950 shadow-md font-bold"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Map size={14} />
            <span>{gu ? "શુદ્ધ ગુજરાત નકશો (Vector)" : "Clean Gujarat (Vector)"}</span>
          </button>
          <button
            type="button"
            onClick={() => setMapMode("gis")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              mapMode === "gis"
                ? "bg-[#38BDF8] text-slate-950 shadow-md font-bold"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Layers size={14} />
            <span>{gu ? "GIS સેટેલાઇટ એક્સપ્લોરર" : "GIS Satellite Explorer"}</span>
          </button>
        </div>
      </header>

      {/* 1. MAIN INTERACTIVE MAP CONTAINER */}
      <section className="map-showcase-section" id="gujarat-map-canvas">
        {mapMode === "svg" ? (
          /* Clean Isolated Gujarat 33 Districts SVG Map (0 outside states clutter, interactive color change, city nodes) */
          <CleanGujaratSvgMap
            gu={gu}
            lang={lang}
            selectedDistrictId={activeDistrictId}
            onDistrictSelect={(districtId) => setActiveDistrictId(districtId)}
            regionFilter={selectedRegion}
            onRegionChange={handleRegionChange}
          />
        ) : (
          /* Full GIS MapLibre Map */
          <div className="full-map-wrapper rounded-[28px] overflow-hidden border border-white/20">
            <GujaratInteractiveMap
              key="administrative-drilldown-map"
              gu={gu}
              lang={lang}
              fy={fy}
              selectedDistrictId={activeDistrictId}
              focusRequest={focusRequest}
              onDistrictSelect={(district) => setActiveDistrictId(district.id)}
              onAreaSelect={setSelectedArea}
              onLocationSelect={setSelectedLocation}
              variant="explorer"
            />
          </div>
        )}
      </section>

      {/* 2. VILLAGE SCHEME ANALYTICS HUB (Search village-by-village, scheme progress, beneficiary counts) */}
      <section className="village-intelligence-hub-section pt-4" id="village-scheme-intelligence">
        <VillageSchemeAnalyticsHub
          gu={gu}
          fy={fy}
          selectedDistrictId={activeDistrictId}
          onDistrictChange={(id) => setActiveDistrictId(id)}
          targetVillageCode={focusRequest?.target?.villageCode || null}
        />
      </section>

      {/* 3. LOCATION & AREA ANALYTICS */}
      <section className="location-baseline-section pt-4">
        {selectedLocation ? (
          <LocationAnalyticsDashboard key={selectedLocation.locationCode} location={selectedLocation} lang={lang} />
        ) : selectedArea ? (
          <AreaSchemeAnalyticsDashboard
            key={`${selectedArea.districtCode}-${selectedArea.subdistrictCode || "district"}`}
            area={selectedArea}
            lang={lang}
          />
        ) : (
          <LocationAnalyticsDashboard key={activeLocation.locationCode} location={activeLocation} lang={lang} />
        )}
      </section>

      {/* Administrative Coverage Disclaimer */}
      <section className="geo-data-disclaimer map-data-status" role="status" style={{ borderLeftColor: "#38BDF8" }}>
        <MapPinned size={18} className="text-[#38BDF8]" aria-hidden="true" />
        <div>
          <strong>{lang === "gu" ? "ગુજરાત રાજ્ય ભૌગોલિક અને વહીવટી સ્તરો" : lang === "hi" ? "गुजरात राज्य भौगोलिक एवं प्रशासनिक स्तर" : "Gujarat Geographic and Administrative Tiers"}</strong>
          <p>
            {gu
              ? `પસંદ કરેલ જિલ્લો: ${demoDistricts.find((district) => district.id === activeDistrictId)?.gu || activeDistrictId} · સમગ્ર રાજ્ય કવરેજ: ૩૩ જિલ્લાઓ · ૨૫૨ તાલુકાઓ · ૧૮,૦૦૦+ ગામો. Survey of India / LGD કોડિંગ આધારિત સચોટ નકશો.`
              : lang === "hi"
                ? `ચયનિત જિલ્લો: ${demoDistricts.find((district) => district.id === activeDistrictId)?.name || activeDistrictId} · સંપૂર્ણ રાજ્ય કવરેજ: ૩૩ જિલ્લા · ૨૫૨ તાલુકા · ૧૮,૦૦૦+ ગામો.`
                : `Selected District: ${demoDistricts.find((district) => district.id === activeDistrictId)?.name || activeDistrictId} · Statewide Coverage: 33 Districts · 252 Talukas · 18,000+ Villages. Survey of India and LGD-aligned GIS framework.`}
          </p>
        </div>
      </section>
    </div>
  );
}
