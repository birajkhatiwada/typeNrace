// @ts-nocheck
import { runInit } from './init';
import gStraight from '../assets/track-straight.glb';
import gCorner from '../assets/track-corner.glb';
import gFinish from '../assets/track-finish.glb';
import gForest from '../assets/decoration-forest.glb';
import gEmpty from '../assets/decoration-empty.glb';
import cityTex from '../assets/city/colormap.png';
import indTex from '../assets/ind/colormap.png';
import comTex from '../assets/com/colormap.png';
import boatTex from '../assets/boat/colormap.png';
import carTex from '../assets/cars/colormap.png';
import colormapUrl from '../assets/colormap.png';
import * as THREE from 'three';
import { S } from './state';
import { cacheEls, el, showScreen } from '../ui/hud';
import { RIDES } from '../config/rides';
import { CITY_GLB, COM_GLB, GP_GLB, HEXBOAT_GLB, IND_GLB, MAPS, NATURE_GLB, PROP_GLB, SPACE_GLB } from '../config/maps';
import { garageModels, garageScene, models, raceScene } from '../render/scenes';
import { parseGlb } from '../world/assets';
import { buildGarageWorld } from '../world/garage';
import { initLights } from '../world/atmosphere';
import { buildRaceWorld } from '../world/raceWorld';
import { makeVehicle } from '../vehicles/vehicle';
import { buildGarageUI, buildSetupUI, renderRideCards, renderThumbs, selectMap, selectRide, selectWeather, toGarage, toGaragePage, updateSum, initSteps, genPreviews, recClip, recWeather } from '../ui/garage';
import { layout } from '../render/layout';
import { AVS, BGS } from '../config/avatars';
import { $ } from '../utils/helpers';
import { audioStart } from '../audio/audio';
import { closeRoomTimer, closedRooms, roomTick } from '../rooms/room';
import { toast } from '../ui/toast';
import { requestRematch, prewarm, enterOnline, leaveOnline, onlineEnabled, setReady } from '../net/online';
import { me } from './player';
import { startRace } from '../race/setup';
import { onKey } from '../typing/input';
import { CUM, PTS, cellCenter } from '../world/tracks/track';
import { hitPlayer, useItem } from '../items/effects';
import { giveItem, grantItem } from '../items/inventory';
import { frame } from './loop';

