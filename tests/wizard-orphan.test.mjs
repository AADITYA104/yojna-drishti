import test from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";

test("Issue #15: Wizard category grid makes last orphan card span full width", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto("http://localhost:3000/#wizard", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    const grid = await page.$(".wizard-options-grid");
    assert.ok(grid, "Wizard options grid must exist");
    const gridBox = await grid.boundingBox();
    assert.ok(gridBox, "Grid bounding box must exist");

    const buttons = await page.$$(".wizard-options-grid > .wizard-opt-btn");
    assert.strictEqual(buttons.length, 5, "Step 1 should have 5 options");

    const lastButton = buttons[4];
    const lastBox = await lastButton.boundingBox();
    assert.ok(lastBox, "Last button bounding box must exist");

    // The orphan card spans full width, so its width should match the grid width (within 4px)
    console.log("Grid width:", gridBox.width, "Last button width:", lastBox.width);
    assert.ok(
      Math.abs(lastBox.width - gridBox.width) <= 4,
      `Last button width (${lastBox.width}) should span full grid width (${gridBox.width})`
    );
  } finally {
    await browser.close();
  }
});
