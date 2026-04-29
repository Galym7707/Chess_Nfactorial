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

export function playGameStartSound() {
  playTone(523, 0.15, 0.2);
  setTimeout(() => playTone(659, 0.15, 0.2), 100);
  setTimeout(() => playTone(784, 0.2, 0.25), 200);
}

export function playVictorySound() {
  // Triumphant ascending melody
  playTone(523, 0.15, 0.3);
  setTimeout(() => playTone(659, 0.15, 0.3), 150);
  setTimeout(() => playTone(784, 0.15, 0.3), 300);
  setTimeout(() => playTone(1047, 0.4, 0.35), 450);
}

export function playDefeatSound() {
  // Descending sad melody
  playTone(659, 0.2, 0.25);
  setTimeout(() => playTone(523, 0.2, 0.25), 200);
  setTimeout(() => playTone(440, 0.3, 0.3), 400);
}

export function playDrawSound() {
  // Neutral sound
  playTone(523, 0.2, 0.25);
  setTimeout(() => playTone(523, 0.2, 0.25), 250);
}

export function playTimerWarningSound() {
  // Urgent beep for low time
  playTone(880, 0.1, 0.3);
}

export function playTimerCriticalSound() {
  // Very urgent beep for critical time
  playTone(1047, 0.08, 0.35);
}

export function playNotificationSound() {
  // Gentle notification
  playTone(784, 0.15, 0.2);
  setTimeout(() => playTone(1047, 0.15, 0.2), 100);
}

export function playCastlingSound() {
  // Special sound for castling
  playTone(392, 0.12, 0.22);
  setTimeout(() => playTone(523, 0.12, 0.22), 80);
}

export function playPromotionSound() {
  // Ascending sound for pawn promotion
  playTone(523, 0.1, 0.25);
  setTimeout(() => playTone(659, 0.1, 0.25), 80);
  setTimeout(() => playTone(784, 0.15, 0.3), 160);
}

