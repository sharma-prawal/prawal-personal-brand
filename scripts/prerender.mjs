// Writes a static HTML file for every known route, so a direct visit shows the
// page before JavaScript loads and Vercel can 404 everything else.
//
// Runs after `vite build` (client, into dist/) and `vite build --ssr`
// (src/entry-server.jsx, into dist-ssr/). dist/404.html is left as the empty
// app shell: it is served for unknown URLs, where the app renders its own
// "Page not found" screen.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(root, "dist");
const ssrDir = join(root, "dist-ssr");
const siteUrl = "https://prawalsharma.in";

const template = readFileSync(join(distDir, "index.html"), "utf8");
const { render, prerenderRoutes } = await import(pathToFileURL(join(ssrDir, "entry-server.js")).href);

const escapeHtml = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function replaceOnce(html, pattern, replacement, label) {
  const found = typeof pattern === "string" ? html.includes(pattern) : pattern.test(html);
  if (!found) throw new Error(`prerender: index.html has no ${label}`);
  return html.replace(pattern, replacement);
}

const routes = prerenderRoutes();
const seen = new Set();

for (const { path, title } of routes) {
  if (seen.has(path)) throw new Error(`prerender: duplicate route ${path}`);
  seen.add(path);

  const appHtml = await render(path);
  const url = path === "/" ? `${siteUrl}/` : `${siteUrl}${path}`;
  let html = template;
  html = replaceOnce(html, /<title>[^<]*<\/title>/, () => `<title>${escapeHtml(title)}</title>\n    <link rel="canonical" href="${url}" />`, "<title>");
  html = replaceOnce(html, /(<meta property="og:url" content=")[^"]*"/, (_, start) => `${start}${url}"`, "og:url");
  html = replaceOnce(html, '<div id="root"></div>', () => `<div id="root">${appHtml}</div>`, "empty #root");

  const file = path === "/" ? join(distDir, "index.html") : join(distDir, path.slice(1), "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerender: wrote ${routes.length} pages`);
