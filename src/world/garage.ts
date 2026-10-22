// @ts-nocheck
import * as THREE from 'three';
import { S } from '../core/state';
import { garageScene, models } from '../render/scenes';
import { mulberry } from '../utils/helpers';
import { BIOMES } from '../config/maps';
import { G, mergeNature, natMat, propsMesh, snowman } from './props';
import { spaceMat } from './tracks/space';

function wallTexture(door) {
  const cv = document.createElement('canvas'); cv.width = 2048; cv.height = 512; const c = cv.getContext('2d');
  c.fillStyle = '#2a2252'; c.fillRect(0, 0, 2048, 512);
  c.strokeStyle = 'rgba(255,255,255,0.06)'; c.lineWidth = 3;
  for (let x = 0; x <= 2048; x += 128) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 512); c.stroke(); }
  for (let y = 128; y < 512; y += 128) { c.beginPath(); c.moveTo(0, y); c.lineTo(2048, y); c.stroke(); }
  c.fillStyle = '#1b1640'; c.fillRect(0, 400, 2048, 112);
  for (let x = -60; x < 2048; x += 64) { c.fillStyle = (Math.floor(x / 64) % 2) ? '#f5c431' : '#15112b'; c.beginPath(); c.moveTo(x, 496); c.lineTo(x + 32, 496); c.lineTo(x + 20, 512); c.lineTo(x - 12, 512); c.fill(); }
  if (door) {
    c.fillStyle = '#3a3070'; c.fillRect(744, 120, 560, 392);
    for (let y = 120; y < 512; y += 22) { c.fillStyle = 'rgba(0,0,0,0.28)'; c.fillRect(744, y + 17, 560, 4); c.fillStyle = 'rgba(255,255,255,0.05)'; c.fillRect(744, y, 560, 2); }
    c.fillStyle = '#15112b'; c.fillRect(744, 112, 560, 10);
  }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

