// @ts-nocheck
import { S } from '../core/state';
import { $, clamp, esc, fmtTime } from '../utils/helpers';
import { progress, rankOf } from '../race/simulation';
import { BLANK, thumbURL } from './garage';
import { toast } from './toast';
import { sfx } from '../audio/audio';
import { ITEM_NAMES, ITEM_TEXT, MAX_ITEMS } from '../items/definitions';
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

const DB_ICON = { ink: ['\u{1FAE7}', '#ff8fc8'], torpedo: ['\u{1F680}', '#ff9a5a'], scramble: ['\u{1F500}', '#ff8fc8'], fog: ['\u{1F32B}', '#c9cfdd'], hard: ['\u{1F525}', '#ffb36b'] };

function statusChips(r) {
  const c = [];
  if (r.isPlayer) {
    if (S.mood.stumbleT > 0) c.push(['\u{1F4A5}', '#ff8fc8']);
    if (S.items.fogT > 0) c.push(['\u{1F32B}' + Math.ceil(S.items.fogT) + 's', '#c9cfdd']);
    if (S.items.shieldOn) c.push(['\u{1F6E1}', '#7be88a']);
    if (S.items.mirrorOn) c.push(['\u{1FA9E}', '#8fe3ff']);
    if (S.items.freezeT > 0) c.push(['\u2744' + Math.ceil(S.items.freezeT) + 's', '#8fe3ff']);
    if (S.mood.turboT > 0 || S.items.nitroT > 0 || S.items.tripleN > 0) c.push(['\u26A1', '#ffb347']);
  } else if (r.dbT > 0) {
    const d = DB_ICON[r.dbKind] || DB_ICON.ink; c.push([d[0] + Math.ceil(r.dbT) + 's', d[1]]);
  }
  return c.slice(0, 2).map((x) => '<s style="background:' + x[1] + '">' + x[0] + '</s>').join('');
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
      const badge = '<span class="kb' + (k ? '' : ' k1') + '">' + (k ? k + 1 : 'TAB') + '</span>';
      node.innerHTML = kind
        ? badge + '<div class="art"><img alt="" src="cards/art_' + kind + '.webp"></div><div class="nm">' + ITEM_NAMES[kind] + '</div><div class="ru">' + ITEM_TEXT[kind] + '</div><div class="bl"></div>'
        : badge + '<div class="em"><svg viewBox="0 0 24 24" width="34" height="34" fill="#ffd24a"><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg></div>';
      node.className = 'kc' + (kind ? (k ? '' : ' face') : ' back') + (S.itemPop === k ? ' pop' : '');
    }
  }
  { // active effects
    const fx = [];
    if (S.items.shieldOn) fx.push(['Shield', 'good']); if (S.items.mirrorOn) fx.push(['Mirror', 'good']); if (S.items.autoOn) fx.push(['Autocorrect', 'good']);
    if (S.items.nitroT > 0) fx.push(['Nitro ' + Math.ceil(S.items.nitroT) + 's', 'hot']); if (S.items.magnetT > 0) fx.push(['Magnet ' + Math.ceil(S.items.magnetT) + 's', 'hot']);
    if (S.items.freezeT > 0) fx.push(['Freeze ' + Math.ceil(S.items.freezeT) + 's', 'good']); if (S.items.tripleN > 0) fx.push(['Triple x' + S.items.tripleN, 'hot']);
    if (S.items.fogT > 0) fx.push(['Fogged ' + Math.ceil(S.items.fogT) + 's', 'bad']);
    const h = fx.map((f) => '<span class="' + f[1] + '">' + f[0] + '</span>').join('');
    if (S.hudCache.fx !== h) { S.hudCache.fx = h; (el.fx || (el.fx = $('fx'))).innerHTML = h; }
  }
  if (S.itemPop >= 0) S.itemPop = -1;
  el.turboGlow.style.opacity = S.mood.turboT > 0 ? 1 : 0;
  el.scrGlow.style.opacity = Math.max(0, S.mood.scrambleFlash);
  drawMini();
}

