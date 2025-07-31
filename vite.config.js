import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  base: process.env.BASE_URL || "/easyntrophy/",
  build: {
    outDir: "../../dist/public",
    target: "esnext",
    assetsInlineLimit: 0,
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
  assetsInclude: ["*.woff", "*.woff2", "*.eot", "*.ttf", "*.ttf.*", "*.otf", "*.svg"],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    ...(process.env.CODESPACES && {
      hmr: {
        clientPort: 443,
      },
    }),
    ...(process.env.DOCKER && {
      watch: {
        usePolling: true,
        interval: 100,
      },
    }),
  },
});
