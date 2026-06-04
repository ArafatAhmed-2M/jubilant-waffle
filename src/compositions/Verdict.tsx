import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { AnimatedBackground } from "./visuals";
import { useSecToFrame } from "./utils";

const INSIGHTS = [
  {
    title: "SIZE ≠ QUALITY",
    body: "A 7B parameter model beat a 31B one. Architecture and training beat raw scale.",
    color: "#8b5cf6",
    icon: "📊",
  },
  {
    title: "ONE BUG = EVERYTHING BREAKS",
    body: "Nemotron's CSS quote error destroyed the entire visual design in round one.",
    color: "#ff4d6d",
    icon: "💥",
  },
  {
    title: "PERSONALITY IS HARD",
    body: "Big Pickle held two registers — funny AND technically correct — simultaneously.",
    color: "#4ade80",
    icon: "🎭",
  },
  {
    title: "THE RADAR CHART IS THE TEST",
    body: "Pure trigonometry, no libraries, animate on scroll. The single feature that separates the good from the great.",
    color: "#fbbf24",
    icon: "🎯",
  },
];

/**
 * Per-card start time (in seconds), read directly from verdict.json.
 *   2.66  "Number one,"     → card 1 (SIZE ≠ QUALITY)
 *   9.9   "Number two,"     → card 2 (ONE BUG = ...)
 *  18.64  "Number three,"   → card 3 (PERSONALITY IS HARD)
 *  28.56  "number four,"    → card 4 (THE RADAR CHART IS THE TEST)
 */
const CARD_START_SEC = [2.66, 9.9, 18.64, 28.56];

/**
 * Verdict scene — 39.52s audio.
 *
 * Four insight cards cross-fade in sync with "Number one/two/three/four".
 * The last card holds until the end of the audio.
 */
export const Verdict: React.FC = () => {
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

  const crossDur = Math.floor(0.5 * fps); // 0.5s cross-fade

  return (
    <AbsoluteFill>
      <AnimatedBackground baseColor="#08080d" accentColor="#8b5cf6" intensity={0.35} />
      <Audio src={staticFile("audio/verdict.mp3")} />

      <AbsoluteFill style={{ padding: "70px 100px" }}>
        <div
          style={{
            opacity: titleAppear,
            transform: `translateY(${(1 - titleAppear) * 30}px)`,
            fontSize: 90,
            fontWeight: 900,
            textAlign: "center",
            fontFamily: "'Bebas Neue', 'Inter', sans-serif",
            background: "linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #8b5cf6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 6,
            marginBottom: 40,
            lineHeight: 1,
          }}
        >
          THE VERDICT
        </div>

        <div
          style={{
            position: "relative",
            height: 720,
            width: 1500,
            margin: "0 auto",
          }}
        >
          {INSIGHTS.map((insight, i) => {
            const isLast = i === INSIGHTS.length - 1;
            const startFrame = cardStarts[i];
            const nextStart = !isLast ? cardStarts[i + 1] : durationInFrames - 1;
            // Simpler: hold until next start, cross-fade out
            const fadeInEnd = startFrame + crossDur;
            const crossOutStart = isLast ? durationInFrames - 1 : Math.max(startFrame, nextStart - crossDur);

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
              ? interpolate(frame, [startFrame, fadeInEnd], [60, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : interpolate(
                  frame,
                  [startFrame, fadeInEnd, crossOutStart, nextStart],
                  [60, 0, 0, -30],
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
                  padding: "60px 70px",
                  background: `linear-gradient(135deg, ${insight.color}28, ${insight.color}0a)`,
                  border: `3px solid ${insight.color}`,
                  borderRadius: 28,
                  backdropFilter: "blur(24px)",
                  boxShadow: `0 30px 80px ${insight.color}50, 0 0 0 1px ${insight.color}33`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -60,
                    right: -60,
                    fontSize: 320,
                    opacity: 0.12,
                    lineHeight: 1,
                  }}
                >
                  {insight.icon}
                </div>
                <div
                  style={{
                    fontSize: 90,
                    marginBottom: 20,
                    position: "relative",
                    lineHeight: 1,
                  }}
                >
                  {insight.icon}
                </div>
                <div
                  style={{
                    fontSize: 56,
                    fontWeight: 900,
                    color: insight.color,
                    fontFamily: "'Bebas Neue', 'Inter', sans-serif",
                    letterSpacing: 3,
                    lineHeight: 1,
                    marginBottom: 28,
                    position: "relative",
                    whiteSpace: "nowrap",
                  }}
                >
                  #{i + 1} · {insight.title}
                </div>
                <div
                  style={{
                    fontSize: 34,
                    color: "#e2e8f0",
                    fontWeight: 500,
                    fontFamily: "Inter, sans-serif",
                    lineHeight: 1.4,
                    position: "relative",
                    maxWidth: 1340,
                  }}
                >
                  {insight.body}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 24,
            color: "#64748b",
            fontWeight: 500,
            fontFamily: "Inter, sans-serif",
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
          7 Models · 1 Prompt · ∞ Lessons
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 110,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 16,
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
                  width: isActive ? 60 : 30,
                  height: 8,
                  borderRadius: 4,
                  background: isActive ? INSIGHTS[i].color : "#1f2937",
                  boxShadow: isActive ? `0 0 20px ${INSIGHTS[i].color}` : "none",
                  transition: "width 0.2s",
                }}
              />
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
