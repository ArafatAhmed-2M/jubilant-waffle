import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Audio,
  staticFile,
} from "remotion";
import { AnimatedBackground } from "./visuals";
import { BrowserFrame, InfoCard } from "./BrowserFrame";
import type { ModelData } from "./data";
import { useWordSync, type Word } from "./useWordSync";

type Props = {
  data: ModelData;
  audioFile: string;
  words?: Word[];
};

const getNameSize = (name: string): number => {
  if (name.length > 16) return 110;
  if (name.length > 13) return 130;
  if (name.length > 10) return 150;
  return 165;
};

export const ModelReveal: React.FC<Props> = ({ data, audioFile, words }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const { wordAt, frameAt } = useWordSync(words);

  // Trigger frames for each section, anchored to specific words
  // 1. Name appears when first word of model name is said
  // 2. Tagline appears when "honestly" / "now" / "this" / "and" (the descriptive opener)
  // 3. Info card appears when "parameters" / model context is mentioned
  // 4. Score cards appear when first score number is read
  // 5. Pros/cons appear during the descriptive middle
  // 6. Average badge appears on "average"
  const nameAt = wordAt(
    (w) => normalize(w.word) === normalize(data.name.split(" ")[0] ?? data.name),
  );

  const taglineAt = nameAt > 0
    ? wordAt(
        (w, i, all) =>
          w.start_time > (all.find((a) => normalize(a.word) === normalize(data.name.split(" ")[0] ?? data.name))?.end_time ?? 0) + 0.5 &&
          ["this", "now", "and", "but", "honestly", "sort", "mimo", "gemma", "deepseek", "big", "nemotron"].includes(
            normalize(w.word),
          ),
      )
    : 0;

  // Info card: when model context (maker/params) is mentioned
  // For MiniMax: "background has three animated glowing orbs" → 5.48
  // For DeepSeek: "Professional terminal" → 3.66
  // For BigPickle: "brief that was deliberately weird" → 5.6
  // For MiMo: "7 billion parameter model" → 7.22
  // For Gemma: "31 billion parameters" → 1.24
  // For NemotronSuper: "comeback story" → 4.68
  // For NemotronNano: "most detailed prompt" → 6.24
  const infoAt = wordAt(
    (w) =>
      ["background", "professional", "brief", "billion", "comeback", "detailed"].includes(
        normalize(w.word),
      ),
  ) || Math.max(0, nameAt + Math.floor(1.5 * fps));

  // Score cards: when the first score number is read (e.g. "9.5" or "8.5")
  const codeScoreAt = frameAt("me", 1) + Math.floor(0.3 * fps);
  const looksScoreAt = codeScoreAt + Math.floor(1.0 * fps);

  // Pros: when descriptive middle is being read (after first score)
  const prosAt = codeScoreAt + Math.floor(0.4 * fps);

  // Average badge: when "average" is said
  const averageAt = wordAt((w) => normalize(w.word) === "average");
  const browserAt = Math.max(0, nameAt + Math.floor(2.0 * fps));

  const nameSize = getNameSize(data.name);

  // Cross-fade near end
  const fadeOut = interpolate(frame, [durationInFrames - 24, durationInFrames - 4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <AnimatedBackground baseColor="#08080d" accentColor={data.color} intensity={0.4} />
      <Audio src={staticFile(audioFile)} />

      {/* Top: tagline + name */}
      <AbsoluteFill style={{ padding: "40px 70px", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              opacity: taglineAt > 0 ? fadeInAt(frame, taglineAt) : 0,
              transform: `translateY(${(1 - fadeInAt(frame, taglineAt)) * 20}px)`,
              fontSize: 22,
              fontWeight: 800,
              color: data.color,
              letterSpacing: 6,
              textTransform: "uppercase",
              fontFamily: "Inter, sans-serif",
              marginBottom: 8,
            }}
          >
            #{data.placement} Place · {data.tagline}
          </div>

          <div
            style={{
              opacity: nameAt > 0 ? fadeInAt(frame, nameAt) : 0,
              transform: `translateX(${(1 - fadeInAt(frame, nameAt)) * -200}px)`,
              fontSize: nameSize,
              fontWeight: 900,
              lineHeight: 1.05,
              fontFamily: "'Bebas Neue', 'Inter', sans-serif",
              background: `linear-gradient(135deg, #ffffff 0%, ${data.color} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: 2,
              textShadow: `0 0 80px ${data.color}40`,
              whiteSpace: "nowrap",
              overflow: "hidden",
              paddingBottom: 8,
            }}
          >
            {data.name}
          </div>
        </div>

        {/* Main 2-column content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 1fr",
            gap: 36,
            alignItems: "stretch",
            flex: 1,
            minHeight: 0,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18, minHeight: 0 }}>
            <div style={{ display: "flex", gap: 16 }}>
              <ScoreCard
                label="CODE"
                score={data.myScore}
                color={data.color}
                appear={fadeInAt(frame, codeScoreAt)}
              />
              <ScoreCard
                label="LOOKS"
                score={data.yourScore}
                color={data.color}
                appear={fadeInAt(frame, looksScoreAt)}
              />
            </div>

            <InfoCard
              maker={data.maker}
              params={data.params}
              license={data.license}
              release={data.release}
              info={data.info}
              color={data.color}
              appear={fadeInAt(frame, infoAt)}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, flex: 1 }}>
              <BulletList
                items={data.pros}
                color="#4ade80"
                icon="✓"
                label="PROS"
                startFrame={prosAt}
                frame={frame}
                fps={fps}
              />
              <BulletList
                items={data.cons}
                color="#ff4d6d"
                icon="✕"
                label="CONS"
                startFrame={Math.max(0, averageAt - Math.floor(2 * fps))}
                frame={frame}
                fps={fps}
              />
            </div>
          </div>

          <div style={{ position: "relative", display: "flex", alignItems: "stretch" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <BrowserFrame
                screenshot={`screenshots/${data.id}.png`}
                url={data.url}
                appear={fadeInAt(frame, browserAt)}
              />
              <div
                style={{
                  marginTop: 20,
                  padding: "14px 18px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  opacity: fadeInAt(frame, browserAt + Math.floor(1.0 * fps)),
                  transform: `translateY(${(1 - fadeInAt(frame, browserAt + Math.floor(1.0 * fps))) * 20}px)`,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "#94a3b8",
                    fontWeight: 800,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    marginBottom: 4,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Live preview
                </div>
                <div
                  style={{
                    fontSize: 16,
                    color: "#cbd5e1",
                    fontWeight: 500,
                    lineHeight: 1.4,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  What {data.name} generated for the prompt — running live in the browser above.
                </div>
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* Final badge - appears on "average" */}
      {averageAt > 0 && (
        <FinalBadge
          avg={data.avg}
          color={data.color}
          appear={fadeInAt(frame, averageAt)}
          pulse={1}
        />
      )}
    </AbsoluteFill>
  );
};

// Local helpers
const normalize = (w: string): string => w.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Returns 0 before `start`, ramps to 1 over 12 frames, then holds at 1. */
const fadeInAt = (frame: number, start: number): number => {
  if (start <= 0) return 0;
  if (frame < start) return 0;
  const dur = 14;
  if (frame >= start + dur) return 1;
  return (frame - start) / dur;
};

const ScoreCard: React.FC<{
  label: string;
  score: number;
  color: string;
  appear: number;
}> = ({ label, score, color, appear }) => {
  const transform = `scale(${0.85 + appear * 0.15}) translateY(${(1 - appear) * 20}px)`;
  return (
    <div
      style={{
        opacity: appear,
        transform,
        flex: 1,
        padding: "20px 24px",
        background: `linear-gradient(135deg, ${color}22, ${color}08)`,
        border: `2px solid ${color}`,
        borderRadius: 18,
        backdropFilter: "blur(20px)",
        boxShadow: `0 0 40px ${color}30`,
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: "#94a3b8",
          letterSpacing: 4,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {label} SCORE
      </div>
      <div
        style={{
          marginTop: 4,
          fontSize: 76,
          fontWeight: 900,
          color: color,
          lineHeight: 1,
          fontFamily: "'Bebas Neue', 'Inter', sans-serif",
        }}
      >
        {score.toFixed(1)}
        <span style={{ fontSize: 28, color: "#64748b", marginLeft: 4 }}>/ 10</span>
      </div>
    </div>
  );
};

const BulletList: React.FC<{
  items: string[];
  color: string;
  icon: string;
  label: string;
  startFrame: number;
  frame: number;
  fps: number;
}> = ({ items, color, icon, label, startFrame, frame, fps }) => {
  return (
    <div
      style={{
        padding: "14px 16px",
        background: `${color}0d`,
        border: `1.5px solid ${color}55`,
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 900,
          color: color,
          letterSpacing: 3,
          fontFamily: "Inter, sans-serif",
          textTransform: "uppercase",
          marginBottom: 4,
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
              transform: `translateX(${(1 - appear) * -20}px)`,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: color,
                color: "#0a0a0f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 900,
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#fff",
                fontFamily: "Inter, sans-serif",
                lineHeight: 1.3,
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

const FinalBadge: React.FC<{
  avg: number;
  color: string;
  appear: number;
  pulse: number;
}> = ({ avg, color, appear, pulse }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 200,
        right: 60,
        opacity: appear,
        transform: `scale(${appear * pulse})`,
        padding: "18px 32px",
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        borderRadius: 20,
        boxShadow: `0 16px 50px ${color}80`,
        textAlign: "center",
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 800,
          color: "#0a0a0f",
          letterSpacing: 3,
          fontFamily: "Inter, sans-serif",
          textTransform: "uppercase",
        }}
      >
        Average
      </div>
      <div
        style={{
          marginTop: 2,
          fontSize: 58,
          fontWeight: 900,
          color: "#0a0a0f",
          lineHeight: 1,
          fontFamily: "'Bebas Neue', 'Inter', sans-serif",
        }}
      >
        {avg.toFixed(2)}
      </div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#0a0a0f",
          fontFamily: "Inter, sans-serif",
        }}
      >
        / 10
      </div>
    </div>
  );
};
