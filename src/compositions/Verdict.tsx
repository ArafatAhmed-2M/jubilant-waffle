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
  const { fps } = useVideoConfig();

  const titleAppear = spring({
    frame: frame - 0.3 * fps,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.6 },
  });

  return (
    <AbsoluteFill>
      <AnimatedBackground baseColor="#08080d" accentColor="#8b5cf6" intensity={0.35} />
      <Audio src={staticFile("audio/verdict.mp3")} />

      <AbsoluteFill style={{ padding: "100px 120px" }}>
        <div
          style={{
            opacity: titleAppear,
            transform: `translateY(${(1 - titleAppear) * 30}px)`,
            fontSize: 110,
            fontWeight: 900,
            textAlign: "center",
            fontFamily: "'Bebas Neue', 'Inter', sans-serif",
            background: "linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #8b5cf6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 6,
            marginBottom: 60,
          }}
        >
          THE VERDICT
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
            maxWidth: 1680,
            margin: "0 auto",
          }}
        >
          {INSIGHTS.map((insight, i) => {
            const delay = 1.5 * fps + i * 1.2 * fps;
            const appear = spring({
              frame: frame - delay,
              fps,
              config: { damping: 12, stiffness: 180, mass: 0.5 },
            });
            const hold = frame >= delay + 5 * fps;
            const pulseScale = hold && frame < delay + 6 * fps
              ? 1 + Math.sin((frame - delay - 5 * fps) * 0.5) * 0.04
              : 1;
            return (
              <div
                key={insight.title}
                style={{
                  opacity: appear,
                  transform: `translateY(${(1 - appear) * 60}px) scale(${appear * pulseScale})`,
                  padding: "44px 48px",
                  background: `linear-gradient(135deg, ${insight.color}22, ${insight.color}08)`,
                  border: `2px solid ${insight.color}`,
                  borderRadius: 24,
                  backdropFilter: "blur(20px)",
                  boxShadow: `0 0 60px ${insight.color}40`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -40,
                    right: -40,
                    fontSize: 240,
                    opacity: 0.1,
                  }}
                >
                  {insight.icon}
                </div>
                <div
                  style={{
                    fontSize: 40,
                    marginBottom: 16,
                    position: "relative",
                  }}
                >
                  {insight.icon}
                </div>
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 900,
                    color: insight.color,
                    fontFamily: "'Bebas Neue', 'Inter', sans-serif",
                    letterSpacing: 2,
                    lineHeight: 1,
                    marginBottom: 16,
                    position: "relative",
                  }}
                >
                  #{i + 1} · {insight.title}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    color: "#cbd5e1",
                    fontWeight: 500,
                    fontFamily: "Inter, sans-serif",
                    lineHeight: 1.4,
                    position: "relative",
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
            bottom: 60,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 28,
            color: "#64748b",
            fontWeight: 500,
            fontFamily: "Inter, sans-serif",
            letterSpacing: 4,
            textTransform: "uppercase",
            opacity: interpolate(frame, [22 * fps, 25 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          7 Models · 1 Prompt · ∞ Lessons
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
