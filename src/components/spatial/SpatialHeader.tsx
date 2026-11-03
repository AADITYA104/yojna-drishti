"use client";

import React, { useState } from "react";
import { Search, Bell, ShieldCheck } from "lucide-react";

interface SpatialHeaderProps {
  gu: boolean;
  onToggleLanguage: () => void;
  onOpenSearch?: () => void;
}

export function SpatialHeader({
  gu,
  onToggleLanguage,
  onOpenSearch,
}: SpatialHeaderProps) {
  const [hasNotification] = useState(true);

  return (
    <header className="spatial-header-bar">
      {/* Left Title and Subtitle Badge */}
      <div className="spatial-brand-group">
        <div className="spatial-brand-titles">
          <h1 className="spatial-brand-heading">
            {gu ? "યોજના દૃષ્ટિ" : "Yojna Drishti"}
          </h1>
          <span className="spatial-brand-badge">
            <span className="spatial-tricolor-pip" />
            {gu ? "ગુજરાત સરકારી યોજના પોર્ટલ" : "Gujarat Sarkari Yojna Portal"}
          </span>
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="spatial-header-actions">
        {/* Minimalist Glass Search Trigger (Cmd + K) */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="spatial-search-trigger"
          aria-label={gu ? "શોધખોળ (Cmd + K)" : "Quick Search (Cmd + K)"}
        >
          <Search size={16} strokeWidth={1.8} className="text-white/70" />
          <span className="spatial-search-placeholder">
            {gu ? "યોજના અથવા જિલ્લો શોધો..." : "Search yojna or district..."}
          </span>
          <kbd className="spatial-kbd-chip">⌘K</kbd>
        </button>

        {/* Language Switcher Pill (ગુજરાતી | EN) */}
        <button
          type="button"
          onClick={onToggleLanguage}
          className="spatial-lang-pill"
          aria-label="Toggle Language"
        >
          <span className={gu ? "active-lang" : "muted-lang"}>ગુજરાતી</span>
          <span className="spatial-lang-divider">|</span>
          <span className={!gu ? "active-lang" : "muted-lang"}>EN</span>
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          className="spatial-icon-btn"
          aria-label={gu ? "સૂચનાઓ" : "Notifications"}
        >
          <Bell size={18} strokeWidth={1.75} />
          {hasNotification && <span className="spatial-notif-dot" />}
        </button>

        {/* Citizen Avatar Circle */}
        <div
          className="spatial-avatar-circle"
          title={gu ? "નાગરિક પ્રોફાઇલ" : "Citizen Profile"}
        >
          <span className="spatial-avatar-text">GJ</span>
          <span className="spatial-online-dot" />
        </div>
      </div>
    </header>
  );
}
