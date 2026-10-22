// @ts-nocheck
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { S } from '../../core/state';
import { models } from '../../render/scenes';
import { BOUNDS, PTS, cellCenter, pointAt } from './track';
import { mergeNature, mergePlacements } from '../props';
import { GP_DIR, GP_SC, gpMat, gpRotFor } from './grandprix';
import { buildSpace } from './space';
import { clampI, clampJ } from '../raceWorld';
import { TILE } from '../../config/maps';

const IND_BUILD = ['i_building_a', 'i_building_b', 'i_building_c', 'i_building_d', 'i_building_e', 'i_building_f', 'i_building_g', 'i_building_l', 'i_building_m', 'i_building_q', 'i_building_r', 'i_building_t'];

const indBox = {};

function indBounds(nm) {
  if (!indBox[nm]) { const m = models[nm]; m.scene.updateWorldMatrix(true, true); const b = new THREE.Box3().setFromObject(m.scene); indBox[nm] = { c: b.getCenter(new THREE.Vector3()), s: b.getSize(new THREE.Vector3()) }; }
  return indBox[nm];
}

export function buildIndustrial(group, lots, prnd) {
  const B = {};
  const put = (nm, x, z, th, sc, lift) => { const b = indBounds(nm); (B[nm] = B[nm] || []).push(new THREE.Matrix4().makeTranslation(x, lift || 0, z).multiply(new THREE.Matrix4().makeRotationY(th)).multiply(new THREE.Matrix4().makeScale(sc, sc, sc)).multiply(new THREE.Matrix4().makeTranslation(-b.c.x, 0, -b.c.z))); return b; };
  const toward = (l) => { let bi = 0, bd = 1e9; for (let i = 0; i < PTS.length; i += 3) { const dd = Math.hypot(PTS[i].x - l.x, PTS[i].z - l.z); if (dd < bd) { bd = dd; bi = i; } } return Math.atan2(PTS[bi].x - l.x, PTS[bi].z - l.z); };
  const nat = {};
  for (const l of lots) {
    const r = prnd();
    if (r < 0.09) { for (let q = 0; q < 3; q++) { const nk = prnd() < 0.7 ? 'tree_default' : 'plant_bushLarge'; (nat[nk] = nat[nk] || []).push({ x: l.x + (prnd() - 0.5) * 7, z: l.z + (prnd() - 0.5) * 7, rot: prnd() * 6, s: 5 + prnd() * 2 }); } continue; }
    if (r < 0.2) { // yard: containers, tanks, solar panels
      const q = prnd();
      if (q < 0.4) { const th = toward(l) + (prnd() < 0.5 ? 0 : Math.PI / 2); for (let k = -1; k <= 1; k += 2) put(['i_shipping_container_a', 'i_shipping_container_b', 'i_shipping_container_c'][Math.floor(prnd() * 3)], l.x + Math.cos(th) * k * 2.8, l.z - Math.sin(th) * k * 2.8, th, 3.1); }
      else if (q < 0.65) put('i_detail_tank_large', l.x, l.z, prnd() * 6, 6);
      else if (q < 0.85) put('i_solar_panel_landscape_group', l.x, l.z, toward(l), 7.5);
      else put('i_windmill', l.x, l.z, prnd() * 6, 8);
      continue;
    }
    const nm = IND_BUILD[Math.floor(prnd() * IND_BUILD.length)], b = indBounds(nm);
    const sc = Math.min(8.4 / Math.max(b.s.x, b.s.z * 1.0), 8.4 / Math.min(b.s.x, b.s.z) * 0.62, 7.2) * (l.d > 26 ? 1.05 : 0.95);
    const th = toward(l) + (prnd() < 0.15 ? Math.PI / 2 : 0);
    put(nm, l.x + (prnd() - 0.5) * 1.2, l.z + (prnd() - 0.5) * 1.2, th, sc);
    if (prnd() < 0.22) put(prnd() < 0.5 ? 'i_chimney_large' : 'i_water_tower', l.x + (prnd() - 0.5) * 6, l.z + (prnd() - 0.5) * 6 + 4.5, 0, 6.5);
  }
  for (const nm of Object.keys(B)) {
    const model = models[nm]; model.scene.updateWorldMatrix(true, true);
    model.scene.traverse((o) => {
      if (!o.isMesh) return;
      const geos = B[nm].map((M) => { const g = o.geometry.clone(); g.applyMatrix4(M.clone().multiply(o.matrixWorld)); return g; });
      const mesh = new THREE.Mesh(mergeGeometries(geos, false), o.material); mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false; group.add(mesh);
    });
  }
  for (const nm of Object.keys(nat)) group.add(mergeNature(models[nm], nat[nm], 'forest'));
}

