"use client";

import React, { useState } from "react";
import {
  ShieldCheck, Users, KeyRound, FileCheck2, Lock,
  UserCheck, CheckCircle2, XCircle, Building2, Landmark,
  Home, AlertTriangle, Clock, Search, ChevronDown, Activity,
  Server, Database, Sparkles,
} from "lucide-react";
import { demoDistricts, demoTalukas } from "@/lib/demo-data";
import { SystemMonitoringView } from "./SystemMonitoringView";
import { DataManagementView } from "./DataManagementView";

interface AdministrationViewProps {
  gu: boolean;
}

const AUDIT_LOGS = [
  { ts: "2026-11-15 · 12:45", user: "tdo_ghogha",      en: "Verified Ghogha 48 villages register",          gu: "ઘોઘા ૪૮ ગામ નોંધ ચકાસ", level: "info"    },
  { ts: "2026-11-15 · 11:20", user: "ddo_bhavnagar",   en: "Approved Vahali Dikri monthly batch (4,210)",    gu: "વ્હાલી દીકરી ૪,૨૧૦ મંજૂર", level: "success" },
  { ts: "2026-11-14 · 17:10", user: "state_admin_01",  en: "Updated Vav-Tharad district code (GJ-39)",       gu: "વાવ-થરાદ GJ-39 કોડ ઉ.",    level: "success" },
  { ts: "2026-11-14 · 15:30", user: "system_cron",     en: "Financial reconciliation batch completed",       gu: "નાણ. સ. સ. પૂ.",            level: "info"    },
  { ts: "2026-11-14 · 09:05", user: "tdo_dhandhuka",   en: "Uploaded Q3 beneficiary list (2,870 entries)",   gu: "Q3 ૨,૮૭૦ ઉ.",              level: "success" },
  { ts: "2026-11-13 · 14:22", user: "ddo_rajkot",      en: "Flagged 12 duplicate Aadhaar entries for review",gu: "૧૨ ડ. આ. ફ.",              level: "warning" },
  { ts: "2026-11-13 · 11:00", user: "state_admin_02",  en: "New TDO account created: tdo_palitana_02",       gu: "નવ TDO ઉ. tdo_palitana_02", level: "info"    },
  { ts: "2026-11-12 · 16:45", user: "system_cron",     en: "DBT reconciliation: 99.2% success rate",         gu: "DBT ૯૯.૨% સ.",              level: "success" },
];

