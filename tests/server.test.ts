import { describe, it, expect, beforeEach } from 'vitest';
import { Rooms } from '../server/rooms';
import type { ServerMsg, RoomView } from '../shared/protocol';

let out: Record<string, ServerMsg[]>; let rooms: Rooms;
const last = (id: string): RoomView => [...out[id]].reverse().find((m) => m.t === 'room')!.room;
const errs = (id: string) => out[id].filter((m) => m.t === 'error');
const setup = (rnd?: () => number) => { out = { a: [], b: [], c: [] }; rooms = new Rooms((id, m) => (out[id] ||= []).push(m), rnd); };
const lobby = () => { rooms.handle('a', { t: 'create', name: 'A', av: 0 }); const code = last('a').code; rooms.handle('b', { t: 'join', code, name: 'B', av: 1 }); return code; };
const readyUp = (id: string, ride = 'x', map = 0) => { rooms.handle(id, { t: 'pick', ride }); rooms.handle(id, { t: 'vote', map, wx: 0 }); rooms.handle(id, { t: 'ready', ready: true }); };

beforeEach(() => setup());

describe('rooms', () => {
  it('creates a room with a formatted code and joins by code (case-insensitive)', () => {
    rooms.handle('a', { t: 'create', name: 'A', av: 0 });
    expect(last('a').code).toMatch(/^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{3}$/);
    rooms.handle('b', { t: 'join', code: last('a').code.toLowerCase(), name: 'B', av: 1 });
    expect(last('a').players.length).toBe(2);
  });
  it('rejects unknown codes', () => {
    rooms.handle('b', { t: 'join', code: 'NOPE-123', name: 'B', av: 0 });
    expect(errs('b')[0]).toMatchObject({ code: 'no_room' });
  });
  it('does not start with one player, and a newcomer who is not ready blocks the start', () => {
    rooms.handle('a', { t: 'create', name: 'A', av: 0 }); readyUp('a');
    expect(last('a').phase).toBe('lobby');
    rooms.handle('b', { t: 'join', code: last('a').code, name: 'B', av: 1 });
    expect(last('a').phase).toBe('lobby');
    readyUp('b'); expect(last('a').phase).toBe('racing');
  });
  it('starts when all are ready, and nobody can join afterwards', () => {
    const code = lobby(); readyUp('a'); expect(last('a').phase).toBe('lobby'); readyUp('b');
    expect(last('a').phase).toBe('racing'); expect(last('a').start).toBeDefined();
    rooms.handle('c', { t: 'join', code, name: 'C', av: 2 });
    expect(errs('c')[0]).toMatchObject({ code: 'room_started' });
  });
  it('cannot ready without a ride and a vote; changing ride clears ready', () => {
    lobby(); rooms.handle('a', { t: 'ready', ready: true });
    expect(last('a').players[0].ready).toBe(false);
    readyUp('a'); expect(last('a').players[0].ready).toBe(true);
    rooms.handle('a', { t: 'pick', ride: 'y' }); expect(last('a').players[0].ready).toBe(false);
  });
  it('map vote follows the majority', () => {
    rooms.handle('a', { t: 'create', name: 'A', av: 0 }); const code = last('a').code;
    ['b', 'c'].forEach((id) => rooms.handle(id, { t: 'join', code, name: id, av: 0 }));
    readyUp('a', 'x', 0); readyUp('b', 'y', 2); readyUp('c', 'z', 2);
    expect(last('a').start!.map).toBe(2);
  });
  it('relays progress only during a race, to everyone else', () => {
    lobby(); const s = { dist: 5, speed: 1, lap: 1, key: 'a', status: [] };
    rooms.handle('a', { t: 'progress', s }); expect(out.b.some((m) => m.t === 'progress')).toBe(false);
    readyUp('a'); readyUp('b');
    rooms.handle('a', { t: 'progress', s });
    expect(out.b.filter((m) => m.t === 'progress').length).toBe(1);
    expect(out.a.some((m) => m.t === 'progress')).toBe(false);
  });
  it('finishes when everyone finishes; a leaver is not waited for', () => {
    lobby(); readyUp('a'); readyUp('b');
    rooms.handle('a', { t: 'finish', time: 60 }); expect(last('a').phase).toBe('racing');
    rooms.handle('b', { t: 'leave' }); expect(last('a').phase).toBe('finished');
  });
  it('host passes on and empty rooms are removed', () => {
    lobby(); rooms.handle('a', { t: 'leave' }); expect(last('b').host).toBe('b');
    rooms.handle('b', { t: 'leave' }); expect(rooms.size).toBe(0);
  });
  it('enforces the 4-player cap', () => {
    out.d = []; out.e = []; out.f = []; out.g = [];
    rooms.handle('a', { t: 'create', name: 'A', av: 0 }); const code = last('a').code;
    ['b', 'c', 'd'].forEach((id) => rooms.handle(id, { t: 'join', code, name: id, av: 0 }));
    rooms.handle('g', { t: 'join', code, name: 'g', av: 0 });
    expect(errs('g')[0]).toMatchObject({ code: 'room_full' });
  });
});
