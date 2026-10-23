// @ts-nocheck
import { S } from '../core/state';
import { $, clamp, esc, fmtTime } from '../utils/helpers';
import { progress, rankOf } from '../race/simulation';
import { BLANK, thumbURL } from './garage';
import { toast } from './toast';
import { sfx } from '../audio/audio';
import { ITEM_NAMES, MAX_ITEMS, HIT } from '../items/definitions';
import { cursedCounts, easyAhead, renderText } from '../typing/engine';
import { drawMini } from './minimap';

export const el = {};

export function cacheEls() { ['gl', 'loading', 'profile', 'garage', 'race', 'results', 'count', 'text', 'terrain', 'pos', 'lap', 'timer', 'wpm', 'acc', 'boost', 'boostN', 'itemSlot', 'itemName', 'itemHint', 'toast', 'panel', 'turboGlow', 'scrGlow', 'raceName'].forEach((id) => { el[id] = $(id); }); }

export function showScreen(name) {
  ['profile', 'garage', 'race', 'results'].forEach((s) => { el[s].hidden = s !== name && !(s === 'race' && name === 'results'); });
  $('garageBg').hidden = name !== 'garage';
}

function setText(node, v, key) { if (S.hudCache[key] !== v) { node.textContent = v; S.hudCache[key] = v; } }

function currentWpm() {
  const win = Math.min(10, Math.max(S.raceTime, 2));
  const n = S.stats.times.filter((t) => t > S.raceTime - win).length;
  return Math.round((n / 5) * (60 / win));
}

const KCOL = { ink: '#ff8fc8', torpedo: '#ff9a5a', storm: '#a98bff', fog: '#c9cfdd', twice: '#ff8fc8', scr: '#ff8fc8', hard: '#ffb36b', caps: '#9ec5ff',
  turbo: '#ffb347', triple: '#ffb347', nitro: '#ff8a3d', autocorrect: '#7be88a', freeze: '#8fe3ff', magnet: '#ff6b5a', shield: '#7be88a', mirror: '#8fe3ff', easy: '#a8ee6a' };
const KICON = { scr: 'scramble' };
const DUR = { ink: HIT.ink.dur, torpedo: HIT.torpedo.dur, storm: HIT.storm.dur, fog: HIT.fog.dur, twice: HIT.twice.dur, turbo: 3, nitro: 5, freeze: 4, magnet: 9 };

/** One effect badge: icon in a ring that drains, with seconds or a count under it. */
function ring(k, frac, label) {
  const pct = Math.round(Math.max(0, Math.min(1, frac)) * 20) * 5;
  return '<span class="rg" style="--c:' + (KCOL[k] || '#ddd') + ';--p:' + pct + '%"><img alt="" src="fx/' + (KICON[k] || k) + '.png"><b>' + label + '</b></span>';
}
const secs = (t) => (t < 10 ? t.toFixed(1).replace(/\.0$/, '') : Math.ceil(t)) + 's';

/** Effects on the player. bad = curses on you, good = powers you are using. Each: [kind, fraction left, label, time left]. */
function playerEffects() {
  const I = S.items, bad = [], good = [];
  for (const s of I.slow) if (s.t > 0) bad.push([s.k, s.t / DUR[s.k], secs(s.t), s.t]);
  if (I.fogT > 0) bad.push(['fog', I.fogT / DUR.fog, secs(I.fogT), I.fogT]);
  if (I.twiceT > 0) bad.push(['twice', I.twiceT / DUR.twice, secs(I.twiceT), I.twiceT]);
  bad.sort((p, q) => p[3] - q[3]);
  const c = cursedCounts();
  for (const k of ['scr', 'hard', 'caps']) if (c[k]) bad.push([k, 1, c[k] + (c[k] === 1 ? ' word' : ' words'), 99]);
  if (S.mood.turboT > 0) good.push(['turbo', S.mood.turboT / DUR.turbo, secs(S.mood.turboT)]);
  if (I.tripleN > 0) good.push(['triple', 1, 'x' + I.tripleN]);
  if (I.nitroT > 0) good.push(['nitro', I.nitroT / DUR.nitro, secs(I.nitroT)]);
  if (I.freezeT > 0) good.push(['freeze', I.freezeT / DUR.freeze, secs(I.freezeT)]);
  if (I.magnetT > 0) good.push(['magnet', I.magnetT / DUR.magnet, secs(I.magnetT)]);
  if (I.autoN > 0) good.push(['autocorrect', 1, 'x' + I.autoN]);
  const e = easyAhead(); if (e) good.push(['easy', 1, e + (e === 1 ? ' word' : ' words')]);
  if (I.shieldOn) good.push(['shield', 1, '']);
  if (I.mirrorOn) good.push(['mirror', 1, '']);
  return { bad, good };
}

