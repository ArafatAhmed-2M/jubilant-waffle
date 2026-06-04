import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Audio,
  staticFile,
} from "remotion";
import { AnimatedBackground } from "./visuals";
import { BrowserFrame, InfoCard } from "./BrowserFrame";
import { SceneFrame } from "./SceneFrame";
import type { ModelData } from "./data";
import { useSecToFrame, fadeIn } from "./utils";
import { C, FONT } from "./theme";

type Props = {
  data: ModelData;
  audioFile: string;
  sceneIndex: number;
  sceneName: string;
};

const getNameSize = (name: string): number => {
  if (name.length > 16) return 80;
  if (name.length > 13) return 96;
  if (name.length > 10) return 112;
  return 128;
};

/**
 * ModelReveal — minimalist per-model scene.
 * Left column: model name (Oswald), tagline, two score cards (Code / Looks),
 * InfoCard, pros/cons lists. Right column: browser frame + live preview note.
 * Top-right: AVERAGE badge (mono).
 */
export const ModelReveal: React.FC<Props> = ({
  data,
  audioFile,
  sceneIndex,
  sceneName,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = useSecToFrame();

  const s = data.schedule;
  const nameSize = getNameSize(data.name);

  return (
    <SceneFrame
      sceneIndex={sceneIndex}
      totalScenes={12}
      sceneName={`${sceneName} · ${data.name}`}
      accentColor={data.color}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <AnimatedBackground baseColor={C.bg} accentColor={data.color} intensity={0.18} />
        <Audio src={staticFile(audioFile)} />

        <AbsoluteFill
          style={{
            padding: "110px 80px 90px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* TOP: eyebrow + model name */}
          <div style={{ marginBottom: 22 }}>
            <div
              style={{
                opacity: fadeIn(frame, T(s.taglineAt), 16),
                transform: `translateX(${(1 - fadeIn(frame, T(s.taglineAt), 16)) * -16}px)`,
                fontSize: 12,
                color: C.textFaint,
                fontWeight: 500,
                letterSpacing: 4,
                fontFamily: FONT.mono,
                textTransform: "uppercase",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  padding: "3px 8px",
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  color: data.color,
                }}
              >
                #{String(data.placement).padStart(2, "0")}
              </span>
              {data.placement === 1 && (
                <span
                  style={{
                    padding: "3px 8px",
                    background: C.warn,
                    color: C.bg,
                    letterSpacing: 3,
                    fontWeight: 700,
                  }}
                >
                  WINNER
                </span>
              )}
              <span style={{ color: C.textMuted }}>{data.tagline}</span>
            </div>

            <div
              style={{
                opacity: fadeIn(frame, T(s.nameAt), 16),
                transform: `translateX(${(1 - fadeIn(frame, T(s.nameAt), 16)) * -200}px)`,
                fontSize: nameSize,
                fontWeight: 700,
                lineHeight: 1,
                fontFamily: FONT.display,
                color: C.text,
                letterSpacing: 2,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                overflow: "hidden",
                paddingBottom: 6,
              }}
            >
              {data.name}
            </div>
          </div>

          {/* Hairline rule */}
          <div
            style={{
              height: 1,
              background: C.border,
              marginBottom: 18,
            }}
          />

          {/* Main 2-column content */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.05fr 1fr",
              gap: 28,
              alignItems: "stretch",
              flex: 1,
              minHeight: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                minHeight: 0,
              }}
            >
              <div style={{ display: "flex", gap: 10 }}>
                <ScoreCard
                  label="CODE"
                  score={data.myScore}
                  accent={data.color}
                  appear={fadeIn(frame, T(s.codeScoreAt), 18)}
                />
                <ScoreCard
                  label="LOOKS"
                  score={data.yourScore}
                  accent={data.color}
                  appear={fadeIn(frame, T(s.looksScoreAt), 18)}
                />
              </div>

              <InfoCard
                maker={data.maker}
                params={data.params}
                license={data.license}
                release={data.release}
                info={data.info}
                color={data.color}
                appear={fadeIn(frame, T(s.infoAt), 18)}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  flex: 1,
                }}
              >
                <BulletList
                  items={data.pros}
                  label="+ PROS"
                  startFrame={T(s.prosAt)}
                  frame={frame}
                  fps={fps}
                />
                <BulletList
                  items={data.cons}
                  label="− CONS"
                  startFrame={T(s.consAt)}
                  frame={frame}
                  fps={fps}
                />
              </div>
            </div>

            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
              }}
            >
              <BrowserFrame
                screenshot={`screenshots/${data.id}.png`}
                url={data.url}
                appear={fadeIn(frame, T(s.browserAt), 20)}
              />
              <div
                style={{
                  marginTop: 14,
                  padding: "12px 18px",
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderLeft: `2px solid ${data.color}`,
                  opacity: fadeIn(frame, T(s.browserAt) + Math.floor(1.0 * fps), 18),
                  transform: `translateY(${(1 - fadeIn(frame, T(s.browserAt) + Math.floor(1.0 * fps), 18)) * 16}px)`,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: C.textFaint,
                    fontWeight: 500,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    fontFamily: FONT.mono,
                    marginBottom: 4,
                  }}
                >
                  // Live Preview
                </div>
                <div
                  style={{
                    fontSize: 16,
                    color: C.text,
                    fontWeight: 400,
                    lineHeight: 1.5,
                    fontFamily: FONT.body,
                  }}
                >
                  What {data.name} generated for the prompt — running live in
                  the browser above.
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>

        {/* AVERAGE badge (top-right) */}
        <AverageBadge
          avg={data.avg}
          accent={data.color}
          appear={fadeIn(frame, T(s.averageAt), 18)}
        />
      </div>
    </SceneFrame>
  );
};