function glowTexture(col) {
  const cv = document.createElement('canvas'); cv.width = cv.height = 256; const c = cv.getContext('2d');
  const g = c.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, col); g.addColorStop(0.45, col.replace(/[\d.]+\)$/, '0.18)')); g.addColorStop(1, col.replace(/[\d.]+\)$/, '0)'));
  c.fillStyle = g; c.fillRect(0, 0, 256, 256); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export function buildGarageWorld() {
  const sc = garageScene;
  sc.background = null;
  sc.fog = new THREE.Fog('#120e26', 16, 38);
  const gHemi = new THREE.HemisphereLight('#c9c4ff', '#3a3270', 1.4); sc.add(gHemi);
  const key = new THREE.SpotLight('#fff0d8', 900, 45, 0.5, 0.7, 2); key.position.set(-3.5, 9.5, 5); key.target.position.set(0, 0.4, 0);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; key.shadow.camera.near = 4; key.shadow.camera.far = 30;
  sc.add(key, key.target);
  const fill = new THREE.DirectionalLight('#dcd6ff', 0.7); fill.position.set(7, 3, 8); sc.add(fill);
  const rimC = new THREE.SpotLight('#3fd8e8', 650, 40, 0.65, 0.8, 2); rimC.position.set(6.5, 5, -6); rimC.target.position.set(0, 0.6, 0); sc.add(rimC, rimC.target);
  const rimO = new THREE.SpotLight('#ff8a3d', 650, 40, 0.65, 0.8, 2); rimO.position.set(-7.5, 4.5, -5); rimO.target.position.set(0, 0.6, 0); sc.add(rimO, rimO.target);
  S.garageLights = { hemi: gHemi, key, fill, rimC, rimO };
  // turntable
  S.garageTurn = new THREE.Group(); sc.add(S.garageTurn);
  const PH = 0.8;
  const sideTex = (() => { const cv = document.createElement('canvas'); cv.width = 8; cv.height = 128; const c = cv.getContext('2d'); const g = c.createLinearGradient(0, 0, 0, 128); g.addColorStop(0, '#ffffff'); g.addColorStop(0.55, '#a9a9a9'); g.addColorStop(1, '#505050'); c.fillStyle = g; c.fillRect(0, 0, 8, 128); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const sideMat = new THREE.MeshStandardMaterial({ color: '#2a5f9a', map: sideTex, metalness: 0.15, roughness: 0.55 });
  const topMat = new THREE.MeshStandardMaterial({ color: '#8ec8f0', roughness: 0.5, metalness: 0.05 });
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(3.25, 3.4, PH, 96, 1), [sideMat, topMat, sideMat]);
  drum.position.y = PH / 2; drum.castShadow = true; drum.receiveShadow = true; S.garageTurn.add(drum);
  const bandMat = new THREE.MeshBasicMaterial({ color: '#3fd8e8' }), rimMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
  const band = new THREE.Mesh(new THREE.TorusGeometry(3.36, 0.035, 8, 120), bandMat); band.rotation.x = Math.PI / 2; band.position.y = 0.26; S.garageTurn.add(band);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(3.24, 0.045, 8, 120), rimMat); rim.rotation.x = Math.PI / 2; rim.position.y = PH; S.garageTurn.add(rim);
  // spinning pattern on the top face (wedges + ring) so the rotation reads
  const dcv = document.createElement('canvas'); dcv.width = dcv.height = 512; const dtex = new THREE.CanvasTexture(dcv); dtex.colorSpace = THREE.SRGBColorSpace; dtex.anisotropy = 4;
  const deck = new THREE.Mesh(new THREE.CircleGeometry(3.2, 96), new THREE.MeshStandardMaterial({ map: dtex, transparent: true, roughness: 0.6 }));
  deck.rotation.x = -Math.PI / 2; deck.position.y = PH + 0.004; deck.receiveShadow = true; S.garageTurn.add(deck);
  const paintDeck = (accent) => {
    const c = dcv.getContext('2d'); c.clearRect(0, 0, 512, 512); c.translate(256, 256);
    for (let i = 0; i < 12; i++) { c.rotate(Math.PI / 6); c.fillStyle = i % 2 ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 250, -Math.PI / 12, Math.PI / 12); c.closePath(); c.fill(); }
    c.setTransform(1, 0, 0, 1, 0, 0); c.translate(256, 256);
    c.strokeStyle = accent; c.lineWidth = 5; c.globalAlpha = 0.9; c.beginPath(); c.arc(0, 0, 228, 0, 7); c.stroke(); c.lineWidth = 2; c.globalAlpha = 0.6; c.beginPath(); c.arc(0, 0, 205, 0, 7); c.stroke();
    c.globalAlpha = 0.85; c.fillStyle = accent; for (let i = 0; i < 24; i++) { c.rotate(Math.PI / 12); c.fillRect(236, -3, 12, 6); }
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; dtex.needsUpdate = true;
  };
  S.garagePlinth = { side: sideMat, top: topMat, band: bandMat, rim: rimMat, paint: paintDeck }; paintDeck('#3fd8e8');
  const step = new THREE.Mesh(new THREE.CylinderGeometry(3.95, 4.05, 0.12, 80), new THREE.MeshStandardMaterial({ color: '#4a4f5a', metalness: 0.2, roughness: 0.7 })); step.position.y = 0.06; step.visible = false; step.receiveShadow = true; sc.add(step);
  const stepEdge = new THREE.Mesh(new THREE.TorusGeometry(3.98, 0.04, 8, 120), (S.garagePlinth.edge = new THREE.MeshBasicMaterial({ color: '#3fd8e8' }))); stepEdge.rotation.x = Math.PI / 2; stepEdge.position.y = 0.12; stepEdge.visible = false; sc.add(stepEdge);
  // dust motes in the light
  const N = 160, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 14; pos[i * 3 + 1] = 0.3 + Math.random() * 6.5; pos[i * 3 + 2] = (Math.random() - 0.5) * 12; }
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  S.garageDust = new THREE.Points(dg, new THREE.PointsMaterial({ map: glowTexture('rgba(255,255,255,1)'), size: 0.12, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }));
  S.garageDust.frustumCulled = false; sc.add(S.garageDust);
}

const gtKey = (m) => 'garage' || (m.style === 'space' ? 'rust' : m.style === 'river' ? 'bay' : m.kind === 'gp' ? 'gp' : m.kind === 'c2' ? 'skyway' : m.biome);

function kitClone(name, x, y, z, rot, s, fix) {
  const o = models[name].scene.clone(true);
  o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; if (fix) m.material = fix(m.material); } });
  const g = new THREE.Group(); g.add(o); g.position.set(x, y || 0, z); g.rotation.y = rot || 0; g.scale.setScalar((s || 1) * (fix && fix.nat ? 0.55 : 1)); return g;
}

function kitFit(name, x, z, rot, w, fix, y0) {
  const o = models[name].scene.clone(true);
  o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; if (fix) m.material = fix(m.material); } });
  const g = new THREE.Group(); g.add(o); g.updateWorldMatrix(true, true);
  const b = new THREE.Box3().setFromObject(g), sz = b.getSize(new THREE.Vector3()), c = b.getCenter(new THREE.Vector3());
  const k = w / Math.max(sz.x, sz.z); o.scale.setScalar(k); o.position.set(-c.x * k, -b.min.y * k, -c.z * k);
  const wrap = new THREE.Group(); wrap.add(g); wrap.position.set(x, y0 || 0, z); wrap.rotation.y = rot || 0; return wrap;
}

