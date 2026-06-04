/**
 * Render Remotion scenes from a workflow matrix.
 * Usage:
 *   node scripts/render-scenes.mjs --scene=01 --quality=draft
 *   node scripts/render-scenes.mjs --scene=all --quality=standard
 */

import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { execSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const args = process.argv.slice(2);
const getArg = (name) => {
  const a = args.find((x) => x.startsWith(`--${name}=`));
  return a ? a.split("=").slice(1).join("=") : null;
};

const sceneArg = getArg("scene") || "all";
const qualityArg = getArg("quality") || "draft";

const SCENES = {
  "01": { id: "Intro", file: "01-hook" },
  "02": { id: "ThePrompt", file: "02-setup" },
  "03": { id: "MiniMax", file: "03-minimax" },
  "04": { id: "DeepSeek", file: "04-deepseek" },
  "05": { id: "BigPickle", file: "05-bigpickle" },
  "06": { id: "MiMo", file: "06-mimo" },
  "07": { id: "Gemma", file: "07-gemma" },
  "08": { id: "NemotronSuper", file: "08-nemotron-super" },
  "09": { id: "NemotronNano", file: "09-nemotron-nano" },
  "10": { id: "Leaderboard", file: "10-leaderboard" },
  "11": { id: "Verdict", file: "11-verdict" },
  "12": { id: "Outro", file: "12-outro" },
};

const sceneList =
  sceneArg === "all" ? Object.keys(SCENES) : sceneArg.split(",").map((s) => s.trim().padStart(2, "0"));

const quality = qualityArg === "standard" ? { crf: 18, pixelFormat: "yuv420p" } : { crf: 28, pixelFormat: "yuv420p" };

const outDir = path.resolve("renders");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

console.log("→ Bundling Remotion project...");
const bundleLocation = await bundle({
  entryPoint: path.resolve("src/index.ts"),
  webpackConfig: undefined,
});

for (const sceneNum of sceneList) {
  const scene = SCENES[sceneNum];
  if (!scene) {
    console.warn(`Skipping unknown scene: ${sceneNum}`);
    continue;
  }

  console.log(`→ Selecting composition: ${scene.id}`);
  const comp = await selectComposition({
    serveUrl: bundleLocation,
    id: scene.id,
  });

  const outFile = path.join(outDir, `${scene.file}.mp4`);

  console.log(`→ Rendering scene ${sceneNum} (${scene.id}) → ${outFile}`);
  await renderMedia({
    composition: comp,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: outFile,
    ...quality,
    concurrency: 1,
    onProgress: ({ progress }) => {
      process.stdout.write(`   ${sceneNum} progress: ${(progress * 100).toFixed(1)}%\r`);
    },
  });
  console.log(`\n✓ Done: ${outFile}`);
}

console.log("\nAll scenes rendered to ./renders/");
