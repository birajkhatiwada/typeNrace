// @ts-nocheck
import { S } from '../core/state';
import { rankOf } from '../race/simulation';
import { ITEM_NAMES, ITEM_POOL, MAX_ITEMS, RIVAL_POOL } from './definitions';
import { pick } from '../utils/helpers';
import { toast } from '../ui/toast';
import { sfx } from '../audio/audio';
import { updateHud } from '../ui/hud';

export function rollItem(r0) {
  const rank = rankOf(r0 || S.player), w = Object.assign({}, ITEM_POOL);
  w.torpedo = rank === 1 ? 0 : rank === 2 ? 5 : 12;               // comeback item: never for the leader
  if (rank === 1) { w.ink = 3; w.scramble = 3; w.fog = 2; w.hard = 2; w.shield += 4; w.mirror += 3; }
  if (rank >= 3) { w.turbo += 6; w.ink += 4; w.easy += 3; w.nitro += 3; }
  let tot = 0; for (const k in w) tot += w[k];
  let r = Math.random() * tot; for (const k in w) { r -= w[k]; if (r <= 0) return k; }
  return 'turbo';
}

export function rollRivalItem(r) { const k = pick(RIVAL_POOL); return k === 'torpedo' && rankOf(r) === 1 ? 'ink' : k; }

export function giveItem(it, label) {
  if (S.items.list.length >= MAX_ITEMS) { S.mood.boost = Math.min(99, S.mood.boost + 30); toast('Items full: +30 boost', '#ffd23f'); return false; }
  S.items.list.push(it); toast(label + ITEM_NAMES[it], '#ffd23f'); sfx('item'); S.itemPop = S.items.list.length - 1; updateHud(true); return true;
}

export function grantItem() { giveItem(rollItem(), 'Golden word! '); }

