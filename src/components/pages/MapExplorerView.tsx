"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, FileSpreadsheet, Info, Landmark, MapPin, MapPinned } from "lucide-react";
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
      kind: "district" | "taluka" | "village" | "scheme" | "page";
      districtId?: string;
      subdistrictCode?: number;
      villageCode?: string;
    };
  } | null;
  initialDistrictId?: string;
  initialTalukaCode?: number | null;
  initialVillageCode?: string | null;
  onAreaChange?: (state: {
    districtId: string;
    talukaCode: number | null;
    villageCode: string | null;
    areaType?: "rural" | "urban" | null;
  }) => void;
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

const scopeCopy = {
  gu: {
    eyebrow: "પસંદ કરેલ data scope", district: "આખા પસંદ કરેલ જિલ્લાનો dataset સારાંશ", taluka: "આખા પસંદ કરેલ તાલુકાનો dataset સારાંશ", cityArea: "આખા પસંદ કરેલ શહેર/નગરનો dataset સારાંશ", city: "આખા પસંદ કરેલ શહેર/નગરનો dataset", village: "પસંદ કરેલ ગામનો dataset",
    districtDetail: "આ જિલ્લામાં જોડાયેલા બધા location codesની synthetic sample rowsનો સરવાળો નીચે બતાવવામાં આવે છે.",
    talukaDetail: "આ તાલુકામાં જોડાયેલા બધા location codesની synthetic sample rowsનો સરવાળો નીચે બતાવવામાં આવે છે.",
    cityAreaDetail: "આ શહેર-વહીવટી વિસ્તારમાં જોડાયેલા બધા location codesની synthetic sample rowsનો સરવાળો નીચે બતાવવામાં આવે છે.",
    cityDetail: "આ પસંદ કરેલ શહેર/નગરના ચોક્કસ location code સાથે જોડાયેલ તમામ source rows, scheme breakdown અને 39-column table નીચે ઉપલબ્ધ છે.",
    villageDetail: "આ પસંદ કરેલ ગામના ચોક્કસ location code સાથે જોડાયેલ તમામ source rows, scheme breakdown અને 39-column table નીચે ઉપલબ્ધ છે.",
    aggregate: "વિસ્તારનો સરવાળો", exact: "ચોક્કસ location code", next: "નીચે સંપૂર્ણ વિગત જુઓ", code: "LGD કોડ",
  },
  hi: {
    eyebrow: "चुना हुआ data scope", district: "पूरे चुने हुए जिले का dataset सार", taluka: "पूरे चुने हुए तालुका का dataset सार", cityArea: "पूरे चुने हुए शहर/नगर का dataset सार", city: "पूरे चुने हुए शहर/नगर का dataset", village: "चुने हुए गाँव का dataset",
    districtDetail: "नीचे इस जिले के सभी जुड़े location codes की synthetic sample rows का योग दिखता है।",
    talukaDetail: "नीचे इस तालुका के सभी जुड़े location codes की synthetic sample rows का योग दिखता है।",
    cityAreaDetail: "नीचे इस शहरी प्रशासनिक क्षेत्र के सभी जुड़े location codes की synthetic sample rows का योग दिखता है।",
    cityDetail: "नीचे चुने हुए शहर/नगर के सटीक location code से जुड़ी सभी source rows, scheme breakdown और 39-column table उपलब्ध है।",
    villageDetail: "नीचे चुने हुए गाँव के सटीक location code से जुड़ी सभी source rows, scheme breakdown और 39-column table उपलब्ध है।",
    aggregate: "क्षेत्र का योग", exact: "सटीक location code", next: "नीचे पूरी जानकारी देखें", code: "LGD कोड",
  },
  en: {
    eyebrow: "SELECTED DATA SCOPE", district: "Whole selected district dataset summary", taluka: "Whole selected taluka dataset summary", cityArea: "Whole selected city/town dataset summary", city: "Whole selected city/town dataset", village: "Selected village dataset",
    districtDetail: "The analysis below aggregates synthetic sample rows from every linked location code in this district.",
    talukaDetail: "The analysis below aggregates synthetic sample rows from every linked location code in this taluka.",
    cityAreaDetail: "The analysis below aggregates synthetic sample rows from every linked location code in this urban administrative area.",
    cityDetail: "The analysis below contains all source rows, scheme breakdowns, and the 39-column table linked to this selected city/town location code.",
    villageDetail: "The analysis below contains all source rows, scheme breakdowns, and the 39-column table linked to this selected village location code.",
    aggregate: "Area aggregate", exact: "Exact location code", next: "See the complete detail below", code: "LGD code",
  },
} as const;

