import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

type Props = {
  baseColor?: string;
  accentColor?: string;
  intensity?: number;
};

export const AnimatedBackground: React.FC<Props> = ({
  baseColor = "#0a0a0f",
  accentColor = "#8b5cf6",
  intensity = 0.3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = frame / fps;

  const orb1X = interpolate(Math.sin(t * 0.3), [-1, 1], [0, 1920]);
  const orb1Y = interpolate(Math.cos(t * 0.4), [-1, 1], [0, 1080]);
  const orb2X = interpolate(Math.cos(t * 0.25), [-1, 1], [0, 1920]);
  const orb2Y = interpolate(Math.sin(t * 0.35), [-1, 1], [0, 1080]);
  const orb3X = interpolate(Math.sin(t * 0.5 + 1), [-1, 1], [0, 1920]);
  const orb3Y = interpolate(Math.cos(t * 0.45 + 1), [-1, 1], [0, 1080]);

  return (
    <AbsoluteFill style={{ background: baseColor, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}${Math.round(intensity * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
          left: orb1X - 400,
          top: orb1Y - 400,
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}80 0%, transparent 70%)`,
          left: orb2X - 350,
          top: orb2Y - 350,
          filter: "blur(80px)",
          opacity: 0.7,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}66 0%, transparent 70%)`,
          left: orb3X - 300,
          top: orb3Y - 300,
          filter: "blur(50px)",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${accentColor}10 1px, transparent 1px), linear-gradient(90deg, ${accentColor}10 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: 0.3,
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
        fontSize: 18,
        color: "#ffffff80",
        fontWeight: 600,
        letterSpacing: 1,
        fontFamily: "Inter, sans-serif",
        textShadow: "0 2px 8px rgba(0,0,0,0.8)",
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
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });

  const bounce = Math.sin((frame - delay * fps) * 0.15) * 0.05;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        right: 32,
        opacity: appear,
        transform: `scale(${appear * (1 + bounce)})`,
        background: "linear-gradient(135deg, #ff0040, #ff4d6d)",
        color: "#fff",
        padding: "12px 24px",
        borderRadius: 999,
        fontSize: 18,
        fontWeight: 800,
        letterSpacing: 1,
        boxShadow: "0 8px 32px rgba(255, 0, 64, 0.4)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      SUBSCRIBE
    </div>
  );
};
