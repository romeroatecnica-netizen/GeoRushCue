let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  durationSec: number,
  type: OscillatorType,
  gainAmount: number,
  delaySec = 0
): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime + delaySec;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(gainAmount, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + durationSec + 0.02);
}

export function playCorrectSound(enabled: boolean): void {
  if (!enabled) return;
  playTone(587.33, 0.12, 'sine', 0.08, 0);
  playTone(880, 0.16, 'sine', 0.09, 0.07);
}

export function playWrongSound(enabled: boolean): void {
  if (!enabled) return;
  playTone(240, 0.14, 'triangle', 0.07, 0);
  playTone(190, 0.18, 'triangle', 0.06, 0.09);
}

export function playClueSound(enabled: boolean): void {
  if (!enabled) return;
  playTone(523.25, 0.08, 'sine', 0.05, 0);
}

export function playFinishSound(enabled: boolean, isVictory = false): void {
  if (!enabled) return;
  if (isVictory) {
    playTone(523.25, 0.12, 'sine', 0.08, 0);
    playTone(659.25, 0.12, 'sine', 0.08, 0.09);
    playTone(783.99, 0.15, 'sine', 0.09, 0.18);
    playTone(1046.5, 0.25, 'sine', 0.1, 0.28);
  } else {
    playTone(440, 0.12, 'sine', 0.07, 0);
    playTone(554.37, 0.16, 'sine', 0.07, 0.1);
  }
}
