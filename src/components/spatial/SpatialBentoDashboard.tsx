"use client";

import React, { useState, useMemo } from "react";
import { getLocale, localizeText } from "@/lib/i18n";
import type { AppLanguage } from "@/lib/i18n";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Building2,
  FileCheck2,
  ShieldCheck,
  ArrowRight,
  Layers,
  Calendar,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { demoDistricts, demoSchemes } from "@/lib/demo-data";

interface SpatialBentoDashboardProps {
  gu: boolean;
  lang: AppLanguage;
  fy?: string;
  onNavigate: (view: "map" | "schemes" | "wizard" | "saved" | "settings") => void;
  onSelectYojna?: (name: string) => void;
}

const allSectors = [
  { id: "khedut", name: "Khedut", nameGu: "ખેડૂત", nameHi: "खेड़ूत / किसान", pct: 78, category: "agriculture" },
  { id: "shikshan", name: "Shikshan", nameGu: "શિક્ષણ", nameHi: "शिक्षा & कौशल", pct: 64, category: "education" },
  { id: "mahila", name: "Mahila", nameGu: "મહિલા", nameHi: "महिला कल्याण", pct: 85, category: "women" },
  { id: "arogya", name: "Arogya", nameGu: "આરોગ્ય", nameHi: "स्वास्थ्य सेवा", pct: 52, category: "health" },
  { id: "msme", name: "MSME", nameGu: "ઉદ્યોગ", nameHi: "उद्योग / MSME", pct: 90, category: "msme" },
  { id: "awas", name: "Awas", nameGu: "આવાસ", nameHi: "आवास निर्माण", pct: 60, category: "housing" },
  { id: "yuva", name: "Yuva", nameGu: "યુવા", nameHi: "युवा सशक्तिकरण", pct: 45, category: "youth" },
];

const featuredYojnas = [
  {
    id: "kisan-sahay",
    title: "Mukhyamantri Kisan Sahay Yojna",
    titleGu: "મુખ્યમંત્રી કિસાન સહાય યોજના",
    titleHi: "मुख्यमंत्री किसान सहाय योजना",
    criteria: "4/4 Criteria Matched",
    criteriaGu: "૪/૪ પાત્રતા પરિપૂર્ણ",
    criteriaHi: "4/4 पात्रता परिपूर्ण",
    status: "apply",
    actionLabel: "Apply Now",
    actionLabelGu: "અરજી કરો",
    actionLabelHi: "आवेदन करें",
    btnClass: "btn-apply",
  },
  {
    id: "vahli-dikri",
    title: "Vahli Dikri Yojna",
    titleGu: "વ્હાલી દીકરી યોજના",
    titleHi: "व्हाली दीकरी योजना",
    criteria: "100% Verified",
    criteriaGu: "૧૦૦% ચકાસાયેલ",
    criteriaHi: "100% सत्यापित",
    status: "verified",
    actionLabel: "Verified",
    actionLabelGu: "ચકાસાયેલ",
    actionLabelHi: "सत्यापित",
    btnClass: "btn-verified",
  },
  {
    id: "namo-lakshmi",
    title: "Namo Lakshmi & Saraswati Yojna",
    titleGu: "નમો લક્ષ્મી & સરસ્વતી સાધના યોજના",
    titleHi: "नमो लक्ष्मी & सरस्वती साधना योजना",
    criteria: "4/4 Criteria Matched",
    criteriaGu: "૪/૪ પાત્રતા પરિપૂર્ણ",
    criteriaHi: "4/4 पात्रता परिपूर्ण",
    status: "apply",
    actionLabel: "Apply Now",
    actionLabelGu: "અરજી કરો",
    actionLabelHi: "आवेदन करें",
    btnClass: "btn-apply",
  },
];

