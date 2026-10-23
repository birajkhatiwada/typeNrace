// @ts-nocheck
import { S } from '../core/state';
import { FRICTION, IMPULSE } from '../config/tuning';
import { clamp } from '../utils/helpers';
import { updateRivalItems } from '../items/boxes';
import { pointAt } from '../world/tracks/track';
import { slowMul, botMul } from '../items/effects';

function wpm2speed(wpm) { return (IMPULSE * (wpm * 5 / 60)) / FRICTION; }

export const rideMul = (r) => 1 + 0.05 * (r.speed - 3);

export const progress = (r) => r.dist;

export function rankOf(r) { return 1 + S.racers.filter((o) => o !== r && progress(o) > progress(r)).length; }

export function updateRacer(r, dt, t) {
  let v = r.speed;
  if (r.isPlayer) {
    if (!(S.items.freezeT > 0)) v *= Math.exp(-FRICTION * dt);
    if (v < 5) v = Math.max(0, v - 0.5 * dt); // a little rolling resistance so it rolls to a stop
    r.speed = v;
    let eff = v;
    if (S.mood.turboT > 0) eff *= 1.45;
    if (S.mood.stumbleT > 0) eff *= 0.65;
    eff *= slowMul();
    r.eff = eff;
  } else if (r.remote) {
    // driven by the other player's reported progress; ease toward it
    r.eff = r.netSpeed || 0; r.speed = r.eff;
    if (r.netDist !== undefined) r.dist += (r.netDist - r.dist) * Math.min(1, dt * 4);
  } else {
    r.noiseT -= dt; if (r.noiseT <= 0) { r.noiseT = 1.5 + Math.random() * 2; r.noise = (Math.random() - 0.5) * 0.18; }
    const gap = S.player.dist - r.dist;
    const rb = clamp(gap / 100, -0.2, 0.2);
    let target = wpm2speed(r.wpm) * rideMul(r.ride) * (1 + r.noise + rb);
    if (r.slowT > 0) { target *= 0.55; r.slowT -= dt; }
    target *= botMul(r);
    if (r.boostT > 0) target *= 1.35;
    updateRivalItems(r, dt);
    r.speed += (target - r.speed) * (1 - Math.exp(-1.6 * dt));
    r.eff = r.speed;
  }
  if (S.state === 'racing' || S.state === 'finished') r.dist += r.eff * dt;
  // finish detection
  if (!r.finished && r.dist >= S.LAPS * S.TRACK_LEN) { r.finished = true; r.finishTime = r.netFinish !== undefined ? r.netFinish : S.raceTime; }
  // place the vehicle
  const p = pointAt(r.dist);
  const wob = Math.sin(t * 0.7 + r.seed) * 0.3 * Math.min(1, r.eff / 8);
  r.lat += (r.lane + wob - r.lat) * Math.min(1, dt * 3);
  const nx = -p.tz, nz = p.tx;
  r.pitch = (r.pitch || 0) + (p.pitch - (r.pitch || 0)) * Math.min(1, dt * 9);
  r.v.group.position.set(p.x + nx * r.lat, p.y, p.z + nz * r.lat);
  const wantYaw = Math.atan2(p.tx, p.tz);
  if (r.yaw === undefined) r.yaw = wantYaw;
  let dyaw = wantYaw - r.yaw; while (dyaw > Math.PI) dyaw -= 2 * Math.PI; while (dyaw < -Math.PI) dyaw += 2 * Math.PI;
  r.yaw += dyaw * Math.min(1, dt * 14);
  r.v.group.rotation.set(-r.pitch, r.yaw, 0, 'YXZ');
  const spin = (r.eff * dt) / 0.4;
  for (const wh of r.v.wheels) wh.rotation.x += spin;
  if (r.ride.kind === 'Boat') { r.v.model.position.y = -0.85 + Math.sin(t * 2.3 + r.seed) * 0.07; r.v.model.rotation.z = Math.sin(t * 1.7 + r.seed) * 0.03; r.v.model.rotation.x = Math.sin(t * 2.1 + r.seed * 2) * 0.02 - Math.min(1, r.eff / 25) * 0.04; }
  else r.v.model.position.y = (S.MAP.style === 'river' ? -0.5 : 0) + Math.sin(t * 14 + r.seed) * 0.012 * Math.min(1, r.eff / 10);
}

