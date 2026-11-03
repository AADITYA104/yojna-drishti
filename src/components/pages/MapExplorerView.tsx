"use client";

import React, { useState, useEffect } from "react";
import { Building2, Filter, MapPinned, Home, Layers, CheckCircle2 } from "lucide-react";
import { demoDistricts, demoSchemes, type District, type Village } from "@/lib/demo-data";
import { NOTEBOOK_WOMEN_SCHEMES, GHOGHA_48_VILLAGES } from "@/lib/master-hierarchy";
import { GujaratInteractiveMap } from "../map/GujaratInteractiveMap";
import { VillageSchemeRegister } from "../shared/VillageSchemeRegister";

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
  const [selectedScheme, setSelectedScheme] = useState(
    focusRequest?.target.kind === "scheme" ? focusRequest.target.id : "all",
  );
  const [selectedRegion, setSelectedRegion] = useState<"all" | District["region"]>("all");
  const regionDistrictId = selectedRegion === "all"
    ? "bhavnagar"
    : demoDistricts.find((district) => district.region === selectedRegion)?.id || "bhavnagar";

  // Village tracking state for the prominent transparency register
  const [selectedVillage, setSelectedVillage] = useState<{
    code: string;
    nameEn: string;
    nameGu: string;
    talukaNameEn?: string;
    talukaNameGu?: string;
    districtNameEn?: string;
    districtNameGu?: string;
  }>(() => {
    const defaultVillage = GHOGHA_48_VILLAGES.find((v) => v.code === "516307") || GHOGHA_48_VILLAGES[0];
    return {
      code: defaultVillage.code,
      nameEn: defaultVillage.nameEn,
      nameGu: defaultVillage.nameGu,
      talukaNameEn: "Ghogha",
      talukaNameGu: "ઘોઘા",
      districtNameEn: "Bhavnagar",
      districtNameGu: "ભાવનગર",
    };
  });

  // When focusRequest has a village target, sync to it
  useEffect(() => {
    if (focusRequest?.target.kind === "village" && focusRequest.target.villageCode) {
      const match = GHOGHA_48_VILLAGES.find((v) => v.code === focusRequest.target.villageCode);
      if (match) {
        setSelectedVillage({
          code: match.code,
          nameEn: match.nameEn,
          nameGu: match.nameGu,
          talukaNameEn: "Ghogha",
          talukaNameGu: "ઘોઘા",
          districtNameEn: "Bhavnagar",
          districtNameGu: "ભાવનગર",
        });
      }
    }
  }, [focusRequest]);

  const handleVillageSelectFromMap = (v: Village) => {
    setSelectedVillage({
      code: v.code,
      nameEn: v.name,
      nameGu: v.gu,
      talukaNameEn: "Ghogha",
      talukaNameGu: "ઘોઘા",
      districtNameEn: "Bhavnagar",
      districtNameGu: "ભાવનગર",
    });
  };

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
              ? "નકશા પર સ્ક્રોલથી ઝૂમ કરો અથવા જિલ્લા, તાલુકા અને ગામનું નામ પસંદ કરો. નીચે ગામ સ્તરીય સંપૂર્ણ યોજના રજિસ્ટર લાઇવ જુઓ."
              : "Scroll to zoom or select district, taluka, and village. View the full village-level transparency register below."}
          </p>
        </div>
        <div className="geo-explorer-filters">
          <label className="geo-filter-control">
            <span>{gu ? "યોજના" : "Scheme"}</span>
            <span className="geo-filter-select">
              <Filter size={15} />
              <select
                value={selectedScheme}
                onChange={(event) => setSelectedScheme(event.target.value)}
                aria-label={gu ? "યોજના પ્રમાણે ફિલ્ટર કરો" : "Filter by scheme"}
              >
                <option value="all">{gu ? "બધી યોજનાઓ" : "All schemes"}</option>
                <optgroup label={gu ? "ગામ ડેમો mapping · ઘોઘા" : "Village demo mapping · Ghogha"}>
                  {NOTEBOOK_WOMEN_SCHEMES.map((scheme) => (
                    <option key={scheme.id} value={scheme.id}>
                      {gu ? scheme.nameGu : scheme.nameEn}
                    </option>
                  ))}
                </optgroup>
                <optgroup label={gu ? "યોજના સૂચિ · ગામ mapping નથી" : "Scheme directory · no village mapping"}>
                  {demoSchemes.map((scheme) => (
                    <option key={scheme.id} value={scheme.id}>
                      {gu ? scheme.shortNameGu : scheme.shortName}
                    </option>
                  ))}
                </optgroup>
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

      {/* 1. Main Interactive Map */}
      <div className="full-map-wrapper">
        <GujaratInteractiveMap
          key={selectedRegion}
          gu={gu}
          fy={fy}
          selectedDistrictId={regionDistrictId}
          regionFilter={selectedRegion}
          schemeFilter={selectedScheme}
          focusRequest={focusRequest}
          onVillageSelect={handleVillageSelectFromMap}
          variant="explorer"
        />
      </div>

      {/* 2. Granular Village Transparency Register (Prominent & Full Featured) */}
      <section className="village-deep-intelligence-container" id="village-detail-register">
        <div className="vdi-header-bar">
          <div className="vdi-title-col">
            <div className="vdi-eyebrow">
              <Home size={16} />
              <span>
                {gu
                  ? "ગામ સ્તરીય યોજના અમલીકરણ અને લાભાર્થી પારદર્શિતા રજિસ્ટર"
                  : "VILLAGE SCHEME IMPLEMENTATION & BENEFICIARY REGISTRY"}
              </span>
              <span className="vdi-live-chip">
                {gu ? "સત્તાવાર LGD માળખું" : "Official LGD Hierarchy"}
              </span>
            </div>
            <h2>
              {gu
                ? `${selectedVillage.nameGu} ગામ — તમામ યોજનાઓ અને લાભાર્થીઓની વિગતવાર યાદી`
                : `${selectedVillage.nameEn} Village — All Schemes & Granular Beneficiaries Register`}
            </h2>
            <p>
              {gu
                ? "નકશામાં પસંદ કરેલ ગામમાં કઈ કઈ યોજનાઓ કાર્યરત છે, કેટલા નાણાં ચૂકવાયા અને કોણ કોણ લાભાર્થી છે તેની નામવાર પારદર્શક યાદી નીચે દર્શાવેલ છે."
                : "Real-time granular delivery tracking: active schemes in this village, disbursed funds, saturation rate, and citizen-level beneficiary records."}
            </p>
          </div>

          {/* Quick Village Dropdown Switcher */}
          <div className="vdi-quick-switcher">
            <label className="vdi-switcher-label">
              <span>{gu ? "ગામ ઝડપી પસંદ કરો:" : "Quick Village Switcher:"}</span>
              <select
                value={selectedVillage.code}
                onChange={(e) => {
                  const v = GHOGHA_48_VILLAGES.find((item) => item.code === e.target.value);
                  if (v) {
                    setSelectedVillage({
                      code: v.code,
                      nameEn: v.nameEn,
                      nameGu: v.nameGu,
                      talukaNameEn: "Ghogha",
                      talukaNameGu: "ઘોઘા",
                      districtNameEn: "Bhavnagar",
                      districtNameGu: "ભાવનગર",
                    });
                  }
                }}
                className="vdi-select-input"
              >
                {GHOGHA_48_VILLAGES.map((v) => (
                  <option key={v.code} value={v.code}>
                    {gu ? v.nameGu : v.nameEn} · {v.beneficiaries} {gu ? "લાભાર્થી" : "beneficiaries"}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Master Register Component */}
        <VillageSchemeRegister
          villageCode={selectedVillage.code}
          villageNameGu={selectedVillage.nameGu}
          villageNameEn={selectedVillage.nameEn}
          talukaNameGu={selectedVillage.talukaNameGu || "ઘોઘા"}
          talukaNameEn={selectedVillage.talukaNameEn || "Ghogha"}
          districtNameGu={selectedVillage.districtNameGu || "ભાવનગર"}
          districtNameEn={selectedVillage.districtNameEn || "Bhavnagar"}
          gu={gu}
          fy={fy}
        />
      </section>
    </div>
  );
}
