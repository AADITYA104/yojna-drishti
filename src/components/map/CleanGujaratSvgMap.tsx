"use client";

import React, { useState, useMemo } from "react";
import { GUJARAT_DISTRICT_POLYGONS } from "@/lib/gujarat-svg-paths";
import { demoDistricts, type District } from "@/lib/demo-data";
import { localizeText, type AppLanguage } from "@/lib/i18n";
import {
  MapPin,
  Building2,
  Users,
  Coins,
  CheckCircle2,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface CleanGujaratSvgMapProps {
  gu: boolean;
  lang: AppLanguage;
  selectedDistrictId: string;
  onDistrictSelect: (districtId: string) => void;
  regionFilter?: "all" | District["region"];
  onRegionChange?: (region: "all" | District["region"]) => void;
}

// Regional color palette for subtle tinted glass fills
const REGION_PALETTES: Record<string, { fill: string; stroke: string }> = {
  Saurashtra: { fill: "rgba(56, 189, 248, 0.12)", stroke: "rgba(56, 189, 248, 0.35)" },
  "North Gujarat": { fill: "rgba(250, 204, 21, 0.11)", stroke: "rgba(250, 204, 21, 0.35)" },
  "Central Gujarat": { fill: "rgba(66, 200, 138, 0.12)", stroke: "rgba(66, 200, 138, 0.35)" },
  "South Gujarat": { fill: "rgba(197, 216, 70, 0.12)", stroke: "rgba(197, 216, 70, 0.35)" },
  Kutch: { fill: "rgba(168, 85, 247, 0.12)", stroke: "rgba(168, 85, 247, 0.35)" },
};

// District Headquarter Nodes corresponding to the official map
interface CityHeadquarter {
  id: string;
  name: string;
  nameGu: string;
  city: string;
  cityGu: string;
  x: number;
  y: number;
  isCapital?: boolean;
}

const DISTRICT_HEADQUARTERS: CityHeadquarter[] = [
  { id: "gandhinagar", name: "Gandhinagar", nameGu: "ગાંધીનગર", city: "Gandhinagar", cityGu: "ગાંધીનગર (રાજધાની)", x: 690, y: 235, isCapital: true },
  { id: "ahmedabad", name: "Ahmedabad", nameGu: "અમદાવાદ", city: "Ahmedabad", cityGu: "અમદાવાદ", x: 635, y: 285 },
  { id: "bhavnagar", name: "Bhavnagar", nameGu: "ભાવનગર", city: "Bhavnagar", cityGu: "ભાવનગર", x: 575, y: 470 },
  { id: "rajkot", name: "Rajkot", nameGu: "રાજકોટ", city: "Rajkot", cityGu: "રાજકોટ", x: 425, y: 400 },
  { id: "surat", name: "Surat", nameGu: "સુરત", city: "Surat", cityGu: "સુરત", x: 745, y: 525 },
  { id: "vadodara", name: "Vadodara", nameGu: "વડોદરા", city: "Vadodara", cityGu: "વડોદરા", x: 765, y: 400 },
  { id: "kutch", name: "Kutch", nameGu: "કચ્છ", city: "Bhuj", cityGu: "ભુજ", x: 300, y: 190 },
  { id: "jamnagar", name: "Jamnagar", nameGu: "જામનગર", city: "Jamnagar", cityGu: "જામનગર", x: 315, y: 370 },
  { id: "junagadh", name: "Junagadh", nameGu: "જૂનાગઢ", city: "Junagadh", cityGu: "જૂનાગઢ", x: 350, y: 515 },
  { id: "porbandar", name: "Porbandar", nameGu: "પોરબંદર", city: "Porbandar", cityGu: "પોરબંદર", x: 245, y: 485 },
  { id: "gir_somnath", name: "Gir Somnath", nameGu: "ગીર સોમનાથ", city: "Veraval", cityGu: "વેરાવળ", x: 410, y: 575 },
  { id: "amreli", name: "Amreli", nameGu: "અમરેલી", city: "Amreli", cityGu: "અમરેલી", x: 475, y: 495 },
  { id: "botad", name: "Botad", nameGu: "બોટાદ", city: "Botad", cityGu: "બોટાદ", x: 540, y: 395 },
  { id: "surendranagar", name: "Surendranagar", nameGu: "સુરેન્દ્રનગર", city: "Surendranagar", cityGu: "સુરેન્દ્રનગર", x: 535, y: 310 },
  { id: "morbi", name: "Morbi", nameGu: "મોરબી", city: "Morbi", cityGu: "મોરબી", x: 415, y: 295 },
  { id: "devbhumi_dwarka", name: "Devbhumi Dwarka", nameGu: "દેવભૂમિ દ્વારકા", city: "Khambhalia", cityGu: "ખંભાળિયા", x: 215, y: 395 },
  { id: "banaskantha", name: "Banaskantha", nameGu: "બનાસકાંઠા", city: "Palanpur", cityGu: "પાલનપુર", x: 575, y: 90 },
  { id: "patan", name: "Patan", nameGu: "પાટણ", city: "Patan", cityGu: "પાટણ", x: 555, y: 175 },
  { id: "mehsana", name: "Mehsana", nameGu: "મહેસાણા", city: "Mehsana", cityGu: "મહેસાણા", x: 675, y: 185 },
  { id: "sabarkantha", name: "Sabarkantha", nameGu: "સાબરકાંઠા", city: "Himmatnagar", cityGu: "હિંમતનગર", x: 750, y: 155 },
  { id: "aravalli", name: "Aravalli", nameGu: "અરવલ્લી", city: "Modasa", cityGu: "મોડાસા", x: 795, y: 215 },
  { id: "mahisagar", name: "Mahisagar", nameGu: "મહીસાગર", city: "Lunawada", cityGu: "લુણાવાડા", x: 840, y: 245 },
  { id: "panchmahal", name: "Panchmahal", nameGu: "પંચમહાલ", city: "Godhra", cityGu: "ગોધરા", x: 825, y: 320 },
  { id: "dahod", name: "Dahod", nameGu: "દાહોદ", city: "Dahod", cityGu: "દાહોદ", x: 900, y: 285 },
  { id: "anand", name: "Anand", nameGu: "આણંદ", city: "Anand", cityGu: "આણંદ", x: 700, y: 360 },
  { id: "kheda", name: "Kheda", nameGu: "ખેડા", city: "Nadiad", cityGu: "નડિયાદ", x: 730, y: 295 },
  { id: "chhota_udepur", name: "Chhota Udaipur", nameGu: "છોટા ઉદેપુર", city: "Chhota Udepur", cityGu: "છોટા ઉદેપુર", x: 870, y: 395 },
  { id: "bharuch", name: "Bharuch", nameGu: "ભરૂચ", city: "Bharuch", cityGu: "ભરૂચ", x: 755, y: 470 },
  { id: "narmada", name: "Narmada", nameGu: "નર્મદા", city: "Rajpipla", cityGu: "રાજપીપળા", x: 825, y: 440 },
  { id: "tapi", name: "Tapi", nameGu: "તાપી", city: "Vyara", cityGu: "વ્યારા", x: 810, y: 545 },
  { id: "navsari", name: "Navsari", nameGu: "નવસારી", city: "Navsari", cityGu: "નવસારી", x: 765, y: 575 },
  { id: "dang", name: "Dang", nameGu: "ડાંગ", city: "Ahwa", cityGu: "આહવા", x: 840, y: 605 },
  { id: "valsad", name: "Valsad", nameGu: "વલસાડ", city: "Valsad", cityGu: "વલસાડ", x: 765, y: 650 },
];

export function CleanGujaratSvgMap({
  gu,
  lang,
  selectedDistrictId,
  onDistrictSelect,
  regionFilter = "all",
  onRegionChange,
}: CleanGujaratSvgMapProps) {
  const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Map demo districts by name and id
  const districtMap = useMemo(() => {
    const map = new Map<string, District>();
    demoDistricts.forEach((d) => {
      map.set(d.name.toLowerCase().replace(/[\s_-]/g, ""), d);
      map.set(d.id.toLowerCase().replace(/[\s_-]/g, ""), d);
    });
    return map;
  }, []);

  const getDistrictForPoly = (polyName: string): District | undefined => {
    const key = polyName.toLowerCase().replace(/[\s_-]/g, "");
    return districtMap.get(key);
  };

  const selectedDistrict = useMemo(() => {
    return (
      demoDistricts.find((d) => d.id === selectedDistrictId) ||
      demoDistricts.find((d) => d.name.toLowerCase() === selectedDistrictId.toLowerCase()) ||
      demoDistricts[0]
    );
  }, [selectedDistrictId]);

  const handlePointerMove = (e: React.PointerEvent<SVGElement>, district?: District) => {
    if (!district) return;
    const rect = e.currentTarget.ownerSVGElement?.parentElement?.getBoundingClientRect();
    if (rect) {
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
    setHoveredDistrict(district);
  };

  const regions: { id: "all" | District["region"]; gu: string; en: string }[] = [
    { id: "all", gu: "સમગ્ર ગુજરાત (૩૩ જિલ્લા)", en: "All Gujarat (33)" },
    { id: "Saurashtra", gu: "સૌરાષ્ટ્ર", en: "Saurashtra" },
    { id: "North Gujarat", gu: "ઉત્તર ગુજરાત", en: "North Gujarat" },
    { id: "Central Gujarat", gu: "મધ્ય ગુજરાત", en: "Central Gujarat" },
    { id: "South Gujarat", gu: "દક્ષિણ ગુજરાત", en: "South Gujarat" },
    { id: "Kutch", gu: "કચ્છ", en: "Kutch" },
  ];

  return (
    <div className="clean-gujarat-map-container w-full">
      {/* Top Controls: Region Filters & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-2">
        <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Region filters">
          <span className="text-xs font-semibold text-white/50 flex items-center gap-1 mr-1">
            <Filter size={13} />
            {gu ? "વિસ્તાર:" : "Region:"}
          </span>
          {regions.map((reg) => {
            const active = regionFilter === reg.id;
            return (
              <button
                key={reg.id}
                type="button"
                onClick={() => onRegionChange?.(reg.id)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                  active
                    ? "bg-[#38BDF8] text-slate-950 font-bold shadow-md shadow-[#38BDF8]/20"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {gu ? reg.gu : reg.en}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] text-white/60">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] ring-2 ring-white/60 animate-pulse" />
            <span>{gu ? "રાજ્ય પાટનગર (ગાંધીનગર)" : "State Capital"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white/90" />
            <span>{gu ? "જિલ્લા મુખ્ય મથક" : "District HQ"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded bg-[#38BDF8] shadow-sm shadow-[#38BDF8]" />
            <span>{gu ? "પસંદ કરેલ જિલ્લો" : "Selected District"}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: SVG Map on Left, District Analytics Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Map Canvas (7 or 8 columns on large screens) */}
        <div className="lg:col-span-8 bg-gradient-to-b from-[#0F202B]/90 to-[#0A161E]/95 rounded-[24px] border border-white/15 p-4 relative shadow-2xl overflow-hidden">
          {/* Subtle water labels */}
          <div className="absolute top-16 left-6 pointer-events-none text-[11px] font-bold text-white/20 tracking-widest uppercase">
            {gu ? "કચ્છનું મોટું રણ (Rann of Kachchh)" : "Rann of Kachchh"}
          </div>
          <div className="absolute top-[48%] left-10 pointer-events-none text-[11px] font-bold text-white/20 tracking-wider">
            {gu ? "કચ્છનો અખાત (Gulf of Kachchh)" : "Gulf of Kachchh"}
          </div>
          <div className="absolute bottom-28 left-[58%] pointer-events-none text-[11px] font-bold text-white/20 tracking-wider">
            {gu ? "ખંભાતનો અખાત (Gulf of Khambhat)" : "Gulf of Khambhat"}
          </div>
          <div className="absolute bottom-12 left-10 pointer-events-none text-xs font-bold text-cyan-400/25 tracking-widest uppercase">
            {gu ? "અરબી સમુદ્ર (Arabian Sea)" : "Arabian Sea"}
          </div>

          <svg
            viewBox="20 20 910 680"
            className="w-full h-auto select-none"
            style={{ filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.5))" }}
            aria-label={gu ? "ગુજરાતનો સત્તાવાર ૩૩ જિલ્લા નકશો" : "Official Gujarat 33 District Map"}
          >
            <defs>
              <linearGradient id="selected-district-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0.95" />
              </linearGradient>
              <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#38BDF8" floodOpacity="0.75" />
              </filter>
              <filter id="capital-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#EF4444" floodOpacity="0.9" />
              </filter>
            </defs>

            {/* 1. DISTRICT POLYGONS */}
            <g className="district-polygons-group">
              {GUJARAT_DISTRICT_POLYGONS.map((poly) => {
                const district = getDistrictForPoly(poly.name);
                const isSelected =
                  district?.id === selectedDistrict.id ||
                  poly.name.toLowerCase() === selectedDistrict.name.toLowerCase();
                const isHovered = hoveredDistrict && district?.id === hoveredDistrict.id;

                const isFilteredOut =
                  regionFilter !== "all" && district && district.region !== regionFilter;

                const regStyle = REGION_PALETTES[district?.region || "Saurashtra"] || {
                  fill: "rgba(255, 255, 255, 0.08)",
                  stroke: "rgba(255, 255, 255, 0.25)",
                };

                return (
                  <path
                    key={poly.name}
                    d={poly.path}
                    className="transition-all duration-200 cursor-pointer outline-none"
                    style={{
                      fill: isSelected
                        ? "url(#selected-district-grad)"
                        : isHovered
                        ? "rgba(56, 189, 248, 0.45)"
                        : isFilteredOut
                        ? "rgba(255, 255, 255, 0.02)"
                        : regStyle.fill,
                      stroke: isSelected
                        ? "#FFFFFF"
                        : isHovered
                        ? "#38BDF8"
                        : isFilteredOut
                        ? "rgba(255, 255, 255, 0.08)"
                        : regStyle.stroke,
                      strokeWidth: isSelected ? 2.8 : isHovered ? 2.0 : 1.15,
                      filter: isSelected ? "url(#neon-glow)" : "none",
                      opacity: isFilteredOut ? 0.35 : 1,
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${district ? (gu ? district.gu : district.name) : poly.name} ${gu ? "જિલ્લો" : "District"}`}
                    onClick={() => {
                      if (district) onDistrictSelect(district.id);
                    }}
                    onPointerMove={(e) => handlePointerMove(e, district)}
                    onPointerLeave={() => setHoveredDistrict(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (district) onDistrictSelect(district.id);
                      }
                    }}
                  />
                );
              })}
            </g>

            {/* 2. DISTRICT HEADQUARTERS & CITY NODES */}
            <g className="headquarters-nodes-group pointer-events-none">
              {DISTRICT_HEADQUARTERS.map((hq) => {
                const isSelected = hq.id === selectedDistrict.id;
                const isCapital = hq.isCapital;

                return (
                  <g key={hq.id} transform={`translate(${hq.x}, ${hq.y})`} className="city-node">
                    {/* Pulsing ring for selected city or state capital */}
                    {isSelected && (
                      <circle r="14" fill="none" stroke="#FFFFFF" strokeWidth="1.8" opacity="0.8" className="animate-ping" />
                    )}

                    {isCapital ? (
                      // State Capital Gandhinagar Double Beacon
                      <>
                        <circle r="8" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" filter="url(#capital-glow)" />
                        <circle r="3.5" fill="#FFFFFF" />
                      </>
                    ) : (
                      // District Headquarters City Dot
                      <>
                        <circle
                          r={isSelected ? 6 : 4}
                          fill={isSelected ? "#0F202B" : "#FFFFFF"}
                          stroke={isSelected ? "#FFFFFF" : "rgba(15, 32, 43, 0.9)"}
                          strokeWidth={isSelected ? 2.4 : 1.2}
                        />
                        {isSelected && <circle r="2.5" fill="#38BDF8" />}
                      </>
                    )}

                    {/* City Label */}
                    <text
                      x={10}
                      y={4}
                      fill={isSelected ? "#FFFFFF" : isCapital ? "#FCA5A5" : "rgba(255, 255, 255, 0.88)"}
                      fontSize={isSelected ? "13" : isCapital ? "12" : "10"}
                      fontFamily="system-ui, -apple-system, sans-serif"
                      fontWeight={isSelected || isCapital ? "800" : "600"}
                      style={{
                        paintOrder: "stroke",
                        stroke: "#07131B",
                        strokeWidth: "3px",
                        strokeLinejoin: "round",
                      }}
                    >
                      {gu ? hq.cityGu : hq.city}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Hover Tooltip */}
          {hoveredDistrict && (
            <div
              className="absolute pointer-events-none z-30 bg-[#0F202B]/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/25 shadow-2xl text-xs"
              style={{
                left: Math.min(mousePos.x + 15, 620),
                top: Math.max(mousePos.y - 45, 10),
              }}
            >
              <div className="font-extrabold text-white text-sm flex items-center gap-1.5">
                <MapPin size={13} className="text-[#38BDF8]" />
                {gu ? hoveredDistrict.gu : hoveredDistrict.name}
              </div>
              <div className="text-white/60 text-[11px] mt-0.5">
                {hoveredDistrict.talukaCount} {gu ? "તાલુકાઓ" : "Talukas"} · {hoveredDistrict.villageCount.toLocaleString("en-IN")}{" "}
                {gu ? "ગામો" : "Villages"}
              </div>
              <div className="text-[#FACC15] font-semibold text-[11px] mt-0.5">
                {gu ? "યોજના પહોંચ:" : "Welfare Reach:"} {hoveredDistrict.beneficiaries.toLocaleString("en-IN")}{" "}
                {gu ? "લાભાર્થીઓ" : "Citizens"}
              </div>
            </div>
          )}

          {/* Map bottom guidance text */}
          <div className="mt-2 text-center text-xs text-white/50">
            {gu
              ? "👆 કોઈપણ જિલ્લા અથવા શહેર પર ક્લિક કરો — નીચે તે જિલ્લાના દરેક ગામ અને યોજનાઓની વિગત ખુલશે"
              : "👆 Click on any district or city to explore grassroots village-level welfare intelligence below"}
          </div>
        </div>

        {/* Selected District Real-Time Intelligence Card (4 columns on desktop) */}
        <div className="lg:col-span-4 bg-gradient-to-b from-[#132A38] to-[#0D1F2A] rounded-[24px] border border-white/20 p-5 shadow-2xl text-white">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
              <Building2 size={14} />
              {gu ? "પસંદ કરેલ જિલ્લો" : "Selected District"}
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#38BDF8]/20 text-[#38BDF8] font-bold border border-[#38BDF8]/30">
              {gu ? selectedDistrict.regionGu : selectedDistrict.region}
            </span>
          </div>

          <div className="mt-4">
            <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{gu ? selectedDistrict.gu : selectedDistrict.name}</span>
              <span className="text-sm font-semibold text-white/60 font-sans">
                ({selectedDistrict.code})
              </span>
            </h3>
            <p className="text-xs text-white/65 mt-1">
              {gu
                ? `${selectedDistrict.gu} જિલ્લાના તમામ તાલુકાઓ અને ગામોમાં સરકારી યોજનાઓનું સંતૃપ્તિ વિશ્લેષણ.`
                : `Welfare program saturation and beneficiary analysis for ${selectedDistrict.name} district.`}
            </p>
          </div>

          {/* Key District Numbers */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-1.5 text-white/60 text-xs mb-1">
                <Users size={14} className="text-[#38BDF8]" />
                <span>{gu ? "કુલ લાભાર્થી" : "Beneficiaries"}</span>
              </div>
              <div className="text-xl font-extrabold text-white">
                {selectedDistrict.beneficiaries.toLocaleString(gu ? "gu-IN" : "en-IN")}
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                +14.8% {gu ? "આ વર્ષે" : "YoY Growth"}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-1.5 text-white/60 text-xs mb-1">
                <Coins size={14} className="text-[#FACC15]" />
                <span>{gu ? "યોજના સહાય" : "Funds Granted"}</span>
              </div>
              <div className="text-xl font-extrabold text-[#FACC15]">
                ₹ {selectedDistrict.disbursed} {gu ? "કરોડ" : "Cr"}
              </div>
              <div className="text-[10px] text-white/50 mt-0.5">{gu ? "સીધી સહાય DBT" : "Direct Benefit"}</div>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-1.5 text-white/60 text-xs mb-1">
                <Layers size={14} className="text-[#C5D846]" />
                <span>{gu ? "તાલુકા / ગામો" : "Talukas / Villages"}</span>
              </div>
              <div className="text-base font-bold text-white">
                {selectedDistrict.talukaCount} <span className="text-xs text-white/60">{gu ? "તાલુકા" : "Talukas"}</span>
              </div>
              <div className="text-xs text-white/70">
                {selectedDistrict.villageCount.toLocaleString(gu ? "gu-IN" : "en-IN")}{" "}
                <span className="text-[10px] text-white/50">{gu ? "ગામો" : "villages"}</span>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-1.5 text-white/60 text-xs mb-1">
                <CheckCircle2 size={14} className="text-[#42C88A]" />
                <span>{gu ? "સરેરાશ સંતૃપ્તિ" : "Saturation"}</span>
              </div>
              <div className="text-xl font-extrabold text-[#42C88A]">
                {Math.round((selectedDistrict.approved / Math.max(selectedDistrict.applications, 1)) * 100)}%
              </div>
              <div className="text-[10px] text-emerald-300 font-medium mt-0.5">{gu ? "લક્ષ્યાંક સિદ્ધ" : "Target Achieved"}</div>
            </div>
          </div>

          {/* Top 3 Active Schemes in This District */}
          <div className="mt-5 border-t border-white/10 pt-4">
            <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#FACC15]" />
              {gu ? "મુખ્ય સક્રિય યોજનાઓ" : "Top Flagship Programs"}
            </h4>
            <div className="space-y-2">
              <div className="bg-white/5 rounded-lg p-2.5 border border-white/5 text-xs flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">
                    {gu ? "મુખ્યમંત્રી કિસાન સહાય યોજના" : "Mukhyamantri Kisan Sahay"}
                  </div>
                  <div className="text-[10px] text-white/50">{gu ? "કૃષિ અને પશુપાલન" : "Agriculture"}</div>
                </div>
                <span className="text-xs font-bold text-cyan-300">92% {gu ? "સંતૃપ્તિ" : "Sat"}</span>
              </div>

              <div className="bg-white/5 rounded-lg p-2.5 border border-white/5 text-xs flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">
                    {gu ? "વ્હાલી દીકરી યોજના" : "Vahli Dikri Yojna"}
                  </div>
                  <div className="text-[10px] text-white/50">{gu ? "મહિલા અને બાળકલ્યાણ" : "Women & Child"}</div>
                </div>
                <span className="text-xs font-bold text-pink-300">88% {gu ? "સંતૃપ્તિ" : "Sat"}</span>
              </div>

              <div className="bg-white/5 rounded-lg p-2.5 border border-white/5 text-xs flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">
                    {gu ? "આયુષ્માન ભારત (PMJAY - MA)" : "Ayushman Bharat PMJAY"}
                  </div>
                  <div className="text-[10px] text-white/50">{gu ? "આરોગ્ય અને તબીબી" : "Health Care"}</div>
                </div>
                <span className="text-xs font-bold text-emerald-300">95% {gu ? "સંતૃપ્તિ" : "Sat"}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
            <span>{gu ? "સત્તાવાર LGD સંકલન" : "Official LGD Sync"}</span>
            <span className="text-cyan-400 font-semibold">{gu ? "સંપૂર્ણ સક્રિય" : "Live & Active"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
