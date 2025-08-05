/// <reference types="vitest" />
/// <reference types="vite/client" />
import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    react(),
  ],
  optimizeDeps: {
    include: ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
  },
  build: {
    chunkSizeWarningLimit: 1600,
    commonjsOptions: {
      include: [/@dnd-kit/, /node_modules/],
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  preview: {
    port: 3003,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/Assets': path.resolve(__dirname, 'src/assets'),
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
    coverage: {
      provider: 'v8',
      include: ['**/*.tsx'],
      exclude: [],
      extension: ['.tsx'],
      reporter: ['text', 'html'],
    },
  },
});
