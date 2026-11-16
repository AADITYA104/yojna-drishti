"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, CheckCircle2, Clock, RefreshCw,
  Server, Wifi, Database, Gauge, Globe2, Zap, ShieldCheck,
} from "lucide-react";

type EndpointCheck = { status: string; reachable: boolean; latencyMs: number | null };
type HealthPayload  = { data?: { mode?: string; database?: string; version?: string } };

const ENDPOINTS = [
  { path: "/api/v1/health",         enDesc: "Core application health",    guDesc: "મ. એ. સ્." },
  { path: "/api/v1/geo/units",      enDesc: "Geographic units API",        guDesc: "ભ. એ. API" },
  { path: "/api/v1/schemes",        enDesc: "Scheme catalogue API",        guDesc: "ય. સ. API" },
  { path: "/api/v1/stats/overview", enDesc: "Overview metrics API",        guDesc: "ઝ. આ. API" },
  { path: "/api/v1/search",         enDesc: "Full-text search API",        guDesc: "શ. API" },
  { path: "/api/v1/geo/hierarchy",  enDesc: "Geo hierarchy resolver",      guDesc: "ભ. ઢ. API" },
];

const LATENCY_COLOR = (ms: number | null) =>
  ms === null ? "#6B6B6B" : ms < 80 ? "#FFFFFF" : ms < 200 ? "#D9D9D9" : "#6B6B6B";

interface SystemMonitoringViewProps { gu: boolean }

