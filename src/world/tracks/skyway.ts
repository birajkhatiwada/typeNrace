// @ts-nocheck
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { S } from '../../core/state';
import { CUM, PTS, SEGS, TAN, pointAt } from './track';
import { models } from '../../render/scenes';
import { mulberry } from '../../utils/helpers';
import { mergePlacements } from '../props';
import { buildIndustrial } from './city';

const C2_ARC = (cx, cz, r, a0, a1, n) => { const o = []; for (let k = 0; k <= n; k++) { const a = a0 + (a1 - a0) * k / n; o.push([cx + r * Math.cos(a), cz + r * Math.sin(a), 0]); } return o; };

const C2P = {
  line: [[-0.5, 0, 0], [0.5, 0, 0]],
  ramp: [[-0.5, 0, 0], [0.5, 0, 2.5]],
  bend: C2_ARC(-0.5, 0.5, 0.5, 0, -Math.PI / 2, 14),
  curve: C2_ARC(-1, 1, 1.5, 0, -Math.PI / 2, 26),
  rbt: C2_ARC(-1.5, 1.5, 1.5, -Math.PI / 2, 0, 26)
};

function c2Program() {
  const P = [];
  for (let i = 0; i < 6; i++) P.push({ k: 'line', t: 'S', mesh: i === 3 ? 'bridge' : 'straight' });
  P.push({ k: 'rbt', t: 'R' }, { k: 'line', t: 'S', mesh: 'straight' }, { k: 'curve', t: 'R' }, { k: 'line', t: 'S', mesh: 'straight' }, { k: 'curve', t: 'R' });
  P.push({ k: 'ramp', t: 'S', mesh: 'ramp1' }, { k: 'ramp', t: 'S', mesh: 'ramp2' }, { k: 'line', t: 'S', mesh: 'deck', flat: true });
  P.push({ k: 'ramp', t: 'S', mesh: 'ramp2', rev: true }, { k: 'ramp', t: 'S', mesh: 'ramp1', rev: true });
  P.push({ k: 'curve', t: 'L' }, { k: 'line', t: 'S', mesh: 'straight' }, { k: 'line', t: 'S', mesh: 'straight' }, { k: 'bend', t: 'L' });
  for (let i = 0; i < 3; i++) P.push({ k: 'line', t: 'S', mesh: 'straight' });
  P.push({ k: 'bend', t: 'L' });
  return P;
}

