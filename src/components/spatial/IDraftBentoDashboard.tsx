"use client";

import React, { useState } from "react";
import {
  LayoutGrid,
  Calendar,
  CheckSquare,
  BarChart2,
  Folder,
  Settings,
  Plus,
  Search,
  Bell,
  Share2,
  MoreVertical,
  MoreHorizontal,
  PieChart,
  TrendingUp,
  Download,
  Edit2,
  Gift,
  Cross,
  ChevronRight,
  ChevronDown,
  Pin,
  Trash2,
  Grid,
  List,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface IDraftBentoDashboardProps {
  gu: boolean;
  fy?: string;
  onNavigate: (view: "map" | "schemes" | "wizard" | "saved" | "settings") => void;
  onSelectYojna?: (name: string) => void;
}

export function IDraftBentoDashboard({
  gu,
  fy = "2025–26",
  onNavigate,
  onSelectYojna,
}: IDraftBentoDashboardProps) {
  // Navigation state
  const [activeNav, setActiveNav] = useState("dashboard");

  // Stat tile selection in Dark Hero Card (28 Projects selected by default)
  const [selectedTile, setSelectedTile] = useState<number>(0);

  // Day selection in Weekly Progress chart (Saturday = index 5 selected by default)
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(5);

  // Month goals checklist state (Row 1 checked by default, so 1/4)
  const [goals, setGoals] = useState([
    { id: 1, textEn: "Read 2 books", textGu: "૨ યોજના માર્ગદર્શિકા વાંચો", checked: true },
    { id: 2, textEn: "Sports every day", textGu: "રોજ શારીરિક કસરત", checked: false },
    { id: 3, textEn: "Complete the course", textGu: "ડિજિટલ સેવા કોર્સ પૂર્ણ કરો", checked: false },
    { id: 4, textEn: "Bend down with a parachute", textGu: "નવું આયોજન તૈયાર કરો", checked: false },
  ]);

  // Context menu open state for Card 2
  const [contextMenuOpen, setContextMenuOpen] = useState(false);

  // View toggle for Last Projects (grid vs list)
  const [projectsView, setProjectsView] = useState<"grid" | "list">("grid");

  // Add task prompt modal state
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const toggleGoal = (id: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, checked: !g.checked } : g))
    );
  };

  const completedGoalsCount = goals.filter((g) => g.checked).length;
  const daysList = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="idraft-wallpaper">
      <div className="idraft-frame">
        <div className="idraft-layout">
          {/* ===================================================================
           * 7.1 Sidebar (Floating White Pill Card)
           * =================================================================== */}
          <aside className="idraft-sidebar" aria-label="Sidebar Navigation">
            {/* Logo */}
            <div className="idraft-logo">
              <svg
                className="idraft-logo-icon"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 10L14 4L22 10L14 16L6 10Z"
                  fill="currentColor"
                  opacity="0.9"
                />
                <path
                  d="M10 18L18 12L26 18L18 24L10 18Z"
                  fill="currentColor"
                />
              </svg>
              <span className="idraft-logo-text">iDraft</span>
            </div>

            {/* Main Nav Group */}
            <nav className="idraft-nav-group">
              <button
                type="button"
                className={`idraft-nav-item ${activeNav === "dashboard" ? "active" : ""}`}
                onClick={() => setActiveNav("dashboard")}
              >
                <LayoutGrid size={17} strokeWidth={1.8} />
                <span>{gu ? "ડેશબોર્ડ" : "Dashboard"}</span>
              </button>

              <button
                type="button"
                className={`idraft-nav-item ${activeNav === "calendar" ? "active" : ""}`}
                onClick={() => {
                  setActiveNav("calendar");
                  onNavigate("map");
                }}
              >
                <Calendar size={17} strokeWidth={1.8} />
                <span>{gu ? "કેલેન્ડર / નકશો" : "Calendar"}</span>
              </button>

              <button
                type="button"
                className={`idraft-nav-item ${activeNav === "tasks" ? "active" : ""}`}
                onClick={() => {
                  setActiveNav("tasks");
                  onNavigate("wizard");
                }}
              >
                <CheckSquare size={17} strokeWidth={1.8} />
                <span>{gu ? "મારી યોજનાઓ" : "My Tasks"}</span>
              </button>

              <button
                type="button"
                className={`idraft-nav-item ${activeNav === "statistics" ? "active" : ""}`}
                onClick={() => {
                  setActiveNav("statistics");
                  onNavigate("saved");
                }}
              >
                <BarChart2 size={17} strokeWidth={1.8} />
                <span>{gu ? "આંકડાશાસ્ત્ર" : "Statistics"}</span>
              </button>

              <button
                type="button"
                className={`idraft-nav-item ${activeNav === "documents" ? "active" : ""}`}
                onClick={() => {
                  setActiveNav("documents");
                  onNavigate("schemes");
                }}
              >
                <Folder size={17} strokeWidth={1.8} />
                <span>{gu ? "દસ્તાવેજો / સૂચિ" : "Documents"}</span>
              </button>
            </nav>

            {/* Integrations Group */}
            <div className="idraft-sub-heading">INTEGRATIONS</div>
            <div className="idraft-integrations-list">
              <div className="idraft-team-item">
                <span style={{ fontWeight: 700, fontSize: "14px" }}>#</span>
                <span>Slack</span>
              </div>
              <div className="idraft-team-item">
                <span style={{ fontWeight: 700, fontSize: "13px" }}>N</span>
                <span>Notion</span>
              </div>
              <button
                type="button"
                className="idraft-nav-item"
                style={{ padding: "0 10px", fontSize: "12px", color: "var(--idraft-text-sec)" }}
                onClick={() => setAddTaskModalOpen(true)}
              >
                <Plus size={15} style={{ border: "1px dashed #999", borderRadius: "50%", padding: "1px" }} />
                <span>{gu ? "નવું પ્લગઇન" : "Add new plugin"}</span>
              </button>
            </div>

            {/* Teams Group */}
            <div className="idraft-sub-heading">TEAMS</div>
            <div className="idraft-teams-list">
              <div className="idraft-team-item">
                <span className="idraft-dot black" />
                <span>SEO Team</span>
              </div>
              <div className="idraft-team-item">
                <span className="idraft-dot grey" />
                <span>Marketing</span>
              </div>
            </div>

            {/* Settings at bottom */}
            <div className="idraft-sidebar-bottom">
              <button
                type="button"
                className="idraft-nav-item"
                onClick={() => onNavigate("settings")}
              >
                <Settings size={17} strokeWidth={1.8} />
                <span>{gu ? "સેટિંગ્સ" : "Settings"}</span>
              </button>
            </div>
          </aside>

          {/* ===================================================================
           * Main Content Area (Right of Sidebar)
           * =================================================================== */}
          <main className="idraft-main-content">
            {/* 7.2 Header Row */}
            <header className="idraft-header-row">
              <div>
                <h1 className="idraft-greeting-title">
                  {gu ? "નમસ્તે, દિલાન!" : "Hi, Dilan!"}
                </h1>
                <p className="idraft-greeting-sub">
                  {gu
                    ? `યોજના દૃષ્ટિ ૨.૦ · નાણાકીય વર્ષ ${fy}`
                    : `Yojana Drishti 2.0 · Financial Year ${fy}`}
                </p>
              </div>

              <div className="idraft-header-actions">
                <button
                  type="button"
                  className="idraft-btn-create"
                  onClick={() => setAddTaskModalOpen(true)}
                >
                  <Plus size={16} strokeWidth={2.2} />
                  <span>{gu ? "બનાવો" : "Create"}</span>
                </button>

                <button
                  type="button"
                  className="idraft-circle-btn"
                  onClick={() => onNavigate("schemes")}
                  aria-label="Search"
                >
                  <Search size={18} strokeWidth={1.8} />
                </button>

                <button
                  type="button"
                  className="idraft-circle-btn"
                  aria-label="Notifications"
                >
                  <Bell size={18} strokeWidth={1.8} />
                  <span className="idraft-bell-badge" />
                </button>

                <div className="idraft-avatar" title="Dilan / Riya Patel">
                  <span>DL</span>
                </div>
              </div>
            </header>

            {/* =================================================================
             * Row 1 (Stats): Overall Info + Weekly Progress + Month Progress
             * ================================================================= */}
            <section className="idraft-row-1">
              {/* 7.3 Card 'Overall Information' (Dark Hero Card #262626) */}
              <article className="idraft-card-dark">
                <div className="idraft-card-header">
                  <h2 className="idraft-card-title-white">
                    {gu ? "સમગ્ર માહિતી" : "Overall Information"}
                  </h2>
                  <div className="idraft-header-icons">
                    <button type="button" aria-label="Share">
                      <Share2 size={16} />
                    </button>
                    <button type="button" aria-label="More options">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>

                <div className="idraft-big-stats-wrap">
                  <div className="idraft-stat-col">
                    <span className="idraft-stat-huge">43</span>
                    <span className="idraft-stat-caption">
                      {gu ? "તમામ સમયના\nકાર્યો પૂર્ણ" : "Tasks done\nfor all time"}
                    </span>
                    <span className="idraft-active-underline" />
                  </div>

                  <div className="idraft-v-divider" />

                  <div className="idraft-stat-col">
                    <span className="idraft-stat-huge">2</span>
                    <span className="idraft-stat-caption">
                      {gu ? "યોજના પ્રોજેક્ટ\nસ્થગિત છે" : "projects are\nstopped"}
                    </span>
                  </div>
                </div>

                <div className="idraft-stat-tiles-row">
                  {[
                    { num: 28, labelEn: "Projects", labelGu: "પ્રોજેક્ટ્સ", icon: "bullseye" },
                    { num: 14, labelEn: "In Progress", labelGu: "પ્રગતિમાં", icon: "loader" },
                    { num: 11, labelEn: "Completed", labelGu: "સંપન્ન", icon: "target" },
                  ].map((tile, idx) => (
                    <button
                      key={tile.labelEn}
                      type="button"
                      className={`idraft-stat-tile ${selectedTile === idx ? "selected" : ""}`}
                      onClick={() => setSelectedTile(idx)}
                    >
                      {/* Icon */}
                      {tile.icon === "bullseye" && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <circle cx="12" cy="12" r="6" />
                          <circle cx="12" cy="12" r="2" fill="currentColor" />
                        </svg>
                      )}
                      {tile.icon === "loader" && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4">
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      )}
                      {tile.icon === "target" && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <circle cx="12" cy="12" r="4" />
                        </svg>
                      )}
                      <span className="idraft-tile-num">{tile.num}</span>
                      <span className="idraft-tile-label">{gu ? tile.labelGu : tile.labelEn}</span>
                    </button>
                  ))}
                </div>
              </article>

              {/* 7.3b Card 'Weekly progress' (Glass Line Chart) */}
              <article className="idraft-card-glass">
                <div className="idraft-card-header">
                  <div>
                    <h2 className="idraft-card-title-dark">
                      {gu ? "સાપ્તાહિક પ્રગતિ" : "Weekly progress"}
                    </h2>
                    <div className="idraft-legend-row">
                      <span className="idraft-legend-item">
                        <span className="idraft-dot black" />
                        <span>Sport</span>
                      </span>
                      <span className="idraft-legend-item">
                        <span className="idraft-dot grey" />
                        <span>Study</span>
                      </span>
                    </div>
                  </div>
                  <PieChart size={18} strokeWidth={1.8} style={{ color: "var(--idraft-ink)" }} />
                </div>

                <div className="idraft-chart-area-wrap">
                  {/* Floating Tooltip Chip */}
                  <div className="idraft-tooltip-chip">+24%</div>

                  {/* Dual Spline Chart SVG */}
                  <svg className="idraft-chart-svg" viewBox="0 0 240 85" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="idraft-spline-glow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#000000" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Baseline */}
                    <line x1="5" y1="78" x2="235" y2="78" stroke="#1a1a1a" strokeWidth="1" opacity="0.15" />

                    {/* Area under curves */}
                    <path
                      d="M 5,50 C 35,42 60,65 95,58 C 130,50 155,18 190,12 C 210,8 225,32 235,45 L 235,78 L 5,78 Z"
                      fill="url(#idraft-spline-glow)"
                    />

                    {/* Line 2 'Study' (Grey) */}
                    <path
                      d="M 5,58 C 40,55 70,72 105,65 C 140,58 165,35 195,28 C 215,22 225,45 235,52"
                      fill="none"
                      stroke="#9b9b9b"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    {/* Line 1 'Sport' (Black) */}
                    <path
                      d="M 5,50 C 35,42 60,65 95,58 C 130,50 155,18 190,12 C 210,8 225,32 235,45"
                      fill="none"
                      stroke="#1a1a1a"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />

                    {/* Peak Point on Saturday */}
                    <circle cx="190" cy="12" r="4" fill="#1a1a1a" stroke="#ffffff" strokeWidth="2" />
                  </svg>
                </div>

                {/* X Axis Days Selector */}
                <div className="idraft-days-selector">
                  {daysList.map((day, idx) => (
                    <button
                      key={`${day}-${idx}`}
                      type="button"
                      className={`idraft-day-letter ${selectedDayIndex === idx ? "active" : ""}`}
                      onClick={() => setSelectedDayIndex(idx)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </article>

              {/* 7.4 Card 'Month progress' (Donut + Actions) */}
              <article className="idraft-card-glass">
                <div className="idraft-card-header">
                  <div>
                    <h2 className="idraft-card-title-dark">
                      {gu ? "માસિક પ્રગતિ" : "Month progress"}
                    </h2>
                    <span style={{ fontSize: "11px", color: "var(--idraft-text-sec)" }}>
                      <strong style={{ color: "var(--idraft-ink)" }}>+20%</strong> compared to last month*
                    </span>
                  </div>
                  <TrendingUp size={18} strokeWidth={1.8} style={{ color: "var(--idraft-ink)" }} />
                </div>

                <div className="idraft-donut-flex">
                  {/* Legend */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span className="idraft-dot black" />
                      <span>Sport</span>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span className="idraft-dot" style={{ background: "#6b6b6b" }} />
                      <span>Study</span>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span className="idraft-dot" style={{ background: "#d0d0d0" }} />
                      <span>Project</span>
                    </span>
                  </div>

                  {/* Concentric 3-Ring Donut */}
                  <div className="idraft-donut-svg-wrap">
                    <svg width="108" height="108" viewBox="0 0 108 108">
                      {/* Inner Ring (Light Grey) */}
                      <circle cx="54" cy="54" r="28" fill="none" stroke="#e2e2e2" strokeWidth="3.5" />
                      <circle
                        cx="54"
                        cy="54"
                        r="28"
                        fill="none"
                        stroke="#d0d0d0"
                        strokeWidth="3.5"
                        strokeDasharray="175"
                        strokeDashoffset="70"
                        strokeLinecap="round"
                        transform="rotate(-90 54 54)"
                      />

                      {/* Middle Ring (Dark Grey) */}
                      <circle cx="54" cy="54" r="37" fill="none" stroke="#e8e8e8" strokeWidth="4" />
                      <circle
                        cx="54"
                        cy="54"
                        r="37"
                        fill="none"
                        stroke="#6b6b6b"
                        strokeWidth="4"
                        strokeDasharray="232"
                        strokeDashoffset="60"
                        strokeLinecap="round"
                        transform="rotate(-90 54 54)"
                      />

                      {/* Outer Ring (Black) */}
                      <circle cx="54" cy="54" r="46" fill="none" stroke="#f0f0f0" strokeWidth="4" />
                      <circle
                        cx="54"
                        cy="54"
                        r="46"
                        fill="none"
                        stroke="#1a1a1a"
                        strokeWidth="4.5"
                        strokeDasharray="289"
                        strokeDashoffset="25"
                        strokeLinecap="round"
                        transform="rotate(-90 54 54)"
                      />
                    </svg>

                    <div className="idraft-donut-center-text">
                      <span className="idraft-donut-val">120%</span>
                      <span className="idraft-donut-sub">overdone</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Row */}
                <div className="idraft-month-actions">
                  <button type="button" className="idraft-share-circle-btn" aria-label="Share report">
                    <Share2 size={15} />
                  </button>
                  <button
                    type="button"
                    className="idraft-download-pill-btn"
                    onClick={() => onNavigate("schemes")}
                  >
                    <span>{gu ? "અહેવાલ ડાઉનલોડ" : "Download Report"}</span>
                    <Download size={14} />
                  </button>
                </div>
              </article>
            </section>

            {/* =================================================================
             * Row 2: Month Goals (Checklist) + Tasks in Process (Tilted Cards)
             * ================================================================= */}
            <section className="idraft-row-2">
              {/* 7.5 Card 'Month goals:' (Checklist) */}
              <article className="idraft-card-white">
                <div className="idraft-card-header">
                  <h2 className="idraft-card-title-dark">
                    {gu ? "માસિક લક્ષ્યાંક:" : "Month goals:"}
                  </h2>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div className="idraft-mini-ring" title={`${completedGoalsCount}/4 completed`}>
                      <svg width="24" height="24" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="9" fill="none" stroke="#e5e5e5" strokeWidth="2.5" />
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          fill="none"
                          stroke="#1a1a1a"
                          strokeWidth="2.5"
                          strokeDasharray="56.5"
                          strokeDashoffset={56.5 - (56.5 * completedGoalsCount) / 4}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="idraft-ring-fraction" style={{ color: "var(--idraft-ink)" }}>
                        {completedGoalsCount}/4
                      </span>
                    </div>
                    <Edit2 size={15} style={{ color: "var(--idraft-ink)", cursor: "pointer" }} />
                  </div>
                </div>

                <div className="idraft-checklist-group">
                  {goals.map((g) => (
                    <div
                      key={g.id}
                      className="idraft-check-row"
                      onClick={() => toggleGoal(g.id)}
                    >
                      <div className={`idraft-checkbox ${g.checked ? "checked" : ""}`}>
                        {g.checked && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <span className={`idraft-check-text ${g.checked ? "checked" : ""}`}>
                        {gu ? g.textGu : g.textEn}
                      </span>
                    </div>
                  ))}
                </div>
              </article>

              {/* 7.6 Section 'Task In process (2)' */}
              <div className="idraft-tasks-section">
                <div className="idraft-tasks-header">
                  <h2 className="idraft-card-title-dark">
                    {gu ? "પ્રગતિ હેઠળના કાર્યો (૨)" : "Task In process (2)"}
                  </h2>
                  <button
                    type="button"
                    className="idraft-open-archive-link"
                    onClick={() => onNavigate("schemes")}
                  >
                    <span>{gu ? "આર્કાઇવ ખોલો" : "Open archive"}</span>
                    <ChevronRight size={13} />
                  </button>
                </div>

                <div className="idraft-task-cards-row">
                  {/* Task Card 1 (Tilted -3 deg) */}
                  <article className="idraft-task-card tilt-left">
                    <div className="idraft-task-top-row">
                      <Gift size={22} strokeWidth={1.8} style={{ color: "var(--idraft-ink)" }} />
                      <button type="button" aria-label="More" style={{ background: "none", border: "none", cursor: "pointer" }}>
                        <MoreHorizontal size={18} />
                      </button>
                    </div>

                    <div>
                      <h3 className="idraft-task-body-text">
                        {gu ? "સુસાન માટે જન્મદિવસે ભેટ ખરીદો" : "Buy Susan a gift for Bitherday"}
                      </h3>
                      <span className="idraft-task-meta-date">
                        {gu ? "આજે" : "Today"}
                      </span>
                    </div>

                    {/* Cut-in Black Corner Tab with Bell */}
                    <div className="idraft-bell-corner-tab">
                      <Bell size={18} strokeWidth={2} />
                    </div>
                  </article>

                  {/* Task Card 2 (Tilted +1 deg) */}
                  <article className="idraft-task-card tilt-right">
                    <div className="idraft-task-top-row">
                      <div
                        style={{
                          width: "22px",
                          height: "22px",
                          border: "2px solid #1a1a1a",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "14px",
                        }}
                      >
                        +
                      </div>
                      <button
                        type="button"
                        aria-label="More"
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                        onClick={() => setContextMenuOpen((prev) => !prev)}
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </div>

                    {/* Dark Popup Context Menu */}
                    <AnimatePresence>
                      {contextMenuOpen && (
                        <motion.div
                          className="idraft-dark-popup"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                        >
                          <button
                            type="button"
                            className="idraft-popup-row"
                            onClick={() => setContextMenuOpen(false)}
                          >
                            <span>Pin Note</span>
                            <Pin size={11} />
                          </button>
                          <button
                            type="button"
                            className="idraft-popup-row"
                            onClick={() => setContextMenuOpen(false)}
                          >
                            <span>Edit</span>
                            <Edit2 size={11} />
                          </button>
                          <button
                            type="button"
                            className="idraft-popup-row"
                            onClick={() => setContextMenuOpen(false)}
                          >
                            <span>Delete</span>
                            <Trash2 size={11} />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div>
                      <h3 className="idraft-task-body-text">
                        {gu ? "મંગળવારે ડૉક્ટરની મુલાકાત" : "Doctor's appointment on Tuesday"}
                      </h3>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span className="idraft-task-meta-date">02.09.2023</span>
                        <Bell size={16} strokeWidth={1.8} style={{ color: "var(--idraft-ink)" }} />
                      </div>
                    </div>
                  </article>

                  {/* 7.8 'Add task' card (Dashed) */}
                  <button
                    type="button"
                    className="idraft-add-task-card"
                    onClick={() => setAddTaskModalOpen(true)}
                  >
                    <Plus size={18} strokeWidth={2.2} />
                    <span>{gu ? "ટાસ્ક ઉમેરો" : "Add task"}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* =================================================================
             * Row 3: Section 'Last Projects' (3 Dark Cards #262626)
             * ================================================================= */}
            <section className="idraft-row-3">
              <div className="idraft-projects-header">
                <h2 className="idraft-card-title-dark">
                  {gu ? "છેલ્લા પ્રોજેક્ટ્સ" : "Last Projects"}
                </h2>
                <div className="idraft-projects-controls">
                  <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--idraft-text-sec)", cursor: "pointer" }}>
                    <span>Sort by</span>
                    <ChevronDown size={13} />
                  </span>
                  <div style={{ display: "flex", gap: "4px", background: "rgba(0,0,0,0.06)", padding: "2px", borderRadius: "8px" }}>
                    <button
                      type="button"
                      style={{
                        background: projectsView === "grid" ? "#ffffff" : "transparent",
                        border: "none",
                        borderRadius: "6px",
                        padding: "4px",
                        cursor: "pointer",
                        display: "flex",
                      }}
                      onClick={() => setProjectsView("grid")}
                      aria-label="Grid view"
                    >
                      <Grid size={14} />
                    </button>
                    <button
                      type="button"
                      style={{
                        background: projectsView === "list" ? "#ffffff" : "transparent",
                        border: "none",
                        borderRadius: "6px",
                        padding: "4px",
                        cursor: "pointer",
                        display: "flex",
                      }}
                      onClick={() => setProjectsView("list")}
                      aria-label="List view"
                    >
                      <List size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="idraft-projects-grid">
                {/* Project Card 1 */}
                <article className="idraft-project-card">
                  <div className="idraft-project-head">
                    <div>
                      <h3 className="idraft-project-title">New Schedule</h3>
                      <div className="idraft-project-status">
                        <span className="idraft-dot" style={{ background: "#ffffff" }} />
                        <span>In progress</span>
                      </div>
                    </div>
                    {/* Ring 3/6 */}
                    <div className="idraft-mini-ring">
                      <svg width="26" height="26" viewBox="0 0 26 26">
                        <circle cx="13" cy="13" r="10" fill="none" stroke="#444444" strokeWidth="2.5" />
                        <circle
                          cx="13"
                          cy="13"
                          r="10"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          strokeDasharray="62.8"
                          strokeDashoffset="31.4"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="idraft-ring-fraction" style={{ color: "#ffffff" }}>3/6</span>
                    </div>
                  </div>

                  <p className="idraft-project-desc">
                    <strong>Done: </strong>
                    Develop a new plan for Alina&apos;s education; Print a new timetable; Buy ...
                  </p>
                </article>

                {/* Project Card 2 */}
                <article className="idraft-project-card">
                  <div className="idraft-project-head">
                    <div>
                      <h3 className="idraft-project-title">Prototype animation</h3>
                      <div className="idraft-project-status">
                        <span className="idraft-dot" style={{ background: "#ffffff" }} />
                        <span>Completed</span>
                      </div>
                    </div>
                    {/* Ring 1/1 */}
                    <div className="idraft-mini-ring">
                      <svg width="26" height="26" viewBox="0 0 26 26">
                        <circle cx="13" cy="13" r="10" fill="none" stroke="#444444" strokeWidth="2.5" />
                        <circle
                          cx="13"
                          cy="13"
                          r="10"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          strokeDasharray="62.8"
                          strokeDashoffset="0"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="idraft-ring-fraction" style={{ color: "#ffffff" }}>1/1</span>
                    </div>
                  </div>

                  <p className="idraft-project-desc">
                    <strong>Done: </strong>
                    Micro-interaction easing specs, spring transitions, and SVG curve timing verified.
                  </p>
                </article>

                {/* Project Card 3 */}
                <article className="idraft-project-card">
                  <div className="idraft-project-head">
                    <div>
                      <h3 className="idraft-project-title">Ai Project 2 part</h3>
                      <div className="idraft-project-status">
                        <span className="idraft-dot" style={{ background: "#ffffff" }} />
                        <span>In progress</span>
                      </div>
                    </div>
                    {/* Ring 2/8 */}
                    <div className="idraft-mini-ring">
                      <svg width="26" height="26" viewBox="0 0 26 26">
                        <circle cx="13" cy="13" r="10" fill="none" stroke="#444444" strokeWidth="2.5" />
                        <circle
                          cx="13"
                          cy="13"
                          r="10"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          strokeDasharray="62.8"
                          strokeDashoffset="47.1"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="idraft-ring-fraction" style={{ color: "#ffffff" }}>2/8</span>
                    </div>
                  </div>

                  <p className="idraft-project-desc">
                    <strong>Done: </strong>
                    LLM prompt benchmarks, dataset clustering, and token cost optimization audit.
                  </p>
                </article>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Task Creation Modal */}
      <AnimatePresence>
        {addTaskModalOpen && (
          <motion.div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAddTaskModalOpen(false)}
          >
            <motion.div
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                padding: "28px",
                width: "90%",
                maxWidth: "420px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              }}
              initial={{ scale: 0.92, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 15 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem", fontWeight: 700, color: "#1a1a1a" }}>
                {gu ? "નવું કાર્ય ઉમેરો" : "Add New Task"}
              </h3>
              <p style={{ margin: "0 0 16px 0", fontSize: "0.85rem", color: "#8e8e8e" }}>
                {gu ? "તમારું દૈનિક અથવા યોજના લક્ષ્યાંક દાખલ કરો" : "Enter a new goal or scheme milestone"}
              </p>
              <input
                type="text"
                autoFocus
                placeholder={gu ? "કાર્યનું નામ..." : "Task description..."}
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: "1.5px solid #d0d0d0",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  marginBottom: "20px",
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setAddTaskModalOpen(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: "8px 16px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#8e8e8e",
                  }}
                >
                  {gu ? "રદ કરો" : "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (newTaskTitle.trim()) {
                      setGoals((prev) => [
                        ...prev,
                        {
                          id: Date.now(),
                          textEn: newTaskTitle.trim(),
                          textGu: newTaskTitle.trim(),
                          checked: false,
                        },
                      ]);
                      setNewTaskTitle("");
                      setAddTaskModalOpen(false);
                    }
                  }}
                  style={{
                    background: "#1a1a1a",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "9999px",
                    padding: "8px 20px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {gu ? "ઉમેરો" : "Add Goal"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
