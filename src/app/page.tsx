"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Sidebar, type PageKey } from "@/components/layout/Sidebar";
import { Topbar, type GlobalSearchItem } from "@/components/layout/Topbar";
import { OverviewView } from "@/components/pages/OverviewView";
import { MapExplorerView } from "@/components/pages/MapExplorerView";
import { DistrictIntelligenceView } from "@/components/pages/DistrictIntelligenceView";
import { TalukaIntelligenceView } from "@/components/pages/TalukaIntelligenceView";
import { VillageIntelligenceView } from "@/components/pages/VillageIntelligenceView";
import { SchemesView } from "@/components/pages/SchemesView";
import { BeneficiaryAnalyticsView } from "@/components/pages/BeneficiaryAnalyticsView";
import { FinancialIntelligenceView } from "@/components/pages/FinancialIntelligenceView";
import { AnalyticsComparisonView } from "@/components/pages/AnalyticsComparisonView";
import { ReportsCenterView } from "@/components/pages/ReportsCenterView";
import { DataManagementView } from "@/components/pages/DataManagementView";
import { AdministrationView } from "@/components/pages/AdministrationView";
import { SystemMonitoringView } from "@/components/pages/SystemMonitoringView";
import { PublicPortalView } from "@/components/pages/PublicPortalView";
import { demoDistricts, demoSchemes, type District } from "@/lib/demo-data";
import { GHOGHA_48_VILLAGES, MASTER_SUBDISTRICTS } from "@/lib/master-hierarchy";
import { ShieldCheck } from "lucide-react";