export function AdministrationView({ gu }: AdministrationViewProps) {
  const [adminTab, setAdminTab] = useState<"rbac" | "monitoring" | "data">("rbac");
  const [logFilter, setLogFilter] = useState<"all" | "success" | "warning" | "info">("all");
  const [logSearch, setLogSearch] = useState("");

  const roles = [
    {
      tier: 1,
      role:         gu ? "રાજ્ય સુપર એડ. (State Admin)" : "State SuperAdmin",
      jurisdiction: gu ? `સમગ્ર ગુજરાત (${demoDistricts.length} જિ.)` : `All Gujarat (${demoDistricts.length} dists)`,
      users:       4,
      canViewAll:  true,  canUpload: true,  canApprove: true,  canAudit: true,  canConfig: true,
      color:       "#FFFFFF",
    },
    {
      tier: 2,
      role:         gu ? "જિ. કલેક્ટર / DDO" : "District Collector / DDO",
      jurisdiction: gu ? "પોતાનો જિ. (૩૪ ઓ.)" : "Own District (34 slots)",
      users:       34,
      canViewAll:  true,  canUpload: true,  canApprove: true,  canAudit: false, canConfig: false,
      color:       "#D0DCF0",
    },
    {
      tier: 3,
      role:         gu ? "TDO (તા. વ. અ.)" : "Taluka Dev. Officer (TDO)",
      jurisdiction: gu ? `પોત. તાલ. (${demoTalukas.length} સ્લ.)` : `Own Taluka (${demoTalukas.length} slots)`,
      users:       309,
      canViewAll:  false, canUpload: true,  canApprove: false, canAudit: false, canConfig: false,
      color:       "#8C8C8C",
    },
    {
      tier: 4,
      role:         gu ? "તલ.-ક.-મ. / VCE (ગામ)" : "Talati-cum-Mantri / VCE",
      jurisdiction: gu ? "પોત. ગામ (૧૯,૨૦૧ સ્લ.)" : "Assigned Village (19,201 slots)",
      users:       14200,
      canViewAll:  false, canUpload: false, canApprove: false, canAudit: false, canConfig: false,
      color:       "#4A4A4A",
    },
  ];

  const filteredLogs = AUDIT_LOGS.filter(l => {
    const matchLevel  = logFilter === "all" || l.level === logFilter;
    const matchSearch = !logSearch || (gu ? l.gu : l.en).toLowerCase().includes(logSearch.toLowerCase()) || l.user.toLowerCase().includes(logSearch.toLowerCase());
    return matchLevel && matchSearch;
  });

  const Tick  = ({ ok }: { ok: boolean }) =>
    ok ? <CheckCircle2 size={16} className="text-mono-white" /> : <XCircle size={16} className="text-muted" />;

  const levelBadge = (level: string) => {
    if (level === "success") return <span className="badge-pill-success"><CheckCircle2 size={12}/> {gu ? "સફળ" : "OK"}</span>;
    if (level === "warning") return <span className="badge-pill-warning"><AlertTriangle size={12}/> {gu ? "ચ." : "Warn"}</span>;
    return <span className="badge-pill"><Activity size={12}/> {gu ? "માહ." : "Info"}</span>;
  };

  return (
    <div className="administration-page">
      {/* Subnav Tabs */}
      <div className="report-type-bar" style={{ marginBottom: "1rem" }}>
        {[
          { key: "rbac" as const, labelGu: "RBAC અને શાસન", labelEn: "RBAC & Governance", icon: ShieldCheck },
          { key: "monitoring" as const, labelGu: "સિસ્ટમ મોનિટરિંગ", labelEn: "System Health & APIs", icon: Server },
          { key: "data" as const, labelGu: "ડેટા પાઇપલાઇન અને માન્યતા", labelEn: "Data Pipeline & Files", icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              className={`cat-pill-btn ${isActive ? "active" : ""}`}
              onClick={() => setAdminTab(tab.key)}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Icon size={14} />
              <span>{gu ? tab.labelGu : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {adminTab === "monitoring" && <SystemMonitoringView gu={gu} />}
      {adminTab === "data" && <DataManagementView gu={gu} />}

      {adminTab === "rbac" && (
        <>
          {/* Hero */}
          <div className="page-hero-gov">
            <div>
              <span className="hero-kicker-tag">
                {gu ? "RBAC · ૪-સ્તરીય સ્ત્રોત નિયંત્રણ" : "GOVERNANCE · 4-TIER RBAC"}
              </span>
              <h1>{gu ? "વહીવટી ભૂમિકાઓ · Permission Matrix" : "Administration Roles · Permission Matrix"}</h1>
              <p>
                {gu
                  ? "રાજ્ય → જિ. → તા. → ગામ: ૪-સ્તરીય RBAC ઢાંચો. ઉ. — ઓળ., ખ. ફ. સ. અ. નથી."
                  : "State → District → Taluka → Village: 4-tier RBAC framework. Illustrative — no real auth or account changes."}
              </p>
            </div>
          </div>

      {/* Alert bar */}
      <div className="data-security-alert-bar">
        <ShieldCheck size={18} className="text-mono-white" />
        <div>
          <strong>{gu ? "ડેમો RBAC:" : "Demo RBAC:"}</strong>{" "}
          <span>{gu ? "Role, user count, audit ઉ. છે. Auth, ખ.ફ., oc. storage જ. નથી." : "Role rows, user counts, and audit entries are illustrative. Authentication and persistent audit storage not connected."}</span>
        </div>
      </div>

      {/* Stats strip */}
      <div className="stats-strip-4">
        <div className="stat-card-compact">
          <span className="stat-label">{gu ? "ભૂમિકા-સ્તર" : "Role Tiers"}</span>
          <strong className="text-mono-white">4</strong>
          <small>{gu ? "રા. → જિ. → તા. → ગા." : "State → District → Taluka → Village"}</small>
        </div>
        <div className="stat-card-compact">
          <span className="stat-label">{gu ? "કુલ ઉ. ખ." : "Total User Slots"}</span>
          <strong className="text-mono-white">14,547</strong>
          <small>{gu ? "ઉ. ૧૪,૫૪૭ ઓ." : "Approx. 14,547 slots"}</small>
        </div>
        <div className="stat-card-compact">
          <span className="stat-label">{gu ? "ઓ. લ." : "Audit Log Entries"}</span>
          <strong className="text-mono-silver">{AUDIT_LOGS.length}</strong>
          <small>{gu ? "ઉ. ડેમો — ૮ ન." : "Illustrative — 8 recent"}</small>
        </div>
        <div className="stat-card-compact">
          <span className="stat-label">{gu ? "DBT ઓ. ટ." : "DBT Auth. Rate"}</span>
          <strong className="text-mono-white">99.2%</strong>
          <small>{gu ? "ઉ. ગ. · ચ. નથી" : "Demo · unverified"}</small>
        </div>
      </div>

      {/* Role tiers — visual cards */}
      <section className="panel-gov">
        <div className="panel-gov-head">
          <div>
            <h3>{gu ? "૪-સ્તરીય RBAC ઢાંચો — વિઝ્યુઅલ ટ્રી" : "4-Tier RBAC Framework — Visual Hierarchy"}</h3>
            <small>{gu ? "ઉ. — ઓ. ફ. ન." : "Illustrative — no actual permissions enforced"}</small>
          </div>
        </div>
        <div className="admin-roles-visual">
          {roles.map(r => (
            <div key={r.tier} className="admin-role-card" style={{ borderLeftColor: r.color }}>
              <div className="arc-tier-badge" style={{ background: r.color }}>T{r.tier}</div>
              <div className="arc-body">
                <div className="arc-role">{r.role}</div>
                <div className="arc-jurisdiction">{r.jurisdiction}</div>
                <div className="arc-users">
                  <Users size={13}/> <strong>{r.users.toLocaleString()}</strong> {gu ? "ઓ." : "slots"}
                </div>
                <div className="arc-perms">
                  <span className={r.canViewAll  ? "perm-yes" : "perm-no"}><FileCheck2 size={12}/>{gu ? "જ.જ." : "ViewAll"}</span>
                  <span className={r.canUpload   ? "perm-yes" : "perm-no"}><KeyRound   size={12}/>{gu ? "ઉ." : "Upload"}</span>
                  <span className={r.canApprove  ? "perm-yes" : "perm-no"}><UserCheck  size={12}/>{gu ? "મ." : "Approve"}</span>
                  <span className={r.canAudit    ? "perm-yes" : "perm-no"}><Lock       size={12}/>{gu ? "ઓ.લ." : "Audit"}</span>
                  <span className={r.canConfig   ? "perm-yes" : "perm-no"}><ShieldCheck size={12}/>{gu ? "ક." : "Config"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Permission Matrix Table */}
      <div className="panel-gov">
        <div className="panel-gov-head">
          <div>
            <h3>{gu ? "Permission Matrix — ૪ ભૂ. × ૫ ઓ." : "Permission Matrix — 4 Roles × 5 Operations"}</h3>
            <small>{gu ? "RBAC ઢ. — ઉ. ગ." : "RBAC framework — illustrative"}</small>
          </div>
        </div>
        <div className="gov-table-wrap">
          <table className="gov-data-table">
            <thead>
              <tr>
                <th>{gu ? "ભૂ. (Tier)" : "Role (Tier)"}</th>
                <th>{gu ? "ક્ષ." : "Jurisdiction"}</th>
                <th>{gu ? "ઓ." : "Users"}</th>
                <th>{gu ? "જ.જ." : "View All"}</th>
                <th>{gu ? "ઉ." : "Upload"}</th>
                <th>{gu ? "મ." : "Approve"}</th>
                <th>{gu ? "ઓ.લ." : "Audit Log"}</th>
                <th>{gu ? "ક." : "Config"}</th>
              </tr>
            </thead>
            <tbody>
              {roles.map(r => (
                <tr key={r.tier}>
                  <td><b style={{ color: r.color }}>T{r.tier} · {r.role}</b></td>
                  <td>{r.jurisdiction}</td>
                  <td><code>{r.users.toLocaleString()}</code></td>
                  <td><Tick ok={r.canViewAll}  /></td>
                  <td><Tick ok={r.canUpload}   /></td>
                  <td><Tick ok={r.canApprove}  /></td>
                  <td><Tick ok={r.canAudit}    /></td>
                  <td><Tick ok={r.canConfig}   /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Table with filter */}
      <div className="panel-gov">
        <div className="panel-gov-head">
          <div>
            <h3>{gu ? "ઓ.લ. — ન. ક્ર." : "Audit Activity — Recent Actions"}</h3>
            <small>{gu ? "ઉ. ૮ ન. — ઓ. log feed ન." : "Illustrative 8 entries — no live audit feed"}</small>
          </div>
          {/* Filter controls */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <label className="search-box-gov" style={{ minWidth: 160 }}>
              <Search size={13} />
              <input
                type="search"
                placeholder={gu ? "શ. ઓ...." : "Search log..."}
                value={logSearch}
                onChange={e => setLogSearch(e.target.value)}
              />
            </label>
            {(["all", "success", "warning", "info"] as const).map(f => (
              <button
                key={f}
                className={`cat-pill-btn ${logFilter === f ? "active" : ""}`}
                onClick={() => setLogFilter(f)}
              >
                {f === "all" ? (gu ? "બ." : "All") : f === "success" ? (gu ? "સ." : "OK") : f === "warning" ? (gu ? "ચ." : "Warn") : (gu ? "મ." : "Info")}
              </button>
            ))}
          </div>
        </div>
        <div className="gov-table-wrap">
          <table className="gov-data-table">
            <thead>
              <tr>
                <th><Clock size={12}/> {gu ? "સ." : "Time"}</th>
                <th>{gu ? "વ. ID" : "User ID"}</th>
                <th>{gu ? "ક્ર." : "Activity"}</th>
                <th>{gu ? "સ્." : "Status"}</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: "center", color: "#4A6080", padding: "24px" }}>{gu ? "ક. મળ. ન." : "No matching entries"}</td></tr>
              ) : filteredLogs.map((log, i) => (
                <tr key={i}>
                  <td><small style={{ fontFamily: "monospace", color: "#64748b" }}>{log.ts}</small></td>
                  <td><code>{log.user}</code></td>
                  <td>{gu ? log.gu : log.en}</td>
                  <td>{levelBadge(log.level)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
