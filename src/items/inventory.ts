// @ts-nocheck
import { S } from '../core/state';
import { ITEM_NAMES, ITEM_POOL, MAX_ITEMS } from './definitions';
import { toast } from '../ui/toast';
import { sfx } from '../audio/audio';
import { updateHud } from '../ui/hud';

/** Same chances for everyone, wherever they are in the race. */
export function rollItem() {
  let tot = 0; for (const k in ITEM_POOL) tot += ITEM_POOL[k];
  let r = Math.random() * tot; for (const k in ITEM_POOL) { r -= ITEM_POOL[k]; if (r <= 0) return k; }
  return 'turbo';
}
export const rollRivalItem = () => rollItem();

export function giveItem(it, label) {
  if (S.items.list.length >= MAX_ITEMS) { S.mood.boost = Math.min(99, S.mood.boost + 30); toast('Slots full: +30 boost', '#ffd23f'); return false; }
  S.items.list.push(it); toast(label + ITEM_NAMES[it], '#ffd23f'); sfx('item'); S.itemPop = S.items.list.length - 1; updateHud(true); return true;
}

export function grantItem() { giveItem(rollItem(), 'Golden word! '); }
