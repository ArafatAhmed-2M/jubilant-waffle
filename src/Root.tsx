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
 * Hardcoded durations (seconds) for each scene's audio. The audio length
 * never changes once generated, so we hardcode it here.
 *
 * Plus a 1.8s safety buffer at the end so the last word of each audio
 * isn't cut off by the render boundary (TTS may trail past the last
 * recognised word).
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

const AUDIO_TAIL_BUFFER_SEC = 2.5;

const compositionConfigs = [
  { id: "Intro",         component: Intro,        audio: "audio/intro.mp3",              sceneIndex: 1,  sceneName: "The Hook"      },
  { id: "ThePrompt",     component: ThePrompt,    audio: "audio/the-prompt.mp3",         sceneIndex: 2,  sceneName: "The Challenge" },
  { id: "MiniMax",       component: ModelReveal,  audio: "audio/minimax.mp3",            sceneIndex: 3,  sceneName: "Model 1",      model: MODELS[0] },
  { id: "DeepSeek",      component: ModelReveal,  audio: "audio/deepseek.mp3",           sceneIndex: 4,  sceneName: "Model 2",      model: MODELS[1] },
  { id: "BigPickle",     component: ModelReveal,  audio: "audio/bigpickle.mp3",          sceneIndex: 5,  sceneName: "Model 3",      model: MODELS[2] },
  { id: "MiMo",          component: ModelReveal,  audio: "audio/mimo.mp3",               sceneIndex: 6,  sceneName: "Model 4",      model: MODELS[3] },
  { id: "Gemma",         component: ModelReveal,  audio: "audio/gemma.mp3",              sceneIndex: 7,  sceneName: "Model 5",      model: MODELS[4] },
  { id: "NemotronSuper", component: ModelReveal,  audio: "audio/nemotron-super.mp3",     sceneIndex: 8,  sceneName: "Model 6",      model: MODELS[5] },
  { id: "NemotronNano",  component: ModelReveal,  audio: "audio/nemotron-nano.mp3",      sceneIndex: 9,  sceneName: "Model 7",      model: MODELS[6] },
  { id: "Leaderboard",   component: Leaderboard,  audio: "audio/leaderboard.mp3",        sceneIndex: 10, sceneName: "Leaderboard"   },
  { id: "Verdict",       component: Verdict,      audio: "audio/verdict.mp3",            sceneIndex: 11, sceneName: "The Verdict"   },
  { id: "Outro",         component: Outro,        audio: "audio/outro.mp3",              sceneIndex: 12, sceneName: "End Screen"    },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {compositionConfigs.map((cfg) => {
        const baseProps: Record<string, unknown> = cfg.model
          ? { data: cfg.model, audioFile: cfg.audio, sceneIndex: cfg.sceneIndex, sceneName: cfg.sceneName }
          : { sceneIndex: cfg.sceneIndex, sceneName: cfg.sceneName };
        const audioSec = FALLBACK_DURATIONS[cfg.audio] ?? 30;
        const durationInFrames =
          Math.ceil(audioSec * FPS) + Math.ceil(AUDIO_TAIL_BUFFER_SEC * FPS);
        return (
          <Composition
            key={cfg.id}
            id={cfg.id}
            component={cfg.component as React.FC<any>}
            durationInFrames={durationInFrames}
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
