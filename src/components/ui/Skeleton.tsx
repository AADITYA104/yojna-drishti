"use client";

export interface SkeletonProps {
  height?: number | string;
  className?: string;
}

export function Skeleton({ height = 16, className = "" }: SkeletonProps) {
  return <div className={`dx-skel ${className}`.trim()} style={{ minHeight: height }} aria-hidden="true" />;
}

export function CardSkeleton() {
  return <Skeleton height={124} />;
}
