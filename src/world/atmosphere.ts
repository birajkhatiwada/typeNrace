// @ts-nocheck
import * as THREE from 'three';
import { S } from '../core/state';
import { raceScene } from '../render/scenes';
import { BIOMES, WEATHER_FX } from '../config/maps';
import { skyTexture } from './props';
import { mulberry } from '../utils/helpers';

export function initLights() {
  S.hemi = new THREE.HemisphereLight('#ffffff', '#7a9a5a', 1.1); raceScene.add(S.hemi);
  S.sun = new THREE.DirectionalLight('#fff3d6', 2.4);
  S.sun.castShadow = true; S.sun.shadow.mapSize.set(2048, 2048); S.sun.shadow.bias = -0.0005;
  const sc = S.sun.shadow.camera; sc.left = -45; sc.right = 45; sc.top = 45; sc.bottom = -45; sc.near = 1; sc.far = 160;
  S.sunTarget = new THREE.Object3D(); raceScene.add(S.sun); raceScene.add(S.sunTarget); S.sun.target = S.sunTarget;
}

export function applyAtmosphere() {
  const B = BIOMES[S.MAP.style === 'space' ? 'space' : S.MAP.style === 'river' ? 'river' : S.MAP.biome], W = WEATHER_FX[S.WX];
  const sky = W ? W.sky : B.sky;
  if (raceScene.background && raceScene.background.dispose) raceScene.background.dispose();
  raceScene.background = skyTexture(sky);
  raceScene.fog = new THREE.Fog(W ? W.fog : B.fog, W ? W.n : B.n, W ? W.f : B.f);
  S.hemi.color.set('#ffffff'); S.hemi.groundColor.set(B.hemiG); S.hemi.intensity = W ? W.hemi : 1.1;
  S.sun.intensity = (W ? W.sun : 1) * 2.4;
}

export function buildWeather() {
  if (S.weatherFx) {
    raceScene.remove(S.weatherFx.obj); S.weatherFx.obj.geometry.dispose(); S.weatherFx.obj.material.dispose(); S.weatherFx = null;
  }
  if (S.WX === 'clear' || S.WX === 'fog') return;
  const rnd = mulberry(99);
  const cfg = { rain: { n: 1100, box: [46, 26, 46] }, snow: { n: 1100, box: [46, 26, 46] }, sand: { n: 2800, box: [46, 18, 46] } }[S.WX];
  const off = new Float32Array(cfg.n * 3);
  for (let i = 0; i < cfg.n; i++) { off[i * 3] = rnd() * cfg.box[0]; off[i * 3 + 1] = rnd() * cfg.box[1]; off[i * 3 + 2] = rnd() * cfg.box[2]; }
  let obj;
  if (S.WX === 'rain') {
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(cfg.n * 6), 3));
    obj = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: '#d6e2ee', transparent: true, opacity: 0.5, depthWrite: false }));
  } else {
    const cv = document.createElement('canvas'); cv.width = cv.height = 32; const cx = cv.getContext('2d');
    const gr = cx.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.8)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    cx.fillStyle = gr; cx.fillRect(0, 0, 32, 32);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(cfg.n * 3), 3));
    obj = new THREE.Points(g, new THREE.PointsMaterial({ map: new THREE.CanvasTexture(cv), color: S.WX === 'snow' ? '#ffffff' : '#e3c690', size: S.WX === 'snow' ? 0.3 : 0.2, transparent: true, opacity: S.WX === 'snow' ? 0.95 : 0.75, depthWrite: false }));
  }
  obj.frustumCulled = false; raceScene.add(obj);
  S.weatherFx = { obj, off, box: cfg.box, n: cfg.n };
}

const wrap = (v, s) => ((v % s) + s) % s;

export function updateWeather(dt, t, cam) {
  if (!S.weatherFx) return;
  const { off, box, n, obj } = S.weatherFx; const pos = obj.geometry.attributes.position.array;
  const fall = S.WX === 'rain' ? 34 : S.WX === 'snow' ? 2.4 : 0.4, wx = S.WX === 'rain' ? 3 : S.WX === 'snow' ? 0.8 : 15, wz = S.WX === 'sand' ? 2 : 0;
  for (let i = 0; i < n; i++) {
    const k = i * 3;
    off[k] += (wx + (S.WX === 'snow' ? Math.sin(t * 0.9 + i) * 0.6 : 0)) * dt; off[k + 1] -= fall * dt; off[k + 2] += (wz + (S.WX === 'snow' ? Math.cos(t * 0.7 + i * 1.7) * 0.6 : 0)) * dt;
    const x = cam.x + wrap(off[k] - cam.x, box[0]) - box[0] / 2;
    const y = cam.y + wrap(off[k + 1] - cam.y, box[1]) - box[1] / 2 + (S.WX === 'sand' ? 3 : 6);
    const z = cam.z + wrap(off[k + 2] - cam.z, box[2]) - box[2] / 2;
    if (S.WX === 'rain') { const j = i * 6; pos[j] = x; pos[j + 1] = y; pos[j + 2] = z; pos[j + 3] = x - 0.08; pos[j + 4] = y + 0.95; pos[j + 5] = z; }
    else { pos[k] = x; pos[k + 1] = y; pos[k + 2] = z; }
  }
  obj.geometry.attributes.position.needsUpdate = true;
}

