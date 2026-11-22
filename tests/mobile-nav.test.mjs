import test from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";

test("Issue #16: Mobile nav shows a short label under ACTIVE icon and preserves aria-label", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto("http://localhost:3000/#dashboard", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    const activeItem = await page.$(".spatial-dock-item.active");
    assert.ok(activeItem, "Active dock item must exist");

    const ariaLabel = await activeItem.getAttribute("aria-label");
    assert.ok(ariaLabel && ariaLabel.trim().length > 0, "Active item must have aria-label");

    const activeLabel = await activeItem.$(".spatial-dock-label");
    assert.ok(activeLabel, "Active label element must exist");

    const text = await activeLabel.textContent();
    assert.ok(text && text.trim().length > 0, `Short label text must exist, got: ${text}`);

    const isVisible = await activeLabel.isVisible();
    assert.strictEqual(isVisible, true, "Active item label must be visible under the active icon on mobile 390px");
    console.log("Mobile active nav label verified:", text.trim(), "with aria-label:", ariaLabel);
  } finally {
    await browser.close();
  }
});