export function SystemMonitoringView({ gu }: SystemMonitoringViewProps) {
  const endpoints = useMemo(
    () => ENDPOINTS.map(e => ({ ...e, desc: gu ? e.guDesc : e.enDesc })),
    [gu],
  );

  const [checks,      setChecks]      = useState<Record<string, EndpointCheck>>({});
  const [checking,    setChecking]    = useState(false);
  const [lastChecked, setLastChecked] = useState("");
  const [dataMode,    setDataMode]    = useState("—");
  const [dbStatus,    setDbStatus]    = useState("—");
  const [appVersion,  setAppVersion]  = useState("—");
  const [history,     setHistory]     = useState<{ ts: string; pass: number; total: number }[]>([]);

  const checkHealth = useCallback(async () => {
    setChecking(true);
    const next: Record<string, EndpointCheck> = {};
    let mode = "—", db = "—", ver = "—";

    await Promise.all(endpoints.map(async ep => {
      const t0 = performance.now();
      try {
        const res = await fetch(ep.path, { cache: "no-store", signal: AbortSignal.timeout(8000) });
        const ms  = Math.round(performance.now() - t0);
        next[ep.path] = { status: `${res.status}${res.ok ? " OK" : " ERR"}`, reachable: res.ok, latencyMs: ms };
        if (ep.path === "/api/v1/health" && res.ok) {
          const payload: HealthPayload = await res.json();
          mode = payload.data?.mode     ?? "demo";
          db   = payload.data?.database ?? "sqlite-demo";
          ver  = payload.data?.version  ?? "0.1.0";
        }
      } catch {
        next[ep.path] = { status: "OFFLINE", reachable: false, latencyMs: null };
      }
    }));

    setChecks(next);
    const now = new Date().toLocaleString(gu ? "gu-IN" : "en-IN");
    setLastChecked(now);
    setDataMode(mode);
    setDbStatus(db);
    setAppVersion(ver);
    const pass = Object.values(next).filter(c => c.reachable).length;
    setHistory(h => [{ ts: now, pass, total: endpoints.length }, ...h].slice(0, 8));
    setChecking(false);
  }, [endpoints, gu]);

  useEffect(() => {
    const t = window.setTimeout(() => void checkHealth(), 0);
    return () => window.clearTimeout(t);
  }, [checkHealth]);

  const vals       = Object.values(checks);
  const reachable  = vals.filter(c => c.reachable).length;
  const latencies  = vals.map(c => c.latencyMs).filter((x): x is number => x !== null);
  const avgLatency = latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : null;
  const allOk      = vals.length > 0 && reachable === endpoints.length;

  const overallLabel = checking
    ? (gu ? "ત. ચ.…" : "Checking…")
    : vals.length === 0
      ? (gu ? "ત. ન." : "Not checked")
      : `${reachable}/${endpoints.length} ${gu ? "OK" : "reachable"}`;

  return (
    <div className="system-monitoring-page">

      {/* Hero */}
      <div className="page-hero-gov">
        <div>
          <span className="hero-kicker-tag">{gu ? "API · સ. સ્. ત." : "API HEALTH · LIVE CHECK"}</span>
          <h1>{gu ? "સ. API સ્. · Service Health Dashboard" : "Service Health & API Check Dashboard"}</h1>
          <p>{gu ? "આ ૬ API ને આ ટ. થ. ત. — 30 d uptime ન." : "Live probe of 6 APIs from this browser. Not a 30-day uptime monitor."}</p>
        </div>
        <div className="hero-actions-wrap">
          <button className="btn-primary-gov" onClick={checkHealth} disabled={checking}>
            <RefreshCw size={15} className={checking ? "animate-spin" : ""} />
            <span>{checking ? (gu ? "ત.…" : "Checking…") : (gu ? "ફ. ત." : "Re-check All")}</span>
          </button>
        </div>
      </div>

      {/* Scope alert */}
      <div className="data-security-alert-bar">
        <Activity size={18} className="text-mono-white" />
        <div>
          <strong>{gu ? "ત. ય.:" : "Scope:"}</strong>{" "}
          <span>{gu ? "HTTP ત. — prod uptime monitor ન." : "HTTP responses from this browser session. Not a production uptime monitor."}</span>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="stats-strip-4">
        <div className="stat-card-compact">
          <span className="stat-label"><Wifi size={13}/> {gu ? "API ત." : "API Reachability"}</span>
          <strong className={allOk && !checking ? "text-mono-white" : "text-mono-silver"}>{overallLabel}</strong>
          <small>{gu ? "આ ત." : "Current check"}</small>
        </div>
        <div className="stat-card-compact">
          <span className="stat-label"><Zap size={13}/> {gu ? "સ. ત." : "Avg Latency"}</span>
          <strong style={{ color: avgLatency !== null ? LATENCY_COLOR(avgLatency) : "#64748b" }}>
            {avgLatency !== null ? `${avgLatency} ms` : "—"}
          </strong>
          <small>{gu ? "પ. API ત. ફ." : "Reachable endpoints only"}</small>
        </div>
        <div className="stat-card-compact">
          <span className="stat-label"><Clock size={13}/> {gu ? "છ. ત." : "Last Checked"}</span>
          <strong className="text-mono-white">{lastChecked || "—"}</strong>
          <small>{gu ? "દ. ત. ÷ ત." : "Updated after each probe"}</small>
        </div>
        <div className="stat-card-compact">
          <span className="stat-label"><Database size={13}/> {gu ? "ડ. સ." : "Data Mode"}</span>
          <strong className="text-mono-white">{dataMode}</strong>
          <small>{gu ? `DB: ${dbStatus}` : `DB: ${dbStatus}`}</small>
        </div>
      </div>

      {/* Endpoint Cards Grid */}
      <section className="panel-gov">
        <div className="panel-gov-head">
          <div>
            <h3>{gu ? "API ત. — ૬ ઉ. ક." : "Endpoint Health — 6 Routes"}</h3>
            <small>{gu ? "HTTP ત. · ત. ક." : "HTTP status · round-trip latency"}</small>
          </div>
          <span className={`badge-pill${allOk ? "-success" : ""}`}>
            {allOk ? <CheckCircle2 size={12}/> : <AlertTriangle size={12}/>}
            &nbsp;{overallLabel}
          </span>
        </div>

        <div className="endpoint-cards-grid">
          {endpoints.map(ep => {
            const c   = checks[ep.path];
            const ms  = c?.latencyMs ?? null;
            const ok  = c?.reachable ?? null;
            const col = ok === null ? "#6B6B6B" : ok ? "#FFFFFF" : "#333333";
            return (
              <div key={ep.path} className={`endpoint-card ${ok === true ? "endpoint-ok" : ok === false ? "endpoint-fail" : "endpoint-pending"}`}>
                <div className="ep-status-dot" style={{ background: col }} />
                <div className="ep-body">
                  <code className="ep-path">{ep.path}</code>
                  <span className="ep-desc">{ep.desc}</span>
                </div>
                <div className="ep-meta">
                  {c ? (
                    <>
                      <span className={ok ? "badge-pill-success" : "badge-pill-warning"} style={{ fontSize: 11 }}>
                        {ok ? <CheckCircle2 size={11}/> : <AlertTriangle size={11}/>}
                        &nbsp;{c.status}
                      </span>
                      {ms !== null && (
                        <span className="ep-latency" style={{ color: LATENCY_COLOR(ms) }}>
                          <Zap size={11}/> {ms} ms
                        </span>
                      )}
                    </>
                  ) : (
                    <span style={{ color: "#6B6B6B", fontSize: 11 }}>{gu ? "ત. ન." : "Waiting…"}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Detailed table */}
      <div className="panel-gov">
        <div className="panel-gov-head">
          <div>
            <h3>{gu ? "API ત. ત." : "API Response Details"}</h3>
            <small>{gu ? "HTTP ત. · RTT ત." : "Observed status and round-trip latency"}</small>
          </div>
          <Server size={19} className="text-mono-white" />
        </div>
        <div className="gov-table-wrap">
          <table className="gov-data-table">
            <thead>
              <tr>
                <th>{gu ? "ઉ." : "Endpoint"}</th>
                <th>{gu ? "વ." : "Description"}</th>
                <th>{gu ? "HTTP" : "HTTP Status"}</th>
                <th>{gu ? "ત.(ms)" : "Latency"}</th>
                <th>{gu ? "ગ." : "Rating"}</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map(ep => {
                const c  = checks[ep.path];
                const ms = c?.latencyMs ?? null;
                const rating = ms === null ? "—" : ms < 80 ? (gu ? "ઉ." : "Excellent") : ms < 200 ? (gu ? "સ." : "Good") : (gu ? "ધ." : "Slow");
                return (
                  <tr key={ep.path}>
                    <td><code style={{ fontSize: 11 }}>{ep.path}</code></td>
                    <td>{ep.desc}</td>
                    <td>
                      {c ? (
                        <span className={c.reachable ? "badge-pill-success" : "badge-pill-warning"}>
                          {c.reachable ? <CheckCircle2 size={12}/> : <AlertTriangle size={12}/>}
                          &nbsp;{c.status}
                        </span>
                      ) : <span style={{ color: "#6B6B6B" }}>{gu ? "ત. ન." : "Waiting"}</span>}
                    </td>
                    <td>
                      <b style={{ color: LATENCY_COLOR(ms) }}>
                        {ms !== null ? `${ms} ms` : "—"}
                      </b>
                    </td>
                    <td>
                      <span style={{ color: LATENCY_COLOR(ms), fontSize: 12, fontWeight: 600 }}>{rating}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Check History */}
      {history.length > 0 && (
        <div className="panel-gov">
          <div className="panel-gov-head">
            <div>
              <h3>{gu ? "આ સ. ત. ઇ." : "Check History (This Session)"}</h3>
              <small>{gu ? "છ. ૮ ત." : "Last 8 probes"}</small>
            </div>
          </div>
          <div className="gov-table-wrap">
            <table className="gov-data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{gu ? "સ." : "Timestamp"}</th>
                  <th>{gu ? "OK API" : "Passed"}</th>
                  <th>{gu ? "ફ. API" : "Failed"}</th>
                  <th>{gu ? "સ્." : "Status"}</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i}>
                    <td><code>{history.length - i}</code></td>
                    <td><small>{h.ts}</small></td>
                    <td><strong className="text-mono-white">{h.pass}</strong></td>
                    <td><strong className={h.total - h.pass > 0 ? "text-mono-mid" : "text-muted"}>{h.total - h.pass}</strong></td>
                    <td>
                      {h.pass === h.total
                        ? <span className="badge-pill-success"><CheckCircle2 size={12}/> {gu ? "સ." : "All OK"}</span>
                        : <span className="badge-pill-warning"><AlertTriangle size={12}/> {h.total - h.pass} {gu ? "ફ." : "failed"}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* System info footer */}
      <div className="stats-strip-4">
        <div className="stat-card-compact">
          <span className="stat-label"><Globe2 size={13}/> {gu ? "App Version" : "App Version"}</span>
          <strong className="text-mono-white">{appVersion}</strong>
          <small>yojana-drishti</small>
        </div>
        <div className="stat-card-compact">
          <span className="stat-label"><Database size={13}/> {gu ? "Database" : "Database"}</span>
          <strong className="text-mono-white">{dbStatus}</strong>
          <small>{gu ? "ડ. ત." : "Data engine"}</small>
        </div>
        <div className="stat-card-compact">
          <span className="stat-label"><Gauge size={13}/> {gu ? "Data Mode" : "Data Mode"}</span>
          <strong className="text-mono-silver">{dataMode}</strong>
          <small>{gu ? "LGD ઢ." : "LGD hierarchy"}</small>
        </div>
        <div className="stat-card-compact">
          <span className="stat-label"><ShieldCheck size={13}/> {gu ? "Uptime Check" : "Uptime Check"}</span>
          <strong className="text-muted">{gu ? "ન. (ઉ.)" : "N/A (Demo)"}</strong>
          <small>{gu ? "prod monitor ન." : "No prod monitoring"}</small>
        </div>
      </div>

    </div>
  );
}
