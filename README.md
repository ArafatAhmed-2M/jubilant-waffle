# 🎬 AI Benchmark Video — Production Pipeline

A complete Remotion-based video production project for testing 7 free AI coding models on the same OS-dashboard challenge.

## Final Rankings
| Rank | Model | Code | Looks | Average |
|------|-------|------|-------|---------|
| 🥇 1 | MiniMax M3 | 9.5 | 10.0 | **9.75** |
| 🥈 2 | DeepSeek V4 Flash | 8.0 | 9.0 | **8.50** |
| 🥈 2 | Big Pickle | 9.0 | 8.0 | **8.50** |
| 🥉 3 | MiMo v2.5 | 8.5 | 8.0 | **8.25** |
| 4 | Gemma 4 31B | 7.0 | 6.0 | **6.50** |
| 5 | Nemotron 3 Super | 6.5 | 1.5 | **4.00** |
| 6 | Nemotron Nano Omni | 5.5 | 1.0 | **3.25** |

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Generate voiceovers
1. Open `tts-generator.html` in a browser
2. Click **Generate All** (uses puter.js + xAI 'ara' voice, free)
3. Download all 12 MP3s into `public/audio/`

Expected files in `public/audio/`:
```
intro.mp3  the-prompt.mp3  minimax.mp3  deepseek.mp3
bigpickle.mp3  mimo.mp3  gemma.mp3
nemotron-super.mp3  nemotron-nano.mp3
leaderboard.mp3  verdict.mp3  outro.mp3
```

### 3. Preview locally
```bash
npx remotion studio
```
Open `http://localhost:3000` and preview each composition.

### 4. Render via GitHub Actions (recommended)
1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. Go to **Actions** tab → **Render Scenes** workflow
3. Click **Run workflow**
   - `scene`: `all` (or specific scenes like `01,02,03`)
   - `quality`: `draft` (fast) or `standard` (high)
4. Download the MP4 artifacts

### 5. Concatenate scenes (locally with ffmpeg)
After downloading all scene MP4s, concatenate them:
```bash
# Create a concat list
echo "file '01-hook.mp4'" > list.txt
echo "file '02-setup.mp4'" >> list.txt
# ... etc

ffmpeg -f concat -safe 0 -i list.txt -c copy final-video.mp4
```

---

## Project Structure
```
ai-benchmark-video/
├── src/
│   ├── compositions/
│   │   ├── data.ts          # Model data, leaderboard
│   │   ├── utils.ts         # Audio duration helpers
│   │   ├── visuals.tsx      # Reusable AnimatedBackground, Watermark
│   │   ├── Intro.tsx        # 7-model intro reveal
│   │   ├── ThePrompt.tsx    # The challenge + 8 sections
│   │   ├── ModelReveal.tsx  # Reusable per-model reveal
│   │   ├── Leaderboard.tsx  # Podium + table
│   │   ├── Verdict.tsx      # 4 insight cards
│   │   ├── Outro.tsx        # Subscribe + typewriter comment
│   │   └── Root.tsx         # (root registration)
│   ├── global.css
│   ├── index.ts
│   └── Root.tsx             # Composition registry
├── public/
│   └── audio/               # ← put MP3s here
├── scripts/
│   └── render-scenes.mjs    # CLI renderer
├── .github/workflows/
│   └── render.yml           # GitHub Action
├── tts-generator.html       # ← open in browser to make audio
├── youtube-metadata.txt     # Title, description, tags, thumbnail
└── package.json
```

## Tech Stack
- **Remotion 4.0.471** — React-based video framework
- **Puter.js** — Free unlimited TTS (xAI 'ara' voice)
- **FFmpeg** — Scene concatenation
- **GitHub Actions** — Cloud rendering
- **TypeScript** — Type-safe compositions

## Composition Specs
- **Resolution**: 1920 × 1080 (YouTube 1080p)
- **FPS**: 30
- **Total runtime**: ~5-6 minutes (12 scenes, audio-driven)
- **Format**: H.264 MP4

## Customization
- Edit model data in `src/compositions/data.ts`
- Tweak animations in each `*.tsx` file
- Colors follow a dark theme with model-specific accent
- All animations use `interpolate()`, `spring()`, and `Easing` — no CSS animations

## License
Personal use. Audio generated via puter.js (free tier).
