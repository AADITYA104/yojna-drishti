"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import { Search, X, MapPin, Sparkles, FileText, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SpatialShell() {
  const [lang, setLang] = useState<"gu" | "en">("gu");
  const [activeKey, setActiveKey] = useState<SpatialNavKey>("dashboard");
  const [fy] = useState<string>("2025–26");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusRequest, setFocusRequest] = useState<{ id: number; target: GlobalSearchItem } | null>(null);

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
      setActiveKey("schemes");
    } else {
      setFocusRequest({ id: Date.now(), target: item });
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

      {/* 3. Main Frosted Glass Spatial Frame */}
      <motion.main
        className="spatial-main-container"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Top Executive Header */}
        <SpatialHeader
          gu={gu}
          onToggleLanguage={() => setLang((prev) => (prev === "gu" ? "en" : "gu"))}
          onOpenSearch={() => setSearchOpen(true)}
        />

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
                onNavigate={(view) => {
                  if (view === "map" || view === "schemes" || view === "wizard" || view === "saved" || view === "settings") {
                    setActiveKey(view);
                  } else {
                    setActiveKey("schemes");
                  }
                }}
              />
            </motion.div>
          )}

          {activeKey === "schemes" && (
            <motion.div
              key="schemes"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <SchemesView gu={gu} fy={fy} />
            </motion.div>
          )}

          {activeKey === "map" && (
            <motion.div
              key="map"
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

      {/* Global Glass Search Modal (Cmd+K) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="spatial-search-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              className="spatial-search-modal-box"
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.12)", gap: "12px" }}>
                <Search size={20} className="text-white/60" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                  style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ maxHeight: "380px", overflowY: "auto", padding: "10px" }}>
                {filteredSearchResults.map((item) => (
                  <div
                    key={`${item.kind}-${item.id}`}
                    onClick={() => handleSelectSearchResult(item)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 14px",
                      borderRadius: "14px",
                      cursor: "pointer",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.10)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {item.kind === "district" || item.kind === "taluka" ? (
                        <MapPin size={18} style={{ color: "#38bdf8" }} />
                      ) : (
                        <Sparkles size={18} style={{ color: "#facc15" }} />
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
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Drishti Sahayak Assistant */}
      <DrishtiAISahayak
        gu={gu}
        onNavigate={(page) => {
          if (page === "portal" || page === "wizard") setActiveKey("wizard");
          else if (page === "map") setActiveKey("map");
          else if (page === "schemes") setActiveKey("schemes");
          else if (page === "analytics" || page === "beneficiaries") setActiveKey("saved");
          else setActiveKey("dashboard");
        }}
      />
    </div>
  );
}