export function buildTrackC2(map) {
  const rot = (x, z, k) => { const c = Math.round(Math.cos(k * Math.PI / 2)), s = Math.round(Math.sin(k * Math.PI / 2)); return [x * c + z * s, -x * s + z * c]; };
  let cx = 0.5, cz = 4, h = [1, 0], y = 0.2;
  const pts = [{ x: cx, z: cz, y }], placed = [], rng = [];
  for (const it of c2Program()) {
    let done = false;
    for (const rev of (it.rev === undefined ? [false, true] : [it.rev])) {
      let P = C2P[it.k]; if (rev) P = P.slice().reverse();
      const n = P.length, u0 = [P[1][0] - P[0][0], P[1][1] - P[0][1]], u1 = [P[n - 1][0] - P[n - 2][0], P[n - 1][1] - P[n - 2][1]];
      const snap = (v) => (Math.abs(v[0]) > Math.abs(v[1]) ? [Math.sign(v[0]), 0] : [0, Math.sign(v[1])]); const s0 = snap(u0), s1 = snap(u1); u0[0] = s0[0]; u0[1] = s0[1]; u1[0] = s1[0]; u1[1] = s1[1];
      const cr = u0[0] * u1[1] - u0[1] * u1[0], turn = Math.abs(cr) < 0.05 ? 'S' : cr > 0 ? 'R' : 'L';
      if (turn !== it.t) continue;
      for (let k = 0; k < 4; k++) {
        const r0 = rot(u0[0], u0[1], k); if (Math.hypot(r0[0] - h[0], r0[1] - h[1]) > 0.01) continue;
        const rp0 = rot(P[0][0], P[0][1], k), T = [cx - rp0[0], cz - rp0[1]];
        const i0 = pts.length - 1; let yEnd = y;
        for (let q = 1; q < n; q++) { const rp = rot(P[q][0], P[q][1], k); yEnd = y + (P[q][2] - P[0][2]); pts.push({ x: T[0] + rp[0], z: T[1] + rp[1], y: it.flat ? y : y + (P[q][2] - P[0][2]) }); }
        placed.push({ it, k, theta: k * Math.PI / 2, T, yb: Math.min(y, it.flat ? y : yEnd) - 0.2, up: !rev });
        rng.push([i0, pts.length - 1, it.t !== 'S']);
        const e = pts[pts.length - 1]; cx = e.x; cz = e.z; y = it.flat ? y : yEnd; h = rot(u1[0], u1[1], k); done = true; break;
      }
      if (done) break;
    }
    if (!done) console.warn('c2 chain failed', it);
  }
  const xs = pts.map((p) => p.x), zs = pts.map((p) => p.z);
  const mx = (Math.min(...xs) + Math.max(...xs)) / 2, mz = (Math.min(...zs) + Math.max(...zs)) / 2;
  PTS.length = 0; CUM.length = 0; SEGS.length = 0; TAN.length = 0; S.CELLS = [];
  const idxMap = [];
  for (const p of pts) { const q = { x: (p.x - mx) * 10, z: (p.z - mz) * 10, y: p.y }; const l = PTS[PTS.length - 1]; if (!l || Math.hypot(l.x - q.x, l.z - q.z) > 1e-4) PTS.push(q); else l.y = Math.max(l.y, q.y); idxMap.push(PTS.length - 1); }
  CUM.push(0);
  for (let n = 1; n < PTS.length; n++) CUM.push(CUM[n - 1] + Math.hypot(PTS[n].x - PTS[n - 1].x, PTS[n].z - PTS[n - 1].z));
  S.TRACK_LEN = CUM[CUM.length - 1];
  for (let n = 0; n < PTS.length; n++) {
    const p = PTS[(n - 1 + PTS.length) % PTS.length], q = PTS[(n + 1) % PTS.length];
    const dx = q.x - p.x, dz = q.z - p.z, l = Math.hypot(dx, dz) || 1; TAN.push({ x: dx / l, z: dz / l });
  }
  for (const [a, b, c] of rng) SEGS.push({ a: CUM[idxMap[a]], b: CUM[idxMap[b]], corner: c });
  S.C2 = { placed, mx, mz, end: pts[pts.length - 1] };
  S.START_OFFSET = 15; S.MAP = map; S.LAPS = map.laps;
}

