import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // We'll open the local build (which we already know compiles)
  // Let's start the server programmatically on port 4176
  const port = 4176;
  const baseUrl = `http://127.0.0.1:${port}`;
  
  console.log("Starting server...");
  const { spawn } = await import("node:child_process");
  const server = spawn(
    "npm",
    ["run", "preview", "--", "--port", String(port)],
    { stdio: "pipe", shell: process.platform === "win32" }
  );
  
  // Wait for server to start
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(baseUrl);
      if (res.ok) break;
    } catch {
      await new Promise(r => setTimeout(r, 200));
    }
  }
  
  console.log("Navigating to projects page...");
  await page.goto(`${baseUrl}/ai-projects`);
  await page.waitForLoadState("networkidle");
  
  console.log("Inspecting elements...");
  const data = await page.evaluate(() => {
    const dossier = document.querySelector(".professional-project-dossier");
    const grid = document.querySelector(".career-case-grid--expanded");
    const portfolioGrid = document.querySelector(".project-portfolio-grid");
    
    if (!dossier) return { error: "dossier not found" };
    if (!grid) return { error: "grid not found" };
    if (!portfolioGrid) return { error: "portfolioGrid not found" };
    
    const dossierRect = dossier.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();
    
    const cards = Array.from(grid.querySelectorAll(".career-case-card"));
    const cardData = cards.map((card, index) => {
      const rect = card.getBoundingClientRect();
      const style = window.getComputedStyle(card);
      return {
        index: index + 3,
        title: card.querySelector("h3")?.textContent || "No title",
        top: rect.top,
        bottom: rect.bottom,
        height: rect.height,
        background: style.background || style.backgroundColor,
        color: style.color,
        display: style.display
      };
    });
    
    const portfolioCards = Array.from(portfolioGrid.querySelectorAll(".project-portfolio-card"));
    const portfolioCardData = portfolioCards.map((card) => {
      return {
        caseNumber: card.querySelector(".project-masthead strong")?.textContent || "No case label",
        title: card.querySelector("h3")?.textContent || "No title"
      };
    });
    
    return {
      dossier: {
        top: dossierRect.top,
        bottom: dossierRect.bottom,
        height: dossierRect.height,
        background: window.getComputedStyle(dossier).background,
        display: window.getComputedStyle(dossier).display
      },
      grid: {
        top: gridRect.top,
        bottom: gridRect.bottom,
        height: gridRect.height,
        display: window.getComputedStyle(grid).display
      },
      cardData,
      portfolioCardData
    };
  });
  
  console.log("INSPECTION RESULTS:");
  console.log(JSON.stringify(data, null, 2));
  
  await browser.close();
  server.kill();
}

main().catch(console.error);
