"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

maplibregl.setWorkerUrl(
  new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).toString(),
);

import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronRight,
  FileText,
  Home,
  Info,
  Landmark,
  MapPinned,
  Minus,
  Plus,
  RotateCcw,
  Search,
  Users,
  Wallet,
  Award,
  Sparkles,
  School,
  Activity,
  Layers,
} from "lucide-react";

import {
  demoDistricts,
  demoSchemes,
  demoTalukas,
  demoVillages,
  type District,
  type Taluka,
  type Village,
} from "@/lib/demo-data";

import {
  GHOGHA_48_VILLAGES,
  MASTER_DISTRICTS,
  NOTEBOOK_WOMEN_SCHEMES,
  getSubdistrictsForDistrict,
  type MasterSubdistrict,
  type MasterVillage,
} from "@/lib/master-hierarchy";

import { DISTRICT_LAT_LNG, GUJARAT_STATE_CENTER, TALUKA_GPS_COORDS } from "@/lib/geo-coordinates";
import { scaleDemoValue } from "@/lib/metrics.mjs";

import {
  getVillageSchemes,
  isSchemeActiveInVillage,
  getVillageSchemeSummary,
  ALL_AVAILABLE_SCHEMES,
  type VillageSchemeAssignment,
} from "@/lib/village-scheme-demo";

export type GeoLevel = "state" | "district" | "taluka" | "village";

type Region = District["region"];
type VillageItem = {
  code: string;
  nameEn: string;
  nameGu?: string;
  sample?: MasterVillage;
};

type DistrictFeature = {
  type: "Feature";
  geometry: { type: string; coordinates: unknown };
  properties: Record<string, unknown> & {
    districtId?: string;
    district?: string;
    nameGu?: string;
    region?: string;
    villageCode?: string;
    subdistrictCode?: number;
    districtCode?: number;
    nameEn?: string;
  };
};

type DistrictCollection = { type: "FeatureCollection"; features: DistrictFeature[] };

type MapFocusRequest = {
  id: number;
  target: {
    id: string;
    kind: "district" | "taluka" | "village" | "scheme";
    districtId?: string;
    subdistrictCode?: number;
    villageCode?: string;
  };
};

interface HoveredEntity {
  nameGu: string;
  nameEn: string;
  type: "district" | "taluka" | "village";
  code?: string | number;
  schemeCount?: number;
  beneficiaries?: number;
  grantLakhs?: number;
  x: number;
  y: number;
}

interface GujaratInteractiveMapProps {
  gu: boolean;
  fy: string;
  selectedDistrictId?: string;
  onDistrictSelect?: (district: District) => void;
  onTalukaSelect?: (taluka: Taluka) => void;
  onVillageSelect?: (village: Village) => void;
  regionFilter?: "all" | Region;
  schemeFilter?: string;
  variant?: "explorer" | "overview" | "embedded";
  initialLevel?: GeoLevel;
  mapHeight?: string;
  focusRequest?: MapFocusRequest | null;
}

const TALUKA_PALETTE = ["#2f9e8f", "#e0a63a", "#5b8bd6", "#d9704f", "#8e6bbf", "#4caf6a", "#c7557f", "#7a9a3c"];

function talukaColorExpression(codes: number[]) {
  if (!codes.length) return "#9fb8c3";
  return [
    "match",
    ["get", "subdistrictCode"],
    ...codes.flatMap((code, index) => [code, TALUKA_PALETTE[index % TALUKA_PALETTE.length]]),
    "#9fb8c3",
  ];
}

function normalizeName(value: string) {
  return value.toLocaleLowerCase().normalize("NFKC").replace(/[^\p{L}\p{N}]/gu, "");
}

function matchDistrict(geoName: string) {
  const normalized = normalizeName(geoName);
  const aliases: Record<string, string> = {
    chhotaudaipur: "chhotaudepur",
    panchmahals: "panchmahal",
    dangs: "dang",
    kachchh: "kutch",
  };
  const key = aliases[normalized] || normalized;
  return demoDistricts.find((district) => {
    return (
      normalizeName(district.id) === key ||
      normalizeName(district.name) === key
    );
  });
}

function featureBounds(feature: DistrictFeature): [[number, number], [number, number]] | null {
  const bounds = [Infinity, Infinity, -Infinity, -Infinity];
  const visit = (value: unknown) => {
    if (!Array.isArray(value)) return;
    if (value.length >= 2 && typeof value[0] === "number" && typeof value[1] === "number") {
      bounds[0] = Math.min(bounds[0], value[0]);
      bounds[1] = Math.min(bounds[1], value[1]);
      bounds[2] = Math.max(bounds[2], value[0]);
      bounds[3] = Math.max(bounds[3], value[1]);
      return;
    }
    value.forEach(visit);
  };
  visit(feature.geometry.coordinates);
  if (!bounds.every(Number.isFinite)) return null;
  return [
    [bounds[0], bounds[1]],
    [bounds[2], bounds[3]],
  ];
}

function collectionBounds(features: DistrictFeature[]): [[number, number], [number, number]] | null {
  const bounds = [[Infinity, Infinity], [-Infinity, -Infinity]] as [[number, number], [number, number]];
  features.forEach((feature) => {
    const extent = featureBounds(feature);
    if (!extent) return;
    bounds[0][0] = Math.min(bounds[0][0], extent[0][0]);
    bounds[0][1] = Math.min(bounds[0][1], extent[0][1]);
    bounds[1][0] = Math.max(bounds[1][0], extent[1][0]);
    bounds[1][1] = Math.max(bounds[1][1], extent[1][1]);
  });
  return bounds.every((point) => point.every(Number.isFinite)) ? bounds : null;
}

function fitBoundsAtZoom(
  map: maplibregl.Map,
  bounds: [[number, number], [number, number]],
  options: maplibregl.FitBoundsOptions,
  minZoom: number,
) {
  const camera = map.cameraForBounds(bounds, {
    padding: options.padding,
    maxZoom: options.maxZoom,
  });
  if (!camera?.center) {
    map.fitBounds(bounds, options);
    return;
  }
  map.easeTo({
    ...camera,
    zoom: Math.max(camera.zoom ?? 0, minZoom),
    duration: options.duration,
  });
}

function formatNumber(value: number, gu: boolean) {
  return new Intl.NumberFormat(gu ? "gu-IN" : "en-IN").format(value);
}

type MapSchemeOption = {
  id: string;
  shortName: string;
  shortNameGu: string;
  benefitAmount: string;
  benefitAmountGu: string;
  department: string;
  departmentGu: string;
  hasVillageMapping: boolean;
};

const MAP_SCHEME_OPTIONS: MapSchemeOption[] = [
  ...NOTEBOOK_WOMEN_SCHEMES.map((scheme) => ({
    id: scheme.id,
    shortName: scheme.nameEn,
    shortNameGu: scheme.nameGu,
    benefitAmount: scheme.benefit,
    benefitAmountGu: scheme.benefitGu,
    department: scheme.notebookCategory,
    departmentGu: scheme.categoryGu,
    hasVillageMapping: true,
  })),
  ...demoSchemes.map((scheme) => ({
    id: scheme.id,
    shortName: scheme.shortName,
    shortNameGu: scheme.shortNameGu,
    benefitAmount: scheme.benefitAmount,
    benefitAmountGu: scheme.benefitAmountGu,
    department: scheme.department,
    departmentGu: scheme.departmentGu,
    hasVillageMapping: true,
  })),
];

