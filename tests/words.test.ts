import { describe, it, expect } from 'vitest';
import { S } from '../src/core/state';
import { initText } from '../src/typing/engine';
import { EASY_WORDS, MEDIUM_WORDS, HARD_WORDS } from '../src/config/wordlists';

const gen = (diff: string, seed: number): string[] => { S.DIFF = diff; S.wordSeed = seed; initText(); return S.cur.words.map((w: any) => w.t); };

describe('word generator', () => {
  it('same seed and level give the same words for every player', () => {
    expect(gen('medium', 12345)).toEqual(gen('medium', 12345));
    expect(gen('hard', 7)).toEqual(gen('hard', 7));
  });
  it('different seeds give different words', () => {
    expect(gen('medium', 1)).not.toEqual(gen('medium', 2));
  });
  it('easy is plain lowercase letters only', () => {
    const ws = gen('easy', 99); expect(ws.length).toBeGreaterThanOrEqual(40);
    ws.forEach((w) => expect(w).toMatch(/^[a-z]+$/));
  });
  it('medium has no brackets, quotes, digits, semicolons or apostrophes', () => {
    gen('medium', 5).concat(gen('medium', 6), gen('medium', 7)).forEach((w) => expect(w).not.toMatch(/[()"';0-9]/));
  });
  it('hard includes punctuation, digits or brackets somewhere', () => {
    const all = [1, 2, 3, 4].flatMap((s) => gen('hard', s)).join(' ');
    expect(all).toMatch(/[()";0-9']/);
  });
  it('word pools are clean and big enough', () => {
    [EASY_WORDS, MEDIUM_WORDS, HARD_WORDS].forEach((p) => { p.forEach((w) => expect(w).toMatch(/^[a-z]+$/)); expect(new Set(p).size).toBe(p.length); });
    expect(EASY_WORDS.length).toBeGreaterThan(300); expect(MEDIUM_WORDS.length).toBeGreaterThan(300); expect(HARD_WORDS.length).toBeGreaterThan(150);
  });
  it('hard words are longer than easy words on average', () => {
    const avg = (a: string[]) => a.join('').length / a.length;
    expect(avg([1, 2, 3].flatMap((s) => gen('hard', s)))).toBeGreaterThan(avg([1, 2, 3].flatMap((s) => gen('easy', s))));
  });
});
