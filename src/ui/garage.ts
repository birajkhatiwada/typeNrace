// @ts-nocheck
import * as THREE from 'three';
import { S } from '../core/state';
import { RIDES } from '../config/rides';
import { botRideList, rollBotVotes, tally, voters } from '../rooms/voting';
import { $, esc } from '../utils/helpers';
import { me, rivals } from '../core/player';
import { syncMine, enterOnline, onlineEnabled, leaveOnline } from '../net/online';
import { MAPS, WEATHERS } from '../config/maps';
import { DIFFS, DEFAULT_DIFF } from '../config/words';
import { buildTrack, pointAt } from '../world/tracks/track';
import { buildRaceWorld } from '../world/raceWorld';
import { loadBest } from '../storage/best';
import { garageModels, garageScene, raceScene, raceCamera } from '../render/scenes';
import { renderer } from '../render/renderer';
import { makeVehicle } from '../vehicles/vehicle';
import { el, showScreen } from './hud';
import { layout } from '../render/layout';
import { mkCode, openRoom } from '../rooms/room';

export const thumbURL = {};

export const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

const TABS = [['All', null], ['Sports', ['Sports', 'Racer', 'Sedan', 'Kart']], ['Trucks', ['Truck', 'SUV', 'Van']], ['Bikes', ['Bike']], ['Boats', ['Boat']], ['Air', ['Plane']]];
const WXI = { clear: ['\u2600\uFE0F', '#ffe27a', '#f4a62a'], rain: ['\uD83C\uDF27\uFE0F', '#7db8f2', '#2f5fae'], snow: ['\u2744\uFE0F', '#e6f4ff', '#8fb6d9'], sand: ['\uD83C\uDF2A\uFE0F', '#efc27a', '#b87a33'], fog: ['\uD83C\uDF2B\uFE0F', '#d3d9e2', '#808b9c'], rand: ['\uD83C\uDFB2', '#b98bff', '#5b3fd0'] };
const mapPrev = {};
let hoverMap = null, hoverWx = null;

const chipsHtml = (list) => (list.length ? '<div class="vcs">' + list.slice(0, 4).map((v) => '<i class="vc" style="background:' + v.color + '">' + v.av + '</i>').join('') + '</div>' : '');
const isOnline = () => !!(S.room && S.room.online);

function renderTabs() {
  const t = $('rideTabs2'); if (!t || t.children.length) return;
  S.gTab = S.gTab || 0;
  t.innerHTML = TABS.map((x, i) => '<button type="button" data-i="' + i + '" class="' + (i === S.gTab ? 'on' : '') + '">' + x[0] + '</button>').join('');
  [...t.children].forEach((b) => b.addEventListener('click', () => { S.gTab = +b.dataset.i; [...t.children].forEach((c, i) => c.classList.toggle('on', i === S.gTab)); $('cards').scrollTop = 0; renderRideCards(); }));
}

export function renderStrip() {
  const bots = botRideList(), m = me(), step = S.gStep || 1, max = isOnline() ? 4 : 6;
  const seat = (av, name, c, ride, st, empty) => empty
    ? '<div class="pl empty"><b>?</b><div><strong>Waiting\u2026</strong><em class="ch">open seat</em></div></div>'
    : '<div class="pl" style="--p:' + c + '"><b>' + av + '</b><div><strong>' + esc(name) + '</strong><em class="' + (st === 'y' ? 'ok' : 'ch') + '">' + (st === 'y' ? '\u2713 READY' : st) + '</em></div>' + (ride ? '<img alt="" src="' + (thumbURL[ride.id] || BLANK) + '">' : '') + '</div>';
  let h = seat(m.av, 'You', m.color, S.selectedRide, S.room && S.room.ready ? 'y' : step === 1 ? 'choosing\u2026' : 'voting\u2026'), n = 1;
  rivals().forEach((r, i) => {
    const mem = S.room && S.room.members[i];
    if (mem && !mem.joined) { h += seat(0, 0, 0, 0, 0, true); return; }
    n++; h += seat(r.av, r.name, r.color, !mem || mem.picked ? bots[i] : null, mem && mem.ready ? 'y' : mem && !mem.picked ? 'choosing\u2026' : 'voting\u2026');
  });
  for (let i = 1 + rivals().length; i < max; i++) h += seat(0, 0, 0, 0, 0, true);
  $('joined').innerHTML = h; $('plab').textContent = (step === 1 ? 'IN THE ROOM' : 'VOTES') + ' \u00b7 ' + n + ' OF ' + max;
}

