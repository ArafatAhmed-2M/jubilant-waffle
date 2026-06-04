import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { C, FONT } from "./theme";

type SceneFrameProps = {
  sceneIndex: number;
  totalScenes: number;
  sceneName: string;
  accentColor?: string;
  children: React.ReactNode;
};

/**
 * SceneFrame — minimalist brutalist chrome, made even more subtle.
 *
 * • Top-left & top-right: small mono labels in #444/#666 (very faint)
 * • Top/bottom: 1px #222 hairlines
 * • Bottom progress fill: single accent-colored line
 * • Corner ticks: 1px #444 L-shapes, tucked just under the hairlines
 *
 * Bug fix: ticks moved from `tickOffset: 16` to `tickOffset: 56` so they
 * sit BELOW the top hairline and ABOVE the bottom hairline, no longer
 * overlapping with the corner labels.
 */
export const SceneFrame: React.FC<SceneFrameProps> = ({
  sceneIndex,
  totalScenes,
  sceneName,
  accentColor = C.textMuted,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const chromeIn = interpolate(frame, [0, Math.floor(0.3 * fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chromeOut = interpolate(
    frame,
    [durationInFrames - Math.floor(0.3 * fps), durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const chromeOpacity = Math.min(chromeIn, chromeOut);

  const elapsedSec = frame / fps;
  const totalSec = durationInFrames / fps;
  const progress = Math.min(1, elapsedSec / totalSec);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const pad2 = (n: number) => n.toString().padStart(2, "0");

  // ── layout constants ──
  const HAIRLINE_TOP = 80;       // top hairline at y=80
  const HAIRLINE_BOTTOM = 80;    // bottom hairline at 80px from bottom
  const TICK_LEN = 20;
  const TICK_THICK = 1;
  const TICK_INSET = 24;         // distance from screen edge
  const LABEL_INSET_X = 24;
  const LABEL_INSET_Y = 28;      // labels sit ABOVE the top hairline
  const LABEL_INSET_BOTTOM = 28; // labels sit BELOW the bottom hairline

  return (
    <AbsoluteFill>
      {children}

      {/* TOP hairline */}
      <div
        style={{
          position: "absolute",
          top: HAIRLINE_TOP,
          left: 0,
          right: 0,
          height: 1,
          background: C.border,
          opacity: chromeOpacity,
          zIndex: 20,
        }}
      />

      {/* BOTTOM hairline */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: HAIRLINE_BOTTOM,
          height: 1,
          background: C.border,
          opacity: chromeOpacity,
          zIndex: 20,
        }}
      />
      {/* BOTTOM accent progress fill */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: HAIRLINE_BOTTOM,
          height: 1,
          width: `${progress * 100}%`,
          background: accentColor,
          opacity: chromeOpacity,
          zIndex: 21,
        }}
      />

      {/* Top-left label */}
      <div
        style={{
          position: "absolute",
          top: LABEL_INSET_Y,
          left: LABEL_INSET_X,
          display: "flex",
          alignItems: "baseline",
          gap: 14,
          opacity: chromeOpacity,
          zIndex: 21,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: C.textFaint,
            fontWeight: 500,
            letterSpacing: 3,
            fontFamily: FONT.mono,
            textTransform: "uppercase",
          }}
        >
          {pad2(sceneIndex)}/{pad2(totalScenes)}
        </div>
        <div
          style={{
            fontSize: 12,
            color: C.textDim,
            fontWeight: 500,
            letterSpacing: 4,
            fontFamily: FONT.mono,
            textTransform: "uppercase",
          }}
        >
          // {sceneName}
        </div>
      </div>

      {/* Top-right label */}
      <div
        style={{
          position: "absolute",
          top: LABEL_INSET_Y,
          right: LABEL_INSET_X,
          display: "flex",
          alignItems: "baseline",
          gap: 14,
          opacity: chromeOpacity,
          zIndex: 21,
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: C.textDim,
            fontWeight: 500,
            letterSpacing: 2,
            fontFamily: FONT.mono,
          }}
        >
          {fmt(elapsedSec)}
        </div>
        <div
          style={{
            fontSize: 11,
            color: C.textFaint,
            fontWeight: 500,
            letterSpacing: 2,
            fontFamily: FONT.mono,
          }}
        >
          / {fmt(totalSec)}
        </div>
        <div
          style={{
            fontSize: 10,
            color: C.textFaint,
            fontWeight: 500,
            letterSpacing: 2,
            fontFamily: FONT.mono,
          }}
        >
          1920×1080
        </div>
      </div>

      {/* Bottom-left label */}
      <div
        style={{
          position: "absolute",
          left: LABEL_INSET_X,
          bottom: LABEL_INSET_BOTTOM,
          fontSize: 10,
          color: C.textFaint,
          fontWeight: 500,
          letterSpacing: 3,
          fontFamily: FONT.mono,
          textTransform: "uppercase",
          opacity: chromeOpacity,
          zIndex: 21,
        }}
      >
        // AI BENCHMARK
      </div>

      {/* Bottom-right label */}
      <div
        style={{
          position: "absolute",
          right: LABEL_INSET_X,
          bottom: LABEL_INSET_BOTTOM,
          fontSize: 10,
          color: C.textFaint,
          fontWeight: 500,
          letterSpacing: 2,
          fontFamily: FONT.mono,
          opacity: chromeOpacity,
          zIndex: 21,
        }}
      >
        {Math.round(progress * 100).toString().padStart(3, "0")}%
      </div>

      {/* Corner ticks — tucked just under the hairlines, no overlap */}
      {[
        { top: HAIRLINE_TOP + 4, left: TICK_INSET, borderTop: `${TICK_THICK}px solid ${C.textFaint}`, borderLeft: `${TICK_THICK}px solid ${C.textFaint}` },
        { top: HAIRLINE_TOP + 4, right: TICK_INSET, borderTop: `${TICK_THICK}px solid ${C.textFaint}`, borderRight: `${TICK_THICK}px solid ${C.textFaint}` },
        { bottom: HAIRLINE_BOTTOM + 4, left: TICK_INSET, borderBottom: `${TICK_THICK}px solid ${C.textFaint}`, borderLeft: `${TICK_THICK}px solid ${C.textFaint}` },
        { bottom: HAIRLINE_BOTTOM + 4, right: TICK_INSET, borderBottom: `${TICK_THICK}px solid ${C.textFaint}`, borderRight: `${TICK_THICK}px solid ${C.textFaint}` },
      ].map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: TICK_LEN,
            height: TICK_LEN,
            opacity: chromeOpacity * 0.6,
            zIndex: 22,
            ...s,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
