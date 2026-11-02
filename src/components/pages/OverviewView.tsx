"use client";

import React, { useCallback, useMemo, useRef, useEffect } from "react";
import * as echarts from "echarts";
import {
  Users,
  ClipboardList,
  FileCheck2,
  Wallet,
  Building2,
  Landmark,
  Home,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  ExternalLink,
  Search,
  Globe2,
  HelpCircle,
} from "lucide-react";
import {
  demoDistricts,
  demoSchemes,
  demoTalukas,
  demoVillages,
  STATE_TOTALS,
  type District,
} from "@/lib/demo-data";
import { scaleDemoValue, approvalPercent } from "@/lib/metrics.mjs";
import { KPICard } from "../shared/KPICard";
import { DemoBanner } from "../shared/DemoBanner";

interface OverviewViewProps {
  gu: boolean;
  fy: string;
  onNavigate: (page: any) => void;
  onSelectDistrict: (district: District) => void;
  searchQuery: string;
}

export function OverviewView({
  gu,
  fy,
  onNavigate,
  onSelectDistrict,
  searchQuery,
}: OverviewViewProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const donutRef = useRef<HTMLDivElement>(null);

  const fmt = useCallback(
    (num: number) => new Intl.NumberFormat(gu ? "gu-IN" : "en-IN").format(num),
    [gu],
  );

  const totalBen = useMemo(() => scaleDemoValue(STATE_TOTALS.beneficiaries, fy), [fy]);
  const totalApps = useMemo(() => scaleDemoValue(STATE_TOTALS.applications, fy), [fy]);
  const totalApproved = useMemo(() => scaleDemoValue(STATE_TOTALS.approved, fy), [fy]);
  const totalDisbursed = useMemo(() => scaleDemoValue(STATE_TOTALS.disbursedCr, fy), [fy]);

  const approvalRate = approvalPercent(totalApproved, totalApps) ?? 82;

  // Filtered districts for quick ranking
  const filteredDistricts = useMemo(() => {
    return demoDistricts
      .filter((d) =>
        `${d.name} ${d.gu} ${d.region}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.beneficiaries - a.beneficiaries);
  }, [searchQuery]);

  // ECharts Bar Chart - Top 7 Districts
  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);

    const topDistricts = demoDistricts.slice(0, 7);
    const names = topDistricts.map((d) => (gu ? d.gu : d.name));
    const vals = topDistricts.map((d) => scaleDemoValue(d.beneficiaries, fy));

    chart.setOption({
      grid: { left: "3%", right: "4%", bottom: "3%", top: "12%", containLabel: true },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params: any) => {
          const item = params[0];
          return `<b>${item.name}</b><br/>${gu ? "લાભાર્થી" : "Beneficiaries"}: <b>${fmt(item.value)}</b>`;
        },
      },
      xAxis: {
        type: "category",
        data: names,
        axisLine: { lineStyle: { color: "#cbd5e1" } },
        axisLabel: { color: "#475569", fontSize: 11, interval: 0 },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: "#64748b", fontSize: 10 },
        splitLine: { lineStyle: { color: "#f1f5f9" } },
      },
      series: [
        {
          name: gu ? "લાભાર્થી" : "Beneficiaries",
          type: "bar",
          barWidth: "32%",
          data: vals.map((val, idx) => ({
            value: val,
            itemStyle: {
              color: idx === 3 ? "#0f766e" : "#0284c7",
              borderRadius: [4, 4, 0, 0],
            },
          })),
        },
      ],
    });

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [fmt, gu, fy]);

  // ECharts Donut Chart - Applications Status
  useEffect(() => {
    if (!donutRef.current) return;
    const donut = echarts.init(donutRef.current);

    const approvedCount = totalApproved;
    const pendingCount = Math.max(0, totalApps - totalApproved);

    donut.setOption({
      tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
      legend: { bottom: "0%", left: "center", itemWidth: 10, itemHeight: 10 },
      series: [
        {
          name: gu ? "અરજી સ્થિતિ" : "Application Status",
          type: "pie",
          radius: ["55%", "80%"],
          center: ["50%", "45%"],
          avoidLabelOverlap: false,
          label: { show: false },
          emphasis: { label: { show: true, fontSize: 13, fontWeight: "bold" } },
          data: [
            {
              value: approvedCount,
              name: gu ? "મંજૂર અરજીઓ" : "Approved",
              itemStyle: { color: "#0f766e" },
            },
            {
              value: pendingCount,
              name: gu ? "પ્રક્રિયા હેઠળ" : "Under Process",
              itemStyle: { color: "#eab308" },
            },
          ],
        },
      ],
    });

    const handleResize = () => donut.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      donut.dispose();
    };
  }, [gu, totalApproved, totalApps]);

  return (
    <div className="overview-view-container">
      {/* Demo Banner */}
      <DemoBanner gu={gu} onExploreData={() => onNavigate("data")} />

      {/* Hero Headline */}
      <div className="page-hero-gov">
        <div>
          <span className="hero-kicker-tag">
            {gu ? "ગુજરાત સરકાર · મહિલા અને બાળ કલ્યાણ" : "GOVERNMENT OF GUJARAT · WCD SCHEMES"}
          </span>
          <h1>{gu ? "યોજના દૃષ્ટિ · ભૌગોલિક પ્રગતિ મંચ" : "Yojana Drishti · Geo-Intelligence Platform"}</h1>
          <p>
            {gu
              ? "રાજ્ય, ૩૪ જિલ્લા, તાલુકા અને ગામડાં સ્તરે સરકારી યોજનાઓનું વાસ્તવિક નકશાંકન અને જમીની અસરનું વિશ્લેષણ."
              : "Hierarchical mapping and grassroots tracking of government welfare schemes from State to Village level."}
          </p>
        </div>

        <div className="hero-actions-wrap">
          <button className="btn-primary-gov" onClick={() => onNavigate("map")}>
            <MapPin size={16} />
            <span>{gu ? "સંપૂર્ણ નકશો ખોલો" : "Open Full Map"}</span>
          </button>
          <button className="btn-secondary-gov" onClick={() => onNavigate("districts")}>
            <Globe2 size={15} />
            <span>{gu ? "૩૪ જિલ્લાઓની ડિરેક્ટરી" : "34 Districts Directory"}</span>
          </button>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="kpi-cards-grid">
        <KPICard
          title={gu ? "કુલ નોંધાયેલ લાભાર્થીઓ" : "Total Beneficiaries"}
          value={fmt(totalBen)}
          changePercent={6.4}
          icon={Users}
          tone={0}
          gu={gu}
        />
        <KPICard
          title={gu ? "કુલ મળેલી અરજીઓ" : "Total Applications"}
          value={fmt(totalApps)}
          changePercent={8.2}
          icon={ClipboardList}
          tone={1}
          gu={gu}
        />
        <KPICard
          title={gu ? "મંજૂરી દર" : "Approval Rate"}
          value={`${approvalRate}%`}
          changePercent={2.1}
          icon={FileCheck2}
          tone={2}
          gu={gu}
        />
        <KPICard
          title={gu ? "કુલ સહાય ચુકવણી" : "Public Spending (DBT)"}
          value={`₹ ${fmt(totalDisbursed)} Cr`}
          changePercent={11.5}
          icon={Wallet}
          tone={3}
          gu={gu}
        />
      </div>

      {/* Administrative Coverage Bar */}
      <div className="admin-coverage-bar">
        <div className="coverage-unit">
          <Building2 size={16} className="text-teal" />
          <div>
            <strong>34</strong>
            <span>{gu ? "જિલ્લાઓ (વાવ-થરાદ સહિત)" : "Districts (inc. Vav-Tharad)"}</span>
          </div>
        </div>
        <div className="coverage-divider" />
        <div className="coverage-unit">
          <Landmark size={16} className="text-navy" />
          <div>
            <strong>309</strong>
            <span>{gu ? "અધિકૃત તાલુકાઓ (LGD)" : "Talukas (Official LGD)"}</span>
          </div>
        </div>
        <div className="coverage-divider" />
        <div className="coverage-unit">
          <Home size={16} className="text-amber" />
          <div>
            <strong>19,201</strong>
            <span>{gu ? "ગામો (૧૮,૫૦૦+ વાસ્તવિક યોજના પહોંચ)" : "Villages (18,500+ Grassroots Reach)"}</span>
          </div>
        </div>
        <div className="coverage-divider" />
        <div className="coverage-unit">
          <CheckCircle2 size={16} className="text-emerald" />
          <div>
            <strong>{demoSchemes.length}</strong>
            <span>{gu ? "સક્રિય યોજનાઓ (૫ મુખ્ય + ૫ વિસ્તૃત)" : "Schemes (5 Core + 5 Ext)"}</span>
          </div>
        </div>
      </div>

      {/* Gujarat GIS Gateway Card - Direct Launchpad to the Single Main Map */}
      <section className="gujarat-gis-gateway-card">
        <div className="gis-gateway-left">
          <div className="gis-gateway-tag">
            <MapPin size={14} />
            <span>{gu ? "સત્તાવાર ભૌગોલિક પ્રણાલી" : "Official GIS System"}</span>
          </div>
          <h2>{gu ? "ગુજરાત ઇન્ટરેક્ટિવ નકશો · રાજ્યથી છેવાડાના ગામ સુધી" : "Gujarat Interactive Map · State to Grassroots Village"}</h2>
          <p>
            {gu
              ? "સમગ્ર ૩૪ જિલ્લાઓ, ૩૦૯ તાલુકાઓ અને ૧૮,૫૦૦+ ગામડાંઓ સુધી પહોંચેલી તમામ સરકારી કલ્યાણકારી યોજનાઓ, લાભાર્થી સંખ્યા અને DBT સહાયનું લાઇવ નકશાંકન જુઓ."
              : "Explore live scheme delivery, saturation rates, and DBT disbursement mapped across all 34 districts, 309 talukas, and 18,500+ grassroots villages."}
          </p>
          <div className="gis-gateway-stats">
            <span className="gis-stat-pill"><Building2 size={13} className="inline mr-1 text-teal" /><b>34</b> {gu ? "જિલ્લા [GJ-01 થી GJ-39]" : "Districts"}</span>
            <span className="gis-stat-pill"><MapPin size={13} className="inline mr-1 text-sky" /><b>309</b> {gu ? "તાલુકા" : "Talukas"}</span>
            <span className="gis-stat-pill"><Home size={13} className="inline mr-1 text-amber" /><b>18,500+</b> {gu ? "ગામો નકશા પર" : "Villages"}</span>
            <span className="gis-stat-pill"><CheckCircle2 size={13} className="inline mr-1 text-emerald" /><b>{demoSchemes.length}</b> {gu ? "યોજનાઓ" : "Schemes"}</span>
          </div>
        </div>

        <div className="gis-gateway-right">
          <button className="btn-gis-launch" onClick={() => onNavigate("map")}>
            <MapPin size={18} />
            <span>{gu ? "મુખ્ય ભૌગોલિક નકશો ખોલો" : "Open Main GIS Map"}</span>
            <ArrowRight size={18} />
          </button>
          <small className="gis-gateway-hint">
            <HelpCircle size={13} className="inline mr-1 text-slate-500" />
            {gu ? "જિલ્લાવાર ઝૂમ, નામ નિર્દેશ અને ગ્રામ્ય સ્તર યોજના સંતૃપ્તિ રિપોર્ટ" : "District zoom, location inspect & village scheme saturation"}
          </small>
        </div>
      </section>

      {/* Analytics Charts & District Table Grid */}
      <div className="overview-analytics-grid">
        {/* Top Districts Chart */}
        <div className="analytics-card-gov">
          <div className="card-head-gov">
            <div>
              <h3>{gu ? "જિલ્લાવાર લાભાર્થી સરખામણી" : "Beneficiaries by District"}</h3>
              <small>{gu ? "સૌથી વધુ લાભાર્થી ધરાવતા ટોચના જિલ્લા" : "Top performing districts in Gujarat"}</small>
            </div>
            <span className="badge-pill">FY {fy}</span>
          </div>
          <div ref={chartRef} className="chart-box-echarts" />
        </div>

        {/* Application Status Donut */}
        <div className="analytics-card-gov">
          <div className="card-head-gov">
            <div>
              <h3>{gu ? "અરજી મંજૂરી ગુણોત્તર" : "Application Clearance Ratio"}</h3>
              <small>{gu ? "મંજૂર અરજીઓ સામે પ્રક્રિયા હેઠળ" : "Approved vs pending verifications"}</small>
            </div>
            <span className="badge-pill">{approvalRate}% Approved</span>
          </div>
          <div ref={donutRef} className="chart-box-echarts" />
        </div>
      </div>

      {/* 34 Districts Performance Ranking Table */}
      <section className="ranking-table-section">
        <div className="section-head-gov">
          <div>
            <span className="section-pill">{gu ? "જિલ્લા રેન્કિંગ" : "DISTRICT LEADERBOARD"}</span>
            <h2>{gu ? "તમામ ૩૪ જિલ્લાઓની કામગીરી વિગત" : "Performance Across All 34 Districts"}</h2>
          </div>
          <button className="section-action-btn" onClick={() => onNavigate("districts")}>
            <span>{gu ? "વિગતવાર જિલ્લા પૃષ્ઠ" : "All District Details"}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="gov-table-wrap">
          <table className="gov-data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{gu ? "જિલ્લો" : "District"}</th>
                <th>{gu ? "વિસ્તાર (Region)" : "Region"}</th>
                <th>{gu ? "તાલુકા" : "Talukas"}</th>
                <th>{gu ? "લાભાર્થીઓ" : "Beneficiaries"}</th>
                <th>{gu ? "અરજીઓ" : "Applications"}</th>
                <th>{gu ? "મંજૂરી દર" : "Approval Rate"}</th>
                <th>{gu ? "વિતરિત રકમ" : "Disbursed (Cr)"}</th>
                <th>{gu ? "ક્રિયા" : "Action"}</th>
              </tr>
            </thead>
            <tbody>
              {filteredDistricts.slice(0, 10).map((d, index) => {
                const scaledBen = scaleDemoValue(d.beneficiaries, fy);
                const scaledApps = scaleDemoValue(d.applications, fy);
                const scaledAppr = scaleDemoValue(d.approved, fy);
                const rate = approvalPercent(scaledAppr, scaledApps) ?? 80;
                const isPilot = d.id === "bhavnagar";

                return (
                  <tr
                    key={d.id}
                    className={isPilot ? "pilot-row-highlight" : ""}
                    onClick={() => onSelectDistrict(d)}
                  >
                    <td>
                      <span className="rank-badge">{String(index + 1).padStart(2, "0")}</span>
                    </td>
                    <td>
                      <div className="table-district-name">
                        <strong>{gu ? d.gu : d.name}</strong>
                        {isPilot && <span className="pilot-tag-pill">{gu ? "પાયલટ" : "PILOT"}</span>}
                      </div>
                    </td>
                    <td>{gu ? d.regionGu : d.region}</td>
                    <td>{d.talukaCount}</td>
                    <td>
                      <b>{fmt(scaledBen)}</b>
                    </td>
                    <td>{fmt(scaledApps)}</td>
                    <td>
                      <div className="table-rate-bar">
                        <span style={{ width: `${rate}%` }} />
                        <small>{rate}%</small>
                      </div>
                    </td>
                    <td>
                      <strong className="text-teal">₹ {fmt(d.disbursed)} Cr</strong>
                    </td>
                    <td>
                      <button
                        className="btn-link-action"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDistrict(d);
                          onNavigate("districts");
                        }}
                      >
                        {gu ? "જુઓ" : "Inspect"} →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
