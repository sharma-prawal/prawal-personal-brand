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

    const data = await page.evaluate(() => {
      const getMetrics = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return { selector: sel, found: false };
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          selector: sel,
          found: true,
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height,
          marginTop: style.marginTop,
          marginBottom: style.marginBottom,
          paddingTop: style.paddingTop,
          paddingBottom: style.paddingBottom
        };
      };

      // We want to check:
      // Row 1 items: first lead quote, analysis block
      // Row 2 items: second lead quote, supporting quotes
      const allLeadQuotes = Array.from(document.querySelectorAll(".reference-lead-quote"));
      const lead1 = allLeadQuotes[0];
      const lead2 = allLeadQuotes[1];

      const lead1Rect = lead1 ? lead1.getBoundingClientRect() : null;
      const lead2Rect = lead2 ? lead2.getBoundingClientRect() : null;

      const analysis = document.querySelector(".reference-dossier__analysis");
      const analysisRect = analysis ? analysis.getBoundingClientRect() : null;

      const supporting = document.querySelector(".reference-supporting-quotes");
      const supportingRect = supporting ? supporting.getBoundingClientRect() : null;

      return {
        lead1: lead1Rect ? { top: lead1Rect.top, bottom: lead1Rect.bottom, height: lead1Rect.height } : null,
        analysis: analysisRect ? { top: analysisRect.top, bottom: analysisRect.bottom, height: analysisRect.height } : null,
        lead2: lead2Rect ? { top: lead2Rect.top, bottom: lead2Rect.bottom, height: lead2Rect.height } : null,
        supporting: supportingRect ? { top: supportingRect.top, bottom: supportingRect.bottom, height: supportingRect.height } : null,
        lead1Style: lead1 ? { minHeight: window.getComputedStyle(lead1).minHeight } : null,
        lead2Style: lead2 ? { minHeight: window.getComputedStyle(lead2).minHeight } : null
      };
    });

    console.log("=== GAP METRICS ===");
    console.log(JSON.stringify(data, null, 2));

    await browser.close();
  } catch (err) {
    console.error(err);
  } finally {
    server.kill("SIGTERM");
  }
}

main();
