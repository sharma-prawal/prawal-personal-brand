import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import App from "./App.jsx";
import "./styles.css";
import "./redesign.css";

window.history.scrollRestoration = "manual";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* Vercel Web Analytics: cookieless page views, including client-side
        route changes. Local dev only logs to the console. */}
    <Analytics mode={import.meta.env.PROD ? "production" : "development"} />
  </React.StrictMode>
);
