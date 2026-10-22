// @ts-nocheck
import { S } from '../core/state';
import { pick } from '../utils/helpers';
import { LONG_WORDS, SHORT_WORDS } from '../config/words';
import { renderText, scrambleNext } from '../typing/engine';
import { ITEM_NAMES } from './definitions';
import { toast } from '../ui/toast';
import { sfx } from '../audio/audio';
import { updateHud } from '../ui/hud';

function replaceNext(n, mode) {
  let done = 0;
  for (let k = S.cur.wi + 1; k < S.cur.words.length && k < S.cur.wi + 14 && done < n; k++) {
    const w = S.cur.words[k]; if (w.gold || w.sym) continue;
    w.t = pick(mode === 'hard' ? LONG_WORDS : SHORT_WORDS); w.scr = false; w.mode = mode; done++;
  }
  renderText(); return done;
}

export function pullGold() {
  let g = -1; for (let k = S.cur.wi + 1; k < S.cur.words.length; k++) if (S.cur.words[k].gold) { g = k; break; }
  if (g > S.cur.wi + 1) { const [w] = S.cur.words.splice(g, 1); S.cur.words.splice(S.cur.wi + 1, 0, w); renderText(); }
}

const AI_DEBUFF = { ink: [4, 0.55], torpedo: [3.2, 0.4], scramble: [5, 0.62], fog: [3.5, 0.72], hard: [6, 0.7] };

export function aiDebuff(r, kind) {
  const d = AI_DEBUFF[kind] || AI_DEBUFF.ink; r.dbT = d[0]; r.dbMul = d[1]; r.dbKind = kind; if (kind === 'torpedo') r.speed *= 0.5;
}

export function hitPlayer(kind, from) {
  const nm = ITEM_NAMES[kind];
  if (S.items.shieldOn) { S.items.shieldOn = false; toast('Shield blocked ' + from.name + "'s " + nm, '#3fd8e8'); sfx('item'); return; }
  if (S.items.mirrorOn) { S.items.mirrorOn = false; aiDebuff(from, kind); toast('Mirror sent ' + nm + ' back at ' + from.name, '#7fe7ff'); sfx('item'); return; }
  if (kind === 'ink') { S.mood.stumbleT = 1.0; S.player.speed *= 0.7; }
  else if (kind === 'torpedo') { S.mood.stumbleT = 1.6; S.player.speed *= 0.5; }
  else if (kind === 'scramble') scrambleNext(3);
  else if (kind === 'fog') { S.items.fogT = 4; renderText(); }
  else if (kind === 'hard') replaceNext(4, 'hard');
  toast(from.name + (kind === 'torpedo' ? ' torpedoed you' : ' used ' + nm + ' on you'), '#ff6fae'); sfx('err');
}

export const aheadOf = (r) => S.racers.filter((o) => o !== r && o.dist > r.dist).sort((a, b) => a.dist - b.dist);

function applyItem(it) {
  if (it === 'turbo') { S.mood.turboT = Math.max(S.mood.turboT, 2.5); toast('Turbo!', '#3fd8e8'); sfx('turbo'); }
  else if (it === 'triple') { S.items.tripleN = 3; S.items.tripleT = 0; toast('Triple Turbo!', '#ffd23f'); }
  else if (it === 'nitro') { S.items.nitroT = 5; toast('Nitro Words: 2× speed per word', '#ff8a3d'); sfx('turbo'); }
  else if (it === 'magnet') { S.items.magnetT = 9; pullGold(); toast('Magnet on', '#ff6b5a'); sfx('item'); }
  else if (it === 'shield') { if (S.items.shieldOn) { toast('Shield already up', '#b4acd9'); return false; } S.items.shieldOn = true; toast('Shield up', '#3fd8e8'); }
  else if (it === 'mirror') { if (S.items.mirrorOn) { toast('Mirror already up', '#b4acd9'); return false; } S.items.mirrorOn = true; toast('Mirror up', '#7fe7ff'); }
  else if (it === 'autocorrect') { if (S.items.autoOn) { toast('Autocorrect already on', '#b4acd9'); return false; } S.items.autoOn = true; toast('Autocorrect on: next typo forgiven', '#7be88a'); }
  else if (it === 'freeze') { S.items.freezeT = 4; toast('Time Freeze: no slowdown', '#8fd6ff'); sfx('item'); }
  else if (it === 'easy') { replaceNext(3, 'easy'); toast('Easy Mode: short words coming', '#a8ee6a'); sfx('item'); }
  else if (it === 'torpedo') {
    const lead = S.racers.filter((o) => !o.isPlayer).sort((a, b) => b.dist - a.dist)[0];
    if (!lead || lead.dist <= S.player.dist) { toast("You're already in front", '#b4acd9'); return false; }
    aiDebuff(lead, 'torpedo'); toast('Torpedo hit ' + lead.name, '#ff6fae'); sfx('item');
  }
  else if (it === 'fog') {
    const t = aheadOf(S.player).filter((o) => !o.isPlayer).slice(0, 2); if (!t.length) { toast('Nobody ahead to hit', '#b4acd9'); return false; }
    t.forEach((o) => aiDebuff(o, 'fog')); toast('Fog Bank rolled over ' + t.map((o) => o.name).join(' and '), '#8aa8ff'); sfx('item');
  }
  else if (it === 'ink' || it === 'scramble' || it === 'hard') {
    const t = aheadOf(S.player).filter((o) => !o.isPlayer)[0]; if (!t) { toast('Nobody ahead to hit', '#b4acd9'); return false; }
    aiDebuff(t, it); toast(ITEM_NAMES[it] + ' hit ' + t.name, '#ff6fae'); sfx('item');
  }
  else if (it === 'lucky') {
    const pool = Object.keys(ITEM_NAMES).filter((k) => k !== 'lucky'); const n = Math.random() < 0.2 ? 2 : 1; let got = [];
    for (let tries = 0; tries < 30 && got.length < n; tries++) { const k = pick(pool); if (!got.includes(k) && applyItem(k)) got.push(k); }
    toast('Lucky Box' + (n === 2 ? ' JACKPOT: ' : ': ') + got.map((k) => ITEM_NAMES[k]).join(' + '), '#ffd23f');
  }
  return true;
}

export function useItem() {
  const it = S.items.list[0]; if (!it) return;
  if (applyItem(it) === false) return;
  S.items.list.shift(); updateHud(true);
}

