import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Audio, staticFile } from "remotion";
import { AnimatedBackground, Watermark } from "./visuals";
import { MODELS } from "./data";

const COMMENT = "Drop a comment: which model surprised you most?";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const T = (frac: number) => Math.max(0, Math.floor(frac * durationInFrames));

  const titleAppear = spring({
    frame: frame - T(0.02),
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.6 },
  });

  const subBounce = spring({
    frame: frame - T(0.15),
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.5 },
  });

  // Typewriter for the comment
  const comment = COMMENT;
  const charIndex = Math.min(
    comment.length,
    Math.floor(
      interpolate(frame, [T(0.30), T(0.30) + comment.length * 1.5], [0, comment.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    ),
  );

  const endCardAppear = interpolate(frame, [T(0.80), T(0.92)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AnimatedBackground baseColor="#08080d" accentColor="#8b5cf6" intensity={0.4} />
      <Audio src={staticFile("audio/outro.mp3")} />

      <AbsoluteFill style={{ padding: "80px 100px", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            textAlign: "center",
            maxWidth: 1600,
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              opacity: titleAppear,
              transform: `translateY(${(1 - titleAppear) * 30}px)`,
              fontSize: 90,
              fontWeight: 900,
              fontFamily: "'Bebas Neue', 'Inter', sans-serif",
              background: "linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: 6,
              lineHeight: 1,
              marginBottom: 24,
            }}
          >
            THAT'S THE TEST!
          </div>

          <div
            style={{
              transform: `scale(${subBounce})`,
              display: "inline-block",
              background: "linear-gradient(135deg, #ff0040, #ff4d6d)",
              color: "#fff",
              padding: "16px 48px",
              borderRadius: 999,
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: 4,
              fontFamily: "Inter, sans-serif",
              boxShadow: "0 12px 48px rgba(255, 0, 64, 0.4)",
              marginBottom: 40,
            }}
          >
            SUBSCRIBE
          </div>

          <div
            style={{
              minHeight: 56,
              fontSize: 28,
              color: "#cbd5e1",
              fontWeight: 500,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: 1,
              padding: "24px 40px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
              backdropFilter: "blur(10px)",
              display: "inline-block",
            }}
          >
            💬 {comment.substring(0, charIndex)}
            <span
              style={{
                opacity: frame % 30 < 15 ? 1 : 0,
                color: "#8b5cf6",
              }}
            >
              |
            </span>
          </div>

          <div
            style={{
              marginTop: 40,
              opacity: endCardAppear,
              fontSize: 26,
              color: "#64748b",
              fontWeight: 500,
              fontFamily: "Inter, sans-serif",
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Next video coming soon...
          </div>
        </div>

        {/* Floating model pills drifting up */}
        {MODELS.map((m, i) => {
          const delay = T(0.40) + i * T(0.025);
          const driftFrame = frame - delay;
          const driftY = driftFrame > 0 ? -driftFrame * 1.5 : 0;
          const driftOpacity = driftFrame > 0 ? Math.max(0, 1 - driftFrame / (T(0.40))) : 0;
          const xPos = (i % 7) * 270 - 900;
          if (driftOpacity <= 0) return null;
          return (
            <div
              key={m.id}
              style={{
                position: "absolute",
                left: `calc(50% + ${xPos}px)`,
                bottom: -100 + driftY,
                opacity: driftOpacity,
                padding: "10px 20px",
                borderRadius: 999,
                background: `${m.color}33`,
                border: `1px solid ${m.color}`,
                color: m.color,
                fontSize: 16,
                fontWeight: 700,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {m.shortName}
            </div>
          );
        })}
      </AbsoluteFill>

      <Watermark />
    </AbsoluteFill>
  );
};
