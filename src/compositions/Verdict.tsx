import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Audio, staticFile } from "remotion";
import { AnimatedBackground } from "./visuals";
import { useWordSync, type Word, fadeIn } from "./useWordSync";

const INSIGHTS = [
  {
    title: "SIZE ≠ QUALITY",
    body: "A 7B parameter model beat a 31B one. Architecture and training beat raw scale.",
    color: "#8b5cf6",
    icon: "📊",
  },
  {
    title: "ONE BUG = EVERYTHING BREAKS",
    body: "Nemotron's CSS quote error destroyed the entire visual design in round one.",
    color: "#ff4d6d",
    icon: "💥",
  },
  {
    title: "PERSONALITY IS HARD",
    body: "Big Pickle held two registers — funny AND technically correct — simultaneously.",
    color: "#4ade80",
    icon: "🎭",
  },
  {
    title: "THE RADAR CHART IS THE TEST",
    body: "Pure trigonometry, no libraries, animate on scroll. The single feature that separates the good from the great.",
    color: "#fbbf24",
    icon: "🎯",
  },
];

const CARD_TRIGGERS = [
  // Each card's start frame, derived from the audio's "Number X" / "number X" phrase
  "Number one",
  "Number two",
  "Number three",
  "number four",
];

const CARD_END_TRIGGERS = [
  "Architecture",   // end of card 1
  "everything",     // end of card 2
  "personality",    // end of card 3
  "ones",           // end of card 4
];

type Props = { words?: Word[] };

export const Verdict: React.FC<Props> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const T = (frac: number) => Math.max(0, Math.floor(frac * durationInFrames));

  const { phraseAt } = useWordSync(words);

  // Compute each card's start/end frames from the JSON
  const cardSlots: Array<{ start: number; end: number }> = INSIGHTS.map((_, i) => {
    const startPhrase = phraseAt(CARD_TRIGGERS[i], 0);
    const endPhrase = phraseAt(CARD_END_TRIGGERS[i], startPhrase ? startPhrase.start : 0);
    const startFrame = startPhrase ? startPhrase.start : T(0.10 + i * 0.20);
    const endFrame = endPhrase ? endPhrase.end : T(0.30 + i * 0.20);
    return { start: startFrame, end: endFrame };
  });

  const titleAppear = spring({
    frame: frame - 0,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.6 },
  });

  return (
    <AbsoluteFill>
      <AnimatedBackground baseColor="#08080d" accentColor="#8b5cf6" intensity={0.35} />
      <Audio src={staticFile("audio/verdict.mp3")} />

      <AbsoluteFill style={{ padding: "70px 100px" }}>
        <div
          style={{
            opacity: titleAppear,
            transform: `translateY(${(1 - titleAppear) * 30}px)`,
            fontSize: 90,
            fontWeight: 900,
            textAlign: "center",
            fontFamily: "'Bebas Neue', 'Inter', sans-serif",
            background: "linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #8b5cf6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 6,
            marginBottom: 40,
            lineHeight: 1,
          }}
        >
          THE VERDICT
        </div>

        <div
          style={{
            position: "relative",
            height: 720,
            width: 1500,
            margin: "0 auto",
          }}
        >
          {INSIGHTS.map((insight, i) => {
            const slot = cardSlots[i];
            const isLast = i === INSIGHTS.length - 1;
            const nextStart = !isLast ? cardSlots[i + 1].start : durationInFrames - 1;

            const fadeInEnd = slot.start + Math.floor(0.4 * fps);
            const holdEnd = Math.min(slot.end, nextStart - Math.floor(0.2 * fps));
            const crossEnd = !isLast ? nextStart : durationInFrames - 1;

            const opacity = isLast
              ? fadeIn(frame, slot.start, Math.floor(0.4 * fps))
              : interpolate(
                  frame,
                  [slot.start, fadeInEnd, holdEnd, crossEnd],
                  [0, 1, 1, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                );
            const translateY = isLast
              ? interpolate(frame, [slot.start, fadeInEnd], [60, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : interpolate(
                  frame,
                  [slot.start, fadeInEnd, holdEnd, crossEnd],
                  [60, 0, 0, -30],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                );
            return (
              <div
                key={insight.title}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity,
                  transform: `translateY(${translateY}px)`,
                  padding: "60px 70px",
                  background: `linear-gradient(135deg, ${insight.color}28, ${insight.color}0a)`,
                  border: `3px solid ${insight.color}`,
                  borderRadius: 28,
                  backdropFilter: "blur(24px)",
                  boxShadow: `0 30px 80px ${insight.color}50, 0 0 0 1px ${insight.color}33`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -60,
                    right: -60,
                    fontSize: 320,
                    opacity: 0.12,
                    lineHeight: 1,
                  }}
                >
                  {insight.icon}
                </div>
                <div
                  style={{
                    fontSize: 90,
                    marginBottom: 20,
                    position: "relative",
                    lineHeight: 1,
                  }}
                >
                  {insight.icon}
                </div>
                <div
                  style={{
                    fontSize: 56,
                    fontWeight: 900,
                    color: insight.color,
                    fontFamily: "'Bebas Neue', 'Inter', sans-serif",
                    letterSpacing: 3,
                    lineHeight: 1,
                    marginBottom: 28,
                    position: "relative",
                    whiteSpace: "nowrap",
                  }}
                >
                  #{i + 1} · {insight.title}
                </div>
                <div
                  style={{
                    fontSize: 34,
                    color: "#e2e8f0",
                    fontWeight: 500,
                    fontFamily: "Inter, sans-serif",
                    lineHeight: 1.4,
                    position: "relative",
                    maxWidth: 1340,
                  }}
                >
                  {insight.body}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 24,
            color: "#64748b",
            fontWeight: 500,
            fontFamily: "Inter, sans-serif",
            letterSpacing: 4,
            textTransform: "uppercase",
            opacity: interpolate(frame, [durationInFrames - 60, durationInFrames - 20], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          7 Models · 1 Prompt · ∞ Lessons
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 110,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 16,
          }}
        >
          {cardSlots.map((slot, i) => {
            const isActive = frame >= slot.start && frame < (cardSlots[i + 1]?.start ?? durationInFrames);
            return (
              <div
                key={i}
                style={{
                  width: isActive ? 60 : 30,
                  height: 8,
                  borderRadius: 4,
                  background: isActive ? INSIGHTS[i].color : "#1f2937",
                  boxShadow: isActive ? `0 0 20px ${INSIGHTS[i].color}` : "none",
                }}
              />
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
