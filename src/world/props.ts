// @ts-nocheck
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export function skyTexture(cols) {
  const cv = document.createElement('canvas'); cv.width = 4; cv.height = 512;
  const cx = cv.getContext('2d'); const gr = cx.createLinearGradient(0, 0, 0, 512);
  gr.addColorStop(0, cols[0]); gr.addColorStop(0.55, cols[1]); gr.addColorStop(1, cols[2]);
  cx.fillStyle = gr; cx.fillRect(0, 0, 4, 512);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function rgb2hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0;
  if (mx !== mn) {
    const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60;
  }
  return [h, s, l];
}

function hsl2rgb(h, s, l) {
  h = ((h % 360) + 360) % 360 / 360;
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = (t) => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
  return [Math.round(f(h + 1 / 3) * 255), Math.round(f(h) * 255), Math.round(f(h - 1 / 3) * 255)];
}

const envTex = {}, envMats = new Map();

function biomeTexture(biome, orig) {
  if (envTex[biome]) return envTex[biome];
  const img = orig.image; const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
  const cx = cv.getContext('2d'); cx.drawImage(img, 0, 0);
  const data = cx.getImageData(0, 0, cv.width, cv.height); const px = data.data;
  for (let i = 0; i < px.length; i += 4) {
    const [h, s, l] = rgb2hsl(px[i], px[i + 1], px[i + 2]);
    if (h < 95 || h > 185 || s < 0.2) continue; // only the greens
    let out;
    if (biome === 'desert') out = hsl2rgb(37, 0.55, 0.52 + (l - 0.4) * 0.6);
    else if (l < 0.46) out = hsl2rgb(212, 0.3, 0.92 + (l - 0.4) * 0.1); // ground becomes snow
    else out = hsl2rgb(188, 0.28, 0.27 + (l - 0.5) * 0.45); // frosted pine
    px[i] = out[0]; px[i + 1] = out[1]; px[i + 2] = out[2];
  }
  cx.putImageData(data, 0, 0);
  const t = new THREE.CanvasTexture(cv); t.flipY = orig.flipY; t.colorSpace = orig.colorSpace; t.wrapS = orig.wrapS; t.wrapT = orig.wrapT; t.magFilter = orig.magFilter; t.minFilter = orig.minFilter; t.anisotropy = orig.anisotropy; envTex[biome] = t; return t;
}

function envMat(mat, biome) {
  if (biome === 'forest' || biome === 'city' || !mat.map) return mat;
  const key = mat.uuid + biome;
  if (!envMats.has(key)) { const m = mat.clone(); m.map = biomeTexture(biome, mat.map); envMats.set(key, m); }
  return envMats.get(key);
}

export function mergePlacements(template, placements, biome) {
  const meshes = [];
  template.updateWorldMatrix(true, true);
  template.traverse((o) => { if (o.isMesh) meshes.push(o); });
  const out = new THREE.Group();
  for (const m of meshes) {
    const geos = placements.map((p) => {
      const g = m.geometry.clone();
      const M = new THREE.Matrix4().makeRotationY(p.rot); if (p.s) M.scale(new THREE.Vector3(p.s, p.s, p.s)); M.setPosition(p.x, p.y || 0, p.z); M.multiply(m.matrixWorld);
      g.applyMatrix4(M); return g;
    });
    const merged = mergeGeometries(geos, false);
    const mesh = new THREE.Mesh(merged, envMat(m.material, biome));
    mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false;
    out.add(mesh);
  }
  return out;
}

const NAT_COL = {
  leafsGreen: { forest: '#4aa84f', desert: '#52a04c', snow: '#eef5fa' },
  leafsDark: { forest: '#2c8a5a', desert: '#3f8a50', snow: '#d4e3ee' },
  woodBark: { all: '#8a5a3a' }, woodBarkDark: { all: '#6e4630' }, woodInner: { all: '#e8d2b0' },
  grass: { forest: '#6fbf55', desert: '#d8b676', snow: '#f6fafd' },
  dirt: { forest: '#a8774f', desert: '#c4925f', snow: '#9aa7b6' },
  stone: { forest: '#a7b0bb', desert: '#c9a57c', snow: '#b8c6d6' },
  _defaultMat: { all: '#9aa3ad' }
};

const natMats = new Map();

