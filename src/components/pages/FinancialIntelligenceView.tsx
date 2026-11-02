"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { Wallet, TrendingUp, CheckCircle2, ArrowUpRight, ArrowDownRight, Landmark } from "lucide-react";
import { demoSchemes, STATE_TOTALS } from "@/lib/demo-data";
import { scaleDemoValue } from "@/lib/metrics.mjs";

interface FinancialIntelligenceViewProps {
  gu: boolean;
  fy: string;
}

export function FinancialIntelligenceView({ gu, fy }: FinancialIntelligenceViewProps) {
  const lineChartRef = useRef<HTMLDivElement>(null);

  const fmt = (num: number) => new Intl.NumberFormat(gu ? "gu-IN" : "en-IN").format(num);

  const totalDisbursed = scaleDemoValue(STATE_TOTALS.disbursedCr, fy);

  // ECharts Monthly Trend
  useEffect(() => {
    if (!lineChartRef.current) return;
    const chart = echarts.init(lineChartRef.current);

    const months = gu
      ? ["એપ્રિ", "મે", "જૂન", "જુલા", "ઓગ", "સપ્ટે", "ઓક્ટો", "નવે", "ડિસે", "જાન્યુ", "ફેબ્રુ", "માર્ચ"]
      : ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

    const monthlyVals = [112, 128, 142, 155, 168, 162, 175, 180, 188, 195, 204, 218].map((v) =>
      scaleDemoValue(v, fy)
    );

    chart.setOption({
      grid: { left: "4%", right: "4%", bottom: "6%", top: "12%", containLabel: true },
      tooltip: { trigger: "axis", formatter: "{b}: ₹ {c} Cr" },
      xAxis: { type: "category", data: months, axisLabel: { color: "#475569" } },
      yAxis: { type: "value", axisLabel: { formatter: "₹{value} Cr" }, splitLine: { lineStyle: { color: "#f1f5f9" } } },
      series: [
        {
          name: gu ? "માસિક ચૂકવણી" : "Monthly DBT",
          type: "line",
          smooth: true,
          data: monthlyVals,
          itemStyle: { color: "#0f766e" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(15, 118, 110, 0.35)" },
              { offset: 1, color: "rgba(15, 118, 110, 0.02)" },
            ]),
          },
        },
      ],
    });

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [gu, fy]);

  return (
    <div className="financial-intel-page">
      {/* Page Hero */}
      <div className="page-hero-gov">
        <div>
          <span className="hero-kicker-tag">
            {gu ? "નાણાકીય પ્રવાહ અને બજેટ વિશ્લેષણ" : "FINANCIAL INTELLIGENCE"}
          </span>
          <h1>{gu ? "DBT સીધી સહાય ચુકવણી અને બજેટ ઉપયોગિતા" : "Public Spending & Direct Benefit Transfers"}</h1>
          <p>
            {gu
              ? "મહિલા અને બાળ વિકાસ વિભાગની તમામ યોજનાઓ હેઠળ સીધા બેંક ખાતામાં જમા થયેલ સહાય અને માસિક ખર્ચનો અહેવાલ."
              : "Financial transparency, DBT success ratios, monthly public expenditure, and scheme-wise budget utilization."}
          </p>
        </div>
      </div>

      {/* 4 Financial KPI Cards */}
      <div className="stats-strip-4">
        <div className="stat-card-compact">
          <span className="stat-label">{gu ? "કુલ રાજ્ય બજેટ ફાળવણી" : "Allocated Budget"}</span>
          <strong className="text-navy">₹ {fmt(scaleDemoValue(2150, fy))} Cr</strong>
          <small>{gu ? "ડેમો બજેટ · અધિકૃત ફાળવણી નથી" : "Demo budget · not an official allocation"}</small>
        </div>

        <div className="stat-card-compact">
          <span className="stat-label">{gu ? "વિતરિત રકમ (DBT)" : "Total Disbursed"}</span>
          <strong className="text-teal">₹ {fmt(totalDisbursed)} Cr</strong>
          <small>{gu ? "ડેમો ગણતરી · ચકાસાયેલ નથી" : "Demo calculation · unverified"}</small>
        </div>

        <div className="stat-card-compact">
          <span className="stat-label">{gu ? "DBT સફળતા ગુણોત્તર" : "DBT Success Rate"}</span>
          <strong className="text-emerald">99.2%</strong>
          <small>{gu ? "ડેમો સફળતા દર · ચકાસાયેલ નથી" : "Demo success rate · unverified"}</small>
        </div>

        <div className="stat-card-compact">
          <span className="stat-label">{gu ? "સરેરાશ સહાય / લાભાર્થી" : "Avg Assist / Beneficiary"}</span>
          <strong className="text-amber">₹ {fmt(scaleDemoValue(18680, fy))}</strong>
          <small>{gu ? "ડેમો ગણતરી · ચકાસાયેલ નથી" : "Demo calculation · unverified"}</small>
        </div>
      </div>

      {/* Monthly DBT Outflow Line Chart */}
      <div className="panel-gov">
        <div className="panel-gov-head">
          <div>
            <h3>{gu ? "માસિક DBT સહાય પ્રવાહ (રૂ. કરોડમાં)" : "Monthly DBT Expenditure Trend (₹ In Crores)"}</h3>
            <small>{gu ? "નાણાકીય વર્ષ દરમિયાન માસિક વિતરણ" : "Cash transfers to beneficiary bank accounts across FY"}</small>
          </div>
          <span className="badge-pill">FY {fy} Trend</span>
        </div>
        <div ref={lineChartRef} className="chart-box-echarts" />
      </div>

      {/* Scheme-by-Scheme Budget Utilization Table */}
      <div className="panel-gov">
        <div className="panel-gov-head">
          <div>
            <h3>{gu ? "યોજનાવાર બજેટ ફાળવણી અને ચુકવણી" : "Scheme-wise Budget Allocation vs Spending"}</h3>
            <small>{gu ? "ઉદાહરણ આંકડા · અધિકૃત બજેટ feed નથી" : "Illustrative figures · no official budget feed"}</small>
          </div>
        </div>

        <div className="gov-table-wrap">
          <table className="gov-data-table">
            <thead>
              <tr>
                <th>{gu ? "યોજનાનું નામ" : "Scheme"}</th>
                <th>{gu ? "કેટેગરી" : "Category"}</th>
                <th>{gu ? "ફાળવેલ બજેટ (Cr)" : "Budget Allocated (Cr)"}</th>
                <th>{gu ? "વિતરિત રકમ (Cr)" : "Disbursed (Cr)"}</th>
                <th>{gu ? "ઉપયોગ ટકાવારી" : "Utilization %"}</th>
              </tr>
            </thead>
            <tbody>
              {demoSchemes.map((s) => {
                const allocated = scaleDemoValue(s.budgetAllocatedCr, fy);
                const disbursed = scaleDemoValue(s.budgetDisbursedCr, fy);
                const utilRate = allocated > 0 ? Math.round((disbursed / allocated) * 100) : 0;
                return (
                  <tr key={s.id}>
                    <td>
                      <strong>{gu ? s.shortNameGu : s.shortName}</strong>
                      <small className="block text-muted">{s.id}</small>
                    </td>
                    <td>{gu ? s.categoryGu : s.category}</td>
                    <td>₹ {fmt(allocated)} Cr</td>
                    <td>
                      <strong className="text-teal">₹ {fmt(disbursed)} Cr</strong>
                    </td>
                    <td>
                      <div className="table-rate-bar">
                        <span style={{ width: `${utilRate}%` }} />
                        <small>{utilRate}%</small>
                      </div>
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
