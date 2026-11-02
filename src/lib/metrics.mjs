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
