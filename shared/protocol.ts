// Messages shared by client and server. Every message is JSON: { t: <type>, ... }.

export const MAX_PLAYERS = 4; // the track grid has 4 starting slots
export type Phase = 'lobby' | 'racing' | 'finished';

export interface PlayerView {
  id: string; name: string; av: number;
  ride: string | null;      // picked ride id
  vote: { map: number; wx: number; diff: number } | null;
  ready: boolean;
  again: boolean;           // asked for a rematch
}
export interface RoomView {
  code: string; phase: Phase; round: number; host: string; players: PlayerView[];
  start?: { map: number; wx: number; diff: number; seed: number }; // seed also drives the shared word list // set when the race is starting
}
export interface RaceState { dist: number; speed: number; lap: number; key: string; status: string[]; }

// client -> server
export type ClientMsg =
  | { t: 'create'; name: string; av: number }
  | { t: 'join'; code: string; name: string; av: number }
  | { t: 'pick'; ride: string }
  | { t: 'vote'; map: number; wx: number; diff: number }
  | { t: 'ready'; ready: boolean }
  | { t: 'progress'; s: RaceState }
  | { t: 'finish'; time: number }
  | { t: 'attack'; to: string; k: string; d?: number; refl?: boolean }
  | { t: 'rematch' }
  | { t: 'leave' };

// server -> client
export type ServerMsg =
  | { t: 'hello'; id: string }
  | { t: 'room'; room: RoomView }
  | { t: 'error'; code: 'no_room' | 'room_started' | 'room_full' | 'bad_msg' | 'not_in_room'; msg: string }
  | { t: 'progress'; id: string; s: RaceState }
  | { t: 'finish'; id: string; time: number }
  | { t: 'attack'; from: string; k: string; d?: number; refl?: boolean }
  | { t: 'left'; id: string };
