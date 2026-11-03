"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { motion } from "framer-motion";

interface SpatialBentoDashboardProps {
  gu: boolean;
  onNavigate: (view: any) => void;
  onSelectYojna?: (name: string) => void;
}

export function SpatialBentoDashboard({
  gu,
  onNavigate,
  onSelectYojna,
}: SpatialBentoDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeDay, setActiveDay] = useState(3); // Tue 03

  // 1. Sector Activity Vertical Tracks
  const sectorData = [
    { name: "Khedut", nameGu: "ખેડૂત", pct: 78, highlight: false },
    { name: "Shikshan", nameGu: "શિક્ષણ", pct: 64, highlight: false },
    { name: "Mahila", nameGu: "મહિલા", pct: 85, highlight: true },
    { name: "Arogya", nameGu: "આરોગ્ય", pct: 52, highlight: false },
    { name: "MSME", nameGu: "ઉદ્યોગ", pct: 90, highlight: true },
    { name: "Awas", nameGu: "આવાસ", pct: 60, highlight: false },
    { name: "Yuva", nameGu: "યુવા", pct: 45, highlight: false },
  ];

  // 4. Featured Yojnas
  const featuredYojnas = [
    {
      id: "mksy",
      title: "Mukhyamantri Kisan Sahay Yojna",
      titleGu: "મુખ્યમંત્રી કિસાન સહાય યોજના",
      criteria: "4/4 Criteria Matched",
      criteriaGu: "૪/૪ પાત્રતા માપદંડ પૂર્ણ",
      status: "apply",
      statusLabel: "Apply Now",
      statusLabelGu: "અરજી કરો",
      pct: 100,
    },
    {
      id: "vdy",
      title: "Vahli Dikri Yojna",
      titleGu: "વ્હાલી દીકરી યોજના",
      criteria: "100% Verified Citizen",
      criteriaGu: "૧૦૦% ચકાસાયેલ નાગરિક",
      status: "verified",
      statusLabel: "Verified",
      statusLabelGu: "ચકાસાયેલ",
      pct: 100,
    },
    {
      id: "nlsy",
      title: "Namo Lakshmi & Saraswati Yojna",
      titleGu: "નમો લક્ષ્મી & સરસ્વતી સાધના યોજના",
      criteria: "4/4 Criteria Matched",
      criteriaGu: "૪/૪ પાત્રતા માપદંડ પૂર્ણ",
      status: "apply",
      statusLabel: "Apply Now",
      statusLabelGu: "અરજી કરો",
      pct: 88,
    },
  ];

  // 5. Timeline Strip Days (November 2026)
  const timelineDays = [
    { day: "Sun", dayGu: "રવિ", date: "01", num: 1 },
    { day: "Mon", dayGu: "સોમ", date: "02", num: 2 },
    { day: "Tue", dayGu: "મંગળ", date: "03", num: 3 },
    { day: "Wed", dayGu: "બુધ", date: "04", num: 4 },
    { day: "Thu", dayGu: "ગુરુ", date: "05", num: 5 },
    { day: "Fri", dayGu: "શુક્ર", date: "06", num: 6 },
    { day: "Sat", dayGu: "શનિ", date: "07", num: 7 },
  ];

  return (
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
              aria-label="Category Filter"
            >
              <option value="all">{gu ? "તમામ શ્રેણીઓ ▾" : "All Categories ▾"}</option>
              <option value="agriculture">{gu ? "કૃષિ & પશુપાલન" : "Agriculture"}</option>
              <option value="education">{gu ? "શિક્ષણ & કૌશલ્ય" : "Education"}</option>
              <option value="women">{gu ? "મહિલા & બાળકલ્યાણ" : "Women & Child"}</option>
            </select>
          </div>
        </div>

        {/* 7 Vertical Capsule Tracks */}
        <div className="spatial-capsule-chart-track-row">
          {sectorData.map((s, idx) => (
            <div key={s.name} className="spatial-capsule-col">
              {/* Outer Track Capsule */}
              <div className="spatial-capsule-track">
                {/* Animated Inner Fill */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${s.pct}%` }}
                  transition={{
                    duration: 1.1,
                    delay: 0.1 + idx * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`spatial-capsule-fill ${s.highlight ? "highlight-fill" : ""}`}
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
          2) TOP-CENTER STACK (3 COLS): 3 Stacked Mini-Stat Glass Cards
         ========================================================================= */}
      <div className="spatial-col-3 spatial-stack-col">
        {/* Card 1: 285+ Active Gujarat Yojnas */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="spatial-mini-stat-card"
        >
          <div className="spatial-stat-icon-box amber-glow">
            <Layers size={22} className="text-[#FACC15]" />
          </div>
          <div>
            <strong className="spatial-stat-value">285+</strong>
            <small className="spatial-stat-label">
              {gu ? "સક્રિય ગુજરાત યોજનાઓ" : "Active Gujarat Yojnas"}
            </small>
          </div>
        </motion.div>

        {/* Card 2: 33 / 33 Districts Covered */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="spatial-mini-stat-card"
        >
          <div className="spatial-stat-icon-box cyan-glow">
            <Building2 size={22} className="text-[#38BDF8]" />
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
          <div className="spatial-stat-icon-box emerald-glow">
            <ShieldCheck size={22} className="text-[#42C88A]" />
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
            <p className="spatial-card-sub">{gu ? "વાર્ષિક વિતરણ" : "Annual Distribution"}</p>
          </div>
          <span className="spatial-year-chip">2026-27 ▾</span>
        </div>

        <div className="spatial-donut-overview-wrap">
          {/* Left SVG Donut Ring Chart */}
          <div className="spatial-ring-container">
            <svg viewBox="0 0 120 120" className="spatial-ring-svg">
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
          >
            <span>{gu ? "બધી જુઓ" : "View All"}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 3 Sleek Horizontal Rows */}
        <div className="spatial-rows-deck">
          {featuredYojnas.map((yojna) => (
            <div
              key={yojna.id}
              className="spatial-yojna-row"
              onClick={() => onSelectYojna?.(yojna.title)}
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
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate("wizard");
                    }}
                    className="spatial-pill-btn btn-apply"
                  >
                    {gu ? yojna.statusLabelGu : yojna.statusLabel}
                  </button>
                ) : (
                  <span className="spatial-pill-btn btn-verified">
                    {gu ? yojna.statusLabelGu : yojna.statusLabel}
                  </span>
                )}
              </div>
            </div>
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
        {/* Top Half: Timeline Strip */}
        <div className="spatial-timeline-glass-subcard">
          <div className="spatial-card-head" style={{ marginBottom: "12px" }}>
            <h3 className="spatial-subcard-title">
              {gu ? "નવેમ્બર ૨૦૨૬" : "November 2026"}
            </h3>
            <div className="spatial-nav-arrows">
              <button
                type="button"
                className="spatial-circle-arrow"
                aria-label="Previous"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                className="spatial-circle-arrow"
                aria-label="Next"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {/* 7 Days Horizontal Strip */}
          <div className="spatial-days-strip">
            {timelineDays.map((d) => {
              const isSelected = activeDay === d.num;
              return (
                <button
                  key={d.date}
                  type="button"
                  onClick={() => setActiveDay(d.num)}
                  className={`spatial-day-pill ${isSelected ? "selected-day" : ""}`}
                >
                  <span className="spatial-day-name">{gu ? d.dayGu : d.day}</span>
                  <strong className="spatial-day-date">{d.date}</strong>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Half: Smart Eligibility Quick Action Card */}
        <div className="spatial-action-glass-subcard">
          <div className="spatial-card-head" style={{ marginBottom: "10px" }}>
            <div className="spatial-flex-gap">
              <Sparkles size={16} className="text-[#FACC15]" />
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
            >
              <span>{gu ? "શરૂ કરો →" : "Start Now →"}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
