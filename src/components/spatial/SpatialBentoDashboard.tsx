"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ChevronDown,
  Building2,
  FileCheck2,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Layers,
  Award,
  Info,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

interface SpatialBentoDashboardProps {
  gu: boolean;
  fy?: string;
  onNavigate: (view: any) => void;
  onSelectYojna?: (name: string) => void;
}

export function SpatialBentoDashboard({
  gu,
  fy = "2025–26",
  onNavigate,
  onSelectYojna,
}: SpatialBentoDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeDay, setActiveDay] = useState(3); // Day 3
  const [selectedFy, setSelectedFy] = useState(fy);
  const [weekOffset, setWeekOffset] = useState(0);

  // 1. Sector Activity Vertical Tracks (Categorized for real filtering)
  const allSectors = [
    { id: "khedut", name: "Khedut", nameGu: "ખેડૂત", pct: 78, category: "agriculture" },
    { id: "shikshan", name: "Shikshan", nameGu: "શિક્ષણ", pct: 64, category: "education" },
    { id: "mahila", name: "Mahila", nameGu: "મહિલા", pct: 85, category: "women" },
    { id: "arogya", name: "Arogya", nameGu: "આરોગ્ય", pct: 52, category: "health" },
    { id: "msme", name: "MSME", nameGu: "ઉદ્યોગ", pct: 90, category: "msme" },
    { id: "awas", name: "Awas", nameGu: "આવાસ", pct: 60, category: "housing" },
    { id: "yuva", name: "Yuva", nameGu: "યુવા", pct: 45, category: "youth" },
  ];

  // Truly filter or highlight sectors based on category dropdown
  const displayedSectors = useMemo(() => {
    return allSectors.map((s) => ({
      ...s,
      isHighlighted: selectedCategory === "all" || s.category === selectedCategory,
      isDimmed: selectedCategory !== "all" && s.category !== selectedCategory,
    }));
  }, [selectedCategory]);

  // 4. Featured Yojnas with real IDs from demo data
  const featuredYojnas = [
    {
      id: "YD-AGRI-01",
      title: "Mukhyamantri Kisan Sahay Yojna",
      titleGu: "મુખ્યમંત્રી કિસાન સહાય યોજના",
      criteria: "4/4 Criteria Matched",
      criteriaGu: "૪/૪ પાત્રતા માપદંડ પૂર્ણ",
      status: "apply" as const,
      statusLabel: "Apply Now",
      statusLabelGu: "અરજી કરો",
      pct: 100,
    },
    {
      id: "YD-WCD-01",
      title: "Vahli Dikri Yojna",
      titleGu: "વ્હાલી દીકરી યોજના",
      criteria: "100% Verified Citizen",
      criteriaGu: "૧૦૦% ચકાસાયેલ નાગરિક",
      status: "verified" as const,
      statusLabel: "Verified",
      statusLabelGu: "ચકાસાયેલ",
      pct: 100,
    },
    {
      id: "YD-EDU-01",
      title: "Namo Lakshmi & Saraswati Yojna",
      titleGu: "નમો લક્ષ્મી & સરસ્વતી સાધના યોજના",
      criteria: "4/4 Criteria Matched",
      criteriaGu: "૪/૪ પાત્રતા માપદંડ પૂર્ણ",
      status: "apply" as const,
      statusLabel: "Apply Now",
      statusLabelGu: "અરજી કરો",
      pct: 88,
    },
  ];

  // 5. Interactive Timeline Weeks & Days
  const baseDayNumber = 1 + weekOffset * 7;
  const timelineDays = useMemo(() => {
    const daysConfig = [
      { day: "Sun", dayGu: "રવિ", offset: 0 },
      { day: "Mon", dayGu: "સોમ", offset: 1 },
      { day: "Tue", dayGu: "મંગળ", offset: 2 },
      { day: "Wed", dayGu: "બુધ", offset: 3 },
      { day: "Thu", dayGu: "ગુરુ", offset: 4 },
      { day: "Fri", dayGu: "શુક્ર", offset: 5 },
      { day: "Sat", dayGu: "શનિ", offset: 6 },
    ];
    return daysConfig.map((d) => {
      const dNum = baseDayNumber + d.offset;
      return {
        ...d,
        num: dNum,
        date: String(dNum).padStart(2, "0"),
      };
    });
  }, [baseDayNumber]);

  // Deadlines associated with active day
  const dayDeadlines: Record<number, { title: string; titleGu: string; type: string }> = {
    1: { title: "Kisan Sahay Registration Portal Open", titleGu: "કિસાન સહાય યોજના પોર્ટલ નોંધણી ખુલી", type: "State" },
    2: { title: "Vahli Dikri Verification Camp - Taluka Level", titleGu: "વ્હાલી દીકરી તાલુકા સ્તર ચકાસણી કેમ્પ", type: "District" },
    3: { title: "Namo Lakshmi Scheme DBT Window Disbursal", titleGu: "નમો લક્ષ્મી યોજના DBT સહાય વિતરણ વિન્ડો", type: "DBT" },
    4: { title: "Digital Gujarat Scholarship Final Review", titleGu: "ડિજિટલ ગુજરાત સ્કોલરશિપ આખરી ચકાસણી", type: "Scholarship" },
    5: { title: "PM Vishwakarma Tool-kit Distribution", titleGu: "પીએમ વિશ્વકર્મા ટૂલ-કિટ વિતરણ શિબિર", type: "Central" },
    6: { title: "Ayushman Bharat District Empanelment Drive", titleGu: "આયુષ્માન કાર્ડ જિલ્લા સ્તરીય નોંધણી ડ્રાઈવ", type: "Health" },
    7: { title: "Ghogha Model Village Scheme Saturation Audit", titleGu: "ઘોઘા આદર્શ ગામ યોજના સેચ્યુરેશન ઓડિટ", type: "Village" },
  };

  const activeDeadline = dayDeadlines[activeDay] || dayDeadlines[3];

  const handlePrevWeek = () => {
    if (weekOffset > 0) {
      setWeekOffset((prev) => prev - 1);
      setActiveDay(baseDayNumber - 7 + 2);
    }
  };

  const handleNextWeek = () => {
    if (weekOffset < 3) {
      setWeekOffset((prev) => prev + 1);
      setActiveDay(baseDayNumber + 7 + 2);
    }
  };

  return (
    <div className="spatial-dashboard-wrapper">
      {/* =========================================================================
          DEMO & DATA DISCLOSURE BANNER (Official Transparent Public Compliance)
         ========================================================================= */}
      <div className="spatial-demo-disclaimer" role="note" aria-label="Demo Data Disclaimer">
        <div className="spatial-demo-icon">
          <Info size={16} />
        </div>
        <div className="spatial-demo-text">
          <strong>
            {gu ? "ડેમો પૂર્વદર્શન · સિન્થેટિક આર્કિટેક્ચર" : "DEMO EVALUATION · SYNTHETIC ACCURATE ARCHITECTURE"}
          </strong>
          <span>
            {gu
              ? "તમામ વહીવટી સ્તરો (ગુજરાતના ૩૩ જિલ્લાઓ, ૨૫૨ તાલુકાઓ, અને ૪૮ ઘોઘા મોડેલ ગામો) સત્તાવાર LGD માળખા પર આધારિત છે. તમામ આંકડા UI ચકાસણી માટે કાલ્પનિક છે."
              : "Administrative hierarchy follows official LGD directory (33 Gujarat Districts, 252 Talukas, and 48 Ghogha model villages). Aggregate statistics are synthetic fixtures until official departmental APIs are connected."}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("map")}
          className="spatial-demo-action"
          aria-label={gu ? "જિલ્લા નકશો જુઓ" : "View Districts"}
        >
          <span>{gu ? "૩૩ જિલ્લા નકશો" : "33 Districts Map"}</span>
          <ArrowRight size={13} />
        </button>
      </div>

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
                {gu ? "યોજના કવરેજ & ઉપયોગ ટકાવારી" : "Welfare saturation by domain"}
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
                className={`spatial-capsule-col ${s.isDimmed ? "opacity-30" : "opacity-100"}`}
                style={{ transition: "opacity 0.25s ease" }}
              >
                {/* Outer Track Capsule */}
                <div
                  className={`spatial-capsule-track ${s.isHighlighted && selectedCategory !== "all" ? "active-track-border" : ""}`}
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
                    className={`spatial-capsule-fill ${s.isHighlighted && selectedCategory !== "all" ? "highlight-fill" : ""}`}
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
          {/* Card 1: 285+ Active Gujarat Yojnas */}
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
              <strong className="spatial-stat-value">285+</strong>
              <small className="spatial-stat-label">
                {gu ? "સક્રિય ગુજરાત યોજનાઓ" : "Active Gujarat Yojnas"}
              </small>
            </div>
          </motion.div>

          {/* Card 2: 33 / 33 Districts Covered (Consistent with Gujarat official count) */}
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
              <strong className="spatial-stat-value">33 / 33</strong>
              <small className="spatial-stat-label">
                {gu ? "જિલ્લાઓ સંપૂર્ણ આવરી લીધેલ" : "Districts Covered"}
              </small>
            </div>
          </motion.div>

          {/* Card 3: 100% Free Direct Citizen Portal */}
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
              <strong className="spatial-stat-value">100% Free</strong>
              <small className="spatial-stat-label">
                {gu ? "સીધું નાગરિક પોર્ટલ (DBT)" : "Direct Citizen Portal"}
              </small>
            </div>
          </motion.div>
        </div>

        {/* =========================================================================
            3) TOP-RIGHT CARD (4 COLS): "Beneficiary Overview" (Multi-Segment Donut Ring)
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
                {gu ? "યોજના વિહંગાવલોકન" : "Scheme Overview"}
              </h2>
              <p className="spatial-card-sub">{gu ? "વાર્ષિક વિતરણ દર" : "Annual Allocation Rate"}</p>
            </div>
            {/* Financial Year Selector consistent with Shell */}
            <select
              value={selectedFy}
              onChange={(e) => setSelectedFy(e.target.value)}
              className="spatial-glass-select"
              aria-label={gu ? "નાણાકીય વર્ષ" : "Financial Year"}
            >
              <option value="2025–26">2025–26</option>
              <option value="2024–25">2024–25</option>
            </select>
          </div>

          <div className="spatial-donut-overview-wrap">
            {/* Left SVG Donut Ring Chart */}
            <div className="spatial-ring-container">
              <svg viewBox="0 0 120 120" className="spatial-ring-svg" aria-label="Beneficiary Donut Chart">
                {/* Background Track */}
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  className="spatial-ring-track"
                  strokeWidth="11"
                />
                {/* Primary Amber Segment (State Schemes) */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r="46"
                  stroke="#FACC15"
                  strokeWidth="11"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="289"
                  initial={{ strokeDashoffset: 289 }}
                  animate={{ strokeDashoffset: 58 }}
                  transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* Secondary Sky Cyan Segment (Central Schemes) */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r="46"
                  stroke="#38BDF8"
                  strokeWidth="11"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="289"
                  initial={{ strokeDashoffset: 289 }}
                  animate={{ strokeDashoffset: 195 }}
                  transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              <div className="spatial-ring-center-badge">
                <strong className="spatial-ring-bold">82%</strong>
                <small className="spatial-ring-sub">
                  {gu ? "મંજૂરી દર" : "Match Rate"}
                </small>
              </div>
            </div>

            {/* Right Metrics Legend Breakdown */}
            <div className="spatial-ring-metrics-list">
              <div className="spatial-metric-row">
                <div className="spatial-dot-label">
                  <span className="spatial-legend-dot dot-amber" />
                  <span>{gu ? "રાજ્ય યોજનાઓ" : "State Schemes"}</span>
                </div>
                <div className="spatial-metric-values">
                  <strong>190</strong>
                  <span className="spatial-delta-pill">+12.4%</span>
                </div>
              </div>

              <div className="spatial-metric-row">
                <div className="spatial-dot-label">
                  <span className="spatial-legend-dot dot-cyan" />
                  <span>{gu ? "કેન્દ્રીય યોજનાઓ" : "Central Schemes"}</span>
                </div>
                <div className="spatial-metric-values">
                  <strong>95</strong>
                  <span className="spatial-delta-pill">+5.8%</span>
                </div>
              </div>

              <div className="spatial-metric-row">
                <div className="spatial-dot-label">
                  <span className="spatial-legend-dot dot-emerald" />
                  <span>{gu ? "ઓનલાઇન અરજી" : "Instant Online"}</span>
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
                {gu ? "અગ્રણી અને પાત્ર સરકારી યોજનાઓ" : "Top Matching Yojnas"}
              </h2>
              <p className="spatial-card-sub">
                {gu ? "નાગરિક પ્રોફાઇલ સાથે સુસંગત" : "Curated for Gujarat citizen profiles"}
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
                aria-label={`${gu ? yojna.titleGu : yojna.title} - ${yojna.criteria}`}
              >
                {/* Left: Circular Checkmark / Progress indicator */}
                <div className="spatial-row-left-icon">
                  <div className="spatial-check-bubble">
                    <CheckCircle2 size={18} strokeWidth={2.2} className="text-[#42C88A]" />
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

                {/* Right: High-Contrast Rounded Pill Status Badge */}
                <div className="spatial-row-action">
                  {yojna.status === "apply" ? (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate("wizard");
                      }}
                      className="spatial-pill-btn btn-apply"
                      role="button"
                      tabIndex={0}
                    >
                      {gu ? yojna.statusLabelGu : yojna.statusLabel}
                    </span>
                  ) : (
                    <span className="spatial-pill-btn btn-verified">
                      {gu ? yojna.statusLabelGu : yojna.statusLabel}
                    </span>
                  )}
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
                  {gu ? `નવેમ્બર ૨૦૨૫ (અઠવાડિયું ${weekOffset + 1})` : `November 2025 (Week ${weekOffset + 1})`}
                </h3>
              </div>
              <div className="spatial-nav-arrows">
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
                  disabled={weekOffset === 3}
                  className="spatial-circle-arrow"
                  aria-label={gu ? "આગળનું અઠવાડિયું" : "Next Week"}
                  style={{ opacity: weekOffset === 3 ? 0.35 : 1 }}
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            {/* 7 Days Horizontal Strip */}
            <div className="spatial-days-strip" role="tablist" aria-label="Timeline days">
              {timelineDays.map((d) => {
                const isSelected = activeDay === d.num;
                return (
                  <button
                    key={`${d.day}-${d.date}`}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveDay(d.num)}
                    className={`spatial-day-pill ${isSelected ? "selected-day" : ""}`}
                  >
                    <span className="spatial-day-name">{gu ? d.dayGu : d.day}</span>
                    <strong className="spatial-day-date">{d.date}</strong>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Event Highlight for Selected Day */}
            <div className="spatial-day-event-box">
              <span className="spatial-event-pill">{activeDeadline.type}</span>
              <span className="spatial-event-text">
                {gu ? activeDeadline.titleGu : activeDeadline.title}
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
                {gu ? "ઝડપી ચકાસણી ▾" : "Instant Check ▾"}
              </span>
            </div>

            <div className="spatial-action-body">
              <div className="spatial-action-desc-box">
                <div className="spatial-action-icon">
                  <FileCheck2 size={20} className="text-white" />
                </div>
                <div>
                  <strong className="spatial-action-strong">
                    {gu ? "૨ મિનિટમાં પાત્રતા શોધો" : "2 Mins Eligibility Check"}
                  </strong>
                  <p className="spatial-action-p">
                    {gu ? "તમારા પરિવાર માટેની યોજનાઓ" : "Find exact matching Yojnas"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate("wizard")}
                className="spatial-glowing-frosted-btn"
                aria-label={gu ? "પાત્રતા ચકાસણી શરૂ કરો" : "Start Eligibility Check"}
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
