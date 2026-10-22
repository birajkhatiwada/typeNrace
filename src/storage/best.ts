// @ts-nocheck
import { S } from '../core/state';

export function loadBest() {
  S.best = null;
  try { S.best = parseFloat(localStorage.getItem('turbotype-best-' + S.MAP.id) || (S.MAP.id === 'forest' ? localStorage.getItem('turbotype-best') : '')) || null; } catch (e) { S.best = null; }
}

