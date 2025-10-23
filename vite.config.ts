import { defineConfig } from 'vite'

export default defineConfig({
  base: '/CornProductionSimulation/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable sourcemaps for production
    minify: true, // Use default minifier (esbuild)
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['chart.js', 'd3', 'gsap', 'three', 'leaflet']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})