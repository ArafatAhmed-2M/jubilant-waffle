import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { C, FONT } from "./theme";

type Props = {
  baseColor?: string;
  accentColor?: string;
  intensity?: number;
};

/**
 * Minimalist dark background: pure black with a slowly-shifting vertical
 * gradient hint and a faint hairline grid. No orbs, no glow — let the
 * content breathe against deep black.
 */
export const AnimatedBackground: React.FC<Props> = ({
  baseColor = C.bg,
  accentColor = C.textMuted,
  intensity = 0.3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow vertical gradient sweep (every 8s)
  const t = (frame / fps) % 8;
  const sweepY = interpolate(t, [0, 4, 8], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <AbsoluteFill style={{ background: baseColor, overflow: "hidden" }}>
      {/* Subtle accent gradient — pinned to the bottom-right corner */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${baseColor} 0%, ${baseColor} 50%, ${accentColor}${Math.round(intensity * 10).toString(16).padStart(2, "0")} 100%)`,
          opacity: 0.4,
        }}
      />

      {/* Sweeping vertical sheen — barely visible, ~1s period */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, transparent 0%, ${accentColor}08 ${20 + sweepY * 60}%, transparent 100%)`,
        }}
      />

      {/* Hairline grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          opacity: 0.35,
        }}
      />

      {/* Diagonal accent line in the top-left — designer's mark */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1,
          height: 240,
          background: accentColor,
          opacity: 0.4,
        }}
      />
    </AbsoluteFill>
  );
};

type WatermarkProps = {
  text?: string;
};

export const Watermark: React.FC<WatermarkProps> = ({ text = "@ArafatAhmedMubin" }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 24,
        right: 32,
        fontSize: 13,
        color: C.textFaint,
        fontWeight: 500,
        letterSpacing: 1,
        fontFamily: FONT.mono,
        textTransform: "lowercase",
      }}
    >
      {text}
    </div>
  );
};

type SubscribeBadgeProps = {
  delay?: number;
};

export const SubscribeBadge: React.FC<SubscribeBadgeProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = interpolate(frame - delay * fps, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        right: 32,
        opacity: appear,
        transform: `scale(${0.95 + appear * 0.05})`,
        background: C.text,
        color: C.bg,
        padding: "12px 24px",
        borderRadius: 0,
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: 4,
        fontFamily: FONT.display,
        textTransform: "uppercase",
      }}
    >
      Subscribe →
    </div>
  );
};
