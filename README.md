# 🟣 Tangram — Ancient Puzzle, Modern Style

A full-stack browser implementation of the classic **Tangram** puzzle game, built with Next.js, TypeScript, and Tailwind CSS. Features a neon/glassmorphism aesthetic, smooth Framer Motion animations, and full mobile touch support.

---

## Features

- **7 classic tangram pieces** — 2 large triangles, 1 medium triangle, 2 small triangles, 1 square, 1 parallelogram
- **8 hand-crafted puzzles** — Easy, Medium, and Hard difficulties
- **Drag & drop** piece placement with snap-to-correct detection
- **Rotate & flip** — rotate pieces in 45° steps, flip the parallelogram
- **Timed challenges** — Medium (5 min) and Hard (3 min) have countdowns
- **Hint system** — auto-places the next unplaced piece (with score penalty)
- **Score system** — time bonus, difficulty multiplier, hint deductions
- **High score persistence** via `localStorage`
- **Synthesized sound effects** — Web Audio API, no external files needed
- **Pause / resume** with settings panel
- **Animated end screen** with confetti on win
- **Fully responsive** — works on desktop, tablet, and mobile
- **Touch controls** — drag, tap to select, on-screen rotate/flip buttons
- **Neon glassmorphism** visual theme with glowing pieces and smooth transitions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Rendering | HTML5 Canvas |
| State | React `useReducer` + custom hooks |
| Storage | `localStorage` via custom hook |
| Audio | Web Audio API (synthesized) |
| Deploy | Vercel (zero-config) |

---

## Controls

### Desktop
| Action | Control |
|---|---|
| Pick up piece | Click + drag |
| Select piece | Click |
| Rotate left 45° | `Q` |
| Rotate right 45° | `E` or `R` |
| Flip piece | `F` |
| Pause | `Escape` |

### Mobile / Touch
| Action | Control |
|---|---|
| Move piece | Touch + drag |
| Select piece | Tap |
| Rotate left | ↺ button |
| Rotate right | ↻ button |
| Flip piece | ⇄ button |
| Hint | 💡 button |
| Pause | ⏸ button |

---

## How to Run Locally

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd tangram

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
open http://localhost:3000
```

### Build for production

```bash
npm run build
npm start
```

---

## Deploy to Vercel

The project is zero-config ready for Vercel.

1. Push to a GitHub/GitLab/Bitbucket repo
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Click **Deploy** — no environment variables needed

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

---

## Project Structure

```
tangram/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Entry point
│   └── globals.css         # Global styles
├── components/
│   ├── game/
│   │   ├── GameScreen.tsx  # Main game orchestrator
│   │   ├── GameCanvas.tsx  # HTML5 Canvas rendering + drag-drop
│   │   ├── HUD.tsx         # Score, timer, controls overlay
│   │   ├── GameControls.tsx # Rotate/flip buttons
│   │   ├── MainMenu.tsx    # Start screen
│   │   ├── PauseMenu.tsx   # Pause overlay
│   │   └── EndScreen.tsx   # Win/lose screen with confetti
│   └── ui/
│       ├── Button.tsx      # Reusable button
│       └── Modal.tsx       # Reusable modal
├── hooks/
│   ├── useGameState.ts     # Game state reducer
│   ├── useSound.ts         # Web Audio sound effects
│   └── useLocalStorage.ts  # Persistent storage
├── lib/
│   ├── pieces.ts           # Piece definitions, vertices, transforms
│   ├── shapes.ts           # Puzzle definitions and solutions
│   └── gameLogic.ts        # Placement detection, scoring
├── types/
│   └── index.ts            # TypeScript types
└── public/
    └── favicon.svg         # Tangram-shaped favicon
```

---

## Gameplay

1. Select a difficulty on the main menu
2. A **target silhouette** appears in the puzzle area
3. Drag pieces from the **tray** at the bottom into the puzzle area
4. Rotate (`Q`/`E`) and flip (`F`) pieces to match the silhouette
5. Pieces **glow** and lock in place when correctly positioned
6. Complete all 7 pieces to win and advance to the next puzzle
7. Use the 💡 hint to auto-place one piece (costs 100 points)

---

## License

MIT
