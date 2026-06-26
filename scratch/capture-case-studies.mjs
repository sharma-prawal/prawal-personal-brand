import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const routes = [
  "/ai-projects/sunrise-public-school-website",
  "/ai-projects/professional/data-refinery"
];

const viewports = [
  { name: "desktop", width: 1440, height: 1100 },
  { name: "mobile", width: 390, height: 1200 }
];

const port = 4178;
const baseUrl = `http://127.0.0.1:${port}`;
const outputDir = "/Users/prawalsharma/.gemini/antigravity/brain/f2903177-41a8-479d-a187-05a41008a5b4";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      await wait(500);
    }
  }
  throw new Error(`Timed out waiting for ${baseUrl}`);
}

function routeName(route) {
  if (route.includes("/professional/")) {
    return "case-study-professional";
  }
  return "case-study-open";
}

async function scrollThroughPage(page) {
  await page.evaluate(async () => {
    const distance = Math.max(360, Math.floor(window.innerHeight * 0.75));
    await new Promise((resolve) => {
      let total = 0;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        total += distance;
        if (total >= document.body.scrollHeight - window.innerHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 120);
    });
  });
  await page.waitForLoadState("networkidle");
}

async function waitForImages(page) {
  await page.evaluate(async () => {
    const images = Array.from(document.images);
    images.forEach((image) => {
      image.loading = "eager";
      image.decoding = "sync";
    });

    await Promise.allSettled(
      images.map(async (image) => {
        if (!image.complete) {
          await new Promise((resolve) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
          });
        }
        if (typeof image.decode === "function") {
          await image.decode().catch(() => {});
        }
      })
    );
  });
  await page.waitForLoadState("networkidle");
}

const server = spawn(
  "npm",
  ["run", "dev", "--", "--host", "127.0.0.1", "--port", String(port)],
  { stdio: "inherit", shell: process.platform === "win32" }
);

try {
  await mkdir(outputDir, { recursive: true });
  await waitForServer();

  const browser = await chromium.launch();
  try {
    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport });
      for (const route of routes) {
        await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
        await page.addStyleTag({
          content: ".topbar { position: relative !important; z-index: 99999 !important; }"
        });
        await scrollThroughPage(page);
        await waitForImages(page);
        await page.screenshot({
          path: `${outputDir}/${viewport.name}-${routeName(route)}.png`,
          fullPage: true
        });
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
} finally {
  server.kill("SIGTERM");
}
