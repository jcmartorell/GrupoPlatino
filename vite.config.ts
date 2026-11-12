import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { csp } from './csp.mjs';

// Solo en build: el dev server de Vite necesita scripts inline para React Fast Refresh.
const cspMeta = (): Plugin => ({
  name: 'csp-meta',
  apply: 'build',
  transformIndexHtml: () => [{ tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: csp }, injectTo: 'head-prepend' }],
});

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), cspMeta()],
});
