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

async function inspectLayout(page) {
  // 1. Inspect /
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  const execResults = await page.evaluate(() => {
    const selectors = [
      "section.hero-section",
      ".executive-snapshot",
      "section.featured-proof",
      "section.impact-band",
      ".impact-band > .section-header",
      "section.leadership-system",
      ".leadership-system__lead",
      "section.executive-perspectives",
      ".executive-perspectives__intro",
      "section.operating-style-section",
      ".operating-style-section > .section-header",
      ".operating-style-section__body > .principle-list",
      "section.signature-framework",
      ".signature-framework__copy",
      ".exec-break-statement",
      ".exec-break-statement span",
      "section.final-cta"
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
        paddingLeft: style.paddingLeft,
        paddingRight: style.paddingRight,
        marginLeft: style.marginLeft,
        marginRight: style.marginRight
      };
    });
  });

  // 2. Inspect /awards
  await page.goto(`${baseUrl}/awards`, { waitUntil: "networkidle" });
  const awardsResults = await page.evaluate(() => {
    const selectors = [
      "section.page-hero",
      "section.awards-recognition-hero",
      "section.awards-recognition-ledger",
      "section.awards-section-intro",
      ".awards-section-intro h2",
      ".signature-awards-grid",
      "section.awards-archive-ledger",
      "section.reflection-block"
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
        paddingLeft: style.paddingLeft,
        paddingRight: style.paddingRight,
        marginLeft: style.marginLeft,
        marginRight: style.marginRight
      };
    });
  });

  // 3. Inspect /recommendations
  await page.goto(`${baseUrl}/recommendations`, { waitUntil: "networkidle" });
  const recsResults = await page.evaluate(() => {
    const selectors = [
      "section.reference-hero",
      ".recommendation-themes",
      ".recommendation-themes > div:first-child",
      ".reference-archive-heading",
      ".reference-source-note"
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
        paddingLeft: style.paddingLeft,
        paddingRight: style.paddingRight,
        marginLeft: style.marginLeft,
        marginRight: style.marginRight
      };
    });
  });

  // 4. Inspect /conferences
  await page.goto(`${baseUrl}/conferences`, { waitUntil: "networkidle" });
  const confsResults = await page.evaluate(() => {
    const selectors = [
      ".conference-archive-intro",
      ".conference-archive-intro > div:first-child",
      ".conference-archive-intro > div:first-child h2"
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
        paddingLeft: style.paddingLeft,
        paddingRight: style.paddingRight,
        marginLeft: style.marginLeft,
        marginRight: style.marginRight
      };
    });
  });

  // 5. Inspect /certifications
  await page.goto(`${baseUrl}/certifications`, { waitUntil: "networkidle" });
  const certsResults = await page.evaluate(() => {
    const selectors = [
      ".credential-section-heading"
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
        paddingLeft: style.paddingLeft,
        paddingRight: style.paddingRight,
        marginLeft: style.marginLeft,
        marginRight: style.marginRight
      };
    });
  });

  return {
    exec: execResults,
    awards: awardsResults,
    recs: recsResults,
    conferences: confsResults,
    certifications: certsResults
  };
}

async function main() {
  try {
    await waitForServer();
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

    const result = await inspectLayout(page);
    console.log("=== LAYOUT INSPECTION ===");
    console.log(JSON.stringify(result, null, 2));

    await page.screenshot({ path: "/Users/prawalsharma/.gemini/antigravity/brain/f2903177-41a8-479d-a187-05a41008a5b4/compare-recommendations.png" });
    console.log("Screenshot saved to compare-recommendations.png");

    await browser.close();
  } catch (err) {
    console.error(err);
  } finally {
    server.kill("SIGTERM");
  }
}

main();
