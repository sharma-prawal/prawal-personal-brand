# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (http://localhost:5173, also bound to 0.0.0.0)
npm run build      # Client build to dist/, SSR build to dist-ssr/, then pre-render every route (scripts/prerender.mjs)
npm run preview    # Preview production build
npm run screenshots # Capture Playwright screenshots (scripts/capture-screenshots.mjs)
```

No test suite is configured. Type-checking is not set up — rely on runtime validation in the browser.

## Architecture

Single-page React app (React 19, Vite, React Router v7, Tailwind CSS v3, Framer Motion). All routing is client-side with `<Routes>` in `src/App.jsx`. There is no backend; the only external API call is to Groq (chat completions) from `AIBrandChatbot.jsx`.

**Everything lives in `src/App.jsx`** — all page components (`ExecutivePage`, `JourneyPage`, `AwardsPage`, `CertificationsPage`, `AIProjectsPage`, `ConferencesPage`, `HighlightsPage`, `RecommendationsPage`) plus shared layout components (`AppShell`, `Reveal`, `MotionGroup`, `MotionCard`, `ProofImage`, etc.) are defined inline in this one ~4000-line file. The only lazy-loaded component is `AIBrandChatbot`.

**Data layer** — all content is static JS in `src/data/`:
- `profile.js` — personal info, experience, awards, skills, impact highlights, leadership notes, signature framework
- `showcase.js` — AI portfolio projects, executive principles, journey principles, leadership operating system, route metadata
- `mediaAssets.js` — award images, conference images, highlights, profile portrait (referenced by filename key)
- `certificationAssets.js` — certification badge assets
- `imageMetadata.js` — `imageSrc()`, `imageAlt()`, `imageCaption()` helpers that map image keys to paths

**Static assets** — `public/` contains downloadable PDFs (`prawal-sharma-executive-profile.pdf`, `ai-engineering-leadership-framework.pdf`) and the standalone HTML versions of those documents. Images are under `Assets/`.

**AI chatbot** — `AIBrandChatbotFallback` renders a skeleton while the real `AIBrandChatbot` loads. The chatbot calls the Groq API using the key in `.env.local` (`VITE_GROQ_API_KEY`). It has access to all profile/media data for context-aware answers.

**Motion system** — shared animation constants (`premiumEase`, `exitEase`, `fadeUp`, `stagger`, `itemReveal`, `cardHover`, `tapPress`, `viewportReveal`) defined at module level. `useReducedMotion()` gates all animations. `<Reveal>` wraps scroll-triggered fade-in; `<MotionGroup>` wraps stagger containers.

**Pre-rendering** — `npm run build` renders every known route to its own static HTML (`dist/<route>/index.html`) with `src/entry-server.jsx` + `scripts/prerender.mjs`. The route list and per-route `<title>` come from `prerenderRoutes()` in `src/data/routes.js` (case studies are derived from `aiProjectsWithSlugs` / `professionalCasesWithSlugs`). `src/main.jsx` preloads the current route's page module, then `hydrateRoot`s the pre-rendered HTML (or `createRoot`s when `#root` is empty, as in dev and `404.html`, or when the visitor prefers reduced motion). Anything that reads `window`, `matchMedia` or the clock must do it in an effect, or hydration will not match.

**Deployment** — Vercel (`.vercel/project.json`), which runs `npm run build` itself. `vercel.json` has no SPA rewrites: Vercel serves the pre-rendered files and falls through to `dist/404.html` (the empty app shell) with a real 404 for any other path. `/references` is a Vercel redirect to `/recommendations`.

## Key conventions

- Image references use string keys resolved through `imageMetadata.js` helpers — do not reference image paths directly.
- The `generateATSResume()` function in `App.jsx` builds a complete HTML resume in a new tab and auto-triggers `window.print()` for PDF save — it does not hit any server.
- `projectSlug()` and the `aiProjectsWithSlugs` / `professionalCasesWithSlugs` arrays derive URL slugs at module load time — keep project names stable or update all slug-dependent routes together.
- ngrok tunnels are explicitly allowed in `vite.config.js` for external preview during development.
