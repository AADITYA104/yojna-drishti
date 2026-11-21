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

const copy = {
  gu: {
    badge: "નમૂનો · DEMO",
    title: "સ્માર્ટ વિસ્તાર અને યોજના નિરીક્ષક",
    subtitle: "ગુજરાતના કોઈપણ શહેર, જિલ્લો, તાલુકો કે ગામ પસંદ કરો અને તેમાં ચાલતી યોજનાઓની વિગતવાર સ્થિતિ જુઓ.",
    levels: {
      city: "🏙️ શહેર / નગર",
      district: "🗺️ જિલ્લો",
      taluka: "🏛️ તાલુકો",
      village: "🏡 ગામડું",
    },
    popularCities: "મુખ્ય શહેરો:",
    selectDistrict: "જિલ્લો પસંદ કરો",
    selectTaluka: "તાલુકો પસંદ કરો",
    selectSettlement: "શહેર / નગર પસંદ કરો",
    selectVillage: "ગામ પસંદ કરો",
    allDistricts: "બધા જિલ્લા",
    searchCityPlaceholder: "શહેર અથવા નગરનું નામ શોધો...",
    searchVillagePlaceholder: "ગામનું નામ શોધો...",
    schemesRunning: "સક્રિય યોજનાઓ",
    totalRecords: "કુલ નમૂના હરોળો",
    approvalRate: "મંજૂરી / સેવા દર",
    femaleRatio: "સ્ત્રી લાભાર્થી હિસ્સો",
    urbanCount: "શહેરી વસાહતો",
    ruralCount: "ગ્રામીણ ગામડાં",
    activeCount: "{active} / {total} યોજનાઓ સક્રિય",
    viewOnMap: "નકશામાં આ વિસ્તાર જુઓ",
    inspectFullData: "સંપૂર્ણ ૩૯ કૉલમ ડેટા જુઓ",
    closeFullData: "ડેટા ટેબલ બંધ કરો",
    schemeStatusTitle: "યોજનાવાર વિગતવાર સ્થિતિ",
    statusLabels: {
      approved: "મંજૂર",
      serviceDelivered: "સેવા અપાઈ",
      pending: "પ્રક્રિયામાં",
      documentsPending: "દસ્તાવેજ બાકી",
      rejected: "નામંજૂર",
      activityRecorded: "પ્રવૃત્તિ નોંધાઈ",
      notApplied: "અરજી નથી",
    },
    loading: "ડેટા લોડ થઈ રહ્યો છે...",
    noData: "આ પસંદગી માટે કોઈ નમૂના ડેટા મળ્યો નથી.",
    urbanBadge: "શહેરી વિસ્તાર",
    ruralBadge: "ગ્રામીણ વિસ્તાર",
    lgdCode: "LGD કોડ",
    citiesInArea: "આ વિસ્તારમાં સમાવિષ્ટ મુખ્ય શહેરો / નગરો:",
  },
  hi: {
    badge: "नमूना · DEMO",
    title: "स्मार्ट क्षेत्र और योजना निरीक्षक",
    subtitle: "गुजरात का कोई भी शहर, जिला, तालुका या गाँव चुनें और वहाँ चल रही योजनाओं की स्थिति देखें।",
    levels: {
      city: "🏙️ शहर / नगर",
      district: "🗺️ जिला",
      taluka: "🏛️ तालुका",
      village: "🏡 गाँव",
    },
    popularCities: "प्रमुख शहर:",
    selectDistrict: "जिला चुनें",
    selectTaluka: "तालुका चुनें",
    selectSettlement: "शहर / नगर चुनें",
    selectVillage: "गाँव चुनें",
    allDistricts: "सभी जिले",
    searchCityPlaceholder: "शहर या नगर का नाम खोजें...",
    searchVillagePlaceholder: "गाँव का नाम खोजें...",
    schemesRunning: "सक्रिय योजनाएँ",
    totalRecords: "कुल नमूना पंक्तियाँ",
    approvalRate: "स्वीकृति / सेवा दर",
    femaleRatio: "महिला लाभार्थी अनुपात",
    urbanCount: "शहरी बस्तियाँ",
    ruralCount: "ग्रामीण गाँव",
    activeCount: "{active} / {total} योजनाएँ सक्रिय",
    viewOnMap: "नक्शे पर यह क्षेत्र देखें",
    inspectFullData: "पूरा ३९ कॉलम डेटा देखें",
    closeFullData: "डेटा टेबल बंद करें",
    schemeStatusTitle: "योजनावार विस्तृत स्थिति",
    statusLabels: {
      approved: "स्वीकृत",
      serviceDelivered: "सेवा दी गई",
      pending: "प्रक्रिया में",
      documentsPending: "दस्तावेज़ बाकी",
      rejected: "अस्वीकृत",
      activityRecorded: "गतिविधि दर्ज",
      notApplied: "आवेदन नहीं",
    },
    loading: "डेटा लोड हो रहा है...",
    noData: "इस चयन के लिए नमूना डेटा उपलब्ध नहीं है।",
    urbanBadge: "शहरी क्षेत्र",
    ruralBadge: "ग्रामीण क्षेत्र",
    lgdCode: "LGD कोड",
    citiesInArea: "इस क्षेत्र में शामिल प्रमुख शहर / नगर:",
  },
  en: {
    badge: "Sample · DEMO",
    title: "Smart Area & Scheme Inspector",
    subtitle: "Select any City, District, Taluka, or Village in Gujarat to inspect running schemes and granular micro-data.",
    levels: {
      city: "🏙️ City / Urban",
      district: "🗺️ District",
      taluka: "🏛️ Taluka",
      village: "🏡 Village / Rural",
    },
    popularCities: "Prominent cities:",
    selectDistrict: "Select District",
    selectTaluka: "Select Taluka",
    selectSettlement: "Select City / Town",
    selectVillage: "Select Village",
    allDistricts: "All Districts",
    searchCityPlaceholder: "Search city or town name...",
    searchVillagePlaceholder: "Search village name...",
    schemesRunning: "Active Schemes",
    totalRecords: "Total Sample Rows",
    approvalRate: "Approval / Service Rate",
    femaleRatio: "Female Share",
    urbanCount: "Urban Settlements",
    ruralCount: "Rural Villages",
    activeCount: "{active} of {total} schemes active",
    viewOnMap: "View this area on Map",
    inspectFullData: "Inspect Full 39 Columns",
    closeFullData: "Close Data Table",
    schemeStatusTitle: "Detailed Status by Scheme",
    statusLabels: {
      approved: "Approved",
      serviceDelivered: "Delivered",
      pending: "In Process",
      documentsPending: "Docs Pending",
      rejected: "Rejected",
      activityRecorded: "Activity Logged",
      notApplied: "Not Applied",
    },
    loading: "Loading area data...",
    noData: "No sample data found for this selection.",
    urbanBadge: "Urban Area",
    ruralBadge: "Rural Area",
    lgdCode: "LGD Code",
    citiesInArea: "Cities and towns in this area:",
  },
} as const;

