import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const routes = [
  { path: "/", name: "home" },
  { path: "/journey", name: "journey" },
  { path: "/awards", name: "awards" },
  { path: "/certifications", name: "certifications" },
  { path: "/ai-projects", name: "ai-projects" },
  { path: "/conferences", name: "conferences" },
  { path: "/highlights", name: "highlights" },
  { path: "/recommendations", name: "references" }
];

const port = 4178;
const baseUrl = `http://127.0.0.1:${port}`;
const outputDir = "review-screenshots/slices";

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
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    for (const route of routes) {
      console.log(`Navigating to ${route.path}...`);
      await page.goto(`${baseUrl}${route.path}`, { waitUntil: "networkidle" });
      await wait(1000);

      // Get page scroll height
      const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
      const viewportHeight = 900;
      const totalSlices = Math.ceil(scrollHeight / viewportHeight);
      console.log(`Page: ${route.name}, height: ${scrollHeight}px, total slices to capture: ${totalSlices}`);

      for (let slice = 0; slice < totalSlices; slice++) {
        // Scroll to the current slice position
        await page.evaluate((yPos) => window.scrollTo(0, yPos), slice * viewportHeight);
        await wait(500); // let render/images catch up

        const path = `${outputDir}/${route.name}-slice-${slice + 1}.png`;
        await page.screenshot({ path, fullPage: false });
        console.log(`Saved slice ${slice + 1}/${totalSlices}: ${path}`);
      }
    }
    await page.close();
  } finally {
    await browser.close();
  }
} finally {
  server.kill("SIGTERM");
  console.log("Dev server stopped.");
}
