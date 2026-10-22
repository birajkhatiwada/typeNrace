// @ts-nocheck
import { netTick } from '../net/online';
import * as THREE from 'three';
import { S } from './state';
import { garageCamera, garageModels, garageScene, raceCamera, raceScene } from '../render/scenes';
import { renderer } from '../render/renderer';
import { veilCam, veilScene } from '../render/layout';
import { engineUpdate, sfx } from '../audio/audio';
import { el, updateHud } from '../ui/hud';
import { toast } from '../ui/toast';
import { renderText } from '../typing/engine';
import { pick } from '../utils/helpers';
import { hitPlayer } from '../items/effects';
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
    if (S.garageIdle > 0) S.garageIdle -= dt; else if (!S.garageDrag) S.garageSpin += dt * 0.45;
    S.garagePop = Math.max(0, S.garagePop - dt * 2.2);
    const pe = S.garagePop * S.garagePop;
    const g = garageModels[S.selectedRide.id].group; g.rotation.y = -0.62 + S.garageSpin; g.position.y = 0.8 * 0.6 + pe * 0.45; g.scale.setScalar(1 - 0.07 * pe);
    S.garageTurn.rotation.y = S.garageSpin; S.garageTurn.scale.setScalar(0.6);
    garageCamera.position.set(5.4 + Math.sin(S.garageT * 0.25) * 0.3, 5.0 + Math.sin(S.garageT * 0.4) * 0.08, 9.8); garageCamera.lookAt(0, 0.9, 0);
    if (renderer.toneMapping !== THREE.NeutralToneMapping) renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.0;
    if (S.garageDust) { const p = S.garageDust.geometry.attributes.position.array; for (let i = 0; i < p.length; i += 3) { p[i + 1] += dt * 0.12; p[i] += Math.sin(S.garageT * 0.5 + i) * dt * 0.05; if (p[i + 1] > 7) p[i + 1] = 0.3; } S.garageDust.geometry.attributes.position.needsUpdate = true; }
    renderer.setViewport(S.viewport.x, S.viewport.y, S.viewport.w, S.viewport.h);
    // the dark side shades are drawn between two passes so the ride and its plinth stay in front of them
    renderer.autoClear = false; renderer.clear();
    renderer.render(garageScene, garageCamera);
    renderer.render(veilScene, veilCam);
    renderer.clearDepth();
    const keep = new Set([S.garageTurn, garageModels[S.selectedRide.id].group]), hid = [];
    garageScene.children.forEach((c) => { if (!c.isLight && !keep.has(c) && c.visible) { c.visible = false; hid.push(c); } });
    const sau = renderer.shadowMap.autoUpdate; renderer.shadowMap.autoUpdate = false;
    renderer.render(garageScene, garageCamera);
    renderer.shadowMap.autoUpdate = sau; hid.forEach((c) => { c.visible = true; }); renderer.autoClear = true;
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
    const fx = S.items, fogWas = fx.fogT > 0;
    fx.nitroT = Math.max(0, fx.nitroT - dt); fx.magnetT = Math.max(0, fx.magnetT - dt); fx.freezeT = Math.max(0, fx.freezeT - dt); fx.fogT = Math.max(0, fx.fogT - dt);
    if (fx.tripleN > 0) { fx.tripleT -= dt; if (fx.tripleT <= 0) { S.mood.turboT = Math.max(S.mood.turboT, 1.4); fx.tripleN--; fx.tripleT = 3.2; toast('Turbo burst' + (fx.tripleN ? ' (' + fx.tripleN + ' left)' : ''), '#ffd23f'); sfx('turbo'); } }
    if (fogWas && fx.fogT <= 0) renderText();
    if (S.mood.attackT <= 0 && !(S.room && S.room.online)) {
      S.mood.attackT = 14 + Math.random() * 10;
      const who = pick(S.racers.filter((r) => !r.isPlayer));
      hitPlayer('scramble', who);
    }
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

