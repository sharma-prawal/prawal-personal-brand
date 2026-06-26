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
  { path: "/recommendations", name: "references" }
];

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 }
];

const port = 4177;
const baseUrl = `http://127.0.0.1:${port}`;
const outputDir = "review-screenshots";

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
    for (const viewport of viewports) {
      console.log(`Starting captures for viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();

      for (const route of routes) {
        await page.goto(`${baseUrl}${route.path}`, { waitUntil: "networkidle" });
        await wait(1000); // let animations settle

        // Take page viewport screenshot
        const screenshotPath = `${outputDir}/${viewport.name}-${route.name}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log(`Saved: ${screenshotPath}`);

        // For the home page, capture the chatbot too!
        if (route.path === "/" && viewport.name === "desktop") {
          // Hover FAB to show tooltip/hover state
          const fab = page.locator(".chatbot-fab");
          if (await fab.count() > 0) {
            await fab.hover();
            await wait(300);
            await page.screenshot({ path: `${outputDir}/desktop-chatbot-fab-hover.png`, fullPage: false });
            console.log(`Saved: ${outputDir}/desktop-chatbot-fab-hover.png`);

            // Click FAB to open chatbot
            await fab.click();
            await wait(1000); // wait for slide/fade animations
            
            // Type a test question so we can see code/user bubbles
            await page.fill(".chatbot-footer input", "How can I contact Prawal? What are the `requirements`?");
            await page.click(".chatbot-footer button[type='submit']");
            await wait(2000); // Wait for mock LLM response
            
            await page.screenshot({ path: `${outputDir}/desktop-chatbot-open.png`, fullPage: false });
            console.log(`Saved: ${outputDir}/desktop-chatbot-open.png`);
          }
        }
      }
      await page.close();
      await context.close();
    }
  } finally {
    await browser.close();
  }
} finally {
  server.kill("SIGTERM");
  console.log("Dev server stopped.");
}