const deadlineEvents: Record<number, { titleEn: string; titleGu: string; titleHi: string }> = {
  1: {
    titleEn: "Farm Mechanization Subsidy Window Open",
    titleGu: "કૃષિ યાંત્રિકીકરણ સહાય પોર્ટલ નોંધણી સક્રિય",
    titleHi: "कृषि यंत्रीकरण सहायता पोर्टल पंजीकरण सक्रिय",
  },
  3: {
    titleEn: "Mukhyamantri Kisan Sahay Registration Deadline",
    titleGu: "મુખ્યમંત્રી કિસાન સહાય પોર્ટલ નોંધણી અંતિમ તારીખ નજીક",
    titleHi: "मुख्यमंत्री किसान सहाय पोर्टल पंजीकरण अंतिम तिथि निकट",
  },
  7: {
    titleEn: "Namo Saraswati Scholarship Batch Verification",
    titleGu: "નમો સરસ્વતી સાધના શિષ્યવૃત્તિ બીજી બેચ ચકાસણી",
    titleHi: "नमो सरस्वती साधना छात्रवृत्ति दूसरा बैच सत्यापन",
  },
  12: {
    titleEn: "Vahli Dikri 1st Installment Sanction Session",
    titleGu: "વ્હાલી દીકરી યોજના પ્રથમ હપ્તા મંજૂરી સત્ર",
    titleHi: "व्हाली दीकरी योजना पहली किस्त स्वीकृति सत्र",
  },
  15: {
    titleEn: "MSME Subsidy Cycle Application Review",
    titleGu: "MSME સબસિડી ચક્ર અરજી સમીક્ષા તારીખ",
    titleHi: "MSME सब्सिडी चक्र आवेदन समीक्षा तिथि",
  },
  20: {
    titleEn: "Ayushman Gujarat Camp - All Taluka PHCs",
    titleGu: "આયુષ્માન ગુજરાત કાર્ડ કેમ્પ - તમામ તાલુકા આરોગ્ય કેન્દ્ર",
    titleHi: "आयुष्मान गुजरात कार्ड शिविर - सभी तालुका स्वास्थ्य केंद्र",
  },
  28: {
    titleEn: "Manav Garima Toolkit Distribution Drive",
    titleGu: "માનવ ગરિમા યોજના ટૂલકિટ વિતરણ શિબિર",
    titleHi: "मानव गरिमा योजना टूलकिट वितरण शिविर",
  },
};