export function natMat(orig, biome) {
  const key = orig.name + biome;
  if (!natMats.has(key)) {
    const e = NAT_COL[orig.name]; let col;
    if (e) col = e[biome] || e.all; else col = new THREE.Color().setRGB(orig.color.r, orig.color.g, orig.color.b, THREE.SRGBColorSpace);
    natMats.set(key, new THREE.MeshStandardMaterial({ color: col, roughness: 0.9, metalness: 0 }));
  }
  return natMats.get(key);
}

export function mergeNature(model, placements, biome) {
  const meshes = [];
  model.scene.updateWorldMatrix(true, true);
  model.scene.traverse((o) => { if (o.isMesh) meshes.push(o); });
  const out = new THREE.Group();
  for (const m of meshes) {
    const geos = placements.map((p) => {
      const g = m.geometry.clone();
      const M = new THREE.Matrix4().makeRotationY(p.rot); M.scale(new THREE.Vector3(p.s, p.s, p.s)); M.setPosition(p.x, 0, p.z); M.multiply(m.matrixWorld);
      g.applyMatrix4(M); return g;
    });
    const mesh = new THREE.Mesh(mergeGeometries(geos, false), natMat(m.material, biome));
    mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false; out.add(mesh);
  }
  return out;
}

export function propsMesh(list) {
  const geos = list.map((p) => {
    let g = p.geo.index ? p.geo.toNonIndexed() : p.geo.clone();
    const M = new THREE.Matrix4().compose(new THREE.Vector3(p.x, p.y, p.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(p.rx || 0, p.ry || 0, p.rz || 0)), new THREE.Vector3(p.sx || 1, p.sy || 1, p.sz || 1));
    g.applyMatrix4(M);
    const c = new THREE.Color(p.color), n = g.attributes.position.count, arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b; }
    g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
    return g;
  });
  const mesh = new THREE.Mesh(mergeGeometries(geos, false), new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 }));
  mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false;
  return mesh;
}

export const G = {
  cyl: new THREE.CylinderGeometry(1, 1, 1, 8), sph: new THREE.SphereGeometry(1, 10, 8), ico: new THREE.IcosahedronGeometry(1, 0), cone: new THREE.ConeGeometry(1, 1, 8), dune: new THREE.SphereGeometry(1, 20, 12)
};

function cactus(list, x, z, rnd) {
  const h = 3.2 + rnd() * 2.0, col = rnd() < 0.5 ? '#5b9f52' : '#4a8c47';
  list.push({ geo: G.cyl, x, y: h / 2, z, sx: 0.5, sy: h, sz: 0.5, color: col });
  list.push({ geo: G.sph, x, y: h, z, sx: 0.5, sy: 0.5, sz: 0.5, color: col });
  for (const side of [-1, 1]) {
    if (rnd() < 0.35) continue;
    const ah = 0.8 + rnd() * 0.8, y0 = h * (0.35 + rnd() * 0.25);
    list.push({ geo: G.cyl, x: x + side * 0.75, y: y0, z, sx: 0.28, sy: 1.5, sz: 0.28, rz: Math.PI / 2, color: col });
    list.push({ geo: G.cyl, x: x + side * 1.4, y: y0 + ah / 2, z, sx: 0.28, sy: ah, sz: 0.28, color: col });
    list.push({ geo: G.sph, x: x + side * 1.4, y: y0 + ah, z, sx: 0.28, sy: 0.28, sz: 0.28, color: col });
  }
}

function rock(list, x, z, rnd, col) {
  const s = 0.5 + rnd() * 1.0;
  list.push({ geo: G.ico, x, y: s * 0.35, z, sx: s * 1.3, sy: s * 0.8, sz: s, ry: rnd() * 6, color: col });
}

export function snowman(list, x, z, rnd) {
  const ry = rnd() * 6;
  list.push({ geo: G.sph, x, y: 0.7, z, sx: 0.8, sy: 0.7, sz: 0.8, color: '#ffffff' });
  list.push({ geo: G.sph, x, y: 1.7, z, sx: 0.6, sy: 0.55, sz: 0.6, color: '#ffffff' });
  list.push({ geo: G.sph, x, y: 2.5, z, sx: 0.42, sy: 0.42, sz: 0.42, color: '#ffffff' });
  list.push({ geo: G.cone, x: x + Math.sin(ry) * 0.5, y: 2.5, z: z + Math.cos(ry) * 0.5, sx: 0.1, sy: 0.5, sz: 0.1, rx: Math.PI / 2, ry, color: '#ff8a3d' });
  list.push({ geo: G.cyl, x, y: 2.9, z, sx: 0.34, sy: 0.4, sz: 0.34, color: '#3a2f6b' });
}

