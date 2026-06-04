import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Audio, staticFile } from "remotion";
import { AnimatedBackground, Watermark } from "./visuals";
import { MODELS } from "./data";

const COMMENT = "Drop a comment: which model surprised you most?";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAppear = spring({
    frame: frame - 0.3 * fps,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.6 },
  });

  const subBounce = spring({
    frame: frame - 1.5 * fps,
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.5 },
  });

  // Typewriter effect for the comment
  const comment = COMMENT;
  const charIndex = Math.min(
    comment.length,
    Math.floor(
      interpolate(frame, [3 * fps, 3 * fps + comment.length * 0.08 * fps], [0, comment.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    ),
  );

  const endCardAppear = interpolate(frame, [11 * fps, 13 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AnimatedBackground baseColor="#08080d" accentColor="#8b5cf6" intensity={0.4} />
      <Audio src={staticFile("audio/outro.mp3")} />

      <AbsoluteFill style={{ padding: "100px 120px", alignItems: "center", justifyContent: "center" }}>
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
              fontSize: 110,
              fontWeight: 900,
              fontFamily: "'Bebas Neue', 'Inter', sans-serif",
              background: "linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: 6,
              lineHeight: 1,
              marginBottom: 30,
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
              padding: "20px 56px",
              borderRadius: 999,
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: 4,
              fontFamily: "Inter, sans-serif",
              boxShadow: "0 12px 48px rgba(255, 0, 64, 0.4)",
              marginBottom: 60,
            }}
          >
            SUBSCRIBE
          </div>

          {/* Typewriter comment */}
          <div
            style={{
              minHeight: 60,
              fontSize: 36,
              color: "#cbd5e1",
              fontWeight: 500,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: 1,
              padding: "32px 48px",
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

          {/* End card */}
          <div
            style={{
              marginTop: 60,
              opacity: endCardAppear,
              fontSize: 32,
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
          const delay = 4 * fps + i * 0.2 * fps;
          const driftFrame = frame - delay;
          const driftY = driftFrame > 0 ? -driftFrame * 1.5 : 0;
          const driftOpacity = driftFrame > 0 ? Math.max(0, 1 - driftFrame / (5 * fps)) : 0;
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
                padding: "12px 24px",
                borderRadius: 999,
                background: `${m.color}33`,
                border: `1px solid ${m.color}`,
                color: m.color,
                fontSize: 18,
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
