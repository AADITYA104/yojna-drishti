import test from "node:test";
import assert from "node:assert/strict";
import { classifySchemeReach } from "../src/lib/metrics.mjs";

test("classifySchemeReach returns unknown when rows array is empty or null", () => {
  assert.deepEqual(classifySchemeReach(null, "S01"), { status: "unknown", count: null });
  assert.deepEqual(classifySchemeReach([], "S01"), { status: "unknown", count: null });
  assert.deepEqual(classifySchemeReach(undefined, "S01"), { status: "unknown", count: null });
});

test("classifySchemeReach returns unknown when scheme has no matching rows", () => {
  const rows = [
    { Scheme_ID: "S02", Eligibility_Status: "Eligible", Application_or_Activity_Status: "Approved" },
  ];
  assert.deepEqual(classifySchemeReach(rows, "S01"), { status: "unknown", count: null });
});

test("classifySchemeReach returns not_reached with count 0 when no beneficiaries approved", () => {
  const rows = [
    { Scheme_ID: "S01", Eligibility_Status: "Not Eligible", Application_or_Activity_Status: "Rejected" },
    { Scheme_ID: "S01", Eligibility_Status: "Pending", Application_or_Activity_Status: "In Review" },
  ];
  assert.deepEqual(classifySchemeReach(rows, "S01"), { status: "not_reached", count: 0 });
});

test("classifySchemeReach returns reached with count when approved rows exist", () => {
  const rows = [
    { Scheme_ID: "S01", Eligibility_Status: "Eligible", Application_or_Activity_Status: "Approved" },
    { Scheme_ID: "S01", Eligibility_Status: "પાત્ર", Application_or_Activity_Status: "મંજૂર" },
    { Scheme_ID: "S01", Eligibility_Status: "Not Eligible", Application_or_Activity_Status: "Rejected" },
  ];
  assert.deepEqual(classifySchemeReach(rows, "S01"), { status: "reached", count: 2 });
});

test("unknown is strictly distinct from not_reached (0)", () => {
  const unknownResult = classifySchemeReach([], "S01");
  const notReachedResult = classifySchemeReach(
    [{ Scheme_ID: "S01", Eligibility_Status: "Ineligible", Application_or_Activity_Status: "None" }],
    "S01"
  );
  assert.notEqual(unknownResult.status, notReachedResult.status);
  assert.equal(unknownResult.count, null);
  assert.equal(notReachedResult.count, 0);
});
