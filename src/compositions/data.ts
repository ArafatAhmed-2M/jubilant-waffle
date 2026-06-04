export type ModelSchedule = {
  /** sec — when the model name appears */
  nameAt: number;
  /** sec — when the tagline + placement text appears */
  taglineAt: number;
  /** sec — when the InfoCard (maker/params/...) appears */
  infoAt: number;
  /** sec — when the CODE score card appears */
  codeScoreAt: number;
  /** sec — when the LOOKS score card appears */
  looksScoreAt: number;
  /** sec — when the PROS bullets start streaming in */
  prosAt: number;
  /** sec — when the CONS bullets start streaming in */
  consAt: number;
  /** sec — when the browser screenshot appears */
  browserAt: number;
  /** sec — when the AVERAGE badge appears (top-right) */
  averageAt: number;
};

export type ModelData = {
  id: string;
  name: string;
  shortName: string;
  color: string;
  myScore: number;
  yourScore: number;
  avg: number;
  placement: number;
  tagline: string;
  maker: string;
  params: string;
  license: string;
  release: string;
  info: string;
  url: string;
  pros: string[];
  cons: string[];
  /**
   * Hand-picked animation schedule (in seconds) read from the audio JSON.
   * Each value is the second in the audio at which the element should
   * appear. The component converts these to frames via fps.
   */
  schedule: ModelSchedule;
};

