import test from "node:test";
import assert from "node:assert/strict";
import { smartAreaInspectorCopy } from "../src/lib/inspector-i18n.ts";

test("SmartAreaInspector i18n has no missing keys in en and hi compared to gu", () => {
  const guCopy = smartAreaInspectorCopy.gu;
  const hiCopy = smartAreaInspectorCopy.hi;
  const enCopy = smartAreaInspectorCopy.en;

  assert.ok(guCopy, "gu copy must be defined");
  assert.ok(hiCopy, "hi copy must be defined");
  assert.ok(enCopy, "en copy must be defined");

  function assertAllKeysPresent(source, target, langName, path = "") {
    for (const [key, val] of Object.entries(source)) {
      const currentPath = path ? `${path}.${key}` : key;
      assert.ok(
        key in target,
        `Missing key "${currentPath}" in ${langName} translations`
      );

      if (typeof val === "object" && val !== null) {
        assert.equal(typeof target[key], "object", `Expected ${currentPath} to be an object in ${langName}`);
        assertAllKeysPresent(val, target[key], langName, currentPath);
      } else {
        assert.equal(typeof target[key], "string", `Expected ${currentPath} to be a string in ${langName}`);
        assert.ok(target[key].trim().length > 0, `Key "${currentPath}" in ${langName} must not be empty`);
      }
    }
  }

  assertAllKeysPresent(guCopy, hiCopy, "Hindi (hi)");
  assertAllKeysPresent(guCopy, enCopy, "English (en)");
});

test("SmartAreaInspector specifically includes the 5 QA reported keys", () => {
  const requiredKeys = [
    "hundredPercentAvailability",
    "syntheticDemoRows",
    "approvedOrDelivered",
    "femaleBeneficiaryRatio",
    "schemeDeepDiveNote",
  ];

  for (const lang of ["gu", "hi", "en"]) {
    const dict = smartAreaInspectorCopy[lang];
    for (const key of requiredKeys) {
      assert.ok(key in dict, `Required QA key "${key}" missing in ${lang}`);
      assert.ok(dict[key].trim().length > 0, `Required QA key "${key}" in ${lang} cannot be empty`);
    }
  }

  // Value checks
  assert.equal(smartAreaInspectorCopy.gu.hundredPercentAvailability, "૧૦૦% ઉપલબ્ધતા");
  assert.equal(smartAreaInspectorCopy.en.hundredPercentAvailability, "100% Availability");
  assert.equal(smartAreaInspectorCopy.hi.hundredPercentAvailability, "१००% उपलब्धता");

  assert.equal(smartAreaInspectorCopy.gu.syntheticDemoRows, "કૃત્રિમ ડેમો પંક્તિઓ");
  assert.equal(smartAreaInspectorCopy.en.syntheticDemoRows, "Synthetic Demo Rows");
  assert.equal(smartAreaInspectorCopy.hi.syntheticDemoRows, "कृत्रिम नमूना पंक्तियाँ");

  assert.equal(smartAreaInspectorCopy.gu.approvedOrDelivered, "મંજૂર અથવા સેવા અપાઈ");
  assert.equal(smartAreaInspectorCopy.en.approvedOrDelivered, "Approved or Service Delivered");
  assert.equal(smartAreaInspectorCopy.hi.approvedOrDelivered, "स्वीकृत या सेवा दी गई");
});
