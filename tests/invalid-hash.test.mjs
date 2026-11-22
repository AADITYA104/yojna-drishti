import test from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";

test("Issue #11: Invalid hash falls back to #dashboard and calls replaceState to clean URL", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto("http://localhost:3000/#completely_invalid_hash_xyz", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => window.location.hash === "#dashboard", { timeout: 10000 });

    const currentUrl = page.url();
    assert.ok(currentUrl.endsWith("#dashboard"), `URL must be cleaned to end with #dashboard, but was: ${currentUrl}`);

    const dashboardHero = await page.$(".dx-hero");
    assert.ok(dashboardHero, "Dashboard view should be rendered on invalid hash fallback");
  } finally {
    await browser.close();
  }
});
