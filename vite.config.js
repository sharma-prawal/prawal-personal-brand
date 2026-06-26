import { defineConfig } from 'vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  plugins: [
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
