// @ts-nocheck
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { S } from '../../core/state';
import { mulberry } from '../../utils/helpers';
import { BOUNDS, cellCenter, pointAt, same } from './track';
import { models } from '../../render/scenes';
import { spaceMat } from './space';

export function buildRiver(group) {
  S.ROAD_Y = 0;
  const F = 10 * S.CELLF, prnd = mulberry(91);
  const gnd = group.children[0]; if (gnd && gnd.isMesh) { gnd.position.y = -0.03 * F; gnd.material = gnd.material.clone(); gnd.material.roughness = 0.35; gnd.material.metalness = 0; }
  const B = {};
  const put = (nm, x, y, z, th, sx, sy, sz) => { (B[nm] = B[nm] || []).push(new THREE.Matrix4().makeTranslation(x, y, z).multiply(new THREE.Matrix4().makeRotationY(th)).multiply(new THREE.Matrix4().makeScale(sx, sy === undefined ? sx : sy, sz === undefined ? sx : sz))); };
  const occ = new Set(S.CELLS.map((c) => c.i + ',' + c.j));
  S.CELLS.forEach((c) => {
    const [x, z] = cellCenter(c);
    if (!c.corner) { put('nr_riverStraight', x, 0, z, Math.atan2(c.d[0], c.d[1]), F); return; }
    const a = [-c.d[0], -c.d[1]], b = c.d2; let th = 0;
    for (let k = 0; k < 4; k++) { const cs = Math.round(Math.cos(k * Math.PI / 2)), sn = Math.round(Math.sin(k * Math.PI / 2)); const e1 = [sn, cs], e2 = [cs, -sn]; if ((same(e1, a) && same(e2, b)) || (same(e1, b) && same(e2, a))) { th = k * Math.PI / 2; break; } }
    put('nr_riverBend', x, 0, z, th, F);
  });
  // Nature Kit scenery: cliffs + waterfalls, camp, farm, plaza, beach, meadows
  const cx0 = (BOUNDS.minI + BOUNDS.maxI) / 2, cz0 = (BOUNDS.minJ + BOUNDS.maxJ) / 2, M = 4;
  const blobs = [];
  const BLOBR = { tree: 0.3, tent: 0.45, rock: 0.4, stone: 0.4, log: 0.35, statue: 0.2, palm: 0.2, canoe: 0.5, mushroom: 0.2, bush: 0.4, stump: 0.3, campfire: 0.3, sign: 0.15, crops_corn: 0.15, crop_: 0.3 };
  const P = (name, px, pz, s, y, th) => {
    put(name, px, y || 0, pz, th === undefined ? prnd() * 6.28 : th, s);
    const k = Object.keys(BLOBR).find((k2) => name.indexOf(k2) === 0 || name.indexOf('_' + k2) >= 0);
    if (k) blobs.push([px, (y || 0) + 0.15, pz, s * BLOBR[k]]);
  };
  const R = (a, b) => a + prnd() * (b - a), pick = (arr) => arr[Math.floor(prnd() * arr.length)];
  const inRange = (i, j) => i >= BOUNDS.minI && i <= BOUNDS.maxI && j >= BOUNDS.minJ && j <= BOUNDS.maxJ;
  // interior cells = not reachable from outside without crossing the canal
  const seen = new Set(), q = [[BOUNDS.minI - M, BOUNDS.minJ - M]];
  seen.add(q[0].join(','));
  while (q.length) { const [i, j] = q.pop(); for (const [a2, b2] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ni = i + a2, nj = j + b2, k = ni + ',' + nj; if (ni < BOUNDS.minI - M || ni > BOUNDS.maxI + M || nj < BOUNDS.minJ - M || nj > BOUNDS.maxJ + M || seen.has(k) || occ.has(k)) continue; seen.add(k); q.push([ni, nj]); } }
  const inner = []; for (let i = BOUNDS.minI; i <= BOUNDS.maxI; i++) for (let j = BOUNDS.minJ; j <= BOUNDS.maxJ; j++) if (!occ.has(i + ',' + j) && !seen.has(i + ',' + j)) inner.push([i, j]);
  const FALL = ['tree_oak_fall', 'tree_default_fall', 'tree_fat_fall', 'tree_tall_fall'];
  const GREEN = ['tree_oak', 'tree_default', 'tree_fat', 'tree_pineSmallA', 'tree_pineTallA', 'tree_pineTallD', 'tree_tall'];
  const flowers = (x, z, n, rad) => { for (let t = 0; t < n; t++) P(pick(['flower_redA', 'flower_yellowA', 'flower_purpleA']), x + R(-rad, rad), z + R(-rad, rad), R(7, 10)); };
  const camp = (x, z) => {
    P('campfire_logs', x, z, 14); P('tent_detailedOpen', x - 0.2 * F, z - 0.12 * F, 14, 0, 0.6); P('tent_smallOpen', x + 0.2 * F, z - 0.15 * F, 14, 0, -0.7);
    P('log_stack', x + 0.05 * F, z + 0.3 * F, 10); P('canoe', x - 0.22 * F, z + 0.24 * F, 14, 0, 1.2); P('sign', x + 0.25 * F, z + 0.2 * F, 14, 0, 0.3);
    for (const [a2, b2] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) P(pick(FALL), x + a2 * 0.36 * F, z + b2 * 0.36 * F, R(9, 12));
  };
  const farm = (x, z) => {
    const s = 0.26 * F, crops = ['crops_cornStageD', 'crop_pumpkin', 'crop_melon', 'crops_wheatStageB'];
    for (let a2 = -1; a2 <= 1; a2++) for (let b2 = -1; b2 <= 1; b2++) {
      const tx = x + a2 * s, tz = z + b2 * s; P('crops_dirtDoubleRow', tx, tz, s * 1.02, 0, 0);
      const cr = crops[(a2 + 1 + (b2 + 1) * 2) % 4];
      for (const o of [-0.25, 0.25]) P(cr, tx + o * s, tz + o * s * (b2 ? 1 : -1), cr === 'crops_cornStageD' ? 9 : 8, 0.4);
    }
    for (let k = -1; k <= 1; k++) { P('fence_simple', x + k * s, z - 1.7 * s, s, 0, 0); P('fence_simple', x + k * s, z + 1.7 * s, s, 0, Math.PI); P('fence_simple', x - 1.7 * s, z + k * s, s, 0, Math.PI / 2); P('fence_simple', x + 1.7 * s, z + k * s, s, 0, -Math.PI / 2); }
  };
  const plaza = (x, z) => {
    P('statue_obelisk', x, z, 20); P('statue_head', x + 0.26 * F, z + 0.22 * F, 12); P('statue_ring', x - 0.26 * F, z - 0.2 * F, 12, 0, 0.5);
    for (let t = 0; t < 10; t++) { const a = t / 10 * 6.283; P('path_stone', x + Math.cos(a) * 0.2 * F, z + Math.sin(a) * 0.2 * F, 8, 0.1, -a); }
    for (let t = 0; t < 12; t++) { const a = t / 12 * 6.283; P(pick(['flower_redA', 'flower_yellowA', 'flower_purpleA']), x + Math.cos(a) * 0.33 * F, z + Math.sin(a) * 0.33 * F, 8); }
  };
  const beach = (x, z) => {
    P('platform_beach', x, z, F * 1.08, 0, 0);
    for (let t = 0; t < 6; t++) P('tree_palmDetailedTall', x + R(-0.3, 0.3) * F, z + R(-0.3, 0.3) * F, R(9, 13), 2);
    P('canoe', x + 0.1 * F, z + 0.1 * F, 13, 2, R(0, 3));
  };
  const meadow = (x, z, mushrooms) => {
    P(pick(FALL), x + R(-0.2, 0.2) * F, z + R(-0.2, 0.2) * F, R(11, 14)); P(pick(FALL), x + R(-0.3, 0.3) * F, z + R(-0.3, 0.3) * F, R(9, 12));
    flowers(x, z, 10, 0.32 * F);
    for (let t = 0; t < 3; t++) P(pick(['plant_bushLargeTriangle', 'plant_bushLarge']), x + R(-0.3, 0.3) * F, z + R(-0.3, 0.3) * F, R(6, 9));
    if (mushrooms) for (let t = 0; t < 7; t++) P('mushroom_redTall', x + R(-0.32, 0.32) * F, z + R(-0.32, 0.32) * F, R(10, 16));
  };
  const plan = [camp, farm, (x, z) => meadow(x, z, true), plaza, beach, (x, z) => meadow(x, z, false), beach, (x, z) => meadow(x, z, true)];
  const feat = new Map(); inner.forEach(([i, j], k) => feat.set(i + ',' + j, plan[k % plan.length]));
  for (let i = BOUNDS.minI - M; i <= BOUNDS.maxI + M; i++) for (let j = BOUNDS.minJ - M; j <= BOUNDS.maxJ + M; j++) {
    if (occ.has(i + ',' + j)) continue;
    const x = (i - cx0) * F, z = (j - cz0) * F;
    const dm = Math.max(BOUNDS.minI - i, i - BOUNDS.maxI, BOUNDS.minJ - j, j - BOUNDS.maxJ);
    if (dm >= 3) {
      // cliff wall ring: rock block + grass cap with trees on top
      const wf = dm === 3 && ((i * 7 + j * 5) % 6 === 0) && !((i < BOUNDS.minI || i > BOUNDS.maxI) && (j < BOUNDS.minJ || j > BOUNDS.maxJ));
      const h = wf ? F : F * (dm === 3 ? R(0.45, 0.7) : R(0.85, 1.25));
      if (wf) {
        const th = j < BOUNDS.minJ ? 0 : j > BOUNDS.maxJ ? Math.PI : i < BOUNDS.minI ? Math.PI / 2 : -Math.PI / 2;
        put('cliff_waterfall_rock', x, 0, z, th, F);
      } else put('cliff_block_rock', x, 0, z, 0, F, h, F);
      put('nr_grass', x, h, z, 0, F);
      for (let t = 0; t < 3; t++) P(pick(['tree_pineTallA', 'tree_pineTallD', 'tree_pineSmallA', 'tree_oak', 'tree_tall_fall']), x + R(-0.35, 0.35) * F, z + R(-0.35, 0.35) * F, R(8, 13), h);
      continue;
    }
    put('nr_grass', x, 0, z, 0, F);
    if (feat.has(i + ',' + j)) { feat.get(i + ',' + j)(x, z); continue; }
    const near = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]].some(([a2, b2]) => occ.has((i + a2) + ',' + (j + b2)));
    const cnt = near ? 2 : 4, lim = near ? 0.3 : 0.4;
    for (let t = 0; t < cnt; t++) {
      const px = x + R(-lim, lim) * F, pz = z + R(-lim, lim) * F, r = prnd();
      if (r < 0.35) P(pick(prnd() < 0.4 ? FALL : GREEN), px, pz, R(7, 11));
      else if (r < 0.5) P(pick(['plant_bush', 'plant_bushLarge', 'plant_bushLargeTriangle']), px, pz, R(5, 8));
      else if (r < 0.7) P(pick(['flower_redA', 'flower_yellowA', 'flower_purpleA']), px, pz, R(6, 9));
      else if (r < 0.82) P(pick(['rock_largeA', 'rock_largeC', 'stone_largeA']), px, pz, R(2.2, 3.6));
      else P(pick(['stump_old', 'log_large', 'mushroom_redTall', 'log_stack']), px, pz, R(6, 10));
    }
  }
  // lily pads on the canal
  S.CELLS.forEach((c, idx) => {
    if (c.corner) return; const [x, z] = cellCenter(c);
    for (let t = 0; t < 2; t++) { const sd = t ? 1 : -1, along = R(-0.3, 0.3) * F, lat = sd * R(0.14, 0.2) * F; P(prnd() < 0.6 ? 'lily_large' : 'lily_small', x + (c.d[1] !== 0 ? lat : along * c.d[0]), z + (c.d[0] !== 0 ? lat : along * c.d[1]), R(11, 15), -0.03 * F); }
  });
  // wooden fence along both banks
  { const step = F * 0.25, fs = step * 1.04, LAT = F * 0.34;
    for (let sd = -1; sd <= 1; sd += 2) for (let d = 0; d < S.TRACK_LEN; d += step) {
      const p = pointAt(d - S.START_OFFSET), th = Math.atan2(-p.tz, p.tx);
      const lx = p.x - p.tz * sd * LAT, lz = p.z + p.tx * sd * LAT;
      const off = 0.465 * fs; // fence line sits at local z -0.465
      put('fence_simple', lx + Math.sin(th) * off, 0, lz + Math.cos(th) * off, th, fs, fs * 0.75, fs);
    } }
  if (blobs.length) {
    const geos = blobs.map(([bx, by, bz, br]) => { const g = new THREE.CircleGeometry(br * 1.5, 14); g.rotateX(-Math.PI / 2); g.translate(bx, by, bz); return g; });
    const bm = new THREE.Mesh(mergeGeometries(geos, false), new THREE.MeshBasicMaterial({ color: '#0b3a40', transparent: true, opacity: 0.28, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
    bm.frustumCulled = false; bm.renderOrder = 1; group.add(bm);
  }
  // start gate, buoys and a few moored ships
  const p0 = pointAt(0), n0 = { x: -p0.tz, z: p0.tx };
  put('b_gate_finish', p0.x, 0, p0.z, Math.atan2(-n0.z, n0.x), F * 0.2);
  S.CELLS.forEach((c, idx) => {
    if (c.corner || idx % 2) return; const [x, z] = cellCenter(c);
    for (const sd of [-1, 1]) put(idx % 4 ? 'b_buoy' : 'b_buoy_flag', x + (c.d[1] !== 0 ? sd * F * 0.24 : 0), 0, z + (c.d[0] !== 0 ? sd * F * 0.24 : 0), 0, 1.7);
  });
  for (const nm of Object.keys(B)) {
    const model = models[nm]; if (!model || !B[nm].length) continue;
    model.scene.updateWorldMatrix(true, true);
    model.scene.traverse((o) => {
      if (!o.isMesh) return;
      let top = o; while (top.parent && top.parent !== model.scene) top = top.parent;
      const rel = top.matrixWorld.clone().invert().multiply(o.matrixWorld);
      const geos = B[nm].map((M) => { const g = o.geometry.clone(); g.applyMatrix4(M.clone().multiply(rel)); return g; });
      const mesh = new THREE.Mesh(mergeGeometries(geos, false), spaceMat(o.material, false)); mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false; group.add(mesh);
    });
  }
}

