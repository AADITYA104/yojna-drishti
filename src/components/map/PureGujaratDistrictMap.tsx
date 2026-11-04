"use client";

import React, { useState, useMemo } from "react";
import { GUJARAT_DISTRICT_POLYGONS } from "@/lib/gujarat-svg-paths";
import { demoDistricts, type District } from "@/lib/demo-data";
import {
  MapPin,
  Layers,
  Sparkles,
  ChevronDown,
  Info,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  Building2,
  Compass,
  ArrowDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PureGujaratDistrictMapProps {
  gu: boolean;
  fy?: string;
  selectedDistrictId?: string;
  onSelectDistrict?: (districtId: string) => void;
  onExploreVillages?: (districtId: string) => void;
}

const NAME_TO_ID: Record<string, string> = {
  "Valsad": "valsad",
  "Amreli": "amreli",
  "Dang": "dang",
  "Vadodara": "vadodara",
  "Bharuch": "bharuch",
  "Porbandar": "porbandar",
  "Narmada": "narmada",
  "Surat": "surat",
  "Tapi": "tapi",
  "Botad": "botad",
  "Chhota Udaipur": "chhota_udepur",
  "Gir Somnath": "gir_somnath",
  "Rajkot": "rajkot",
  "Bhavnagar": "bhavnagar",
  "Junagadh": "junagadh",
  "Jamnagar": "jamnagar",
  "Devbhumi Dwarka": "devbhumi_dwarka",
  "Navsari": "navsari",
  "Patan": "patan",
  "Mehsana": "mehsana",
  "Gandhinagar": "gandhinagar",
  "Ahmedabad": "ahmedabad",
  "Panchmahal": "panchmahal",
  "Dahod": "dahod",
  "Aravalli": "aravalli",
  "Mahisagar": "mahisagar",
  "Sabarkantha": "sabarkantha",
  "Kutch": "kutch",
  "Surendranagar": "surendranagar",
  "Kheda": "kheda",
  "Anand": "anand",
  "Morbi": "morbi",
  "Banaskantha": "banaskantha",
  "Vav-Tharad": "vav_tharad",
};

// Pastel / Administrative Color Mapping matching the user's reference image
export const DISTRICT_MAP_THEME: Record<string, {
  fillColor: string;
  accentHex: string;
  hqEn: string;
  hqGu: string;
  isCapital?: boolean;
}> = {
  kutch: { fillColor: "rgba(186, 175, 222, 0.40)", accentHex: "#A78BFA", hqEn: "Bhuj", hqGu: "ભુજ" },
  banaskantha: { fillColor: "rgba(251, 191, 136, 0.40)", accentHex: "#FB923C", hqEn: "Palanpur", hqGu: "પાલનપુર" },
  vav_tharad: { fillColor: "rgba(251, 191, 136, 0.40)", accentHex: "#FB923C", hqEn: "Tharad", hqGu: "થરાદ" },
  patan: { fillColor: "rgba(167, 243, 160, 0.40)", accentHex: "#4ADE80", hqEn: "Patan", hqGu: "પાટણ" },
  mehsana: { fillColor: "rgba(249, 168, 212, 0.40)", accentHex: "#F472B6", hqEn: "Mehsana", hqGu: "મહેસાણા" },
  sabarkantha: { fillColor: "rgba(253, 230, 138, 0.40)", accentHex: "#FACC15", hqEn: "Himmatnagar", hqGu: "હિંમતનગર" },
  aravalli: { fillColor: "rgba(196, 181, 253, 0.40)", accentHex: "#C084FC", hqEn: "Modasa", hqGu: "મોડાસા" },
  mahisagar: { fillColor: "rgba(251, 146, 60, 0.40)", accentHex: "#F97316", hqEn: "Lunawada", hqGu: "લુણાવાડા" },
  dahod: { fillColor: "rgba(254, 240, 138, 0.40)", accentHex: "#FACC15", hqEn: "Dahod", hqGu: "દાહોદ" },
  panchmahal: { fillColor: "rgba(134, 239, 172, 0.40)", accentHex: "#4ADE80", hqEn: "Godhra", hqGu: "ગોધરા" },
  gandhinagar: { fillColor: "rgba(251, 113, 133, 0.55)", accentHex: "#F43F5E", hqEn: "Gandhinagar", hqGu: "ગાંધીનગર", isCapital: true },
  ahmedabad: { fillColor: "rgba(254, 240, 138, 0.40)", accentHex: "#FACC15", hqEn: "Ahmedabad", hqGu: "અમદાવાદ" },
  surendranagar: { fillColor: "rgba(199, 210, 254, 0.40)", accentHex: "#818CF8", hqEn: "Surendranagar", hqGu: "સુરેન્દ્રનગર" },
  morbi: { fillColor: "rgba(254, 240, 138, 0.40)", accentHex: "#FACC15", hqEn: "Morbi", hqGu: "મોરબી" },
  jamnagar: { fillColor: "rgba(251, 191, 136, 0.40)", accentHex: "#FB923C", hqEn: "Jamnagar", hqGu: "જામનગર" },
  devbhumi_dwarka: { fillColor: "rgba(254, 240, 138, 0.40)", accentHex: "#FACC15", hqEn: "Khambhalia", hqGu: "ખંભાળિયા" },
  rajkot: { fillColor: "rgba(167, 243, 160, 0.40)", accentHex: "#4ADE80", hqEn: "Rajkot", hqGu: "રાજકોટ" },
  porbandar: { fillColor: "rgba(153, 246, 228, 0.40)", accentHex: "#2DD4BF", hqEn: "Porbandar", hqGu: "પોરબંદર" },
  junagadh: { fillColor: "rgba(196, 181, 253, 0.40)", accentHex: "#A78BFA", hqEn: "Junagadh", hqGu: "જુનાગઢ" },
  gir_somnath: { fillColor: "rgba(251, 191, 136, 0.40)", accentHex: "#FB923C", hqEn: "Veraval", hqGu: "વેરાવળ" },
  amreli: { fillColor: "rgba(254, 240, 138, 0.40)", accentHex: "#FACC15", hqEn: "Amreli", hqGu: "અમરેલી" },
  botad: { fillColor: "rgba(244, 114, 182, 0.40)", accentHex: "#F472B6", hqEn: "Botad", hqGu: "બોટાદ" },
  bhavnagar: { fillColor: "rgba(167, 243, 160, 0.40)", accentHex: "#34D399", hqEn: "Bhavnagar", hqGu: "ભાવનગર" },
  anand: { fillColor: "rgba(199, 210, 254, 0.40)", accentHex: "#60A5FA", hqEn: "Anand", hqGu: "આણંદ" },
  kheda: { fillColor: "rgba(244, 114, 182, 0.40)", accentHex: "#F472B6", hqEn: "Nadiad", hqGu: "નડિયાદ" },
  vadodara: { fillColor: "rgba(251, 191, 136, 0.40)", accentHex: "#FB923C", hqEn: "Vadodara", hqGu: "વડોદરા" },
  chhota_udepur: { fillColor: "rgba(196, 181, 253, 0.40)", accentHex: "#A78BFA", hqEn: "Chhota Udaipur", hqGu: "છોટા ઉદેપુર" },
  bharuch: { fillColor: "rgba(167, 243, 160, 0.40)", accentHex: "#4ADE80", hqEn: "Bharuch", hqGu: "ભરૂચ" },
  narmada: { fillColor: "rgba(244, 114, 182, 0.40)", accentHex: "#F472B6", hqEn: "Rajpipla", hqGu: "રાજપીપળા" },
  surat: { fillColor: "rgba(254, 240, 138, 0.40)", accentHex: "#FACC15", hqEn: "Surat", hqGu: "સુરત" },
  tapi: { fillColor: "rgba(196, 181, 253, 0.40)", accentHex: "#A78BFA", hqEn: "Vyara", hqGu: "વ્યારા" },
  dang: { fillColor: "rgba(251, 191, 136, 0.40)", accentHex: "#FB923C", hqEn: "Ahwa", hqGu: "આહવા" },
  navsari: { fillColor: "rgba(167, 243, 160, 0.40)", accentHex: "#34D399", hqEn: "Navsari", hqGu: "નવસારી" },
  valsad: { fillColor: "rgba(244, 114, 182, 0.40)", accentHex: "#F472B6", hqEn: "Valsad", hqGu: "વલસાડ" },
};

// City Headquarter Pin Coordinates for Gujarat SVG Map
const DISTRICT_HQ_PINS: {
  id: string;
  hqEn: string;
  hqGu: string;
  x: number;
  y: number;
  isCapital?: boolean;
}[] = [
  { id: "kutch", hqEn: "Bhuj", hqGu: "ભુજ", x: 235, y: 220 },
  { id: "banaskantha", hqEn: "Palanpur", hqGu: "પાલનપુર", x: 650, y: 100 },
  { id: "vav_tharad", hqEn: "Tharad", hqGu: "થરાદ", x: 490, y: 95 },
  { id: "patan", hqEn: "Patan", hqGu: "પાટણ", x: 580, y: 155 },
  { id: "mehsana", hqEn: "Mehsana", hqGu: "મહેસાણા", x: 655, y: 195 },
  { id: "sabarkantha", hqEn: "Himmatnagar", hqGu: "હિંમતનગર", x: 740, y: 180 },
  { id: "aravalli", hqEn: "Modasa", hqGu: "મોડાસા", x: 795, y: 215 },
  { id: "mahisagar", hqEn: "Lunawada", hqGu: "લુણાવાડા", x: 840, y: 250 },
  { id: "dahod", hqEn: "Dahod", hqGu: "દાહોદ", x: 915, y: 315 },
  { id: "panchmahal", hqEn: "Godhra", hqGu: "ગોધરા", x: 825, y: 310 },
  { id: "gandhinagar", hqEn: "Gandhinagar", hqGu: "ગાંધીનગર", x: 690, y: 235, isCapital: true },
  { id: "ahmedabad", hqEn: "Ahmedabad", hqGu: "અમદાવાદ", x: 645, y: 280 },
  { id: "surendranagar", hqEn: "Surendranagar", hqGu: "સુરેન્દ્રનગર", x: 535, y: 310 },
  { id: "morbi", hqEn: "Morbi", hqGu: "મોરબી", x: 425, y: 300 },
  { id: "jamnagar", hqEn: "Jamnagar", hqGu: "જામનગર", x: 315, y: 370 },
  { id: "devbhumi_dwarka", hqEn: "Khambhalia", hqGu: "ખંભાળિયા", x: 225, y: 395 },
  { id: "rajkot", hqEn: "Rajkot", hqGu: "રાજકોટ", x: 425, y: 395 },
  { id: "porbandar", hqEn: "Porbandar", hqGu: "પોરબંદર", x: 245, y: 485 },
  { id: "junagadh", hqEn: "Junagadh", hqGu: "જુનાગઢ", x: 350, y: 515 },
  { id: "gir_somnath", hqEn: "Veraval", hqGu: "વેરાવળ", x: 360, y: 580 },
  { id: "amreli", hqEn: "Amreli", hqGu: "અમરેલી", x: 475, y: 505 },
  { id: "botad", hqEn: "Botad", hqGu: "બોટાદ", x: 540, y: 400 },
  { id: "bhavnagar", hqEn: "Bhavnagar", hqGu: "ભાવનગર", x: 585, y: 460 },
  { id: "anand", hqEn: "Anand", hqGu: "આણંદ", x: 710, y: 360 },
  { id: "kheda", hqEn: "Nadiad", hqGu: "નડિયાદ", x: 715, y: 330 },
  { id: "vadodara", hqEn: "Vadodara", hqGu: "વડોદરા", x: 770, y: 400 },
  { id: "chhota_udepur", hqEn: "Chhota Udaipur", hqGu: "છોટા ઉદેપુર", x: 875, y: 415 },
  { id: "bharuch", hqEn: "Bharuch", hqGu: "ભરૂચ", x: 755, y: 480 },
  { id: "narmada", hqEn: "Rajpipla", hqGu: "રાજપીપળા", x: 830, y: 465 },
  { id: "surat", hqEn: "Surat", hqGu: "સુરત", x: 735, y: 535 },
  { id: "tapi", hqEn: "Vyara", hqGu: "વ્યારા", x: 805, y: 565 },
  { id: "dang", hqEn: "Ahwa", hqGu: "આહવા", x: 840, y: 610 },
  { id: "navsari", hqEn: "Navsari", hqGu: "નવસારી", x: 745, y: 580 },
  { id: "valsad", hqEn: "Valsad", hqGu: "વલસાડ", x: 755, y: 650 },
];

export function PureGujaratDistrictMap({
  gu,
  fy = "2025–26",
  selectedDistrictId = "bhavnagar",
  onSelectDistrict,
  onExploreVillages,
}: PureGujaratDistrictMapProps) {
  const [internalSelectedId, setInternalSelectedId] = useState<string>(selectedDistrictId);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showHeadquarters, setShowHeadquarters] = useState(true);

  // Sync prop changes
  React.useEffect(() => {
    if (selectedDistrictId) {
      setInternalSelectedId(selectedDistrictId);
    }
  }, [selectedDistrictId]);

  const activeId = internalSelectedId;

  const activeDistrictInfo = useMemo(() => {
    return demoDistricts.find((d) => d.id === activeId) || demoDistricts[0];
  }, [activeId]);

  const activeTheme = DISTRICT_MAP_THEME[activeId] || DISTRICT_MAP_THEME.bhavnagar;

  const handleDistrictClick = (districtName: string) => {
    const dId = NAME_TO_ID[districtName] || districtName.toLowerCase().replace(/\s+/g, "_");
    setInternalSelectedId(dId);
    if (onSelectDistrict) {
      onSelectDistrict(dId);
    }
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(2.0, Math.max(0.85, prev + delta)));
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <div className="pure-gujarat-map-container relative w-full overflow-hidden rounded-[28px] border border-white/20 bg-[#0C1A24]/90 backdrop-blur-2xl shadow-2xl p-4 md:p-6">
      {/* Top Header / Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
            <Compass size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                {gu ? "ગુજરાત રાજ્ય - ૩૩ જિલ્લા નકશો" : "Gujarat State - 33 District Map"}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {gu ? "માત્ર ગુજરાત (કોઈ અન્ય રાજ્ય નહીં)" : "Strictly Gujarat Only"}
              </span>
            </div>
            <p className="text-xs text-white/60">
              {gu
                ? "જે જિલ્લા પર ક્લિક કરશો તેનો રંગ બદલાશે અને નીચે તેના તમામ ગામડાઓની યોજના પહોંચ ખુલશે"
                : "Click any district to change its color and inspect village-by-village scheme saturation below"}
            </p>
          </div>
        </div>

        {/* Quick District Selector & Zoom Controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={activeId}
              onChange={(e) => {
                const newId = e.target.value;
                setInternalSelectedId(newId);
                if (onSelectDistrict) onSelectDistrict(newId);
              }}
              className="appearance-none bg-white/10 border border-white/25 rounded-xl px-3.5 py-1.5 pr-8 text-xs font-medium text-white focus:outline-none focus:border-cyan-400"
              aria-label={gu ? "જિલ્લો પસંદ કરો" : "Select District"}
            >
              {demoDistricts.map((d) => (
                <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                  {gu ? d.gu : d.name} ({gu ? d.headquartersGu : d.headquarters})
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => setShowHeadquarters(!showHeadquarters)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              showHeadquarters
                ? "bg-white/20 border-white/40 text-white"
                : "bg-white/5 border-white/10 text-white/60 hover:text-white"
            }`}
            title={gu ? "જિલ્લા મથકો અને શહેરો બતાવો/છુપાવો" : "Toggle City Headquarter Pins"}
          >
            {gu ? "મથકો (Cities)" : "HQ Pins"}
          </button>

          <div className="flex items-center rounded-xl bg-white/10 border border-white/20 overflow-hidden">
            <button
              type="button"
              onClick={() => handleZoom(0.15)}
              className="px-2.5 py-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Zoom In"
              title="Zoom In"
            >
              <ZoomIn size={15} />
            </button>
            <button
              type="button"
              onClick={() => handleZoom(-0.15)}
              className="px-2.5 py-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors border-l border-white/10"
              aria-label="Zoom Out"
              title="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>
            <button
              type="button"
              onClick={resetZoom}
              className="px-2.5 py-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors border-l border-white/10"
              aria-label="Reset Zoom"
              title="Reset Zoom"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Main SVG Vector Stage (Strictly Gujarat Only) */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/10] max-h-[640px] rounded-2xl bg-gradient-to-b from-[#0F2330] via-[#0A1721] to-[#071118] border border-white/15 overflow-hidden flex items-center justify-center">
        {/* Subtle Water & Geography Labels (No External States!) */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          {/* Rann of Kachchh Watermark Texture */}
          <div className="absolute top-4 left-1/4 text-white/20 text-xs md:text-sm font-semibold tracking-widest uppercase">
            {gu ? "કચ્છનું મોટું રણ (Rann of Kachchh)" : "Rann of Kachchh"}
          </div>

          {/* Gulf of Kachchh */}
          <div className="absolute top-[48%] left-[16%] text-cyan-300/30 text-[11px] md:text-xs font-medium tracking-wider italic">
            {gu ? "કચ્છનો અખાત (Gulf of Kachchh)" : "Gulf of Kachchh"}
          </div>

          {/* Gulf of Khambhat */}
          <div className="absolute bottom-[28%] left-[58%] text-cyan-300/30 text-[11px] md:text-xs font-medium tracking-wider italic">
            {gu ? "ખંભાતનો અખાત (Gulf of Khambhat)" : "Gulf of Khambhat"}
          </div>

          {/* Arabian Sea */}
          <div className="absolute bottom-6 left-10 text-sky-400/25 text-sm md:text-base font-bold tracking-widest uppercase">
            {gu ? "અરબી સમુદ્ર (ARABIAN SEA)" : "ARABIAN SEA"}
          </div>
        </div>

        {/* Scalable SVG Container */}
        <svg
          viewBox="20 20 940 700"
          className="w-full h-full object-contain relative z-10 transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Active Glow Filter for Clicked District */}
            <filter id="active-district-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="9" floodColor="#FACC15" floodOpacity="0.85" />
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#FFFFFF" floodOpacity="0.9" />
            </filter>

            {/* Hover Filter */}
            <filter id="hover-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#38BDF8" floodOpacity="0.75" />
            </filter>

            {/* Rann salt flat pattern */}
            <pattern id="rann-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="8" cy="8" r="1.5" fill="rgba(255, 255, 255, 0.08)" />
            </pattern>
          </defs>

          {/* 1. DISTRICT POLYGONS (Render strictly Gujarat) */}
          <g className="gujarat-districts">
            {GUJARAT_DISTRICT_POLYGONS.map((district) => {
              const dId = NAME_TO_ID[district.name] || district.name.toLowerCase().replace(/\s+/g, "_");
              const isSelected = activeId === dId;
              const isHovered = hoveredId === dId;
              const theme = DISTRICT_MAP_THEME[dId] || { fillColor: "rgba(255,255,255,0.12)", accentHex: "#38BDF8" };

              // Dynamic color logic:
              // If clicked -> Radiant Golden Yellow #FACC15 with high opacity
              // If hovered -> Brightened pastel
              // Default -> Official pastel map color from the reference image
              const fill = isSelected
                ? "#FACC15"
                : isHovered
                ? "#38BDF8"
                : theme.fillColor;

              const fillOpacity = isSelected ? 0.92 : isHovered ? 0.75 : 0.45;
              const stroke = isSelected
                ? "#FFFFFF"
                : isHovered
                ? "#FFFFFF"
                : "rgba(255, 255, 255, 0.35)";
              const strokeWidth = isSelected ? 3.2 : isHovered ? 2.2 : 1.2;

              return (
                <path
                  key={district.name}
                  d={district.path}
                  fill={fill}
                  fillOpacity={fillOpacity}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  filter={isSelected ? "url(#active-district-glow)" : isHovered ? "url(#hover-glow)" : undefined}
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => handleDistrictClick(district.name)}
                  onMouseEnter={() => setHoveredId(dId)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <title>{`${district.name} - ${gu ? "ક્લિક કરી વિગત જુઓ" : "Click to view details"}`}</title>
                </path>
              );
            })}
          </g>

          {/* 2. DISTRICT NAMES (Bold, high-contrast labels matching reference map) */}
          <g className="district-names pointer-events-none select-none">
            {GUJARAT_DISTRICT_POLYGONS.map((district) => {
              const dId = NAME_TO_ID[district.name] || district.name.toLowerCase().replace(/\s+/g, "_");
              const isSelected = activeId === dId;
              const demoDist = demoDistricts.find((d) => d.id === dId);
              const label = gu ? (demoDist?.gu || district.name) : district.name.toUpperCase();

              return (
                <text
                  key={`name-${district.name}`}
                  x={district.centroid.x}
                  y={district.centroid.y - 7}
                  textAnchor="middle"
                  fill={isSelected ? "#0F2027" : "#FFFFFF"}
                  fontSize={isSelected ? "13" : "11"}
                  fontWeight={isSelected ? "800" : "700"}
                  letterSpacing="0.04em"
                  stroke={isSelected ? "#FACC15" : "rgba(0, 0, 0, 0.85)"}
                  strokeWidth={isSelected ? "0" : "2.5"}
                  paintOrder="stroke fill"
                  className="transition-all duration-200"
                >
                  {label}
                </text>
              );
            })}
          </g>

          {/* 3. CITY & DISTRICT HEADQUARTER PINS (Matching reference map symbols) */}
          {showHeadquarters && (
            <g className="district-headquarters pointer-events-none select-none">
              {DISTRICT_HQ_PINS.map((pin) => {
                const isSelected = activeId === pin.id;
                const cityLabel = gu ? pin.hqGu : pin.hqEn;

                if (pin.isCapital) {
                  // Gandhinagar: Red bullseye with gold star (State Capital ⭐)
                  return (
                    <g key={pin.id} transform={`translate(${pin.x}, ${pin.y})`}>
                      {/* Pulse Wave Animation */}
                      <circle r="14" fill="#EF4444" fillOpacity="0.25" className="animate-ping" />
                      <circle r="8" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
                      <circle r="3.5" fill="#FACC15" />
                      <text
                        x="12"
                        y="4"
                        fill="#FEF08A"
                        fontSize="12"
                        fontWeight="800"
                        stroke="rgba(0,0,0,0.9)"
                        strokeWidth="3"
                        paintOrder="stroke fill"
                      >
                        {cityLabel} ⭐ {gu ? "(પાટનગર)" : "(Capital)"}
                      </text>
                    </g>
                  );
                }

                // Official District Headquarter Marker: Concentric dot circle
                return (
                  <g key={pin.id} transform={`translate(${pin.x}, ${pin.y})`}>
                    <circle
                      r={isSelected ? "6.5" : "5"}
                      fill={isSelected ? "#FACC15" : "#FFFFFF"}
                      stroke="#0F202B"
                      strokeWidth={isSelected ? "2.5" : "1.8"}
                    />
                    <circle r="2" fill="#0F202B" />
                    <text
                      x="8"
                      y="3.5"
                      fill={isSelected ? "#FDE047" : "#F1F5F9"}
                      fontSize={isSelected ? "11.5" : "10"}
                      fontWeight={isSelected ? "700" : "600"}
                      stroke="rgba(0,0,0,0.85)"
                      strokeWidth="2.5"
                      paintOrder="stroke fill"
                    >
                      {cityLabel}
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </svg>

        {/* Floating Active District Summary HUD Card */}
        <AnimatePresence>
          {activeDistrictInfo && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 right-4 z-20 max-w-[340px] w-full rounded-2xl bg-[#0F202B]/95 backdrop-blur-2xl border border-yellow-400/50 p-4 shadow-2xl text-white"
            >
              <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2 mb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />
                    <span className="text-[11px] font-bold text-yellow-300 uppercase tracking-wider">
                      {gu ? "પસંદ કરેલ જિલ્લો" : "SELECTED DISTRICT"}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    {gu ? activeDistrictInfo.gu : activeDistrictInfo.name}
                  </h3>
                  <p className="text-xs text-white/60">
                    {gu ? "જિલ્લા મથક:" : "Headquarters:"} <strong className="text-white">{gu ? activeDistrictInfo.headquartersGu : activeDistrictInfo.headquarters}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-white border border-white/20">
                    {activeDistrictInfo.region}
                  </span>
                </div>
              </div>

              {/* District KPI Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                  <span className="text-white/60 block text-[10px]">{gu ? "કુલ તાલુકા" : "Talukas"}</span>
                  <strong className="text-sm font-bold text-white">{activeDistrictInfo.talukaCount}</strong>
                </div>
                <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                  <span className="text-white/60 block text-[10px]">{gu ? "કુલ ગામડાઓ" : "Villages"}</span>
                  <strong className="text-sm font-bold text-white">{activeDistrictInfo.villageCount}</strong>
                </div>
                <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                  <span className="text-white/60 block text-[10px]">{gu ? "યોજના વપરાશ" : "Disbursed"}</span>
                  <strong className="text-sm font-bold text-amber-300">₹{activeDistrictInfo.disbursed} Cr</strong>
                </div>
                <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                  <span className="text-white/60 block text-[10px]">{gu ? "લાભાર્થીઓ" : "Beneficiaries"}</span>
                  <strong className="text-sm font-bold text-emerald-300">{activeDistrictInfo.beneficiaries.toLocaleString("en-IN")}</strong>
                </div>
              </div>

              {/* Call-to-action button: Jump to Village Intelligence */}
              <button
                type="button"
                onClick={() => {
                  if (onExploreVillages) {
                    onExploreVillages(activeId);
                  } else {
                    document.getElementById("village-analytics-hub")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg transition-all"
              >
                <span>{gu ? "આ જિલ્લાના ગામડાઓની યોજના જુઓ" : "View Villages in this District"}</span>
                <ArrowDown size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend Box (Matching Reference Map) */}
        <div className="absolute top-4 left-4 z-20 hidden md:block rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/15 p-2.5 text-[11px] text-white/80 shadow-lg pointer-events-none select-none">
          <div className="font-bold text-white mb-1.5 border-b border-white/15 pb-1 flex items-center gap-1.5">
            <Layers size={12} className="text-yellow-400" />
            <span>{gu ? "નકશા સંકેત (LEGEND)" : "MAP LEGEND"}</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500 border border-white flex items-center justify-center text-[8px] text-white">⭐</span>
              <span>{gu ? "રાજધાની (State Capital)" : "State Capital (Gandhinagar)"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-white border border-slate-900 flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-slate-900" />
              </span>
              <span>{gu ? "જિલ્લા મથક (District Headquarter)" : "District Headquarter"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-1.5 rounded-sm bg-yellow-400" />
              <span>{gu ? "પસંદ કરેલ જિલ્લો (Selected)" : "Selected District (Highlighted)"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
