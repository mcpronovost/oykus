import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,
      includeAssets: [
        "favicon.png",
        "icon-192.png",
        "icon-512.png",
        "screenshots/wide.png",
        "screenshots/narrow.png",
      ],
      manifest: {
        name: "Oykus",
        short_name: "Oykus",
        description: "Where every player is both author and adventurer",
        theme_color: "#242424",
        background_color: "#242424",
        display: "standalone",
        display_override: ["window-controls-overlay"],
        orientation: "landscape",
        start_url: "/",
        scope: "/",
        lang: "en-CA",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "screenshots/wide.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide",
            label: "Oykus space board on desktop",
          },
        ],
        protocol_handlers: [
          {
            protocol: "web+oykus",
            url: "/?url=%s",
          },
        ],
      },
      workbox: {
        // UGC app: never precache the app shell or hashed assets — only the offline page.
        globPatterns: ["offline.html"],
        navigateFallback: undefined,
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkOnly",
            options: {
              precacheFallback: {
                fallbackURL: "/offline.html",
              },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api"),
            handler: "NetworkOnly",
          },
        ],
      },
      devOptions: {
        enabled: true,
        navigateFallback: "index.html",
        suppressWarnings: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    hmr: {
      clientPort: 8080,
    },
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
