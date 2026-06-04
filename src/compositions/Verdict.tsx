import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Audio, staticFile } from "remotion";
import { AnimatedBackground } from "./visuals";

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

export const Verdict: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const T = (frac: number) => Math.max(0, Math.floor(frac * durationInFrames));

  const titleAppear = spring({
    frame: frame - T(0.02),
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.6 },
  });

  // Each card is visible for ~0.22 of duration, with 0.03 crossfade gap.
  // Schedule: 0.10-0.30, 0.33-0.53, 0.56-0.76, 0.79-0.99
  const cardSlots: Array<{ start: number; end: number }> = [
    { start: 0.10, end: 0.30 },
    { start: 0.33, end: 0.53 },
    { start: 0.56, end: 0.76 },
    { start: 0.79, end: 0.99 },
  ];

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
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          {INSIGHTS.map((insight, i) => {
            const slot = cardSlots[i];
            const isLast = i === cardSlots.length - 1;
            const fadeIn = T(slot.start);
            const fadeInEnd = T(slot.start + 0.04);
            const holdEnd = T(slot.end);
            const crossEnd = isLast
              ? durationInFrames - 1
              : Math.min(T(slot.end + 0.04), durationInFrames - 1);
            const opacity = isLast
              ? interpolate(frame, [fadeIn, fadeInEnd], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : interpolate(frame, [fadeIn, fadeInEnd, holdEnd, crossEnd], [0, 1, 1, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
            const translateY = isLast
              ? interpolate(frame, [fadeIn, fadeInEnd], [60, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : interpolate(frame, [fadeIn, fadeInEnd, holdEnd, crossEnd], [60, 0, 0, -30], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
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
                    marginBottom: 24,
                    position: "relative",
                  }}
                >
                  {insight.icon}
                </div>
                <div
                  style={{
                    fontSize: 60,
                    fontWeight: 900,
                    color: insight.color,
                    fontFamily: "'Bebas Neue', 'Inter', sans-serif",
                    letterSpacing: 3,
                    lineHeight: 1,
                    marginBottom: 24,
                    position: "relative",
                    whiteSpace: "nowrap",
                  }}
                >
                  #{i + 1} · {insight.title}
                </div>
                <div
                  style={{
                    fontSize: 32,
                    color: "#e2e8f0",
                    fontWeight: 500,
                    fontFamily: "Inter, sans-serif",
                    lineHeight: 1.4,
                    position: "relative",
                    maxWidth: 920,
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
            opacity: interpolate(frame, [T(0.85), T(0.95)], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          7 Models · 1 Prompt · ∞ Lessons
        </div>

        {/* Card progress dots */}
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
          {cardSlots.map((slot, i) => {
            const active = frame >= T(slot.start) && frame < T(slot.end + 0.04);
            return (
              <div
                key={i}
                style={{
                  width: active ? 60 : 30,
                  height: 8,
                  borderRadius: 4,
                  background: active ? INSIGHTS[i].color : "#1f2937",
                  transition: "all 0.3s",
                  boxShadow: active ? `0 0 20px ${INSIGHTS[i].color}` : "none",
                }}
              />
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
