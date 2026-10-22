# Turbotype

3D typing race game (three.js + TypeScript + Vite).

## Scripts
- `npm run dev` – dev server
- `npm run build` – production build to `dist/`
- `npm run typecheck` – `tsc --noEmit`
- `npm test` – Vitest unit tests

## Layout (src/)
config, utils, render, world (+tracks), vehicles, items, race, typing, core, ui, audio, rooms.
Most modules still carry `// @ts-nocheck`; typing them is done gradually (utils/helpers is fully typed).

CI: `.github/workflows/ci.yml` runs typecheck, test and build on every push/PR.

## Multiplayer server
`npm run server` (port 8787, PORT to override). Protocol in `shared/protocol.ts`; lobby rules in `server/rooms.ts` (pure, unit-tested).

## Playing online
Build/run the game, start the server (`npm run server`), then open the game with `?server=ws://localhost:8787` (for example `http://localhost:5173/?server=ws://localhost:8787`). Without `?server=` the game uses the offline simulated lobby. Max 4 players for now (4 grid slots).