export function buildC2(group) {
  S.ROAD_Y = 0.2;
  const B = {}; const putM = (nm, M) => { (B[nm] = B[nm] || []).push(M); };
  const mat = (tx, ty, tz, th, sx, sy, sz) => new THREE.Matrix4().makeTranslation(tx, ty, tz).multiply(new THREE.Matrix4().makeRotationY(th)).multiply(new THREE.Matrix4().makeScale(sx, sy, sz));
  const W = (v, c) => (v - c) * 10;
  for (const pc of S.C2.placed) {
    const wx = W(pc.T[0], S.C2.mx), wz = W(pc.T[1], S.C2.mz), th = pc.theta, m = pc.it.mesh, k = pc.it.k;
    if (m === 'straight') { putM('road_straight', mat(wx, 0, wz, th, 10, 10, 10)); putM('road_straight_barrier', mat(wx, 0, wz, th + Math.PI / 2, 10, 10, 10)); }
    else if (m === 'bridge') { putM('road_bridge', mat(wx, 0, wz, th, 10, 10, 10)); }
    else if (k === 'bend') { putM('road_bend', mat(wx, 0, wz, th, 10, 10, 10)); putM('road_bend_barrier', mat(wx, 0, wz, th, 10, 10, 10)); }
    else if (k === 'curve') { putM('road_curve', mat(wx, 0, wz, th, 10, 10, 10)); putM('road_curve_barrier', mat(wx, 0, wz, th, 10, 10, 10)); }
    else if (k === 'rbt') { putM('road_roundabout', mat(wx, 0, wz, th, 10, 10, 10)); putM('road_roundabout_barrier', mat(wx, 0, wz, th, 10, 10, 10)); }
    else if (m === 'ramp1') { putM('road_slant_high', mat(wx, pc.yb, wz, th, 10, 5, 10)); putM('road_slant_high_barrier', mat(wx, pc.yb, wz, th, 10, 5, 10)); }
    else if (m === 'ramp2') {
      putM('road_slant_flat_high', mat(wx, pc.yb, wz, th, 10, 5, 10));
      const f = [Math.cos(th), -Math.sin(th)], n = [f[1], -f[0]];
      for (const sd of [-1, 1]) putM('bridge_pillar', mat(wx + n[0] * sd * 3.9, 0, wz + n[1] * sd * 3.9, 0, 10, (pc.yb + 1.3) / 5, 10));
    }
  }
  for (const nm of Object.keys(B)) {
    const model = models['c_' + nm]; if (!model) { console.warn('missing', nm); continue; }
    model.scene.updateWorldMatrix(true, true);
    model.scene.traverse((o) => {
      if (!o.isMesh) return;
      const geos = B[nm].map((M) => { const g = o.geometry.clone(); g.applyMatrix4(M.clone().multiply(o.matrixWorld)); return g; });
      const mesh = new THREE.Mesh(mergeGeometries(geos, false), o.material); mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false; group.add(mesh);
    });
  }
  // street furniture
  const P = {}; const put = (name, x, z, rot, s, y) => { (P[name] = P[name] || []).push({ x, z, rot, s, y: y || 0 }); };
  const prnd = mulberry(33);
  for (const pc of S.C2.placed) {
    if (pc.it.k !== 'line' || pc.it.mesh !== 'straight') continue;
    const wx = W(pc.T[0], S.C2.mx), wz = W(pc.T[1], S.C2.mz), alongX = Math.abs(Math.cos(pc.theta)) > 0.5, i = S.C2.placed.indexOf(pc);
    if (i % 2 === 1) {
      const lamp = i % 4 === 1 ? 'c_light_square' : 'c_light_curved';
      for (const side of [-1, 1]) {
        if (alongX) put(lamp, wx, wz + side * 5.6, side > 0 ? 0 : Math.PI, 10); else put(lamp, wx + side * 5.6, wz, side > 0 ? Math.PI / 2 : -Math.PI / 2, 10);
      }
    }
  }
  const sgn = (p, off) => { const q = pointAt(p); return { x: q.x, z: q.z, th: Math.atan2(-q.tz, q.tx), tx: q.tx, tz: q.tz }; };
  for (const sOff of [0, 34, 105, 245]) { const f = sgn(sOff); put(sOff === 0 ? 'c_sign_highway_wide' : 'c_sign_highway', f.x, f.z, f.th, 10); }
  // traffic lights at the roundabout entrance and start
  for (const sOff of [38]) { const f = sgn(sOff); for (const sd of [-1, 1]) put('c_traffic_light', f.x - f.tz * sd * 5.8, f.z + f.tx * sd * 5.8, f.th + (sd > 0 ? 0 : Math.PI), 10); }
  for (const nm of Object.keys(P)) if (models[nm]) group.add(mergePlacements(models[nm].scene, P[nm], 'city'));
  // start line
  { const q = pointAt(0), cv = document.createElement('canvas'); cv.width = 128; cv.height = 32; const cx = cv.getContext('2d');
    for (let a = 0; a < 16; a++) for (let b = 0; b < 4; b++) { cx.fillStyle = (a + b) % 2 ? '#15112b' : '#ffffff'; cx.fillRect(a * 8, b * 8, 8, 8); }
    const ct = new THREE.CanvasTexture(cv); ct.colorSpace = THREE.SRGBColorSpace;
    const line = new THREE.Mesh(new THREE.PlaneGeometry(8.0, 1.5), new THREE.MeshBasicMaterial({ map: ct }));
    line.rotation.set(-Math.PI / 2, 0, Math.atan2(q.tx, q.tz)); line.position.set(q.x, 0.215, q.z); group.add(line); }
  // industrial buildings on a one-tile lot grid, kept off the road
  const mnx = Math.min(...PTS.map((p) => p.x)), mxx = Math.max(...PTS.map((p) => p.x)), mnz = Math.min(...PTS.map((p) => p.z)), mxz = Math.max(...PTS.map((p) => p.z));
  const xc = (mnx + mxx) / 2, zc = (mnz + mxz) / 2, lots = [];
  for (let i = -9; i <= 9; i++) for (let j = -9; j <= 9; j++) {
    const x = xc + i * 10 + 5, z = zc + j * 10 + 5;
    let dmin = 1e9; for (const p of PTS) dmin = Math.min(dmin, Math.hypot(p.x - x, p.z - z));
    if (dmin < 10.5) continue;
    lots.push({ x, z, d: dmin });
  }
  buildIndustrial(group, lots, prnd);
}

