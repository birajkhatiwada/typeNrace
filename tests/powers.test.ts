import { describe, it, expect, beforeEach } from 'vitest';
import { S } from '../src/core/state';
import { POWERS, HIT, MAX_ITEMS, newItems } from '../src/items/definitions';
import { rollItem } from '../src/items/inventory';
import { slowMul, botHit, botMul } from '../src/items/effects';
import { Rooms } from '../server/rooms';
import type { ServerMsg } from '../shared/protocol';

describe('power table', () => {
  it('has 21 powers whose chances add up to 100', () => {
    expect(Object.keys(POWERS).length).toBe(21);
    expect(Object.values(POWERS).reduce((a: number, p: any) => a + p.chance, 0)).toBe(100);
  });
  it('has two slots', () => expect(MAX_ITEMS).toBe(2));
  it('rolls every power with the same chances whatever your position', () => {
    S.racers = [{ dist: 10 }, { dist: 5 }, { dist: 1 }];
    const seen = new Set<string>(); for (let i = 0; i < 4000; i++) seen.add(rollItem());
    expect(seen.size).toBe(21);
  });
});

describe('stacking', () => {
  beforeEach(() => { S.items = newItems(); });
  it('slows take the strongest, never multiply', () => {
    S.items.slow = [{ k: 'ink', t: 2, mul: HIT.ink.mul }, { k: 'storm', t: 2, mul: HIT.storm.mul }];
    expect(slowMul()).toBeCloseTo(0.7);
    S.items.slow.push({ k: 'torpedo', t: 1, mul: HIT.torpedo.mul });
    expect(slowMul()).toBeCloseTo(0.6);
  });
  it('an expired slow no longer counts', () => { S.items.slow = [{ k: 'ink', t: 0, mul: 0.7 }]; expect(slowMul()).toBe(1); });
  it('same curse on a rival refreshes its timer instead of stacking', () => {
    const r: any = { speed: 10, dist: 0 }, a: any = { dist: 0 };
    botHit(r, 'ink', a); r.fx[0].t = 1; botHit(r, 'ink', a);
    expect(r.fx.length).toBe(1); expect(r.fx[0].t).toBe(HIT.ink.dur); expect(botMul(r)).toBeCloseTo(0.7);
  });
  it('a rival shield blocks one hit', () => {
    const r: any = { speed: 10, dist: 0, shield: true };
    expect(botHit(r, 'ink', { dist: 0 })).toBe(false); expect(r.shield).toBe(false); expect(botHit(r, 'ink', { dist: 0 })).toBe(true);
  });
  it('swap exchanges distances', () => {
    const lead: any = { dist: 100 }, me: any = { dist: 40 }; botHit(lead, 'swap', me);
    expect(me.dist).toBe(100); expect(lead.dist).toBe(40);
  });
});

describe('attacks over the network', () => {
  it('relay an attack only to the target player, and only during a race', () => {
    const out: Record<string, ServerMsg[]> = { a: [], b: [], c: [] };
    const rooms = new Rooms((id, m) => out[id].push(m));
    rooms.handle('a', { t: 'create', name: 'A', av: 0 });
    const code = (out.a.filter((m) => m.t === 'room').pop() as any).room.code;
    rooms.handle('b', { t: 'join', code, name: 'B', av: 1 }); rooms.handle('c', { t: 'join', code, name: 'C', av: 2 });
    rooms.handle('a', { t: 'attack', to: 'b', k: 'ink' }); expect(out.b.some((m) => m.t === 'attack')).toBe(false);
    for (const id of ['a', 'b', 'c']) { rooms.handle(id, { t: 'pick', ride: 'x' }); rooms.handle(id, { t: 'vote', map: 0, wx: 0, diff: 1 }); rooms.handle(id, { t: 'ready', ready: true }); }
    rooms.handle('a', { t: 'attack', to: 'b', k: 'ink' });
    expect(out.b.filter((m) => m.t === 'attack')).toEqual([{ t: 'attack', from: 'a', k: 'ink', d: undefined, refl: false }]);
    expect(out.c.some((m) => m.t === 'attack')).toBe(false);
    rooms.handle('a', { t: 'attack', to: 'a', k: 'ink' }); expect(out.a.some((m) => m.t === 'attack')).toBe(false);
  });
});
