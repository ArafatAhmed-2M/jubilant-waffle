import "./global.css";
import React from "react";
import { Composition } from "remotion";

import { FPS } from "./compositions/utils";
import { MODELS } from "./compositions/data";

import { Intro } from "./compositions/Intro";
import { ThePrompt } from "./compositions/ThePrompt";
import { ModelReveal } from "./compositions/ModelReveal";
import { Leaderboard } from "./compositions/Leaderboard";
import { Verdict } from "./compositions/Verdict";
import { Outro } from "./compositions/Outro";

/**
 * Fallback durations (seconds) for each scene's audio. The scene audio
 * length never changes once generated, so we hardcode it here. The
 * actual duration used at render time is `Math.ceil(audioSec * FPS) + 6`.
 */
const FALLBACK_DURATIONS: Record<string, number> = {
  "audio/intro.mp3": 28.66,
  "audio/the-prompt.mp3": 31.74,
  "audio/minimax.mp3": 28.34,
  "audio/deepseek.mp3": 24.02,
  "audio/bigpickle.mp3": 28.52,
  "audio/mimo.mp3": 28.7,
  "audio/gemma.mp3": 22.8,
  "audio/nemotron-super.mp3": 30.42,
  "audio/nemotron-nano.mp3": 42.06,
  "audio/leaderboard.mp3": 37.38,
  "audio/verdict.mp3": 39.52,
  "audio/outro.mp3": 18.12,
};

const compositionConfigs = [
  { id: "Intro", component: Intro, audio: "audio/intro.mp3" },
  { id: "ThePrompt", component: ThePrompt, audio: "audio/the-prompt.mp3" },
  { id: "MiniMax", component: ModelReveal, audio: "audio/minimax.mp3", model: MODELS[0] },
  { id: "DeepSeek", component: ModelReveal, audio: "audio/deepseek.mp3", model: MODELS[1] },
  { id: "BigPickle", component: ModelReveal, audio: "audio/bigpickle.mp3", model: MODELS[2] },
  { id: "MiMo", component: ModelReveal, audio: "audio/mimo.mp3", model: MODELS[3] },
  { id: "Gemma", component: ModelReveal, audio: "audio/gemma.mp3", model: MODELS[4] },
  { id: "NemotronSuper", component: ModelReveal, audio: "audio/nemotron-super.mp3", model: MODELS[5] },
  { id: "NemotronNano", component: ModelReveal, audio: "audio/nemotron-nano.mp3", model: MODELS[6] },
  { id: "Leaderboard", component: Leaderboard, audio: "audio/leaderboard.mp3" },
  { id: "Verdict", component: Verdict, audio: "audio/verdict.mp3" },
  { id: "Outro", component: Outro, audio: "audio/outro.mp3" },
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
            durationInFrames={Math.ceil((FALLBACK_DURATIONS[cfg.audio] ?? 30) * FPS) + 6}
            fps={FPS}
            width={1920}
            height={1080}
            defaultProps={baseProps}
          />
        );
      })}
    </>
  );
};