const COM_NEAR = ['m_building_a', 'm_building_b', 'm_building_d', 'm_building_f', 'm_building_g', 'm_building_h', 'm_building_i', 'm_building_l', 'm_building_m'];

const COM_TALL = ['m_building_skyscraper_a', 'm_building_skyscraper_c', 'm_building_skyscraper_d', 'm_building_skyscraper_e'];

const COM_LOW = ['m_low_detail_building_a', 'm_low_detail_building_c', 'm_low_detail_building_g', 'm_low_detail_building_h', 'm_low_detail_building_m'];

function buildCommercial(group, lots, prnd) {
  const B = {}, box = {};
  const bounds = (nm) => { if (!box[nm]) { const m = models[nm]; m.scene.updateWorldMatrix(true, true); const b = new THREE.Box3().setFromObject(m.scene); box[nm] = { c: b.getCenter(new THREE.Vector3()), s: b.getSize(new THREE.Vector3()) }; } return box[nm]; };
  const put = (nm, x, z, th, sc) => { const b = bounds(nm); (B[nm] = B[nm] || []).push(new THREE.Matrix4().makeTranslation(x, 0, z).multiply(new THREE.Matrix4().makeRotationY(th)).multiply(new THREE.Matrix4().makeScale(sc, sc, sc)).multiply(new THREE.Matrix4().makeTranslation(-b.c.x, 0, -b.c.z))); return b; };
  const toward = (l) => { let bi = 0, bd = 1e9; for (let i = 0; i < PTS.length; i += 3) { const dd = Math.hypot(PTS[i].x - l.x, PTS[i].z - l.z); if (dd < bd) { bd = dd; bi = i; } } return Math.atan2(PTS[bi].x - l.x, PTS[bi].z - l.z); };
  const nat = {}; const pick = (a) => a[Math.floor(prnd() * a.length)];
  for (const l of lots) {
    const r = prnd();
    if (r < 0.1) { for (let q = 0; q < 3; q++) { const nk = prnd() < 0.7 ? 'tree_default' : 'plant_bushLarge'; (nat[nk] = nat[nk] || []).push({ x: l.x + (prnd() - 0.5) * 7, z: l.z + (prnd() - 0.5) * 7, rot: prnd() * 6, s: 5 + prnd() * 2 }); } continue; }
    const th = toward(l);
    if (l.d < 24) { const nm = pick(COM_NEAR), b = bounds(nm); put(nm, l.x + (prnd() - 0.5), l.z + (prnd() - 0.5), th, Math.min(7 / Math.max(b.s.x, b.s.z), 8.5) * (0.9 + prnd() * 0.15)); }
    else if (l.d < 48 || prnd() < 0.35) { const nm = pick(COM_TALL), b = bounds(nm); put(nm, l.x, l.z, th, 7.2 / Math.max(b.s.x, b.s.z) * (0.9 + prnd() * 0.25)); }
    else { const nm = pick(COM_LOW); put(nm, l.x, l.z, th, 12 + prnd() * 5); }
  }
  for (const nm of Object.keys(B)) {
    const model = models[nm]; model.scene.updateWorldMatrix(true, true);
    model.scene.traverse((o) => {
      if (!o.isMesh) return;
      const geos = B[nm].map((M) => { const g = o.geometry.clone(); g.applyMatrix4(M.clone().multiply(o.matrixWorld)); return g; });
      const mesh = new THREE.Mesh(mergeGeometries(geos, false), o.material); mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false; group.add(mesh);
    });
  }
  for (const nm of Object.keys(nat)) group.add(mergeNature(models[nm], nat[nm], 'forest'));
}

function windowTexture() {
  if (S.winTex) return S.winTex;
  const cv = document.createElement('canvas'); cv.width = cv.height = 64; const cx = cv.getContext('2d');
  cx.fillStyle = '#ffffff'; cx.fillRect(0, 0, 64, 64);
  cx.fillStyle = '#d6dbe6'; cx.fillRect(0, 56, 64, 8);
  cx.fillStyle = '#2f3d5c'; cx.fillRect(14, 14, 36, 34);
  cx.fillStyle = '#6f93c4'; cx.fillRect(14, 14, 36, 12);
  cx.fillStyle = '#9fbbe0'; cx.fillRect(14, 14, 8, 34);
  S.winTex = new THREE.CanvasTexture(cv); S.winTex.colorSpace = THREE.SRGBColorSpace; S.winTex.wrapS = S.winTex.wrapT = THREE.RepeatWrapping; S.winTex.anisotropy = 4;
  return S.winTex;
}

