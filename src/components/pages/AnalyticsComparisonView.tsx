"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  ArrowLeftRight, Building2, TrendingUp, Trophy,
  Zap, BarChart2, Users, Wallet, CheckCircle2, Sparkles,
} from "lucide-react";
import { demoDistricts, type District } from "@/lib/demo-data";
import { scaleDemoValue, approvalPercent } from "@/lib/metrics.mjs";

interface AnalyticsComparisonViewProps { gu: boolean; fy: string; }

function getAIInsight(dA: District, dB: District, sA: { ben: number; rate: number }, sB: { ben: number; rate: number }, gu: boolean): string {
  const leader = sA.ben >= sB.ben ? (gu ? dA.gu : dA.name) : (gu ? dB.gu : dB.name);
  const laggard = sA.ben < sB.ben ? (gu ? dA.gu : dA.name) : (gu ? dB.gu : dB.name);
  const rateLeader = sA.rate >= sB.rate ? (gu ? dA.gu : dA.name) : (gu ? dB.gu : dB.name);
  const diff = Math.abs(sA.ben - sB.ben).toLocaleString(gu ? "gu-IN" : "en-IN");
  if (gu) return `🤖 AI સૂઝ (ઉ.): ${leader} જિલ્લો ${diff} વધુ લાભાર્થી સાથે આગળ. ${rateLeader}ની approval rate ઊંચી. ${laggard}માં outreach campaign ફાયદાકારક.`;
  return `🤖 AI Insight (demo): ${leader} leads by ${diff} beneficiaries. ${rateLeader} has the stronger approval rate. ${laggard} could benefit from targeted outreach.`;
}

