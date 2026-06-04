import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, Audio, staticFile } from "remotion";
import { AnimatedBackground } from "./visuals";
import { useSecToFrame, fadeIn } from "./utils";

/**
 * ThePrompt scene — 31.74s audio.
 *
 * Hand-picked timing read directly from the-prompt.json transcript:
 *   0.0  "So here's the challenge."   → "THE CHALLENGE" title
 *   1.82 "Each model had to build..." → "8 sections" subhead
 *   4.6  "a live clock top bar"        → section 1 appears
 *   6.58 "a typewriter terminal"       → section 2 appears
 *   8.0  "a radar chart"               → section 3 (HIGHLIGHTED)
 *  11.94 "a scrolling stats ticker"    → section 4
 *  13.84 "six feature cards"           → section 5
 *  15.4  "a quiz"                      → section 6
 *  15.88 "a syntax highlighted code"   → section 7
 *  18.36 "an animated frutter"         → section 8
 *  20.58 "all in one HTML file"        → "ONE FILE" callout
 *  22.06 "The hardest part?"           → "THE HARDEST PART" callout
 *  25.28 "the math yourself"           → sine/cosine math emphasis
 */
export const ThePrompt: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = useSecToFrame();

  const titleAt = T(0.0);
  const subheadAt = T(1.8);

  // Each section appears as its noun-phrase is spoken
  const sections = [
    { label: "Live clock topbar",  at: T(4.5),  highlight: false },
    { label: "Typewriter terminal", at: T(6.5),  highlight: false },
    { label: "Pure trig radar chart", at: T(8.0),  highlight: true  },
    { label: "Scrolling stats ticker", at: T(11.9), highlight: false },
    { label: "Six feature cards", at: T(13.8), highlight: false },
    { label: "Quiz module", at: T(15.4), highlight: false },
    { label: "Syntax code block", at: T(15.9), highlight: false },
    { label: "Animated footer", at: T(18.3), highlight: false },
  ];

  // 9.0: "ONE FILE" callout
  const oneFileAt = T(20.5);
  // 22.0: "THE HARDEST PART" callout
  const hardestAt = T(22.0);
  // 25.3: math emphasis
  const mathAt = T(25.3);

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
    <AbsoluteFill>
      <AnimatedBackground baseColor="#08080d" accentColor="#22d3ee" intensity={0.25} />
      <Audio src={staticFile("audio/the-prompt.mp3")} />

      <AbsoluteFill style={{ padding: "70px 100px", justifyContent: "center" }}>
        <div style={{ maxWidth: 1720 }}>
          <div
            style={{
              opacity: titleAppear,
              transform: `translateY(${(1 - titleAppear) * 40}px)`,
              fontSize: 110,
              fontWeight: 900,
              lineHeight: 1,
              fontFamily: "'Bebas Neue', 'Inter', sans-serif",
              background: "linear-gradient(135deg, #ffffff 0%, #67e8f9 50%, #22d3ee 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: 4,
            }}
          >
            THE CHALLENGE
          </div>

          <div
            style={{
              opacity: subheadAppear,
              transform: `translateY(${(1 - subheadAppear) * 20}px)`,
              marginTop: 20,
              fontSize: 30,
              color: "#cbd5e1",
              fontWeight: 500,
              fontFamily: "Inter, sans-serif",
              maxWidth: 1500,
              lineHeight: 1.4,
            }}
          >
            Build a complete OS dashboard in <span style={{ color: "#22d3ee", fontWeight: 700 }}>one HTML file</span> — <span style={{ color: "#22d3ee", fontWeight: 700 }}>no libraries</span>, pure code. 8 sections:
          </div>

          <div
            style={{
              marginTop: 40,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 18,
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
                    transform: `translateX(${(1 - appear) * -60}px)`,
                    padding: "22px 30px",
                    background: section.highlight
                      ? "linear-gradient(135deg, rgba(251, 191, 36, 0.18), rgba(251, 191, 36, 0.05))"
                      : "rgba(34, 211, 238, 0.08)",
                    border: section.highlight
                      ? "2px solid rgba(251, 191, 36, 0.6)"
                      : "2px solid rgba(34, 211, 238, 0.4)",
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    backdropFilter: "blur(10px)",
                    boxShadow: section.highlight ? "0 0 30px rgba(251, 191, 36, 0.3)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: section.highlight ? "#fbbf24" : "#22d3ee",
                      color: "#0a0a0f",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      fontWeight: 900,
                      fontFamily: "Inter, sans-serif",
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 700,
                      color: section.highlight ? "#fde68a" : "#fff",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {section.label}
                    {section.highlight && (
                      <span
                        style={{
                          marginLeft: 12,
                          fontSize: 18,
                          color: "#fbbf24",
                          fontWeight: 800,
                          letterSpacing: 2,
                        }}
                      >
                        ⚡ THE TEST
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* "All in one HTML file" callout — appears at 20.58s */}
          <div
            style={{
              marginTop: 32,
              opacity: fadeIn(frame, oneFileAt, 18),
              transform: `translateY(${(1 - fadeIn(frame, oneFileAt, 18)) * 20}px)`,
              padding: "20px 36px",
              background: "linear-gradient(135deg, rgba(34, 211, 238, 0.18), rgba(34, 211, 238, 0.05))",
              border: "2px solid #22d3ee",
              borderRadius: 16,
              fontSize: 28,
              fontWeight: 800,
              color: "#67e8f9",
              fontFamily: "Inter, sans-serif",
              textAlign: "center",
              boxShadow: "0 0 40px rgba(34, 211, 238, 0.3)",
            }}
          >
            📄 All in one HTML file
          </div>

          {/* "The hardest part?" callout — appears at 22.06s */}
          <div
            style={{
              marginTop: 20,
              opacity: fadeIn(frame, hardestAt, 18),
              transform: `translateY(${(1 - fadeIn(frame, hardestAt, 18)) * 20}px)`,
              padding: "24px 40px",
              background: "linear-gradient(135deg, rgba(255, 0, 64, 0.15), rgba(255, 0, 64, 0.05))",
              border: "2px solid #ff0040",
              borderRadius: 20,
              fontSize: 30,
              fontWeight: 900,
              color: "#fff",
              fontFamily: "Inter, sans-serif",
              textAlign: "center",
              letterSpacing: 1,
              boxShadow: "0 0 60px rgba(255, 0, 64, 0.3)",
            }}
          >
            ⚡ The hardest part: the radar chart
          </div>

          {/* Math emphasis — appears at 25.28s */}
          <div
            style={{
              marginTop: 16,
              opacity: fadeIn(frame, mathAt, 18),
              transform: `translateY(${(1 - fadeIn(frame, mathAt, 18)) * 16}px)`,
              padding: "18px 32px",
              background: "rgba(10, 10, 18, 0.7)",
              border: "1px solid rgba(251, 191, 36, 0.5)",
              borderRadius: 14,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 24,
              color: "#fde68a",
              fontWeight: 700,
              textAlign: "center",
              letterSpacing: 1,
            }}
          >
            sine · cosine · the whole thing
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
