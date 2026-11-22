"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { localizeText } from "@/lib/i18n";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

maplibregl.setWorkerUrl(
  new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).toString(),
);

import {
  ArrowLeft,
  Building2,
  ChevronRight,
  Home,
  Info,
  Landmark,
  MapPinned,
  Minus,
  Plus,
  RotateCcw,
  Search,
  Award,
} from "lucide-react";

import {
  demoDistricts,
  demoTalukas,
  demoVillages,
  type District,
  type Taluka,
  type Village,
} from "@/lib/demo-data";

import {
  GHOGHA_48_VILLAGES,
  MASTER_DISTRICTS,
  MASTER_SUBDISTRICTS,
  getSubdistrictsForDistrict,
  type MasterSubdistrict,
  type MasterVillage,
} from "@/lib/master-hierarchy";

import { DISTRICT_LAT_LNG, GUJARAT_STATE_CENTER, TALUKA_GPS_COORDS } from "@/lib/geo-coordinates";
import type { AppLanguage } from "@/lib/i18n";


export type GeoLevel = "state" | "district" | "taluka" | "village";

type Region = District["region"];
type VillageItem = {
  code: string;
  nameEn: string;
  nameGu?: string;
  category?: string;
  status?: string;
  sample?: MasterVillage;
};

export type MapSelectedLocation = {
  locationCode: string;
  nameEn: string;
  nameGu: string;
  category?: string;
  talukaCode: string;
  talukaNameEn: string;
  talukaNameGu: string;
  districtCode: string;
  districtNameEn: string;
  districtNameGu: string;
};

export type MapSelectedArea = {
  level: "district" | "taluka";
  districtCode: string;
  subdistrictCode?: string;
  districtNameEn: string;
  districtNameGu: string;
  areaNameEn: string;
  areaNameGu: string;
};

