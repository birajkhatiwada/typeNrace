// @ts-nocheck
import { S } from '../../core/state';
import { TILE } from '../../config/maps';
import { buildTrackGP } from './grandprix';
import { buildTrackC2 } from './skyway';

const EDGE_PAIRS = [[[-1, 0], [0, 1]], [[0, 1], [1, 0]], [[1, 0], [0, -1]], [[0, -1], [-1, 0]]];

export const same = (a, b) => a[0] === b[0] && a[1] === b[1];

function cornerRot(d, d2) {
  const a = [-d[0], -d[1]];
  for (let k = 0; k < 4; k++) { const [p, q] = EDGE_PAIRS[k]; if ((same(a, p) && same(d2, q)) || (same(a, q) && same(d2, p))) return k; }
  return 0;
}

export const PTS = [], CUM = [], SEGS = [], TAN = [];

export const BOUNDS = { minI: 0, maxI: 0, minJ: 0, maxJ: 0 };

export const cellCenter = (c) => [(c.i - (BOUNDS.minI + BOUNDS.maxI) / 2) * TILE * S.CELLF, (c.j - (BOUNDS.minJ + BOUNDS.maxJ) / 2) * TILE * S.CELLF];

export function buildTrack(map) {
  S.CELLF = map.cell || 1;
  if (map.kind === 'gp') { buildTrackGP(map); return; }
  if (map.kind === 'c2') { buildTrackC2(map); return; }
  S.START_OFFSET = 5 * S.CELLF;
  const pos = [];
  const vs = map.verts;
  BOUNDS.minI = Math.min(...vs.map((v) => v[0])); BOUNDS.maxI = Math.max(...vs.map((v) => v[0]));
  BOUNDS.minJ = Math.min(...vs.map((v) => v[1])); BOUNDS.maxJ = Math.max(...vs.map((v) => v[1]));
  for (let a = 0; a < vs.length; a++) {
    const [x0, y0] = vs[a], [x1, y1] = vs[(a + 1) % vs.length];
    const dx = Math.sign(x1 - x0), dy = Math.sign(y1 - y0), n = Math.abs(x1 - x0) + Math.abs(y1 - y0);
    for (let s = 0; s < n; s++) pos.push([x0 + dx * s, y0 + dy * s]);
  }
  const N = pos.length;
  const cells = pos.map((p, n) => {
    const pr = pos[(n - 1 + N) % N], nx = pos[(n + 1) % N];
    const d = [p[0] - pr[0], p[1] - pr[1]], d2 = [nx[0] - p[0], nx[1] - p[1]];
    const corner = !same(d, d2);
    return { i: p[0], j: p[1], d, d2, corner, k: corner ? cornerRot(d, d2) : 0 };
  });
  // flyovers: a cell visited twice is a crossing, the visit along z goes over the top
  const gy = map.biome === 'city' ? 0.2 : 0, hy = map.biome === 'city' ? 5.2 : 5.1, my = (gy + hy) / 2;
  cells.forEach((c) => { c.y0 = gy; c.y1 = gy; });
  const seen = {};
  cells.forEach((c, n) => { const k = c.i + ',' + c.j; (seen[k] = seen[k] || []).push(n); });
  for (const idxs of Object.values(seen)) {
    if (idxs.length !== 2) continue;
    const [a, b] = idxs; const e = cells[a].d[1] !== 0 ? a : b, g = e === a ? b : a;
    cells[e].cross = true; cells[e].elev = true; cells[g].cross = true;
    cells[e].y0 = cells[e].y1 = hy;
    const at = (o) => cells[(e + o + N * 4) % N];
    at(-2).ramp = 'up'; at(-2).rIdx = 0; at(-2).y1 = my; at(-1).ramp = 'up'; at(-1).rIdx = 1; at(-1).y0 = my; at(-1).y1 = hy;
    at(1).ramp = 'down'; at(1).rIdx = 0; at(1).y0 = hy; at(1).y1 = my; at(2).ramp = 'down'; at(2).rIdx = 1; at(2).y0 = my;
  }
  // start in the middle of the longest plain straight
  const plain = (c) => !c.corner && !c.ramp && !c.cross;
  let bestLen = 0, bestMid = 0;
  for (let s = 0; s < N; s++) {
    if (!plain(cells[s]) || plain(cells[(s - 1 + N) % N])) continue;
    let n = 0; while (plain(cells[(s + n) % N])) n++;
    if (n > bestLen) { bestLen = n; bestMid = (s + Math.floor(n / 2)) % N; }
  }
  S.CELLS = cells.slice(bestMid).concat(cells.slice(0, bestMid));
  PTS.length = 0; CUM.length = 0; SEGS.length = 0;
  const add = (x, z, y) => { const l = PTS[PTS.length - 1]; if (!l || Math.hypot(l.x - x, l.z - z) > 1e-4) PTS.push({ x, z, y: y || 0 }); };
  for (const c of S.CELLS) {
    const [cx, cz] = cellCenter(c);
    c.p0 = PTS.length;
    const H5 = 5 * S.CELLF;
    const ex = cx - c.d[0] * H5, ez = cz - c.d[1] * H5;
    const xx = cx + c.d2[0] * H5, xz = cz + c.d2[1] * H5;
    if (!c.corner) { add(ex, ez, c.y0); add(xx, xz, c.y1); }
    else {
      const ax = cx + (-c.d[0] + c.d2[0]) * H5, az = cz + (-c.d[1] + c.d2[1]) * H5;
      const a0 = Math.atan2(ez - az, ex - ax);
      let da = Math.atan2(xz - az, xx - ax) - a0;
      while (da > Math.PI) da -= 2 * Math.PI;
      while (da < -Math.PI) da += 2 * Math.PI;
      for (let s = 0; s <= 28; s++) { const a = a0 + (da * s) / 28; add(ax + H5 * Math.cos(a), az + H5 * Math.sin(a), c.y0); }
    }
    c.p1 = PTS.length - 1;
  }
  CUM.push(0);
  for (let n = 1; n < PTS.length; n++) CUM.push(CUM[n - 1] + Math.hypot(PTS[n].x - PTS[n - 1].x, PTS[n].z - PTS[n - 1].z));
  S.TRACK_LEN = CUM[CUM.length - 1];
  TAN.length = 0;
  for (let n = 0; n < PTS.length; n++) {
    const p = PTS[(n - 1 + PTS.length) % PTS.length], q = PTS[(n + 1) % PTS.length];
    const dx = q.x - p.x, dz = q.z - p.z, l = Math.hypot(dx, dz) || 1; TAN.push({ x: dx / l, z: dz / l });
  }
  for (const c of S.CELLS) SEGS.push({ a: CUM[c.p0], b: CUM[c.p1], corner: c.corner });
  S.MAP = map; S.LAPS = map.laps;
}

