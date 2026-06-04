import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, Audio, staticFile } from "remotion";
import { AnimatedBackground, Watermark } from "./visuals";
import { LEADERBOARD } from "./data";
import { useSecToFrame, fadeIn } from "./utils";

const COMMENT = "Drop a comment: which model surprised you most?";

/**
 * Outro scene — 18.12s audio.
 *
 * Hand-picked timing read directly from outro.json transcript:
 *   0.0   "That's the test."    → "THAT'S THE TEST!" title
 *   1.24  "Seven models..."     → subhead + top-3 podium
 *   2.8   "very different..."   → top-3 reveal
 *   6.52  "Paste it into..."    → "PASTE THE PROMPT" instruction
 *  10.2   "Drop in the comments"→ comment typewriter
 *  13.96  "hit the like"        → like + bell CTAs
 *  15.12  "It genuinely helps"  → subscribe button
 *  16.82  "and I'll see you"    → final thanks line
 */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = useSecToFrame();

  const titleAt = T(0.0);
  const subheadAt = T(1.24);
  const top3At = T(2.8);
  const pasteAt = T(6.52);
  const commentAt = T(10.2);
  const likeAt = T(13.96);
  const subscribeAt = T(15.12);
  const thanksAt = T(16.82);

  const titleAppear = spring({
    frame: frame - titleAt,
    fps,
    config: { damping: 12, stiffness: 160, mass: 0.6 },
  });

  const subBounce = spring({
    frame: frame - subscribeAt,
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.5 },
  });

  // Typewriter: char-by-char over the spoken comment window (10.2 → 12.8 = "Drop in the comments" duration)
  const totalCommentSec = 2.6; // ~how long the user takes to say the comment
  const charsPerSec = COMMENT.length / totalCommentSec;
  const charIndex = Math.min(
    COMMENT.length,
    Math.max(0, Math.floor((frame - commentAt) / fps * charsPerSec)),
  );

  // CTA row appears with likeAt
  const ctaAppear = spring({
    frame: frame - likeAt,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
  });

  // Winner reveal pulse
  const winnerPulse = frame >= top3At ? 1 + Math.sin((frame - top3At) * 0.12) * 0.04 : 1;

  // Final thanks
  const thanksAppear = fadeIn(frame, thanksAt, 16);

  return (
    <AbsoluteFill>
      <AnimatedBackground baseColor="#08080d" accentColor="#8b5cf6" intensity={0.4} />
      <Audio src={staticFile("audio/outro.mp3")} />

      <AbsoluteFill
        style={{
          padding: "60px 80px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
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
              opacity: fadeIn(frame, subheadAt, 16),
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

        {/* Top 3 podium callout — appears at 2.8s on "very different results" */}
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

        {/* PASTE THE PROMPT instruction — appears at 6.52s */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 24,
            opacity: fadeIn(frame, pasteAt, 16),
            transform: `translateY(${(1 - fadeIn(frame, pasteAt, 16)) * 16}px)`,
            padding: "16px 32px",
            background: "rgba(34, 211, 238, 0.1)",
            border: "1.5px solid rgba(34, 211, 238, 0.5)",
            borderRadius: 14,
            maxWidth: 1300,
            margin: "0 auto 24px",
            width: "fit-content",
          }}
        >
          <div
            style={{
              fontSize: 14,
              color: "#67e8f9",
              fontWeight: 800,
              letterSpacing: 4,
              marginBottom: 6,
              fontFamily: "Inter, sans-serif",
              textTransform: "uppercase",
            }}
          >
            📋 The full prompt is in the description
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#cbd5e1",
              fontWeight: 500,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Paste it into any model and see what your favourite produces.
          </div>
        </div>

        {/* CTAs — appear at 13.96s on "hit the like" */}
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

        {/* Comment typewriter — appears at 10.2s on "Drop in the comments" */}
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
            opacity: fadeIn(frame, commentAt, 16),
            transform: `translateY(${(1 - fadeIn(frame, commentAt, 16)) * 20}px)`,
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

        {/* Final thanks line — appears at 16.82s on "and I'll see you in the next one" */}
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
