import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT } from "./theme";

type Props = {
  screenshot: string;
  url: string;
  appear: number;
};

/**
 * Minimalist browser frame — flat black with a 1px gray border.
 * Mono URL bar, no traffic lights glow.
 */
export const BrowserFrame: React.FC<Props> = ({ screenshot, url, appear }) => {
  return (
    <div
      style={{
        opacity: appear,
        transform: `translateX(${(1 - appear) * 60}px)`,
        borderRadius: 0,
        overflow: "hidden",
        background: C.surface,
        border: `1px solid ${C.border}`,
      }}
    >
      {/* Title bar — flat, 1px bottom border */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 14px",
          background: C.surface,
          borderBottom: `1px solid ${C.border}`,
          gap: 14,
        }}
      >
        {/* Three monochrome squares instead of colored dots */}
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 10, height: 10, background: C.borderStrong }} />
          <div style={{ width: 10, height: 10, background: C.borderStrong }} />
          <div style={{ width: 10, height: 10, background: C.borderStrong }} />
        </div>
        <div
          style={{
            flex: 1,
            padding: "5px 12px",
            background: C.bg,
            border: `1px solid ${C.border}`,
            fontSize: 12,
            color: C.textMuted,
            fontFamily: FONT.mono,
            textAlign: "left",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            letterSpacing: 1,
          }}
        >
          https://{url}
        </div>
      </div>
      {/* Screenshot */}
      <div
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
          background: C.bg,
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
            backgroundColor: C.bg,
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

/**
 * Flat info card — pure black, hairline gray border, Fira Code labels.
 */
export const InfoCard: React.FC<InfoCardProps> = ({
  maker,
  params,
  license,
  release,
  info,
  color,
  appear,
}) => {
  return (
    <div
      style={{
        opacity: appear,
        transform: `translateY(${(1 - appear) * 20}px)`,
        padding: "20px 22px",
        background: C.surface,
        border: `1px solid ${C.border}`,
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: "10px 22px",
        fontFamily: FONT.body,
      }}
    >
      <Field label="Maker" value={maker} accent={color} />
      <Field label="Params" value={params} accent={color} />
      <Field label="License" value={license} accent={color} />
      <Field label="Released" value={release} accent={color} />
      <div
        style={{
          gridColumn: "1 / -1",
          marginTop: 12,
          paddingTop: 14,
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: C.textFaint,
            fontWeight: 500,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 8,
            fontFamily: FONT.mono,
          }}
        >
          // What it built
        </div>
        <div
          style={{
            fontSize: 18,
            color: C.text,
            lineHeight: 1.5,
            fontWeight: 400,
            fontFamily: FONT.body,
          }}
        >
          {info}
        </div>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; value: string; accent: string }> = ({
  label,
  value,
  accent,
}) => (
  <>
    <div
      style={{
        fontSize: 11,
        color: C.textFaint,
        fontWeight: 500,
        letterSpacing: 3,
        textTransform: "uppercase",
        fontFamily: FONT.mono,
        alignSelf: "center",
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: 18,
        color: C.text,
        fontWeight: 600,
        fontFamily: FONT.body,
        alignSelf: "center",
      }}
    >
      {value}
    </div>
  </>
);
