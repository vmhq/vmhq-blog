import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api": "http://127.0.0.1:8787",
      "/rss.xml": "http://127.0.0.1:8787",
      "/sitemap.xml": "http://127.0.0.1:8787",
      "/images/posts": "http://127.0.0.1:8787",
    },
  },
  build: {
    sourcemap: "hidden",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
