# Math Blaster — Galactic Speed Drill

A kid-friendly arcade math drill built for iPad Mini (landscape) with Apple
Pencil handwriting input. Implemented in Vite + React + TypeScript from the
handoff designs in `3-number-speed-drill` (Claude Design export).

Players see a horizontal equation with three single digits being added or
subtracted (e.g. `7 + 3 − 2 = ?`) and write the answer in a graph-paper
canvas. A tiny on-device digit recognizer auto-advances when the answer is
correct. Finishing a drill unlocks an original pixel-art "Space Hero"
sticker.

## Screens

- **Home** — bouncing title, starfield, PLAY, Sticker Book, High Scores
- **Settings** — session length (60s / 20 problems / 30s), pen color, sound, haptics
- **Stats** — stars, drills done, accuracy, best/min, streak, weekly bar chart, recent runs
- **Collection** — 3×3 sticker grid with rarity tiers and detail modal
- **Drill** — timer bar, combo multiplier, equation, and drawing canvas
- **Correct / Wrong overlays** — green particle burst / red shake
- **Results** — STAGE CLEAR, 3-star rating, stat grid, "Open Pack"
- **Unbox** — slot-machine reel → rarity reveal → add to book

## Running

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # static bundle in dist/
npm run preview   # serve the built bundle
npm run typecheck
```

Best viewed in landscape on an iPad Mini (or a desktop browser sized similarly).
Writing digits with an Apple Pencil is the intended input; mouse works in
development.

## Persistence

Everything lives in `localStorage` under the `starcadets:v1:*` namespace:
settings, owned stickers, and stats (including streak, weekly counts, and
recent runs). Clearing site data resets the save.

## Layout

```
src/
├── App.tsx              # router + global state + localStorage wiring
├── main.tsx
├── styles.css           # keyframes and global reset
├── types.ts
├── palette.ts           # 14-color arcade palette, rarity colors
├── frame/IPadMiniFrame  # 1180×820 outer / 1060×720 inner, scales to window
├── ui/                  # PixelPanel, ArcadeButton, PixelText, ScanlineOverlay,
│                        # StarField, pixel heart/star/trophy icons
├── draw/                # DrawCanvas + 8×8 digit recognizer
├── stickers/            # 9 hand-painted 16×16 stickers + card/renderer
├── game/                # genProblem (answer ∈ [0,18]), scoring helpers
├── state/               # versioned localStorage load/save
└── screens/             # Home, Settings, Stats, Collection, Drill, Results, Unbox
```

## Design source

The visual design is a direct port of the Claude Design prototype
(`3-number-speed-drill/project/Math Blaster.html`). The design tool's
"Tweaks" panel and `postMessage` edit-mode bridge are intentionally
omitted — they're authoring-tool affordances, not product UI.
