// @ts-nocheck
import * as THREE from 'three';
import { S } from '../core/state';
import { garageScene } from '../render/scenes';

// The ride screen is a clean showroom: a glossy floor under the car, its mirror image, and a soft contact shadow.
// The wall and floor colours come from the page behind the (transparent) canvas.
function blob(inner, outer, size) {
  const cv = document.createElement('canvas'); cv.width = cv.height = size; const c = cv.getContext('2d');
  const g = c.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2); g.addColorStop(0, inner); g.addColorStop(1, outer);
  c.fillStyle = g; c.fillRect(0, 0, size, size); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.NoColorSpace; return t;
}

export function buildGarageWorld() {
  const sc = garageScene;
  sc.background = null; sc.fog = null;
  sc.add(new THREE.HemisphereLight('#ffffff', '#8a7ed0', 1.5));
  const key = new THREE.DirectionalLight('#fff3e0', 2.2); key.position.set(-4, 8, 7); sc.add(key);
  const rim = new THREE.DirectionalLight('#c9b8ff', 0.9); rim.position.set(6, 3, -5); sc.add(rim);
  // floor veil: hides the lower half of the mirrored car, fading towards the camera
  const veil = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshBasicMaterial({ color: '#6d61b8', transparent: true, opacity: 1, alphaMap: blob('#8c8c8c', '#f2f2f2', 256), depthWrite: false }));
  veil.rotation.x = -Math.PI / 2; veil.position.y = 0.003; veil.renderOrder = 2; sc.add(veil);
  // soft contact shadow under the wheels
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(6.6, 3.4), new THREE.MeshBasicMaterial({ color: '#0a0028', transparent: true, opacity: 0.75, alphaMap: blob('#ffffff', '#000000', 128), depthWrite: false }));
  sh.rotation.x = -Math.PI / 2; sh.position.y = 0.006; sh.renderOrder = 3; sc.add(sh);
  S.garageVeil = veil; S.garageShadow = sh;
}

export function setGarageTheme() { /* the ride screen no longer changes with the chosen track */ }
