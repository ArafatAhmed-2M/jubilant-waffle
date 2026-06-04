import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Audio, staticFile } from "remotion";
import { AnimatedBackground, Watermark } from "./visuals";
import { LEADERBOARD } from "./data";

const COMMENT = "Drop a comment: which model surprised you most?";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const T = (frac: number) => Math.max(0, Math.floor(frac * durationInFrames));

  const titleAppear = spring({
    frame: frame - T(0.02),
    fps,
    config: { damping: 12, stiffness: 160, mass: 0.6 },
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

  // Like / Bell / Subscribe rows appear after subscribe bounce
  const ctaAppear = spring({
    frame: frame - T(0.20),
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
  });

  // End card with watch-next
  const endCardAppear = interpolate(frame, [T(0.78), T(0.92)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Winner reveal pulse
  const winnerPulse = frame >= T(0.50) ? 1 + Math.sin((frame - T(0.50)) * 0.12) * 0.04 : 1;

  return (
    <AbsoluteFill>
      <AnimatedBackground baseColor="#08080d" accentColor="#8b5cf6" intensity={0.4} />
      <Audio src={staticFile("audio/outro.mp3")} />

      <AbsoluteFill style={{ padding: "60px 80px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* Title */}
        <div
          style={{
            textAlign: "center",
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
              letterSpacing: 8,
              lineHeight: 1,
              marginBottom: 16,
            }}
          >
            THAT'S THE TEST!
          </div>
          <div
            style={{
              opacity: titleAppear,
              fontSize: 22,
              color: "#94a3b8",
              fontFamily: "Inter, sans-serif",
              letterSpacing: 6,
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: 32,
            }}
          >
            7 free AI coding models · 1 impossible prompt · real results
          </div>
        </div>

        {/* Top 3 podium callout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr 1fr",
            gap: 20,
            marginBottom: 36,
            maxWidth: 1500,
            margin: "0 auto 36px",
            width: "100%",
          }}
        >
          {LEADERBOARD.slice(0, 3).map((m, i) => {
            const rank = i + 1;
            const colors = ["#cbd5e1", "#fbbf24", "#fb923c"];
            const color = colors[i];
            const appear = spring({
              frame: frame - T(0.10) - i * T(0.04),
              fps,
              config: { damping: 10, stiffness: 180, mass: 0.5 },
            });
            return (
              <div
                key={m.name}
                style={{
                  opacity: appear,
                  transform: `scale(${appear * (rank === 1 ? winnerPulse : 1)}) translateY(${(1 - appear) * 30}px)`,
                  padding: "20px 24px",
                  background: `linear-gradient(135deg, ${color}28, ${color}08)`,
                  border: `2px solid ${color}`,
                  borderRadius: 18,
                  textAlign: "center",
                  boxShadow: rank === 1 ? `0 0 50px ${color}80` : "none",
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    color: "#94a3b8",
                    fontWeight: 700,
                    letterSpacing: 3,
                    fontFamily: "Inter, sans-serif",
                    textTransform: "uppercase",
                  }}
                >
                  #{rank}
                </div>
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 900,
                    color: color,
                    fontFamily: "'Bebas Neue', 'Inter', sans-serif",
                    marginTop: 4,
                    marginBottom: 4,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {m.name}
                </div>
                <div
                  style={{
                    fontSize: 42,
                    fontWeight: 900,
                    color: "#fff",
                    fontFamily: "'Bebas Neue', 'Inter', sans-serif",
                    lineHeight: 1,
                  }}
                >
                  {m.avg.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 32,
            opacity: ctaAppear,
            transform: `translateY(${(1 - ctaAppear) * 30}px)`,
          }}
        >
          <CTA
            icon="👍"
            label="LIKE"
            color="#3b82f6"
            delay={0}
            current={frame}
            t0={T(0.22)}
            fps={fps}
          />
          <CTA
            icon="🔔"
            label="BELL"
            color="#f59e0b"
            delay={0.03}
            current={frame}
            t0={T(0.22)}
            fps={fps}
          />
          <button
            style={{
              transform: `scale(${subBounce})`,
              background: "linear-gradient(135deg, #ff0040, #ff4d6d)",
              color: "#fff",
              padding: "20px 60px",
              borderRadius: 999,
              fontSize: 34,
              fontWeight: 900,
              letterSpacing: 5,
              fontFamily: "Inter, sans-serif",
              boxShadow: "0 16px 60px rgba(255, 0, 64, 0.5)",
              border: "none",
              cursor: "pointer",
            }}
          >
            SUBSCRIBE
          </button>
          <CTA
            icon="↗"
            label="SHARE"
            color="#10b981"
            delay={0.06}
            current={frame}
            t0={T(0.22)}
            fps={fps}
          />
          <CTA
            icon="💬"
            label="COMMENT"
            color="#8b5cf6"
            delay={0.09}
            current={frame}
            t0={T(0.22)}
            fps={fps}
          />
        </div>

        {/* Comment typewriter */}
        <div
          style={{
            minHeight: 64,
            textAlign: "center",
            fontSize: 26,
            color: "#cbd5e1",
            fontWeight: 500,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: 1,
            padding: "20px 40px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16,
            backdropFilter: "blur(10px)",
            maxWidth: 1300,
            margin: "0 auto 24px",
            width: "fit-content",
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

        {/* End card with watch next */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 80,
            right: 80,
            opacity: endCardAppear,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 32px",
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16,
            backdropFilter: "blur(20px)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 14,
                color: "#64748b",
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
                fontFamily: "Inter, sans-serif",
                marginBottom: 4,
              }}
            >
              Up Next
            </div>
            <div
              style={{
                fontSize: 26,
                color: "#fff",
                fontWeight: 800,
                fontFamily: "'Bebas Neue', 'Inter', sans-serif",
                letterSpacing: 2,
              }}
            >
              I Made These 7 Models Fight in a Code Battle
            </div>
          </div>
          <div
            style={{
              fontSize: 18,
              color: "#94a3b8",
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Coming soon →
          </div>
        </div>
      </AbsoluteFill>

      <Watermark />
    </AbsoluteFill>
  );
};

const CTA: React.FC<{
  icon: string;
  label: string;
  color: string;
  delay: number;
  current: number;
  t0: number;
  fps: number;
}> = ({ icon, label, color, delay, current, t0, fps }) => {
  const appear = spring({
    frame: current - t0 - delay * fps,
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.5 },
  });
  return (
    <div
      style={{
        opacity: appear,
        transform: `translateY(${(1 - appear) * 20}px) scale(${0.7 + appear * 0.3})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <div
        style={{
          width: 70,
          height: 70,
          borderRadius: "50%",
          background: `${color}22`,
          border: `2px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 800,
          color: color,
          letterSpacing: 2,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {label}
      </div>
    </div>
  );
};