const ScoreCard: React.FC<{
  label: string;
  score: number;
  accent: string;
  appear: number;
}> = ({ label, score, accent, appear }) => {
  return (
    <div
      style={{
        opacity: appear,
        transform: `translateY(${(1 - appear) * 16}px)`,
        flex: 1,
        padding: "16px 20px",
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderTop: `2px solid ${accent}`,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: C.textFaint,
          letterSpacing: 3,
          textTransform: "uppercase",
          fontFamily: FONT.mono,
        }}
      >
        {label} SCORE
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 6,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: C.text,
            lineHeight: 1,
            fontFamily: FONT.display,
          }}
        >
          {score.toFixed(1)}
        </div>
        <div
          style={{
            fontSize: 18,
            color: C.textFaint,
            fontWeight: 500,
            fontFamily: FONT.mono,
          }}
        >
          / 10
        </div>
      </div>
    </div>
  );
};

const BulletList: React.FC<{
  items: string[];
  label: string;
  startFrame: number;
  frame: number;
  fps: number;
}> = ({ items, label, startFrame, frame, fps }) => {
  const isPro = label.startsWith("+");
  return (
    <div
      style={{
        padding: "12px 16px",
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderLeft: `2px solid ${isPro ? C.positive : C.negative}`,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: C.textFaint,
          letterSpacing: 3,
          textTransform: "uppercase",
          fontFamily: FONT.mono,
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      {items.map((text, i) => {
        const delay = startFrame + i * 8;
        const appear = spring({
          frame: frame - delay,
          fps,
          config: { damping: 14, stiffness: 200, mass: 0.5 },
        });
        return (
          <div
            key={text}
            style={{
              opacity: appear,
              transform: `translateX(${(1 - appear) * -12}px)`,
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: isPro ? C.positive : C.negative,
                fontFamily: FONT.mono,
                fontWeight: 700,
                lineHeight: 1.4,
                flexShrink: 0,
              }}
            >
              {isPro ? "+" : "−"}
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: C.text,
                fontFamily: FONT.body,
                lineHeight: 1.4,
              }}
            >
              {text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const AverageBadge: React.FC<{
  avg: number;
  accent: string;
  appear: number;
}> = ({ avg, accent, appear }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 96,
        right: 60,
        opacity: appear,
        transform: `translateY(${(1 - appear) * -12}px)`,
        padding: "16px 22px",
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderTop: `2px solid ${accent}`,
        textAlign: "left",
        zIndex: 10,
        minWidth: 200,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: C.textFaint,
          letterSpacing: 3,
          textTransform: "uppercase",
          fontFamily: FONT.mono,
          marginBottom: 4,
        }}
      >
        // Average
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 6,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: C.text,
            lineHeight: 1,
            fontFamily: FONT.display,
          }}
        >
          {avg.toFixed(2)}
        </div>
        <div
          style={{
            fontSize: 16,
            color: C.textFaint,
            fontWeight: 500,
            fontFamily: FONT.mono,
          }}
        >
          / 10
        </div>
      </div>
    </div>
  );
};
