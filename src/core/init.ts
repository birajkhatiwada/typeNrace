// @ts-nocheck
import { S } from './state';
import { buildTrack } from '../world/tracks/track';
import { loadBest } from '../storage/best';
import { layout } from '../render/layout';

/** Work that used to run at import time: called once from boot(). */
export function runInit() {
  buildTrack(S.MAP);
  ['turbo','triple','nitro','magnet','shield','mirror','autocorrect','ink','torpedo','scramble','fog','hard','easy','freeze','lucky'].forEach((k) => { new Image().src = 'cards/art_' + k + '.webp'; });
  loadBest();
  window.addEventListener('resize', layout);
}
