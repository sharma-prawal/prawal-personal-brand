import { createImageMeta } from "./imageMetadata.js";
import { describeImage } from "./imageDescriptions.js";

export const routes = [
  { path: "/", label: "Home" },
  { path: "/journey", label: "Career" },
  { path: "/awards", label: "Awards" },
  { path: "/certifications", label: "Certifications" },
  { path: "/ai-projects", label: "Projects" },
  { path: "/conferences", label: "Conferences" },
  { path: "/highlights", label: "Highlights" },
  { path: "/recommendations", label: "Recommendations" }
];

export const executivePrinciples = [
  {
    title: "Crisis & Delivery Calm",
    detail: "Calm ownership across global delivery, high-pressure client milestones, and cross-functional team execution."
  },
  {
    title: "Production Reliability",
    detail: "Architecture decisions designed for scale, maintainable boundaries, and long-term delivery discipline."
  },
  {
    title: "AI-Assisted Velocity",
    detail: "Engineering workflows built on practical AI leverage to drive measurable speed, quality, and productivity."
  },
  {
    title: "Full-Stack Depth",
    detail: "Hands-on engineering across cloud platforms, data systems, product code, and technical leadership."
  }
];

export const leadershipOperatingSystem = [
  {
    label: "01",
    title: "Clarify the outcome",
    text: "Start from business intent, stakeholder risk, delivery pressure, and the decision that actually needs to be made."
  },
  {
    label: "02",
    title: "Architect for reliability",
    text: "Translate ambiguity into scalable systems, maintainable boundaries, measurable quality, and calm production execution."
  },
  {
    label: "03",
    title: "Use AI as leverage",
    text: "Apply AI-assisted workflows to accelerate delivery, improve documentation, reduce friction, and expose better options."
  },
  {
    label: "04",
    title: "Make proof visible",
    text: "Close the loop with working products, client trust, certifications, awards, conference presence, and measurable delivery signals."
  }
];

export const certificationFilters = [
  { id: "all", label: "All credentials" },
  { id: "ai-cloud", label: "AI + cloud" },
  { id: "hackerrank", label: "HackerRank" },
  { id: "aws-microsoft", label: "AWS + Microsoft" },
  { id: "engineering", label: "Engineering learning" }
];

export const certificationHighlights = [
  {
    title: "AWS Certified AI Practitioner",
    category: "AI + cloud",
    proof: ""
  },
  {
    title: "Microsoft Certified: Azure AI Fundamentals",
    category: "AI + cloud",
    proof: ""
  },
  {
    title: "Google Cloud Certified Cloud Digital Leader",
    category: "Cloud leadership",
    proof: ""
  },
  {
    title: "Certified Agile Leadership Essentials",
    category: "Leadership",
    proof: ""
  }
];

export const mediaLibrary = [
  {
    id: "awards",
    title: "Awards and recognition",
    path: "public/media/awards",
    count: "19 award images across 10 recognition groups",
    status: "Proof images active"
  },
  {
    id: "profile",
    title: "Profile portrait",
    path: "public/media/profile",
    count: "1 executive portrait image",
    status: "Proof image active"
  },
  {
    id: "certifications",
    title: "Certificate proofs",
    path: "public/media/certifications",
    count: "92 certificate and course images",
    status: "Proof images active"
  },
  {
    id: "projects",
    title: "Project screenshots",
    path: "public/media/projects",
    count: "33 screenshots across 7 project groups",
    status: "Proof images active"
  },
  {
    id: "conferences",
    title: "Conference presence",
    path: "public/media/conferences",
    count: "40 conference images across 8 event groups",
    status: "Proof images active"
  },
  {
    id: "usa-visit",
    title: "USA client visit",
    path: "public/media/usa_visit",
    count: "5 client visit images",
    status: "Proof images active"
  },
  {
    id: "book-contributor",
    title: "Book contribution",
    path: "public/media/book_contributor",
    count: "3 book contribution images",
    status: "Proof images active"
  }
];

