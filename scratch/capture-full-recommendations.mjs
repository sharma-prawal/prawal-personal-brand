import { chromium } from "playwright";
import { spawn } from "node:child_process";

const port = 4178;
const baseUrl = `http://127.0.0.1:${port}`;

const server = spawn(
  "npm",
  ["run", "dev", "--", "--host", "127.0.0.1", "--port", String(port)],
  { stdio: "ignore", shell: true, cwd: "/Users/prawalsharma/Documents/New project/prawal-personal-brand" }
);

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

async function main() {
  try {
    await waitForServer();
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 1600 } });

    await page.goto(`${baseUrl}/recommendations`, { waitUntil: "networkidle" });
    await page.screenshot({
      path: "/Users/prawalsharma/.gemini/antigravity/brain/f2903177-41a8-479d-a187-05a41008a5b4/compare-recommendations-full.png",
      fullPage: true
    });
    console.log("Full-page screenshot saved!");

    await browser.close();
  } catch (err) {
    console.error(err);
  } finally {
    server.kill("SIGTERM");
  }
}

main();
