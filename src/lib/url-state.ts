import { MASTER_DISTRICTS, MASTER_SUBDISTRICTS } from "./master-hierarchy.ts";

export interface AreaSelectionState {
  districtId: string;
  talukaCode: number | null;
  villageCode: string | null;
  areaType?: "rural" | "urban" | null;
}

export interface WizardProgressState {
  step: number;
  lifeStage: string;
  incomeGroup: string;
  selectedDistrict: string;
  selectedCategory: string;
}

export function validateAreaParams(raw: {
  district?: string | null;
  taluka?: string | null;
  village?: string | null;
  area_type?: string | null;
}): AreaSelectionState {
  let validDistrict = "bhavnagar";
  let validTaluka: number | null = null;
  let validVillage: string | null = null;
  let validAreaType: "rural" | "urban" | null = null;

  if (raw.district) {
    const dLower = raw.district.trim().toLowerCase();
    const found = MASTER_DISTRICTS.find(
      (d) =>
        d.id.toLowerCase() === dLower ||
        String(d.code) === raw.district ||
        d.nameEn.toLowerCase() === dLower
    );
    if (found) validDistrict = found.id;
  }

  if (raw.taluka) {
    const tCode = Number(raw.taluka);
    if (Number.isFinite(tCode)) {
      const foundSub = MASTER_SUBDISTRICTS.find((s) => s.code === tCode);
      if (foundSub) {
        validTaluka = foundSub.code;
        // ensure district matches taluka if not already valid
        const parentD = MASTER_DISTRICTS.find((d) => d.code === foundSub.districtCode);
        if (parentD) validDistrict = parentD.id;
      }
    }
  }

  if (raw.village && typeof raw.village === "string") {
    const cleaned = raw.village.trim();
    if (/^[a-zA-Z0-9_-]+$/.test(cleaned)) {
      validVillage = cleaned;
    }
  }

  if (raw.area_type === "rural" || raw.area_type === "urban") {
    validAreaType = raw.area_type;
  }

  return {
    districtId: validDistrict,
    talukaCode: validTaluka,
    villageCode: validVillage,
    areaType: validAreaType,
  };
}

export function validateWizardParams(raw: {
  step?: string | number | null;
  lifeStage?: string | null;
  incomeGroup?: string | null;
  district?: string | null;
  category?: string | null;
}): WizardProgressState {
  let step = 1;
  if (raw.step) {
    const num = Number(raw.step);
    if (Number.isFinite(num) && num >= 1 && num <= 5) {
      step = num;
    }
  }

  const lifeStage = typeof raw.lifeStage === "string" && raw.lifeStage.trim() ? raw.lifeStage.trim() : "all";
  const incomeGroup = typeof raw.incomeGroup === "string" && raw.incomeGroup.trim() ? raw.incomeGroup.trim() : "all";

  let selectedDistrict = "bhavnagar";
  if (raw.district) {
    const dLower = raw.district.trim().toLowerCase();
    const found = MASTER_DISTRICTS.find(
      (d) =>
        d.id.toLowerCase() === dLower ||
        String(d.code) === raw.district ||
        d.nameEn.toLowerCase() === dLower
    );
    if (found) selectedDistrict = found.id;
  }

  const selectedCategory = typeof raw.category === "string" && raw.category.trim() ? raw.category.trim() : "all";

  return {
    step,
    lifeStage,
    incomeGroup,
    selectedDistrict,
    selectedCategory,
  };
}

export function readAreaFromStorage(): AreaSelectionState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("yd_area_selection");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return validateAreaParams({
      district: parsed.districtId,
      taluka: parsed.talukaCode ? String(parsed.talukaCode) : null,
      village: parsed.villageCode,
      area_type: parsed.areaType,
    });
  } catch {
    return null;
  }
}

export function saveAreaToStorage(state: AreaSelectionState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("yd_area_selection", JSON.stringify(state));
  } catch {
    /* private mode fallback */
  }
}

export function readWizardFromStorage(): WizardProgressState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("yd_wizard_progress");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return validateWizardParams({
      step: parsed.step,
      lifeStage: parsed.lifeStage,
      incomeGroup: parsed.incomeGroup,
      district: parsed.selectedDistrict,
      category: parsed.selectedCategory,
    });
  } catch {
    return null;
  }
}

export function saveWizardToStorage(state: WizardProgressState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("yd_wizard_progress", JSON.stringify(state));
  } catch {
    /* private mode fallback */
  }
}

export function syncUrlParams(updates: Record<string, string | null | undefined>): void {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, value);
      }
    });
    window.history.replaceState(null, "", url.toString());
  } catch {
    /* no-op */
  }
}
