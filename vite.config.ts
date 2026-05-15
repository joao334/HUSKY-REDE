import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

const pages = [
  'index',
  'login',
  'cadastro',
  'esqueci-senha',
  'home',
  'explorar',
  'reels',
  'stories',
  'criar-post',
  'editor-foto',
  'mensagens',
  'perfil',
  'configuracoes',
  'notificacoes',
  'admin',
];

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map((page) => [page, resolve(__dirname, `${page}.html`)])),
    },
  },
});
