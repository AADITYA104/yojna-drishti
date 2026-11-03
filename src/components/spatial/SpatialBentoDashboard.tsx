"use client";

import React, { useState, useMemo } from "react";
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
  Database,
  CircleHelp,
} from "lucide-react";
import { motion } from "framer-motion";
import { demoDistricts, demoSchemes } from "@/lib/demo-data";

interface SpatialBentoDashboardProps {
  gu: boolean;
  fy?: string;
  onNavigate: (view: "map" | "schemes" | "wizard" | "saved" | "settings") => void;
  onSelectYojna?: (name: string) => void;
}

const allSectors = [
  { id: "khedut", name: "Khedut", nameGu: "ખેડૂત", pct: 78, category: "agriculture" },
  { id: "shikshan", name: "Shikshan", nameGu: "શિક્ષણ", pct: 64, category: "education" },
  { id: "mahila", name: "Mahila", nameGu: "મહિલા", pct: 85, category: "women" },
  { id: "arogya", name: "Arogya", nameGu: "આરોગ્ય", pct: 52, category: "health" },
  { id: "msme", name: "MSME", nameGu: "ઉદ્યોગ", pct: 90, category: "msme" },
  { id: "awas", name: "Awas", nameGu: "આવાસ", pct: 60, category: "housing" },
  { id: "yuva", name: "Yuva", nameGu: "યુવા", pct: 45, category: "youth" },
];

