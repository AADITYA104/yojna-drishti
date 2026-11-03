"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { SpatialGujaratCanvas } from "./SpatialGujaratCanvas";
import { SpatialDock, type SpatialNavKey } from "./SpatialDock";
import { SpatialHeader } from "./SpatialHeader";
import { SpatialBentoDashboard } from "./SpatialBentoDashboard";
import { SchemesView } from "../pages/SchemesView";
import { MapExplorerView } from "../pages/MapExplorerView";
import { PublicPortalView } from "../pages/PublicPortalView";
import { BeneficiaryAnalyticsView } from "../pages/BeneficiaryAnalyticsView";
import { AdministrationView } from "../pages/AdministrationView";
import { DrishtiAISahayak } from "../shared/DrishtiAISahayak";
import { demoDistricts, demoSchemes } from "@/lib/demo-data";
import { MASTER_SUBDISTRICTS, GHOGHA_48_VILLAGES } from "@/lib/master-hierarchy";
import type { GlobalSearchItem } from "../layout/Topbar";
import { Search, X, MapPin, Sparkles, FileText, CheckCircle2, Info, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SpatialShell() {
  const [lang, setLang] = useState<"gu" | "en">("gu");
  const [activeKey, setActiveKey] = useState<SpatialNavKey>("schemes");
  const [fy] = useState<string>(() => {
    const current = new Date();
    const startYear = current.getMonth() >= 3 ? current.getFullYear() : current.getFullYear() - 1;
    return `${startYear}–${String(startYear + 1).slice(-2)}`;
  });
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchemeTerm, setSelectedSchemeTerm] = useState("");
  const [focusRequest, setFocusRequest] = useState<{ id: number; target: GlobalSearchItem } | null>(null);
  const focusRequestSequence = useRef(0);

  const gu = lang === "gu";

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [activeKey]);

  // Search items index
  const searchItems = useMemo<GlobalSearchItem[]>(() => [
    ...demoDistricts.map((district) => ({
      id: district.id,
      label: gu ? district.gu : district.name,
      detail: `${gu ? district.regionGu : district.region} · ${gu ? "જિલ્લો" : "District"}`,
      kind: "district" as const,
      districtId: district.id,
      aliases: [district.name, district.gu, district.code],
    })),
    ...MASTER_SUBDISTRICTS.map((taluka) => ({
      id: String(taluka.code),
      label: gu ? taluka.nameGu : taluka.nameEn,
      detail: `${gu ? taluka.districtNameGu : taluka.districtNameEn} · LGD ${taluka.code}`,
      kind: "taluka" as const,
      districtId: taluka.districtId,
      subdistrictCode: taluka.code,
      aliases: [taluka.nameEn, taluka.nameGu, String(taluka.code)],
    })),
    ...demoSchemes.map((scheme) => ({
      id: scheme.id,
      label: gu ? scheme.gu : scheme.name,
      detail: `${gu ? scheme.categoryGu : scheme.category} · ${gu ? "યોજના" : "Scheme"}`,
      kind: "scheme" as const,
      aliases: [scheme.name, scheme.gu, scheme.shortName, scheme.shortNameGu],
    })),
  ], [gu]);

  const filteredSearchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return searchItems.slice(0, 8);
    return searchItems
      .filter((item) =>
        item.label.toLowerCase().includes(q) ||
        item.detail.toLowerCase().includes(q) ||
        (item.aliases || []).some((a) => a.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [searchItems, searchQuery]);

  const handleSelectSearchResult = (item: GlobalSearchItem) => {
    setSearchOpen(false);
    setSearchQuery("");
    if (item.kind === "scheme") {
      setSelectedSchemeTerm(item.label);
      setActiveKey("schemes");
    } else {
      setFocusRequest({ id: ++focusRequestSequence.current, target: item });
      setActiveKey("map");
    }
  };

  return (
    <div className="spatial-app-shell">
      {/* 1. Background Gujarat SVG & Atmospheric Canvas */}
      <SpatialGujaratCanvas gu={gu} />

      {/* 2. Left Floating Capsule Dock */}
      <SpatialDock
        activeKey={activeKey}
        onSelect={(key) => setActiveKey(key)}
        gu={gu}
      />

        {/* 3. Main public-service workspace */}
      <motion.main
        className="spatial-main-container"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Primary header */}
        <SpatialHeader
          gu={gu}
          onToggleLanguage={() => setLang((prev) => (prev === "gu" ? "en" : "gu"))}
          onOpenSearch={() => setSearchOpen(true)}
        />

        <div className="spatial-demo-disclaimer" role="note" aria-label={gu ? "ડેમો ડેટાની નોંધ" : "Demo data notice"}>
          <div className="spatial-demo-icon" aria-hidden="true">
            <Info size={16} />
          </div>
          <div className="spatial-demo-text">
            <strong>
              {gu ? "ડેમો પૂર્વદર્શન · નમૂનાનો ડેટા" : "DEMO PREVIEW · SAMPLE DATA"}
            </strong>
            <span>
              {gu
                ? "યોજનાની વિગતો, લાભાર્થી, નાણાં, સમયમર્યાદા અને નકશાની યોજના-પહોંચ નમૂનાના છે; સત્તાવાર માહિતી નથી. સરકારી ડેટા જોડાયેલો નથી."
                : "Scheme details, beneficiaries, funding, deadlines, and mapped coverage are samples, not official information. Government data is not connected."}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveKey("map")}
            className="spatial-demo-action"
            aria-label={gu ? "જિલ્લા નકશો ખોલો" : "Open district map"}
          >
            <span>{gu ? "જિલ્લા નકશો" : "District map"}</span>
            <ArrowRight size={13} aria-hidden="true" />
          </button>
        </div>

        {/* View Switcher with Spring Animation */}
        <AnimatePresence mode="wait">
          {activeKey === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <SpatialBentoDashboard
                gu={gu}
                fy={fy}
                onNavigate={(view) => {
                  if (view === "map" || view === "schemes" || view === "wizard" || view === "saved" || view === "settings") {
                    setActiveKey(view);
                  } else {
                    setActiveKey("schemes");
                  }
                }}
                onSelectYojna={(name) => {
                  setSelectedSchemeTerm(name);
                  setActiveKey("schemes");
                }}
              />
            </motion.div>
          )}

          {activeKey === "schemes" && (
            <motion.div
              key={`schemes-${selectedSchemeTerm}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <SchemesView gu={gu} fy={fy} initialSearchTerm={selectedSchemeTerm} />
            </motion.div>
          )}

          {activeKey === "map" && (
            <motion.div
              key={`map-${focusRequest?.id ?? 0}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <MapExplorerView gu={gu} fy={fy} focusRequest={focusRequest} />
            </motion.div>
          )}

          {activeKey === "wizard" && (
            <motion.div
              key="wizard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <PublicPortalView gu={gu} />
            </motion.div>
          )}

          {activeKey === "saved" && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <BeneficiaryAnalyticsView gu={gu} fy={fy} />
            </motion.div>
          )}

          {activeKey === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <AdministrationView gu={gu} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>

      {/* Global search dialog (Ctrl/Cmd+K) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="spatial-search-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="presentation"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              className="spatial-search-modal-box"
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              role="dialog"
              aria-modal="true"
              aria-label={gu ? "શોધખોળ" : "Search"}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.12)", gap: "12px" }}>
                <Search size={20} className="text-white/60" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label={gu ? "યોજના, જિલ્લો અથવા તાલુકો શોધો" : "Search schemes, districts, or talukas"}
                  placeholder={gu ? "યોજના, જિલ્લો અથવા તાલુકો શોધો..." : "Search schemes, districts, talukas..."}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#ffffff",
                    fontSize: "1.05rem",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label={gu ? "શોધ બંધ કરો" : "Close search"}
                  style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="spatial-search-results" role="group" aria-label={gu ? "શોધના પરિણામો" : "Search results"}>
                {filteredSearchResults.map((item) => (
                  <button
                    key={`${item.kind}-${item.id}`}
                    type="button"
                    className="spatial-search-result"
                    onClick={() => handleSelectSearchResult(item)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {item.kind === "district" || item.kind === "taluka" ? (
                        <MapPin size={18} style={{ color: "rgba(255,255,255,0.78)" }} aria-hidden="true" />
                      ) : (
                        <Sparkles size={18} style={{ color: "rgba(255,255,255,0.78)" }} aria-hidden="true" />
                      )}
                      <div>
                        <div style={{ color: "#ffffff", fontWeight: 600, fontSize: "0.95rem" }}>
                          {item.label}
                        </div>
                        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.76rem" }}>
                          {item.detail}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
                      {item.kind}
                    </span>
                  </button>
                ))}
                {filteredSearchResults.length === 0 && (
                  <p className="spatial-search-empty" role="status">
                    {gu ? "કોઈ મેળ ખાતું પરિણામ મળ્યું નથી." : "No matching results found."}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Drishti Sahayak Assistant */}
      <DrishtiAISahayak
        gu={gu}
        onNavigate={(page, searchTerm) => {
          if (page === "portal" || page === "wizard") setActiveKey("wizard");
          else if (page === "map") setActiveKey("map");
          else if (page === "schemes") {
            setSelectedSchemeTerm(searchTerm || "");
            setActiveKey("schemes");
          }
          else if (page === "analytics" || page === "beneficiaries") setActiveKey("saved");
          else setActiveKey("dashboard");
        }}
      />
    </div>
  );
}