// Top prominent cities in Gujarat with LGD codes from dataset
const POPULAR_CITIES = [
  { code: "516249", nameEn: "Bhavnagar City", nameGu: "ભાવનગર શહેર", districtCode: "441" },
  { code: "512750", nameEn: "Ahmedabad (East/West)", nameGu: "અમદાવાદ શહેર", districtCode: "438" },
  { code: "523753", nameEn: "Surat City (Umra)", nameGu: "સુરત શહેર", districtCode: "459" },
  { code: "521400", nameEn: "Vadodara City", nameGu: "વડોદરા શહેર", districtCode: "461" },
  { code: "513800", nameEn: "Rajkot City", nameGu: "રાજકોટ શહેર", districtCode: "455" },
  { code: "510900", nameEn: "Jamnagar City", nameGu: "જામનગર શહેર", districtCode: "447" },
  { code: "508500", nameEn: "Gandhinagar City", nameGu: "ગાંધીનગર શહેર", districtCode: "446" },
  { code: "515100", nameEn: "Junagadh City", nameGu: "જૂનાગઢ શહેર", districtCode: "448" },
  { code: "517200", nameEn: "Anand Town", nameGu: "આણંદ નગર", districtCode: "439" },
  { code: "522100", nameEn: "Bharuch Town", nameGu: "ભરૂચ નગર", districtCode: "440" },
  { code: "524500", nameEn: "Navsari Town", nameGu: "નવસારી નગર", districtCode: "452" },
  { code: "956072", nameEn: "Palitana Town", nameGu: "પાલિતાણા નગર", districtCode: "441" },
];

