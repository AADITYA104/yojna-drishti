"use client";

import React from "react";
import {
  ShieldCheck,
  Users,
  KeyRound,
  FileCheck2,
  Lock,
  UserCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { demoDistricts } from "@/lib/demo-data";

interface AdministrationViewProps {
  gu: boolean;
}

export function AdministrationView({ gu }: AdministrationViewProps) {
  const roles = [
    {
      role: gu ? "રાજ્ય સુપર એડમિન (State Admin)" : "State SuperAdmin",
      jurisdiction: gu ? `સમગ્ર ગુજરાત (${demoDistricts.length} જિલ્લા)` : `All Gujarat (${demoDistricts.length} districts)`,
      users: 4,
      canViewAll: true,
      canUpload: true,
      canApprove: true,
      canAudit: true,
    },
    {
      role: gu ? "જિલ્લા કલેક્ટર / DDO" : "District Collector / DDO",
      jurisdiction: gu ? "પોતાનો જિલ્લો (દા.ત. ભાવનગર)" : "Own District (e.g. Bhavnagar)",
      users: 33,
      canViewAll: true,
      canUpload: true,
      canApprove: true,
      canAudit: false,
    },
    {
      role: gu ? "તાલુકા વિકાસ અધિકારી (TDO)" : "Taluka Development Officer (TDO)",
      jurisdiction: gu ? "પોતાનો તાલુકો (દા.ત. ઘોઘા)" : "Own Taluka (e.g. Ghogha)",
      users: 252,
      canViewAll: false,
      canUpload: true,
      canApprove: false,
      canAudit: false,
    },
    {
      role: gu ? "તલાટી-કમ-મંત્રી / VCE (ગામ સ્તર)" : "Talati-cum-Mantri / VCE",
      jurisdiction: gu ? "પોતાનું ગામ (દા.ત. સર્વોદય)" : "Assigned Village (e.g. Sarvodaya)",
      users: 14200,
      canViewAll: false,
      canUpload: false,
      canApprove: false,
      canAudit: false,
    },
  ];

  const auditLogs = [
    { time: "Demo · 12:45 PM", user: "tdo_ghogha", action: gu ? "ઘોઘા તાલુકાના ૪૮ ગામોની યાદી ચકાસી" : "Verified Ghogha 48 villages register", status: "Sample" },
    { time: "Demo · 11:20 AM", user: "ddo_bhavnagar", action: gu ? "વ્હાલી દીકરી યોજના માસિક ક્વોટા મંજૂર કર્યો" : "Approved Vahali Dikri monthly batch", status: "Sample" },
    { time: "Demo · 05:10 PM", user: "state_admin_01", action: gu ? "વાવ-થરાદ નવા જિલ્લાનો કોડ ઉમેર્યો" : "Updated Vav-Tharad district code", status: "Sample" },
    { time: "Demo · 02:30 PM", user: "system_cron", action: gu ? "નાણાકીય સમાધાનનું ઉદાહરણ" : "Illustrative financial reconciliation", status: "Sample" },
  ];

  return (
    <div className="administration-page">
      {/* Page Hero */}
      <div className="page-hero-gov">
        <div>
          <span className="hero-kicker-tag">
            {gu ? "વહીવટી નિયંત્રણ અને ભૂમિકાઓ" : "GOVERNANCE & ROLES"}
          </span>
          <h1>{gu ? "વહીવટી ભૂમિકાઓ · નમૂનાનું પૂર્વદર્શન" : "Administration roles · preview"}</h1>
          <p>
            {gu
              ? "ભૂમિકા અને અધિકાર મેટ્રિક્સનો નમૂનો. આ પાનું વાસ્તવિક વપરાશકર્તા અથવા પરવાનગી સંચાલિત કરતું નથી."
              : "Illustrative role and permission matrix. This page does not manage real users or access controls."}
          </p>
        </div>
      </div>

      <div className="data-security-alert-bar">
        <ShieldCheck size={18} className="text-teal" />
        <div>
          <strong>{gu ? "ડેમો RBAC પૂર્વદર્શન:" : "Demo RBAC preview:"}</strong>{" "}
          <span>{gu ? "નીચેના role, user counts અને audit entries ઉદાહરણ છે. Authentication, account changes અને persistent audit storage અહીં જોડાયેલા નથી." : "Role rows, user counts, and audit entries below are illustrative. Authentication, account changes, and persistent audit storage are not connected."}</span>
        </div>
      </div>

      {/* Role Matrix Panel */}
      <div className="panel-gov">
        <div className="panel-gov-head">
          <div>
            <h3>{gu ? "વહીવટી ભૂમિકાઓ અને પરવાનગી મેટ્રિક્સ" : "Administrative Role Permission Matrix"}</h3>
            <small>{gu ? "રાજ્યથી ગામ સ્તર સુધી અધિકારોનું વિભાજન" : "Granular privilege segregation across all 4 tiers"}</small>
          </div>
        </div>

        <div className="gov-table-wrap">
          <table className="gov-data-table">
            <thead>
              <tr>
                <th>{gu ? "ભૂમિકા (Role)" : "Role"}</th>
                <th>{gu ? "કાર્યક્ષેત્ર (Jurisdiction)" : "Jurisdiction"}</th>
                <th>{gu ? "સક્રિય ખાતા" : "Active Users"}</th>
                <th>{gu ? "તમામ ડેટા જુઓ" : "View All"}</th>
                <th>{gu ? "ડેટા અપલોડ" : "Upload Data"}</th>
                <th>{gu ? "મંજૂરી આપો" : "Approve Batch"}</th>
                <th>{gu ? "ઓડિટ અધિકાર" : "Audit Logs"}</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r, i) => (
                <tr key={i}>
                  <td><b>{r.role}</b></td>
                  <td>{r.jurisdiction}</td>
                  <td><code>{r.users}</code></td>
                  <td>{r.canViewAll ? <CheckCircle2 size={16} className="text-emerald" /> : <XCircle size={16} className="text-muted" />}</td>
                  <td>{r.canUpload ? <CheckCircle2 size={16} className="text-emerald" /> : <XCircle size={16} className="text-muted" />}</td>
                  <td>{r.canApprove ? <CheckCircle2 size={16} className="text-emerald" /> : <XCircle size={16} className="text-muted" />}</td>
                  <td>{r.canAudit ? <CheckCircle2 size={16} className="text-emerald" /> : <XCircle size={16} className="text-muted" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="panel-gov">
        <div className="panel-gov-head">
          <div>
            <h3>{gu ? "નમૂના ઓડિટ પ્રવૃત્તિઓ" : "Sample Audit Activity"}</h3>
            <small>{gu ? "આ demo entries છે; વાસ્તવિક વહીવટી activity નથી" : "These are demo entries, not actual administrative activity"}</small>
          </div>
        </div>

        <div className="gov-table-wrap">
          <table className="gov-data-table">
            <thead>
              <tr>
                <th>{gu ? "સમય" : "Timestamp"}</th>
                <th>{gu ? "વપરાશકર્તા" : "User ID"}</th>
                <th>{gu ? "ક્રિયા (Activity)" : "Activity"}</th>
                <th>{gu ? "સ્થિતિ" : "Status"}</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, i) => (
                <tr key={i}>
                  <td><small>{log.time}</small></td>
                  <td><code>{log.user}</code></td>
                  <td>{log.action}</td>
                  <td><span className="badge-pill-success">{gu ? "નમૂનો" : log.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
