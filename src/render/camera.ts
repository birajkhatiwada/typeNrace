// @ts-nocheck
import { S } from '../core/state';
import { raceCamera } from './scenes';

export function updateCamera(dt) {
  // chase camera locked to the car itself, so it stays centred in turns and on hills
  const gp = S.player.v.group.position, carYaw = S.player.v.group.rotation.y;
  if (!S.camInit) { S.camYaw = carYaw; S.camPos.set(gp.x - Math.sin(carYaw) * 7.2, gp.y + 2.9, gp.z - Math.cos(carYaw) * 7.2); S.camInit = true; }
  let dy = carYaw - S.camYaw; while (dy > Math.PI) dy -= 2 * Math.PI; while (dy < -Math.PI) dy += 2 * Math.PI;
  S.camYaw += dy * (1 - Math.exp(-5 * dt));
  const sx = Math.sin(S.camYaw), sz = Math.cos(S.camYaw);
  S.camPos.x = gp.x - sx * 7.2; S.camPos.z = gp.z - sz * 7.2;
  S.camPos.y += (gp.y + 2.9 - S.camPos.y) * (1 - Math.exp(-8 * dt));
  S.camLook.set(gp.x + sx * 7, gp.y - 0.4, gp.z + sz * 7);
  raceCamera.position.copy(S.camPos);
  raceCamera.up.set(0, 1, 0);
  raceCamera.lookAt(S.camLook);
  if (S.mood.stumbleT > 0) { raceCamera.position.y += (Math.random() - 0.5) * 0.08; raceCamera.lookAt(S.camLook); }
  if (window.__tt && window.__tt.cam) { const c = window.__tt.cam; raceCamera.position.set(c[0], c[1], c[2]); raceCamera.lookAt(c[3], c[4], c[5]); raceCamera.fov = 55; raceCamera.updateProjectionMatrix(); return; }
  if (window.__tt && window.__tt.top) { raceCamera.position.set(0, 80, 0); raceCamera.up.set(0, 0, -1); raceCamera.lookAt(0, 0, 0); raceCamera.fov = 60; raceCamera.updateProjectionMatrix(); return; }
  const fovTarget = 60 + Math.min(S.player.eff || 0, 40) * 0.45 + (S.mood.turboT > 0 ? 8 : 0);
  raceCamera.fov += (fovTarget - raceCamera.fov) * (1 - Math.exp(-5 * dt));
  raceCamera.updateProjectionMatrix();
  S.sunTarget.position.set(gp.x, gp.y, gp.z);
  S.sun.position.set(gp.x - 30, 50, gp.z + 20);
}

