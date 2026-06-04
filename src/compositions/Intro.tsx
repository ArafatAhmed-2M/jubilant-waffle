import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Audio,
  staticFile,
} from "remotion";
import { AnimatedBackground, Watermark } from "./visuals";
import { SceneFrame } from "./SceneFrame";
import { useSecToFrame, fadeIn } from "./utils";
import { C, FONT } from "./theme";

const MODEL_PILLS = [
  { id: "01", color: "#8b5cf6" },
  { id: "02", color: "#22d3ee" },
  { id: "03", color: "#4ade80" },
  { id: "04", color: "#fb923c" },
  { id: "05", color: "#60a5fa" },
  { id: "06", color: "#76b900" },
  { id: "07", color: "#c8f500" },
];

/**
 * Intro scene — TEST 01/12 · 28.66s audio.
 *
 * Hand-picked timing read directly from intro.json transcript:
 *   0.0  "What's up everyone today?"  → "Hi 👋" card (clears at 1.7s)
 *   2.04 "We're doing something fun." → "🎉 FUN." meme (clears at 3.3s)
 *   3.48 "I gave seven..."            → "7 FREE AI MODELS" title
 *   6.46 "...free AI coding models"   → 7 anonymous AI pills
 *   7.82 "...the exact same prompt"   → "One Prompt · One HTML File · No Libraries"
 *   8.16 "Build a full OS..."         → big prompt code block
 *  18.94 "...the results"             → "// THE RESULTS" label
 *  22.0  "absolutely crushed it"      → 👑 WINNER badge (stays)
 *  23.94 "broke on line 3"            → 💀 BROKEN badge (stays)
 *  27.1  "Let's get into it"          → closing line (badges remain visible)
 *
 * No model names anywhere — they're revealed one-by-one in the per-model
 * scenes that follow. Winner/broken badges persist through the end so the
 * viewer can read them while the closing line plays.
 */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = useSecToFrame();

  const titleAt = T(3.48);
  const subtitleAt = T(7.5);
  const pillBaseAt = T(5.5);
  const promptAt = T(8.16);
  const resultsAt = T(18.94);
  const winnerAt = T(22.0);
  const brokeAt = T(23.94);
  const seeAt = T(27.1);

  // Hi card: visible 0.0 → 1.7s, with quick fade in/out
  const hiOpacity = frame < T(0.0) + Math.floor(0.3 * fps)
    ? (frame - T(0.0)) / Math.floor(0.3 * fps)
    : frame < T(1.4)
      ? 1
      : frame < T(1.7)
        ? 1 - (frame - T(1.4)) / Math.floor(0.3 * fps)
        : 0;

  // Meme card: visible 1.9 → 3.3s
  const memeOpacity = frame < T(1.9)
    ? 0
    : frame < T(2.2)
      ? (frame - T(1.9)) / Math.floor(0.3 * fps)
      : frame < T(3.0)
        ? 1
        : frame < T(3.3)
          ? 1 - (frame - T(3.0)) / Math.floor(0.3 * fps)
          : 0;

  const titleProgress = fadeIn(frame, titleAt, 18);
  const subtitleProgress = fadeIn(frame, subtitleAt, 18);
  const promptProgress = fadeIn(frame, promptAt, 20);
  const resultsProgress = fadeIn(frame, resultsAt, 16);
  const seeProgress = fadeIn(frame, seeAt, 16);

  return (
    <SceneFrame sceneIndex={1} totalScenes={12} sceneName="The Hook" accentColor={C.textMuted}>
      <AnimatedBackground baseColor={C.bg} accentColor={C.textMuted} />
      <Audio src={staticFile("audio/intro.mp3")} />

      {/* "Hi 👋" card — visible during "What's up everyone today?" */}
      {hiOpacity > 0 && (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            opacity: hiOpacity,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                fontSize: 240,
                fontWeight: 700,
                lineHeight: 1,
                fontFamily: FONT.display,
                color: C.text,
                letterSpacing: -2,
                textTransform: "uppercase",
              }}
            >
              Hi
            </div>
            <div
              style={{
                fontSize: 11,
                color: C.textFaint,
                fontFamily: FONT.mono,
                letterSpacing: 4,
                textTransform: "uppercase",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ width: 32, height: 1, background: C.textFaint }} />
              <span>// welcome</span>
              <div style={{ width: 32, height: 1, background: C.textFaint }} />
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* "🎉 FUN." meme — visible during "we're doing something really fun" */}
      {memeOpacity > 0 && (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            opacity: memeOpacity,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              transform: `scale(${1 + (1 - memeOpacity) * 0.1})`,
            }}
          >
            <div style={{ fontSize: 180, lineHeight: 1 }}>🎉</div>
            <div
              style={{
                fontSize: 110,
                fontWeight: 700,
                lineHeight: 1,
                fontFamily: FONT.display,
                color: C.text,
                letterSpacing: 4,
                textTransform: "uppercase",
              }}
            >
              Fun.
            </div>
            <div
              style={{
                fontSize: 11,
                color: C.textFaint,
                fontFamily: FONT.mono,
                letterSpacing: 4,
                textTransform: "uppercase",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ width: 32, height: 1, background: C.textFaint }} />
              <span>// bear with me</span>
              <div style={{ width: 32, height: 1, background: C.textFaint }} />
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Main intro content — starts at 3.48s */}
      {frame >= titleAt && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              textAlign: "center",
              padding: "0 80px",
              maxWidth: 1720,
            }}
          >
            {/* TITLE */}
            <div
              style={{
                opacity: titleProgress,
                transform: `translateY(${(1 - titleProgress) * 40}px)`,
                fontSize: 160,
                fontWeight: 700,
                letterSpacing: 6,
                lineHeight: 1,
                fontFamily: FONT.display,
                color: C.text,
                textTransform: "uppercase",
              }}
            >
              7 Free AI Models
            </div>

            {/* SUBTITLE */}
            <div
              style={{
                opacity: subtitleProgress,
                transform: `translateY(${(1 - subtitleProgress) * 20}px)`,
                marginTop: 24,
                fontSize: 22,
                fontWeight: 500,
                color: C.textMuted,
                letterSpacing: 4,
                fontFamily: FONT.mono,
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
              }}
            >
              <span>One Prompt</span>
              <span style={{ color: C.textFaint }}>·</span>
              <span>One HTML File</span>
              <span style={{ color: C.textFaint }}>·</span>
              <span>No Libraries</span>
            </div>

            {/* MODEL PILLS — anonymous, just "AI #01"..#07 */}
            {frame >= pillBaseAt && (
              <div
                style={{
                  marginTop: 44,
                  display: "flex",
                  gap: 10,
                  justifyContent: "center",
                  flexWrap: "wrap",
                  maxWidth: 1600,
                }}
              >
                {MODEL_PILLS.map((pill, i) => {
                  const delay = pillBaseAt + i * 5;
                  const appear = spring({
                    frame: frame - delay,
                    fps,
                    config: { damping: 14, stiffness: 180, mass: 0.5 },
                  });
                  return (
                    <div
                      key={pill.id}
                      style={{
                        opacity: appear,
                        transform: `translateY(${(1 - appear) * 20}px) scale(${0.85 + appear * 0.15})`,
                        padding: "12px 22px",
                        borderRadius: 4,
                        background: C.surface,
                        border: `1px solid ${C.border}`,
                        borderLeft: `3px solid ${pill.color}`,
                        color: C.text,
                        fontSize: 16,
                        fontWeight: 500,
                        letterSpacing: 2,
                        fontFamily: FONT.mono,
                        textTransform: "uppercase",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        minWidth: 130,
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ color: pill.color, fontWeight: 700 }}>●</span>
                      <span>AI {pill.id}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* THE PROMPT */}
            {frame >= promptAt && (
              <div
                style={{
                  marginTop: 40,
                  margin: "40px auto 0",
                  opacity: promptProgress,
                  transform: `translateY(${(1 - promptProgress) * 30}px) scale(${0.94 + promptProgress * 0.06})`,
                  padding: "22px 32px",
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderLeft: `2px solid ${C.text}`,
                  borderRadius: 4,
                  fontFamily: FONT.mono,
                  fontSize: 22,
                  color: C.text,
                  fontWeight: 400,
                  letterSpacing: 0,
                  textAlign: "left",
                  maxWidth: 1200,
                }}
              >
                <span style={{ color: C.textFaint, marginRight: 12 }}>$</span>
                Build a full OS dashboard website from scratch, in a single
                HTML file. Zero libraries, zero dependencies. Pure code only.
              </div>
            )}

            {/* "THE RESULTS" label */}
            {frame >= resultsAt && (
              <div
                style={{
                  marginTop: 36,
                  opacity: resultsProgress,
                  transform: `translateY(${(1 - resultsProgress) * 16}px)`,
                  fontSize: 14,
                  color: C.textMuted,
                  fontWeight: 500,
                  letterSpacing: 6,
                  textTransform: "uppercase",
                  fontFamily: FONT.mono,
                }}
              >
                // The Results
              </div>
            )}

            {/* WINNER + BROKEN badges — persist through end (no fade-out) */}
            {frame >= winnerAt && (
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  gap: 20,
                  justifyContent: "center",
                  alignItems: "stretch",
                }}
              >
                <ResultBadge
                  emoji="👑"
                  rank="01"
                  label="WINNER"
                  subtitle="absolutely crushed it"
                  accent="#8b5cf6"
                  appear={fadeIn(frame, winnerAt, 14)}
                />
                {frame >= brokeAt && (
                  <ResultBadge
                    emoji="💀"
                    rank="07"
                    label="BROKEN"
                    subtitle="broke on line 3"
                    accent="#ff0040"
                    appear={fadeIn(frame, brokeAt, 14)}
                  />
                )}
              </div>
            )}

            {/* "Let's see" final line */}
            {frame >= seeAt && (
              <div
                style={{
                  marginTop: 28,
                  opacity: seeProgress,
                  fontSize: 22,
                  color: C.text,
                  fontWeight: 500,
                  fontFamily: FONT.mono,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                }}
              >
                <span style={{ color: C.textFaint }}>→</span>
                Let's see what each one built
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      <Watermark />
    </SceneFrame>
  );
};

const ResultBadge: React.FC<{
  emoji: string;
  rank: string;
  label: string;
  subtitle: string;
  accent: string;
  appear: number;
}> = ({ emoji, rank, label, subtitle, accent, appear }) => {
  return (
    <div
      style={{
        opacity: appear,
        transform: `scale(${0.88 + appear * 0.12})`,
        padding: "16px 26px",
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderLeft: `3px solid ${accent}`,
        borderRadius: 4,
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: 18,
        minWidth: 380,
      }}
    >
      <div style={{ fontSize: 42, lineHeight: 1 }}>{emoji}</div>
      <div>
        <div
          style={{
            fontSize: 11,
            color: C.textFaint,
            fontFamily: FONT.mono,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          #{rank}
        </div>
        <div
          style={{
            fontSize: 20,
            color: C.text,
            fontWeight: 700,
            fontFamily: FONT.display,
            letterSpacing: 3,
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 13,
            color: C.textMuted,
            fontFamily: FONT.mono,
            marginTop: 4,
            textTransform: "lowercase",
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
};
