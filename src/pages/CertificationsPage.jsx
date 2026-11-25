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
  "Artificial Intelligence and Machine Learning Program": "2026",
  "Certified Agile Leadership Essentials (CAL-E)": "2023"
};

const flagshipTitles = [
  "Claude Certified Architect – Foundations",
  "AWS Certified Solutions Architect – Associate",
  "AWS Certified AI Practitioner",
  "Microsoft Certified: Azure AI Fundamentals"
];

const credentialSignals = {
  "Claude Certified Architect – Foundations": { signal: "AI solution architecture", text: "Proctored Anthropic exam for building production-grade systems on Claude, MCP, and the Agent SDK." },
  "AWS Certified Solutions Architect – Associate": { signal: "Cloud architecture", text: "Validated architecture judgment for resilient, scalable AWS system design." },
  "AWS Certified AI Practitioner": { signal: "AI adoption fluency", text: "A current AI credential tied to practical enterprise adoption." },
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

function CourseArchive({ courses }) {
  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState("All");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(courseBatchSize);
  const providers = useMemo(() => ["All", ...new Set(courses.map((c) => c.provider))], [courses]);
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => (provider === "All" || c.provider === provider) && (!q || `${c.title} ${c.provider}`.toLowerCase().includes(q)));
  }, [courses, provider, query]);

  return (
    <Reveal as={motion.section} className="home-section" id="courses" aria-labelledby="courses-title">
      <header className="home-section__head">
        <h2 id="courses-title">Courses</h2>
        <p>{courses.length} course certificates, kept as a record of ongoing learning.</p>
      </header>
      {!open ? (
        <button type="button" className="secondary-link" onClick={() => setOpen(true)}>Show courses</button>
      ) : (
        <div className="course-archive">
          <div className="course-archive__controls">
            <label className="course-archive__search">
              <Search size={16} aria-hidden="true" />
              <span className="sr-only">Search courses</span>
              <input type="search" value={query} onChange={(e) => { setQuery(e.target.value); setLimit(courseBatchSize); }} placeholder="Search by title or provider" />
            </label>
            <div className="course-archive__filters" role="group" aria-label="Filter by provider">
              {providers.map((name) => (
                <button type="button" key={name} aria-pressed={provider === name} className={provider === name ? "is-active" : undefined} onClick={() => { setProvider(name); setLimit(courseBatchSize); }}>
                  {name}
                </button>
              ))}
            </div>
          </div>
          {matches.length ? (
            <ol className="ledger-rows ledger-rows--compact">
              {matches.slice(0, limit).map((cert) => (
                <li key={cert.id}>
                  <div className="ledger-rows__row">
                    <span className="ledger-rows__date">{cert.provider}</span>
                    <span className="ledger-rows__main"><strong>{cert.title}</strong></span>
                    <span className="ledger-rows__tag" />
                    <span className="ledger-rows__thumb"><ProofImage src={cert.src} alt={cert.alt} caption={cert.caption} /></span>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="course-archive__empty" role="status">No matches. Try another provider or search term.</p>
          )}
          {matches.length > limit ? (
            <button type="button" className="secondary-link course-archive__more" onClick={() => setLimit((l) => l + courseBatchSize)}>
              Show {Math.min(courseBatchSize, matches.length - limit)} more of {matches.length - limit}
            </button>
          ) : null}
        </div>
      )}
    </Reveal>
  );
}

export default function CertificationsPage() {
  const flagship = flagshipTitles.map((t) => featuredCertificationAssets.find((c) => c.title === t)).filter(Boolean);
  const others = featuredCertificationAssets.filter((c) => !flagshipTitles.includes(c.title));
  const courses = useMemo(() => certificationAssets.filter((cert) => !cert.proctored), []);

  const facts = [
    { value: String(featuredCertificationAssets.length), label: "Official certifications" },
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
              <h2 id="certs-featured-title">Four key certifications</h2>
              <p>AI solution architecture, cloud architecture, AI adoption and Azure AI. Select a certificate to view it full size.</p>
            </header>
            <ul className="cert-grid">
              {flagship.map((cert) => {
                const signal = getCredentialSignal(cert);
                return (
                  <li key={cert.id}>
                    <div className="cert-grid__img"><ProofImage src={cert.src} alt={cert.alt} caption={cert.caption} eager /></div>
                    <span className="photo-pair__meta">{cert.provider}{credentialYears[cert.title] ? ` · ${credentialYears[cert.title]}` : ""}</span>
                    <strong>{cert.title}</strong>
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
                      <span className="ledger-rows__date">{cert.provider}{credentialYears[cert.title] ? ` · ${credentialYears[cert.title]}` : ""}</span>
                      <span className="ledger-rows__main">
                        <strong>{cert.title}</strong>
                        <span>{signal.text}</span>
                      </span>
                      <span className="ledger-rows__tag">{signal.signal}</span>
                      <span className="ledger-rows__thumb"><ProofImage src={cert.src} alt={cert.alt} caption={cert.caption} /></span>
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
