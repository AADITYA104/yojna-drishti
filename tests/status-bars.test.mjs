import test from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";

test("Issue #17: Status bars show percent label on wide segments and tooltips with aria-labels", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto("http://localhost:3000/#dashboard", { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".dx-bar:not(.dx-bar--single) > i", { state: "attached", timeout: 10000 });
    await page.locator("#dx-schemes").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const segments = await page.$$(".dx-bar:not(.dx-bar--single) > i");
    assert.ok(segments.length > 0, "Status bar segments must exist");

    let foundPercent = false;
    let foundTooltip = false;

    for (const seg of segments) {
      const title = await seg.getAttribute("title");
      const ariaLabel = await seg.getAttribute("aria-label");
      if (title && ariaLabel) {
        foundTooltip = true;
      }
      const pctEl = await seg.$(".dx-bar__pct");
      if (pctEl) {
        const text = await pctEl.textContent();
        if (text && text.includes("%")) {
          foundPercent = true;
        }
      }
    }

    assert.ok(foundTooltip, "Segments must carry interactive title and aria-label tooltips");
    assert.ok(foundPercent, "Wide segments must display percent label");
    console.log("Status bar segments verified with tooltips and percent labels.");
  } finally {
    await browser.close();
  }
});