export function renderRideCards() {
  renderTabs();
  const bots = botRideList(), pick = {};
  bots.forEach((r, i) => { if (!S.room || S.room.members[i].picked) pick[r.id] = rivals()[i]; });
  const kinds = TABS[S.gTab || 0][1], list = RIDES.filter((r) => !kinds || kinds.includes(r.kind));
  const g = $('cards'), top = g.scrollTop;
  g.innerHTML = list.map((r) => {
    const p = pick[r.id], on = r.id === S.selectedRide.id, who = on ? me() : p;
    return '<button type="button" class="rc2' + (on ? ' sel' : '') + '" style="--h:' + r.color + '" data-id="' + r.id + '" aria-pressed="' + on + '" aria-label="' + esc(r.name) + '">' + (who ? '<div class="vcs"><i class="vc" style="background:' + who.color + '">' + who.av + '</i></div>' : '') + '<img alt="" src="' + (thumbURL[r.id] || BLANK) + '"><span>' + esc(r.name) + '</span></button>';
  }).join('');
  g.scrollTop = top;
  [...g.querySelectorAll('button')].forEach((b) => b.addEventListener('click', () => selectRide(RIDES.find((r) => r.id === b.dataset.id))));
  renderStrip();
}

function renderVotes() {
  const vs = voters();
  const fill = (id, kind) => [...$(id).children].forEach((b, i) => {
    const mine = vs.filter((v) => v[kind] === i);
    b.classList.toggle('sel', S.myVote[kind] === i); b.setAttribute('aria-pressed', S.myVote[kind] === i ? 'true' : 'false');
    [...b.querySelectorAll('.vcs')].forEach((n) => n.remove());
    b.insertAdjacentHTML('beforeend', chipsHtml(mine));
  });
  fill('mapCards', 'map'); fill('dfChips', 'diff');
  const wc = $('wxChips'); [...wc.children].slice(0, WEATHERS.length).forEach((b, i) => {
    const mine = vs.filter((v) => v.wx === i);
    b.classList.toggle('sel', S.myVote.wx === i); [...b.querySelectorAll('.vcs')].forEach((n) => n.remove()); b.insertAdjacentHTML('beforeend', chipsHtml(mine));
  });
  $('setName').textContent = (S.MAP || MAPS[0]).name; $('lapN').textContent = String(S.LAPS); $('lapx').classList.toggle('off', isOnline());
}

export function applyVotes() {
  const tm = tally('map', MAPS.length), tw = tally('wx', WEATHERS.length);
  const lead = MAPS[tm.lead];
  if (!S.MAP || S.MAP.id !== lead.id) { buildTrack(lead); loadBest(); S.lapsPick = null; }
  if (S.lapsPick && !isOnline()) S.LAPS = S.lapsPick;
  S.WX = WEATHERS[tw.lead].id;
  S.DIFF = DIFFS[tally('diff', 3).lead].id;
  renderVotes(); renderRideCards(); updateSum(); syncMine();
  refreshBg();
}

function stepRide(d) {
  const list = RIDES; let i = list.indexOf(S.selectedRide); i = i < 0 ? 0 : (i + d + list.length) % list.length; selectRide(list[i]);
}

export function selectRide(ride) {
  S.selectedRide = ride; S.garagePop = 1; S.garageIdle = Math.max(S.garageIdle, 0.6);
  RIDES.forEach((r) => { if (garageModels[r.id]) garageModels[r.id].group.visible = (S.gStep || 1) === 1 && r.id === ride.id; });
  if (S.garageMirror) { garageScene.remove(S.garageMirror); S.garageMirror = null; }
  if (garageModels[ride.id]) { S.garageMirror = garageModels[ride.id].group.clone(true); S.garageMirror.visible = (S.gStep || 1) === 1; garageScene.add(S.garageMirror); }
  const wm = $('gWm'); if (wm) wm.textContent = ride.name.toUpperCase();
  renderRideCards(); syncMine();
  saveSetup();
}

export function updateSum() { /* the ride screen has no themed room any more */ }