const aiProjectRecords = [
  {
    name: "OpsPilot AI",
    group: "ai",
    type: "Agentic AI",
    stage: "Experimental · v0.12",
    summary: "Local-first incident investigation: a LangGraph agent correlates telemetry, change history, service dependencies and runbooks, proposes a fix, waits for a human to approve it, runs it in a sandbox and writes the RCA.",
    problem: "On-call engineers piece together logs, metrics, recent deploys and runbooks by hand before they can even guess at a root cause.",
    solution: "A LangGraph investigation workflow that calls two MCP servers (13 read tools, 2 action tools), retrieves runbooks with hybrid pgvector and full-text search, writes evidence-cited root-cause hypotheses and proposes a remediation from a fixed catalogue. A signed, hash-bound operator approval is required before the sandboxed action runs.",
    aiUsage: "Open-weight models on local Ollama for investigation and embeddings, schema-constrained output with validated citations, and no paid APIs or cloud services.",
    outcome: "Working local prototype with deterministic incident scenarios and read-only evidence providers for Loki, Prometheus, Datadog, Azure Monitor and AWS CloudWatch (CloudWatch tested against a synthetic fixture only).",
    stack: ["LangGraph", "MCP", "pgvector", "Ollama", "PostgreSQL", "Next.js"],
    repo: "https://github.com/sharma-prawal/opspilot-ai",
    previewCaption: "The v0.12 investigation workbench: the leading hypothesis with its cited evidence, and the evidence inspector open beside it.",
    images: ["/media/projects/github/opspilot-ai-workbench.jpg", "/media/projects/github/opspilot-ai.jpg"]
  },
  {
    name: "J.A.R.V.I.S. Personal Assistant",
    slug: "jarvis",
    group: "ai",
    type: "AI agent",
    stage: "Personal tool",
    summary: "A local daily-briefing dashboard: Playwright browser agents collect calendar and inbox signals, and an LLM writes the briefing, action items and follow-up answers.",
    problem: "Work is spread across several Gmail, Outlook, Slack, Teams and calendar accounts, and many organizations don't allow personal API access to them.",
    solution: "Browser agents read each service through locally stored sessions instead of official APIs, keep the last good snapshot when a service fails, and label stale data clearly.",
    aiUsage: "An LLM on Groq writes the prose briefing and action items and answers follow-up questions.",
    outcome: "Runs locally with per-service health checks, retries and fixture tests that never touch live accounts.",
    stack: ["Python", "FastAPI", "Playwright", "Groq"],
    repo: "https://github.com/sharma-prawal/personal-assistant",
    previewCaption: "The dashboard that brings the daily briefing and follow-ups together.",
    images: ["/media/projects/github/personal-assistant.jpg"]
  },
  {
    name: "Data Refinery Connectors MCP Server",
    group: "ai",
    thumbFit: "contain", // architecture diagram: show it whole
    type: "MCP server",
    stage: "Hackathon POC",
    summary: "An MCP server that lets AI agents check, create, enable, disable and delete Data Refinery datastreams in plain language: 26 tools over five APIs, hosted as a Databricks App.",
    problem: "Connector onboarding meant hand-clicking the Data Refinery UI for every client, market and platform. The team had shown it could be automated but had no governed API path for agents.",
    solution: "A FastMCP server at /mcp, inside one Databricks App, wraps five downstream APIs as 26 tools: 21 read, 5 write. A built-in chat UI runs a tool-calling loop, and Claude Code or Copilot can connect to the same server. I built the Adverity GraphQL integration, the chat-driven connector-creation flow, and enable, disable and delete, hardened against two upstream bugs.",
    aiUsage: "Claude Sonnet on Databricks drives the tool-calling loop. Every call carries the user's own Okta token, so each read and write is attributable.",
    outcome: "Demoed live as a hackathon POC: 26 tools shipped against 7 planned. It still needs a security review, rate limiting and a human-approval step for deletes before production.",
    stack: ["MCP", "FastMCP", "FastAPI", "Databricks Apps", "Claude Sonnet", "Okta"],
    previewCaption: "Architecture: MCP clients, the FastMCP tool layer, and the five downstream APIs it wraps.",
    images: ["/media/projects/Data Refinery MCP Server/architecture.svg"]
  },
  {
    name: "The Series",
    group: "product",
    thumbFit: "letterbox", // wide cover art: show it whole on black instead of cropping the title
    type: "Portfolio platform",
    stage: "Live",
    summary: "My career told as a streaming-style series, with an intro sequence, seasons and episodes. Built AI-assisted with Claude Code.",
    problem: "A standard portfolio reads like a resume. The same career data needed a format people actually browse.",
    solution: "A data-driven React and TypeScript site where all content lives in one file, with pipelines that generate the resume PDF in headless Chromium, cut out portraits and upscale images.",
    aiUsage: "Built AI-assisted with Claude Code, with AI upscaling in the image pipeline.",
    outcome: "Live, and reused as a portfolio template for three professionals.",
    stack: ["React", "TypeScript", "Vite", "Vercel", "Claude Code"],
    link: "https://prawal-the-series.vercel.app",
    linkLabel: "Watch the series",
    repo: "https://github.com/sharma-prawal/prawal-the-series",
    previewCaption: "Cover artwork for the streaming-style portfolio.",
    images: ["/media/projects/github/prawal-the-series.jpg"]
  },
  {
    name: "Sunrise Public School Website",
    group: "product",
    type: "Education website",
    stage: "Live",
    summary: "A website for Sun Rise Model Public School in Kandi, designed to establish trust for parents and local visitors through a clearer digital presence.",
    problem: "The school needed a credible digital presence that communicates identity, information, and legitimacy quickly.",
    solution: "Built a polished responsive website with clear navigation, institution context, and public-facing content.",
    aiUsage: "AI-assisted copy refinement, layout review, and content structuring during delivery.",
    outcome: "Live school website with visual proof captured across the core pages.",
    stack: ["Web", "Responsive UI", "Content design"],
    link: "https://sunriseschoolkandi.org/",
    linkLabel: "Live school site",
    previewCaption: "The school homepage introduces Sunrise and gives parents an admissions starting point.",
    images: [
      "/media/projects/Sun Rise School/01-home.png",
      "/media/projects/Sun Rise School/02-contact.png",
      "/media/projects/Sun Rise School/03-gallery.png",
      "/media/projects/Sun Rise School/04-academics.png",
      "/media/projects/Sun Rise School/05-about.png"
    ]
  },
  {
    name: "Interactive Lovebook Experience",
    group: "fun",
    type: "Personal storytelling app",
    stage: "Live",
    summary: "A Firebase-hosted interactive storytelling experience with polished narrative flow, visual moments, and emotional pacing.",
    problem: "A meaningful personal milestone needed a more memorable experience than a static greeting page.",
    solution: "Created a themed web app with narrative flow, visual moments, and a gift-like interaction model.",
    aiUsage: "AI-assisted visual direction, writing polish, and interaction ideation.",
    outcome: "Live Firebase-hosted experience with screenshot proof across the main story moments.",
    stack: ["Firebase", "React", "Interactive storytelling"],
    link: "https://praashi-lovebook.web.app/",
    linkLabel: "Open lovebook",
    previewCaption: "The opening page of the interactive storybook.",
    images: [
      "/media/projects/Lovebook/01-portrait.png",
      "/media/projects/Lovebook/02-travel-grid.png",
      "/media/projects/Lovebook/03-text-and-photo.png",
      "/media/projects/Lovebook/04-closing-qr.png"
    ]
  },
  {
    name: "Anniversary RPG Web Game",
    group: "fun",
    type: "Browser game",
    stage: "Live",
    summary: "A browser-based RPG experience with custom scenes, progression, interaction loops, and a personal narrative arc.",
    problem: "The anniversary experience needed to feel interactive, personal, and more premium than a conventional microsite.",
    solution: "Built a browser-based RPG with scene progression, custom storytelling, and game-like exploration.",
    aiUsage: "AI-assisted worldbuilding, dialogue iteration, and visual/story structure.",
    outcome: "Live web game with multiple captured gameplay and story screens.",
    stack: ["Game design", "Web", "Narrative UX"],
    link: "https://praashi.fun/",
    linkLabel: "Play RPG",
    previewCaption: "The opening screen where players begin the anniversary story.",
    images: [
      "/media/projects/Love RPG/01-title.png",
      "/media/projects/Love RPG/02-night-scene.png",
      "/media/projects/Love RPG/03-forest.png",
      "/media/projects/Love RPG/04-room.png",
      "/media/projects/Love RPG/05-hillside.png",
      "/media/projects/Love RPG/06-living-room.png"
    ]
  },
  {
    name: "Published Visual Novel Game",
    group: "fun",
    type: "Premium game",
    stage: "Published",
    summary: "A polished anime-style visual novel published on itch.io, built around cinematic scenes, emotional choices, and progression design.",
    problem: "The concept needed a more cinematic, premium game format that could stand apart from simple web interactions.",
    solution: "Created a visual novel experience with menu flow, story scenes, emotional choices, keepsakes, and vow moments.",
    aiUsage: "AI-assisted art direction, narrative pacing, and scene composition.",
    outcome: "Published itch.io game with a gallery of production-grade screenshots.",
    stack: ["Visual novel", "Game publishing", "Narrative design"],
    link: "https://prawalsharma.itch.io/praashi",
    linkLabel: "View on itch.io",
    previewCaption: "The main menu includes access to chapters, keepsakes and settings.",
    images: [
      "/media/projects/Anime VN/01-main-menu.jpg",
      "/media/projects/Anime VN/02-first-meeting.jpg",
      "/media/projects/Anime VN/03-emotional-choice.jpg",
      "/media/projects/Anime VN/04-memory-gallery.jpg",
      "/media/projects/Anime VN/05-keepsakes.jpg",
      "/media/projects/Anime VN/06-wedding-vow.jpg"
    ]
  },
  {
    name: "Android Notes App",
    group: "product",
    type: "Android app",
    stage: "Android only",
    summary: "A focused Android notes workflow with folders, editor states, quick actions, settings, and app identity screens.",
    problem: "The app needed to make simple note capture comfortable and usable without unnecessary product complexity.",
    solution: "Built a clean Android-first notes workflow with quick actions, folder structure, editor, and settings screens.",
    aiUsage: "AI-assisted UI critique, screen flow planning, and feature prioritization.",
    outcome: "Android app distributed through Drive, with screen proof for the core app states.",
    stack: ["Android", "Notes UX", "Mobile app"],
    link: "https://drive.google.com/file/d/1Fql6-zff4SuhVoESSZxk-Afdp_qLAiqX/view?usp=drive_link",
    linkLabel: "View app file",
    previewCaption: "The Android notes list, with quick access to notes and folders.",
    images: [
      "/media/projects/Notes App/04-notes-list.png",
      "/media/projects/Notes App/06-settings.png",
      "/media/projects/Notes App/01-notes-empty.png",
      "/media/projects/Notes App/02-speed-dial.png",
      "/media/projects/Notes App/03-editor.png",
      "/media/projects/Notes App/05-folders-empty.png",
      "/media/projects/Notes App/07-about.png"
    ]
  },
  {
    name: "Personal Branding Site",
    group: "product",
    type: "Portfolio system",
    stage: "Live",
    summary: "This site: a short editorial homepage backed by detailed pages for projects, awards, certifications, conferences and recommendations.",
    problem: "A senior engineering profile needs an executive summary and deeper evidence without feeling like a resume dump.",
    solution: "Built a multi-page proof system for career, awards, certifications, projects, conferences, highlights, and recommendations.",
    aiUsage: "AI-assisted UX planning, implementation, screenshot review, and iterative content organization.",
    outcome: "Live portfolio with automated screenshot review built into the workflow.",
    stack: ["React", "Vite", "Tailwind", "Framer Motion", "Visual QA"],
    link: "/",
    linkLabel: "View homepage",
    previewCaption: "The redesigned homepage pairs an executive introduction with selected client work.",
    images: [
      "/media/projects/Personal Branding Site/01-executive-hero.png",
      "/media/projects/Personal Branding Site/02-awards-page.png",
      "/media/projects/Personal Branding Site/03-ai-projects-page.png",
      "/media/projects/Personal Branding Site/04-journey-page.png"
    ]
  },
  {
    name: "AI-Driven Datastream Intelligence POC",
    group: "ai",
    thumbFit: "contain", // architecture diagram: show it whole
    type: "AI + data",
    stage: "POC",
    summary: "Schedule- and configuration-risk recommendations learned from historical pipeline behavior (XGBoost, explainable ML), plus read-only API access through an MCP server. Experimental, not production.",
    problem: "Data pipelines fail on schedule and configuration problems that only show up after the first run.",
    solution: "Trained XGBoost models on historical pipeline behavior to flag schedule and configuration risk before a run, explained each prediction, and exposed the platform's APIs read-only through an MCP server. Built with Amit Bora.",
    aiUsage: "Machine-learning model experimentation, feature thinking, and AI-assisted documentation of insights.",
    outcome: "Visual POC proof showing the data intelligence workflow and model-driven outputs.",
    stack: ["XGBoost", "Explainable ML", "MCP", "POC"],
    previewCaption: "Architecture sketch showing how pipeline telemetry feeds risk predictions.",
    images: [
      "/media/projects/POC - AI-Driven Datastream Intelligence/1773333444521.jpeg",
      "/media/projects/POC - AI-Driven Datastream Intelligence/1773333445241.jpeg",
      "/media/projects/POC - AI-Driven Datastream Intelligence/1773333445981.jpeg",
      "/media/projects/POC - AI-Driven Datastream Intelligence/1773333447282.jpeg"
    ]
  }
];

export const aiProjects = aiProjectRecords.map((project) => ({
  ...project,
  category: "Project proof",
  images: project.images.map((src, index) =>
    createImageMeta(src, {
      title: `${project.name} proof ${index + 1}`,
      date: "Project proof archive",
      category: project.type,
      alt: describeImage(src) || `${project.name}, screenshot ${index + 1} of ${project.images.length}`,
      caption: index === 0 ? project.previewCaption : describeImage(src) || `${project.name}, screenshot ${index + 1}.`,
      featured: index === 0,
      priority: index === 0
    })
  )
}));

export const journeyPrinciples = [
  "Show increasing scope: engineer, lead, technology lead, technology manager.",
  "Keep each role readable by surfacing the highest-signal bullets first.",
  "Tie the full timeline back to delivery ownership, global stakeholders, AI adoption, and architecture."
];

export const reviewRoutes = routes.map((route) => route.path);
