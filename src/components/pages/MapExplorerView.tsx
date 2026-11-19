"use client";

import React, { useState } from "react";
import { Info, MapPinned } from "lucide-react";
import { localizeText, type AppLanguage } from "@/lib/i18n";
import { demoDistricts } from "@/lib/demo-data";
import { GujaratInteractiveMap, type MapSelectedArea, type MapSelectedLocation } from "../map/GujaratInteractiveMap";
import { LocationAnalyticsDashboard } from "../map/LocationAnalyticsDashboard";
import { AreaSchemeAnalyticsDashboard } from "../map/AreaSchemeAnalyticsDashboard";

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

const selectionCopy = {
  gu: {
    title: "વિશ્લેષણ માટે નકશા પરથી વિસ્તાર પસંદ કરો",
    body: "નકશાની સીમાઓ સરકારી ભૌગોલિક સ્રોતો પર આધારિત છે. યોજનાની હરોળો આપેલા કૃત્રિમ નમૂનાના ડેટા છે; સત્તાવાર લાભાર્થી કે ચુકવણીના આંકડા જોડાયેલા નથી.",
    source: "ભૌગોલિક મેળ",
    coverage: "ચોક્કસ ગામ/શહેર સીમા કોડ મેળ",
  },
  hi: {
    title: "विश्लेषण के लिए नक्शे से क्षेत्र चुनें",
    body: "नक्शे की सीमाएँ सरकारी भौगोलिक स्रोतों पर आधारित हैं। योजना की पंक्तियाँ दिए गए कृत्रिम नमूना डेटा से हैं; आधिकारिक लाभार्थी या भुगतान आँकड़े जुड़े नहीं हैं।",
    source: "भौगोलिक मिलान",
    coverage: "गाँव/शहर की सटीक सीमा-कोड मिलान",
  },
  en: {
    title: "Choose an area on the map to see its analysis",
    body: "Map boundaries use government geographic sources. Scheme rows come from the supplied synthetic sample dataset; official beneficiary and payment totals are not connected.",
    source: "Geographic match",
    coverage: "Exact village/city boundary-code match",
  },
} as const;

export function MapExplorerView({ gu, lang, fy, focusRequest = null }: MapExplorerViewProps) {
  const [activeDistrictId, setActiveDistrictId] = useState(focusRequest?.target?.districtId || "");
  const [previousFocusRequestId, setPreviousFocusRequestId] = useState(focusRequest?.id);
  const [selectedArea, setSelectedArea] = useState<MapSelectedArea | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapSelectedLocation | null>(null);

  if (focusRequest?.target?.districtId && focusRequest.id !== previousFocusRequestId) {
    setPreviousFocusRequestId(focusRequest.id);
    setActiveDistrictId(focusRequest.target.districtId);
  }

  const copy = selectionCopy[lang];
  const selectedDistrictName = demoDistricts.find((district) => district.id === activeDistrictId);

  return (
    <div className="map-explorer-page w-full space-y-6">
      <header className="geo-explorer-header reveal">
        <div className="geo-explorer-title">
          <span className="geo-explorer-eyebrow">
            <MapPinned size={15} aria-hidden="true" />
            {lang === "gu" ? "ગુજરાત ભૌગોલિક એક્સપ્લોરર" : lang === "hi" ? "गुजरात भौगोलिक एक्सप्लोरर" : "GUJARAT GEOGRAPHIC EXPLORER"}
          </span>
          <h1>
            {lang === "gu" ? "ગુજરાતનો વહીવટી નકશો" : lang === "hi" ? "गुजरात का प्रशासनिक नक्शा" : "Gujarat administrative map"}
          </h1>
          <p>
            {lang === "gu"
              ? "જિલ્લાથી તાલુકા અને પછી ગામ/શહેર સુધી ઝૂમ કરો. નામ અથવા LGD કોડથી શોધો."
              : lang === "hi"
                ? "जिले से तालुका और फिर गाँव/शहर तक ज़ूम करें। नाम या LGD कोड से खोजें।"
                : "Zoom from district to taluka, then to village or city. Search by place name or LGD code."}
          </p>
        </div>
      </header>

      <section className="map-showcase-section reveal" id="gujarat-map-canvas">
        <div className="full-map-wrapper">
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
      </section>

      <section className="location-baseline-section pt-2 reveal" aria-live="polite">
        {selectedLocation ? (
          <LocationAnalyticsDashboard key={selectedLocation.locationCode} location={selectedLocation} lang={lang} />
        ) : selectedArea ? (
          <AreaSchemeAnalyticsDashboard
            key={`${selectedArea.districtCode}-${selectedArea.subdistrictCode || "district"}`}
            area={selectedArea}
            lang={lang}
          />
        ) : (
          <div className="map-selection-prompt" role="status">
            <Info size={21} aria-hidden="true" />
            <div>
              <span className="map-selection-kicker">{copy.source}</span>
              <strong>{copy.title}</strong>
              <p>{copy.body}</p>
              <small>{copy.coverage}: 18,110 / 18,818</small>
            </div>
          </div>
        )}
      </section>

      <section className="geo-data-disclaimer map-data-status" role="status">
        <MapPinned size={18} aria-hidden="true" />
        <div>
          <strong>
            {lang === "gu" ? "ગુજરાત વહીવટી નકશાની સીમા માહિતી" : lang === "hi" ? "गुजरात प्रशासनिक नक्शा सीमा डेटा" : "Gujarat administrative-boundary data"}
          </strong>
          <p>
            {lang === "gu"
              ? `જિલ્લા: ૩૪ · તાલુકા: ૩૦૯ · ${selectedDistrictName?.gu ? `પસંદ કરેલ જિલ્લો: ${selectedDistrictName.gu} · ` : ""}ગામ/શહેરની ચોક્કસ સીમા કોડ મેળ: ૧૮,૧૧૦ / ૧૮,૮૧૮. આ ભૂગોળની મેળ સ્થિતિ છે, યોજના કવરેજ નથી.`
              : lang === "hi"
                ? `जिले: ३४ · तालुका: ३०९ · ${selectedDistrictName?.name ? `चयनित जिला: ${localizeText("hi", selectedDistrictName.name)} · ` : ""}गाँव/शहर का सटीक सीमा-कोड मिलान: १८,११० / १८,८१८। यह भूगोल मिलान है, योजना कवरेज नहीं।`
                : `Districts: 34 · Talukas: 309 · ${selectedDistrictName?.name ? `Selected district: ${selectedDistrictName.name} · ` : ""}Exact village/city boundary-code matches: 18,110 / 18,818. This describes geographic matching, not scheme coverage.`}
          </p>
        </div>
      </section>
    </div>
  );
}