function saveSetup() { try { localStorage.setItem('turbotype-setup', JSON.stringify({ map: MAPS[S.myVote.map].id, wx: WEATHERS[S.myVote.wx].id, diff: DIFFS[S.myVote.diff].id, ride: S.selectedRide && S.selectedRide.id })); } catch (e) { /* ignore */ } }

export function selectMap(map, force) {
  S.myVote.map = Math.max(0, MAPS.indexOf(map));
  if (force) S.botVote.forEach((b) => { b.map = S.myVote.map; });
  applyVotes(); saveSetup();
}

export function selectDiff(i) { S.myVote.diff = i; applyVotes(); saveSetup(); }

export function selectWeather(id, force) {
  S.myVote.wx = Math.max(0, WEATHERS.findIndex((w) => w.id === id));
  if (force) S.botVote.forEach((b) => { b.wx = S.myVote.wx; });
  applyVotes(); saveSetup();
}

function setLaps(n) { if (isOnline()) return; S.lapsPick = Math.max(1, Math.min(9, n)); S.LAPS = S.lapsPick; $('lapN').textContent = String(S.LAPS); }

// ---- background: a snapshot of the hovered / chosen track, with weather on top ----

const NOMOTION = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
let clipId = '', warmed = false;
function playClip(id) {
  const v = $('bgPrevVid'); if (NOMOTION || clipId === id) return;
  clipId = id; v.classList.remove('pl');
  v.onplaying = () => { if (clipId === id) v.classList.add('pl'); };
  v.innerHTML = '<source src="clips/' + id + '.mp4" type="video/mp4"><source src="clips/' + id + '.webm" type="video/webm">'; v.load();
  const pr = v.play(); if (pr && pr.catch) pr.catch(() => { /* no autoplay / missing clip: keep the still */ });
  if (!warmed) { warmed = true; const cur = MAPS[S.myVote.map]; if (cur && cur.id !== id) setTimeout(() => { try { fetch('clips/' + cur.id + (document.createElement('video').canPlayType('video/mp4; codecs="avc1.42E01E"') ? '.mp4' : '.webm')).catch(() => { /* ignore */ }); } catch (e) { /* ignore */ } }, 800); }
}

function refreshBg() {
  const bg = $('bgPrev'), step = S.gStep || 1;
  if (step === 1) { bg.classList.remove('on'); $('wxFx').className = 'wxfx'; if (clipId) { $('bgPrevVid').pause(); $('bgPrevVid').classList.remove('pl'); clipId = ''; } return; }
  const id = (step === 2 && hoverMap) || MAPS[S.myVote.map].id;
  const url = mapPrev[id];
  if (url) { const im = $('bgPrevImg'); if (im.dataset.id !== id) { im.src = url; im.dataset.id = id; } }
  bg.classList.toggle('on', !!url);
  playClip(id);
  const wx = step === 3 ? (hoverWx || WEATHERS[S.myVote.wx].id) : 'clear';
  $('wxFx').className = 'wxfx ' + (wx === 'clear' ? '' : wx);
}

function genPreview(map) {
  const keep = { map: S.MAP, wx: S.WX };
  S.WX = 'clear'; buildTrack(map); buildRaceWorld();
  const mk = (ride, dist, lane) => {
    const v = makeVehicle(ride); raceScene.add(v.group);
    const p = pointAt(dist), nx = -p.tz, nz = p.tx;
    v.group.position.set(p.x + nx * lane, p.y, p.z + nz * lane); v.group.rotation.set(0, Math.atan2(p.tx, p.tz), 0, 'YXZ');
    v.model.position.y = ride.kind === 'Plane' ? 0.45 : ride.kind === 'Boat' ? -0.85 : (map.style === 'river' ? -0.5 : 0);
    return v;
  };
  const others = RIDES.filter((r) => r.id !== S.selectedRide.id && (map.style === 'river' ? r.kind === 'Boat' : r.kind !== 'Boat' && r.kind !== 'Plane'));
  const ride = map.style === 'river' && S.selectedRide.kind !== 'Boat' ? RIDES.find((r) => r.kind === 'Boat') : S.selectedRide;
  const vs = [mk(ride, 0, 1.8), mk(others[0], -3.5, -1.8), mk(others[3] || others[1], -7, 1.8), mk(others[5] || others[2], -10.5, -1.8)];
  const p = pointAt(-0.5), cx = p.x - p.tx * 7.2, cz = p.z - p.tz * 7.2;
  raceCamera.position.set(cx, p.y + 2.9, cz); raceCamera.up.set(0, 1, 0); raceCamera.lookAt(p.x + p.tx * 7, p.y - 0.4, p.z + p.tz * 7);
  raceCamera.fov = 60; raceCamera.aspect = S.viewport.w / S.viewport.h; raceCamera.updateProjectionMatrix();
  S.sunTarget.position.set(p.x, p.y, p.z); S.sun.position.set(p.x - 30, 50, p.z + 20);
  renderer.setViewport(0, 0, S.viewport.w, S.viewport.h);
  renderer.render(raceScene, raceCamera);
  const gl = $('gl'), W = 1280, H = 748, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const k = Math.max(W / gl.width, H / gl.height), sw = W / k, sh = H / k;
  cv.getContext('2d').drawImage(gl, (gl.width - sw) / 2, (gl.height - sh) / 2, sw, sh, 0, 0, W, H);
  vs.forEach((v) => raceScene.remove(v.group));
  buildTrack(keep.map); S.WX = keep.wx;
  return cv.toDataURL('image/jpeg', 0.82);
}

