import { describe, it, expect, beforeEach } from 'vitest';
import { S } from '../src/core/state';
import { rankOf, rideMul } from '../src/race/simulation';

describe('race ranking', () => {
  beforeEach(() => { S.racers = [{ dist: 10 }, { dist: 50 }, { dist: 30 }]; });
  it('ranks by distance', () => {
    expect(rankOf(S.racers[1])).toBe(1);
    expect(rankOf(S.racers[2])).toBe(2);
    expect(rankOf(S.racers[0])).toBe(3);
  });
  it('ride speed multiplier is neutral at speed 3', () => {
    expect(rideMul({ speed: 3 })).toBe(1);
    expect(rideMul({ speed: 5 })).toBeGreaterThan(rideMul({ speed: 2 }));
  });
});
