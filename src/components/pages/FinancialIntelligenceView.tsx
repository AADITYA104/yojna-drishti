"use client";

import React, { useEffect, useRef, useMemo, useCallback } from "react";
import * as echarts from "echarts";
import { demoSchemes, STATE_TOTALS } from "@/lib/demo-data";
import { scaleDemoValue } from "@/lib/metrics.mjs";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { DRISHTI_PALETTE } from "@/lib/echarts-theme";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { localizeText, type AppLanguage } from "@/lib/i18n";

interface FinancialIntelligenceViewProps {
  gu: boolean;
  lang?: AppLanguage;
  fy: string;
}

const MONTHLY_BASE = [112, 128, 142, 155, 168, 162, 175, 180, 188, 195, 204, 218];
const HOLST_PALETTE = ["#4D79A8", "#6E9ECC", "#9FC0E3", "#355982", "#2D7D84", "#6B4EAE", "#C07820", "#55934b", "#cc6654", "#df9826"];

export function FinancialIntelligenceView({ gu, lang, fy }: FinancialIntelligenceViewProps) {
  useScrollReveal();
  const currentLang: AppLanguage = lang ?? (gu ? "gu" : "en");
  const t = useCallback(
    (guText: string, hiText: string, enText: string) => {
      if (currentLang === "gu") return guText;
      if (currentLang === "hi") return hiText;
      return enText;
    },
    [currentLang]
  );
  const lineChartRef   = useRef<HTMLDivElement>(null);
  const schemeDonutRef = useRef<HTMLDivElement>(null);
  const regionBarRef   = useRef<HTMLDivElement>(null);
  const utilBarRef     = useRef<HTMLDivElement>(null);

  const fmt = useCallback(
    (n: number) => new Intl.NumberFormat(currentLang === "gu" ? "gu-IN" : currentLang === "hi" ? "hi-IN" : "en-IN").format(Math.round(n)),
    [currentLang]
  );

  const totalDisbursed = useMemo(() => scaleDemoValue(STATE_TOTALS.disbursedCr, fy), [fy]);
  const allocated      = scaleDemoValue(2150, fy);
  const utilRate       = Math.min(99, Math.round((totalDisbursed / allocated) * 100));
  const avgPerBen      = scaleDemoValue(18680, fy);
  const dbtSuccessRate = 99.2;

  const months = useMemo(() => {
    if (currentLang === "gu") return ["એ", "મે", "જૂ", "જુ", "ઓ", "સ", "ઓ", "ન", "ડ", "જ", "ફ", "મા"];
    if (currentLang === "hi") return ["अप्रै", "मई", "जून", "जुला", "अग", "सित", "अक्टू", "नव", "दिस", "जन", "फ़र", "मार्च"];
    return ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  }, [currentLang]);

  // ── MONTHLY LINE ────────────────────────────────────────────────────
  useEffect(() => {
    if (!lineChartRef.current) return;
    const chart = echarts.init(lineChartRef.current);
    const vals  = MONTHLY_BASE.map(v => scaleDemoValue(v, fy));
    chart.setOption({
      grid: { left: "4%", right: "4%", bottom: "6%", top: "12%", containLabel: true },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(34, 58, 94, 0.95)",
        borderColor: "#4D79A8",
        borderWidth: 1,
        textStyle: { color: "#FFFFFF" },
        formatter: (p: any) => `${p[0].name}: <b>₹ ${p[0].value} Cr</b>`,
      },
      xAxis: {
        type: "category",
        data: months,
        axisLine: { lineStyle: { color: "rgba(110, 158, 204, 0.3)" } },
        axisLabel: { color: "#355982", fontSize: 11, fontWeight: 500 },
      },
      yAxis: {
        type: "value",
        axisLabel: { formatter: "₹{value}Cr", color: "#4D79A8", fontSize: 10 },
        splitLine: { lineStyle: { color: "rgba(110, 158, 204, 0.12)" } },
      },
      series: [{
        name: t("DBT સીધી સહાય", "डीबीटी प्रत्यक्ष सहायता", "DBT Outflow"),
        type: "line", smooth: true,
        data: vals,
        itemStyle: { color: "#4D79A8" },
        lineStyle: { width: 3, color: "#4D79A8" },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(77, 121, 168, 0.35)" },
            { offset: 1, color: "rgba(77, 121, 168, 0.02)" },
          ]),
        },
        symbol: "circle", symbolSize: 7,
      }],
    });
    const r = () => chart.resize();
    window.addEventListener("resize", r);
    return () => { window.removeEventListener("resize", r); chart.dispose(); };
  }, [fy, months, t]);

  // ── SCHEME DONUT ────────────────────────────────────────────────────
  useEffect(() => {
    if (!schemeDonutRef.current) return;
    const chart = echarts.init(schemeDonutRef.current);
    chart.setOption({
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(34, 58, 94, 0.95)",
        borderColor: "#4D79A8",
        borderWidth: 1,
        textStyle: { color: "#FFFFFF" },
        formatter: "{b}: ₹{c} Cr ({d}%)",
      },
      legend: {
        type: "scroll",
        bottom: 0,
        left: "center",
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { color: "#355982", fontSize: 11, fontWeight: 500 },
      },
      series: [{
        name: t("યોજના હિસ્સો", "योजना हिस्सेदारी", "Scheme Share"),
        type: "pie",
        radius: ["40%", "65%"],
        center: ["50%", "43%"],
        label: { show: false },
        labelLine: { show: false },
        itemStyle: { borderRadius: 6, borderColor: "#FFFFFF", borderWidth: 2 },
        data: demoSchemes.map((s, i) => ({
          value: scaleDemoValue(s.budgetDisbursedCr, fy),
          name: currentLang === "gu" ? (s.shortNameGu || s.shortName) : currentLang === "hi" ? localizeText("hi", s.shortName) : s.shortName,
          itemStyle: { color: HOLST_PALETTE[i % HOLST_PALETTE.length] },
        })),
      }],
    });
    const r = () => chart.resize();
    window.addEventListener("resize", r);
    return () => { window.removeEventListener("resize", r); chart.dispose(); };
  }, [fy, currentLang, t]);

  // ── REGION BAR ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!regionBarRef.current) return;
    const chart = echarts.init(regionBarRef.current);
    const regions = ["Saurashtra", "Central", "South", "North", "Kutch", "East"];
    const regGu   = ["સૌરાષ્ટ્ર", "મધ્ય", "દ.ગુ.", "ઉ.ગુ.", "કચ્છ", "પૂ.ગુ."];
    const regHi   = ["सौराष्ट्र", "मध्य", "द.गु.", "उ.गु.", "कच्छ", "पू.गु."];
    const regVals  = [420, 380, 310, 290, 150, 200].map(v => scaleDemoValue(v, fy));
    chart.setOption({
      grid: { left: "4%", right: "4%", bottom: "5%", top: "12%", containLabel: true },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(34, 58, 94, 0.95)",
        borderColor: "#4D79A8",
        borderWidth: 1,
        textStyle: { color: "#FFFFFF" },
        formatter: (p: any) => `${p[0].name}: <b>₹ ${p[0].value} Cr</b>`,
      },
      xAxis: {
        type: "category",
        data: currentLang === "gu" ? regGu : currentLang === "hi" ? regHi : regions,
        axisLine: { lineStyle: { color: "rgba(110, 158, 204, 0.3)" } },
        axisLabel: { color: "#355982", fontSize: 11, interval: 0, fontWeight: 500 },
      },
      yAxis: {
        type: "value",
        axisLabel: { formatter: "₹{value}Cr", color: "#4D79A8", fontSize: 10 },
        splitLine: { lineStyle: { color: "rgba(110, 158, 204, 0.12)" } },
      },
      series: [{
        name: t("DBT સહાય", "डीबीटी सहायता", "DBT (Cr)"),
        type: "bar",
        barWidth: "40%",
        data: regVals.map((v, i) => ({
          value: v,
          itemStyle: {
            color: {
              type: "linear",
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: HOLST_PALETTE[i % HOLST_PALETTE.length] },
                { offset: 1, color: "rgba(77, 121, 168, 0.45)" },
              ],
            },
            borderRadius: [6, 6, 0, 0],
          },
        })),
        label: { show: true, position: "top", color: "#223A5E", fontSize: 11, fontWeight: "bold", formatter: (p: any) => `₹${p.value}` },
      }],
    });
    const r = () => chart.resize();
    window.addEventListener("resize", r);
    return () => { window.removeEventListener("resize", r); chart.dispose(); };
  }, [currentLang, fy, t]);

  // ── UTILIZATION GAUGE ───────────────────────────────────────────────
  useEffect(() => {
    if (!utilBarRef.current) return;
    const chart = echarts.init(utilBarRef.current);
    chart.setOption({
      series: [{
        name: t("ઉપયોગ દર", "उपयोग दर", "Budget Utilization"),
        type: "gauge",
        radius: "84%",
        startAngle: 200, endAngle: -20,
        min: 0, max: 100,
        progress: {
          show: true,
          roundCap: true,
          width: 16,
          itemStyle: {
            color: {
              type: "linear",
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: "#6E9ECC" },
                { offset: 1, color: "#4D79A8" },
              ],
            },
          },
        },
        pointer: { show: true, length: "55%", width: 4, itemStyle: { color: "#223A5E" } },
        axisLine: { lineStyle: { width: 16, color: [[1, "rgba(110, 158, 204, 0.2)"]] } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          valueAnimation: true,
          formatter: "{value}%",
          color: "#223A5E",
          fontSize: 26,
          fontWeight: "bold",
          offsetCenter: [0, "30%"],
        },
        data: [{ value: utilRate, name: t("ઉપયોગ", "उपयोग", "Utilized") }],
        title: { offsetCenter: [0, "55%"], color: "#4D79A8", fontSize: 12, fontWeight: 600 },
      }],
    });
    const r = () => chart.resize();
    window.addEventListener("resize", r);
    return () => { window.removeEventListener("resize", r); chart.dispose(); };
  }, [utilRate, currentLang, t]);

  return (
    <div className="financial-intel-page">

      {/* Hero */}
      <div className="page-hero-gov">
        <div>
          <span className="hero-kicker-tag">
            {t("ડેમો પૂર્વદર્શન · DBT નાણાકીય ઉદાહરણ", "डेमो पूर्वावलोकन · डीबीटी वित्तीय उदाहरण", "DEMO PREVIEW · DBT FINANCIAL EXAMPLE")}
          </span>
          <h1>{t(`DBT સીધી સહાય ચુકવણી · ₹ ${fmt(totalDisbursed)} Cr`, `डीबीटी प्रत्यक्ष लाभ भुगतान · ₹ ${fmt(totalDisbursed)} Cr`, `Public Spending & Direct Benefit Transfers · ₹ ${fmt(totalDisbursed)} Cr`)}</h1>
          <p>
            {t(
              `FY ${fy} — કૃત્રિમ નમૂનાના આંકડા. સત્તાવાર DBT/બજેટ ડેટા જોડાયેલો નથી.`,
              `FY ${fy} — उदाहरणात्मक सिंथेटिक आंकड़े। आधिकारिक डीबीटी/बजट डेटा जुड़ा नहीं है।`,
              `FY ${fy} — illustrative synthetic figures. Official DBT and budget data are not connected.`
            )}
          </p>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="stats-strip-4 reveal-stagger is-visible">
        <div className="stat-card-compact card-lift">
          <span className="stat-label">{t("ફાળવેલ બજેટ", "आवंटित बजट", "Allocated Budget")}</span>
          <strong className="text-mono-white">₹ {fmt(allocated)} Cr</strong>
          <small>{t(`ઉદ. ફાળવણી · FY ${fy}`, `डेमो आवंटन · FY ${fy}`, `Demo · FY ${fy}`)}</small>
        </div>
        <div className="stat-card-compact card-lift">
          <span className="stat-label">{t("વિતરિત (DBT)", "कुल वितरित (DBT)", "Total Disbursed")}</span>
          <strong className="text-mono-white">₹ {fmt(totalDisbursed)} Cr</strong>
          <small>{t(`ઉ. ગ. · FY ${fy}`, `डेमो गणना · FY ${fy}`, `Demo calc · FY ${fy}`)}</small>
        </div>
        <div className="stat-card-compact card-lift">
          <span className="stat-label">{t("DBT સફળ ટ્રાન્ઝેક્શન", "डीबीटी सफल दर", "DBT Success Rate")}</span>
          <strong className="text-mono-white">{dbtSuccessRate}%</strong>
          <small>{t("ઉ. ગ. · અચકાસાયેલ", "डेमो · असत्यापित", "Demo · unverified")}</small>
        </div>
        <div className="stat-card-compact card-lift">
          <span className="stat-label">{t("સરેરાશ સહાય / લાભાર્થી", "औसत सहायता / लाभार्थी", "Avg Assist / Beneficiary")}</span>
          <strong className="text-mono-silver">₹ {fmt(avgPerBen)}</strong>
          <small>{t("ઉ. ગ. · અચકાસાયેલ", "डेमो · असत्यापित", "Demo · unverified")}</small>
        </div>
      </div>

      {/* Row 1: Monthly trend + Budget gauge */}
      <div className="overview-analytics-grid reveal">
        <div className="analytics-card-gov chart-animate card-lift">
          <div className="card-head-gov">
            <div>
              <h3>{t("માસિક DBT ખર્ચ (₹ કરોડ)", "मासिक डीबीटी व्यय (₹ करोड़)", "Monthly DBT Expenditure (₹ Crores)")}</h3>
              <small>{t(`FY ${fy} — ૧૨ મહિના ટ્રૅન્ડ`, `FY ${fy} — 12 महीने का रुझान`, `FY ${fy} — 12-month outflow trend`)}</small>
            </div>
            <span className="badge-pill">FY {fy}</span>
          </div>
          <div ref={lineChartRef} className="chart-box-echarts" />
        </div>

        <div className="analytics-card-gov chart-animate card-lift">
          <div className="card-head-gov">
            <div>
              <h3>{t("બજેટ ઉપયોગ ગેજ", "बजट उपयोग गेज", "Budget Utilization Gauge")}</h3>
              <small>{t(`₹ ${fmt(totalDisbursed)} વિતરિત / ₹ ${fmt(allocated)} Cr ફાળવેલ`, `₹ ${fmt(totalDisbursed)} वितरित / ₹ ${fmt(allocated)} Cr आवंटित`, `₹ ${fmt(totalDisbursed)} disbursed of ₹ ${fmt(allocated)} Cr`)}</small>
            </div>
            <span className="badge-pill">{utilRate}% {t("વપરાયેલ", "प्रयुक्त", "Used")}</span>
          </div>
          <div ref={utilBarRef} style={{ height: 240, width: "100%" }} />
        </div>
      </div>

      {/* Row 2: Scheme donut + Region bar */}
      <div className="overview-analytics-grid reveal">
        <div className="analytics-card-gov chart-animate card-lift">
          <div className="card-head-gov">
            <div>
              <h3>{t("યોજના-વાર DBT હિસ્સો", "योजना-वार डीबीटी हिस्सेदारी", "Scheme-wise DBT Share")}</h3>
              <small>{t("કઈ યોજનામાં કેટલું ફાળવ્યું", "किस योजना में कितना आवंटन", "DBT allocation across schemes")}</small>
            </div>
            <span className="badge-pill">{demoSchemes.length} {t("યોજનાઓ", "योजनाएँ", "Schemes")}</span>
          </div>
          <div ref={schemeDonutRef} className="chart-box-echarts" />
        </div>

        <div className="analytics-card-gov">
          <div className="card-head-gov">
            <div>
              <h3>{t("ક્ષેત્ર-વાર DBT વિભાજન", "क्षेत्र-वार डीबीटी वितरण", "Region-wise DBT Breakdown")}</h3>
              <small>{t("સૌ., મ., દ., ઉ., ક., પૂ. ગુ.", "सौ., म., द., उ., क., पू. गु.", "Saurashtra, Central, South, North, Kutch, East")}</small>
            </div>
            <span className="badge-pill">{t("૬ ક્ષેત્રો", "6 क्षेत्र", "6 Regions")}</span>
          </div>
          <div ref={regionBarRef} className="chart-box-echarts" />
        </div>
      </div>

      {/* Scheme-by-Scheme Budget Table */}
      <div className="panel-gov">
        <div className="panel-gov-head">
          <div>
            <h3>{t("યોજનાવાર બજેટ ફાળવણી અને ઉપયોગ", "योजनावार बजट आवंटन एवं व्यय", "Scheme-wise Budget Allocation vs Spending")}</h3>
            <small>{t(`કૃત્રિમ નમૂનો · FY ${fy}`, `सिंथेटिक नमूना · FY ${fy}`, `Illustrative · FY ${fy}`)}</small>
          </div>
          <span className="badge-pill">FY {fy}</span>
        </div>
        <div className="gov-table-wrap">
          <table className="gov-data-table">
            <thead>
              <tr>
                <th>{t("યોજના", "योजना", "Scheme")}</th>
                <th>{t("શ્રેણી", "श्रेणी", "Category")}</th>
                <th>{t("ફાળવણી (Cr)", "आवंटन (Cr)", "Allocated (Cr)")}</th>
                <th>{t("વિતરણ (Cr)", "वितरण (Cr)", "Disbursed (Cr)")}</th>
                <th>{t("ઉપયોગ %", "उपयोग %", "Utilization %")}</th>
                <th>{t("DBT %", "डीबीटी %", "DBT %")}</th>
              </tr>
            </thead>
            <tbody>
              {demoSchemes.map((s, idx) => {
                const alloc  = scaleDemoValue(s.budgetAllocatedCr, fy);
                const disb   = scaleDemoValue(s.budgetDisbursedCr, fy);
                const util   = alloc > 0 ? Math.min(100, Math.round((disb / alloc) * 100)) : 0;
                // Deterministic calculation based on scheme index & charCode
                const dbtPct = 95 + ((s.id.charCodeAt(0) + idx) % 5);
                return (
                  <tr key={s.id}>
                    <td>
                      <strong>{currentLang === "gu" ? s.shortNameGu : currentLang === "hi" ? localizeText("hi", s.shortName) : s.shortName}</strong>
                      <small className="block text-muted">{s.id}</small>
                    </td>
                    <td>{currentLang === "gu" ? s.categoryGu : currentLang === "hi" ? localizeText("hi", s.category) : s.category}</td>
                    <td>₹ {fmt(alloc)} Cr</td>
                    <td><strong className="text-mono-white">₹ {fmt(disb)} Cr</strong></td>
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
