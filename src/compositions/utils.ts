import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { staticFile, useVideoConfig } from "remotion";

export const FPS = 30;

export async function getAudioDuration(file: string): Promise<number> {
  try {
    const seconds = await getAudioDurationInSeconds(staticFile(file));
    return Math.ceil(seconds);
  } catch (e) {
    return 0;
  }
}

export const DURATION_BUFFER = 1.2;
export const MIN_DURATION_SECONDS = 12;

export function computeDuration(audioSeconds: number, baseDuration: number): number {
  const final = Math.max(
    MIN_DURATION_SECONDS,
    Math.ceil(audioSeconds * DURATION_BUFFER),
    baseDuration,
  );
  return final;
}

/**
 * Convert a time in seconds to a frame number using the scene's actual fps.
 * Pass this as `(sec: number) => Math.floor(sec * fps)` after `useVideoConfig()`.
 */
export function useSecToFrame(): (sec: number) => number {
  const { fps } = useVideoConfig();
  return (sec: number) => Math.max(0, Math.floor(sec * fps));
}

/**
 * Fade-in 0→1 over `duration` frames starting at `start`. Returns 0 before,
 * 1 after.
 */
export const fadeIn = (frame: number, start: number, duration = 14): number => {
  if (frame < start) return 0;
  if (frame >= start + duration) return 1;
  return (frame - start) / duration;
};