const _p = { x: 0, z: 0, y: 0, tx: 0, tz: 1, pitch: 0 };

export function pointAt(sGame) {
  let s = (sGame + S.START_OFFSET) % S.TRACK_LEN; if (s < 0) s += S.TRACK_LEN;
  let lo = 0, hi = CUM.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (CUM[m] <= s) lo = m; else hi = m; }
  const a = PTS[lo], b = PTS[lo + 1];
  const dx = b.x - a.x, dz = b.z - a.z, len = Math.hypot(dx, dz) || 1;
  const f = (s - CUM[lo]) / (CUM[lo + 1] - CUM[lo] || 1);
  _p.x = a.x + dx * f; _p.z = a.z + dz * f; _p.y = a.y + (b.y - a.y) * f; const t0 = TAN[lo], t1 = TAN[lo + 1]; let ux = t0.x + (t1.x - t0.x) * f, uz = t0.z + (t1.z - t0.z) * f; const ul = Math.hypot(ux, uz) || 1; _p.tx = ux / ul; _p.tz = uz / ul; _p.pitch = Math.atan2(b.y - a.y, len);
  return _p;
}

export function cornerAt(sGame) {
  let s = (sGame + S.START_OFFSET) % S.TRACK_LEN; if (s < 0) s += S.TRACK_LEN;
  for (const g of SEGS) if (s >= g.a && s <= g.b) return g.corner;
  return false;
}