export function AnalyticsComparisonView({ gu, fy }: AnalyticsComparisonViewProps) {
  const [districtIdA, setDistrictIdA] = useState("bhavnagar");
  const [districtIdB, setDistrictIdB] = useState("rajkot");
  const radarRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const distA = useMemo(() => demoDistricts.find((d) => d.id === districtIdA) || demoDistricts[0], [districtIdA]);
  const distB = useMemo(() => demoDistricts.find((d) => d.id === districtIdB) || demoDistricts[1], [districtIdB]);
  const fmt = (n: number) => new Intl.NumberFormat(gu ? "gu-IN" : "en-IN").format(n);

  const statsA = useMemo(() => {
    const ben = scaleDemoValue(distA.beneficiaries, fy);
    const apps = scaleDemoValue(distA.applications, fy);
    const appr = scaleDemoValue(distA.approved, fy);
    const disb = scaleDemoValue(distA.disbursed, fy);
    return { ben, apps, appr, disb, rate: approvalPercent(appr, apps) ?? 80 };
  }, [distA, fy]);

  const statsB = useMemo(() => {
    const ben = scaleDemoValue(distB.beneficiaries, fy);
    const apps = scaleDemoValue(distB.applications, fy);
    const appr = scaleDemoValue(distB.approved, fy);
    const disb = scaleDemoValue(distB.disbursed, fy);
    return { ben, apps, appr, disb, rate: approvalPercent(appr, apps) ?? 80 };
  }, [distB, fy]);

  const aiInsight = useMemo(() => getAIInsight(distA, distB, statsA, statsB, gu), [distA, distB, statsA, statsB, gu]);

  useEffect(() => {
    const charts: Array<{ dispose(): void }> = [];
    const maxBen = Math.max(statsA.ben, statsB.ben, 1);
    const maxDisb = Math.max(statsA.disb, statsB.disb, 1);
    const maxApps = Math.max(statsA.apps, statsB.apps, 1);
    const nameA = gu ? distA.gu : distA.name;
    const nameB = gu ? distB.gu : distB.name;

    import("echarts").then((ec) => {
      if (radarRef.current) {
        const c = ec.init(radarRef.current, null, { renderer: "svg" });
        charts.push(c);
        c.setOption({
          backgroundColor: "transparent",
          tooltip: {
            trigger: "item",
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            borderColor: "rgba(56, 189, 248, 0.3)",
            textStyle: { color: "#ffffff" },
          },
          legend: { data: [nameA, nameB], bottom: 0, textStyle: { color: "#cbd5e1", fontSize: 11 } },
          radar: {
            indicator: [
              { name: gu ? "લાભ." : "Ben.", max: maxBen },
              { name: gu ? "અ.%" : "Rate%", max: 100 },
              { name: gu ? "ચૂ." : "Disb.", max: maxDisb },
              { name: gu ? "અ.ક." : "Apps", max: maxApps },
              { name: gu ? "ગ.ટ." : "Vill.", max: Math.max(distA.villageCount, distB.villageCount, 1) },
            ],
            splitNumber: 4,
            axisName: { color: "#cbd5e1", fontSize: 11, fontWeight: "bold" },
            splitLine: { lineStyle: { color: "rgba(148,163,184,0.2)" } },
            splitArea: { areaStyle: { color: ["rgba(8,127,115,0.06)", "rgba(8,127,115,0.12)"] } },
          },
          series: [{ type: "radar", data: [
            { value: [statsA.ben, statsA.rate, statsA.disb, statsA.apps, distA.villageCount], name: nameA, lineStyle: { color: "#087f73", width: 2 }, areaStyle: { color: "rgba(8,127,115,0.18)" }, symbol: "circle", symbolSize: 6 },
            { value: [statsB.ben, statsB.rate, statsB.disb, statsB.apps, distB.villageCount], name: nameB, lineStyle: { color: "#f59e0b", width: 2 }, areaStyle: { color: "rgba(245,158,11,0.15)" }, symbol: "circle", symbolSize: 6 },
          ] }],
        });
      }

      if (barRef.current) {
        const c = ec.init(barRef.current, null, { renderer: "svg" });
        charts.push(c);
        c.setOption({
          backgroundColor: "transparent",
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            borderColor: "rgba(56, 189, 248, 0.3)",
            textStyle: { color: "#ffffff" },
          },
          legend: { data: [nameA, nameB], bottom: 0, textStyle: { color: "#cbd5e1", fontSize: 11 } },
          grid: { top: 20, bottom: 36, left: 10, right: 10, containLabel: true },
          xAxis: { type: "category", data: [gu ? "લ.(K)" : "Ben.(K)", gu ? "અ.%" : "Rate%", gu ? "ચૂ." : "Disb."], axisLabel: { color: "#cbd5e1", fontSize: 11 } },
          yAxis: { type: "value", show: false },
          series: [
            { name: nameA, type: "bar", data: [Math.round(statsA.ben / 1000), statsA.rate, statsA.disb], itemStyle: { color: "#087f73", borderRadius: [4, 4, 0, 0] }, barMaxWidth: 32 },
            { name: nameB, type: "bar", data: [Math.round(statsB.ben / 1000), statsB.rate, statsB.disb], itemStyle: { color: "#f59e0b", borderRadius: [4, 4, 0, 0] }, barMaxWidth: 32 },
          ],
        });
      }

      if (lineRef.current) {
        const c = ec.init(lineRef.current, null, { renderer: "svg" });
        charts.push(c);
        const years = ["21-22", "22-23", "23-24", "24-25", "25-26"];
        c.setOption({
          backgroundColor: "transparent",
          tooltip: {
            trigger: "axis",
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            borderColor: "rgba(56, 189, 248, 0.3)",
            textStyle: { color: "#ffffff" },
          },
          legend: { data: [nameA, nameB], bottom: 0, textStyle: { color: "#cbd5e1", fontSize: 11 } },
          grid: { top: 20, bottom: 40, left: 10, right: 10, containLabel: true },
          xAxis: { type: "category", data: years, axisLabel: { color: "#cbd5e1", fontSize: 10 } },
          yAxis: { type: "value", splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } }, axisLabel: { color: "#94a3b8", fontSize: 10, formatter: (v: number) => `${Math.round(v / 1000)}K` } },
          series: [
            { name: nameA, type: "line", smooth: true, data: [0.72, 0.80, 0.88, 0.95, 1.0].map((f) => Math.round(distA.beneficiaries * f)), lineStyle: { color: "#087f73", width: 2.5 }, areaStyle: { color: "rgba(8,127,115,0.12)" }, symbol: "circle", symbolSize: 7, itemStyle: { color: "#087f73" } },
            { name: nameB, type: "line", smooth: true, data: [0.70, 0.78, 0.85, 0.93, 1.0].map((f) => Math.round(distB.beneficiaries * f)), lineStyle: { color: "#f59e0b", width: 2.5 }, areaStyle: { color: "rgba(245,158,11,0.10)" }, symbol: "circle", symbolSize: 7, itemStyle: { color: "#f59e0b" } },
          ],
        });
      }

      const handleResize = () => charts.forEach((c) => c.dispose());
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    });
    return () => charts.forEach((c) => c.dispose());
  }, [distA, distB, statsA, statsB, gu]);

  const indicators = [
    { label: gu ? "કુલ લાભાર્થી" : "Total Beneficiaries", a: fmt(statsA.ben), b: fmt(statsB.ben), winA: statsA.ben >= statsB.ben, icon: <Users size={15} /> },
    { label: gu ? "મંજૂરી દર" : "Approval Rate", a: `${statsA.rate}%`, b: `${statsB.rate}%`, winA: statsA.rate >= statsB.rate, icon: <CheckCircle2 size={15} /> },
    { label: gu ? "ચૂ.રકમ (Cr)" : "Disbursed (Cr)", a: `₹${fmt(statsA.disb)}`, b: `₹${fmt(statsB.disb)}`, winA: statsA.disb >= statsB.disb, icon: <Wallet size={15} /> },
    { label: gu ? "ત./ ગ.ટ." : "Talukas / Villages", a: `${distA.talukaCount} / ${distA.villageCount}`, b: `${distB.talukaCount} / ${distB.villageCount}`, winA: distA.villageCount >= distB.villageCount, icon: <Building2 size={15} /> },
  ];

  return (
    <div className="analytics-compare-page">
      <div className="page-hero-gov">
        <div>
          <span className="hero-kicker-tag">{gu ? "તુલનાત્મક વિશ્લેષણ" : "COMPARATIVE ANALYTICS"}</span>
          <h1>{gu ? "જિલ્લા Side-by-Side સરખામણી" : "Side-by-Side District Comparison"}</h1>
          <p>{gu ? "ગુજરાતના કોઈ પણ બે જિલ્લાની scheme, delivery, fiscal performance — ઉ.ડ.ત." : "Compare scheme reach, delivery performance, and fiscal data between any two districts. Demo data."}</p>
        </div>
      </div>

      {/* AI Insight */}
      <div className="ai-insight-banner">
        <Sparkles size={17} className="ai-insight-icon" />
        <p>{aiInsight}</p>
      </div>

      {/* Selector */}
      <div className="compare-selectors-bar">
        <div className="compare-pick-box">
          <label><Building2 size={16} /><span>{gu ? "પ્રથમ જિલ્લો (A):" : "First District (A):"}</span></label>
          <select value={districtIdA} onChange={(e) => setDistrictIdA(e.target.value)}>
            {demoDistricts.map((d) => <option key={d.id} value={d.id} disabled={d.id === districtIdB}>{gu ? d.gu : d.name} ({d.code})</option>)}
          </select>
        </div>
        <div className="compare-vs-badge"><ArrowLeftRight size={20} /><span>VS</span></div>
        <div className="compare-pick-box">
          <label><Building2 size={16} /><span>{gu ? "બીજો જિલ્લો (B):" : "Second District (B):"}</span></label>
          <select value={districtIdB} onChange={(e) => setDistrictIdB(e.target.value)}>
            {demoDistricts.map((d) => <option key={d.id} value={d.id} disabled={d.id === districtIdA}>{gu ? d.gu : d.name} ({d.code})</option>)}
          </select>
        </div>
      </div>

      {/* District Head Cards */}
      <div className="compare-cards-grid">
        {[{ dist: distA, stats: statsA, tag: "A", color: "#087f73" }, { dist: distB, stats: statsB, tag: "B", color: "#f59e0b" }].map(({ dist, stats, tag, color }) => (
          <div key={tag} className="compare-district-card" style={{ borderTopColor: color }}>
            <div className="cdc-head">
              <span className="cdc-tag" style={{ background: color }}>DISTRICT {tag}</span>
              <h2>{gu ? dist.gu : dist.name}</h2>
              <small>{dist.code} · {gu ? dist.regionGu : dist.region}</small>
            </div>
            <div className="cdc-metrics">
              <div className="cdc-metric-row"><span>{gu ? "લ.:" : "Ben.:"}</span><b>{fmt(stats.ben)}</b></div>
              <div className="cdc-metric-row"><span>{gu ? "અ.%:" : "Rate:"}</span><b className="text-teal">{stats.rate}%</b></div>
              <div className="cdc-metric-row"><span>{gu ? "ચૂ.:" : "Disb.:"}</span><b className="text-amber">₹{fmt(stats.disb)} Cr</b></div>
              <div className="cdc-metric-row"><span>{gu ? "ત./ગ.:" : "Tal./Vil.:"}</span><b>{dist.talukaCount} / {dist.villageCount}</b></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="compare-charts-trio">
        <div className="analytics-card-gov">
          <div className="card-head-gov"><BarChart2 size={16} /><span>{gu ? "રડાર સ્કોર" : "Radar Score"}</span></div>
          <div className="chart-box-echarts" ref={radarRef} style={{ height: 240 }} />
        </div>
        <div className="analytics-card-gov">
          <div className="card-head-gov"><BarChart2 size={16} /><span>{gu ? "KPI Bar" : "KPI Bar"}</span></div>
          <div className="chart-box-echarts" ref={barRef} style={{ height: 240 }} />
        </div>
        <div className="analytics-card-gov">
          <div className="card-head-gov"><TrendingUp size={16} /><span>{gu ? "5-વર્ષ ટ્રેન્ડ (ઉ.)" : "5-Year Trend (demo)"}</span></div>
          <div className="chart-box-echarts" ref={lineRef} style={{ height: 240 }} />
        </div>
      </div>

      {/* Matrix Table */}
      <div className="panel-gov">
        <div className="panel-gov-head">
          <div>
            <h3>{gu ? "વિગતવાર KPI મેટ્રિક્સ" : "Detailed KPI Matrix"}</h3>
            <small>{gu ? "🏆 = વિજેતા (ઉ. ડેટા)" : "🏆 = Leading district (demo data)"}</small>
          </div>
          <Trophy size={18} className="text-amber" />
        </div>
        <div className="gov-table-wrap">
          <table className="gov-data-table">
            <thead>
              <tr>
                <th>{gu ? "KPI" : "KPI"}</th>
                <th>{gu ? distA.gu : distA.name}</th>
                <th>{gu ? distB.gu : distB.name}</th>
                <th>{gu ? "આગળ" : "Leading"}</th>
              </tr>
            </thead>
            <tbody>
              {indicators.map(({ label, a, b, winA, icon }) => (
                <tr key={label}>
                  <td><span style={{ display: "flex", alignItems: "center", gap: 6 }}>{icon}{label}</span></td>
                  <td><b className={winA ? "text-teal" : ""}>{a} {winA && "🏆"}</b></td>
                  <td><b className={!winA ? "text-teal" : ""}>{b} {!winA && "🏆"}</b></td>
                  <td><span className="leading-pill">{winA ? (gu ? distA.gu : distA.name) : (gu ? distB.gu : distB.name)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
