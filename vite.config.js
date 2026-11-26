import { defineConfig } from 'vite'
import { copyFileSync } from 'node:fs'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// Vercel serves dist/404.html, with a 404 status, for any path that has no
// file in dist/. It is a copy of the empty app shell (taken before
// scripts/prerender.mjs fills dist/index.html), so the app renders its own
// "Page not found" screen while crawlers see a real 404.
const notFoundPage = {
  name: 'not-found-page',
  apply: (_config, { command, isSsrBuild }) => command === 'build' && !isSsrBuild,
  closeBundle() {
    copyFileSync('dist/index.html', 'dist/404.html')
  }
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    notFoundPage,
    // The SSR build only renders HTML; the client build emits the images.
    !isSsrBuild && ViteImageOptimizer({
      jpg: { quality: 80 },
      jpeg: { quality: 80 },
      png: { quality: 85, compressionLevel: 8 },
      webp: { quality: 82 },
    })
  ],
  define: {
    // Footer copyright year in the pre-rendered HTML (see CopyrightYear).
    __BUILD_YEAR__: JSON.stringify(new Date().getFullYear())
  },
  esbuild: {
    jsx: 'automatic'
  },
  server: {
    allowedHosts: ['.ngrok-free.app', '.ngrok.io']
  },
  build: isSsrBuild
    ? { outDir: 'dist-ssr' }
    : {
        rollupOptions: {
          output: {
            manualChunks: {
              'vendor-react': ['react', 'react-dom', 'react-router-dom'],
              'vendor-motion': ['framer-motion'],
            }
          }
        }
      }
}))
