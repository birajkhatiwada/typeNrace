import { vi } from 'vitest';
// The renderer creates a WebGL context at import time; unit tests run in node, so stub it.
vi.mock('../src/render/renderer', () => ({ renderer: { shadowMap: {}, setSize() {}, render() {} } }));
