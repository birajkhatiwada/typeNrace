// @ts-nocheck
import { S } from '../core/state';
import { el } from './hud';

export function toast(msg, color) { el.toast.textContent = msg; el.toast.style.background = color; el.toast.className = 'toast show'; S.toastT = 1.6; }

