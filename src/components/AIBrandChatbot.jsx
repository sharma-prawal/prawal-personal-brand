import React, { useEffect, useRef, useState } from "react";
import OverlayDialog from "./OverlayDialog.jsx";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Cloud,
  Code2,
  Linkedin,
  Loader2,
  Mail,
  MessageSquare,
  Send,
  Trophy,
  X,
  ZoomIn
} from "lucide-react";
import { CheckCircleMark, DiagArrow, DocMark, StarMark, WorkMark } from "./icons.jsx";
import { profile } from "../data/profile.js";
import { imageSrc } from "../data/imageMetadata.js";
import { certificationAssets } from "../data/certificationAssets.js";
import { awardAssets, conferenceAssets, professionalHighlights } from "../data/mediaAssets.js";
import { retrieveChunks, buildContext, debugLog, classifyIntent } from "../lib/chatbotRag.js";
import { GROQ_MODELS } from "../lib/groqModels.js";

// Whether the site was built with GROQ_API_KEY set (see vite.config.js). The
// key itself stays on the server, in api/chat.js.
const CHAT_LIVE = typeof __CHAT_LIVE__ !== "undefined" && __CHAT_LIVE__;

const premiumEase = [0.16, 1, 0.3, 1];

// ── Debug mode: add ?debug=1 to the URL to enable RAG logging ────────────────
const debugMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug');

// ─────────────────────────────────────────────────────────────────────────────
// VISUAL ASSETS CATALOG
// Maps every image on the site into a prompt block so the LLM can embed them.
// To add a new image: add it to the relevant section below.
// ─────────────────────────────────────────────────────────────────────────────

// The image list is only sent when the visitor asks to see something, and then
// only the entries that match the question. Sending every path on the site with
// every question cost ~5K tokens, over the free Groq tier's per-minute budget.
const VISUAL_QUERY = /\b(photo|picture|image|pic|show|see|proof|certificate|badge|award|trophy|visit|event|conference)s?\b/i;

function generateVisualAssetsPrompt(queryText) {
  if (!VISUAL_QUERY.test(queryText)) return "";
  const words = queryText.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
  const matches = (title) => words.some((w) => title.toLowerCase().includes(w));

  const groups = [
    ["Highlights & Client Visits", professionalHighlights.map((h) => ({ title: h.title, images: h.images.map(imageSrc) }))],
    ["Awards & Certificates", awardAssets.map((a) => ({ title: `${a.title}" (${a.issuer}, ${a.date})`, images: a.images.map(imageSrc) }))],
    ["Conferences", conferenceAssets.map((c) => ({ title: `${c.title}" (${c.year})`, images: c.images.map(imageSrc) }))],
    // Official certifications only; the 80+ course certificates are left out.
    ["Certifications", certificationAssets.filter((c) => c.proctored).map((c) => ({ title: `${c.title}" (${c.provider})`, images: [c.src] }))]
  ];
  const anyMatch = groups.some(([, items]) => items.some((item) => matches(item.title)));

  let prompt = "\nVISUAL ASSETS (embed with exact Markdown: ![Caption](URL) — NEVER invent URLs):\n";
  for (const [label, items] of groups) {
    // With a match, list only matching entries in full; otherwise one image per entry.
    const shown = anyMatch ? items.filter((item) => matches(item.title)) : items.map((item) => ({ ...item, images: item.images.slice(0, 1) }));
    if (!shown.length) continue;
    prompt += `\n${label}:\n`;
    for (const item of shown) {
      prompt += `  * "${item.title.replace(/^"/, "")}:\n`;
      item.images.forEach((src, i) => { prompt += `    - Image ${i + 1}: ${src}\n`; });
    }
  }
  return prompt;
}

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM PROMPT BUILDER
// Constructs a focused, grounded system prompt using RAG-retrieved context.
// ─────────────────────────────────────────────────────────────────────────────

