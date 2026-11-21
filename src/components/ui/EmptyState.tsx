"use client";

import React from "react";
import { FolderLock, ArrowRight } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  description: string;
  requiredDataset?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  requiredDataset,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 md:p-12 ${className}`}
      style={{
        backgroundColor: "var(--color-surface, rgba(255, 255, 255, 0.05))",
        border: "1px dashed var(--color-border, rgba(255, 255, 255, 0.16))",
        borderRadius: "var(--radius-lg, 16px)",
      }}
      role="region"
      aria-label={title}
    >
      <div
        className="w-12 h-12 flex items-center justify-center rounded-xl mb-4"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          color: "var(--color-accent-light, #F59E0B)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
        }}
        aria-hidden="true"
      >
        <FolderLock size={22} />
      </div>

      <h3 className="text-base md:text-lg font-bold text-white mb-2 tracking-tight">
        {title}
      </h3>

      <p className="text-sm max-w-md text-white/70 leading-relaxed mb-4">
        {description}
      </p>

      {requiredDataset && (
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs mb-6"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.10)",
            color: "var(--color-text-muted, rgba(255, 255, 255, 0.8))",
          }}
        >
          <span className="font-semibold text-amber-400">જરૂરી ડેટાસેટ:</span>
          <span>{requiredDataset}</span>
        </div>
      )}

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 font-medium text-sm transition-all"
          style={{
            backgroundColor: "var(--color-accent, #D97706)",
            color: "#FFFFFF",
            borderRadius: "var(--radius-sm, 8px)",
          }}
        >
          <span>{actionLabel}</span>
          <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}
