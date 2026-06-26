// ─── CHATBOT RAG ENGINE ───────────────────────────────────────────────────────
// Lightweight client-side retrieval for the personal brand chatbot.
// No embeddings API needed — uses keyword scoring, synonym expansion,
// and intent classification for accurate, grounded retrieval.
//
// Key exports:
//   classifyIntent(query)         → string[]  detected intent categories
//   retrieveChunks(query, topK)   → { results, intents, debug }
//   buildContext(results, maxLen) → string    context block for the LLM prompt
//   debugLog(...)                 → void      console-group debug output
// ─────────────────────────────────────────────────────────────────────────────

import { knowledgeBase } from '../data/knowledgeBase.js';

// ── Synonym / alias expansion table ─────────────────────────────────────────
// Each key maps to tokens that should boost the same chunks.
// Add synonyms here when the bot misses a rephrased question.
const SYNONYMS = {
  // Identity
  prawal: ['sharma', 'prawal sharma', 'ps', 'him', 'his'],
  'who is': ['about', 'bio', 'profile', 'background', 'introduce', 'tell me about'],
  leader: ['manager', 'director', 'head', 'vp', 'executive'],

  // Experience
  experience: ['work', 'career', 'job', 'role', 'history', 'employment', 'tenure', 'worked'],
  successive: ['successive digital', 'company', 'employer', 'organization', 'organisation', 'current employer', 'where he works', 'last company', 'last organisation', 'last organization'],

  // Tech / skills
  skills: ['tech stack', 'technologies', 'expertise', 'proficiency', 'programming', 'frameworks', 'tools'],
  node: ['nodejs', 'node.js', 'backend', 'server side'],
  react: ['reactjs', 'react.js', 'frontend', 'ui', 'user interface'],
  aws: ['amazon web services', 'amazon cloud', 'aws certified', 'amazon'],
  azure: ['microsoft azure', 'microsoft cloud', 'az 900', 'az900'],
  gcp: ['google cloud', 'google cloud platform', 'google certified', 'cloud digital leader'],
  graphql: ['graph ql', 'apollo', 'query language'],
  docker: ['container', 'containerization'],
  ai: ['artificial intelligence', 'machine learning', 'llm', 'gpt', 'intelligent', 'automation'],
  serverless: ['lambda', 'functions', 'faas'],
  microservices: ['distributed', 'service oriented', 'soa'],

  // Projects
  projects: ['project', 'case study', 'portfolio', 'built', 'delivered', 'poc', 'application', 'system'],
  connectors: ['connectors platform', 'data integration', 'source integration', '200 sources', 'facebook ads'],
  banking: ['fintech', 'ach', 'payment', 'transaction', 'bim', 'enrollment', 'fraud'],
  'data platform': ['data serve', 'data refinery', 'pipeline', 'ingestion', 'snowflake'],
  media: ['dentsu', 'advertising', 'media domain', 'campaign'],

  // Certifications
  certifications: ['cert', 'certified', 'credential', 'badge', 'exam', 'qualification'],
  'aws certified': ['aws certified developer', 'aws solutions architect', 'aws ai practitioner'],
  safe: ['safe agilist', 'scrum alliance', 'cal-e', 'agile leadership', 'agile cert'],

  // Awards
  awards: ['recognition', 'achievement', 'trophy', 'honor', 'esop', 'employee of the year', 'star performer', 'awarded', 'prizes'],

  // Recommendations
  recommendations: ['testimonials', 'endorsements', 'references', 'what people say', 'peer review', 'linkedin reviews', 'what colleagues think'],

  // Education
  education: ['degree', 'btech', 'b.tech', 'computer science', 'university', 'mdu', 'college', 'studied', 'graduation', 'academic'],

  // Conferences
  conferences: ['conference', 'event', 'summit', 'symposium', 'expo', 'forum', 'attended', 'meetup'],

  // Contact
  contact: ['email', 'phone', 'reach', 'message', 'linkedin', 'talk', 'hire', 'engage', 'connect', 'get in touch'],

  // Highlights
  'usa visit': ['us client', 'onsite', 'b1 b2', 'visa', 'travel', 'client visit', 'delaware', 'washington', 'american'],
  book: ['publication', 'author', 'subtle art', 'communication book', 'contributor', 'published book'],

  // Leadership
  leadership: ['management', 'how he leads', 'philosophy', 'operating model', 'mentorship', 'lead people'],
  framework: ['ai engineering framework', 'leadership framework', 'model', 'system', 'approach'],

  // Resume
  resume: ['cv', 'pdf', 'download', 'ats resume', 'executive profile', 'curriculum vitae'],
};

