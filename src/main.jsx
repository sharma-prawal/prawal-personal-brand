import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import App, { preloadRoute } from "./App.jsx";
import "./styles.css";
import "./redesign.css";

window.history.scrollRestoration = "manual";

const container = document.getElementById("root");
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* Vercel Web Analytics: cookieless page views, including client-side
        route changes. Local dev only logs to the console. */}
    <Analytics mode={import.meta.env.PROD ? "production" : "development"} />
  </React.StrictMode>
);

// Known routes ship pre-rendered HTML (scripts/prerender.mjs); 404.html and
// the dev server ship an empty #root. The pre-rendered HTML assumes no
// reduced-motion preference, but framer-motion reads that preference during
// the first render, so those visitors get a fresh client render instead of a
// hydration that would keep the server's animation start styles.
const isPrerendered = container.firstElementChild !== null;
const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion)").matches;

// Load the current route's page first, so hydration renders the same content
// the HTML already shows instead of a Suspense fallback.
preloadRoute(window.location.pathname)
  .catch(() => {})
  .then(() => {
    if (isPrerendered && !prefersReducedMotion) {
      hydrateRoot(container, app);
    } else {
      createRoot(container).render(app);
    }
  });
