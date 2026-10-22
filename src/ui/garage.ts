// @ts-nocheck
import * as THREE from 'three';
import { S } from '../core/state';
import { RIDES, RIVALS } from '../config/rides';
import { botRideList, rollBotVotes, tally, voters } from '../rooms/voting';
import { $, esc, fmtTime } from '../utils/helpers';
import { me, rivals } from '../core/player';
import { syncMine, enterOnline, onlineEnabled, leaveOnline } from '../net/online';
import { MAPS, WEATHERS, WX_UI } from '../config/maps';
import { DIFFS, DEFAULT_DIFF } from '../config/words';
import { buildTrack } from '../world/tracks/track';
import { loadBest } from '../storage/best';
import { garageModels, raceScene } from '../render/scenes';
import { setGarageTheme } from '../world/garage';
import { makeVehicle } from '../vehicles/vehicle';
import { el, showScreen } from './hud';
import { layout } from '../render/layout';
import { mkCode, openRoom } from '../rooms/room';

export const thumbURL = {};

export const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

const visRides = () => RIDES;

const chipsHtml = (list) => (list.length ? '<div class="vcs">' + list.map((v) => '<u class="vc" style="background:' + v.color + '">' + v.av + '</u>').join('') + '</div>' : '');

export function renderRideCards() {
  const bots = botRideList(), pick = {};
  bots.forEach((r, i) => { if (!S.room || S.room.members[i].picked) pick[r.id] = rivals()[i]; });
  let h = '';
  RIDES.forEach((r) => {
    const p = pick[r.id], on = r.id === S.selectedRide.id;
    const tag = on ? '<b>P1</b>' : p ? '<b style="background:' + p.color + ';color:#fff">' + p.av + ' ' + esc(p.name) + '</b>' : '';
    const st = p && !on ? ' style="outline:2px solid ' + p.color + ';outline-offset:-2px;background:linear-gradient(160deg,' + p.color + '88,' + p.color + '22)"' : '';
    h += '<button type="button" class="cell' + (on ? ' sel' : '') + '" data-id="' + r.id + '" aria-pressed="' + on + '" aria-label="' + esc(r.name) + '"' + st + '><img alt="" src="' + (thumbURL[r.id] || BLANK) + '">' + tag + '</button>';
  });
  for (let i = RIDES.length; i % 5; i++) h += '<div class="cell empty"></div>';
  const g = $('cards'); g.innerHTML = h;
  [...g.querySelectorAll('button')].forEach((b) => b.addEventListener('click', () => selectRide(RIDES.find((r) => r.id === b.dataset.id))));
  const m = me();
  const alt = (av, name, c, ride, p1, st, pend) => '<div class="alt' + (pend ? ' pend' : '') + '" style="background:linear-gradient(135deg,' + c + ',' + c + '88)"><i>' + av + '</i><img alt="" src="' + (pend ? BLANK : (thumbURL[ride.id] || BLANK)) + '"><span>' + esc(name) + '</span>' + (p1 ? '<b>P1</b>' : '') + (st ? '<em class="bd ' + st + '">' + (st === 'y' ? '&#10003;' : '&hellip;') + '</em>' : '') + '</div>';
  const slot = '<div class="alt slot">WAITING<br>FOR PLAYER</div>';
  let jh = alt(m.av, m.name, m.color, S.selectedRide, true, S.room ? (S.room.ready ? 'y' : 'n') : '', false);
  rivals().forEach((r, i) => { const mem = S.room && S.room.members[i]; if (mem && !mem.joined) { jh += slot; return; } jh += alt(r.av, r.name, r.color, bots[i], false, mem ? (mem.ready ? 'y' : 'n') : '', !!mem && !mem.picked); });
  if (S.room && !S.room.online) jh += slot + slot;
  $('joined').innerHTML = jh;
}

