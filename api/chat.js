// POST /api/chat — forwards the assistant's chat request to Groq and streams
// Groq's server-sent events back unchanged.
//
// The Groq key lives only here, as the server-only env var GROQ_API_KEY (set
// in the Vercel project, or in .env.local for `npm run dev`, which mounts this
// handler through the dev middleware in vite.config.js). It must never get a
// VITE_ prefix: Vite inlines VITE_ variables into the public JS bundle.
//
// Only the fields the assistant sends are passed on, for the models it uses,
// with a cap on output tokens and on the request size, so the endpoint can't
// be used as a general-purpose Groq proxy.

import { GROQ_MODELS } from "../src/lib/groqModels.js";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const ALLOWED_MODELS = new Set(GROQ_MODELS.map((m) => m.id));
// Fits the largest certificate image (~480 KB, ~650 KB as a base64 data URL).
const MAX_BODY_BYTES = 1_000_000;
const MAX_TOKENS = 512;
const MAX_MESSAGES = 40;
const REASONING_EFFORTS = new Set(["low", "medium", "high"]);
const ROLES = new Set(["system", "user", "assistant"]);

function error(status, message) {
  return Response.json({ error: { message } }, { status });
}

function validContent(content) {
  if (typeof content === "string") return true;
  if (!Array.isArray(content) || content.length > 4) return false;
  return content.every((part) =>
    (part?.type === "text" && typeof part.text === "string") ||
    (part?.type === "image_url" && typeof part.image_url?.url === "string" && part.image_url.url.startsWith("data:image/"))
  );
}

// Browsers send Origin on cross-site POSTs; refuse those so other sites can't
// spend the quota from their visitors' browsers. Requests without an Origin
// (curl, same-origin GETs) are let through — this is not authentication.
function crossOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host !== new URL(request.url).host;
  } catch {
    return true;
  }
}

export async function POST(request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return error(503, "The assistant is not configured (GROQ_API_KEY is not set).");
  if (crossOrigin(request)) return error(403, "Cross-origin requests are not allowed.");

  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > MAX_BODY_BYTES) return error(413, "Request body too large.");
  const raw = await request.text();
  if (Buffer.byteLength(raw) > MAX_BODY_BYTES) return error(413, "Request body too large.");

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return error(400, "Request body must be JSON.");
  }

  const { model, messages, temperature, max_tokens, stream, reasoning_effort } = body ?? {};
  if (!ALLOWED_MODELS.has(model)) return error(400, "Model not allowed.");
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return error(400, "messages must be a non-empty array.");
  }
  if (!messages.every((m) => ROLES.has(m?.role) && validContent(m.content))) {
    return error(400, "Invalid message.");
  }

  const upstreamBody = {
    model,
    messages: messages.map(({ role, content }) => ({ role, content })),
    temperature: typeof temperature === "number" ? Math.min(Math.max(temperature, 0), 2) : 0.15,
    max_tokens: Math.min(Number.isInteger(max_tokens) && max_tokens > 0 ? max_tokens : MAX_TOKENS, MAX_TOKENS),
    stream: stream !== false
  };
  if (REASONING_EFFORTS.has(reasoning_effort)) upstreamBody.reasoning_effort = reasoning_effort;

  let upstream;
  try {
    upstream = await fetch(GROQ_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(upstreamBody),
      signal: request.signal
    });
  } catch {
    return error(502, "Could not reach Groq.");
  }

  // Pass status and body through as-is: the client fails over to the next
  // model on 404/413/429 and reads Groq's error message.
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "application/json",
      "Cache-Control": "no-store"
    }
  });
}

export function GET() {
  return error(405, "Use POST.");
}
