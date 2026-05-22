import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const isProd = process.env.BUILD_MODE === 'prod'
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})