"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { Users, PieChart, TrendingUp, Layers, ShieldCheck, HeartHandshake } from "lucide-react";
import { STATE_TOTALS } from "@/lib/demo-data";
import { scaleDemoValue } from "@/lib/metrics.mjs";

interface BeneficiaryAnalyticsViewProps {
  gu: boolean;
  fy: string;
}

export function BeneficiaryAnalyticsView({ gu, fy }: BeneficiaryAnalyticsViewProps) {
  const socialChartRef = useRef<HTMLDivElement>(null);
  const ageChartRef = useRef<HTMLDivElement>(null);

  const fmt = (num: number) => new Intl.NumberFormat(gu ? "gu-IN" : "en-IN").format(num);

  const totalBen = scaleDemoValue(STATE_TOTALS.beneficiaries, fy);

  // ECharts Social Category Pie Chart
  useEffect(() => {
    if (!socialChartRef.current) return;
    const chart = echarts.init(socialChartRef.current);

    chart.setOption({
      tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
      legend: { bottom: "2%", left: "center" },
      series: [
        {
          name: gu ? "સામાજિક શ્રેણી" : "Social Category",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["50%", "45%"],
          itemStyle: { borderRadius: 4, borderColor: "#fff", borderWidth: 2 },
          data: [
            { value: Math.floor(totalBen * 0.42), name: gu ? "OBC / સામાજિક પછાત" : "OBC / SEBC", itemStyle: { color: "#0f766e" } },
            { value: Math.floor(totalBen * 0.28), name: gu ? "સામાન્ય (General / EWS)" : "General / EWS", itemStyle: { color: "#0284c7" } },
            { value: Math.floor(totalBen * 0.18), name: gu ? "અનુસૂચિત જાતિ (SC)" : "Scheduled Caste (SC)", itemStyle: { color: "#d97706" } },
            { value: Math.floor(totalBen * 0.12), name: gu ? "અનુસૂચિત જનજાતિ (ST)" : "Scheduled Tribe (ST)", itemStyle: { color: "#8b5cf6" } },
          ],
        },
      ],
    });

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [gu, totalBen]);

  // ECharts Age Distribution Bar Chart
  useEffect(() => {
    if (!ageChartRef.current) return;
    const chart = echarts.init(ageChartRef.current);

    chart.setOption({
      grid: { left: "4%", right: "4%", bottom: "5%", top: "12%", containLabel: true },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: gu
          ? ["૦-૬ વર્ષ (બાળકી)", "૭-૧૮ વર્ષ (કન્યા)", "૧૯-૩૫ વર્ષ (માતૃત્વ)", "૩૬-૫૫ વર્ષ (સ્વાવલંબન)", "૫૬+ વર્ષ (ગંગા સ્વરૂપા)"]
          : ["0-6 Yrs (Infant)", "7-18 Yrs (Girl)", "19-35 Yrs (Maternal)", "36-55 Yrs (Enterprise)", "56+ Yrs (Widow)"],
        axisLabel: { color: "#475569", fontSize: 10 },
      },
      yAxis: { type: "value", splitLine: { lineStyle: { color: "#f1f5f9" } } },
      series: [
        {
          name: gu ? "લાભાર્થીઓ" : "Beneficiaries",
          type: "bar",
          barWidth: "35%",
          itemStyle: { color: "#0d9488", borderRadius: [4, 4, 0, 0] },
          data: [
            Math.floor(totalBen * 0.22),
            Math.floor(totalBen * 0.18),
            Math.floor(totalBen * 0.32),
            Math.floor(totalBen * 0.16),
            Math.floor(totalBen * 0.12),
          ],
        },
      ],
    });

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [gu, totalBen]);

  return (
    <div className="beneficiaries-analytics-page">
      {/* Hero */}
      <div className="page-hero-gov">
        <div>
          <span className="hero-kicker-tag">
            {gu ? "લાભાર્થી વિશ્લેષણ મંચ" : "BENEFICIARY DEMOGRAPHICS"}
          </span>
          <h1>{gu ? "લાભાર્થી વસ્તી અને સામાજિક આવરણ" : "Beneficiary Demographic Intelligence"}</h1>
          <p>
            {gu
              ? "સામાજિક જૂથો, વયજૂથો અને ગ્રામીણ-શહેરી વિભાજન મુજબ કલ્યાણકારી યોજનાઓનું સંતુલિત વિતરણ."
              : "Equity, coverage and inclusion metrics tracking scheme reach across age, social categories, and rural/urban areas."}
          </p>
        </div>
      </div>

      {/* 4 Cards Strip */}
      <div className="stats-strip-4">
        <div className="stat-card-compact">
          <span className="stat-label">{gu ? "કુલ નોંધાયેલ લાભાર્થીઓ" : "Total Beneficiaries"}</span>
          <strong>{fmt(totalBen)}</strong>
          <small>{gu ? "ઉદાહરણ આંકડો · સત્તાવાર નથી" : "Illustrative figure · not official"}</small>
        </div>

        <div className="stat-card-compact">
          <span className="stat-label">{gu ? "ગ્રામીણ આવરણ ટકાવારી" : "Rural Penetration"}</span>
          <strong className="text-teal">74.2%</strong>
          <small>{gu ? "ડેમો વિતરણ · ચકાસાયેલ નથી" : "Demo distribution · unverified"}</small>
        </div>

        <div className="stat-card-compact">
          <span className="stat-label">{gu ? "શહેરી આવરણ ટકાવારી" : "Urban Penetration"}</span>
          <strong className="text-navy">25.8%</strong>
          <small>{gu ? "ડેમો વિતરણ · ચકાસાયેલ નથી" : "Demo distribution · unverified"}</small>
        </div>

        <div className="stat-card-compact">
          <span className="stat-label">{gu ? "DPDP પ્રાઈવસી સુરક્ષા" : "DPDP Privacy Guard"}</span>
          <strong className="text-emerald">{gu ? "એકત્રિત" : "Aggregate"}</strong>
          <small>{gu ? "વ્યક્તિગત લાભાર્થી વિગતો નથી" : "No person-level beneficiary details"}</small>
        </div>
      </div>

      {/* Two Demographic Charts */}
      <div className="overview-analytics-grid">
        <div className="analytics-card-gov">
          <div className="card-head-gov">
            <div>
              <h3>{gu ? "સામાજિક શ્રેણી મુજબ વિતરણ" : "Distribution by Social Category"}</h3>
              <small>{gu ? "ઉદાહરણ વિભાજન · સત્તાવાર ડેટા નથી" : "Illustrative split · not official data"}</small>
            </div>
            <span className="badge-pill">SC / ST / OBC / GEN</span>
          </div>
          <div ref={socialChartRef} className="chart-box-echarts" />
        </div>

        <div className="analytics-card-gov">
          <div className="card-head-gov">
            <div>
              <h3>{gu ? "લાભાર્થીઓનું વયજૂથ વિશ્લેષણ" : "Age Cohort Distribution"}</h3>
              <small>{gu ? "ઉદાહરણ વિભાજન · સત્તાવાર ડેટા નથી" : "Illustrative split · not official data"}</small>
            </div>
            <span className="badge-pill">0 to 60+ Years</span>
          </div>
          <div ref={ageChartRef} className="chart-box-echarts" />
        </div>
      </div>
    </div>
  );
}
