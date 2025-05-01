/// <reference types="vitest" />
/// <reference types="vite/client" />
import path from "path";

import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import EnvironmentPlugin from "vite-plugin-environment";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
    EnvironmentPlugin([
      "VITE_BASE_URL",
      "VITE_APP",
      "VITE_SVG_URL",
      "VITE_AUTHORIZATION_URL",
      "VITE_CLIENT_ID",
      "VITE_APP_KEY",
      "VITE_PRODUCT_SWITCHER",
      "VITE_CALLBACK_URL",
      "VITE_COOKIE_DOMAIN",
      "VITE_SOCKET_URL",
      "VITE_AWS_URL",
      "VITE_HOST",
      "VITE_SLACK_API",
      "VITE_QP_API",
      "VITE_GENERATE_TOKEN_URL",
    ]),
  ],
  build: {
    chunkSizeWarningLimit: 1600,
  },
  server: {
    host: "0.0.0.0",
    port: 3001,
  },
  preview: {
    port: 3003,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
    coverage: {
      provider: "v8",
      include: ["**/*.tsx"],
      exclude: [],
      extension: [".tsx"],
      reporter: ["text", "html"],
    },
  },
});
