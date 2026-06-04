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
import { useSecToFrame, fadeIn } from "./utils";

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

/**
 * ModelReveal — generic per-model scene driven by `data.schedule`.
 *
 * Every model has a `schedule` (in seconds) read from its audio JSON.
 * Convert each value to a frame via `T(sec)` and use the result as the
 * exact frame where the element should appear.
 *
 * Visual structure:
 *   ┌──────────────────────────────────┬──────────────────┐
 *   │ TAGLINE                          │                  │
 *   │ MODEL NAME (huge)                │   [BROWSER]      │
 *   ├──────────────────────────────────┤                  │
 *   │ [CODE]   [LOOKS]                 │                  │
 *   │ [INFO CARD]                      │                  │
 *   │ [PROS]    [CONS]                 │                  │
 *   └──────────────────────────────────┴──────────────────┘
 *   ┌─[AVERAGE badge top-right]─┐
 */
export const ModelReveal: React.FC<Props> = ({ data, audioFile }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const T = useSecToFrame();

  const s = data.schedule;

  const nameSize = getNameSize(data.name);

  // Cross-fade out at the very end of the scene
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 24, durationInFrames - 4],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <AnimatedBackground baseColor="#08080d" accentColor={data.color} intensity={0.4} />
      <Audio src={staticFile(audioFile)} />

      <AbsoluteFill style={{ padding: "50px 70px", display: "flex", flexDirection: "column" }}>
        {/* Top: tagline + name */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              opacity: fadeIn(frame, T(s.taglineAt), 16),
              transform: `translateY(${(1 - fadeIn(frame, T(s.taglineAt), 16)) * 16}px)`,
              fontSize: 22,
              fontWeight: 800,
              color: data.color,
              letterSpacing: 6,
              textTransform: "uppercase",
              fontFamily: "Inter, sans-serif",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span>#{data.placement} Place</span>
            {data.placement === 1 && (
              <span
                style={{
                  padding: "4px 12px",
                  background: "#fbbf24",
                  color: "#0a0a0f",
                  borderRadius: 999,
                  fontSize: 14,
                  letterSpacing: 2,
                }}
              >
                👑 WINNER
              </span>
            )}
            <span style={{ color: "#94a3b8" }}>· {data.tagline}</span>
          </div>

          <div
            style={{
              opacity: fadeIn(frame, T(s.nameAt), 16),
              transform: `translateX(${(1 - fadeIn(frame, T(s.nameAt), 16)) * -200}px)`,
              fontSize: nameSize,
              fontWeight: 900,
              lineHeight: 1.05,
              fontFamily: "'Bebas Neue', 'Inter', sans-serif",
              background: `linear-gradient(135deg, #ffffff 0%, ${data.color} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: 2,
              textShadow: `0 0 80px ${data.color}40`,
              whiteSpace: "nowrap",
              overflow: "hidden",
              paddingBottom: 8,
            }}
          >
            {data.name}
          </div>
        </div>

        {/* Main 2-column content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 1fr",
            gap: 36,
            alignItems: "stretch",
            flex: 1,
            minHeight: 0,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18, minHeight: 0 }}>
            <div style={{ display: "flex", gap: 16 }}>
              <ScoreCard
                label="CODE"
                score={data.myScore}
                color={data.color}
                appear={fadeIn(frame, T(s.codeScoreAt), 18)}
              />
              <ScoreCard
                label="LOOKS"
                score={data.yourScore}
                color={data.color}
                appear={fadeIn(frame, T(s.looksScoreAt), 18)}
              />
            </div>

            <InfoCard
              maker={data.maker}
              params={data.params}
              license={data.license}
              release={data.release}
              info={data.info}
              color={data.color}
              appear={fadeIn(frame, T(s.infoAt), 18)}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, flex: 1 }}>
              <BulletList
                items={data.pros}
                color="#4ade80"
                icon="✓"
                label="PROS"
                startFrame={T(s.prosAt)}
                frame={frame}
                fps={fps}
              />
              <BulletList
                items={data.cons}
                color="#ff4d6d"
                icon="✕"
                label="CONS"
                startFrame={T(s.consAt)}
                frame={frame}
                fps={fps}
              />
            </div>
          </div>

          <div style={{ position: "relative", display: "flex", alignItems: "stretch" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <BrowserFrame
                screenshot={`screenshots/${data.id}.png`}
                url={data.url}
                appear={fadeIn(frame, T(s.browserAt), 20)}
              />
              <div
                style={{
                  marginTop: 20,
                  padding: "14px 18px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  opacity: fadeIn(frame, T(s.browserAt) + Math.floor(1.0 * fps), 18),
                  transform: `translateY(${(1 - fadeIn(frame, T(s.browserAt) + Math.floor(1.0 * fps), 18)) * 20}px)`,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "#94a3b8",
                    fontWeight: 800,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    marginBottom: 4,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Live preview
                </div>
                <div
                  style={{
                    fontSize: 16,
                    color: "#cbd5e1",
                    fontWeight: 500,
                    lineHeight: 1.4,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  What {data.name} generated for the prompt — running live in the browser above.
                </div>
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* AVERAGE badge (top-right) */}
      <FinalBadge
        avg={data.avg}
        color={data.color}
        appear={fadeIn(frame, T(s.averageAt), 18)}
      />
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
        transform: `scale(${0.85 + appear * 0.15}) translateY(${(1 - appear) * 20}px)`,
        flex: 1,
        padding: "20px 24px",
        background: `linear-gradient(135deg, ${color}22, ${color}08)`,
        border: `2px solid ${color}`,
        borderRadius: 18,
        backdropFilter: "blur(20px)",
        boxShadow: `0 0 40px ${color}30`,
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: "#94a3b8",
          letterSpacing: 4,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {label} SCORE
      </div>
      <div
        style={{
          marginTop: 4,
          fontSize: 76,
          fontWeight: 900,
          color: color,
          lineHeight: 1,
          fontFamily: "'Bebas Neue', 'Inter', sans-serif",
        }}
      >
        {score.toFixed(1)}
        <span style={{ fontSize: 28, color: "#64748b", marginLeft: 4 }}>/ 10</span>
      </div>
    </div>
  );
};

const BulletList: React.FC<{
  items: string[];
  color: string;
  icon: string;
  label: string;
  startFrame: number;
  frame: number;
  fps: number;
}> = ({ items, color, icon, label, startFrame, frame, fps }) => {
  return (
    <div
      style={{
        padding: "14px 16px",
        background: `${color}0d`,
        border: `1.5px solid ${color}55`,
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 900,
          color: color,
          letterSpacing: 3,
          fontFamily: "Inter, sans-serif",
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      {items.map((text, i) => {
        const delay = startFrame + i * 8;
        const appear = spring({
          frame: frame - delay,
          fps,
          config: { damping: 14, stiffness: 200, mass: 0.5 },
        });
        return (
          <div
            key={text}
            style={{
              opacity: appear,
              transform: `translateX(${(1 - appear) * -20}px)`,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: color,
                color: "#0a0a0f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 900,
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
            <div
              style={{
                fontSize: 15,
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
      })}
    </div>
  );
};

const FinalBadge: React.FC<{
  avg: number;
  color: string;
  appear: number;
}> = ({ avg, color, appear }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 50,
        right: 60,
        opacity: appear,
        transform: `scale(${0.7 + appear * 0.3})`,
        padding: "20px 36px",
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        borderRadius: 22,
        boxShadow: `0 16px 50px ${color}80`,
        textAlign: "center",
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 800,
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
          marginTop: 2,
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
          fontSize: 16,
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
