// Screenshot helper for the visual-verification workflow described in CLAUDE.md.
// Usage: node screenshot.mjs <url> [label]
// Saves to ./temporary screenshots/screenshot-N[-label].png, never overwriting.
import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";

const url = process.argv[2];
const label = process.argv[3];

if (!url) {
  console.error("Usage: node screenshot.mjs <url> [label]");
  process.exit(1);
}

const outDir = path.join(process.cwd(), "temporary screenshots");
fs.mkdirSync(outDir, { recursive: true });

let n = 1;
const existing = fs.readdirSync(outDir).filter((f) => f.startsWith("screenshot-"));
if (existing.length > 0) {
  const nums = existing
    .map((f) => parseInt(f.match(/^screenshot-(\d+)/)?.[1] ?? "0", 10))
    .filter((x) => !Number.isNaN(x));
  n = (nums.length ? Math.max(...nums) : 0) + 1;
}

const fileName = `screenshot-${n}${label ? `-${label}` : ""}.png`;
const outPath = path.join(outDir, fileName);

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
// networkidle0 never resolves against Shopify's theme dev server — its
// hot-reload channel keeps a persistent connection open, so network
// activity never goes idle.
await page.goto(url, { waitUntil: "load", timeout: 30000 });
await new Promise((resolve) => setTimeout(resolve, 1000));
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Saved: ${outPath}`);
