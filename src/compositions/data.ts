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
  pros: string[];
  cons: string[];
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
    pros: [
      "Best visual design of all 7",
      "Animated orb background",
      "Perfect radar chart",
    ],
    cons: ["Over 800 line limit"],
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
    pros: [
      "Real streaming Python code",
      "Professional terminal with file path",
      "Clean IIFE structure",
    ],
    cons: ["Cards slightly too faint on dark bg"],
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
    pros: [
      "Best personality of all 7",
      "Bubble animation background",
      "Most readable code",
    ],
    cons: ["1230 lines vs 800 limit", "Brine refills instead of draining"],
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
    pros: [
      "7B model beats 31B model",
      "Best boot terminal sequence",
      "Math-based quiz fits identity",
    ],
    cons: ["Sparse ticker", "Cards slightly faint"],
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
