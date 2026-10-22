// @ts-nocheck
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { S } from '../../core/state';
import { cellCenter } from './track';
import { models } from '../../render/scenes';

const spaceMats = new Map();

export function spaceMat(m, ter) {
  const kk = ter ? m.uuid + 't' : m.uuid;
  if (!spaceMats.has(kk)) { const c = m.clone(); c.metalness = 0.0; c.roughness = 0.8; if (ter && (m.name === 'rock' || m.name === 'rockDark')) c.color.multiply(new THREE.Color(1, 0.72, 0.58)); if (ter && m.name === 'rockTrack') c.color.set('#6a3226'); spaceMats.set(kk, c); }
  return spaceMats.get(kk);
}

export function buildSpace(group, occ, prnd) {
  S.ROAD_Y = 0.05;
  const B = {};
  const mk = (x, y, z, th, sx, sy, sz) => new THREE.Matrix4().makeTranslation(x, y, z).multiply(new THREE.Matrix4().makeRotationY(th)).multiply(new THREE.Matrix4().makeScale(sx, sy || sx, sz || sx));
  const put = (n, M) => { (B[n] = B[n] || []).push(M); };
  S.CELLS.forEach((c) => {
    const [cx, cz] = cellCenter(c);
    if (c.corner) {
      const a = (c.d2[0] === c.d[1] && c.d2[1] === -c.d[0]) ? [c.d[0], c.d[1]] : [-c.d2[0], -c.d2[1]];
      put('s_terrain_roadCorner', mk(cx, 0.05, cz, Math.atan2(-a[1], a[0]), 10));
    } else put('s_terrain_roadStraight', mk(cx, 0.05, cz, Math.atan2(c.d[0], c.d[1]), 10));
  });
  // start gate and chequered line
  const sc00 = S.CELLS[0], [gx, gz] = cellCenter(sc00), n0 = { x: -sc00.d[1], z: sc00.d[0] };
  const cv = document.createElement('canvas'); cv.width = 128; cv.height = 32; const cxx = cv.getContext('2d');
  for (let a = 0; a < 16; a++) for (let b = 0; b < 4; b++) { cxx.fillStyle = (a + b) % 2 ? '#15112b' : '#ffffff'; cxx.fillRect(a * 8, b * 8, 8, 8); }
  const ct = new THREE.CanvasTexture(cv); ct.colorSpace = THREE.SRGBColorSpace;
  const line = new THREE.Mesh(new THREE.PlaneGeometry(6.0, 1.5), new THREE.MeshBasicMaterial({ map: ct }));
  const sc0 = S.CELLS[0], [sx, sz] = cellCenter(sc0);
  line.rotation.x = -Math.PI / 2; line.position.set(sx, 0.12, sz); line.rotation.z = sc0.d[0] === 0 ? 0 : Math.PI / 2;
  group.add(line);
  // island diorama: terrain tiles, sloping rim, raised mesas, monorail, rocket, base
  const gnd = group.children[0]; if (gnd && gnd.isMesh) { gnd.position.y = -5.2; gnd.material = gnd.material.clone(); gnd.material.color.set('#4a2226'); }
  const K = (v) => Math.round((v - 5) / 10), W = (k) => k * 10 + 5;
  const road = new Set(); S.CELLS.forEach((c) => { const [x, z] = cellCenter(c); road.add(K(x) + ',' + K(z)); });
  const nearRoad = (i, j) => { for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) if (road.has((i + a) + ',' + (j + b))) return true; return false; };
  const I0 = -7, I1 = 6, J0 = -5, J1 = 4;
  const used = new Set();
  const mesa = (x0, x1, z0, z1) => { // world-edge rectangle (multiples of 10)
    const i0 = K(x0 + 5), i1 = K(x1 - 5), j0 = K(z0 + 5), j1 = K(z1 - 5), cxm = (i0 + i1) / 2, czm = (j0 + j1) / 2;
    for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) {
      used.add(i + ',' + j);
      const edgeX = i === i0 || i === i1, edgeZ = j === j0 || j === j1;
      if (!edgeX && !edgeZ) { put('s_terrain', mk(W(i), 5, W(j), 0, 10)); continue; }
      let ix = 0, iz = 0;
      if (edgeX) ix = i === i0 ? 1 : -1; else iz = j === j0 ? 1 : -1;
      put('s_terrain_ramp', mk(W(i), 0, W(j), Math.atan2(ix, iz), 10));
      if (edgeX && edgeZ) put('s_terrain_ramp', mk(W(i), 0, W(j), Math.atan2(0, j === j0 ? 1 : -1), 10));
    }
  };
  mesa(-30, 0, -20, 20); mesa(40, 60, -10, 10); mesa(-60, -40, 30, 50); mesa(20, 40, 30, 50);
  for (let i = I0; i <= I1; i++) for (let j = J0; j <= J1; j++) {
    const k = i + ',' + j; if (used.has(k) || road.has(k)) continue;
    const eX = i === I0 || i === I1, eZ = j === J0 || j === J1;
    if (!eX && !eZ) { put('s_terrain', mk(W(i), -0.04, W(j), 0, 10)); continue; }
    let ox = 0, oz = 0; if (eZ) oz = j === J0 ? -1 : 1; else ox = i === I0 ? -1 : 1;
    put('s_terrain_side', mk(W(i), 0, W(j), Math.atan2(-ox, -oz), 10));
  }
  // monorail over the road, resting on supports
  const MZ = -5;
  for (let x = -15; x <= 45; x += 10) {
    put('s_monorail_trackStraight', mk(x, 5, MZ, Math.PI / 2, 10));
    if (x > -5 && x < 45 && Math.abs(x - 35) > 6) put('s_monorail_trackSupport', mk(x, 0, MZ, 0, 10));
  }
  const tr = ['s_monorail_trainFront', 's_monorail_trainPassenger', 's_monorail_trainPassenger', 's_monorail_trainEnd'];
  tr.forEach((n, q) => put(n, mk(24 - q * 7.2, 6.3, MZ, -Math.PI / 2, 7.2)));
  // launch pad rocket on the big mesa
  { const rx = -15, rz = 0, S = 4.6; put('s_rocket_baseA', mk(rx, 5, rz, 0, S)); put('s_rocket_sidesA', mk(rx, 5 + 1.6 * S, rz, 0, S)); put('s_rocket_topA', mk(rx, 5 + 2.6 * S, rz, 0, S)); }
  put('s_hangar_largeA', mk(-22, 5, 14, Math.PI / 2, 2.2)); put('s_satelliteDish_large', mk(-8, 5, 12, 2.3, 5)); put('s_machine_generatorLarge', mk(-23, 5, -14, 0.6, 3));
  // pipe line and base buildings in the free north-east infield
  for (let x = 12; x <= 26; x += 5) put('s_pipe_straight', mk(x, 0, -13, Math.PI / 2, 5));
  put('s_pipe_end', mk(9.5, 0, -13, -Math.PI / 2, 5)); put('s_pipe_end', mk(29.5, 0, -13, Math.PI / 2, 5)); put('s_pipe_ring', mk(19, 0, -13, Math.PI / 2, 5));
  [[12, -38, 0], [28, -38, 1]].forEach(([x, z, r]) => put(r ? 's_hangar_smallB' : 's_hangar_smallA', mk(x, 0, z, 0, 3)));
  // main base in the south-east pocket
  put('s_hangar_largeB', mk(20, 0, 18.5, 0, 3.4)); put('s_hangar_roundA', mk(16, 0, 38, 0.4, 3.4)); put('s_structure_detailed', mk(27, 0, 22, 0.5, 5)); put('s_structure_detailed', mk(30, 0, 33, 0, 5));
  put('s_rover', mk(12, 0, -9, 0.8, 4)); put('s_astronautB', mk(-8, 5, -10, 2, 4)); put('s_barrels', mk(26, 0, -9, 0, 4));
  put('s_craft_speederC', mk(-45, 16, -30, 0.7, 5)); put('s_craft_speederA', mk(52, 20, 25, 3.8, 5)); put('s_craft_speederC', mk(8, 30, -40, 2.2, 4));
  // scatter rocks, craters and outposts over the remaining plain
  const rnd = (a, b) => a + (b - a) * prnd();
  const fixed = [[-5, 9], [-5, 11], [2, 1], [3, 1], [2, 3], [3, 3], [1, 3], [3, 0]];
  for (let i = I0 + 1; i < I1; i++) for (let j = J0 + 1; j < J1; j++) {
    const k = i + ',' + j; if (used.has(k) || road.has(k)) continue;
    if (i >= 1 && i <= 3 && j >= -2 && j <= -1) continue; // pipes
    if (i >= 1 && i <= 3 && j >= 1 && j <= 3 && prnd() < 0.9) continue; // base zone
    const x = W(i), z = W(j), q = prnd(), near = nearRoad(i, j);
    if (q < 0.25) put(prnd() < 0.5 ? 's_crater' : 's_craterLarge', mk(x + rnd(-1, 1), 0.04, z + rnd(-1, 1), rnd(0, 6.3), rnd(6, 9)));
    else if (q < 0.5) { const n = near ? 1 : 2 + Math.floor(prnd() * 2); for (let t = 0; t < n; t++) put(['s_rock_largeA', 's_rock_largeB', 's_rocks_smallA', 's_rocks_smallB', 's_rock_crystalsLargeA', 's_rock_crystalsLargeB', 's_meteor'][Math.floor(prnd() * 7)], mk(x + rnd(-3, 3), 0, z + rnd(-3, 3), rnd(0, 6.3), near ? rnd(1.6, 2.6) : rnd(2.8, 4.5))); }
    else if (q < 0.6) put('s_satelliteDish', mk(x, 0, z, rnd(0, 6.3), 5));
    else if (!near && q < 0.7) put(['s_hangar_smallA', 's_hangar_smallB', 's_hangar_roundA', 's_hangar_largeA'][Math.floor(prnd() * 4)], mk(x, 0, z, Math.floor(prnd() * 4) * Math.PI / 2, 2.6));
  }
  // keep every prop clear of the road
  const roadC = S.CELLS.map((c) => cellCenter(c)), dropped = [];
  for (const nm of Object.keys(B)) {
    if (/terrain|monorail|pipe|supports/.test(nm) || !models[nm]) continue;
    const bb = new THREE.Box3().setFromObject(models[nm].scene), sz = bb.getSize(new THREE.Vector3()), rr0 = 0.5 * Math.max(sz.x, sz.z);
    B[nm] = B[nm].filter((M) => {
      const x = M.elements[12], y = M.elements[13], z = M.elements[14], sc = Math.hypot(M.elements[0], M.elements[1], M.elements[2]);
      if (y > 8) return true;
      const r = rr0 * sc + 2;
      const hit = roadC.some(([cx, cz]) => Math.abs(x - cx) < 5 + r && Math.abs(z - cz) < 5 + r);
      if (hit) dropped.push(nm + '@' + Math.round(x) + ',' + Math.round(z));
      return !hit;
    });
  }
  window.__dropped = dropped;
  for (const nm of Object.keys(B)) {
    const model = models[nm]; if (!model || !B[nm].length) continue;
    model.scene.updateWorldMatrix(true, true);
    model.scene.traverse((o) => {
      if (!o.isMesh) return;
      let top = o; while (top.parent && top.parent !== model.scene) top = top.parent;
      const rel = top.matrixWorld.clone().invert().multiply(o.matrixWorld);
      const geos = B[nm].map((M) => { const g = o.geometry.clone(); if (nm === 's_terrain_roadCorner') g.translate(-0.5, 0, 0.5); g.applyMatrix4(M.clone().multiply(rel)); return g; });
      const mesh = new THREE.Mesh(mergeGeometries(geos, false), spaceMat(o.material, nm.indexOf('s_terrain') === 0)); mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false; group.add(mesh);
    });
  }
}

