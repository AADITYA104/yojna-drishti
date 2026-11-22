import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  MASTER_DISTRICTS,
  TOTAL_DISTRICTS_COUNT,
  TOTAL_DISTRICTS_GU,
  TOTAL_DISTRICTS_HI,
  TOTAL_DISTRICTS_EN,
} from "../src/lib/master-hierarchy.ts";

test("district master hierarchy has exactly 34 districts including Vav-Tharad", () => {
  assert.equal(MASTER_DISTRICTS.length, 34);
  assert.equal(TOTAL_DISTRICTS_COUNT, 34);
  assert.equal(TOTAL_DISTRICTS_GU, "૩૪");
  assert.equal(TOTAL_DISTRICTS_HI, "३४");
  assert.equal(TOTAL_DISTRICTS_EN, "34");

  const vavTharad = MASTER_DISTRICTS.find((d) => d.id === "vav_tharad" || d.nameEn === "Vav-Tharad");
  assert.ok(vavTharad, "Vav-Tharad must be present in MASTER_DISTRICTS");
});

test("source code enforces single source of truth for 34 districts with no rogue 33 district labels", () => {
  const srcDir = path.join(process.cwd(), "src");
  const filesToScan = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (/\.(tsx|ts)$/.test(entry.name)) {
        filesToScan.push(fullPath);
      }
    }
  }

  walk(srcDir);

  const roguePatterns = [
    /૩૩\s*જિલ્લા/,
    /33\s*districts/i,
    /33\s*district\s*map/i,
    /33\s*जिले/i,
  ];

  const violations = [];

  for (const file of filesToScan) {
    const content = fs.readFileSync(file, "utf8");
    for (const pattern of roguePatterns) {
      if (pattern.test(content)) {
        violations.push({ file: path.relative(process.cwd(), file), pattern: String(pattern) });
      }
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Found conflicting 33 district references in code: ${JSON.stringify(violations, null, 2)}`
  );
});
