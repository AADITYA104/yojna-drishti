import { GHOGHA_48_VILLAGES, NOTEBOOK_WOMEN_SCHEMES } from "@/lib/master-hierarchy";

export interface VillageSchemeAssignment {
  schemeId: string;
  schemeNameGu: string;
  schemeNameEn: string;
  beneficiaries: number;
  grantLakhs: number;
}

/**
 * Illustrative scheme participation fixtures for the Ghogha prototype only.
 * The village and scheme hierarchy is useful for UI demonstration, but these
 * derived counts and financial splits are not official government records.
 */
export const GHOGHA_VILLAGE_SCHEME_DEMO: Record<string, VillageSchemeAssignment[]> =
  Object.fromEntries(
    GHOGHA_48_VILLAGES.map((village, villageIndex) => {
      const selectedSchemeIndexes = [
        villageIndex % NOTEBOOK_WOMEN_SCHEMES.length,
        (villageIndex + 2) % NOTEBOOK_WOMEN_SCHEMES.length,
        (villageIndex + 4) % NOTEBOOK_WOMEN_SCHEMES.length,
      ];
      const schemeIndexes = [...new Set(selectedSchemeIndexes)];

      return [
        village.code,
        schemeIndexes.map((schemeIndex, assignmentIndex) => {
          const scheme = NOTEBOOK_WOMEN_SCHEMES[schemeIndex];
          const share = assignmentIndex === 0 ? 0.45 : assignmentIndex === 1 ? 0.35 : 0.2;
          return {
            schemeId: scheme.id,
            schemeNameGu: scheme.nameGu,
            schemeNameEn: scheme.nameEn,
            beneficiaries: Math.max(8, Math.round(village.beneficiaries * share)),
            grantLakhs: Number((village.disbursedLakhs * share).toFixed(1)),
          };
        }),
      ];
    }),
  );

/** Only villages with an explicit demo record return scheme coverage. */
export function getVillageSchemes(villageCode: string): VillageSchemeAssignment[] {
  return GHOGHA_VILLAGE_SCHEME_DEMO[villageCode] ?? [];
}

export function isSchemeActiveInVillage(villageCode: string, schemeId: string): boolean {
  if (schemeId === "all") return true;
  return getVillageSchemes(villageCode).some((scheme) => scheme.schemeId === schemeId);
}

/**
 * Scheme totals are participation counts, not deduplicated people: one person
 * can appear in more than one scheme. The caller must keep the demo label.
 */
export function getVillageSchemeSummary(villageCode: string): {
  schemesShown: number;
  totalSchemeEnrollments: number;
  totalGrantLakhs: number;
  schemes: VillageSchemeAssignment[];
} {
  const schemes = getVillageSchemes(villageCode);
  return {
    schemesShown: schemes.length,
    totalSchemeEnrollments: schemes.reduce((sum, scheme) => sum + scheme.beneficiaries, 0),
    totalGrantLakhs: Number(schemes.reduce((sum, scheme) => sum + scheme.grantLakhs, 0).toFixed(1)),
    schemes,
  };
}
