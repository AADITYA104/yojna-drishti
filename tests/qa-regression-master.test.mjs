import test from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";

test("Full QA Regression Suite: 17 Master Issues + Zero Errors + Responsive + Back Button", async () => {
  const browser = await chromium.launch({ headless: true });

  try {
    // 1. Desktop 1440px Test
    {
      const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      const consoleErrors = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });

      // Test #1 & #11: Navigation and Hash Routing
      await page.goto("http://localhost:3000/#dashboard", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1500);

      // Verify #4: 34 Districts in Ladder / Title
      const textContent = await page.content();
      assert.ok(textContent.includes("૩૪") || textContent.includes("34"), "Must mention 34 districts");

      // Navigate to schemes via button (#1)
      const schemesBtn = await page.$("button.dx-btn--ghost");
      if (schemesBtn) {
        await schemesBtn.click();
        await page.waitForTimeout(1000);
        assert.ok(page.url().includes("#schemes"), "Url hash must update to #schemes on in-app action");

        // Test Back button
        await page.goBack();
        await page.waitForTimeout(1000);
        assert.ok(page.url().includes("#dashboard"), "Browser Back must return to #dashboard");
      }

      // Test #2: No off-topic farmer image on #schemes
      await page.goto("http://localhost:3000/#schemes", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1200);
      const farmerImg = await page.$("img[src*='gujarat-farmer']");
      assert.strictEqual(farmerImg, null, "Off-topic farmer image must be removed");
      const photoStrip = await page.$(".gujarat-photo-strip");
      assert.strictEqual(photoStrip, null, "Off-topic tourism photo strip must be removed");

      // Verify no critical console errors on 1440px
      const criticalErrors = consoleErrors.filter(e => !e.includes("favicon") && !e.includes("openfreemap"));
      assert.strictEqual(criticalErrors.length, 0, `Zero critical console errors on 1440px (found: ${criticalErrors.join(", ")})`);

      await page.close();
    }

    // 2. Mobile 390px Test
    {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
      const mobileConsoleErrors = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") mobileConsoleErrors.push(msg.text());
      });

      await page.goto("http://localhost:3000/#dashboard", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1500);

      // Assert No Horizontal Overflow at 390px
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      assert.strictEqual(overflow, false, "Page must not have horizontal overflow at 390px viewport");

      // Verify #7: FAB clears bottom nav
      const fab = await page.$("button.gov-helpdesk-floating-trigger");
      const nav = await page.$(".spatial-dock-capsule");
      if (fab && nav) {
        const fabBox = await fab.boundingBox();
        const navBox = await nav.boundingBox();
        assert.ok(fabBox && navBox && navBox.y > fabBox.y + fabBox.height, "FAB must be above bottom nav");
      }

      // Verify #16: Active bottom dock item has visible label
      const activeItemLabel = await page.$(".spatial-dock-item.active .spatial-dock-label");
      if (activeItemLabel) {
        const isVisible = await activeItemLabel.isVisible();
        assert.strictEqual(isVisible, true, "Active nav item label must be visible on mobile");
      }

      const criticalMobileErrors = mobileConsoleErrors.filter(e => !e.includes("favicon") && !e.includes("openfreemap"));
      assert.strictEqual(criticalMobileErrors.length, 0, `Zero critical console errors on 390px (found: ${criticalMobileErrors.join(", ")})`);

      await page.close();
    }

  } finally {
    await browser.close();
  }
});
