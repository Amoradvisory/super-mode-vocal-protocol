/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

function resolveBasePath(): string {
  const explicit = process.env.VITE_BASE_PATH;
  if (explicit?.trim()) {
    const value = explicit.trim();
    const leading = value.startsWith('/') ? value : `/${value}`;
    return leading.endsWith('/') ? leading : `${leading}/`;
  }
  const repository = process.env.GITHUB_REPOSITORY;
  if (process.env.GITHUB_ACTIONS === 'true' && repository) {
    const [owner, name] = repository.split('/');
    if (!owner || !name || name.toLowerCase() === `${owner.toLowerCase()}.github.io`) return '/';
    return `/${name}/`;
  }
  return '/';
}

const base = resolveBasePath();

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      injectRegister: false,
      manifestFilename: 'manifest.webmanifest',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,json,svg,png,ico,txt,md}'],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
      },
      manifest: {
        id: '.',
        name: 'Ma Lecture',
        short_name: 'Ma Lecture',
        description: 'Une liseuse simple pour parcourir le Coran en français, sourate après sourate.',
        lang: 'fr',
        dir: 'ltr',
        start_url: '.',
        scope: '.',
        display: 'fullscreen',
        display_override: ['fullscreen', 'standalone'],
        orientation: 'portrait-primary',
        prefer_related_applications: false,
        theme_color: '#05080D',
        background_color: '#05080D',
        categories: ['books', 'education'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
  },
  build: { target: 'es2022', chunkSizeWarningLimit: 900 },
  server: { port: 5173 },
  preview: { port: 4173 },
});
