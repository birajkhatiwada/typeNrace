// @ts-nocheck
// Online lobby + race sync. Adapts server RoomView into the S.room shape the (offline) lobby UI already renders.
import { S } from '../core/state';
import { net } from './client';
import { MAPS, WEATHERS } from '../config/maps';
import { AVS, BGS } from '../config/avatars';
import { buildTrack } from '../world/tracks/track';
import { showScreen } from '../ui/hud';
import { toast } from '../ui/toast';
import { applyVotes, renderRideCards } from '../ui/garage';
import { updateRoomUI, closeRoomTimer } from '../rooms/room';
import { startRace } from '../race/setup';
import { audioStart } from '../audio/audio';
import { layout } from '../render/layout';
import { loadBest } from '../storage/best';
import type { RoomView, ServerMsg } from '../../shared/protocol';

export const serverUrl = (): string | null => {
  try { return new URLSearchParams(location.search).get('server') || (window as any).TURBO_SERVER || (import.meta as any).env?.VITE_SERVER_URL || null; } catch { return null; }
};

/** Poke the server's HTTP endpoint early so a sleeping free-tier server wakes while the player types their name. */
export function prewarm() {
  const u = serverUrl(); if (!u) return;
  try { fetch(u.replace(/^ws/, 'http') + '/health', { mode: 'no-cors' }).catch(() => {}); } catch { /* ignore */ }
}
export const onlineEnabled = () => !!serverUrl();

let wired = false;
let pending: { resolve: () => void; reject: (e: Error) => void } | null = null;
let sent = { ride: '', map: -1, wx: -1 };
let lastSend = 0;

function wire() {
  if (wired) return; wired = true;
  net.onMessage(handle);
  net.onClose(() => {
    if (!S.room || !S.room.online) return;
    S.room = null; S.onlineLeft = true;
    if (S.state !== 'profile') { S.state = 'profile'; showScreen('profile'); }
    toast('Connection lost', '#b8860b');
  });
}

const pad = (n: number) => Math.max(0, n);
const rivalOf = (p: any) => (p
  ? { name: p.name, av: AVS[p.av % AVS.length], color: BGS[p.av % BGS.length], pid: p.id, wpm: 0, pref: [] }
  : { name: 'Player', av: '', color: '#555', pid: null, wpm: 0, pref: [] });

function handle(m: ServerMsg) {
  if (m.t === 'error') { if (pending) { pending.reject(new Error(m.msg)); pending = null; } else toast(m.msg, '#b8860b'); return; }
  if (m.t === 'room') { applyRoom(m.room); if (pending) { pending.resolve(); pending = null; } return; }
  if (m.t === 'left') {
    const r = (S.onlineRivals || []).find((x: any) => x.pid === m.id);
    if (r) toast(r.name + ' left the room', '#c0392b');
    const rc = S.racers && S.racers.find((x: any) => x.pid === m.id);
    if (rc) { rc.netSpeed = 0; rc.left = true; }
    return;
  }
  if (m.t === 'progress') {
    const rc = S.racers && S.racers.find((x: any) => x.pid === m.id);
    if (rc) { rc.netDist = m.s.dist; rc.netSpeed = m.s.speed; }
    return;
  }
  if (m.t === 'finish') {
    const rc = S.racers && S.racers.find((x: any) => x.pid === m.id);
    if (rc) { rc.netFinish = m.time; if (rc.finished) rc.finishTime = m.time; }
  }
}

function applyRoom(v: RoomView) {
  const others = v.players.filter((p) => p.id !== net.id);
  const mine = v.players.find((p) => p.id === net.id);
  S.onlineRivals = [0, 1, 2].map((i) => rivalOf(others[i]));
  const wasStarted = S.room && S.room.started;
  S.room = {
    code: v.code, online: true, host: v.host === net.id, t0: 0,
    ready: !!(mine && mine.ready), started: v.phase !== 'lobby',
    members: [0, 1, 2].map((i) => { const p = others[i]; return { rv: S.onlineRivals[i], joined: !!p, picked: !!(p && p.ride), voted: !!(p && p.vote), ready: !!(p && p.ready), rideId: p && p.ride }; })
  };
  S.botVote = [0, 1, 2].map((i) => ({ map: (others[i] && others[i].vote && others[i].vote.map) || 0, wx: (others[i] && others[i].vote && others[i].vote.wx) || 0 }));
  S.tieSeed = 0.5;
  if (v.phase === 'racing' && v.start && S.state === 'garage' && !wasStarted) { launch(v); return; }
  if (S.state === 'garage') { applyVotes(); updateRoomUI(); syncMine(); }
}

/** Push my ride/map/weather choice to the server when it changed. */
export function syncMine() {
  if (!S.room || !S.room.online || S.room.started || !net.open) return;
  const ride = S.selectedRide && S.selectedRide.id;
  if (ride && ride !== sent.ride) { sent.ride = ride; net.send({ t: 'pick', ride }); }
  if (S.myVote.map !== sent.map || S.myVote.wx !== sent.wx) { sent.map = S.myVote.map; sent.wx = S.myVote.wx; net.send({ t: 'vote', map: sent.map, wx: sent.wx }); }
}

export function setReady(ready: boolean) { net.send({ t: 'ready', ready }); }

function launch(v: RoomView) {
  closeRoomTimer();
  const map = MAPS[v.start.map]; if (!S.MAP || S.MAP.id !== map.id) { buildTrack(map); loadBest(); }
  S.WX = WEATHERS[v.start.wx].id;
  audioStart(); startRace();
}

/** Create or join a room on the server, then show the garage. Rejects with a readable message. */
export async function enterOnline(kind: 'create' | 'join', code?: string) {
  wire();
  if (!net.open) {
    const hint = setInterval(() => toast('Waking up the game server\u2026 this can take about a minute', '#b8860b'), 1500);
    try { await net.connect(serverUrl()!); } finally { clearInterval(hint); }
  }
  sent = { ride: '', map: -1, wx: -1 };
  const p = S.profile;
  const done = new Promise<void>((resolve, reject) => { pending = { resolve, reject }; });
  S.state = 'garage';
  if (kind === 'create') net.send({ t: 'create', name: (p.name || 'You').trim() || 'You', av: p.av });
  else net.send({ t: 'join', code: code!, name: (p.name || 'You').trim() || 'You', av: p.av });
  try { await done; } catch (e) { S.state = 'profile'; throw e; }
  showScreen('garage'); layout(); applyVotes(); updateRoomUI(); syncMine();
}

export function leaveOnline() { if (net.open) net.send({ t: 'leave' }); S.room = null; }

/** Called every frame during a race: ~10 updates/sec of my progress. */
export function netTick(dt: number) {
  if (!S.room || !S.room.online || !S.player) return;
  const now = performance.now(); if (now - lastSend < 100) return; lastSend = now;
  const lap = Math.min(S.LAPS, 1 + Math.floor(Math.max(0, S.player.dist) / S.TRACK_LEN));
  net.send({ t: 'progress', s: { dist: S.player.dist, speed: S.player.eff || 0, lap, key: '', status: [] } });
  if (S.player.finished && !S.player.netSent) { S.player.netSent = true; net.send({ t: 'finish', time: S.player.finishTime }); }
}
