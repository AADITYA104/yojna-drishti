"use client";

import React from "react";

export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: "sm" | "lg" | "full";
}

export function Skeleton({
  className = "",
  width,
  height,
  rounded = "sm",
}: SkeletonProps) {
  const radiusMap = {
    sm: "var(--radius-sm, 8px)",
    lg: "var(--radius-lg, 16px)",
    full: "var(--radius-full, 9999px)",
  };

  return (
    <div
      className={`animate-pulse ${className}`}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        borderRadius: radiusMap[rounded],
        width: width ?? "100%",
        height: height ?? "1rem",
      }}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div
      className="p-5 flex flex-col justify-between"
      style={{
        backgroundColor: "var(--color-surface, rgba(255, 255, 255, 0.07))",
        border: "1px solid var(--color-border, rgba(255, 255, 255, 0.14))",
        borderRadius: "var(--radius-lg, 16px)",
        minHeight: "130px",
      }}
      aria-label="માહિતી લોડ થઈ રહી છે (Loading skeleton)"
      role="status"
    >
      <div className="flex items-center justify-between mb-4">
        <Skeleton width="45%" height="14px" />
        <Skeleton width="60px" height="20px" rounded="full" />
      </div>
      <Skeleton width="70%" height="28px" rounded="sm" className="mb-2" />
      <Skeleton width="55%" height="12px" />
    </div>
  );
}
