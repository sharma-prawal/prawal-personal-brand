// Shrinks oversized images in public/media so the site serves web-sized files.
// Each original is moved to Assets/media-originals/<same path> (kept, not served),
// and a resized copy is written back under the same filename, so no references change.
// Safe to re-run: files already under the limits are left alone.
//   node scripts/optimize-media.mjs           (apply)
//   node scripts/optimize-media.mjs --dry-run (report only)
import { mkdir, readdir, rename, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";
import sharp from "sharp";

const MEDIA = "public/media";
const ORIGINALS = "Assets/media-originals";
const MAX_EDGE = 2000; // enough for the full-size lightbox on a retina laptop
const MAX_BYTES = 600 * 1024;
const dryRun = process.argv.includes("--dry-run");

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

let before = 0;
let after = 0;
let count = 0;

for await (const file of walk(MEDIA)) {
  const ext = extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) continue;
  const { size } = await stat(file);
  const meta = await sharp(file).metadata();
  const longEdge = Math.max(meta.width || 0, meta.height || 0);
  if (size <= MAX_BYTES && longEdge <= MAX_EDGE) continue;

  // .rotate() applies EXIF orientation; metadata (including GPS) is not copied to the output.
  let pipeline = sharp(file).rotate().resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true });
  if (ext === ".png") pipeline = pipeline.png({ compressionLevel: 9, palette: true, quality: 90, effort: 8 });
  else if (ext === ".webp") pipeline = pipeline.webp({ quality: 82 });
  else pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
  const output = await pipeline.toBuffer();

  // Skip if re-encoding would not meaningfully help.
  if (output.length >= size * 0.9) continue;

  before += size;
  after += output.length;
  count += 1;
  console.log(`${(size / 1048576).toFixed(1)} MB -> ${(output.length / 1048576).toFixed(2)} MB  ${relative(MEDIA, file)}`);
  if (dryRun) continue;

  const archived = join(ORIGINALS, relative(MEDIA, file));
  await mkdir(dirname(archived), { recursive: true });
  await rename(file, archived);
  await writeFile(file, output);
}

console.log(`\n${dryRun ? "Would shrink" : "Shrank"} ${count} images: ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`);
