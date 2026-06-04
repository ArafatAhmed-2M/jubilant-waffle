import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  Audio,
  staticFile,
} from "remotion";
import { AnimatedBackground } from "./visuals";
import type { ModelData } from "./data";

type Props = {
  data: ModelData;
  audioFile: string;
};

export const ModelReveal: React.FC<Props> = ({ data, audioFile }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 0-2s: color flash settle
  const flashOpacity = interpolate(frame, [0, 0.3 * fps, 1.5 * fps], [1, 0.6, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // 2-5s: model name slide
  const nameX = interpolate(frame, [2 * fps, 5 * fps], [-200, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const nameAppear = interpolate(frame, [2 * fps, 5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // 5-8s: score cards
  const codeCardAppear = spring({
    frame: frame - 5 * fps,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.5 },
  });
  const looksCardAppear = spring({
    frame: frame - 6 * fps,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.5 },
  });

  // 8-12s: score bar fill
  const barProgress = interpolate(frame, [8 * fps, 12 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

  // 12-16s: pros
  // 16-20s: cons
  // 20-end: final badge

  return (
    <AbsoluteFill>
      <AnimatedBackground baseColor="#08080d" accentColor={data.color} intensity={0.4} />
      <Audio src={staticFile(audioFile)} />

      {/* Color flash */}
      <AbsoluteFill
        style={{
          background: data.color,
          opacity: flashOpacity,
        }}
      />

      <AbsoluteFill style={{ padding: "100px 120px", justifyContent: "center" }}>
        <div style={{ maxWidth: 1700 }}>
          {/* Tagline / placement */}
          <div
            style={{
              opacity: interpolate(frame, [1 * fps, 2 * fps], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              fontSize: 24,
              fontWeight: 700,
              color: data.color,
              letterSpacing: 6,
              textTransform: "uppercase",
              fontFamily: "Inter, sans-serif",
            }}
          >
            #{data.placement} Place · {data.tagline}
          </div>

          {/* Model name */}
          <div
            style={{
              opacity: nameAppear,
              transform: `translateX(${nameX}px)`,
              marginTop: 20,
              fontSize: 180,
              fontWeight: 900,
              lineHeight: 1,
              fontFamily: "'Bebas Neue', 'Inter', sans-serif",
              background: `linear-gradient(135deg, #ffffff 0%, ${data.color} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: 4,
              textShadow: `0 0 80px ${data.color}40`,
            }}
          >
            {data.name}
          </div>

          {/* Score cards */}
          <div style={{ marginTop: 60, display: "flex", gap: 40 }}>
            <ScoreCard
              label="CODE SCORE"
              score={data.myScore}
              color={data.color}
              appear={codeCardAppear}
            />
            <ScoreCard
              label="LOOKS SCORE"
              score={data.yourScore}
              color={data.color}
              appear={looksCardAppear}
            />
          </div>

          {/* Animated bar */}
          <div
            style={{
              marginTop: 50,
              opacity: interpolate(frame, [8 * fps, 8.5 * fps], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
                fontSize: 22,
                fontWeight: 700,
                color: "#cbd5e1",
                fontFamily: "Inter, sans-serif",
                letterSpacing: 2,
              }}
            >
              <span>AVERAGE SCORE</span>
              <span style={{ color: data.color }}>{(data.avg * barProgress).toFixed(2)} / 10</span>
            </div>
            <div
              style={{
                width: "100%",
                height: 24,
                background: "rgba(255,255,255,0.08)",
                borderRadius: 12,
                overflow: "hidden",
                border: `1px solid ${data.color}40`,
              }}
            >
              <div
                style={{
                  width: `${barProgress * 100}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${data.color}, ${data.color}cc)`,
                  boxShadow: `0 0 30px ${data.color}80`,
                  transition: "width 0.1s",
                }}
              />
            </div>
          </div>

          {/* Pros */}
          <div
            style={{
              marginTop: 60,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
            }}
          >
            {data.pros.map((pro, i) => {
              const delay = 12 * fps + i * 0.5 * fps;
              const appear = spring({
                frame: frame - delay,
                fps,
                config: { damping: 14, stiffness: 180, mass: 0.5 },
              });
              return (
                <BulletItem
                  key={pro}
                  text={pro}
                  appear={appear}
                  color="#4ade80"
                  icon="✓"
                />
              );
            })}
            {data.cons.map((con, i) => {
              const delay = 16 * fps + i * 0.5 * fps;
              const appear = spring({
                frame: frame - delay,
                fps,
                config: { damping: 14, stiffness: 180, mass: 0.5 },
              });
              return (
                <BulletItem
                  key={con}
                  text={con}
                  appear={appear}
                  color="#ff4d6d"
                  icon="✕"
                />
              );
            })}
          </div>
        </div>
      </AbsoluteFill>

      {/* Final badge */}
      {frame >= 20 * fps && (
        <FinalBadge avg={data.avg} color={data.color} />
      )}
    </AbsoluteFill>
  );
};

const ScoreCard: React.FC<{
  label: string;
  score: number;
  color: string;
  appear: number;
}> = ({ label, score, color, appear }) => {
  return (
    <div
      style={{
        opacity: appear,
        transform: `scale(${0.7 + appear * 0.3}) translateY(${(1 - appear) * 20}px)`,
        flex: 1,
        padding: "40px 50px",
        background: `linear-gradient(135deg, ${color}22, ${color}08)`,
        border: `2px solid ${color}`,
        borderRadius: 24,
        backdropFilter: "blur(20px)",
        boxShadow: `0 0 60px ${color}30`,
      }}
    >
      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#94a3b8",
          letterSpacing: 4,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 16,
          fontSize: 140,
          fontWeight: 900,
          color: color,
          lineHeight: 1,
          fontFamily: "'Bebas Neue', 'Inter', sans-serif",
        }}
      >
        {score.toFixed(1)}
        <span
          style={{
            fontSize: 60,
            color: "#64748b",
            marginLeft: 8,
          }}
        >
          / 10
        </span>
      </div>
    </div>
  );
};

const BulletItem: React.FC<{
  text: string;
  appear: number;
  color: string;
  icon: string;
}> = ({ text, appear, color, icon }) => {
  return (
    <div
      style={{
        opacity: appear,
        transform: `translateX(${(1 - appear) * -40}px)`,
        padding: "20px 28px",
        background: `${color}11`,
        border: `2px solid ${color}66`,
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        gap: 20,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: color,
          color: "#0a0a0f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          fontWeight: 900,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 600,
          color: "#fff",
          fontFamily: "Inter, sans-serif",
          lineHeight: 1.3,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const FinalBadge: React.FC<{ avg: number; color: string }> = ({ avg, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({
    frame: frame - 20 * fps,
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.6 },
  });

  const pulse = Math.sin((frame - 20 * fps) * 0.15) * 0.05 + 1;

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        right: 80,
        opacity: appear,
        transform: `scale(${appear * pulse})`,
        padding: "32px 56px",
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        borderRadius: 24,
        boxShadow: `0 20px 60px ${color}80`,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#0a0a0f",
          letterSpacing: 4,
          fontFamily: "Inter, sans-serif",
          textTransform: "uppercase",
        }}
      >
        Average
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 100,
          fontWeight: 900,
          color: "#0a0a0f",
          lineHeight: 1,
          fontFamily: "'Bebas Neue', 'Inter', sans-serif",
        }}
      >
        {avg.toFixed(2)}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#0a0a0f",
          fontFamily: "Inter, sans-serif",
        }}
      >
        / 10
      </div>
    </div>
  );
};
