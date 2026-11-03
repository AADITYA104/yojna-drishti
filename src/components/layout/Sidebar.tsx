"use client";

import React from "react";
import {
  Home,
  MapPinned,
  Building2,
  Landmark,
  Compass,
  ClipboardList,
  Users,
  Wallet,
  BarChart3,
  FileSpreadsheet,
  Database,
  Settings,
  Activity,
  ExternalLink,
  CircleHelp,
  BookOpen,
  ChevronDown,
  X,
  LucideIcon,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export type PageKey =
  | "overview"
  | "map"
  | "districts"
  | "talukas"
  | "villages"
  | "schemes"
  | "beneficiaries"
  | "financials"
  | "analytics"
  | "reports"
  | "data"
  | "admin"
  | "monitoring"
  | "public";

export interface NavItemDef {
  key: PageKey;
  en: string;
  gu: string;
  icon: LucideIcon;
  badge?: string;
}

export const navItems: NavItemDef[] = [
  { key: "overview", en: "Overview", gu: "રાજ્ય ઝાંખી", icon: Home },
  { key: "map", en: "Map Explorer", gu: "ભૂગોળ નકશો", icon: MapPinned, badge: "34 Dist" },
  { key: "districts", en: "District Intel", gu: "જિલ્લા વિશ્લેષણ", icon: Building2 },
  { key: "talukas", en: "Taluka Intel", gu: "તાલુકા વિશ્લેષણ", icon: Landmark },
  { key: "villages", en: "Village Intel", gu: "ગામ વિશ્લેષણ", icon: Home },
  { key: "schemes", en: "Schemes Catalogue", gu: "યોજનાઓ યાદી", icon: ClipboardList, badge: "10" },
  { key: "beneficiaries", en: "Beneficiary Analytics", gu: "લાભાર્થી વિશ્લેષણ", icon: Users },
  { key: "financials", en: "Financial Intelligence", gu: "નાણાકીય વિશ્લેષણ", icon: Wallet },
  { key: "analytics", en: "Analytics & Compare", gu: "વિશ્લેષણ અને તુલના", icon: BarChart3 },
  { key: "reports", en: "Reports Center", gu: "અહેવાલ કેન્દ્ર", icon: FileSpreadsheet },
  { key: "data", en: "Data Management", gu: "ડેટા વ્યવસ્થાપન", icon: Database },
  { key: "admin", en: "Administration", gu: "વહીવટી નિયંત્રણ", icon: Settings },
  { key: "monitoring", en: "System Monitoring", gu: "સિસ્ટમ દેખરેખ", icon: Activity },
  { key: "public", en: "Public Portal (Finder)", gu: "યોજના શોધક (જાહેર)", icon: ExternalLink, badge: "Citizen" },
];

interface SidebarProps {
  currentPage: PageKey;
  onNavigate: (key: PageKey) => void;
  gu: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ currentPage, onNavigate, gu, isOpen, onClose }: SidebarProps) {
  return (
    <aside className={`sidebar-gov ${isOpen ? "sidebar-open" : ""}`}>
      {/* Brand & State Emblem Header */}
      <div className="brand-gov">
        <div className="brand-emblem-wrap">
          <div className="brand-seal-icon">
            <Compass size={22} />
          </div>
        </div>
        <div className="brand-titles">
          <strong>યોજના દૃષ્ટિ</strong>
          <small>YOJANA DRISHTI</small>
          <span className="brand-subtag">
            {gu ? "ગુજરાત યોજના માહિતી · પૂર્વદર્શન" : "Gujarat Scheme Information · Preview"}
          </span>
        </div>
        <button className="mobile-close-btn" onClick={onClose} aria-label="Close menu">
          <X size={18} />
        </button>
      </div>

      <div className="sidebar-group-title">
        {gu ? "મુખ્ય કાર્યક્ષેત્ર" : "ANALYTICS WORKSPACE"}
      </div>

      {/* Nav List */}
      <nav className="side-nav-gov" aria-label="Main Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.key;

          return (
            <button
              key={item.key}
              className={`nav-btn-gov ${isActive ? "active" : ""}`}
              onClick={() => {
                onNavigate(item.key);
                onClose();
              }}
            >
              <span className="nav-icon-wrap">
                <Icon size={17} />
              </span>
              <span className="nav-label-text">{gu ? item.gu : item.en}</span>
              {item.badge && <span className="nav-item-badge">{item.badge}</span>}
              {isActive && <span className="nav-active-pip" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Info */}
      <div className="sidebar-bottom-block">
        <div className="side-status-box">
          <span className="status-live-dot" />
          <div>
            <b>{gu ? "ડેમો ડેટા સક્રિય" : "DEMO ENGINE"}</b>
            <small>{gu ? "વાસ્તવિક LGD માળખું" : "Real LGD Hierarchy"}</small>
          </div>
          <ShieldCheck size={16} className="status-shield-icon" />
        </div>

        <div className="user-profile-tile">
          <div className="user-avatar-circle">GJ</div>
          <div className="user-info">
            <b>{gu ? "પૂર્વદર્શન વપરાશકર્તા" : "Preview User"}</b>
            <small>{gu ? "ડેમો ઍક્સેસ · સત્તાવાર લૉગિન નથી" : "Demo access · not an official login"}</small>
          </div>
          <ChevronDown size={14} />
        </div>
      </div>
    </aside>
  );
}
