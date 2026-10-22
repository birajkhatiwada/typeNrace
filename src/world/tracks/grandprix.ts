// @ts-nocheck
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { S } from '../../core/state';
import { CUM, PTS, SEGS, TAN, pointAt } from './track';
import { clamp, mulberry } from '../../utils/helpers';
import { models } from '../../render/scenes';

export const GP_SC = 10, GP_TOP = 5.2, GP_Y0 = 0.2;

export const GP_DIR = [[1, 0], [0, 1], [-1, 0], [0, -1]];

function gpProgram() {
  // a figure-8: lap starts on the pit straight, loops round the south-east lobe, goes over the flyover and round the north-west lobe, then under the flyover
  return [
    { t: 'start' }, { t: 'S', n: 2 }, { t: 'C', turn: 'R' }, { t: 'S', n: 4 }, { t: 'C', turn: 'R' }, { t: 'S', n: 5 }, { t: 'C', turn: 'R' }, { t: 'S', n: 4 },
    { t: 'ramp', up: true }, { t: 'deck' }, { t: 'ramp', up: false },
    { t: 'S', n: 4 }, { t: 'C', turn: 'L' }, { t: 'S', n: 4 }, { t: 'C', turn: 'L' }, { t: 'S', n: 4 }, { t: 'C', turn: 'L' },
    { t: 'S', n: 6 }, { t: 'S', n: 1 }, { t: 'S', n: 3 }
  ];
}

export function buildTrackGP(map) {
  const N = 3, R = N - 0.5;
  let x = 3.5, z = 0, d = 0, y = GP_Y0;
  const pieces = [], pts = [{ x, z, y }], segs = [];
  const line = (name, L, y1, flag) => {
    const dv = GP_DIR[d], rev = name === 'roadRampLong' && y1 < y;
    const i0 = pts.length - 1;
    pieces.push({ name, x, z, d, L, rev });
    x += dv[0] * L; z += dv[1] * L; y = y1; pts.push({ x, z, y });
    segs.push({ i0, i1: pts.length - 1, corner: false });
  };
  for (const st of gpProgram()) {
    if (st.t === 'start') line('roadStart', 2, y);
    else if (st.t === 'S') { let n = st.n; while (n >= 2) { line('roadStraightLong', 2, y); n -= 2; } if (n === 1) line('roadStraight', 1, y); }
    else if (st.t === 'ramp') line('roadRampLong', 2, st.up ? GP_TOP : GP_Y0);
    else if (st.t === 'deck') line('roadStraightBridgeMid', 1, y);
    else if (st.t === 'C') {
      const right = st.turn === 'R', nd = (d + (right ? 1 : 3)) % 4, dv = GP_DIR[d], sv = GP_DIR[nd];
      const cx = x + sv[0] * R, cz = z + sv[1] * R, ex = cx + dv[0] * R, ez = cz + dv[1] * R;
      const i0 = pts.length - 1;
      for (const nm of ['roadCornerLarger', 'roadCornerLargerBorder', 'roadCornerLargerBorderInner']) pieces.push({ name: nm, x, z, d, N, rev: !right, corner: true });
      const a0 = Math.atan2(z - cz, x - cx); let da = Math.atan2(ez - cz, ex - cx) - a0;
      while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
      for (let k = 1; k <= 40; k++) { const a = a0 + da * k / 40; pts.push({ x: cx + R * Math.cos(a), z: cz + R * Math.sin(a), y }); }
      x = ex; z = ez; d = nd;
      segs.push({ i0, i1: pts.length - 1, corner: true });
    }
  }
  const xs = pts.map((p) => p.x), zs = pts.map((p) => p.z);
  const cx0 = (Math.min(...xs) + Math.max(...xs)) / 2, cz0 = (Math.min(...zs) + Math.max(...zs)) / 2;
  PTS.length = 0; CUM.length = 0; SEGS.length = 0; TAN.length = 0; S.CELLS = [];
  for (const p of pts) { const q = { x: (p.x - cx0) * GP_SC, z: (p.z - cz0) * GP_SC, y: p.y }; const l = PTS[PTS.length - 1]; if (!l || Math.hypot(l.x - q.x, l.z - q.z) > 1e-4) PTS.push(q); else l.y = Math.max(l.y, q.y); }
  // keep indices for segments after de-duplication (points are only dropped when identical, so match by position)
  CUM.push(0);
  for (let n = 1; n < PTS.length; n++) CUM.push(CUM[n - 1] + Math.hypot(PTS[n].x - PTS[n - 1].x, PTS[n].z - PTS[n - 1].z));
  S.TRACK_LEN = CUM[CUM.length - 1];
  for (let n = 0; n < PTS.length; n++) {
    const p = PTS[(n - 1 + PTS.length) % PTS.length], q = PTS[(n + 1) % PTS.length];
    const dx = q.x - p.x, dz = q.z - p.z, l = Math.hypot(dx, dz) || 1; TAN.push({ x: dx / l, z: dz / l });
  }
  const find = (p) => { const qx = (p.x - cx0) * GP_SC, qz = (p.z - cz0) * GP_SC; let b = 0, bd = 1e9; for (let n = 0; n < PTS.length; n++) { const dd = Math.hypot(PTS[n].x - qx, PTS[n].z - qz); if (dd < bd) { bd = dd; b = n; } } return b; };
  for (const sg of segs) SEGS.push({ a: CUM[find(pts[sg.i0])], b: CUM[find(pts[sg.i1])], corner: sg.corner });
  S.GP = { pieces, cx: cx0, cz: cz0 };
  S.START_OFFSET = 10; S.MAP = map; S.LAPS = map.laps;
}

