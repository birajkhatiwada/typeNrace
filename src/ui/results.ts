// @ts-nocheck
import { S } from '../core/state';
import { $, esc, fmtTime, ordinal } from '../utils/helpers';
import { BLANK, thumbURL } from './garage';
import { el } from './hud';
import { sfx } from '../audio/audio';

export function showResults() {
  S.state = 'finished';
  const total = S.LAPS * S.TRACK_LEN;
  const rows = S.racers.map((r) => {
    let t = r.finished ? r.finishTime : S.raceTime + (total - r.dist) / Math.max(r.speed, 6);
    return { r, t, done: r.finished };
  }).sort((a, b) => a.t - b.t);
  const myRank = rows.findIndex((x) => x.r === S.player) + 1;
  const myTime = S.player.finishTime;
  let newBest = false;
  if (!S.best || myTime < S.best) { S.best = myTime; newBest = true; try { localStorage.setItem('turbotype-best-' + S.MAP.id, String(myTime)); } catch (e) { /* ignore */ } }
  const tot = S.stats.correct + S.stats.wrong;
  const acc = tot ? Math.round((S.stats.correct / tot) * 100) : 100;
  const avgWpm = Math.round(S.stats.correct / 5 / (myTime / 60));
  const ord = ordinal(myRank), mm = /^(\d+)(.*)$/.exec(ord) || [0, ord, ''];
  $('resPos').innerHTML = mm[1] + '<sup>' + mm[2] + '</sup>';
  const win = rows[0];
  $('resSub').innerHTML = myRank === 1 ? 'You won the race.' : 'Race finished in <b>' + fmtTime(myTime) + '</b>.<br>' + esc(win.r.name) + ' won by ' + (myTime - win.t).toFixed(1) + ' seconds.';
  $('resTrack').textContent = S.MAP.name + ' \u00b7 ' + S.LAPS + ' laps';
  $('resCar').src = thumbURL[S.selectedRide.id] || BLANK;
  let html = '';
  rows.forEach((x, n) => {
    const gap = n === 0 ? 'WINNER' : (x.done ? '+' : '~+') + (x.t - win.t).toFixed(1) + 's';
    html += '<div class="rr' + (x.r.isPlayer ? ' me' : '') + '" style="--c:' + x.r.color + '"><em>' + (n + 1) + '</em><i style="background:linear-gradient(135deg,' + x.r.color + ',' + x.r.color + '88)"><img alt="" src="' + (thumbURL[x.r.ride.id] || BLANK) + '"></i><span class="nm">' + esc(x.r.name) + '</span><u>' + (x.done ? '' : '~') + fmtTime(x.r.isPlayer ? myTime : x.t) + '</u><s>' + gap + '</s></div>';
  });
  $('resRows').innerHTML = html;
  $('resWpm').textContent = String(avgWpm);
  $('resAcc').textContent = acc + '%';
  $('resBest').textContent = S.best ? fmtTime(S.best) : '-';
  $('resBestLab').textContent = 'Best time'; $('resNew').hidden = !newBest;
  el.results.hidden = false;
  el.race.hidden = false; el.race.querySelector('.fit').style.display = 'none';
  el.panel.style.display = 'none';
  sfx('item');
}

