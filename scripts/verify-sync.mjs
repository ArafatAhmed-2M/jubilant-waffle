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
  ];
  for (const c of candidates) {
    if (c && existsSync(c) && c.endsWith("chrome.exe")) return c;
  }
  return null;
}

const SCENES = [
  { id: "Verdict", frames: [120, 360, 600, 870, 1140] },
  { id: "Leaderboard", frames: [90, 240, 420, 600, 780] },
  { id: "MiniMax", frames: [30, 90, 240, 450, 660, 800] },
  { id: "Intro", frames: [10, 90, 240, 450, 720] },
  { id: "Outro", frames: [10, 90, 270, 420, 530] },
];

const OUT = path.join(process.cwd(), "verify-screenshots");
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

(async () => {
  const chrome = findChrome();
  if (!chrome) {
    console.error("No Chrome");
    process.exit(1);
  }
  console.log("Chrome:", chrome);
  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  for (const scene of SCENES) {
    const url = `http://localhost:3000/${scene.id}`;
    console.log(`\n→ ${scene.id}`);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 2000));
    for (const f of scene.frames) {
      const file = path.join(OUT, `${scene.id}-f${String(f).padStart(4, "0")}.png`);
      await page.evaluate((frame) => {
        const slider = document.querySelector('input[type="range"]');
        if (slider) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
          setter.call(slider, String(frame));
          slider.dispatchEvent(new Event("input", { bubbles: true }));
          slider.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }, f);
      await new Promise((r) => setTimeout(r, 600));
      await page.screenshot({ path: file, fullPage: false });
      console.log(`  ✓ ${path.basename(file)} (t=${(f / 30).toFixed(2)}s)`);
    }
  }

  await browser.close();
  console.log("\n✓ Done");
})();