export const MODELS: ModelData[] = [
  {
    id: "minimax",
    name: "MiniMax M3",
    shortName: "MiniMax M3",
    color: "#8b5cf6",
    myScore: 9.5,
    yourScore: 10,
    avg: 9.75,
    placement: 1,
    tagline: "The clear winner",
    maker: "MiniMax",
    params: "Undisclosed",
    license: "Free tier",
    release: "2026",
    info: "Most complete, most polished submission. Animated orb background, perfect radar chart, working light mode.",
    url: "minimax.html",
    pros: [
      "Best visual design of all 7",
      "Animated orb background",
      "Perfect radar chart",
    ],
    cons: ["Over 800 line limit"],
    // transcript: "First up, Mini Max M3." → 1.04
    // "And honestly, this one blew me away." → 2.76
    // "The background has three animated glowing orbs..." → 5.48
    // "9.5 from me" (9) → 21.0
    // "10 out of 10 from the looks test" (10) → 23.32
    // "average 9.75" → 25.38
    schedule: {
      nameAt: 1.04,
      taglineAt: 1.04,
      infoAt: 5.48,
      codeScoreAt: 21.0,
      looksScoreAt: 23.32,
      prosAt: 7.0,
      consAt: 19.0,
      browserAt: 4.0,
      averageAt: 25.38,
    },
  },
  {
    id: "deepseek",
    name: "DeepSeek V4 Flash",
    shortName: "DeepSeek Flash",
    color: "#22d3ee",
    myScore: 8.0,
    yourScore: 9,
    avg: 8.5,
    placement: 2,
    tagline: "Solid, reliable, and fast",
    maker: "DeepSeek AI",
    params: "MoE · 256B total",
    license: "MIT (open source)",
    release: "2026",
    info: "Professional terminal with a real file path. The async Python in the code showcase is genuine streaming code.",
    url: "deepseek-flash.html",
    pros: [
      "Real streaming Python code",
      "Professional terminal with file path",
      "Clean IIFE structure",
    ],
    cons: ["Cards slightly too faint on dark bg"],
    // transcript: "DeepSeek V4 Flash" → 0.0
    // "came in second joint." → 2.64
    // "Professional terminal with an actual file path..." → 3.66
    // "8 from me on the code" (8) → 17.26
    // "9 from the visual test" (9) → 18.94
    // "average 8.5" → 20.6
    schedule: {
      nameAt: 0.0,
      taglineAt: 0.0,
      infoAt: 3.66,
      codeScoreAt: 17.26,
      looksScoreAt: 18.94,
      prosAt: 6.0,
      consAt: 14.0,
      browserAt: 2.5,
      averageAt: 20.6,
    },
  },
  {
    id: "bigpickle",
    name: "Big Pickle",
    shortName: "Big Pickle",
    color: "#4ade80",
    myScore: 9.0,
    yourScore: 8,
    avg: 8.5,
    placement: 2,
    tagline: "Most personality",
    maker: "Big Pickle",
    params: "Custom",
    license: "Open weights",
    release: "2026",
    info: "Held two registers at once — funny AND technically correct. Boot sequence talks about 'brine' and 'fermenting reasoning'.",
    url: "bigpickle.html",
    pros: [
      "Best personality of all 7",
      "Bubble animation background",
      "Most readable code",
    ],
    cons: ["1230 lines vs 800 limit", "Brine refills instead of draining"],
    // transcript: "Big pickle," → 0.0
    // "8.5 average, joint second." → 1.56 / 3.46
    // "Now this one had a brief..." → 4.6
    // "9 from me" (9) → 26.6
    // "8 from the looks test" (8) → 27.66
    schedule: {
      nameAt: 0.0,
      taglineAt: 0.0,
      infoAt: 4.6,
      codeScoreAt: 26.6,
      looksScoreAt: 27.66,
      prosAt: 8.0,
      consAt: 18.0,
      browserAt: 3.5,
      averageAt: 25.0,
    },
  },
  {
    id: "mimo",
    name: "MiMo v2.5",
    shortName: "MiMo v2.5",
    color: "#fb923c",
    myScore: 8.5,
    yourScore: 8,
    avg: 8.25,
    placement: 3,
    tagline: "Small but mighty",
    maker: "Xiaomi",
    params: "7B",
    license: "Apache 2.0 (open source)",
    release: "2026",
    info: "A 7B model that beat a 31B. Math-based quiz fits Xiaomi's math-specialist model identity. Lean into strengths.",
    url: "mimo.html",
    pros: [
      "7B model beats 31B model",
      "Best boot terminal sequence",
      "Math-based quiz fits identity",
    ],
    cons: ["Sparse ticker", "Cards slightly faint"],
    // transcript: "Mimo V2 .5" → 0.0
    // "Third place with 8 .25" → 1.84 / 3.3
    // "Here's the thing..." → 4.88
    schedule: {
      nameAt: 0.0,
      taglineAt: 0.0,
      infoAt: 4.88,
      codeScoreAt: 3.3,
      looksScoreAt: 3.3,
      prosAt: 7.0,
      consAt: 18.0,
      browserAt: 3.5,
      averageAt: 3.3,
    },
  },
  {
    id: "gemma",
    name: "Gemma 4 31B",
    shortName: "Gemma 4 31B",
    color: "#60a5fa",
    myScore: 7.0,
    yourScore: 6,
    avg: 6.5,
    placement: 4,
    tagline: "Disappointing for 31B",
    maker: "Google DeepMind",
    params: "31B",
    license: "Gemma terms (open weights)",
    release: "2026",
    info: "Google's 31B flagship underperformed. Radar is a solid blue hexagon with no axis labels. Feature cards invisible.",
    url: "gemma.html",
    pros: [
      "Clean minimal topbar",
      "Working dark mode toggle",
      "Google 4-color gradient",
    ],
    cons: [
      "Radar = solid hexagon no labels",
      "Feature cards invisible",
      "Ticker static no animation",
    ],
    // transcript: "Gemma 4." → 0.0
    // "31 billion parameters" → 1.66
    // "Google DeepMind." → 3.28
    // "6 .5 average" → 4.62
    // "this one is genuinely surprising" → 6.32
    schedule: {
      nameAt: 0.0,
      taglineAt: 0.0,
      infoAt: 6.32,
      codeScoreAt: 4.62,
      looksScoreAt: 4.62,
      prosAt: 8.0,
      consAt: 14.0,
      browserAt: 3.5,
      averageAt: 18.0,
    },
  },
  {
    id: "nemotron-super",
    name: "Nemotron 3 Super",
    shortName: "Nemotron Super",
    color: "#76b900",
    myScore: 6.5,
    yourScore: 1.5,
    avg: 4.0,
    placement: 5,
    tagline: "Code improved, looks didn't",
    maker: "NVIDIA",
    params: "49B (hybrid Mamba-Transformer)",
    license: "NVIDIA Open Model License",
    release: "2026",
    info: "Comeback from round 1. CSS quotes bug fixed. Code quality up. Visual design still feels unfinished and rough.",
    url: "nemotron.html",
    pros: [
      "CSS vars fixed from round 1",
      "Quiz questions technically correct",
      "Structure improved",
    ],
    cons: [
      "Still looks broken visually",
      "gap syntax missing colons",
      "Design unfinished",
    ],
    // transcript: "Nemotron 3 Super." → 0.0
    // "4 out of 10 average." → 2.14 / 2.74
    // "Now this is a comeback story." → 3.62
    // "6 .5 from me on the code" (6.5) → 23.72
    // "1 .5 from the visual test" (1.5) → 26.12
    schedule: {
      nameAt: 0.0,
      taglineAt: 0.0,
      infoAt: 3.62,
      codeScoreAt: 23.72,
      looksScoreAt: 26.12,
      prosAt: 10.0,
      consAt: 20.0,
      browserAt: 4.0,
      averageAt: 28.0,
    },
  },
  {
    id: "nemotron-nano",
    name: "Nemotron Nano Omni",
    shortName: "Nemotron Nano",
    color: "#c8f500",
    myScore: 5.5,
    yourScore: 1,
    avg: 3.25,
    placement: 6,
    tagline: "Detailed prompt, broken output",
    maker: "NVIDIA",
    params: "Multimodal (omni)",
    license: "NVIDIA Open Model License",
    release: "2026",
    info: "The most detailed prompt of all seven — with a self-check list at the bottom. Still leaked a reasoning tag and broke the radar.",
    url: "nemotron-nano.html",
    pros: [
      "VRAM widget shows GB values",
      "All 8 boot lines present",
      "CSS vars no quotes",
    ],
    cons: [
      "Terminal position:fixed overlays whole page",
      "Radar forgot /100 so points off chart",
      "Script ends with leaked reasoning tag",
    ],
    // transcript: "And last," → 0.0
    // "Nemotron Nano Omni." → 1.2
    // "3 .25 average." → 3.26
    // "This one had the most detailed prompt..." → 5.4
    // "One out of ten visually." → 39.12
    // "3 .25 average." (end) → 40.72
    schedule: {
      nameAt: 1.2,
      taglineAt: 1.2,
      infoAt: 5.4,
      codeScoreAt: 3.26,
      looksScoreAt: 39.12,
      prosAt: 8.0,
      consAt: 18.0,
      browserAt: 4.5,
      averageAt: 40.72,
    },
  },
];

