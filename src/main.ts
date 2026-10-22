// @ts-nocheck
import { boot } from './core/boot';
import { $ } from './utils/helpers';

boot().catch((e) => { const l = $('loading'); if (l) { l.textContent = 'Could not start the game: ' + (e && e.message ? e.message : e); } console.error(e); });

