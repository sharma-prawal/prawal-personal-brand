import { chromium } from "playwright";
import { spawn } from "node:child_process";

const port = 4179;
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

try {
  await waitForServer();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${baseUrl}/awards`, { waitUntil: "networkidle" });

    const results = await page.evaluate(() => {
      const selectors = [
        ".awards-section-intro",
        ".awards-section-intro h2",
        ".awards-section-intro p",
        ".signature-awards-grid"
      ];
      return selectors.map(sel => {
        const el = document.querySelector(sel);
        if (!el) return { selector: sel, found: false };
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          selector: sel,
          found: true,
          width: rect.width,
          left: rect.left,
          right: rect.right,
          maxWidth: style.maxWidth,
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          paddingLeft: style.paddingLeft,
          paddingRight: style.paddingRight,
          marginLeft: style.marginLeft,
          marginRight: style.marginRight
        };
      });
    });

    console.log(JSON.stringify(results, null, 2));

  } finally {
    await browser.close();
  }
} catch (err) {
  console.error(err);
} finally {
  server.kill("SIGTERM");
}
