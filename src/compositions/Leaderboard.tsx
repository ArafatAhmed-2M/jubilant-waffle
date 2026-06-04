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
  const { fps } = useVideoConfig();

  const titleAppear = spring({
    frame: frame - 0.3 * fps,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.6 },
  });

  return (
    <AbsoluteFill>
      <AnimatedBackground baseColor="#08080d" accentColor="#fbbf24" intensity={0.3} />
      <Audio src={staticFile("audio/leaderboard.mp3")} />

      <AbsoluteFill style={{ padding: "80px 100px" }}>
        <div
          style={{
            opacity: titleAppear,
            transform: `translateY(${(1 - titleAppear) * 30}px)`,
            fontSize: 100,
            fontWeight: 900,
            textAlign: "center",
            fontFamily: "'Bebas Neue', 'Inter', sans-serif",
            background: "linear-gradient(135deg, #fff 0%, #fbbf24 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 8,
            marginBottom: 40,
          }}
        >
          FINAL LEADERBOARD
        </div>

        {/* Podium */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: 24,
            marginBottom: 50,
            height: 280,
          }}
        >
          <PodiumColumn rank={2} model={LEADERBOARD[1]} delay={1.5 * fps} height={180} />
          <PodiumColumn rank={1} model={LEADERBOARD[0]} delay={1 * fps} height={240} />
          <PodiumColumn rank={2} model={LEADERBOARD[2]} delay={2 * fps} height={180} />
        </div>

        {/* Table */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16,
            overflow: "hidden",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "100px 1fr 200px 200px 200px",
              padding: "20px 32px",
              background: "rgba(255,255,255,0.06)",
              fontSize: 18,
              fontWeight: 700,
              color: "#94a3b8",
              letterSpacing: 2,
              fontFamily: "Inter, sans-serif",
              textTransform: "uppercase",
            }}
          >
            <div>RANK</div>
            <div>MODEL</div>
            <div>CODE</div>
            <div>LOOKS</div>
            <div>AVERAGE</div>
          </div>

          {LEADERBOARD.map((row, i) => {
            const delay = 3 * fps + i * 0.3 * fps;
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
                  gridTemplateColumns: "100px 1fr 200px 200px 200px",
                  padding: "24px 32px",
                  alignItems: "center",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  background: agreed
                    ? "linear-gradient(90deg, rgba(74, 222, 128, 0.08), transparent)"
                    : "linear-gradient(90deg, rgba(251, 146, 60, 0.08), transparent)",
                  opacity: appear,
                  transform: `translateX(${(1 - appear) * 80}px)`,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 900,
                    color: PLACE_COLORS[row.rank] || "#64748b",
                    fontFamily: "'Bebas Neue', 'Inter', sans-serif",
                  }}
                >
                  #{row.rank}
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: row.color,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 40,
                      background: row.color,
                      borderRadius: 4,
                    }}
                  />
                  {row.name}
                  {!agreed && (
                    <span
                      style={{
                        fontSize: 14,
                        color: "#fb923c",
                        background: "rgba(251, 146, 60, 0.15)",
                        padding: "4px 10px",
                        borderRadius: 6,
                        fontWeight: 700,
                        letterSpacing: 1,
                      }}
                    >
                      DISAGREED
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 24, color: "#fff", fontWeight: 600 }}>
                  {row.code.toFixed(1)}
                </div>
                <div style={{ fontSize: 24, color: "#fff", fontWeight: 600 }}>
                  {row.looks.toFixed(1)}
                </div>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 900,
                    color: row.color,
                    fontFamily: "'Bebas Neue', 'Inter', sans-serif",
                  }}
                >
                  {row.avg.toFixed(2)}
                </div>
              </div>
            );
          })}
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
        width: 280,
        opacity: rise,
        transform: `translateY(${(1 - rise) * 200}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: 22,
          color: "#cbd5e1",
          fontWeight: 700,
          fontFamily: "Inter, sans-serif",
          marginBottom: 12,
          textAlign: "center",
        }}
      >
        {model.name}
      </div>
      <div
        style={{
          fontSize: 80,
          fontWeight: 900,
          color: PLACE_COLORS[rank],
          fontFamily: "'Bebas Neue', 'Inter', sans-serif",
          lineHeight: 1,
          marginBottom: 16,
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
          fontSize: 60,
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
