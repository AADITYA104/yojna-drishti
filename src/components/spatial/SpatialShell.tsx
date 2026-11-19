"use client";

import React, { useState, useMemo, useEffect, useRef, startTransition } from "react";
import { localizeText } from "@/lib/i18n";
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
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import type { AppLanguage } from "@/lib/i18n";

export function SpatialShell() {
  const [lang, setLang] = useState<AppLanguage>("gu");
  const [activeKey, setActiveKey] = useState<SpatialNavKey>("dashboard");
  const [fy] = useState<string>(() => {
    const current = new Date();
    const startYear = current.getMonth() >= 3 ? current.getFullYear() : current.getFullYear() - 1;
    return `${startYear}–${String(startYear + 1).slice(-2)}`;
  });
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchemeTerm, setSelectedSchemeTerm] = useState("");
  const [focusRequest, setFocusRequest] = useState<{ id: number; target: GlobalSearchItem } | null>(null);
  const [remoteSearchResults, setRemoteSearchResults] = useState<GlobalSearchItem[]>([]);
  const [remoteSearchQuery, setRemoteSearchQuery] = useState("");
  const [remoteSearchErrorQuery, setRemoteSearchErrorQuery] = useState("");
  const [remoteSearchCoverage, setRemoteSearchCoverage] = useState<{ indexedVillages: number; indexedSubdistricts: number; totalSubdistricts: number } | null>(null);
  const focusRequestSequence = useRef(0);

  const gu = lang === "gu";

  useEffect(() => {
    const saved = window.localStorage.getItem("yojana-drishti-language");
    if (saved === "gu" || saved === "en" || saved === "hi") startTransition(() => setLang(saved));
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === "gu"
      ? "યોજના દૃષ્ટિ | સરકારી યોજનાઓ અને ગુજરાતનો નકશો"
      : lang === "hi"
        ? "योजना दृष्टि | सरकारी योजनाएँ और गुजरात का नक्शा"
        : "Yojana Drishti | Government Schemes and Gujarat Map";
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) {
      description.content = lang === "gu"
        ? "ગુજરાત માટેની સરકારી યોજનાઓ શોધો અને વહીવટી નકશા સાથે વિસ્તારની વિગતો જુઓ. આ જાહેર પૂર્વદર્શન છે."
        : lang === "hi"
          ? "गुजरात की सरकारी योजनाएँ खोजें और प्रशासनिक नक्शे पर क्षेत्र का विवरण देखें। यह सार्वजनिक पूर्वावलोकन है।"
          : "Find Gujarat government schemes and explore administrative boundaries with area details. This is a public preview.";
    }
    window.localStorage.setItem("yojana-drishti-language", lang);
  }, [lang]);

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
      label: localizeText(lang, gu ? district.gu : district.name),
      detail: `${localizeText(lang, gu ? district.regionGu : district.region)} · ${localizeText(lang, gu ? "જિલ્લો" : "District")}`,
      kind: "district" as const,
      districtId: district.id,
      aliases: [district.name, district.gu, district.code],
    })),
    ...MASTER_SUBDISTRICTS.map((taluka) => ({
      id: String(taluka.code),
      label: localizeText(lang, gu ? taluka.nameGu : taluka.nameEn),
      detail: `${localizeText(lang, gu ? taluka.districtNameGu : taluka.districtNameEn)} · LGD ${taluka.code}`,
      kind: "taluka" as const,
      districtId: taluka.districtId,
      subdistrictCode: taluka.code,
      aliases: [taluka.nameEn, taluka.nameGu, String(taluka.code)],
    })),
    ...demoSchemes.map((scheme) => ({
      id: scheme.id,
      label: localizeText(lang, gu ? scheme.gu : scheme.name),
      detail: `${localizeText(lang, gu ? scheme.categoryGu : scheme.category)} · ${localizeText(lang, gu ? "યોજના" : "Scheme")}`,
      kind: "scheme" as const,
      aliases: [scheme.name, scheme.gu, scheme.shortName, scheme.shortNameGu],
    })),
  ], [gu, lang]);

  const filteredSearchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase().normalize("NFKC");
    const localMatches = !q ? searchItems.slice(0, 8) : searchItems.filter((item) =>
      `${item.label} ${item.detail} ${item.id} ${(item.aliases || []).join(" ")}`
        .toLowerCase().normalize("NFKC").includes(q),
    );
    const currentRemote = remoteSearchQuery === searchQuery.trim() ? remoteSearchResults : [];
    const seen = new Set<string>();
    return [...currentRemote, ...localMatches].filter((item) => {
      const key = `${item.kind}-${item.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 12);
  }, [remoteSearchQuery, remoteSearchResults, searchItems, searchQuery]);

  useEffect(() => {
    const query = searchQuery.trim();
    if (!searchOpen || query.length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetch(`/api/v1/search?q=${encodeURIComponent(query)}&lang=${lang}`, { signal: controller.signal })
        .then((response) => {
          if (!response.ok) throw new Error("Search service unavailable");
          return response.json() as Promise<{
            data?: GlobalSearchItem[];
            meta?: { coverage?: { indexedVillages: number; indexedSubdistricts: number; totalSubdistricts: number } };
          }>;
        })
        .then((payload) => {
          if (controller.signal.aborted) return;
          setRemoteSearchResults(Array.isArray(payload.data) ? payload.data : []);
          setRemoteSearchCoverage(payload.meta?.coverage ?? null);
          setRemoteSearchQuery(query);
          setRemoteSearchErrorQuery("");
        })
        .catch((reason: Error) => {
          if (reason.name !== "AbortError" && !controller.signal.aborted) setRemoteSearchErrorQuery(query);
        });
    }, 180);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [lang, searchOpen, searchQuery]);

  const isRemoteSearchLoading = searchOpen && searchQuery.trim().length >= 2 && remoteSearchQuery !== searchQuery.trim() && remoteSearchErrorQuery !== searchQuery.trim();
  const searchKindLabel = (kind: GlobalSearchItem["kind"]) => {
    const labels = {
      gu: { district: "જિલ્લો", taluka: "તાલુકો", village: "ગામ/શહેર", scheme: "યોજના" },
      hi: { district: "जिला", taluka: "तालुका", village: "गाँव/शहर", scheme: "योजना" },
      en: { district: "District", taluka: "Taluka", village: "Village/city", scheme: "Scheme" },
    };
    return labels[lang][kind];
  };

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
    <MotionConfig reducedMotion="user">
    <div className="spatial-app-shell">
      {/* 1. Background Gujarat SVG & Atmospheric Canvas */}
      <SpatialGujaratCanvas gu={gu} lang={lang} />

      {/* Main public-service workspace */}
      <motion.main
        className="spatial-main-container"
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Primary header */}
        <SpatialHeader
          lang={lang}
          onSelectLanguage={setLang}
          onOpenSearch={() => setSearchOpen(true)}
        />

        <SpatialDock
          activeKey={activeKey}
          onSelect={(key) => setActiveKey(key)}
          gu={gu}
          lang={lang}
        />

        <aside className="spatial-demo-disclaimer" role="note">
          <Info size={18} aria-hidden="true" />
          <span>
            <strong>{lang === "gu" ? "જાહેર પૂર્વદર્શન · " : lang === "hi" ? "सार्वजनिक पूर्वावलोकन · " : "Public preview · "}</strong>
            {lang === "gu"
              ? "યોજના, લાભાર્થી અને ચુકવણીના આંકડા કૃત્રિમ નમૂના છે; સત્તાવાર સરકારી ગણતરી નથી. નકશાની વહીવટી સીમાઓ સરકારી ભૌગોલિક સ્રોતો પરથી છે."
              : lang === "hi"
                ? "योजना, लाभार्थी और भुगतान के आँकड़े कृत्रिम नमूने हैं, आधिकारिक सरकारी गणना नहीं। नक्शे की प्रशासनिक सीमाएँ सरकारी भौगोलिक स्रोतों से हैं।"
                : "Scheme, beneficiary, and payment figures are synthetic examples, not official government counts. Administrative map boundaries come from government geographic sources."}
          </span>
        </aside>

        {/* View Switcher with Spring Animation */}
        <AnimatePresence mode="wait">
          {activeKey === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              <SpatialBentoDashboard
                gu={gu}
                lang={lang}
                fy={fy}
                onNavigate={(view) => {
                  if (view === "map") {
                    const mapElement = document.getElementById("spatial-gujarat-map");
                    if (mapElement) {
                      mapElement.scrollIntoView({ behavior: "smooth" });
                    } else {
                      setActiveKey("map");
                    }
                  } else if (view === "schemes" || view === "wizard" || view === "saved" || view === "settings") {
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

              {/* Integrated Gujarat administrative map and area analytics */}
              <section id="spatial-gujarat-map" className="mt-10 pt-6 border-t border-white/10">
                <MapExplorerView gu={gu} lang={lang} fy={fy} focusRequest={focusRequest} />
              </section>
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
              <SchemesView gu={gu} lang={lang} fy={fy} initialSearchTerm={selectedSchemeTerm} onOpenMap={() => setActiveKey("map")} />
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
              <MapExplorerView gu={gu} lang={lang} fy={fy} focusRequest={focusRequest} />
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
              <PublicPortalView gu={gu} lang={lang} />
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
              <BeneficiaryAnalyticsView gu={gu} lang={lang} fy={fy} />
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
              <AdministrationView gu={gu} lang={lang} />
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
              aria-label={localizeText(lang, gu ? "શોધખોળ" : "Search")}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.12)", gap: "12px" }}>
                <Search size={20} className="text-white/60" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      event.preventDefault();
                      setSearchOpen(false);
                      setSearchQuery("");
                    } else if (event.key === "Enter" && filteredSearchResults[0]) {
                      event.preventDefault();
                      handleSelectSearchResult(filteredSearchResults[0]);
                    }
                  }}
                  aria-label={lang === "gu" ? "યોજના, જિલ્લો, તાલુકો, ગામ અથવા શહેર શોધો" : lang === "hi" ? "योजना, जिला, तालुका, गाँव या शहर खोजें" : "Search schemes, districts, talukas, villages, or cities"}
                  placeholder={lang === "gu" ? "નામ અથવા LGD codeથી ગામ, શહેર, તાલુકો, જિલ્લો શોધો..." : lang === "hi" ? "नाम या LGD code से गाँव, शहर, तालुका, जिला खोजें..." : "Find a village, city, taluka, or district by name or LGD code…"}
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
                  aria-label={localizeText(lang, gu ? "શોધ બંધ કરો" : "Close search")}
                  style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="spatial-search-results" role="listbox" aria-label={lang === "gu" ? "શોધનાં પરિણામો" : lang === "hi" ? "खोज परिणाम" : "Search results"} aria-busy={isRemoteSearchLoading}>
                {searchQuery.trim().length >= 2 && remoteSearchQuery === searchQuery.trim() && remoteSearchCoverage && (
                  <p className="spatial-search-coverage">
                    {lang === "gu"
                      ? `${remoteSearchCoverage.indexedVillages.toLocaleString("gu-IN")} ગામ/શહેરના નામ · ${remoteSearchCoverage.indexedSubdistricts}/${remoteSearchCoverage.totalSubdistricts} તાલુકા સૂચિ`
                      : lang === "hi"
                        ? `${remoteSearchCoverage.indexedVillages.toLocaleString("hi-IN")} गाँव/शहर के नाम · ${remoteSearchCoverage.indexedSubdistricts}/${remoteSearchCoverage.totalSubdistricts} तालुका सूचियाँ`
                        : `${remoteSearchCoverage.indexedVillages.toLocaleString("en-IN")} village/city names · ${remoteSearchCoverage.indexedSubdistricts}/${remoteSearchCoverage.totalSubdistricts} taluka lists`}
                  </p>
                )}
                {filteredSearchResults.map((item) => (
                  <button
                    key={`${item.kind}-${item.id}`}
                    type="button"
                    className="spatial-search-result"
                    onClick={() => handleSelectSearchResult(item)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {item.kind !== "scheme" ? (
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
                      {searchKindLabel(item.kind)}
                    </span>
                  </button>
                ))}
                {isRemoteSearchLoading && (
                  <p className="spatial-search-status" role="status">{lang === "gu" ? "ગુજરાતનાં ગામ અને શહેર શોધી રહ્યા છીએ…" : lang === "hi" ? "गुजरात के गाँव और शहर खोज रहे हैं…" : "Searching Gujarat villages and cities…"}</p>
                )}
                {searchQuery.trim().length >= 2 && remoteSearchErrorQuery === searchQuery.trim() && (
                  <p className="spatial-search-status spatial-search-status--error" role="alert">{lang === "gu" ? "ગામ શોધી શકાયું નથી. ફરી પ્રયાસ કરો અથવા નકશાની તાલુકાવાર યાદી વાપરો." : lang === "hi" ? "गाँव खोजा नहीं जा सका। फिर कोशिश करें या नक्शे की तालुका सूची देखें।" : "Village search is unavailable. Retry or use the taluka list on the map."}</p>
                )}
                {filteredSearchResults.length === 0 && !isRemoteSearchLoading && remoteSearchErrorQuery !== searchQuery.trim() && (
                  <p className="spatial-search-empty" role="status">
                    {lang === "gu" ? "મેળ ન મળ્યો. નામના 2 અક્ષર અથવા LGD code લખો." : lang === "hi" ? "कोई मेल नहीं मिला। नाम के 2 अक्षर या LGD code लिखें।" : "No match. Enter two or more name characters or an LGD code."}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Drishti Sahayak Assistant */}
      <DrishtiAISahayak
        key={lang}
        gu={gu}
        lang={lang}
        onNavigate={(page, searchTerm) => {
          if (page === "portal" || page === "public" || page === "wizard") setActiveKey("wizard");
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
    </MotionConfig>
  );
}
