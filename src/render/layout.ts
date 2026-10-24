// @ts-nocheck
import * as THREE from 'three';
import { S } from '../core/state';
import { $ } from '../utils/helpers';
import { el } from '../ui/hud';
import { renderer } from './renderer';
import { garageCamera, raceCamera } from './scenes';
import { renderText } from '../typing/engine';

function measureChar() {
  const probe = $('probe'); const r = probe.getBoundingClientRect();
  S.charW = (probe.offsetWidth / 10) || 14.4;
  const tw = el.text.clientWidth || 800;
  S.rowChars = Math.max(18, Math.floor(tw / S.charW) - 1);
}

export const veilScene = new THREE.Scene(), veilCam = new THREE.OrthographicCamera(0, 1, 0, -1, -1, 1);

const VEILS = [[[446, -1000], [919, -1000], [581, 1840], [-11, 1840]], 0.5, [[909, -1000], [3436, -1000], [3436, 1840], [571, 1840]], 0.62];

function buildVeil(w, h, u) {
  S.veilMeshes.forEach((m) => { veilScene.remove(m); m.geometry.dispose(); }); S.veilMeshes = [];
  for (let i = 0; i < VEILS.length; i += 2) {
    const sh = new THREE.Shape(VEILS[i].map(([x, y]) => new THREE.Vector2(w / 2 + (x - 718) * u, -(h / 2 + (y - 420) * u))));
    const m = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: VEILS[i + 1], depthTest: false, depthWrite: false, toneMapped: false, side: THREE.DoubleSide }));
    veilScene.add(m); S.veilMeshes.push(m);
  }
  veilCam.left = 0; veilCam.right = w; veilCam.top = 0; veilCam.bottom = -h; veilCam.updateProjectionMatrix();
}

export function layout() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  const u = Math.min(w / 1436, h / 840);
  $('app').style.setProperty('--u', String(u));
  $('app').style.setProperty('--ex', Math.max(0, (w / u - 1436) / 2) + 'px');
  S.viewport = { x: 0, y: 0, w, h };
  /* the dark side veils are gone: the new screens have their own backdrop */
  raceCamera.aspect = w / h; raceCamera.updateProjectionMatrix();
  garageCamera.aspect = w / h;
  // put the garage car at the left of the 1436x840 stage, whatever the window size
  garageCamera.setViewOffset(w, h, Math.round(w / 2 - (w / 2 + (GCAR.x - 718) * u)), Math.round(h / 2 - (h / 2 + (GCAR.y - 420) * u)), w, h);
  // keep the car the same size relative to the 1436x840 stage, even in tall or narrow windows
  garageCamera.fov = 2 * Math.atan(Math.tan(GCAR.fov * Math.PI / 360) * h / (840 * u)) * 180 / Math.PI;
  garageCamera.updateProjectionMatrix();
  if (S.cur) { measureChar(); renderText(); }
}

const GCAR = { x: 1075, y: 470, fov: 31 };

