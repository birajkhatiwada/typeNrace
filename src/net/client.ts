import type { ClientMsg, ServerMsg } from '../../shared/protocol';

/** Thin typed WebSocket wrapper. No game logic here. */
export class NetClient {
  private ws: WebSocket | null = null;
  id = '';
  private msgH: Array<(m: ServerMsg) => void> = [];
  private closeH: Array<() => void> = [];

  get open() { return !!this.ws && this.ws.readyState === WebSocket.OPEN; }

  connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url); this.ws = ws;
      const fail = setTimeout(() => { try { ws.close(); } catch { /* ignore */ } reject(new Error('Could not reach the game server')); }, 75000); // a sleeping free-tier server can take ~1 minute to wake
      ws.onmessage = (e) => {
        let m: ServerMsg; try { m = JSON.parse(String(e.data)); } catch { return; }
        if (m.t === 'hello') { this.id = m.id; clearTimeout(fail); resolve(); return; }
        this.msgH.forEach((h) => h(m));
      };
      ws.onerror = () => { clearTimeout(fail); reject(new Error('Could not reach the game server')); };
      ws.onclose = () => { clearTimeout(fail); if (this.ws === ws) this.ws = null; this.closeH.forEach((h) => h()); };
    });
  }
  send(m: ClientMsg) { if (this.open) this.ws!.send(JSON.stringify(m)); }
  onMessage(h: (m: ServerMsg) => void) { this.msgH.push(h); }
  onClose(h: () => void) { this.closeH.push(h); }
  close() { try { this.ws?.close(); } catch { /* ignore */ } this.ws = null; }
}
export const net = new NetClient();
