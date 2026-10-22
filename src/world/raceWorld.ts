// @ts-nocheck
import * as THREE from 'three';
import { S } from '../core/state';
import { BOUNDS, cellCenter } from './tracks/track';
import { models, raceScene } from '../render/scenes';
import { applyAtmosphere, buildWeather } from './atmosphere';
import { renderer } from '../render/renderer';
import { BIOMES, TILE } from '../config/maps';
import { buildGP } from './tracks/grandprix';
import { buildC2 } from './tracks/skyway';
import { buildRiver } from './tracks/river';
import { buildCity } from './tracks/city';
import { mulberry } from '../utils/helpers';
import { G, mergeNature, mergePlacements, propsMesh, snowman } from './props';

export const clampI = (i) => Math.max(BOUNDS.minI, Math.min(BOUNDS.maxI, i));

export const clampJ = (j) => Math.max(BOUNDS.minJ, Math.min(BOUNDS.maxJ, j));

export function buildRaceWorld() {
  if (S.worldGroup) { S.worldGroup.traverse((o) => { if (o.isMesh && o.geometry) o.geometry.dispose(); }); raceScene.remove(S.worldGroup); }
  S.worldGroup = new THREE.Group(); raceScene.add(S.worldGroup);
  const biome = S.MAP.biome;
  applyAtmosphere();
  renderer.toneMapping = S.MAP.style === 'river' ? THREE.NeutralToneMapping : THREE.ACESFilmicToneMapping;
  S.hemi.intensity = S.MAP.style === 'river' ? 0.85 : S.hemi.intensity;

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), new THREE.MeshStandardMaterial({ color: BIOMES[S.MAP.style === 'space' ? 'space' : S.MAP.style === 'river' ? 'river' : biome].ground }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.06; ground.receiveShadow = true; S.worldGroup.add(ground);

  S.ROAD_Y = 0;
  if (S.MAP.kind === 'gp') { buildGP(S.worldGroup); buildWeather(); S.builtKey = S.MAP.id + '|' + S.WX; return; }
  if (S.MAP.kind === 'c2') { buildC2(S.worldGroup); buildWeather(); S.builtKey = S.MAP.id + '|' + S.WX; return; }
  if (S.MAP.style === 'river') { buildRiver(S.worldGroup); buildWeather(); S.builtKey = S.MAP.id + '|' + S.WX; return; }
  if (biome === 'city') {
    const occ0 = new Set(S.CELLS.map((c) => c.i + ',' + c.j));
    buildCity(S.worldGroup, occ0, mulberry(33)); buildWeather(); S.builtKey = S.MAP.id + '|' + S.WX; return;
  }
  const straight = [], finish = [], corner = [[], [], [], []], forest = [], empty = [], tents = [], props = [], natBuckets = {};
  const occ = new Set();
  S.CELLS.forEach((c, idx) => {
    occ.add(c.i + ',' + c.j);
    const [x, z] = cellCenter(c);
    if (c.corner) corner[c.k].push({ x, z, rot: c.k * Math.PI / 2 });
    else if (idx === 0) finish.push({ x, z, rot: c.d[0] !== 0 ? Math.PI / 2 : 0 });
    else straight.push({ x, z, rot: c.d[0] !== 0 ? Math.PI / 2 : 0 });
  });
  const rnd = mulberry(7), prnd = mulberry(21);
  const cx0 = (BOUNDS.minI + BOUNDS.maxI) / 2, cz0 = (BOUNDS.minJ + BOUNDS.maxJ) / 2;
  for (let i = BOUNDS.minI - 4; i <= BOUNDS.maxI + 4; i++) for (let j = BOUNDS.minJ - 4; j <= BOUNDS.maxJ + 4; j++) {
    if (occ.has(i + ',' + j)) continue;
    const x = (i - cx0) * TILE, z = (j - cz0) * TILE;
    const r = rnd(); const rot = Math.floor(rnd() * 4) * Math.PI / 2;
    const nearRoad = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]].some(([a, b]) => occ.has((i + a) + ',' + (j + b)));
    const scatter = (n) => { for (let q = 0; q < n; q++) { const px = x + (prnd() - 0.5) * 7, pz = z + (prnd() - 0.5) * 7; scatterProp(px, pz); } };
    const nat = (name, px, pz, s0, s1) => { (natBuckets[name] = natBuckets[name] || []).push({ x: px, z: pz, rot: prnd() * 6.28, s: s0 + prnd() * (s1 - s0) }); };
    const scatterProp = (px, pz) => {
      const q = prnd();
      if (biome === 'desert') {
        if (q < 0.22) nat('cactus_tall', px, pz, 4.5, 7); else if (q < 0.38) nat('cactus_short', px, pz, 4.5, 7);
        else if (q < 0.52) nat(['tree_palmTall', 'tree_palm'][Math.floor(prnd() * 2)], px, pz, 4.5, 6.5);
        else if (q < 0.7) nat(['rock_largeA', 'rock_largeC', 'stone_largeA'][Math.floor(prnd() * 3)], px, pz, 3.5, 6);
        else if (q < 0.82) nat(['rock_tallA', 'rock_tallC', 'stone_tallB'][Math.floor(prnd() * 3)], px, pz, 4, 6.5);
        else nat('stone_smallA', px, pz, 4, 7);
      } else if (biome === 'snow') {
        if (q < 0.4) nat(['tree_pineTallA', 'tree_pineTallC_detailed', 'tree_pineDefaultA', 'tree_pineRoundC'][Math.floor(prnd() * 4)], px, pz, 5, 8);
        else if (q < 0.55) nat(['stone_largeA', 'rock_largeA'][Math.floor(prnd() * 2)], px, pz, 3.5, 6);
        else if (q < 0.65) nat('plant_bushLarge', px, pz, 4, 6);
        else if (q < 0.82) { const s = 0.9 + prnd() * 1.3; props.push({ geo: G.sph, x: px, y: 0, z: pz, sx: s * 1.6, sy: s * 0.7, sz: s * 1.4, color: '#f7fbff' }); }
        else snowman(props, px, pz, prnd);
      } else {
        if (q < 0.2) nat(['tree_oak', 'tree_default'][Math.floor(prnd() * 2)], px, pz, 4.5, 6.5);
        else if (q < 0.4) nat(['plant_bush', 'plant_bushLarge'][Math.floor(prnd() * 2)], px, pz, 4, 6);
        else if (q < 0.55) nat(['flower_redA', 'flower_yellowA', 'flower_purpleA'][Math.floor(prnd() * 3)], px, pz, 5, 7);
        else if (q < 0.7) nat(['rock_largeA', 'rock_largeC', 'stone_largeA'][Math.floor(prnd() * 3)], px, pz, 3, 5);
        else if (q < 0.8) nat(['stump_old', 'log_large'][Math.floor(prnd() * 2)], px, pz, 4, 6);
        else nat('tree_pineSmallA', px, pz, 5, 7);
      }
    };
    if (biome === 'forest') {
      if (nearRoad) { if (r < 0.3) forest.push({ x, z, rot }); else { empty.push({ x, z, rot }); scatter(2); } } else if (r < 0.55) forest.push({ x, z, rot }); else { empty.push({ x, z, rot }); scatter(3); }
    } else if (biome === 'desert') {
      if (nearRoad) { if (r < 0.55) scatter(1 + Math.floor(prnd() * 2)); } else if (r < 0.75) scatter(2 + Math.floor(prnd() * 2)); else if (r < 0.9) props.push({ geo: G.dune, x, y: -0.9, z, sx: 6, sy: 1.5, sz: 6, color: '#dfbf80' });
    } else {
      if (nearRoad) { if (r < 0.35) forest.push({ x, z, rot }); else { empty.push({ x, z, rot }); if (r < 0.6) scatter(1); } }
      else if (r < 0.4) forest.push({ x, z, rot }); else { empty.push({ x, z, rot }); if (r < 0.85) scatter(2); }
    }
  }
  const add = (tpl, pl) => { if (pl.length) S.worldGroup.add(mergePlacements(tpl.scene, pl, biome)); };
  add(models.straight, straight); add(models.finish, finish);
  for (let k = 0; k < 4; k++) add(models.corner, corner[k]);
  add(models.forest, forest); add(models.empty, empty);
  if (props.length) S.worldGroup.add(propsMesh(props));
  for (const nm of Object.keys(natBuckets)) S.worldGroup.add(mergeNature(models[nm], natBuckets[nm], biome));
  buildWeather();
  S.builtKey = S.MAP.id + '|' + S.WX;
}

