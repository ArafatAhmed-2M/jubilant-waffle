import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { Audio, staticFile } from "remotion";
import { AnimatedBackground, Watermark } from "./visuals";

const MODEL_PILLS = [
  { name: "MiniMax M3", color: "#8b5cf6" },
  { name: "DeepSeek Flash", color: "#22d3ee" },
  { name: "Big Pickle", color: "#4ade80" },
  { name: "MiMo v2.5", color: "#fb923c" },
  { name: "Gemma 4 31B", color: "#60a5fa" },
  { name: "Nemotron Super", color: "#76b900" },
  { name: "Nemotron Nano", color: "#c8f500" },
];

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 1.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const titleY = interpolate(frame, [0, 1.5 * fps], [40, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const subtitleOpacity = interpolate(frame, [2 * fps, 4 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const subtitleY = interpolate(frame, [2 * fps, 4 * fps], [30, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const breakScale = spring({
    frame: frame - 7 * fps,
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.5 },
  });
  const breakVisible = frame >= 7 * fps && frame < 11 * fps;

  const subAppear = spring({
    frame: frame - 11 * fps,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.6 },
  });

  return (
    <AbsoluteFill>
      <AnimatedBackground baseColor="#08080d" accentColor="#8b5cf6" />
      <Audio src={staticFile("audio/intro.mp3")} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            textAlign: "center",
            padding: "0 80px",
            maxWidth: 1700,
          }}
        >
          <div
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              fontSize: 200,
              fontWeight: 900,
              letterSpacing: 8,
              lineHeight: 0.95,
              fontFamily: "'Bebas Neue', 'Inter', sans-serif",
              background: "linear-gradient(135deg, #ffffff 0%, #c4b5fd 50%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 80px rgba(139, 92, 246, 0.4)",
            }}
          >
            7 FREE AI MODELS
          </div>

          <div
            style={{
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleY}px)`,
              marginTop: 30,
              fontSize: 42,
              fontWeight: 500,
              color: "#cbd5e1",
              letterSpacing: 2,
              fontFamily: "Inter, sans-serif",
            }}
          >
            One Prompt · One HTML File · No Libraries
          </div>

          {frame >= 4 * fps && (
            <div
              style={{
                marginTop: 80,
                display: "flex",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap",
                maxWidth: 1600,
              }}
            >
              {MODEL_PILLS.map((pill, i) => {
                const delay = 4 * fps + i * 6;
                const appear = spring({
                  frame: frame - delay,
                  fps,
                  config: { damping: 14, stiffness: 180, mass: 0.5 },
                });
                return (
                  <div
                    key={pill.name}
                    style={{
                      opacity: appear,
                      transform: `translateY(${(1 - appear) * 30}px) scale(${0.7 + appear * 0.3})`,
                      padding: "16px 28px",
                      borderRadius: 999,
                      background: `${pill.color}22`,
                      border: `2px solid ${pill.color}`,
                      color: pill.color,
                      fontSize: 22,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      fontFamily: "Inter, sans-serif",
                      boxShadow: `0 0 32px ${pill.color}40`,
                    }}
                  >
                    {pill.name}
                  </div>
                );
              })}
            </div>
          )}

          {breakVisible && (
            <div
              style={{
                marginTop: 80,
                opacity: breakScale,
                transform: `scale(${breakScale})`,
                fontSize: 100,
                fontWeight: 900,
                color: "#ff0040",
                letterSpacing: 4,
                fontFamily: "'Bebas Neue', 'Inter', sans-serif",
                textShadow: "0 0 60px rgba(255, 0, 64, 0.7), 0 0 30px rgba(255, 0, 64, 0.4)",
              }}
            >
              ONE BROKE ON LINE 3
            </div>
          )}

          {frame >= 11 * fps && (
            <div
              style={{
                marginTop: 80,
                opacity: subAppear,
                fontSize: 32,
                color: "#94a3b8",
                fontWeight: 500,
                fontFamily: "Inter, sans-serif",
                letterSpacing: 1,
              }}
            >
              Let's see what each one built →
            </div>
          )}
        </div>
      </AbsoluteFill>

      <Watermark />
    </AbsoluteFill>
  );
};
