"use client";

import React, { useState } from "react";
import { Search, Bell, Sun, Moon, Sparkles, User, Mic } from "lucide-react";
import type { AppLanguage } from "@/lib/i18n";
import { localizeText } from "@/lib/i18n";

interface SpatialHeaderProps {
  gu: boolean;
  lang: AppLanguage;
  onSelectLanguage: (language: AppLanguage) => void;
  onOpenSearch?: () => void;
}

export function SpatialHeader({
  gu,
  lang,
  onSelectLanguage,
  onOpenSearch,
}: SpatialHeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [hasNotif, setHasNotif] = useState(true);

  return (
    <header
      className="spatial-top-vision-bar"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "10px 24px",
        margin: "12px auto 20px",
        maxWidth: "1400px",
        width: "calc(100% - 32px)",
        background: "rgba(243, 248, 253, 0.88)",
        backdropFilter: "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4)",
        border: "1px solid rgba(159, 192, 227, 0.35)",
        borderRadius: "999px",
        boxShadow: "0 4px 20px rgba(34, 58, 94, 0.08)",
        position: "sticky",
        top: 12,
        zIndex: 90,
      }}
    >
      {/* 1. Left: Profile Avatar + Welcome Chip (Mirroring Image 1) */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4D79A8 0%, #223A5E 100%)",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(34, 58, 94, 0.2)",
            border: "2px solid rgba(255, 255, 255, 0.8)",
          }}
        >
          <User size={18} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--holst-900, #223A5E)", lineHeight: 1.2 }}>
            {gu ? "નમસ્તે, નાગરિક શ્રી" : lang === "hi" ? "नमस्ते, नागरिक महोदय" : "Welcome, Citizen"}
          </span>
          <small style={{ fontSize: "0.7rem", color: "var(--holst-500, #4D79A8)", fontWeight: 500 }}>
            {gu ? "યોજના દૃષ્ટિ · ગુજરાત સરકાર" : "Yojana Drishti · Govt of Gujarat"}
          </small>
        </div>
      </div>

      {/* 2. Center: Glowing Siri / AI Search Capsule (Mirroring Image 1) */}
      <button
        type="button"
        onClick={onOpenSearch}
        style={{
          flex: 1,
          maxWidth: "460px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "8px 18px",
          borderRadius: "999px",
          background: "rgba(255, 255, 255, 0.75)",
          border: "1px solid rgba(110, 158, 204, 0.35)",
          boxShadow: "0 2px 8px rgba(77, 121, 168, 0.08)",
          cursor: "pointer",
          transition: "all 0.2s ease",
          outline: "none",
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4D79A8, #6E9ECC, #2E7D52)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 10px rgba(77, 121, 168, 0.4)",
            flexShrink: 0,
          }}
        >
          <Sparkles size={12} color="#FFFFFF" />
        </div>
        <span
          style={{
            fontSize: "0.84rem",
            color: "var(--holst-700, #355982)",
            textAlign: "left",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {gu ? "શોધો: કઈ યોજના તમારા માટે છે? (Ctrl + K)..." : "Ask or search any scheme across Gujarat..."}
        </span>
        <Mic size={15} color="var(--holst-500, #4D79A8)" />
      </button>

      {/* 3. Right: Light/Dark Capsule + Notification Bell + Language (Mirroring Image 1) */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Light / Dark Mode Toggle Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.8)",
            border: "1px solid rgba(110, 158, 204, 0.3)",
            borderRadius: "999px",
            padding: "3px 4px",
            gap: 2,
          }}
        >
          <button
            type="button"
            onClick={() => setIsDark(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 10px",
              borderRadius: "999px",
              fontSize: "0.74rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              background: !isDark ? "#FFFFFF" : "transparent",
              color: !isDark ? "var(--holst-900, #223A5E)" : "var(--holst-500, #4D79A8)",
              boxShadow: !isDark ? "0 1px 4px rgba(34, 58, 94, 0.12)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            <Sun size={12} color={!isDark ? "#E09930" : "currentColor"} />
            <span>Light</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDark(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 10px",
              borderRadius: "999px",
              fontSize: "0.74rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              background: isDark ? "#223A5E" : "transparent",
              color: isDark ? "#FFFFFF" : "var(--holst-500, #4D79A8)",
              boxShadow: isDark ? "0 1px 4px rgba(0,0,0,0.2)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            <Moon size={12} />
            <span>Dark</span>
          </button>
        </div>

        {/* Notification Bell Pill */}
        <button
          type="button"
          onClick={() => setHasNotif(!hasNotif)}
          style={{
            position: "relative",
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.8)",
            border: "1px solid rgba(110, 158, 204, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--holst-700, #355982)",
          }}
          title="Notifications"
        >
          <Bell size={16} />
          {hasNotif && (
            <span
              style={{
                position: "absolute",
                top: 7,
                right: 7,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#C63B5A",
                boxShadow: "0 0 6px #C63B5A",
              }}
            />
          )}
        </button>

        {/* Language Switcher */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.8)",
            border: "1px solid rgba(110, 158, 204, 0.3)",
            borderRadius: "999px",
            padding: "3px 4px",
            gap: 2,
          }}
        >
          {(["gu", "en", "hi"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => onSelectLanguage(l)}
              style={{
                padding: "3px 8px",
                borderRadius: "999px",
                fontSize: "0.72rem",
                fontWeight: lang === l ? 700 : 500,
                border: "none",
                cursor: "pointer",
                background: lang === l ? "var(--holst-500, #4D79A8)" : "transparent",
                color: lang === l ? "#FFFFFF" : "var(--holst-700, #355982)",
                transition: "all 0.15s ease",
              }}
            >
              {l === "gu" ? "ગુ" : l === "en" ? "EN" : "हि"}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