const gpW = (tx, tz) => [(tx - S.GP.cx) * GP_SC, (tz - S.GP.cz) * GP_SC];

export function gpRotFor(hx, hz, d) {
  for (let k = 0; k < 4; k++) { const th = k * Math.PI / 2, c = Math.round(Math.cos(th)), s = Math.round(Math.sin(th)); if (hx * c + hz * s === d[0] && -hx * s + hz * c === d[1]) return th; }
  return 0;
}

export function gpMat(wx, wz, th, sc, ax, az, y) {
  const M = new THREE.Matrix4().makeTranslation(wx, y || 0, wz);
  M.multiply(new THREE.Matrix4().makeRotationY(th)); M.multiply(new THREE.Matrix4().makeScale(sc, sc, sc));
  M.multiply(new THREE.Matrix4().makeTranslation(-ax, 0, -az)); return M;
}

function gpDistToPath(x, z) {
  let best = 1e9;
  for (let n = 0; n + 1 < PTS.length; n++) {
    const a = PTS[n], b = PTS[n + 1], dx = b.x - a.x, dz = b.z - a.z, l2 = dx * dx + dz * dz || 1;
    const t = clamp(((x - a.x) * dx + (z - a.z) * dz) / l2, 0, 1); best = Math.min(best, Math.hypot(x - (a.x + dx * t), z - (a.z + dz * t)));
  }
  return best;
}

