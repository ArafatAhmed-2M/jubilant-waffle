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

const getNameSize = (name: string): number => {
  if (name.length > 16) return 120;
  if (name.length > 13) return 140;
  if (name.length > 10) return 160;
  return 180;
};

export const ModelReveal: React.FC<Props> = ({ data, audioFile }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // All timings as fractions of total duration so visual syncs to audio length
  const T = (frac: number) => Math.max(0, Math.floor(frac * durationInFrames));

  // 0-5%: color flash
  const flashOpacity = interpolate(
    frame,
    [0, T(0.02), T(0.06)],
    [1, 0.5, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );

  // 5-10%: tagline
  const taglineAppear = interpolate(frame, [T(0.05), T(0.10)], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // 8-18%: name
  const nameAppear = spring({
    frame: frame - T(0.08),
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.6 },
  });
  const nameX = spring({
    frame: frame - T(0.08),
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.7 },
  });

  // 20-32%: score cards
  const codeCardAppear = spring({
    frame: frame - T(0.20),
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.5 },
  });
  const looksCardAppear = spring({
    frame: frame - T(0.26),
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.5 },
  });

  // 30-55%: score bar
  const barProgress = interpolate(frame, [T(0.30), T(0.55)], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

  // 55-80%: pros (3 staggered)
  // 80-95%: cons (2 staggered)
  // 92-100%: badge
  const badgeAppear = spring({
    frame: frame - T(0.92),
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.6 },
  });

  const nameSize = getNameSize(data.name);

  return (
    <AbsoluteFill>
      <AnimatedBackground baseColor="#08080d" accentColor={data.color} intensity={0.4} />
      <Audio src={staticFile(audioFile)} />

      <AbsoluteFill
        style={{
          background: data.color,
          opacity: flashOpacity,
        }}
      />

      <AbsoluteFill style={{ padding: "80px 100px", justifyContent: "center" }}>
        <div style={{ maxWidth: 1720, width: "100%" }}>
          {/* Tagline / placement */}
          <div
            style={{
              opacity: taglineAppear,
              transform: `translateY(${(1 - taglineAppear) * 20}px)`,
              fontSize: 22,
              fontWeight: 700,
              color: data.color,
              letterSpacing: 6,
              textTransform: "uppercase",
              fontFamily: "Inter, sans-serif",
              marginBottom: 12,
            }}
          >
            #{data.placement} Place · {data.tagline}
          </div>

          {/* Model name - auto-sized, will not overflow */}
          <div
            style={{
              opacity: nameAppear,
              transform: `translateX(${(1 - nameX) * -200}px)`,
              fontSize: nameSize,
              fontWeight: 900,
              lineHeight: 1,
              fontFamily: "'Bebas Neue', 'Inter', sans-serif",
              background: `linear-gradient(135deg, #ffffff 0%, ${data.color} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: 2,
              textShadow: `0 0 80px ${data.color}40`,
              whiteSpace: "nowrap",
              overflow: "hidden",
              marginBottom: 30,
            }}
          >
            {data.name}
          </div>

          {/* Score cards */}
          <div style={{ display: "flex", gap: 32, marginBottom: 40 }}>
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
              opacity: interpolate(frame, [T(0.30), T(0.32)], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              marginBottom: 40,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
                fontSize: 20,
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
                height: 22,
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
                }}
              />
            </div>
          </div>

          {/* Pros + Cons - 2 columns, smaller font to avoid overflow */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              maxWidth: 1720,
            }}
          >
            {data.pros.map((pro, i) => {
              const delay = T(0.55) + i * T(0.04);
              const appear = spring({
                frame: frame - delay,
                fps,
                config: { damping: 14, stiffness: 180, mass: 0.5 },
              });
              return (
                <BulletItem
                  key={`p-${pro}`}
                  text={pro}
                  appear={appear}
                  color="#4ade80"
                  icon="✓"
                />
              );
            })}
            {data.cons.map((con, i) => {
              const delay = T(0.75) + i * T(0.04);
              const appear = spring({
                frame: frame - delay,
                fps,
                config: { damping: 14, stiffness: 180, mass: 0.5 },
              });
              return (
                <BulletItem
                  key={`c-${con}`}
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
      {frame >= T(0.92) && (
        <FinalBadge avg={data.avg} color={data.color} appear={badgeAppear} frame={frame} startFrame={T(0.92)} />
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
        padding: "30px 40px",
        background: `linear-gradient(135deg, ${color}22, ${color}08)`,
        border: `2px solid ${color}`,
        borderRadius: 24,
        backdropFilter: "blur(20px)",
        boxShadow: `0 0 60px ${color}30`,
      }}
    >
      <div
        style={{
          fontSize: 20,
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
          marginTop: 12,
          fontSize: 110,
          fontWeight: 900,
          color: color,
          lineHeight: 1,
          fontFamily: "'Bebas Neue', 'Inter', sans-serif",
        }}
      >
        {score.toFixed(1)}
        <span
          style={{
            fontSize: 48,
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
        padding: "16px 22px",
        background: `${color}11`,
        border: `2px solid ${color}66`,
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        gap: 16,
        minHeight: 64,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: color,
          color: "#0a0a0f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          fontWeight: 900,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 20,
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

const FinalBadge: React.FC<{
  avg: number;
  color: string;
  appear: number;
  frame: number;
  startFrame: number;
}> = ({ avg, color, appear, frame, startFrame }) => {
  const pulse = Math.sin((frame - startFrame) * 0.15) * 0.05 + 1;
  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        right: 60,
        opacity: appear,
        transform: `scale(${appear * pulse})`,
        padding: "24px 44px",
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        borderRadius: 24,
        boxShadow: `0 20px 60px ${color}80`,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 18,
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
          marginTop: 6,
          fontSize: 80,
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
          fontSize: 22,
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
