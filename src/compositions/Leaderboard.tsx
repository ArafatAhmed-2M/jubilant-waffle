import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Audio,
  staticFile,
} from "remotion";
import { LEADERBOARD } from "./data";
import { AnimatedBackground } from "./visuals";
import { SceneFrame } from "./SceneFrame";
import { useSecToFrame, fadeIn } from "./utils";
import { C, FONT } from "./theme";

const RANK_LABELS: Record<number, string> = {
  1: "1ST",
  2: "T-2ND",
  3: "3RD",
};

/**
 * Per-row reveal time (in seconds), read directly from leaderboard.json.
 * Order matches LEADERBOARD in data.ts.
 */
const ROW_REVEAL_SEC = [
  2.9,    // 1st: Mini Max M3       (audio: "First place,")
  7.36,   // T-2nd: DeepSeek Flash  (audio: "Second place, joint,")
  7.36,   // T-2nd: Big Pickle      (same trigger)
  13.16,  // 3rd: MiMo v2.5         (audio: "Third place,")
  17.88,  // 4th: Gemma 4 31B       (audio: "Fourth,")
  21.06,  // 5th: Nemotron 3 Super  (audio: "Fifth,")
  24.38,  // 6th: Nemotron Nano     (audio: "Sixth,")
];

/**
 * Leaderboard scene — TEST 10/12 · 37.38s audio.
 * Brutalist: "FINAL LEADERBOARD" Oswald headline, top-3 as a 3-column
 * bordered row, then a clean hairlined table with mono numbers.
 */
