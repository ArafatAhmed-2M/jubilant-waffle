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

const SECTIONS = [
  { label: "Live clock topbar",     icon: "01", highlight: false },
  { label: "Typewriter terminal",   icon: "02", highlight: false },
  { label: "Pure trig radar chart", icon: "03", highlight: true  },
  { label: "Scrolling stats ticker",icon: "04", highlight: false },
  { label: "Six feature cards",     icon: "05", highlight: false },
  { label: "Quiz module",           icon: "06", highlight: false },
  { label: "Syntax code block",     icon: "07", highlight: false },
  { label: "Animated footer",       icon: "08", highlight: false },
];

/**
 * ThePrompt scene — TEST 02/12 · 31.74s audio.
 * Brutalist: "THE CHALLENGE" Oswald headline, 8 sections in a 4×2 grid of
 * flat bordered cards, mono "one file" / "hardest part" callouts.
 */
export const ThePrompt: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = useSecToFrame();

  const titleAt = T(0.0);
  const subheadAt = T(1.82);

  // Per-section trigger = the key word being spoken in the-prompt.json:
  //   4.34 "live", 4.60 "clock", 4.92 "top", 5.30 "bar"
  //   6.14 "typewriter", 6.58 "terminal"
  //   7.76 "radar", 8.00 "chart"
  //  11.56 "scrolling", 11.94 "stats", 12.30 "ticker"
  //  13.18 "six", 13.46 "feature", 13.84 "cards"
  //  14.64 "quiz"
  //  15.56 "syntax", 15.88 "highlighted", 16.58 "code", 16.92 "block"
  //  17.78 "an", 17.96 "animated", 18.36 "frutter"
  const sectionTimes = [
    4.60, 6.14, 7.76, 11.94, 13.46, 14.64, 15.56, 17.96,
  ];
  const sections = SECTIONS.map((s, i) => ({ ...s, at: T(sectionTimes[i]) }));

  const oneFileAt = T(20.58);
  const hardestAt = T(22.06);
  const mathAt = T(25.28);

  const titleAppear = spring({
    frame: frame - titleAt,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.6 },
  });
  const subheadAppear = spring({
    frame: frame - subheadAt,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.6 },
  });

  return (
    <SceneFrame sceneIndex={2} totalScenes={12} sceneName="The Challenge" accentColor={C.text}>
      <AnimatedBackground baseColor={C.bg} accentColor={C.textMuted} />
      <Audio src={staticFile("audio/the-prompt.mp3")} />

      <AbsoluteFill
        style={{ padding: "110px 90px 90px", justifyContent: "center" }}
      >
        <div style={{ maxWidth: 1720, width: "100%" }}>
          {/* Eyebrow + title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              opacity: titleAppear,
              transform: `translateX(${(1 - titleAppear) * -20}px)`,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 40,
                height: 1,
                background: C.text,
              }}
            />
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
              Episode 02 // The Challenge
            </div>
          </div>

          <div
            style={{
              opacity: titleAppear,
              transform: `translateY(${(1 - titleAppear) * 40}px)`,
              fontSize: 120,
              fontWeight: 700,
              lineHeight: 0.95,
              fontFamily: FONT.display,
              color: C.text,
              textTransform: "uppercase",
              letterSpacing: 4,
            }}
          >
            The Challenge
          </div>

          <div
            style={{
              opacity: subheadAppear,
              transform: `translateY(${(1 - subheadAppear) * 18}px)`,
              marginTop: 20,
              fontSize: 20,
              color: C.textMuted,
              fontWeight: 400,
              fontFamily: FONT.mono,
              maxWidth: 1500,
              lineHeight: 1.6,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Build a complete OS dashboard in{" "}
            <span style={{ color: C.text, fontWeight: 500 }}>one HTML file</span>{" "}
            <span style={{ color: C.textFaint }}>·</span>{" "}
            <span style={{ color: C.text, fontWeight: 500 }}>no libraries</span>{" "}
            <span style={{ color: C.textFaint }}>·</span> pure code. Each model
            had to build 8 sections:
          </div>

          {/* Hairline rule */}
          <div
            style={{
              opacity: subheadAppear,
              marginTop: 28,
              marginBottom: 22,
              height: 1,
              background: C.border,
              width: "100%",
            }}
          />

          {/* 4×2 grid of sections */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 10,
            }}
          >
            {sections.map((section, i) => {
              const appear = spring({
                frame: frame - section.at,
                fps,
                config: { damping: 14, stiffness: 180, mass: 0.5 },
              });
              return (
                <div
                  key={section.label}
                  style={{
                    opacity: appear,
                    transform: `translateY(${(1 - appear) * 20}px)`,
                    padding: "16px 18px",
                    background: section.highlight ? C.surface : C.surface,
                    border: section.highlight
                      ? `1px solid ${C.text}`
                      : `1px solid ${C.border}`,
                    borderLeft: section.highlight
                      ? `2px solid ${C.text}`
                      : `2px solid ${C.border}`,
                    minHeight: 110,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
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
                      Section {section.icon}
                    </div>
                    {section.highlight && (
                      <div
                        style={{
                          fontSize: 10,
                          color: C.text,
                          fontWeight: 500,
                          letterSpacing: 2,
                          textTransform: "uppercase",
                          fontFamily: FONT.mono,
                          padding: "2px 6px",
                          border: `1px solid ${C.text}`,
                        }}
                      >
                        ★ The Test
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 500,
                      color: C.text,
                      fontFamily: FONT.body,
                      lineHeight: 1.3,
                    }}
                  >
                    {section.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ONE FILE callout */}
          <div
            style={{
              marginTop: 16,
              opacity: fadeIn(frame, oneFileAt, 18),
              transform: `translateY(${(1 - fadeIn(frame, oneFileAt, 18)) * 16}px)`,
              padding: "16px 22px",
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderLeft: `2px solid ${C.text}`,
              fontSize: 18,
              fontWeight: 500,
              color: C.text,
              fontFamily: FONT.mono,
              letterSpacing: 1,
              display: "flex",
              alignItems: "center",
              gap: 14,
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: C.textFaint }}>→</span>
            All in one HTML file
          </div>

          {/* HARDEST PART callout */}
          <div
            style={{
              marginTop: 10,
              opacity: fadeIn(frame, hardestAt, 18),
              transform: `translateY(${(1 - fadeIn(frame, hardestAt, 18)) * 16}px)`,
              padding: "16px 22px",
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderLeft: `2px solid ${C.warn}`,
              fontSize: 18,
              fontWeight: 500,
              color: C.text,
              fontFamily: FONT.mono,
              letterSpacing: 1,
              display: "flex",
              alignItems: "center",
              gap: 14,
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: C.warn }}>!</span>
            The hardest part: the radar chart
          </div>

          {/* MATH emphasis */}
          <div
            style={{
              marginTop: 10,
              opacity: fadeIn(frame, mathAt, 18),
              transform: `translateY(${(1 - fadeIn(frame, mathAt, 18)) * 12}px)`,
              padding: "12px 22px",
              background: C.bg,
              border: `1px solid ${C.warn}`,
              fontFamily: FONT.mono,
              fontSize: 16,
              color: C.warn,
              fontWeight: 500,
              textAlign: "left",
              letterSpacing: 1,
            }}
          >
            <span style={{ color: C.textFaint, marginRight: 12 }}>$</span>
            sin(θ) · cos(θ) · the whole thing
          </div>
        </div>
      </AbsoluteFill>

      <Watermark />
    </SceneFrame>
  );
};
