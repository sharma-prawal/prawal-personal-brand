// ─── WEBSITE KNOWLEDGE BASE ──────────────────────────────────────────────────
// Single source of truth for the AI chatbot. Every chunk here is retrievable.
//
// To ADD content: append a chunk object to the relevant section.
// To UPDATE content: edit the rawText / summary / keywords of the matching chunk.
// Chunk schema: { id, title, category, rawText, summary, keywords[], sourceSection, sourceUrl, priority }
// Priority: 1 = highest importance, 5 = lowest
// ─────────────────────────────────────────────────────────────────────────────

import { profile } from './profile.js';
import { awardAssets, conferenceAssets, professionalHighlights, internationalExposure } from './mediaAssets.js';
import { aiProjects } from './showcase.js';
import { certificationAssets, featuredCertificationAssets } from './certificationAssets.js';

let _id = 0;
const uid = (prefix) => `${prefix}-${String(++_id).padStart(3, '0')}`;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — IDENTITY & OVERVIEW
// ─────────────────────────────────────────────────────────────────────────────

const identityChunks = [
  {
    id: uid('identity'),
    title: 'Who is Prawal Sharma',
    category: 'identity',
    rawText: `${profile.name}. ${profile.headline}. ${profile.summary} ${profile.atsSummary} ${profile.focus}`,
    summary: `Prawal Sharma is a Technology Manager and AI-Driven Engineering Leader based in Delhi, India. ${profile.summary}`,
    keywords: ['prawal', 'sharma', 'who is', 'about', 'profile', 'bio', 'background', 'engineer', 'technology manager', 'engineering leader', 'headline', 'introduce', 'summary', 'delhi', 'india', 'successive digital', '10 years', 'global', 'overview'],
    sourceSection: 'Executive',
    sourceUrl: '/',
    priority: 1
  },
  {
    id: uid('identity'),
    title: 'Executive Snapshot — Key Metrics',
    category: 'identity',
    rawText: profile.executiveSnapshot.map(s => `${s.value} ${s.label}: ${s.detail}`).join('. '),
    summary: `Key metrics: ${profile.executiveSnapshot.map(s => `${s.value} ${s.label}`).join(' · ')}.`,
    keywords: ['metrics', 'numbers', 'stats', 'snapshot', '10 years', '160k', 'banking transactions', '20 30 percent', 'productivity lift', 'aws azure gcp', 'cloud certified', 'global delivery', 'us uk south africa', '10 awards', 'achievements'],
    sourceSection: 'Executive',
    sourceUrl: '/',
    priority: 1
  },
  {
    id: uid('identity'),
    title: 'Impact Highlights & Proof Points',
    category: 'identity',
    rawText: profile.impactHighlights.map(h => `${h.label}: ${h.metric} — ${h.title}. ${h.detail}`).join(' | '),
    summary: `Key achievements: 20–30% AI productivity lift (Successive Digital 2023–2025), 200+ data sources unified, zero escalations across US/UK/SA stakeholders, white-labeled fintech payment systems.`,
    keywords: ['achievements', 'impact', 'results', 'productivity lift', '20 30', 'ai assisted', 'data platform', '200 sources', 'zero escalation', 'fintech', 'payment', 'banking', 'impact highlights', 'proof'],
    sourceSection: 'Executive',
    sourceUrl: '/',
    priority: 1
  },
  {
    id: uid('identity'),
    title: 'Social Proof & Current Focus',
    category: 'identity',
    rawText: `${profile.socialProof.join('. ')}. Current focus: ${profile.currentFocus.join('. ')}. LinkedIn: 5K+ followers. ${profile.recommendations.length} recommendations.`,
    summary: `Currently focused on LLM workflows, intelligent automation, and AI-assisted engineering. B1/B2 visa, US onsite experience, global delivery across US/UK/SA.`,
    keywords: ['linkedin followers', '5k', 'followers', 'b1 b2', 'visa', 'current focus', 'llm', 'intelligent automation', 'ai engineering', 'global delivery', 'what he does now', 'current work', 'recommendations received'],
    sourceSection: 'Executive',
    sourceUrl: '/',
    priority: 2
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — EXPERIENCE
// ─────────────────────────────────────────────────────────────────────────────

const currentEmployerChunk = {
  id: uid('experience'),
  title: 'Current Employer — Successive Digital',
  category: 'experience',
  rawText: `Prawal Sharma currently works at Successive Digital — this is his only and current employer. He has been with Successive Digital for 10 years, progressing through five roles from Software Engineer Trainee to Technology Manager. Successive Digital is a technology services company. His current role is Technology Manager (since November 2024). He has never changed companies — his entire professional career is at Successive Digital.`,
  summary: `Prawal's current and only employer is Successive Digital. He has worked there for 10 years across five roles, currently as Technology Manager since November 2024.`,
  keywords: ['current employer', 'current company', 'current organisation', 'where he works', 'successive digital', 'organisation', 'organization', 'last company', 'last organisation', 'employer', 'company', 'works at', 'only employer', '10 years', 'technology manager', 'current job', 'which company'],
  sourceSection: 'Journey',
  sourceUrl: '/journey',
  priority: 1
};

const experienceChunks = [currentEmployerChunk, ...profile.experience.flatMap((company) =>
  company.roles.map((role) => ({
    id: uid('experience'),
    title: `${role.title} at ${company.company}`,
    category: 'experience',
    rawText: `${role.title} at ${company.company}, ${company.location}. Period: ${role.period}. ${role.details.join(' ')}`,
    summary: `${role.title} at ${company.company} (${role.period}). ${role.details[0]}`,
    keywords: [
      role.title.toLowerCase(),
      company.company.toLowerCase(),
      ...role.details.join(' ').toLowerCase().split(/\W+/).filter(w => w.length > 4).slice(0, 18)
    ],
    sourceSection: 'Journey',
    sourceUrl: '/journey',
    priority: company.company === 'Successive Digital' ? 1 : 3
  }))
)];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — PROJECTS (Professional case studies)
// ─────────────────────────────────────────────────────────────────────────────

const professionalProjectChunks = profile.projects.map((project) => ({
  id: uid('project'),
  title: project.name,
  category: 'project',
  rawText: `${project.name} (${project.domain}). ${project.meta}. Role: ${project.role}. Systems: ${project.systems.join(', ')}. ${project.points.join(' ')} Outcome: ${project.outcome}`,
  summary: `${project.name}: ${project.meta}. ${project.points[0]} Outcome: ${project.outcome}`,
  keywords: [
    project.name.toLowerCase(), project.domain.toLowerCase(),
    project.meta.toLowerCase(), project.role.toLowerCase(),
    ...project.systems.map(s => s.toLowerCase()),
    ...project.points.join(' ').toLowerCase().split(/\W+/).filter(w => w.length > 4).slice(0, 15)
  ],
  sourceSection: 'Portfolio',
  sourceUrl: '/ai-projects',
  priority: 2
}));

// AI / showcase projects
const aiProjectChunks = aiProjects.map((project) => ({
  id: uid('project'),
  title: project.name,
  category: 'project',
  rawText: `${project.name} (${project.type}, status: ${project.stage}). ${project.summary} Problem: ${project.problem} Solution: ${project.solution} AI usage: ${project.aiUsage} Outcome: ${project.outcome} Stack: ${project.stack.join(', ')}.`,
  summary: `${project.name}: ${project.summary} Stack: ${project.stack.join(', ')}.`,
  keywords: [
    project.name.toLowerCase(), project.type.toLowerCase(), project.stage.toLowerCase(),
    ...project.stack.map(s => s.toLowerCase()),
    'ai project', 'poc', 'live', 'portfolio',
    ...project.summary.toLowerCase().split(/\W+/).filter(w => w.length > 4).slice(0, 12)
  ],
  sourceSection: 'Portfolio',
  sourceUrl: '/ai-projects',
  priority: 2
}));

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 — SKILLS
// ─────────────────────────────────────────────────────────────────────────────

const skillChunks = profile.skillGroups.map((group) => ({
  id: uid('skill'),
  title: `Skills: ${group.label}`,
  category: 'skill',
  rawText: `${group.label}: ${group.skills.join(', ')}`,
  summary: `${group.label} skills: ${group.skills.join(', ')}`,
  keywords: [
    group.label.toLowerCase(), 'skills', 'tech stack', 'technologies', 'expertise', 'proficiency',
    ...group.skills.map(s => s.toLowerCase())
  ],
  sourceSection: 'Executive',
  sourceUrl: '/',
  priority: 2
}));

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5 — CERTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

const certChunks = (() => {
  const chunks = [];

  // Featured proctored certs — most important
  chunks.push({
    id: uid('certification'),
    title: 'Official Proctored Cloud Certifications',
    category: 'certification',
    rawText: featuredCertificationAssets.map(c => `${c.title} from ${c.provider}`).join('. '),
    summary: `Official proctored certifications: ${featuredCertificationAssets.map(c => c.title).join(', ')}.`,
    keywords: ['certification', 'certified', 'cert', 'aws', 'azure', 'gcp', 'google cloud', 'microsoft', 'scrum alliance', 'ictrd', 'proctored', 'official', 'cloud certification', 'ai practitioner', 'developer associate', 'solutions architect', 'azure fundamentals', 'digital leader', 'agile leadership', 'safe', 'cal-e', 'credentials', 'badges'],
    sourceSection: 'Certifications',
    sourceUrl: '/certifications',
    priority: 1
  });

  // Total count summary
  chunks.push({
    id: uid('certification'),
    title: 'Certifications Overview — 93 total',
    category: 'certification',
    rawText: `Total certifications: ${certificationAssets.length}. Proctored official certs: ${featuredCertificationAssets.length}. Providers include Anthropic, AWS, Microsoft Azure, Google Cloud, Scrum Alliance, ICTRD, HackerRank, Apollo GraphQL, LinkedIn Learning, Pluralsight, MongoDB.`,
    summary: `93+ credentials across Anthropic (Claude Certified Architect), AWS, Azure, GCP, HackerRank, Apollo GraphQL, LinkedIn Learning, Scrum Alliance, MongoDB, and ICTRD.`,
    keywords: ['how many', 'count', 'total certs', '93', '92', 'credentials', 'all certifications', 'providers', 'anthropic', 'claude certified architect', 'hackerrank', 'apollo', 'linkedin learning', 'pluralsight', 'mongodb', 'certifications list'],
    sourceSection: 'Certifications',
    sourceUrl: '/certifications',
    priority: 2
  });

  // Group by provider for specific lookups
  const providerGroups = {};
  certificationAssets.forEach(c => {
    if (!providerGroups[c.provider]) providerGroups[c.provider] = [];
    providerGroups[c.provider].push(c.title);
  });
  Object.entries(providerGroups).forEach(([provider, titles]) => {
    chunks.push({
      id: uid('certification'),
      title: `${provider} Certifications (${titles.length})`,
      category: 'certification',
      rawText: `${provider} credentials (${titles.length}): ${titles.join(', ')}`,
      summary: `${provider}: ${titles.slice(0, 6).join(', ')}${titles.length > 6 ? ` and ${titles.length - 6} more` : ''}.`,
      keywords: [
        provider.toLowerCase(), 'certification', 'cert',
        ...titles.flatMap(t => t.toLowerCase().split(/\W+/).filter(w => w.length > 3)).slice(0, 15)
      ],
      sourceSection: 'Certifications',
      sourceUrl: '/certifications',
      priority: 3
    });
  });

  return chunks;
})();

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6 — AWARDS
// ─────────────────────────────────────────────────────────────────────────────

const awardChunks = (() => {
  const chunks = [];

  // Overview
  chunks.push({
    id: uid('award'),
    title: 'Awards & Recognition — Overview',
    category: 'award',
    rawText: `10 awards from Successive Digital across 10 years. ${profile.awards.map(a => `${a.title} (${a.date}): ${a.description}`).join('. ')}`,
    summary: `10 awards from Successive Digital spanning 2018–2026. Most recent: ESOP Ownership Achievement Award and Outstanding Contribution Award (May 2026). Others: Employee of the Year 2023, Key Contributor, Longevity, Exceptional Performer, Client Happiness, Star Performer.`,
    keywords: ['awards', 'recognition', 'achievements', '10 awards', '10 years', 'esop', 'employee of the year', 'outstanding contribution', 'key contributor', 'longevity', 'exceptional performer', 'client happiness', 'star performer', 'honor', 'trophy', 'successive digital', 'awarded'],
    sourceSection: 'Awards',
    sourceUrl: '/awards',
    priority: 1
  });

  // Individual award chunks for specific lookups
  profile.awards.forEach((award) => {
    chunks.push({
      id: uid('award'),
      title: award.title,
      category: 'award',
      rawText: `${award.title} from ${award.issuer}, ${award.date}. ${award.description}`,
      summary: `${award.title} (${award.issuer}, ${award.date}): ${award.description}`,
      keywords: [
        ...award.title.toLowerCase().split(/\W+/),
        'award', award.issuer.toLowerCase(), award.date.toLowerCase(), award.date.toLowerCase().replace(/\s+/g, '-')
      ],
      sourceSection: 'Awards',
      sourceUrl: '/awards',
      priority: 2
    });
  });

  return chunks;
})();

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 7 — RECOMMENDATIONS
// ─────────────────────────────────────────────────────────────────────────────

const recommendationChunks = (() => {
  const chunks = [];

  // Overview
  chunks.push({
    id: uid('recommendation'),
    title: 'LinkedIn Recommendations — Overview',
    category: 'recommendation',
    rawText: `${profile.recommendations.length} LinkedIn recommendations from managers, leads, peers, and engineers. Recurring themes: ownership, calm under pressure, technical depth, delivery reliability, leadership, multi-project handling. Names: ${profile.recommendations.map(r => r.name).join(', ')}.`,
    summary: `${profile.recommendations.length} LinkedIn recommendations. Themes: ownership, calm under pressure, technical leadership, delivery excellence. Given by VP Engineering, Technology Managers, Sr Engineers, and peers.`,
    keywords: ['recommendations', 'testimonials', 'linkedin', 'endorsements', 'what people say', 'what colleagues say', 'peer review', 'feedback', 'references', `${profile.recommendations.length} recommendations`, 'reviews', 'working with prawal'],
    sourceSection: 'Recommendations',
    sourceUrl: '/recommendations',
    priority: 1
  });

  // Individual recommendations for specific lookups
  profile.recommendations.forEach((rec) => {
    chunks.push({
      id: uid('recommendation'),
      title: `Recommendation from ${rec.name} (${rec.role})`,
      category: 'recommendation',
      rawText: `${rec.name}, ${rec.role} (${rec.date}): "${rec.quote}"`,
      summary: `${rec.name}, ${rec.role}: "${rec.quote}"`,
      keywords: [
        rec.name.toLowerCase(), rec.role.toLowerCase(),
        ...rec.quote.toLowerCase().split(/\W+/).filter(w => w.length > 4).slice(0, 12)
      ],
      sourceSection: 'Recommendations',
      sourceUrl: '/recommendations',
      priority: 3
    });
  });

  return chunks;
})();

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 8 — EDUCATION
// ─────────────────────────────────────────────────────────────────────────────

const educationChunks = [
  {
    id: uid('education'),
    title: 'Education — B.Tech Computer Science',
    category: 'education',
    rawText: `${profile.education.school}. Degree: ${profile.education.degree}. Period: ${profile.education.period}. Score: ${profile.education.score}.`,
    summary: `BTech in Computer Science from Maharshi Dayanand University (MDU), 2012–2016. Graduated with 78%.`,
    keywords: ['education', 'degree', 'btech', 'computer science', 'maharshi dayanand', 'mdu', 'university', 'college', '78%', '78 percent', '2012', '2016', 'graduation', 'academic', 'studied', 'gpa', 'score'],
    sourceSection: 'Journey',
    sourceUrl: '/journey',
    priority: 3
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 9 — CONFERENCES
// ─────────────────────────────────────────────────────────────────────────────

const conferenceChunks = (() => {
  const chunks = [];

  // Overview
  chunks.push({
    id: uid('conference'),
    title: 'Conferences Attended — Overview',
    category: 'conference',
    rawText: conferenceAssets.map(c => `${c.title} (${c.year}, ${c.location}, type: ${c.eventType}): ${c.theme} Takeaway: ${c.takeaway}`).join(' | '),
    summary: `Conferences attended: AI Impact Summit 2026 (AI & Leadership), AWS Symposium 2023 (Cloud), Convergence India Expo 2026 (Technology), Deloitte Fast 50 2023 (Invite-Only Leadership Forum), IAMAI 2023 (Digital Industry), MongoDB.local 2024 & 2025 (Developer), Unicommerce 2023 (Commerce Tech).`,
    keywords: ['conference', 'event', 'summit', 'symposium', 'expo', 'forum', 'ai impact summit', 'aws symposium', 'convergence india', 'deloitte fast 50', 'iamai', 'mongodb', 'mongodb.local', 'unicommerce', 'attended', '2023', '2024', '2025', '2026'],
    sourceSection: 'Conferences',
    sourceUrl: '/conferences',
    priority: 2
  });

  // Individual conference chunks
  conferenceAssets.forEach((conf) => {
    chunks.push({
      id: uid('conference'),
      title: conf.title,
      category: 'conference',
      rawText: `${conf.title} (${conf.year}, ${conf.location}, type: ${conf.eventType}). Theme: ${conf.theme} Takeaway: ${conf.takeaway}`,
      summary: `${conf.title} (${conf.year}): ${conf.theme}`,
      keywords: [
        conf.title.toLowerCase(), conf.year, conf.eventType.toLowerCase(),
        ...conf.theme.toLowerCase().split(/\W+/).filter(w => w.length > 4).slice(0, 10)
      ],
      sourceSection: 'Conferences',
      sourceUrl: '/conferences',
      priority: 3
    });
  });

  return chunks;
})();

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 10 — HIGHLIGHTS (USA Visit, Book, International)
// ─────────────────────────────────────────────────────────────────────────────

const highlightChunks = (() => {
  const chunks = [];

  // International exposure
  chunks.push({
    id: uid('highlight'),
    title: 'USA Client Visit & International Exposure',
    category: 'highlight',
    rawText: `${internationalExposure.title}. ${internationalExposure.summary} ${internationalExposure.note} Professional countries: ${internationalExposure.professionalCountries.join(', ')}. Personal travel: ${internationalExposure.personalCountries.join(', ')}.`,
    summary: `US onsite client delivery on B1/B2 business visa. Stakeholder delivery across US, UK, and South Africa. Personal travel: Phuket, Nepal, Vietnam, Dubai.`,
    keywords: ['usa', 'united states', 'us client', 'us visit', 'onsite', 'b1 b2', 'b1/b2', 'visa', 'travel', 'uk', 'south africa', 'global', 'international', 'client visit', 'delaware', 'washington', 'stakeholder', 'phuket', 'nepal', 'vietnam', 'dubai', 'photos', 'visit proof'],
    sourceSection: 'Highlights',
    sourceUrl: '/highlights',
    priority: 2
  });

  // Book contribution
  const bookRecord = professionalHighlights.find(h => h.title === 'Book Contributor');
  if (bookRecord) {
    chunks.push({
      id: uid('highlight'),
      title: 'Book Contribution: The Subtle Art of Effective Communication',
      category: 'highlight',
      rawText: `${bookRecord.context} ${bookRecord.story} Available on Amazon (https://amzn.eu/d/fgmVx7H) and Flipkart (https://bit.ly/40XXDR0).`,
      summary: `Contributor to "The Subtle Art of Effective Communication" — published organizational book on communication and listening. Available on Amazon and Flipkart.`,
      keywords: ['book', 'publication', 'author', 'contributor', 'subtle art', 'effective communication', 'listening', 'amazon', 'flipkart', 'published', 'writing', 'organizational book'],
      sourceSection: 'Highlights',
      sourceUrl: '/highlights',
      priority: 2
    });
  }

  return chunks;
})();

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 11 — LEADERSHIP PHILOSOPHY & FRAMEWORK
// ─────────────────────────────────────────────────────────────────────────────

const leadershipChunks = [
  {
    id: uid('leadership'),
    title: 'Leadership Philosophy & Operating Notes',
    category: 'leadership',
    rawText: profile.leadershipNotes.map(n => `On ${n.topic}: ${n.note}`).join(' | '),
    summary: profile.leadershipNotes.map(n => `${n.topic}: "${n.note}"`).join(' '),
    keywords: ['leadership', 'philosophy', 'principles', 'management style', 'how he leads', 'operating notes', 'team', 'mentorship', 'approach', 'ai adoption', 'architecture philosophy', 'delivery', 'clarity', 'scale'],
    sourceSection: 'Executive',
    sourceUrl: '/',
    priority: 2
  },
  {
    id: uid('leadership'),
    title: 'AI Engineering Leadership Framework',
    category: 'leadership',
    rawText: `${profile.signatureFramework.title}. ${profile.signatureFramework.subtitle} Pillars: ${profile.signatureFramework.pillars.map(p => `${p.label} ${p.title}: ${p.detail}`).join('. ')}`,
    summary: `AI Engineering Leadership Framework: 4 pillars — ${profile.signatureFramework.pillars.map(p => p.title).join(', ')}. Focus: adopting AI without losing engineering judgment.`,
    keywords: ['framework', 'ai engineering framework', 'leadership framework', 'pillars', 'clarify leverage', 'protect judgment', 'operationalize', 'prove outcomes', 'model', 'methodology', 'signature framework', 'download framework'],
    sourceSection: 'Executive',
    sourceUrl: '/',
    priority: 2
  },
  {
    id: uid('leadership'),
    title: 'Executive Principles & Operating System',
    category: 'leadership',
    rawText: 'Crisis & Delivery Calm: Calm ownership across global delivery, high-pressure client milestones, and cross-functional execution. Production Reliability: Architecture decisions designed for scale, maintainable boundaries, and long-term delivery discipline. AI-Assisted Velocity: Engineering workflows built on practical AI leverage to drive measurable speed, quality, and productivity. Full-Stack Depth: Hands-on engineering across cloud platforms, data systems, product code, and technical leadership.',
    summary: `4 executive principles: Crisis & Delivery Calm, Production Reliability, AI-Assisted Velocity, Full-Stack Depth.`,
    keywords: ['executive principles', 'operating system', 'delivery calm', 'production reliability', 'ai assisted velocity', 'full stack depth', 'how he operates', 'operating model', 'leadership os'],
    sourceSection: 'Executive',
    sourceUrl: '/',
    priority: 3
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 12 — CONTACT & RESUME
// ─────────────────────────────────────────────────────────────────────────────

const contactChunks = [
  {
    id: uid('contact'),
    title: 'Contact & Availability',
    category: 'contact',
    rawText: `LinkedIn: ${profile.contact.linkedin}. Location: ${profile.location}. B1/B2 visa holder with US onsite delivery experience. Open to senior engineering leadership roles, fractional CTO engagements, and AI adoption consulting. Direct contact available via in-site message form or LinkedIn.`,
    summary: `Connect via LinkedIn at ${profile.contact.linkedin}. Based in Delhi, India. B1/B2 visa, US onsite experience. Open to leadership roles, fractional CTO, and AI consulting.`,
    keywords: ['contact', 'email', 'linkedin', 'phone', 'reach', 'message', 'talk', 'connect', 'hire', 'engage', 'get in touch', 'location', 'delhi', 'india', 'visa', 'b1 b2', 'onsite', 'available', 'open to', 'fractional cto', 'consulting'],
    sourceSection: 'Executive',
    sourceUrl: '/',
    priority: 1
  },
  {
    id: uid('contact'),
    title: 'Resume & Download Options',
    category: 'resume',
    rawText: 'Two resume formats available. Executive Profile (design PDF): high-impact leadership summary focused on client trust, delivery record, and architecture ownership. ATS Resume (print-ready HTML): parser-friendly resume for recruiting workflows. Both can be downloaded directly from the chatbot or from the executive page.',
    summary: `Two resume formats: Executive Profile (design PDF) and ATS Resume (HTML, ATS-friendly). Both available for download from this chat.`,
    keywords: ['resume', 'cv', 'pdf', 'download', 'ats', 'executive profile', 'ats resume', 'download resume', 'curriculum vitae', 'print', 'save'],
    sourceSection: 'Executive',
    sourceUrl: '/',
    priority: 1
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 13 — LANGUAGES & PERSONAL
// ─────────────────────────────────────────────────────────────────────────────

const personalChunks = [
  {
    id: uid('personal'),
    title: 'Languages & Personal Details',
    category: 'personal',
    rawText: `Languages: ${profile.languages.join(', ')}. Interests: ${profile.interests.join(', ')}. LinkedIn followers: 5K+. Recommendations: ${profile.recommendations.length}.`,
    summary: `Languages: English, Hindi, Punjabi (bilingual). Interests: AI adoption, cloud, open-source. 5K+ LinkedIn followers, ${profile.recommendations.length} recommendations.`,
    keywords: ['language', 'english', 'hindi', 'punjabi', 'bilingual', 'interests', 'hobbies', 'linkedin followers', 'followers', '5k', 'personal details', 'speaks'],
    sourceSection: 'Executive',
    sourceUrl: '/',
    priority: 4
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// AI WORK SUMMARY — dedicated chunk for "what has he done in AI" queries
// ─────────────────────────────────────────────────────────────────────────────

const aiWorkChunk = {
  id: uid('project'),
  title: 'AI Work — Enterprise Adoption & Independent Builds',
  category: 'project',
  rawText: `At Successive Digital (2023-2025) Prawal ran a structured AI adoption program across engineering teams. Specific things done: code review acceleration using AI tools, AI-assisted debugging workflows, documentation automation. Measured outcome: 20-30% team productivity lift. He also integrated LLMs into client-facing application features and internal delivery workflows, moving from experiments to repeatable team habits. He built an AI Engineering Leadership Framework with four steps: first, clarify leverage by finding where AI removes real friction not where it sounds good; second, protect judgment by keeping architecture and security decisions with accountable engineers; third, operationalize by measuring velocity not demos; fourth, prove outcomes by tying AI adoption to cycle-time improvement. He holds the AWS Certified AI Practitioner certification (2024). On the personal side, he built an XGBoost machine-learning POC for datastream pattern recognition and prediction. He also built this personal brand site AI-first using AI for UX decisions and iterative review. Other personal builds include an RPG web game, interactive lovebook, published visual novel on itch.io, and an Android notes app — all developed using AI as a collaborator throughout.`,
  summary: `Enterprise AI: structured 20-30% productivity lift via AI tooling (2023-2025), LLM integrations in client products, AI Engineering Leadership Framework (4 steps). Independent: XGBoost ML POC, AI-first personal projects (branding site, RPG, lovebook, notes app, visual novel). AWS AI Practitioner certified 2024.`,
  keywords: ['ai world', 'done in ai', 'ai work', 'what ai', 'ai contributions', 'ai experience', 'what has he done', 'ai career', 'llm', 'machine learning', 'xgboost', 'ai adoption', 'productivity lift', 'ai framework', 'ai practitioner', 'ai projects', 'intelligent automation', 'ai-assisted', 'ai engineering', 'ai tools', 'enterprise ai', 'ai integration', 'how ai'],
  sourceSection: 'Portfolio',
  sourceUrl: '/ai-projects',
  priority: 1
};

// ─────────────────────────────────────────────────────────────────────────────
// ASSEMBLE FULL KNOWLEDGE BASE
// ─────────────────────────────────────────────────────────────────────────────

export const knowledgeBase = [
  ...identityChunks,
  ...experienceChunks,
  ...professionalProjectChunks,
  aiWorkChunk,
  ...aiProjectChunks,
  ...skillChunks,
  ...certChunks,
  ...awardChunks,
  ...recommendationChunks,
  ...educationChunks,
  ...conferenceChunks,
  ...highlightChunks,
  ...leadershipChunks,
  ...contactChunks,
  ...personalChunks
];

// Fast lookup helpers
export const kbById = Object.fromEntries(knowledgeBase.map(c => [c.id, c]));
export const kbByCategory = knowledgeBase.reduce((acc, chunk) => {
  if (!acc[chunk.category]) acc[chunk.category] = [];
  acc[chunk.category].push(chunk);
  return acc;
}, {});
