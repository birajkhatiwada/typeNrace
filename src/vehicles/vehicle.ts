// @ts-nocheck
import * as THREE from 'three';
import { models } from '../render/scenes';

export function makeVehicle(ride) {
  const src = models[ride.id].scene.clone(true);
  src.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const wheels = [];
  src.traverse((o) => { if (/wheel/.test(o.name)) wheels.push(o); });
  const g = new THREE.Group(); g.add(src);
  return { group: g, model: src, wheels };
}

