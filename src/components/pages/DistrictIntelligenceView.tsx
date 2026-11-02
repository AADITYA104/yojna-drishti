"use client";

import React, { useState, useMemo } from "react";
import {
  Building2,
  Users,
  Wallet,
  ClipboardList,
  FileCheck2,
  Search,
  Filter,
  CheckCircle2,
  ArrowRight,
  Landmark,
  MapPin,
  ZoomIn,
  X,
} from "lucide-react";
import {
  demoDistricts,
  demoTalukas,
  demoSchemes,
  type District,
} from "@/lib/demo-data";
import {
  MASTER_DISTRICTS,
  MASTER_SUBDISTRICTS,
  getSubdistrictsForDistrict,
  type MasterSubdistrict,
} from "@/lib/master-hierarchy";
import { scaleDemoValue, approvalPercent } from "@/lib/metrics.mjs";
import { GujaratInteractiveMap } from "../map/GujaratInteractiveMap";

interface DistrictIntelligenceViewProps {
  gu: boolean;
  fy: string;
  selectedDistrict: District;
  onSelectDistrict: (d: District) => void;
  onNavigateToTalukas: () => void;
}

export function DistrictIntelligenceView({
  gu,
  fy,
  selectedDistrict,
  onSelectDistrict,
  onNavigateToTalukas,
}: DistrictIntelligenceViewProps) {
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const selectedDistrictId = selectedDistrict.id;

  const fmt = (num: number) => new Intl.NumberFormat(gu ? "gu-IN" : "en-IN").format(num);

  const filteredDistricts = useMemo(() => {
    return demoDistricts.filter((d) => {
      const matchSearch = `${d.name} ${d.gu} ${d.code}`.toLowerCase().includes(search.toLowerCase());
      const matchRegion = regionFilter === "all" || d.region === regionFilter;
      return matchSearch && matchRegion;
    });
  }, [search, regionFilter]);

  const districtTalukas = (() => {
    const subs = getSubdistrictsForDistrict(selectedDistrictId);
    if (subs.length > 0) {
      return subs.map((s, idx) => ({
        id: s.id,
        name: s.nameEn,
        gu: s.nameGu,
        districtId: selectedDistrictId,
        code: `LGD-${s.code}`,
        villageCount: s.villageCount,
        population: s.villageCount * 1200 + 15000,
        beneficiaries: Math.round(s.villageCount * 110 + 800),
        applications: Math.round(s.villageCount * 140 + 1000),
        approved: Math.round(s.villageCount * 95 + 720),
        disbursed: Number((s.villageCount * 0.16 + 1.2).toFixed(1)),
        coordinates: { x: 100 + (idx % 3) * 100, y: 100 + Math.floor(idx / 3) * 60 },
      }));
    }
    return demoTalukas.filter((t) => t.districtId === selectedDistrictId);
  })();

  const stats = useMemo(() => {
    const ben = scaleDemoValue(selectedDistrict.beneficiaries, fy);
    const apps = scaleDemoValue(selectedDistrict.applications, fy);
    const appr = scaleDemoValue(selectedDistrict.approved, fy);
    const disb = scaleDemoValue(selectedDistrict.disbursed, fy);
    const rate = approvalPercent(appr, apps) ?? 82;
    return { ben, apps, appr, disb, rate };
  }, [selectedDistrict, fy]);

  return (
    <div className="district-intel-page">
      {/* Page Header */}
      <div className="page-hero-gov">
        <div>
          <span className="hero-kicker-tag">
            {gu ? "જિલ્લા કક્ષાનું વિશ્લેષણ" : "DISTRICT INTELLIGENCE"}
          </span>
          <h1>
            {gu ? `${selectedDistrict.gu} જિલ્લો` : `${selectedDistrict.name} District`}
            <span className="code-subbadge">{selectedDistrict.code}</span>
          </h1>
          <p>
            {gu
              ? `મુખ્ય મથક: ${selectedDistrict.headquartersGu} · વિસ્તાર: ${selectedDistrict.regionGu} · ${selectedDistrict.talukaCount} તાલુકા · ${selectedDistrict.villageCount} ગામો`
              : `HQ: ${selectedDistrict.headquarters} · Region: ${selectedDistrict.region} · ${selectedDistrict.talukaCount} Talukas · ${selectedDistrict.villageCount} Villages`}
          </p>
        </div>

        <div className="hero-actions-wrap">
          <button className="btn-primary-gov" onClick={onNavigateToTalukas}>
            <Landmark size={15} />
            <span>{gu ? "આ જિલ્લાના તાલુકા જુઓ" : "Explore Talukas"}</span>
          </button>
        </div>
      </div>

      {/* Main 2-column Layout: Left Selector, Right Detailed Intel */}
      <div className="district-layout-grid">
        {/* Left Column: 34 District Selector & Search */}
        <div className="district-selector-sidebar">
          <div className="selector-head">
            <h3>{gu ? "ગુજરાતના ૩૪ જિલ્લા" : "Select District (34)"}</h3>
            <div className="filter-row-mini">
              <label className="search-box-mini">
                <Search size={14} />
                <input
                  type="text"
                  placeholder={gu ? "શોધો..." : "Search..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>

              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="region-select-mini"
              >
                <option value="all">{gu ? "બધા" : "All"}</option>
                <option value="Saurashtra">Saurashtra</option>
                <option value="North Gujarat">North</option>
                <option value="Central Gujarat">Central</option>
                <option value="South Gujarat">South</option>
                <option value="Kutch">Kutch</option>
              </select>
            </div>
          </div>

          <div className="district-items-scroll">
            {filteredDistricts.map((d) => {
              const isSelected = d.id === selectedDistrict.id;
              const isPilot = d.id === "bhavnagar";

              return (
                <button
                  key={d.id}
                  className={`district-picker-row ${isSelected ? "active" : ""}`}
                  onClick={() => onSelectDistrict(d)}
                >
                  <span className="district-picker-map-icon" aria-hidden="true"><Building2 size={16} /></span>
                  <div className="dp-title">
                    <strong>[{d.officialNo}] {gu ? d.gu : d.name}</strong>
                    <small>{fmt(d.areaKm2)} km² · {gu ? d.regionGu : d.region}</small>
                  </div>
                  <div className="dp-meta">
                    <b>{fmt(scaleDemoValue(d.beneficiaries, fy))}</b>
                    {isPilot && <span className="pilot-dot-badge">PILOT</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Profile of Selected District */}
        <div className="district-intel-main">
          {/* Road map and district profile */}
          <div className="district-hero-showcase" style={{ marginBottom: "1rem" }}>
            <div className="dhsc-map-box">
              <GujaratInteractiveMap
                key={selectedDistrict.id}
                gu={gu}
                fy={fy}
                selectedDistrictId={selectedDistrict.id}
                variant="embedded"
                initialLevel="district"
                mapHeight="230px"
              />
            </div>

            <div className="dhsc-meta-panel">
              <div className="dhsc-header-row">
                <h3>
                  <span className="dhsc-official-no">[{selectedDistrict.officialNo}]</span>
                  <span>{gu ? selectedDistrict.gu : selectedDistrict.name} {gu ? "જિલ્લો" : "District"}</span>
                </h3>
                <span className="dhsc-hq-tag">
                  <Building2 size={13} className="inline mr-1 text-teal" />
                  {gu ? `મુખ્ય મથક: ${selectedDistrict.headquartersGu}` : `HQ: ${selectedDistrict.headquarters}`}
                </span>
              </div>

              <div className="dhsc-kpi-row">
                <div className="dhsc-kpi-pill">
                  <small>{gu ? "ભૌગોલિક વિસ્તાર" : "Area"}</small>
                  <strong>{fmt(selectedDistrict.areaKm2)} km²</strong>
                </div>
                <div className="dhsc-kpi-pill">
                  <small>{gu ? "તાલુકાઓ" : "Talukas"}</small>
                  <strong>{districtTalukas.length}</strong>
                </div>
                <div className="dhsc-kpi-pill">
                  <small>{gu ? "કુલ ગામો" : "Villages"}</small>
                  <strong>{fmt(selectedDistrict.villageCount)}</strong>
                </div>
                <div className="dhsc-kpi-pill">
                  <small>{gu ? "સત્તાવાર આવરણ સૂચકાંક" : "Official coverage index"}</small>
                  <strong>{gu ? "ઉપલબ્ધ નથી" : "Unavailable"}</strong>
                </div>
                <div className="dhsc-kpi-pill">
                  <small>{gu ? "ચકાસાયેલ DBT feed" : "Verified DBT feed"}</small>
                  <strong>{gu ? "જોડાયેલ નથી" : "Not connected"}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Top 4 KPI Cards */}
          <div className="stats-strip-4">
            <div className="stat-card-compact">
              <span className="stat-label">{gu ? "લાભાર્થીઓ" : "Beneficiaries"}</span>
              <strong>{fmt(stats.ben)}</strong>
              <small>{gu ? "મહિલા અને બાળકો" : "Women & Children"}</small>
            </div>
            <div className="stat-card-compact">
              <span className="stat-label">{gu ? "કુલ અરજીઓ" : "Applications"}</span>
              <strong>{fmt(stats.apps)}</strong>
              <small>{gu ? "નોંધાયેલ ફોર્મ" : "Submitted Forms"}</small>
            </div>
            <div className="stat-card-compact">
              <span className="stat-label">{gu ? "મંજૂરી ટકાવારી" : "Approval Rate"}</span>
              <strong className="text-teal">{stats.rate}%</strong>
              <small>{gu ? "ડેમો ગુણોત્તર · ચકાસાયેલ નથી" : "Demo ratio · unverified"}</small>
            </div>
            <div className="stat-card-compact">
              <span className="stat-label">{gu ? "વિતરિત ભંડોળ" : "Disbursed"}</span>
              <strong className="text-amber">₹ {fmt(stats.disb)} Cr</strong>
              <small>{gu ? "DBT બેંક ટ્રાન્સફર" : "Direct Benefit Transfer"}</small>
            </div>
          </div>

          {/* Talukas Breakdown in this District */}
          <div className="panel-gov">
            <div className="panel-gov-head">
              <div>
                <h3>
                  {gu
                    ? `${selectedDistrict.gu} જિલ્લાના ${districtTalukas.length} તાલુકાઓની વિગત`
                    : `Talukas in ${selectedDistrict.name} District (${districtTalukas.length})`}
                </h3>
                <small>
                  {gu
                    ? "દરેક તાલુકામાં લાભાર્થીઓ અને ફાળવેલ સહાય"
                    : "Grassroots reach per taluka"}
                </small>
              </div>
            </div>

            <div className="gov-table-wrap">
              <table className="gov-data-table">
                <thead>
                  <tr>
                    <th>{gu ? "તાલુકો" : "Taluka"}</th>
                    <th>{gu ? "ગામો" : "Villages"}</th>
                    <th>{gu ? "વસ્તી" : "Population"}</th>
                    <th>{gu ? "લાભાર્થીઓ" : "Beneficiaries"}</th>
                    <th>{gu ? "અરજીઓ" : "Applications"}</th>
                    <th>{gu ? "મંજૂરી દર" : "Approval"}</th>
                    <th>{gu ? "રકમ (Cr)" : "Disbursed (Cr)"}</th>
                  </tr>
                </thead>
                <tbody>
                  {districtTalukas.map((t) => {
                    const scaledApplications = scaleDemoValue(t.applications, fy);
                    const scaledApproved = scaleDemoValue(t.approved, fy);
                    const rate = approvalPercent(scaledApproved, scaledApplications) ?? 82;
                    const yearFactor = fy === "2024–25" ? 0.88 : fy === "2023–24" ? 0.75 : 1;
                    const disbursed = Number((t.disbursed * yearFactor).toFixed(1));
                    const isGhogha = t.id === "ghogha";

                    return (
                      <tr key={t.id} className={isGhogha ? "pilot-row-highlight" : ""}>
                        <td>
                          <strong>{gu ? t.gu : t.name}</strong>
                          {isGhogha && (
                            <span className="pilot-tag-pill">⭐ {gu ? "૪૮ ગામો પાયલટ" : "48 Vil Pilot"}</span>
                          )}
                        </td>
                        <td>{t.villageCount}</td>
                        <td>{fmt(t.population)}</td>
                        <td>
                          <b>{fmt(scaleDemoValue(t.beneficiaries, fy))}</b>
                        </td>
                        <td>{fmt(scaledApplications)}</td>
                        <td>
                          <div className="table-rate-bar">
                            <span style={{ width: `${rate}%` }} />
                            <small>{rate}%</small>
                          </div>
                        </td>
                        <td>₹ {disbursed} Cr</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Scheme Breakdown for this District */}
          <div className="panel-gov">
            <div className="panel-gov-head">
              <div>
                <h3>{gu ? "યોજનાવાર ફાળવણી અને આવરણ" : "Scheme-wise Coverage in District"}</h3>
                <small>{gu ? "૧૦ મુખ્ય સરકારી યોજનાઓની પ્રગતિ" : "Progress of all 10 welfare schemes"}</small>
              </div>
            </div>

            <div className="scheme-strip-grid">
              {demoSchemes.map((s) => {
                const approxBen = Math.floor(stats.ben * (0.12 + ((s.id.length * 3) % 15) * 0.01));

                return (
                  <div key={s.id} className="scheme-district-box">
                    <div className="sdb-top">
                      <span className="sdb-badge">{s.id}</span>
                      <span className="sdb-cat">{gu ? s.categoryGu : s.category}</span>
                    </div>
                    <strong>{gu ? s.shortNameGu : s.shortName}</strong>
                    <div className="sdb-numbers">
                      <div>
                        <small>{gu ? "લાભાર્થી" : "Beneficiaries"}</small>
                        <b>{fmt(approxBen)}</b>
                      </div>
                      <div>
                        <small>{gu ? "સહાય ધોરણ" : "Norm"}</small>
                        <span>{gu ? s.benefitAmountGu.slice(0, 22) : s.benefitAmount.slice(0, 22)}...</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
