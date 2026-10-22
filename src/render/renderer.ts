// @ts-nocheck
import * as THREE from 'three';
import { $ } from '../utils/helpers';

const canvas = $('gl');

export const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

renderer.shadowMap.enabled = true;

renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.toneMapping = THREE.ACESFilmicToneMapping;

renderer.outputColorSpace = THREE.SRGBColorSpace;

