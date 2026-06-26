import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";

const baseUrl = "http://localhost:5173";
const outDir = "public/media/projects/Personal Branding Site";

const captures = [
  { route: "/",              file: "01-executive-hero.png" },
  { route: "/awards",        file: "02-awards-page.png" },
  { route: "/ai-projects",   file: "03-ai-projects-page.png" },
  { route: "/journey",       file: "04-journey-page.png" },
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrollAndBack(page) {
  await page.evaluate(async () => {
    const step = Math.floor(window.innerHeight * 0.75);
    await new Promise((resolve) => {
      let total = 0;
      const t = setInterval(() => {
        window.scrollBy(0, step);
        total += step;
        if (total >= document.body.scrollHeight - window.innerHeight) {
          clearInterval(t);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
    });
  });
  await page.waitForLoadState("networkidle");
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const { route, file } of captures) {
  console.log(`Capturing ${route}…`);
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
  await wait(600);
  await scrollAndBack(page);
  await wait(400);
  // Scroll back to top for the screenshot
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(300);
  const buf = await page.screenshot({ fullPage: false });
  await writeFile(`${outDir}/${file}`, buf);
  console.log(`  → saved ${file}`);
}

await browser.close();
console.log("Done.");
