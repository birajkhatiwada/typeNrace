// @ts-nocheck
import { S } from '../core/state';
import { makeVehicle } from '../vehicles/vehicle';
import { raceScene } from '../render/scenes';
import { showKey } from '../typing/input';
import { buildRaceWorld } from '../world/raceWorld';
import { $ } from '../utils/helpers';
import { WEATHERS } from '../config/maps';
import { RIDES, RIVALS } from '../config/rides';
import { me, rivals } from '../core/player';
import { botRideList } from '../rooms/voting';
import { newItems } from '../items/definitions';
import { buildItemBoxes } from '../items/boxes';
import { initText, renderText } from '../typing/engine';
import { el, showScreen, updateHud } from '../ui/hud';
import { layout } from '../render/layout';
import { audioStart } from '../audio/audio';

function newRacer(def, ride, slot, isPlayer) {
  const v = makeVehicle(ride);
  raceScene.add(v.group);
  const slots = [[-1, 1.8], [-4, -1.8], [-7, 1.8], [-10, -1.8]];
  return {
    name: def.name, color: def.color, ride, isPlayer, v,
    dist: slots[slot][0], lane: slots[slot][1], lat: slots[slot][1], speed: 0, wpm: def.wpm || 0,
    seed: Math.random() * 10, finished: false, finishTime: 0, slowT: 0, noise: 0, noiseT: 0
  };
}

export function startRace() {
  showKey("", false, false);
  if (S.builtKey !== S.MAP.id + '|' + S.WX) { buildRaceWorld(); }
  $('raceName').textContent = S.MAP.name + (S.WX !== 'clear' ? ' · ' + WEATHERS.find((w) => w.id === S.WX).name : '');
  for (const r of S.racers) raceScene.remove(r.v.group);
  S.racers = [];
  const rivalRides = RIDES.filter((r) => r.id !== S.selectedRide.id);
  const slotOrder = [1, 0, 2, 3]; // player gets slot 1 (second row)
  const rivalSlots = [0, 1, 2];
  S.player = newRacer({ name: me().name, color: me().color }, S.selectedRide, 3, true);
  S.racers.push(S.player);
  const botRides = botRideList();
  rivals().forEach((rv, n) => {
    if (S.room && S.room.online) { if (!S.room.members[n].joined) return; const r = newRacer(rv, botRides[n], rivalSlots[n], false); r.remote = true; r.pid = rv.pid; S.racers.push(r); return; }
    S.racers.push(newRacer(rv, botRides[n], rivalSlots[n], false));
  });
  S.raceTime = 0; S.countdown = 3.6;
  S.items = newItems();
  buildItemBoxes();
  S.stats = { correct: 0, wrong: 0, times: [] };
  S.mood = { turboT: 0, stumbleT: 0, boost: 0, streak: 0, scrambleFlash: 0, attackT: 12 + Math.random() * 8, goldGap: 0 };
  initText();
  S.state = 'countdown'; S.goT = 0; S.camInit = false; S.hudCache = {};
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  el.results.hidden = true; el.panel.style.display = ''; el.race.querySelector('.fit').style.display = '';
  showScreen('race');
  layout();
  renderText(); updateHud(true);
  $('count').hidden = false;
  audioStart();
}

