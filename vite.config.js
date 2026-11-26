import { defineConfig } from 'vite'
import { copyFileSync } from 'node:fs'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// Vercel serves dist/404.html, with a 404 status, for any path vercel.json
// does not rewrite. It is a copy of the app shell, so the app renders its
// own "Page not found" screen while crawlers see a real 404.
const notFoundPage = {
  name: 'not-found-page',
  apply: 'build',
  closeBundle() {
    copyFileSync('dist/index.html', 'dist/404.html')
  }
}

export default defineConfig({
  plugins: [
    notFoundPage,
    ViteImageOptimizer({
      jpg: { quality: 80 },
      jpeg: { quality: 80 },
      png: { quality: 85, compressionLevel: 8 },
      webp: { quality: 82 },
    })
  ],
  esbuild: {
    jsx: 'automatic'
  },
  server: {
    allowedHosts: ['.ngrok-free.app', '.ngrok.io']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
        }
      }
    }
  }
})
