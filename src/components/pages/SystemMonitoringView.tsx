"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, Clock, RefreshCw, Server } from "lucide-react";

type EndpointCheck = {
  status: string;
  reachable: boolean;
  latencyMs: number | null;
};

type HealthPayload = { data?: { mode?: string; database?: string } };

interface SystemMonitoringViewProps {
  gu: boolean;
}

export function SystemMonitoringView({ gu }: SystemMonitoringViewProps) {
  const endpoints = useMemo(() => [
    { path: "/api/v1/health", desc: gu ? "મુખ્ય એપ્લિકેશન સ્થિતિ" : "Core application health" },
    { path: "/api/v1/geo/units", desc: gu ? "ભૌગોલિક એકમો API" : "Geographic units API" },
    { path: "/api/v1/schemes", desc: gu ? "યોજના સૂચિ API" : "Scheme catalogue API" },
    { path: "/api/v1/stats/overview", desc: gu ? "ઝાંખી આંકડા API" : "Overview metrics API" },
  ], [gu]);
  const [checks, setChecks] = useState<Record<string, EndpointCheck>>({});
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState("");
  const [dataMode, setDataMode] = useState(gu ? "ડેટા સ્થિતિ અજ્ઞાત" : "Data mode unknown");
  const [database, setDatabase] = useState(gu ? "સ્થિતિ અજ્ઞાત" : "Status unknown");

  const checkHealth = useCallback(async () => {
    setChecking(true);
    const next: Record<string, EndpointCheck> = {};
    const healthPayloads: HealthPayload[] = [];

    await Promise.all(endpoints.map(async (endpoint) => {
      const start = performance.now();
      try {
        const response = await fetch(endpoint.path, { cache: "no-store", signal: AbortSignal.timeout(8000) });
        const latencyMs = Math.round(performance.now() - start);
        next[endpoint.path] = {
          status: `${response.status}${response.ok ? " OK" : " Error"}`,
          reachable: response.ok,
          latencyMs,
        };
        if (endpoint.path === "/api/v1/health" && response.ok) {
          healthPayloads.push(await response.json());
        }
      } catch {
        next[endpoint.path] = { status: "OFFLINE", reachable: false, latencyMs: null };
      }
    }));

    setChecks(next);
    setLastChecked(new Date().toLocaleString(gu ? "gu-IN" : "en-IN"));
    if (healthPayloads[0]) {
      const healthPayload = healthPayloads[0];
      setDataMode(healthPayload.data?.mode || "Unknown");
      setDatabase(healthPayload.data?.database || "Not reported");
    } else {
      setDataMode(gu ? "ચકાસી શકાયું નથી" : "Unavailable");
      setDatabase(gu ? "ચકાસી શકાયું નથી" : "Unavailable");
    }
    setChecking(false);
  }, [endpoints, gu]);

  useEffect(() => {
    const timer = window.setTimeout(() => void checkHealth(), 0);
    return () => window.clearTimeout(timer);
  }, [checkHealth]);

  const reachableCount = Object.values(checks).filter((check) => check.reachable).length;
  const averageLatency = Object.values(checks)
    .map((check) => check.latencyMs)
    .filter((latency): latency is number => latency !== null);
  const averageLatencyText = averageLatency.length
    ? `${Math.round(averageLatency.reduce((sum, latency) => sum + latency, 0) / averageLatency.length)} ms`
    : "—";
  const overall = checking
    ? (gu ? "તપાસ ચાલુ છે…" : "Checking…")
    : Object.keys(checks).length === 0
      ? (gu ? "હજી તપાસ્યું નથી" : "Not checked")
      : reachableCount === endpoints.length
        ? (gu ? `${reachableCount}/${endpoints.length} API પહોંચમાં` : `${reachableCount}/${endpoints.length} reachable`)
        : (gu ? `${reachableCount}/${endpoints.length} API પહોંચમાં` : `${reachableCount}/${endpoints.length} reachable`);

  return (
    <div className="system-monitoring-page">
      <div className="page-hero-gov">
        <div>
          <span className="hero-kicker-tag">{gu ? "સેશન API તપાસ" : "SESSION API CHECK"}</span>
          <h1>{gu ? "સેવા સ્થિતિ અને API તપાસ" : "Service Health & API Checks"}</h1>
          <p>{gu ? "આ સ્ક્રીન આ બ્રાઉઝરથી ચાર APIને તપાસે છે; 30-દિવસ uptime અથવા deployment સુરક્ષા માપતી નથી." : "This screen probes four APIs from this browser session. It does not measure 30-day uptime or deployment security."}</p>
        </div>
        <div className="hero-actions-wrap">
          <button className="btn-primary-gov" onClick={checkHealth} disabled={checking}>
            <RefreshCw size={15} className={checking ? "animate-spin" : ""} />
            <span>{checking ? (gu ? "તપાસ ચાલુ છે…" : "Checking…") : (gu ? "ફરી તપાસો" : "Check APIs")}</span>
          </button>
        </div>
      </div>

      <div className="data-security-alert-bar">
        <Activity size={18} className="text-teal" />
        <div>
          <strong>{gu ? "તપાસની મર્યાદા:" : "Check scope:"}</strong>{" "}
          <span>{gu ? "બ્રાઉઝરથી મળેલો HTTP પ્રતિસાદ જ અહીં બતાવાય છે. આ production uptime monitor નથી." : "Only HTTP responses observed from this browser are shown here. This is not a production uptime monitor."}</span>
        </div>
      </div>

      <div className="stats-strip-4">
        <div className="stat-card-compact">
          <span className="stat-label">{gu ? "તપાસેલી API સ્થિતિ" : "API reachability"}</span>
          <strong className={reachableCount === endpoints.length && !checking ? "text-emerald" : "text-amber"}>{overall}</strong>
          <small>{gu ? "હાલની બ્રાઉઝર તપાસ" : "Current browser check"}</small>
        </div>
        <div className="stat-card-compact">
          <span className="stat-label">{gu ? "સરેરાશ પ્રતિસાદ" : "Average response"}</span>
          <strong className="text-teal">{averageLatencyText}</strong>
          <small>{gu ? "હાલમાં પહોંચેલી API" : "Reachable endpoints only"}</small>
        </div>
        <div className="stat-card-compact">
          <span className="stat-label">{gu ? "છેલ્લી તપાસ" : "Last checked"}</span>
          <strong className="text-navy">{lastChecked || "—"}</strong>
          <small><Clock size={12} /> {gu ? "તપાસ શરૂ થતાં અપડેટ થશે" : "Updated after each probe"}</small>
        </div>
        <div className="stat-card-compact">
          <span className="stat-label">{gu ? "ડેટાબેઝ જોડાણ" : "Database connection"}</span>
          <strong className="text-amber">{database}</strong>
          <small>{gu ? `ડેટા સ્થિતિ: ${dataMode}` : `Data mode: ${dataMode}`}</small>
        </div>
      </div>

      <section className="panel-gov">
        <div className="panel-gov-head">
          <div>
            <h3>{gu ? "API પ્રતિસાદ વિગતો" : "API response details"}</h3>
            <small>{gu ? "સ્થિતિ અને round-trip latency" : "Observed status and round-trip latency"}</small>
          </div>
          <Server size={19} className="text-teal" />
        </div>
        <div className="gov-table-wrap">
          <table className="gov-data-table">
            <thead><tr><th>{gu ? "એન્ડપોઇન્ટ" : "Endpoint"}</th><th>{gu ? "વર્ણન" : "Description"}</th><th>{gu ? "HTTP સ્થિતિ" : "HTTP status"}</th><th>{gu ? "લેટન્સી" : "Latency"}</th></tr></thead>
            <tbody>
              {endpoints.map((endpoint) => {
                const check = checks[endpoint.path];
                return (
                  <tr key={endpoint.path}>
                    <td><code>{endpoint.path}</code></td>
                    <td>{endpoint.desc}</td>
                    <td>
                      {check ? (
                        <span className={check.reachable ? "badge-pill-success" : "badge-pill-warning"}>
                          {check.reachable ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}{check.status}
                        </span>
                      ) : (gu ? "તપાસ બાકી" : "Waiting")}
                    </td>
                    <td><b>{check?.latencyMs === null ? "—" : check?.latencyMs !== undefined ? `${check.latencyMs} ms` : "—"}</b></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
