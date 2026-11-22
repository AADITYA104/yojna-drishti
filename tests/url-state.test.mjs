import test from "node:test";
import assert from "node:assert/strict";
import { validateAreaParams, validateWizardParams } from "../src/lib/url-state.ts";

test("validateAreaParams accepts valid district, taluka, and village", () => {
  const result = validateAreaParams({
    district: "bhavnagar",
    taluka: "3784", // Bavla
    village: "516330",
    area_type: "rural",
  });

  assert.equal(result.districtId, "ahmedabad"); // derived from subdistrict 3784 (Bavla in Ahmedabad)
  assert.equal(result.talukaCode, 3784);
  assert.equal(result.villageCode, "516330");
  assert.equal(result.areaType, "rural");
});

test("validateAreaParams safely discards invalid inputs and falls back to defaults", () => {
  const result = validateAreaParams({
    district: "non_existent_district_xyz",
    taluka: "not_a_number",
    village: "invalid village with spaces!",
    area_type: "invalid_type",
  });

  assert.equal(result.districtId, "bhavnagar");
  assert.equal(result.talukaCode, null);
  assert.equal(result.villageCode, null);
  assert.equal(result.areaType, null);
});

test("validateWizardParams clamps step and validates district", () => {
  const valid = validateWizardParams({
    step: "3",
    lifeStage: "student",
    incomeGroup: "bpl",
    district: "surat",
    category: "education",
  });

  assert.equal(valid.step, 3);
  assert.equal(valid.lifeStage, "student");
  assert.equal(valid.incomeGroup, "bpl");
  assert.equal(valid.selectedDistrict, "surat");
  assert.equal(valid.selectedCategory, "education");

  const invalid = validateWizardParams({
    step: "99",
    district: "invalid_dist",
  });

  assert.equal(invalid.step, 1);
  assert.equal(invalid.selectedDistrict, "bhavnagar");
});