/** dev/build tool: render a short chase-cam clip of a track as jpeg frames (used to bake public/clips/*.mp4) */
export function recClip(id, frames, fps, speed) {
  const map = MAPS.find((x) => x.id === id); const keep = { map: S.MAP, wx: S.WX };
  S.WX = 'clear'; buildTrack(map); buildRaceWorld();
  const cars = []; // empty scenes: no vehicles in the background clips
  const W = 1280, H = 748, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const cx2 = cv.getContext('2d'), gl = $('gl'), out = [];
  raceCamera.fov = 60; raceCamera.aspect = S.viewport.w / S.viewport.h; raceCamera.updateProjectionMatrix(); raceCamera.up.set(0, 1, 0);
  renderer.setViewport(0, 0, S.viewport.w, S.viewport.h);
  for (let f = 0; f < frames; f++) {
    const d = (f / fps) * speed;
    for (const c of cars) {
      const dist = d + c.off, p = pointAt(dist), nx = -p.tz, nz = p.tx, wob = Math.sin(f / fps * 1.3 + c.off) * 0.5;
      c.v.group.position.set(p.x + nx * (c.lane + wob), p.y, p.z + nz * (c.lane + wob)); c.v.group.rotation.set(0, Math.atan2(p.tx, p.tz), 0, 'YXZ');
    }
    const p = { ...pointAt(d - 1) }, q = pointAt(d + 8);
    raceCamera.position.set(p.x - p.tx * 8.5, p.y + 3.1, p.z - p.tz * 8.5); raceCamera.lookAt(q.x, q.y - 0.4, q.z);
    S.sunTarget.position.set(p.x, p.y, p.z); S.sun.position.set(p.x - 30, 50, p.z + 20);
    renderer.render(raceScene, raceCamera);
    const k = Math.max(W / gl.width, H / gl.height), sw = W / k, sh = H / k;
    cx2.drawImage(gl, (gl.width - sw) / 2, (gl.height - sh) / 2, sw, sh, 0, 0, W, H);
    out.push(cv.toDataURL('image/jpeg', 0.9));
  }
  cars.forEach((c) => raceScene.remove(c.v.group));
  buildTrack(keep.map); S.WX = keep.wx;
  return out;
}

let prevTimer = 0;
export function genPreviews() {
  if (prevTimer || MAPS.every((m) => mapPrev[m.id])) return;
  const run = () => {
    prevTimer = 0;
    if (S.state !== 'profile' && S.state !== 'garage') { prevTimer = setTimeout(run, 1500); return; }
    const m = MAPS.find((x) => !mapPrev[x.id]); if (!m) return;
    try { mapPrev[m.id] = genPreview(m); } catch (e) { console.error(e); mapPrev[m.id] = BLANK; }
    const c = [...$('mapCards').children].find((b) => b.dataset.id === m.id); if (c) c.querySelector('img').src = mapPrev[m.id];
    refreshBg(); layout();
    prevTimer = setTimeout(run, 120);
  };
  prevTimer = setTimeout(run, 400);
}

