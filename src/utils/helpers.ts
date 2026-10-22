
export const $ = (id: string) => document.getElementById(id) as HTMLElement;

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function mulberry(seed: number) { return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export const fmtTime = (t: number) => { const m = Math.floor(t / 60); const s = t - m * 60; return String(m).padStart(2, '0') + ':' + s.toFixed(1).padStart(4, '0'); };

export const ordinal = (n: number) => ['1ST', '2ND', '3RD', '4TH'][n - 1] || n + 'TH';

