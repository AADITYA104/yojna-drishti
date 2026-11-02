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
  Sparkles,
  ArrowRight,
  MapPin,
  ExternalLink,
  Building2,
  Landmark,
} from "lucide-react";
import {
  MASTER_DISTRICTS,
  MASTER_SUBDISTRICTS,
  GHOGHA_48_VILLAGES,
  NOTEBOOK_WOMEN_SCHEMES,
  getSubdistrictsForDistrict,
  type MasterVillage,
  type MasterSubdistrict,
} from "@/lib/master-hierarchy";
import { scaleDemoValue } from "@/lib/metrics.mjs";
import { GHOGHA_VILLAGE_SCHEME_DEMO } from "@/lib/village-scheme-demo";

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
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(initialDistrictId);
  const [selectedSubdistrictCode, setSelectedSubdistrictCode] = useState<number>(initialSubdistrictCode);
  const [selectedVillageCode, setSelectedVillageCode] = useState<string>(initialVillageCode);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"ben" | "name">("ben");
  const [activeTab, setActiveTab] = useState<"all" | "women" | "housewife" | "entrepreneur">("all");

  const [villagesList, setVillagesList] = useState<VillageRecord[]>(GHOGHA_48_VILLAGES.map((village) => ({ ...village, hasDemoMetrics: true })));
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

  // When district changes, set subdistrict to the first one in that district
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
    if (code === 3855) {
      setVillagesList(GHOGHA_48_VILLAGES.map((village) => ({ ...village, hasDemoMetrics: true })));
      setSelectedVillageCode("516307");
      setIsLoading(false);
    } else {
      setVillagesList([]);
      setSelectedVillageCode("");
      setIsLoading(true);
    }
  };

  // Fetch or resolve villages when subdistrict changes
  useEffect(() => {
    if (selectedSubdistrictCode === 3855) return;
    const controller = new AbortController();

    fetch(`/api/v1/geo/hierarchy?subdistrictCode=${selectedSubdistrictCode}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Could not load villages.");
        return res.json();
      })
      .then((json) => {
        if (controller.signal.aborted) return;
        if (json.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
          const list: VillageRecord[] = json.data.map((item: { code: string; nameEn: string; category?: string; status?: string }) => {
            return {
              code: item.code,
              id: `${selectedSubdistrictCode}_${item.code}`,
              nameEn: item.nameEn,
              nameGu: item.nameEn,
              subDistrictCode: selectedSubdistrictCode,
              districtCode: 0,
              category: item.category || "Rural",
              status: item.status || "Inhabitant",
              venueGu: "",
              venueEn: "",
              households: 0,
              population: 0,
              femalePopulation: 0,
              beneficiaries: 0,
              applications: 0,
              approved: 0,
              disbursedLakhs: 0,
              anganwadis: 0,
              coordinates: { x: 0, y: 0 },
              hasDemoMetrics: false,
            };
          });
          setVillagesList(list);
          const requestedVillage = list.find((village) => village.code === initialVillageCode);
          if (requestedVillage) setSelectedVillageCode(requestedVillage.code);
          else if (list[0]) setSelectedVillageCode(list[0].code);
        } else {
          setVillagesList([]);
          setSelectedVillageCode("");
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setVillagesList([]);
          setSelectedVillageCode("");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [initialVillageCode, selectedSubdistrictCode]);

  const currentVillage = useMemo(() => {
    const found = villagesList.find((v) => v.code === selectedVillageCode);
    return found || villagesList[0];
  }, [villagesList, selectedVillageCode]);

  const yearFactor = fy === "2024–25" ? 0.88 : fy === "2023–24" ? 0.75 : 1;
  const currentVillageBeneficiaries = currentVillage?.hasDemoMetrics ? scaleDemoValue(currentVillage.beneficiaries, fy) : null;
  const currentVillageDisbursed = currentVillage?.hasDemoMetrics
    ? Number((currentVillage.disbursedLakhs * yearFactor).toFixed(1))
    : null;

  const filteredVillages = useMemo(() => {
    return villagesList
      .filter((v) =>
        `${v.nameEn} ${v.nameGu} ${v.code} ${v.venueEn} ${v.venueGu}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOrder === "ben" && a.hasDemoMetrics && b.hasDemoMetrics) return b.beneficiaries - a.beneficiaries;
        return a.nameEn.localeCompare(b.nameEn);
      });
  }, [villagesList, search, sortOrder]);

  const villageAssignments = currentVillage?.hasDemoMetrics
    ? GHOGHA_VILLAGE_SCHEME_DEMO[currentVillage.code] || []
    : [];
  const villageSchemes = villageAssignments
    .map((assignment) => ({
      ...assignment,
      scheme: NOTEBOOK_WOMEN_SCHEMES.find((scheme) => scheme.id === assignment.schemeId),
    }))
    .filter((assignment): assignment is typeof assignment & { scheme: (typeof NOTEBOOK_WOMEN_SCHEMES)[number] } => Boolean(assignment.scheme));

  const displayedSchemes = useMemo(() => {
    if (activeTab === "all") return villageSchemes;
    if (activeTab === "women") {
      return villageSchemes.filter(
        ({ scheme }) => scheme.notebookCategory.includes("Women") && !scheme.notebookCategory.includes("Entrepreneurs")
      );
    }
    if (activeTab === "housewife") {
      return villageSchemes.filter(({ scheme }) => scheme.notebookCategory.includes("Housewife"));
    }
    if (activeTab === "entrepreneur") {
      return villageSchemes.filter(({ scheme }) => scheme.notebookCategory.includes("Entrepreneurs"));
    }
    return villageSchemes;
  }, [activeTab, villageSchemes]);

  return (
    <div className="village-intel-page">
      {/* Page Hero */}
      <div className="page-hero-gov">
        <div>
          <span className="hero-kicker-tag">
            {gu ? "ગામ કક્ષાની યોજના માહિતી · demo records સ્પષ્ટ રીતે ચિહ્નિત" : "VILLAGE SCHEME COVERAGE · DEMO RECORDS IDENTIFIED"}
          </span>
          <h1>
            {gu ? "ગામવાર યોજના અને લાભની માહિતી" : "Village Scheme & Benefit Intelligence"}
          </h1>
          <p>
            {gu
              ? "રાજ્ય > જિલ્લો > તાલુકો > ગામ પ્રમાણે શોધો. ઘોઘાના આંકડા પ્રોટોટાઇપ માટેના ઉદાહરણ છે; યોજના કવરેજ અને સ્થળની સત્તાવાર પુષ્ટિ બાકી છે."
              : "Browse State > District > Taluka > Village. Ghogha figures are prototype examples; official scheme coverage and facility records are not yet verified."}
          </p>
        </div>
      </div>

      {/* District & Taluka Switcher Controls */}
      <div className="table-filter-strip">
        <div className="filter-dropdown-gov">
          <span>{gu ? "જિલ્લો:" : "District:"}</span>
          <select
            value={selectedDistrictId}
            onChange={(e) => handleDistrictChange(e.target.value)}
            aria-label="Select District"
          >
            {MASTER_DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                [{d.officialNo}] {gu ? d.nameGu : d.nameEn} ({d.subDistrictCount} {gu ? "તાલુકા" : "Talukas"})
              </option>
            ))}
          </select>
        </div>

        <div className="filter-dropdown-gov">
          <span>{gu ? "તાલુકો:" : "Taluka:"}</span>
          <select
            value={selectedSubdistrictCode}
            onChange={(e) => handleSubdistrictChange(parseInt(e.target.value, 10))}
            aria-label="Select Sub-district"
          >
            {districtSubdistricts.map((s) => (
              <option key={s.code} value={s.code}>
                {gu ? s.nameGu : s.nameEn} ({s.villageCount} {gu ? "ગામડાં" : "Villages"})
              </option>
            ))}
          </select>
        </div>

        <label className="search-box-gov" style={{ flex: 1 }}>
          <Search size={15} />
          <input
            type="search"
            placeholder={gu ? "ગામ અથવા સંસ્થા શોધો (દા.ત. કુડા, અવાણિયા, શાળા)..." : "Search village or venue..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>

      {/* Main 2-Column Village Workspace */}
      <div className="village-workspace-grid">
        {/* Left Column: Village Selector Scroller */}
        <div className="village-selector-card">
          <div className="vsc-head">
            <div className="vsc-title-row">
              <h3>
                {gu ? "તાલુકાના ગામો" : "Taluka Villages"}
              </h3>
              <span className="vsc-count-badge">
                {isLoading ? "..." : filteredVillages.length}
              </span>
            </div>

            <div className="vsc-filter-row">
              <button
                className="sort-toggle-btn"
                disabled={!villagesList.some((v) => v.hasDemoMetrics)}
                onClick={() => setSortOrder(sortOrder === "ben" ? "name" : "ben")}
                title={villagesList.some((v) => v.hasDemoMetrics)
                  ? (gu ? "ક્રમ બદલો" : "Change list order")
                  : (gu ? "લાભાર્થી આંકડા નથી; ગામો નામ પ્રમાણે ગોઠવેલ છે" : "No beneficiary figures; villages are listed by name")}
              >
                {sortOrder === "ben" && villagesList.some((v) => v.hasDemoMetrics)
                  ? (gu ? "Demo લાભાર્થી ↓" : "Demo beneficiaries ↓")
                  : (gu ? "નામ A-Z" : "Name A-Z")}
                
              </button>
            </div>
          </div>

          <div className="village-list-scroll">
            {isLoading ? (
              <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)" }}>
                {gu ? "ગામો લોડ થઈ રહ્યા છે..." : "Loading village records..."}
              </div>
            ) : filteredVillages.length === 0 ? (
              <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)" }}>
                {gu ? "કોઈ ગામ મળ્યું નથી" : "No villages found in this unit"}
              </div>
            ) : (
              filteredVillages.map((v) => {
                const isSelected = v.code === currentVillage?.code;
                const isKuda = v.code === "516307";

                return (
                  <button
                    key={v.code}
                    className={`village-nav-row ${isSelected ? "active" : ""} ${isKuda ? "sarvodaya-row" : ""}`}
                    onClick={() => setSelectedVillageCode(v.code)}
                  >
                    <div className="vnr-left">
                      <div className="vnr-name-line">
                        <strong>{gu ? v.nameGu : v.nameEn}</strong>
                        {isKuda && <span className="kuda-star-badge">⭐ {gu ? "નોંધપોથી" : "Pilot"}</span>}
                      </div>
                      <small className="vnr-venue-text">
                        {v.hasDemoMetrics
                          ? (gu ? "ઉદાહરણ આંકડા · સત્તાવાર નથી" : "Illustrative figures · not official")
                          : (gu ? "ગામની ઓળખ ઉપલબ્ધ" : "Village directory record")}
                      </small>
                    </div>

                    <div className="vnr-right">
                      {v.hasDemoMetrics ? (
                        <>
                          <span className="vnr-ben-count">{fmt(scaleDemoValue(v.beneficiaries, fy))}</span>
                          <small>{gu ? "ડેમો" : "Demo"}</small>
                        </>
                      ) : (
                        <small>{gu ? "આંકડા નથી" : "No stats"}</small>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Village Deep Intelligence & Scheme Delivery */}
        {currentVillage ? (
          <div className="village-detail-card">
            <div className="vdc-header">
              <div className="vdc-title-box">
                <span className="vdc-geo-crumb">
                  {gu ? "ગુજરાત રાજ્ય" : "Gujarat"} · [{selectedDistrict.officialNo}] {gu ? selectedDistrict.nameGu : selectedDistrict.nameEn} · {gu ? selectedSubdistrict?.nameGu : selectedSubdistrict?.nameEn}
                </span>
                <h2>{gu ? currentVillage.nameGu : currentVillage.nameEn}</h2>
                <div className="vdc-meta-chips">
                  <span className="meta-chip code">LGD: {currentVillage.code}</span>
                  <span className="meta-chip cat">{currentVillage.category}</span>
                  <span className="meta-chip stat">{currentVillage.status}</span>
                </div>
              </div>

              <div className="vdc-total-grant-box">
                <small>{gu ? "ગામના એકત્રિત આંકડા · ડેમો" : "Village aggregate · demo"}</small>
                <strong>{currentVillageDisbursed === null ? (gu ? "ઉપલબ્ધ નથી" : "Unavailable") : `₹ ${currentVillageDisbursed} Lakh`}</strong>
                <span>{currentVillageBeneficiaries === null ? (gu ? "સત્તાવાર માહિતી બાકી" : "Official data pending") : `${fmt(currentVillageBeneficiaries)} ${gu ? "લાભાર્થી · ડેમો" : "beneficiaries · demo"}`}</span>
              </div>
            </div>

            <div className="vdc-venue-spotlight">
              <div className="vvs-icon-wrap">
                <School size={22} />
              </div>
              <div>
                <span className="vvs-label">
                  {gu ? "યોજનાના અમલીકરણ સ્થળ" : "Scheme delivery locations"}
                </span>
                <strong className="vvs-name">{gu ? "ચકાસાયેલ સ્થળની માહિતી ઉપલબ્ધ નથી" : "Verified facility records are unavailable"}</strong>
                <p className="vvs-sub">
                  {gu
                    ? "શાળા, પંચાયત અથવા કેમ્પનું નામ સરકારી વિભાગની પુષ્ટિ પછી ઉમેરાશે."
                    : "School, panchayat, and camp names will be added after confirmation by the relevant department."}
                </p>
              </div>
            </div>

            {/* Village Demographics Grid */}
            <div className="vdc-metrics-quad">
              <div className="quad-item">
                <Users size={16} className="text-teal" />
                <div>
                  <small>{gu ? "કુલ વસ્તી" : "Population"}</small>
                  <strong>{currentVillage.hasDemoMetrics ? fmt(currentVillage.population) : "—"}</strong>
                </div>
              </div>

              <div className="quad-item">
                <Users size={16} className="text-amber" />
                <div>
                  <small>{gu ? "મહિલા વસ્તી" : "Female Pop"}</small>
                  <strong>{currentVillage.hasDemoMetrics ? fmt(currentVillage.femalePopulation) : "—"}</strong>
                </div>
              </div>

              <div className="quad-item">
                <Home size={16} className="text-blue" />
                <div>
                  <small>{gu ? "કુટુંબો (ઘર)" : "Households"}</small>
                  <strong>{currentVillage.hasDemoMetrics ? fmt(currentVillage.households) : "—"}</strong>
                </div>
              </div>

              <div className="quad-item">
                <School size={16} className="text-green" />
                <div>
                  <small>{gu ? "આંગણવાડી કેન્દ્રો" : "Anganwadi Centers"}</small>
                  <strong>{currentVillage.hasDemoMetrics ? `${currentVillage.anganwadis} ${gu ? "કેન્દ્રો" : "Centers"}` : "—"}</strong>
                </div>
              </div>
            </div>

            {/* Notebook Scheme Category Filter Buttons */}
            <div className="vdc-scheme-tabs-row">
              <button
                className={`scheme-tab-btn ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                {gu ? "આ ગામની યોજનાઓ" : `Village schemes (${villageSchemes.length})`}
              </button>
              <button
                className={`scheme-tab-btn ${activeTab === "women" ? "active" : ""}`}
                onClick={() => setActiveTab("women")}
              >
                {gu ? "મહિલા કલ્યાણ (Women)" : "Women Welfare"}
              </button>
              <button
                className={`scheme-tab-btn ${activeTab === "housewife" ? "active" : ""}`}
                onClick={() => setActiveTab("housewife")}
              >
                {gu ? "ગૃહિણી સહાય (Housewife)" : "Housewife Schemes"}
              </button>
              <button
                className={`scheme-tab-btn ${activeTab === "entrepreneur" ? "active" : ""}`}
                onClick={() => setActiveTab("entrepreneur")}
              >
                {gu ? "મહિલા સાહસિક (Entrepreneurs)" : "Women Entrepreneurs"}
              </button>
            </div>

            {/* Scheme Cards Grid */}
            <div className="vdc-schemes-deck">
              {currentVillage.hasDemoMetrics && displayedSchemes.length > 0 ? displayedSchemes.map(({ scheme, beneficiaries, grantLakhs }) => {
                return (
                  <div key={scheme.id} className="vdc-scheme-item">
                    <div className="vsi-top">
                      <div>
                        <span className="vsi-cat-tag">{gu ? scheme.categoryGu : scheme.notebookCategory}</span>
                        <h4>{gu ? scheme.nameGu : scheme.nameEn}</h4>
                      </div>
                      <span className="vsi-ben-badge">{fmt(scaleDemoValue(beneficiaries, fy))} {gu ? "લાભાર્થી · ડેમો" : "beneficiaries · demo"}</span>
                    </div>

                    <p className="vsi-benefit">
                      💡 <b>{gu ? "યોજનાનો હેતુ:" : "Scheme description:"}</b> {gu ? scheme.benefitGu : scheme.benefit}
                    </p>

                    <div className="vsi-footer">
                      <div className="vsi-target">
                        <small>{gu ? "લક્ષિત જૂથ (યોજના નોંધ):" : "Target group (catalogue):"}</small>
                        <span>{gu ? scheme.targetGu : scheme.target}</span>
                      </div>
                      <div className="vsi-amt">
                        <small>{gu ? "ચુકવણી · ડેમો:" : "Disbursement · demo:"}</small>
                        <strong>₹{(grantLakhs * yearFactor).toFixed(1)} {gu ? "લાખ" : "L"}</strong>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="village-scheme-empty" role="status">
                  <strong>{currentVillage.hasDemoMetrics
                    ? (gu ? "આ ફિલ્ટર માટે ઉદાહરણ યોજના નથી" : "No illustrative scheme matches this filter")
                    : (gu ? "આ ગામ માટે યોજના કવરેજનો ડેટા મળ્યો નથી" : "No village-level scheme coverage data found")}</strong>
                  <span>{gu
                    ? "આથી અહીં યોજના ચાલુ છે કે નહીં તે નક્કી થતું નથી. સત્તાવાર વિભાગીય ડેટા જોડાયા પછી માહિતી દેખાશે."
                    : "This does not mean a scheme is inactive. Coverage will appear when verified department data is connected."}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="village-empty-placeholder">
            <Home size={32} />
            <p>{gu ? "ડાબી બાજુની યાદીમાંથી કોઈપણ ગામ પસંદ કરો" : "Select a village from the left list"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
