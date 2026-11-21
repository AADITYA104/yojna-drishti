"use client";

export type DataBadgeType = "DEMO" | "VERIFIED" | "UNKNOWN";

interface DataBadgeProps {
  type: DataBadgeType;
  label?: string;
  className?: string;
}

const DEFAULT_LABEL: Record<DataBadgeType, string> = {
  DEMO: "નમૂનો · DEMO",
  VERIFIED: "ચકાસેલ · VERIFIED",
  UNKNOWN: "અજ્ઞાત · UNKNOWN",
};

const MODIFIER: Record<DataBadgeType, string> = { DEMO: "", VERIFIED: " dx-badge--verified", UNKNOWN: " dx-badge--unknown" };

/** Status pill shown next to any number so synthetic data is never mistaken for real data. */
export function DataBadge({ type, label, className = "" }: DataBadgeProps) {
  return <span className={`dx-badge${MODIFIER[type]} ${className}`.trim()}>{label ?? DEFAULT_LABEL[type]}</span>;
}
