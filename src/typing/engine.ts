// @ts-nocheck
import { S } from '../core/state';
import { $, esc, mulberry } from '../utils/helpers';
import { CONTRACTIONS } from '../config/words';
import { EASY_WORDS, MEDIUM_WORDS, HARD_WORDS } from '../config/wordlists';
import { rideMul } from '../race/simulation';
import { IMPULSE, VMAX } from '../config/tuning';
import { toast } from '../ui/toast';
import { sfx } from '../audio/audio';

/** Next word of the race. Uses the race's seeded stream (S.cur.rng) so every player gets the same words. */
function makeWord() {
  const rnd = S.cur.rng, P = (a) => a[Math.floor(rnd() * a.length)];
  const lvl = S.DIFF || 'medium';
  const pool = lvl === 'easy' ? EASY_WORDS : lvl === 'medium' ? (rnd() < 0.7 ? MEDIUM_WORDS : EASY_WORDS) : (rnd() < 0.6 ? HARD_WORDS : MEDIUM_WORDS);
  let t = P(pool), gold = false, sym = false;
  const symP = lvl === 'easy' ? 0 : lvl === 'medium' ? 0.15 : 0.25;
  if (rnd() < symP) {
    sym = true;
    const r = rnd(), a = P(EASY_WORDS), b = P(EASY_WORDS);
    if (lvl === 'medium') {
      if (r < 0.3) t = a[0].toUpperCase() + a.slice(1); else if (r < 0.55) t = a + ','; else if (r < 0.75) t = a + '-' + b; else if (r < 0.9) t = a + '.'; else t = a[0].toUpperCase() + a.slice(1) + '?';
    } else if (r < 0.2) t = '"' + a + ',"'; else if (r < 0.4) t = '(' + a + '!)'; else if (r < 0.55) t = a[0].toUpperCase() + a.slice(1) + '?';
    else if (r < 0.7) t = a + '-' + b; else if (r < 0.85) t = a + (1 + Math.floor(rnd() * 9)) + ';'; else t = P(CONTRACTIONS);
  } else {
    S.cur.sinceGold++;
    if (S.cur.sinceGold >= S.cur.goldEvery && t.length >= 5) { gold = true; S.cur.sinceGold = 0; S.cur.goldEvery = 10 + Math.floor(rnd() * 5); }
  }
  return { t, gold, scr: false, sym };
}

export function initText() {
  S.cur = { words: [], wi: 0, ci: 0, clean: true, sinceGold: 0, goldEvery: 7, awarded: false, rng: mulberry(S.wordSeed | 0) };
  S.rowBase = 0; ensureWords();
}

export function ensureWords() { while (S.cur.words.length - S.cur.wi < 40) S.cur.words.push(makeWord()); }

function shuffleWord(t) {
  const idx = []; const letters = [];
  for (let i = 0; i < t.length; i++) if (/[a-z]/i.test(t[i])) { idx.push(i); letters.push(t[i]); }
  if (letters.length < 2) return t;
  for (let tries = 0; tries < 6; tries++) {
    for (let i = letters.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [letters[i], letters[j]] = [letters[j], letters[i]]; }
    const arr = t.split(''); idx.forEach((p, n) => { arr[p] = letters[n]; });
    const out = arr.join(''); if (out !== t) return out;
  }
  return t;
}

export function scrambleNext(n) {
  for (let k = 1; k <= n; k++) { const w = S.cur.words[S.cur.wi + k]; if (w) { w.t = shuffleWord(w.t); w.scr = true; } }
  S.mood.scrambleFlash = 1.0; renderText();
}

function computeRows() {
  const rows = []; let row = [], len = 0;
  for (let k = S.rowBase; k < S.cur.words.length && rows.length < 4; k++) {
    const l = S.cur.words[k].t.length + 1;
    if (len + l > S.rowChars && row.length) { rows.push(row); row = []; len = 0; }
    row.push(k); len += l;
  }
  if (row.length) rows.push(row);
  return rows;
}

export function renderText() {
  if (!S.cur) return;
  let rows = computeRows();
  let ri = rows.findIndex((r) => r.includes(S.cur.wi));
  if (ri >= 2) { S.rowBase = rows[ri - 1][0]; rows = computeRows(); ri = rows.findIndex((r) => r.includes(S.cur.wi)); }
  let html = '';
  rows.slice(0, 3).forEach((row) => {
    html += '<div class="row">';
    for (const k of row) {
      const w = S.cur.words[k];
      const cls = 'w' + (k < S.cur.wi ? ' done' : '') + (w.gold ? ' gold' : '') + (w.scr ? ' scr' : '') + (w.mode ? ' ' + w.mode : '') + (S.items.fogT > 0 && k > S.cur.wi ? ' fogged' : '');
      html += '<span class="' + cls + '">';
      for (let c = 0; c <= w.t.length; c++) {
        const isSpace = c === w.t.length;
        let cc = isSpace ? 'sp' : '';
        if (k < S.cur.wi || (k === S.cur.wi && c < S.cur.ci)) cc += ' d';
        else if (k === S.cur.wi && c === S.cur.ci) cc += ' cur' + (S.errFlash > 0 ? ' err' : '');
        html += '<span class="' + cc.trim() + '">' + (isSpace ? (cc.includes('cur') ? '\u00a0' : '') : esc(w.t[c])) + '</span>';
      }
      html += '</span>';
    }
    html += '</div>';
  });
  $('text').innerHTML = html;
  const w = S.cur.words[S.cur.wi];
  const sym = w && w.sym;
  $('terrain').textContent = sym ? 'Symbols: mind the punctuation' : 'Plain words: go fast';
  $('terrain').className = 'chip ' + (sym ? 'curve' : 'straight');
}

function currentVehicleMul() { return rideMul(S.selectedRide); }

export function onCorrect() {
  const m = S.selectedRide;
  S.player.speed = Math.min(VMAX, S.player.speed + IMPULSE * rideMul(m) * (S.items.nitroT > 0 ? 2 : 1));
  S.stats.correct++; S.stats.times.push(S.raceTime);
  S.mood.streak++;
  if (S.mood.turboT <= 0) {
    S.mood.boost += (S.mood.streak >= 6 ? 1.8 : 0.5) * (1 + 0.25 * (m.boost - 3));
    if (S.mood.boost >= 100) { S.mood.boost = 0; S.mood.turboT = 3; toast('TURBO!', '#3fd8e8'); sfx('turbo'); }
  }
  sfx('tick');
}

export function onWrong() {
  const m = S.selectedRide;
  S.stats.wrong++; S.mood.streak = 0; S.cur.clean = false;
  if (S.items.freezeT > 0) { S.errFlash = 0.18; sfx('err'); return; }
  S.player.speed *= 0.5 + 0.07 * m.handling;
  S.mood.stumbleT = 0.4; S.errFlash = 0.18;
  sfx('err');
}

