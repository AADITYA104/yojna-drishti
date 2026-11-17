"use client";

import React from "react";
import { localizeText } from "@/lib/i18n";
import type { AppLanguage } from "@/lib/i18n";
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
  lang: AppLanguage;
}

export function AdministrationView({ gu, lang }: AdministrationViewProps) {
  const roles = [
    {
      role: localizeText(lang, gu ? "રાજ્ય સુપર એડમિન (State Admin)" : "State SuperAdmin"),
      jurisdiction: localizeText(lang, gu ? `સમગ્ર ગુજરાત (${demoDistricts.length} જિલ્લા)` : `All Gujarat (${demoDistricts.length} districts)`),
      users: 4,
      canViewAll: true,
      canUpload: true,
      canApprove: true,
      canAudit: true,
    },
    {
      role: localizeText(lang, gu ? "જિલ્લા કલેક્ટર / DDO" : "District Collector / DDO"),
      jurisdiction: localizeText(lang, gu ? "પોતાનો જિલ્લો (દા.ત. ભાવનગર)" : "Own District (e.g. Bhavnagar)"),
      users: 33,
      canViewAll: true,
      canUpload: true,
      canApprove: true,
      canAudit: false,
    },
    {
      role: localizeText(lang, gu ? "તાલુકા વિકાસ અધિકારી (TDO)" : "Taluka Development Officer (TDO)"),
      jurisdiction: localizeText(lang, gu ? "પોતાનો તાલુકો (દા.ત. ઘોઘા)" : "Own Taluka (e.g. Ghogha)"),
      users: 252,
      canViewAll: false,
      canUpload: true,
      canApprove: false,
      canAudit: false,
    },
    {
      role: localizeText(lang, gu ? "તલાટી-કમ-મંત્રી / VCE (ગામ સ્તર)" : "Talati-cum-Mantri / VCE"),
      jurisdiction: localizeText(lang, gu ? "પોતાનું ગામ (દા.ત. સર્વોદય)" : "Assigned Village (e.g. Sarvodaya)"),
      users: 14200,
      canViewAll: false,
      canUpload: false,
      canApprove: false,
      canAudit: false,
    },
  ];

  const auditLogs = [
    { time: "12:45 PM", user: "tdo_ghogha", action: localizeText(lang, gu ? "ઘોઘા તાલુકાના ૪૮ ગામોની યાદી ચકાસી" : "Verified Ghogha 48 villages register"), status: "Verified" },
    { time: "11:20 AM", user: "ddo_bhavnagar", action: localizeText(lang, gu ? "વ્હાલી દીકરી યોજના માસિક ક્વોટા મંજૂર કર્યો" : "Approved Vahali Dikri monthly batch"), status: "Approved" },
    { time: "05:10 PM", user: "state_admin_01", action: localizeText(lang, gu ? "વાવ-થરાદ નવા જિલ્લાનો કોડ ઉમેર્યો" : "Updated Vav-Tharad district code"), status: "Updated" },
    { time: "02:30 PM", user: "system_cron", action: localizeText(lang, gu ? "નાણાકીય સમાધાન ચક્ર પૂર્ણ થયું" : "Financial reconciliation cycle completed"), status: "Success" },
  ];

  return (
    <div className="administration-page">
      {/* Page Hero */}
      <div className="page-hero-gov">
        <div>
          <span className="hero-kicker-tag">
            {localizeText(lang, gu ? "વહીવટી નિયંત્રણ અને ભૂમિકાઓ" : "GOVERNANCE & ROLES")}
          </span>
          <h1>{localizeText(lang, gu ? "વહીવટી ભૂમિકાઓ અને સુરક્ષા વ્યવસ્થાપન" : "Administration Roles & Security Governance")}</h1>
          <p>
            {localizeText(lang, gu
              ? "ભૂમિકા અને અધિકાર મેટ્રિક્સનો નમૂનો. આ પાનું વાસ્તવિક વપરાશકર્તા અથવા પરવાનગી સંચાલિત કરતું નથી."
              : "Illustrative role and permission matrix. This page does not manage real users or access controls.")}
          </p>
        </div>
      </div>

      <div className="data-security-alert-bar">
        <ShieldCheck size={18} className="text-teal" />
        <div>
          <strong>{localizeText(lang, gu ? "ડેમો RBAC પૂર્વદર્શન:" : "Demo RBAC preview:")}</strong>{" "}
          <span>{localizeText(lang, gu ? "નીચેના role, user counts અને audit entries ઉદાહરણ છે. Authentication, account changes અને persistent audit storage અહીં જોડાયેલા નથી." : "Role rows, user counts, and audit entries below are illustrative. Authentication, account changes, and persistent audit storage are not connected.")}</span>
        </div>
      </div>

      {/* Role Matrix Panel */}
      <div className="panel-gov">
        <div className="panel-gov-head">
          <div>
            <h3>{localizeText(lang, gu ? "વહીવટી ભૂમિકાઓ અને પરવાનગી મેટ્રિક્સ" : "Administrative Role Permission Matrix")}</h3>
            <small>{localizeText(lang, gu ? "રાજ્યથી ગામ સ્તર સુધી અધિકારોનું વિભાજન" : "Granular privilege segregation across all 4 tiers")}</small>
          </div>
        </div>

        <div className="gov-table-wrap">
          <table className="gov-data-table">
            <thead>
              <tr>
                <th>{localizeText(lang, gu ? "ભૂમિકા (Role)" : "Role")}</th>
                <th>{localizeText(lang, gu ? "કાર્યક્ષેત્ર (Jurisdiction)" : "Jurisdiction")}</th>
                <th>{localizeText(lang, gu ? "સક્રિય ખાતા" : "Active Users")}</th>
                <th>{localizeText(lang, gu ? "તમામ ડેટા જુઓ" : "View All")}</th>
                <th>{localizeText(lang, gu ? "ડેટા અપલોડ" : "Upload Data")}</th>
                <th>{localizeText(lang, gu ? "મંજૂરી આપો" : "Approve Batch")}</th>
                <th>{localizeText(lang, gu ? "ઓડિટ અધિકાર" : "Audit Logs")}</th>
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
            <h3>{localizeText(lang, gu ? "નમૂના ઓડિટ પ્રવૃત્તિઓ" : "Sample Audit Activity")}</h3>
            <small>{localizeText(lang, gu ? "આ demo entries છે; વાસ્તવિક વહીવટી activity નથી" : "These are demo entries, not actual administrative activity")}</small>
          </div>
        </div>

        <div className="gov-table-wrap">
          <table className="gov-data-table">
            <thead>
              <tr>
                <th>{localizeText(lang, gu ? "સમય" : "Timestamp")}</th>
                <th>{localizeText(lang, gu ? "વપરાશકર્તા" : "User ID")}</th>
                <th>{localizeText(lang, gu ? "ક્રિયા (Activity)" : "Activity")}</th>
                <th>{localizeText(lang, gu ? "સ્થિતિ" : "Status")}</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, i) => (
                <tr key={i}>
                  <td><small>{log.time}</small></td>
                  <td><code>{log.user}</code></td>
                  <td>{log.action}</td>
                  <td><span className="badge-pill-success">{localizeText(lang, gu ? "નમૂનો" : log.status)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
