import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = 4178;
const baseUrl = `http://127.0.0.1:${port}`;

function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch(baseUrl); if (r.ok) return; } catch { await wait(500); }
  }
  throw new Error("Server timeout");
}

const server = spawn("npm", ["run", "dev", "--", "--host", "127.0.0.1", "--port", String(port)], {
  stdio: "inherit", shell: process.platform === "win32"
});

try {
  await waitForServer();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await wait(1000);

    // Click the chatbot FAB to open it
    const fab = page.locator(".chatbot-fab");
    if (await fab.count() > 0) {
      await fab.click();
      await wait(800);
    }

    await page.screenshot({
      path: "review-screenshots/chatbot-open.png",
      fullPage: false
    });
    console.log("Saved: review-screenshots/chatbot-open.png");
  } finally {
    await browser.close();
  }
} finally {
  server.kill("SIGTERM");
}
