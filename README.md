# Focus (AscentLabs_Task3)

A sleek, responsive Pomodoro study timer engineered with strict timestamp delta calculations to eliminate background tab throttling drift. Features customizable focus and break sessions, automatic cycle transitions with audio chimes and celebrations, and persistent daily productivity tracking reset by date.

**Live Demo:** [https://ascent-labs-task3-focus.vercel.app/](https://ascent-labs-task3-focus.vercel.app/) *(or deploy URL)*  
**Repository:** [https://github.com/x-anish-y/AscentLabs_Task3](https://github.com/x-anish-y/AscentLabs_Task3)

---

## Features

- **Drift-Free Precision Countdown**:
  - Uses absolute wall-clock target timestamps (`Date.now()`) rather than counting raw `setInterval` ticks.
  - Guarantees 100% accuracy even when browsers throttle background tabs to once-per-minute execution.
- **Configurable Intervals (Defaults 25m / 5m)**:
  - Custom duration inputs with validation.
  - Quick-pick presets for Standard (25/5), Deep Work (50/10), and Sprint (15/3).
- **Smooth State Controls**:
  - Start, Pause, Reset, and Skip between Focus and Break modes.
- **Auto-Switching Cycles**:
  - Automatically transitions between focus and rest sessions upon timer completion.
  - Plays a multi-frequency synthesized bell chime via Web Audio API (no external audio assets).
  - Triggers celebratory confetti upon session completion.
- **Daily Productivity Tracking**:
  - Tracks sessions completed today and total focus time accumulated.
  - Persisted in `localStorage` with automated daily reset based on `YYYY-MM-DD`.
  - Manual reset option for daily progress.
- **Dynamic Browser Tab Indicator**:
  - Continuously streams remaining time (`(24:59) 🎯 Focus`) into `document.title` for glanceable tab monitoring.
- **Modular Component Structure**:
  - Built cleanly with separated components: `Timer`, `Controls`, `Settings`, `Stats`.

---

## Tech Stack

- **Framework**: React 19
- **Bundler**: Vite
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **Audio Synthesizer**: Native Web Audio API (`AudioContext`)
- **Persistence**: `localStorage` with date-based invalidation

---

## Project Structure

```text
AscentLabs_Task3/
├── src/
│   ├── components/
│   │   ├── Controls.jsx      # Start, Pause, Reset, Skip triggers
│   │   ├── Settings.jsx      # Focus/Break duration inputs and quick presets
│   │   ├── Stats.jsx         # Daily completed sessions and focus time cards
│   │   └── Timer.jsx         # SVG circular progress ring and time display
│   ├── utils/
│   │   └── audio.js          # Web Audio API multi-tone chime synthesizer
│   ├── App.jsx               # Timestamp drift engine and state coordinator
│   ├── index.css             # Dynamic theme system (Focus Indigo / Break Emerald)
│   └── main.jsx              # Application bootstrap
├── package.json
└── vite.config.js
```

---

## Getting Started Locally

### Prerequisites

- Node.js (v18+)
- npm (v9+)

### Installation & Run

1. Clone repository:
   ```bash
   git clone https://github.com/x-anish-y/AscentLabs_Task3.git
   cd AscentLabs_Task3
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start dev server:
   ```bash
   npm run dev
   ```

4. Build production bundle:
   ```bash
   npm run build
   ```
