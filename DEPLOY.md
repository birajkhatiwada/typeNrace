# Deploying the multiplayer server on Render (free)

1. Put this project on GitHub (private is fine): `git init && git add . && git commit -m "Turbotype" && git remote add origin <your repo> && git push -u origin main`.
2. On render.com: **New → Blueprint**, pick the repo. Render reads `render.yaml` and creates the `turbotype-server` web service (free plan).
   (Or **New → Web Service** manually: build `npm ci --omit=dev`, start `npm start`, health check path `/health`, plan Free.)
3. When it's live, Render shows a URL like `https://turbotype-server.onrender.com`. Visit `/health` — it should say `ok`.
4. The game's server address is that URL with `wss://`: `wss://turbotype-server.onrender.com`.
   - Quick test: open the game with `?server=wss://turbotype-server.onrender.com`.
   - Permanent: build the game with `VITE_SERVER_URL=wss://turbotype-server.onrender.com npm run build`.

Free plan notes: the server sleeps after 15 min idle and takes ~1 min to wake (the game shows a "Waking up" message and wakes it as soon as the page loads). Rooms live in memory, so a restart ends any room in progress.