export function SmartAreaInspector({ lang, onFocusMap }: SmartAreaInspectorProps) {
  const t = copy[lang];
  const [level, setLevel] = useState<InspectorLevel>("city");

  // Selection states
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<string>("441"); // Default Bhavnagar
  const [selectedTalukaCode, setSelectedTalukaCode] = useState<string>("3850"); // Default Ghogha
  const [selectedCityCode, setSelectedCityCode] = useState<string>("516249"); // Default Bhavnagar City
  const [selectedVillageCode, setSelectedVillageCode] = useState<string>("516015"); // Default Babarkot

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
    if (selectedDistrictCode && selectedDistrictCode !== "all") {
      list = list.filter((c) => c.districtCode === selectedDistrictCode);
    }
    if (citySearchQuery.trim()) {
      const q = citySearchQuery.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.nameEn.toLowerCase().includes(q) ||
          c.nameGu.includes(q) ||
          c.code.includes(q) ||
          c.talukaEn.toLowerCase().includes(q)
      );
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
              setSelectedDistrictCode(e.target.value);
              // auto-select first taluka
              const dCode = parseInt(e.target.value, 10);
              const talukas = MASTER_SUBDISTRICTS.filter((sub) => sub.districtCode === dCode);
              if (talukas.length > 0) setSelectedTalukaCode(String(talukas[0].code));
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
                onChange={(e) => setSelectedCityCode(e.target.value)}
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
                {summary.activeSchemes === summary.totalSchemes ? "૧૦૦% ઉપલબ્ધતા" : "નમૂના આધારિત"}
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
              <span className="dx-stat-box__sub">કૃત્રિમ ડેમો પંક્તિઓ</span>
            </div>

            <div className="dx-stat-box dx-stat-box--teal">
              <div className="dx-stat-box__top">
                <span className="dx-stat-box__label">{t.approvalRate}</span>
                <CheckCircle2 size={18} className="dx-stat-box__icon" aria-hidden="true" />
              </div>
              <div className="dx-stat-box__value">{summary.approvalRate}%</div>
              <span className="dx-stat-box__sub">મંજૂર અથવા સેવા અપાઈ</span>
            </div>

            <div className="dx-stat-box dx-stat-box--purple">
              <div className="dx-stat-box__top">
                <span className="dx-stat-box__label">
                  {areaData ? `${t.urbanCount} / ${t.ruralCount}` : t.femaleRatio}
                </span>
                <UsersRound size={18} className="dx-stat-box__icon" aria-hidden="true" />
              </div>
              <div className="dx-stat-box__value">
                {areaData ? `${areaData.urbanCount} 🏙️ / ${areaData.ruralCount} 🏡` : `${summary.femaleRate}% 👩`}
              </div>
              <span className="dx-stat-box__sub">
                {areaData ? "શહેરી અને ગ્રામીણ વિભાજન" : "મહિલા લાભાર્થી ગુણોત્તર"}
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
                    <span>({u.sampleRows} પંક્તિઓ)</span>
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
                દરેક યોજના માટે મંજૂર, પ્રક્રિયામાં, દસ્તાવેજ બાકી અને નામંજૂર વિગત
              </span>
            </div>

            <div className="dx-scheme-grid">
              {summary.schemesList.map((scheme) => {
                const act = scheme.activity || {};
                const total = Math.max(1, scheme.count || 1);
                const approved = (act.approved || 0) + (act.serviceDelivered || 0);
                const pending = act.pending || 0;
                const docsPending = act.documentsPending || 0;
                const rejected = act.rejected || 0;
                const other = Math.max(0, total - (approved + pending + docsPending + rejected));

                return (
                  <div key={scheme.id} className="dx-scheme-card">
                    <div className="dx-scheme-card__top">
                      <span className="dx-scheme-card__id">{scheme.id}</span>
                      <h5 className="dx-scheme-card__name">
                        {lang === "gu" ? scheme.nameGu || scheme.nameEn : scheme.nameEn}
                      </h5>
                    </div>

                    <div className="dx-scheme-card__meter">
                      <div className="dx-meter-bar">
                        {approved > 0 && (
                          <div
                            className="dx-meter-seg dx-meter-seg--approved"
                            style={{ width: `${(approved / total) * 100}%` }}
                            title={`${t.statusLabels.approved}: ${approved}`}
                          />
                        )}
                        {pending > 0 && (
                          <div
                            className="dx-meter-seg dx-meter-seg--pending"
                            style={{ width: `${(pending / total) * 100}%` }}
                            title={`${t.statusLabels.pending}: ${pending}`}
                          />
                        )}
                        {docsPending > 0 && (
                          <div
                            className="dx-meter-seg dx-meter-seg--docs"
                            style={{ width: `${(docsPending / total) * 100}%` }}
                            title={`${t.statusLabels.documentsPending}: ${docsPending}`}
                          />
                        )}
                        {rejected > 0 && (
                          <div
                            className="dx-meter-seg dx-meter-seg--rejected"
                            style={{ width: `${(rejected / total) * 100}%` }}
                            title={`${t.statusLabels.rejected}: ${rejected}`}
                          />
                        )}
                        {other > 0 && (
                          <div
                            className="dx-meter-seg dx-meter-seg--other"
                            style={{ width: `${(other / total) * 100}%` }}
                            title={`${t.statusLabels.notApplied}: ${other}`}
                          />
                        )}
                      </div>
                    </div>

                    <div className="dx-scheme-card__stats">
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
