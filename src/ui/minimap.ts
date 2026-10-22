// @ts-nocheck
import { S } from '../core/state';
import { $ } from '../utils/helpers';
import { PTS, pointAt } from '../world/tracks/track';

function buildMini() {
  const cv = $('mini'); if (!cv) return;
  let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
  for (const q of PTS) { x0 = Math.min(x0, q.x); x1 = Math.max(x1, q.x); z0 = Math.min(z0, q.z); z1 = Math.max(z1, q.z); }
  const maxW = 214, maxH = 134, pad = 12;
  const sc = Math.min((maxW - 2 * pad) / (x1 - x0), (maxH - 2 * pad) / (z1 - z0));
  const w = Math.round((x1 - x0) * sc + 2 * pad), h = Math.round((z1 - z0) * sc + 2 * pad), dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.style.width = w + 'px'; cv.style.height = h + 'px'; cv.width = w * dpr; cv.height = h * dpr;
  const P = (q) => [(q.x - x0) * sc + pad, (q.z - z0) * sc + pad];
  const bg = document.createElement('canvas'); bg.width = cv.width; bg.height = cv.height;
  const g = bg.getContext('2d'); g.scale(dpr, dpr); g.lineJoin = 'round'; g.lineCap = 'round';
  const trace = () => { g.beginPath(); PTS.forEach((q, i) => { const [x, y] = P(q); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.closePath(); };
  trace(); g.strokeStyle = '#f6f3ff'; g.lineWidth = 9; g.stroke();
  trace(); g.strokeStyle = '#2d2559'; g.lineWidth = 5.5; g.stroke();
  // start/finish tick
  const a = P(PTS[0]); g.fillStyle = '#ffd23f'; g.fillRect(a[0] - 5, a[1] - 5, 10, 3);
  S.mini = { cv, bg, P, dpr, w, h, key: S.MAP.id };
}

export function drawMini() {
  if (!S.mini || S.mini.key !== S.MAP.id) buildMini();
  if (!S.mini) return;
  const c = S.mini.cv.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, S.mini.cv.width, S.mini.cv.height); c.drawImage(S.mini.bg, 0, 0);
  c.scale(S.mini.dpr, S.mini.dpr);
  const order = S.racers.slice().sort((a, b) => (a.isPlayer ? 1 : 0) - (b.isPlayer ? 1 : 0));
  for (const r of order) {
    const p = pointAt(r.dist); const [x, y] = S.mini.P(p);
    const rad = r.isPlayer ? 6.5 : 5;
    c.beginPath(); c.arc(x, y, rad, 0, 6.2832); c.fillStyle = r.color; c.fill(); c.lineWidth = r.isPlayer ? 2.5 : 1.5; c.strokeStyle = '#ffffff'; c.stroke();
  }
}

