"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import * as echarts from "echarts";
import {
  Users,
  ArrowLeftRight,
  Wallet,
  FileText,
} from "lucide-react";
import { demoDistricts, demoSchemes, STATE_TOTALS } from "@/lib/demo-data";
import { scaleDemoValue } from "@/lib/metrics.mjs";
import { AnalyticsComparisonView } from "./AnalyticsComparisonView";
import { FinancialIntelligenceView } from "./FinancialIntelligenceView";
import { ReportsCenterView } from "./ReportsCenterView";

interface BeneficiaryAnalyticsViewProps {
  gu: boolean;
  fy: string;
}

const GENDER_COLORS = ["#FFFFFF", "#8C8C8C", "#333333"];
const SOCIAL_COLORS = ["#FFFFFF", "#D9D9D9", "#8C8C8C", "#333333"];
const AGE_COLORS   = ["#FFFFFF", "#D9D9D9", "#A8A8A8", "#6B6B6B", "#333333"];

export function BeneficiaryAnalyticsView({ gu, fy }: BeneficiaryAnalyticsViewProps) {
  const socialChartRef = useRef<HTMLDivElement>(null);
  const ageChartRef    = useRef<HTMLDivElement>(null);
  const genderRef      = useRef<HTMLDivElement>(null);
  const trendRef       = useRef<HTMLDivElement>(null);
  const schemeBarRef   = useRef<HTMLDivElement>(null);

  const [analyticsTab, setAnalyticsTab] = useState<"demographics" | "compare" | "financial" | "reports">("demographics");
  const [filterCategory, setFilterCategory] = useState<"all" | "rural" | "urban">("all");

  const fmt = useCallback(
    (num: number) => new Intl.NumberFormat(gu ? "gu-IN" : "en-IN").format(Math.round(num)),
    [gu]
  );

  const totalBen   = scaleDemoValue(STATE_TOTALS.beneficiaries, fy);
  const ruralBen   = Math.floor(totalBen * 0.742);
  const urbanBen   = Math.floor(totalBen * 0.258);
  const displayBen = filterCategory === "rural" ? ruralBen : filterCategory === "urban" ? urbanBen : totalBen;

  const femaleCount = Math.floor(displayBen * 0.584);
  const maleCount   = Math.floor(displayBen * 0.389);
  const otherCount  = displayBen - femaleCount - maleCount;

  const socialData = useMemo(() => [
    { pct: 0.42, en: "OBC / SEBC",             gu: "OBC / સામાજિક પછાત",  color: SOCIAL_COLORS[0] },
    { pct: 0.28, en: "General / EWS",           gu: "સામાન્ય (General/EWS)", color: SOCIAL_COLORS[1] },
    { pct: 0.18, en: "Scheduled Caste (SC)",    gu: "અનુ. જાતિ (SC)",      color: SOCIAL_COLORS[2] },
    { pct: 0.12, en: "Scheduled Tribe (ST)",    gu: "અનુ. જનજાતિ (ST)",    color: SOCIAL_COLORS[3] },
  ], []);

  const ageData = useMemo(() => [
    { pct: 0.22, en: "0–6",   gu: "૦–૬",   label: gu ? "૦–૬ વર્ષ" : "0–6 yrs" },
    { pct: 0.18, en: "7–18",  gu: "૭–૧૮",  label: gu ? "૭–૧૮ વર્ષ" : "7–18 yrs" },
    { pct: 0.32, en: "19–35", gu: "૧૯–૩૫", label: gu ? "૧૯–૩૫ વર્ષ" : "19–35 yrs" },
    { pct: 0.16, en: "36–55", gu: "૩૬–૫૫", label: gu ? "૩૬–૫૫ વર્ષ" : "36–55 yrs" },
    { pct: 0.12, en: "56+",   gu: "૫૬+",   label: gu ? "૫૬+ વર્ષ" : "56+ yrs" },
  ], [gu]);

  // ── SOCIAL CATEGORY DONUT ──────────────────────────────────────────────
  useEffect(() => {
    if (!socialChartRef.current) return;
    const chart = echarts.getInstanceByDom(socialChartRef.current) || echarts.init(socialChartRef.current);
    chart.setOption({
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        backgroundColor: "#1A1A1A",
        borderColor: "#333333",
        textStyle: { color: "#ffffff" },
        formatter: "{b}: {c} ({d}%)",
      },
      legend: {
        type: "scroll",
        bottom: "0%",
        left: "center",
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { color: "#cbd5e1", fontSize: 11 },
      },
      series: [{
        name: gu ? "સામાજિક શ્રેણી" : "Social Category",
        type: "pie", radius: ["40%", "66%"], center: ["50%", "44%"],
        label: { show: false },
        labelLine: { show: false },
        itemStyle: { borderRadius: 5, borderColor: "rgba(15,23,42,0.8)", borderWidth: 2 },
        data: socialData.map(d => ({
          value: Math.floor(displayBen * d.pct),
          name: gu ? d.gu : d.en,
          itemStyle: { color: d.color },
        })),
        emphasis: { itemStyle: { shadowBlur: 12, shadowOffsetX: 0, shadowColor: "rgba(0,0,0,0.5)" } },
      }],
    });
    const r = () => chart.resize();
    window.addEventListener("resize", r);
    return () => { window.removeEventListener("resize", r); chart.dispose(); };
  }, [gu, displayBen, socialData]);

  // ── AGE BAR ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!ageChartRef.current) return;
    const chart = echarts.getInstanceByDom(ageChartRef.current) || echarts.init(ageChartRef.current);
    chart.setOption({
      backgroundColor: "transparent",
      grid: { left: "4%", right: "4%", bottom: "5%", top: "12%", containLabel: true },
      tooltip: {
        trigger: "axis",
        backgroundColor: "#1A1A1A",
        borderColor: "#333333",
        textStyle: { color: "#ffffff" },
        formatter: (p: any) => `${p[0].name}: <b>${fmt(p[0].value)}</b>`,
      },
      xAxis: { type: "category", data: ageData.map(d => d.label), axisLabel: { color: "#cbd5e1", fontSize: 11, interval: 0 } },
      yAxis: { type: "value", splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } }, axisLabel: { color: "#6B6B6B", fontSize: 10 } },
      series: [{
        name: gu ? "લાભાર્થીઓ" : "Beneficiaries",
        type: "bar", barWidth: "38%",
        data: ageData.map((d, i) => ({
          value: Math.floor(displayBen * d.pct),
          itemStyle: { color: AGE_COLORS[i], borderRadius: [4, 4, 0, 0] },
        })),
      }],
    });
    const r = () => chart.resize();
    window.addEventListener("resize", r);
    return () => { window.removeEventListener("resize", r); chart.dispose(); };
  }, [gu, displayBen, ageData, fmt]);

  // ── GENDER PIE ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!genderRef.current) return;
    const chart = echarts.getInstanceByDom(genderRef.current) || echarts.init(genderRef.current);
    chart.setOption({
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        backgroundColor: "#1A1A1A",
        borderColor: "#333333",
        textStyle: { color: "#ffffff" },
        formatter: "{b}: {c} ({d}%)",
      },
      legend: { bottom: "0%", left: "center", itemWidth: 10, itemHeight: 10, textStyle: { color: "#cbd5e1", fontSize: 11 } },
      series: [{
        name: gu ? "લિંગ" : "Gender",
        type: "pie", radius: ["40%", "65%"], center: ["50%", "44%"],
        label: { show: false },
        labelLine: { show: false },
        itemStyle: { borderRadius: 5, borderColor: "rgba(15,23,42,0.8)", borderWidth: 2 },
        data: [
          { value: femaleCount, name: gu ? "મહિલા" : "Female", itemStyle: { color: GENDER_COLORS[0] } },
          { value: maleCount,   name: gu ? "પુરૂષ" : "Male",   itemStyle: { color: GENDER_COLORS[1] } },
          { value: otherCount,  name: gu ? "અન્ય"  : "Other",  itemStyle: { color: GENDER_COLORS[2] } },
        ],
        emphasis: { itemStyle: { shadowBlur: 12, shadowColor: "rgba(0,0,0,0.5)" } },
      }],
    });
    const r = () => chart.resize();
    window.addEventListener("resize", r);
    return () => { window.removeEventListener("resize", r); chart.dispose(); };
  }, [gu, femaleCount, maleCount, otherCount]);

  // ── ANNUAL TREND (last 5 FYs) ──────────────────────────────────────
  useEffect(() => {
    if (!trendRef.current) return;
    const chart = echarts.getInstanceByDom(trendRef.current) || echarts.init(trendRef.current);
    const years = ["2020-21", "2021-22", "2022-23", "2023-24", "2024-25"];
    const base  = STATE_TOTALS.beneficiaries;
    const vals  = [0.72, 0.80, 0.88, 0.94, 1.0].map(f => Math.floor(base * f));
    chart.setOption({
      backgroundColor: "transparent",
      grid: { left: "4%", right: "4%", bottom: "6%", top: "12%", containLabel: true },
      tooltip: {
        trigger: "axis",
        backgroundColor: "#1A1A1A",
        borderColor: "#333333",
        textStyle: { color: "#ffffff" },
        formatter: (p: any) => `${p[0].name}: <b>${fmt(p[0].value)}</b>`,
      },
      xAxis: { type: "category", data: years, axisLabel: { color: "#cbd5e1", fontSize: 10 } },
      yAxis: { type: "value", splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } }, axisLabel: { color: "#6B6B6B", fontSize: 10 } },
      series: [{
        name: gu ? "લાભાર્થીઓ" : "Beneficiaries",
        type: "line", smooth: true,
        data: vals,
        itemStyle: { color: "#FFFFFF" },
        lineStyle: { width: 3, color: "#FFFFFF" },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(255,255,255,0.25)" },
            { offset: 1, color: "rgba(255,255,255,0.01)" },
          ]),
        },
        symbol: "circle", symbolSize: 8,
      }],
    });
    const r = () => chart.resize();
    window.addEventListener("resize", r);
    return () => { window.removeEventListener("resize", r); chart.dispose(); };
  }, [gu, fmt]);

  // ── SCHEME-WISE BENEFICIARY BAR ────────────────────────────────────
  useEffect(() => {
    if (!schemeBarRef.current) return;
    const chart = echarts.getInstanceByDom(schemeBarRef.current) || echarts.init(schemeBarRef.current);
    const data = demoSchemes.map(s => ({
      name: gu ? (s.shortNameGu || s.shortName) : s.shortName,
      value: scaleDemoValue(s.beneficiariesStatewide ?? 50000, fy),
    })).sort((a, b) => b.value - a.value);
    chart.setOption({
      backgroundColor: "transparent",
      grid: { left: "4%", right: "12%", bottom: "4%", top: "12%", containLabel: true },
      tooltip: {
        trigger: "axis",
        backgroundColor: "#1A1A1A",
        borderColor: "#333333",
        textStyle: { color: "#ffffff" },
        formatter: (p: any) => `${p[0].name}: <b>${fmt(p[0].value)}</b>`,
      },
      xAxis: { type: "value", axisLabel: { color: "#6B6B6B", fontSize: 10 }, splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } } },
      yAxis: { type: "category", data: data.map(d => d.name), axisLabel: { color: "#cbd5e1", fontSize: 11, width: 100, overflow: "truncate" } },
      series: [{
        name: gu ? "લાભાર્થીઓ" : "Beneficiaries",
        type: "bar", barWidth: "55%",
        data: data.map((d, i) => ({
          value: d.value,
          itemStyle: { color: SOCIAL_COLORS[i % SOCIAL_COLORS.length], borderRadius: [0, 4, 4, 0] },
        })),
        label: { show: true, position: "right", color: "#f8fafc", fontSize: 11, fontWeight: "bold", formatter: (p: any) => fmt(p.value) },
      }],
    });
    const r = () => chart.resize();
    window.addEventListener("resize", r);
    return () => { window.removeEventListener("resize", r); chart.dispose(); };
  }, [gu, fy, fmt]);

  const topDistrict = useMemo(() => demoDistricts.reduce((a, b) => a.beneficiaries > b.beneficiaries ? a : b), []);

  return (
    <div className="beneficiaries-analytics-page">
      {/* Subnav Tabs */}
      <div className="report-type-bar" style={{ marginBottom: "1rem" }}>
        {[
          { key: "demographics" as const, labelGu: "લાભાર્થી વિશ્લેષણ", labelEn: "Demographics", icon: Users },
          { key: "compare" as const, labelGu: "જિલ્લા તુલના (Side-by-Side)", labelEn: "District Comparison", icon: ArrowLeftRight },
          { key: "financial" as const, labelGu: "નાણાકીય ઇન્ટેલિજન્સ & DBT", labelEn: "Financial & DBT", icon: Wallet },
          { key: "reports" as const, labelGu: "અહેવાલો અને નિકાસ", labelEn: "Reports & Exports", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = analyticsTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              className={`cat-pill-btn ${isActive ? "active" : ""}`}
              onClick={() => setAnalyticsTab(tab.key)}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Icon size={14} />
              <span>{gu ? tab.labelGu : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {analyticsTab === "compare" && <AnalyticsComparisonView gu={gu} fy={fy} />}
      {analyticsTab === "financial" && <FinancialIntelligenceView gu={gu} fy={fy} />}
      {analyticsTab === "reports" && <ReportsCenterView gu={gu} fy={fy} />}

      {analyticsTab === "demographics" && (
        <>
          {/* Hero */}
          <div className="page-hero-gov">
            <div>
              <span className="hero-kicker-tag">
                {gu ? "લાભાર્થી વિશ્લેષણ · ૩૪ જિલ્લા" : "BENEFICIARY DEMOGRAPHICS · 34 DISTRICTS"}
              </span>
              <h1>{gu ? "લાભાર્થી વસ્તી અને સામાજિક આવરણ" : "Beneficiary Demographic Intelligence"}</h1>
              <p>
                {gu
                  ? "વય, સામાજિક, લિંગ અને યોજના-વાર વિભાજન. ઉદાહરણ ચાર્ટ — સ્ત્રોત: LGD + iDraft ડેમો ઈન્જિન."
                  : "Age, social category, gender, and scheme-wise demographic split. Illustrative charts — demo engine data."}
              </p>
            </div>
            <div className="hero-filter-row">
              {(["all", "rural", "urban"] as const).map(f => (
                <button
                  key={f}
                  className={`cat-pill-btn ${filterCategory === f ? "active" : ""}`}
                  onClick={() => setFilterCategory(f)}
                >
                  {f === "all" ? (gu ? "સમગ્ર" : "All") : f === "rural" ? (gu ? "ગ્રામ્ય" : "Rural") : (gu ? "શહેરી" : "Urban")}
                </button>
              ))}
            </div>
          </div>

          {/* KPI Strip */}
          <div className="stats-strip-4">
            <div className="stat-card-compact">
              <span className="stat-label">{gu ? "કુલ નોંધાયેલ" : "Total Beneficiaries"}</span>
              <strong className="text-mono-white">{fmt(displayBen)}</strong>
              <small>{filterCategory === "rural" ? (gu ? "ગ્રામ્ય" : "Rural") : filterCategory === "urban" ? (gu ? "શહેરી" : "Urban") : (gu ? "સમગ્ર" : "All")}</small>
            </div>
            <div className="stat-card-compact">
              <span className="stat-label">{gu ? "ગ્રામ્ય આવરણ" : "Rural Penetration"}</span>
              <strong className="text-mono-white">74.2%</strong>
              <small>{gu ? "ઉદાહરણ વિતરણ" : "Demo distribution"}</small>
            </div>
            <div className="stat-card-compact">
              <span className="stat-label">{gu ? "મહિલા લાભ" : "Female Beneficiaries"}</span>
              <strong className="text-mono-white">{fmt(femaleCount)}</strong>
              <small>58.4% {gu ? "મહિલા" : "female"}</small>
            </div>
            <div className="stat-card-compact">
              <span className="stat-label">{gu ? "ટોચ જિલ્લો" : "Top District"}</span>
              <strong className="text-mono-silver">{gu ? topDistrict.gu : topDistrict.name}</strong>
              <small>{fmt(topDistrict.beneficiaries)} {gu ? "લાભાર્થી" : "beneficiaries"}</small>
            </div>
          </div>

          {/* Row 1: Social + Age */}
          <div className="overview-analytics-grid">
            <div className="analytics-card-gov">
              <div className="card-head-gov">
                <div>
                  <h3>{gu ? "સામાજિક શ્રેણી મુજબ વિતરણ" : "Distribution by Social Category"}</h3>
                  <small>{gu ? "SC / ST / OBC / GEN — ઉદાહરણ વિભાજન" : "SC / ST / OBC / GEN — Illustrative split"}</small>
                </div>
                <span className="badge-pill">SC / ST / OBC</span>
              </div>
              <div ref={socialChartRef} className="chart-box-echarts" />
              <div className="social-legend-row">
                {socialData.map(d => (
                  <div key={d.en} className="social-legend-item">
                    <span className="legend-dot" style={{ background: d.color }} />
                    <span className="legend-label">{gu ? d.gu : d.en}</span>
                    <strong>{Math.round(d.pct * 100)}%</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="analytics-card-gov">
              <div className="card-head-gov">
                <div>
                  <h3>{gu ? "વયજૂથ વિશ્લેષણ" : "Age Cohort Distribution"}</h3>
                  <small>{gu ? "૦ થી ૫૬+ — ઉદાહરણ ડેટા" : "0 to 56+ — Illustrative data"}</small>
                </div>
                <span className="badge-pill">0–60+ Yrs</span>
              </div>
              <div ref={ageChartRef} className="chart-box-echarts" />
            </div>
          </div>

          {/* Row 2: Gender + 5-year trend */}
          <div className="overview-analytics-grid">
            <div className="analytics-card-gov">
              <div className="card-head-gov">
                <div>
                  <h3>{gu ? "લિંગ-આધારિત વિભાજન" : "Gender-wise Distribution"}</h3>
                  <small>{gu ? "ઉદાહરણ — 58% મહિલા, 39% પુરૂષ, 3% અન્ય" : "Illustrative — 58% female, 39% male, 3% other"}</small>
                </div>
                <span className="badge-pill">M / F / Other</span>
              </div>
              <div ref={genderRef} className="chart-box-echarts" />
            </div>

            <div className="analytics-card-gov">
              <div className="card-head-gov">
                <div>
                  <h3>{gu ? "છેલ્લા ૫ વર્ષ — વૃદ્ધિ વલણ" : "5-Year Growth Trend"}</h3>
                  <small>{gu ? "2020–21 થી 2024–25 લાભાર્થી સંખ્યા" : "Beneficiary count 2020–21 to 2024–25"}</small>
                </div>
                <span className="badge-pill">FY 2020–25</span>
              </div>
              <div ref={trendRef} className="chart-box-echarts" />
            </div>
          </div>

          {/* Row 3: Scheme-wise bar (full width) */}
          <div className="panel-gov">
            <div className="panel-gov-head">
              <div>
                <h3>{gu ? "યોજનાવાર લાભાર્થી સંખ્યા (ઉચ્ચ→નિમ્ન)" : "Scheme-wise Beneficiary Count (High → Low)"}</h3>
                <small>{gu ? "ઉદાહરણ ડેટા · ૧૦ યોજનાઓ" : `${demoSchemes.length} schemes — Illustrative data`}</small>
              </div>
              <span className="badge-pill">FY {fy}</span>
            </div>
            <div ref={schemeBarRef} style={{ height: 320, width: "100%" }} />
          </div>

          {/* District Top-5 Cards */}
          <section className="panel-gov">
            <div className="panel-gov-head">
              <div>
                <h3>{gu ? "ટોચ ૫ જિલ્લા — સૌથી વધુ લાભ" : "Top 5 Districts by Beneficiary Reach"}</h3>
                <small>{gu ? "ઉદ. ડેટા · FY " + fy : "Demo data · FY " + fy}</small>
              </div>
            </div>
            <div className="stats-strip-4" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
              {[...demoDistricts]
                .sort((a, b) => b.beneficiaries - a.beneficiaries)
                .slice(0, 5)
                .map((d, i) => (
                  <div key={d.id} className="stat-card-compact">
                    <span className="rank-badge" style={{ marginBottom: 6 }}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="stat-label">{gu ? d.gu : d.name}</span>
                    <strong className="text-mono-white">{fmt(scaleDemoValue(d.beneficiaries, fy))}</strong>
                    <small>{d.talukaCount} {gu ? "તાલુકા" : "talukas"}</small>
                  </div>
                ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
