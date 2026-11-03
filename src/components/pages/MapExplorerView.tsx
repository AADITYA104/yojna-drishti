"use client";

import React, { useState, useEffect } from "react";
import { Building2, Filter, MapPinned } from "lucide-react";
import { demoDistricts, demoSchemes, type District } from "@/lib/demo-data";
import { NOTEBOOK_WOMEN_SCHEMES } from "@/lib/master-hierarchy";
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
  const [selectedScheme, setSelectedScheme] = useState(
    focusRequest?.target.kind === "scheme" ? focusRequest.target.id : "all",
  );

  useEffect(() => {
    if (focusRequest?.target.kind === "scheme") {
      setSelectedScheme(focusRequest.target.id);
    }
  }, [focusRequest]);
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
              ? "નકશા પર સ્ક્રોલથી ઝૂમ કરો અથવા જિલ્લા, તાલુકા અને ગામનું નામ પસંદ કરો."
              : "Scroll to zoom, or choose a district, taluka, and village by name."}
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

      <div className="full-map-wrapper">
        <GujaratInteractiveMap
          key={selectedRegion}
          gu={gu}
          fy={fy}
          selectedDistrictId={regionDistrictId}
          regionFilter={selectedRegion}
          schemeFilter={selectedScheme}
          focusRequest={focusRequest}
          variant="explorer"
        />
      </div>
    </div>
  );
}