export function GujaratInteractiveMap({
  gu,
  fy,
  selectedDistrictId = "bhavnagar",
  onDistrictSelect,
  onTalukaSelect,
  onVillageSelect,
  regionFilter = "all",
  schemeFilter = "all",
  variant = "explorer",
  initialLevel = "state",
  mapHeight,
  focusRequest = null,
}: GujaratInteractiveMapProps) {
  const mapHostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const boundaryLayersAdded = useRef(false);
  const districtInteractionsAdded = useRef(false);
  const officialBoundaryLayersAdded = useRef(false);
  const officialBoundaryInteractionsAdded = useRef(false);

  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState("");
  const [districtData, setDistrictData] = useState<DistrictCollection | null>(null);
  const [officialBoundaryData, setOfficialBoundaryData] = useState<DistrictCollection | null>(null);
  const [boundaryDistrictId, setBoundaryDistrictId] = useState("");
  const [level, setLevel] = useState<GeoLevel>(initialLevel);
  const [currentDistrictId, setCurrentDistrictId] = useState(selectedDistrictId);
  const [currentTalukaCode, setCurrentTalukaCode] = useState<number | null>(null);
  const [currentVillageCode, setCurrentVillageCode] = useState<string | null>(null);
  const [villageItems, setVillageItems] = useState<VillageItem[]>([]);
  const [villageLoadState, setVillageLoadState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [villageLoadVersion, setVillageLoadVersion] = useState(0);
  const [showVillageList, setShowVillageList] = useState(false);
  const [listSearch, setListSearch] = useState("");
  const [mapZoom, setMapZoom] = useState(GUJARAT_STATE_CENTER.zoom || 7.3);
  const [focusNotice, setFocusNotice] = useState("");
  const [hoveredEntity, setHoveredEntity] = useState<HoveredEntity | null>(null);

  const villageItemsRef = useRef(villageItems);
  const completedFocusRequestRef = useRef<number | null>(null);

  const currentDistrict = useMemo(
    () => demoDistricts.find((district) => district.id === currentDistrictId) || demoDistricts[0],
    [currentDistrictId],
  );

  const currentSubdistricts = useMemo(
    () => getSubdistrictsForDistrict(currentDistrictId),
    [currentDistrictId],
  );

  const currentTaluka = useMemo(
    () => currentSubdistricts.find((subdistrict) => subdistrict.code === currentTalukaCode) || null,
    [currentSubdistricts, currentTalukaCode],
  );

  const currentVillage = useMemo(
    () => villageItems.find((village) => village.code === currentVillageCode) || null,
    [villageItems, currentVillageCode],
  );

  const selectedScheme = useMemo(
    () => MAP_SCHEME_OPTIONS.find((scheme) => scheme.id === schemeFilter) || null,
    [schemeFilter],
  );

  // Universal scheme coverage calculation across all loaded villages
  const schemeCoverageVillageCodes = useMemo(() => {
    if (schemeFilter === "all") return [];
    const activeCodes: string[] = [];
    if (officialBoundaryData?.features) {
      officialBoundaryData.features.forEach((feature) => {
        const code = String(feature.properties.villageCode || "");
        if (code && isSchemeActiveInVillage(code, schemeFilter)) {
          activeCodes.push(code);
        }
      });
    }
    return activeCodes;
  }, [officialBoundaryData, schemeFilter]);

  // Universal village schemes summary for the selected village
  const currentVillageSchemeSummary = useMemo(() => {
    if (!currentVillage) return null;
    return getVillageSchemeSummary(currentVillage.code);
  }, [currentVillage]);

  const currentVillageSchemeAssignments = useMemo(() => {
    if (!currentVillage) return [];
    const allAssignments = getVillageSchemes(currentVillage.code);
    return schemeFilter === "all"
      ? allAssignments
      : allAssignments.filter((assignment) => assignment.schemeId === schemeFilter);
  }, [currentVillage, schemeFilter]);

  const handleDistrictClick = useCallback(
    (districtId: string) => {
      const district = demoDistricts.find((item) => item.id === districtId);
      if (!district) return;
      setCurrentDistrictId(district.id);
      setCurrentTalukaCode(null);
      setCurrentVillageCode(null);
      setVillageItems([]);
      setVillageLoadState("idle");
      setOfficialBoundaryData(null);
      setBoundaryDistrictId("");
      setLevel("district");
      setListSearch("");
      setFocusNotice("");
      setHoveredEntity(null);
      onDistrictSelect?.(district);

      const shape = districtData?.features.find((feature) => feature.properties.districtId === district.id);
      const bounds = shape ? featureBounds(shape) : null;
      if (bounds) {
        const width = bounds[1][0] - bounds[0][0];
        const height = bounds[1][1] - bounds[0][1];
        const minZoom = width < 2.2 && height < 2.2 ? 7.4 : 5.5;
        if (mapRef.current) {
          fitBoundsAtZoom(mapRef.current, bounds, {
            padding: { top: 48, right: 48, bottom: 48, left: 48 },
            maxZoom: 10.25,
            duration: 1100,
          }, minZoom);
        }
      } else {
        const location = DISTRICT_LAT_LNG[district.id];
        if (location) mapRef.current?.flyTo({ center: [location.lng, location.lat], zoom: location.zoom, duration: 900 });
      }
    },
    [districtData, onDistrictSelect],
  );

  const handleTalukaClick = useCallback(
    (code: number) => {
      const subdistrict = getSubdistrictsForDistrict(currentDistrictId).find((item) => item.code === code);
      if (!subdistrict) return;
      setCurrentTalukaCode(code);
      setCurrentVillageCode(null);
      setVillageItems([]);
      setVillageLoadState("loading");
      setLevel("taluka");
      setListSearch("");
      setFocusNotice("");
      setHoveredEntity(null);

      const demoTaluka = demoTalukas.find(
        (item) => item.districtId === currentDistrictId && normalizeName(item.name) === normalizeName(subdistrict.nameEn),
      );
      if (demoTaluka) onTalukaSelect?.(demoTaluka);

      const districtCode = MASTER_DISTRICTS.find((item) => item.id === currentDistrictId)?.code;
      const subdistrictFeatures = officialBoundaryData?.features.filter(
        (feature) => feature.properties.districtCode === districtCode && feature.properties.subdistrictCode === code,
      ) || [];
      const subdistrictBounds = collectionBounds(subdistrictFeatures);
      if (subdistrictBounds) {
        if (mapRef.current) {
          fitBoundsAtZoom(mapRef.current, subdistrictBounds, {
            padding: { top: 44, right: 44, bottom: 44, left: 44 },
            maxZoom: 12.3,
            duration: 1100,
          }, 9.2);
        }
        return;
      }
      const location = TALUKA_GPS_COORDS[currentDistrictId]?.[String(code)];
      if (location) {
        mapRef.current?.flyTo({
          center: [location.lng, location.lat],
          zoom: 12.2,
          duration: 1100,
        });
      } else {
        const districtLocation = DISTRICT_LAT_LNG[currentDistrictId];
        if (districtLocation) {
          mapRef.current?.flyTo({
            center: [districtLocation.lng, districtLocation.lat],
            zoom: 10.8,
            duration: 900,
          });
        }
      }
    },
    [currentDistrictId, officialBoundaryData, onTalukaSelect],
  );

  const handleVillageClick = useCallback(
    (code: string) => {
      const village = villageItems.find((item) => item.code === code);
      if (!village) return;
      setCurrentVillageCode(code);
      setLevel("village");
      setShowVillageList(false);
      setHoveredEntity(null);

      const districtCode = MASTER_DISTRICTS.find((item) => item.id === currentDistrictId)?.code;
      const villageFeatures = officialBoundaryData?.features.filter(
        (feature) => feature.properties.districtCode === districtCode && feature.properties.villageCode === code,
      ) || [];
      const villageBounds = collectionBounds(villageFeatures);
      if (villageBounds) {
        setFocusNotice("");
        mapRef.current?.fitBounds(villageBounds, {
          padding: { top: 55, right: 55, bottom: 55, left: 55 },
          maxZoom: 14.4,
          duration: 1000,
        });
      }
      const vItem = (villageItems.find((item) => item.code === code) || GHOGHA_48_VILLAGES.find((item) => item.code === code)) as any;
      const demoVillage: Village | undefined = demoVillages.find((item) => item.code === code) || (vItem ? ({
        id: vItem.code || code,
        code: vItem.code || code,
        name: vItem.nameEn || "Village",
        gu: vItem.nameGu || vItem.nameEn || "ગામ",
        talukaId: String(currentTalukaCode || 3855),
        households: vItem.households || 280,
        population: vItem.population || 1800,
        femalePopulation: vItem.femalePopulation || 900,
        venue: vItem.venueEn || vItem.venue || "Primary School",
        venueGu: vItem.venueGu || "પ્રાથમિક શાળા",
        totalBeneficiaries: vItem.beneficiaries || 45,
        applications: (vItem.applications || vItem.beneficiaries || 45) + 10,
        approved: vItem.approved || vItem.beneficiaries || 45,
        disbursedLakhs: vItem.disbursedLakhs || 6.5,
        anganwadiCount: vItem.anganwadis || vItem.anganwadiCount || 2,
        coordinates: { x: 0, y: 0 },
        schemeBreakdown: [],
      } as Village) : undefined);
      if (demoVillage) onVillageSelect?.(demoVillage);
    },
    [currentDistrictId, officialBoundaryData, onVillageSelect, villageItems],
  );

  const actionsRef = useRef({
    selectDistrict: handleDistrictClick,
    selectTaluka: handleTalukaClick,
    selectVillage: handleVillageClick,
  });
  const viewRef = useRef({ level, currentDistrictId });

  useEffect(() => {
    villageItemsRef.current = villageItems;
  }, [villageItems]);

  useEffect(() => {
    actionsRef.current = {
      selectDistrict: handleDistrictClick,
      selectTaluka: handleTalukaClick,
      selectVillage: handleVillageClick,
    };
  }, [handleDistrictClick, handleTalukaClick, handleVillageClick]);

  useEffect(() => {
    viewRef.current = { level, currentDistrictId };
  }, [currentDistrictId, level]);

  // Focus request handling from external pages
  useEffect(() => {
    if (!mapReady || !focusRequest || focusRequest.target.kind === "scheme") return;
    if (completedFocusRequestRef.current === focusRequest.id) return;
    const { target } = focusRequest;
    const districtId = target.districtId;
    if (!districtId) return;

    if (target.kind === "district") {
      if (level !== "district" || currentDistrictId !== districtId) {
        actionsRef.current.selectDistrict(districtId);
      } else {
        completedFocusRequestRef.current = focusRequest.id;
      }
      return;
    }

    const subdistrictCode = target.subdistrictCode;
    if (!subdistrictCode) return;
    if (currentDistrictId !== districtId || level === "state") {
      actionsRef.current.selectDistrict(districtId);
      return;
    }
    if (currentTalukaCode !== subdistrictCode || level === "district") {
      actionsRef.current.selectTaluka(subdistrictCode);
      return;
    }
    if (target.kind === "taluka") {
      completedFocusRequestRef.current = focusRequest.id;
      return;
    }
    if (target.kind === "village" && villageLoadState === "ready") {
      const villageCode = target.villageCode || target.id;
      const village = villageItems.find((item) => item.code === villageCode);
      if (village && currentVillageCode !== village.code) {
        actionsRef.current.selectVillage(village.code);
      } else {
        completedFocusRequestRef.current = focusRequest.id;
      }
    } else if (target.kind === "village" && villageLoadState === "error") {
      completedFocusRequestRef.current = focusRequest.id;
    }
  }, [currentDistrictId, currentTalukaCode, currentVillageCode, focusRequest, level, mapReady, villageItems, villageLoadState]);

  // Fetch official SOI village boundaries for active district
  useEffect(() => {
    if (!mapReady || level === "state" || boundaryDistrictId === currentDistrictId) return;
    const controller = new AbortController();
    const boundaryUrl = `/data/boundaries/soi-villages/${currentDistrictId}.geojson`;

    fetch(boundaryUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("No matching official boundary file.");
        return response.json();
      })
      .then((payload: DistrictCollection) => {
        if (controller.signal.aborted) return;
        const features = payload.features.map((feature) => {
          const pilotName = GHOGHA_48_VILLAGES.find((village) => village.code === feature.properties.villageCode)?.nameGu;
          return pilotName
            ? { ...feature, properties: { ...feature.properties, nameGu: pilotName } }
            : feature;
        });
        setOfficialBoundaryData({ ...payload, features });
        setBoundaryDistrictId(currentDistrictId);
      })
      .catch((error: Error) => {
        if (error.name === "AbortError") return;
        setOfficialBoundaryData(null);
        setBoundaryDistrictId(currentDistrictId);
      });
    return () => controller.abort();
  }, [boundaryDistrictId, currentDistrictId, level, mapReady]);

  // Initialize MapLibre
  useEffect(() => {
    const host = mapHostRef.current;
    if (!host) return;

    const map = new maplibregl.Map({
      container: host,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [GUJARAT_STATE_CENTER.lng, GUJARAT_STATE_CENTER.lat],
      zoom: GUJARAT_STATE_CENTER.zoom || 7.3,
      minZoom: 5.5,
      maxZoom: 18,
      maxPitch: 0,
      pitch: 0,
      attributionControl: false,
      cooperativeGestures: false,
      dragRotate: false,
      touchPitch: false,
      localIdeographFontFamily: "'Noto Sans Gujarati', sans-serif",
    });
    mapRef.current = map;
    map.addControl(new maplibregl.AttributionControl({ compact: false }), "bottom-right");

    let styleLoaded = false;
    map.on("error", (event) => {
      if (event.error?.message) setMapError(event.error.message);
    });
    const styleLoadTimeout = window.setTimeout(() => {
      if (!styleLoaded) {
        setMapError("Road map style did not finish loading. Check your connection and retry.");
      }
    }, 15000);

    const addAdminBoundaryLayers = () => {
      if (boundaryLayersAdded.current || !map.getSource("openmaptiles")) return;
      boundaryLayersAdded.current = true;

      map.addLayer({
        id: "taluka-boundaries",
        type: "line",
        source: "openmaptiles",
        "source-layer": "boundary",
        minzoom: 9.5,
        filter: ["all", ["==", ["get", "admin_level"], 7], ["!=", ["get", "maritime"], 1]],
        paint: {
          "line-color": "#0f766e",
          "line-width": ["interpolate", ["linear"], ["zoom"], 9.5, 1, 13, 2],
          "line-opacity": 0.86,
        },
      });

      map.addLayer({
        id: "village-boundaries",
        type: "line",
        source: "openmaptiles",
        "source-layer": "boundary",
        minzoom: 11.5,
        filter: ["all", ["==", ["get", "admin_level"], 8], ["!=", ["get", "maritime"], 1]],
        paint: {
          "line-color": "#d97706",
          "line-width": ["interpolate", ["linear"], ["zoom"], 11.5, 1, 15, 2.4],
          "line-opacity": 0.9,
        },
      });
    };

    map.once("style.load", () => {
      styleLoaded = true;
      window.clearTimeout(styleLoadTimeout);
      setMapError("");
      addAdminBoundaryLayers();
      setMapReady(true);

      fetch("/data/gujarat.geojson")
        .then((response) => {
          if (!response.ok) throw new Error("District boundary file could not be loaded.");
          return response.json();
        })
        .then((sourceData: DistrictCollection) => {
          const features = (sourceData.features || []).map((feature) => {
            const sourceName = String(feature.properties.district || "");
            const district = matchDistrict(sourceName);
            return {
              ...feature,
              properties: {
                ...feature.properties,
                districtId: district?.id || normalizeName(sourceName),
                region: district?.region || "",
                nameGu: district?.gu || sourceName,
              },
            } as DistrictFeature;
          });
          setDistrictData({ type: "FeatureCollection", features });
        })
        .catch((error: Error) => setMapError(error.message));
    });

    map.on("zoom", () => setMapZoom(Number(map.getZoom().toFixed(1))));

    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(host);

    return () => {
      window.clearTimeout(styleLoadTimeout);
      resizeObserver.disconnect();
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      boundaryLayersAdded.current = false;
      districtInteractionsAdded.current = false;
      officialBoundaryLayersAdded.current = false;
      officialBoundaryInteractionsAdded.current = false;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // District polygons & Hover Listeners
  useEffect(() => {
    if (!mapReady || !districtData || !mapRef.current) return;
    const map = mapRef.current;

    if (!map.getSource("geo-districts")) {
      map.addSource("geo-districts", {
        type: "geojson",
        data: districtData as never,
        promoteId: "districtId",
      });

      const beforeLayer = map.getLayer("boundary_3") ? "boundary_3" : undefined;

      map.addLayer(
        {
          id: "district-fill",
          type: "fill",
          source: "geo-districts",
          paint: {
            "fill-color": [
              "case",
              ["==", ["get", "districtId"], currentDistrictId],
              "#087f73",
              "#c9e7df",
            ],
            "fill-opacity": 0.32,
          },
        },
        beforeLayer,
      );

      map.addLayer(
        {
          id: "district-lines",
          type: "line",
          source: "geo-districts",
          paint: {
            "line-color": [
              "case",
              ["==", ["get", "districtId"], currentDistrictId],
              "#075e56",
              "#ffffff",
            ],
            "line-width": [
              "case",
              ["==", ["get", "districtId"], currentDistrictId],
              2.6,
              1.15,
            ],
            "line-opacity": 0.95,
          },
        },
        beforeLayer,
      );

      map.addLayer({
        id: "district-names",
        type: "symbol",
        source: "geo-districts",
        minzoom: 5.5,
        maxzoom: 10.5,
        layout: {
          "text-field": gu ? ["get", "nameGu"] : ["get", "district"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 5.5, 9, 9, 13],
          "text-font": ["Noto Sans Regular"],
          "text-allow-overlap": false,
          "text-ignore-placement": false,
        },
        paint: {
          "text-color": "#143d38",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.3,
        },
      });
    } else {
      const source = map.getSource("geo-districts") as maplibregl.GeoJSONSource;
      source.setData(districtData as never);
    }

    if (!districtInteractionsAdded.current && map.getLayer("district-fill")) {
      // Click district to fly in
      map.on("click", "district-fill", (event) => {
        if (viewRef.current.level !== "state") return;
        const feature = event.features?.[0];
        const districtId = String(feature?.properties?.districtId || "");
        if (districtId) actionsRef.current.selectDistrict(districtId);
      });

      // Hover on district shows name & details ("તેના પર રાખતા ભી તેનું નામ દેખાય")
      map.on("mousemove", "district-fill", (event) => {
        map.getCanvas().style.cursor = "pointer";
        const feature = event.features?.[0];
        if (!feature) return;
        const properties = feature.properties || {};
        const districtId = String(properties.districtId || "");
        const distObj = demoDistricts.find((d) => d.id === districtId);

        if (distObj) {
          setHoveredEntity({
            nameGu: distObj.gu,
            nameEn: distObj.name,
            type: "district",
            code: distObj.officialNo,
            x: event.point.x,
            y: event.point.y,
          });
        }
      });

      map.on("mouseleave", "district-fill", () => {
        map.getCanvas().style.cursor = "";
        setHoveredEntity(null);
      });

      districtInteractionsAdded.current = true;
    }
  }, [currentDistrictId, districtData, gu, mapReady]);

  // Village Boundaries layer & Hover Listeners
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !officialBoundaryData) return;

    const source = map.getSource("soi-villages") as maplibregl.GeoJSONSource | undefined;
    if (source) {
      source.setData(officialBoundaryData as never);
    } else {
      map.addSource("soi-villages", { type: "geojson", data: officialBoundaryData as never });
    }

    if (!officialBoundaryLayersAdded.current) {
      const beforeLayer = map.getLayer("label_other") ? "label_other" : undefined;

      map.addLayer(
        {
          id: "soi-villages-fill",
          type: "fill",
          source: "soi-villages",
          paint: {
            "fill-color": [
              "case",
              ["==", ["get", "villageCode"], currentVillageCode || ""],
              "#087f73",
              ["in", ["get", "villageCode"], ["literal", schemeCoverageVillageCodes]],
              "#10b981",
              "#9fb8c3",
            ],
            "fill-opacity": [
              "case",
              ["==", ["get", "villageCode"], currentVillageCode || ""],
              0.42,
              ["in", ["get", "villageCode"], ["literal", schemeCoverageVillageCodes]],
              0.32,
              0.08,
            ],
          },
        },
        beforeLayer,
      );

      map.addLayer(
        {
          id: "soi-villages-lines",
          type: "line",
          source: "soi-villages",
          paint: {
            "line-color": [
              "case",
              ["==", ["get", "villageCode"], currentVillageCode || ""],
              "#075e56",
              ["in", ["get", "villageCode"], ["literal", schemeCoverageVillageCodes]],
              "#047857",
              "#648b99",
            ],
            "line-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              7,
              0.65,
              12,
              1.25,
              15,
              1.8,
            ],
            "line-opacity": 0.9,
          },
        },
        beforeLayer,
      );

      map.addLayer(
        {
          id: "soi-villages-hit",
          type: "fill",
          source: "soi-villages",
          paint: { "fill-color": "#ffffff", "fill-opacity": 0.01 },
        },
        beforeLayer,
      );

      map.addLayer({
        id: "soi-villages-names",
        type: "symbol",
        source: "soi-villages",
        minzoom: 8.9,
        layout: {
          "text-field": gu
            ? ["coalesce", ["get", "nameGu"], ["get", "nameEn"]]
            : ["get", "nameEn"],
          "text-font": ["Noto Sans Regular"],
          "text-size": [
            "interpolate",
            ["linear"],
            ["zoom"],
            8.9,
            8,
            11,
            9.5,
            14,
            11,
          ],
          "text-allow-overlap": false,
          "text-ignore-placement": false,
        },
        paint: {
          "text-color": "#153d37",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.2,
        },
      });

      officialBoundaryLayersAdded.current = true;
    }

    if (!officialBoundaryInteractionsAdded.current) {
      // Click village boundary to select & fly in
      map.on("click", "soi-villages-hit", (event) => {
        const properties = event.features?.[0]?.properties;
        if (!properties) return;
        if (viewRef.current.level === "district" && properties.subdistrictCode) {
          actionsRef.current.selectTaluka(Number(properties.subdistrictCode));
        } else if (
          (viewRef.current.level === "taluka" || viewRef.current.level === "village") &&
          properties.villageCode
        ) {
          actionsRef.current.selectVillage(String(properties.villageCode));
        }
      });

      // Hover on village displays its Name & Scheme Reach count! ("તેના પર રાખતા ભી તેનું નામ દેખાય")
      map.on("mousemove", "soi-villages-hit", (event) => {
        map.getCanvas().style.cursor = "pointer";
        const properties = event.features?.[0]?.properties;
        if (!properties) return;

        const vCode = String(properties.villageCode || "");
        const nameEn = String(properties.nameEn || "");
        const nameGu = String(properties.nameGu || nameEn);

        if (viewRef.current.level === "district" && properties.subdistrictCode) {
          const sub = getSubdistrictsForDistrict(viewRef.current.currentDistrictId).find(
            (s) => s.code === Number(properties.subdistrictCode)
          );
          setHoveredEntity({
            nameGu: sub ? sub.nameGu : nameGu,
            nameEn: sub ? sub.nameEn : nameEn,
            type: "taluka",
            code: properties.subdistrictCode,
            x: event.point.x,
            y: event.point.y,
          });
        } else {
          const schemes = getVillageSchemes(vCode);
          const totalBen = schemes.reduce((sum, s) => sum + s.beneficiaries, 0);

          setHoveredEntity({
            nameGu,
            nameEn,
            type: "village",
            code: vCode,
            schemeCount: schemes.length,
            beneficiaries: totalBen,
            x: event.point.x,
            y: event.point.y,
          });
        }
      });

      map.on("mouseleave", "soi-villages-hit", () => {
        map.getCanvas().style.cursor = "";
        setHoveredEntity(null);
      });

      officialBoundaryInteractionsAdded.current = true;
    }
  }, [currentVillageCode, gu, mapReady, officialBoundaryData, schemeCoverageVillageCodes]);

  // Dynamic layer filters and Scheme Reach highlighting
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !map.getLayer("soi-villages-fill")) return;

    const districtCode = MASTER_DISTRICTS.find((item) => item.id === currentDistrictId)?.code;
    const filter: unknown[] = ["all", ["==", ["get", "districtCode"], districtCode || -1]];
    if (level === "taluka" || level === "village") {
      filter.push(["==", ["get", "subdistrictCode"], currentTalukaCode || -1]);
    }

    const visible = level === "district" || level === "taluka" || level === "village";
    const districtView = level === "district";
    const districtFillColor = talukaColorExpression(currentSubdistricts.map((item) => item.code));

    ["soi-villages-fill", "soi-villages-lines", "soi-villages-hit", "soi-villages-names"].forEach(
      (layerId) => {
        if (!map.getLayer(layerId)) return;
        map.setFilter(layerId, filter as never);
        map.setLayoutProperty(layerId, "visibility", visible ? "visible" : "none");
      }
    );

    map.setLayoutProperty(
      "soi-villages-names",
      "visibility",
      level === "taluka" || level === "village" ? "visible" : "none"
    );

    // Scheme Reach Highlight coloring
    map.setPaintProperty(
      "soi-villages-fill",
      "fill-color",
      districtView
        ? (districtFillColor as never)
        : [
            "case",
            ["==", ["get", "villageCode"], currentVillageCode || ""],
            "#087f73",
            ["in", ["get", "villageCode"], ["literal", schemeCoverageVillageCodes]],
            "#10b981",
            "#9fb8c3",
          ]
    );

    map.setPaintProperty(
      "soi-villages-fill",
      "fill-opacity",
      districtView
        ? 0.34
        : [
            "case",
            ["==", ["get", "villageCode"], currentVillageCode || ""],
            0.44,
            ["in", ["get", "villageCode"], ["literal", schemeCoverageVillageCodes]],
            0.34,
            0.08,
          ]
    );

    map.setPaintProperty(
      "soi-villages-lines",
      "line-color",
      districtView
        ? (districtFillColor as never)
        : [
            "case",
            ["==", ["get", "villageCode"], currentVillageCode || ""],
            "#075e56",
            ["in", ["get", "villageCode"], ["literal", schemeCoverageVillageCodes]],
            "#047857",
            "#648b99",
          ]
    );
  }, [
    currentDistrictId,
    currentSubdistricts,
    currentTalukaCode,
    currentVillageCode,
    level,
    mapReady,
    officialBoundaryData,
    schemeCoverageVillageCodes,
  ]);

  // Fetch villages for active subdistrict
  useEffect(() => {
    if (!currentTalukaCode) return;
    const controller = new AbortController();

    fetch("/api/v1/geo/hierarchy?subdistrictCode=" + currentTalukaCode, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Village hierarchy could not be loaded.");
        return response.json();
      })
      .then((payload) => {
        if (payload.status !== "success" || !Array.isArray(payload.data)) {
          throw new Error("No village list was returned for this taluka.");
        }
        const records = payload.data.map(
          (record: { code: string | number; nameEn: string }) => {
            const code = String(record.code);
            const sample = GHOGHA_48_VILLAGES.find((village) => village.code === code);
            return {
              code,
              nameEn: record.nameEn,
              nameGu: sample?.nameGu,
              sample,
            } satisfies VillageItem;
          }
        );
        setVillageItems(records);
        setVillageLoadState("ready");
      })
      .catch((error: Error) => {
        if (error.name === "AbortError") return;
        setVillageItems([]);
        setVillageLoadState("error");
      });

    return () => controller.abort();
  }, [currentTalukaCode, villageLoadVersion]);

  const goToDistrict = (district: District) => handleDistrictClick(district.id);
  const goToTaluka = (subdistrict: MasterSubdistrict) => handleTalukaClick(subdistrict.code);
  const goToVillage = (village: VillageItem) => handleVillageClick(village.code);

  const resetMap = () => {
    setLevel("state");
    setCurrentTalukaCode(null);
    setCurrentVillageCode(null);
    setVillageItems([]);
    setVillageLoadState("idle");
    setListSearch("");
    setFocusNotice("");
    setHoveredEntity(null);

    if (districtData?.features.length) {
      const bounds = districtData.features.reduce(
        (result, feature) => {
          const next = featureBounds(feature);
          if (!next) return result;
          return [
            [Math.min(result[0][0], next[0][0]), Math.min(result[0][1], next[0][1])],
            [Math.max(result[1][0], next[1][0]), Math.max(result[1][1], next[1][1])],
          ] as [[number, number], [number, number]];
        },
        [
          [Infinity, Infinity],
          [-Infinity, -Infinity],
        ] as [[number, number], [number, number]]
      );
      if (Number.isFinite(bounds[0][0])) {
        mapRef.current?.fitBounds(bounds, { padding: 35, duration: 1000 });
        return;
      }
    }

    mapRef.current?.flyTo({
      center: [GUJARAT_STATE_CENTER.lng, GUJARAT_STATE_CENTER.lat],
      zoom: GUJARAT_STATE_CENTER.zoom || 7.3,
      duration: 900,
    });
  };

  const handleBack = () => {
    if (level === "village") {
      setLevel("taluka");
      setCurrentVillageCode(null);
      setFocusNotice("");
    } else if (level === "taluka") {
      setLevel("district");
      setCurrentVillageCode(null);
      setFocusNotice("");
    } else if (level === "district") {
      setLevel("state");
      setCurrentTalukaCode(null);
      setCurrentVillageCode(null);
      setVillageItems([]);
      setVillageLoadState("idle");
      setFocusNotice("");
    }
  };

  const filteredDistricts = useMemo(() => {
    const query = normalizeName(listSearch);
    return demoDistricts.filter((district) => {
      const regionMatch = regionFilter === "all" || district.region === regionFilter;
      const searchMatch =
        !query ||
        normalizeName(district.name).includes(query) ||
        normalizeName(district.gu).includes(query);
      return regionMatch && searchMatch;
    });
  }, [listSearch, regionFilter]);

  const filteredTalukas = useMemo(() => {
    const query = normalizeName(listSearch);
    return currentSubdistricts.filter((subdistrict) => {
      return (
        !query ||
        normalizeName(subdistrict.nameEn).includes(query) ||
        normalizeName(subdistrict.nameGu).includes(query) ||
        String(subdistrict.code).includes(listSearch.trim())
      );
    });
  }, [currentSubdistricts, listSearch]);

  const filteredVillages = useMemo(() => {
    const query = normalizeName(listSearch);
    return villageItems.filter((village) => {
      return (
        !query ||
        normalizeName(village.nameEn).includes(query) ||
        normalizeName(village.nameGu || "").includes(query) ||
        village.code.includes(listSearch.trim())
      );
    });
  }, [listSearch, villageItems]);

  const panelTitle =
    level === "state"
      ? gu
        ? "ગુજરાત રાજ્ય"
        : "Gujarat State"
      : level === "district"
      ? gu
        ? `[${currentDistrict.officialNo}] ${currentDistrict.gu} જિલ્લો`
        : `[${currentDistrict.officialNo}] ${currentDistrict.name} District`
      : level === "taluka"
      ? currentTaluka
        ? gu
          ? `${currentTaluka.nameGu} તાલુકો`
          : `${currentTaluka.nameEn} Taluka`
        : gu
        ? "તાલુકો પસંદ કરો"
        : "Select a taluka"
      : currentVillage
      ? gu
        ? `${currentVillage.nameGu || currentVillage.nameEn} ગામ`
        : `${currentVillage.nameEn} Village`
      : gu
      ? "ગામ પસંદ કરો"
      : "Select a village";

  const currentEntities =
    level === "state"
      ? filteredDistricts.length
      : level === "district"
      ? filteredTalukas.length
      : filteredVillages.length;

  return (
    <div className={"geo-explorer geo-explorer--" + variant}>
      {variant !== "embedded" && (
        <div className="geo-map-toolbar">
          <nav className="geo-breadcrumbs" aria-label={gu ? "ભૌગોલિક માર્ગ" : "Geographic breadcrumb"}>
            <button className={level === "state" ? "is-active" : ""} onClick={resetMap}>
              <MapPinned size={15} />
              <span>{gu ? "ગુજરાત (૩૪ જિલ્લા)" : "Gujarat (34 Districts)"}</span>
            </button>
            {level !== "state" && (
              <>
                <ChevronRight size={14} />
                <button
                  className={level === "district" ? "is-active" : ""}
                  onClick={() => {
                    setLevel("district");
                    setCurrentTalukaCode(null);
                    setCurrentVillageCode(null);
                    setShowVillageList(false);
                  }}
                >
                  <Building2 size={14} />
                  <span>
                    [{currentDistrict.officialNo}] {gu ? currentDistrict.gu : currentDistrict.name}
                  </span>
                </button>
              </>
            )}
            {(level === "taluka" || level === "village") && currentTaluka && (
              <>
                <ChevronRight size={14} />
                <button
                  className={level === "taluka" ? "is-active" : ""}
                  onClick={() => {
                    setLevel("taluka");
                    setCurrentVillageCode(null);
                    setShowVillageList(true);
                  }}
                >
                  <Landmark size={14} />
                  <span>{gu ? currentTaluka.nameGu : currentTaluka.nameEn}</span>
                </button>
              </>
            )}
            {level === "village" && currentVillage && (
              <>
                <ChevronRight size={14} />
                <span className="geo-current-crumb">
                  <Home size={14} style={{ display: "inline-block", marginRight: "4px" }} />
                  {gu ? currentVillage.nameGu || currentVillage.nameEn : currentVillage.nameEn}
                </span>
              </>
            )}
          </nav>
          <div className="geo-toolbar-actions">
            {level !== "state" && (
              <button className="geo-back-button" onClick={handleBack}>
                <ArrowLeft size={15} />
                <span>{gu ? "ઉપરના સ્તરે જાઓ" : "Back"}</span>
              </button>
            )}
            <span className="geo-fy-pill">FY {fy}</span>
            <span className="geo-demo-pill" style={{ background: "#ecfdf5", color: "#065f46", borderColor: "#a7f3d0" }}>
              <Award size={13} />
              {gu ? "ગુજરાત સરકાર સત્તાવાર" : "Govt of Gujarat"}
            </span>
          </div>
        </div>
      )}

      <div className="geo-explorer-layout">
        <section
          className="geo-map-card"
          style={mapHeight ? { height: mapHeight } : undefined}
          aria-label={gu ? "ઇન્ટરેક્ટિવ ગુજરાત નકશો" : "Interactive Gujarat map"}
        >
          <div className="geo-map-canvas" ref={mapHostRef} />

          {/* Interactive Floating Hover Card: "તેના પર રાખતા ભી તેનું નામ દેખાય" */}
          {hoveredEntity && (
            <div
              className="geo-map-hover-card"
              style={{
                position: "absolute",
                left: Math.min(Math.max(hoveredEntity.x + 14, 12), 480),
                top: Math.max(hoveredEntity.y - 50, 14),
                pointerEvents: "none",
                zIndex: 20,
              }}
            >
              <div className="gmhc-pill-row">
                <span className="gmhc-pill">
                  {hoveredEntity.type === "district"
                    ? (gu ? "જિલ્લો" : "District")
                    : hoveredEntity.type === "taluka"
                    ? (gu ? "તાલુકો" : "Taluka")
                    : (gu ? "ગામ" : "Village")}
                  {hoveredEntity.code ? ` [${hoveredEntity.code}]` : ""}
                </span>
              </div>
              <div className="gmhc-title-row">
                <strong>{gu ? hoveredEntity.nameGu : hoveredEntity.nameEn}</strong>
                {gu && hoveredEntity.nameEn !== hoveredEntity.nameGu && (
                  <small>{hoveredEntity.nameEn}</small>
                )}
              </div>
              {hoveredEntity.type === "village" && (
                <div className="gmhc-meta-row">
                  <span className="gmhc-scheme-tag">
                    {hoveredEntity.schemeCount || 4} {gu ? "યોજનાઓ પહોંચી" : "Schemes Delivered"}
                  </span>
                  {hoveredEntity.beneficiaries ? (
                    <span className="gmhc-ben-tag">
                      {formatNumber(hoveredEntity.beneficiaries, gu)} {gu ? "લાભાર્થી" : "Ben."}
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          )}

          {!mapReady && !mapError && (
            <div className="geo-map-loading" role="status">
              <span className="geo-loading-spinner" />
              {gu ? "ગુજરાત નકશો લોડ થાય છે..." : "Loading Gujarat map…"}
            </div>
          )}

          {mapError && (
            <div className="geo-map-error" role="alert">
              <Info size={16} />
              <span>
                {gu ? "નકશાનો ડેટા લોડ થયો નથી." : mapError}
                {gu && mapError ? <small className="geo-map-error-detail">{mapError}</small> : null}
              </span>
              <button onClick={() => window.location.reload()}>
                {gu ? "ફરી પ્રયાસ કરો" : "Retry"}
              </button>
            </div>
          )}

          <div className="geo-map-controls" aria-label={gu ? "નકશા નિયંત્રણો" : "Map controls"}>
            <button
              onClick={() => mapRef.current?.zoomIn({ duration: 300 })}
              aria-label={gu ? "ઝૂમ ઇન" : "Zoom in"}
              title={gu ? "ઝૂમ ઇન" : "Zoom in"}
            >
              <Plus size={18} />
            </button>
            <button
              onClick={() => mapRef.current?.zoomOut({ duration: 300 })}
              aria-label={gu ? "ઝૂમ આઉટ" : "Zoom out"}
              title={gu ? "ઝૂમ આઉટ" : "Zoom out"}
            >
              <Minus size={18} />
            </button>
            <button
              onClick={resetMap}
              aria-label={gu ? "સમગ્ર ગુજરાત નકશો" : "Reset to Gujarat"}
              title={gu ? "સમગ્ર ગુજરાત નકશો" : "Reset to Gujarat"}
            >
              <RotateCcw size={16} />
            </button>
          </div>

          {variant !== "embedded" && (
            <div className="geo-map-coverage-legend" aria-live="polite">
              <span className="geo-coverage-swatch" style={{ background: "#10b981" }} />
              <span>
                {selectedScheme
                  ? gu
                    ? `પહોંચેલી યોજના: ${selectedScheme.shortNameGu}`
                    : `Active scheme: ${selectedScheme.shortName}`
                  : gu
                  ? "ગ્રામીણ યોજના કવરેજ અને સંતૃપ્તિ (Village Scheme Reach)"
                  : "Village Scheme Reach & Saturation"}
              </span>
            </div>
          )}

          <div className="geo-zoom-status">
            <span className="geo-zoom-dot" />
            <span>
              {level === "state"
                ? gu ? "૩૪ જિલ્લાઓની સરહદ" : "District Boundaries"
                : level === "district"
                ? gu ? `[${currentDistrict.officialNo}] ${currentDistrict.gu}ના તાલુકાઓ` : "Taluka Boundaries"
                : gu ? "ગામડાંઓની વાસ્તવિક સરહદ" : "Village Boundaries"}
            </span>
            <b>{mapZoom.toFixed(1)}×</b>
          </div>

          <div className="geo-map-hint">
            <span className="geo-map-hint-full">
              {gu
                ? "નકશા પર કર્સર રાખવાથી નામ દેખાશે · ક્લિક કરવાથી વિસ્તારમાં અંદર જઈ શકાશે"
                : "Hover over map to see names · Click to zoom in"}
            </span>
          </div>
        </section>

        {variant !== "embedded" && (
          <aside
            className={
              "geo-detail-panel" +
              (level === "taluka" ? " geo-detail-panel--taluka-list" : "") +
              (level === "village"
                ? showVillageList
                  ? " geo-detail-panel--village-list"
                  : " geo-detail-panel--village-selected"
                : "")
            }
            aria-label={gu ? "વિસ્તારની વિગતો" : "Geographic details"}
          >
            <div className="geo-panel-top">
              <div>
                <span className="geo-panel-kicker">
                  {level === "village"
                    ? gu ? "પસંદ કરેલું ગામ અને યોજના પહોંચ" : "VILLAGE SCHEME DELIVERY"
                    : level === "taluka"
                    ? gu ? "તાલુકો અને ગામડાંઓની યાદી" : "TALUKA & VILLAGES"
                    : level === "district"
                    ? gu ? "જિલ્લો અને તાલુકાઓ" : "DISTRICT & TALUKAS"
                    : gu ? "સમગ્ર ગુજરાત કમાન્ડ સેન્ટર" : "GUJARAT COMMAND"}
                </span>
                <h2>{panelTitle}</h2>
                <p>
                  {level === "state"
                    ? gu
                      ? "કોઈપણ જિલ્લા પર ક્લિક કરો અથવા નીચેથી જિલ્લો પસંદ કરો."
                      : "Click any district on map or pick from list below."
                    : level === "district"
                    ? gu
                      ? `${currentSubdistricts.length} તાલુકાઓ · ક્લિક કરી ગામડાંઓમાં ઉતરો.`
                      : `${currentSubdistricts.length} talukas · choose one to explore villages.`
                    : level === "taluka"
                    ? gu
                      ? villageLoadState === "ready"
                        ? `${villageItems.length} ગામો · ગામ પર ક્લિક કરી કઈ કઈ યોજના પહોંચી તે જુઓ.`
                        : "ગામોની યાદી લોડ થાય છે..."
                      : villageLoadState === "ready"
                      ? `${villageItems.length} villages · click to view delivered schemes.`
                      : "Loading villages list…"
                    : gu
                    ? "આ ગામમાં પહોંચેલી તમામ યોજનાઓની વિગત નીચે મુજબ છે:"
                    : "Government schemes delivered to this village:"}
                </p>
              </div>
              <span className="geo-count-pill">{formatNumber(currentEntities, gu)}</span>
              {level === "village" && (
                <button
                  className="geo-village-switch"
                  onClick={() => setShowVillageList((visible) => !visible)}
                >
                  {showVillageList
                    ? gu ? "યોજના વિગત જુઓ" : "Show details"
                    : gu ? "ગામ બદલો" : "Change village"}
                </button>
              )}
            </div>

            {/* List search box */}
            <label
              className={
                "geo-list-search" + (level === "village" && !showVillageList ? " is-hidden" : "")
              }
            >
              <Search size={16} />
              <input
                type="search"
                value={listSearch}
                onChange={(event) => setListSearch(event.target.value)}
                placeholder={
                  level === "state"
                    ? gu ? "જિલ્લો શોધો..." : "Search districts…"
                    : level === "district"
                    ? gu ? "તાલુકો શોધો..." : "Search talukas…"
                    : gu ? "ગામનું નામ શોધો..." : "Search villages…"
                }
                aria-label={gu ? "વિસ્તાર શોધો" : "Search geographic units"}
              />
            </label>

            {/* Entity List (Districts, Talukas, or Villages) */}
            <div
              className={
                "geo-entity-list" +
                (level === "village" || level === "taluka" ? " geo-entity-list--villages" : "") +
                (level === "village" && !showVillageList ? " is-hidden" : "")
              }
              role="list"
            >
              {level === "state" &&
                filteredDistricts.map((district) => {
                  const subdistrictCount = getSubdistrictsForDistrict(district.id).length;
                  return (
                    <button
                      key={district.id}
                      role="listitem"
                      className={
                        "geo-entity-row" + (district.id === currentDistrictId ? " is-selected" : "")
                      }
                      onClick={() => goToDistrict(district)}
                    >
                      <span className="geo-entity-icon">
                        <Building2 size={16} />
                      </span>
                      <span className="geo-entity-name">
                        <b>[{district.officialNo}] {gu ? district.gu : district.name}</b>
                        <small>{gu ? district.regionGu : district.region}</small>
                      </span>
                      <span className="geo-entity-meta">
                        {subdistrictCount} {gu ? "તાલુકા" : "talukas"}
                      </span>
                      <ChevronRight size={15} />
                    </button>
                  );
                })}

              {level === "district" &&
                filteredTalukas.map((subdistrict) => (
                  <button
                    key={subdistrict.code}
                    role="listitem"
                    className={
                      "geo-entity-row" +
                      (subdistrict.code === currentTalukaCode ? " is-selected" : "")
                    }
                    onClick={() => goToTaluka(subdistrict)}
                  >
                    <span className="geo-entity-icon geo-entity-icon--teal">
                      <Landmark size={16} />
                    </span>
                    <span className="geo-entity-name">
                      <b>{gu ? subdistrict.nameGu : subdistrict.nameEn}</b>
                      <small>LGD {subdistrict.code}</small>
                    </span>
                    <span className="geo-entity-meta">
                      {formatNumber(subdistrict.villageCount, gu)} {gu ? "ગામ" : "villages"}
                    </span>
                    <ChevronRight size={15} />
                  </button>
                ))}

              {(level === "taluka" || level === "village") &&
                filteredVillages.map((village) => {
                  const schemes = getVillageSchemes(village.code);
                  return (
                    <button
                      key={village.code}
                      role="listitem"
                      className={
                        "geo-entity-row" +
                        (village.code === currentVillageCode ? " is-selected" : "")
                      }
                      onClick={() => goToVillage(village)}
                    >
                      <span className="geo-entity-icon geo-entity-icon--amber">
                        <Home size={16} />
                      </span>
                      <span className="geo-entity-name">
                        <b>{gu ? village.nameGu || village.nameEn : village.nameEn}</b>
                        <small>LGD {village.code}</small>
                      </span>
                      <span className="geo-entity-meta" style={{ color: "#059669", fontWeight: 700 }}>
                        {schemes.length} {gu ? "યોજના પહોંચી" : "schemes"}
                      </span>
                      <ChevronRight size={15} />
                    </button>
                  );
                })}

              {level === "taluka" && villageLoadState === "loading" && (
                <div className="geo-list-message" role="status">
                  {gu ? "ગામોની યાદી લોડ થાય છે..." : "Loading villages…"}
                </div>
              )}
            </div>

            {/* Profile Card: Dedicated Scheme Reach & Saturation Representation */}
            <section className="geo-profile-card" aria-live="polite">
              <div className="geo-profile-heading">
                <div>
                  <span className="geo-panel-kicker">
                    {gu ? "સરકારી યોજના પહોંચ રિપોર્ટ" : "SCHEME DELIVERY REPORT"}
                  </span>
                  <h3>{panelTitle}</h3>
                </div>
                <span className="geo-source-pill" style={{ background: "#ecfdf5", color: "#065f46" }}>
                  <Award size={12} /> {gu ? "ગુજરાત પોર્ટલ" : "Gujarat Portal"}
                </span>
              </div>

              {/* VILLAGE LEVEL: FULL SCHEME DELIVERY PRESENTATION */}
              {level === "village" && currentVillage && currentVillageSchemeSummary ? (
                <>
                  <div className="geo-village-summary">
                    <span>
                      <Home size={15} /> {gu ? currentTaluka?.nameGu : currentTaluka?.nameEn}
                    </span>
                    <span>
                      <Landmark size={15} /> [{currentDistrict.officialNo}] {gu ? currentDistrict.gu : currentDistrict.name}
                    </span>
                  </div>

                  {/* 4 Summary KPIs */}
                  <div className="geo-village-stats" style={{ gridTemplateColumns: "repeat(3, 1fr)", margin: "10px 0" }}>
                    <div>
                      <Award size={15} style={{ color: "#059669" }} />
                      <b>{currentVillageSchemeSummary.totalSchemesReached}</b>
                      <small>{gu ? "પહોંચેલી યોજનાઓ" : "Schemes Reached"}</small>
                    </div>
                    <div>
                      <Users size={15} style={{ color: "#0284c7" }} />
                      <b>{formatNumber(currentVillageSchemeSummary.totalBeneficiaries, gu)}</b>
                      <small>{gu ? "કુલ લાભાર્થી" : "Beneficiaries"}</small>
                    </div>
                    <div>
                      <Wallet size={15} style={{ color: "#d97706" }} />
                      <b>₹ {formatNumber(currentVillageSchemeSummary.totalGrantLakhs, gu)} L</b>
                      <small>{gu ? "ચુકવેલ DBT સહાય" : "Disbursed"}</small>
                    </div>
                  </div>

                  {/* Delivery Saturation Banner */}
                  <div
                    style={{
                      background: "#f0fdf4",
                      border: "1px solid #86efac",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      margin: "8px 0",
                    }}
                  >
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#166534" }}>
                      {gu ? "યોજના સંતૃપ્તિ (Saturation):" : "Delivery Saturation:"}
                    </span>
                    <strong style={{ fontSize: "14px", color: "#15803d" }}>
                      {currentVillageSchemeSummary.overallSaturation}% {gu ? "પૂર્ણ" : "Complete"}
                    </strong>
                  </div>

                  {/* Detailed Schemes Delivered List */}
                  <div className="geo-village-scheme-list">
                    <span className="geo-panel-kicker">
                      {gu ? "આ ગામ સુધી પહોંચેલી સરકારી યોજનાઓ:" : "SCHEMES DELIVERED TO THIS VILLAGE:"}
                    </span>

                    {currentVillageSchemeAssignments.map((assignment) => (
                      <div
                        className="geo-village-scheme-row"
                        key={assignment.schemeId}
                        style={{
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          padding: "10px",
                          marginBottom: "8px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                          <strong style={{ color: "#0f172a", fontSize: "13px" }}>
                            {gu ? assignment.schemeNameGu : assignment.schemeNameEn}
                          </strong>
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 800,
                              padding: "2px 6px",
                              borderRadius: "4px",
                              background: assignment.status === "completed" ? "#dcfce7" : "#fef3c7",
                              color: assignment.status === "completed" ? "#15803d" : "#b45309",
                            }}
                          >
                            {assignment.status === "completed"
                              ? gu ? "સંપૂર્ણ પહોંચ" : "Delivered"
                              : gu ? "પ્રગતિ હેઠળ" : "Active"}
                          </span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#475569" }}>
                          <span>
                            <b>{formatNumber(assignment.beneficiaries, gu)}</b> {gu ? "લાભાર્થી" : "Ben."}
                          </span>
                          <span>
                            <b>₹ {formatNumber(assignment.grantLakhs, gu)} {gu ? "લાખ DBT" : "Lakh"}</b>
                          </span>
                        </div>

                        <div style={{ width: "100%", height: "4px", background: "#f1f5f9", borderRadius: "2px", marginTop: "6px", overflow: "hidden" }}>
                          <div
                            style={{
                              width: `${assignment.saturationPct}%`,
                              height: "100%",
                              background: assignment.saturationPct >= 90 ? "#10b981" : "#3b82f6",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* School / Venue details */}
                  <div
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      padding: "8px 10px",
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                      margin: "8px 0",
                      fontSize: "11px",
                    }}
                  >
                    <School size={16} color="#0284c7" />
                    <div>
                      <small style={{ color: "#64748b", display: "block" }}>
                        {gu ? "ગામમાં યોજના કાર્યક્રમ સ્થળ (નોંધપોથી મુજબ):" : "Programme Venue:"}
                      </small>
                      <strong style={{ color: "#0f172a" }}>
                        {currentVillage.sample?.venueGu || `${currentVillage.nameGu || currentVillage.nameEn} પ્રાથમિક શાળા`}
                      </strong>
                    </div>
                  </div>
                </>
              ) : (
                /* STATE OR DISTRICT LEVEL SUMMARY */
                <>
                  <div className="geo-summary-grid">
                    <div>
                      <Building2 size={16} />
                      <b>{level === "state" ? 34 : 1}</b>
                      <small>{gu ? "જિલ્લા" : "Districts"}</small>
                    </div>
                    <div>
                      <Landmark size={16} />
                      <b>{level === "state" ? 309 : currentSubdistricts.length}</b>
                      <small>{gu ? "તાલુકા" : "Talukas"}</small>
                    </div>
                  </div>

                  <div className="geo-compact-schemes">
                    <span className="geo-panel-kicker">
                      {gu ? "મુખ્ય સરકારી યોજનાઓ અને પહોંચ:" : "FLAGSHIP SCHEMES REACH:"}
                    </span>
                    {MAP_SCHEME_OPTIONS.slice(0, 6).map((scheme) => (
                      <div className="geo-scheme-row" key={scheme.id}>
                        <span>
                          <CheckCircle2 size={14} style={{ color: "#059669" }} />
                          {gu ? scheme.shortNameGu : scheme.shortName}
                        </span>
                        <small style={{ color: "#0284c7", fontWeight: 700 }}>
                          {gu ? "રાજ્યવ્યાપી સક્રિય" : "Statewide Active"}
                        </small>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="geo-data-disclaimer">
                {gu
                  ? "ગુજરાત સરકાર · યોજના દૃષ્ટિ જીઓ-ઇન્ટેલિજન્સ પ્લેટફોર્મ (LGD Census Boundaries & DBT Schemes Network)."
                  : "Government of Gujarat · Yojana Drishti Geo-Intelligence Platform."}
              </div>
            </section>
          </aside>
        )}
      </div>

      
    </div>
  );
}
