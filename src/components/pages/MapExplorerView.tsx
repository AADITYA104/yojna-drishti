"use client";

import React, { useState } from "react";
import { localizeText } from "@/lib/i18n";
import { Building2, Info, MapPinned } from "lucide-react";
import { demoDistricts, type District } from "@/lib/demo-data";
import { GujaratInteractiveMap } from "../map/GujaratInteractiveMap";
import { LocationAnalyticsDashboard } from "../map/LocationAnalyticsDashboard";
import districtDefaultLocations from "@/lib/district-default-locations.json";
import type { MapSelectedLocation } from "../map/GujaratInteractiveMap";
import type { AppLanguage } from "@/lib/i18n";

interface MapExplorerViewProps {
  gu: boolean;
  lang: AppLanguage;
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

const regions: { id: District["region"]; labelGu: string; labelEn: string; labelHi: string }[] = [
  { id: "Saurashtra", labelGu: "સૌરાષ્ટ્ર", labelEn: "Saurashtra", labelHi: "सौराष्ट्र" },
  { id: "North Gujarat", labelGu: "ઉત્તર ગુજરાત", labelEn: "North Gujarat", labelHi: "उत्तर गुजरात" },
  { id: "Central Gujarat", labelGu: "મધ્ય ગુજરાત", labelEn: "Central Gujarat", labelHi: "मध्य गुजरात" },
  { id: "South Gujarat", labelGu: "દક્ષિણ ગુજરાત", labelEn: "South Gujarat", labelHi: "दक्षिण गुजरात" },
  { id: "Kutch", labelGu: "કચ્છ", labelEn: "Kutch", labelHi: "कच्छ" },
];

export function MapExplorerView({ gu, lang, fy, focusRequest }: MapExplorerViewProps) {
  const [selectedRegion, setSelectedRegion] = useState<"all" | District["region"]>("all");
  const [activeDistrictId, setActiveDistrictId] = useState<string>(
    focusRequest?.target?.districtId || "bhavnagar",
  );
  const [previousFocusRequestId, setPreviousFocusRequestId] = useState(focusRequest?.id);
  const [selectedLocation, setSelectedLocation] = useState<MapSelectedLocation | null>(null);

  // Sync a new global map focus before rendering the updated explorer state.
  if (focusRequest?.target?.districtId && focusRequest.id !== previousFocusRequestId) {
    setPreviousFocusRequestId(focusRequest.id);
    setActiveDistrictId(focusRequest.target.districtId);
  }

  // Handle region filter change
  const handleRegionChange = (newRegion: "all" | District["region"]) => {
    setSelectedRegion(newRegion);
    setSelectedLocation(null);
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
    <div className="map-explorer-page w-full">
      {/* Header Bar */}
      <header className="geo-explorer-header mb-6">
        <div className="geo-explorer-title">
          <span className="geo-explorer-eyebrow flex items-center gap-1.5 text-xs font-bold text-cyan-300">
            <MapPinned size={14} />
            {lang === "gu" ? "ગુજરાત ભૌગોલિક એક્સપ્લોરર" : lang === "hi" ? "गुजरात भौगोलिक एक्सप्लोरर" : "GUJARAT GEOGRAPHIC EXPLORER"}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
            {lang === "gu" ? "ગુજરાત નકશો અને ક્ષેત્રીય યોજના વિશ્લેષણ" : lang === "hi" ? "गुजरात नक्शा और क्षेत्रीय योजना विश्लेषण" : "Gujarat Interactive Map & Area Intelligence"}
          </h1>
          <p className="text-xs md:text-sm text-white/65 mt-1 max-w-3xl">
            {lang === "gu"
              ? "ગુજરાતના તમામ ૩૩ જિલ્લાઓ, ૨૫૨ તાલુકાઓ અને ૧૮,૦૦૦+ ગામોમાં વિવિધ સરકારી યોજનાઓની પહોંચ, લાભાર્થી સંખ્યા અને પ્રગતિની વિગતવાર ભૌગોલિક માહિતી જુઓ."
              : lang === "hi"
                ? "गुजरात के सभी ३३ जिलों, २५२ तालुकों और १८,०००+ गाँवों में सरकारी योजनाओं की पहुँच, लाभार्थी संख्या और प्रगति की विस्तृत भौगोलिक जानकारी देखें।"
                : "Explore scheme penetration, beneficiary counts, and grassroots welfare delivery across all 33 districts, 252 talukas, and 18,000+ villages of Gujarat."}
          </p>
        </div>

        <div className="geo-explorer-filters flex flex-wrap items-center gap-3 mt-4">
          {/* Region Filter */}
          <label className="geo-filter-control">
            <span className="text-xs text-white/60 mr-1.5">{lang === "gu" ? "વિસ્તાર:" : lang === "hi" ? "क्षेत्र:" : "Region:"}</span>
            <span className="geo-filter-select">
              <Building2 size={15} />
              <select
                value={selectedRegion}
                onChange={(event) => handleRegionChange(event.target.value as typeof selectedRegion)}
                aria-label={lang === "gu" ? "વિસ્તાર પસંદ કરો" : lang === "hi" ? "क्षेत्र चुनें" : "Filter by region"}
                className="bg-slate-900 text-white text-xs py-1.5 px-3 rounded-lg border border-white/20"
              >
                <option value="all">{lang === "gu" ? "સમગ્ર ગુજરાત" : lang === "hi" ? "पूरा गुजरात" : "All Gujarat"}</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {lang === "gu" ? region.labelGu : lang === "hi" ? region.labelHi : region.labelEn}
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
            lang={lang}
            fy={fy}
            selectedDistrictId={activeDistrictId}
            regionFilter={selectedRegion}
            focusRequest={focusRequest}
            onDistrictSelect={(district) => setActiveDistrictId(district.id)}
            onLocationSelect={setSelectedLocation}
            variant="explorer"
          />
        </div>
      </section>

      <LocationAnalyticsDashboard key={activeLocation.locationCode} location={activeLocation} lang={lang} />

      <section className="geo-data-disclaimer map-data-status" role="status" style={{ borderLeftColor: "#38BDF8" }}>
        <MapPinned size={18} className="text-[#38BDF8]" aria-hidden="true" />
        <div>
          <strong>{lang === "gu" ? "ગુજરાત રાજ્ય ભૌગોલિક અને વહીવટી સ્તરો" : lang === "hi" ? "गुजरात राज्य भौगोलिक एवं प्रशासनिक स्तर" : "Gujarat Geographic and Administrative Tiers"}</strong>
          <p>
            {gu
              ? `પસંદ કરેલ જિલ્લો: ${demoDistricts.find((district) => district.id === activeDistrictId)?.gu || activeDistrictId} · સમગ્ર રાજ્ય કવરેજ: ૩૩ જિલ્લાઓ · ૨૫૨ તાલુકાઓ · ૧૮,૦૦૦+ ગામો. Survey of India / LGD કોડિંગ આધારિત સચોટ નકશો.`
              : lang === "hi"
                ? `चयनित जिला: ${demoDistricts.find((district) => district.id === activeDistrictId)?.name || activeDistrictId} · संपूर्ण राज्य कवरेज: ३३ जिले · २५२ तालुका · १८,०००+ गाँव। Survey of India / LGD कोडिंग आधारित सटीक नक्शा।`
                : `Selected District: ${demoDistricts.find((district) => district.id === activeDistrictId)?.name || activeDistrictId} · Statewide Coverage: 33 Districts · 252 Talukas · 18,000+ Villages. Survey of India and LGD-aligned GIS framework.`}
          </p>
        </div>
      </section>
    </div>
  );
}
