import test from "node:test";
import assert from "node:assert/strict";
import { smartAreaInspectorCopy } from "../src/lib/inspector-i18n.ts";

test("Issue #10: S10 (BBBP) activity-based scheme label exists and has translations", () => {
  for (const lang of ["gu", "hi", "en"]) {
    const copy = smartAreaInspectorCopy[lang];
    assert.ok(copy.activityBasedScheme, `activityBasedScheme must exist for ${lang}`);
    assert.notStrictEqual(copy.activityBasedScheme.trim(), "");
    assert.ok(copy.statusLabels.activityRecorded, `statusLabels.activityRecorded must exist for ${lang}`);
  }
});