function boxBuilding(x, z, w, d, h, color) {
  const g = new THREE.BoxGeometry(w, h, d); g.translate(x, h / 2, z);
  const uv = g.attributes.uv, pitch = 3.4;
  const fw = [d, d, 1, 1, w, w];
  for (let f = 0; f < 6; f++) for (let v = 0; v < 4; v++) {
    const i = f * 4 + v;
    if (f === 2 || f === 3) uv.setXY(i, 0.03, 0.03);
    else uv.setXY(i, uv.getX(i) * fw[f] / pitch, uv.getY(i) * h / pitch);
  }
  const c = new THREE.Color(color), n = g.attributes.position.count, arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b; }
  g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return g;
}

function cellRoad(group) {
  const B = {}; const put = (n, M) => { (B[n] = B[n] || []).push(M); };
  const dIdx = (d) => GP_DIR.findIndex((v) => v[0] === d[0] && v[1] === d[1]);
  const place = (name, wx, wz, d, L, rev) => {
    const M = rev ? gpMat(wx, wz, gpRotFor(0, 1, d), GP_SC, 0.5, -L, 0) : gpMat(wx, wz, gpRotFor(0, -1, d), GP_SC, 0.5, 0, 0);
    put(name, M);
  };
  const barrier = (nm, px, pz, tx, tz, y) => { // 2.5-long red or white block, centred on (px,pz), lying along (tx,tz)
    const th = Math.atan2(-tz, tx);
    put(nm, new THREE.Matrix4().makeTranslation(px, y, pz).multiply(new THREE.Matrix4().makeRotationY(th)).multiply(new THREE.Matrix4().makeScale(GP_SC, GP_SC * 0.5, GP_SC * 0.8)).multiply(new THREE.Matrix4().makeTranslation(-0.125, 0, 0.0615)));
  };
  S.CELLS.forEach((c, idx) => {
    const [cx, cz] = cellCenter(c);
    const ex = cx - c.d[0] * 5, ez = cz - c.d[1] * 5;
    if (c.ramp) {
      if (c.rIdx === 0) place('roadRampLong', ex, ez, c.d, 2, c.ramp === 'down');
      return;
    }
    if (c.corner) {
      const right = dIdx(c.d2) === (dIdx(c.d) + 1) % 4;
      for (const nm of ['roadCornerSmall', 'roadCornerSmallBorder']) {
        const M = right ? gpMat(ex, ez, gpRotFor(0, -1, c.d), GP_SC, 0.5, 0, 0) : gpMat(ex, ez, gpRotFor(-1, 0, c.d), GP_SC, 1, -0.5, 0);
        put(nm, M);
      }
      // red and white barrier blocks round the outside of the bend
      const ax = cx + (-c.d[0] + c.d2[0]) * 5, az = cz + (-c.d[1] + c.d2[1]) * 5;
      const a0 = Math.atan2(ez - az, ex - ax), a1 = Math.atan2(cz + c.d2[1] * 5 - az, cx + c.d2[0] * 5 - ax);
      let da = a1 - a0; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
      const R = 10.9, n = 6;
      for (let k = 0; k < n; k++) {
        const a = a0 + da * (k + 0.5) / n, tg = Math.sign(da);
        barrier(k % 2 ? 'barrierWhite' : 'barrierRed', ax + R * Math.cos(a), az + R * Math.sin(a), -Math.sin(a) * tg, Math.cos(a) * tg, c.y0 - 0.2);
      }
      return;
    }
    place(c.elev ? 'roadStraightBridgeMid' : 'roadStraight', ex, ez, c.d, 1, false);
    const ny = c.elev ? 0.2 + 5.0 : 0;
    for (const sd of [-1, 1]) {
      const lx = -c.d[1] * sd * 5.9, lz = c.d[0] * sd * 5.9;
      for (let k = 0; k < 4; k++) {
        const off = (k - 1.5) * 2.5;
        barrier((k + idx) % 2 ? 'barrierWhite' : 'barrierRed', cx + lx + c.d[0] * off, cz + lz + c.d[1] * off, c.d[0], c.d[1], ny);
      }
    }
  });
  // start gantry
  { const p = pointAt(0), f = { x: p.x, z: p.z, nx: -p.tz, nz: p.tx }; put('overhead', gpMat(f.x, f.z, Math.atan2(-f.nz, f.nx), GP_SC, 0.5, 0.1, 0)); }
  for (const nm of Object.keys(B)) {
    const model = models['gp_' + nm]; if (!model) continue;
    model.scene.traverse((o) => {
      if (!o.isMesh) return;
      const geos = B[nm].map((M) => { const g = o.geometry.clone(); g.applyMatrix4(M); return g; });
      const mesh = new THREE.Mesh(mergeGeometries(geos, false), o.material); mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false; group.add(mesh);
    });
  }
}

