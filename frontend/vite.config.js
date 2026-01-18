import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Manual override
  const DOMAIN = mode === "development" ? "localhost:8080" : "oykus.ovh";
  const PROTOCOL = mode === "development" ? "http" : "https";
  const API = mode === "development" ? "localhost:8080/api/v1" : "oykus.ovh/api/v1";

  return {
    plugins: [react()],
    define: {
      "import.meta.env.VITE_DOMAIN": JSON.stringify(DOMAIN),
      "import.meta.env.VITE_PROTOCOL": JSON.stringify(PROTOCOL),
      "import.meta.env.VITE_API": JSON.stringify(API),
    },
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
