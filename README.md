# Geet V2

A sleek, interactive Music Player & Web Audio Visualizer built with **Next.js 16**, **React 19**, **Web Audio API**, **HTML5 Canvas**, and **Framer Motion**.

![Geet](public/favicon.ico)

---

## Features

- **Web Audio API Engine**: Custom AudioContext & AnalyserNode pipeline for real-time frequency spectrum analysis.
- **Canvas Audio Visualizer**: 60fps HTML5 Canvas frequency spectrum visualizer rendered via `requestAnimationFrame`.
- **Live Song Search**: Search and stream high-quality audio tracks integrated with the JioSaavn API.
- **High-Frequency Performance**: Timeline scrubbing and elapsed time updates bypass React re-renders via direct DOM ref updates for maximum performance.
- **Global Keyboard Shortcuts**: Control playback, seek tracks, and skip songs using keyboard hotkeys (with automatic input focus protection).
- **Decoupled Architecture**: Clean domain layer separating queue state, audio context handling, and UI components.

---

## Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI & Components**: [React 19](https://react.dev/), [Radix UI Popover](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), Class Variance Authority (`cva`), `clsx`, `tailwind-merge`
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Audio & Visualizer**: Web Audio API (`AudioContext`, `AnalyserNode`), HTML5 2D Canvas

---

## 📁 Project Structure

```text
geetv2/
├── app/
│   ├── globals.css         # Global styles & Tailwind CSS imports
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # App entry point rendering <MusicPlayer />
├── components/
│   ├── control/            # Player control components
│   │   ├── song-list.tsx   # Playlist song items
│   │   ├── song-search.tsx # Song search input & skeleton loaders
│   │   ├── time-controls.tsx # Play / Pause controls
│   │   └── timeline.tsx    # Interactive seek timeline bar
│   ├── music-visualizer/  # Audio spectrum visualizer canvas & draw logic
│   │   ├── index.tsx       # Canvas component
│   │   └── utils.ts        # Frequency data processing & drawing utilities
│   ├── gradient.tsx        # Background ambient shader gradient
│   ├── menu.tsx            # Popover menu overlay
│   ├── player.tsx          # Main orchestrator component
│   └── ui/                 # Reusable UI primitives (Popover, etc.)
├── lib/
│   ├── format.ts           # Time formatting helpers (MM:SS)
│   ├── music-manager.ts    # Web Audio API & Audio element manager
│   ├── player-context.tsx  # React Context provider & useMusicPlayer hook
│   ├── queue-manager.ts    # Pure state engine for playlist queue management
│   ├── shortcut-manager.ts # Keyboard shortcut event listener manager
│   ├── song-api.ts         # Song search API integration
│   └── utils.ts            # Class merging & HTML entity decoding utils
└── public/                 # Static assets
```

---

## ⌨️ Keyboard Shortcuts

| Hotkey | Action |
| :--- | :--- |
| **`Space`** | Play / Pause toggle |
| **`Arrow Up`** | Previous song in queue |
| **`Arrow Down`** | Next song in queue |
| **`Arrow Left`** | Seek 1 second backward |
| **`Arrow Right`** | Seek 1 second forward |

> *Note: Keyboard shortcuts are automatically disabled while typing in search or input fields.*

---

##  Getting Started

### Prerequisites

Ensure you have **Node.js** (v18+ recommended) and **npm** / **pnpm** installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/neon-wave.git
   cd geetv2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Build and start the production application:

```bash
npm run build
npm run start
```