export function buildCity(group, occ, prnd) {
  if (S.MAP.style === 'space') { buildSpace(group, occ, prnd); return; }
  S.ROAD_Y = 0.2;
  const P = {}; const put = (name, x, z, rot, s, y) => { (P[name] = P[name] || []).push({ x, z, rot, s, y: y || 0 }); };
  S.CELLS.forEach((c, idx) => {
    const [x, z] = cellCenter(c);
    if (c.cross || c.ramp) return;
    if (c.corner) {
      const ax = x + (-c.d[0] + c.d2[0]) * 5, az = z + (-c.d[1] + c.d2[1]) * 5;
      const nx = (c.d[0] - c.d2[0]) / Math.SQRT2, nz = (c.d[1] - c.d2[1]) / Math.SQRT2;
      put('c_road_sign_warning', ax + nx * 12.6, az + nz * 12.6, Math.atan2(-nx, -nz) + Math.PI / 2, 10);
      put('c_construction_cone', ax + nx * 11.8 + nz * 1.2, az + nz * 11.8 - nx * 1.2, 0, 10);
      put('c_construction_cone', ax + nx * 11.8 - nz * 1.2, az + nz * 11.8 + nx * 1.2, 1, 10);
      return;
    }
    if (idx % 2 === 1 && idx !== 1) {
      const lamp = idx % 4 === 1 ? 'c_light_square' : 'c_light_curved';
      for (const side of [-1, 1]) {
        if (c.d[0] !== 0) put(lamp, x + (idx % 3 - 1) * 1.5, z + side * 7.6, side > 0 ? 0 : Math.PI, 10);
        else put(lamp, x + side * 7.6, z + (idx % 3 - 1) * 1.5, side > 0 ? Math.PI / 2 : -Math.PI / 2, 10);
      }
    }
    if (idx !== 0 && prnd() < 0.12) put(prnd() < 0.5 ? 'c_dumpster' : 'c_construction_barrier', c.d[0] !== 0 ? x + (prnd() - 0.5) * 6 : x + (prnd() < 0.5 ? -8.4 : 8.4), c.d[0] !== 0 ? z + (prnd() < 0.5 ? -8.4 : 8.4) : z + (prnd() - 0.5) * 6, prnd() * 6, 10);
  });
  cellRoad(group);
  for (const nm of Object.keys(P)) group.add(mergePlacements(models[nm].scene, P[nm], 'city'));
  const P0 = P;

  // start line
  const sc0 = S.CELLS[0], [sx, sz] = cellCenter(sc0);
  const cv = document.createElement('canvas'); cv.width = 128; cv.height = 32; const cx = cv.getContext('2d');
  for (let a = 0; a < 16; a++) for (let b = 0; b < 4; b++) { cx.fillStyle = (a + b) % 2 ? '#15112b' : '#ffffff'; cx.fillRect(a * 8, b * 8, 8, 8); }
  const ct = new THREE.CanvasTexture(cv); ct.colorSpace = THREE.SRGBColorSpace;
  const line = new THREE.Mesh(new THREE.PlaneGeometry(6.0, 1.5), new THREE.MeshBasicMaterial({ map: ct }));
  line.rotation.x = -Math.PI / 2; line.position.set(sx, 0.215, sz); if (sc0.d[0] === 0) line.rotation.z = 0; else line.rotation.z = Math.PI / 2;
  group.add(line);

  if (S.MAP.style === 'space') { buildSpace(group, occ, prnd); return; }
  // industrial buildings and yards on the lots beside the road
  const lots = [], cx0 = (BOUNDS.minI + BOUNDS.maxI) / 2, cz0 = (BOUNDS.minJ + BOUNDS.maxJ) / 2;
  for (let i = BOUNDS.minI - 4; i <= BOUNDS.maxI + 4; i++) for (let j = BOUNDS.minJ - 4; j <= BOUNDS.maxJ + 4; j++) {
    if (occ.has(i + ',' + j)) continue;
    const dist = Math.max(Math.abs(i - clampI(i)), Math.abs(j - clampJ(j)));
    lots.push({ x: (i - cx0) * TILE, z: (j - cz0) * TILE, d: 10 + dist * 10 });
  }
  buildCommercial(group, lots, prnd);
}

