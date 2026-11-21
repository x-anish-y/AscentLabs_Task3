import React from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

export default function Controls({
  isRunning,
  onStart,
  onPause,
  onReset,
  onSkip
}) {
  return (
    <div className="controls-row">
      <button
        type="button"
        className="btn-ctrl btn-secondary-action"
        onClick={onReset}
        title="Reset current session timer"
      >
        <RotateCcw size={18} />
        <span>Reset</span>
      </button>

      {isRunning ? (
        <button
          type="button"
          className="btn-ctrl btn-primary-action"
          onClick={onPause}
          title="Pause timer"
        >
          <Pause size={22} />
          <span>Pause</span>
        </button>
      ) : (
        <button
          type="button"
          className="btn-ctrl btn-primary-action"
          onClick={onStart}
          title="Start timer"
        >
          <Play size={22} style={{ marginLeft: '2px' }} />
          <span>Start</span>
        </button>
      )}

      <button
        type="button"
        className="btn-ctrl btn-secondary-action"
        onClick={onSkip}
        title="Skip to next session"
      >
        <SkipForward size={18} />
        <span>Skip</span>
      </button>
    </div>
  );
}
