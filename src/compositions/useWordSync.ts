import { useCurrentFrame, useVideoConfig } from "remotion";

export type Word = {
  word: string;
  start_time: number;
  end_time: number;
};

const normalize = (w: string): string =>
  w.toLowerCase().replace(/[^a-z0-9]/g, "");

const tokenize = (phrase: string): string[] =>
  phrase
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.replace(/[^a-z0-9]/g, ""))
    .filter(Boolean);

export const useWordSync = (words: Word[] | undefined) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const t = frame / fps;

  /**
   * Frame number at which the first word matching `predicate` is spoken.
   * Returns 0 if not found.
   */
  const wordAt = (
    predicate: (w: Word, i: number, all: Word[]) => boolean,
  ): number => {
    if (!words) return 0;
    const idx = words.findIndex(predicate);
    if (idx === -1) return 0;
    return Math.floor(words[idx].start_time * fps);
  };

  /**
   * Frame range for the first occurrence of a phrase in the transcript.
   * `afterFrame` lets you skip earlier matches.
   */
  const phraseAt = (
    phrase: string,
    afterFrame = 0,
  ): { start: number; end: number; index: number } | null => {
    if (!words) return null;
    const tokens = tokenize(phrase);
    if (tokens.length === 0) return null;
    const afterSec = afterFrame / fps;
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      if (w.start_time < afterSec) continue;
      let matched = true;
      for (let j = 0; j < tokens.length; j++) {
        const wj = words[i + j];
        if (!wj || normalize(wj.word) !== tokens[j]) {
          matched = false;
          break;
        }
      }
      if (matched) {
        const endIdx = i + tokens.length - 1;
        return {
          start: Math.floor(w.start_time * fps),
          end: Math.floor(words[endIdx].end_time * fps),
          index: i,
        };
      }
    }
    return null;
  };

  /**
   * Frame at the first word whose normalized form equals `word`.
   * `occurrence` is 1-indexed (1 = first, 2 = second, ...).
   */
  const frameAt = (word: string, occurrence = 1): number => {
    if (!words) return 0;
    const target = normalize(word);
    let count = 0;
    for (let i = 0; i < words.length; i++) {
      if (normalize(words[i].word) === target) {
        count++;
        if (count === occurrence) {
          return Math.floor(words[i].start_time * fps);
        }
      }
    }
    return 0;
  };

  /**
   * Returns true once `frame` has reached the start of the matched word.
   * Useful for triggering one-shot animations.
   */
  const triggeredAt = (predicate: (w: Word, i: number, all: Word[]) => boolean): number => {
    return wordAt(predicate);
  };

  return {
    words: words ?? [],
    frame,
    t,
    wordAt,
    phraseAt,
    frameAt,
    triggeredAt,
  };
};

/**
 * Linear fade-in window: returns 0 before `start`, ramps to 1 over `duration`
 * frames, then stays at 1.
 */
export const fadeIn = (frame: number, start: number, duration: number): number => {
  if (frame < start) return 0;
  if (frame >= start + duration) return 1;
  return (frame - start) / duration;
};

/**
 * Returns 1 while frame is in [start, end], with optional fade on entry and exit.
 */
export const holdWindow = (
  frame: number,
  start: number,
  end: number,
  fadeInFrames = 0,
  fadeOutFrames = 0,
): number => {
  if (frame < start - fadeInFrames) return 0;
  if (frame > end + fadeOutFrames) return 0;
  let v = 1;
  if (fadeInFrames > 0 && frame < start) {
    v = (frame - (start - fadeInFrames)) / fadeInFrames;
  } else if (fadeOutFrames > 0 && frame > end) {
    v = 1 - (frame - end) / fadeOutFrames;
  }
  return Math.max(0, Math.min(1, v));
};
