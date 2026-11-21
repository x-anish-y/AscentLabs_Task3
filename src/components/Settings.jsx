import React from 'react';
import { Sliders, RefreshCw } from 'lucide-react';

export default function Settings({
  focusDuration,
  breakDuration,
  onUpdateFocus,
  onUpdateBreak,
  disabled
}) {
  const handlePreset = (f, b) => {
    onUpdateFocus(f);
    onUpdateBreak(b);
  };

  return (
    <div className="card">
      <h3 className="card-title">
        <Sliders size={18} style={{ color: 'var(--accent-color)' }} />
        Timer Settings (Minutes)
      </h3>

      <div className="settings-group">
        <div className="setting-item">
          <label className="setting-label">Focus Session Duration</label>
          <div className="setting-input-wrapper">
            <input
              type="number"
              min="1"
              max="120"
              className="setting-input"
              value={focusDuration}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (val > 0 && val <= 120) onUpdateFocus(val);
              }}
              disabled={disabled}
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>min</span>
          </div>
        </div>

        <div className="setting-item">
          <label className="setting-label">Break Session Duration</label>
          <div className="setting-input-wrapper">
            <input
              type="number"
              min="1"
              max="60"
              className="setting-input"
              value={breakDuration}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (val > 0 && val <= 60) onUpdateBreak(val);
              }}
              disabled={disabled}
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>min</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
          Quick Presets:
        </span>
        <div className="preset-buttons">
          <button
            type="button"
            className="preset-btn"
            onClick={() => handlePreset(25, 5)}
            disabled={disabled}
          >
            25m / 5m (Standard)
          </button>
          <button
            type="button"
            className="preset-btn"
            onClick={() => handlePreset(50, 10)}
            disabled={disabled}
          >
            50m / 10m (Deep Work)
          </button>
          <button
            type="button"
            className="preset-btn"
            onClick={() => handlePreset(15, 3)}
            disabled={disabled}
          >
            15m / 3m (Sprint)
          </button>
        </div>
      </div>
    </div>
  );
}
