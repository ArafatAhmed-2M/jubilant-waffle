import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
  staticFile,
} from "remotion";
import { AnimatedBackground, Watermark } from "./visuals";
import { SceneFrame } from "./SceneFrame";
import { LEADERBOARD } from "./data";
import { useSecToFrame, fadeIn } from "./utils";
import { C, FONT } from "./theme";

const COMMENT = "Drop a comment: which model surprised you most?";

/**
 * Outro scene — TEST 12/12 · 18.12s audio.
 * Brutalist: "THAT'S THE TEST!" Oswald headline, top-3 row, paste-the-prompt
 * block, monochrome CTAs, typewriter comment, big SUBSCRIBE button.
 */
export const Outro: React.FC<{ sceneIndex: number; sceneName: string }> = ({
  sceneIndex,
  sceneName,
}) => {
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

  // Typewriter over 10.2 → 12.8 (~2.6s)
  const totalCommentSec = 2.6;
  const charsPerSec = COMMENT.length / totalCommentSec;
  const charIndex = Math.min(
    COMMENT.length,
    Math.max(0, Math.floor(((frame - commentAt) / fps) * charsPerSec)),
  );

  const ctaAppear = spring({
    frame: frame - likeAt,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
  });

  // Shiny sweep: a diagonal highlight that moves across the winner card.
  // 2.5s cycle: starts off-left, ends off-right, then resets.
  const shineDur = Math.floor(2.5 * fps);
  const shinePhase = frame >= top3At
    ? ((frame - top3At) % shineDur) / shineDur
    : 0;
  const shineX = interpolate(shinePhase, [0, 1], [-60, 160]);

  // Cursor click animation — starts off-screen, moves to SUBSCRIBE button,
  // then "clicks" (small recoil) at the same time the Subscribe button bounces in.
  const cursorStart = T(14.6);
  const cursorEnd = T(15.6);
  const cursorTravel = interpolate(frame, [cursorStart, cursorEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorClick = frame >= T(15.6) && frame < T(15.9)
    ? 1 - Math.abs((frame - T(15.6)) / 3 - 0.5) * 2
    : frame >= T(15.9)
      ? 0
      : 0;
  const cursorOpacity = interpolate(
    frame,
    [cursorStart, cursorStart + 6, cursorEnd + 4, cursorEnd + 18],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // Subscribe button is roughly center-bottom of the screen.
  const cursorStartX = 1700;
  const cursorStartY = 950;
  const cursorEndX = 960;
  const cursorEndY = 640;
  const cursorX = cursorStartX + (cursorEndX - cursorStartX) * cursorTravel;
  const cursorY = cursorStartY + (cursorEndY - cursorStartY) * cursorTravel;
  const cursorScale = 1 - cursorClick * 0.18;

  const thanksAppear = fadeIn(frame, thanksAt, 16);

  return (
    <SceneFrame
      sceneIndex={sceneIndex}
      totalScenes={12}
      sceneName={sceneName}
      accentColor={C.text}
    >
      <AnimatedBackground baseColor={C.bg} accentColor={C.textMuted} intensity={0.18} />
      <Audio src={staticFile("audio/outro.mp3")} />

      <AbsoluteFill
        style={{
          padding: "110px 80px 90px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
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
            marginBottom: 12,
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
            Episode 12 // End Screen
          </div>
        </div>

        <div
          style={{
            textAlign: "left",
          }}
        >
          <div
            style={{
              opacity: titleAppear,
              transform: `translateY(${(1 - titleAppear) * 24}px)`,
              fontSize: 130,
              fontWeight: 700,
              fontFamily: FONT.display,
              color: C.text,
              letterSpacing: 6,
              lineHeight: 0.95,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            That's The Test.
          </div>
          <div
            style={{
              opacity: fadeIn(frame, subheadAt, 16),
              fontSize: 14,
              color: C.textMuted,
              fontFamily: FONT.mono,
              letterSpacing: 3,
              textTransform: "uppercase",
              fontWeight: 500,
              marginBottom: 24,
            }}
          >
            // 7 free AI coding models · 1 impossible prompt · real results
          </div>
        </div>

        {/* Top 3 podium row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr 1fr",
            gap: 10,
            marginBottom: 22,
            maxWidth: 1500,
            width: "100%",
          }}
        >
          {LEADERBOARD.slice(0, 3).map((m, i) => {
            const rank = i + 1;
            const isWinner = rank === 1;
            const appear = spring({
              frame: frame - top3At - i * 5,
              fps,
              config: { damping: 10, stiffness: 180, mass: 0.5 },
            });
            return (
              <div
                key={m.name}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  opacity: appear,
                  transform: `scale(${appear}) translateY(${(1 - appear) * 16}px)`,
                  padding: "16px 20px",
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderTop: `2px solid ${m.color}`,
                  textAlign: "left",
                }}
              >
                {isWinner && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "200%",
                      height: "100%",
                      background: `linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.32) 50%, transparent 65%)`,
                      transform: `translateX(${shineX}%)`,
                      pointerEvents: "none",
                      mixBlendMode: "screen",
                    }}
                  />
                )}
                <div
                  style={{
                    fontSize: 11,
                    color: C.textFaint,
                    fontWeight: 500,
                    fontFamily: FONT.mono,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  #{String(rank).padStart(2, "0")}
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 600,
                    color: C.text,
                    fontFamily: FONT.display,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: 1.1,
                    marginBottom: 6,
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
                      fontSize: 36,
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
                      fontSize: 12,
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

        {/* PASTE THE PROMPT block */}
        <div
          style={{
            marginBottom: 18,
            opacity: fadeIn(frame, pasteAt, 16),
            transform: `translateY(${(1 - fadeIn(frame, pasteAt, 16)) * 12}px)`,
            padding: "16px 22px",
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderLeft: `2px solid ${C.text}`,
            maxWidth: 1400,
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div style={{ fontSize: 28 }}>📋</div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: C.textFaint,
                fontWeight: 500,
                fontFamily: FONT.mono,
                letterSpacing: 3,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              // The Full Prompt Is In The Description
            </div>
            <div
              style={{
                fontSize: 18,
                color: C.text,
                fontWeight: 400,
                fontFamily: FONT.body,
              }}
            >
              Paste it into any model and see what your favourite produces.
            </div>
          </div>
        </div>

        {/* CTAs row — LIKE | SUBSCRIBE | SHARE, centered */}
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
            opacity: ctaAppear,
            transform: `translateY(${(1 - ctaAppear) * 16}px)`,
          }}
        >
          <CTA
            icon="👍"
            label="LIKE"
            color={C.text}
            delay={0}
            current={frame}
            t0={likeAt}
            fps={fps}
          />
          <button
            style={{
              position: "relative",
              transform: `scale(${subBounce})`,
              background: C.text,
              color: C.bg,
              padding: "20px 56px",
              borderRadius: 0,
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: 5,
              fontFamily: FONT.display,
              textTransform: "uppercase",
              border: "none",
              cursor: "pointer",
            }}
          >
            Subscribe
          </button>
          <CTA
            icon="🔗"
            label="SHARE"
            color={C.text}
            delay={1}
            current={frame}
            t0={likeAt}
            fps={fps}
          />
        </div>

        {/* Comment typewriter — centered */}
        <div
          style={{
            minHeight: 56,
            padding: "16px 22px",
            background: C.bg,
            border: `1px solid ${C.border}`,
            borderLeft: `2px solid ${C.text}`,
            maxWidth: 1400,
            margin: "0 auto 18px",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            opacity: fadeIn(frame, commentAt, 16),
            transform: `translateY(${(1 - fadeIn(frame, commentAt, 16)) * 12}px)`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: C.textFaint,
              fontWeight: 500,
              fontFamily: FONT.mono,
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            // Prompt
          </div>
          <div
            style={{
              fontSize: 22,
              color: C.text,
              fontWeight: 500,
              fontFamily: FONT.mono,
              letterSpacing: 0,
            }}
          >
            &gt; {COMMENT.substring(0, charIndex)}
            <span
              style={{
                opacity: frame % 30 < 15 ? 1 : 0,
                color: C.text,
              }}
            >
              _
            </span>
          </div>
        </div>

        {/* Final thanks — centered */}
        <div
          style={{
            textAlign: "center",
            opacity: thanksAppear,
            transform: `translateY(${(1 - thanksAppear) * 16}px)`,
            fontSize: 32,
            fontWeight: 700,
            color: C.text,
            fontFamily: FONT.display,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          ── Thanks For Watching.
        </div>
      </AbsoluteFill>

      <Watermark />

      {/* Cursor subscribing — flies in from bottom-right, "clicks" SUBSCRIBE */}
      {cursorOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            left: cursorX,
            top: cursorY,
            opacity: cursorOpacity,
            transform: `scale(${cursorScale})`,
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.5 3.21V20.79C5.5 21.24 6 21.49 6.36 21.18L11.43 17.06L13.03 21.21C13.18 21.55 13.55 21.74 13.92 21.66L15.43 21.32C15.8 21.24 16.04 20.88 15.96 20.51L14.5 14.51L20.34 14.51C20.85 14.51 21.15 13.95 20.85 13.54L6.05 2.92C5.7 2.62 5.18 2.85 5.13 3.29L5.5 3.21Z"
              fill="#ffffff"
              stroke="#000000"
              strokeWidth="0.6"
            />
          </svg>
          {cursorClick > 0.5 && (
            <div
              style={{
                position: "absolute",
                left: -16,
                top: -16,
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.5)",
                opacity: 1 - cursorClick,
              }}
            />
          )}
        </div>
      )}
    </SceneFrame>
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
  const isEmoji = /\p{Emoji}/u.test(icon);
  return (
    <div
      style={{
        opacity: appear,
        transform: `translateY(${(1 - appear) * 16}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          background: C.surface,
          border: `1px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isEmoji ? 30 : 22,
          color: color,
          fontFamily: FONT.mono,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: C.textFaint,
          letterSpacing: 3,
          fontFamily: FONT.mono,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
};