type DistrictFeature = {
  type: "Feature";
  geometry: { type: string; coordinates: unknown };
  properties: Record<string, unknown> & {
    districtId?: string;
    district?: string;
    nameGu?: string;
    nameHi?: string;
    region?: string;
    villageCode?: string;
    subdistrictCode?: number;
    districtCode?: number;
    nameEn?: string;
    areaSqKm?: number;
    unitColor?: string;
    talukaColor?: string;
    settlementColor?: string;
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
  areaSqKm?: number;
  boundaryMatch?: "exact" | "fallback";
  x: number;
  y: number;
}

interface GujaratInteractiveMapProps {
  gu: boolean;
  lang?: AppLanguage;
  fy: string;
  selectedDistrictId?: string;
  onDistrictSelect?: (district: District) => void;
  onTalukaSelect?: (taluka: Taluka) => void;
  onVillageSelect?: (village: Village) => void;
  onLocationSelect?: (location: MapSelectedLocation | null) => void;
  onAreaSelect?: (area: MapSelectedArea | null) => void;
  regionFilter?: "all" | Region;
  variant?: "explorer" | "overview" | "embedded";
  initialLevel?: GeoLevel;
  mapHeight?: string;
  focusRequest?: MapFocusRequest | null;
}

function colorForOrdinal(
  ordinal: number,
  hueOffset: number,
  saturation = 0.43,
) {
  // Keep map fills within the requested muted blue family while varying hue,
  // saturation, and lightness enough to distinguish neighboring boundaries.
  const paletteIndex = Math.abs((ordinal * 7 + hueOffset) % 45);
  const hue = (198 + (paletteIndex % 9) * 3) / 30;
  const lightness = 0.58 + Math.floor(paletteIndex / 9) * 0.06;
  const amplitude = saturation * Math.min(lightness, 1 - lightness);
  const channel = (n: number) => {
    const k = (n + hue) % 12;
    const value = lightness - amplitude * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(value * 255).toString(16).padStart(2, "0");
  };
  return `#${channel(0)}${channel(8)}${channel(4)}`;
}

function stableHash(value: string) {
  let hash = 0;
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return hash;
}

function districtColor(districtId: string) {
  const ordinal = MASTER_DISTRICTS.findIndex((item) => item.id === districtId);
  return colorForOrdinal(ordinal < 0 ? stableHash(districtId) : ordinal, 14);
}

function talukaColor(subdistrictCode: number) {
  const ordinal = MASTER_SUBDISTRICTS.findIndex((item) => item.code === subdistrictCode);
  return colorForOrdinal(ordinal < 0 ? stableHash(String(subdistrictCode)) : ordinal, 58);
}

function settlementColor(locationCode: string) {
  const hash = stableHash(locationCode);
  const saturation = 0.5 + ((hash >>> 8) % 16) / 100;
  return colorForOrdinal(hash, 132, saturation);
}

const MAP_COLOR_SWATCHES = Array.from({ length: 8 }, (_, index) => colorForOrdinal(index, 14));

function ringStats(value: unknown): { area: number; center: [number, number] | null } {
  if (!Array.isArray(value) || value.length < 4) return { area: 0, center: null };
  const ring = value.filter((point): point is [number, number] =>
    Array.isArray(point) && typeof point[0] === "number" && typeof point[1] === "number",
  );
  if (ring.length < 4) return { area: 0, center: null };
  let crossTotal = 0;
  let longitudeTotal = 0;
  let latitudeTotal = 0;
  for (let index = 0; index < ring.length - 1; index += 1) {
    const [x1, y1] = ring[index];
    const [x2, y2] = ring[index + 1];
    const cross = x1 * y2 - x2 * y1;
    crossTotal += cross;
    longitudeTotal += (x1 + x2) * cross;
    latitudeTotal += (y1 + y2) * cross;
  }
  if (Math.abs(crossTotal) < 1e-12) return { area: 0, center: null };
  const center: [number, number] = [longitudeTotal / (3 * crossTotal), latitudeTotal / (3 * crossTotal)];
  const area = Math.abs(crossTotal / 2) * 111.32 * 111.32 * Math.cos((center[1] * Math.PI) / 180);
  return { area, center };
}

function polygonStats(value: unknown): { area: number; center: [number, number] | null } {
  if (!Array.isArray(value) || value.length === 0) return { area: 0, center: null };
  let totalArea = 0;
  let longitudeTotal = 0;
  let latitudeTotal = 0;
  value.forEach((ring, index) => {
    const stats = ringStats(ring);
    if (!stats.center || !stats.area) return;
    const ringArea = index === 0 ? stats.area : -stats.area;
    totalArea += ringArea;
    longitudeTotal += stats.center[0] * ringArea;
    latitudeTotal += stats.center[1] * ringArea;
  });
  if (totalArea <= 0) return { area: 0, center: null };
  return { area: totalArea, center: [longitudeTotal / totalArea, latitudeTotal / totalArea] };
}

function geometryStats(geometry: DistrictFeature["geometry"]): { area: number; center: [number, number] | null } {
  const polygons = geometry.type === "Polygon"
    ? [geometry.coordinates]
    : geometry.type === "MultiPolygon" && Array.isArray(geometry.coordinates)
      ? geometry.coordinates
      : [];
  let totalArea = 0;
  let longitudeTotal = 0;
  let latitudeTotal = 0;
  polygons.forEach((polygon) => {
    const stats = polygonStats(polygon);
    if (!stats.center || !stats.area) return;
    totalArea += stats.area;
    longitudeTotal += stats.center[0] * stats.area;
    latitudeTotal += stats.center[1] * stats.area;
  });
  return totalArea > 0
    ? { area: totalArea, center: [longitudeTotal / totalArea, latitudeTotal / totalArea] }
    : { area: 0, center: null };
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

function formatNumber(value: number, gu: boolean, lang: AppLanguage = gu ? "gu" : "en") {
  return new Intl.NumberFormat(gu ? "gu-IN" : lang === "hi" ? "hi-IN" : "en-IN").format(value);
}

/** Blank basemap used when the online style cannot load, so our own boundary polygons still work. */
const OFFLINE_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {},
  layers: [{ id: "offline-background", type: "background", paint: { "background-color": "#e9eef4" } }],
};

export function GujaratInteractiveMap({
  gu,
  lang = gu ? "gu" : "en",
  selectedDistrictId = "bhavnagar",
  onDistrictSelect,
  onTalukaSelect,
  onVillageSelect,
  onLocationSelect,
  onAreaSelect,
  regionFilter = "all",
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
  const talukaLabelInteractionsAdded = useRef(false);

  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState("");
  const [basemapOffline, setBasemapOffline] = useState(false);
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

  const currentVillage = useMemo<VillageItem | null>(() => {
    if (!currentVillageCode) return null;
    const fromItems = villageItems.find((village) => String(village.code) === String(currentVillageCode));
    if (fromItems) return fromItems;
    const fromGhogha = GHOGHA_48_VILLAGES.find((v) => String(v.code) === String(currentVillageCode));
    if (fromGhogha) {
      return {
        code: fromGhogha.code,
        nameEn: fromGhogha.nameEn,
        nameGu: fromGhogha.nameGu,
        category: "Rural",
        sample: fromGhogha,
      };
    }
    const fromDemo = demoVillages.find((v) => String(v.code) === String(currentVillageCode));
    if (fromDemo) {
      return {
        code: fromDemo.code,
        nameEn: fromDemo.name,
        nameGu: fromDemo.gu,
        category: "Rural",
      };
    }
    const fromBoundary = officialBoundaryData?.features.find(
      (f) => String(f.properties.villageCode) === String(currentVillageCode)
    )?.properties;
    if (fromBoundary) {
      return {
        code: String(currentVillageCode),
        nameEn: String(fromBoundary.nameEn || currentVillageCode),
        nameGu: fromBoundary.nameGu ? String(fromBoundary.nameGu) : undefined,
        category: "Rural",
      };
    }
    return {
      code: String(currentVillageCode),
      nameEn: String(currentVillageCode),
      category: "Rural",
    };
  }, [currentVillageCode, officialBoundaryData, villageItems]);

  const areaEnrichedBoundaries = useMemo(() => {
    if (!officialBoundaryData) return null;
    const groups = new Map<number, { area: number; longitudeTotal: number; latitudeTotal: number }>();
    officialBoundaryData.features.forEach((feature) => {
      const code = Number(feature.properties.subdistrictCode);
      if (!Number.isFinite(code)) return;
      const stats = geometryStats(feature.geometry);
      if (!stats.center || !stats.area) return;
      const group = groups.get(code) || { area: 0, longitudeTotal: 0, latitudeTotal: 0 };
      group.area += stats.area;
      group.longitudeTotal += stats.center[0] * stats.area;
      group.latitudeTotal += stats.center[1] * stats.area;
      groups.set(code, group);
    });
    const entries = [...groups.entries()].map(([code, group]) => ({ code, area: group.area }));
    const features = officialBoundaryData.features.map((feature) => {
      const code = Number(feature.properties.subdistrictCode);
      return {
        ...feature,
        properties: {
          ...feature.properties,
          talukaColor: talukaColor(code),
          settlementColor: settlementColor(String(feature.properties.villageCode || "")),
          areaSqKm: groups.get(code)?.area || 0,
          nameHi: localizeText("hi", String(feature.properties.nameEn || "")),
        },
      } as DistrictFeature;
    });
    const districtCode = MASTER_DISTRICTS.find((item) => item.id === currentDistrictId)?.code;
    const labels = entries.flatMap((entry) => {
      const group = groups.get(entry.code);
      const subdistrict = currentSubdistricts.find((item) => item.code === entry.code);
      if (!group || !subdistrict) return [];
      const center: [number, number] = [
        group.longitudeTotal / group.area,
        group.latitudeTotal / group.area,
      ];
      return [{
        type: "Feature" as const,
        geometry: { type: "Point", coordinates: center },
        properties: {
          subdistrictCode: entry.code,
          districtCode,
          nameEn: subdistrict.nameEn,
          nameGu: subdistrict.nameGu,
          nameHi: localizeText("hi", subdistrict.nameEn),
          areaSqKm: entry.area,
          talukaColor: talukaColor(entry.code),
        },
      } as DistrictFeature];
    });
    return {
      villages: { type: "FeatureCollection" as const, features },
      talukas: { type: "FeatureCollection" as const, features: labels },
    };
  }, [currentDistrictId, currentSubdistricts, officialBoundaryData]);

  const handleDistrictClick = useCallback(
    (districtId: string) => {
      const district = demoDistricts.find((item) => item.id === districtId);
      if (!district) return;
      setCurrentDistrictId(district.id);
      setCurrentTalukaCode(null);
      setCurrentVillageCode(null);
      onLocationSelect?.(null);
      const districtEntry = MASTER_DISTRICTS.find((item) => item.id === district.id);
      onAreaSelect?.({
        level: "district",
        districtCode: String(districtEntry?.code ?? ""),
        districtNameEn: district.name,
        districtNameGu: district.gu,
        areaNameEn: district.name,
        areaNameGu: district.gu,
      });
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
    [districtData, onAreaSelect, onDistrictSelect, onLocationSelect],
  );

  const handleTalukaClick = useCallback(
    (code: number) => {
      const subdistrict = getSubdistrictsForDistrict(currentDistrictId).find((item) => item.code === code);
      if (!subdistrict) return;
      setCurrentTalukaCode(code);
      setCurrentVillageCode(null);
      onLocationSelect?.(null);
      const districtEntry = MASTER_DISTRICTS.find((item) => item.id === currentDistrictId);
      onAreaSelect?.({
        level: "taluka",
        districtCode: String(districtEntry?.code ?? ""),
        subdistrictCode: String(code),
        districtNameEn: districtEntry?.nameEn || currentDistrict.name,
        districtNameGu: districtEntry?.nameGu || currentDistrict.gu,
        areaNameEn: subdistrict.nameEn,
        areaNameGu: subdistrict.nameGu,
      });
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
      if (!subdistrictBounds) {
        setFocusNotice(lang === "gu"
          ? "આ તાલુકાની મેળ ખાતી સીમા ઉપલબ્ધ નથી. નકશો ઉપલબ્ધ સંદર્ભ સ્થાન પર જાય છે; રંગીન ક્ષેત્રફળ આ તાલુકા માટે ઉપલબ્ધ નથી."
          : lang === "hi"
            ? "इस तालुका की मेल खाती सीमा उपलब्ध नहीं है। नक्शा संदर्भ स्थान पर जाएगा; इस तालुका का रंगीन क्षेत्रफल उपलब्ध नहीं है।"
            : "A matching boundary is unavailable for this taluka. The map moves to its stored reference point; mapped area shading is unavailable here.");
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
      } else {
        setFocusNotice("");
      }
    },
    [currentDistrict, currentDistrictId, lang, onAreaSelect, officialBoundaryData, onLocationSelect, onTalukaSelect],
  );

  const handleVillageClick = useCallback(
    (code: string) => {
      const stringCode = String(code);
      const matchedVillage =
        villageItems.find((item) => String(item.code) === stringCode) ||
        GHOGHA_48_VILLAGES.find((item) => String(item.code) === stringCode) ||
        demoVillages.find((item) => String(item.code) === stringCode);

      const featureProps = officialBoundaryData?.features.find(
        (f) => String(f.properties.villageCode) === stringCode
      )?.properties;

      const village: VillageItem = matchedVillage
        ? "nameEn" in matchedVillage
          ? (matchedVillage as VillageItem)
          : {
              code: stringCode,
              nameEn: (matchedVillage as { name: string; gu?: string }).name || stringCode,
              nameGu: (matchedVillage as { name: string; gu?: string }).gu,
              category: "Rural",
            }
        : {
            code: stringCode,
            nameEn: String(featureProps?.nameEn || stringCode),
            nameGu: featureProps?.nameGu ? String(featureProps.nameGu) : undefined,
            category: "Rural",
          };

      setCurrentVillageCode(stringCode);
      setLevel("village");
      onAreaSelect?.(null);
      setShowVillageList(false);
      setHoveredEntity(null);
      setFocusNotice(officialBoundaryData
        ? ""
        : lang === "gu" ? "ગામની સીમા લોડ થાય છે…"
          : lang === "hi" ? "गाँव की सीमा लोड हो रही है…" : "Loading village boundary…");
      const demoVillage = demoVillages.find((item) => String(item.code) === stringCode);
      if (demoVillage) onVillageSelect?.(demoVillage);
      const district = MASTER_DISTRICTS.find((item) => item.id === currentDistrictId);
      onLocationSelect?.({
        locationCode: village.code,
        nameEn: village.nameEn,
        nameGu: village.nameGu || "",
        category: village.category || "Rural",
        talukaCode: String(currentTalukaCode ?? ""),
        talukaNameEn: currentTaluka?.nameEn || "",
        talukaNameGu: currentTaluka?.nameGu || "",
        districtCode: String(district?.code ?? ""),
        districtNameEn: currentDistrict.name,
        districtNameGu: currentDistrict.gu,
      });
    },
    [currentDistrict, currentDistrictId, currentTaluka, currentTalukaCode, lang, officialBoundaryData, onAreaSelect, onLocationSelect, onVillageSelect, villageItems],
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
    if (target.kind === "village") {
      const villageCode = String(target.villageCode || target.id);
      if (currentVillageCode !== villageCode) {
        actionsRef.current.selectVillage(villageCode);
      }
      completedFocusRequestRef.current = focusRequest.id;
      return;
    }
  }, [currentDistrictId, currentTalukaCode, currentVillageCode, focusRequest, level, mapReady, villageItems, villageLoadState]);

  // Fetch official SOI village boundaries for active district
  useEffect(() => {
    if (!mapReady || level === "state" || boundaryDistrictId === currentDistrictId) return;
    const controller = new AbortController();
    const boundaryUrl = `/data/boundaries/gujarat-villages-wgs84/${currentDistrictId}.geojson`;

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

  // Selection can happen before the district's GeoJSON finishes loading. Resolve
  // the zoom or the honest no-boundary notice after that asynchronous fetch ends.
  useEffect(() => {
    if (!mapReady || level !== "village" || !currentVillageCode || boundaryDistrictId !== currentDistrictId) return;
    if (!officialBoundaryData) {
      const frame = window.requestAnimationFrame(() => setFocusNotice(lang === "gu"
        ? "આ જિલ્લાની ગામ-સીમા ફાઇલ લોડ થઈ નથી. સ્થાન નામથી પસંદ છે, પણ અંદાજિત નકશા-બિંદુ બતાવાતો નથી."
        : lang === "hi"
          ? "इस जिले की गाँव-सीमा फ़ाइल उपलब्ध नहीं है। स्थान नाम से चुना गया है; अनुमानित नक्शा-बिंदु नहीं दिखाया गया है।"
          : "The village-boundary file for this district is unavailable. The village is selected by name; no estimated map point is shown."));
      return () => window.cancelAnimationFrame(frame);
    }
    const districtCode = MASTER_DISTRICTS.find((item) => item.id === currentDistrictId)?.code;
    const village = villageItems.find((item) => item.code === currentVillageCode);
    const features = officialBoundaryData.features.filter((feature) =>
      feature.properties.districtCode === districtCode && feature.properties.villageCode === currentVillageCode,
    );
    const bounds = collectionBounds(features);
    if (bounds) {
      const frame = window.requestAnimationFrame(() => setFocusNotice(""));
      mapRef.current?.fitBounds(bounds, {
        padding: { top: 55, right: 55, bottom: 55, left: 55 },
        maxZoom: 14.4,
        duration: 1000,
      });
      return () => window.cancelAnimationFrame(frame);
    }
    const name = village?.nameEn || currentVillageCode;
    const frame = window.requestAnimationFrame(() => setFocusNotice(lang === "gu"
      ? `${name} પસંદ થયું છે, પરંતુ આ ગામની ચોક્કસ boundary ઉપલબ્ધ નથી. નકશો તાલુકાના વિસ્તારમાં રહેશે; અહીં અંદાજિત સ્થાન બતાવાતું નથી.`
      : lang === "hi"
        ? `${name} चुना गया है, लेकिन इस गाँव की सटीक सीमा उपलब्ध नहीं है। नक्शा तालुका क्षेत्र पर रहेगा; अनुमानित स्थान नहीं दिखाया गया है।`
        : `${name} is selected, but its precise boundary is unavailable. The map stays on the taluka area; no estimated point is shown.`));
    return () => window.cancelAnimationFrame(frame);
  }, [boundaryDistrictId, currentDistrictId, currentVillageCode, lang, level, mapReady, officialBoundaryData, villageItems]);

  // A taluka can be selected before its district polygon file has arrived. Once
  // it does, refit from the actual WGS84 boundaries so the click lands precisely.
  useEffect(() => {
    if (!mapReady || level !== "taluka" || !currentTalukaCode || boundaryDistrictId !== currentDistrictId || !officialBoundaryData) return;
    const districtCode = MASTER_DISTRICTS.find((item) => item.id === currentDistrictId)?.code;
    const features = officialBoundaryData.features.filter((feature) =>
      feature.properties.districtCode === districtCode && feature.properties.subdistrictCode === currentTalukaCode,
    );
    const bounds = collectionBounds(features);
    if (bounds) {
      mapRef.current?.fitBounds(bounds, {
        padding: { top: 44, right: 44, bottom: 44, left: 44 },
        maxZoom: 12.3,
        duration: 900,
      });
    }
  }, [boundaryDistrictId, currentDistrictId, currentTalukaCode, level, mapReady, officialBoundaryData]);

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
      maxBounds: [
        [66.8, 19.5],
        [75.6, 25.2],
      ],
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
    let usedOffline = false;
    const switchToOfflineBasemap = () => {
      if (styleLoaded || usedOffline) return;
      usedOffline = true;
      setBasemapOffline(true);
      map.setStyle(OFFLINE_STYLE);
    };
    map.on("error", (event) => {
      if (usedOffline) return; // label/glyph requests fail by design on the blank basemap
      if (!styleLoaded) { switchToOfflineBasemap(); return; }
      if (event.error?.message) setMapError(event.error.message);
    });
    const styleLoadTimeout = window.setTimeout(switchToOfflineBasemap, 8000);

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
          "line-color": "#011f65",
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
          "line-color": "#2078cf",
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
          const baseFeatures = (sourceData.features || []).map((feature) => {
            const sourceName = String(feature.properties.district || "");
            const district = matchDistrict(sourceName);
            const stats = geometryStats(feature.geometry);
            return {
              ...feature,
              properties: {
                ...feature.properties,
                districtId: district?.id || normalizeName(sourceName),
                region: district?.region || "",
                nameGu: district?.gu || sourceName,
                nameHi: localizeText("hi", district?.name || sourceName),
                areaSqKm: stats.area,
                unitColor: districtColor(district?.id || sourceName),
              },
            } as DistrictFeature;
          });
          setDistrictData({ type: "FeatureCollection", features: baseFeatures });
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
      talukaLabelInteractionsAdded.current = false;
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
            "fill-color": ["get", "unitColor"],
            "fill-opacity": [
              "case",
              ["==", ["get", "districtId"], currentDistrictId],
              0.82,
              0.65,
            ],
            "fill-color-transition": { duration: 420, delay: 0 },
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
              "#011f65",
              "#ffffff",
            ],
            "line-width": [
              "case",
              ["==", ["get", "districtId"], currentDistrictId],
              3.0,
              1.8,
            ],
            "line-opacity": 0.95,
            "line-color-transition": { duration: 420, delay: 0 },
            "line-width-transition": { duration: 320, delay: 0 },
          },
        },
        beforeLayer,
      );

      map.addLayer({
        id: "district-names",
        type: "symbol",
        source: "geo-districts",
        minzoom: 5.5,
        maxzoom: 9.0,
        layout: {
          "text-field": gu ? ["get", "nameGu"] : lang === "hi" ? ["get", "nameHi"] : ["get", "district"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 5.5, 11, 8.5, 15],
          "text-font": ["Noto Sans Regular"],
          "text-allow-overlap": false,
          "text-ignore-placement": false,
        },
        paint: {
          "text-color": "#020c47",
          "text-halo-color": "#ffffff",
          "text-halo-width": 2.6,
          "text-halo-blur": 0.5,
        },
      });
    } else {
      const source = map.getSource("geo-districts") as maplibregl.GeoJSONSource;
      source.setData(districtData as never);
    }

    if (map.getLayer("district-names")) {
      map.setLayoutProperty("district-names", "text-field", gu ? ["get", "nameGu"] : lang === "hi" ? ["get", "nameHi"] : ["get", "district"]);
    }

    map.setPaintProperty("district-fill", "fill-color", ["get", "unitColor"]);
    map.setPaintProperty("district-fill", "fill-opacity", [
      "case",
      ["==", ["get", "districtId"], currentDistrictId],
      0.82,
      0.65,
    ]);
    map.setPaintProperty("district-lines", "line-color", [
      "case",
      ["==", ["get", "districtId"], currentDistrictId],
      "#011f65",
      "#ffffff",
    ]);
    map.setPaintProperty("district-lines", "line-width", [
      "case",
      ["==", ["get", "districtId"], currentDistrictId],
      3.0,
      1.8,
    ]);
    if (map.getLayer("district-names")) {
      map.setPaintProperty("district-names", "text-halo-width", 2.6);
      map.setPaintProperty("district-names", "text-halo-color", "#ffffff");
      map.setPaintProperty("district-names", "text-color", "#020c47");
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
            areaSqKm: Number(properties.areaSqKm) || undefined,
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
  }, [currentDistrictId, districtData, gu, lang, mapReady]);

  // Village Boundaries layer & Hover Listeners
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !officialBoundaryData) return;

    const source = map.getSource("soi-villages") as maplibregl.GeoJSONSource | undefined;
    if (source) {
      source.setData((areaEnrichedBoundaries?.villages || officialBoundaryData) as never);
    } else {
      map.addSource("soi-villages", { type: "geojson", data: (areaEnrichedBoundaries?.villages || officialBoundaryData) as never });
    }

    if (!officialBoundaryLayersAdded.current) {
      const beforeLayer = map.getLayer("label_other") ? "label_other" : undefined;

      map.addLayer(
        {
          id: "soi-villages-fill",
          type: "fill",
          source: "soi-villages",
          paint: {
            "fill-color": ["get", "settlementColor"],
            "fill-color-transition": { duration: 420, delay: 0 },
            "fill-opacity": 0.58,
            "fill-opacity-transition": { duration: 420, delay: 0 },
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
            "line-color": "#ffffff",
            "line-width": ["interpolate", ["linear"], ["zoom"], 7, 0.8, 12, 1.35, 15, 1.9],
            "line-color-transition": { duration: 420, delay: 0 },
            "line-width-transition": { duration: 320, delay: 0 },
            "line-opacity": 0.94,
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
        minzoom: 10.6,
        maxzoom: 14.8,
        layout: {
          "text-field": gu
            ? ["coalesce", ["get", "nameGu"], ["get", "nameEn"]]
            : lang === "hi" ? ["get", "nameHi"] : ["get", "nameEn"],
          "text-font": ["Noto Sans Regular"],
          "text-size": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10.6,
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
          "text-color": "#020c47",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.2,
        },
      });

      officialBoundaryLayersAdded.current = true;
    }
    if (map.getLayer("soi-villages-names")) {
      map.setLayoutProperty("soi-villages-names", "text-field", gu
        ? ["coalesce", ["get", "nameGu"], ["get", "nameEn"]]
        : lang === "hi" ? ["get", "nameHi"] : ["get", "nameEn"]);
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

      // Hover on a village displays its verified geographic name and local code.
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
          setHoveredEntity({
            nameGu,
            nameEn,
            type: "village",
            code: vCode,
            boundaryMatch: String(properties.boundarySource || "").includes("exact village-code match")
              ? "exact"
              : properties.boundarySource ? "fallback" : undefined,
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
  }, [areaEnrichedBoundaries, currentVillageCode, gu, lang, mapReady, officialBoundaryData]);

  // Taluka labels are placed at area-weighted centers of the available village
  // boundary polygons, with a stable distinct color for each taluka.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !areaEnrichedBoundaries) return;
    const source = map.getSource("taluka-labels") as maplibregl.GeoJSONSource | undefined;
    if (source) {
      source.setData(areaEnrichedBoundaries.talukas as never);
    } else {
      map.addSource("taluka-labels", { type: "geojson", data: areaEnrichedBoundaries.talukas as never });
    }

    const beforeLayer = map.getLayer("label_other") ? "label_other" : undefined;
    if (!map.getLayer("taluka-label-points")) {
      map.addLayer({
        id: "taluka-label-points",
        type: "circle",
        source: "taluka-labels",
        minzoom: 8.2,
        maxzoom: 11,
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 8.2, 4, 10.5, 5.5],
          "circle-color": ["get", "talukaColor"],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 1.5,
        },
      }, beforeLayer);
    }
    if (!map.getLayer("taluka-names")) {
      map.addLayer({
        id: "taluka-names",
        type: "symbol",
        source: "taluka-labels",
        minzoom: 8.2,
        maxzoom: 11,
        layout: {
          "text-field": gu ? ["get", "nameGu"] : lang === "hi" ? ["get", "nameHi"] : ["get", "nameEn"],
          "text-font": ["Noto Sans Regular"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 8.2, 10, 10.5, 12],
          "text-offset": [0, 0.95],
          "text-allow-overlap": false,
          "text-ignore-placement": false,
        },
        paint: {
          "text-color": "#011f65",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.7,
        },
      }, beforeLayer);
    }
    map.setLayoutProperty("taluka-names", "text-field", gu ? ["get", "nameGu"] : lang === "hi" ? ["get", "nameHi"] : ["get", "nameEn"]);

    if (!talukaLabelInteractionsAdded.current) {
      map.on("click", "taluka-names", (event) => {
        if (viewRef.current.level !== "district") return;
        const code = Number(event.features?.[0]?.properties?.subdistrictCode);
        if (Number.isFinite(code)) actionsRef.current.selectTaluka(code);
      });
      map.on("mousemove", "taluka-names", (event) => {
        map.getCanvas().style.cursor = "pointer";
        const props = event.features?.[0]?.properties;
        if (!props) return;
        setHoveredEntity({
          nameGu: String(props.nameGu || props.nameEn || ""),
          nameEn: String(props.nameEn || ""),
          type: "taluka",
          code: props.subdistrictCode as number | undefined,
          areaSqKm: Number(props.areaSqKm) || undefined,
          x: event.point.x,
          y: event.point.y,
        });
      });
      map.on("mouseleave", "taluka-names", () => {
        map.getCanvas().style.cursor = "";
        setHoveredEntity(null);
      });
      talukaLabelInteractionsAdded.current = true;
    }
  }, [areaEnrichedBoundaries, gu, lang, mapReady]);

  // Dynamic filters and selected-village highlighting
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    if (map.getLayer("district-names")) {
      map.setLayoutProperty("district-names", "visibility", level === "state" ? "visible" : "none");
    }
    if (!map.getLayer("soi-villages-fill")) return;

    const districtCode = MASTER_DISTRICTS.find((item) => item.id === currentDistrictId)?.code;
    const filter: unknown[] = ["all", ["==", ["get", "districtCode"], districtCode || -1]];
    if (level === "taluka" || level === "village") {
      filter.push(["==", ["get", "subdistrictCode"], currentTalukaCode || -1]);
    }

    const visible = level === "district" || level === "taluka" || level === "village";
    const districtView = level === "district";
    const selectedSettlement = [
      "==",
      ["to-string", ["get", "villageCode"]],
      currentVillageCode || "",
    ];

    ["soi-villages-fill", "soi-villages-lines", "soi-villages-hit", "soi-villages-names"].forEach(
      (layerId) => {
        if (!map.getLayer(layerId)) return;
        map.setFilter(layerId, filter as never);
        map.setLayoutProperty(layerId, "visibility", visible ? "visible" : "none");
      }
    );

    if (map.getLayer("soi-villages-names")) {
      map.setLayoutProperty(
        "soi-villages-names",
        "visibility",
        level === "taluka" || level === "village" ? "visible" : "none"
      );
    }

    const talukaCode = MASTER_DISTRICTS.find((item) => item.id === currentDistrictId)?.code;
    ["taluka-label-points", "taluka-names"].forEach((layerId) => {
      if (!map.getLayer(layerId)) return;
      map.setFilter(layerId, ["==", ["get", "districtCode"], talukaCode || -1]);
      map.setLayoutProperty(layerId, "visibility", level === "district" ? "visible" : "none");
    });

    // Keep the selected taluka readable, then give the selected village its own
    // stronger highlight as the user drills down.
    map.setPaintProperty(
      "soi-villages-fill",
      "fill-color",
      (districtView
        ? ["get", "talukaColor"]
        : ["case", selectedSettlement, "#df9826", ["get", "settlementColor"]]) as never
    );

    map.setPaintProperty(
      "soi-villages-fill",
      "fill-opacity",
      (districtView
        ? 0.62
        : ["case", selectedSettlement, 0.9, 0.58]) as never
    );

    if (map.getLayer("soi-villages-lines")) {
      map.setPaintProperty(
        "soi-villages-lines",
        "line-color",
        (districtView
          ? "#ffffff"
          : ["case", selectedSettlement, "#123650", "#ffffff"]) as never
      );

      map.setPaintProperty(
        "soi-villages-lines",
        "line-width",
        ["interpolate", ["linear"], ["zoom"], 7, 0.8, 12, 1.25, 15, 1.8] as never,
      );
    }
  }, [
    currentDistrictId,
    currentSubdistricts,
    currentTalukaCode,
    currentVillageCode,
    level,
    mapReady,
    officialBoundaryData,
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
          (record: { code: string | number; nameEn: string; category?: string; status?: string }) => {
            const code = String(record.code);
            const sample = GHOGHA_48_VILLAGES.find((village) => village.code === code);
            return {
              code,
              nameEn: record.nameEn,
              nameGu: sample?.nameGu,
              category: record.category,
              status: record.status,
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
    onLocationSelect?.(null);
    onAreaSelect?.(null);
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
    // The dashboard is tied to a selected settlement. Clear it whenever the
    // map leaves that settlement so the chart context cannot drift from the map.
    onLocationSelect?.(null);
    if (level === "village") {
      setLevel("taluka");
      setCurrentVillageCode(null);
      setFocusNotice("");
      if (currentTaluka) {
        const district = MASTER_DISTRICTS.find((item) => item.id === currentDistrictId);
        onAreaSelect?.({ level: "taluka", districtCode: String(district?.code ?? ""), subdistrictCode: String(currentTaluka.code), districtNameEn: currentDistrict.name, districtNameGu: currentDistrict.gu, areaNameEn: currentTaluka.nameEn, areaNameGu: currentTaluka.nameGu });
      }
    } else if (level === "taluka") {
      handleDistrictClick(currentDistrictId);
    } else if (level === "district") {
      resetMap();
    }
  };

  const filteredDistricts = useMemo(() => {
    const query = normalizeName(listSearch);
    return demoDistricts.filter((district) => {
      const regionMatch = regionFilter === "all" || district.region === regionFilter;
      const searchMatch =
        !query ||
        normalizeName(district.name).includes(query) ||
        normalizeName(district.gu).includes(query) ||
        normalizeName(localizeText("hi", district.name)).includes(query);
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
        normalizeName(localizeText("hi", subdistrict.nameEn)).includes(query) ||
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

  const isCityTaluka = /city|urban/i.test(currentTaluka?.nameEn || "");
  const selectedVillageName = currentVillage
    ? gu ? currentVillage.nameGu || currentVillage.nameEn
      : lang === "hi" ? localizeText("hi", currentVillage.nameEn) : currentVillage.nameEn
    : "";
  const panelTitle =
    level === "state"
      ? localizeText(lang, gu
        ? "ગુજરાત રાજ્ય"
        : "Gujarat State")
      : level === "district"
      ? localizeText(lang, gu
        ? `${currentDistrict.gu} જિલ્લો`
        : `${currentDistrict.name} District`)
      : level === "taluka"
      ? currentTaluka
        ? localizeText(lang, gu
          ? isCityTaluka ? currentTaluka.nameGu : `${currentTaluka.nameGu} તાલુકો`
          : lang === "hi"
            ? `${localizeText("hi", currentTaluka.nameEn.replace(/\s+City(?:\s*\(.*\))?$/i, ""))}${isCityTaluka ? " शहर" : " तालुका"}`
            : isCityTaluka ? currentTaluka.nameEn : `${currentTaluka.nameEn} Taluka`)
        : localizeText(lang, gu
        ? "તાલુકો પસંદ કરો"
        : "Select a taluka")
      : currentVillage
      ? currentVillage.category?.toLowerCase() === "urban"
        ? lang === "gu" ? `${selectedVillageName} શહેર` : lang === "hi" ? `${selectedVillageName} शहर` : `${selectedVillageName} City`
        : lang === "gu" ? `${selectedVillageName} ગામ` : lang === "hi" ? `${selectedVillageName} गाँव` : `${selectedVillageName} Village`
      : localizeText(lang, gu
      ? "ગામ પસંદ કરો"
      : "Select a village");

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
          <nav className="geo-breadcrumbs" aria-label={localizeText(lang, gu ? "ભૌગોલિક માર્ગ" : "Geographic breadcrumb")}>
            <button className={level === "state" ? "is-active" : ""} onClick={resetMap}>
              <MapPinned size={15} />
              <span>{localizeText(lang, gu ? `ગુજરાત (${formatNumber(demoDistricts.length, gu, lang)} જિલ્લા)` : `Gujarat (${demoDistricts.length} districts)`)}</span>
            </button>
            {level !== "state" && (
              <>
                <ChevronRight size={14} />
                <button
                  className={level === "district" ? "is-active" : ""}
                  onClick={() => {
                    handleDistrictClick(currentDistrictId);
                    setShowVillageList(false);
                  }}
                >
                  <Building2 size={14} />
                  <span>
                    {localizeText(lang, gu ? currentDistrict.gu : currentDistrict.name)}
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
                    handleTalukaClick(currentTaluka.code);
                    setShowVillageList(true);
                  }}
                >
                  <Landmark size={14} />
                  <span>{localizeText(lang, gu ? currentTaluka.nameGu : currentTaluka.nameEn)}</span>
                </button>
              </>
            )}
            {level === "village" && (currentVillage || currentVillageCode) && (
              <>
                <ChevronRight size={14} />
                <span className="geo-current-crumb" data-testid="village-breadcrumb">
                  <Home size={14} style={{ display: "inline-block", marginRight: "4px" }} />
                  {gu
                    ? currentVillage?.nameGu || currentVillage?.nameEn || currentVillageCode
                    : lang === "hi"
                    ? localizeText("hi", currentVillage?.nameEn || currentVillageCode || "")
                    : currentVillage?.nameEn || currentVillageCode}
                </span>
              </>
            )}
          </nav>
          <div className="geo-toolbar-actions">
            {level !== "state" && (
              <button className="geo-back-button" onClick={handleBack}>
                <ArrowLeft size={15} />
                <span>{localizeText(lang, gu ? "ઉપરના સ્તરે જાઓ" : "Back")}</span>
              </button>
            )}
            <span className="geo-demo-pill">
              <Award size={13} />
              {gu ? "કૃત્રિમ નમૂનો · સત્તાવાર નથી" : lang === "hi" ? "कृत्रिम नमूना · आधिकारिक नहीं" : "Synthetic sample · not official"}
            </span>
          </div>
        </div>
      )}

      <div className="geo-explorer-layout">
        <section
          className="geo-map-card"
          style={mapHeight ? { height: mapHeight } : undefined}
          aria-label={localizeText(lang, gu ? "ઇન્ટરેક્ટિવ ગુજરાત નકશો" : "Interactive Gujarat map")}
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
                    ? (localizeText(lang, gu ? "જિલ્લો" : "District"))
                    : hoveredEntity.type === "taluka"
                    ? (localizeText(lang, gu ? "તાલુકો" : "Taluka"))
                    : (localizeText(lang, gu ? "ગામ" : "Village"))}
                  {hoveredEntity.code ? ` [${hoveredEntity.code}]` : ""}
                </span>
              </div>
              <div className="gmhc-title-row">
                <strong>{localizeText(lang, gu ? hoveredEntity.nameGu : hoveredEntity.nameEn)}</strong>
                {gu && hoveredEntity.nameEn !== hoveredEntity.nameGu && (
                  <small>{hoveredEntity.nameEn}</small>
                )}
              </div>
              {hoveredEntity.areaSqKm ? (
                <div className="gmhc-meta-row">
                  <span>{new Intl.NumberFormat(lang === "gu" ? "gu-IN" : lang === "hi" ? "hi-IN" : "en-IN", { maximumFractionDigits: 0 }).format(hoveredEntity.areaSqKm)} km² · {localizeText(lang, gu ? "નકશા સીમા પરથી અંદાજિત વિસ્તાર" : "Approx. mapped boundary area")}</span>
                </div>
              ) : null}
              {hoveredEntity.type === "village" && (
                <div className="gmhc-meta-row">
                  <span className="gmhc-scheme-tag">{hoveredEntity.boundaryMatch === "exact"
                    ? (gu ? "SOI/NWIC સીમા · ચોક્કસ સ્થળ કોડ મેળ" : lang === "hi" ? "SOI/NWIC सीमा · सटीक स्थान कोड मेल" : "SOI/NWIC boundary · exact location-code match")
                    : hoveredEntity.boundaryMatch === "fallback"
                      ? (gu ? "જૂની સંદર્ભ સીમા · ચોક્કસ મેળ નથી" : lang === "hi" ? "पुरानी संदर्भ सीमा · सटीक मेल नहीं" : "Prior reference boundary · no exact code match")
                      : localizeText(lang, gu ? "યોજના-આંકડા સત્તાવાર રીતે જોડાયેલા નથી" : "Official scheme coverage is not connected")}</span>
                </div>
              )}
            </div>
          )}

          {!mapReady && !mapError && (
            <div className="geo-map-loading" role="status">
              <span className="geo-loading-spinner" />
              {localizeText(lang, gu ? "ગુજરાત નકશો લોડ થાય છે..." : "Loading Gujarat map…")}
            </div>
          )}

          {basemapOffline && !mapError && (
            <div className="geo-map-error" role="status" style={{ top: "auto", bottom: 56 }}>
              <Info size={16} />
              <span>
                {localizeText(lang, gu ? "બેઝ-મેપ ઉપલબ્ધ નથી; ફક્ત વહીવટી સીમાઓ બતાવી છે." : "Base map unavailable; showing administrative boundaries only.")}
              </span>
            </div>
          )}

          {mapError && (
            <div className="geo-map-error" role="alert">
              <Info size={16} />
              <span>
                {localizeText(lang, gu ? "નકશાનો ડેટા લોડ થયો નથી." : "The map data could not be loaded.")}
                
              </span>
              <button onClick={() => window.location.reload()}>
                {localizeText(lang, gu ? "ફરી પ્રયાસ કરો" : "Retry")}
              </button>
            </div>
          )}

          <div className="geo-map-controls" aria-label={localizeText(lang, gu ? "નકશા નિયંત્રણો" : "Map controls")}>
            <button
              onClick={() => mapRef.current?.zoomIn({ duration: 300 })}
              aria-label={localizeText(lang, gu ? "ઝૂમ ઇન" : "Zoom in")}
              title={localizeText(lang, gu ? "ઝૂમ ઇન" : "Zoom in")}
            >
              <Plus size={18} />
            </button>
            <button
              onClick={() => mapRef.current?.zoomOut({ duration: 300 })}
              aria-label={localizeText(lang, gu ? "ઝૂમ આઉટ" : "Zoom out")}
              title={localizeText(lang, gu ? "ઝૂમ આઉટ" : "Zoom out")}
            >
              <Minus size={18} />
            </button>
            <button
              onClick={resetMap}
              aria-label={localizeText(lang, gu ? "સમગ્ર ગુજરાત નકશો" : "Reset to Gujarat")}
              title={localizeText(lang, gu ? "સમગ્ર ગુજરાત નકશો" : "Reset to Gujarat")}
            >
              <RotateCcw size={16} />
            </button>
          </div>

          {variant !== "embedded" && (
            <div className="geo-map-coverage-legend" aria-live="polite">
              <div className="geo-color-legend-copy">
                <strong>{gu ? "વહીવટી વિસ્તારો માટે અલગ રંગ" : lang === "hi" ? "अलग प्रशासनिक क्षेत्रों के लिए अलग रंग" : "Distinct colors identify administrative areas"}</strong>
                <div className="geo-color-legend-swatches" aria-hidden="true">
                  {MAP_COLOR_SWATCHES.map((color) => <span key={color} style={{ background: color }} />)}
                  <span className="is-selected" />
                </div>
                <small>{gu ? "પસંદ કરેલું સ્થળ" : lang === "hi" ? "चुना हुआ स्थान" : "Selected place"}</small>
              </div>
              <span className="geo-color-legend-note">
                {gu
                    ? "વિવિધ રંગો જિલ્લા/તાલુકા/ગામની સીમા ઓળખાવે છે. પસંદ કરેલું ગામ સોનેરી દેખાય છે; આ રંગો ક્ષેત્રફળ કે યોજનાની કામગીરી નથી."
                  : lang === "hi"
                    ? "अलग रंग जिला/तालुका/गाँव की सीमाएँ पहचानते हैं। चुना हुआ गाँव सुनहरे रंग में दिखता है; रंग क्षेत्रफल या योजना गतिविधि नहीं दर्शाते।"
                    : "Distinct colors identify district, taluka, and village boundaries. The selected village is gold; colors do not encode area or scheme activity."}
              </span>
            </div>
          )}

          <div className="geo-zoom-status">
            <span className="geo-zoom-dot" />
            <span>
              {level === "state"
                ? localizeText(lang, gu ? "૩૪ જિલ્લાઓની સરહદ" : "District Boundaries")
                : level === "district"
                ? localizeText(lang, gu ? `${currentDistrict.gu}ના તાલુકાઓ` : lang === "hi" ? `${localizeText("hi", currentDistrict.name)} के तालुके` : `${currentDistrict.name} talukas`)
                : localizeText(lang, gu ? "ગામની સંદર્ભ સીમા" : lang === "hi" ? "गाँव की संदर्भ सीमा" : "Village reference boundaries")}
            </span>
            <b>{mapZoom.toFixed(1)}×</b>
          </div>

          <div className="geo-map-hint">
            <span className="geo-map-hint-full">
              {localizeText(lang, gu
                ? "નકશા પર કર્સર રાખવાથી નામ દેખાશે · ક્લિક કરવાથી વિસ્તારમાં અંદર જઈ શકાશે"
                : "Hover over map to see names · Click to zoom in")}
            </span>
          </div>
          {focusNotice && (
            <div className="geo-focus-notice" role="status" aria-live="polite">
              <Info size={15} aria-hidden="true" />
              <span>{focusNotice}</span>
            </div>
          )}
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
            aria-label={localizeText(lang, gu ? "વિસ્તારની વિગતો" : "Geographic details")}
          >
            <div className="geo-panel-top">
              <div>
                <span className="geo-panel-kicker">
                  {level === "village"
                    ? localizeText(lang, gu ? "પસંદ કરેલું ગામ/શહેર · નીચે ડેમો વિશ્લેષણ" : "SELECTED SETTLEMENT · DEMO ANALYTICS BELOW")
                    : level === "taluka"
                    ? localizeText(lang, gu ? "તાલુકો અને ગામ/શહેરોની યાદી" : lang === "hi" ? "तालुका और गाँव/शहरों की सूची" : "TALUKA & SETTLEMENTS")
                    : level === "district"
                    ? localizeText(lang, gu ? "જિલ્લો અને તાલુકાઓ" : lang === "hi" ? "जिला और तालुके" : "DISTRICT & TALUKAS")
                    : localizeText(lang, gu ? "સમગ્ર ગુજરાત" : "GUJARAT OVERVIEW")}
                </span>
                <h2>{panelTitle}</h2>
                <p>
                  {level === "state"
                    ? localizeText(lang, gu
                      ? "કોઈપણ જિલ્લા પર ક્લિક કરો અથવા નીચેથી જિલ્લો પસંદ કરો."
                      : "Click any district on map or pick from list below.")
                    : level === "district"
                    ? lang === "gu"
                      ? `${currentSubdistricts.length} તાલુકાઓ · ગામો જોવા માટે પસંદ કરો.`
                      : lang === "hi"
                        ? `${currentSubdistricts.length} तालुके · गाँव देखने के लिए चुनें।`
                        : `${currentSubdistricts.length} talukas · choose one to explore villages.`
                    : level === "taluka"
                    ? gu
                      ? villageLoadState === "ready"
                        ? `${villageItems.filter((village) => village.category?.toLowerCase() === "rural").length} ગામો · ${villageItems.filter((village) => village.category?.toLowerCase() === "urban").length} શહેર/નગર · ${villageItems.filter((village) => village.category?.toLowerCase() === "both").length} મિશ્ર વર્ગ · ${villageItems.filter((village) => village.status?.toLowerCase() !== "inhabitant").length} વસવાટ વિનાના · સંદર્ભ સૂચિ; યોજના-આંકડા જોડાયેલા નથી.`
                        : "ગામોની યાદી લોડ થાય છે..."
                      : lang === "hi"
                        ? villageLoadState === "ready"
                          ? `${villageItems.filter((village) => village.category?.toLowerCase() === "rural").length} गाँव · ${villageItems.filter((village) => village.category?.toLowerCase() === "urban").length} शहर/कस्बे · ${villageItems.filter((village) => village.category?.toLowerCase() === "both").length} मिश्रित वर्ग · ${villageItems.filter((village) => village.status?.toLowerCase() !== "inhabitant").length} गैर-आबाद · संदर्भ सूची; योजना के आँकड़े उपलब्ध नहीं हैं।`
                          : "गाँवों की सूची लोड हो रही है…"
                        : villageLoadState === "ready"
                          ? `${villageItems.filter((village) => village.category?.toLowerCase() === "rural").length} villages · ${villageItems.filter((village) => village.category?.toLowerCase() === "urban").length} cities/towns · ${villageItems.filter((village) => village.category?.toLowerCase() === "both").length} mixed-classification · ${villageItems.filter((village) => village.status?.toLowerCase() !== "inhabitant").length} uninhabited · reference list only; scheme figures are not connected.`
                          : "Loading villages list…"
                    : gu
                        ? "આ ગામ/શહેરની વહીવટી વિગતો અને કૃત્રિમ નમૂનાનું વિશ્લેષણ નીચે જુઓ."
                      : lang === "hi"
                        ? "इस गाँव/शहर का प्रशासनिक विवरण और कृत्रिम नमूने का विश्लेषण नीचे देखें।"
                        : "View this village or city’s administrative details and synthetic sample analytics below."}
                </p>
              </div>
              <span className="geo-count-pill">{formatNumber(currentEntities, gu, lang)}</span>
              {level === "village" && (
                <button
                  className="geo-village-switch"
                  onClick={() => setShowVillageList((visible) => !visible)}
                >
                  {showVillageList
                    ? localizeText(lang, gu ? "યોજના વિગત જુઓ" : "Show details")
                    : localizeText(lang, gu ? "ગામ બદલો" : "Change village")}
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
                    ? localizeText(lang, gu ? "જિલ્લો શોધો..." : "Search districts…")
                    : level === "district"
                    ? localizeText(lang, gu ? "તાલુકો શોધો..." : "Search talukas…")
                    : localizeText(lang, gu ? "ગામનું નામ શોધો..." : "Search villages…")
                }
                aria-label={localizeText(lang, gu ? "વિસ્તાર શોધો" : "Search geographic units")}
              />
            </label>

            {/* Entity List (Districts, Talukas, or Villages) */}
            <div
              className={
                "geo-entity-list" +
                (level === "village" || level === "taluka" ? " geo-entity-list--villages" : "") +
                (level === "village" && !showVillageList ? " is-hidden" : "")
              }
            >
              {level === "state" &&
                filteredDistricts.map((district) => {
                  const subdistrictCount = getSubdistrictsForDistrict(district.id).length;
                  return (
                    <button
                      key={district.id}
                      className={
                        "geo-entity-row" + (district.id === currentDistrictId ? " is-selected" : "")
                      }
                      onClick={() => goToDistrict(district)}
                    >
                      <span className="geo-entity-icon">
                        <Building2 size={16} />
                      </span>
                      <span className="geo-entity-name">
                        <b>{localizeText(lang, gu ? district.gu : district.name)}</b>
                        <small>{localizeText(lang, gu ? district.regionGu : district.region)} · {district.officialNo}</small>
                      </span>
                      <span className="geo-entity-meta">
                        {subdistrictCount} {localizeText(lang, gu ? "તાલુકા" : "talukas")}
                      </span>
                      <ChevronRight size={15} />
                    </button>
                  );
                })}

              {level === "district" &&
                filteredTalukas.map((subdistrict) => (
                  <button
                    key={subdistrict.code}
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
                      <b>{localizeText(lang, gu ? subdistrict.nameGu : lang === "hi" ? localizeText("hi", subdistrict.nameEn) : subdistrict.nameEn)}</b>
                      <small>LGD {subdistrict.code}</small>
                    </span>
                    <span className="geo-entity-meta">
                      {formatNumber(subdistrict.villageCount, gu, lang)} {localizeText(lang, gu ? "ગામ" : "villages")}
                    </span>
                    <ChevronRight size={15} />
                  </button>
                ))}

              {(level === "taluka" || level === "village") &&
                filteredVillages.map((village) => {
                  return (
                    <button
                      key={village.code}
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
                        <b>{gu ? village.nameGu || village.nameEn : lang === "hi" ? localizeText("hi", village.nameEn) : village.nameEn}</b>
                        <small>LGD {village.code}</small>
                      </span>
                      <span className="geo-entity-meta">
                        {village.status?.toLowerCase() !== "inhabitant"
                          ? gu ? "વસવાટ વિનાનો / વિશેષ વિસ્તાર" : lang === "hi" ? "गैर-आबाद / विशेष क्षेत्र" : "Uninhabited / special area"
                          : village.category?.toLowerCase() === "urban"
                            ? gu ? "શહેરી વસાહત" : lang === "hi" ? "शहरी बस्ती" : "Urban settlement"
                            : village.category?.toLowerCase() === "both"
                              ? gu ? "મિશ્ર વહીવટી વર્ગીકરણ" : lang === "hi" ? "मिश्रित प्रशासनिक वर्गीकरण" : "Mixed administrative classification"
                              : gu ? "ગ્રામીણ વસાહત" : lang === "hi" ? "ग्रामीण बस्ती" : "Rural settlement"}
                      </span>
                      <ChevronRight size={15} />
                    </button>
                  );
                })}

              {level === "taluka" && villageLoadState === "loading" && (
                <div className="geo-list-message" role="status">
                  {localizeText(lang, gu ? "ગામોની યાદી લોડ થાય છે..." : "Loading villages…")}
                </div>
              )}
              {level === "taluka" && villageLoadState === "ready" && filteredVillages.length === 0 && (
                <div className="geo-list-message" role="status">
                  {villageItems.length === 0
                    ? gu
                      ? "આ શહેરી/વહીવટી વિસ્તાર માટે અલગ ગામ-સ્થળોની સૂચિ અથવા મેળ ખાતો ડેમો location code ઉપલબ્ધ નથી. તેથી આંકડા બતાવતા નથી."
                      : lang === "hi"
                        ? "इस शहरी/प्रशासनिक क्षेत्र के लिए अलग गाँव/स्थान सूची या मेल खाता डेमो स्थान कोड उपलब्ध नहीं है। इसलिए आँकड़े नहीं दिखाए जाते।"
                        : "No child settlements or matching demo location code are available for this urban/administrative area. No figures are inferred."
                    : gu
                      ? "આ શોધને મેળ ખાતું ગામ કે શહેર મળ્યું નથી."
                      : lang === "hi" ? "इस खोज से कोई गाँव या शहर नहीं मिला।" : "No village or city matches this search."}
                </div>
              )}
            </div>

            {/* Area profile and scheme-coverage data status */}
            <section className="geo-profile-card" aria-live="polite">
              <div className="geo-profile-heading">
                <div>
                  <span className="geo-panel-kicker">
                    {localizeText(lang, gu ? "વહીવટી વિસ્તારની વિગતો" : "ADMINISTRATIVE AREA")}
                  </span>
                  <h3>{panelTitle}</h3>
                </div>
                <span className="geo-source-pill" style={{ color: "#0e4eb2", borderColor: "rgba(32,120,207,0.3)" }}>
                  <MapPinned size={12} /> {gu ? "વહીવટી ડિરેક્ટરી" : lang === "hi" ? "प्रशासनिक निर्देशिका" : "Administrative directory"}
                </span>
              </div>

              <div className="geo-summary-grid">
                <div>
                  <Building2 size={16} />
                  <b>{level === "state" ? MASTER_DISTRICTS.length : "1"}</b>
                  <small>{localizeText(lang, gu ? "જિલ્લા" : "Districts")}</small>
                </div>
                <div>
                  <Landmark size={16} />
                  <b>{level === "state" ? MASTER_SUBDISTRICTS.length : level === "district" ? currentSubdistricts.length : currentTaluka ? "1" : "—"}</b>
                  <small>{localizeText(lang, gu ? "તાલુકા" : "Talukas")}</small>
                </div>
              </div>

              {currentVillage && (
                <div className="geo-village-summary">
                  <span><Home size={15} /> {localizeText(lang, gu ? (currentTaluka?.nameGu || "") : (currentTaluka?.nameEn || ""))}</span>
                  <span><Landmark size={15} /> {localizeText(lang, gu ? currentDistrict.gu : currentDistrict.name)}</span>
                </div>
              )}

              <div className="geo-coverage-pending" role="status" style={{ borderLeftColor: "#2078cf" }}>
                <Info size={18} className="text-[#2078cf]" aria-hidden="true" />
                <div>
                  <strong>{gu ? "યોજનાના નમૂના ડેટાની સ્થિતિ" : lang === "hi" ? "योजना नमूना डेटा की स्थिति" : "Scheme sample data status"}</strong>
                  <p>
                    {gu
                      ? "આ વિસ્તાર માટે મળતા દાખલા કૃત્રિમ નમૂના છે. દાખલો મળવો એટલે યોજના અહીં કાર્યરત છે અથવા વાસ્તવિક લાભ મળ્યો છે એવો પુરાવો નથી. ગામ પસંદ કરો તો એ location code સાથે મેળ ખાતી યોજના-હરોળો નીચે જુઓ."
                      : lang === "hi"
                        ? "इस क्षेत्र के उपलब्ध अभिलेख कृत्रिम नमूने हैं। अभिलेख मिलने का अर्थ यह नहीं कि योजना यहाँ चलती है या किसी को वास्तविक लाभ मिला है। गाँव चुनें तो उसी स्थान कोड से जुड़ी योजना पंक्तियाँ नीचे देखें।"
                        : "Rows available for this area are synthetic examples. A row does not prove that a scheme operates here or that anyone received a real benefit. Select a village to view sample rows matched to its location code below."}
                  </p>
                </div>
              </div>
            </section>
          </aside>
        )}
      </div>

      
    </div>
  );
}
