import { profile } from "../data/profile.js";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { PageFrame, ProofImage, Reveal } from "../components/shared.jsx";
import { certificationAssets, featuredCertificationAssets } from "../data/certificationAssets.js";

const courseBatchSize = 12;

// Years from the resume; the certificate data itself carries no dates.
const credentialYears = {
  "Claude Certified Architect – Foundations": "2026",
  "AWS Certified AI Practitioner": "2025",
  "AWS Certified Developer – Associate": "2022",
  "AWS Certified Solutions Architect – Associate": "2021",
  "Microsoft Certified: Azure AI Fundamentals": "2022",
  "Microsoft Certified: Security, Compliance, and Identity Fundamentals": "2022",
  "Microsoft Certified: Azure Data Fundamentals": "2021",
  "Microsoft Certified: Azure Fundamentals": "2021",
  "Google Cloud Certified – Cloud Digital Leader": "2023",
  "Artificial Intelligence and Machine Learning Program": "2026",
  "Certified Agile Leadership Essentials (CAL-E)": "2023"
};

const flagshipTitles = [
  "Claude Certified Architect – Foundations",
  "AWS Certified AI Practitioner",
  "Microsoft Certified: Azure AI Fundamentals"
];

const featuredCertificateDates = {
  "Claude Certified Architect – Foundations": "Issued Aug 4, 2026 · Printed expiry Aug 4, 2027",
  "AWS Certified AI Practitioner": "Issued May 20, 2025 · Printed expiry May 20, 2028",
  "Microsoft Certified: Azure AI Fundamentals": "Earned Feb 10, 2022 · No expiry shown"
};

const credentialSignals = {
  "Claude Certified Architect – Foundations": { signal: "AI solution architecture", text: "Proctored Anthropic exam for building production-grade systems on Claude, MCP, and the Agent SDK." },
  "AWS Certified Solutions Architect – Associate": { signal: "Cloud architecture", text: "Validated architecture judgment for resilient, scalable AWS system design." },
  "AWS Certified AI Practitioner": { signal: "AI adoption fluency", text: "AWS credential in AI fundamentals and practical adoption." },
  "Microsoft Certified: Azure AI Fundamentals": { signal: "AI platform grounding", text: "Microsoft AI fundamentals proof across workloads, responsible AI, and Azure services." },
  "Google Cloud Certified – Cloud Digital Leader": { signal: "Multi-cloud perspective", text: "Business and platform fluency across Google Cloud transformation concepts." },
  "AWS Certified Developer – Associate": { signal: "Cloud engineering", text: "Developer-level AWS implementation credibility beyond architecture theory." },
  "Microsoft Certified: Security, Compliance, and Identity Fundamentals": { signal: "Security baseline", text: "Identity, compliance, and security awareness for enterprise operating environments." },
  "Microsoft Certified: Azure Fundamentals": { signal: "Azure foundation", text: "Core Azure concepts, services, governance, and cloud economics baseline." },
  "Microsoft Certified: Azure Data Fundamentals": { signal: "Data platform base", text: "Foundational knowledge across data workloads, relational, non-relational, and analytics services." },
  "Artificial Intelligence and Machine Learning Program": { signal: "AI/ML depth", text: "Structured AI and machine learning program completion with examination proof." },
  "Certified Agile Leadership Essentials (CAL-E)": { signal: "Leadership system", text: "Agile leadership credential supporting team, delivery, and organizational change judgment." }
};

function getCredentialSignal(cert) {
  return credentialSignals[cert.title] || { signal: cert.provider, text: cert.caption };
}

// Courses are grouped by what they taught, not by the folder they came from.
// Rules run in order and the first match wins; anything left is professional skills.
const courseTopics = [
  { id: "ai", label: "AI and machine learning", match: /\bAI\b|AI-90|Claude|Machine Learning/, text: "Claude and Claude Code, AWS and Azure AI fundamentals, machine learning with Python." },
  { id: "cloud", label: "Cloud", match: /AWS|Azure|AZ-900|SC-900|DP-900|GCP|Google Cloud/, text: "AWS Solutions Architect and Developer prep, AWS Partner accreditations, Azure and Google Cloud fundamentals." },
  { id: "data", label: "Databases", match: /MongoDB|SQL|Redis/, text: "MongoDB University's developer and operations track, SQL from basic to advanced, and Redis." },
  { id: "backend", label: "Backend and APIs", match: /Node|REST|GraphQL|Graph Developer|Apollo|Django|Python|Docker|GitOps|npm|\bExpress\b/, text: "Node.js, REST and GraphQL (Apollo certified), Python and Django, Docker and GitOps." },
  { id: "frontend", label: "Frontend and JavaScript", match: /JavaScript|React|TypeScript|CSS/, text: "JavaScript and TypeScript, React state, context and testing, and modern CSS layout." },
  { id: "practice", label: "Engineering practice", match: /Problem Solving|Data Structures|Design Patterns|Architecture|Agile|Regular Expressions|Blockchain/, text: "Data structures and algorithms, design patterns, software architecture and agile practice." },
  { id: "skills", label: "Professional skills", match: /.*/, text: "Decision-making, listening, confidence and work habits." }
];

