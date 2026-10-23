// @ts-nocheck
import { S } from '../core/state';
import { pick } from '../utils/helpers';
import { markNext, restoreCursed, cursedAhead, skipWord } from '../typing/engine';
import { HIT, BOT_WORD_CURSE, BOT_FALLBACK, ITEM_NAMES, POWERS, SLOW_KINDS } from './definitions';
import { toast } from '../ui/toast';
import { sfx } from '../audio/audio';
import { updateHud } from '../ui/hud';
import { net } from '../net/client';

export function pullGold() {
  let g = -1; for (let k = S.cur.wi + 1; k < S.cur.words.length; k++) if (S.cur.words[k].gold) { g = k; break; }
  if (g > S.cur.wi + 1) { const [w] = S.cur.words.splice(g, 1); S.cur.words.splice(S.cur.wi + 1, 0, w); }
}

export const aheadOf = (r) => S.racers.filter((o) => o !== r && o.dist > r.dist).sort((a, b) => a.dist - b.dist);
const online = () => !!(S.room && S.room.online);

/* ---------------- being hit: you ---------------- */

/** Slows never multiply: the strongest one on you counts. The same slow hitting again just refreshes its timer. */
export function slowMul() { let m = 1; for (const s of S.items.slow) if (s.t > 0) m = Math.min(m, s.mul); return m; }
function addSlow(kind) {
  const h = HIT[kind], cur = S.items.slow.find((s) => s.k === kind);
  if (cur) cur.t = Math.max(cur.t, h.dur); else S.items.slow.push({ k: kind, t: h.dur, mul: h.mul });
}

function applyCurse(kind) {
  const h = HIT[kind];
  if (SLOW_KINDS.includes(kind)) { addSlow(kind); if (h.jolt) S.player.speed *= h.jolt; }
  else if (kind === 'fog') S.items.fogT = Math.max(S.items.fogT, h.dur);
  else if (kind === 'twice') { S.items.twiceT = Math.max(S.items.twiceT, h.dur); S.cur.tw = 0; }
  else markNext(kind, h.words);
  S.mood.scrambleFlash = 0.8;
}

export function hitPlayer(kind, from, opts = {}) {
  const nm = ITEM_NAMES[kind];
  if (S.items.shieldOn) { S.items.shieldOn = false; toast('Shield blocked ' + from.name + "'s " + nm, '#3fd8e8'); sfx('item'); return; }
  if (kind === 'swap') {   // a rival swaps places with you (only ever 1st place)
    if (S.items.mirrorOn) { S.items.mirrorOn = false; toast('Mirror stopped ' + from.name + "'s Swap Places", '#7fe7ff'); return; }
    if (from.dist !== undefined) { const d = S.player.dist; S.player.dist = from.dist; from.dist = d; }
    S.items.hitLog.push({ name: from.name, kind, t: S.raceTime }); toast(from.name + ' swapped places with you', '#ff6fae'); return;
  }
  if (S.items.mirrorOn && !opts.refl) { S.items.mirrorOn = false; reflect(kind, from); toast('Mirror sent ' + nm + ' back at ' + from.name, '#7fe7ff'); sfx('item'); return; }
  applyCurse(kind);
  S.items.hitLog.push({ name: from.name, kind, t: S.raceTime });
  toast(from.name + ' hit you with ' + nm, '#ff6fae'); sfx('err');
}

function reflect(kind, from) {
  if (from.remote) net.send({ t: 'attack', to: from.pid, k: kind, refl: true });
  else botHit(from, kind, S.player, true);
}

/** A hit from another player arrives over the network. */
export function receiveAttack(m) {
  if (S.state !== 'racing' || !S.cur) return;
  if (!HIT[m.k] && m.k !== 'swapok') return;
  const from = S.racers.find((r) => r.pid === m.from) || { name: 'Rival' };
  if (m.k === 'swapok') { S.player.dist = m.d; toast('Swapped places with ' + from.name, '#ffd23f'); sfx('item'); return; }
  if (m.k === 'swap') {
    if (S.items.shieldOn) { S.items.shieldOn = false; toast('Shield blocked ' + from.name + "'s Swap Places", '#3fd8e8'); return; }
    if (S.items.mirrorOn) { S.items.mirrorOn = false; toast('Mirror stopped ' + from.name + "'s Swap Places", '#7fe7ff'); return; }
    const mine = S.player.dist; S.player.dist = m.d; net.send({ t: 'attack', to: m.from, k: 'swapok', d: mine });
    S.items.hitLog.push({ name: from.name, kind: 'swap', t: S.raceTime }); toast(from.name + ' swapped places with you', '#ff6fae'); return;
  }
  hitPlayer(m.k, from, { refl: !!m.refl });
}

/* ---------------- being hit: rivals ---------------- */

export function botHit(r: any, kind: any, from: any = null, refl: any = false) {
  if (r.shield) { r.shield = false; return false; }
  if (r.mirror && !refl) { r.mirror = false; if (from && from.isPlayer) hitPlayer(kind, r, { refl: true }); else if (from) botHit(from, kind, r, true); return false; }
  if (kind === 'swap') { if (from) { const d = from.dist; from.dist = r.dist; r.dist = d; } return true; }
  const h = HIT[kind] || {}; let dur, mul;
  if (h.mul) { dur = h.dur; mul = h.mul; } else if (BOT_FALLBACK[kind]) { dur = BOT_FALLBACK[kind].dur; mul = BOT_FALLBACK[kind].mul; } else { dur = BOT_WORD_CURSE.dur; mul = BOT_WORD_CURSE.mul; }
  r.fx = r.fx || [];
  const cur = r.fx.find((f) => f.k === kind);
  if (cur) cur.t = Math.max(cur.t, dur); else r.fx.push({ k: kind, t: dur, mul });
  if (h.jolt) r.speed *= h.jolt;
  return true;
}
export const botMul = (r) => { let m = 1; for (const f of r.fx || []) if (f.t > 0) m = Math.min(m, f.mul); return m; };

