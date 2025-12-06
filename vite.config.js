import dotenv from "dotenv";
dotenv.config();

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { resolve } from "path";

process.env.BUGSINK_URL = process.env.BUGSINK_URL || `${process.env.BUGSINK_HOST_APP_URL}:8001`;
process.env.VITE_BUGSINK_DSN = process.env.VITE_BUGSINK_DSN || process.env.PUBLIC_BUGSINK_DSN;

export default async () => {
  const canReachBugsink = await fetch(process.env.BUGSINK_URL)
    .then(() => true)
    .catch(() => false);

  return defineConfig({
    plugins: [
      vue(),
      sentryVitePlugin({
        url: process.env.BUGSINK_URL,
        authToken: process.env.BUGSINK_AUTH_TOKEN || "",
        org: "bugsinkhasnoorgs", // "bugsinkhasnoorgs" is actual value, based on docs
        project: "ignoredfornow", // "ignoredfornow" is actual value, based on docs
        disable: !canReachBugsink,
      }),
    ],
    base: process.env.BASE_URL || "/easyntrophy/",
    build: {
      outDir: "../../dist/public",
      target: "esnext",
      assetsInlineLimit: 0,
      sourcemap: "hidden",
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
};