export function SpatialBentoDashboard({
  gu,
  fy = "2025–26",
  onNavigate,
  onSelectYojna,
}: SpatialBentoDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeDay, setActiveDay] = useState(() => new Date().getDate());
  const [weekOffset, setWeekOffset] = useState(() => Math.floor((new Date().getDate() - 1) / 7));

  // These figures are visual fixtures until a verified sector data source exists.
  const displayedSectors = useMemo(() => {
    return selectedCategory === "all"
      ? allSectors
      : allSectors.filter((sector) => sector.category === selectedCategory);
  }, [selectedCategory]);

  const featuredYojnas = demoSchemes.slice(0, 3).map((scheme) => ({
    id: scheme.id,
    title: scheme.name,
    titleGu: scheme.gu,
    criteria: "Preview catalogue entry · confirm with the department",
    criteriaGu: "નમૂનાની નોંધ · વિભાગ પાસે પુષ્ટિ કરો",
  }));

  // The calendar uses the current local month. No deadlines are shown until
  // verified source data is connected.
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // 5. Interactive Timeline Weeks & Days
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
        date: new Intl.NumberFormat(gu ? "gu-IN" : "en-IN", { minimumIntegerDigits: 2 }).format(date.getDate()),
        dayLabel: new Intl.DateTimeFormat(gu ? "gu-IN" : "en-IN", { weekday: "short" }).format(date),
        isInMonth: date.getMonth() === calendarMonth.getMonth(),
      };
    });
  }, [firstVisibleDay, calendarMonth, gu]);

  const monthLabel = new Intl.DateTimeFormat(gu ? "gu-IN" : "en-IN", { month: "long", year: "numeric" }).format(calendarMonth);

  const handlePrevWeek = () => {
    if (weekOffset > 0) {
      setWeekOffset((prev) => prev - 1);
      setActiveDay(Math.max(1, firstVisibleDay - 7));
    }
  };

  const handleNextWeek = () => {
    if (weekOffset < maxWeekOffset) {
      setWeekOffset((prev) => prev + 1);
      setActiveDay(Math.max(1, firstVisibleDay + 7));
    }
  };

  const handleCalendarMonthChange = (offset: number) => {
    setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
    setWeekOffset(0);
    setActiveDay(1);
  };

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
                {gu ? "ક્ષેત્રવાર યોજના પ્રવૃત્તિ" : "Sector Activity"}
              </h2>
              <p className="spatial-card-sub">
                {gu ? "નમૂનાનું ચાર્ટ · સરકારી આંકડા નથી" : "Sample chart · not government data"}
              </p>
            </div>
            <div className="spatial-select-pill-wrap">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="spatial-glass-select"
                aria-label={gu ? "શ્રેણી પ્રમાણે ફિલ્ટર" : "Category Filter"}
              >
                <option value="all">{gu ? "તમામ ક્ષેત્રો ▾" : "All Categories ▾"}</option>
                <option value="agriculture">{gu ? "કૃષિ & પશુપાલન" : "Agriculture"}</option>
                <option value="education">{gu ? "શિક્ષણ & કૌશલ્ય" : "Education"}</option>
                <option value="women">{gu ? "મહિલા & બાળકલ્યાણ" : "Women & Child"}</option>
                <option value="health">{gu ? "આરોગ્ય & તબીબી" : "Health"}</option>
                <option value="msme">{gu ? "ઉદ્યોગ & MSME" : "MSME"}</option>
                <option value="housing">{gu ? "આવાસ નિર્માણ" : "Housing"}</option>
                <option value="youth">{gu ? "યુવા & કૌશલ્ય" : "Youth"}</option>
              </select>
            </div>
          </div>

          {/* 7 Vertical Capsule Tracks with reactive highlight/filter */}
          <div className="spatial-capsule-chart-track-row" role="region" aria-label="Sector Activity Chart">
            {displayedSectors.map((s, idx) => (
              <div
                key={s.name}
                className="spatial-capsule-col"
              >
                {/* Outer Track Capsule */}
                <div
                  className="spatial-capsule-track"
                >
                  {/* Animated Inner Fill */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${s.pct}%` }}
                    transition={{
                      duration: 1.1,
                      delay: 0.05 + idx * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="spatial-capsule-fill"
                  >
                    <span className="spatial-capsule-pct">{s.pct}%</span>
                  </motion.div>
                </div>
                <span className="spatial-capsule-label">
                  {gu ? s.nameGu : s.name}
                </span>
              </div>
            ))}
          </div>
        </motion.article>

        {/* =========================================================================
            2) TOP-CENTER STACK (3 COLS): 3 Stacked Mini-Stat Glass Cards (Monochrome Clean Glass)
           ========================================================================= */}
        <div className="spatial-col-3 spatial-stack-col">
          {/* Synthetic fixture count, labeled clearly as a preview. */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="spatial-mini-stat-card"
          >
            <div className="spatial-stat-icon-box">
              <Layers size={22} className="text-white/90" />
            </div>
            <div>
              <strong className="spatial-stat-value">DEMO</strong>
              <small className="spatial-stat-label">
                {gu ? "નમૂનાની યોજના સૂચિ" : "Sample scheme catalogue"}
              </small>
            </div>
          </motion.div>

          {/* Directory size, without claiming scheme or service coverage. */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="spatial-mini-stat-card"
          >
            <div className="spatial-stat-icon-box">
              <Building2 size={22} className="text-white/90" />
            </div>
            <div>
              <strong className="spatial-stat-value">{demoDistricts.length}</strong>
              <small className="spatial-stat-label">
                {gu ? "જિલ્લા ડિરેક્ટરી રેકોર્ડ" : "District directory records"}
              </small>
            </div>
          </motion.div>

          {/* The eligibility experience is a preview, not a connected service. */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="spatial-mini-stat-card"
          >
            <div className="spatial-stat-icon-box">
              <ShieldCheck size={22} className="text-white/90" />
            </div>
            <div>
              <strong className="spatial-stat-value">PREVIEW</strong>
              <small className="spatial-stat-label">
                {gu ? "પાત્રતા ચકાસણીનો નમૂનો" : "Eligibility flow sample"}
              </small>
            </div>
          </motion.div>
        </div>

      {/* =========================================================================
          3) TOP-RIGHT CARD (4 COLS): honest data connection status
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
                {gu ? "ડેટાની સ્થિતિ" : "Data status"}
              </h2>
              <p className="spatial-card-sub">{gu ? "સત્તાવાર ડેટા કનેક્શન" : "Official data connections"}</p>
            </div>
            <span className="spatial-year-chip">FY {fy}</span>
          </div>

          <div className="spatial-source-status-list">
            <div className="spatial-source-status-row">
              <Database size={17} aria-hidden="true" />
              <span>{gu ? "યોજનાની સત્તાવાર ચકાસણી" : "Official scheme verification"}</span>
              <strong>{gu ? "બાકી" : "Pending"}</strong>
            </div>
            <div className="spatial-source-status-row">
              <Building2 size={17} aria-hidden="true" />
              <span>{gu ? "લાભાર્થીના આંકડા" : "Beneficiary totals"}</span>
              <strong>{gu ? "જોડાયેલ નથી" : "Not connected"}</strong>
            </div>
            <div className="spatial-source-status-row">
              <CircleHelp size={17} aria-hidden="true" />
              <span>{gu ? "સહાયની રકમ / વિતરણ" : "Funding and disbursement"}</span>
              <strong>{gu ? "ઉપલબ્ધ નથી" : "Unavailable"}</strong>
            </div>
          </div>
        </motion.article>

        {/* =========================================================================
            4) BOTTOM-LEFT SECTION (7 COLS): "Featured & Eligible Yojnas" (Accessible Button List)
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
              {gu ? "યોજનાના નમૂના કાર્ડ" : "Sample scheme cards"}
              </h2>
              <p className="spatial-card-sub">
              {gu ? "ચકાસાયેલ પાત્રતાનો દાવો નથી" : "No verified eligibility claim"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("schemes")}
              className="spatial-link-btn"
              aria-label={gu ? "બધી યોજનાઓ જુઓ" : "View All Schemes"}
            >
              <span>{gu ? "બધી જુઓ" : "View All"}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* 3 Sleek Accessible Horizontal Rows */}
          <div className="spatial-rows-deck" role="list" aria-label="Featured Yojna List">
            {featuredYojnas.map((yojna) => (
              <button
                key={yojna.id}
                type="button"
                className="spatial-yojna-row"
                onClick={() => onSelectYojna ? onSelectYojna(yojna.title) : onNavigate("schemes")}
                aria-label={`${gu ? yojna.titleGu : yojna.title} - ${gu ? yojna.criteriaGu : yojna.criteria}`}
              >
                {/* Left: Circular Checkmark / Progress indicator */}
                <div className="spatial-row-left-icon">
                  <div className="spatial-check-bubble">
                  <CheckCircle2 size={18} strokeWidth={1.8} className="text-white/85" />
                  </div>
                </div>

                {/* Center-Left: Yojna Title */}
                <div className="spatial-row-info">
                  <h3 className="spatial-yojna-name">
                    {gu ? yojna.titleGu : yojna.title}
                  </h3>
                  <span className="spatial-yojna-criteria">
                    {gu ? yojna.criteriaGu : yojna.criteria}
                  </span>
                </div>

              {/* The badge is informational; the row remains one valid button. */}
                <div className="spatial-row-action">
                <span className="spatial-pill-btn btn-demo">
                  {gu ? "નમૂનો" : "Demo"}
                </span>
                </div>
              </button>
            ))}
          </div>
        </motion.article>

        {/* =========================================================================
            5) BOTTOM-RIGHT STACK (5 COLS): "Deadline Timeline" & "AI Eligibility Quick-Action"
           ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="spatial-col-5 spatial-split-stack"
        >
          {/* Top Half: Timeline Strip with functional prev/next & dynamic day details */}
          <div className="spatial-timeline-glass-subcard">
            <div className="spatial-card-head" style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Calendar size={15} className="text-white/70" />
                <h3 className="spatial-subcard-title">
                  {monthLabel} · {gu ? `અઠવાડિયું ${weekOffset + 1}` : `Week ${weekOffset + 1}`}
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
            <div className="spatial-days-strip" role="group" aria-label={gu ? "મહિનાની તારીખો" : "Dates in month"}>
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
                  </button>
                );
              })}
            </div>

            <div className="spatial-day-event-box" role="status" aria-live="polite">
              <CircleHelp size={15} aria-hidden="true" />
              <span className="spatial-event-text">
                {gu ? "આ તારીખ માટે ચકાસેલી યોજના-સમયમર્યાદા ઉપલબ્ધ નથી." : "No verified scheme deadlines are available for this date."}
              </span>
            </div>
          </div>

          {/* Bottom Half: Smart Eligibility Quick Action Card */}
          <div className="spatial-action-glass-subcard">
            <div className="spatial-card-head" style={{ marginBottom: "10px" }}>
              <div className="spatial-flex-gap">
                <Sparkles size={16} className="text-white/80" />
                <h3 className="spatial-subcard-title">
                  {gu ? "સ્માર્ટ પાત્રતા સહાયક" : "Smart Eligibility"}
                </h3>
              </div>
              <span className="spatial-instant-tag">
                    {gu ? "નમૂનાની શોધ ▾" : "Preview search ▾"}
              </span>
            </div>

            <div className="spatial-action-body">
              <div className="spatial-action-desc-box">
                <div className="spatial-action-icon">
                  <FileCheck2 size={20} className="text-white" />
                </div>
                <div>
                  <strong className="spatial-action-strong">
                    {gu ? "નમૂનાની પાત્રતા શોધ" : "Eligibility preview"}
                  </strong>
                  <p className="spatial-action-p">
                    {gu ? "સૂચિમાં સંભવિત મેળ જુઓ" : "Browse possible catalogue matches"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate("wizard")}
                className="spatial-glowing-frosted-btn"
                aria-label={gu ? "પાત્રતા પૂર્વદર્શન શરૂ કરો" : "Start eligibility preview"}
              >
                <span>{gu ? "શરૂ કરો →" : "Start Now →"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
