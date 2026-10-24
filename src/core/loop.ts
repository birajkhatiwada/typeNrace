// @ts-nocheck
import { netTick } from '../net/online';
import * as THREE from 'three';
import { S } from './state';
import { garageCamera, garageModels, garageScene, raceCamera, raceScene } from '../render/scenes';
import { renderer } from '../render/renderer';
import { engineUpdate, sfx } from '../audio/audio';
import { el, updateHud } from '../ui/hud';
import { toast } from '../ui/toast';
import { renderText } from '../typing/engine';
import { updateRoll } from '../items/effects';
import { updateRacer } from '../race/simulation';
import { showResults } from '../ui/results';
import { updateItemBoxes } from '../items/boxes';
import { updateCamera } from '../render/camera';
import { updateWeather } from '../world/atmosphere';

export function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - S.last) / 1000 || 0.016); S.last = now; S.tAcc += dt;
  if (S.state === 'loading' || S.state === 'profile') return;
  if (S.state === 'garage') {
    S.garageT += dt;
    renderer.setViewport(S.viewport.x, S.viewport.y, S.viewport.w, S.viewport.h);
    if ((S.gStep || 1) !== 1) { renderer.autoClear = true; renderer.clear(); return; }
    if (S.garageIdle > 0) S.garageIdle -= dt;
    S.garagePop = Math.max(0, S.garagePop - dt * 2.2);
    const pe = S.garagePop * S.garagePop, g = garageModels[S.selectedRide.id].group, yaw = -0.62 + S.garageSpin + Math.sin(S.garageT * 0.5) * 0.06;
    g.rotation.y = yaw; g.position.y = pe * 0.35; g.scale.setScalar(1 - 0.05 * pe);
    const m = S.garageMirror; if (m) { m.rotation.y = yaw; m.position.set(0, -g.position.y, 0); m.scale.set(g.scale.x, -g.scale.y, g.scale.z); }
    if (S.garageShadow) S.garageShadow.rotation.z = -yaw;
    garageCamera.position.set(0, 1.6, 12.5); garageCamera.lookAt(0, 0.9, 0);
    if (renderer.toneMapping !== THREE.NeutralToneMapping) renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.0; renderer.autoClear = true;
    renderer.render(garageScene, garageCamera);
    return;
  }
  // race / countdown / finished
  if (S.state === 'countdown') {
    const before = Math.ceil(S.countdown); S.countdown -= dt;
    const n = Math.ceil(S.countdown);
    if (n !== before && n > 0) sfx('count');
    el.count.textContent = S.countdown > 0.6 ? String(Math.ceil(S.countdown - 0.6)) : 'GO!';
    if (S.countdown <= 0.6) { S.state = 'racing'; sfx('go'); S.goT = 0.7; }
  } else if (S.goT > 0) { S.goT -= dt; if (S.goT <= 0) el.count.hidden = true; }
  if (S.state === 'racing') {
    S.raceTime += dt;
    S.mood.turboT = Math.max(0, S.mood.turboT - dt); S.mood.stumbleT = Math.max(0, S.mood.stumbleT - dt);
    S.mood.scrambleFlash = Math.max(0, S.mood.scrambleFlash - dt); S.errFlash = Math.max(0, S.errFlash - dt);
    S.mood.attackT -= dt;
    const fx = S.items, fogWas = fx.fogT > 0, twiceWas = fx.twiceT > 0;
    fx.nitroT = Math.max(0, fx.nitroT - dt); fx.magnetT = Math.max(0, fx.magnetT - dt); fx.freezeT = Math.max(0, fx.freezeT - dt);
    fx.fogT = Math.max(0, fx.fogT - dt); fx.twiceT = Math.max(0, fx.twiceT - dt);
    for (const s of fx.slow) s.t -= dt; if (fx.slow.length) fx.slow = fx.slow.filter((s) => s.t > 0);
    if (fx.tripleN > 0) { fx.tripleT -= dt; if (fx.tripleT <= 0) { S.mood.turboT = Math.max(S.mood.turboT, 1.4); fx.tripleN--; fx.tripleT = 3.2; toast('Turbo burst' + (fx.tripleN ? ' (' + fx.tripleN + ' left)' : ''), '#ffd23f'); sfx('turbo'); } }
    if ((fogWas && fx.fogT <= 0) || (twiceWas && fx.twiceT <= 0)) { if (twiceWas && fx.twiceT <= 0) S.cur.tw = 0; renderText(); }
    updateRoll(dt);
  }
  if (S.state === 'finished') { S.player.speed += (14 - S.player.speed) * Math.min(1, dt); }
  renderer.toneMappingExposure = 1;
  for (const r of S.racers) updateRacer(r, dt, S.tAcc);
  if (S.state === 'racing' || S.state === 'finished') netTick(dt);
  if (S.state === 'racing' && S.player.finished) {
    toast('FINISH!', '#ff8a3d'); S.state = 'finished';
    setTimeout(() => { if (S.state === 'finished') showResults(); }, 1400);
  }
  if (S.toastT > 0) { S.toastT -= dt; if (S.toastT <= 0) el.toast.className = 'toast'; }
  if (S.state === 'racing') updateItemBoxes(dt, S.tAcc); else for (const b of S.itemBoxes) { b.mesh.rotation.y = S.tAcc * 1.6 + b.ph; }
  updateCamera(dt);
  if (S.hudTick++ % 2 === 0) updateHud();
  if (S.errFlash === 0 && S.hudTick % 6 === 0 && S.state === 'racing') renderText();
  engineUpdate();
  updateWeather(dt, S.tAcc, raceCamera.position);
  renderer.setViewport(S.viewport.x, S.viewport.y, S.viewport.w, S.viewport.h);
  renderer.render(raceScene, raceCamera);
}

