// @ts-nocheck
import * as THREE from 'three';
import { S } from '../core/state';
import { raceScene } from '../render/scenes';
import { pointAt } from '../world/tracks/track';
import { giveItem, rollItem, rollRivalItem } from './inventory';
import { aheadOf, aiDebuff, hitPlayer } from './effects';

function boxTexture() {
  const cv = document.createElement('canvas'); cv.width = cv.height = 128; const c = cv.getContext('2d');
  const g = c.createLinearGradient(0, 0, 128, 128); g.addColorStop(0, '#ffe36a'); g.addColorStop(0.5, '#ff9d3a'); g.addColorStop(1, '#ff5fa8');
  c.fillStyle = g; c.fillRect(0, 0, 128, 128);
  c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 8; c.strokeRect(6, 6, 116, 116);
  c.fillStyle = '#ffffff'; c.font = 'bold 96px Arial Black, Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.shadowColor = 'rgba(80,20,90,0.6)'; c.shadowBlur = 6; c.fillText('?', 64, 70);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

export function buildItemBoxes() {
  for (const b of S.itemBoxes) raceScene.remove(b.mesh);
  S.itemBoxes = [];
  if (!S.boxGeo) { const tx = boxTexture(); S.boxGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2); S.boxMat = new THREE.MeshStandardMaterial({ map: tx, emissive: '#ffffff', emissiveMap: tx, emissiveIntensity: 0.55, roughness: 0.4, transparent: true, opacity: 0.95 }); }
  const n = Math.max(4, Math.round(S.TRACK_LEN / 130));
  for (let k = 0; k < n; k++) {
    const s = S.TRACK_LEN * (k + 0.55) / n - S.START_OFFSET;
    for (const lat of [-1.8, 1.8]) {
      const p = pointAt(s), nx = -p.tz, nz = p.tx;
      const mesh = new THREE.Mesh(S.boxGeo, S.boxMat); mesh.castShadow = true;
      mesh.position.set(p.x + nx * lat, p.y + 1.35, p.z + nz * lat); raceScene.add(mesh);
      S.itemBoxes.push({ mesh, dist: s, lat, y: p.y + 1.35, hide: 0, ph: Math.random() * 6, hx: mesh.position.x, hz: mesh.position.z, pulled: false });
    }
  }
}

const _mp = new THREE.Vector3();

export function updateItemBoxes(dt, t) {
  for (const b of S.itemBoxes) {
    if (b.hide > 0) { b.hide -= dt; if (b.hide > 0) continue; b.mesh.visible = true; b.mesh.scale.setScalar(0.01); b.pulled = false; b.mesh.position.x = b.hx; b.mesh.position.z = b.hz; }
    if (b.mesh.scale.x < 1) b.mesh.scale.setScalar(Math.min(1, b.mesh.scale.x + dt * 3));
    b.mesh.rotation.y = t * 1.6 + b.ph; b.mesh.rotation.x = 0.35;
    if (!b.pulled) b.mesh.position.y = b.y + Math.sin(t * 2.4 + b.ph) * 0.18;
    if (S.items.magnetT > 0 && !b.pulled) {   // Magnet: boxes within reach fly to the player
      let dp = (b.dist - S.player.dist) % S.TRACK_LEN; if (dp < -S.TRACK_LEN / 2) dp += S.TRACK_LEN; if (dp > S.TRACK_LEN / 2) dp -= S.TRACK_LEN;
      if (dp > -4 && dp < 55) b.pulled = true;
    }
    if (b.pulled) {
      _mp.copy(S.player.v.group.position); _mp.y += 1.2; const k = 1 - Math.exp(-7 * dt);
      b.mesh.position.lerp(_mp, k);
      if (b.mesh.position.distanceTo(_mp) < 2) { b.pulled = false; collectBox(b, S.player); }
      continue;
    }
    for (const r of S.racers) {
      let ds = (r.dist - b.dist) % S.TRACK_LEN; if (ds > S.TRACK_LEN / 2) ds -= S.TRACK_LEN; if (ds < -S.TRACK_LEN / 2) ds += S.TRACK_LEN;
      if (Math.abs(ds) < 1.7 && Math.abs(r.lat - b.lat) < 1.8 && r.dist > 0) { collectBox(b, r); break; }
    }
  }
}

function collectBox(b, r) {
  b.hide = 5; b.mesh.visible = false;
  if (r.isPlayer) { giveItem(rollItem(), 'Item box! '); }
  else if (!r.items) r.items = [];
  if (!r.isPlayer && r.items.length < 2) { r.items.push(rollRivalItem(r)); r.useT = 2.5 + Math.random() * 4; }
}

export function updateRivalItems(r, dt) {
  if (r.boostT > 0) r.boostT -= dt;
  if (!r.items || !r.items.length || S.state !== 'racing') return;
  r.useT -= dt; if (r.useT > 0) return;
  const it = r.items.shift(); r.useT = 3 + Math.random() * 4;
  if (it === 'turbo') { r.boostT = 2.2; return; }
  let tgt;
  if (it === 'torpedo') tgt = S.racers.slice().sort((a, b) => b.dist - a.dist)[0];
  else tgt = aheadOf(r)[0];
  if (!tgt || tgt === r) { r.boostT = 1.5; return; }
  if (tgt.isPlayer) hitPlayer(it, r); else aiDebuff(tgt, it);
}