/* ---------------- using a power ---------------- */

function targetsFor(it) {
  const kind = POWERS[it].kind, me = S.player;
  const others = S.racers.filter((o) => o !== me && !o.finished);
  if (kind === 'ahead') { const t = aheadOf(me).filter((o) => !o.finished)[0]; return t ? [t] : null; }
  if (kind === 'ahead2') { const t = aheadOf(me).filter((o) => !o.finished).slice(0, 2); return t.length ? t : null; }
  if (kind === 'all') { const t = aheadOf(me).filter((o) => !o.finished); return t.length ? t : null; }
  if (kind === 'lead') { const l = others.sort((a, b) => b.dist - a.dist)[0]; return l && l.dist > me.dist ? [l] : null; }
  return [];
}

export function canUse(it) {
  const p = POWERS[it]; if (!p) return false;
  if (it === 'shield') return !S.items.shieldOn;
  if (it === 'mirror') return !S.items.mirrorOn;
  if (it === 'autocorrect') return S.items.autoN < 3;
  if (it === 'cleanse') return hasCurse();
  if (it === 'lucky') return true;
  return p.kind === 'self' || !!targetsFor(it);
}

export function hasCurse() { return S.items.slow.some((s) => s.t > 0) || S.items.fogT > 0 || S.items.twiceT > 0 || cursedAhead() > 0; }

function sendHit(t, it) {
  if (it === 'swap' && t.remote) { net.send({ t: 'attack', to: t.pid, k: 'swap', d: S.player.dist }); toast('Swap Places sent to ' + t.name, '#ffd23f'); return; }
  if (t.remote) net.send({ t: 'attack', to: t.pid, k: it });
  else if (it === 'swap') { if (botHit(t, 'swap', S.player)) { toast('Swapped places with ' + t.name, '#ffd23f'); } else toast(t.name + ' blocked the swap', '#b4acd9'); return; }
  else botHit(t, it, S.player);
}

function applyItem(it) {
  if (!canUse(it)) {
    const p = POWERS[it];
    toast(p.kind === 'self' ? (it === 'cleanse' ? 'Nothing to cleanse' : ITEM_NAMES[it] + ' is already on') : (p.kind === 'lead' ? (it === 'swap' ? "You're already in front" : "You're already in front") : 'Nobody ahead to hit'), '#b4acd9');
    return false;
  }
  const I = S.items;
  if (it === 'turbo') { S.mood.turboT = Math.max(S.mood.turboT, 2.5); toast('Turbo!', '#3fd8e8'); sfx('turbo'); }
  else if (it === 'triple') { I.tripleN = 3; I.tripleT = 0; toast('Triple Turbo!', '#ffd23f'); }
  else if (it === 'nitro') { I.nitroT = 5; toast('Nitro Words: 2x per word', '#ff8a3d'); sfx('turbo'); }
  else if (it === 'skip') { skipWord(); toast('Word skipped', '#8fd6ff'); sfx('item'); }
  else if (it === 'magnet') { I.magnetT = 9; pullGold(); toast('Magnet on', '#ff6b5a'); sfx('item'); }
  else if (it === 'shield') { I.shieldOn = true; toast('Shield up', '#3fd8e8'); sfx('item'); }
  else if (it === 'mirror') { I.mirrorOn = true; toast('Mirror up', '#7fe7ff'); sfx('item'); }
  else if (it === 'autocorrect') { I.autoN = 3; toast('Autocorrect: next 3 typos forgiven', '#7be88a'); sfx('item'); }
  else if (it === 'freeze') { I.freezeT = 4; toast('Time Freeze: no slowdown', '#8fd6ff'); sfx('item'); }
  else if (it === 'cleanse') { I.slow = []; I.fogT = 0; I.twiceT = 0; S.cur.tw = 0; restoreCursed(); toast('Cleansed!', '#a8ffd8'); sfx('item'); }
  else if (it === 'easy') { markNext('easy', 3); toast('Easy Mode: short words coming', '#a8ee6a'); sfx('item'); }
  else if (it === 'lucky') startRoll();
  else {
    const ts = targetsFor(it);
    ts.forEach((t) => sendHit(t, it));
    if (it !== 'swap') toast(ITEM_NAMES[it] + ' hit ' + ts.map((o) => o.name).join(' and '), '#ff6fae');
    sfx('item');
  }
  return true;
}

/* Lucky Box: a short slot-machine roll, then the power lands. */
function startRoll() {
  const pool = Object.keys(POWERS).filter((k) => k !== 'lucky' && canUse(k));
  const n = Math.random() < 0.2 && pool.length > 1 ? 2 : 1, got = [];
  while (got.length < n && pool.length) got.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  S.items.roll = { t: 1.4, got, n };
  sfx('item');
}
export function updateRoll(dt) {
  const R = S.items.roll; if (!R) return;
  R.t -= dt; if (R.t > 0) return;
  S.items.roll = null;
  const done = R.got.filter((k) => applyItem(k));
  if (done.length) toast('Lucky Box' + (done.length === 2 ? ' JACKPOT: ' : ': ') + done.map((k) => ITEM_NAMES[k]).join(' + '), '#ffd23f');
}

export function useItem() {
  if (S.items.roll) return;
  const it = S.items.list[0]; if (!it) return;
  if (applyItem(it) === false) return;
  S.items.list.shift(); updateHud(true);
}
