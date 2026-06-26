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

async function inspectSelectors(page, route, selectors) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
  return await page.evaluate((selectors) => {
    return selectors.map(sel => {
      const el = document.querySelector(sel);
      if (!el) return { selector: sel, found: false };
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        selector: sel,
        found: true,
        tag: el.tagName,
        className: el.className,
        rect: {
          left: rect.left,
          width: rect.width
        },
        paddingLeft: style.paddingLeft,
        paddingRight: style.paddingRight,
        marginLeft: style.marginLeft,
        marginRight: style.marginRight
      };
    });
  }, selectors);
}

async function main() {
  try {
    await waitForServer();
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

    const selectors = [
      ".reference-hero",
      ".reference-dossier",
      ".reference-signal-map",
      ".recommendation-themes",
      ".reference-archive-heading",
      ".reference-archive",
      ".reference-source-note"
    ];

    const result = await inspectSelectors(page, "/recommendations", selectors);

    console.log("=== RECOMMENDATIONS ELEMENTS ===");
    console.table(result.map(r => ({
      selector: r.selector,
      found: r.found,
      left: r.found ? r.rect.left : "-",
      width: r.found ? r.rect.width : "-",
      paddingLeft: r.found ? r.paddingLeft : "-"
    })));

    await browser.close();
  } catch (err) {
    console.error(err);
  } finally {
    server.kill("SIGTERM");
  }
}

main();
