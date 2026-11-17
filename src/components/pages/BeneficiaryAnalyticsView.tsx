"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { getLocale, localizeText } from "@/lib/i18n";
import type { AppLanguage } from "@/lib/i18n";
import { Users, PieChart as PieIcon, BarChart3, ShieldCheck, IndianRupee } from "lucide-react";
import { echarts } from "@/lib/echarts-theme";
import { demoDistricts } from "@/lib/demo-data";

interface BeneficiaryAnalyticsViewProps {
  gu: boolean;
  lang: AppLanguage;
  fy: string;
}

export function BeneficiaryAnalyticsView({ gu, lang, fy }: BeneficiaryAnalyticsViewProps) {
  const socialChartRef = useRef<HTMLDivElement>(null);
  const ageChartRef = useRef<HTMLDivElement>(null);

  const totalBeneficiaries = useMemo(() => {
    return demoDistricts.reduce((acc, d) => acc + d.beneficiaries, 0);
  }, []);

  const totalDisbursed = useMemo(() => {
    return demoDistricts.reduce((acc, d) => acc + d.disbursed, 0);
  }, []);

  const fmt = (num: number) => new Intl.NumberFormat(getLocale(lang)).format(num);

  useEffect(() => {
    if (!socialChartRef.current || !ageChartRef.current) return;

    // Social Category Pie Chart
    const socialChart = echarts.init(socialChartRef.current, "drishti");
    socialChart.setOption({
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
      },
      legend: {
        type: "scroll",
        bottom: "0%",
        left: "center",
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 12,
        textStyle: { color: "#94a3b8", fontSize: 11 },
      },
      series: [
        {
          name: gu ? "સામાજિક શ્રેણી" : lang === "hi" ? "सामाजिक श्रेणी" : "Social Category",
          type: "pie",
          radius: ["38%", "68%"],
          center: ["50%", "45%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: "#0f202b",
            borderWidth: 2,
          },
          label: { show: false },
          emphasis: {
            label: {
              show: true,
              fontSize: 12,
              fontWeight: "bold",
              color: "#ffffff",
            },
          },
          data: [
            {
              value: Math.floor(totalBeneficiaries * 0.42),
              name: gu ? "OBC / સામાજિક પછાત" : lang === "hi" ? "ओबीसी / सामाजिक पिछड़ा" : "OBC / SEBC",
              itemStyle: { color: "#38BDF8" },
            },
            {
              value: Math.floor(totalBeneficiaries * 0.26),
              name: gu ? "સામાન્ય / EWS" : lang === "hi" ? "सामान्य / ईडब्ल्यूएस" : "General / EWS",
              itemStyle: { color: "#FACC15" },
            },
            {
              value: Math.floor(totalBeneficiaries * 0.18),
              name: gu ? "અનુસૂચિત જનજાતિ (ST)" : lang === "hi" ? "अनुसूचित जनजाति (ST)" : "Scheduled Tribe (ST)",
              itemStyle: { color: "#42C88A" },
            },
            {
              value: Math.floor(totalBeneficiaries * 0.14),
              name: gu ? "અનુસૂચિત જાતિ (SC)" : lang === "hi" ? "अनुसूचित जाति (SC)" : "Scheduled Caste (SC)",
              itemStyle: { color: "#C5D846" },
            },
          ],
        },
      ],
    });

    // Age Cohort Bar Chart
    const ageChart = echarts.init(ageChartRef.current, "drishti");
    ageChart.setOption({
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "8%",
        top: "12%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: gu
          ? ["૦-૬ વર્ષ (બાળકી)", "૭-૧૮ વર્ષ (કન્યા)", "૧૯-૩૫ વર્ષ (માતૃત્વ)", "૩૬-૫૫ વર્ષ (સ્વાવલંબન)", "૫૬+ વર્ષ (વરિષ્ઠ)"]
          : lang === "hi"
            ? ["०-६ वर्ष (बालिका)", "७-१८ वर्ष (कन्या)", "१९-३५ वर्ष (मातृत्व)", "३६-५५ वर्ष (स्वावलंबन)", "५६+ वर्ष (वरिष्ठ)"]
            : ["0-6 Yrs (Infant)", "7-18 Yrs (Girl)", "19-35 Yrs (Maternal)", "36-55 Yrs (Enterprise)", "56+ Yrs (Senior)"],
        axisLabel: {
          color: "#94a3b8",
          fontSize: 10,
          interval: 0,
        },
        axisLine: { lineStyle: { color: "rgba(255,255,255,0.15)" } },
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
        axisLabel: { color: "#94a3b8" },
      },
      series: [
        {
          name: gu ? "લાભાર્થીઓ" : lang === "hi" ? "लाभार्थी" : "Beneficiaries",
          type: "bar",
          barWidth: "32%",
          itemStyle: {
            color: "#38BDF8",
            borderRadius: [6, 6, 0, 0],
          },
          data: [
            Math.floor(totalBeneficiaries * 0.22),
            Math.floor(totalBeneficiaries * 0.18),
            Math.floor(totalBeneficiaries * 0.32),
            Math.floor(totalBeneficiaries * 0.16),
            Math.floor(totalBeneficiaries * 0.12),
          ],
        },
      ],
    });

    const handleResize = () => {
      socialChart.resize();
      ageChart.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      socialChart.dispose();
      ageChart.dispose();
    };
  }, [gu, lang, totalBeneficiaries]);

  return (
    <div className="beneficiaries-analytics-page w-full">
      {/* Hero Header */}
      <div className="page-hero-gov">
        <div>
          <span className="hero-kicker-tag">
            <Users size={14} className="inline mr-1" />
            {gu ? "લાભાર્થી વિશ્લેષણ મંચ" : lang === "hi" ? "लाभार्थी विश्लेषण मंच" : "BENEFICIARY DEMOGRAPHIC INTELLIGENCE"}
          </span>
          <h1>
            {gu ? "લાભાર્થી વસ્તી અને સામાજિક આવરણ" : lang === "hi" ? "लाभार्थी जनसंख्या और सामाजिक कवरेज" : "Beneficiary Demographics & Social Coverage"}
          </h1>
          <p>
            {gu
              ? "સામાજિક જૂથો, વયજૂથો અને ગ્રામીણ-શહેરી વિભાજન મુજબ કલ્યાણકારી યોજનાઓનું સંતુલિત વિતરણ અને પ્રગતિ."
              : lang === "hi"
                ? "सामाजिक समूहों, आयु वर्गों और ग्रामीण-शहरी विभाजन अनुसार कल्याणकारी योजनाओं का संतुलित वितरण।"
                : "Comprehensive coverage and inclusion metrics tracking welfare reach across age, social categories, and rural/urban areas of Gujarat."}
          </p>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="stats-strip-4">
        <div className="stat-card-compact">
          <span className="stat-label">
            {gu ? "કુલ નોંધાયેલ લાભાર્થીઓ" : lang === "hi" ? "कुल पंजीकृत लाभार्थी" : "Total Beneficiaries"}
          </span>
          <strong className="text-white">{fmt(totalBeneficiaries)}</strong>
          <small>{gu ? "સમગ્ર ૩૩ જિલ્લા" : lang === "hi" ? "सभी ३३ जिले" : "All 33 Districts"}</small>
        </div>

        <div className="stat-card-compact">
          <span className="stat-label">
            {gu ? "ગ્રામીણ આવરણ ટકાવારી" : lang === "hi" ? "ग्रामीण कवरेज प्रतिशत" : "Rural Penetration"}
          </span>
          <strong className="text-teal" style={{ color: "#38BDF8" }}>74.2%</strong>
          <small>{gu ? "૧૮,૦૦૦+ ગામો" : lang === "hi" ? "१८,०००+ गाँव" : "18,000+ Villages"}</small>
        </div>

        <div className="stat-card-compact">
          <span className="stat-label">
            {gu ? "શહેરી આવરણ ટકાવારી" : lang === "hi" ? "शहरी कवरेज प्रतिशत" : "Urban Penetration"}
          </span>
          <strong className="text-navy" style={{ color: "#FACC15" }}>25.8%</strong>
          <small>{gu ? "મહાનગરપાલિકાઓ & નગરપાલિકાઓ" : lang === "hi" ? "महानगरपालिका और नगरपालिका" : "Municipalities"}</small>
        </div>

        <div className="stat-card-compact">
          <span className="stat-label">
            {gu ? "પ્રત્યક્ષ સહાય વિતરણ (DBT)" : lang === "hi" ? "प्रत्यक्ष सहायता वितरण (DBT)" : "Direct Benefit Disbursed"}
          </span>
          <strong className="text-emerald" style={{ color: "#42C88A" }}>₹{totalDisbursed.toFixed(1)} Cr</strong>
          <small>{gu ? "નાગરિક બેંક ખાતામાં જમા" : lang === "hi" ? "नागरिक बैंक खातों में जमा" : "Direct Citizen Accounts"}</small>
        </div>
      </div>

      {/* Two Demographic Charts */}
      <div className="overview-analytics-grid">
        <div className="analytics-card-gov">
          <div className="card-head-gov">
            <div>
              <h3>
                {gu ? "સામાજિક શ્રેણી મુજબ વિતરણ" : lang === "hi" ? "सामाजिक श्रेणी अनुसार वितरण" : "Distribution by Social Category"}
              </h3>
              <small>
                {gu ? "SC, ST, OBC, General અને EWS શ્રેણીઓ" : lang === "hi" ? "SC, ST, OBC, General और EWS श्रेणियाँ" : "SC, ST, OBC, General & EWS Categories"}
              </small>
            </div>
            <span className="badge-pill">SC / ST / OBC / GEN</span>
          </div>
          <div ref={socialChartRef} className="chart-box-echarts" style={{ minHeight: "260px" }} />
        </div>

        <div className="analytics-card-gov">
          <div className="card-head-gov">
            <div>
              <h3>
                {gu ? "લાભાર્થીઓનું વયજૂથ વિશ્લેષણ" : lang === "hi" ? "लाभार्थियों का आयु वर्ग विश्लेषण" : "Age Cohort Distribution"}
              </h3>
              <small>
                {gu ? "બાળકી, કન્યા, માતૃત્વ અને વરિષ્ઠ નાગરિક જૂથો" : lang === "hi" ? "बालिका, कन्या, मातृत्व और वरिष्ठ नागरिक समूह" : "Infants, girls, maternity, and seniors"}
              </small>
            </div>
            <span className="badge-pill">0 to 60+ Years</span>
          </div>
          <div ref={ageChartRef} className="chart-box-echarts" style={{ minHeight: "260px" }} />
        </div>
      </div>
    </div>
  );
}
