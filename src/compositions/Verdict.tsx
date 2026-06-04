import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
  staticFile,
} from "remotion";
import { AnimatedBackground } from "./visuals";
import { SceneFrame } from "./SceneFrame";
import { useSecToFrame } from "./utils";
import { C, FONT } from "./theme";

const INSIGHTS = [
  {
    num: "01",
    title: "Size ≠ Quality",
    body: "A 7B parameter model beat a 31B one. Architecture and training beat raw scale.",
    accent: C.text,
    label: "// Architecture",
  },
  {
    num: "02",
    title: "One Bug = Everything Breaks",
    body: "Nemotron's CSS quote error destroyed the entire visual design in round one.",
    accent: C.negative,
    label: "// Failure Mode",
  },
  {
    num: "03",
    title: "Personality Is Hard",
    body: "Big Pickle held two registers — funny AND technically correct — simultaneously.",
    accent: C.positive,
    label: "// Personality",
  },
  {
    num: "04",
    title: "The Radar Is The Test",
    body: "Pure trigonometry, no libraries, animate on scroll. The single feature that separates the good from the great.",
    accent: C.warn,
    label: "// The Verdict",
  },
];

/**
 * Per-card start time (in seconds), read directly from verdict.json.
 *   2.66  "Number one,"     → card 1
 *   9.9   "Number two,"     → card 2
 *  18.64  "Number three,"   → card 3
 *  28.56  "number four,"    → card 4
 */
const CARD_START_SEC = [2.66, 9.9, 18.64, 28.56];

/**
 * Verdict scene — TEST 11/12 · 39.52s audio.
 * Brutalist: 4 numbered insight cards in a sliding horizontal layout.
 */
export const Verdict: React.FC<{ sceneIndex: number; sceneName: string }> = ({
  sceneIndex,
  sceneName,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const T = useSecToFrame();

  const titleAt = T(0.0);
  const cardStarts = CARD_START_SEC.map((s) => T(s));

  const titleAppear = spring({
    frame: frame - titleAt,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.6 },
  });

  const crossDur = Math.floor(0.5 * fps);

  // Active card index
  const activeIdx = (() => {
    for (let i = cardStarts.length - 1; i >= 0; i--) {
      if (frame >= cardStarts[i]) return i;
    }
    return 0;
  })();
  const bgAccent = INSIGHTS[activeIdx].accent;

  return (
    <SceneFrame
      sceneIndex={sceneIndex}
      totalScenes={12}
      sceneName={sceneName}
      accentColor={C.text}
    >
      <AnimatedBackground baseColor={C.bg} accentColor={bgAccent} intensity={0.18} />
      <Audio src={staticFile("audio/verdict.mp3")} />

      <AbsoluteFill style={{ padding: "110px 80px 90px" }}>
        {/* Eyebrow */}
        <div
          style={{
            opacity: titleAppear,
            transform: `translateX(${(1 - titleAppear) * -16}px)`,
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 14,
          }}
        >
          <div style={{ width: 40, height: 1, background: C.text }} />
          <div
            style={{
              fontSize: 12,
              color: C.textMuted,
              fontFamily: FONT.mono,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Episode 11 // The Verdict
          </div>
        </div>

        <div
          style={{
            opacity: titleAppear,
            transform: `translateY(${(1 - titleAppear) * 24}px)`,
            fontSize: 96,
            fontWeight: 700,
            fontFamily: FONT.display,
            color: C.text,
            letterSpacing: 4,
            lineHeight: 0.95,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          The Verdict
        </div>

        <div
          style={{
            opacity: titleAppear,
            fontSize: 13,
            color: C.textMuted,
            fontFamily: FONT.mono,
            letterSpacing: 3,
            textTransform: "uppercase",
            fontWeight: 500,
            marginBottom: 24,
          }}
        >
          // Four things I learned building this
        </div>

        {/* Card stack */}
        <div
          style={{
            position: "relative",
            height: 600,
            maxWidth: 1720,
            width: "100%",
            margin: "0 auto",
          }}
        >
          {INSIGHTS.map((insight, i) => {
            const isLast = i === INSIGHTS.length - 1;
            const startFrame = cardStarts[i];
            const nextStart = !isLast ? cardStarts[i + 1] : durationInFrames - 1;
            const fadeInEnd = startFrame + crossDur;
            const crossOutStart = isLast
              ? durationInFrames - 1
              : Math.max(startFrame, nextStart - crossDur);

            const opacity = isLast
              ? interpolate(frame, [startFrame, fadeInEnd], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : interpolate(
                  frame,
                  [startFrame, fadeInEnd, crossOutStart, nextStart],
                  [0, 1, 1, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                );

            const translateY = isLast
              ? interpolate(frame, [startFrame, fadeInEnd], [40, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : interpolate(
                  frame,
                  [startFrame, fadeInEnd, crossOutStart, nextStart],
                  [40, 0, 0, -20],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                );

            return (
              <div
                key={insight.title}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity,
                  transform: `translateY(${translateY}px)`,
                  padding: "40px 48px",
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderLeft: `3px solid ${insight.accent}`,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 48,
                }}
              >
                {/* Big number column */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    width: 280,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      color: C.textFaint,
                      fontFamily: FONT.mono,
                      letterSpacing: 3,
                      textTransform: "uppercase",
                      fontWeight: 500,
                      marginBottom: 6,
                    }}
                  >
                    Insight
                  </div>
                  <div
                    style={{
                      fontSize: 180,
                      fontWeight: 700,
                      color: insight.accent,
                      fontFamily: FONT.display,
                      lineHeight: 0.9,
                      letterSpacing: 2,
                    }}
                  >
                    {insight.num}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.textMuted,
                      fontFamily: FONT.mono,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      marginTop: 8,
                    }}
                  >
                    {insight.label}
                  </div>
                </div>

                {/* Vertical rule */}
                <div
                  style={{
                    width: 1,
                    height: "80%",
                    background: C.border,
                  }}
                />

                {/* Text column */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 64,
                      fontWeight: 700,
                      color: C.text,
                      fontFamily: FONT.display,
                      letterSpacing: 2,
                      lineHeight: 1,
                      marginBottom: 18,
                      textTransform: "uppercase",
                    }}
                  >
                    {insight.title}
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      color: C.textMuted,
                      fontWeight: 400,
                      fontFamily: FONT.body,
                      lineHeight: 1.5,
                      maxWidth: 1100,
                    }}
                  >
                    {insight.body}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Card progress dots */}
        <div
          style={{
            position: "absolute",
            bottom: 90,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {cardStarts.map((start, i) => {
            const isActive =
              frame >= start &&
              frame < (cardStarts[i + 1] ?? durationInFrames);
            return (
              <div
                key={i}
                style={{
                  width: isActive ? 40 : 20,
                  height: 2,
                  background: isActive ? INSIGHTS[i].accent : C.border,
                  transition: "width 0.2s",
                }}
              />
            );
          })}
        </div>

        {/* Bottom tag line */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 12,
            color: C.textFaint,
            fontWeight: 500,
            fontFamily: FONT.mono,
            letterSpacing: 4,
            textTransform: "uppercase",
            opacity: interpolate(
              frame,
              [durationInFrames - 60, durationInFrames - 20],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            ),
          }}
        >
          // 7 Models · 1 Prompt · ∞ Lessons
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};
