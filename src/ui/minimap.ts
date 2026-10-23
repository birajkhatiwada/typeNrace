// @ts-nocheck
import { S } from '../core/state';
import { $ } from '../utils/helpers';
import { PTS, pointAt } from '../world/tracks/track';
import { rankOf } from '../race/simulation';

/** A toy race track: gold kerb, asphalt, dashed centre line, checkered start, coloured racer dots. */
function buildMini() {
  const cv = $('mini'); if (!cv) return;
  let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
  for (const q of PTS) { x0 = Math.min(x0, q.x); x1 = Math.max(x1, q.x); z0 = Math.min(z0, q.z); z1 = Math.max(z1, q.z); }
  const maxW = 200, maxH = 130, pad = 20;
  const sc = Math.min((maxW - 2 * pad) / (x1 - x0), (maxH - 2 * pad) / (z1 - z0));
  const w = Math.round((x1 - x0) * sc + 2 * pad), h = Math.round((z1 - z0) * sc + 2 * pad), dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.style.width = w + 'px'; cv.style.height = h + 'px'; cv.width = w * dpr; cv.height = h * dpr;
  const P = (q) => [(q.x - x0) * sc + pad, (q.z - z0) * sc + pad];
  const bg = document.createElement('canvas'); bg.width = cv.width; bg.height = cv.height;
  const g = bg.getContext('2d'); g.scale(dpr, dpr); g.lineJoin = 'round'; g.lineCap = 'round';
  const trace = () => { g.beginPath(); PTS.forEach((q, i) => { const [x, y] = P(q); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.closePath(); };
  trace(); g.strokeStyle = '#14131f'; g.lineWidth = 17; g.stroke();
  trace(); g.strokeStyle = '#ffd23f'; g.lineWidth = 14; g.stroke();
  trace(); g.strokeStyle = '#3b3a55'; g.lineWidth = 10; g.stroke();
  trace(); g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 1.6; g.setLineDash([5, 6]); g.stroke(); g.setLineDash([]);
  // checkered start / finish line across the road
  const a = P(PTS[0]), b = P(PTS[1] || PTS[0]); const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  g.save(); g.translate(a[0], a[1]); g.rotate(ang);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) { g.fillStyle = (i + j) % 2 ? '#111' : '#fff'; g.fillRect(-3 + j * 3, -6 + i * 3, 3, 3); }
  g.restore();
  S.mini = { cv, bg, P, dpr, w, h, key: S.MAP.id };
}

export function drawMini() {
  if (!S.mini || S.mini.key !== S.MAP.id) buildMini();
  if (!S.mini) return;
  const c = S.mini.cv.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, S.mini.cv.width, S.mini.cv.height); c.drawImage(S.mini.bg, 0, 0);
  c.scale(S.mini.dpr, S.mini.dpr);
  const order = S.racers.slice().sort((a, b) => (a.isPlayer ? 1 : 0) - (b.isPlayer ? 1 : 0));
  for (const r of order) {
    const [x, y] = S.mini.P(pointAt(r.dist));
    if (r.isPlayer) {
      c.beginPath(); c.arc(x, y, 12, 0, 6.2832); c.fillStyle = r.color + '55'; c.fill();
      c.beginPath(); c.arc(x, y, 8, 0, 6.2832); c.fillStyle = r.color; c.fill(); c.lineWidth = 3; c.strokeStyle = '#fff'; c.stroke();
      c.fillStyle = '#fff'; c.font = '800 10px Poppins, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(rankOf(r)), x, y + 0.5);
      const tx = Math.min(S.mini.w - 18, Math.max(18, x)), ty = y - 17 < 8 ? y + 17 : y - 17;
      c.fillStyle = '#ffd23f'; c.beginPath(); c.roundRect(tx - 17, ty - 8, 34, 16, 8); c.fill();
      c.fillStyle = '#222'; c.font = '800 9px Poppins, sans-serif'; c.fillText('YOU', tx, ty + 0.5);
    } else {
      c.beginPath(); c.arc(x, y, 6, 0, 6.2832); c.fillStyle = r.color; c.fill(); c.lineWidth = 2.5; c.strokeStyle = '#fff'; c.stroke();
    }
  }
}
