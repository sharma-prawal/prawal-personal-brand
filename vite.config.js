import { defineConfig, loadEnv } from 'vite'
import { copyFileSync } from 'node:fs'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import thumbnails from './scripts/thumbnails-plugin.mjs'

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

// Serves api/chat.js (a Vercel function in production) from the dev and
// preview servers, so the assistant answers locally too. GROQ_API_KEY comes
// from .env.local; it has no VITE_ prefix, so it never reaches the bundle.
const apiChat = (env) => {
  if (env.GROQ_API_KEY && !process.env.GROQ_API_KEY) process.env.GROQ_API_KEY = env.GROQ_API_KEY
  const mount = (server, load) => {
    server.middlewares.use('/api/chat', async (req, res) => {
      try {
        const handler = await load()
        const chunks = []
        for await (const chunk of req) chunks.push(chunk)
        const url = new URL(req.originalUrl || req.url, `http://${req.headers.host}`)
        const request = new Request(url, {
          method: req.method,
          headers: Object.entries(req.headers).filter(([, v]) => typeof v === 'string'),
          body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks)
        })
        const response = await (handler[req.method]?.(request) ?? new Response(null, { status: 405 }))
        res.statusCode = response.status
        response.headers.forEach((value, key) => res.setHeader(key, value))
        if (response.body) {
          for await (const chunk of response.body) res.write(chunk)
        }
        res.end()
      } catch (err) {
        res.statusCode = 500
        res.end(JSON.stringify({ error: { message: String(err?.message || err) } }))
      }
    })
  }
  return {
      name: 'api-chat',
      configureServer(server) {
        mount(server, () => server.ssrLoadModule('/api/chat.js'))
      },
      configurePreviewServer(server) {
        mount(server, () => import('./api/chat.js'))
      }
    }
  }

  export default defineConfig(({ mode, isSsrBuild }) => {
    // '' loads every variable from .env files and process.env, not only VITE_
    // ones. Only values passed to `define` below end up in the bundle.
    const env = loadEnv(mode, process.cwd(), '')
    return {
    plugins: [
      notFoundPage,
      apiChat(env),
      thumbnails(),
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
      __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
      // Live vs sandbox badge in the assistant: true when the build had a
      // GROQ_API_KEY to give api/chat.js. Only the boolean is inlined.
      __CHAT_LIVE__: JSON.stringify(Boolean(env.GROQ_API_KEY))
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
  }
})
