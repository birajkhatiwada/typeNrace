// @ts-nocheck
import { S } from '../core/state';
import { RIDES, RIVALS } from '../config/rides';
import { MAPS, WEATHERS } from '../config/maps';
import { me, rivals } from '../core/player';

export function rollBotVotes() { S.botVote = RIVALS.map(() => ({ map: Math.floor(Math.random() * MAPS.length), wx: Math.floor(Math.random() * WEATHERS.length), diff: Math.floor(Math.random() * 3) })); S.tieSeed = Math.random(); }

export function voters() { const m = me(); return [{ key: 'you', av: m.av, color: m.color, ...S.myVote }].concat(rivals().map((r, i) => ({ key: r.name, av: r.av, color: r.color, ...S.botVote[i] })).filter((v, i) => !S.room || S.room.members[i].voted)); }

export function tally(kind, n) {
  const counts = new Array(n).fill(0); voters().forEach((v) => { counts[v[kind]]++; });
  const top = Math.max(...counts), ties = counts.map((c, i) => (c === top ? i : -1)).filter((i) => i >= 0);
  return { counts, lead: ties[Math.floor(S.tieSeed * ties.length) % ties.length] };
}

export function botRideList(forceBots) {
  if (!forceBots && S.room && S.room.online) return S.room.members.map((m) => RIDES.find((r) => r.id === m.rideId) || RIDES.find((r) => r.id !== S.selectedRide.id));
  const out = [], river = S.MAP && S.MAP.style === 'river';
  RIVALS.forEach((rv, n) => {
    const prefs = river ? { Mira: ['marlin', 'wave', 'storm', 'jet', 'comet'], Pip: ['jet', 'sail', 'comet', 'wave', 'storm'], Jonas: ['tug', 'comet', 'sail', 'storm', 'wave'] }[rv.name] : rv.pref;
    const id = prefs.find((x) => x !== S.selectedRide.id && !out.some((r) => r.id === x));
    out.push(RIDES.find((r) => r.id === id) || RIDES.find((r) => r.id !== S.selectedRide.id && !out.includes(r)));
  });
  return out;
}

