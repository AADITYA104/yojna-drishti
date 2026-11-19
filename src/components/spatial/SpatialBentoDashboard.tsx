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
    criteria: "Illustrative example · check official rules",
    criteriaGu: "નમૂનો · સત્તાવાર પાત્રતા તપાસો",
    criteriaHi: "उदाहरण · आधिकारिक पात्रता जाँचें",
    status: "apply",
    actionLabel: "View sample",
    actionLabelGu: "નમૂનો જુઓ",
    actionLabelHi: "नमूना देखें",
    btnClass: "btn-apply",
  },
  {
    id: "vahli-dikri",
    title: "Vahli Dikri Yojna",
    titleGu: "વ્હાલી દીકરી યોજના",
    titleHi: "व्हाली दीकरी योजना",
    criteria: "Illustrative catalogue entry",
    criteriaGu: "યોજનાનો નમૂનો",
    criteriaHi: "योजना का नमूना",
    status: "verified",
    actionLabel: "View sample",
    actionLabelGu: "નમૂનો જુઓ",
    actionLabelHi: "नमूना देखें",
    btnClass: "btn-verified",
  },
  {
    id: "namo-lakshmi",
    title: "Namo Lakshmi & Saraswati Yojna",
    titleGu: "નમો લક્ષ્મી & સરસ્વતી સાધના યોજના",
    titleHi: "नमो लक्ष्मी & सरस्वती साधना योजना",
    criteria: "Illustrative example · check official rules",
    criteriaGu: "નમૂનો · સત્તાવાર પાત્રતા તપાસો",
    criteriaHi: "उदाहरण · आधिकारिक पात्रता जाँचें",
    status: "apply",
    actionLabel: "View sample",
    actionLabelGu: "નમૂનો જુઓ",
    actionLabelHi: "नमूना देखें",
    btnClass: "btn-apply",
  },
];

// No current official deadline feed is connected, so the calendar stays unmarked.
const deadlineEvents: Record<number, { titleEn: string; titleGu: string; titleHi: string }> = {};

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
                {gu ? "ક્ષેત્રવાર સૂચક આંકડા · સત્તાવાર કવરેજ નથી" : lang === "hi" ? "क्षेत्रवार उदाहरण · आधिकारिक कवरेज नहीं" : "Illustrative sector figures · not official coverage"}
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
          {/* Count only the scheme entries shipped with this preview. */}
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
              <strong className="spatial-stat-value">{demoSchemes.length}</strong>
              <small className="spatial-stat-label">
                {gu ? "કેટલોગમાં યોજનાના દાખલા" : lang === "hi" ? "सूची में योजना उदाहरण" : "Scheme examples in catalogue"}
              </small>
            </div>
          </motion.div>

          {/* Administrative boundary availability is not scheme coverage. */}
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
              <strong className="spatial-stat-value">{demoDistricts.length}</strong>
              <small className="spatial-stat-label">
                {gu ? "નકશામાં જિલ્લા સીમાઓ" : lang === "hi" ? "नक्शे में जिला सीमाएँ" : "District boundaries mapped"}
              </small>
            </div>
          </motion.div>

          {/* Boundary-code matches describe geography, not scheme reach. */}
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
                  <strong className="spatial-stat-value">18,110 / 18,818</strong>
              <small className="spatial-stat-label">
                {gu ? "ચોક્કસ ગામ સીમા-કોડ મેળ" : lang === "hi" ? "सटीक गाँव सीमा-कोड मिलान" : "Exact village boundary-code matches"}
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
                {gu ? "આંકડાના સ્ત્રોત અને અર્થ" : lang === "hi" ? "डेटा स्रोत और अर्थ" : "Data sources and meaning"}
              </h2>
              <p className="spatial-card-sub">
                {gu ? "ભૂગોળ અને યોજના ડેટા અલગ રાખેલા છે" : lang === "hi" ? "भूगोल और योजना डेटा अलग हैं" : "Geography and scheme data are separate"}
              </p>
            </div>
            <span className="spatial-year-chip">FY {fy} ▾</span>
          </div>

          <div className="spatial-accurate-status-list">
            <div className="spatial-accurate-status-item">
              <span className="status-dot status-dot--blue" />
              <div><strong>{demoSchemes.length} {gu ? "યોજના દાખલા" : lang === "hi" ? "योजना उदाहरण" : "scheme examples"}</strong><small>{gu ? "પૂર્વદર્શન કેટલોગ · સત્તાવાર પૂર્ણ સૂચિ નથી" : lang === "hi" ? "पूर्वावलोकन सूची · आधिकारिक पूर्ण सूची नहीं" : "Preview catalogue · not the complete official directory"}</small></div>
            </div>
            <div className="spatial-accurate-status-item">
              <span className="status-dot status-dot--teal" />
              <div><strong>{demoDistricts.length} {gu ? "જિલ્લા સીમાઓ" : lang === "hi" ? "जिला सीमाएँ" : "district boundaries"}</strong><small>{gu ? "સરકારી ભૌગોલિક સીમા ડેટા" : lang === "hi" ? "सरकारी भौगोलिक सीमा डेटा" : "Government geographic boundary data"}</small></div>
            </div>
            <div className="spatial-accurate-status-item">
              <span className="status-dot status-dot--amber" />
              <div><strong>{gu ? "લાભાર્થી/DBT કુલ ઉપલબ્ધ નથી" : lang === "hi" ? "लाभार्थी/DBT कुल उपलब्ध नहीं" : "Beneficiary and DBT totals unavailable"}</strong><small>{gu ? "કૃત્રિમ દાખલાઓ વાસ્તવિક લાભનો પુરાવો નથી" : lang === "hi" ? "कृत्रिम प्रविष्टियाँ वास्तविक लाभ का प्रमाण नहीं हैं" : "Synthetic rows do not prove real benefits"}</small></div>
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
                {gu ? "યોજનાના ઉદાહરણો" : lang === "hi" ? "योजना के उदाहरण" : "Illustrative scheme examples"}
              </h2>
              <p className="spatial-card-sub">
                {gu ? "આ દાખલા નમૂનાના છે; પાત્રતા માટે સત્તાવાર નિયમ તપાસો" : lang === "hi" ? "ये नमूने हैं; पात्रता के लिए आधिकारिक नियम जाँचें" : "Sample entries only; check official rules for eligibility"}
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
                    <FileCheck2 size={18} strokeWidth={2} className="text-[#32764c]" />
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
                    ? "નમૂના કેલેન્ડર · સત્તાવાર અંતિમ તારીખો જોડાયેલી નથી"
                    : lang === "hi"
                      ? "नमूना कैलेंडर · आधिकारिक अंतिम तिथियाँ जुड़ी नहीं हैं"
                      : "Calendar preview · official application deadlines are not connected"}
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
