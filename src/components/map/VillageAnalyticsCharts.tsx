"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { EnhancedVillageRecord } from "@/lib/village-scheme-intelligence";

interface VillageAnalyticsChartsProps {
  village: EnhancedVillageRecord;
  gu: boolean;
}

const SECTOR_PALETTE: Record<string, string> = {
  agriculture: "#FFFFFF",
  "ખેતીવાડી": "#FFFFFF",
  "women & child": "#E0E0E0",
  "મહિલા અને બાળકલ્યાણ": "#E0E0E0",
  education: "#C4C4C4",
  "શિક્ષણ": "#C4C4C4",
  housing: "#A8A8A8",
  "આવાસ": "#A8A8A8",
  health: "#8C8C8C",
  "આરોગ્ય": "#8C8C8C",
  "social welfare": "#6B6B6B",
  "સામાજિક ન્યાય": "#6B6B6B",
  energy: "#4A4A4A",
  "ઊર્જા અને કિસાન": "#4A4A4A",
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
          backgroundColor: "#1A1A1A",
          borderColor: "#333333",
          textStyle: { color: "#FFFFFF", fontSize: 12 },
          axisPointer: { type: "shadow" },
          formatter: (params: any) => {
            if (!params || !params.length) return "";
            const idx = params[0].dataIndex;
            const s = village.activeSchemes[idx];
            return `
              <div style="font-weight:700; color:#FFFFFF; margin-bottom:4px;">
                ${gu ? s.schemeNameGu : s.schemeNameEn}
              </div>
              <div style="font-size:11px; color:#6B6B6B; margin-bottom:6px;">
                ${gu ? "શ્રેણી" : "Sector"}: ${gu ? s.categoryGu : s.categoryEn}
              </div>
              <div style="display:flex; justify-content:space-between; gap:16px; margin:2px 0;">
                <span>${gu ? "DBT સહાય" : "Grant"}:</span>
                <b style="color:#FFFFFF;">₹${s.grantLakhs} ${gu ? "લાખ" : "Lakhs"}</b>
              </div>
              <div style="display:flex; justify-content:space-between; gap:16px; margin:2px 0;">
                <span>${gu ? "લાભાર્થીઓ" : "Beneficiaries"}:</span>
                <b style="color:#D9D9D9;">${s.beneficiaries.toLocaleString("en-IN")} ${gu ? "નાગરિકો" : "Citizens"}</b>
              </div>
              <div style="display:flex; justify-content:space-between; gap:16px; margin:2px 0;">
                <span>${gu ? "સેચ્યુરેશન" : "Saturation"}:</span>
                <b style="color:#FFFFFF;">${s.saturationPct}%</b>
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
          textStyle: { color: "#D9D9D9", fontSize: 11 },
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
            color: "#D9D9D9",
            fontSize: 10,
            interval: 0,
            rotate: schemeNames.length > 3 ? 18 : 0,
          },
          axisLine: { lineStyle: { color: "#333333" } },
        },
        yAxis: [
          {
            type: "value",
            name: gu ? "₹ લાખ" : "₹ Lakhs",
            nameTextStyle: { color: "#FFFFFF", fontSize: 10 },
            splitLine: { lineStyle: { color: "#333333" } },
            axisLabel: { color: "#6B6B6B", fontSize: 10 },
          },
          {
            type: "value",
            name: gu ? "લાભાર્થી" : "Count",
            nameTextStyle: { color: "#6B6B6B", fontSize: 10 },
            splitLine: { show: false },
            axisLabel: { color: "#6B6B6B", fontSize: 10 },
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
                { offset: 0, color: "#FFFFFF" },
                { offset: 1, color: "rgba(217, 217, 217, 0.35)" },
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
            itemStyle: { color: "#8C8C8C" },
            lineStyle: { width: 2.5, color: "#8C8C8C" },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(140, 140, 140, 0.25)" },
                { offset: 1, color: "rgba(140, 140, 140, 0.02)" },
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
        const color = SECTOR_PALETTE[catKey] || SECTOR_PALETTE[s.categoryGu] || "#D9D9D9";
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
          backgroundColor: "#1A1A1A",
          borderColor: "#333333",
          textStyle: { color: "#FFFFFF", fontSize: 12 },
          formatter: (p: any) => {
            return `
              <div style="font-weight:700; color:#FFFFFF; margin-bottom:4px;">${p.name}</div>
              <div style="display:flex; justify-content:space-between; gap:16px;">
                <span>${gu ? "ફાળવેલ ગ્રાન્ટ" : "Allocated"}:</span>
                <b style="color:#FFFFFF;">₹${p.value} ${gu ? "લાખ" : "L"} (${p.percent}%)</b>
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
          textStyle: { color: "#D9D9D9", fontSize: 11 },
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
              borderColor: "#1A1A1A",
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
          <span style={{ fontSize: "11px", color: "#6B6B6B" }}>
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
          <span style={{ fontSize: "11px", color: "#6B6B6B" }}>
            {gu ? "ટકાવારી હિસ્સો" : "% Share"}
          </span>
        </div>
        <div ref={pieChartRef} style={{ width: "100%", height: 260 }} />
      </div>
    </div>
  );
}
