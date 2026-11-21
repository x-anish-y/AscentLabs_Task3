import React from 'react';
import { Award, Clock, Calendar } from 'lucide-react';

export default function Stats({
  sessionsCompleted,
  totalFocusMinutes,
  todayDate,
  onResetStats
}) {
  const hours = Math.floor(totalFocusMinutes / 60);
  const minutes = totalFocusMinutes % 60;
  const timeFormatted = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return (
    <div className="card">
      <h3 className="card-title">
        <Award size={18} style={{ color: 'var(--accent-color)' }} />
        Today's Productivity
      </h3>

      <div className="stats-display-grid">
        <div className="stat-box">
          <div className="stat-number">{sessionsCompleted}</div>
          <div className="stat-title">Sessions Done</div>
        </div>

        <div className="stat-box">
          <div className="stat-number">{timeFormatted}</div>
          <div className="stat-title">Focus Time</div>
        </div>
      </div>

      <div className="stats-date-bar">
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Calendar size={13} />
          <span>{todayDate}</span>
        </span>
        <button
          type="button"
          className="reset-stats-btn"
          onClick={() => {
            if (window.confirm("Reset today's recorded focus statistics?")) {
              onResetStats();
            }
          }}
        >
          Reset Stats
        </button>
      </div>
    </div>
  );
}
