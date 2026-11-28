"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Building2,
  Compass,
  MapPin,
  Map as MapIcon,
  Search,
  CheckCircle2,
  Clock,
  FileQuestion,
  XCircle,
  UsersRound,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import { localizeText, type AppLanguage } from "@/lib/i18n";
import { MASTER_DISTRICTS, MASTER_SUBDISTRICTS } from "@/lib/master-hierarchy";
import { DataBadge } from "@/components/ui/DataBadge";
import { CardSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { VillageSchemeRegister } from "@/components/shared/VillageSchemeRegister";
import type { SettlementSummary } from "@/app/api/v1/analytics/settlements/route";

export type InspectorLevel = "city" | "district" | "taluka" | "village";

interface SmartAreaInspectorProps {
  lang: AppLanguage;
  onFocusMap?: (item: {
    id: string;
    label: string;
    detail: string;
    kind: "district" | "taluka" | "village" | "scheme";
    districtId?: string;
    subdistrictCode?: number;
    villageCode?: string;
  }) => void;
}

type SchemeActivity = {
  approved?: number;
  serviceDelivered?: number;
  activityRecorded?: number;
  pending?: number;
  documentsPending?: number;
  rejected?: number;
  notApplied?: number;
};

type SchemeDetail = {
  id: string;
  nameEn: string;
  nameGu: string;
  count: number;
  sampleRows?: number;
  activity?: SchemeActivity;
  gender?: Record<string, number>;
  eligibility?: Record<string, number>;
};

type LocationPayload = {
  status: string;
  data: {
    code: string;
    nameEn: string;
    nameGu: string;
    category: string;
    talukaCode: string;
    talukaEn: string;
    talukaGu: string;
    districtCode: string;
    districtEn: string;
    districtGu: string;
    schemes: Record<string, SchemeDetail>;
  } | null;
};

type AreaPayload = {
  status: string;
  data: {
    area: {
      level: "district" | "taluka";
      districtCode: string;
      districtNameEn: string;
      districtNameGu: string;
      subdistrictCode?: string;
      areaNameEn: string;
      areaNameGu: string;
    };
    locationCount: number;
    urbanCount: number;
    ruralCount: number;
    sampleRecordCount: number;
    totalActivity: SchemeActivity;
    totalGender: Record<string, number>;
    urbanLocations: Array<{
      code: string;
      nameEn: string;
      nameGu: string;
      talukaEn: string;
      talukaGu: string;
      sampleRows: number;
    }>;
    schemes: Array<{
      id: string;
      nameEn: string;
      nameGu: string;
      sampleRows: number;
      locationsWithRows: number;
      activity: SchemeActivity;
      gender: Record<string, number>;
    }>;
  } | null;
};

import { smartAreaInspectorCopy as copy } from "@/lib/inspector-i18n.ts";

// Top prominent cities in Gujarat with LGD codes from dataset
const POPULAR_CITIES = [
  { code: "516249", nameEn: "Bhavnagar (Ruva)", nameGu: "ભાવનગર શહેર", districtCode: "443" },
  { code: "511497", nameEn: "Ahmedabad (Sabalpura)", nameGu: "અમદાવાદ શહેર", districtCode: "438" },
  { code: "523753", nameEn: "Surat (Umra)", nameGu: "સુરત શહેર", districtCode: "459" },
  { code: "519857", nameEn: "Vadodara (Vadadla)", nameGu: "વડોદરા શહેર", districtCode: "461" },
  { code: "513004", nameEn: "Rajkot (Ghanteshvar)", nameGu: "રાજકોટ શહેર", districtCode: "457" },
  { code: "513673", nameEn: "Jamnagar (OG)", nameGu: "જામનગર શહેર", districtCode: "447" },
  { code: "511185", nameEn: "Gandhinagar (Kalol)", nameGu: "ગાંધીનગર શહેર", districtCode: "446" },
  { code: "930087", nameEn: "Junagadh (Bhavnath)", nameGu: "જૂનાગઢ શહેર", districtCode: "448" },
  { code: "516914", nameEn: "Anand (Lambhvel)", nameGu: "આણંદ નગર", districtCode: "440" },
  { code: "961595", nameEn: "Bharuch (Aali)", nameGu: "ભરૂચ નગર", districtCode: "442" },
  { code: "522869", nameEn: "Navsari (Viraval)", nameGu: "નવસારી નગર", districtCode: "453" },
  { code: "956072", nameEn: "Palitana Town", nameGu: "પાલિતાણા નગર", districtCode: "443" },
];

export function SmartAreaInspector({ lang, onFocusMap }: SmartAreaInspectorProps) {
  const t = copy[lang];
  const [level, setLevel] = useState<InspectorLevel>("city");

  // Selection states (Default: Bhavnagar pilot district)
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<string>("443");
  const [selectedTalukaCode, setSelectedTalukaCode] = useState<string>("3855");
  const [selectedCityCode, setSelectedCityCode] = useState<string>("516249");
  const [selectedVillageCode, setSelectedVillageCode] = useState<string>("516291");

  // Data lists
  const [urbanSettlements, setUrbanSettlements] = useState<SettlementSummary[]>([]);
  const [villageList, setVillageList] = useState<Array<{ code: string; nameEn: string; nameGu?: string }>>([]);
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [villageSearchQuery, setVillageSearchQuery] = useState("");

  // Detailed payloads
  const [locationData, setLocationData] = useState<LocationPayload["data"]>(null);
  const [areaData, setAreaData] = useState<AreaPayload["data"]>(null);
  const [fetchedTarget, setFetchedTarget] = useState<string>("");
  const [showFullTable, setShowFullTable] = useState(false);

  const currentTarget = useMemo(() => {
    if (level === "city") return `city-${selectedCityCode}`;
    if (level === "village") return `village-${selectedVillageCode}`;
    if (level === "taluka") return `taluka-${selectedDistrictCode}-${selectedTalukaCode}`;
    return `district-${selectedDistrictCode}`;
  }, [level, selectedCityCode, selectedVillageCode, selectedDistrictCode, selectedTalukaCode]);

  const isLoading = fetchedTarget !== currentTarget;

  // Load all urban settlements once for the city tab
  useEffect(() => {
    fetch("/api/v1/analytics/settlements?category=Urban&limit=all")
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (payload?.status === "success" && Array.isArray(payload.data)) {
          setUrbanSettlements(payload.data);
        }
      })
      .catch(() => {});
  }, []);

  // Filter talukas for selected district
  const availableTalukas = useMemo(() => {
    const dCode = parseInt(selectedDistrictCode, 10);
    return MASTER_SUBDISTRICTS.filter((sub) => sub.districtCode === dCode);
  }, [selectedDistrictCode]);

  // Load villages when taluka changes (for village tab)
  useEffect(() => {
    if (level !== "village" || !selectedTalukaCode) return;
    fetch(`/api/v1/geo/hierarchy?subdistrictCode=${selectedTalukaCode}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (payload?.status === "success" && Array.isArray(payload.data)) {
          const list = payload.data.map((v: { code: string; nameEn: string }) => ({
            code: String(v.code),
            nameEn: v.nameEn,
          }));
          setVillageList(list);
          if (list.length > 0 && !list.some((v: { code: string }) => v.code === selectedVillageCode)) {
            setSelectedVillageCode(list[0].code);
          }
        }
      })
      .catch(() => {});
  }, [level, selectedTalukaCode, selectedVillageCode]);

  // Fetch inspection data whenever selection changes
  useEffect(() => {
    let active = true;

    if (level === "city" || level === "village") {
      const codeToFetch = level === "city" ? selectedCityCode : selectedVillageCode;
      if (!codeToFetch) return;

      fetch(`/api/v1/analytics/location?locationCode=${codeToFetch}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((payload: LocationPayload) => {
          if (!active) return;
          if (payload?.status === "success" && payload.data) {
            setLocationData(payload.data);
            setAreaData(null);
          } else {
            setLocationData(null);
          }
          setFetchedTarget(currentTarget);
        })
        .catch(() => {
          if (active) {
            setLocationData(null);
            setFetchedTarget(currentTarget);
          }
        });
    } else {
      // Area level: district or taluka
      const params = new URLSearchParams({ districtCode: selectedDistrictCode });
      if (level === "taluka" && selectedTalukaCode) {
        params.set("subdistrictCode", selectedTalukaCode);
      }
      fetch(`/api/v1/analytics/area?${params.toString()}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((payload: AreaPayload) => {
          if (!active) return;
          if (payload?.status === "success" && payload.data) {
            setAreaData(payload.data);
            setLocationData(null);
          } else {
            setAreaData(null);
          }
          setFetchedTarget(currentTarget);
        })
        .catch(() => {
          if (active) {
            setAreaData(null);
            setFetchedTarget(currentTarget);
          }
        });
    }

    return () => {
      active = false;
    };
  }, [level, selectedCityCode, selectedVillageCode, selectedDistrictCode, selectedTalukaCode, currentTarget]);

  // Filtered cities list
  const filteredCities = useMemo(() => {
    let list = urbanSettlements;
    if (citySearchQuery.trim()) {
      const q = citySearchQuery.trim().toLowerCase();
      return list.filter(
        (c) =>
          c.nameEn.toLowerCase().includes(q) ||
          c.nameGu.includes(q) ||
          c.code.includes(q) ||
          c.talukaEn.toLowerCase().includes(q) ||
          c.districtEn.toLowerCase().includes(q)
      );
    }
    if (selectedDistrictCode && selectedDistrictCode !== "all") {
      list = list.filter((c) => c.districtCode === selectedDistrictCode);
    }
    return list;
  }, [urbanSettlements, selectedDistrictCode, citySearchQuery]);

  // Filtered villages list
  const filteredVillages = useMemo(() => {
    if (!villageSearchQuery.trim()) return villageList;
    const q = villageSearchQuery.trim().toLowerCase();
    return villageList.filter((v) => v.nameEn.toLowerCase().includes(q) || v.code.includes(q));
  }, [villageList, villageSearchQuery]);

  // Active district / taluka names
  const activeDistrict = useMemo(
    () => MASTER_DISTRICTS.find((d) => String(d.code) === selectedDistrictCode),
    [selectedDistrictCode]
  );
  const activeTaluka = useMemo(
    () => MASTER_SUBDISTRICTS.find((s) => String(s.code) === selectedTalukaCode),
    [selectedTalukaCode]
  );

  // Compute summary numbers
  const summary = useMemo(() => {
    if (locationData) {
      const schemesList = Object.values(locationData.schemes || {});
      const totalSchemes = schemesList.length;
      const activeSchemes = schemesList.filter((s) => s.count > 0).length;
      const totalRows = schemesList.reduce((sum, s) => sum + s.count, 0);

      let approvedOrDelivered = 0;
      let totalFemales = 0;
      let totalAssignedGender = 0;

      for (const s of schemesList) {
        if (s.activity) {
          approvedOrDelivered += (s.activity.approved || 0) + (s.activity.serviceDelivered || 0);
        }
        if (s.gender) {
          const f = s.gender.female || 0;
          const m = s.gender.male || 0;
          totalFemales += f;
          totalAssignedGender += f + m;
        }
      }

      const approvalRate = totalRows > 0 ? ((approvedOrDelivered / totalRows) * 100).toFixed(1) : "0.0";
      const femaleRate = totalAssignedGender > 0 ? ((totalFemales / totalAssignedGender) * 100).toFixed(0) : "95";

      return {
        totalSchemes,
        activeSchemes,
        totalRows,
        approvalRate,
        femaleRate,
        schemesList,
      };
    } else if (areaData) {
      const totalSchemes = areaData.schemes.length;
      const activeSchemes = areaData.schemes.filter((s) => s.sampleRows > 0).length;
      const totalRows = areaData.sampleRecordCount;

      const approvedOrDelivered =
        (areaData.totalActivity?.approved || 0) + (areaData.totalActivity?.serviceDelivered || 0);
      const approvalRate = totalRows > 0 ? ((approvedOrDelivered / totalRows) * 100).toFixed(1) : "0.0";

      const totalFemales = areaData.totalGender?.female || 0;
      const totalMales = areaData.totalGender?.male || 0;
      const totalGender = totalFemales + totalMales;
      const femaleRate = totalGender > 0 ? ((totalFemales / totalGender) * 100).toFixed(0) : "90";

      return {
        totalSchemes,
        activeSchemes,
        totalRows,
        approvalRate,
        femaleRate,
        schemesList: areaData.schemes.map((s) => ({
          ...s,
          count: s.sampleRows,
        })),
      };
    }
    return null;
  }, [locationData, areaData]);

  // Navigate to map view with target
  const handleJumpToMap = useCallback(() => {
    if (!onFocusMap) return;
    if (level === "city" && locationData) {
      onFocusMap({
        id: locationData.code,
        label: lang === "gu" ? locationData.nameGu || locationData.nameEn : locationData.nameEn,
        detail: `${locationData.category} · ${locationData.districtEn}`,
        kind: "village",
        districtId: activeDistrict?.id || "bhavnagar",
        subdistrictCode: parseInt(locationData.talukaCode, 10),
        villageCode: locationData.code,
      });
    } else if (level === "village" && locationData) {
      onFocusMap({
        id: locationData.code,
        label: lang === "gu" ? locationData.nameGu || locationData.nameEn : locationData.nameEn,
        detail: `Village · ${locationData.talukaEn}`,
        kind: "village",
        districtId: activeDistrict?.id || "bhavnagar",
        subdistrictCode: parseInt(locationData.talukaCode, 10),
        villageCode: locationData.code,
      });
    } else if (level === "taluka" && activeTaluka) {
      onFocusMap({
        id: String(activeTaluka.code),
        label: lang === "gu" ? activeTaluka.nameGu : activeTaluka.nameEn,
        detail: `Taluka · ${activeTaluka.districtNameEn}`,
        kind: "taluka",
        districtId: activeTaluka.districtId,
        subdistrictCode: activeTaluka.code,
      });
    } else if (level === "district" && activeDistrict) {
      onFocusMap({
        id: activeDistrict.id,
        label: lang === "gu" ? activeDistrict.nameGu : activeDistrict.nameEn,
        detail: `District · ${activeDistrict.officialNo}`,
        kind: "district",
        districtId: activeDistrict.id,
      });
    }
  }, [level, locationData, activeTaluka, activeDistrict, onFocusMap, lang]);

  const displayName = useMemo(() => {
    if (level === "city" || level === "village") {
      if (!locationData) return "";
      return lang === "gu" ? locationData.nameGu || locationData.nameEn : locationData.nameEn;
    } else if (level === "taluka") {
      if (!activeTaluka) return "";
      return lang === "gu" ? activeTaluka.nameGu : activeTaluka.nameEn;
    } else {
      if (!activeDistrict) return "";
      return lang === "gu" ? activeDistrict.nameGu : activeDistrict.nameEn;
    }
  }, [level, locationData, activeTaluka, activeDistrict, lang]);

  const parentBreadcrumb = useMemo(() => {
    if (level === "city" || level === "village") {
      if (!locationData) return "";
      const d = lang === "gu" ? locationData.districtGu : locationData.districtEn;
      const t = lang === "gu" ? locationData.talukaGu : locationData.talukaEn;
      return `${d} › ${t}`;
    } else if (level === "taluka") {
      if (!activeDistrict) return "";
      return lang === "gu" ? activeDistrict.nameGu : activeDistrict.nameEn;
    }
    return lang === "gu" ? "ગુજરાત રાજ્ય" : "Gujarat State";
  }, [level, locationData, activeDistrict, lang]);

  return (
    <section className="dx-inspector" aria-labelledby="dx-inspector-title">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 640px) {
              .dx-inspector__controls {
                padding-right: 56px !important;
              }
            }
            .dx-meter-bar {
              height: 20px !important;
              display: flex !important;
              border-radius: 6px !important;
              overflow: hidden !important;
            }
            .dx-meter-seg {
              display: inline-flex !important;
              align-items: center !important;
              justify-content: center !important;
              height: 100% !important;
              position: relative !important;
            }
            .dx-meter-pct {
              font-size: 0.625rem;
              font-weight: 750;
              color: #ffffff;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
              line-height: 1;
              pointer-events: none;
              user-select: none;
            }
          `,
        }}
      />
      {/* 1. Header */}
      <div className="dx-inspector__head">
        <div className="dx-inspector__title-group">
          <div className="dx-inspector__badge-strip">
            <span className="dx-tag">
              <Compass size={14} aria-hidden="true" />
              {t.title}
            </span>
            <DataBadge type="DEMO" label={t.badge} />
          </div>
          <h2 id="dx-inspector-title" className="dx-inspector__title">
            {t.title}
          </h2>
          <p className="dx-inspector__sub">{t.subtitle}</p>
        </div>

        {/* 2. Level Segmented Switcher */}
        <div className="dx-inspector__tabs" role="tablist" aria-label={t.title}>
          <button
            type="button"
            role="tab"
            aria-selected={level === "city"}
            className={`dx-inspector__tab ${level === "city" ? "dx-inspector__tab--active" : ""}`}
            onClick={() => setLevel("city")}
          >
            {t.levels.city}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={level === "district"}
            className={`dx-inspector__tab ${level === "district" ? "dx-inspector__tab--active" : ""}`}
            onClick={() => setLevel("district")}
          >
            {t.levels.district}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={level === "taluka"}
            className={`dx-inspector__tab ${level === "taluka" ? "dx-inspector__tab--active" : ""}`}
            onClick={() => setLevel("taluka")}
          >
            {t.levels.taluka}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={level === "village"}
            className={`dx-inspector__tab ${level === "village" ? "dx-inspector__tab--active" : ""}`}
            onClick={() => setLevel("village")}
          >
            {t.levels.village}
          </button>
        </div>
      </div>

      {/* 3. Controls / Filter Row */}
      <div className="dx-inspector__controls">
        {/* District Selector (shown in all tabs except direct city chips when convenient) */}
        <div className="dx-control-field">
          <label htmlFor="dx-district-select" className="dx-control-label">
            {t.selectDistrict}
          </label>
          <select
            id="dx-district-select"
            className="dx-select"
            value={selectedDistrictCode}
            onChange={(e) => {
              const newDCode = e.target.value;
              setSelectedDistrictCode(newDCode);
              const dCode = parseInt(newDCode, 10);
              const talukas = MASTER_SUBDISTRICTS.filter((sub) => sub.districtCode === dCode);
              if (talukas.length > 0) setSelectedTalukaCode(String(talukas[0].code));
              const citiesInDistrict = urbanSettlements.filter((c) => c.districtCode === newDCode);
              if (citiesInDistrict.length > 0) {
                setSelectedCityCode(citiesInDistrict[0].code);
              }
            }}
          >
            {MASTER_DISTRICTS.map((d) => (
              <option key={d.code} value={String(d.code)}>
                {lang === "gu" ? d.nameGu : d.nameEn} ({d.officialNo})
              </option>
            ))}
          </select>
        </div>

        {/* Taluka Selector (shown for Taluka and Village tabs) */}
        {(level === "taluka" || level === "village") && (
          <div className="dx-control-field">
            <label htmlFor="dx-taluka-select" className="dx-control-label">
              {t.selectTaluka}
            </label>
            <select
              id="dx-taluka-select"
              className="dx-select"
              value={selectedTalukaCode}
              onChange={(e) => setSelectedTalukaCode(e.target.value)}
            >
              {availableTalukas.map((sub) => (
                <option key={sub.code} value={String(sub.code)}>
                  {lang === "gu" ? sub.nameGu : sub.nameEn}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* City Selector & Search (for City tab) */}
        {level === "city" && (
          <>
            <div className="dx-control-field dx-control-field--grow">
              <label htmlFor="dx-city-search" className="dx-control-label">
                {t.searchCityPlaceholder}
              </label>
              <div className="dx-input-wrapper">
                <Search size={16} aria-hidden="true" />
                <input
                  id="dx-city-search"
                  type="text"
                  className="dx-input"
                  placeholder={t.searchCityPlaceholder}
                  value={citySearchQuery}
                  onChange={(e) => setCitySearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="dx-control-field">
              <label htmlFor="dx-city-select" className="dx-control-label">
                {t.selectSettlement}
              </label>
              <select
                id="dx-city-select"
                className="dx-select"
                value={selectedCityCode}
                onChange={(e) => {
                  const newCode = e.target.value;
                  setSelectedCityCode(newCode);
                  const match = urbanSettlements.find((c) => c.code === newCode);
                  if (match?.districtCode) {
                    setSelectedDistrictCode(match.districtCode);
                    if (match.talukaCode) setSelectedTalukaCode(match.talukaCode);
                  }
                }}
              >
                {filteredCities.slice(0, 80).map((c) => (
                  <option key={c.code} value={c.code}>
                    {lang === "gu" && c.nameGu ? c.nameGu : c.nameEn} ({c.talukaEn})
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Village Selector & Search (for Village tab) */}
        {level === "village" && (
          <>
            <div className="dx-control-field dx-control-field--grow">
              <label htmlFor="dx-village-search" className="dx-control-label">
                {t.searchVillagePlaceholder}
              </label>
              <div className="dx-input-wrapper">
                <Search size={16} aria-hidden="true" />
                <input
                  id="dx-village-search"
                  type="text"
                  className="dx-input"
                  placeholder={t.searchVillagePlaceholder}
                  value={villageSearchQuery}
                  onChange={(e) => setVillageSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="dx-control-field">
              <label htmlFor="dx-village-select" className="dx-control-label">
                {t.selectVillage}
              </label>
              <select
                id="dx-village-select"
                className="dx-select"
                value={selectedVillageCode}
                onChange={(e) => setSelectedVillageCode(e.target.value)}
              >
                {filteredVillages.map((v) => (
                  <option key={v.code} value={v.code}>
                    {lang === "gu" && v.nameGu ? v.nameGu : v.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      {/* Quick City Chips (only in City tab) */}
      {level === "city" && (
        <div className="dx-inspector__chips">
          <span className="dx-inspector__chips-label">{t.popularCities}</span>
          <div className="dx-inspector__chips-list">
            {POPULAR_CITIES.map((city) => (
              <button
                key={city.code}
                type="button"
                className={`dx-chip ${selectedCityCode === city.code ? "dx-chip--active" : ""}`}
                onClick={() => {
                  setSelectedCityCode(city.code);
                  setSelectedDistrictCode(city.districtCode);
                  const match = urbanSettlements.find((c) => c.code === city.code);
                  if (match?.talukaCode) setSelectedTalukaCode(match.talukaCode);
                }}
              >
                <Building2 size={13} aria-hidden="true" />
                {lang === "gu" ? city.nameGu : city.nameEn}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Details / Stats Card */}
      {isLoading ? (
        <div className="dx-inspector__loading">
          <Skeleton height={140} />
          <div className="dx-inspector__kpi-grid">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      ) : summary ? (
        <div className="dx-inspector__content">
          {/* Active Area Banner */}
          <div className="dx-area-banner">
            <div className="dx-area-banner__main">
              <span className="dx-area-banner__breadcrumb">{parentBreadcrumb}</span>
              <div className="dx-area-banner__title-row">
                <span className="dx-area-banner__icon">
                  {level === "city" ? (
                    <Building2 size={24} />
                  ) : level === "village" ? (
                    <MapPin size={24} />
                  ) : level === "taluka" ? (
                    <Layers size={24} />
                  ) : (
                    <MapIcon size={24} />
                  )}
                </span>
                <h3 className="dx-area-banner__name">{displayName}</h3>
                <span className="dx-area-badge">
                  {level === "city"
                    ? t.urbanBadge
                    : level === "village"
                    ? t.ruralBadge
                    : level === "taluka"
                    ? t.levels.taluka
                    : t.levels.district}
                </span>
                {(locationData?.code || activeTaluka?.code || activeDistrict?.officialNo) && (
                  <span className="dx-lgd-badge">
                    {t.lgdCode}:{" "}
                    <strong>{locationData?.code || activeTaluka?.code || activeDistrict?.officialNo}</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Jump to Map and Full Data Actions */}
            <div className="dx-area-banner__actions">
              <button type="button" className="dx-btn dx-btn--primary" onClick={handleJumpToMap}>
                <MapIcon size={16} aria-hidden="true" />
                {t.viewOnMap}
                <ArrowRight size={15} aria-hidden="true" />
              </button>
              {(level === "city" || level === "village") && (
                <button
                  type="button"
                  className="dx-btn dx-btn--ghost"
                  onClick={() => setShowFullTable((prev) => !prev)}
                >
                  <FileSpreadsheet size={16} aria-hidden="true" />
                  {showFullTable ? t.closeFullData : t.inspectFullData}
                </button>
              )}
            </div>
          </div>

          {/* 4 Core Summary KPI Cards */}
          <div className="dx-inspector__kpi-grid">
            <div className="dx-stat-box dx-stat-box--saffron">
              <div className="dx-stat-box__top">
                <span className="dx-stat-box__label">{t.schemesRunning}</span>
                <Sparkles size={18} className="dx-stat-box__icon" aria-hidden="true" />
              </div>
              <div className="dx-stat-box__value">
                {t.activeCount
                  .replace("{active}", String(summary.activeSchemes))
                  .replace("{total}", String(summary.totalSchemes))}
              </div>
              <span className="dx-stat-box__sub">
                {summary.activeSchemes === summary.totalSchemes ? t.hundredPercentAvailability : t.sampleBased}
              </span>
            </div>

            <div className="dx-stat-box dx-stat-box--blue">
              <div className="dx-stat-box__top">
                <span className="dx-stat-box__label">{t.totalRecords}</span>
                <TrendingUp size={18} className="dx-stat-box__icon" aria-hidden="true" />
              </div>
              <div className="dx-stat-box__value">
                {new Intl.NumberFormat(lang === "gu" ? "gu-IN" : "en-IN").format(summary.totalRows)}
              </div>
              <span className="dx-stat-box__sub">{t.syntheticDemoRows}</span>
            </div>

            <div className="dx-stat-box dx-stat-box--teal">
              <div className="dx-stat-box__top">
                <span className="dx-stat-box__label">{t.approvalRate}</span>
                <CheckCircle2 size={18} className="dx-stat-box__icon" aria-hidden="true" />
              </div>
              <div className="dx-stat-box__value">{summary.approvalRate}%</div>
              <span className="dx-stat-box__sub">{t.approvedOrDelivered}</span>
            </div>

            <div className="dx-stat-box dx-stat-box--purple">
              <div className="dx-stat-box__top">
                <span className="dx-stat-box__label">
                  {areaData ? `${t.urbanCount} / ${t.ruralCount}` : t.femaleRatio}
                </span>
                <UsersRound size={18} className="dx-stat-box__icon" aria-hidden="true" />
              </div>
              <div className="dx-stat-box__value">
                {areaData ? `${areaData.urbanCount} / ${areaData.ruralCount}` : `${summary.femaleRate}%`}
              </div>
              <span className="dx-stat-box__sub">
                {areaData ? t.urbanRuralSplit : t.femaleBeneficiaryRatio}
              </span>
            </div>
          </div>

          {/* Cities list in District or Taluka */}
          {areaData && areaData.urbanLocations && areaData.urbanLocations.length > 0 && (
            <div className="dx-urban-strip">
              <h4 className="dx-urban-strip__title">
                <Building2 size={15} aria-hidden="true" />
                {t.citiesInArea} ({areaData.urbanLocations.length})
              </h4>
              <div className="dx-urban-strip__chips">
                {areaData.urbanLocations.map((u) => (
                  <button
                    key={u.code}
                    type="button"
                    className="dx-chip"
                    onClick={() => {
                      setLevel("city");
                      setSelectedCityCode(u.code);
                    }}
                  >
                    <strong>{lang === "gu" && u.nameGu ? u.nameGu : u.nameEn}</strong>
                    <span>({u.sampleRows} {t.rowsUnit})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Scheme Breakdown Grid */}
          <div className="dx-scheme-deepdive">
            <div className="dx-scheme-deepdive__header">
              <h4 className="dx-scheme-deepdive__title">{t.schemeStatusTitle}</h4>
              <span className="dx-scheme-deepdive__note">
                {t.schemeDeepDiveNote}
              </span>
            </div>

            <div className="dx-scheme-grid">
              {summary.schemesList.map((scheme) => {
                const act = scheme.activity || {};
                const isActivityBased = scheme.id === "S10" || typeof act.activityRecorded === "number";
                const total = Math.max(1, scheme.count || 1);
                const approved = (act.approved || 0) + (act.serviceDelivered || 0);
                const pending = act.pending || 0;
                const docsPending = act.documentsPending || 0;
                const rejected = act.rejected || 0;
                const other = Math.max(0, total - (approved + pending + docsPending + rejected));

                return (
                  <div key={scheme.id} className="dx-scheme-card" data-scheme-id={scheme.id}>
                    <div className="dx-scheme-card__top">
                      <span className="dx-scheme-card__id">{scheme.id}</span>
                      <h5 className="dx-scheme-card__name">
                        {lang === "gu" ? scheme.nameGu || scheme.nameEn : scheme.nameEn}
                      </h5>
                    </div>

                    <div className="dx-scheme-card__meter">
                      <div className="dx-meter-bar">
                        {isActivityBased ? (
                          <div
                            className="dx-meter-seg dx-meter-seg--activity"
                            style={{ width: "100%", background: "#3b82f6" }}
                            title={`${t.statusLabels.activityRecorded}: ${act.activityRecorded ?? total} (100%)`}
                          >
                            <span className="dx-meter-pct">100%</span>
                          </div>
                        ) : (
                          <>
                            {approved > 0 && (() => {
                              const pct = Math.round((approved / total) * 100);
                              return (
                                <div
                                  className="dx-meter-seg dx-meter-seg--approved"
                                  style={{ width: `${(approved / total) * 100}%` }}
                                  title={`${t.statusLabels.approved}: ${approved} (${pct}%)`}
                                >
                                  {pct >= 14 && <span className="dx-meter-pct">{pct}%</span>}
                                </div>
                              );
                            })()}
                            {pending > 0 && (() => {
                              const pct = Math.round((pending / total) * 100);
                              return (
                                <div
                                  className="dx-meter-seg dx-meter-seg--pending"
                                  style={{ width: `${(pending / total) * 100}%` }}
                                  title={`${t.statusLabels.pending}: ${pending} (${pct}%)`}
                                >
                                  {pct >= 14 && <span className="dx-meter-pct">{pct}%</span>}
                                </div>
                              );
                            })()}
                            {docsPending > 0 && (() => {
                              const pct = Math.round((docsPending / total) * 100);
                              return (
                                <div
                                  className="dx-meter-seg dx-meter-seg--docs"
                                  style={{ width: `${(docsPending / total) * 100}%` }}
                                  title={`${t.statusLabels.documentsPending}: ${docsPending} (${pct}%)`}
                                >
                                  {pct >= 14 && <span className="dx-meter-pct">{pct}%</span>}
                                </div>
                              );
                            })()}
                            {rejected > 0 && (() => {
                              const pct = Math.round((rejected / total) * 100);
                              return (
                                <div
                                  className="dx-meter-seg dx-meter-seg--rejected"
                                  style={{ width: `${(rejected / total) * 100}%` }}
                                  title={`${t.statusLabels.rejected}: ${rejected} (${pct}%)`}
                                >
                                  {pct >= 14 && <span className="dx-meter-pct">{pct}%</span>}
                                </div>
                              );
                            })()}
                            {other > 0 && (() => {
                              const pct = Math.round((other / total) * 100);
                              return (
                                <div
                                  className="dx-meter-seg dx-meter-seg--other"
                                  style={{ width: `${(other / total) * 100}%` }}
                                  title={`${t.statusLabels.notApplied}: ${other} (${pct}%)`}
                                >
                                  {pct >= 14 && <span className="dx-meter-pct">{pct}%</span>}
                                </div>
                              );
                            })()}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="dx-scheme-card__stats">
                      {isActivityBased ? (
                        <span className="dx-stat-pill dx-stat-pill--blue" data-testid="s10-activity-pill">
                          <Sparkles size={12} /> {t.activityBasedScheme}: {act.activityRecorded ?? total} {t.statusLabels.activityRecorded}
                        </span>
                      ) : (
                        <>
                          <span className="dx-stat-pill dx-stat-pill--teal">
                            <CheckCircle2 size={12} /> {approved} {t.statusLabels.approved}
                          </span>
                          <span className="dx-stat-pill dx-stat-pill--amber">
                            <Clock size={12} /> {pending} {t.statusLabels.pending}
                          </span>
                          {docsPending > 0 && (
                            <span className="dx-stat-pill dx-stat-pill--blue">
                              <FileQuestion size={12} /> {docsPending} {t.statusLabels.documentsPending}
                            </span>
                          )}
                          <span className="dx-stat-pill dx-stat-pill--red">
                            <XCircle size={12} /> {rejected} {t.statusLabels.rejected}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full 39-column Source Records Drawer / Table */}
          {showFullTable && locationData && (
            <div className="dx-full-table-container">
              <VillageSchemeRegister
                villageCode={locationData.code}
                villageNameGu={locationData.nameGu || locationData.nameEn}
                villageNameEn={locationData.nameEn}
                talukaNameGu={locationData.talukaGu}
                talukaNameEn={locationData.talukaEn}
                districtNameGu={locationData.districtGu}
                districtNameEn={locationData.districtEn}
                gu={lang === "gu"}
                lang={lang}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="dx-inspector__empty">
          <Info size={24} aria-hidden="true" />
          <p>{t.noData}</p>
        </div>
      )}
    </section>
  );
}
