"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import { GUJARAT_DISTRICT_POLYGONS } from "@/lib/gujarat-svg-paths";
import { demoDistricts, type District } from "@/lib/demo-data";
import {
  Compass,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  ArrowDown,
  Building2,
  Sparkles,
  MapPin,
  CheckCircle2,
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
  "vav-tharad": "vav_tharad",
  "vav_tharad": "vav_tharad",
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

// Carefully positioned HQ coordinates to prevent overlapping with district names
const DISTRICT_HQ_PINS: {
  id: string;
  hqEn: string;
  hqGu: string;
  x: number;
  y: number;
  isCapital?: boolean;
}[] = [
  { id: "kutch", hqEn: "Bhuj", hqGu: "ભુજ", x: 235, y: 220 },
  { id: "banaskantha", hqEn: "Palanpur", hqGu: "પાલનપુર", x: 670, y: 90 },
  { id: "vav_tharad", hqEn: "Tharad", hqGu: "થરાદ", x: 490, y: 95 },
  { id: "patan", hqEn: "Patan", hqGu: "પાટણ", x: 575, y: 160 },
  { id: "mehsana", hqEn: "Mehsana", hqGu: "મહેસાણા", x: 670, y: 195 },
  { id: "sabarkantha", hqEn: "Himmatnagar", hqGu: "હિંમતનગર", x: 740, y: 175 },
  { id: "aravalli", hqEn: "Modasa", hqGu: "મોડાસા", x: 795, y: 222 },
  { id: "mahisagar", hqEn: "Lunawada", hqGu: "લુણાવાડા", x: 835, y: 260 },
  { id: "dahod", hqEn: "Dahod", hqGu: "દાહોદ", x: 915, y: 315 },
  { id: "panchmahal", hqEn: "Godhra", hqGu: "ગોધરા", x: 825, y: 305 },
  { id: "gandhinagar", hqEn: "Gandhinagar", hqGu: "ગાંધીનગર", x: 690, y: 235, isCapital: true },
  { id: "ahmedabad", hqEn: "Ahmedabad", hqGu: "અમદાવાદ", x: 635, y: 300 },
  { id: "surendranagar", hqEn: "Surendranagar", hqGu: "સુરેન્દ્રનગર", x: 535, y: 325 },
  { id: "morbi", hqEn: "Morbi", hqGu: "મોરબી", x: 415, y: 310 },
  { id: "jamnagar", hqEn: "Jamnagar", hqGu: "જામનગર", x: 315, y: 382 },
  { id: "devbhumi_dwarka", hqEn: "Khambhalia", hqGu: "ખંભાળિયા", x: 215, y: 385 },
  { id: "rajkot", hqEn: "Rajkot", hqGu: "રાજકોટ", x: 425, y: 412 },
  { id: "porbandar", hqEn: "Porbandar", hqGu: "પોરબંદર", x: 245, y: 495 },
  { id: "junagadh", hqEn: "Junagadh", hqGu: "જુનાગઢ", x: 350, y: 525 },
  { id: "gir_somnath", hqEn: "Veraval", hqGu: "વેરાવળ", x: 345, y: 585 },
  { id: "amreli", hqEn: "Amreli", hqGu: "અમરેલી", x: 475, y: 510 },
  { id: "botad", hqEn: "Botad", hqGu: "બોટાદ", x: 540, y: 405 },
  { id: "bhavnagar", hqEn: "Bhavnagar", hqGu: "ભાવનગર", x: 575, y: 485 },
  { id: "anand", hqEn: "Anand", hqGu: "આણંદ", x: 700, y: 375 },
  { id: "kheda", hqEn: "Nadiad", hqGu: "નડિયાદ", x: 705, y: 325 },
  { id: "vadodara", hqEn: "Vadodara", hqGu: "વડોદરા", x: 765, y: 415 },
  { id: "chhota_udepur", hqEn: "Chhota Udaipur", hqGu: "છોટા ઉદેપુર", x: 870, y: 415 },
  { id: "bharuch", hqEn: "Bharuch", hqGu: "ભરૂચ", x: 755, y: 485 },
  { id: "narmada", hqEn: "Rajpipla", hqGu: "રાજપીપળા", x: 815, y: 470 },
  { id: "surat", hqEn: "Surat", hqGu: "સુરત", x: 735, y: 540 },
  { id: "tapi", hqEn: "Vyara", hqGu: "વ્યારા", x: 805, y: 570 },
  { id: "dang", hqEn: "Ahwa", hqGu: "આહવા", x: 840, y: 625 },
  { id: "navsari", hqEn: "Navsari", hqGu: "નવસારી", x: 755, y: 590 },
  { id: "valsad", hqEn: "Valsad", hqGu: "વલસાડ", x: 755, y: 660 },
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
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
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

  const handleDistrictClick = useCallback((districtNameOrId: string) => {
    const dId = NAME_TO_ID[districtNameOrId] || districtNameOrId.toLowerCase().replace(/[\s-]+/g, "_");
    setInternalSelectedId(dId);
    if (onSelectDistrict) {
      onSelectDistrict(dId);
    }
  }, [onSelectDistrict]);

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => {
      const next = Math.min(2.5, Math.max(0.85, prev + delta));
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Mouse pan / drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPanOffset({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="pure-gujarat-map-container">
      {/* Top Header / Filter Controls */}
      <div className="pure-map-header">
        <div className="pure-map-title-row">
          <div className="pure-map-icon-badge">
            <Compass size={22} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <h2 className="pure-map-title">
                {gu ? "ગુજરાત રાજ્ય — ૩૩ જિલ્લા સત્તાવાર નકશો" : "Gujarat State — 33 District Vector Map"}
              </h2>
              <span className="pure-map-badge">
                <CheckCircle2 size={12} />
                {gu ? "માત્ર ગુજરાત (Strictly Gujarat Only)" : "Strictly Gujarat Only"}
              </span>
            </div>
            <p className="pure-map-subtitle">
              {gu
                ? "જે જિલ્લા પર ક્લિક કરશો તેનો રંગ બદલાશે અને નીચે તેના તમામ ગામડાઓની યોજના પહોંચ ખુલશે."
                : "Click any district to change its color and inspect village-by-village scheme saturation below."}
            </p>
          </div>
        </div>

        {/* Quick District Selector & Zoom Controls */}
        <div className="pure-map-controls">
          <div className="pure-map-select-wrap">
            <select
              value={activeId}
              onChange={(e) => {
                const newId = e.target.value;
                setInternalSelectedId(newId);
                if (onSelectDistrict) onSelectDistrict(newId);
              }}
              className="pure-map-select"
              aria-label={gu ? "જિલ્લો પસંદ કરો" : "Select District"}
            >
              {demoDistricts.map((d) => (
                <option key={d.id} value={d.id} style={{ background: "#0c1a24", color: "#ffffff" }}>
                  {gu ? d.gu : d.name} ({gu ? d.headquartersGu : d.headquarters})
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="pure-map-select-icon" />
          </div>

          <button
            type="button"
            onClick={() => setShowHeadquarters(!showHeadquarters)}
            className={`pure-map-btn ${showHeadquarters ? "pure-map-btn--active" : ""}`}
            title={gu ? "જિલ્લા મથકો અને શહેરો બતાવો/છુપાવો" : "Toggle City Headquarter Pins"}
          >
            <Building2 size={14} />
            <span>{gu ? "શહેરો/મથકો" : "HQ Pins"}</span>
          </button>

          <div className="pure-map-zoom-group">
            <button
              type="button"
              onClick={() => handleZoom(0.2)}
              className="pure-map-zoom-btn"
              aria-label="Zoom In"
              title="Zoom In"
            >
              <ZoomIn size={15} />
            </button>
            <button
              type="button"
              onClick={() => handleZoom(-0.2)}
              className="pure-map-zoom-btn"
              aria-label="Zoom Out"
              title="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>
            <button
              type="button"
              onClick={resetZoom}
              className="pure-map-zoom-btn"
              aria-label="Reset Zoom"
              title="Reset View"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Main SVG Vector Stage (Strictly Gujarat Only - Zero Outside States!) */}
      <div
        className="pure-map-stage"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          viewBox="20 20 940 700"
          className="pure-map-svg"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
            cursor: zoomLevel > 1 ? (isDragging ? "grabbing" : "grab") : "default",
          }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Active Glow Filter for Clicked District */}
            <filter id="active-district-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#FACC15" floodOpacity="0.9" />
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#FFFFFF" floodOpacity="0.95" />
            </filter>

            {/* Hover Filter */}
            <filter id="hover-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#38BDF8" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Geographical Water & Maritime Labels */}
          <g className="pure-map-water-labels">
            <text x="360" y="65" className="pure-map-rann-label">
              {gu ? "કચ્છનું મોટું રણ (RANN OF KACHCHH)" : "RANN OF KACHCHH"}
            </text>
            <text x="170" y="340" className="pure-map-water-label">
              {gu ? "કચ્છનો અખાત (Gulf of Kachchh)" : "Gulf of Kachchh"}
            </text>
            <text x="590" y="525" className="pure-map-water-label">
              {gu ? "ખંભાતનો અખાત (Gulf of Khambhat)" : "Gulf of Khambhat"}
            </text>
            <text x="80" y="630" className="pure-map-water-label" style={{ fontSize: "15px", fill: "rgba(56, 189, 248, 0.35)" }}>
              {gu ? "અરબી સમુદ્ર (ARABIAN SEA)" : "ARABIAN SEA"}
            </text>
          </g>

          {/* 1. DISTRICT POLYGONS (Render strictly Gujarat with exact pastel colors) */}
          <g className="gujarat-districts">
            {GUJARAT_DISTRICT_POLYGONS.map((district) => {
              const dId = NAME_TO_ID[district.name] || district.name.toLowerCase().replace(/[\s-]+/g, "_");
              const isSelected = activeId === dId;
              const isHovered = hoveredId === dId;
              const theme = DISTRICT_MAP_THEME[dId] || { fillColor: "rgba(255,255,255,0.14)", accentHex: "#38BDF8" };

              // Dynamic Color Logic:
              // - Clicked/Selected: Radiant Golden Yellow #FACC15 with high opacity (92%)
              // - Hovered: Vivid Sky-Cyan #38BDF8 (78%)
              // - Default: Official Pastel Color matching the user's reference map
              const fill = isSelected
                ? "#FACC15"
                : isHovered
                ? "#38BDF8"
                : theme.fillColor;

              const fillOpacity = isSelected ? 0.92 : isHovered ? 0.78 : 0.45;
              const stroke = isSelected
                ? "#FFFFFF"
                : isHovered
                ? "#FFFFFF"
                : "rgba(255, 255, 255, 0.40)";
              const strokeWidth = isSelected ? 3.4 : isHovered ? 2.4 : 1.2;

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
                  className={`pure-map-district-path ${isSelected ? "pure-map-district-path--selected" : ""}`}
                  onClick={() => handleDistrictClick(district.name)}
                  onMouseEnter={() => setHoveredId(dId)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <title>{`${district.name} - ${gu ? "ક્લિક કરી વિગત જુઓ" : "Click to view details"}`}</title>
                </path>
              );
            })}
          </g>

          {/* 2. DISTRICT NAMES (Bold, high-contrast labels cleanly separated from pins) */}
          <g className="district-names pointer-events-none select-none">
            {GUJARAT_DISTRICT_POLYGONS.map((district) => {
              const dId = NAME_TO_ID[district.name] || district.name.toLowerCase().replace(/[\s-]+/g, "_");
              const isSelected = activeId === dId;
              const demoDist = demoDistricts.find((d) => d.id === dId);
              const label = gu ? (demoDist?.gu || district.name) : district.name.toUpperCase();

              // Offset label above centroid
              const yOffset = district.name === "Kutch" ? -10 : -8;

              return (
                <text
                  key={`name-${district.name}`}
                  x={district.centroid.x}
                  y={district.centroid.y + yOffset}
                  textAnchor="middle"
                  fill={isSelected ? "#0c1a24" : "#ffffff"}
                  fontSize={isSelected ? "13" : "11"}
                  fontWeight={isSelected ? "900" : "700"}
                  letterSpacing="0.04em"
                  stroke={isSelected ? "#FACC15" : "rgba(0, 0, 0, 0.85)"}
                  strokeWidth={isSelected ? "0" : "2.6"}
                  paintOrder="stroke fill"
                  className="pure-map-district-name"
                >
                  {label}
                </text>
              );
            })}
          </g>

          {/* 3. CITY & DISTRICT HEADQUARTER PINS (Directly Clickable!) */}
          {showHeadquarters && (
            <g className="district-headquarters">
              {DISTRICT_HQ_PINS.map((pin) => {
                const isSelected = activeId === pin.id;
                const cityLabel = gu ? pin.hqGu : pin.hqEn;

                if (pin.isCapital) {
                  // Gandhinagar: Red bullseye with gold star (State Capital ⭐)
                  return (
                    <g
                      key={pin.id}
                      transform={`translate(${pin.x}, ${pin.y})`}
                      className="pure-map-hq-group"
                      onClick={() => handleDistrictClick(pin.id)}
                    >
                      <circle r="14" fill="#EF4444" fillOpacity="0.25" />
                      <circle r="8" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2.2" />
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
                  <g
                    key={pin.id}
                    transform={`translate(${pin.x}, ${pin.y})`}
                    className="pure-map-hq-group"
                    onClick={() => handleDistrictClick(pin.id)}
                  >
                    <circle
                      r={isSelected ? "6.5" : "5"}
                      fill={isSelected ? "#FACC15" : "#FFFFFF"}
                      stroke="#0c1a24"
                      strokeWidth={isSelected ? "2.6" : "1.8"}
                    />
                    <circle r="2" fill="#0c1a24" />
                    <text
                      x="8"
                      y="3.5"
                      fill={isSelected ? "#FDE047" : "#F1F5F9"}
                      fontSize={isSelected ? "11.5" : "10"}
                      fontWeight={isSelected ? "800" : "600"}
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
              className="pure-map-hud-card"
            >
              <div className="pure-map-hud-head">
                <div>
                  <span className="pure-map-hud-tag">
                    <span style={{ width: "8px", height: "8px", borderRadius: "9999px", background: "#facc15" }} />
                    {gu ? "પસંદ કરેલ જિલ્લો" : "SELECTED DISTRICT"}
                  </span>
                  <h3 className="pure-map-hud-title">
                    {gu ? activeDistrictInfo.gu : activeDistrictInfo.name}
                  </h3>
                  <p className="pure-map-hud-hq">
                    {gu ? "જિલ્લા મથક:" : "Headquarters:"} <strong style={{ color: "#ffffff" }}>{gu ? activeDistrictInfo.headquartersGu : activeDistrictInfo.headquarters}</strong>
                  </p>
                </div>
                <div>
                  <span style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: "700", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                    {activeDistrictInfo.region}
                  </span>
                </div>
              </div>

              {/* District KPI Metrics */}
              <div className="pure-map-hud-metrics">
                <div className="pure-map-hud-metric-box">
                  <span className="pure-map-hud-metric-label">{gu ? "કુલ તાલુકા" : "Talukas"}</span>
                  <strong className="pure-map-hud-metric-val">{activeDistrictInfo.talukaCount}</strong>
                </div>
                <div className="pure-map-hud-metric-box">
                  <span className="pure-map-hud-metric-label">{gu ? "કુલ ગામડાઓ" : "Villages"}</span>
                  <strong className="pure-map-hud-metric-val">{activeDistrictInfo.villageCount}</strong>
                </div>
                <div className="pure-map-hud-metric-box">
                  <span className="pure-map-hud-metric-label">{gu ? "યોજના વપરાશ" : "Disbursed"}</span>
                  <strong className="pure-map-hud-metric-val" style={{ color: "#fde047" }}>₹{activeDistrictInfo.disbursed} Cr</strong>
                </div>
                <div className="pure-map-hud-metric-box">
                  <span className="pure-map-hud-metric-label">{gu ? "લાભાર્થીઓ" : "Beneficiaries"}</span>
                  <strong className="pure-map-hud-metric-val" style={{ color: "#34d399" }}>{activeDistrictInfo.beneficiaries.toLocaleString("en-IN")}</strong>
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
                className="pure-map-hud-cta"
              >
                <span>{gu ? "આ જિલ્લાના ગામડાઓની યોજના જુઓ" : "View Villages in this District"}</span>
                <ArrowDown size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend Box (Matching Reference Map) */}
        <div className="pure-map-legend-box hidden md:block">
          <div style={{ fontWeight: "800", color: "#ffffff", marginBottom: "6px", borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Layers size={13} style={{ color: "#facc15" }} />
            <span>{gu ? "નકશા સંકેત (LEGEND)" : "MAP LEGEND"}</span>
          </div>
          <div>
            <div className="pure-map-legend-item">
              <span style={{ width: "14px", height: "14px", borderRadius: "9999px", background: "#ef4444", border: "1px solid #ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px" }}>⭐</span>
              <span>{gu ? "રાજધાની (State Capital)" : "State Capital (Gandhinagar)"}</span>
            </div>
            <div className="pure-map-legend-item">
              <span style={{ width: "12px", height: "12px", borderRadius: "9999px", background: "#ffffff", border: "1.5px solid #0c1a24", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ width: "4px", height: "4px", borderRadius: "9999px", background: "#0c1a24" }} />
              </span>
              <span>{gu ? "જિલ્લા મથક (District Headquarter)" : "District Headquarter"}</span>
            </div>
            <div className="pure-map-legend-item">
              <span style={{ width: "14px", height: "6px", borderRadius: "2px", background: "#facc15" }} />
              <span>{gu ? "પસંદ કરેલ જિલ્લો (Selected)" : "Selected District (Highlighted)"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
