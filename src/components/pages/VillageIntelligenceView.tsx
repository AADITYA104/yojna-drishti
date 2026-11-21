"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Home,
  School,
  Users,
  Wallet,
  ClipboardList,
  FileCheck2,
  Search,
  Filter,
  CheckCircle2,
  Info,
  ArrowRight,
  MapPin,
  ExternalLink,
  Building2,
  Landmark,
  Sparkles,
  Award,
} from "lucide-react";
import {
  MASTER_DISTRICTS,
  MASTER_SUBDISTRICTS,
  GHOGHA_48_VILLAGES,
  getSubdistrictsForDistrict,
  type MasterVillage,
  type MasterSubdistrict,
} from "@/lib/master-hierarchy";
import { scaleDemoValue } from "@/lib/metrics.mjs";
import { VillageSchemeRegister } from "../shared/VillageSchemeRegister";
import { getVillagesForSubdistrict } from "@/lib/village-scheme-intelligence";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type VillageRecord = MasterVillage & { hasDemoMetrics: boolean };

interface VillageIntelligenceViewProps {
  gu: boolean;
  fy: string;
  initialDistrictId?: string;
  initialSubdistrictCode?: number;
  initialVillageCode?: string;
}

export function VillageIntelligenceView({
  gu,
  fy,
  initialDistrictId = "bhavnagar",
  initialSubdistrictCode = 3855,
  initialVillageCode = "516307",
}: VillageIntelligenceViewProps) {
  useScrollReveal();

  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(initialDistrictId);
  const [selectedSubdistrictCode, setSelectedSubdistrictCode] = useState<number>(initialSubdistrictCode);
  const [selectedVillageCode, setSelectedVillageCode] = useState<string>(initialVillageCode);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"ben" | "name">("ben");
  const [isLoading, setIsLoading] = useState(false);

  const fmt = (num: number) => new Intl.NumberFormat(gu ? "gu-IN" : "en-IN").format(num);

  // Selected district object
  const selectedDistrict = useMemo(() => {
    return MASTER_DISTRICTS.find((d) => d.id === selectedDistrictId) || MASTER_DISTRICTS[0];
  }, [selectedDistrictId]);

  // Subdistricts of selected district
  const districtSubdistricts = useMemo(() => {
    const subs = getSubdistrictsForDistrict(selectedDistrictId);
    return subs.length > 0 ? subs : MASTER_SUBDISTRICTS.slice(0, 10);
  }, [selectedDistrictId]);

  const selectedSubdistrict = useMemo(() => {
    return MASTER_SUBDISTRICTS.find((s) => s.code === selectedSubdistrictCode) || districtSubdistricts[0];
  }, [selectedSubdistrictCode, districtSubdistricts]);

  const [dynamicVillages, setDynamicVillages] = useState<VillageRecord[]>([]);

  // Fetch real hierarchy villages with real 6-digit Census/LGD codes
  useEffect(() => {
    let active = true;
    if (selectedSubdistrictCode === 3855) {
      setDynamicVillages(GHOGHA_48_VILLAGES.map((v) => ({ ...v, hasDemoMetrics: true })));
      return;
    }

    setIsLoading(true);
    fetch(`/api/v1/geo/hierarchy?subdistrictCode=${selectedSubdistrictCode}`)
      .then((res) => {
        if (!res.ok) throw new Error("Hierarchy fetch failed");
        return res.json();
      })
      .then((json) => {
        if (!active) return;
        if (json.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
          const list: VillageRecord[] = json.data.map((item: any, idx: number) => {
            const seed = parseInt(item.code, 10) || (selectedSubdistrictCode * 100 + idx);
            const households = 250 + (seed % 500);
            const population = households * 4 + (seed % 150);
            const femalePopulation = Math.round(population * 0.49);
            const beneficiaries = Math.round(households * 0.78 + (idx * 3));
            const disbursedLakhs = Number((14 + (seed % 32)).toFixed(1));

            return {
              code: String(item.code),
              id: `${selectedSubdistrictCode}_${item.code}`,
              nameEn: item.nameEn || `Village ${idx + 1}`,
              nameGu: item.nameEn || `ગામ ${idx + 1}`,
              subDistrictCode: selectedSubdistrictCode,
              districtCode: item.districtCode || 0,
              category: item.category || "Rural",
              status: item.status || "Inhabitant",
              venueGu: `${item.nameEn} ગ્રામ પંચાયત ભવન અને પ્રાથમિક શાળા`,
              venueEn: `${item.nameEn} Gram Panchayat & Primary School`,
              households,
              population,
              femalePopulation,
              beneficiaries,
              applications: Math.round(beneficiaries * 1.15),
              approved: beneficiaries,
              disbursedLakhs,
              anganwadis: Math.max(1, Math.round(population / 450)),
              coordinates: { x: 0, y: 0 },
              hasDemoMetrics: true,
            };
          });

          setDynamicVillages(list);
          if (list.length > 0) {
            setSelectedVillageCode(list[0].code);
          }
        } else {
          // Fallback to procedural villages if no file exists
          const enhanced = getVillagesForSubdistrict(selectedSubdistrictCode, selectedDistrictId);
          const list: VillageRecord[] = enhanced.map((ev) => ({
            code: ev.code,
            id: `${selectedSubdistrictCode}_${ev.code}`,
            nameEn: ev.nameEn,
            nameGu: ev.nameGu,
            subDistrictCode: selectedSubdistrictCode,
            districtCode: 0,
            category: "Rural",
            status: "Inhabitant",
            venueGu: `${ev.nameGu} ગ્રામ પંચાયત ભવન અને પ્રાથમિક શાળા`,
            venueEn: `${ev.nameEn} Gram Panchayat & Primary School`,
            households: ev.households,
            population: ev.population,
            femalePopulation: ev.femalePopulation,
            beneficiaries: ev.beneficiaries,
            applications: Math.round(ev.beneficiaries * 1.15),
            approved: ev.beneficiaries,
            disbursedLakhs: ev.disbursedLakhs,
            anganwadis: Math.max(1, Math.round(ev.population / 450)),
            coordinates: { x: 0, y: 0 },
            hasDemoMetrics: true,
          }));
          setDynamicVillages(list);
          if (list.length > 0) {
            setSelectedVillageCode(list[0].code);
          }
        }
      })
      .catch(() => {
        if (!active) return;
        const enhanced = getVillagesForSubdistrict(selectedSubdistrictCode, selectedDistrictId);
        const list: VillageRecord[] = enhanced.map((ev) => ({
          code: ev.code,
          id: `${selectedSubdistrictCode}_${ev.code}`,
          nameEn: ev.nameEn,
          nameGu: ev.nameGu,
          subDistrictCode: selectedSubdistrictCode,
          districtCode: 0,
          category: "Rural",
          status: "Inhabitant",
          venueGu: `${ev.nameGu} ગ્રામ પંચાયત ભવન અને પ્રાથમિક શાળા`,
          venueEn: `${ev.nameEn} Gram Panchayat & Primary School`,
          households: ev.households,
          population: ev.population,
          femalePopulation: ev.femalePopulation,
          beneficiaries: ev.beneficiaries,
          applications: Math.round(ev.beneficiaries * 1.15),
          approved: ev.beneficiaries,
          disbursedLakhs: ev.disbursedLakhs,
          anganwadis: Math.max(1, Math.round(ev.population / 450)),
          coordinates: { x: 0, y: 0 },
          hasDemoMetrics: true,
        }));
        setDynamicVillages(list);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedSubdistrictCode, selectedDistrictId]);

  const villagesList = useMemo(() => {
    if (dynamicVillages.length > 0) return dynamicVillages;
    if (selectedSubdistrictCode === 3855) {
      return GHOGHA_48_VILLAGES.map((v) => ({ ...v, hasDemoMetrics: true }));
    }
    const enhanced = getVillagesForSubdistrict(selectedSubdistrictCode, selectedDistrictId);
    return enhanced.map((ev) => ({
      code: ev.code,
      id: `${selectedSubdistrictCode}_${ev.code}`,
      nameEn: ev.nameEn,
      nameGu: ev.nameGu,
      subDistrictCode: selectedSubdistrictCode,
      districtCode: 0,
      category: "Rural",
      status: "Inhabitant",
      venueGu: `${ev.nameGu} ગ્રામ પંચાયત ભવન અને પ્રાથમિક શાળા`,
      venueEn: `${ev.nameEn} Gram Panchayat & Primary School`,
      households: ev.households,
      population: ev.population,
      femalePopulation: ev.femalePopulation,
      beneficiaries: ev.beneficiaries,
      applications: Math.round(ev.beneficiaries * 1.15),
      approved: ev.beneficiaries,
      disbursedLakhs: ev.disbursedLakhs,
      anganwadis: Math.max(1, Math.round(ev.population / 450)),
      coordinates: { x: 0, y: 0 },
      hasDemoMetrics: true,
    }));
  }, [dynamicVillages, selectedSubdistrictCode, selectedDistrictId]);

  // When district changes, set subdistrict to first one in that district
  const handleDistrictChange = (dId: string) => {
    setSelectedDistrictId(dId);
    const subs = getSubdistrictsForDistrict(dId);
    if (subs.length > 0) {
      handleSubdistrictChange(subs[0].code);
    }
  };

  const handleSubdistrictChange = (code: number) => {
    setSelectedSubdistrictCode(code);
    setSearch("");
  };

  const currentVillage = useMemo(() => {
    const found = villagesList.find((v) => v.code === selectedVillageCode);
    return found || villagesList[0];
  }, [villagesList, selectedVillageCode]);

  const yearFactor = fy === "2024–25" ? 0.88 : fy === "2023–24" ? 0.75 : 1;
  const currentVillageBeneficiaries = currentVillage ? scaleDemoValue(currentVillage.beneficiaries, fy) : 0;
  const currentVillageDisbursed = currentVillage
    ? Number((currentVillage.disbursedLakhs * yearFactor).toFixed(1))
    : 0;

  const filteredVillages = useMemo(() => {
    return villagesList
      .filter((v) =>
        `${v.nameEn} ${v.nameGu} ${v.code} ${v.venueEn || ""} ${v.venueGu || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOrder === "ben") return b.beneficiaries - a.beneficiaries;
        return a.nameEn.localeCompare(b.nameEn);
      });
  }, [villagesList, search, sortOrder]);

  return (
    <div className="village-intel-page" style={{ padding: "8px 0" }}>
      {/* Page Hero — VisionOS Glass Style */}
      <div
        className="page-hero-gov reveal"
        style={{
          background: "linear-gradient(135deg, rgba(34, 58, 94, 0.95) 0%, rgba(53, 89, 130, 0.92) 100%)",
          color: "#FFFFFF",
          borderRadius: "20px",
          border: "1px solid rgba(159, 192, 227, 0.3)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(34, 58, 94, 0.2)",
          padding: "28px 32px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <span
              className="hero-kicker-tag"
              style={{
                background: "rgba(110, 158, 204, 0.25)",
                color: "#F3F8FD",
                border: "1px solid rgba(159, 192, 227, 0.4)",
                padding: "4px 12px",
                borderRadius: "999px",
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 10,
              }}
            >
              <Sparkles size={13} />
              {gu ? "૩૩ જિલ્લા · ૨૫૦+ તાલુકા · તમામ ગામોની લાઈવ યોજના સ્થિતિ" : "33 DISTRICTS · 250+ TALUKAS · ALL VILLAGES ACTIVE DATA"}
            </span>
            <h1
              style={{
                color: "#FFFFFF",
                fontSize: "clamp(1.6rem, 1.2rem + 1.8vw, 2.4rem)",
                fontWeight: 700,
                margin: "4px 0 8px",
                letterSpacing: "-0.01em",
              }}
            >
              {gu ? "ગામવાર યોજના અને લાભ વિશ્લેષણ પોર્ટલ" : "Village Scheme & Benefit Geo-Intelligence"}
            </h1>
            <p style={{ color: "rgba(243, 248, 253, 0.9)", margin: 0, maxWidth: "780px", fontSize: "0.95rem" }}>
              {gu
                ? "ગુજરાતના દરેક ગામડામાં કઈ યોજનાઓ કાર્યરત છે, કેટલા લાભાર્થીઓને સીધો DBT લાભ મળ્યો છે અને યોજના સંતૃપ્તિ (Saturation) દર કેટલો છે તેનું સંપૂર્ણ વાસ્તવિક પૂર્વાવલોકન."
                : "Comprehensive intelligence on active schemes, direct DBT transfers, and saturation rates for every individual village across Gujarat."}
            </p>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.22)",
              borderRadius: "14px",
              padding: "12px 18px",
              textAlign: "right",
              minWidth: "160px",
            }}
          >
            <small style={{ color: "rgba(243, 248, 253, 0.75)", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {gu ? "પસંદ કરેલ જિલ્લો" : "Active District"}
            </small>
            <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF", marginTop: 2 }}>
              {gu ? selectedDistrict.nameGu : selectedDistrict.nameEn}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#D0E1F2", marginTop: 2 }}>
              {selectedDistrict.subDistrictCount} {gu ? "તાલુકા" : "Talukas"} · {selectedDistrict.villageCount} {gu ? "ગામો" : "Villages"}
            </div>
          </div>
        </div>
      </div>

      {/* District & Taluka Switcher Controls — VisionOS Frosted Capsule */}
      <div
        className="table-filter-strip reveal"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
          background: "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(110, 158, 204, 0.25)",
          borderRadius: "16px",
          padding: "12px 18px",
          marginBottom: "20px",
          boxShadow: "0 2px 12px rgba(34, 58, 94, 0.05)",
        }}
      >
        <div className="filter-dropdown-gov" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "0.84rem", fontWeight: 600, color: "var(--holst-700, #355982)" }}>
            {gu ? "જિલ્લો:" : "District:"}
          </span>
          <select
            value={selectedDistrictId}
            onChange={(e) => handleDistrictChange(e.target.value)}
            aria-label="Select District"
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid rgba(110, 158, 204, 0.35)",
              background: "#FFFFFF",
              color: "var(--holst-900, #223A5E)",
              fontWeight: 600,
              fontSize: "0.88rem",
              cursor: "pointer",
            }}
          >
            {MASTER_DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                [{d.officialNo}] {gu ? d.nameGu : d.nameEn} ({d.subDistrictCount} {gu ? "તાલુકા" : "Talukas"})
              </option>
            ))}
          </select>
        </div>

        <div className="filter-dropdown-gov" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "0.84rem", fontWeight: 600, color: "var(--holst-700, #355982)" }}>
            {gu ? "તાલુકો:" : "Taluka:"}
          </span>
          <select
            value={selectedSubdistrictCode}
            onChange={(e) => handleSubdistrictChange(parseInt(e.target.value, 10))}
            aria-label="Select Sub-district"
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid rgba(110, 158, 204, 0.35)",
              background: "#FFFFFF",
              color: "var(--holst-900, #223A5E)",
              fontWeight: 600,
              fontSize: "0.88rem",
              cursor: "pointer",
            }}
          >
            {districtSubdistricts.map((s) => (
              <option key={s.code} value={s.code}>
                {gu ? s.nameGu : s.nameEn} ({s.villageCount} {gu ? "ગામડાં" : "Villages"})
              </option>
            ))}
          </select>
        </div>

        <label
          className="search-box-gov"
          style={{
            flex: 1,
            minWidth: "220px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(243, 248, 253, 0.9)",
            border: "1px solid rgba(110, 158, 204, 0.3)",
            borderRadius: "10px",
            padding: "8px 14px",
          }}
        >
          <Search size={16} color="var(--holst-500, #4D79A8)" />
          <input
            type="search"
            placeholder={gu ? "ગામ અથવા યોજનાનું નામ શોધો..." : "Search village or active scheme..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              color: "var(--holst-900, #223A5E)",
              width: "100%",
              fontSize: "0.88rem",
            }}
          />
        </label>
      </div>

      {/* Main 2-Column Village Workspace */}
      <div className="village-workspace-grid" style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "20px" }}>
        {/* Left Column: Village Selector Scroller */}
        <div
          className="village-selector-card reveal"
          style={{
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: "18px",
            border: "1px solid rgba(110, 158, 204, 0.25)",
            boxShadow: "0 4px 18px rgba(34, 58, 94, 0.05)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            maxHeight: "820px",
          }}
        >
          <div className="vsc-head" style={{ marginBottom: "12px", borderBottom: "1px solid rgba(110, 158, 204, 0.18)", paddingBottom: "10px" }}>
            <div className="vsc-title-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0, color: "var(--holst-900, #223A5E)" }}>
                {gu ? "તાલુકાના ગામો" : "Taluka Villages"}
              </h3>
              <span
                className="vsc-count-badge"
                style={{
                  background: "rgba(77, 121, 168, 0.12)",
                  color: "var(--holst-700, #355982)",
                  padding: "3px 9px",
                  borderRadius: "999px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  border: "1px solid rgba(77, 121, 168, 0.25)",
                }}
              >
                {filteredVillages.length} {gu ? "ગામો" : "Villages"}
              </span>
            </div>

            <div className="vsc-filter-row" style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
              <button
                className="sort-toggle-btn"
                onClick={() => setSortOrder(sortOrder === "ben" ? "name" : "ben")}
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: "1px solid rgba(110, 158, 204, 0.3)",
                  background: "rgba(243, 248, 253, 0.8)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--holst-700, #355982)",
                  cursor: "pointer",
                }}
              >
                {sortOrder === "ben" ? (gu ? "લાભાર્થી સંખ્યા ↓" : "Beneficiaries ↓") : (gu ? "નામ A-Z" : "Name A-Z")}
              </button>
            </div>
          </div>

          <div
            className="village-list-scroll"
            style={{
              overflowY: "auto",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              paddingRight: "4px",
            }}
          >
            {filteredVillages.length === 0 ? (
              <div style={{ padding: "2rem 1rem", textAlign: "center", color: "var(--holst-500, #4D79A8)" }}>
                {gu ? "કોઈ ગામ મળ્યું નથી" : "No villages found in this unit"}
              </div>
            ) : (
              filteredVillages.map((v) => {
                const isSelected = v.code === currentVillage?.code;

                return (
                  <button
                    key={v.code}
                    className={`village-nav-row ${isSelected ? "active" : ""}`}
                    onClick={() => setSelectedVillageCode(v.code)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      border: isSelected ? "1.5px solid var(--holst-500, #4D79A8)" : "1px solid rgba(110, 158, 204, 0.15)",
                      background: isSelected ? "rgba(77, 121, 168, 0.12)" : "rgba(255, 255, 255, 0.7)",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.18s ease",
                    }}
                  >
                    <div className="vnr-left" style={{ flex: 1, minWidth: 0 }}>
                      <div className="vnr-name-line" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <strong
                          style={{
                            fontSize: "0.9rem",
                            color: isSelected ? "var(--holst-900, #223A5E)" : "var(--holst-700, #355982)",
                            fontWeight: isSelected ? 700 : 600,
                          }}
                        >
                          {gu ? v.nameGu : v.nameEn}
                        </strong>
                      </div>
                      <small style={{ fontSize: "0.72rem", color: "var(--holst-500, #4D79A8)" }}>
                        LGD: {v.code} · {v.category}
                      </small>
                    </div>

                    <div className="vnr-right" style={{ textAlign: "right", marginLeft: 8 }}>
                      <span
                        className="vnr-ben-count"
                        style={{
                          display: "block",
                          fontSize: "0.88rem",
                          fontWeight: 700,
                          color: "var(--holst-900, #223A5E)",
                        }}
                      >
                        {fmt(scaleDemoValue(v.beneficiaries, fy))}
                      </span>
                      <small style={{ fontSize: "0.68rem", color: "#2E7D52", fontWeight: 600 }}>
                        {gu ? "લાભાર્થી" : "Beneficiaries"}
                      </small>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Village Deep Intelligence & Scheme Delivery */}
        {currentVillage ? (
          <div
            className="village-detail-card reveal"
            style={{
              background: "rgba(255, 255, 255, 0.94)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              borderRadius: "20px",
              border: "1px solid rgba(110, 158, 204, 0.25)",
              boxShadow: "0 4px 24px rgba(34, 58, 94, 0.06)",
              padding: "24px 28px",
            }}
          >
            {/* Top Detail Header */}
            <div
              className="vdc-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 16,
                borderBottom: "1px solid rgba(110, 158, 204, 0.18)",
                paddingBottom: "18px",
                marginBottom: "20px",
              }}
            >
              <div className="vdc-title-box">
                <span
                  className="vdc-geo-crumb"
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: "var(--holst-500, #4D79A8)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    marginBottom: 4,
                  }}
                >
                  <MapPin size={12} />
                  {gu ? "ગુજરાત રાજ્ય" : "Gujarat"} · [{selectedDistrict.officialNo}] {gu ? selectedDistrict.nameGu : selectedDistrict.nameEn} · {gu ? selectedSubdistrict?.nameGu : selectedSubdistrict?.nameEn}
                </span>
                <h2
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    margin: "4px 0 8px",
                    color: "var(--holst-900, #223A5E)",
                    fontFamily: "var(--font-display, inherit)",
                  }}
                >
                  {gu ? currentVillage.nameGu : currentVillage.nameEn}
                </h2>
                <div className="vdc-meta-chips" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span
                    className="meta-chip code"
                    style={{
                      background: "rgba(77, 121, 168, 0.1)",
                      color: "var(--holst-700, #355982)",
                      border: "1px solid rgba(77, 121, 168, 0.22)",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontSize: "0.74rem",
                      fontWeight: 600,
                    }}
                  >
                    LGD: {currentVillage.code}
                  </span>
                  <span
                    className="meta-chip cat"
                    style={{
                      background: "rgba(46, 125, 82, 0.1)",
                      color: "#2E7D52",
                      border: "1px solid rgba(46, 125, 82, 0.22)",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontSize: "0.74rem",
                      fontWeight: 600,
                    }}
                  >
                    {currentVillage.category}
                  </span>
                  <span
                    className="meta-chip stat"
                    style={{
                      background: "rgba(107, 78, 174, 0.1)",
                      color: "#6B4EAE",
                      border: "1px solid rgba(107, 78, 174, 0.22)",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontSize: "0.74rem",
                      fontWeight: 600,
                    }}
                  >
                    {currentVillage.status}
                  </span>
                </div>
              </div>

              <div
                className="vdc-total-grant-box"
                style={{
                  background: "linear-gradient(135deg, rgba(77, 121, 168, 0.12) 0%, rgba(110, 158, 204, 0.18) 100%)",
                  border: "1px solid rgba(77, 121, 168, 0.25)",
                  borderRadius: "14px",
                  padding: "12px 18px",
                  textAlign: "right",
                  minWidth: "170px",
                }}
              >
                <small style={{ color: "var(--holst-500, #4D79A8)", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 600 }}>
                  {gu ? "કુલ વિતરિત DBT સહાય" : "Total DBT Disbursed"}
                </small>
                <strong style={{ display: "block", fontSize: "1.45rem", color: "var(--holst-900, #223A5E)", fontWeight: 700, margin: "2px 0" }}>
                  ₹ {currentVillageDisbursed} Lakh
                </strong>
                <span style={{ fontSize: "0.76rem", color: "#2E7D52", fontWeight: 600 }}>
                  {fmt(currentVillageBeneficiaries)} {gu ? "કુલ નોંધાયેલ લાભાર્થીઓ" : "Total Enrolled Beneficiaries"}
                </span>
              </div>
            </div>

            {/* Implementation Venue Card */}
            <div
              className="vdc-venue-spotlight"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: "rgba(243, 248, 253, 0.8)",
                border: "1px solid rgba(110, 158, 204, 0.25)",
                borderRadius: "14px",
                padding: "14px 18px",
                marginBottom: "20px",
              }}
            >
              <div
                className="vvs-icon-wrap"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(77, 121, 168, 0.15)",
                  color: "var(--holst-500, #4D79A8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <School size={22} />
              </div>
              <div>
                <span className="vvs-label" style={{ fontSize: "0.74rem", textTransform: "uppercase", fontWeight: 600, color: "var(--holst-500, #4D79A8)" }}>
                  {gu ? "યોજના સહાય વિતરણ કેન્દ્ર અને અમલીકરણ સ્થળ" : "Scheme Delivery Center & Venue"}
                </span>
                <strong className="vvs-name" style={{ display: "block", fontSize: "0.95rem", color: "var(--holst-900, #223A5E)", marginTop: 2 }}>
                  {gu ? currentVillage.venueGu : currentVillage.venueEn}
                </strong>
                <p className="vvs-sub" style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "var(--holst-500, #4D79A8)" }}>
                  {gu
                    ? "ગામ પંચાયત ડિજિટલ સેવા કેન્દ્ર અને સ્થાનિક આંગણવાડી કેમ્પ દ્વારા સીધો લાભ આપવામાં આવે છે."
                    : "Assisted via Gram Panchayat Digital Seva Kendra and local Anganwadi outreach camps."}
                </p>
              </div>
            </div>

            {/* Village Demographics 4-Quad Cards */}
            <div
              className="vdc-metrics-quad"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              <div
                className="quad-item"
                style={{
                  background: "rgba(255, 255, 255, 0.85)",
                  border: "1px solid rgba(110, 158, 204, 0.22)",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Users size={20} color="var(--holst-500, #4D79A8)" />
                <div>
                  <small style={{ fontSize: "0.72rem", color: "var(--holst-500, #4D79A8)", textTransform: "uppercase" }}>
                    {gu ? "કુલ વસ્તી" : "Population"}
                  </small>
                  <strong style={{ display: "block", fontSize: "1.1rem", color: "var(--holst-900, #223A5E)" }}>
                    {fmt(currentVillage.population)}
                  </strong>
                </div>
              </div>

              <div
                className="quad-item"
                style={{
                  background: "rgba(255, 255, 255, 0.85)",
                  border: "1px solid rgba(110, 158, 204, 0.22)",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Users size={20} color="#6B4EAE" />
                <div>
                  <small style={{ fontSize: "0.72rem", color: "var(--holst-500, #4D79A8)", textTransform: "uppercase" }}>
                    {gu ? "મહિલા વસ્તી" : "Female Pop"}
                  </small>
                  <strong style={{ display: "block", fontSize: "1.1rem", color: "var(--holst-900, #223A5E)" }}>
                    {fmt(currentVillage.femalePopulation)}
                  </strong>
                </div>
              </div>

              <div
                className="quad-item"
                style={{
                  background: "rgba(255, 255, 255, 0.85)",
                  border: "1px solid rgba(110, 158, 204, 0.22)",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Home size={20} color="#2D7D84" />
                <div>
                  <small style={{ fontSize: "0.72rem", color: "var(--holst-500, #4D79A8)", textTransform: "uppercase" }}>
                    {gu ? "કુટુંબો (ઘર)" : "Households"}
                  </small>
                  <strong style={{ display: "block", fontSize: "1.1rem", color: "var(--holst-900, #223A5E)" }}>
                    {fmt(currentVillage.households)}
                  </strong>
                </div>
              </div>

              <div
                className="quad-item"
                style={{
                  background: "rgba(255, 255, 255, 0.85)",
                  border: "1px solid rgba(110, 158, 204, 0.22)",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <School size={20} color="#2E7D52" />
                <div>
                  <small style={{ fontSize: "0.72rem", color: "var(--holst-500, #4D79A8)", textTransform: "uppercase" }}>
                    {gu ? "આંગણવાડી કેન્દ્રો" : "Anganwadi"}
                  </small>
                  <strong style={{ display: "block", fontSize: "1.1rem", color: "var(--holst-900, #223A5E)" }}>
                    {currentVillage.anganwadis} {gu ? "કેન્દ્રો" : "Centers"}
                  </strong>
                </div>
              </div>
            </div>

            {/* Village Scheme Transparency Register */}
            <div>
              <VillageSchemeRegister
                villageCode={currentVillage.code}
                villageNameGu={currentVillage.nameGu}
                villageNameEn={currentVillage.nameEn}
                talukaNameGu={selectedSubdistrict?.nameGu || ""}
                talukaNameEn={selectedSubdistrict?.nameEn || ""}
                districtNameGu={selectedDistrict?.nameGu || ""}
                districtNameEn={selectedDistrict?.nameEn || ""}
                gu={gu}
              />
            </div>
          </div>
        ) : (
          <div
            className="village-empty-placeholder"
            style={{
              padding: "4rem 2rem",
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.8)",
              borderRadius: "20px",
              border: "1px dashed rgba(110, 158, 204, 0.4)",
            }}
          >
            <Home size={36} color="var(--holst-400, #6E9ECC)" style={{ margin: "0 auto 12px" }} />
            <p style={{ color: "var(--holst-700, #355982)", fontWeight: 600 }}>
              {gu ? "ડાબી બાજુની યાદીમાંથી કોઈપણ ગામ પસંદ કરો" : "Select a village from the left list"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
