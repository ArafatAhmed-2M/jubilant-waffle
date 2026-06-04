import "./global.css";
import React from "react";
import { Composition, CalculateMetadataFunction } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { staticFile } from "remotion";

import { FPS } from "./compositions/utils";
import { MODELS } from "./compositions/data";

import { Intro } from "./compositions/Intro";
import { ThePrompt } from "./compositions/ThePrompt";
import { ModelReveal } from "./compositions/ModelReveal";
import { Leaderboard } from "./compositions/Leaderboard";
import { Verdict } from "./compositions/Verdict";
import { Outro } from "./compositions/Outro";

const BUFFER = 1.2;
const MIN_DURATION = 12;

async function getDurationInFrames(audioFile: string, baseDuration: number): Promise<number> {
  try {
    const seconds = await Promise.race([
      getAudioDurationInSeconds(staticFile(audioFile)),
      new Promise<number>((_, reject) => setTimeout(() => reject(new Error("audio timeout")), 2000)),
    ]);
    return Math.max(MIN_DURATION, Math.ceil(seconds * BUFFER), baseDuration) * FPS;
  } catch (e) {
    return baseDuration * FPS;
  }
}

const compositionConfigs = [
  { id: "Intro", component: Intro, audio: "audio/intro.mp3", base: 14 },
  { id: "ThePrompt", component: ThePrompt, audio: "audio/the-prompt.mp3", base: 22 },
  { id: "MiniMax", component: ModelReveal, audio: "audio/minimax.mp3", base: 28, model: MODELS[0] },
  { id: "DeepSeek", component: ModelReveal, audio: "audio/deepseek.mp3", base: 22, model: MODELS[1] },
  { id: "BigPickle", component: ModelReveal, audio: "audio/bigpickle.mp3", base: 22, model: MODELS[2] },
  { id: "MiMo", component: ModelReveal, audio: "audio/mimo.mp3", base: 20, model: MODELS[3] },
  { id: "Gemma", component: ModelReveal, audio: "audio/gemma.mp3", base: 18, model: MODELS[4] },
  { id: "NemotronSuper", component: ModelReveal, audio: "audio/nemotron-super.mp3", base: 20, model: MODELS[5] },
  { id: "NemotronNano", component: ModelReveal, audio: "audio/nemotron-nano.mp3", base: 22, model: MODELS[6] },
  { id: "Leaderboard", component: Leaderboard, audio: "audio/leaderboard.mp3", base: 25 },
  { id: "Verdict", component: Verdict, audio: "audio/verdict.mp3", base: 28 },
  { id: "Outro", component: Outro, audio: "audio/outro.mp3", base: 14 },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {compositionConfigs.map((cfg) => {
        const defaultProps = cfg.model ? { data: cfg.model, audioFile: cfg.audio } : {};
        return (
          <Composition
            key={cfg.id}
            id={cfg.id}
            component={cfg.component as React.FC<any>}
            durationInFrames={cfg.base * FPS}
            fps={FPS}
            width={1920}
            height={1080}
            defaultProps={defaultProps}
            calculateMetadata={makeMeta(cfg.audio, cfg.base)}
          />
        );
      })}
    </>
  );
};

function makeMeta(audio: string, base: number): CalculateMetadataFunction<any> {
  return async () => {
    const durationInFrames = await getDurationInFrames(audio, base);
    return { durationInFrames, fps: FPS, width: 1920, height: 1080 };
  };
}
