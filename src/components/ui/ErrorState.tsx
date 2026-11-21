"use client";

import React from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "માહિતી લોડ કરવામાં ક્ષતિ આવી",
  message,
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 rounded-lg ${className}`}
      style={{
        backgroundColor: "rgba(185, 28, 28, 0.08)",
        border: "1px solid rgba(185, 28, 28, 0.25)",
        borderRadius: "var(--radius-lg, 16px)",
      }}
      role="alert"
    >
      <div
        className="w-11 h-11 flex items-center justify-center rounded-xl mb-3 text-red-400"
        style={{
          backgroundColor: "rgba(185, 28, 28, 0.16)",
          border: "1px solid rgba(185, 28, 28, 0.3)",
        }}
        aria-hidden="true"
      >
        <AlertTriangle size={22} />
      </div>

      <h3 className="text-base font-bold text-white mb-1.5">
        {title}
      </h3>

      <p className="text-xs md:text-sm max-w-sm text-white/70 mb-5 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-md transition-colors"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            color: "#FFFFFF",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            borderRadius: "var(--radius-sm, 8px)",
          }}
        >
          <RotateCw size={14} aria-hidden="true" />
          <span>ફરી પ્રયાસ કરો (Retry)</span>
        </button>
      )}
    </div>
  );
}
