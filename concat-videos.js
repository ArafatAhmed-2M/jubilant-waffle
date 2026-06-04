#!/usr/bin/env node
/**
 * Download a static ffmpeg.exe to ./ffmpeg.exe (no admin required).
 * Then concatenate the 12 scene MP4s.
 *
 * Usage:  node concat-videos.js
 */

import { existsSync, statSync, mkdirSync, rmSync, createWriteStream, unlinkSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import { execSync, spawn } from "node:child_process";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import path from "node:path";
import https from "node:https";
import os from "node:os";

const INPUT_DIR = path.resolve("output");
const OUTPUT = path.resolve("final-video.mp4");
const FFMPEG_DIR = path.resolve(".ffmpeg-tmp");
const FFMPEG_EXE = path.join(FFMPEG_DIR, "ffmpeg.exe");
const LIST_FILE = path.resolve("list.txt");

const SCENES = [
  "01-hook", "02-setup", "03-minimax", "04-deepseek", "05-bigpickle",
  "06-mimo", "07-gemma", "08-nemotron-super", "09-nemotron-nano",
  "10-leaderboard", "11-verdict", "12-outro",
];

// Small, static ffmpeg build from BtbN (essentials ~30MB)
const FFMPEG_URL = "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip";

function log(msg) { console.log(msg); }
function err(msg) { console.error(msg); }

function hasFfmpeg() {
  try { execSync("ffmpeg -version", { stdio: "ignore" }); return true; } catch { return false; }
}

async function getFfmpegStatic() {
  try {
    const mod = await import("ffmpeg-static");
    if (mod.default && existsSync(mod.default)) return mod.default;
  } catch {}
  return null;
}

async function downloadFile(url, dest) {
  log(`→ Downloading ${path.basename(dest)}...`);
  return new Promise((resolve, reject) => {
    const download = (url) => https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        download(res.headers.location);
        return;
      }
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
      const total = parseInt(res.headers["content-length"] || "0", 10);
      let received = 0;
      res.on("data", (chunk) => {
        received += chunk.length;
        if (total) process.stdout.write(`   ${(received / 1024 / 1024).toFixed(1)}/${(total / 1024 / 1024).toFixed(1)} MB\r`);
      });
      pipeline(res, createWriteStream(dest)).then(resolve).catch(reject);
    }).on("error", reject);
    download(url);
  });
}

async function installFfmpeg() {
  if (existsSync(FFMPEG_EXE)) {
    log("✓ ffmpeg.exe already cached in .ffmpeg-tmp/");
    return;
  }
  mkdirSync(FFMPEG_DIR, { recursive: true });
  const zipPath = path.join(FFMPEG_DIR, "ffmpeg.zip");
  try {
    await downloadFile(FFMPEG_URL, zipPath);
    log("\n→ Extracting...");
    // Use PowerShell to expand the zip (built-in, no extra tools)
    execSync(`powershell -NoProfile -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${FFMPEG_DIR}\\extracted' -Force"`, { stdio: "inherit" });
    // Find the extracted ffmpeg.exe and move it
    const findExe = (dir) => {
      const entries = require("node:fs").readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) { const r = findExe(full); if (r) return r; }
        else if (e.name === "ffmpeg.exe") return full;
      }
      return null;
    };
    const found = findExe(path.join(FFMPEG_DIR, "extracted"));
    if (!found) throw new Error("ffmpeg.exe not found in zip");
    require("node:fs").renameSync(found, FFMPEG_EXE);
    rmSync(path.join(FFMPEG_DIR, "extracted"), { recursive: true, force: true });
    rmSync(zipPath);
    log(`✓ ffmpeg.exe ready at ${FFMPEG_EXE}`);
  } catch (e) {
    err(`✗ ffmpeg download failed: ${e.message}`);
    err("  Try running as admin: winget install --id=Gyan.FFmpeg -e --source winget --accept-package-agreements --accept-source-agreements");
    process.exit(1);
  }
}

function verifyInputs() {
  if (!existsSync(INPUT_DIR)) {
    err(`✗ Folder not found: ${INPUT_DIR}`);
    err(`  Move your 12 MP4 files into ${INPUT_DIR}/ and re-run.`);
    process.exit(1);
  }
  const missing = SCENES.filter((s) => !existsSync(path.join(INPUT_DIR, `${s}.mp4`)));
  if (missing.length) { err(`✗ Missing: ${missing.join(", ")}`); process.exit(1); }
  const totalBytes = SCENES.reduce((s, n) => s + statSync(path.join(INPUT_DIR, `${n}.mp4`)).size, 0);
  log(`✓ All 12 scenes present (${(totalBytes / 1024 / 1024).toFixed(1)} MB total)`);
}

function buildListFile() {
  const { writeFileSync } = require("node:fs");
  const lines = SCENES.map((s) => `file '${path.join(INPUT_DIR, `${s}.mp4`)}'`).join("\n");
  writeFileSync(LIST_FILE, lines);
}

function runFfmpeg(ffmpeg) {
  buildListFile();
  log("→ Concatenating 12 scenes (stream copy, no re-encode)...");
  const args = ["-y", "-f", "concat", "-safe", "0", "-i", LIST_FILE, "-c", "copy", OUTPUT];
  const r = spawnSync(ffmpeg, args, { stdio: "inherit" });
  try { unlinkSync(LIST_FILE); } catch {}
  if (r.status !== 0) { err("✗ ffmpeg concat failed"); process.exit(1); }
  const size = statSync(OUTPUT).size;
  log(`\n✓ Done: ${OUTPUT} (${(size / 1024 / 1024).toFixed(1)} MB)`);
}

function spawnSync(cmd, args, opts) {
  const r = require("node:child_process").spawnSync(cmd, args, opts);
  return r;
}

(async () => {
  log("=== Concat 12 scene MP4s ===\n");
  verifyInputs();
  let ffmpeg = "ffmpeg";
  if (hasFfmpeg()) {
    log("✓ ffmpeg found on PATH");
  } else {
    const staticPath = await getFfmpegStatic();
    if (staticPath) {
      log(`✓ ffmpeg-static ready (${(statSync(staticPath).size / 1024 / 1024).toFixed(1)} MB)`);
      ffmpeg = staticPath;
    } else {
      log("→ ffmpeg missing. Downloading static build...");
      await installFfmpeg();
      ffmpeg = FFMPEG_EXE;
    }
  }
  runFfmpeg(ffmpeg);
})();
