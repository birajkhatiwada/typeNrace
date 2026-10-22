// @ts-nocheck
import { S } from '../core/state';

export function audioStart() {
  if (S.AC) { if (S.AC.state === 'suspended') S.AC.resume(); return; }
  try {
    S.AC = new (window.AudioContext || window.webkitAudioContext)();
    S.eng = S.AC.createOscillator(); S.eng.type = 'sawtooth';
    const lp = S.AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420;
    S.engGain = S.AC.createGain(); S.engGain.gain.value = 0;
    S.eng.connect(lp); lp.connect(S.engGain); S.engGain.connect(S.AC.destination); S.eng.start();
  } catch (e) { S.AC = null; }
}

function beep(freq, dur, type, vol, slide) {
  if (!S.AC || S.muted) return;
  try {
    const o = S.AC.createOscillator(), g = S.AC.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, S.AC.currentTime);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, S.AC.currentTime + dur);
    g.gain.setValueAtTime(vol, S.AC.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, S.AC.currentTime + dur);
    o.connect(g); g.connect(S.AC.destination); o.start(); o.stop(S.AC.currentTime + dur + 0.02);
  } catch (e) { /* ignore */ }
}

export function sfx(kind) {
  if (kind === 'tick') beep(880 + Math.random() * 120, 0.04, 'triangle', 0.025);
  else if (kind === 'err') beep(150, 0.12, 'square', 0.04, 90);
  else if (kind === 'turbo') beep(300, 0.5, 'sawtooth', 0.04, 900);
  else if (kind === 'item') { beep(660, 0.1, 'triangle', 0.05); setTimeout(() => beep(990, 0.15, 'triangle', 0.05), 90); }
  else if (kind === 'count') beep(520, 0.15, 'square', 0.04);
  else if (kind === 'go') beep(1040, 0.35, 'square', 0.05);
}

export function engineUpdate() {
  if (!S.AC || !S.eng) return;
  const racing = S.state === 'racing' || S.state === 'countdown';
  const v = S.player ? (S.player.eff || 0) : 0;
  S.eng.frequency.setTargetAtTime(48 + v * 6, S.AC.currentTime, 0.1);
  S.engGain.gain.setTargetAtTime(racing && !S.muted ? 0.035 + Math.min(v, 30) * 0.0008 : 0, S.AC.currentTime, 0.15);
}

