import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Audio, staticFile } from "remotion";
import { AnimatedBackground, Watermark } from "./visuals";
import { LEADERBOARD } from "./data";
import { useWordSync, type Word } from "./useWordSync";

const COMMENT = "Drop a comment: which model surprised you most?";

type Props = { words?: Word[] };

export const Outro: React.FC<Props> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const T = (frac: number) => Math.max(0, Math.floor(frac * durationInFrames));

  const { phraseAt } = useWordSync(words);

  // Sync triggers to specific words in the outro audio
  // "That's the test." → t=0
  const titleAt = 0;
  // "very different results" → top-3 reveal (t=2.8)
  const top3At = phraseAt("very different", 0)?.start ?? T(0.20);
  // "Drop in the comments" → t=10.2
  const commentAt = phraseAt("Drop in the comments", 0)?.start ?? T(0.55);
  // "If this was useful, hit the like button" → t=12.8
  const likeAt = phraseAt("hit the like", 0)?.start ?? T(0.70);
  // "I'll see you in the next one" → final thanks
  const thanksAt = phraseAt("see you in the next one", 0)?.start ?? T(0.88);

  const titleAppear = spring({
    frame: frame - titleAt,
    fps,
    config: { damping: 12, stiffness: 160, mass: 0.6 },
  });

  const subBounce = spring({
    frame: frame - likeAt,
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.5 },
  });

  // Typewriter: char-by-char at ~12 chars per second synced to the audio pace
  // Total comment duration ≈ thanksAt - commentAt
  const totalCommentSec = Math.max(0.5, (thanksAt - commentAt) / fps);
  const charsPerSec = COMMENT.length / totalCommentSec;
  const charIndex = Math.min(
    COMMENT.length,
    Math.max(0, Math.floor((frame - commentAt) / fps * charsPerSec)),
  );

  // Like / Bell / Subscribe rows appear after subscribe bounce
  const ctaAppear = spring({
    frame: frame - likeAt,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
  });

  // Winner reveal pulse
  const winnerPulse = frame >= top3At ? 1 + Math.sin((frame - top3At) * 0.12) * 0.04 : 1;

  // Final thanks
  const thanksAppear = interpolate(frame, [thanksAt, thanksAt + Math.floor(0.5 * fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
              frame: frame - top3At - i * 5,
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
          <CTA icon="👍" label="LIKE" color="#3b82f6" delay={0} current={frame} t0={likeAt} fps={fps} />
          <CTA icon="🔔" label="BELL" color="#f59e0b" delay={3} current={frame} t0={likeAt} fps={fps} />
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
          <CTA icon="↗" label="SHARE" color="#10b981" delay={6} current={frame} t0={likeAt} fps={fps} />
          <CTA icon="💬" label="COMMENT" color="#8b5cf6" delay={9} current={frame} t0={likeAt} fps={fps} />
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
            opacity: frame >= commentAt ? 1 : 0,
            transform: `translateY(${frame >= commentAt ? 0 : 20}px)`,
          }}
        >
          💬 {COMMENT.substring(0, charIndex)}
          <span
            style={{
              opacity: frame % 30 < 15 ? 1 : 0,
              color: "#8b5cf6",
            }}
          >
            |
          </span>
        </div>

        {/* Final thanks line */}
        <div
          style={{
            textAlign: "center",
            opacity: thanksAppear,
            transform: `translateY(${(1 - thanksAppear) * 20}px)`,
            fontSize: 32,
            fontWeight: 800,
            color: "#fff",
            fontFamily: "'Bebas Neue', 'Inter', sans-serif",
            letterSpacing: 6,
            marginTop: 20,
          }}
        >
          THANKS FOR WATCHING 🎬
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