function buildSystemPrompt(ragContext, queryText) {
  return `You are Prawal Sharma's personal AI assistant on his portfolio site. Help visitors understand his work, experience, skills, projects, certifications, and leadership.

GROUNDING RULES:
1. Answer ONLY from the WEBSITE KNOWLEDGE BASE below. Never use general internet knowledge.
2. If information is missing: say "That detail isn't on the site — reach Prawal directly via LinkedIn." (use the action button, don't write a URL).
3. NEVER invent metrics, dates, company names, or credentials not in the knowledge base.
4. For resume requests: mention the Executive Profile and the Resume PDF (both downloadable in this chat).
5. For contact requests: write one warm sentence, then stop — the action buttons handle LinkedIn and the contact form. Do NOT paste any URL in your text.
6. For image/proof requests: embed ONLY exact paths from VISUAL ASSETS using ![Caption](URL). If no VISUAL ASSETS list is given, do not embed images.

TONE: Warm, confident, conversational — like a well-briefed colleague, not a FAQ bot.

RESPONSE FORMAT (this renders in a narrow mobile chat — follow strictly):
- LENGTH: 60–90 words maximum. Most questions need 2–4 sentences only. If you exceed 100 words you are being verbose — cut it.
- BULLETS: Use plain bullets only: "- fact." Maximum 4 bullets per response.
- NEVER use labeled bullets like "**Enterprise AI**: description" or "• Enterprise: text" or "**Cloud-native**: he has...". These render as a broken two-column layout on mobile. Instead write prose: "He led an AI adoption program at Successive Digital..."
- NEVER use markdown headers (##). NEVER start a bullet with a bold category name followed by a colon.
- "Who is / tell me about Prawal" → 3–4 sentences of flowing prose, no bullets.
- "What has he done / what are his skills" → 3–4 plain bullets, each under 12 words.
- "How is he different / what makes him unique" → 2–3 sentences of prose, not a list.
- Contact/reach → One sentence only. No URLs in text.
- Never begin three sentences in a row with "Prawal" or "He" — vary sentence structure.

WEBSITE KNOWLEDGE BASE (your only source of truth):
${ragContext}

${generateVisualAssetsPrompt(queryText)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// VISION HELPER — reads certificate images for detail queries
// ─────────────────────────────────────────────────────────────────────────────

function findCertForVisionQuery(userText) {
  const isDetailQuery = /expir|valid until|issue\s*date|credential\s*id|when does|when did|how long|renew|badge\s*id|cert\s*number/i.test(userText);
  if (!isDetailQuery) return null;
  const lower = userText.toLowerCase();
  const commonWords = new Set(["cert", "cloud", "certified", "professional", "associate", "fundamentals", "official", "exam"]);
  let best = null, bestScore = 0;
  for (const cert of certificationAssets) {
    const words = (cert.title + " " + cert.provider).toLowerCase().split(/\W+/).filter(w => w.length > 4 && !commonWords.has(w));
    const score = words.filter(w => lower.includes(w)).length;
    if (score > bestScore) { bestScore = score; best = cert; }
  }
  return bestScore > 0 ? best : null;
}

async function fetchImageAsBase64(src) {
  const res = await fetch(src);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// LLM API CALL — Groq, through the site's own /api/chat (api/chat.js), which
// holds the key. RAG retrieval runs here before the system prompt is assembled.
// ─────────────────────────────────────────────────────────────────────────────

async function callLLMAPI(messages, onChunk, signal) {
  // 1. Find last user message
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
  const queryText = lastUserMsg?.text || '';

  // 2. RAG retrieval — get the most relevant knowledge chunks
  const retrievalResult = retrieveChunks(queryText, 7);
  const ragContext = buildContext(retrievalResult.results);

  // 3. Build focused system prompt with retrieved context
  const systemInstructionText = buildSystemPrompt(ragContext, queryText);

  // 4. Debug log (enable with ?debug=1)
  if (debugMode) {
    debugLog(queryText, retrievalResult, ragContext, null);
  }

  // 5. Vision: check if this is a cert-detail query needing image reading
  const visionCert = findCertForVisionQuery(queryText);
  let visionDataUrl = null;
  if (visionCert && visionCert.type === "image") {
    try { visionDataUrl = await fetchImageAsBase64(visionCert.src); } catch (_) { /* skip */ }
  }

  const filteredMsgs = messages.filter(m => m.role === 'user' || m.role === 'model');
  const formatMessages = (withImage) => [
    { role: "system", content: systemInstructionText },
    ...filteredMsgs.map((m, i) => {
      const isLastUser = m.role === 'user' && i === filteredMsgs.length - 1;
      if (isLastUser && withImage && visionDataUrl) {
        return {
          role: "user",
          content: [
            { type: "text", text: m.text + "\n\nThe certificate image is attached. Read all visible text (issue date, expiry, credential ID) to answer accurately." },
            { type: "image_url", image_url: { url: visionDataUrl } }
          ]
        };
      }
      return { role: m.role === 'user' ? 'user' : 'assistant', content: m.text };
    })
  ];

  // Try each model in order. Move on when Groq no longer serves one, or when
  // one is over its per-minute quota (each model has its own; 413 is Groq's
  // answer when a single request exceeds that quota).
  let response;
  for (const [index, candidate] of GROQ_MODELS.entries()) {
    response = await fetch("/api/chat", {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: candidate.id,
        messages: formatMessages(candidate.vision),
        temperature: 0.15,
        max_tokens: 350,
        stream: true,
        ...candidate.options
      })
    });
    if (response.ok) break;
    const err = await response.json().catch(() => ({}));
    const msg = err.error?.message || "Failed to contact the assistant API";
    const isLast = index === GROQ_MODELS.length - 1;
    const rateLimited = response.status === 429 || response.status === 413;
    const modelUnavailable = response.status === 404 || /model .*(does not exist|decommissioned|not found)|do not have access/i.test(msg);
    if (rateLimited && isLast) throw new Error("RATE_LIMIT");
    if (!rateLimited && (!modelUnavailable || isLast)) throw new Error(msg);
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = "";
  let buffered = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    // An SSE line can be split across network chunks; keep the unfinished
    // tail for the next read.
    buffered += decoder.decode(value, { stream: true });
    const lines = buffered.split("\n");
    buffered = lines.pop();
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const jsonStr = trimmed.slice(5).trim();
      if (jsonStr === "[DONE]") break;
      try {
        const parsed = JSON.parse(jsonStr);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) { accumulated += delta; onChunk?.(accumulated); }
      } catch (_) { /* malformed SSE line */ }
    }
  }

  if (debugMode && accumulated) debugLog(queryText, retrievalResult, ragContext, accumulated);
  return accumulated || "I'm sorry, I couldn't generate a response.";
}
// ─────────────────────────────────────────────────────────────────────────────
// SANDBOX ENGINE
// Used when no API key is configured, or as a rate-limit fallback.
// Uses classifyIntent() for accurate routing, then builds responses from
// the actual data in profile.js and data files.
//
// To add a new intent handler: add a case below and build from data files.
// ─────────────────────────────────────────────────────────────────────────────

function getSandboxResponse(inputText) {
  const query = inputText.toLowerCase().trim();
  const intents = classifyIntent(inputText);

  // ── Greeting ──────────────────────────────────────────────────────────────
  if (/\b(hello|hi|hey|greetings|howdy|good morning|good afternoon)\b/.test(query)) {
    return {
      text: "Hey! I'm here to help you learn about Prawal. Ask me anything — his engineering background, the systems he's built, cloud certifications, awards, leadership approach, or just whether he'd be the right fit for what you're working on.",
      actions: [
        { label: "Executive summary", query: "Summarize Prawal's engineering leadership and delivery experience.", icon: "briefcase" },
        { label: "AI and cloud work", query: "What AI and cloud projects has he delivered?", icon: "sparkles" },
        { label: "Send a message", type: "email_form", icon: "mail" },
        { label: "Connect on LinkedIn", url: "https://www.linkedin.com/in/sharma-prawal/" }
      ]
    };
  }

  // ── Resume / CV ────────────────────────────────────────────────────────────
  if (intents.includes('resume') || /\b(resume|cv|pdf|download|ats)\b/.test(query)) {
    return {
      text: "Two formats available depending on what you need:\n\n- **Executive Profile:** Built for senior leadership conversations — leads with outcomes, platform breadth, and delivery scale. Good for C-suite or committee review.\n- **Resume (PDF):** His current 2-page resume — ATS-friendly, the same version he uses for job applications.",
      actions: [
        { label: "Download Executive Profile", type: "download_exec" },
        { label: "Download CV (PDF)", type: "download_ats" }
      ]
    };
  }

  // ── Contact ────────────────────────────────────────────────────────────────
  if (intents.includes('contact')) {
    return {
      text: "He's based in Delhi, though he's delivered directly in the US, UK, and South Africa — B1/B2 visa, so US onsite is straightforward.\n\nBest ways to reach him:\n- **LinkedIn:** Fastest path for serious conversations → [linkedin.com/in/sharma-prawal](https://www.linkedin.com/in/sharma-prawal/)\n- **Direct note:** Use the form below and I'll make sure it reaches him directly.",
      actions: [
        { label: "Send a direct message", type: "email_form", icon: "mail" },
        { label: "Open LinkedIn", url: "https://www.linkedin.com/in/sharma-prawal/" }
      ]
    };
  }

  // ── Experience / Career ────────────────────────────────────────────────────
  if (intents.includes('experience')) {
    return {
      text: "Ten years in engineering: nine at Successive Digital (since August 2017) across five roles, after early roles at GirnarSoft, NIIT Technologies and Aptech.\n\n- Technology Manager (Nov 2024–now): leads two client engagements of 5–12 contributors each for US, UK and South Africa clients; 20–30% AI-assisted productivity lift\n- Technology Lead (2021–2024): Connectors Platform (90+ data sources) and ACH payments (160K+ daily transactions, 99.9% uptime)\n- Software Engineer and Associate Software Engineer (2018–2021): full-stack delivery with Node.js, React and GraphQL\n- Software Engineer Trainee (2017–2018): internal tools for meeting bookings and HR documents",
      actions: [
        { label: "Major projects", query: "What are his major engineering projects?" },
        { label: "Tech stack", query: "What is his technical stack?" },
        { label: "Download Executive Profile", type: "download_exec" }
      ]
    };
  }

  // ── Skills / Tech Stack ───────────────────────────────────────────────────
  if (intents.includes('skill')) {
    return {
      text: "Cloud-first, AI-forward, full-stack across engineering and leadership:\n\n- AI/LLM: AI-assisted delivery, RAG, LLM and MCP proofs of concept\n- Backend: Node.js, GraphQL (Apollo), REST, PHP, Laravel, Python\n- Frontend: React, Redux, TypeScript, JavaScript\n- Cloud: AWS, Azure (Functions, Service Bus), GCP, Docker, serverless and event-driven architecture\n- Data: MySQL, MongoDB, PostgreSQL, Snowflake",
      actions: [
        { label: "Cloud certifications", query: "What cloud certifications does he have?" },
        { label: "AI projects", query: "What AI projects has he built?" },
        { label: "Download CV (PDF)", type: "download_ats" }
      ]
    };
  }

  // ── Education ─────────────────────────────────────────────────────────────
  if (intents.includes('education')) {
    return {
      text: "B.Tech in Computer Science, Maharshi Dayanand University (MDU), 2012–2016, 78% score.\n\nThe CS foundation is what backs his platform thinking — distributed systems, data pipelines, cloud architecture. It's not the headline, but it's what makes the architectural depth credible.",
      actions: [
        { label: "Technical skills", query: "What is his technical stack?" },
        { label: "Cloud certifications", query: "What certifications does he have?" }
      ]
    };
  }

  // ── Certifications ────────────────────────────────────────────────────────
  if (intents.includes('certification')) {
    return {
      text: "**93 credentials** — the flagship proctored certificates:\n\n- **Claude Certified Architect – Foundations** (Anthropic, Aug 2026 — the most recent)\n![Claude Certified Architect – Foundations](/media/certifications/Anthropic/Claude Certified Architect - Foundations.png)\n- **AWS Certified AI Practitioner** (May 2025)\n![AWS AI Practitioner](/media/certifications/AWS/AWS Certified AI Practitioner.png)\n- **AWS Certified Developer – Associate**\n![AWS Developer Associate](/media/certifications/AWS/AWS Certified Developer - Associate.png)\n- **Google Cloud Certified: Cloud Digital Leader**\n![GCP Cloud Digital Leader](/media/certifications/GCP/Google Cloud Certified Cloud Digital Leader.png)\n- **Microsoft Certified: Azure Fundamentals (AZ-900)**\n![Azure Fundamentals](/media/certifications/Azure/Microsoft Certified Azure Fundamentals.png)\n- **Certified Agile Leadership Essentials (Scrum Alliance)**\n![Certified Agile Leadership Essentials](/media/certifications/ScrumAlliance/Certified Agile Leadership Essentials.png)\n\nAll three major cloud platforms covered. The Claude and AWS AI certifications reflect where his delivery focus sits now.",
      actions: [
        { label: "View all 93 credentials", url: "/certifications" },
        { label: "Technical stack", query: "What is his technical stack?" }
      ]
    };
  }

  // ── Awards ────────────────────────────────────────────────────────────────
  if (intents.includes('award')) {
    const recent = profile.awards.slice(0, 4);
    return {
      text: `**10 awards across 8 years** — that's the signal worth noting. Not a one-time recognition; a pattern that kept repeating across different phases of the career.\n\nRecent ones:\n\n${recent.map(a => `- **${a.title}** (${a.date})`).join('\n')}\n\nThe spread tells the story: ownership awards, client trust awards, delivery performance awards, longevity recognition. Different moments, same underlying pattern.`,
      actions: [
        { label: "View awards gallery", url: "/awards" },
        { label: "Download Executive Profile", type: "download_exec" }
      ]
    };
  }

  // ── Recommendations ───────────────────────────────────────────────────────
  if (intents.includes('recommendation')) {
    const featured = profile.recommendations.slice(0, 2);
    return {
      text: `**${profile.recommendations.length} LinkedIn recommendations** from managers, senior peers, and engineers who've worked alongside him. What's interesting is the overlap — the same things come up regardless of who's writing: calm under pressure, technical depth, and the ability to give teams clarity without micromanaging.\n\nDirect quotes:\n\n${featured.map(r => `*"${r.quote}"*\n— **${r.name}**, ${r.role}`).join('\n\n')}`,
      actions: [
        { label: "Read all recommendations", url: "/recommendations" },
        { label: "His leadership approach", query: "What is his leadership philosophy?" }
      ]
    };
  }

  // ── Conferences ───────────────────────────────────────────────────────────
  if (intents.includes('conference')) {
    return {
      text: "He attends events that are relevant to where enterprise technology is actually moving — not just whatever's trending on social:\n\n- **AI Impact Summit 2026** — Enterprise AI adoption and leadership signals\n- **AWS Symposium 2023** — Cloud architecture and platform modernization\n- **Convergence India Expo 2026** — Digital infrastructure and emerging tech\n- **Deloitte Fast 50 2023** — Invite-only high-growth leadership forum\n- **MongoDB.local 2024 & 2025** — Data platforms and developer productivity\n- **IAMAI 2023** — Internet and AI ecosystem conversations",
      actions: [
        { label: "View conference gallery", url: "/conferences" },
        { label: "His AI leadership", query: "What is his AI engineering leadership framework?" }
      ]
    };
  }

  // ── Leadership / Framework ────────────────────────────────────────────────
  if (intents.includes('leadership')) {
    return {
      text: "The operating model runs on four principles — not theory, this is how his teams actually work:\n\n**AI Engineering Leadership Framework:**\n- **Clarify leverage** — Find where AI removes real delivery friction: code review cycles, debugging time, documentation. Not where it sounds good in a presentation.\n- **Protect judgment** — Architecture decisions, security tradeoffs, and quality standards stay with accountable engineers. The model assists; it doesn't decide.\n- **Operationalize** — Move from experiments to repeatable workflows with measurable output. Demos don't count. Sustained team velocity does.\n- **Prove outcomes** — Tie AI adoption to cycle-time improvement and delivery confidence. If you can't measure it, it's not adopted yet.\n\n*“AI is most valuable when it reduces engineering friction without replacing engineering judgment.”*",
      actions: [
        { label: "Download AI Framework PDF", url: "/ai-engineering-leadership-framework.pdf" },
        { label: "His full experience", query: "What is his career experience?" },
        { label: "LinkedIn", url: "https://www.linkedin.com/in/sharma-prawal/" }
      ]
    };
  }

  // ── Highlights: USA visit, book, international ────────────────────────────
  if (intents.includes('highlight')) {
    if (/\b(book|publication|author|subtle art|communication|contributor)\b/.test(query)) {
      return {
        text: "He's a published contributor to *The Subtle Art of Effective Communication* — an organizational book on workplace communication and active listening.\n\n![Book Cover](/media/book_contributor/the-subtle-art-of-effective-communication-original-imagny4gqm78nwn3.webp)\n![Contribution Page](/media/book_contributor/1680621098666.jpeg)\n\nAvailable on [Amazon](https://amzn.eu/d/fgmVx7H) and [Flipkart](https://bit.ly/40XXDR0).",
        actions: [
          { label: "Verify on Amazon", url: "https://amzn.eu/d/fgmVx7H" },
          { label: "Verify on Flipkart", url: "https://bit.ly/40XXDR0" }
        ]
      };
    }
    return {
      text: "B1/B2 visa and direct US onsite delivery experience — the international comfort level is real, not just on paper.\n\n![USA Client Visit](/media/usa_visit/502755631_9955026841221434_8795860600647518005_n.jpg)\n![Client Collaboration](/media/usa_visit/553760021_24637343969229812_8881836766352855585_n.jpg)\n\nProfessional delivery across **US, UK, and South Africa**. Personal travel: Phuket, Nepal, Vietnam, Dubai.",
      actions: [
        { label: "View highlights", url: "/highlights" },
        { label: "Full profile summary", query: "Summarize Prawal's profile for a recruiter." }
      ]
    };
  }

  // ── AI-specific queries ("what has he done in AI world") ──────────────────
  if (/\b(ai world|done in ai|ai work|ai contribution|what.*ai|how.*ai|ai career|ai adoption|ai framework|llm integration|xgboost)\b/i.test(query)) {
    return {
      text: "Two tracks — enterprise delivery and independent builds:\n\nAt Successive Digital (2023–2025): ran a structured AI adoption program — code review acceleration, AI-assisted debugging, documentation automation. Result: 20–30% team productivity lift. Guided schedule-intelligence, LLM and MCP integrations as proofs of concept. Created the AI Engineering Leadership Framework (clarify leverage → protect judgment → operationalize → prove outcomes).\n\nPersonally: XGBoost ML POC for datastream intelligence, this personal brand site (built AI-first), plus an RPG game, lovebook, visual novel, and notes app — all using AI as a genuine collaborator throughout design and build.",
      actions: [
        { label: "View AI projects", url: "/ai-projects" },
        { label: "Download AI Framework PDF", url: "/ai-engineering-leadership-framework.pdf" },
        { label: "Cloud & AI certifications", query: "What certifications does he have?" }
      ]
    };
  }

  // ── Projects ──────────────────────────────────────────────────────────────
  if (intents.includes('project')) {
    return {
      text: "Enterprise delivery (NDA-safe, evidence-backed):\n\n- Connectors Platform: data integration across 90+ sources — Facebook Ads, Google Campaign Manager, OAuth flows, taxonomy management\n- ACH Banking Platform: white-labeled debit tender with fraud detection, 160K+ daily transactions at 99.9% uptime\n- Data Serve Platform: centralized data layer across GCP, Azure ADLS, AWS S3, and Snowflake\n\nIndependent: school website, lovebook, RPG game, visual novel, notes app — all built AI-first.",
      actions: [
        { label: "View AI projects", url: "/ai-projects" },
        { label: "Cloud certifications", query: "What cloud certifications does he have?" }
      ]
    };
  }

  // ── Identity / Summary / Bio ──────────────────────────────────────────────
  if (intents.includes('identity') || /\b(summary|summarize|bio|profile|about|prawal|who is|background|headline|recruiter)\b/.test(query)) {
    return {
      text: `**Prawal Sharma** — Technology Manager with 10 years in engineering, nine at Successive Digital across five roles. The short version for a recruiter:\n\n- **Scale:** 160K+ daily ACH transactions at 99.9% uptime on the payments platform he leads\n- **Leadership:** two client engagements of 5–12 contributors each, for US, UK and South Africa clients\n- **AI adoption:** 20–30% team productivity lift from structured AI tooling — measurable, not claimed\n- **Credentials:** Claude Certified Architect, plus AWS, Azure, and GCP certified — 93 in total\n- **Recognition:** 10 awards, ${profile.recommendations.length} LinkedIn recommendations, B1/B2 visa with US onsite delivery experience\n- **Current focus:** AI-assisted delivery, plus LLM and MCP proofs of concept`,
      actions: [
        { label: "Full experience", query: "What is his career experience?" },
        { label: "Major projects", query: "What are his major engineering projects?" },
        { label: "Download Executive Profile", type: "download_exec" },
        { label: "Connect on LinkedIn", url: "https://www.linkedin.com/in/sharma-prawal/" }
      ]
    };
  }

  // ── Default fallback ──────────────────────────────────────────────────────
  return {
    text: "Happy to help — I'm well-briefed on Prawal's work. Ask about his engineering experience, specific projects (the banking platform or data pipeline work are good starting points), cloud certifications, leadership approach, awards, or just ask me to summarize his profile.\n\nWhat would you like to know?",
    actions: [
      { label: "Executive summary", query: "Summarize Prawal's profile for a recruiter.", icon: "briefcase" },
      { label: "Technical stack", query: "What is his technical stack?", icon: "stack" },
      { label: "Download CV", query: "Can I download his CV?" },
      { label: "Connect on LinkedIn", url: "https://www.linkedin.com/in/sharma-prawal/" }
    ]
  };
}