function buildPlainGarage() {
  const group = new THREE.Group(), R = mulberry(4242);
  const std = (c, rough, met) => new THREE.MeshStandardMaterial({ color: c, roughness: rough == null ? 0.9 : rough, metalness: met || 0 });
  const box = (w, h, d, x, y, z, mat, cast, ry) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); o.position.set(x, y, z); if (ry) o.rotation.y = ry; o.receiveShadow = true; o.castShadow = !!cast; group.add(o); return o; };
  const cyl = (rt, rb, h, x, y, z, mat, seg) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 20), mat); c.position.set(x, y, z); c.castShadow = true; c.receiveShadow = true; group.add(c); return c; };
  const BW = -8.2, LW = -10.5, RW = 11.5, CH = 7.6;   // back wall z, left wall x, right wall x, ceiling height
  // concrete floor + stains
  box(40, 0.2, 40, 0, -0.1, -8, std('#7d8088', 0.9));
  for (let i = 0; i < 9; i++) { const s = new THREE.Mesh(new THREE.CircleGeometry(0.5 + R() * 1.1, 20), new THREE.MeshBasicMaterial({ color: '#1b1c20', transparent: true, opacity: 0.18 + R() * 0.25, depthWrite: false })); s.rotation.x = -Math.PI / 2; s.position.set(-7 + R() * 17, 0.012, -7.5 + R() * 11); s.scale.set(1 + R(), 1, 1); group.add(s); }
  const paint = std('#e9c63a', 0.8);
  box(9.2, 0.02, 0.12, 0.7, 0.011, BW + 2.2, paint); box(0.12, 0.02, 6, -3.9, 0.011, BW + 5, paint);
  // walls (corrugated feel via ribs) and low ceiling
  const wall = std('#b9bcc2', 0.95), wood = std('#6b4f33', 0.9), dark = std('#2b2f3a', 0.7, 0.3);
  box(40, 12, 0.4, 0, 6, BW, wall); box(0.4, 12, 40, LW, 6, -6, wall); box(0.4, 12, 40, RW, 6, -6, wall);
  for (let i = -6; i <= 8; i++) box(0.12, CH, 0.1, i * 1.5 + 1, CH / 2, BW + 0.25, std('#a4a8af', 0.9));
  const ceil = box(40, 0.3, 40, 0, CH + 0.15, -6, std('#45484f', 0.95)); ceil.receiveShadow = false;
  for (let i = -2; i <= 3; i++) box(0.35, 0.5, 30, i * 3.6, CH - 0.2, -6, std('#3a3d44', 0.8));
  for (const x of [-3, 4]) { const l = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.1, 0.5), new THREE.MeshBasicMaterial({ color: '#fffbe6' })); l.position.set(x, CH - 0.5, -2.5); group.add(l); }
  // roll-up door
  const dW = 8.4, dH = 5.6, dX = 3.2;
  box(dW + 0.7, dH + 0.4, 0.3, dX, (dH + 0.4) / 2, BW + 0.35, dark);
  for (let i = 0; i < 10; i++) box(dW, dH / 10 - 0.07, 0.2, dX, 0.3 + i * (dH / 10), BW + 0.5, std('#d8dbe0', 0.5, 0.15));
  box(1.0, 0.16, 0.25, dX, 0.9, BW + 0.7, dark);
  // neon-ish sign above the door
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 128; const cx = cv.getContext('2d'); cx.fillStyle = '#16181f'; cx.fillRect(0, 0, 512, 128);
  cx.strokeStyle = '#ff5a4a'; cx.lineWidth = 6; cx.strokeRect(8, 8, 496, 112); cx.fillStyle = '#ffd24a'; cx.font = '900 62px Impact, Arial Black, sans-serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.shadowColor = '#ffb000'; cx.shadowBlur = 18; cx.fillText('AUTO REPAIR', 256, 68);
  const st = new THREE.CanvasTexture(cv); st.colorSpace = THREE.SRGBColorSpace;
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 1.1), new THREE.MeshBasicMaterial({ map: st })); sign.position.set(dX, dH + 0.95, BW + 0.45); group.add(sign);
  // pegboard of tools (back wall, left)
  const pbX = -5.2, pbY = 3.5;
  box(5.4, 3.4, 0.12, pbX, pbY, BW + 0.3, std('#c8a46c', 0.95));
  const toolCols = ['#cfd3d9', '#b8332a', '#2f6fb5', '#e9c63a', '#2b2f3a'];
  for (let i = 0; i < 18; i++) { const tx = pbX - 2.3 + (i % 9) * 0.58, ty = pbY + (i < 9 ? 0.8 : -0.5); box(0.1 + R() * 0.08, 0.7 + R() * 0.7, 0.1, tx, ty, BW + 0.42, std(toolCols[i % 5], 0.4, 0.5)); if (i % 3 === 0) box(0.3, 0.14, 0.1, tx, ty + 0.4, BW + 0.42, std('#2b2f3a', 0.6, 0.3)); }
  // workbench under it, with clutter
  box(5.6, 0.2, 1.8, pbX, 1.45, BW + 1.1, wood, true);
  box(5.4, 1.35, 1.6, pbX, 0.7, BW + 1.1, std('#7a2a22', 0.7, 0.2), true);
  for (let i = 0; i < 3; i++) box(1.6, 0.04, 0.04, pbX - 1.8 + i * 1.8, 1.0, BW + 1.92, std('#2b2f3a'));
  box(0.5, 0.45, 0.5, pbX - 2.1, 1.8, BW + 1.0, dark, true); box(0.7, 0.4, 0.5, pbX - 0.7, 1.75, BW + 1.2, std('#b8332a', 0.5, 0.3), true, 0.3);
  cyl(0.14, 0.14, 0.4, pbX + 0.6, 1.75, BW + 1.0, std('#e9c63a', 0.5, 0.2)); cyl(0.1, 0.1, 0.3, pbX + 1.0, 1.7, BW + 1.3, std('#2f6fb5', 0.5, 0.2)); box(0.5, 0.1, 0.3, pbX + 1.8, 1.6, BW + 1.2, std('#cfd3d9', 0.4, 0.6), false, 0.7);
  // engine block on a stand + rolling toolbox + floor jack
  box(1.0, 0.8, 0.8, -8.2, 1.05, -3.8, std('#5a5f6b', 0.5, 0.6), true, 0.4); cyl(0.4, 0.4, 0.7, -8.2, 1.9, -3.8, std('#8e939c', 0.4, 0.6), 12); box(1.3, 0.6, 1.0, -8.2, 0.3, -3.8, std('#c0392b', 0.6, 0.2), true, 0.4);
  box(1.6, 2.2, 1.0, -9.6, 1.1, -6.2, std('#b8332a', 0.5, 0.3), true, 0.15); for (let i = 0; i < 5; i++) box(1.5, 0.05, 0.05, -9.5, 0.4 + i * 0.4, -5.68, dark, false, 0.15);
  box(1.8, 0.28, 0.5, -3.2, 0.3, -6.9, std('#d3382d', 0.5, 0.3), true, 0.5); cyl(0.12, 0.12, 0.9, -3.0, 0.6, -6.8, std('#8e939c', 0.4, 0.6));
  // tyres: a stack, a leaning one, scattered ones
  const tire = std('#33353d', 0.9), hub = std('#a8adb6', 0.4, 0.7);
  const tyre = (x, y, z, ry, rx) => { const g = new THREE.Group(); const t = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.3, 14, 28), tire); t.castShadow = true; g.add(t); const h = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.2, 14), hub); h.rotation.x = Math.PI / 2; g.add(h); g.position.set(x, y, z); g.rotation.set(rx, ry, 0); group.add(g); };
  for (let i = 0; i < 4; i++) tyre(-9.2 + R() * 0.2, 0.3 + i * 0.6, -3 - 0, 0, Math.PI / 2);
  tyre(6.4, 0.95, BW + 0.55, 0, 0.18); tyre(5.2, 0.3, -6.9, 0.8, Math.PI / 2); tyre(-1.2, 0.3, -7.3, 0, Math.PI / 2); tyre(-1.1, 0.9, -7.2, 0.3, Math.PI / 2);
  // drums, cans, boxes, compressor
  const dr = [['#2f6fb5', 9.9, -7.4], ['#b8332a', 10.7, -6.3], ['#3b8f6a', 10.5, -4.8], ['#2b2f3a', 9.2, -7.7]];
  dr.forEach(([c, x, z], i) => { const d = cyl(0.55, 0.55, 1.5, x, 0.75, z, std(c, 0.5, 0.4)); if (i === 2) { d.rotation.z = 1.4; d.position.y = 0.55; } });
  for (let i = 0; i < 6; i++) cyl(0.12, 0.12, 0.3, -2 + R() * 9, 0.15, -7.2 + R() * 1.2, std(i % 2 ? '#e9c63a' : '#b8332a', 0.5, 0.3));
  const card = std('#b99361', 0.95);
  box(1.3, 0.9, 1.0, 7.9, 0.45, -7.3, card, true, 0.1); box(1.1, 0.8, 0.9, 7.8, 1.3, -7.2, card, true, -0.2); box(0.9, 0.7, 0.9, 9.0, 0.35, -3.6, card, true, 0.5);
  cyl(0.5, 0.5, 1.5, 8.8, 0.95, -5.6, std('#2f8f5a', 0.5, 0.3)).rotation.z = Math.PI / 2; box(0.1, 1.2, 0.1, 8.1, 0.45, -5.6, dark); box(0.1, 1.2, 0.1, 9.5, 0.45, -5.6, dark);
  // wall bits: fire extinguisher, shelf with parts, clock, hanging cable
  cyl(0.16, 0.16, 0.7, RW - 0.4, 1.9, -2.8, std('#d3382d', 0.4, 0.3)); box(0.1, 0.3, 0.12, RW - 0.4, 2.35, -2.8, dark);
  box(0.6, 0.1, 4.6, RW - 0.4, 3.2, -6.2, wood); box(0.6, 0.1, 4.6, RW - 0.4, 4.9, -6.2, wood);
  for (let i = 0; i < 5; i++) { box(0.5, 0.5 + R() * 0.3, 0.7, RW - 0.4, 3.5, -8 + i * 0.95, std(['#c9a15c', '#2f6fb5', '#b8332a', '#8e939c', '#3b8f6a'][i], 0.7), true, R() * 0.4); }
  for (let i = 0; i < 4; i++) box(0.5, 0.4, 0.8 + R() * 0.3, RW - 0.4, 5.2, -7.5 + i * 1.2, std(i % 2 ? '#d8dbe0' : '#a77b4b', 0.7), true);
  cyl(0.5, 0.5, 0.08, 0.2, 5.8, BW + 0.3, std('#f4f4f4', 0.4)).rotation.x = Math.PI / 2;
  // hanging work light
  cyl(0.02, 0.02, 1.6, LW + 2.5, CH - 0.8, -4.8, dark, 6); cyl(0.25, 0.1, 0.3, LW + 2.5, CH - 1.7, -4.8, std('#e9c63a', 0.5, 0.3)); 
  return group;
}

