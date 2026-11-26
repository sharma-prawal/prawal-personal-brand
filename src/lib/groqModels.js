// Groq chat models, preferred first. Shared by the assistant (which tries them
// in order) and api/chat.js (which forwards only these ids to Groq).
//
// The first accepts images, which the certificate questions attach; the
// fallbacks are text-only and get the question without the image. Groq retires
// models, so check https://console.groq.com/docs/models when the assistant
// falls back to its built-in answers.
export const GROQ_MODELS = [
  { id: "qwen/qwen3.8-27b", label: "Qwen3.8", vision: true },
  // reasoning_effort keeps its hidden reasoning from eating the token budget.
  { id: "openai/gpt-oss-20b", label: "gpt-oss-20b", vision: false, options: { reasoning_effort: "low" } },
  { id: "openai/gpt-oss-120b", label: "gpt-oss-120b", vision: false, options: { reasoning_effort: "low" } }
];
