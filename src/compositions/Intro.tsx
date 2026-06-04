import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, Audio, staticFile } from "remotion";
import { AnimatedBackground, Watermark } from "./visuals";
import { useSecToFrame, fadeIn } from "./utils";

const MODEL_PILLS = [
  { name: "MiniMax M3", color: "#8b5cf6" },
  { name: "DeepSeek Flash", color: "#22d3ee" },
  { name: "Big Pickle", color: "#4ade80" },
  { name: "MiMo v2.5", color: "#fb923c" },
  { name: "Gemma 4 31B", color: "#60a5fa" },
  { name: "Nemotron Super", color: "#76b900" },
  { name: "Nemotron Nano", color: "#c8f500" },
];

/**
 * Intro scene — 28.66s audio.
 *
 * Hand-picked timing read directly from intro.json transcript:
 *   0.0  "What's"                → title
 *   2.04 "We're"                 → subtitle
 *   3.48 "I gave seven..."       → pills (model list)
 *   8.16 "Build a full OS..."    → big code block reveal
 *  19.82 "Completely different"  → "THE RESULTS" label
 *  21.48 "one model absolutely"  → MiniMax winner badge
 *  23.68 "one broke on line 3"   → Nemotron red X
 *  27.1  "Let's get into it"     → final tagline
 */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = useSecToFrame();

  // Title at 0.0s — fades in immediately
  const titleAt = T(0.0);
  // Subtitle at 2.0s — slightly after "We're doing something really fun."
  const subtitleAt = T(2.0);
  // Pills start at 3.5s — when "I gave seven of the best..." is being said
  const pillBaseAt = T(3.5);
  // Big prompt reveal at 8.0s — when "Build a full OS dashboard..." starts
  const promptAt = T(8.0);
  // "THE RESULTS" label at 19.8s
  const resultsAt = T(19.8);
  // MiniMax winner badge at 21.5s — when "absolutely crushed it" hits
  const winnerAt = T(21.5);
  // Nemotron red X at 23.7s — "one broke on line 3"
  const brokeAt = T(23.7);
  // "Let's see" final line at 27.1s
  const seeAt = T(27.1);

  const titleProgress = fadeIn(frame, titleAt, 18);
  const subtitleProgress = fadeIn(frame, subtitleAt, 18);
  const promptProgress = fadeIn(frame, promptAt, 20);
  const resultsProgress = fadeIn(frame, resultsAt, 16);
  const seeProgress = fadeIn(frame, seeAt, 16);

  return (
    <AbsoluteFill>
      <AnimatedBackground baseColor="#08080d" accentColor="#8b5cf6" />
      <Audio src={staticFile("audio/intro.mp3")} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            textAlign: "center",
            padding: "0 80px",
            maxWidth: 1720,
          }}
        >
          <div
            style={{
              opacity: titleProgress,
              transform: `translateY(${(1 - titleProgress) * 40}px)`,
              fontSize: 140,
              fontWeight: 900,
              letterSpacing: 6,
              lineHeight: 1,
              fontFamily: "'Bebas Neue', 'Inter', sans-serif",
              background: "linear-gradient(135deg, #ffffff 0%, #c4b5fd 50%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 80px rgba(139, 92, 246, 0.4)",
            }}
          >
            7 FREE AI MODELS
          </div>

          <div
            style={{
              opacity: subtitleProgress,
              transform: `translateY(${(1 - subtitleProgress) * 20}px)`,
              marginTop: 18,
              fontSize: 32,
              fontWeight: 500,
              color: "#cbd5e1",
              letterSpacing: 2,
              fontFamily: "Inter, sans-serif",
            }}
          >
            One Prompt · One HTML File · No Libraries
          </div>

          {frame >= pillBaseAt && (
            <div
              style={{
                marginTop: 40,
                display: "flex",
                gap: 12,
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
                    key={pill.name}
                    style={{
                      opacity: appear,
                      transform: `translateY(${(1 - appear) * 20}px) scale(${0.7 + appear * 0.3})`,
                      padding: "12px 22px",
                      borderRadius: 999,
                      background: `${pill.color}22`,
                      border: `2px solid ${pill.color}`,
                      color: pill.color,
                      fontSize: 20,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      fontFamily: "Inter, sans-serif",
                      boxShadow: `0 0 24px ${pill.color}40`,
                    }}
                  >
                    {pill.name}
                  </div>
                );
              })}
            </div>
          )}

          {frame >= promptAt && (
            <div
              style={{
                marginTop: 36,
                opacity: promptProgress,
                transform: `translateY(${(1 - promptProgress) * 30}px) scale(${0.94 + promptProgress * 0.06})`,
                padding: "22px 32px",
                background: "rgba(10, 10, 18, 0.85)",
                border: "2px solid rgba(139, 92, 246, 0.5)",
                borderRadius: 14,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 22,
                color: "#a5b4fc",
                fontWeight: 600,
                letterSpacing: 0.5,
                textAlign: "left",
                boxShadow: "0 16px 50px rgba(0,0,0,0.6)",
                maxWidth: 1100,
                margin: "36px auto 0",
              }}
            >
              <span style={{ color: "#6b7280" }}>$</span> Build a full OS dashboard
              website from scratch, in a single HTML file. Zero libraries, zero
              dependencies. Pure code only.
            </div>
          )}

          {frame >= resultsAt && (
            <div
              style={{
                marginTop: 32,
                opacity: resultsProgress,
                transform: `translateY(${(1 - resultsProgress) * 16}px)`,
                fontSize: 22,
                color: "#94a3b8",
                fontWeight: 700,
                letterSpacing: 6,
                textTransform: "uppercase",
                fontFamily: "Inter, sans-serif",
              }}
            >
              The results
            </div>
          )}

          {frame >= winnerAt && frame < brokeAt + 30 && (
            <div
              style={{
                marginTop: 18,
                display: "flex",
                gap: 24,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  opacity: fadeIn(frame, winnerAt, 14),
                  transform: `scale(${0.8 + fadeIn(frame, winnerAt, 14) * 0.2})`,
                  padding: "16px 28px",
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(139, 92, 246, 0.05))",
                  border: "2px solid #8b5cf6",
                  borderRadius: 18,
                  textAlign: "center",
                  boxShadow: "0 0 60px rgba(139, 92, 246, 0.5)",
                }}
              >
                <div style={{ fontSize: 36 }}>👑</div>
                <div
                  style={{
                    fontSize: 18,
                    color: "#c4b5fd",
                    fontWeight: 800,
                    letterSpacing: 2,
                    marginTop: 4,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  MiniMax absolutely crushed it
                </div>
              </div>

              {frame >= brokeAt && (
                <div
                  style={{
                    opacity: fadeIn(frame, brokeAt, 14),
                    transform: `scale(${0.8 + fadeIn(frame, brokeAt, 14) * 0.2})`,
                    padding: "16px 28px",
                    background: "linear-gradient(135deg, rgba(255, 0, 64, 0.3), rgba(255, 0, 64, 0.05))",
                    border: "2px solid #ff0040",
                    borderRadius: 18,
                    textAlign: "center",
                    boxShadow: "0 0 60px rgba(255, 0, 64, 0.5)",
                  }}
                >
                  <div style={{ fontSize: 36 }}>💀</div>
                  <div
                    style={{
                      fontSize: 18,
                      color: "#ff4d6d",
                      fontWeight: 800,
                      letterSpacing: 2,
                      marginTop: 4,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    One broke on line 3
                  </div>
                </div>
              )}
            </div>
          )}

          {frame >= seeAt && (
            <div
              style={{
                marginTop: 28,
                opacity: seeProgress,
                fontSize: 28,
                color: "#94a3b8",
                fontWeight: 500,
                fontFamily: "Inter, sans-serif",
                letterSpacing: 1,
              }}
            >
              Let's see what each one built →
            </div>
          )}
        </div>
      </AbsoluteFill>

      <Watermark />
    </AbsoluteFill>
  );
};
