/**
 * Web Audio API synthesizer for timer chimes.
 * Plays clean bell tones without requiring external audio assets.
 */
export function playChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playTone = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.3, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playTone(523.25, now, 0.6);        // C5
    playTone(659.25, now + 0.2, 0.6);  // E5
    playTone(783.99, now + 0.4, 0.8);  // G5
  } catch (err) {
    console.warn('Audio chime playback failed:', err);
  }
}
