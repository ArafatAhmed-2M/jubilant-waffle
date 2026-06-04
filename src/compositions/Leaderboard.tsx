import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { LEADERBOARD } from "./data";
import { AnimatedBackground } from "./visuals";
import { useWordSync, type Word } from "./useWordSync";

const PLACE_COLORS: Record<number, string> = {
  1: "#fbbf24",
  2: "#cbd5e1",
  3: "#fb923c",
};

const RANK_LABELS: Record<number, string> = {
  1: "1st",
  2: "T-2nd",
  3: "3rd",
};

// Map each leaderboard row to the first word that triggers its reveal
const ROW_TRIGGERS: string[] = [
  "First",   // 1st: Mini Max M3
  "Second",  // T-2nd: DeepSeek (reveals at "Second place, joint")
  "Second",  // T-2nd: BigPickle (same trigger as DeepSeek)
  "Third",   // 4th overall: MiMo
  "Fourth",  // 5th overall: Gemma
  "Fifth",   // 6th overall: Nemotron Super
  "Sixth",   // 7th overall: Nemotron Nano
];

const ROW_OCCURRENCES: number[] = [1, 1, 1, 1, 1, 1, 1];

type Props = { words?: Word[] };

export const Leaderboard: React.FC<Props> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { frameAt } = useWordSync(words);

  const titleAppear = spring({
    frame: frame - 0,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.6 },
  });

  // Each row's reveal frame
  const rowRevealFrames = LEADERBOARD.map((_, i) =>
    frameAt(ROW_TRIGGERS[i] ?? "First", ROW_OCCURRENCES[i] ?? 1),
  );

  // Top-3 callout appears just after first row
  const topReveal = spring({
    frame: frame - Math.max(0, (rowRevealFrames[0] || 0) - 6),
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.6 },
  });

  // Whole table container appears on "Here's the final leaderboard"
  const tableReveal = spring({
    frame: frame - Math.max(0, frameAt("leaderboard", 1) - 6),
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.6 },
  });

  return (
    <AbsoluteFill>
      <AnimatedBackground baseColor="#08080d" accentColor="#fbbf24" intensity={0.3} />
      <Audio src={staticFile("audio/leaderboard.mp3")} />

      <AbsoluteFill style={{ padding: "60px 80px", display: "flex", flexDirection: "column" }}>
        <div
          style={{
            opacity: titleAppear,
            transform: `translateY(${(1 - titleAppear) * 30}px)`,
            fontSize: 64,
            fontWeight: 900,
            textAlign: "center",
            fontFamily: "'Bebas Neue', 'Inter', sans-serif",
            background: "linear-gradient(135deg, #fff 0%, #fbbf24 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 6,
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          FINAL LEADERBOARD
        </div>
        <div
          style={{
            opacity: titleAppear,
            textAlign: "center",
            fontSize: 18,
            color: "#94a3b8",
            fontFamily: "Inter, sans-serif",
            letterSpacing: 4,
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          Code · Looks · Average
        </div>

        {/* Top 3 horizontal cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr 1fr",
            gap: 16,
            marginBottom: 28,
            opacity: topReveal,
            transform: `translateY(${(1 - topReveal) * 30}px)`,
          }}
        >
          {LEADERBOARD.slice(0, 3).map((m, i) => {
            const rank = i + 1;
            const color = PLACE_COLORS[rank];
            const label = RANK_LABELS[rank] || `${rank}th`;
            return (
              <div
                key={m.name}
                style={{
                  padding: "18px 20px",
                  background: `linear-gradient(135deg, ${color}30, ${color}0a)`,
                  border: `3px solid ${color}`,
                  borderRadius: 16,
                  textAlign: "center",
                  boxShadow: rank === 1 ? `0 0 50px ${color}80` : "none",
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: color,
                    letterSpacing: 4,
                    fontFamily: "Inter, sans-serif",
                    textTransform: "uppercase",
                  }}
                >
                  {label} PLACE
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    color: "#fff",
                    fontFamily: "'Bebas Neue', 'Inter', sans-serif",
                    marginTop: 6,
                    marginBottom: 4,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: 1.1,
                  }}
                >
                  {m.name}
                </div>
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 900,
                    color: color,
                    fontFamily: "'Bebas Neue', 'Inter', sans-serif",
                    lineHeight: 1,
                    marginTop: 4,
                  }}
                >
                  {m.avg.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Full leaderboard table */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 18,
            overflow: "hidden",
            backdropFilter: "blur(10px)",
            maxWidth: 1720,
            margin: "0 auto",
            width: "100%",
            opacity: tableReveal,
            transform: `translateY(${(1 - tableReveal) * 20}px)`,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr 160px 160px 180px",
              padding: "18px 32px",
              background: "rgba(255,255,255,0.08)",
              borderBottom: "2px solid rgba(255,255,255,0.15)",
            }}
          >
            <div style={headerStyle}>RANK</div>
            <div style={headerStyle}>MODEL</div>
            <div style={{ ...headerStyle, textAlign: "center" }}>CODE</div>
            <div style={{ ...headerStyle, textAlign: "center" }}>LOOKS</div>
            <div style={{ ...headerStyle, textAlign: "right" }}>AVERAGE</div>
          </div>

          {/* Rows */}
          {LEADERBOARD.map((row, i) => {
            const agreed = Math.abs(row.code - row.looks) < 2;
            const rowColor = PLACE_COLORS[row.rank] || row.color;
            const revealAt = rowRevealFrames[i] || 0;
            const appear = spring({
              frame: frame - revealAt,
              fps,
              config: { damping: 14, stiffness: 200, mass: 0.5 },
            });
            return (
              <div
                key={row.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr 160px 160px 180px",
                  padding: "16px 32px",
                  alignItems: "center",
                  borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
                  background: agreed
                    ? "linear-gradient(90deg, rgba(74, 222, 128, 0.10), transparent)"
                    : "linear-gradient(90deg, rgba(251, 146, 60, 0.10), transparent)",
                  opacity: appear,
                  transform: `translateX(${(1 - appear) * 80}px)`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 28,
                    fontWeight: 900,
                    color: rowColor,
                    fontFamily: "'Bebas Neue', 'Inter', sans-serif",
                  }}
                >
                  #{row.rank}
                  {row.rank === 2 && LEADERBOARD.filter((r) => r.rank === 2).length > 1 && (
                    <span
                      style={{
                        fontSize: 12,
                        color: "#94a3b8",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 700,
                        letterSpacing: 1,
                      }}
                    >
                      TIE
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 30,
                      background: row.color,
                      borderRadius: 3,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.name}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 24,
                    color: "#fff",
                    fontWeight: 700,
                    textAlign: "center",
                    fontFamily: "'Bebas Neue', 'Inter', sans-serif",
                  }}
                >
                  {row.code.toFixed(1)}
                </div>
                <div
                  style={{
                    fontSize: 24,
                    color: "#fff",
                    fontWeight: 700,
                    textAlign: "center",
                    fontFamily: "'Bebas Neue', 'Inter', sans-serif",
                  }}
                >
                  {row.looks.toFixed(1)}
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: row.color,
                    fontFamily: "'Bebas Neue', 'Inter', sans-serif",
                    textAlign: "right",
                  }}
                >
                  {row.avg.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            gap: 36,
            justifyContent: "center",
            marginTop: 20,
            opacity: interpolate(frame, [Math.max(0, frameAt("surprise", 1) - 6), frameAt("surprise", 1) + 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <span style={legendTextStyle}>
            <span
              style={{
                ...legendSwatchStyle,
                background: "linear-gradient(90deg, rgba(74, 222, 128, 0.4), transparent)",
                borderColor: "rgba(74, 222, 128, 0.6)",
              }}
            />
            We agreed on the score
          </span>
          <span style={legendTextStyle}>
            <span
              style={{
                ...legendSwatchStyle,
                background: "linear-gradient(90deg, rgba(251, 146, 60, 0.4), transparent)",
                borderColor: "rgba(251, 146, 60, 0.6)",
              }}
            />
            We disagreed
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const headerStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  color: "#cbd5e1",
  letterSpacing: 3,
  fontFamily: "Inter, sans-serif",
  textTransform: "uppercase",
};

const legendTextStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  fontSize: 18,
  color: "#cbd5e1",
  fontFamily: "Inter, sans-serif",
  fontWeight: 600,
};

const legendSwatchStyle: React.CSSProperties = {
  width: 32,
  height: 18,
  borderRadius: 4,
  border: "1px solid",
};
