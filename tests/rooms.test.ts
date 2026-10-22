import { describe, it, expect, beforeEach } from 'vitest';
import { S } from '../src/core/state';
import { tally, voters } from '../src/rooms/voting';
import { mkCode } from '../src/rooms/room';
import { MAPS } from '../src/config/maps';

beforeEach(() => {
  S.profile = { name: 'Biraj', av: 0 };
  S.myVote = { map: 0, wx: 0 };
  S.botVote = [{ map: 1, wx: 1 }, { map: 1, wx: 0 }, { map: 2, wx: 0 }];
  S.tieSeed = 0;
  S.room = null;
});

describe('room codes', () => {
  it('mkCode has XXXX-XXX shape without ambiguous chars', () => {
    for (let i = 0; i < 50; i++) expect(mkCode()).toMatch(/^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{3}$/);
  });
});

describe('voting', () => {
  it('counts every voter when there is no room', () => {
    expect(voters().length).toBe(1 + S.botVote.length);
  });
  it('in a room only members who voted count', () => {
    S.room = { members: S.botVote.map((_: unknown, i: number) => ({ voted: i === 0 })) };
    expect(voters().length).toBe(2);
  });
  it('tally picks the plurality winner', () => {
    const t = tally('map', MAPS.length);
    expect(t.counts[1]).toBe(2);
    expect(t.lead).toBe(1);
  });
  it('tally breaks ties using the seed, always among tied options', () => {
    S.botVote = [{ map: 1, wx: 0 }]; // 1 vote for map 0 (you) and 1 for map 1
    for (const seed of [0, 0.3, 0.6, 0.99]) { S.tieSeed = seed; expect([0, 1]).toContain(tally('map', MAPS.length).lead); }
  });
});
