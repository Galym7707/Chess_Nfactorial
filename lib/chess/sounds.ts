// Chess move sounds using Web Audio API
let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (!audioContext && typeof window !== "undefined") {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

function playTone(frequency: number, duration: number, volume: number = 0.3) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

export function playMoveSound() {
  playTone(440, 0.1, 0.2);
}

export function playCaptureSound() {
  playTone(330, 0.15, 0.25);
}

export function playCheckSound() {
  playTone(660, 0.2, 0.3);
}

export function playGameEndSound() {
  playTone(523, 0.3, 0.25);
  setTimeout(() => playTone(659, 0.3, 0.25), 150);
}