export function MapExplorerView({
  gu,
  lang,
  fy,
  focusRequest = null,
  initialDistrictId = "bhavnagar",
  initialTalukaCode = null,
  initialVillageCode = null,
  onAreaChange,
}: MapExplorerViewProps) {
  const [activeDistrictId, setActiveDistrictId] = useState(focusRequest?.target?.districtId || initialDistrictId || "bhavnagar");
  const [previousFocusRequestId, setPreviousFocusRequestId] = useState(focusRequest?.id);
  const [selectedArea, setSelectedArea] = useState<MapSelectedArea | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapSelectedLocation | null>(null);

  const effectiveFocusRequest = useMemo(() => {
    if (focusRequest) return focusRequest;
    if (initialVillageCode) {
      return {
        id: -1,
        target: {
          id: initialVillageCode,
          kind: "village" as const,
          districtId: initialDistrictId || "bhavnagar",
          subdistrictCode: initialTalukaCode ?? undefined,
          villageCode: initialVillageCode,
        },
      };
    }
    if (initialTalukaCode) {
      return {
        id: -2,
        target: {
          id: String(initialTalukaCode),
          kind: "taluka" as const,
          districtId: initialDistrictId || "bhavnagar",
          subdistrictCode: initialTalukaCode,
        },
      };
    }
    if (initialDistrictId && initialDistrictId !== "bhavnagar") {
      return {
        id: -3,
        target: {
          id: initialDistrictId,
          kind: "district" as const,
          districtId: initialDistrictId,
        },
      };
    }
    return null;
  }, [focusRequest, initialDistrictId, initialTalukaCode, initialVillageCode]);

  useEffect(() => {
    onAreaChange?.({
      districtId: activeDistrictId || "bhavnagar",
      talukaCode: selectedArea?.subdistrictCode ? Number(selectedArea.subdistrictCode) : initialTalukaCode,
      villageCode: selectedLocation?.locationCode || initialVillageCode,
      areaType: selectedLocation?.category?.toLowerCase() === "urban" ? "urban" : selectedLocation ? "rural" : null,
    });
  }, [activeDistrictId, selectedArea, selectedLocation, onAreaChange, initialTalukaCode, initialVillageCode]);

  if (effectiveFocusRequest?.target?.districtId && effectiveFocusRequest.id !== previousFocusRequestId) {
    setPreviousFocusRequestId(effectiveFocusRequest.id);
    setActiveDistrictId(effectiveFocusRequest.target.districtId);
  }

  const copy = selectionCopy[lang];
  const scope = scopeCopy[lang];
  const selectedDistrictName = demoDistricts.find((district) => district.id === activeDistrictId);
  const selectedScope = useMemo(() => {
    if (selectedLocation) {
      const isCity = selectedLocation.category?.toLowerCase() === "urban";
      const name = lang === "gu"
        ? selectedLocation.nameGu || selectedLocation.nameEn
        : lang === "hi" ? localizeText("hi", selectedLocation.nameEn) : selectedLocation.nameEn;
      return {
        key: `location-${selectedLocation.locationCode}`,
        kind: isCity ? "city" : "village",
        name,
        title: isCity ? scope.city : scope.village,
        description: isCity ? scope.cityDetail : scope.villageDetail,
        detail: `${scope.exact} · ${scope.code} ${selectedLocation.locationCode}`,
      };
    }
    if (selectedArea) {
      const isTaluka = selectedArea.level === "taluka";
      const isCityArea = isTaluka && /city|urban/i.test(selectedArea.areaNameEn);
      const name = lang === "gu"
        ? selectedArea.areaNameGu || selectedArea.areaNameEn
        : lang === "hi" ? localizeText("hi", selectedArea.areaNameEn) : selectedArea.areaNameEn;
      return {
        key: `${selectedArea.level}-${selectedArea.districtCode}-${selectedArea.subdistrictCode || "all"}`,
        kind: isCityArea ? "city" : selectedArea.level,
        name,
        title: isCityArea ? scope.cityArea : isTaluka ? scope.taluka : scope.district,
        description: isCityArea ? scope.cityAreaDetail : isTaluka ? scope.talukaDetail : scope.districtDetail,
        detail: `${scope.aggregate} · ${scope.code} ${isTaluka ? selectedArea.subdistrictCode : selectedArea.districtCode}`,
      };
    }
    return null;
  }, [lang, scope, selectedArea, selectedLocation]);

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
            focusRequest={effectiveFocusRequest}
            onDistrictSelect={(district) => setActiveDistrictId(district.id)}
            onAreaSelect={setSelectedArea}
            onLocationSelect={setSelectedLocation}
            variant="explorer"
          />
        </div>
      </section>

      <section className="location-baseline-section pt-2" aria-live="polite">
        <AnimatePresence mode="wait">
          {selectedScope && (
            <motion.div
              key={selectedScope.key}
              className={`map-data-scope map-data-scope--${selectedScope.kind}`}
              initial={{ opacity: 0, y: 14, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.985 }}
              transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.72 }}
            >
              <span className="map-data-scope-icon" aria-hidden="true">
                {selectedScope.kind === "district" ? <Building2 size={20} /> : selectedScope.kind === "taluka" ? <Landmark size={20} /> : <MapPin size={20} />}
              </span>
              <div className="map-data-scope-copy">
                <span>{scope.eyebrow}</span>
                <h2>{selectedScope.title}</h2>
                <p><strong>{selectedScope.name}</strong> · {selectedScope.description}</p>
              </div>
              <div className="map-data-scope-meta"><span><FileSpreadsheet size={14} />{selectedScope.detail}</span><small>{scope.next}</small></div>
            </motion.div>
          )}
        </AnimatePresence>
        {selectedLocation ? (
          <LocationAnalyticsDashboard key={selectedLocation.locationCode} location={selectedLocation} lang={lang} />
        ) : selectedArea ? (
          <AreaSchemeAnalyticsDashboard
            key={`${selectedArea.districtCode}-${selectedArea.subdistrictCode || "district"}`}
            area={selectedArea}
            lang={lang}
            onSelectLocation={setSelectedLocation}
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