export async function boot() {
  runInit();
  cacheEls();
  const defs = { straight: gStraight, corner: gCorner, finish: gFinish, forest: gForest, empty: gEmpty };
  RIDES.forEach((r) => { defs[r.id] = r.glb; });
  Object.assign(defs, NATURE_GLB, CITY_GLB, IND_GLB, COM_GLB, SPACE_GLB, HEXBOAT_GLB, PROP_GLB, GP_GLB);
  for (const key of Object.keys(defs)) { const rd = RIDES.find((r) => r.id === key); S.texUrl = key.startsWith('c_') ? cityTex : key.startsWith('i_') ? indTex : key.startsWith('m_') ? comTex : key.startsWith('b_') || (rd && rd.tex === 'boat') ? boatTex : (rd && rd.tex === "car") || key.startsWith('k_') ? carTex : colormapUrl; models[key] = await parseGlb(defs[key]); }
  buildGarageWorld();
  initLights();
  buildRaceWorld();
  RIDES.forEach((r) => { const v = makeVehicle(r); v.group.visible = false; garageScene.add(v.group); garageModels[r.id] = v; });
  buildGarageUI();
  buildSetupUI();
  S.state = 'profile';
  showScreen('profile');
  let savedRide = null; try { savedRide = (JSON.parse(localStorage.getItem('turbotype-setup')) || {}).ride; } catch (e) { savedRide = null; }
  selectRide(RIDES.find((r) => r.id === savedRide) || RIDES[0]); initSteps();
  layout();
  try { renderThumbs(); } catch (e) { /* thumbnails are optional */ }
  el.loading.hidden = true;
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => layout());
  // name + avatar page (saved on this device)
  {
    let pr = null; try { pr = JSON.parse(localStorage.getItem('turbotype-player')); } catch (e) { pr = null; }
    S.profile = pr || { name: '', av: Math.floor(Math.random() * AVS.length) };
    const nm = $('pName'), row = $('avRow');
    const save = () => { try { localStorage.setItem('turbotype-player', JSON.stringify(S.profile)); } catch (e) { /* ignore */ } };
    const avb = $('avBtn');
    row.innerHTML = AVS.map((e, i) => '<button type="button" class="at" data-i="' + i + '" style="background:' + BGS[i] + '" aria-label="Avatar ' + (i + 1) + '">' + e + '</button>').join('');
    const paint = () => { [...row.children].forEach((b, i) => b.classList.toggle('s', i === S.profile.av)); avb.textContent = AVS[S.profile.av % AVS.length]; avb.style.background = BGS[S.profile.av % BGS.length]; };
    [...row.children].forEach((b, i) => b.addEventListener('click', () => { S.profile.av = i; paint(); save(); row.hidden = true; }));
    const togg = () => { row.hidden = !row.hidden; };
    avb.addEventListener('click', togg); $('avChg').addEventListener('click', togg);
    $('sndBtn').addEventListener('click', () => { S.muted = !S.muted; $('sndBtn').textContent = S.muted ? 'SOUND OFF' : 'SOUND ON'; $('muteWaves').style.display = S.muted ? 'none' : ''; $('muteBtn').setAttribute('aria-pressed', S.muted ? 'true' : 'false'); });
    $('howBtn').addEventListener('click', () => { $('howModal').hidden = false; }); $('howX').addEventListener('click', () => { $('howModal').hidden = true; });
    nm.value = S.profile.name; paint();
    nm.addEventListener('input', () => { S.profile.name = nm.value.replace(/[^\w \-.']/g, '').slice(0, 12); save(); });
    nm.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') $('goBtn').click(); });
    $('goBtn').addEventListener('click', () => { audioStart(); if (onlineEnabled()) { enterOnline('create').catch((e) => { toast(e.message, '#b8860b'); }); } else toGaragePage(); });
    { // join a room with a code
      const jm = $('joinModal'), jc = $('jCode'), je = $('jErr');
      const fmt = () => { const v = jc.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7); jc.value = v.length > 4 ? v.slice(0, 4) + '-' + v.slice(4) : v; je.textContent = ''; };
      const go = () => {
        const v = jc.value.replace('-', '');
        if (v.length < 7) { je.textContent = 'Enter the 7-character code'; return; }
        if (!onlineEnabled() && closedRooms.has(jc.value)) { je.textContent = 'That race already started. Ask for a new code.'; return; }
        if (onlineEnabled()) { audioStart(); je.textContent = 'Joining…'; enterOnline('join', jc.value).then(() => { jm.hidden = true; }).catch((e) => { je.textContent = '\u26A0 ' + e.message; }); return; }
        jm.hidden = true; audioStart(); toGaragePage(jc.value, true);
      };
      $('codeBtn').addEventListener('click', () => { jm.hidden = false; jc.value = ''; je.textContent = ''; setTimeout(() => jc.focus(), 30); });
      jc.addEventListener('input', fmt); jc.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') go(); if (e.key === 'Escape') jm.hidden = true; });
      $('jGo').addEventListener('click', go); $('jX').addEventListener('click', () => { jm.hidden = true; });
    }
    $('backBtn').addEventListener('click', () => { closeRoomTimer(); leaveOnline(); S.room = null; S.state = 'profile'; showScreen('profile'); });
    window.__player = () => ({ name: me().name, av: me().av });
  }
  prewarm();
  updateSum(); genPreviews();
  $('startBtn').addEventListener('click', () => { audioStart(); if (!S.room) { startRace(); return; } if (S.room.online) { if (!S.room.members.some((m) => m.joined)) return; setReady(!S.room.ready); return; } S.room.ready = !S.room.ready; renderRideCards(); roomTick(); });
  $('rcCopy').addEventListener('click', () => { const b = $('rcCopy'); try { navigator.clipboard.writeText(S.room ? S.room.code : ''); } catch (e) { /* ignore */ } b.textContent = 'COPIED'; setTimeout(() => { b.textContent = 'COPY'; }, 1200); });
  $('againBtn').addEventListener('click', () => { audioStart(); if (S.room && S.room.online) { requestRematch(); return; } startRace(); });
  $('garageBtn').addEventListener('click', toGarage);
  $('quitBtn').addEventListener('click', toGarage);
  $('muteBtn').addEventListener('click', () => { S.muted = !S.muted; $('sndBtn').textContent = S.muted ? 'SOUND OFF' : 'SOUND ON'; $('muteWaves').style.display = S.muted ? 'none' : ''; $('muteBtn').setAttribute('aria-pressed', S.muted ? 'true' : 'false'); });
  window.addEventListener('keydown', onKey);
  if (window.ResizeObserver) new ResizeObserver(() => layout()).observe(el.panel);
  window.__tt = { recClip, recWeather, get laps() { return S.LAPS; }, get raceTime() { return S.raceTime; }, cells: () => S.CELLS.map((c) => [...cellCenter(c), ...c.d, c.corner ? 1 : 0]), get state() { return S.state; }, get player() { return S.player; }, get racers() { return S.racers; }, get cur() { return S.cur; }, finishNow() { S.player.dist = S.LAPS * S.TRACK_LEN + 1; }, dbg: { hit: (k) => hitPlayer(k, S.racers[1]), give: (k) => giveItem(k, "Test: "), fxState: () => JSON.stringify(S.items), fx: () => S.items, curWords: () => S.cur.words.slice(S.cur.wi, S.cur.wi + 6).map((w) => w.t + (w.mode ? ":" + w.mode : "")).join(" "), pts: () => PTS.slice(), path() { const g = new THREE.BufferGeometry().setFromPoints(PTS.map((q) => new THREE.Vector3(q.x, q.y + 0.6, q.z))); const l = new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xff00ff })); raceScene.add(l); const m = new THREE.Mesh(new THREE.SphereGeometry(0.8), new THREE.MeshBasicMaterial({ color: 0x0000ff })); m.position.set(PTS[0].x, 1, PTS[0].z); raceScene.add(m); }, grant: grantItem, scramble: () => scrambleNext(3), use: useItem, items: () => S.items, boxes: () => S.itemBoxes, fogOff() { if (raceScene.fog) { raceScene.fog.near = 1e4; raceScene.fog.far = 1e5; } } }, track: { len: () => S.TRACK_LEN, cum: () => CUM.slice(), pts: () => PTS.slice() }, spin(v) { S.garageSpin = v; S.garageIdle = 1e6; }, readyAll() { if (S.room) { S.room.members.forEach((x) => { x.joined = x.picked = x.voted = x.ready = true; }); S.room.ready = true; roomTick(); } }, get room() { return S.room; }, setup(m, w) { selectMap(MAPS.find((x) => x.id === m), true); selectWeather(w || S.WX, true); } };
  requestAnimationFrame(frame);
}