export function buildSetupUI() {
  $('mapCards').innerHTML = MAPS.map((m) => '<button type="button" class="tc" data-id="' + m.id + '" aria-label="' + esc(m.name) + '"><img alt="" src="' + (mapPrev[m.id] || BLANK) + '"><div class="lab"><strong>' + esc(m.name) + '</strong><small>' + m.laps + ' laps \u00b7 ' + esc(m.blurb || '') + '</small></div></button>').join('');
  [...$('mapCards').children].forEach((b, n) => {
    b.addEventListener('click', () => selectMap(MAPS[n]));
    b.addEventListener('mouseenter', () => { hoverMap = MAPS[n].id; refreshBg(); }); b.addEventListener('mouseleave', () => { hoverMap = null; refreshBg(); });
  });
  $('wxChips').innerHTML = WEATHERS.map((w) => '<button type="button" class="wc" data-id="' + w.id + '" aria-label="' + esc(w.name) + '" style="--g1:' + WXI[w.id][1] + ';--g2:' + WXI[w.id][2] + '"><i>' + WXI[w.id][0] + '</i></button>').join('') + '<button type="button" class="wc" data-id="rand" aria-label="Random weather" style="--g1:' + WXI.rand[1] + ';--g2:' + WXI.rand[2] + '"><i>' + WXI.rand[0] + '</i></button>';
  [...$('wxChips').children].forEach((b, i) => {
    b.addEventListener('click', () => selectWeather(b.dataset.id === 'rand' ? WEATHERS[Math.floor(Math.random() * WEATHERS.length)].id : b.dataset.id));
    b.addEventListener('mouseenter', () => { hoverWx = b.dataset.id === 'rand' ? null : b.dataset.id; refreshBg(); }); b.addEventListener('mouseleave', () => { hoverWx = null; refreshBg(); });
  });
  $('dfChips').innerHTML = DIFFS.map((d) => '<button type="button" class="dft" data-id="' + d.id + '">' + d.name + '</button>').join('');
  [...$('dfChips').children].forEach((b, i) => b.addEventListener('click', () => selectDiff(i)));
  $('lapMinus').addEventListener('click', () => setLaps(S.LAPS - 1)); $('lapPlus').addEventListener('click', () => setLaps(S.LAPS + 1));
  rollBotVotes();
  let saved = null; try { saved = JSON.parse(localStorage.getItem('turbotype-setup')); } catch (e) { saved = null; }
  const m = (saved && MAPS.find((x) => x.id === saved.map)) || MAPS[0];
  S.myVote.map = MAPS.indexOf(m);
  S.myVote.wx = saved && WEATHERS.some((w) => w.id === saved.wx) ? WEATHERS.findIndex((w) => w.id === saved.wx) : Math.max(0, WEATHERS.findIndex((w) => w.id === m.weather));
  { const di = saved ? DIFFS.findIndex((d) => d.id === saved.diff) : -1; S.myVote.diff = di >= 0 ? di : DEFAULT_DIFF; }
  buildTrack(MAPS[tally('map', MAPS.length).lead]); loadBest();
  applyVotes();
}

export function buildGarageUI() {
  window.addEventListener('keydown', (e) => { if (S.state === 'garage' && S.gStep === 1 && (e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); stepRide(e.key === 'ArrowLeft' ? -1 : 1); } });
  let lx = 0;
  const gl = $('gl');
  gl.addEventListener('pointerdown', (e) => { if (S.state !== 'garage') return; S.garageDrag = true; lx = e.clientX; try { gl.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ } });
  gl.addEventListener('pointermove', (e) => { if (!S.garageDrag) return; S.garageSpin += (e.clientX - lx) * 0.012; lx = e.clientX; });
  const end = () => { if (S.garageDrag) { S.garageDrag = false; S.garageIdle = 1.8; } };
  gl.addEventListener('pointerup', end); gl.addEventListener('pointercancel', end);
}