// ── Intent → category mapping ─────────────────────────────────────────────
const INTENT_PATTERNS = [
  { category: 'identity',        patterns: ['who is', 'about prawal', 'tell me about', 'prawal sharma', 'profile', 'bio', 'introduce', 'background', 'summary', 'summarize', 'overview', 'headline'] },
  { category: 'experience',      patterns: ['experience', 'work', 'career', 'job', 'role', 'company', 'successive', 'tenure', 'years working', 'employment', 'history', 'current role', 'what does he do', 'what does prawal do', 'past role', 'previous role', 'organisation', 'organization', 'last org', 'last company', 'current company', 'current employer', 'employer', 'where he works', 'where does he work', 'works at', 'last job', 'current job', 'which company'] },
  { category: 'project',         patterns: ['project', 'built', 'portfolio', 'case study', 'connectors', 'banking', 'ach', 'payment', 'data platform', 'data serve', 'data refinery', 'poc', 'app', 'media', 'fintech', 'transaction', 'truckboard', 'taxonomy', 'stormsmart', 'lovebook', 'rpg', 'notes app', 'school website', 'datastream', 'branding site', 'ai project', 'what did he build', 'delivered', 'ai world', 'done in ai', 'ai work', 'ai contributions', 'ai adoption', 'what ai', 'how ai', 'ai engineering', 'ai experience', 'ai framework', 'xgboost', 'llm integration', 'ai career'] },
  { category: 'skill',           patterns: ['skill', 'tech stack', 'technology', 'technologies', 'programming', 'node', 'react', 'graphql', 'aws', 'azure', 'gcp', 'docker', 'mongodb', 'sql', 'backend', 'frontend', 'cloud', 'frameworks', 'expertise', 'proficiency', 'javascript', 'typescript', 'microservices', 'serverless', 'nestjs'] },
  { category: 'certification',   patterns: ['certif', 'cert', 'credential', 'badge', 'exam', 'aws certified', 'azure certified', 'gcp certified', 'safe', 'agilist', 'hackerrank', 'scrum', 'qualified', '93 credentials', 'how many cert', 'cloud cert', 'proctored'] },
  { category: 'award',           patterns: ['award', 'recognition', 'esop', 'employee of the year', 'outstanding contribution', 'star performer', 'longevity', 'exceptional performer', 'client happiness', 'trophy', 'honor', 'awarded', 'achievements'] },
  { category: 'recommendation',  patterns: ['recommendation', 'testimonial', 'endorsement', 'reference', 'what people say', 'what colleagues say', 'linkedin review', 'feedback', 'what others think', 'peer feedback'] },
  { category: 'education',       patterns: ['education', 'degree', 'btech', 'university', 'college', 'mdu', 'maharshi', 'studied', 'academic', 'graduation', 'gpa', 'score', 'marks', 'grade'] },
  { category: 'conference',      patterns: ['conference', 'event', 'summit', 'symposium', 'expo', 'ai impact summit', 'aws symposium', 'mongodb.local', 'deloitte', 'iamai', 'convergence', 'unicommerce', 'attended', 'forum', 'meetup'] },
  { category: 'contact',         patterns: ['contact', 'email', 'phone', 'reach', 'message', 'linkedin', 'talk', 'hire', 'connect', 'get in touch', 'how to reach', 'available for', 'open to', 'engage with'] },
  { category: 'highlight',       patterns: ['usa', 'us visit', 'onsite', 'b1 b2', 'visa', 'travel', 'client visit', 'book', 'publication', 'author', 'subtle art', 'international', 'countries', 'phuket', 'nepal', 'vietnam', 'dubai'] },
  { category: 'leadership',      patterns: ['leadership', 'how he leads', 'philosophy', 'management style', 'principles', 'framework', 'operating model', 'team', 'mentoring', 'approach', 'leadership os'] },
  { category: 'resume',          patterns: ['resume', 'cv', 'pdf', 'download', 'ats'] },
];

// ── Tokeniser ────────────────────────────────────────────────────────────────
function tokenize(text) {
  return text.toLowerCase().split(/\W+/).filter(w => w.length > 2);
}

// ── Expand query tokens with synonyms ────────────────────────────────────────
function expandTokens(tokens) {
  const expanded = new Set(tokens);
  tokens.forEach(token => {
    // Check if token matches any synonym key or value
    Object.entries(SYNONYMS).forEach(([key, variants]) => {
      const keyTokens = key.split(' ');
      if (keyTokens.includes(token) || variants.some(v => v.split(' ').includes(token))) {
        keyTokens.forEach(k => expanded.add(k));
        variants.forEach(v => v.split(' ').forEach(w => expanded.add(w)));
      }
    });
  });
  return [...expanded];
}

