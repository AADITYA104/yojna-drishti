/**
 * Convert an approved/application pair to a rounded percentage.
 * Returns null when the pair is missing, invalid, or has no denominator.
 * @param {number | null | undefined} approved
 * @param {number | null | undefined} applications
 * @returns {number | null}
 */
export function approvalPercent(approved, applications) {
  if (!Number.isFinite(approved) || !Number.isFinite(applications)) return null;
  if (approved < 0 || applications <= 0 || approved > applications) return null;
  return Math.round((approved / applications) * 100);
}

/**
 * @param {number} value
 * @param {string} financialYear
 * @returns {number}
 */
export function scaleDemoValue(value, financialYear) {
  const factor = financialYear === "2024–25" ? 0.88 : financialYear === "2023–24" ? 0.75 : 1;
  return Math.round(value * factor);
}

/**
 * Classify village-level scheme coverage status.
 * Returns { status: 'reached' | 'not_reached' | 'unknown', count: number | null }
 * Note: 'unknown' (no surveyed rows) is strictly distinct from 'not_reached' (zero approved).
 * @param {Array<Record<string, string>> | null | undefined} rows
 * @param {string} schemeId
 * @returns {{ status: 'reached' | 'not_reached' | 'unknown', count: number | null }}
 */
export function classifySchemeReach(rows, schemeId) {
  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    return { status: "unknown", count: null };
  }
  const matching = rows.filter((r) => r.Scheme_ID === schemeId);
  if (matching.length === 0) {
    return { status: "unknown", count: null };
  }
  const approved = matching.filter((r) => {
    const elig = String(r.Eligibility_Status || "").toLowerCase();
    const stat = String(r.Application_or_Activity_Status || "").toLowerCase();
    const isEligible =
      (elig.includes("eligible") && !elig.includes("not eligible") && !elig.includes("ineligible")) ||
      (elig.includes("પાત્ર") && !elig.includes("પાત્ર નથી") && !elig.includes("અપાત્ર"));
    const isApproved =
      (stat.includes("approved") && !stat.includes("rejected")) ||
      (stat.includes("મંજૂર") && !stat.includes("નામંજૂર")) ||
      stat.includes("complete") ||
      stat.includes("સંપૂર્ણ");
    return isEligible || isApproved;
  });
  if (approved.length === 0) {
    return { status: "not_reached", count: 0 };
  }
  return { status: "reached", count: approved.length };
}
