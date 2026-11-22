import test from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";

test("Issue #8: Breadcrumb shows rural village as 4th crumb matching urban pattern", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto("http://localhost:3000/?district=bhavnagar&taluka=3855&village=516291#map", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2500);

    const breadcrumbs = await page.$(".geo-breadcrumbs");
    assert.ok(breadcrumbs, "Breadcrumbs container must exist");

    // Check for the 4th crumb
    const fourthCrumb = await page.$(".geo-current-crumb");
    assert.ok(fourthCrumb, "Rural village 4th crumb must exist");

    const text = await fourthCrumb.textContent();
    assert.ok(text && text.trim().length > 0, "4th crumb must have non-empty text");
    assert.ok(text.includes("અવાણિયા") || text.includes("Avaniya"), `Expected Gujarati or English village name, got: ${text}`);
    console.log("Rural village 4th crumb verified:", text.trim());
  } finally {
    await browser.close();
  }
});
