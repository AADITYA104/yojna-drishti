"use client";

import React, { useState, useMemo } from "react";
import { ArrowLeftRight, Building2, Users, Wallet, CheckCircle2, TrendingUp, Trophy } from "lucide-react";
import { demoDistricts, type District } from "@/lib/demo-data";
import { scaleDemoValue, approvalPercent } from "@/lib/metrics.mjs";

interface AnalyticsComparisonViewProps {
  gu: boolean;
  fy: string;
}

export function AnalyticsComparisonView({ gu, fy }: AnalyticsComparisonViewProps) {
  const [districtIdA, setDistrictIdA] = useState<string>("bhavnagar");
  const [districtIdB, setDistrictIdB] = useState<string>("rajkot");

  const distA = useMemo(() => demoDistricts.find((d) => d.id === districtIdA) || demoDistricts[0], [districtIdA]);
  const distB = useMemo(() => demoDistricts.find((d) => d.id === districtIdB) || demoDistricts[1], [districtIdB]);

  const fmt = (num: number) => new Intl.NumberFormat(gu ? "gu-IN" : "en-IN").format(num);

  const statsA = useMemo(() => {
    const ben = scaleDemoValue(distA.beneficiaries, fy);
    const apps = scaleDemoValue(distA.applications, fy);
    const appr = scaleDemoValue(distA.approved, fy);
    const disb = scaleDemoValue(distA.disbursed, fy);
    const rate = approvalPercent(appr, apps) ?? 80;
    return { ben, apps, appr, disb, rate };
  }, [distA, fy]);

  const statsB = useMemo(() => {
    const ben = scaleDemoValue(distB.beneficiaries, fy);
    const apps = scaleDemoValue(distB.applications, fy);
    const appr = scaleDemoValue(distB.approved, fy);
    const disb = scaleDemoValue(distB.disbursed, fy);
    const rate = approvalPercent(appr, apps) ?? 80;
    return { ben, apps, appr, disb, rate };
  }, [distB, fy]);

  return (
    <div className="analytics-compare-page">
      {/* Page Hero */}
      <div className="page-hero-gov">
        <div>
          <span className="hero-kicker-tag">
            {gu ? "જિલ્લા તુલના મંચ" : "COMPARATIVE ANALYTICS"}
          </span>
          <h1>{gu ? "બે જિલ્લાઓની સામસામે તુલના (Side-by-Side)" : "Side-by-Side District Comparison"}</h1>
          <p>
            {gu
              ? "ગુજરાતના કોઈપણ બે જિલ્લા પસંદ કરીને તેમના લાભાર્થીઓ, મંજૂરી દર અને ફાળવેલ સહાયની સરખામણી કરો."
              : "Compare scheme reach, delivery performance, and fiscal disbursements between any two districts."}
          </p>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="compare-selectors-bar">
        <div className="compare-pick-box">
          <label>
            <Building2 size={16} />
            <span>{gu ? "પ્રથમ જિલ્લો (District A):" : "First District (District A):"}</span>
          </label>
          <select value={districtIdA} onChange={(e) => setDistrictIdA(e.target.value)}>
            {demoDistricts.map((d) => (
              <option key={d.id} value={d.id} disabled={d.id === districtIdB && d.id !== districtIdA}>
                {gu ? d.gu : d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>

        <div className="compare-vs-badge">
          <ArrowLeftRight size={20} />
          <span>VS</span>
        </div>

        <div className="compare-pick-box">
          <label>
            <Building2 size={16} />
            <span>{gu ? "બીજો જિલ્લો (District B):" : "Second District (District B):"}</span>
          </label>
          <select value={districtIdB} onChange={(e) => setDistrictIdB(e.target.value)}>
            {demoDistricts.map((d) => (
              <option key={d.id} value={d.id} disabled={d.id === districtIdA && d.id !== districtIdB}>
                {gu ? d.gu : d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Big 2-Column Comparison Heads */}
      <div className="compare-cards-grid">
        {/* District A Card */}
        <div className="compare-district-card">
          <div className="cdc-head">
            <span className="cdc-tag">DISTRICT A</span>
            <h2>{gu ? distA.gu : distA.name}</h2>
            <small>{distA.code} · {gu ? distA.regionGu : distA.region}</small>
          </div>

          <div className="cdc-metrics">
            <div className="cdc-metric-row">
              <span>{gu ? "લાભાર્થીઓ:" : "Beneficiaries:"}</span>
              <b>{fmt(statsA.ben)}</b>
            </div>
            <div className="cdc-metric-row">
              <span>{gu ? "કુલ અરજીઓ:" : "Applications:"}</span>
              <b>{fmt(statsA.apps)}</b>
            </div>
            <div className="cdc-metric-row">
              <span>{gu ? "મંજૂરી દર:" : "Approval Rate:"}</span>
              <b className="text-teal">{statsA.rate}%</b>
            </div>
            <div className="cdc-metric-row">
              <span>{gu ? "વિતરિત રકમ:" : "Disbursed:"}</span>
              <b className="text-amber">₹ {fmt(statsA.disb)} Cr</b>
            </div>
            <div className="cdc-metric-row">
              <span>{gu ? "તાલુકા · ગામો:" : "Talukas · Villages:"}</span>
              <b>{distA.talukaCount} · {distA.villageCount}</b>
            </div>
          </div>
        </div>

        {/* District B Card */}
        <div className="compare-district-card">
          <div className="cdc-head">
            <span className="cdc-tag">DISTRICT B</span>
            <h2>{gu ? distB.gu : distB.name}</h2>
            <small>{distB.code} · {gu ? distB.regionGu : distB.region}</small>
          </div>

          <div className="cdc-metrics">
            <div className="cdc-metric-row">
              <span>{gu ? "લાભાર્થીઓ:" : "Beneficiaries:"}</span>
              <b>{fmt(statsB.ben)}</b>
            </div>
            <div className="cdc-metric-row">
              <span>{gu ? "કુલ અરજીઓ:" : "Applications:"}</span>
              <b>{fmt(statsB.apps)}</b>
            </div>
            <div className="cdc-metric-row">
              <span>{gu ? "મંજૂરી દર:" : "Approval Rate:"}</span>
              <b className="text-teal">{statsB.rate}%</b>
            </div>
            <div className="cdc-metric-row">
              <span>{gu ? "વિતરિત રકમ:" : "Disbursed:"}</span>
              <b className="text-amber">₹ {fmt(statsB.disb)} Cr</b>
            </div>
            <div className="cdc-metric-row">
              <span>{gu ? "તાલુકા · ગામો:" : "Talukas · Villages:"}</span>
              <b>{distB.talukaCount} · {distB.villageCount}</b>
            </div>
          </div>
        </div>
      </div>

      {/* Difference Summary Table */}
      <div className="panel-gov">
        <div className="panel-gov-head">
          <div>
            <h3>{gu ? "વિગતવાર માપદંડ તુલના" : "Detailed Indicator Matrix"}</h3>
            <small>{gu ? "ગુણાત્મક તફાવત અને તારણ" : "Relative performance differential"}</small>
          </div>
        </div>

        <div className="gov-table-wrap">
          <table className="gov-data-table">
            <thead>
              <tr>
                <th>{gu ? "માપદંડ (KPI Indicator)" : "KPI Indicator"}</th>
                <th>{gu ? distA.gu : distA.name}</th>
                <th>{gu ? distB.gu : distB.name}</th>
                <th>{gu ? "તફાવત (Differential)" : "Differential"}</th>
                <th>{gu ? "અગ્રેસર (Leading)" : "Leading"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{gu ? "લાભાર્થીઓની સંખ્યા" : "Total Beneficiaries"}</td>
                <td><b>{fmt(statsA.ben)}</b></td>
                <td><b>{fmt(statsB.ben)}</b></td>
                <td>{fmt(Math.abs(statsA.ben - statsB.ben))}</td>
                <td>
                  <span className="leading-pill">
                    {statsA.ben >= statsB.ben ? (gu ? distA.gu : distA.name) : (gu ? distB.gu : distB.name)}
                  </span>
                </td>
              </tr>
              <tr>
                <td>{gu ? "અરજી મંજૂરી ટકાવારી" : "Approval Rate"}</td>
                <td><b className="text-teal">{statsA.rate}%</b></td>
                <td><b className="text-teal">{statsB.rate}%</b></td>
                <td>{Math.abs(statsA.rate - statsB.rate)}%</td>
                <td>
                  <span className="leading-pill">
                    {statsA.rate >= statsB.rate ? (gu ? distA.gu : distA.name) : (gu ? distB.gu : distB.name)}
                  </span>
                </td>
              </tr>
              <tr>
                <td>{gu ? "વિતરિત રકમ (રૂ. કરોડ)" : "Disbursed Amount (₹ Cr)"}</td>
                <td><b className="text-amber">₹ {fmt(statsA.disb)} Cr</b></td>
                <td><b className="text-amber">₹ {fmt(statsB.disb)} Cr</b></td>
                <td>₹ {fmt(Math.abs(statsA.disb - statsB.disb))} Cr</td>
                <td>
                  <span className="leading-pill">
                    {statsA.disb >= statsB.disb ? (gu ? distA.gu : distA.name) : (gu ? distB.gu : distB.name)}
                  </span>
                </td>
              </tr>
              <tr>
                <td>{gu ? "કુલ વસ્તી (અંદાજિત)" : "Estimated Population"}</td>
                <td>{fmt(distA.population)}</td>
                <td>{fmt(distB.population)}</td>
                <td>{fmt(Math.abs(distA.population - distB.population))}</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
