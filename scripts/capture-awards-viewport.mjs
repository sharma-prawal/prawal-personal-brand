import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = 4176;
const baseUrl = `http://127.0.0.1:${port}`;

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
  await waitForServer();

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${baseUrl}/awards`, { waitUntil: "networkidle" });
    await wait(1500);
    // Viewport-only screenshot so fixed backgrounds render correctly
    await page.screenshot({
      path: "review-screenshots/desktop-awards-viewport.png",
      fullPage: false
    });
    console.log("Saved: review-screenshots/desktop-awards-viewport.png");
  } finally {
    await browser.close();
  }
} finally {
  server.kill("SIGTERM");
}
