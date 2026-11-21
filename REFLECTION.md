# Project Reflection - Focus (AscentLabs_Task3)

## What I Built
I built **Focus**, a Pomodoro study timer structured cleanly into dedicated components (`Timer`, `Controls`, `Settings`, `Stats`). It solves the notorious background timer throttling problem using timestamp delta math, automatically toggles between customizable focus and break sessions with synthesized audio chimes, tracks daily focus stats with automatic date-based reset, and reflects the countdown in real time in the browser tab title.

## What Was Tricky or Broke During Development
1. **Background Tab Timer Throttling (Timer Drift):**
   - *The Problem:* When users navigate away to research or type in another tab, Chrome and Firefox aggressively throttle `setInterval` callbacks from 1000ms down to once every minute (or suspend execution altogether). A naive `remainingSeconds - 1` timer runs 3 to 10 times slower than real time in the background.
   - *The Fix:* Implemented a target timestamp approach (`targetEndTime = Date.now() + remainingSeconds * 1000`). On every interval tick, the remaining time is calculated as `Math.max(0, Math.ceil((targetEndTime - Date.now()) / 1000))`. Even if the browser suspends JavaScript for 10 minutes, the moment the tab is reopened or polled, the delta immediately reflects the exact true elapsed time.

2. **Web Audio Autoplay Policies & Asset Management:**
   - *The Problem:* Loading external `.mp3` or `.wav` bell assets can fail due to 404s, CORS restrictions, or silent autoplay blocks.
   - *The Fix:* Created an in-memory sound synthesizer (`src/utils/audio.js`) using the native `AudioContext` and sine-wave oscillator ramps. It generates a three-tone harmonic bell chime directly in code with zero external file dependencies.

3. **Daily Stats Date Invalidation:**
   - *The Problem:* Users keeping the tab open overnight would continue accumulating focus minutes into yesterday's stats bucket.
   - *The Fix:* Bound all stat updates to an explicit date comparison string (`YYYY-MM-DD`). If `savedStats.date !== todayDate`, the state automatically clears and instantiates a clean zeroed slate for the new calendar day.

## What I Would Do Differently
- **HTML5 Web Notifications API:** Request user notification permissions to pop up native desktop OS notifications ("Focus session ended! Time for a 5-minute coffee break.") when the browser window is minimized.
- **Ambient Productivity Sounds:** Provide optional looping background white noise, rain, or lo-fi brown noise synthesized via web audio.
- **Task List Integration:** Allow attaching specific micro-tasks or goals to individual 25-minute Pomodoro blocks.
