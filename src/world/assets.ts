// @ts-nocheck
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { S } from '../core/state';

const manager = new THREE.LoadingManager();

manager.setURLModifier((u) => { if (u.indexOf('colormap') >= 0) return S.texUrl; const b = u.split('/').pop(); return u; });

export function parseGlb(u8) {
  const ab = u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength);
  return new Promise((res, rej) => {
    const loader = new GLTFLoader(manager);
    const cib = window.createImageBitmap;
    try { window.createImageBitmap = undefined; loader.parse(ab, '', res, rej); } finally { window.createImageBitmap = cib; }
  });
}

