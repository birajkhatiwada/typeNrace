// @ts-nocheck
// One table for every power. Chances are the same for every racer in every position (they add up to 100).
// kind: 'self' = affects you, 'ahead' = racer just ahead, 'ahead2' = two racers ahead, 'lead' = 1st place, 'all' = everyone ahead.

export const POWERS = {
  turbo:       { name: 'Turbo',          chance: 6, kind: 'self',   text: 'Speed burst for 2.5s' },
  triple:      { name: 'Triple Turbo',   chance: 3, kind: 'self',   text: '3 speed bursts, one every 3.2s' },
  nitro:       { name: 'Nitro Words',    chance: 6, kind: 'self',   text: 'Every word pushes 2x for 5s' },
  skip:        { name: 'Skip Word',      chance: 5, kind: 'self',   text: 'Finishes your current word, clean' },
  lucky:       { name: 'Lucky Box',      chance: 5, kind: 'self',   text: 'A random power (20% chance of two)' },
  shield:      { name: 'Shield',         chance: 7, kind: 'self',   text: 'Blocks the next attack on you' },
  mirror:      { name: 'Mirror',         chance: 5, kind: 'self',   text: 'Reflects the next attack back' },
  autocorrect: { name: 'Autocorrect',    chance: 6, kind: 'self',   text: 'Forgives your next 3 typos' },
  freeze:      { name: 'Time Freeze',    chance: 5, kind: 'self',   text: '4s with no typo penalty or slowdown' },
  cleanse:     { name: 'Cleanse',        chance: 5, kind: 'self',   text: 'Removes every bad effect on you' },
  easy:        { name: 'Easy Mode',      chance: 5, kind: 'self',   text: 'Your next 3 words are short' },
  magnet:      { name: 'Magnet',         chance: 2, kind: 'self',   text: '9s: boxes and gold words come to you' },
  ink:         { name: 'Ink Blot',       chance: 7, kind: 'ahead',  text: 'Racer just ahead: 70% speed for 3s' },
  torpedo:     { name: 'Torpedo',        chance: 6, kind: 'lead',   text: '1st place: speed halved, then 60% for 2.5s' },
  scramble:    { name: 'Scramble',       chance: 5, kind: 'ahead',  text: 'Racer ahead: next 3 words scrambled' },
  fog:         { name: 'Fog Bank',       chance: 4, kind: 'ahead2', text: 'Two racers ahead: words hidden for 3.5s' },
  hard:        { name: 'Hard Mode',      chance: 4, kind: 'ahead',  text: 'Racer ahead: next 4 words are long' },
  caps:        { name: 'Caps Lock Curse', chance: 5, kind: 'ahead', text: 'Racer ahead: next 3 words in ALL CAPS' },
  twice:       { name: 'Twice Curse',    chance: 5, kind: 'ahead',  text: 'Racer ahead: every letter twice for 4s' },
  storm:       { name: 'Lightning Storm', chance: 3, kind: 'all',   text: 'Everyone ahead: 80% speed for 3s' },
  swap:        { name: 'Swap Places',    chance: 1, kind: 'lead',   text: 'Swap places with 1st' },
};

export const ITEM_NAMES = Object.fromEntries(Object.entries(POWERS).map(([k, v]) => [k, v.name]));
export const ITEM_TEXT = Object.fromEntries(Object.entries(POWERS).map(([k, v]) => [k, v.text]));
export const ITEM_POOL = Object.fromEntries(Object.entries(POWERS).map(([k, v]) => [k, v.chance]));
export const isAttack = (k) => POWERS[k] && POWERS[k].kind !== 'self';

/** What each hit does to whoever receives it. dur seconds, mul = speed multiplier. Same for every racer. */
export const HIT = {
  ink:      { dur: 3,   mul: 0.7 },
  torpedo:  { dur: 2.5, mul: 0.6, jolt: 0.5 },
  storm:    { dur: 3,   mul: 0.8 },
  fog:      { dur: 3.5 },
  twice:    { dur: 4 },
  scramble: { words: 3 },
  hard:     { words: 4 },
  caps:     { words: 3 },
  swap:     {},
};
/** Rivals (bots) do not type, so word curses slow them like this instead. */
export const BOT_WORD_CURSE = { dur: 4, mul: 0.7 };
export const BOT_FALLBACK = { fog: { dur: 3.5, mul: 0.7 }, twice: { dur: 4, mul: 0.65 } };

export const MAX_ITEMS = 2;
export const SLOW_KINDS = ['ink', 'torpedo', 'storm'];
export const CURSE_MODES = ['scr', 'hard', 'caps'];

export const newItems = () => ({ list: [], shieldOn: false, mirrorOn: false, autoN: 0, nitroT: 0, magnetT: 0, freezeT: 0, fogT: 0, twiceT: 0, tripleN: 0, tripleT: 0, slow: [], hitLog: [], roll: null });
