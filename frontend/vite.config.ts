import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [react()],
  build: {
    minify: "terser",
    terserOptions: {
      compress: true,
      mangle: true,
      format: {
        comments: false,
      },
    },
    sourcemap: true, // Disable source maps for production
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