function group(label, list, emptyText) {
  if (!list.length) return '<span>' + label + '</span><em>' + emptyText + '</em>';
  const shown = list.slice(0, 4).map((x) => ring(x[0], x[1], x[2])).join('');
  return '<span>' + label + '</span>' + shown + (list.length > 4 ? '<i>+' + (list.length - 4) + '</i>' : '');
}

/** Badges next to a rival's name in the position table. */
function statusChips(r) {
  let list = [];
  if (r.isPlayer) { const e = playerEffects(); list = e.bad.concat(e.good).slice(0, 2); }
  else if (r.remote) {
    for (const s of (r.netStatus || [])) { const [k, t] = s.split(':'); const n = parseFloat(t); list.push(n ? [k, n / (DUR[k] || 3), secs(n)] : [k, 1, '']); }
    list = list.slice(0, 2);
  } else for (const f of (r.fx || [])) if (f.t > 0) list.push([f.k, f.t / (DUR[f.k] || 4), secs(f.t)]);
  list = list.slice(0, 2);
  return list.map((x) => ring(x[0], x[1], x[2])).join('');
}

export function updateHud(force) {
  if (!S.player) return;
  const rank = rankOf(S.player);
  if (S.hudCache.pos !== rank) { S.hudCache.pos = rank; el.pos.innerHTML = rank + '<i>/' + S.racers.length + '</i>'; }
  const lap = clamp(Math.floor(Math.max(0, S.player.dist) / S.TRACK_LEN) + 1, 1, S.LAPS);
  { // live standings
    const order = S.racers.slice().sort((p, q) => progress(q) - progress(p));
    let h = '';
    order.forEach((r, i) => {
      const gap = Math.round(progress(r) - progress(S.player));
      const g = r === S.player ? 'YOU' : (gap > 0 ? '+' : '-') + Math.abs(gap) + 'm';
      h += '<div class="br' + (r === S.player ? ' me' : '') + '" style="--c:' + r.color + '"><em>' + (i + 1) + '</em><i style="background:linear-gradient(135deg,' + r.color + ',' + r.color + '88)"><img alt="" src="' + (thumbURL[r.ride.id] || BLANK) + '"></i><span class="nm">' + esc(r.name) + '</span><b class="xs">' + statusChips(r) + '</b><u>' + g + '</u></div>';
    });
    if (S.hudCache.board !== h) { S.hudCache.board = h; (el.board || (el.board = $('board'))).innerHTML = h; }
  }
  if (S.hudCache.lap !== lap) { S.hudCache.lap = lap; el.lap.innerHTML = lap + '<i>/' + S.LAPS + '</i>'; }
  if (force) S.lastLap = lap; else if (lap > S.lastLap && S.state === 'racing') { S.lastLap = lap; toast(lap === S.LAPS ? 'FINAL LAP!' : 'Lap ' + lap + ' of ' + S.LAPS, lap === S.LAPS ? '#ff6fae' : '#3fd8e8'); sfx('item'); }
  setText(el.timer, fmtTime(S.raceTime), 'timer');
  setText(el.wpm, String(S.state === 'racing' || S.state === 'finished' ? currentWpm() : 0), 'wpm');
  const tot = S.stats.correct + S.stats.wrong;
  setText(el.acc, (tot ? Math.round((S.stats.correct / tot) * 100) : 100) + '%', 'acc');
  el.boost.style.width = (S.mood.turboT > 0 ? (S.mood.turboT / 3) * 100 : S.mood.boost) + '%';
  el.boost.className = 'fill' + (S.mood.turboT > 0 ? ' hot' : '');
  setText(el.boostN, S.mood.turboT > 0 ? 'TURBO' : S.mood.streak + ' clean', 'boostN');
  for (let k = 0; k < MAX_ITEMS; k++) {
    const kind = S.items.list[k], sig = (kind || '-') + (S.itemPop === k ? 'p' : '');
    if (S.hudCache['it' + k] !== sig) {
      S.hudCache['it' + k] = sig; const node = el['it' + k] || (el['it' + k] = $('it' + k));
      node.innerHTML = (kind ? '<img alt="' + ITEM_NAMES[kind] + '" src="fx/' + kind + '.png">' : '<span class="none"></span>') + (k === 0 ? '<span class="kb">TAB</span>' : '');
      node.className = 'kc' + (S.itemPop === k ? ' pop' : '');
    }
  }
  { // what is on you / what you are using, and the banner
    const e = playerEffects();
    const lastHit = S.items.hitLog[S.items.hitLog.length - 1];
    const hot = lastHit && S.state === 'racing' && S.raceTime - lastHit.t < 4.5 && e.bad.length ? lastHit : null;
    const ban = hot ? '<span><b>' + esc(hot.name.toUpperCase()) + '</b> just hit you with ' + ITEM_NAMES[hot.kind] + '</span><small>' + (e.bad.length > 1 ? '+' + (e.bad.length - 1) + ' more on you' : '') + '</small>' : '';
    const hb = (el.ban || (el.ban = $('ban')));
    if (S.hudCache.ban !== ban) {
      S.hudCache.ban = ban; hb.classList.toggle('hit', !!hot);
      if (hot) hb.innerHTML = ban; else { hb.innerHTML = '<span class="chip ' + (S.hudCache.terr || 'straight') + '" id="terrain">' + (S.hudCache.terrTxt || 'Straight: fast words') + '</span><span class="legend">&#9670; Golden word: type it clean for an item</span>'; el.terrain = $('terrain'); renderText(); }
    }
    const on = group('ON YOU', e.bad, 'clear'), me = group('YOURS', e.good, 'nothing active');
    if (S.hudCache.fxOn !== on) { S.hudCache.fxOn = on; (el.fxOn || (el.fxOn = $('fxOn'))).innerHTML = on; }
    if (S.hudCache.fxMe !== me) { S.hudCache.fxMe = me; (el.fxMe || (el.fxMe = $('fxMe'))).innerHTML = me; }
  }
  { // Lucky Box roll
    const R = S.items.roll, rl = el.roll || (el.roll = $('roll'));
    if (R) {
      rl.hidden = false; const ks = Object.keys(ITEM_NAMES).filter((k) => k !== 'lucky');
      const k = R.t < 0.35 ? R.got[0] : ks[Math.floor(S.tAcc * 14) % ks.length];
      const img = el.rollImg || (el.rollImg = $('rollImg')); const src = 'fx/' + k + '.png'; if (img.getAttribute('src') !== src) img.setAttribute('src', src);
    } else if (!rl.hidden) rl.hidden = true;
  }
  if (S.itemPop >= 0) S.itemPop = -1;
  el.turboGlow.style.opacity = S.mood.turboT > 0 ? 1 : 0;
  el.scrGlow.style.opacity = Math.max(0, S.mood.scrambleFlash);
  drawMini();
}

