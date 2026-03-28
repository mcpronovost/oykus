import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { version } from "./package.json";

export default defineConfig(({ mode }) => {
  // Manual override for build
  const DOMAIN = mode === "development" ? "http://localhost:8080" : "https://oykus.ovh";
  const API = mode === "development" ? "/api" : "https://oykus.ovh/api";

  return {
    plugins: [react(),
    {
      name: "oyk-endofhead-theme",
      transformIndexHtml(html) {
        html = html.replace(
          /(<\/head>)/,
          `<link rel="stylesheet" href="${API}/theme.php" id="oyk-theme">$1`
        );

        return html;
      }
    }],
    define: {
      "import.meta.env.VITE_DOMAIN": JSON.stringify(DOMAIN),
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
      port: 8000,
      host: true,
      watch: { usePolling: true },
      proxy: {
        "/api": {
          target: "http://backend:80",
          changeOrigin: true,
          secure: false,
        },
        "/uploads": {
          target: "http://backend:80",
          changeOrigin: true,
          secure: false,
        },
      },
      allowedHosts: true,
    },
  };
});
