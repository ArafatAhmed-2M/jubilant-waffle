#!/usr/bin/env node
/**
 * Screenshot each AI-generated HTML file using puppeteer-core
 * driven by the chromium bundled with @remotion/renderer.
 *
 * Output: public/screenshots/{model-id}.png  (1280x720)
 *
 * Usage:  node scripts/take-screenshots.mjs
 */

import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync, createReadStream, readdirSync } from "node:fs";
import path from "node:path";
import http from "node:http";
import os from "node:os";

function findChrome() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    path.join(process.env.LOCALAPPDATA || "", "Google", "Chrome", "Application", "chrome.exe"),
    path.join(os.homedir(), "AppData", "Local", "ms-playwright", "chromium-1223", "chrome-win64", "chrome.exe"),
    path.join(os.homedir(), "AppData", "Local", "ms-playwright"),
  ];
  for (const c of candidates) {
    if (c && existsSync(c) && c.endsWith("chrome.exe")) return c;
  }
  // Scan playwright dir
  const playwrightDir = path.join(os.homedir(), "AppData", "Local", "ms-playwright");
  if (existsSync(playwrightDir)) {
    const { readdirSync, statSync } = require("node:fs");
    for (const folder of readdirSync(playwrightDir)) {
      const full = path.join(playwrightDir, folder, "chrome-win64", "chrome.exe");
      if (existsSync(full)) return full;
    }
  }
  return null;
}

const ASSETS_DIR = path.resolve("..", "assets", "results-html");
const OUT_DIR = path.resolve("public", "screenshots");
const PORT = 5174;

const MODELS = [
  { id: "minimax", file: "minimax.html" },
  { id: "deepseek", file: "deepseek-flash.html" },
  { id: "bigpickle", file: "bigpickle.html" },
  { id: "mimo", file: "mimo.html" },
  { id: "gemma", file: "gemma.html" },
  { id: "nemotron-super", file: "nemotron.html" },
  { id: "nemotron-nano", file: "nemotron-nano.html" },
];

// Static file server
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      const filePath = path.join(ASSETS_DIR, urlPath === "/" ? "/minimax.html" : urlPath);
      if (!filePath.startsWith(ASSETS_DIR)) { res.writeHead(403); res.end(); return; }
      if (!existsSync(filePath)) { res.writeHead(404); res.end("404"); return; }
      const ext = path.extname(filePath).toLowerCase();
      const mime = ext === ".html" ? "text/html; charset=utf-8" : "application/octet-stream";
      res.writeHead(200, { "Content-Type": mime, "Cache-Control": "no-store" });
      createReadStream(filePath).pipe(res);
    });
    server.listen(PORT, "127.0.0.1", () => resolve(server));
  });
}

(async () => {
  console.log("→ Locating chromium...");
  const chromePath = findChrome();
  if (!chromePath) {
    console.error("✗ No Chrome found.");
    console.error("  Install one of:");
    console.error("    - Google Chrome (https://google.com/chrome)");
    console.error("    - Playwright (npx playwright install chromium)");
    process.exit(1);
  }
  console.log("  Using:", chromePath);

  console.log("→ Starting local server on port", PORT);
  const server = await startServer();

  console.log("→ Launching browser...");
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  for (const model of MODELS) {
    const url = `http://localhost:${PORT}/${model.file}`;
    const outPath = path.join(OUT_DIR, `${model.id}.png`);
    console.log(`→ ${model.id}: ${url}`);

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
    try {
      await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
    } catch (e) {
      console.log(`  ! networkidle timed out, falling back to load`);
      await page.goto(url, { waitUntil: "load", timeout: 30000 });
    }
    await new Promise((r) => setTimeout(r, 1500));

    await page.screenshot({ path: outPath, fullPage: false, type: "png" });
    console.log(`  ✓ ${outPath}`);
    await page.close();
  }

  await browser.close();
  server.close();
  console.log("\n✓ All screenshots saved to", OUT_DIR);
})().catch((e) => {
  console.error("✗", e.message);
  process.exit(1);
});