export const Leaderboard: React.FC<{ sceneIndex: number; sceneName: string }> = ({
  sceneIndex,
  sceneName,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = useSecToFrame();

  const titleAt = T(0.0);
  const subheadAt = T(1.28);
  const tableRevealAt = T(1.66);
  const top3RevealAt = T(2.9);
  const legendAt = T(27.44);

  const titleAppear = spring({
    frame: frame - titleAt,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.6 },
  });

  const tableReveal = spring({
    frame: frame - tableRevealAt,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.6 },
  });

  const topReveal = spring({
    frame: frame - top3RevealAt,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.6 },
  });

  return (
    <SceneFrame
      sceneIndex={sceneIndex}
      totalScenes={12}
      sceneName={sceneName}
      accentColor={C.text}
    >
      <AnimatedBackground baseColor={C.bg} accentColor={C.textMuted} intensity={0.18} />
      <Audio src={staticFile("audio/leaderboard.mp3")} />

      <AbsoluteFill
        style={{
          padding: "110px 80px 90px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            opacity: titleAppear,
            transform: `translateX(${(1 - titleAppear) * -16}px)`,
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 14,
          }}
        >
          <div style={{ width: 40, height: 1, background: C.text }} />
          <div
            style={{
              fontSize: 12,
              color: C.textMuted,
              fontFamily: FONT.mono,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Episode 10 // Final Standings
          </div>
        </div>

        <div
          style={{
            opacity: titleAppear,
            transform: `translateY(${(1 - titleAppear) * 24}px)`,
            fontSize: 96,
            fontWeight: 700,
            fontFamily: FONT.display,
            color: C.text,
            letterSpacing: 4,
            lineHeight: 0.95,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Final Leaderboard
        </div>
        <div
          style={{
            opacity: fadeIn(frame, subheadAt, 14),
            fontSize: 13,
            color: C.textMuted,
            fontFamily: FONT.mono,
            letterSpacing: 3,
            textTransform: "uppercase",
            fontWeight: 500,
            marginBottom: 22,
          }}
        >
          // Code · Looks · Average
        </div>

        {/* Top 3 row — 3 columns, no gradient, just borders */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr 1fr",
            gap: 10,
            marginBottom: 24,
            opacity: topReveal,
            transform: `translateY(${(1 - topReveal) * 24}px)`,
          }}
        >
          {LEADERBOARD.slice(0, 3).map((m, i) => {
            const rank = i + 1;
            const label = RANK_LABELS[rank] || `${rank}TH`;
            const isWinner = rank === 1;
            const cardAppear = spring({
              frame: frame - top3RevealAt - i * 6,
              fps,
              config: { damping: 12, stiffness: 200, mass: 0.5 },
            });
            return (
              <div
                key={m.name}
                style={{
                  opacity: cardAppear,
                  transform: `translateY(${(1 - cardAppear) * 16}px)`,
                  padding: "18px 20px",
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderTop: `2px solid ${isWinner ? m.color : C.textFaint}`,
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: C.textFaint,
                      fontFamily: FONT.mono,
                      letterSpacing: 3,
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </div>
                  {isWinner && (
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 500,
                        color: m.color,
                        fontFamily: FONT.mono,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                      }}
                    >
                      ★ Winner
                    </div>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    color: C.text,
                    fontFamily: FONT.display,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: 1.1,
                    marginBottom: 8,
                  }}
                >
                  {m.name}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      fontSize: 44,
                      fontWeight: 700,
                      color: m.color,
                      fontFamily: FONT.display,
                      lineHeight: 1,
                    }}
                  >
                    {m.avg.toFixed(2)}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: C.textFaint,
                      fontFamily: FONT.mono,
                    }}
                  >
                    / 10
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full leaderboard table — clean hairline rows */}
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            maxWidth: 1720,
            margin: "0 auto",
            width: "100%",
            opacity: tableReveal,
            transform: `translateY(${(1 - tableReveal) * 16}px)`,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "100px 1fr 140px 140px 160px",
              padding: "14px 24px",
              borderBottom: `1px solid ${C.border}`,
              background: C.bgRaised,
            }}
          >
            <div style={headerStyle}>#</div>
            <div style={headerStyle}>Model</div>
            <div style={{ ...headerStyle, textAlign: "center" }}>Code</div>
            <div style={{ ...headerStyle, textAlign: "center" }}>Looks</div>
            <div style={{ ...headerStyle, textAlign: "right" }}>Average</div>
          </div>

          {/* Rows */}
          {LEADERBOARD.map((row, i) => {
            const rowColor = row.color;
            const revealAt = T(ROW_REVEAL_SEC[i] ?? 0);
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
                  gridTemplateColumns: "100px 1fr 140px 140px 160px",
                  padding: "14px 24px",
                  alignItems: "center",
                  borderBottom:
                    i === LEADERBOARD.length - 1
                      ? "none"
                      : `1px solid ${C.border}`,
                  opacity: appear,
                  transform: `translateX(${(1 - appear) * 60}px)`,
                  background: i % 2 === 0 ? C.surface : C.surfaceAlt,
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: rowColor,
                    fontFamily: FONT.display,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {String(row.rank).padStart(2, "0")}
                  {row.rank === 2 && LEADERBOARD.filter((r) => r.rank === 2).length > 1 && (
                    <span
                      style={{
                        fontSize: 10,
                        color: C.textMuted,
                        fontFamily: FONT.mono,
                        fontWeight: 500,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                      }}
                    >
                      TIE
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    color: C.text,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    overflow: "hidden",
                    fontFamily: FONT.body,
                  }}
                >
                  <div
                    style={{
                      width: 4,
                      height: 24,
                      background: rowColor,
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
                    fontSize: 20,
                    color: C.text,
                    fontWeight: 500,
                    textAlign: "center",
                    fontFamily: FONT.mono,
                  }}
                >
                  {row.code.toFixed(1)}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    color: C.text,
                    fontWeight: 500,
                    textAlign: "center",
                    fontFamily: FONT.mono,
                  }}
                >
                  {row.looks.toFixed(1)}
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: rowColor,
                    fontFamily: FONT.display,
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
            gap: 28,
            justifyContent: "center",
            marginTop: 18,
            opacity: fadeIn(frame, legendAt, 16),
            transform: `translateY(${(1 - fadeIn(frame, legendAt, 16)) * 8}px)`,
          }}
        >
          <span style={legendTextStyle}>
            <span
              style={{
                ...legendSwatchStyle,
                background: C.surface,
                borderColor: C.positive,
              }}
            />
            <span style={{ color: C.textFaint }}>//</span> agreed
          </span>
          <span style={legendTextStyle}>
            <span
              style={{
                ...legendSwatchStyle,
                background: C.surface,
                borderColor: C.warn,
              }}
            />
            <span style={{ color: C.textFaint }}>//</span> disagreed
          </span>
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};

const headerStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: C.textFaint,
  letterSpacing: 3,
  fontFamily: FONT.mono,
  textTransform: "uppercase",
};

const legendTextStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 13,
  color: C.textMuted,
  fontFamily: FONT.mono,
  fontWeight: 400,
  letterSpacing: 1,
  textTransform: "uppercase",
};

const legendSwatchStyle: React.CSSProperties = {
  width: 30,
  height: 14,
  border: `1px solid`,
};
