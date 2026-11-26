// Small WebP thumbnails for images shown as thumbnails (event strips, ledger
// rows, course lists). Without them a 90px frame downloads a 400–600 KB
// original and sits empty until it arrives.
//
// A thumbnail for /media/a/b.jpg is served at /thumbs/media/a/b.jpg.webp
// (see thumbSrc in src/data/imageMetadata.js). The build writes every one to
// dist/thumbs; the dev server makes them on request. Originals are untouched
// and still open in the lightbox.
import { mkdir, readdir, readFile } from 'node:fs/promises'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'
import sharp from 'sharp'

const WIDTH = 480 // covers 240px frames on 2x screens
const RASTER = new Set(['.jpg', '.jpeg', '.png', '.webp'])

function makeThumb(input) {
  return sharp(input)
    .rotate() // respect EXIF orientation from phone photos
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: 72 })
}

async function listImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return listImages(path)
    return RASTER.has(extname(entry.name).toLowerCase()) ? [path] : []
  }))
  return nested.flat()
}

export default function thumbnails({ publicDir = 'public', outDir = 'dist' } = {}) {
  const mediaDir = resolve(publicDir, 'media')
  const cache = new Map()

  return {
    name: 'thumbnails',

    configureServer(server) {
      server.middlewares.use('/thumbs/', async (req, res, next) => {
        const path = decodeURIComponent(req.url.split('?')[0])
        if (!path.startsWith('/media/') || !path.endsWith('.webp')) return next()
        const source = resolve(publicDir, '.' + path.slice(0, -'.webp'.length))
        if (!source.startsWith(mediaDir + sep)) return next()
        try {
          if (!cache.has(source)) cache.set(source, await makeThumb(await readFile(source)).toBuffer())
          res.setHeader('Content-Type', 'image/webp')
          res.end(cache.get(source))
        } catch {
          next()
        }
      })
    },

    apply: (_config, { command, isSsrBuild }) => command === 'serve' || !isSsrBuild,

    async closeBundle() {
      if (this.meta?.watchMode) return
      const images = await listImages(mediaDir)
      const queue = [...images]
      const worker = async () => {
        for (let source = queue.shift(); source; source = queue.shift()) {
          const target = join(outDir, 'thumbs', 'media', relative(mediaDir, source) + '.webp')
          await mkdir(dirname(target), { recursive: true })
          await makeThumb(source).toFile(target)
        }
      }
      await Promise.all(Array.from({ length: 8 }, worker))
      console.log(`thumbnails: wrote ${images.length} thumbnails`)
    }
  }
}
