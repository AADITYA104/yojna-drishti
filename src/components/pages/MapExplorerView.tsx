"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowDown, Building2, Info, MapPinned } from "lucide-react";
import { demoDistricts, type District } from "@/lib/demo-data";
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
  const regionDistrictId = selectedRegion === "all"
    ? "bhavnagar"
    : demoDistricts.find((district) => district.region === selectedRegion)?.id || "bhavnagar";

  return (
    <div className="map-explorer-page">
      <header className="geo-explorer-header">
        <div className="geo-explorer-title">
          <span className="geo-explorer-eyebrow">
            <MapPinned size={14} />
            {gu ? "ભૌગોલિક શોધક" : "GEOGRAPHIC EXPLORER"}
          </span>
          <h1>{gu ? "ગુજરાત નકશા અને વિસ્તારની માહિતી" : "Gujarat map & area intelligence"}</h1>
          <p>
            {gu
              ? "જિલ્લા, તાલુકા અને ગામનું નામ શોધો. સ્થાનવાર યોજનાની સત્તાવાર માહિતી જોડાયેલી નથી."
              : "Search districts, talukas, and villages. Official scheme-location data is not connected."}
          </p>
        </div>
        <div className="geo-explorer-filters">
          <label className="geo-filter-control">
            <span>{gu ? "સ્થળવાર યોજના-પહોંચ" : "Local scheme coverage"}</span>
            <span className="geo-filter-select">
              <Info size={15} aria-hidden="true" />
              <select disabled value="unavailable" aria-label={gu ? "સ્થળવાર યોજના માહિતી ઉપલબ્ધ નથી" : "Location-based scheme information unavailable"}>
                <option value="unavailable">{gu ? "સત્તાવાર વિસ્તારવાર ડેટા ઉપલબ્ધ નથી" : "Official area-level data unavailable"}</option>
              </select>
            </span>
          </label>
          <label className="geo-filter-control">
            <span>{gu ? "વિસ્તાર" : "Region"}</span>
            <span className="geo-filter-select">
              <Building2 size={15} />
              <select
                value={selectedRegion}
                onChange={(event) => setSelectedRegion(event.target.value as typeof selectedRegion)}
                aria-label={gu ? "વિસ્તાર પ્રમાણે ફિલ્ટર કરો" : "Filter by region"}
              >
                <option value="all">{gu ? "સમગ્ર ગુજરાત" : "All Gujarat"}</option>
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

      <section className="geo-gujarat-showcase" aria-label={gu ? "ગુજરાતની ઓળખ" : "Discover Gujarat"}>
        <div className="geo-gujarat-showcase-copy">
          <span className="geo-gujarat-showcase-kicker">{gu ? "ગુજરાત · ૩૪ જિલ્લા" : "GUJARAT · 34 DISTRICTS"}</span>
          <h2>{gu ? "ગુજરાતને વિસ્તારથી શોધો" : "Explore Gujarat, area by area"}</h2>
          <p>
            {gu
              ? "જિલ્લાથી તાલુકા અને ગામ સુધી નકશામાં આગળ વધો. સ્થાનવાર યોજનાઓ માટે સત્તાવાર માહિતી હજી જોડવાની બાકી છે."
              : "Move from districts to talukas and villages on the map. Official scheme coverage by locality is still to be connected."}
          </p>
          <button
            type="button"
            onClick={() => document.getElementById("gujarat-map-canvas")?.scrollIntoView({ behavior: "smooth", block: "center" })}
          >
            {gu ? "નકશો જુઓ" : "Explore the map"}
            <ArrowDown size={15} aria-hidden="true" />
          </button>
        </div>
        <div className="geo-gujarat-showcase-image">
          <Image
            src="/images/gujarat-hero.webp"
            alt={gu ? "ગુજરાતના પ્રાકૃતિક અને સાંસ્કૃતિક દૃશ્યોનું ચિત્રમય કોલાજ" : "Illustrative collage of Gujarat landscapes and cultural landmarks"}
            width={1920}
            height={1081}
            sizes="(max-width: 768px) 100vw, 42vw"
            priority
          />
          <span>{gu ? "ગુજરાતનું ચિત્રમય પૂર્વદર્શન" : "Illustrative Gujarat collage"}</span>
        </div>
      </section>

      <div className="full-map-wrapper" id="gujarat-map-canvas">
        <GujaratInteractiveMap
          key={selectedRegion}
          gu={gu}
          fy={fy}
          selectedDistrictId={regionDistrictId}
          regionFilter={selectedRegion}
          focusRequest={focusRequest}
          variant="explorer"
        />
      </div>
    </div>
  );
}