function renderVotes() {
  const vs = voters(), tm = tally('map', MAPS.length), tw = tally('wx', WEATHERS.length);
  [...$('mapCards').children].forEach((b, i) => {
    const mine = vs.filter((v) => v.map === i);
    b.classList.toggle('sel', S.myVote.map === i); b.setAttribute('aria-pressed', S.myVote.map === i ? 'true' : 'false');
    [...b.querySelectorAll('.vcs,.lead')].forEach((n) => n.remove());
    b.insertAdjacentHTML('beforeend', chipsHtml(mine) + (tm.lead === i ? '<em class="lead">' + tm.counts[i] + '</em>' : ''));
  });
  const td = tally('diff', 3);
  [...$('dfChips').children].forEach((b, i) => {
    const mine = vs.filter((v) => v.diff === i);
    b.classList.toggle('sel', S.myVote.diff === i); b.setAttribute('aria-pressed', S.myVote.diff === i ? 'true' : 'false');
    [...b.querySelectorAll('.vcs,.lead')].forEach((n) => n.remove());
    b.insertAdjacentHTML('beforeend', chipsHtml(mine) + (td.lead === i ? '<em class="lead">' + td.counts[i] + '</em>' : ''));
  });
  [...$('wxChips').children].forEach((b, i) => {
    const mine = vs.filter((v) => v.wx === i);
    b.classList.toggle('sel', S.myVote.wx === i); b.setAttribute('aria-pressed', S.myVote.wx === i ? 'true' : 'false');
    [...b.querySelectorAll('.vcs,.lead')].forEach((n) => n.remove());
    b.insertAdjacentHTML('beforeend', chipsHtml(mine) + (tw.lead === i ? '<em class="lead">' + tw.counts[i] + '</em>' : ''));
  });
}

export function applyVotes() {
  const tm = tally('map', MAPS.length), tw = tally('wx', WEATHERS.length);
  const lead = MAPS[tm.lead];
  if (!S.MAP || S.MAP.id !== lead.id) { buildTrack(lead); loadBest(); }
  S.WX = WEATHERS[tw.lead].id;
  S.DIFF = DIFFS[tally('diff', 3).lead].id;
  renderVotes(); renderRideCards(); updateSum(); syncMine();
}

function stepRide(d) {
  const list = visRides(); let i = list.indexOf(S.selectedRide); i = i < 0 ? 0 : (i + d + list.length) % list.length; selectRide(list[i]);
}

export function selectRide(ride) {
  S.selectedRide = ride; S.garagePop = 1; S.garageIdle = Math.max(S.garageIdle, 0.6);
  RIDES.forEach((r) => { garageModels[r.id].group.visible = r.id === ride.id; });
  $('gName').textContent = ride.name;
  $('gTrait').textContent = ride.trait;
  [['gSpeed', ride.speed], ['gHandling', ride.handling], ['gBoost', ride.boost]].forEach(([id, n]) => {
    [...$(id).children].forEach((p, i) => { p.className = 'pip' + (i < n ? ' on' : ''); });
  });
  renderRideCards(); syncMine();
  saveSetup();
}

export function updateSum() { try { setGarageTheme(S.MAP); } catch (e) { console.error(e); } }

function saveSetup() { updateSum(); try { localStorage.setItem('turbotype-setup', JSON.stringify({ map: MAPS[S.myVote.map].id, wx: WEATHERS[S.myVote.wx].id, diff: DIFFS[S.myVote.diff].id, ride: S.selectedRide && S.selectedRide.id })); } catch (e) { /* ignore */ } }

export function selectMap(map, force) {
  S.myVote.map = Math.max(0, MAPS.indexOf(map));
  if (force) S.botVote.forEach((b) => { b.map = S.myVote.map; });
  applyVotes(); saveSetup();
}

export function selectDiff(i) {
  S.myVote.diff = i; applyVotes(); saveSetup();
}

export function selectWeather(id, force) {
  S.myVote.wx = Math.max(0, WEATHERS.findIndex((w) => w.id === id));
  if (force) S.botVote.forEach((b) => { b.wx = S.myVote.wx; });
  applyVotes(); saveSetup();
}

