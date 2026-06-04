import React from "react";
import { Img, staticFile } from "remotion";

type Props = {
  screenshot: string;
  url: string;
  appear: number;
};

export const BrowserFrame: React.FC<Props> = ({ screenshot, url, appear }) => {
  return (
    <div
      style={{
        opacity: appear,
        transform: `translateX(${(1 - appear) * 60}px) perspective(1200px) rotateY(${(1 - appear) * 8}deg)`,
        borderRadius: 16,
        overflow: "hidden",
        background: "#1a1a24",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 16px",
          background: "linear-gradient(180deg, #2a2a35, #1a1a24)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#28c840" }} />
        </div>
        <div
          style={{
            flex: 1,
            marginLeft: 16,
            padding: "6px 14px",
            background: "rgba(0,0,0,0.3)",
            borderRadius: 8,
            fontSize: 14,
            color: "#94a3b8",
            fontFamily: "'JetBrains Mono', monospace",
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          🌐 {url}
        </div>
      </div>
      {/* Screenshot */}
      <div
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
          background: "#0a0a14",
          backgroundImage:
            "linear-gradient(135deg, #0a0a14 0%, #1a1a28 50%, #0a0a14 100%)",
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile(screenshot)}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "cover",
            objectPosition: "top center",
            backgroundColor: "#0a0a14",
          }}
        />
      </div>
    </div>
  );
};

type InfoCardProps = {
  maker: string;
  params: string;
  license: string;
  release: string;
  info: string;
  color: string;
  appear: number;
};

export const InfoCard: React.FC<InfoCardProps> = ({ maker, params, license, release, info, color, appear }) => {
  return (
    <div
      style={{
        opacity: appear,
        transform: `translateY(${(1 - appear) * 20}px)`,
        padding: "22px 26px",
        background: `linear-gradient(135deg, ${color}14, ${color}06)`,
        border: `1.5px solid ${color}66`,
        borderRadius: 14,
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: "10px 22px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Field label="Maker" value={maker} color={color} />
      <Field label="Params" value={params} color={color} />
      <Field label="License" value={license} color={color} />
      <Field label="Released" value={release} color={color} />
      <div style={{ gridColumn: "1 / -1", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${color}44` }}>
        <div
          style={{
            fontSize: 13,
            color: "#94a3b8",
            fontWeight: 800,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          What it built
        </div>
        <div style={{ fontSize: 20, color: "#e2e8f0", lineHeight: 1.45, fontWeight: 500 }}>{info}</div>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <>
    <div
      style={{
        fontSize: 13,
        color: "#94a3b8",
        fontWeight: 800,
        letterSpacing: 3,
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 19, color: "#fff", fontWeight: 700 }}>{value}</div>
  </>
);
