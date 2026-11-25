import { profile } from "../data/profile.js";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Grid2X2, List, Plus, Search } from "lucide-react";
import { VerifyCircle } from "../components/icons.jsx";
import { MotionCard, MotionGroup, PageFrame, ProofImage, Reveal, proxyToProofImage } from "../components/shared.jsx";
import { certificationAssets, featuredCertificationAssets } from "../data/certificationAssets.js";
import { itemReveal, premiumEase } from "../lib/motion.js";

const certificationBatchSize = 9;

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

function ProofLibraryControls({ query, onQueryChange, mode, onModeChange, resultCount, totalCount, visibleCount, label = "proof library" }) {
  return (
    <div className="proof-library-controls" aria-label={`${label} controls`}>
      <label className="proof-search">
        <Search size={17} aria-hidden="true" />
        <span className="sr-only">Search {label}</span>
        <input type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search credential, provider, or topic" />
      </label>
      <div className="proof-view-toggle" aria-label="Library density">
        <button type="button" className={mode === "detail" ? "active" : undefined} aria-pressed={mode === "detail"} onClick={() => onModeChange("detail")}>
          <Grid2X2 size={15} aria-hidden="true" />
          <span>Detail</span>
        </button>
        <button type="button" className={mode === "compact" ? "active" : undefined} aria-pressed={mode === "compact"} onClick={() => onModeChange("compact")}>
          <List size={15} aria-hidden="true" />
          <span>Compact</span>
        </button>
      </div>
      <p className="library-status">
        Showing <strong>{Math.min(visibleCount, resultCount)}</strong> of <strong>{resultCount}</strong>
        {resultCount !== totalCount ? ` matching ${totalCount} total` : " credentials"}
      </p>
    </div>
  );
}

function OfficialCredentialCard({ cert }) {
  return (
    <motion.article
      className="official-credential-card glass-card spotlight-card"
      variants={itemReveal}
      role="button"
      tabIndex={0}
      onClick={proxyToProofImage}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          proxyToProofImage(event);
        }
      }}
    >
      <div className="official-credential-card__proof">
        <ProofImage src={cert.src} alt={cert.alt} caption={cert.caption} eager />
      </div>
      <div className="official-credential-card__main">
        <div className="credential-meta-row">
          <span>{cert.provider}</span>
          <small><VerifyCircle size={12} />Official proof</small>
        </div>
        <h3>{cert.title}</h3>
      </div>
      <div className="official-credential-card__signal">
        <span>{cert.signal}</span>
        <p>{cert.text}</p>
      </div>
      <small className="credential-proof-action">
        <VerifyCircle size={13} />
        View proof
      </small>
    </motion.article>
  );
}

function CertificationCard({ cert, index, mode }) {
  return (
    <MotionCard
      className={`certificate-card certificate-card--${mode} glass-card spotlight-card`}
      immediate
      onClick={(event) => { const btn = event.currentTarget.querySelector(".proof-image-button"); if (btn) btn.click(); }}
      role="button"
      tabIndex={0}
    >
      <ProofImage src={cert.src} alt={cert.alt} caption={cert.caption} eager priority={index < 12} />
      <div>
        <span>{cert.provider}</span>
        <h3>{cert.title}</h3>
        <small className="proof-state">View certificate →</small>
      </div>
    </MotionCard>
  );
}

