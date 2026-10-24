import { MAX_PLAYERS, type PlayerView, type RoomView, type ServerMsg, type ClientMsg } from '../shared/protocol';

const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export function makeCode(rnd: () => number = Math.random): string {
  let c = ''; for (let i = 0; i < 7; i++) c += ALPHA[Math.floor(rnd() * ALPHA.length)];
  return c.slice(0, 4) + '-' + c.slice(4);
}

type Send = (id: string, m: ServerMsg) => void;
interface Room { code: string; phase: RoomView['phase']; host: string; players: Map<string, PlayerView>; start?: RoomView['start']; finished: Set<string>; again: Set<string>; round: number; }

/** All lobby rules live here, free of sockets, so they can be unit-tested. */
export class Rooms {
  private rooms = new Map<string, Room>();
  private where = new Map<string, string>(); // player id -> room code
  constructor(private send: Send, private rnd: () => number = Math.random) {}

  private view(r: Room): RoomView {
    return { code: r.code, phase: r.phase, round: r.round, host: r.host, players: [...r.players.values()].map((p) => ({ ...p, again: r.again.has(p.id) })), start: r.start };
  }
  private broadcast(r: Room) { const v = this.view(r); r.players.forEach((_, id) => this.send(id, { t: 'room', room: v })); }
  private err(id: string, code: Extract<ServerMsg, { t: 'error' }>['code'], msg: string) { this.send(id, { t: 'error', code, msg }); }
  private room(id: string) { const c = this.where.get(id); return c ? this.rooms.get(c) : undefined; }

  handle(id: string, m: ClientMsg) {
    switch (m.t) {
      case 'create': {
        this.leave(id);
        let code = makeCode(this.rnd); while (this.rooms.has(code)) code = makeCode(this.rnd);
        const r: Room = { code, phase: 'lobby', host: id, players: new Map(), finished: new Set(), again: new Set(), round: 0 };
        this.rooms.set(code, r); this.add(r, id, m.name, m.av); return;
      }
      case 'join': {
        const r = this.rooms.get(m.code.toUpperCase());
        if (!r) return this.err(id, 'no_room', 'No room with that code');
        if (r.phase !== 'lobby') return this.err(id, 'room_started', 'That race has already started');
        if (r.players.size >= MAX_PLAYERS) return this.err(id, 'room_full', 'Room is full');
        this.leave(id); this.add(r, id, m.name, m.av); return;
      }
      case 'leave': return this.leave(id);
      case 'pick': case 'vote': case 'ready': {
        const r = this.room(id), p = r?.players.get(id);
        if (!r || !p) return this.err(id, 'not_in_room', 'Not in a room');
        if (r.phase !== 'lobby') return; // frozen once the race starts
        if (m.t === 'pick') { p.ride = m.ride; p.ready = false; }
        if (m.t === 'vote') p.vote = { map: m.map, wx: m.wx, diff: m.diff, laps: typeof m.laps === 'number' && isFinite(m.laps) ? Math.max(1, Math.min(9, Math.round(m.laps))) : undefined };
        if (m.t === 'ready') p.ready = m.ready && !!p.ride && !!p.vote;
        this.maybeStart(r); this.broadcast(r); return;
      }
      case 'progress': {
        const r = this.room(id); if (!r || r.phase !== 'racing') return;
        r.players.forEach((_, o) => { if (o !== id) this.send(o, { t: 'progress', id, s: m.s }); }); return;
      }
      case 'attack': {   // a power used on another racer: relay it to that player only
        const r = this.room(id); if (!r || r.phase !== 'racing' || !r.players.has(m.to) || m.to === id) return;
        this.send(m.to, { t: 'attack', from: id, k: String(m.k).slice(0, 16), d: typeof m.d === 'number' ? m.d : undefined, refl: !!m.refl }); return;
      }
      case 'finish': {
        const r = this.room(id); if (!r || r.phase !== 'racing') return;
        r.finished.add(id); r.players.forEach((_, o) => { if (o !== id) this.send(o, { t: 'finish', id, time: m.time }); });
        if (r.finished.size >= r.players.size) { r.phase = 'finished'; this.maybeRematch(r); this.broadcast(r); } return;
      }
      case 'rematch': {
        const r = this.room(id); if (!r || r.phase === 'lobby') return;
        r.again.add(id); this.maybeRematch(r); this.broadcast(r); return;
      }
      default: this.err(id, 'bad_msg', 'Unknown message');
    }
  }

  private add(r: Room, id: string, name: string, av: number) {
    r.players.set(id, { id, name: String(name).slice(0, 16) || 'Player', av: av | 0, ride: null, vote: null, ready: false, again: false });
    this.where.set(id, r.code); this.broadcast(r);
  }

  /** Race starts when 2+ players are present and all are ready. Map/weather = plurality of votes, random tie-break. */
  private maybeStart(r: Room) {
    const ps = [...r.players.values()];
    if (ps.length < 2 || !ps.every((p) => p.ready)) return;
    const pickWin = (k: 'map' | 'wx' | 'diff') => {
      const c = new Map<number, number>(); ps.forEach((p) => c.set(p.vote![k], (c.get(p.vote![k]) || 0) + 1));
      const top = Math.max(...c.values()), tied = [...c].filter(([, n]) => n === top).map(([v]) => v);
      return tied[Math.floor(this.rnd() * tied.length)];
    };
    r.start = { map: pickWin('map'), wx: pickWin('wx'), diff: pickWin('diff'), seed: Math.floor(this.rnd() * 2 ** 31), laps: r.players.get(r.host)?.vote?.laps }; // the host decides the lap count
    r.phase = 'racing'; r.round++;
  }

  /** Rematch: once the race is over and every player still here asked for it, restart together with the same ride/map/weather. */
  private maybeRematch(r: Room) {
    if (r.phase !== 'finished' || !r.players.size || ![...r.players.keys()].every((id) => r.again.has(id))) return;
    r.start = { ...r.start!, seed: Math.floor(this.rnd() * 2 ** 31) };
    r.phase = 'racing'; r.round++; r.finished.clear(); r.again.clear();
  }

  leave(id: string) {
    const r = this.room(id); if (!r) return;
    r.players.delete(id); r.again.delete(id); r.finished.delete(id); this.where.delete(id);
    r.players.forEach((_, o) => this.send(o, { t: 'left', id }));
    if (!r.players.size) { this.rooms.delete(r.code); return; }
    if (r.host === id) r.host = r.players.keys().next().value as string;
    if (r.phase === 'lobby') this.maybeStart(r);
    else if (r.phase === 'racing' && [...r.players.keys()].every((p) => r.finished.has(p))) { r.phase = 'finished'; this.maybeRematch(r); } else if (r.phase === 'finished') this.maybeRematch(r);
    this.broadcast(r);
  }
  get size() { return this.rooms.size; }
}
