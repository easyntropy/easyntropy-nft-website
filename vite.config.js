import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  base: process.env.BASE_URL || "/easyntrophy/",
  build: {
    outDir: "../../dist/public",
    target: "esnext",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
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