export function buildGP(group) {
  const B = {}; const put = (name, M) => { (B[name] = B[name] || []).push(M); };
  const taken = [];
  for (const pc of S.GP.pieces) {
    const [wx, wz] = gpW(pc.x, pc.z), dv = GP_DIR[pc.d];
    let ax, az, hx, hz;
    if (pc.corner) { if (!pc.rev) { ax = 0.5; az = 0; hx = 0; hz = -1; } else { ax = pc.N; az = -(pc.N - 0.5); hx = -1; hz = 0; } }
    else if (!pc.rev) { ax = 0.5; az = 0; hx = 0; hz = -1; } else { ax = 0.5; az = -pc.L; hx = 0; hz = 1; }
    const Mp = gpMat(wx, wz, gpRotFor(hx, hz, dv), GP_SC, ax, az, 0);
    if (pc.name === 'roadStart') { // the start piece road sits 0.13 tile off its origin (gantry overhangs), so centre it on the path
      const Q = new THREE.Matrix4().makeTranslation(wx, 0, wz).multiply(new THREE.Matrix4().makeRotationY(gpRotFor(hx, hz, dv)))
        .multiply(new THREE.Matrix4().makeScale(GP_SC, GP_SC, GP_SC)).multiply(new THREE.Matrix4().makeTranslation(-0.63, 0, -az)); put(pc.name, Q);
    } else put(pc.name, Mp);
  }
  // decor helpers: footprint (w x d) is [0,w] x [-d,0] with the front facing +z
  const decor = (name, wx, wz, f, sc, w, dd, y) => { put(name, gpMat(wx, wz, Math.atan2(f[0], f[1]), sc, w / 2, -dd / 2, y || 0)); taken.push({ x: wx, z: wz, r: 0.55 * sc * Math.max(w, dd) }); };
  const frame = (s) => { const p = pointAt(s); return { x: p.x, z: p.z, tx: p.tx, tz: p.tz, nx: -p.tz, nz: p.tx }; };
  // pit lane buildings on the left of the start straight, grandstands facing them on the right
  for (let k = -3; k <= 3; k++) {
    const f = frame(k * 10.5);
    const nm = k === 0 ? 'pitsOffice' : (Math.abs(k) % 2 ? 'pitsGarage' : 'pitsGarageClosed');
    decor(nm, f.x - f.nx * 15.5, f.z - f.nz * 15.5, [f.nx, f.nz], 10, 1, 1);
  }
  for (let k = -3; k <= 3; k++) {
    const f = frame(k * 10.5 + 5);
    decor(Math.abs(k) === 1 ? 'grandStandCovered' : 'grandStand', f.x + f.nx * 16, f.z + f.nz * 16, [-f.nx, -f.nz], 10, 1, 1);
  }
  // start gantry
  { const f = frame(0); put('overhead', gpMat(f.x, f.z, Math.atan2(-f.nz, f.nx), 10, 0.5, 0.1, 0));
    for (const sd of [-1, 1]) decor(sd < 0 ? 'bannerTowerRed' : 'bannerTowerGreen', f.x + f.nx * sd * 9.5, f.z + f.nz * sd * 9.5, [-f.nx * sd, -f.nz * sd], 8, 1, 1); }
  // paddock tents and billboards inside the south-east lobe
  const interior = [[3.2, 4.2, 'tentLong'], [5.6, 4.2, 'tent'], [7.0, 4.2, 'tentClosed'], [3.2, 6.2, 'tent'], [5.2, 6.4, 'tentLong']];
  for (const [tx, tz, nm] of interior) { const [wx, wz] = gpW(tx, tz); decor(nm, wx, wz, [0, 1], 10, nm === 'tentLong' ? 2 : 1, 1); }
  for (const [tx, tz, fx, fz] of [[3.0, 2.2, 0, -1], [6.4, 2.4, 0, -1], [11.6, 4.5, -1, 0], [-11.2, -4.5, 1, 0]]) { const [wx, wz] = gpW(tx, tz); decor('billboard', wx, wz, [fx, fz], 7, 1, 1); }
  for (const [tx, tz, fx, fz] of [[12.4, 3.2, -1, 0], [-11.8, -6.2, 1, 0]]) { const [wx, wz] = gpW(tx, tz); decor('grandStandRound', wx, wz, [fx, fz], 10, 1.64, 1.64); }
  // light posts along the straights
  for (let s = 20; s < S.TRACK_LEN - 20; s += 38) {
    const f = frame(s), g = frame(s + 6); if (Math.abs(f.tx * g.tz - f.tz * g.tx) > 0.02) continue;
    const sd = (Math.floor(s / 38) % 2) ? 1 : -1;
    const px = f.x + f.nx * sd * 8.4, pz = f.z + f.nz * sd * 8.4;
    if (taken.some((t) => Math.hypot(t.x - px, t.z - pz) < t.r + 2)) continue;
    decor('lightPostLarge', px, pz, [-f.nx * sd, -f.nz * sd], 6.5, 0.38, 0.1);
  }
  // trees
  const rnd = mulberry(77), xs = PTS.map((p) => p.x), zs = PTS.map((p) => p.z), m = 75;
  const x0 = Math.min(...xs) - m, x1 = Math.max(...xs) + m, z0 = Math.min(...zs) - m, z1 = Math.max(...zs) + m;
  let placed = 0;
  for (let tries = 0; tries < 2600 && placed < 260; tries++) {
    const px = x0 + rnd() * (x1 - x0), pz = z0 + rnd() * (z1 - z0);
    if (gpDistToPath(px, pz) < 13 || taken.some((t) => Math.hypot(t.x - px, t.z - pz) < t.r + 4)) continue;
    const big = rnd() < 0.6, sc = (big ? 7 : 8) * (0.8 + rnd() * 0.5);
    put(big ? 'treeLarge' : 'treeSmall', gpMat(px, pz, rnd() * 6.28, sc, 0, 0, 0)); placed++;
  }
  for (const nm of Object.keys(B)) {
    const model = models['gp_' + nm]; if (!model) continue;
    model.scene.traverse((o) => {
      if (!o.isMesh) return;
      const geos = B[nm].map((M) => { const g = o.geometry.clone(); g.applyMatrix4(M); return g; });
      const mesh = new THREE.Mesh(mergeGeometries(geos, false), o.material); mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false; group.add(mesh);
    });
  }
}

