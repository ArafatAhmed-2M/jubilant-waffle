import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing, Audio, staticFile } from "remotion";
import { AnimatedBackground } from "./visuals";

export const ThePrompt: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const T = (frac: number) => Math.max(0, Math.floor(frac * durationInFrames));

  const titleAppear = spring({
    frame: frame - T(0.02),
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.6 },
  });

  const sections = [
    "Live clock topbar",
    "Typewriter terminal",
    "Pure trig radar chart",
    "Scrolling stats ticker",
    "Six feature cards",
    "Quiz module",
    "Syntax code block",
    "Animated footer",
  ];

  return (
    <AbsoluteFill>
      <AnimatedBackground baseColor="#08080d" accentColor="#22d3ee" intensity={0.25} />
      <Audio src={staticFile("audio/the-prompt.mp3")} />

      <AbsoluteFill style={{ padding: "70px 100px", justifyContent: "center" }}>
        <div style={{ maxWidth: 1720 }}>
          <div
            style={{
              opacity: titleAppear,
              transform: `translateY(${(1 - titleAppear) * 40}px)`,
              fontSize: 110,
              fontWeight: 900,
              lineHeight: 1,
              fontFamily: "'Bebas Neue', 'Inter', sans-serif",
              background: "linear-gradient(135deg, #ffffff 0%, #67e8f9 50%, #22d3ee 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: 4,
            }}
          >
            THE CHALLENGE
          </div>

          <div
            style={{
              marginTop: 20,
              fontSize: 30,
              color: "#cbd5e1",
              fontWeight: 500,
              fontFamily: "Inter, sans-serif",
              maxWidth: 1500,
              lineHeight: 1.4,
            }}
          >
            Build a complete OS dashboard in <span style={{ color: "#22d3ee", fontWeight: 700 }}>one HTML file</span> — <span style={{ color: "#22d3ee", fontWeight: 700 }}>no libraries</span>, pure code.
          </div>

          <div
            style={{
              marginTop: 40,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 18,
            }}
          >
            {sections.map((section, i) => {
              const delay = T(0.18) + i * T(0.05);
              const appear = spring({
                frame: frame - delay,
                fps,
                config: { damping: 14, stiffness: 180, mass: 0.5 },
              });
              return (
                <div
                  key={section}
                  style={{
                    opacity: appear,
                    transform: `translateX(${(1 - appear) * -60}px)`,
                    padding: "22px 30px",
                    background: "rgba(34, 211, 238, 0.08)",
                    border: "2px solid rgba(34, 211, 238, 0.4)",
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "#22d3ee",
                      color: "#0a0a0f",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      fontWeight: 900,
                      fontFamily: "Inter, sans-serif",
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 700,
                      color: "#fff",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {section}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 36,
              opacity: interpolate(frame, [T(0.72), T(0.82)], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `translateY(${interpolate(frame, [T(0.72), T(0.82)], [20, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              })}px)`,
              padding: "24px 40px",
              background: "linear-gradient(135deg, rgba(255, 0, 64, 0.15), rgba(255, 0, 64, 0.05))",
              border: "2px solid #ff0040",
              borderRadius: 20,
              fontSize: 26,
              fontWeight: 800,
              color: "#fff",
              fontFamily: "Inter, sans-serif",
              textAlign: "center",
              boxShadow: "0 0 60px rgba(255, 0, 64, 0.3)",
            }}
          >
            ⚡ The radar chart: pure sine & cosine — the line between good and great
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
