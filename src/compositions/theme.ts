/**
 * Shared theme — minimalist monochrome (black/white/gray) with per-model accents.
 * Inspired by arafatahmedmubin.gt.tc: black + grays + a single accent color,
 * Oswald for display, Fira Code for mono labels.
 */

export const C = {
  // Base palette
  bg: "#000000",
  bgRaised: "#0a0a0a",
  surface: "#111111",
  surfaceAlt: "#161616",
  border: "#222222",
  borderStrong: "#2a2a2a",

  // Text
  text: "#ffffff",
  textMuted: "#888888",
  textDim: "#666666",
  textFaint: "#444444",

  // States
  positive: "#4F9E33",
  positiveDeep: "#204E1C",
  negative: "#cf6679",
  warn: "#CFC197",

  // Misc
  slate: "#627486",
} as const;

export const FONT = {
  display: "'Oswald', 'Inter', sans-serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'Fira Code', 'JetBrains Mono', monospace",
} as const;

/** Standard radii — keep small/sharp for the brutalist feel */
export const R = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
} as const;

/** Hairline border helper — use as `style={{ border: B.hair(C.border) }}` */
export const B = {
  hair: (color: string) => `1px solid ${color}`,
  thick: (color: string) => `2px solid ${color}`,
} as const;

/** Track-style separator (a 1px gray line spanning the width) */
export const Rule: React.CSSProperties = {
  height: 1,
  background: C.border,
  width: "100%",
};