export default function AIBrandChatbot({ downloadResume, generateExecutiveProfile }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const wasOpenRef = useRef(false);
  const returnFocusRef = useRef(null);

  // The header button opens the assistant with this event. A click made
  // before this component loaded leaves a flag instead, picked up here.
  useEffect(() => {
    const open = () => {
      window.__assistantOpenRequested = false;
      returnFocusRef.current = document.activeElement;
      setIsOpen(true);
    };
    if (window.__assistantOpenRequested) open();
    window.addEventListener("assistant:open", open);
    return () => window.removeEventListener("assistant:open", open);
  }, []);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Keyboard handling: focus the input on open, return focus to the launcher on close.
  useEffect(() => {
    if (isOpen) {
      setIsFullScreen(window.matchMedia("(max-width: 480px), (max-height: 500px)").matches);
      const frame = requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
      wasOpenRef.current = true;
      return () => cancelAnimationFrame(frame);
    }
    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      const frame = requestAnimationFrame(() => {
        // Return focus to whatever opened the assistant (normally the header button).
        const opener = returnFocusRef.current;
        returnFocusRef.current = null;
        const target = (opener?.isConnected && opener.offsetParent ? opener : null) || document.querySelector(".assistant-trigger") || document.getElementById("main");
        target?.focus({ preventScroll: true });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [isOpen]);

  const handlePanelKeyDown = (event) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      setIsOpen(false);
      return;
    }
    // When the panel covers the whole screen it behaves as a modal: keep Tab inside it.
    if (event.key !== "Tab" || !isFullScreen || !panelRef.current) return;
    const focusable = [...panelRef.current.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "model",
      text: "Ask about Prawal's **engineering leadership**, **cloud platforms**, **AI-assisted projects**, certifications, and delivery experience.",
      actions: [
        { label: "Executive summary", query: "Summarize Prawal's engineering leadership and delivery experience.", icon: "briefcase" },
        { label: "AI and cloud projects", query: "Show Prawal's AI and cloud project proof.", icon: "sparkles" },
        { label: "Download CV", type: "download_ats", icon: "file" },
        { label: "Send a message", type: "email_form", icon: "mail" },
        { label: "LinkedIn profile", url: "https://www.linkedin.com/in/sharma-prawal/", icon: "linkedin" }
      ]
    }
  ]);
  const [emailForm, setEmailForm] = useState({ name: "", email: "", message: "" });
  const [emailFormVisible, setEmailFormVisible] = useState(false);
  const [emailFormStatus, setEmailFormStatus] = useState(null); // null | 'sending' | 'sent' | 'error'
  const [inputValue, setInputValue] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [rateLimitAlert, setRateLimitAlert] = useState(false);
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);

  const messagesEndRef = useRef(null);
  // One send at a time. isPending is state, so two clicks in the same frame
  // (a double-click on a suggestion chip) would both see it as false; the ref
  // is updated synchronously. The controller cancels a live request if the
  // assistant unmounts mid-answer.
  const sendInFlight = useRef(false);
  const requestController = useRef(null);
  useEffect(() => () => requestController.current?.abort(), []);

  const apiMode = CHAT_LIVE ? "live" : "sandbox";
  const activeProvider = CHAT_LIVE ? "groq" : "sandbox";
  const providerLabel = CHAT_LIVE ? `Groq / ${GROQ_MODELS[0].label}` : "Local sandbox";
  const connectionLabel = apiMode === "live" ? "Live portfolio Q&A" : "Local portfolio Q&A";
  const footerProviderLabel =
    activeProvider === "sandbox"
      ? "Local sandbox"
      : `Powered by ${providerLabel}`;

  const getActionIcon = (action) => {
    if (action.type === "download_ats" || action.type === "download_exec") return <DocMark size={13} aria-hidden="true" />;
    if (action.type === "email_form") return <Mail size={13} aria-hidden="true" />;
    if (action.url?.includes("linkedin")) return <Linkedin size={13} aria-hidden="true" />;
    if (action.url) return <DiagArrow size={13} aria-hidden="true" />;

    switch (action.icon) {
      case "briefcase":
        return <WorkMark size={13} aria-hidden="true" />;
      case "sparkles":
        return <StarMark size={13} aria-hidden="true" />;
      case "award":
        return <Trophy size={13} aria-hidden="true" />;
      case "cloud":
        return <Cloud size={13} aria-hidden="true" />;
      case "stack":
        return <Code2 size={13} aria-hidden="true" />;
      case "mail":
        return <Mail size={13} aria-hidden="true" />;
      case "linkedin":
        return <Linkedin size={13} aria-hidden="true" />;
      case "file":
        return <DocMark size={13} aria-hidden="true" />;
      default:
        return <MessageSquare size={13} aria-hidden="true" />;
    }
  };

  // Auto scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isPending, isOpen]);

  const handleEmailFormSubmit = async (e) => {
    e.preventDefault();
    setEmailFormStatus("sending");
    try {
      // Submit via Formspree (free tier) or replace endpoint
      const res = await fetch("https://formspree.io/f/mjgdodwg", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(emailForm)
      });
      if (res.ok) {
        setEmailFormStatus("sent");
        setEmailForm({ name: "", email: "", message: "" });
      } else {
        setEmailFormStatus("error");
      }
    } catch {
      setEmailFormStatus("error");
    }
  };

  const handleAction = (action) => {
    if (action.type === "email_form") {
      setEmailFormVisible(true);
      setEmailFormStatus(null);
      setEmailForm({ name: "", email: "", message: "" });
      // Append a bot message containing the email form
      setMessages((prev) => [
        ...prev,
        {
          id: `email-form-${Date.now()}`,
          role: "model",
          text: "Happy to connect! Fill in the form below and I'll make sure Prawal gets your message.",
          emailForm: true
        }
      ]);
      return;
    }
    if (action.query) {
      sendMessage(action.query);
    } else if (action.type === "download_exec") {
      generateExecutiveProfile();
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "model",
          text: "Generated Prawal's **Executive Profile** in a new tab with live data — use the Save as PDF button there to download it."
        }
      ]);
    } else if (action.type === "download_ats") {
      downloadResume();
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "model",
          text: "Downloading Prawal's **CV** (2-page PDF) — it's the same version he uses for job applications."
        }
      ]);
    } else if (action.url) {
      if (action.url.startsWith("/")) {
        // Internal page redirect
        const button = document.createElement("a");
        button.href = action.url;
        button.click();
      } else {
        window.open(action.url, "_blank", "noreferrer");
      }
    }
  };

  const sendMessage = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim() || sendInFlight.current) return;
    sendInFlight.current = true;

    if (!textToSend) setInputValue("");
    setRateLimitAlert(false);

    // Append user message
    const userMsg = { id: `user-${Date.now()}`, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setIsPending(true);

    const history = [...messages, userMsg];

    if (apiMode === "live") {
      const streamId = `model-${Date.now()}`;
      // Insert empty streaming placeholder immediately
      setMessages((prev) => [
        ...prev,
        { id: streamId, role: "model", text: "", streaming: true }
      ]);

      const controller = new AbortController();
      requestController.current = controller;
      try {
        await callLLMAPI(history, (accumulated) => {
          setMessages((prev) =>
            prev.map((m) => m.id === streamId ? { ...m, text: accumulated } : m)
          );
        }, controller.signal);
        // Mark streaming done
        setMessages((prev) =>
          prev.map((m) => m.id === streamId ? { ...m, streaming: false } : m)
        );
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("AI assistant API error:", err);
        const sandboxRes = getSandboxResponse(text);
        if (err.message === "RATE_LIMIT") setRateLimitAlert(true);
        // Replace placeholder with sandbox fallback
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamId
              ? { ...m, streaming: false, text: sandboxRes.text, actions: sandboxRes.actions }
              : m
          )
        );
      } finally {
        if (requestController.current === controller) requestController.current = null;
        sendInFlight.current = false;
        setIsPending(false);
      }
    } else {
      // Local Sandbox Engine — simulate character-by-character reveal
      const sandboxRes = getSandboxResponse(text);
      const fullText = sandboxRes.text;
      const streamId = `model-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        { id: streamId, role: "model", text: "", streaming: true, actions: sandboxRes.actions }
      ]);
      let pos = 0;
      const CHUNK = 6;
      const tick = () => {
        pos = Math.min(pos + CHUNK, fullText.length);
        setMessages((prev) =>
          prev.map((m) => m.id === streamId ? { ...m, text: fullText.slice(0, pos) } : m)
        );
        if (pos < fullText.length) {
          setTimeout(tick, 18);
        } else {
          setMessages((prev) =>
            prev.map((m) => m.id === streamId ? { ...m, streaming: false } : m)
          );
          sendInFlight.current = false;
          setIsPending(false);
        }
      };
      setTimeout(tick, 320); // brief initial pause before first chars appear
    }
  };

  return (
    <div className={`brand-chatbot ${isOpen ? "is-expanded" : "is-collapsed"}`} aria-label="Virtual Assistant">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-panel"
            initial={{ y: -12, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0, scale: 0.97 }}
            style={{ transformOrigin: "top right" }}
            transition={{ duration: 0.36, ease: premiumEase }}
            ref={panelRef}
            role="dialog"
            aria-modal={isFullScreen ? "true" : undefined}
            aria-label="Prawal AI Assistant"
            onKeyDown={handlePanelKeyDown}
          >
            <div className="chatbot-header">
              <div className="header-identity">
                <img className="header-avatar" src="/favicon.svg" alt="" width="34" height="34" />
                <div>
                  <h3>Prawal AI Assistant</h3>
                  <span className={`connection-badge ${activeProvider}`}>
                    <span className="connection-dot" />
                    {connectionLabel} · {providerLabel}
                  </span>
                </div>
              </div>
              <div className="header-controls">
                <button
                  type="button"
                  className="chatbot-close-btn"
                  aria-label="Minimize AI Assistant"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Rate limit banner */}
            {rateLimitAlert && (
              <div className="chatbot-alert-banner">
                <AlertCircle size={15} />
                <span>Getting more questions than I can handle right now — serving from local knowledge. Try again in a minute for a live response.</span>
              </div>
            )}

            {/* Message Area */}
            <div className="chatbot-body">
              <div className="chat-messages-container" role="log" aria-live="polite" aria-label="Conversation">
                {messages.map((message) => {
                  const parseTextInline = (lineText) => {
                    const inlineRegex = /(\*\*.*?\*\*)|(\*.*?\*)|(\`[^\`]+\`)|(\[.*?\]\(.*?\))/g;
                    const parts = lineText.split(inlineRegex);

                    return parts.map((part, idx) => {
                      if (!part) return null;

                      if (part.startsWith("**") && part.endsWith("**")) {
                        return <strong key={idx}>{part.slice(2, -2)}</strong>;
                      }
                      if (part.startsWith("*") && part.endsWith("*")) {
                        return <em key={idx}>{part.slice(1, -1)}</em>;
                      }
                      if (part.startsWith("`") && part.endsWith("`")) {
                        return <code key={idx} className="chat-inline-code">{part.slice(1, -1)}</code>;
                      }
                      if (part.startsWith("[") && part.includes("](")) {
                        const match = part.match(/\[(.*?)\]\((.*?)\)/);
                        if (match) {
                           const [, label, url] = match;
                           const isInternal = url.startsWith("/");
                           if (isInternal) {
                             return (
                               <Link key={idx} to={url} className="chat-inline-link internal">
                                 {label}
                               </Link>
                             );
                           } else {
                             return (
                               <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="chat-inline-link">
                                 {label} <DiagArrow size={10} style={{ display: 'inline', marginLeft: '2px', verticalAlign: 'middle' }} />
                               </a>
                             );
                           }
                        }
                      }
                      return part;
                    });
                  };

                  const renderMessageText = (text) => {
                    return text.split("\n").map((line, lineIdx) => {
                      // Check if line contains markdown images: ![Caption](URL)
                      const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
                      const hasImages = line.match(imgRegex);

                      if (hasImages) {
                        const parts = line.split(/(!\[.*?\]\(.*?\))/g);
                        return (
                          <div key={lineIdx} className="chat-line-with-images">
                            {parts.map((part, partIdx) => {
                              if (part.startsWith("![") && part.endsWith(")")) {
                                const match = part.match(/!\[(.*?)\]\((.*?)\)/);
                                if (match) {
                                  const [, alt, src] = match;
                                  return (
                                    <div
                                      key={partIdx}
                                      className="chat-embedded-image-container animate-fade-in"
                                      onClick={() => setActiveLightboxImage({ src, alt })}
                                    >
                                      <div className="chat-image-wrapper">
                                        <img src={src} alt={alt} className="chat-embedded-img" loading="lazy" />
                                        <div className="chat-embedded-image-overlay">
                                          <ZoomIn size={16} className="overlay-icon" />
                                          <span>Expand Proof</span>
                                        </div>
                                      </div>
                                      {alt && <span className="chat-embedded-image-caption">{alt}</span>}
                                    </div>
                                  );
                                }
                              }

                              // Inline text parser for text between images
                              return <span key={partIdx}>{parseTextInline(part)}</span>;
                            })}
                          </div>
                        );
                      }

                      const isBullet = line.startsWith("- ") || line.startsWith("* ");
                      const cleanLine = isBullet ? line.substring(2) : line;

                      return (
                        <p key={lineIdx} className={isBullet ? "chat-bullet-line animate-fade-in" : "chat-paragraph-line"}>
                          {isBullet && <span className="bullet-dot">•</span>}
                          {parseTextInline(cleanLine)}
                        </p>
                      );
                    });
                  };

                  return (
                    <div className={`chat-msg ${message.role === "user" ? "user-msg" : "bot-msg"}`} key={message.id}>
                      <div className="msg-bubble">
                        {message.text ? renderMessageText(message.text) : null}
                        {message.streaming && <span className="streaming-cursor" aria-hidden="true" />}
                      </div>

                      {/* Sub message action pills */}
                      {message.actions && message.actions.length > 0 && (
                        <div className="msg-actions">
                          {message.actions.map((act, index) => (
                            <motion.button
                              key={index}
                              onClick={() => handleAction(act)}
                              className={`chat-action-pill${act.type === "email_form" ? " pill-highlight" : ""}${act.url?.includes("linkedin") ? " pill-linkedin" : ""}`}
                              type="button"
                              initial={{ y: 12, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 220,
                                damping: 18,
                                delay: 0.15 + index * 0.05
                              }}
                              whileHover={{ scale: 1.02, y: -1 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {getActionIcon(act)}
                              {act.label}
                            </motion.button>
                          ))}
                        </div>
                      )}

                      {/* Inline email form bubble */}
                      {message.emailForm && (
                        <div className="in-chat-email-form animate-fade-in">
                          {emailFormStatus === "sent" ? (
                            <div className="email-form-success">
                              <CheckCircleMark size={20} />
                              <div>
                                <strong>Message sent!</strong>
                                <p>Prawal will get back to you shortly.</p>
                              </div>
                            </div>
                          ) : (
                            <form onSubmit={handleEmailFormSubmit}>
                              <h4>✉ Direct Message</h4>
                              <div className="form-group">
                                <label htmlFor="cf-name">Your name</label>
                                <input
                                  id="cf-name"
                                  type="text"
                                  placeholder="Jane Smith"
                                  required
                                  value={emailForm.name}
                                  onChange={(e) => setEmailForm((p) => ({ ...p, name: e.target.value }))}
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="cf-email">Your email</label>
                                <input
                                  id="cf-email"
                                  type="email"
                                  placeholder="jane@company.com"
                                  required
                                  value={emailForm.email}
                                  onChange={(e) => setEmailForm((p) => ({ ...p, email: e.target.value }))}
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="cf-msg">Message</label>
                                <textarea
                                  id="cf-msg"
                                  rows={3}
                                  placeholder="What would you like to discuss?"
                                  required
                                  value={emailForm.message}
                                  onChange={(e) => setEmailForm((p) => ({ ...p, message: e.target.value }))}
                                />
                              </div>
                              {emailFormStatus === "error" && (
                                <p className="email-form-error">Something went wrong. Try LinkedIn instead.</p>
                              )}
                              <div className="form-actions">
                                <button
                                  type="button"
                                  className="cancel-form-btn"
                                  onClick={() => setEmailFormStatus(null)}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="submit-form-btn"
                                  disabled={emailFormStatus === "sending"}
                                >
                                  {emailFormStatus === "sending" ? "Sending…" : "Send message"}
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {isPending && !messages.some((m) => m.streaming) && (
                  <div className="chat-msg bot-msg typing-indicator">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Footer */}
            <div className="chatbot-footer">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  aria-label="Ask the assistant a question"
                  placeholder="Ask about Prawal's work…"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isPending}
                />
                <button type="submit" disabled={isPending || !inputValue.trim()} aria-label="Send query">
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </form>
              <div className="footer-credits">
                <span>{footerProviderLabel} · Uses portfolio context only</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image viewer: a native modal dialog (Escape, focus trap and focus return). */}
      {activeLightboxImage && (
        <OverlayDialog className="chat-lightbox-dialog" label={activeLightboxImage.alt || "Image"} onDismiss={() => setActiveLightboxImage(null)}>
          <div className="chat-lightbox-overlay" onClick={() => setActiveLightboxImage(null)}>
            <motion.div
              className="chat-lightbox-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.28, ease: premiumEase }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="chat-lightbox-close"
                onClick={() => setActiveLightboxImage(null)}
                aria-label="Close image"
                type="button"
                data-dialog-initial-focus
              >
                <X size={24} />
              </button>
              <div className="chat-lightbox-image-wrapper">
                <img src={activeLightboxImage.src} alt={activeLightboxImage.alt} />
              </div>
              {activeLightboxImage.alt && (
                <div className="chat-lightbox-caption">
                  <h3>{activeLightboxImage.alt}</h3>
                </div>
              )}
            </motion.div>
          </div>
        </OverlayDialog>
      )}
    </div>
  );
}
