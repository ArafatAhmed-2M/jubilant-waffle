import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, Audio, staticFile } from "remotion";
import { LEADERBOARD } from "./data";
import { AnimatedBackground } from "./visuals";

const PLACE_COLORS: Record<number, string> = {
  1: "#fbbf24",
  2: "#cbd5e1",
  3: "#fb923c",
};

export const Leaderboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const T = (frac: number) => Math.max(0, Math.floor(frac * durationInFrames));

  const titleAppear = spring({
    frame: frame - T(0.02),
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.6 },
  });

  return (
    <AbsoluteFill>
      <AnimatedBackground baseColor="#08080d" accentColor="#fbbf24" intensity={0.3} />
      <Audio src={staticFile("audio/leaderboard.mp3")} />

      <AbsoluteFill style={{ padding: "120px 80px 60px" }}>
        <div
          style={{
            opacity: titleAppear,
            transform: `translateY(${(1 - titleAppear) * 30}px)`,
            fontSize: 72,
            fontWeight: 900,
            textAlign: "center",
            fontFamily: "'Bebas Neue', 'Inter', sans-serif",
            background: "linear-gradient(135deg, #fff 0%, #fbbf24 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 6,
            marginBottom: 10,
            lineHeight: 1,
          }}
        >
          FINAL LEADERBOARD
        </div>

        {/* Podium - 2nd, 1st, 2nd layout */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: 20,
            marginBottom: 30,
            marginTop: 20,
            height: 220,
          }}
        >
          <PodiumColumn rank={2} model={LEADERBOARD[1]} delay={T(0.08)} height={140} />
          <PodiumColumn rank={1} model={LEADERBOARD[0]} delay={T(0.05)} height={200} />
          <PodiumColumn rank={2} model={LEADERBOARD[2]} delay={T(0.11)} height={140} />
        </div>

        {/* Table - fixed columns prevent overlap */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16,
            overflow: "hidden",
            backdropFilter: "blur(10px)",
            maxWidth: 1720,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "80px minmax(0,1fr) 80px 80px 100px",
              padding: "16px 24px",
              background: "rgba(255,255,255,0.06)",
              fontSize: 14,
              fontWeight: 700,
              color: "#94a3b8",
              letterSpacing: 2,
              fontFamily: "Inter, sans-serif",
              textTransform: "uppercase",
            }}
          >
            <div>RANK</div>
            <div>MODEL</div>
            <div style={{ textAlign: "center" }}>CODE</div>
            <div style={{ textAlign: "center" }}>LOOKS</div>
            <div style={{ textAlign: "right" }}>AVG</div>
          </div>

          {LEADERBOARD.map((row, i) => {
            const delay = T(0.20) + i * T(0.04);
            const appear = spring({
              frame: frame - delay,
              fps,
              config: { damping: 14, stiffness: 200, mass: 0.5 },
            });
            const agreed = Math.abs(row.code - row.looks) < 2;
            return (
              <div
                key={row.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px minmax(0,1fr) 80px 80px 100px",
                  padding: "14px 24px",
                  alignItems: "center",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  background: agreed
                    ? "linear-gradient(90deg, rgba(74, 222, 128, 0.08), transparent)"
                    : "linear-gradient(90deg, rgba(251, 146, 60, 0.08), transparent)",
                  opacity: appear,
                  transform: `translateX(${(1 - appear) * 60}px)`,
                  fontFamily: "Inter, sans-serif",
                  minHeight: 56,
                }}
              >
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    color: PLACE_COLORS[row.rank] || "#64748b",
                    fontFamily: "'Bebas Neue', 'Inter', sans-serif",
                  }}
                >
                  #{row.rank}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: row.color,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 32,
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
                <div style={{ fontSize: 20, color: "#fff", fontWeight: 600, textAlign: "center" }}>
                  {row.code.toFixed(1)}
                </div>
                <div style={{ fontSize: 20, color: "#fff", fontWeight: 600, textAlign: "center" }}>
                  {row.looks.toFixed(1)}
                </div>
                <div
                  style={{
                    fontSize: 24,
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

          {/* Legend - shown after all rows */}
          {frame >= T(0.55) && (
            <div
              style={{
                display: "flex",
                gap: 32,
                padding: "16px 24px",
                background: "rgba(0,0,0,0.3)",
                fontSize: 14,
                color: "#cbd5e1",
                fontFamily: "Inter, sans-serif",
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 24,
                    height: 14,
                    background: "linear-gradient(90deg, rgba(74, 222, 128, 0.3), transparent)",
                    border: "1px solid rgba(74, 222, 128, 0.4)",
                    borderRadius: 4,
                  }}
                />
                We agreed on the score
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 24,
                    height: 14,
                    background: "linear-gradient(90deg, rgba(251, 146, 60, 0.3), transparent)",
                    border: "1px solid rgba(251, 146, 60, 0.4)",
                    borderRadius: 4,
                  }}
                />
                We disagreed
              </span>
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const PodiumColumn: React.FC<{
  rank: number;
  model: typeof LEADERBOARD[number];
  delay: number;
  height: number;
}> = ({ rank, model, delay, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rise = spring({
    frame: frame - delay,
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.8 },
  });

  return (
    <div
      style={{
        width: 240,
        opacity: rise,
        transform: `translateY(${(1 - rise) * 200}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: 18,
          color: "#cbd5e1",
          fontWeight: 700,
          fontFamily: "Inter, sans-serif",
          marginBottom: 8,
          textAlign: "center",
          maxWidth: 240,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {model.name}
      </div>
      <div
        style={{
          fontSize: 56,
          fontWeight: 900,
          color: PLACE_COLORS[rank],
          fontFamily: "'Bebas Neue', 'Inter', sans-serif",
          lineHeight: 1,
          marginBottom: 12,
        }}
      >
        {model.avg.toFixed(2)}
      </div>
      <div
        style={{
          width: "100%",
          height: rise * height,
          background: `linear-gradient(180deg, ${PLACE_COLORS[rank]}, ${PLACE_COLORS[rank]}80)`,
          borderRadius: "16px 16px 0 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 48,
          fontWeight: 900,
          color: "#0a0a0f",
          fontFamily: "'Bebas Neue', 'Inter', sans-serif",
          boxShadow: `0 -10px 40px ${PLACE_COLORS[rank]}80`,
        }}
      >
        {rank}
      </div>
    </div>
  );
};
