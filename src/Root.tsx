import "./global.css";
import React from "react";
import { Composition, CalculateMetadataFunction } from "remotion";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { FPS } from "./compositions/utils";
import { MODELS } from "./compositions/data";
import type { Word } from "./compositions/useWordSync";

import { Intro } from "./compositions/Intro";
import { ThePrompt } from "./compositions/ThePrompt";
import { ModelReveal } from "./compositions/ModelReveal";
import { Leaderboard } from "./compositions/Leaderboard";
import { Verdict } from "./compositions/Verdict";
import { Outro } from "./compositions/Outro";

type WordData = {
  audio_file: string;
  total_words: number;
  transcript: Word[];
};

const loadWords = (audio: string): WordData | null => {
  const baseName = audio.replace(/^audio\//, "").replace(/\.mp3$/, "");
  const jsonPath = join("public", "audio-json", `${baseName}.json`);
  if (!existsSync(jsonPath)) return null;
  const raw = readFileSync(jsonPath, "utf-8");
  return JSON.parse(raw) as WordData;
};

const compositionConfigs = [
  { id: "Intro", component: Intro, audio: "audio/intro.mp3", base: 30 },
  { id: "ThePrompt", component: ThePrompt, audio: "audio/the-prompt.mp3", base: 34 },
  { id: "MiniMax", component: ModelReveal, audio: "audio/minimax.mp3", base: 30, model: MODELS[0] },
  { id: "DeepSeek", component: ModelReveal, audio: "audio/deepseek.mp3", base: 26, model: MODELS[1] },
  { id: "BigPickle", component: ModelReveal, audio: "audio/bigpickle.mp3", base: 30, model: MODELS[2] },
  { id: "MiMo", component: ModelReveal, audio: "audio/mimo.mp3", base: 30, model: MODELS[3] },
  { id: "Gemma", component: ModelReveal, audio: "audio/gemma.mp3", base: 25, model: MODELS[4] },
  { id: "NemotronSuper", component: ModelReveal, audio: "audio/nemotron-super.mp3", base: 32, model: MODELS[5] },
  { id: "NemotronNano", component: ModelReveal, audio: "audio/nemotron-nano.mp3", base: 44, model: MODELS[6] },
  { id: "Leaderboard", component: Leaderboard, audio: "audio/leaderboard.mp3", base: 39 },
  { id: "Verdict", component: Verdict, audio: "audio/verdict.mp3", base: 41 },
  { id: "Outro", component: Outro, audio: "audio/outro.mp3", base: 20 },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {compositionConfigs.map((cfg) => {
        const baseProps = cfg.model
          ? { data: cfg.model, audioFile: cfg.audio }
          : {};
        return (
          <Composition
            key={cfg.id}
            id={cfg.id}
            component={cfg.component as React.FC<any>}
            durationInFrames={cfg.base * FPS}
            fps={FPS}
            width={1920}
            height={1080}
            defaultProps={baseProps}
            calculateMetadata={makeMeta(cfg.audio, baseProps)}
          />
        );
      })}
    </>
  );
};

function makeMeta(
  audio: string,
  baseProps: Record<string, unknown>,
): CalculateMetadataFunction<any> {
  return async () => {
    const data = loadWords(audio);
    const audioSec = data
      ? data.transcript[data.transcript.length - 1].end_time
      : 0;
    const durationInFrames = Math.max(
      12 * FPS,
      Math.ceil(audioSec * FPS) + 6,
    );
    return {
      durationInFrames,
      fps: FPS,
      width: 1920,
      height: 1080,
      props: {
        ...baseProps,
        words: data?.transcript ?? [],
      },
    };
  };
}