export function renderThumbs() {
  // draw a preview of each ride framed to fill a 4:3 cell, then show them on the cards
  const W = 400, H = 300;
  const tmp = document.createElement('canvas'); tmp.width = W; tmp.height = H;
  const r2 = new THREE.WebGLRenderer({ canvas: tmp, antialias: true, alpha: true, preserveDrawingBuffer: true });
  r2.setSize(W, H, false); r2.setClearColor(0x000000, 0); r2.toneMapping = THREE.ACESFilmicToneMapping; r2.outputColorSpace = THREE.SRGBColorSpace;
  const sc = new THREE.Scene();
  sc.add(new THREE.HemisphereLight('#ffffff', '#9aa0c8', 1.4));
  const d = new THREE.DirectionalLight('#fff3d6', 2.4); d.position.set(-6, 9, 7); sc.add(d);
  const cam = new THREE.PerspectiveCamera(24, W / H, 0.1, 200);
  const dir = new THREE.Vector3(0.95, 0.85, 1.25).normalize();
  RIDES.forEach((ride) => {
    const v = makeVehicle(ride); sc.add(v.group); v.group.updateMatrixWorld(true);
    const bx = new THREE.Box3().setFromObject(v.group), Y = new THREE.Vector3(0, 1, 0);
    const c = bx.getCenter(new THREE.Vector3()).applyAxisAngle(Y, -0.62); v.group.rotation.y = -0.62; v.group.updateMatrixWorld(true);
    const pts = []; for (const x of [bx.min.x, bx.max.x]) for (const y of [bx.min.y, bx.max.y]) for (const z of [bx.min.z, bx.max.z]) pts.push(new THREE.Vector3(x, y, z).applyAxisAngle(Y, -0.62));
    let dist = bx.getSize(new THREE.Vector3()).length() * 3;
    for (let it = 0; it < 6; it++) {
      cam.position.copy(c).addScaledVector(dir, dist); cam.lookAt(c); cam.updateMatrixWorld(true); cam.updateProjectionMatrix();
      let mx = 0, my = 0; for (const p of pts) { const q = p.clone().project(cam); mx = Math.max(mx, Math.abs(q.x)); my = Math.max(my, Math.abs(q.y)); }
      dist *= Math.max(mx, my) / 0.93;
    }
    cam.position.copy(c).addScaledVector(dir, dist); cam.lookAt(c);
    r2.render(sc, cam);
    thumbURL[ride.id] = tmp.toDataURL('image/png');
    sc.remove(v.group);
  });
  r2.dispose(); renderRideCards();
}

export function toGaragePage(code, joining) { S.state = 'garage'; showScreen('garage'); layout(); openRoom(code || mkCode(), !!joining); setStep(1); genPreviews(); }

export function toGarage() {
  for (const b of S.itemBoxes) raceScene.remove(b.mesh); S.itemBoxes = [];
  S.state = 'garage'; showScreen('garage'); el.results.hidden = true; el.count.hidden = true; el.race.querySelector('.fit').style.display = '';
  for (const r of S.racers) raceScene.remove(r.v.group);
  S.racers = []; S.player = null; S.camInit = false; S.mini = null;
  if (onlineEnabled() && S.room && S.room.online) { leaveOnline(); enterOnline('create').catch(() => { S.state = 'profile'; showScreen('profile'); }); } else openRoom(mkCode(), false);
  layout(); setStep(1); genPreviews();
}

// ---- steps: 1 ride, 2 track, 3 setup ----
const TITLES = ['Choose Your Ride!', 'Choose Your Track!', 'Setup!'];
export function setStep(n) {
  S.gStep = n; $('gPanel').dataset.s = String(n); $('gTitle').textContent = TITLES[n - 1];
  [...$('steps').children].forEach((s, i) => { s.className = i + 1 === n ? 'on' : i + 1 < n ? 'done' : ''; s.textContent = (i + 1 < n ? '\u2713 ' : i + 1 === n ? (i + 1) + ' ' : (i + 1) + ' ') + ['RIDE', 'TRACK', 'SETUP'][i]; });
  $('nextBtn').style.display = n === 3 ? 'none' : ''; $('startBtn').style.display = n === 3 ? '' : 'none';
  RIDES.forEach((r) => { if (garageModels[r.id]) garageModels[r.id].group.visible = n === 1 && r.id === S.selectedRide.id; });
  if (S.garageMirror) S.garageMirror.visible = n === 1;
  $('gWm').style.display = n === 1 ? '' : 'none';
  hoverMap = null; hoverWx = null; refreshBg(); renderStrip();
}
export function initSteps() {
  $('nextBtn').addEventListener('click', () => { if (S.gStep < 3) setStep(S.gStep + 1); });
  $('backBtn').addEventListener('click', (e) => { if (S.gStep > 1) { e.stopImmediatePropagation(); setStep(S.gStep - 1); } }, true);
  window.addEventListener('keydown', (e) => { if (S.state === 'garage' && S.gStep < 3 && e.key === 'Enter') { e.preventDefault(); setStep(S.gStep + 1); } });
  setStep(1);
}