export default function HomePage() {
  const [lang, setLang] = useState<"gu" | "en">("gu");
  const [currentPage, setCurrentPage] = useState<PageKey>("overview");
  const [selectedDistrict, setSelectedDistrict] = useState<District>(
    () => demoDistricts.find((d) => d.id === "bhavnagar") || demoDistricts[0]
  );
  const [talukaDistrictId, setTalukaDistrictId] = useState("bhavnagar");
  const [talukaSearchTerm, setTalukaSearchTerm] = useState("");
  const [schemeSearchTerm, setSchemeSearchTerm] = useState("");
  const [villageSelection, setVillageSelection] = useState({ districtId: "bhavnagar", subdistrictCode: 3855, villageCode: "516307" });
  const [fy, setFy] = useState<string>("2025–26");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mapFocusRequest, setMapFocusRequest] = useState<{ id: number; target: GlobalSearchItem } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mapFocusSequence = useRef(0);

  const searchItems = useMemo<GlobalSearchItem[]>(() => [
    ...demoDistricts.map((district) => ({
      id: district.id,
      label: lang === "gu" ? district.gu : district.name,
      detail: `${lang === "gu" ? district.regionGu : district.region} · ${lang === "gu" ? "જિલ્લો" : "District"}`,
      kind: "district" as const,
      districtId: district.id,
      aliases: [district.name, district.gu, district.code],
    })),
    ...MASTER_SUBDISTRICTS.map((taluka) => ({
      id: String(taluka.code),
      label: lang === "gu" ? taluka.nameGu : taluka.nameEn,
      detail: `${lang === "gu" ? taluka.districtNameGu : taluka.districtNameEn} · LGD ${taluka.code}`,
      kind: "taluka" as const,
      districtId: taluka.districtId,
      subdistrictCode: taluka.code,
      aliases: [taluka.nameEn, taluka.nameGu, String(taluka.code)],
    })),
    ...GHOGHA_48_VILLAGES.map((village) => ({
      id: village.code,
      label: lang === "gu" ? village.nameGu : village.nameEn,
      detail: lang === "gu" ? "ઘોઘા તાલુકો · ભાવનગર" : "Ghogha Taluka · Bhavnagar",
      kind: "village" as const,
      districtId: "bhavnagar",
      subdistrictCode: 3855,
      villageCode: village.code,
      aliases: [village.nameEn, village.nameGu, village.code],
    })),
    ...demoSchemes.map((scheme) => ({
      id: scheme.id,
      label: lang === "gu" ? scheme.gu : scheme.name,
      detail: `${lang === "gu" ? scheme.departmentGu : scheme.department} · ${lang === "gu" ? "યોજના" : "Scheme"}`,
      kind: "scheme" as const,
      aliases: [scheme.name, scheme.gu, scheme.shortName, scheme.shortNameGu],
    })),
  ], [lang]);

  // Global Ctrl+K Shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleDistrictSelect = (d: District) => {
    setSelectedDistrict(d);
  };

  const navigate = (page: PageKey) => {
    if (page !== "talukas") setTalukaSearchTerm("");
    if (page !== "schemes") setSchemeSearchTerm("");
    setCurrentPage(page);
  };

  const handleSearchSelect = (item: GlobalSearchItem) => {
    setSearchQuery("");
    mapFocusSequence.current += 1;
    setMapFocusRequest({ id: mapFocusSequence.current, target: item });
    navigate("map");
  };

  return (
    <div className="app-shell-gov">
      {/* 1. Global Navigation Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={navigate}
        gu={lang === "gu"}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* 2. Main Area */}
      <div className="main-content-area">
        {/* Topbar Header */}
        <Topbar
          currentPage={currentPage}
          gu={lang === "gu"}
          onToggleLanguage={() => setLang((l) => (l === "gu" ? "en" : "gu"))}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchInputRef={searchInputRef}
          selectedFy={fy}
          onFyChange={setFy}
          searchItems={searchItems}
          onSearchSelect={handleSearchSelect}
        />

        {/* Viewport Content */}
        <main className={"content-viewport" + (currentPage === "map" ? " map-explorer-viewport" : "")}>
          {currentPage === "overview" && (
            <OverviewView
              gu={lang === "gu"}
              fy={fy}
              onNavigate={navigate}
              onSelectDistrict={handleDistrictSelect}
              searchQuery={searchQuery}
            />
          )}

          {currentPage === "map" && (
            <MapExplorerView
              key={mapFocusRequest?.id ?? "map-default"}
              gu={lang === "gu"}
              fy={fy}
              focusRequest={mapFocusRequest}
            />
          )}

          {currentPage === "districts" && (
            <DistrictIntelligenceView
              gu={lang === "gu"}
              fy={fy}
              selectedDistrict={selectedDistrict}
              onSelectDistrict={handleDistrictSelect}
              onNavigateToTalukas={() => {
                setTalukaDistrictId(selectedDistrict.id);
                navigate("talukas");
              }}
            />
          )}

          {currentPage === "talukas" && (
            <TalukaIntelligenceView
              gu={lang === "gu"}
              fy={fy}
              initialDistrictId={talukaDistrictId}
              initialSearchTerm={talukaSearchTerm}
              onNavigateToVillages={(districtId, subdistrictCode) => {
                setVillageSelection({ districtId, subdistrictCode, villageCode: "" });
                navigate("villages");
              }}
            />
          )}

          {currentPage === "villages" && (
            <VillageIntelligenceView
              gu={lang === "gu"}
              fy={fy}
              initialVillageCode={villageSelection.villageCode}
              initialDistrictId={villageSelection.districtId}
              initialSubdistrictCode={villageSelection.subdistrictCode}
            />
          )}

          {currentPage === "schemes" && (
            <SchemesView
              gu={lang === "gu"}
              fy={fy}
              initialSearchTerm={schemeSearchTerm}
            />
          )}

          {currentPage === "beneficiaries" && (
            <BeneficiaryAnalyticsView
              gu={lang === "gu"}
              fy={fy}
            />
          )}

          {currentPage === "financials" && (
            <FinancialIntelligenceView
              gu={lang === "gu"}
              fy={fy}
            />
          )}

          {currentPage === "analytics" && (
            <AnalyticsComparisonView
              gu={lang === "gu"}
              fy={fy}
            />
          )}

          {currentPage === "reports" && (
            <ReportsCenterView
              gu={lang === "gu"}
              fy={fy}
            />
          )}

          {currentPage === "data" && (
            <DataManagementView
              gu={lang === "gu"}
            />
          )}

          {currentPage === "admin" && (
            <AdministrationView
              gu={lang === "gu"}
            />
          )}

          {currentPage === "monitoring" && (
            <SystemMonitoringView
              gu={lang === "gu"}
            />
          )}

          {currentPage === "public" && (
            <PublicPortalView
              gu={lang === "gu"}
            />
          )}

          {/* Official Footer */}
          <footer className="footer-gov">
            <div className="footer-content-wrap">
              <span>
                © 2026 યોજના દૃષ્ટિ (Yojana Drishti) ·{" "}
                {lang === "gu"
                  ? "ગુજરાત સરકાર મહિલા અને બાળ કલ્યાણ ભૂ-માહિતી પ્રણાલી"
                  : "Gujarat Government Scheme Geo-Intelligence Platform"}
              </span>
              <span className="footer-privacy-line">
                <ShieldCheck size={14} className="text-teal" />
                {lang === "gu"
                  ? "DPDP કાયદો ૨૦૨૩ હેઠળ સુરક્ષિત · કોઈ વ્યક્તિગત લાભાર્થી ડેટા જાહેર થતો નથી"
                  : "Governed by DPDP Act 2023 · Aggregate statistics only, no PII stored"}
              </span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
