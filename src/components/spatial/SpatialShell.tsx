"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { SpatialGujaratCanvas } from "./SpatialGujaratCanvas";
import { SpatialDock, type SpatialNavKey } from "./SpatialDock";
import { SpatialHeader } from "./SpatialHeader";
import { SpatialBentoDashboard } from "./SpatialBentoDashboard";
import { OverviewView } from "../pages/OverviewView";
import { SchemesView } from "../pages/SchemesView";
import { MapExplorerView } from "../pages/MapExplorerView";
import { PublicPortalView } from "../pages/PublicPortalView";
import { BeneficiaryAnalyticsView } from "../pages/BeneficiaryAnalyticsView";
import { AdministrationView } from "../pages/AdministrationView";
import { DrishtiAISahayak } from "../shared/DrishtiAISahayak";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { demoDistricts, demoSchemes } from "@/lib/demo-data";
import { MASTER_SUBDISTRICTS, GHOGHA_48_VILLAGES } from "@/lib/master-hierarchy";
import { getAllSearchableVillages } from "@/lib/village-scheme-intelligence";
import type { GlobalSearchItem } from "../layout/Topbar";
import { Search, X, MapPin, Sparkles, FileText, CheckCircle2, Info, ArrowRight, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SpatialShell() {
  const [lang, setLang] = useState<"gu" | "en" | "hi">("gu");
  const [activeKey, setActiveKey] = useState<SpatialNavKey>("dashboard");

  // Load persisted language
  useEffect(() => {
    try {
      const saved = localStorage.getItem("yd_lang");
      if (saved === "gu" || saved === "en" || saved === "hi") {
        setLang(saved);
      }
    } catch (_) {}
  }, []);

  const handleSetLang = (newLang: "gu" | "en" | "hi") => {
    setLang(newLang);
    try {
      localStorage.setItem("yd_lang", newLang);
    } catch (_) {}
  };
  // FIX C-01: Derive fiscal year with useMemo — no stale state.
  // Recomputes correctly on re-render; use a stable reference.
  const fy = useMemo<string>(() => {
    const current = new Date();
    const startYear = current.getMonth() >= 3 ? current.getFullYear() : current.getFullYear() - 1;
    return `${startYear}–${String(startYear + 1).slice(-2)}`;
  }, []);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchemeTerm, setSelectedSchemeTerm] = useState("");
  const [focusRequest, setFocusRequest] = useState<{ id: number; target: GlobalSearchItem } | null>(null);
  const focusRequestSequence = useRef(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchModalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const gu = lang === "gu";
  const hi = lang === "hi";

  // Focus management & keyboard trap for search dialog (A-01)
  useEffect(() => {
    if (searchOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== "Tab" || !searchModalRef.current) return;
        const focusables = searchModalRef.current.querySelectorAll<HTMLElement>(
          'input, button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      };

      window.addEventListener("keydown", handleTabKey);
      const cycleLang = () => {
    setLang((prev) => prev === "gu" ? "en" : prev === "en" ? "hi" : "gu");
  };

  return () => {
        window.removeEventListener("keydown", handleTabKey);
        previousFocusRef.current?.focus();
      };
    }
  }, [searchOpen]);

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
    const cycleLang = () => {
    setLang((prev) => prev === "gu" ? "en" : prev === "en" ? "hi" : "gu");
  };

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
    ...getAllSearchableVillages().map((village) => ({
      id: `v-${village.code}`,
      label: gu ? village.nameGu : village.nameEn,
      detail: `${gu ? village.districtNameGu : village.districtNameEn} • ${gu ? village.talukaNameGu : village.talukaNameEn} · LGD ${village.code} (${village.activeSchemes.length} ${gu ? "યોજનાઓ" : "schemes"})`,
      kind: "village" as const,
      districtId: village.districtId,
      subdistrictCode: village.talukaCode,
      villageCode: village.code,
      aliases: [
        village.nameEn,
        village.nameGu,
        village.code,
        village.talukaNameEn,
        village.talukaNameGu,
        village.districtNameEn,
        village.districtNameGu,
        ...village.activeSchemes.map((s) => s.schemeNameEn),
        ...village.activeSchemes.map((s) => s.schemeNameGu),
      ],
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

  const cycleLang = () => {
    setLang((prev) => prev === "gu" ? "en" : prev === "en" ? "hi" : "gu");
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
        lang={lang}
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
          lang={lang}
          onToggleLanguage={() => handleSetLang(lang === "gu" ? "en" : lang === "en" ? "hi" : "gu")}
          onSelectLang={handleSetLang}
          onOpenSearch={() => setSearchOpen(true)}
        />

        <div className="spatial-demo-disclaimer" role="note" aria-label={lang === "gu" ? "ડેમો ડેટાની નોંધ" : lang === "hi" ? "डेमो डेटा नोट" : "Demo data notice"}>
          <div className="spatial-demo-icon" aria-hidden="true">
            <Info size={16} />
          </div>
          <div className="spatial-demo-text">
            <strong>
              {lang === "gu" ? "ડેમો પૂર્વદર્શન · નમૂનાનો ડેટા" : lang === "hi" ? "डेमो पूर्वदर्शन · नमूना डेटा" : "DEMO PREVIEW · SAMPLE DATA"}
            </strong>
            <span>
              {lang === "gu"
                ? "યોજનાની વિગતો, લાભાર્થી, નાણાં, સમયમર્યાદા અને નકશાની યોજના-પહોંચ નમૂનાના છે; સત્તાવાર માહિતી નથી. સરકારી ડેટા જોડાયેલો નથી."
                : lang === "hi"
                ? "યોজना विवरण, लाभार्थी, राशि, समय सीमा और मानचित्र पर दर्शाई गई जानकारी नमूने के रूप में है; यह आधिकारिक जानकारी नहीं है।"
                : "Scheme details, beneficiaries, funding, deadlines, and mapped coverage are samples, not official information. Government data is not connected."}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveKey("map")}
            className="spatial-demo-action"
            aria-label={gu ? "જિલ્લા નકશો ખોલો" : "Open district map"}
          >
            <span>{lang === "gu" ? "જિલ્લા નકશો" : lang === "hi" ? "जिला नक्शा" : "District map"}</span>
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
              <ErrorBoundary moduleName="State Overview">
                <OverviewView
                  gu={gu}
                  fy={fy}
                  onNavigate={(view) => {
                    if (view === "map" || view === "schemes" || view === "wizard" || view === "saved" || view === "settings") {
                      setActiveKey(view);
                    } else if (view === "analytics" || view === "beneficiaries" || view === "financial" || view === "reports") {
                      setActiveKey("saved");
                    } else if (view === "portal" || view === "eligibility") {
                      setActiveKey("wizard");
                    } else if (view === "districts") {
                      setActiveKey("map");
                    }
                  }}
                  onSelectDistrict={(district) => {
                    setFocusRequest({
                      id: ++focusRequestSequence.current,
                      target: {
                        id: district.id,
                        label: gu ? district.gu : district.name,
                        detail: `${gu ? district.regionGu : district.region} · ${gu ? "જિલ્લો" : "District"}`,
                        kind: "district",
                        districtId: district.id,
                        aliases: [district.name, district.gu, district.code],
                      },
                    });
                    setActiveKey("map");
                  }}
                  searchQuery=""
                />
              </ErrorBoundary>
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
              <ErrorBoundary moduleName="Schemes Directory">
                <SchemesView gu={gu} fy={fy} initialSearchTerm={selectedSchemeTerm} />
              </ErrorBoundary>
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
              <ErrorBoundary moduleName="Map Explorer">
                <MapExplorerView gu={gu} fy={fy} focusRequest={focusRequest} />
              </ErrorBoundary>
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
              <ErrorBoundary moduleName="Eligibility Portal">
                <PublicPortalView gu={gu} />
              </ErrorBoundary>
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
              <ErrorBoundary moduleName="Beneficiary Analytics">
                <BeneficiaryAnalyticsView gu={gu} fy={fy} />
              </ErrorBoundary>
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
              <ErrorBoundary moduleName="Administration">
                <AdministrationView gu={gu} />
              </ErrorBoundary>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>

      {/* Global search dialog (Ctrl/Cmd+K) with focus trap & keyboard navigation */}
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
              ref={searchModalRef}
              className="spatial-search-modal-box"
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              role="dialog"
              aria-modal="true"
              aria-label={lang === "gu" ? "શોધખોળ" : lang === "hi" ? "खोजें" : "Search"}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="spatial-search-header">
                <Search size={20} className="spatial-search-icon" aria-hidden="true" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label={lang === "gu" ? "યોજના, જિલ્લો, તાલુકો અથવા ગામ શોધો" : lang === "hi" ? "योजना, जिला, तालुका या गाँव खोजें" : "Search schemes, districts, talukas, or villages"}
                  placeholder={lang === "gu" ? "યોજના, જિલ્લો, તાલુકો કે ગામ શોધો..." : lang === "hi" ? "योजना, जिला, तालुका या गाँव खोजें..." : "Search schemes, districts, talukas, villages..."}
                  className="spatial-search-input"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label={lang === "gu" ? "શોધ બંધ કરો" : lang === "hi" ? "खोज बंद करें" : "Close search"}
                  className="spatial-search-close-btn"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              <div className="spatial-search-results" role="group" aria-label={lang === "gu" ? "શોધના પરિણામો" : lang === "hi" ? "खोज परिणाम" : "Search results"}>
                {filteredSearchResults.map((item) => (
                  <button
                    key={`${item.kind}-${item.id}`}
                    type="button"
                    className="spatial-search-result"
                    onClick={() => handleSelectSearchResult(item)}
                  >
                    <div className="spatial-search-result-content">
                      {item.kind === "village" ? (
                        <Home size={18} className="spatial-search-result-icon" aria-hidden="true" style={{ color: "#FFFFFF" }} />
                      ) : item.kind === "district" || item.kind === "taluka" ? (
                        <MapPin size={18} className="spatial-search-result-icon" aria-hidden="true" />
                      ) : (
                        <Sparkles size={18} className="spatial-search-result-icon" aria-hidden="true" />
                      )}
                      <div>
                        <div className="spatial-search-result-title">
                          {item.label}
                        </div>
                        <div className="spatial-search-result-detail">
                          {item.detail}
                        </div>
                      </div>
                    </div>
                    <span className="spatial-search-result-kind">
                      {item.kind}
                    </span>
                  </button>
                ))}
                {filteredSearchResults.length === 0 && (
                  <p className="spatial-search-empty" role="status">
                    {lang === "gu" ? "કોઈ મેળ ખાતું પરિણામ મળ્યું નથી." : lang === "hi" ? "कोई मेल खाता परिणाम नहीं मिला।" : "No matching results found."}
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
