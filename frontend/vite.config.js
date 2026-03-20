import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { version } from "./package.json";

export default defineConfig(({ mode }) => {
  // Manual override
  const DOMAIN = mode === "development" ? "localhost:8000" : "oykus.ovh";
  const PROTOCOL = mode === "development" ? "http" : "https";
  const API = mode === "development" ? "localhost:8000/api" : "oykus.ovh/api";

  return {
    plugins: [react(),
    {
      name: "oyk-endofhead-theme",
      transformIndexHtml(html) {
        html = html.replace(
          /(<\/head>)/,
          `<link rel="stylesheet" href="${PROTOCOL}://${API}/theme" id="oyk-theme">$1`
        );

        return html;
      }
    }],
    define: {
      "import.meta.env.VITE_DOMAIN": JSON.stringify(DOMAIN),
      "import.meta.env.VITE_PROTOCOL": JSON.stringify(PROTOCOL),
      "import.meta.env.VITE_API": JSON.stringify(API),
      "import.meta.env.VITE_VERSION": JSON.stringify(version),
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
      port: 5173,
      host: true,
      watch: { usePolling: true },
      proxy: {
        "/api": {
          target: "http://backend:8000",
          changeOrigin: true,
          secure: false,
        },
      },
      allowedHosts: true,
    },
  };
});
