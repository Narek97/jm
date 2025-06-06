/// <reference types="vitest" />
/// <reference types="vite/client" />
import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
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
      '@assets': path.resolve(__dirname, 'src/assets'),
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