function CertificationProviderGroup({ provider, credentials, mode, defaultOpen }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="certification-provider-group">
      <button
        className="certification-provider-trigger"
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
      >
        <span>{provider}</span>
        <strong>{credentials.length} credentials</strong>
        <span className="provider-toggle" aria-hidden="true"><Plus size={12} strokeWidth={3} /></span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="certification-provider-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.34, ease: premiumEase }}
            style={{ overflow: "hidden" }}
          >
            <div className={`certification-gallery certification-gallery--${mode}`}>
              {credentials.slice(0, 6).map((cert, index) => (
                <CertificationCard cert={cert} index={index} mode={mode} key={cert.id} />
              ))}
            </div>
            {credentials.length > 6 ? (
              <p className="certification-provider-more">
                {credentials.length - 6} more {provider} credentials available through provider filter or search.
              </p>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CertificationProviderLibrary({ groups, mode }) {
  const providers = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="certification-provider-library" id="credential-library">
      {providers.map(([provider, credentials], providerIndex) => (
        <CertificationProviderGroup
          provider={provider}
          credentials={credentials}
          mode={mode}
          defaultOpen={providerIndex < 2}
          key={provider}
        />
      ))}
    </div>
  );
}

export default function CertificationsPage() {
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [activeProvider, setActiveProvider] = useState("All");
  const [certificationQuery, setCertificationQuery] = useState("");
  const [libraryMode, setLibraryMode] = useState("detail");
  const [visibleLimit, setVisibleLimit] = useState(certificationBatchSize);

  const flagshipCredentialTitles = useMemo(() => new Set([
    "Claude Certified Architect – Foundations",
    "AWS Certified Solutions Architect – Associate",
    "AWS Certified AI Practitioner",
    "Microsoft Certified: Azure AI Fundamentals"
  ]), []);

  const flagshipCredentials = useMemo(() => featuredCertificationAssets.filter((cert) => flagshipCredentialTitles.has(cert.title)), [flagshipCredentialTitles]);
  const supportingOfficialCredentials = useMemo(() => featuredCertificationAssets.filter((cert) => !flagshipCredentialTitles.has(cert.title)), [flagshipCredentialTitles]);
  const libraryCertificationAssets = useMemo(() => certificationAssets.filter((cert) => !cert.proctored), []);

  const flagshipCredentialCards = flagshipCredentials.map((cert) => ({ ...cert, ...getCredentialSignal(cert) }));
  const officialCredentialRows = supportingOfficialCredentials.map((cert) => ({ ...cert, ...getCredentialSignal(cert) }));

  const dossierSignals = [
    { value: featuredCertificationAssets.length, label: "official credentials", text: "Proctored or official credentials carry the most weight." },
    { value: "AWS / Azure / GCP", label: "cloud spread", text: "Credential evidence spans the major enterprise cloud ecosystems." },
    { value: "CCA-F", label: "Claude Certified Architect", text: "Anthropic's Claude Certified Architect – Foundations, 2026." },
    { value: libraryCertificationAssets.length, label: "courses completed", text: "Listed further down, filterable by provider." }
  ];

  const libraryCertificationProviders = useMemo(() => ["All", ...new Set(libraryCertificationAssets.map((cert) => cert.provider))], [libraryCertificationAssets]);
  const visibleCertifications = useMemo(() => {
    const normalizedQuery = certificationQuery.trim().toLowerCase();
    return libraryCertificationAssets.filter((cert) => {
      const providerMatches = activeProvider === "All" || cert.provider === activeProvider;
      const queryMatches = normalizedQuery ? `${cert.title} ${cert.provider}`.toLowerCase().includes(normalizedQuery) : true;
      return providerMatches && queryMatches;
    });
  }, [activeProvider, certificationQuery, libraryCertificationAssets]);

  const displayedCertifications = visibleCertifications.slice(0, visibleLimit);
  const groupedCertificationLibrary = useMemo(() => libraryCertificationAssets.reduce((groups, cert) => {
    if (!groups[cert.provider]) groups[cert.provider] = [];
    groups[cert.provider].push(cert);
    return groups;
  }, {}), [libraryCertificationAssets]);
  const showGroupedLibrary = activeProvider === "All" && certificationQuery.trim() === "";

  useEffect(() => { setVisibleLimit(certificationBatchSize); }, [activeProvider, certificationQuery, libraryMode]);

  return (
    <div data-theme="certifications">
    <PageFrame
      eyebrow="Certifications"
      title="Cloud, AI and architecture certifications you can verify."
      intro="Proctored exams and official credentials across cloud, AI, architecture and agile leadership, each linked to its proof."
    >
      <p className="verify-links">
        Verify them on <a href={profile.contact.credly} target="_blank" rel="noreferrer">Credly</a>, or see my 11 skill
        certificates on <a href={profile.contact.hackerrank} target="_blank" rel="noreferrer">HackerRank</a>.
      </p>
      <Reveal className="credential-dossier-panel-container" id="credential-dossier">
        <div className="credential-dossier-panel">
          <div className="credential-dossier-panel__lead">
            <span className="eyebrow">Overview</span>
            <h2>Exams first, courses second.</h2>
            <p>Proctored certifications carry the most weight here. Course certificates are listed further down as a record of ongoing learning.</p>
          </div>
          <MotionGroup className="credential-dossier-ledger" aria-label="Credential dossier summary">
            {dossierSignals.map((item) => (
              <motion.article className="credential-dossier-ledger__item" variants={itemReveal} key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
                <p>{item.text}</p>
              </motion.article>
            ))}
          </MotionGroup>
        </div>
      </Reveal>

      <div className="certifications-gallery-wrapper">
        <Reveal as={motion.section} className="credential-section-heading" id="featured-credentials">
          <span className="eyebrow">Featured</span>
          <div>
            <h2>Four key certifications.</h2>
            <p>AI solution architecture, cloud architecture, AI adoption and Azure AI.</p>
          </div>
          <small>{flagshipCredentialCards.length} primary signals</small>
        </Reveal>

        <MotionGroup className="credential-flagship-grid">
          {flagshipCredentialCards.map((cert) => (
            <MotionCard
              className="credential-flagship-card"
              key={cert.id}
              onClick={proxyToProofImage}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  proxyToProofImage(event);
                }
              }}
            >
              <div className="credential-flagship-card__proof">
                <ProofImage src={cert.src} alt={cert.alt} caption={cert.caption} eager />
              </div>
              <div className="credential-flagship-card__copy">
                <div className="credential-meta-row">
                  <span>{cert.provider}</span>
                  <small><VerifyCircle size={12} />Official proof</small>
                </div>
                <h3>{cert.title}</h3>
                <span>{cert.signal}</span>
                <p>{cert.text}</p>
                <small className="credential-proof-action">View official proof</small>
              </div>
            </MotionCard>
          ))}
        </MotionGroup>

        <Reveal as={motion.section} className="official-credential-ledger" id="official-credential-ledger">
          <div className="official-credential-ledger__header">
            <div>
              <span className="eyebrow">More certifications</span>
              <h2>Other official certifications.</h2>
            </div>
            <span>{officialCredentialRows.length} verified records</span>
          </div>
          <MotionGroup className="official-credential-ledger__rows">
            {officialCredentialRows.map((cert) => <OfficialCredentialCard cert={cert} key={cert.id} />)}
          </MotionGroup>
        </Reveal>
      </div>

      <Reveal as={motion.section} className="credential-archive-shell" id="credential-filters">
        <div className="credential-archive-panel">
          <button
            className="credential-archive-trigger"
            type="button"
            aria-expanded={archiveOpen}
            onClick={() => setArchiveOpen((v) => !v)}
          >
            <span className="eyebrow">Courses</span>
            <strong>{libraryCertificationAssets.length} secondary learning records</strong>
            <small>{archiveOpen ? "Close archive" : "Open searchable course archive"}</small>
            <span className="archive-toggle" aria-hidden="true"><Plus size={14} strokeWidth={3} /></span>
          </button>
          <AnimatePresence initial={false}>
            {archiveOpen && (
              <motion.div
                className="credential-archive-body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.42, ease: premiumEase }}
                style={{ overflow: "hidden" }}
              >
                <p className="credential-archive-intro">Course certificates are kept as supporting evidence of learning discipline. They are available for inspection, but they do not compete with official credentials.</p>
                <div className="filter-bar" aria-label="Certification filters">
                  {libraryCertificationProviders.map((provider) => (
                    <button className={activeProvider === provider ? "active" : undefined} type="button" aria-pressed={activeProvider === provider} onClick={() => setActiveProvider(provider)} key={provider}>{provider}</button>
                  ))}
                </div>
                <ProofLibraryControls
                  query={certificationQuery}
                  onQueryChange={setCertificationQuery}
                  mode={libraryMode}
                  onModeChange={setLibraryMode}
                  resultCount={visibleCertifications.length}
                  totalCount={libraryCertificationAssets.length}
                  visibleCount={showGroupedLibrary ? libraryCertificationAssets.length : displayedCertifications.length}
                  label="credential library"
                />
                {showGroupedLibrary ? (
                  <CertificationProviderLibrary groups={groupedCertificationLibrary} mode={libraryMode} />
                ) : (
                  <MotionGroup className={`certification-gallery certification-gallery--${libraryMode}`} id="credential-library" key={`${activeProvider}-${certificationQuery}-${libraryMode}-${visibleLimit}`} immediate>
                    {displayedCertifications.map((cert, index) => <CertificationCard cert={cert} index={index} mode={libraryMode} key={cert.id} />)}
                  </MotionGroup>
                )}
                {visibleCertifications.length === 0 ? (
                  <div className="proof-empty-state" role="status">
                    <span>No matching credentials</span>
                    <p>No matches. Try another provider or search term.</p>
                  </div>
                ) : null}
                {!showGroupedLibrary && visibleCertifications.length > displayedCertifications.length ? (
                  <div className="proof-reveal-actions">
                    <button type="button" onClick={() => setVisibleLimit((l) => l + certificationBatchSize)}>
                      Show {Math.min(certificationBatchSize, visibleCertifications.length - displayedCertifications.length)} more
                    </button>
                    <small>{visibleCertifications.length - displayedCertifications.length} credentials still hidden for scanability</small>
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </PageFrame>
    </div>
  );
}
