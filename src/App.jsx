import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Timer as TimerIcon, Coffee, Sparkles } from 'lucide-react';
import Timer from './components/Timer';
import Controls from './components/Controls';
import Settings from './components/Settings';
import Stats from './components/Stats';
import { playChime } from './utils/audio';

function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function App() {
  // Configurable Durations (in minutes)
  const [focusDuration, setFocusDuration] = useState(() => {
    try {
      const saved = localStorage.getItem('focus_duration');
      return saved ? parseInt(saved, 10) : 25;
    } catch {
      return 25;
    }
  });

  const [breakDuration, setBreakDuration] = useState(() => {
    try {
      const saved = localStorage.getItem('break_duration');
      return saved ? parseInt(saved, 10) : 5;
    } catch {
      return 5;
    }
  });

  // Mode: 'focus' | 'break'
  const [mode, setMode] = useState('focus');

  // Time remaining in current session (in seconds)
  const [remainingSeconds, setRemainingSeconds] = useState(focusDuration * 60);

  // Running state & exact target timestamp for drift-free background execution
  const [isRunning, setIsRunning] = useState(false);
  const [targetEndTime, setTargetEndTime] = useState(null);

  // Daily statistics (automatically reset by date)
  const [stats, setStats] = useState(() => {
    const today = getTodayString();
    try {
      const raw = localStorage.getItem('focus_daily_stats');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.date === today) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to parse focus stats:', err);
    }
    return { date: today, sessionsCompleted: 0, totalFocusMinutes: 0 };
  });

  // Sync settings with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('focus_duration', String(focusDuration));
      localStorage.setItem('break_duration', String(breakDuration));
    } catch (err) {
      console.warn('Failed to save settings:', err);
    }
  }, [focusDuration, breakDuration]);

  // Sync daily stats with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('focus_daily_stats', JSON.stringify(stats));
    } catch (err) {
      console.warn('Failed to save stats:', err);
    }
  }, [stats]);

  // Dynamically update document.title with remaining time and mode
  useEffect(() => {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const icon = mode === 'focus' ? '🎯' : '☕';

    if (isRunning) {
      document.title = `(${formatted}) ${icon} ${mode === 'focus' ? 'Focus' : 'Break'} | Focus`;
    } else {
      document.title = `${formatted} - ${mode === 'focus' ? 'Focus' : 'Break'} (Paused) | Focus`;
    }
  }, [remainingSeconds, mode, isRunning]);

  // Record completed session in today's stats
  const recordCompletedFocus = useCallback((minsAdded) => {
    const today = getTodayString();
    setStats((prev) => {
      const isSameDay = prev.date === today;
      return {
        date: today,
        sessionsCompleted: (isSameDay ? prev.sessionsCompleted : 0) + 1,
        totalFocusMinutes: (isSameDay ? prev.totalFocusMinutes : 0) + minsAdded
      };
    });
  }, []);

  // Handler when session finishes (auto-switch logic)
  const handleSessionComplete = useCallback(() => {
    playChime();
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}

    if (mode === 'focus') {
      recordCompletedFocus(focusDuration);
      setMode('break');
      const nextSeconds = breakDuration * 60;
      setRemainingSeconds(nextSeconds);
      setTargetEndTime(Date.now() + nextSeconds * 1000);
      setIsRunning(true);
    } else {
      setMode('focus');
      const nextSeconds = focusDuration * 60;
      setRemainingSeconds(nextSeconds);
      setTargetEndTime(Date.now() + nextSeconds * 1000);
      setIsRunning(true);
    }
  }, [mode, focusDuration, breakDuration, recordCompletedFocus]);

  // Main Drift-Free Timestamp Engine
  useEffect(() => {
    if (!isRunning || !targetEndTime) return;

    const intervalId = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((targetEndTime - now) / 1000));
      setRemainingSeconds(diff);

      if (diff <= 0) {
        clearInterval(intervalId);
        handleSessionComplete();
      }
    }, 250); // Polling at 250ms prevents display jitter and catches 0 accurately

    return () => clearInterval(intervalId);
  }, [isRunning, targetEndTime, handleSessionComplete]);

  // Control Actions
  const handleStart = () => {
    const end = Date.now() + remainingSeconds * 1000;
    setTargetEndTime(end);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    if (targetEndTime) {
      const diff = Math.max(0, Math.ceil((targetEndTime - Date.now()) / 1000));
      setRemainingSeconds(diff);
    }
    setTargetEndTime(null);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTargetEndTime(null);
    setRemainingSeconds((mode === 'focus' ? focusDuration : breakDuration) * 60);
  };

  const handleSkip = () => {
    setIsRunning(false);
    setTargetEndTime(null);
    const nextMode = mode === 'focus' ? 'break' : 'focus';
    setMode(nextMode);
    setRemainingSeconds((nextMode === 'focus' ? focusDuration : breakDuration) * 60);
  };

  const handleModeSwitch = (newMode) => {
    if (newMode === mode) return;
    setIsRunning(false);
    setTargetEndTime(null);
    setMode(newMode);
    setRemainingSeconds((newMode === 'focus' ? focusDuration : breakDuration) * 60);
  };

  const handleUpdateFocus = (mins) => {
    setFocusDuration(mins);
    if (mode === 'focus' && !isRunning) {
      setRemainingSeconds(mins * 60);
    }
  };

  const handleUpdateBreak = (mins) => {
    setBreakDuration(mins);
    if (mode === 'break' && !isRunning) {
      setRemainingSeconds(mins * 60);
    }
  };

  const handleResetStats = () => {
    setStats({
      date: getTodayString(),
      sessionsCompleted: 0,
      totalFocusMinutes: 0
    });
  };

  const totalCurrentSeconds = (mode === 'focus' ? focusDuration : breakDuration) * 60;

  return (
    <div className="container" data-mode={mode}>
      <header className="app-header">
        <div className="brand-badge">
          <Sparkles size={14} />
          <span>Ascent Labs Level 2</span>
        </div>
        <h1 className="brand-title">Focus</h1>
        <p className="brand-subtitle">
          Precision Pomodoro study timer with timestamp drift prevention
        </p>
      </header>

      {/* Mode Switcher Tabs */}
      <div className="mode-tabs">
        <button
          type="button"
          className={`mode-tab-btn ${mode === 'focus' ? 'active' : ''}`}
          onClick={() => handleModeSwitch('focus')}
        >
          <TimerIcon size={16} />
          <span>Focus ({focusDuration}m)</span>
        </button>
        <button
          type="button"
          className={`mode-tab-btn ${mode === 'break' ? 'active' : ''}`}
          onClick={() => handleModeSwitch('break')}
        >
          <Coffee size={16} />
          <span>Break ({breakDuration}m)</span>
        </button>
      </div>

      {/* Main Timer Display Ring */}
      <Timer
        mode={mode}
        remainingSeconds={remainingSeconds}
        totalSeconds={totalCurrentSeconds}
        isRunning={isRunning}
      />

      {/* Primary Action Controls */}
      <Controls
        isRunning={isRunning}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
        onSkip={handleSkip}
      />

      {/* Bottom Grid: Settings & Today's Productivity Stats */}
      <div className="cards-grid">
        <Settings
          focusDuration={focusDuration}
          breakDuration={breakDuration}
          onUpdateFocus={handleUpdateFocus}
          onUpdateBreak={handleUpdateBreak}
          disabled={isRunning}
        />

        <Stats
          sessionsCompleted={stats.sessionsCompleted}
          totalFocusMinutes={stats.totalFocusMinutes}
          todayDate={stats.date}
          onResetStats={handleResetStats}
        />
      </div>
    </div>
  );
}