export const LEADERBOARD = [
  { rank: 1, name: "MiniMax M3", color: "#8b5cf6", code: 9.5, looks: 10, avg: 9.75 },
  { rank: 2, name: "DeepSeek Flash", color: "#22d3ee", code: 8.0, looks: 9, avg: 8.5 },
  { rank: 2, name: "Big Pickle", color: "#4ade80", code: 9.0, looks: 8, avg: 8.5 },
  { rank: 3, name: "MiMo v2.5", color: "#fb923c", code: 8.5, looks: 8, avg: 8.25 },
  { rank: 4, name: "Gemma 4 31B", color: "#60a5fa", code: 7.0, looks: 6, avg: 6.5 },
  { rank: 5, name: "Nemotron 3 Super", color: "#76b900", code: 6.5, looks: 1.5, avg: 4.0 },
  { rank: 6, name: "Nemotron Nano Omni", color: "#c8f500", code: 5.5, looks: 1, avg: 3.25 },
];

export const COMPOSITIONS = [
  { id: "01-hook", compositionId: "Intro", file: "audio/intro.mp3", baseDuration: 14 },
  { id: "02-setup", compositionId: "ThePrompt", file: "audio/the-prompt.mp3", baseDuration: 22 },
  { id: "03-minimax", compositionId: "MiniMax", file: "audio/minimax.mp3", baseDuration: 28 },
  { id: "04-deepseek", compositionId: "DeepSeek", file: "audio/deepseek.mp3", baseDuration: 22 },
  { id: "05-bigpickle", compositionId: "BigPickle", file: "audio/bigpickle.mp3", baseDuration: 22 },
  { id: "06-mimo", compositionId: "MiMo", file: "audio/mimo.mp3", baseDuration: 20 },
  { id: "07-gemma", compositionId: "Gemma", file: "audio/gemma.mp3", baseDuration: 18 },
  { id: "08-nemotron-super", compositionId: "NemotronSuper", file: "audio/nemotron-super.mp3", baseDuration: 20 },
  { id: "09-nemotron-nano", compositionId: "NemotronNano", file: "audio/nemotron-nano.mp3", baseDuration: 22 },
  { id: "10-leaderboard", compositionId: "Leaderboard", file: "audio/leaderboard.mp3", baseDuration: 25 },
  { id: "11-verdict", compositionId: "Verdict", file: "audio/verdict.mp3", baseDuration: 28 },
  { id: "12-outro", compositionId: "Outro", file: "audio/outro.mp3", baseDuration: 14 },
];
