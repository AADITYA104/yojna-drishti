"use client";

import { RotateCcw } from "lucide-react";

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({ title, message, onRetry, retryLabel = "ફરી પ્રયાસ કરો", className = "" }: ErrorStateProps) {
  return (
    <div className={`dx-error ${className}`.trim()} role="alert">
      {title && <h2>{title}</h2>}
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="dx-btn dx-btn--ghost" onClick={onRetry}>
          <RotateCcw size={16} aria-hidden="true" />
          {retryLabel}
        </button>
      )}
    </div>
  );
}