export function SpatialBentoDashboard({
  gu,
  lang,
  fy = "2025–26",
  onNavigate,
  onSelectYojna,
}: SpatialBentoDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState(() => new Date().getDate());
  const [weekOffset, setWeekOffset] = useState(() => Math.floor((new Date().getDate() - 1) / 7));

  const displayedSectors = useMemo(() => {
    return selectedCategory === "all"
      ? allSectors
      : allSectors.filter((sector) => sector.category === selectedCategory);
  }, [selectedCategory]);

  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const firstWeekday = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
  const firstVisibleDay = 1 - firstWeekday + weekOffset * 7;
  const maxWeekOffset = Math.floor((daysInMonth - 1 + firstWeekday) / 7);
  const timelineDays = useMemo(() => {
    const daysConfig = [
      { offset: 0 }, { offset: 1 }, { offset: 2 }, { offset: 3 },
      { offset: 4 }, { offset: 5 }, { offset: 6 },
    ];
    return daysConfig.map((d) => {
      const dNum = firstVisibleDay + d.offset;
      const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), dNum);
      return {
        num: date.getDate(),
        date: new Intl.NumberFormat(getLocale(lang), { minimumIntegerDigits: 2 }).format(date.getDate()),
        dayLabel: new Intl.DateTimeFormat(getLocale(lang), { weekday: "short" }).format(date),
        isInMonth: date.getMonth() === calendarMonth.getMonth(),
        hasDeadline: Boolean(deadlineEvents[date.getDate()] && date.getMonth() === calendarMonth.getMonth()),
      };
    });
  }, [firstVisibleDay, calendarMonth, lang]);

  const monthLabel = new Intl.DateTimeFormat(getLocale(lang), { month: "long", year: "numeric" }).format(calendarMonth);

  // FIX M-06: Stale closure bug — compute the new firstVisibleDay correctly
  // before using it, instead of reading the stale captured value.
  const handlePrevWeek = () => {
    if (weekOffset > 0) {
      const newOffset = weekOffset - 1;
      const newFirstVisible = 1 - firstWeekday + newOffset * 7;
      setWeekOffset(newOffset);
      setActiveDay(Math.max(1, newFirstVisible));
    }
  };

  const handleNextWeek = () => {
    if (weekOffset < maxWeekOffset) {
      const newOffset = weekOffset + 1;
      const newFirstVisible = 1 - firstWeekday + newOffset * 7;
      setWeekOffset(newOffset);
      setActiveDay(Math.max(1, newFirstVisible));
    }
  };

  const handleCalendarMonthChange = (offset: number) => {
    setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
    setWeekOffset(0);
    setActiveDay(1);
  };

  const activeDayEvent = deadlineEvents[activeDay];

  return (
    <div className="spatial-dashboard-wrapper">
      <div className="spatial-bento-grid">
        {/* =========================================================================
            1) TOP-LEFT CARD (5 COLS): "Yojna Category Impact" (Vertical Pill Tracks)
           ========================================================================= */}
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="spatial-glass-card spatial-col-5"
        >
          <div className="spatial-card-head">
            <div>
              <h2 className="spatial-card-title">
                {gu ? "ક્ષેત્રવાર યોજના પ્રવૃત્તિ" : lang === "hi" ? "क्षेत्रवार योजना गतिविधि" : "Sector Activity"}
              </h2>
              <p className="spatial-card-sub">
                {gu ? "ગુજરાતના મુખ્ય ક્ષેત્રોમાં કલ્યાણકારી પહોંચ" : lang === "hi" ? "गुजरात के प्रमुख क्षेत्रों में कल्याणकारी पहुँच" : "Welfare coverage across key Gujarat sectors"}
              </p>
            </div>
            <div className="spatial-select-pill-wrap">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSector(null);
                }}
                className="spatial-glass-select"
                aria-label={gu ? "શ્રેણી પ્રમાણે ફિલ્ટર" : lang === "hi" ? "श्रेणी अनुसार फ़िल्टर" : "Category Filter"}
              >
                <option value="all">{gu ? "તમામ ક્ષેત્રો ▾" : lang === "hi" ? "सभी श्रेणियाँ ▾" : "All Categories ▾"}</option>
                <option value="agriculture">{gu ? "કૃષિ & પશુપાલન" : lang === "hi" ? "कृषि और पशुपालन" : "Agriculture"}</option>
                <option value="education">{gu ? "શિક્ષણ & કૌશલ્ય" : lang === "hi" ? "शिक्षा और कौशल" : "Education"}</option>
                <option value="women">{gu ? "મહિલા & બાળકલ્યાણ" : lang === "hi" ? "महिला एवं बाल कल्याण" : "Women & Child"}</option>
                <option value="health">{gu ? "આરોગ્ય & તબીબી" : lang === "hi" ? "स्वास्थ्य और चिकित्सा" : "Health"}</option>
                <option value="msme">{gu ? "ઉદ્યોગ & MSME" : lang === "hi" ? "उद्योग एवं MSME" : "MSME"}</option>
                <option value="housing">{gu ? "આવાસ નિર્માણ" : lang === "hi" ? "आवास निर्माण" : "Housing"}</option>
                <option value="youth">{gu ? "યુવા & રોજગાર" : lang === "hi" ? "युवा एवं रोजगार" : "Youth"}</option>
              </select>
            </div>
          </div>

          {/* 7 Vertical Capsule-shaped Tracks with Spring Fill Animation */}
          <div className="spatial-capsule-chart-track-row" role="region" aria-label="Sector Activity Chart">
            {displayedSectors.map((s) => {
              const isSelected = selectedSector === s.id;
              return (
                <div
                  key={s.id}
                  className="spatial-capsule-col"
                  onClick={() => setSelectedSector(isSelected ? null : s.id)}
                  style={{ cursor: "pointer" }}
                  title={`${gu ? s.nameGu : lang === "hi" ? s.nameHi : s.name}: ${s.pct}%`}
                >
                  <div className={`spatial-capsule-track ${isSelected ? "active-track-border" : ""}`}>
                    <motion.div
                      className={`spatial-capsule-fill ${isSelected ? "highlight-fill" : ""}`}
                      initial={{ height: "0%" }}
                      animate={{ height: `${s.pct}%` }}
                      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span className="spatial-capsule-pct">{s.pct}%</span>
                    </motion.div>
                  </div>
                  <span className="spatial-capsule-label">
                    {gu ? s.nameGu : lang === "hi" ? s.nameHi : s.name}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.article>

        {/* =========================================================================
            2) TOP-CENTER STACK (3 COLS): 3 Stacked Mini-Stat Glass Cards
           ========================================================================= */}
        <div className="spatial-col-3 spatial-stack-col">
          {/* Card 1: 285+ Active Gujarat Yojnas */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="spatial-mini-stat-card"
            onClick={() => onNavigate("schemes")}
            style={{ cursor: "pointer" }}
          >
            <div className="spatial-stat-icon-box">
              <Layers size={22} className="text-white/90" />
            </div>
            <div>
              <strong className="spatial-stat-value">285+</strong>
              <small className="spatial-stat-label">
                {gu ? "ગુજરાત સક્રિય યોજનાઓ" : lang === "hi" ? "सक्रिय गुजरात योजनाएँ" : "Active Gujarat Yojnas"}
              </small>
            </div>
          </motion.div>

          {/* Card 2: 33 / 33 Districts Covered */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="spatial-mini-stat-card"
            onClick={() => onNavigate("map")}
            style={{ cursor: "pointer" }}
          >
            <div className="spatial-stat-icon-box">
              <Building2 size={22} className="text-white/90" />
            </div>
            <div>
              <strong className="spatial-stat-value">33 / 33</strong>
              <small className="spatial-stat-label">
                {gu ? "સંપૂર્ણ જિલ્લા કવરેજ" : lang === "hi" ? "संपूर्ण जिला कवरेज" : "Districts Covered"}
              </small>
            </div>
          </motion.div>

          {/* Card 3: 100% Free Direct Citizen Portal */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="spatial-mini-stat-card"
            onClick={() => onNavigate("wizard")}
            style={{ cursor: "pointer" }}
          >
            <div className="spatial-stat-icon-box">
              <ShieldCheck size={22} className="text-white/90" />
            </div>
            <div>
              <strong className="spatial-stat-value">100% Free</strong>
              <small className="spatial-stat-label">
                {gu ? "પ્રત્યક્ષ નાગરિક પોર્ટલ" : lang === "hi" ? "प्रत्यक्ष नागरिक पोर्टल" : "Direct Citizen Portal"}
              </small>
            </div>
          </motion.div>
        </div>

        {/* =========================================================================
            3) TOP-RIGHT CARD (4 COLS): "Beneficiary Overview" (Donut Ring Chart)
           ========================================================================= */}
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="spatial-glass-card spatial-col-4"
        >
          <div className="spatial-card-head">
            <div>
              <h2 className="spatial-card-title">
                {gu ? "યોજના વિહંગાવલોકન" : lang === "hi" ? "योजना विहंगावलोकन" : "Scheme Overview"}
              </h2>
              <p className="spatial-card-sub">
                {gu ? "રાજ્ય અને કેન્દ્ર સરકારી યોજનાઓ" : lang === "hi" ? "राज्य और केंद्र सरकारी योजनाएँ" : "State & Central Schemes"}
              </p>
            </div>
            <span className="spatial-year-chip">FY {fy} ▾</span>
          </div>

          <div className="spatial-donut-overview-wrap">
            <div className="spatial-ring-container">
              <svg viewBox="0 0 100 100" className="spatial-ring-svg">
                <circle cx="50" cy="50" r="38" strokeWidth="9" className="spatial-ring-track" />
                {/* Sky Cyan track: Central Schemes */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="38"
                  strokeWidth="9"
                  fill="none"
                  stroke="#38BDF8"
                  strokeDasharray="238.76"
                  strokeDashoffset="71.6"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: "238.76" }}
                  animate={{ strokeDashoffset: "71.6" }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* Warm Amber track: State Schemes */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="38"
                  strokeWidth="9"
                  fill="none"
                  stroke="#FACC15"
                  strokeDasharray="238.76"
                  strokeDashoffset="119.38"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: "238.76" }}
                  animate={{ strokeDashoffset: "119.38" }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                />
              </svg>
              <div className="spatial-ring-center-badge">
                <span className="spatial-ring-bold">82%</span>
                <span className="spatial-ring-sub">
                  {gu ? "મેચ રેટ" : lang === "hi" ? "मैच रेट" : "Match Rate"}
                </span>
              </div>
            </div>

            <div className="spatial-ring-metrics-list">
              <div className="spatial-metric-row">
                <div className="spatial-dot-label">
                  <span className="spatial-legend-dot dot-amber" />
                  <span>{gu ? "રાજ્ય યોજનાઓ" : lang === "hi" ? "राज्य योजनाएँ" : "State Schemes"}</span>
                </div>
                <div className="spatial-metric-values">
                  <strong>190</strong>
                  <span className="spatial-delta-pill">+12.4%</span>
                </div>
              </div>

              <div className="spatial-metric-row">
                <div className="spatial-dot-label">
                  <span className="spatial-legend-dot dot-cyan" />
                  <span>{gu ? "કેન્દ્ર યોજનાઓ" : lang === "hi" ? "केंद्र योजनाएँ" : "Central Schemes"}</span>
                </div>
                <div className="spatial-metric-values">
                  <strong>95</strong>
                  <span className="spatial-delta-pill">+5.8%</span>
                </div>
              </div>

              <div className="spatial-metric-row">
                <div className="spatial-dot-label">
                  <span className="spatial-legend-dot dot-emerald" />
                  <span>{gu ? "ઓનલાઇન અરજી" : lang === "hi" ? "ऑनलाइन आवेदन" : "Instant Online"}</span>
                </div>
                <div className="spatial-metric-values">
                  <strong>240</strong>
                  <span className="spatial-delta-pill">+18.2%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.article>

        {/* =========================================================================
            4) BOTTOM-LEFT SECTION (7 COLS): "Featured & Eligible Yojnas" (Interactive Row List)
           ========================================================================= */}
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="spatial-glass-card spatial-col-7"
        >
          <div className="spatial-card-head">
            <div>
              <h2 className="spatial-card-title">
                {gu ? "શ્રેષ્ઠ પાત્ર યોજનાઓ" : lang === "hi" ? "शीर्ष सुपात्र योजनाएँ" : "Top Matching Yojnas"}
              </h2>
              <p className="spatial-card-sub">
                {gu ? "તમારી પ્રોફાઇલ અને જરૂરિયાત મુજબ ચકાસાયેલ યોજનાઓ" : lang === "hi" ? "आपकी प्रोफ़ाइल और आवश्यकतानुसार सत्यापित योजनाएँ" : "Verified welfare programs tailored to your profile"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("schemes")}
              className="spatial-link-btn"
              aria-label={gu ? "બધી યોજનાઓ જુઓ" : lang === "hi" ? "सभी योजनाएँ देखें" : "View All Schemes"}
            >
              <span>{gu ? "બધી જુઓ" : lang === "hi" ? "सभी देखें" : "View All"}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* 3 Sleek Horizontal Rows */}
          <div className="spatial-rows-deck" role="list" aria-label="Top Matching Yojnas List">
            {featuredYojnas.map((yojna) => (
              <button
                key={yojna.id}
                type="button"
                className="spatial-yojna-row"
                onClick={() => onSelectYojna ? onSelectYojna(yojna.title) : onNavigate("schemes")}
                aria-label={`${gu ? yojna.titleGu : lang === "hi" ? yojna.titleHi : yojna.title} - ${gu ? yojna.criteriaGu : lang === "hi" ? yojna.criteriaHi : yojna.criteria}`}
              >
                {/* Left: Circular Checkmark Bubble */}
                <div className="spatial-row-left-icon">
                  <div className="spatial-check-bubble">
                    <CheckCircle2 size={18} strokeWidth={2} className="text-[#42C88A]" />
                  </div>
                </div>

                {/* Center-Left: Yojna Title & Criteria */}
                <div className="spatial-row-info">
                  <h3 className="spatial-yojna-name">
                    {gu ? yojna.titleGu : lang === "hi" ? yojna.titleHi : yojna.title}
                  </h3>
                  <span className="spatial-yojna-criteria">
                    {gu ? yojna.criteriaGu : lang === "hi" ? yojna.criteriaHi : yojna.criteria}
                  </span>
                </div>

                {/* Right: Pill status button */}
                <div className="spatial-row-action">
                  <span className={`spatial-pill-btn ${yojna.btnClass}`}>
                    {gu ? yojna.actionLabelGu : lang === "hi" ? yojna.actionLabelHi : yojna.actionLabel}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </motion.article>

        {/* =========================================================================
            5) BOTTOM-RIGHT STACK (5 COLS): "Deadline Timeline" & "Smart Eligibility"
           ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="spatial-col-5 spatial-split-stack"
        >
          {/* Top Half: Timeline Strip */}
          <div className="spatial-timeline-glass-subcard">
            <div className="spatial-card-head" style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Calendar size={15} className="text-white/70" />
                <h3 className="spatial-subcard-title">
                  {monthLabel} · {gu ? `અઠવાડિયું ${weekOffset + 1}` : lang === "hi" ? `सप्ताह ${weekOffset + 1}` : `Week ${weekOffset + 1}`}
                </h3>
              </div>
              <div className="spatial-nav-arrows">
                <button
                  type="button"
                  onClick={() => handleCalendarMonthChange(-1)}
                  className="spatial-circle-arrow"
                  aria-label={gu ? "પાછલો મહિનો" : "Previous month"}
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  type="button"
                  onClick={handlePrevWeek}
                  disabled={weekOffset === 0}
                  className="spatial-circle-arrow"
                  aria-label={gu ? "અગાઉનું અઠવાડિયું" : "Previous Week"}
                  style={{ opacity: weekOffset === 0 ? 0.35 : 1 }}
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  type="button"
                  onClick={handleNextWeek}
                  disabled={weekOffset === maxWeekOffset}
                  className="spatial-circle-arrow"
                  aria-label={gu ? "આગળનું અઠવાડિયું" : "Next Week"}
                  style={{ opacity: weekOffset === maxWeekOffset ? 0.35 : 1 }}
                >
                  <ChevronRight size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleCalendarMonthChange(1)}
                  className="spatial-circle-arrow"
                  aria-label={gu ? "આગળનો મહિનો" : "Next month"}
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            {/* 7 Days Horizontal Strip */}
            <div className="spatial-days-strip" role="group" aria-label="Dates in month">
              {timelineDays.map((d) => {
                const isSelected = activeDay === d.num;
                return (
                  <button
                    key={`${calendarMonth.getFullYear()}-${calendarMonth.getMonth()}-${weekOffset}-${d.dayLabel}`}
                    type="button"
                    disabled={!d.isInMonth}
                    aria-pressed={isSelected}
                    onClick={() => setActiveDay(d.num)}
                    className={`spatial-day-pill ${isSelected ? "selected-day" : ""}`}
                  >
                    <span className="spatial-day-name">{d.dayLabel}</span>
                    <strong className="spatial-day-date">{d.date}</strong>
                    {d.hasDeadline && <span className="timeline-dot-indicator" />}
                  </button>
                );
              })}
            </div>

            {/* Selected Day Event Box */}
            <div className="spatial-day-event-box" role="status" aria-live="polite">
              <Calendar size={15} className="text-[#38BDF8]" aria-hidden="true" />
              <span className="spatial-event-text">
                {activeDayEvent
                  ? gu
                    ? activeDayEvent.titleGu
                    : lang === "hi"
                      ? activeDayEvent.titleHi
                      : activeDayEvent.titleEn
                  : gu
                    ? "સામાન્ય પોર્ટલ કાર્યકાળ · તમામ ઓનલાઇન અરજી સેવાઓ સક્રિય છે"
                    : lang === "hi"
                      ? "सामान्य पोर्टल कार्य दिवस · सभी ऑनलाइन सेवाएँ सक्रिय हैं"
                      : "Portal Active · All online scheme services operational"}
              </span>
            </div>
          </div>

          {/* Bottom Half: Smart Eligibility Quick Action Card */}
          <div className="spatial-action-glass-subcard">
            <div className="spatial-card-head" style={{ marginBottom: "10px" }}>
              <div className="spatial-flex-gap">
                <Sparkles size={16} className="text-white/80" />
                <h3 className="spatial-subcard-title">
                  {gu ? "સ્માર્ટ પાત્રતા સહાયક" : lang === "hi" ? "स्मार्ट पात्रता सहायक" : "Smart Eligibility"}
                </h3>
              </div>
              <span className="spatial-instant-tag">
                {gu ? "૨ મિનિટ ચકાસણી ▾" : lang === "hi" ? "२ मिनट जाँच ▾" : "2 Mins Check ▾"}
              </span>
            </div>

            <div className="spatial-action-body">
              <div className="spatial-action-desc-box">
                <div className="spatial-action-icon">
                  <FileCheck2 size={20} className="text-white" />
                </div>
                <div>
                  <strong className="spatial-action-strong">
                    {gu ? "તમારી યોગ્ય યોજના શોધો" : lang === "hi" ? "अपनी उपयुक्त योजना खोजें" : "Find Your Yojna"}
                  </strong>
                  <p className="spatial-action-p">
                    {gu ? "ઉંમર, આવક અને કેટેગરી મુજબ ત્વરિત મેળવો" : lang === "hi" ? "आयु, आय और श्रेणी अनुसार त्वरित सुझाव" : "Instant matches based on age, category & income"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate("wizard")}
                className="spatial-glowing-frosted-btn"
                aria-label={gu ? "પાત્રતા ચકાસણી શરૂ કરો" : lang === "hi" ? "पात्रता जाँच शुरू करें" : "Start eligibility check"}
              >
                <span>{gu ? "શરૂ કરો →" : lang === "hi" ? "शुरू करें →" : "Start Now →"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
