"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { EnhancedVillageRecord } from "@/lib/village-scheme-intelligence";

interface VillageAnalyticsChartsProps {
  village: EnhancedVillageRecord;
  gu: boolean;
}

const SECTOR_PALETTE: Record<string, string> = {
  agriculture: "#34d399",
  "ખેતીવાડી": "#34d399",
  "women & child": "#f472b6",
  "મહિલા અને બાળકલ્યાણ": "#f472b6",
  education: "#38bdf8",
  "શિક્ષણ": "#38bdf8",
  housing: "#fbbf24",
  "આવાસ": "#fbbf24",
  health: "#a78bfa",
  "આરોગ્ય": "#a78bfa",
  "social welfare": "#fb7185",
  "સામાજિક ન્યાય": "#fb7185",
  energy: "#fb923c",
  "ઊર્જા અને કિસાન": "#fb923c",
};

export function VillageAnalyticsCharts({ village, gu }: VillageAnalyticsChartsProps) {
  const barChartRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const instances: echarts.ECharts[] = [];

    // 1. Dual Bar Chart: Scheme Grant (₹ Lakhs) & Beneficiary Citizens
    if (barChartRef.current) {
      const chart = echarts.init(barChartRef.current);
      instances.push(chart);

      const schemeNames = village.activeSchemes.map((s) => {
        const name = gu ? s.schemeNameGu : s.schemeNameEn;
        return name.length > 18 ? name.slice(0, 16) + "…" : name;
      });
      const grantValues = village.activeSchemes.map((s) => s.grantLakhs);
      const benValues = village.activeSchemes.map((s) => s.beneficiaries);

      chart.setOption({
        backgroundColor: "transparent",
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          borderColor: "rgba(56, 189, 248, 0.3)",
          textStyle: { color: "#f8fafc", fontSize: 12 },
          axisPointer: { type: "shadow" },
          formatter: (params: any) => {
            if (!params || !params.length) return "";
            const idx = params[0].dataIndex;
            const s = village.activeSchemes[idx];
            return `
              <div style="font-weight:700; color:#38bdf8; margin-bottom:4px;">
                ${gu ? s.schemeNameGu : s.schemeNameEn}
              </div>
              <div style="font-size:11px; color:#94a3b8; margin-bottom:6px;">
                ${gu ? "શ્રેણી" : "Sector"}: ${gu ? s.categoryGu : s.categoryEn}
              </div>
              <div style="display:flex; justify-content:space-between; gap:16px; margin:2px 0;">
                <span>${gu ? "DBT સહાય" : "Grant"}:</span>
                <b style="color:#fde047;">₹${s.grantLakhs} ${gu ? "લાખ" : "Lakhs"}</b>
              </div>
              <div style="display:flex; justify-content:space-between; gap:16px; margin:2px 0;">
                <span>${gu ? "લાભાર્થીઓ" : "Beneficiaries"}:</span>
                <b style="color:#34d399;">${s.beneficiaries.toLocaleString("en-IN")} ${gu ? "નાગરિકો" : "Citizens"}</b>
              </div>
              <div style="display:flex; justify-content:space-between; gap:16px; margin:2px 0;">
                <span>${gu ? "સેચ્યુરેશન" : "Saturation"}:</span>
                <b style="color:#38bdf8;">${s.saturationPct}%</b>
              </div>
            `;
          },
        },
        legend: {
          data: [
            gu ? "DBT સહાય (₹ લાખ)" : "Grant (₹ Lakhs)",
            gu ? "લાભાર્થીઓ" : "Beneficiaries",
          ],
          bottom: 0,
          textStyle: { color: "rgba(255,255,255,0.75)", fontSize: 11 },
          icon: "roundRect",
        },
        grid: {
          top: 24,
          bottom: 40,
          left: 12,
          right: 36,
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: schemeNames,
          axisLabel: {
            color: "rgba(255,255,255,0.7)",
            fontSize: 10,
            interval: 0,
            rotate: schemeNames.length > 3 ? 18 : 0,
          },
          axisLine: { lineStyle: { color: "rgba(255,255,255,0.15)" } },
        },
        yAxis: [
          {
            type: "value",
            name: gu ? "₹ લાખ" : "₹ Lakhs",
            nameTextStyle: { color: "#fde047", fontSize: 10 },
            splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
            axisLabel: { color: "rgba(255,255,255,0.6)", fontSize: 10 },
          },
          {
            type: "value",
            name: gu ? "લાભાર્થી" : "Count",
            nameTextStyle: { color: "#34d399", fontSize: 10 },
            splitLine: { show: false },
            axisLabel: { color: "rgba(255,255,255,0.6)", fontSize: 10 },
          },
        ],
        series: [
          {
            name: gu ? "DBT સહાય (₹ લાખ)" : "Grant (₹ Lakhs)",
            type: "bar",
            data: grantValues,
            yAxisIndex: 0,
            barMaxWidth: 24,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#facc15" },
                { offset: 1, color: "rgba(234, 179, 8, 0.4)" },
              ]),
              borderRadius: [4, 4, 0, 0],
            },
          },
          {
            name: gu ? "લાભાર્થીઓ" : "Beneficiaries",
            type: "line",
            data: benValues,
            yAxisIndex: 1,
            smooth: true,
            symbol: "circle",
            symbolSize: 7,
            itemStyle: { color: "#34d399" },
            lineStyle: { width: 3, color: "#34d399" },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(52, 211, 153, 0.3)" },
                { offset: 1, color: "rgba(52, 211, 153, 0.02)" },
              ]),
            },
          },
        ],
      });
    }

    // 2. Sectoral Allocation Donut Chart
    if (pieChartRef.current) {
      const chart = echarts.init(pieChartRef.current);
      instances.push(chart);

      // Group grants by sector
      const sectorMap = new Map<string, { label: string; value: number; color: string }>();
      village.activeSchemes.forEach((s) => {
        const catKey = s.categoryEn.toLowerCase();
        const label = gu ? s.categoryGu : s.categoryEn;
        const color = SECTOR_PALETTE[catKey] || SECTOR_PALETTE[s.categoryGu] || "#38bdf8";
        const current = sectorMap.get(label) || { label, value: 0, color };
        current.value = Number((current.value + s.grantLakhs).toFixed(1));
        sectorMap.set(label, current);
      });

      const pieData = Array.from(sectorMap.values()).map((d) => ({
        name: d.label,
        value: d.value,
        itemStyle: { color: d.color },
      }));

      chart.setOption({
        backgroundColor: "transparent",
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          borderColor: "rgba(56, 189, 248, 0.3)",
          textStyle: { color: "#f8fafc", fontSize: 12 },
          formatter: (p: any) => {
            return `
              <div style="font-weight:700; color:#38bdf8; margin-bottom:4px;">${p.name}</div>
              <div style="display:flex; justify-content:space-between; gap:16px;">
                <span>${gu ? "ફાળવેલ ગ્રાન્ટ" : "Allocated"}:</span>
                <b style="color:#fde047;">₹${p.value} ${gu ? "લાખ" : "L"} (${p.percent}%)</b>
              </div>
            `;
          },
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          right: 2,
          top: "middle",
          itemWidth: 10,
          itemHeight: 10,
          textStyle: { color: "rgba(255,255,255,0.75)", fontSize: 11 },
        },
        series: [
          {
            name: gu ? "ક્ષેત્રવાર ગ્રાન્ટ" : "Sector Grants",
            type: "pie",
            radius: ["42%", "68%"],
            center: ["36%", "50%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 6,
              borderColor: "rgba(15, 23, 42, 0.8)",
              borderWidth: 2,
            },
            label: { show: false },
            labelLine: { show: false },
            data: pieData,
            emphasis: {
              label: {
                show: true,
                fontSize: 12,
                fontWeight: "bold",
                color: "#ffffff",
                formatter: "{b}\n{d}%",
              },
            },
          },
        ],
      });
    }

    const handleResize = () => {
      instances.forEach((inst) => inst.resize());
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      instances.forEach((inst) => inst.dispose());
    };
  }, [village, gu]);

  return (
    <div className="village-charts-grid">
      <div className="village-chart-card">
        <div className="village-chart-head">
          <h4>
            {gu ? "યોજનાવાર સહાય ફાળવણી અને લાભાર્થીઓ" : "Scheme Grants (₹ Lakhs) & Beneficiaries"}
          </h4>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
            {gu ? "દ્વિ-અક્ષીય સરખામણી" : "Dual-axis view"}
          </span>
        </div>
        <div ref={barChartRef} style={{ width: "100%", height: 260 }} />
      </div>

      <div className="village-chart-card">
        <div className="village-chart-head">
          <h4>
            {gu ? "ક્ષેત્રવાર ભંડોળ વિભાજન" : "Sectoral Fund Distribution"}
          </h4>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
            {gu ? "ટકાવારી હિસ્સો" : "% Share"}
          </span>
        </div>
        <div ref={pieChartRef} style={{ width: "100%", height: 260 }} />
      </div>
    </div>
  );
}
