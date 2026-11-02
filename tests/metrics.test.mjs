import test from "node:test";
import assert from "node:assert/strict";
import { approvalPercent, scaleDemoValue } from "../src/lib/metrics.mjs";

test("approval percentage rounds to the nearest whole percent", () => {
  assert.equal(approvalPercent(2, 3), 67);
});

test("approval percentage returns null when the denominator is unavailable", () => {
  assert.equal(approvalPercent(0, 0), null);
  assert.equal(approvalPercent(null, 10), null);
});

test("approval percentage rejects inconsistent counts", () => {
  assert.equal(approvalPercent(11, 10), null);
  assert.equal(approvalPercent(-1, 10), null);
});

test("demo financial years have stable, deterministic values", () => {
  assert.equal(scaleDemoValue(100, "2025–26"), 100);
  assert.equal(scaleDemoValue(100, "2024–25"), 88);
  assert.equal(scaleDemoValue(100, "2023–24"), 75);
});