function drawMapThumb(cv, map) {
  const cx = cv.getContext('2d'); const w = cv.width, h = cv.height;
  const bg = { forest: '#5f9f45', desert: '#d9b878', snow: '#e8f0f7', city: '#8b90a0' }[map.style === 'space' ? 'city' : map.biome];
  cx.fillStyle = map.style === 'space' ? '#b5532f' : map.style === 'river' ? '#55d4b6' : bg; cx.fillRect(0, 0, w, h);
  cx.fillStyle = 'rgba(255,255,255,0.08)'; for (let x = 0; x < w; x += 24) for (let y = 0; y < h; y += 24) if (((x + y) / 24) % 2 === 0) cx.fillRect(x, y, 24, 24);
  const xs = map.verts.map((v) => v[0]), ys = map.verts.map((v) => v[1]);
  const mnx = Math.min(...xs), mxx = Math.max(...xs), mny = Math.min(...ys), mxy = Math.max(...ys);
  const pad = 22, sc = Math.min((w - 2 * pad) / (mxx - mnx || 1), (h - 2 * pad) / (mxy - mny || 1));
  const ox = (w - (mxx - mnx) * sc) / 2, oy = (h - (mxy - mny) * sc) / 2;
  const P = (v) => [ox + (v[0] - mnx) * sc, oy + (v[1] - mny) * sc];
  cx.lineJoin = 'round'; cx.lineCap = 'round';
  cx.beginPath(); map.verts.forEach((v, i) => { const [x, y] = P(v); i ? cx.lineTo(x, y) : cx.moveTo(x, y); }); cx.closePath();
  cx.strokeStyle = '#ffffff'; cx.lineWidth = 15; cx.stroke(); cx.strokeStyle = '#33333d'; cx.lineWidth = 10; cx.stroke();
  const [sx, sy] = P(map.verts[0]); cx.fillStyle = '#ffd23f'; cx.beginPath(); cx.arc(sx, sy, 7, 0, 7); cx.fill();
}

const bestOf = (id) => { try { return parseFloat(localStorage.getItem('turbotype-best-' + id) || (id === 'forest' ? localStorage.getItem('turbotype-best') : '')) || null; } catch (e) { return null; } };

function refreshBests() { document.querySelectorAll('[data-best]').forEach((n) => { const v = bestOf(n.dataset.best); n.textContent = v ? 'Best ' + fmtTime(v) : 'No time yet'; }); }

export function buildSetupUI() {
  $('mapCards').innerHTML = MAPS.map((m) => '<button type="button" class="map" data-id="' + m.id + '" aria-label="' + esc(m.name) + '"><canvas width="256" height="144"></canvas><span>' + esc(m.name) + '</span></button>').join('');
  [...$('mapCards').children].forEach((b, n) => { drawMapThumb(b.querySelector('canvas'), MAPS[n]); b.addEventListener('click', () => selectMap(MAPS[n])); });
  $('wxChips').innerHTML = WEATHERS.map((w) => '<button type="button" class="wxt" data-id="' + w.id + '"><i style="background:' + (WX_UI[w.id] || ['', '#ccc'])[1] + '"></i>' + esc((WX_UI[w.id] || [w.name])[0]) + '</button>').join('');
  [...$('wxChips').children].forEach((b) => b.addEventListener('click', () => selectWeather(b.dataset.id)));
  $('dfChips').innerHTML = DIFFS.map((d) => '<button type="button" class="dft" data-id="' + d.id + '"><b>' + d.name + '</b><i>' + esc(d.sample) + '<br>' + esc(d.ex) + '</i></button>').join('');
  [...$('dfChips').children].forEach((b, i) => b.addEventListener('click', () => selectDiff(i)));
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
  ['gSpeed', 'gHandling', 'gBoost'].forEach((id) => { $(id).innerHTML = '<i class="pip"></i><i class="pip"></i><i class="pip"></i><i class="pip"></i><i class="pip"></i>'; });
  window.addEventListener('keydown', (e) => { if (S.state === 'garage' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); stepRide(e.key === 'ArrowLeft' ? -1 : 1); } });
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

export function toGaragePage(code, joining) { S.state = 'garage'; showScreen('garage'); layout(); openRoom(code || mkCode(), !!joining); }

export function toGarage() {
  for (const b of S.itemBoxes) raceScene.remove(b.mesh); S.itemBoxes = [];
  S.state = 'garage'; showScreen('garage'); el.results.hidden = true; el.count.hidden = true; el.race.querySelector('.fit').style.display = '';
  for (const r of S.racers) raceScene.remove(r.v.group);
  S.racers = []; S.player = null; S.camInit = false; S.mini = null;
  if (onlineEnabled() && S.room && S.room.online) { leaveOnline(); enterOnline('create').catch(() => { S.state = 'profile'; showScreen('profile'); }); } else openRoom(mkCode(), false);
  layout();
}

