import React from 'react';

export default function Timer({
  mode,
  remainingSeconds,
  totalSeconds,
  isRunning
}) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Circular progress calculations (radius = 120)
  const radius = 120;
  const circumference = 2 * Math.PI * radius; // ~753.98
  const fractionRemaining = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
  const strokeDashoffset = circumference - fractionRemaining * circumference;

  return (
    <div className="timer-container">
      <svg className="timer-svg" viewBox="0 0 280 280">
        <circle
          className="timer-circle-bg"
          cx="140"
          cy="140"
          r={radius}
        />
        <circle
          className="timer-circle-progress"
          cx="140"
          cy="140"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>

      <div className="timer-inner">
        <div className="timer-mode-label">
          {mode === 'focus' ? '🎯 Focus Session' : '☕ Rest Break'}
        </div>
        <div className="timer-digits">
          {formattedTime}
        </div>
        <div className="timer-subtext">
          {isRunning ? 'Running (drift-free)' : 'Paused'}
        </div>
      </div>
    </div>
  );
}
