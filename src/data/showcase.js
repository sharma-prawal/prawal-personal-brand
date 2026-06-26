import { createImageMeta } from "./imageMetadata.js";

export const routes = [
  { path: "/", label: "Executive" },
  { path: "/journey", label: "Journey" },
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
    name: "Sunrise Public School Website",
    type: "Education website",
    stage: "Live",
    summary: "A public school website for Sunrise Public School, Kandi, designed to establish trust for parents and local visitors through a clearer digital presence.",
    problem: "The school needed a credible digital presence that communicates identity, information, and legitimacy quickly.",
    solution: "Built a polished responsive website with clear navigation, institution context, and public-facing content.",
    aiUsage: "AI-assisted copy refinement, layout review, and content structuring during delivery.",
    outcome: "Live school website with visual proof captured across the core pages.",
    stack: ["Web", "Responsive UI", "Content design"],
    link: "https://sunriseschoolkandi.org/",
    linkLabel: "Live school site",
    images: [
      "/media/projects/Sun Rise School/Screenshot 2026-05-25 at 7.35.43-PM.png",
      "/media/projects/Sun Rise School/Screenshot 2026-05-25 at 7.36.08-PM.png",
      "/media/projects/Sun Rise School/Screenshot 2026-05-25 at 7.36.24-PM.png",
      "/media/projects/Sun Rise School/Screenshot 2026-05-25 at 7.36.41-PM.png",
      "/media/projects/Sun Rise School/Screenshot 2026-05-25 at 7.45.39-PM.png"
    ]
  },
  {
    name: "Interactive Lovebook Experience",
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
    images: [
      "/media/projects/Lovebook/Screenshot 2026-05-25 at 7.37.25-PM.png",
      "/media/projects/Lovebook/Screenshot 2026-05-25 at 7.37.39-PM.png",
      "/media/projects/Lovebook/Screenshot 2026-05-25 at 7.38.04-PM.png",
      "/media/projects/Lovebook/Screenshot 2026-05-25 at 7.39.16-PM.png"
    ]
  },
  {
    name: "Anniversary RPG Web Game",
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
    images: [
      "/media/projects/Love RPG/Screenshot 2026-05-25 at 7.40.24-PM.png",
      "/media/projects/Love RPG/Screenshot 2026-05-25 at 7.41.03-PM.png",
      "/media/projects/Love RPG/Screenshot 2026-05-25 at 7.41.31-PM.png",
      "/media/projects/Love RPG/Screenshot 2026-05-25 at 7.42.08-PM.png",
      "/media/projects/Love RPG/Screenshot 2026-05-25 at 7.42.22-PM.png",
      "/media/projects/Love RPG/Screenshot 2026-05-25 at 7.44.35-PM.png"
    ]
  },
  {
    name: "Published Visual Novel Game",
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
    images: [
      "/media/projects/Notes App/06-settings.png",
      "/media/projects/Notes App/04-notes-list.png",
      "/media/projects/Notes App/01-notes-empty.png",
      "/media/projects/Notes App/02-speed-dial.png",
      "/media/projects/Notes App/03-editor.png",
      "/media/projects/Notes App/05-folders-empty.png",
      "/media/projects/Notes App/07-about.png"
    ]
  },
  {
    name: "Personal Branding Site",
    type: "Portfolio system",
    stage: "In progress",
    summary: "This current premium personal brand system, designed to connect executive positioning with detailed proof libraries.",
    problem: "A senior engineering profile needs an executive summary and deeper evidence without feeling like a resume dump.",
    solution: "Built a multi-page proof system for journey, awards, certifications, projects, conferences, highlights, and recommendations.",
    aiUsage: "AI-assisted UX planning, implementation, screenshot review, and iterative content organization.",
    outcome: "Live evolving brand architecture with automated screenshot review built into the workflow.",
    stack: ["React", "Vite", "Tailwind", "Framer Motion", "Visual QA"],
    link: "/",
    linkLabel: "View homepage",
    images: [
      "/media/projects/Personal Branding Site/01-executive-hero.png",
      "/media/projects/Personal Branding Site/02-awards-page.png",
      "/media/projects/Personal Branding Site/03-ai-projects-page.png",
      "/media/projects/Personal Branding Site/04-journey-page.png"
    ]
  },
  {
    name: "AI-Driven Datastream Intelligence POC",
    type: "AI + data",
    stage: "POC",
    summary: "A machine-learning proof of concept for datastream analysis, XGBoost-driven prediction, and decision-support workflows.",
    problem: "Streaming or operational data needs machine-learning interpretation before it becomes useful for decision-making.",
    solution: "Built a POC flow that uses XGBoost to surface patterns, predictions, and intelligence from datastream inputs.",
    aiUsage: "Machine-learning model experimentation, feature thinking, and AI-assisted documentation of insights.",
    outcome: "Visual POC proof showing the data intelligence workflow and model-driven outputs.",
    stack: ["XGBoost", "Machine learning", "Data intelligence", "POC"],
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
      alt: `${project.name} screenshot proof ${index + 1}`,
      caption: index === 0 ? project.summary : `${project.name} supporting screenshot ${index + 1}.`,
      featured: index === 0,
      priority: index === 0
    })
  )
}));

export const conferenceMoments = [
  {
    id: "conference-01",
    title: "AI Impact Summit",
    location: "In-person event",
    theme: "Artificial intelligence, enterprise adoption, and leadership perspective",
    takeaway: "Capture AI adoption signals and translate them into practical engineering leadership choices.",
    image: "/media/conferences/conference-placeholder.svg"
  },
  {
    id: "conference-02",
    title: "Leadership Offsite",
    location: "Recognition and strategy forum",
    theme: "Engineering leadership, ownership, and organizational growth",
    takeaway: "Connect recognition moments with the broader story of ownership, delivery, and long-term contribution.",
    image: "/media/conferences/conference-placeholder.svg"
  },
  {
    id: "conference-03",
    title: "Cloud and Architecture Sessions",
    location: "Industry learning",
    theme: "Cloud-native systems, serverless thinking, and scalable delivery",
    takeaway: "Use conference learning to sharpen cloud-native, serverless, and scalable architecture decisions.",
    image: "/media/conferences/conference-placeholder.svg"
  },
];

export const journeyPrinciples = [
  "Show increasing scope: engineer, lead, technology lead, technology manager.",
  "Keep each role readable by surfacing the highest-signal bullets first.",
  "Tie the full timeline back to delivery ownership, global stakeholders, AI adoption, and architecture."
];

export const reviewRoutes = routes.map((route) => route.path);