function buildAssetGarage() {
  const group = new THREE.Group(), R = mulberry(99);
  const fit = (nm, x, z, rot, w, y0) => { if (models[nm]) group.add(kitFit(nm, x, z, rot, w, null, y0)); };
  const clone = (nm, x, y, z, rot, s) => { if (models[nm]) group.add(kitClone(nm, x, y, z, rot, s)); };
  const floor = new THREE.Mesh(new THREE.BoxGeometry(60, 0.2, 60), new THREE.MeshStandardMaterial({ color: '#7e8189', roughness: 0.92 })); floor.position.set(0, -0.1, -10); floor.receiveShadow = true; group.add(floor);
  for (let i = 0; i < 8; i++) { const s = new THREE.Mesh(new THREE.CircleGeometry(0.5 + R() * 1.0, 20), new THREE.MeshBasicMaterial({ color: '#17181c', transparent: true, opacity: 0.16 + R() * 0.22, depthWrite: false })); s.rotation.x = -Math.PI / 2; s.position.set(-7 + R() * 14, 0.012, -6 + R() * 9); s.scale.set(1 + R(), 1, 1); group.add(s); }
  // shell: pit garages across the back, closed bay left, office right
  fit('gp_pitsGarage', -7, -10.5, 0, 9.5); fit('gp_pitsGarageClosed', 2.5, -10.5, 0, 9.5); fit('gp_pitsOffice', 12, -10.5, 0, 9.5);
  fit('gp_pitsGarageClosed', -12.5, -4, Math.PI / 2, 9.5); fit('gp_pitsGarage', -12.5, -13.5, Math.PI / 2, 9.5);
  // clutter: tyre stacks, crates, cones, barrels, tank, dumpster, parked race cars, lights, flags
  for (let i = 0; i < 4; i++) clone('k_wheel_dark', -8.6, 0.0 + i * 0.34, -6.4, 0, 2.1);
  for (let i = 0; i < 3; i++) clone('k_wheel_dark', -7.3 + i * 0.1, i * 0.34, -7.4 - i * 0.1, i, 2.1);
  clone('k_wheel_default', 5.6, 0.1, -7.6, 0.6, 2.1); clone('k_wheel_default', 6.5, 0.1, -7.0, 1.8, 2.1); clone('k_wheel_dark', -2.6, 0.1, -7.8, 0.2, 2.1);
  for (const [x, z, r] of [[-5.6, -8.0, 0.2], [-4.6, -8.2, -0.3], [4.6, -8.1, 0.5], [8.4, -6.0, 0.1], [-9.6, -3.2, 0.4]]) clone('k_box', x, 0, z, r, 2.1);
  clone('k_box', -5.4, 0.68, -8.0, 0.8, 2.0); clone('k_box', 8.4, 0.68, -6.0, 0.3, 2.0);
  for (const [x, z] of [[-5.6, -4.6], [6.0, -5.0], [-1.0, -7.0], [8.0, -2.0], [-7.2, -1.0]]) clone('k_cone', x, 0, z, R() * 6, 1.9);
  fit('s_barrels', 9.6, -7.3, 0.3, 2.1); fit('s_barrels', -10, 0.5, 1.2, 2.0); fit('i_detail_tank_large', 10.5, -4, 0, 3.6); fit('c_dumpster', 8.2, -8, 0.15, 2.0);
  fit('gp_raceCarRed', 7.6, -3.4, -0.7, 3.4); fit('gp_raceCarWhite', -7.6, -4.4, 0.6, 3.4);
  fit('gp_lightPostModern', -9, -8, 0, 2.2); fit('gp_lightPostLarge', 8.6, -9.2, 0, 2.4); fit('gp_flagCheckers', 0.5, -9.2, 0, 2.0); fit('gp_billboardLow', 2.8, -9, 0, 6.5);
  fit('c_construction_barrier', 4.2, -6.8, 0.2, 2.2); fit('c_light_curved', -10.5, -6, Math.PI / 2, 2.6);
  return group;
}

