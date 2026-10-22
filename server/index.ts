import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { WebSocketServer, type WebSocket } from 'ws';
import { Rooms } from './rooms';
import type { ClientMsg, ServerMsg } from '../shared/protocol';

const port = Number(process.env.PORT || 8787);
// Plain HTTP endpoint: Render health checks and the game's "wake up" request hit this.
const http = createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain', 'access-control-allow-origin': '*' });
  res.end(req.url === '/health' ? 'ok' : 'Turbotype server');
});
const wss = new WebSocketServer({ server: http });
const socks = new Map<string, WebSocket>();
const rooms = new Rooms((id, m: ServerMsg) => socks.get(id)?.send(JSON.stringify(m)));

wss.on('connection', (ws) => {
  const id = randomUUID(); socks.set(id, ws);
  (ws as any).alive = true; ws.on('pong', () => { (ws as any).alive = true; });
  ws.send(JSON.stringify({ t: 'hello', id } satisfies ServerMsg));
  ws.on('message', (d) => {
    let m: ClientMsg;
    try { m = JSON.parse(String(d)); if (!m || typeof m.t !== 'string') throw 0; } catch { return ws.send(JSON.stringify({ t: 'error', code: 'bad_msg', msg: 'Bad JSON' })); }
    rooms.handle(id, m);
  });
  ws.on('close', () => { rooms.leave(id); socks.delete(id); });
});

// Drop dead connections (closed laptops, lost wifi) so they leave their rooms.
setInterval(() => wss.clients.forEach((ws: any) => { if (!ws.alive) return ws.terminate(); ws.alive = false; ws.ping(); }), 25000);

http.listen(port, '0.0.0.0', () => console.log('Turbotype server on :' + port));
