import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = "C:/Users/devmu/.gemini/antigravity/brain/248f250e-68cc-4725-9f89-764b35f67533/screenshots/after";
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const workspaces = [
  { key: "dashboard", hash: "#dashboard" },
  { key: "schemes", hash: "#schemes" },
  { key: "map", hash: "#map" },
  { key: "wizard", hash: "#wizard" },
  { key: "saved", hash: "#saved" },
  { key: "settings", hash: "#settings" },
];

const viewports = [
  { name: "1440", width: 1440, height: 900 },
  { name: "390", width: 390, height: 844 },
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    for (const ws of workspaces) {
      const url = `http://localhost:3000/${ws.hash}`;
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2000);
      const filename = `after_${ws.key}_${vp.name}.png`;
      const filepath = path.join(outDir, filename);
      await page.screenshot({ path: filepath, fullPage: false });
      console.log(`Saved: ${filepath}`);
    }
    await page.close();
  }
  await browser.close();
  console.log("All AFTER screenshots captured successfully!");
}

main().catch(console.error);
