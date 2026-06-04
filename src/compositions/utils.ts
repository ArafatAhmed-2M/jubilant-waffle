import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { staticFile } from "remotion";

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
