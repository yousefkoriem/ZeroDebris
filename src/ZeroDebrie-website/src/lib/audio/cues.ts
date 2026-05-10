// Audio cue tones
// info → 440 Hz, 200 ms
// warning → 660 Hz, 200 ms
// critical → 880 Hz, 500 ms

let audioCtx: AudioContext | null = null;

export function playTone(frequency: number, durationMs: number) {
  if (typeof window === 'undefined') return;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + durationMs / 1000);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + durationMs / 1000);
}

export const audioCues = {
  info: () => playTone(440, 200),
  warning: () => playTone(660, 200),
  critical: () => playTone(880, 500),
};