function topicFor(course) {
  const haystack = `${course.title} ${course.provider === "MongoDB University" ? "MongoDB" : ""}`;
  return courseTopics.find((topic) => topic.match.test(haystack)).id;
}

// Natural order, with skill levels in progression: "(SAA-C01): 2" before ": 10",
// "SQL (Basic)" before "SQL (Intermediate)" before "SQL (Advanced)".
const levelRank = { Basic: 1, Intermediate: 2, Advanced: 3 };
const sortKey = (title) => title.replace(/\((Basic|Intermediate|Advanced)\)/, (_, level) => `(${levelRank[level]})`);
const byTitle = (a, b) => sortKey(a.title).localeCompare(sortKey(b.title), "en", { numeric: true, sensitivity: "base" });

function CourseList({ courses, limit }) {
  return (
    <ul className="course-list">
      {courses.slice(0, limit).map((cert) => (
        <li key={cert.id}>
          <span className="ledger-rows__thumb course-list__thumb"><ProofImage thumb src={cert.src} alt={cert.alt} caption={cert.caption} /></span>
          <span className="course-list__text">
            <strong>{cert.title}</strong>
            <span>{cert.provider}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function CourseArchive({ courses }) {
  const [topicId, setTopicId] = useState(null);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(courseBatchSize);

  const byTopic = useMemo(() => {
    const groups = Object.fromEntries(courseTopics.map((topic) => [topic.id, []]));
    courses.forEach((course) => groups[topicFor(course)].push(course));
    return groups;
  }, [courses]);

  const q = query.trim().toLowerCase();
  const searchMatches = useMemo(
    () => (q ? courses.filter((c) => `${c.title} ${c.provider}`.toLowerCase().includes(q)) : []),
    [courses, q]
  );

  const selectTopic = (id) => {
    setQuery("");
    setLimit(courseBatchSize);
    setTopicId((current) => (current === id ? null : id));
  };

  return (
    <Reveal as={motion.section} className="home-section" id="courses" aria-labelledby="courses-title">
      <header className="home-section__head course-archive__head">
        <div>
          <h2 id="courses-title">Courses</h2>
          <p>{courses.length} course certificates across {courseTopics.length} areas. Pick an area to see its courses.</p>
        </div>
        <label className="course-archive__search">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">Search all courses</span>
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setTopicId(null); setLimit(courseBatchSize); }}
            placeholder={`Search all ${courses.length} courses`}
          />
        </label>
      </header>

      {q ? (
        // While searching, results take the tiles' place so they sit right under the box.
        <div className="course-panel" role="region" aria-live="polite" aria-label="Search results">
          <p className="course-panel__title">
            {searchMatches.length ? `${searchMatches.length} ${searchMatches.length === 1 ? "course matches" : "courses match"} "${query.trim()}"` : `No courses match "${query.trim()}".`}
          </p>
          <CourseList courses={searchMatches} limit={limit} />
          {searchMatches.length > limit ? (
            <button type="button" className="secondary-link course-archive__more" onClick={() => setLimit((l) => l + courseBatchSize)}>
              Show {Math.min(courseBatchSize, searchMatches.length - limit)} more of {searchMatches.length - limit}
            </button>
          ) : null}
        </div>
      ) : (
        // The open topic's list is placed right after its tile; dense grid packing
        // moves it below that tile's row on wide screens and directly under it on phones.
        <ul className="course-topics">
          {courseTopics.flatMap((topic) => {
            const count = byTopic[topic.id].length;
            if (!count) return [];
            const active = topic.id === topicId;
            const tile = (
              <li key={topic.id}>
                <button
                  type="button"
                  className={active ? "is-active" : undefined}
                  aria-expanded={active}
                  aria-controls={active ? "course-panel" : undefined}
                  onClick={() => selectTopic(topic.id)}
                >
                  <strong>{topic.label}</strong>
                  <span className="course-topics__count">{count} {count === 1 ? "course" : "courses"}</span>
                  <span className="course-topics__text">{topic.text}</span>
                </button>
              </li>
            );
            if (!active) return [tile];
            return [
              tile,
              <li key={`${topic.id}-panel`} id="course-panel" className="course-panel" role="region" aria-label={`${topic.label} courses`}>
                <div className="course-panel__bar">
                  <p className="course-panel__title">{topic.label} · {count} courses</p>
                  <button type="button" className="course-panel__close" onClick={() => setTopicId(null)}>Close</button>
                </div>
                <CourseList courses={byTopic[topic.id]} limit={Infinity} />
              </li>
            ];
          })}
        </ul>
      )}
    </Reveal>
  );
}

export default function CertificationsPage() {
  const flagship = flagshipTitles.map((t) => featuredCertificationAssets.find((c) => c.title === t)).filter(Boolean);
  const others = featuredCertificationAssets.filter((c) => !flagshipTitles.includes(c.title));
  const courses = useMemo(() => certificationAssets.filter((cert) => !cert.proctored).sort(byTitle), []);

  const facts = [
    { value: String(featuredCertificationAssets.length), label: "Professional certifications" },
    { value: "3", label: "Clouds: AWS, Azure and Google Cloud" },
    { value: "CCA-F", label: "Claude Certified Architect, 2026" },
    { value: String(courses.length), label: "Courses completed" }
  ];

  return (
    <div data-theme="certifications">
      <PageFrame
        eyebrow="Certifications"
        title="Cloud, AI and architecture certifications you can verify."
        intro="Proctored exams and official credentials across cloud, AI, architecture and agile leadership, each linked to its proof."
      >
        <div className="ledger-page">
          <p className="verify-links">
            Verify them on <a href={profile.contact.credly} target="_blank" rel="noreferrer">Credly</a>, or see my 11 skill
            certificates on <a href={profile.contact.hackerrank} target="_blank" rel="noreferrer">HackerRank</a>.
          </p>

          <dl className="home-facts" aria-label="Certifications at a glance">
            {facts.map((fact) => (
              <div className="home-facts__item" key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

          <Reveal as={motion.section} className="home-section" id="featured-credentials" aria-labelledby="certs-featured-title">
            <header className="home-section__head">
              <h2 id="certs-featured-title">Three key certifications</h2>
              <p>AI solution architecture, AI adoption and Azure AI. Select a certificate to view it full size.</p>
            </header>
            <ul className="cert-grid">
              {flagship.map((cert) => {
                const signal = getCredentialSignal(cert);
                return (
                  <li key={cert.id}>
                    <div className="cert-grid__img"><ProofImage src={cert.src} alt={cert.alt} caption={cert.caption} eager /></div>
                    <span className="photo-pair__meta">{cert.provider}</span>
                    <strong>{cert.title}</strong>
                    <span className="cert-grid__dates">{featuredCertificateDates[cert.title]}</span>
                    <span className="photo-pair__text">{signal.text}</span>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal as={motion.section} className="home-section" id="official-credential-ledger" aria-labelledby="certs-other-title">
            <header className="home-section__head">
              <h2 id="certs-other-title">Other official certifications</h2>
            </header>
            <ol className="ledger-rows">
              {others.map((cert) => {
                const signal = getCredentialSignal(cert);
                return (
                  <li key={cert.id}>
                    <div className="ledger-rows__row">
                      {/* Year on its own line, so "Scrum Alliance" never wraps with a stray "· 2023". */}
                      <span className="ledger-rows__date">
                        {cert.provider}
                        {credentialYears[cert.title] ? <span className="ledger-rows__sub">{credentialYears[cert.title]}</span> : null}
                      </span>
                      <span className="ledger-rows__main">
                        <strong>{cert.title}</strong>
                        <span>{signal.text}</span>
                      </span>
                      <span className="ledger-rows__tag">{signal.signal}</span>
                      <span className="ledger-rows__thumb"><ProofImage thumb src={cert.src} alt={cert.alt} caption={cert.caption} /></span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Reveal>

          <CourseArchive courses={courses} />
        </div>
      </PageFrame>
    </div>
  );
}
