// @ts-nocheck
import { S } from '../core/state';
import { el } from '../ui/hud';
import { $ } from '../utils/helpers';
import { toGarage } from '../ui/garage';
import { pullGold, useItem } from '../items/effects';
import { ensureWords, onCorrect, onWrong, renderText } from './engine';
import { grantItem } from '../items/inventory';
import { toast } from '../ui/toast';
import { sfx } from '../audio/audio';

export function showKey(k, bad, caps) {
  const a = el.kcKey || (el.kcKey = $('kcKey')), b = el.kcap || (el.kcap = $('kcap'));
  a.textContent = k === ' ' ? '\u2423' : k; a.className = 'k' + (bad ? ' bad' : ''); b.classList.toggle('caps-on', caps);
}

export function onKey(e) {
  if (e.key === 'Escape' && (S.state === 'racing' || S.state === 'countdown')) { toGarage(); return; }
  if (S.state !== 'racing') { if (S.state === 'countdown') e.preventDefault(); return; }
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === 'Tab') { e.preventDefault(); useItem(); return; }
  if (e.key.length !== 1) return;
  e.preventDefault();
  if (S.player.finished) return;
  const capsOn = !!(e.getModifierState && e.getModifierState('CapsLock'));
  const w = S.cur.words[S.cur.wi];
  const expected = S.cur.ci < w.t.length ? w.t[S.cur.ci] : ' ';
  const hadAuto = S.items.autoN > 0;
  if (e.key === expected && S.items.twiceT > 0 && S.cur.ci < w.t.length && S.cur.tw === 0) {
    onCorrect(); S.cur.tw = 1;   // Twice Curse: every letter has to be typed twice
  } else if (e.key === expected) {
    onCorrect(); S.cur.tw = 0; S.cur.ci++;
    if (S.cur.ci === w.t.length && w.gold && S.cur.clean && !S.cur.awarded) { S.cur.awarded = true; grantItem(); }
    if (S.cur.ci > w.t.length) { S.cur.wi++; S.cur.ci = 0; S.cur.clean = true; S.cur.awarded = false; ensureWords(); }
  } else if (S.items.autoN > 0) {
    S.items.autoN--; toast('Autocorrect fixed that typo' + (S.items.autoN ? ' (' + S.items.autoN + ' left)' : ''), '#7be88a'); sfx('item'); S.cur.ci++; S.cur.tw = 0;
    if (S.cur.ci > w.t.length) { S.cur.wi++; S.cur.ci = 0; S.cur.clean = true; S.cur.awarded = false; ensureWords(); }
  } else onWrong();
  if (S.items.magnetT > 0) pullGold();
  showKey(e.key, e.key !== expected && !hadAuto, capsOn);
  renderText();
}

