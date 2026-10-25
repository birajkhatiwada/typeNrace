// @ts-nocheck
import { boot } from './core/boot';
import { $ } from './utils/helpers';

boot().catch((e) => { const l = $('loadMsg') || $('loading'); if (l) { l.textContent = 'Could not start the game: ' + (e && e.message ? e.message : e); const c = document.querySelector('.lw'); if (c) c.style.display = 'none'; } console.error(e); });

