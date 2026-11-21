"use client";

import React from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";

export interface BreadcrumbItem {
  id: string;
  label: string;
  level: "state" | "district" | "taluka" | "village";
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onBack?: () => void;
  className?: string;
}

export function Breadcrumb({ items, onBack, className = "" }: BreadcrumbProps) {
  return (
    <nav
      aria-label="પ્રશાસનિક સ્તર નેવિગેશન (Administrative Breadcrumb)"
      className={`flex items-center flex-wrap gap-1.5 text-xs md:text-sm ${className}`}
    >
      {onBack && items.length > 1 && (
        <button
          type="button"
          onClick={onBack}
          aria-label="પાછળ જાઓ (Go back)"
          className="inline-flex items-center gap-1 mr-2 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            color: "var(--color-text, #F8FAFC)",
            border: "1px solid var(--color-border, rgba(255, 255, 255, 0.14))",
            borderRadius: "var(--radius-sm, 8px)",
          }}
        >
          <ArrowLeft size={13} aria-hidden="true" />
          <span>પાછળ</span>
        </button>
      )}

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={`${item.level}-${item.id}`}>
            {index > 0 && (
              <ChevronRight
                size={14}
                className="opacity-40 shrink-0"
                style={{ color: "var(--color-text-subtle, #94A3B8)" }}
                aria-hidden="true"
              />
            )}
            {isLast ? (
              <span
                aria-current="page"
                className="font-semibold px-2 py-0.5 rounded"
                style={{
                  color: "var(--color-accent-light, #F59E0B)",
                  backgroundColor: "var(--color-accent-soft, rgba(217, 119, 6, 0.15))",
                }}
              >
                {item.label}
              </span>
            ) : (
              <button
                type="button"
                onClick={item.onClick}
                className="hover:underline transition-colors px-1 py-0.5"
                style={{ color: "var(--color-text-muted, rgba(255, 255, 255, 0.78))" }}
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
