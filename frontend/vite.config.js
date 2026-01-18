import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    plugins: [react()],
    build: {
      outDir: "dist",
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    server: {
      port: 8000,
      host: true,
      watch: { usePolling: true },
      proxy: {
        "/api": {
          target: "http://backend:80",
          changeOrigin: true,
          secure: false,
        },
      },
      allowedHosts: true,
    },
  };
});
