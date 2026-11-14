"use client";

import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import {
  Wallet, TrendingUp, ArrowUpRight, Landmark, PiggyBank,
  BarChart3, IndianRupee, CheckCircle2, AlertCircle, CreditCard,
} from "lucide-react";
import { demoSchemes, demoDistricts, STATE_TOTALS } from "@/lib/demo-data";
import { scaleDemoValue } from "@/lib/metrics.mjs";

interface FinancialIntelligenceViewProps {
  gu: boolean;
  fy: string;
}

const FY_OPTS = ["2022-23", "2023-24", "2024-25"] as const;
type FyOpt = (typeof FY_OPTS)[number];
const FY_SCALES: Record<FyOpt, number> = { "2022-23": 0.82, "2023-24": 0.91, "2024-25": 1.0 };

export function FinancialIntelligenceView({ gu, fy }: FinancialIntelligenceViewProps) {
  const lineChartRef   = useRef<HTMLDivElement>(null);
  const schemeDonutRef = useRef<HTMLDivElement>(null);
  const regionBarRef   = useRef<HTMLDivElement>(null);
  const utilBarRef     = useRef<HTMLDivElement>(null);

  const fmt = (n: number) => new Intl.NumberFormat(gu ? "gu-IN" : "en-IN").format(Math.round(n));

  const totalDisbursed = scaleDemoValue(STATE_TOTALS.disbursedCr, fy);
  const allocated      = scaleDemoValue(2150, fy);
  const utilRate       = Math.min(99, Math.round((totalDisbursed / allocated) * 100));
  const avgPerBen      = scaleDemoValue(18680, fy);
  const dbtSuccessRate = 99.2;

  const months     = gu
    ? ["એ", "મે", "જૂ", "જુ", "ઓ", "સ", "ઓ", "ન", "ડ", "જ", "ફ", "મા"]
    : ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  const monthlyBase = [112, 128, 142, 155, 168, 162, 175, 180, 188, 195, 204, 218];

  // ── MONTHLY LINE ────────────────────────────────────────────────────
  useEffect(() => {
    if (!lineChartRef.current) return;
    const chart = echarts.init(lineChartRef.current);
    const vals  = monthlyBase.map(v => scaleDemoValue(v, fy));
    chart.setOption({
      grid: { left: "4%", right: "4%", bottom: "6%", top: "12%", containLabel: true },
      tooltip: {
        trigger: "axis",
        formatter: (p: any) => `${p[0].name}: <b>₹ ${p[0].value} Cr</b>`,
      },
      xAxis: { type: "category", data: months, axisLabel: { color: "#475569", fontSize: 10 } },
      yAxis: {
        type: "value",
        axisLabel: { formatter: "₹{value}Cr", color: "#64748b", fontSize: 10 },
        splitLine: { lineStyle: { color: "#f1f5f9" } },
      },
      series: [{
        name: gu ? "DBT ચુકવણી" : "DBT Outflow",
        type: "line", smooth: true,
        data: vals,
        itemStyle: { color: "#0f766e" },
        lineStyle: { width: 3, color: "#0f766e" },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(15,118,110,0.35)" },
            { offset: 1, color: "rgba(15,118,110,0.02)" },
          ]),
        },
        symbol: "circle", symbolSize: 7,
      }],
    });
    const r = () => chart.resize();
    window.addEventListener("resize", r);
    return () => { window.removeEventListener("resize", r); chart.dispose(); };
  }, [gu, fy]);

  // ── SCHEME DONUT ────────────────────────────────────────────────────
  useEffect(() => {
    if (!schemeDonutRef.current) return;
    const chart = echarts.init(schemeDonutRef.current);
    const COLORS = ["#0f766e", "#0284c7", "#d97706", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#14b8a6", "#a78bfa"];
    chart.setOption({
      tooltip: { trigger: "item", formatter: "{b}: ₹{c} Cr ({d}%)" },
      legend: { type: "scroll", bottom: 0, left: "center", itemWidth: 10, itemHeight: 10, textStyle: { color: "#526d7b", fontSize: 10 } },
      series: [{
        name: gu ? "યોજના-ભાર" : "Scheme Share",
        type: "pie", radius: ["40%", "65%"], center: ["50%", "43%"],
        label: { show: false }, labelLine: { show: false },
        itemStyle: { borderRadius: 4, borderColor: "#fff", borderWidth: 2 },
        data: demoSchemes.map((s, i) => ({
          value: scaleDemoValue(s.budgetDisbursedCr, fy),
          name: gu ? (s.shortNameGu || s.shortName) : s.shortName,
          itemStyle: { color: COLORS[i % COLORS.length] },
        })),
      }],
    });
    const r = () => chart.resize();
    window.addEventListener("resize", r);
    return () => { window.removeEventListener("resize", r); chart.dispose(); };
  }, [gu, fy]);

  // ── REGION BAR ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!regionBarRef.current) return;
    const chart = echarts.init(regionBarRef.current);
    const regions = ["Saurashtra", "Central", "South", "North", "Kutch", "East"];
    const regGu   = ["સૌરાષ્ટ્ર", "મધ્ય", "દ.ગુ.", "ઉ.ગુ.", "કચ્છ", "પૂ.ગુ."];
    const regVals  = [420, 380, 310, 290, 150, 200].map(v => scaleDemoValue(v, fy));
    chart.setOption({
      grid: { left: "4%", right: "4%", bottom: "5%", top: "12%", containLabel: true },
      tooltip: { trigger: "axis", formatter: (p: any) => `${p[0].name}: <b>₹ ${p[0].value} Cr</b>` },
      xAxis: {
        type: "category",
        data: gu ? regGu : regions,
        axisLabel: { color: "#475569", fontSize: 10, interval: 0 },
      },
      yAxis: { type: "value", axisLabel: { formatter: "₹{value}Cr", color: "#64748b", fontSize: 10 }, splitLine: { lineStyle: { color: "#f1f5f9" } } },
      series: [{
        name: gu ? "DBT" : "DBT (Cr)",
        type: "bar", barWidth: "40%",
        data: regVals.map((v, i) => ({
          value: v,
          itemStyle: { color: ["#0f766e","#0284c7","#d97706","#8b5cf6","#ec4899","#06b6d4"][i], borderRadius: [4,4,0,0] },
        })),
        label: { show: true, position: "top", color: "#526d7b", fontSize: 10, formatter: (p: any) => `₹${p.value}` },
      }],
    });
    const r = () => chart.resize();
    window.addEventListener("resize", r);
    return () => { window.removeEventListener("resize", r); chart.dispose(); };
  }, [gu, fy]);

  // ── UTILIZATION GAUGE ───────────────────────────────────────────────
  useEffect(() => {
    if (!utilBarRef.current) return;
    const chart = echarts.init(utilBarRef.current);
    chart.setOption({
      series: [{
        name: gu ? "ઉપયોગ દર" : "Budget Utilization",
        type: "gauge",
        radius: "80%",
        startAngle: 200, endAngle: -20,
        min: 0, max: 100,
        progress: { show: true, roundCap: true, width: 16, itemStyle: { color: "#0f766e" } },
        pointer: { show: true, length: "60%", width: 4, itemStyle: { color: "#0f766e" } },
        axisLine: { lineStyle: { width: 16, color: [[1, "#e2e8f0"]] } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          valueAnimation: true,
          formatter: "{value}%",
          color: "#0f766e",
          fontSize: 24,
          fontWeight: "bold",
          offsetCenter: [0, "30%"],
        },
        data: [{ value: utilRate, name: gu ? "ઉપયોગ" : "Utilized" }],
        title: { offsetCenter: [0, "55%"], color: "#64748b", fontSize: 12 },
      }],
    });
    const r = () => chart.resize();
    window.addEventListener("resize", r);
    return () => { window.removeEventListener("resize", r); chart.dispose(); };
  }, [utilRate, gu]);

  return (
    <div className="financial-intel-page">

      {/* Hero */}
      <div className="page-hero-gov">
        <div>
          <span className="hero-kicker-tag">
            {gu ? "DBT · નાણાકીય પ્રવાહ અને બજેટ" : "FINANCIAL INTELLIGENCE · DBT"}
          </span>
          <h1>{gu ? "DBT સીધી સહાય ચુકવણી · ₹ {fmt(totalDisbursed)} Cr" : `Public Spending & Direct Benefit Transfers · ₹ ${fmt(totalDisbursed)} Cr`}</h1>
          <p>
            {gu
              ? "FY " + fy + " — ૧૨ મહિના DBT ટ્રૅન્ડ, ક્ષેત્ર-વાર વિભાજન, યોજના-ભાર ડોનટ, અને બજેટ ઉપયોગ ગેજ."
              : `FY ${fy} — 12-month DBT trend, region breakdown, scheme-share donut, and budget utilization gauge.`}
          </p>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="stats-strip-4">
        <div className="stat-card-compact">
          <span className="stat-label">{gu ? "ફાળવેલ બજેટ" : "Allocated Budget"}</span>
          <strong className="text-navy">₹ {fmt(allocated)} Cr</strong>
          <small>{gu ? "ઉદ. ફાળવણી · FY " + fy : "Demo · FY " + fy}</small>
        </div>
        <div className="stat-card-compact">
          <span className="stat-label">{gu ? "વિતરિત (DBT)" : "Total Disbursed"}</span>
          <strong className="text-teal">₹ {fmt(totalDisbursed)} Cr</strong>
          <small>{gu ? "ઉ. ગ. · FY " + fy : "Demo calc · FY " + fy}</small>
        </div>
        <div className="stat-card-compact">
          <span className="stat-label">{gu ? "DBT સફળ ટ્રાન્ઝેક્શન" : "DBT Success Rate"}</span>
          <strong className="text-emerald">{dbtSuccessRate}%</strong>
          <small>{gu ? "ઉ. ગ. · ચ. નથી" : "Demo · unverified"}</small>
        </div>
        <div className="stat-card-compact">
          <span className="stat-label">{gu ? "સ.ઘ. / લાભ." : "Avg Assist / Beneficiary"}</span>
          <strong className="text-amber">₹ {fmt(avgPerBen)}</strong>
          <small>{gu ? "ઉ. ગ. · ચ. નથી" : "Demo · unverified"}</small>
        </div>
      </div>

      {/* Row 1: Monthly trend + Budget gauge */}
      <div className="overview-analytics-grid">
        <div className="analytics-card-gov">
          <div className="card-head-gov">
            <div>
              <h3>{gu ? "માસિક DBT ખર્ચ (₹ કરોડ)" : "Monthly DBT Expenditure (₹ Crores)"}</h3>
              <small>{gu ? "FY " + fy + " — ૧૨ મહિના ટ્રૅન્ડ" : `FY ${fy} — 12-month outflow trend`}</small>
            </div>
            <span className="badge-pill">FY {fy}</span>
          </div>
          <div ref={lineChartRef} className="chart-box-echarts" />
        </div>

        <div className="analytics-card-gov">
          <div className="card-head-gov">
            <div>
              <h3>{gu ? "બજેટ ઉપયોગ ગેજ" : "Budget Utilization Gauge"}</h3>
              <small>{gu ? `₹ ${fmt(totalDisbursed)} / ₹ ${fmt(allocated)} Cr` : `₹ ${fmt(totalDisbursed)} disbursed of ₹ ${fmt(allocated)} Cr`}</small>
            </div>
            <span className="badge-pill">{utilRate}% Used</span>
          </div>
          <div ref={utilBarRef} style={{ height: 240, width: "100%" }} />
        </div>
      </div>

      {/* Row 2: Scheme donut + Region bar */}
      <div className="overview-analytics-grid">
        <div className="analytics-card-gov">
          <div className="card-head-gov">
            <div>
              <h3>{gu ? "યોજના-ભાર ડોનટ" : "Scheme-wise DBT Share"}</h3>
              <small>{gu ? "કઈ યોજનામાં કેટલું ₹" : "DBT allocation across schemes"}</small>
            </div>
            <span className="badge-pill">{demoSchemes.length} Schemes</span>
          </div>
          <div ref={schemeDonutRef} className="chart-box-echarts" />
        </div>

        <div className="analytics-card-gov">
          <div className="card-head-gov">
            <div>
              <h3>{gu ? "ક્ષેત્ર-વાર DBT વિભાજન" : "Region-wise DBT Breakdown"}</h3>
              <small>{gu ? "સૌ., મ., દ., ઉ., ક., પૂ. ગુ." : "Saurashtra, Central, South, North, Kutch, East"}</small>
            </div>
            <span className="badge-pill">6 Regions</span>
          </div>
          <div ref={regionBarRef} className="chart-box-echarts" />
        </div>
      </div>

      {/* Scheme-by-Scheme Budget Table */}
      <div className="panel-gov">
        <div className="panel-gov-head">
          <div>
            <h3>{gu ? "યોજનાવાર બજેટ ફાળવણી અને ઉપયોગ" : "Scheme-wise Budget Allocation vs Spending"}</h3>
            <small>{gu ? "ઉ. આ. · FY " + fy : "Illustrative · FY " + fy}</small>
          </div>
          <span className="badge-pill">FY {fy}</span>
        </div>
        <div className="gov-table-wrap">
          <table className="gov-data-table">
            <thead>
              <tr>
                <th>{gu ? "યોજના" : "Scheme"}</th>
                <th>{gu ? "કેટ." : "Category"}</th>
                <th>{gu ? "ફાળ. (Cr)" : "Allocated (Cr)"}</th>
                <th>{gu ? "વ. (Cr)" : "Disbursed (Cr)"}</th>
                <th>{gu ? "ઉ.દ.%" : "Utilization %"}</th>
                <th>{gu ? "DBT %" : "DBT %"}</th>
              </tr>
            </thead>
            <tbody>
              {demoSchemes.map(s => {
                const alloc  = scaleDemoValue(s.budgetAllocatedCr, fy);
                const disb   = scaleDemoValue(s.budgetDisbursedCr, fy);
                const util   = alloc > 0 ? Math.min(100, Math.round((disb / alloc) * 100)) : 0;
                const dbtPct = 95 + Math.floor(Math.random() * 5);
                return (
                  <tr key={s.id}>
                    <td>
                      <strong>{gu ? s.shortNameGu : s.shortName}</strong>
                      <small className="block text-muted">{s.id}</small>
                    </td>
                    <td>{gu ? s.categoryGu : s.category}</td>
                    <td>₹ {fmt(alloc)} Cr</td>
                    <td><strong className="text-teal">₹ {fmt(disb)} Cr</strong></td>
                    <td>
                      <div className="table-rate-bar">
                        <span style={{ width: `${util}%` }} />
                        <small>{util}%</small>
                      </div>
                    </td>
                    <td>
                      <span className={dbtPct >= 99 ? "badge-pill-success" : "badge-pill"}>
                        {dbtPct >= 99 ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        &nbsp;{dbtPct}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
