import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Audio,
  staticFile,
} from "remotion";
import { AnimatedBackground } from "./visuals";
import { BrowserFrame, InfoCard } from "./BrowserFrame";
import type { ModelData } from "./data";

type Props = {
  data: ModelData;
  audioFile: string;
};

const getNameSize = (name: string): number => {
  if (name.length > 16) return 110;
  if (name.length > 13) return 130;
  if (name.length > 10) return 150;
  return 165;
};

export const ModelReveal: React.FC<Props> = ({ data, audioFile }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const T = (frac: number) => Math.max(0, Math.floor(frac * durationInFrames));

  // 0-4%: color flash
  const flashOpacity = interpolate(frame, [0, T(0.02), T(0.05)], [1, 0.5, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // 4-9%: tagline
  const taglineAppear = interpolate(frame, [T(0.04), T(0.09)], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // 7-15%: name
  const nameAppear = spring({
    frame: frame - T(0.07),
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.6 },
  });
  const nameX = spring({
    frame: frame - T(0.07),
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.7 },
  });

  // 14-22%: info card (maker, params, etc.)
  const infoAppear = spring({
    frame: frame - T(0.14),
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.5 },
  });

  // 18-26%: score cards
  const codeCardAppear = spring({
    frame: frame - T(0.18),
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.5 },
  });
  const looksCardAppear = spring({
    frame: frame - T(0.23),
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.5 },
  });

  // 26-32%: browser frame
  const screenshotAppear = spring({
    frame: frame - T(0.26),
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.7 },
  });

  // 35-50%: pros (3 staggered)
  // 55-70%: cons (2 staggered)
  // 75-95%: badge with pulse
  const badgeAppear = spring({
    frame: frame - T(0.78),
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.6 },
  });
  const badgePulse = frame >= T(0.85)
    ? 1 + Math.sin((frame - T(0.85)) * 0.18) * 0.05
    : 1;

  // Final fade out near the end
  const fadeOut = interpolate(frame, [T(0.96), T(1.0)], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const nameSize = getNameSize(data.name);

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <AnimatedBackground baseColor="#08080d" accentColor={data.color} intensity={0.4} />
      <Audio src={staticFile(audioFile)} />

      <AbsoluteFill
        style={{
          background: data.color,
          opacity: flashOpacity,
        }}
      />

      <AbsoluteFill style={{ padding: "50px 80px" }}>
        {/* Top: tagline + name + info card */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              opacity: taglineAppear,
              transform: `translateY(${(1 - taglineAppear) * 20}px)`,
              fontSize: 18,
              fontWeight: 700,
              color: data.color,
              letterSpacing: 6,
              textTransform: "uppercase",
              fontFamily: "Inter, sans-serif",
              marginBottom: 8,
            }}
          >
            #{data.placement} Place · {data.tagline}
          </div>

          <div
            style={{
              opacity: nameAppear,
              transform: `translateX(${(1 - nameX) * -200}px)`,
              fontSize: nameSize,
              fontWeight: 900,
              lineHeight: 1.1,
              fontFamily: "'Bebas Neue', 'Inter', sans-serif",
              background: `linear-gradient(135deg, #ffffff 0%, ${data.color} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: 2,
              textShadow: `0 0 80px ${data.color}40`,
              whiteSpace: "nowrap",
              overflow: "hidden",
              paddingBottom: 12,
            }}
          >
            {data.name}
          </div>
        </div>

        {/* Main content: 2 columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 32, alignItems: "start" }}>
          {/* Left column: scores + info + pros/cons */}
          <div>
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <ScoreCard
                label="CODE"
                score={data.myScore}
                color={data.color}
                appear={codeCardAppear}
              />
              <ScoreCard
                label="LOOKS"
                score={data.yourScore}
                color={data.color}
                appear={looksCardAppear}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <InfoCard
                maker={data.maker}
                params={data.params}
                license={data.license}
                release={data.release}
                info={data.info}
                color={data.color}
                appear={infoAppear}
              />
            </div>

            {/* Pros + Cons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {data.pros.map((pro, i) => {
                const delay = T(0.32) + i * T(0.04);
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
                const delay = T(0.50) + i * T(0.04);
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

          {/* Right column: browser frame */}
          <div style={{ position: "relative" }}>
            <BrowserFrame
              screenshot={`screenshots/${data.id}.png`}
              url={data.url}
              appear={screenshotAppear}
            />
            <div
              style={{
                position: "absolute",
                bottom: -36,
                right: 0,
                fontSize: 14,
                color: "#64748b",
                fontFamily: "Inter, sans-serif",
                fontStyle: "italic",
              }}
            >
              Live preview of what the model generated ↓
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* Final badge - bottom right */}
      {frame >= T(0.78) && (
        <FinalBadge avg={data.avg} color={data.color} appear={badgeAppear} pulse={badgePulse} />
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
        padding: "20px 26px",
        background: `linear-gradient(135deg, ${color}22, ${color}08)`,
        border: `2px solid ${color}`,
        borderRadius: 18,
        backdropFilter: "blur(20px)",
        boxShadow: `0 0 40px ${color}30`,
      }}
    >
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#94a3b8",
          letterSpacing: 4,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {label} SCORE
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 80,
          fontWeight: 900,
          color: color,
          lineHeight: 1,
          fontFamily: "'Bebas Neue', 'Inter', sans-serif",
        }}
      >
        {score.toFixed(1)}
        <span style={{ fontSize: 36, color: "#64748b", marginLeft: 6 }}>/ 10</span>
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
        transform: `translateX(${(1 - appear) * -30}px)`,
        padding: "12px 16px",
        background: `${color}11`,
        border: `1.5px solid ${color}55`,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        gap: 12,
        minHeight: 52,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: color,
          color: "#0a0a0f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          fontWeight: 900,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 16,
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
  pulse: number;
}> = ({ avg, color, appear, pulse }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 40,
        right: 60,
        opacity: appear,
        transform: `scale(${appear * pulse})`,
        padding: "20px 36px",
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        borderRadius: 20,
        boxShadow: `0 20px 60px ${color}80`,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#0a0a0f",
          letterSpacing: 3,
          fontFamily: "Inter, sans-serif",
          textTransform: "uppercase",
        }}
      >
        Average
      </div>
      <div
        style={{
          marginTop: 4,
          fontSize: 64,
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
          fontSize: 18,
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
