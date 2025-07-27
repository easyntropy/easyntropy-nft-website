import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: "../../dist",
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
