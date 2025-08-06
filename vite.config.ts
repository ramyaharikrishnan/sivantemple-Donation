import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: path.resolve(__dirname, "client"),
  publicDir: path.resolve(__dirname, "public"), // keep this if you use /public folder
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"), // ✅ DIRECTLY TO "dist"
    emptyOutDir: true,
  },
  base: "./", // ✅ for relative path resolution on Netlify
});