// ── Classify intent ──────────────────────────────────────────────────────────
export function classifyIntent(query) {
  const q = query.toLowerCase();
  const intents = new Set();
  INTENT_PATTERNS.forEach(({ category, patterns }) => {
    if (patterns.some(p => q.includes(p))) intents.add(category);
  });
  if (intents.size === 0) intents.add('identity');
  return [...intents];
}

// ── Score a single chunk ─────────────────────────────────────────────────────
function scoreChunk(chunk, queryTokens, expandedTokens, intents) {
  let score = 0;

  // 1. Category match with detected intent
  if (intents.includes(chunk.category)) score += 8;

  // 2. Keyword overlap (most reliable signal)
  const chunkKwSet = new Set(chunk.keywords.join(' ').toLowerCase().split(/\W+/).filter(w => w.length > 2));
  expandedTokens.forEach(token => {
    if (chunkKwSet.has(token)) score += 3;
  });

  // 3. rawText and summary token overlap
  const rawSet = new Set(tokenize(chunk.rawText));
  const summarySet = new Set(tokenize(chunk.summary));
  expandedTokens.forEach(token => {
    if (rawSet.has(token)) score += 1.5;
    if (summarySet.has(token)) score += 2;
  });

  // 4. Exact phrase in rawText (strong grounding signal)
  const phrase = queryTokens.join(' ');
  if (phrase.length > 4 && chunk.rawText.toLowerCase().includes(phrase)) score += 12;

  // 5. Title token match
  const titleSet = new Set(tokenize(chunk.title));
  expandedTokens.forEach(token => {
    if (titleSet.has(token)) score += 4;
  });

  // 6. Priority boost (inverted: priority 1 = +7.5, priority 5 = +1.5)
  score += (6 - chunk.priority) * 1.5;

  return score;
}

// ── Main retrieval ───────────────────────────────────────────────────────────
export function retrieveChunks(query, topK = 7) {
  const queryTokens = tokenize(query);
  const expandedTokens = expandTokens(queryTokens);
  const intents = classifyIntent(query);

  const scored = knowledgeBase.map(chunk => ({
    chunk,
    score: scoreChunk(chunk, queryTokens, expandedTokens, intents)
  })).sort((a, b) => b.score - a.score);

  const results = scored.slice(0, topK).filter(r => r.score > 2);

  return { results, intents, queryTokens, expandedTokens, topScore: scored[0]?.score ?? 0 };
}

// ── Build context string for LLM prompt ─────────────────────────────────────
// maxChars guards against runaway context. Prefers full rawText, falls back to summary.
export function buildContext(results, maxChars = 3500) {
  let context = '';
  let remaining = maxChars;

  for (const { chunk } of results) {
    const full = `\n[${chunk.title} | ${chunk.sourceSection}]\n${chunk.rawText}\n`;
    const short = `\n[${chunk.title} | ${chunk.sourceSection}]\n${chunk.summary}\n`;
    const block = full.length <= remaining ? full : (short.length <= remaining ? short : '');
    if (block) {
      context += block;
      remaining -= block.length;
    }
    if (remaining < 200) break;
  }

  return context.trim();
}

// ── Debug logger (enabled via ?debug=1 in the URL) ───────────────────────────
export function debugLog(query, retrievalResult, context, answer) {
  if (typeof console.group !== 'function') return;
  console.group(`🤖 Chatbot RAG — "${query}"`);
  console.log('📋 Intents:', retrievalResult.intents.join(', '));
  console.log('🔍 Tokens:', retrievalResult.queryTokens.join(', '));
  console.log('🔎 Expanded (+', retrievalResult.expandedTokens.length - retrievalResult.queryTokens.length, 'synonyms):', retrievalResult.expandedTokens.slice(0, 25).join(', '));
  console.log('📊 Scored chunks:');
  retrievalResult.results.forEach(({ chunk, score }) => {
    console.log(`  ${score.toFixed(1).padStart(5)}  [${chunk.category}] ${chunk.title}`);
  });
  if (retrievalResult.results.length === 0) {
    console.warn('  ⚠️  No chunks scored above threshold — fallback will fire.');
  }
  console.log('📝 Context passed to LLM (%d chars):', context.length, '\n' + context);
  if (answer) console.log('💬 Answer:', answer);
  console.groupEnd();
}
