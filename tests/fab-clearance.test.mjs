import test from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";

test("Issue #7: Mobile 390px FAB clears bottom nav and does not cover hero ladder stats", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto("http://localhost:3000/#dashboard", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    const fab = await page.$("button.gov-helpdesk-floating-trigger");
    assert.ok(fab, "FAB trigger button should exist");
    const fabBox = await fab.boundingBox();
    assert.ok(fabBox, "FAB bounding box must exist");

    const nav = await page.$(".spatial-dock-capsule");
    assert.ok(nav, "Bottom nav capsule should exist");
    const navBox = await nav.boundingBox();
    assert.ok(navBox, "Nav bounding box must exist");

    // Vertical gap between FAB bottom and Nav top must be > 0 (clearing nav)
    const verticalGap = navBox.y - (fabBox.y + fabBox.height);
    assert.ok(verticalGap > 0, `FAB bottom must be strictly above Nav capsule (gap: ${verticalGap}px)`);

    // Verify hero ladder stats don't overlap horizontally/vertically with the FAB
    const steps = await page.$$(".dx-step");
    for (let i = 0; i < steps.length; i++) {
      const stepBox = await steps[i].boundingBox();
      if (!stepBox) continue;
      const xOverlap = Math.max(0, Math.min(fabBox.x + fabBox.width, stepBox.x + stepBox.width) - Math.max(fabBox.x, stepBox.x));
      const yOverlap = Math.max(0, Math.min(fabBox.y + fabBox.height, stepBox.y + stepBox.height) - Math.max(fabBox.y, stepBox.y));
      const overlap = xOverlap > 0 && yOverlap > 0;
      assert.strictEqual(overlap, false, `Ladder step ${i} must not overlap with assistant FAB`);
    }
  } finally {
    await browser.close();
  }
});
