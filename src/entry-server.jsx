// Build-time renderer. `npm run build` compiles this with `vite build --ssr`,
// then scripts/prerender.mjs calls render() once per route and writes each
// result into its own static HTML file. It never runs in the browser.
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App, { preloadAllRoutes } from "./App.jsx";

export { prerenderRoutes } from "./data/routes.js";

export async function render(url) {
  // With every page module loaded, nothing suspends, so the HTML holds the
  // full page rather than a Suspense fallback.
  await preloadAllRoutes();
  // Same tree as src/main.jsx (minus the browser-only Analytics, which
  // renders nothing), so hydration matches.
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </React.StrictMode>
  );
}
