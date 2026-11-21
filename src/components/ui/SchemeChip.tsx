"use client";

import React from "react";

export interface SchemeChipProps {
  id: string;
  name: string;
  selected?: boolean;
  count?: number;
  onClick?: () => void;
  className?: string;
}

export function SchemeChip({
  id,
  name,
  selected = false,
  count,
  onClick,
  className = "",
}: SchemeChipProps) {
  return (
    <button
      key={id}
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 transition-all duration-150 cursor-pointer ${className}`}
      style={{
        backgroundColor: selected
          ? "var(--color-accent, #D97706)"
          : "rgba(255, 255, 255, 0.08)",
        color: selected ? "#FFFFFF" : "var(--color-text-muted, rgba(255, 255, 255, 0.85))",
        border: selected
          ? "1px solid var(--color-accent-light, #F59E0B)"
          : "1px solid var(--color-border, rgba(255, 255, 255, 0.14))",
        borderRadius: "var(--radius-full, 9999px)",
        fontSize: "0.82rem",
        fontWeight: selected ? 600 : 500,
        boxShadow: selected
          ? "0 2px 8px rgba(217, 119, 6, 0.35)"
          : "none",
        whiteSpace: "nowrap",
      }}
    >
      <span>{name}</span>
      {typeof count === "number" && (
        <span
          className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: selected ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.12)",
            color: selected ? "#FFFFFF" : "var(--color-text-subtle, rgba(255, 255, 255, 0.70))",
            minWidth: "18px",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
