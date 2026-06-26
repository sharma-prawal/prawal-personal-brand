import { chromium } from "playwright";
import { spawn } from "node:child_process";

const port = 4176;
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

const server = spawn(
  "npm",
  ["run", "dev", "--", "--host", "127.0.0.1", "--port", String(port)],
  { stdio: "inherit", shell: true }
);

try {
  await waitForServer();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
    await page.goto(`${baseUrl}/ai-projects`, { waitUntil: "networkidle" });
    // Capture full page screenshot
    await page.screenshot({
      path: `${outputDir}/projects-viewport-desktop.png`,
      fullPage: true
    });
    console.log("Screenshot saved successfully!");
  } finally {
    await browser.close();
  }
} catch (err) {
  console.error(err);
} finally {
  server.kill("SIGTERM");
}
