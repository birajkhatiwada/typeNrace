// @ts-nocheck
import { S } from '../core/state';
import { RIVALS } from '../config/rides';
import { rollBotVotes } from './voting';
import { applyVotes } from '../ui/garage';
import { audioStart } from '../audio/audio';
import { startRace } from '../race/setup';
import { $, esc } from '../utils/helpers';

export const closedRooms = new Set();

export const mkCode = () => { const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let c = ''; for (let i = 0; i < 7; i++) c += A[Math.floor(Math.random() * A.length)]; return c.slice(0, 4) + '-' + c.slice(4); };

export function closeRoomTimer() { if (S.roomTimer) { clearInterval(S.roomTimer); S.roomTimer = 0; } }

export function openRoom(code, joining) {
  closeRoomTimer();
  const members = RIVALS.map((rv, i) => {
    const joinAt = joining ? (i === 0 ? -9 : i === 1 ? -3 : 0.6 + Math.random() * 2.2) : 0.6 + i * 0.9 + Math.random() * 2.2;
    const pickAt = joinAt + 1 + Math.random() * 2.5;
    return { rv, joinAt, pickAt, voteAt: pickAt + 0.3 + Math.random() * 1.5, readyAt: pickAt + 1.5 + Math.random() * 4, joined: false, picked: false, voted: false, ready: false };
  });
  S.room = { code, members, t0: performance.now() / 1000, ready: false, started: false };
  rollBotVotes();
  S.roomTimer = setInterval(roomTick, 250); roomTick(); applyVotes();
}

export function roomTick() {
  if (!S.room || S.state !== 'garage') return;
  const t = performance.now() / 1000 - S.room.t0; let ch = false;
  S.room.members.forEach((m) => {
    if (!m.joined && t >= m.joinAt) { m.joined = true; ch = true; }
    if (m.joined && !m.picked && t >= m.pickAt) { m.picked = true; ch = true; }
    if (m.picked && !m.voted && t >= m.voteAt) { m.voted = true; ch = true; }
    if (m.voted && !m.ready && t >= m.readyAt) { m.ready = true; ch = true; }
  });
  if (ch) applyVotes();
  updateRoomUI();
  if (S.room.ready && S.room.members.every((m) => m.ready)) launchRoom();
}

function launchRoom() { closeRoomTimer(); closedRooms.add(S.room.code); S.room.started = true; audioStart(); startRace(); }

export function updateRoomUI() {
  if (!S.room) return;
  if (S.room.online) return updateOnlineRoomUI();
  const rc = $('rcTxt'); if (rc && rc.textContent !== S.room.code) rc.textContent = S.room.code;
  const joined = S.room.members.filter((m) => m.joined), wait = joined.filter((m) => !m.ready);
  const nReady = (S.room.ready ? 1 : 0) + joined.filter((m) => m.ready).length;
  const msg = $('roomMsg'); if (msg) msg.innerHTML = 'Race starts when everyone is ready<br><b>' + nReady + ' of ' + (joined.length + 1) + ' ready</b> &middot; up to 6 players<br><span>&#10003; ready &nbsp; &hellip; choosing</span>';
  const b = $('startBtn'), want = S.room.ready ? 'r' + (wait.length ? wait[0].rv.name : '') : 'o';
  if (b.dataset.s !== want) {
    b.dataset.s = want; b.classList.toggle('ready', S.room.ready);
    b.innerHTML = S.room.ready ? '<span class="k">&#10003;</span><span class="t">READY</span><span class="t wt">WAITING FOR<br>' + esc(wait.length ? wait[0].rv.name.toUpperCase() : 'PLAYERS') + '&hellip;</span>' : '<span class="k">A</span><span class="t">OK</span>';
  }
}


function updateOnlineRoomUI() {
  const rc = $('rcTxt'); if (rc && rc.textContent !== S.room.code) rc.textContent = S.room.code;
  const joined = S.room.members.filter((m) => m.joined), wait = joined.filter((m) => !m.ready);
  const alone = joined.length === 0;
  const nReady = (S.room.ready ? 1 : 0) + joined.filter((m) => m.ready).length;
  const msg = $('roomMsg');
  if (msg) msg.innerHTML = alone ? '<b>Waiting for friends&hellip;</b><br>Share the room code above.<br>You need at least 2 players to race.'
    : 'Race starts when everyone is ready<br><b>' + nReady + ' of ' + (joined.length + 1) + ' ready</b> &middot; up to 4 players<br><span>&#10003; ready &nbsp; &hellip; choosing</span>';
  const b = $('startBtn'), want = alone ? 'alone' : S.room.ready ? 'r' + (wait.length ? wait[0].rv.name : '') : 'o';
  if (b.dataset.s !== want) {
    b.dataset.s = want; b.classList.toggle('ready', S.room.ready && !alone); b.classList.toggle('off', alone);
    b.innerHTML = alone ? '<span class="k">A</span><span class="t">OK</span><span class="t wt">NEEDS 2+<br>PLAYERS</span>'
      : S.room.ready ? '<span class="k">&#10003;</span><span class="t">READY</span><span class="t wt">WAITING FOR<br>' + esc(wait.length ? wait[0].rv.name.toUpperCase() : 'PLAYERS') + '&hellip;</span>' : '<span class="k">A</span><span class="t">OK</span>';
  }
}
