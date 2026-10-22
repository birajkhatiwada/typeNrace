import { defineConfig, type Plugin } from 'vite';

/** import "x.glb" as a Uint8Array (base64 inlined), like the old esbuild "binary" loader */
function glbBinary(): Plugin {
  return {
    name: 'glb-binary',
    enforce: 'pre',
    async load(id) {
      if (!id.endsWith('.glb')) return null;
      const { readFileSync } = await import('node:fs');
      const b64 = readFileSync(id).toString('base64');
      return `const b=atob("${b64}");const u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);export default u;`;
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [glbBinary()],
  build: { target: 'es2020', assetsInlineLimit: 100_000_000, chunkSizeWarningLimit: 30_000 },
  test: { environment: 'node', setupFiles: ['tests/setup.ts'] },
} as any);