function buildGarageTheme(key) {
  if (key === 'garage') { const g = new THREE.Group(); const fl = new THREE.Mesh(new THREE.CircleGeometry(70, 64), new THREE.MeshStandardMaterial({ color: '#201d2c', roughness: 0.55, metalness: 0.1 })); fl.rotation.x = -Math.PI / 2; fl.position.y = -0.02; fl.receiveShadow = true; g.add(fl); return { group: g, B: {}, key }; }
  const group = new THREE.Group(), R = mulberry(key.length * 977 + 13), TAU = Math.PI * 2;
  const B = BIOMES[key === 'rust' ? 'space' : key === 'bay' ? 'river' : key === 'skyway' ? 'city' : key === 'gp' ? 'forest' : key];
  const biome = key === 'desert' ? 'desert' : key === 'snow' ? 'snow' : 'forest';
  const gm = new THREE.Mesh(new THREE.CircleGeometry(90, 64), new THREE.MeshStandardMaterial({ color: B.ground, roughness: key === 'bay' ? 0.2 : 0.95, metalness: key === 'bay' ? 0.2 : 0 }));
  gm.rotation.x = -Math.PI / 2; gm.receiveShadow = true; group.add(gm);
  const blocked = (x, z) => (z > 0.5 && x > -2.5 && x < 14) || Math.hypot(x, z) < 5.4;
  const nat = {}; const props = [];
  const N = (name, x, z, s) => { (nat[name] = nat[name] || []).push({ x, z, rot: R() * TAU, s: s * 0.55 }); };
  const scatter = (n, r0, r1, fn) => { let k = 0, guard = 0; while (k < n && guard++ < n * 8) { const a = R() * TAU, r = r0 + R() * (r1 - r0), x = Math.cos(a) * r, z = Math.sin(a) * r - 2; if (blocked(x, z)) continue; fn(x, z, r); k++; } };
  const pk = (a) => a[Math.floor(R() * a.length)];
  const natFix = (m) => natMat(m, biome); natFix.nat = true;
  if (key === 'forest') {
    scatter(12, 5.6, 9, (x, z) => N(pk(['flower_redA', 'flower_yellowA', 'flower_purpleA']), x, z, 5 + R() * 2));
    scatter(8, 6, 11, (x, z) => N(pk(['plant_bush', 'plant_bushLarge']), x, z, 4 + R() * 2));
    scatter(6, 7, 14, (x, z) => N(pk(['rock_largeA', 'rock_largeC', 'stone_largeA']), x, z, 3 + R() * 2));
    scatter(14, 10, 20, (x, z) => N(pk(['tree_oak', 'tree_default']), x, z, 5.5 + R() * 2.2));
    scatter(10, 12, 26, (x, z) => N(pk(['tree_pineSmallA', 'tree_pineDefaultA']), x, z, 5.5 + R() * 2));
    scatter(34, 18, 38, (x, z) => N(pk(['tree_oak', 'tree_default', 'tree_pineTallA']), x, z, 7 + R() * 3));
    group.add(kitClone('tent_detailedOpen', -8.5, 0, -5.5, 0.6, 5, natFix), kitClone('campfire_logs', -6.2, 0, -3.8, 0.3, 4, natFix), kitClone('log_stack', -11, 0, -3, 1.2, 5, natFix));
  } else if (key === 'desert') {
    scatter(12, 6, 14, (x, z) => N(pk(['cactus_tall', 'cactus_short']), x, z, 4.5 + R() * 2.4));
    scatter(7, 9, 20, (x, z) => N(pk(['tree_palmTall', 'tree_palm']), x, z, 5 + R() * 2));
    scatter(10, 6.5, 16, (x, z) => N(pk(['rock_largeA', 'rock_largeC', 'stone_largeA', 'stone_smallA']), x, z, 3.5 + R() * 2.5));
    scatter(10, 16, 34, (x, z) => N(pk(['rock_tallA', 'rock_tallC', 'stone_tallB']), x, z, 6 + R() * 5));
    scatter(14, 14, 44, (x, z) => props.push({ geo: G.dune, x, y: -0.6, z, sx: 4 + R() * 6, sy: 1 + R() * 1.4, sz: 4 + R() * 6, color: '#dfbf80' }));
    group.add(kitClone('statue_obelisk', -3, 0, -16, 0, 9, natFix));
  } else if (key === 'snow') {
    scatter(22, 9, 30, (x, z) => N(pk(['tree_pineTallA', 'tree_pineTallC_detailed', 'tree_pineDefaultA', 'tree_pineRoundC']), x, z, 6 + R() * 3));
    scatter(8, 6.5, 16, (x, z) => N(pk(['stone_largeA', 'rock_largeA']), x, z, 3 + R() * 2.5));
    scatter(5, 7, 14, (x, z) => N('plant_bushLarge', x, z, 4 + R() * 2));
    scatter(14, 6, 30, (x, z) => { const s = 0.9 + R() * 1.6; props.push({ geo: G.sph, x, y: 0, z, sx: s * 1.8, sy: s * 0.7, sz: s * 1.5, color: '#f7fbff' }); });
    scatter(5, 6.5, 14, (x, z) => snowman(props, x, z, R));
    scatter(30, 24, 48, (x, z) => N(pk(['tree_pineTallA', 'tree_pineTallC_detailed']), x, z, 8 + R() * 3));
  } else if (key === 'city' || key === 'skyway') {
    for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) group.add(kitClone('c_road_straight', i * 10, 0.0, j * 10, 0, 10));
    const bw = (nm, x, z, w, rot) => group.add(kitFit(nm, x, z, rot, w));
    const row = key === 'skyway' ? ['m_building_skyscraper_a', 'm_building_skyscraper_c', 'm_building_skyscraper_d', 'm_building_skyscraper_e'] : ['m_building_a', 'm_building_b', 'm_building_d', 'm_building_f', 'm_building_g', 'm_building_h', 'm_building_i', 'm_building_l', 'm_building_m'];
    for (let x = -46; x <= 46; x += 11) bw(pk(row), x + R() * 2, -36 - R() * 4, 8 + R() * 2, 0);
    for (let x = -44; x <= 44; x += 14) bw(pk(['m_building_skyscraper_a', 'm_building_skyscraper_c', 'm_building_skyscraper_d', 'm_building_skyscraper_e']), x + R() * 3, -58, 12 + R() * 3, 0);
    for (let z = -20; z <= -4; z += 8) { bw(pk(row), -34 - R() * 3, z, 8 + R() * 2, Math.PI / 2); bw(pk(row), 36 + R() * 3, z - 4, 8 + R() * 2, -Math.PI / 2); }
    group.add(kitClone('c_light_curved_double', -8, 0, -6, 0, 10), kitClone('c_light_square_double', 9, 0, -9, Math.PI, 10));
    for (let k = 0; k < 7; k++) { const a = -0.4 + k * 0.55; group.add(kitClone('c_construction_cone', Math.cos(a) * -6.2 - 1, 0, Math.sin(a + 1.9) * -6.2 + 1 - 1.5, R() * 6, 10)); }
    group.add(kitClone('c_construction_barrier', 8.5, 0, -3.2, 0.3, 10), kitClone('c_dumpster', -10.5, 0, -4, 0.5, 10));
    if (key === 'skyway') { group.add(kitClone('c_road_bridge', 0, 6, -13, 0, 10), kitClone('c_bridge_pillar', -9, 0, -13, 0, 10), kitClone('c_bridge_pillar', 9, 0, -13, 0, 10), kitClone('c_sign_highway_wide', 15, 0, -6, -0.4, 10)); }
  } else if (key === 'rust') {
    const sf = (m) => spaceMat(m, false);
    group.add(kitFit('s_hangar_largeA', -12, -13, 0.2, 15, sf), kitFit('s_hangar_roundA', 14, -17, 0.5, 13, sf), kitClone('s_satelliteDish_large', 9, 0, -9, 2.3, 5.5, sf), kitFit('s_hangar_smallA', -22, -4, 1.4, 9, sf));
    const S = 3.2; group.add(kitClone('s_rocket_baseA', -4, 0, -17, 0, S, sf), kitClone('s_rocket_sidesA', -4, 1.6 * S, -17, 0, S, sf), kitClone('s_rocket_topA', -4, 2.6 * S, -17, 0, S, sf));
    group.add(kitClone('s_rover', 7.5, 0, -1.5, 0.6, 4.2, sf), kitClone('s_astronautA', -8.2, 0, -3.5, 0.9, 3, sf), kitClone('s_barrels', 11.5, 0, -4.5, 0.2, 4, sf), kitClone('s_machine_generatorLarge', -17, 0, -8, 0.6, 3, sf));
    scatter(16, 6.5, 30, (x, z) => group.add(kitClone(pk(['s_rock_largeA', 's_rock_largeB', 's_rocks_smallA', 's_rocks_smallB', 's_rock_crystalsLargeA', 's_rock_crystalsLargeB']), x, 0, z, R() * 6.3, 5 + R() * 4, sf)));
    scatter(7, 8, 30, (x, z) => group.add(kitClone(pk(['s_crater', 's_craterLarge']), x, 0.03, z, R() * 6.3, 7 + R() * 3, sf)));
  } else if (key === 'bay') {
    const dock = new THREE.Mesh(new THREE.CylinderGeometry(4.9, 5.0, 0.2, 48), new THREE.MeshStandardMaterial({ color: '#a77b4b', roughness: 0.9 })); dock.position.y = 0.0; dock.receiveShadow = true; dock.castShadow = true; group.add(dock);
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, p = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 1.2, 8), new THREE.MeshStandardMaterial({ color: '#6d4c2d', roughness: 1 })); p.position.set(Math.cos(a) * 4.95, -0.1, Math.sin(a) * 4.95); group.add(p); }
    group.add(kitClone('canoe', -6.8, -0.1, 2.2, 0.7, 5, natFix), kitFit('b_boat_house_a', -12, -12, 0.3, 12), kitFit('b_boat_speed_d', 8.5, -5.5, -0.5, 6), kitFit('b_boat_fishing_small', -3, -11, 1.6, 6));
    for (let k = 0; k < 7; k++) group.add(kitFit(k % 2 ? 'b_buoy' : 'b_buoy_flag', 6 + R() * 14 - 7 + (k - 3) * 2, -3 - R() * 12, R() * 6, 1.4));
    scatter(8, 7, 20, (x, z) => N(pk(['lily_large', 'lily_small']), x, z, 5 + R() * 2));
    for (const [ix, iz] of [[-16, -6], [14, -12], [-3, -22], [22, -2]]) { const isl = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.6, 0.5, 20), new THREE.MeshStandardMaterial({ color: '#e8d79c', roughness: 1 })); isl.position.set(ix, 0.05, iz); isl.receiveShadow = true; group.add(isl); N('tree_palmTall', ix + 0.5, iz, 6 + R()); N('tree_palm', ix - 1.5, iz + 1, 5.5); N('rock_largeA', ix + 2, iz - 1, 3); }
  } else if (key === 'gp') {
    const rd = new THREE.Mesh(new THREE.CircleGeometry(30, 48), new THREE.MeshStandardMaterial({ color: '#4d5160', roughness: 0.9 })); rd.rotation.x = -Math.PI / 2; rd.position.y = 0.01; rd.receiveShadow = true; group.add(rd);
    const ln = new THREE.Mesh(new THREE.RingGeometry(14.8, 15, 64), new THREE.MeshBasicMaterial({ color: '#ffffff' })); ln.rotation.x = -Math.PI / 2; ln.position.y = 0.02; group.add(ln);
    group.add(kitFit('gp_grandStand', 0, -30, 0, 22), kitFit('gp_grandStandCovered', -32, -14, 0.6, 14), kitFit('gp_pitsGarage', 30, -12, -1.2, 12), kitFit('gp_billboard', -17, -8, 0.3, 8), kitFit('gp_bannerTowerRed', 13, -12, 0, 4), kitFit('gp_bannerTowerGreen', -13, -12, 0, 4));
    group.add(kitFit('gp_raceCarRed', 9, -2.5, 0.8, 4.2), kitFit('gp_raceCarWhite', -7.5, -3.5, -0.5, 4.2), kitFit('gp_flagCheckers', 5.5, -9, 0, 3), kitFit('gp_lightPostLarge', -9, -7, 0, 2), kitFit('gp_lightPostModern', 11, -7, 0, 2));
    for (let k = 0; k < 9; k++) { const a = Math.PI + 0.35 + k * 0.28; group.add(kitFit(k % 2 ? 'gp_barrierRed' : 'gp_barrierWhite', Math.cos(a) * 12 - 0.5, Math.sin(a) * 12 - 3, -a + Math.PI / 2, 5)); }
    scatter(12, 26, 44, (x, z) => N(pk(['tree_oak', 'tree_default']), x, z, 7 + R() * 3));
  }
  for (const nm of Object.keys(nat)) group.add(mergeNature(models[nm], nat[nm], biome));
  if (props.length) group.add(propsMesh(props));
  return { group, B, key };
}

export function setGarageTheme(map) {
  if (!garageScene || !S.garageLights) return;
  const key = gtKey(map); if (key === S.garageThemeKey) return;
  S.garageThemeKey = key;
  if (S.garageThemeGroup) { garageScene.remove(S.garageThemeGroup); S.garageThemeGroup = null; }
  const th = buildGarageTheme(key); S.garageThemeGroup = th.group; garageScene.add(th.group);
  const L = S.garageLights;
  garageScene.background = null; garageScene.fog = new THREE.Fog('#14111c', 16, 46);
  L.hemi.color.set('#ffffff'); L.hemi.groundColor.set('#5a5f6b'); L.hemi.intensity = 1.9;
  if (S.garagePlinth) { S.garagePlinth.side.color.set('#2a2f3b'); S.garagePlinth.top.color.set('#3c4352'); S.garagePlinth.band.color.set('#4a5266'); S.garagePlinth.edge.color.set('#14111c'); S.garagePlinth.rim.color.set('#5c657c'); S.garagePlinth.paint('#566078'); }
  L.key.color.set('#fff2dc'); L.key.intensity = 2300; L.fill.intensity = 0.5; L.rimC.intensity = 0; L.rimO.intensity = 0;
}

