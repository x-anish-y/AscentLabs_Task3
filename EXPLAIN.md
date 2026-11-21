# Code Walkthrough Cheat Sheet - Focus (AscentLabs_Task3)

Use this guide during technical interviews or code reviews to explain your codebase with confidence.

---

## 1. High-Level Architecture & File-by-File Breakdown

```text
src/
├── components/
│   ├── Timer.jsx      -> Renders the circular SVG countdown ring with stroke-dashoffset math and tabular digits.
│   ├── Controls.jsx   -> Pure presentation component for Start, Pause, Reset, and Skip actions.
│   ├── Settings.jsx   -> Duration inputs for Focus and Break intervals with quick preset selectors.
│   └── Stats.jsx      -> Displays today's completed sessions, accumulated focus hours/minutes, and date badge.
├── utils/
│   └── audio.js       -> Synthesizes a 3-note harmonic chime (C5-E5-G5) via Web Audio API without asset dependencies.
├── App.jsx            -> State coordinator and timestamp countdown engine; prevents tab drift and auto-switches modes.
├── index.css          -> Dynamic CSS theme system with CSS variables reacting to data-mode ("focus" vs "break").
└── main.jsx           -> React 19 entry point.
```

---

## 2. Key Algorithms & Engineering Decisions in Plain Language

### 1. The Drift-Free Timestamp Engine (`src/App.jsx`)
- **The Problem:** In standard web development, people write `setInterval(() => setTime(t => t - 1), 1000)`. When the browser tab is hidden or minimized, browsers throttle background timers to conserve battery and CPU. If 10 minutes pass in real life, a background `setInterval` might only fire 60 times, losing 9 minutes!
- **The Solution:**
  1. When **Start** is clicked: `targetEndTime = Date.now() + remainingSeconds * 1000`.
  2. Every interval tick (running at 250ms):
     ```javascript
     const diff = Math.max(0, Math.ceil((targetEndTime - Date.now()) / 1000));
     setRemainingSeconds(diff);
     ```
  3. When **Pause** is clicked: We compute the remaining seconds from the delta, save it, and clear `targetEndTime`.
  4. **Result:** Even if the computer goes to sleep or the tab is hidden for an hour, the moment it wakes up, `Date.now()` reflects true wall-clock time, guaranteeing zero drift.

### 2. Circular SVG Progress Ring (`src/components/Timer.jsx`)
- **Math:**
  - Circle radius $R = 120\text{px}$.
  - Circumference $C = 2 \times \pi \times R \approx 753.98\text{px}$.
  - Percentage remaining $P = \frac{\text{remainingSeconds}}{\text{totalSeconds}}$.
  - `strokeDasharray = C`
  - `strokeDashoffset = C - (P * C)`
- As time counts down, the circle border smoothly drains clockwise.

### 3. Date-Based Automatic Stats Reset (`src/App.jsx`)
- Computes `getTodayString()` formatted as `YYYY-MM-DD`.
- When reading or updating `focus_daily_stats` in `localStorage`:
  - If stored date equals today: increment `sessionsCompleted` and add `focusDuration` to `totalFocusMinutes`.
  - If stored date does not equal today: reset both counters to zero for the new day.

### 4. Dynamic Browser Tab Title (`src/App.jsx`)
- An active `useEffect` listens to `[remainingSeconds, mode, isRunning]`.
- Sets `document.title = (24:45) 🎯 Focus | Focus` when running.
- Gives the user instant visibility into their session progress without needing to switch tabs.

---

## 3. Why Each Technical Decision Was Made

1. **Target Timestamp Delta over `setInterval` Ticks:**
   - *Decision:* Compute difference from future timestamp.
   - *Reason:* Standard production requirement for timers. Prevents tab-throttling drift.

2. **Native Web Audio API over Audio Files:**
   - *Decision:* Synthesize sine waves on the fly (`AudioContext`).
   - *Reason:* No 404 broken link risks, zero network download bandwidth, works offline, and guarantees crisp playback.

3. **Separated Component Architecture:**
   - *Decision:* Strict decomposition into `Timer`, `Controls`, `Settings`, and `Stats`.
   - *Reason:* Follows single-responsibility principles. Makes the code modular, maintainable, and easy to unit test.

4. **Dynamic CSS Variables on `data-mode`:**
   - *Decision:* Used `[data-mode="break"]` attribute on the container.
   - *Reason:* Instantly switches the entire theme accent from deep indigo to refreshing emerald with zero JavaScript style recalculations.

---

## 4. 8 Likely Interview Questions & Short Answers

### Q1: Why do timers built with raw `setInterval` drift in browsers?
> "Browsers throttle background and inactive tabs to save battery and system resources. Chrome and Firefox reduce `setInterval` callback frequencies down to once every second or even once every minute. If you simply subtract 1 second on each tick, the timer will lag behind real time. By calculating the difference against a target wall-clock timestamp (`targetEndTime - Date.now()`), the timer remains 100% accurate regardless of browser throttling."

### Q2: How does the circular progress ring work?
> "It uses an SVG circle with SVG stroke properties: `strokeDasharray` is set to the circle's circumference ($2 \times \pi \times r$), and `strokeDashoffset` is adjusted proportionally to the elapsed fraction of time. As time decreases, the offset increases, creating a smooth clockwise draining effect."

### Q3: How do you prevent memory leaks when using `setInterval` in React?
> "Inside the `useEffect` hook, the interval ID is stored, and the hook returns a cleanup function: `return () => clearInterval(intervalId);`. Whenever `isRunning` changes, the component unmounts, or dependencies update, React automatically runs the cleanup function to clear the previous timer."

### Q4: How does the auto-switching mechanism work between Focus and Break?
> "When the countdown difference reaches $\le 0$, the `handleSessionComplete` callback is invoked. If the completed session was Focus, it records the completed session into today's stats, flips `mode` to `'break'`, initializes the break duration, calculates a new `targetEndTime`, and keeps `isRunning = true`. When the break finishes, it flips back to Focus."

### Q5: How do daily statistics reset automatically when a new day arrives?
> "Statistics in `localStorage` are stored under `{ date: 'YYYY-MM-DD', sessionsCompleted, totalFocusMinutes }`. Whenever the app loads or completes a session, it checks the stored date against today's local date. If the dates do not match, it initializes a clean zeroed object for the new day."

### Q6: How is the browser tab title updated?
> "A dedicated `useEffect` hook listening to `[remainingSeconds, mode, isRunning]` updates `document.title` on every second change with the formatted `(MM:SS)` string, mode emoji (`🎯` or `☕`), and session status."

### Q7: Why use Web Audio API synthesis instead of an mp3 sound file?
> "Loading external audio files requires network requests, can fail due to 404s or CORS policies, and adds bundle bloat. By using the Web Audio API's `AudioContext` with an oscillator and gain node, I synthesize a clean, pleasant three-note harmonic chime in fewer than 25 lines of code with zero external dependencies."

### Q8: What would you improve in a future iteration?
> "I would integrate the HTML5 Web Notifications API to display native operating system desktop alerts when a session completes while the browser is minimized, and add a simple task list so users can associate specific Pomodoro cycles with actionable to-dos."
