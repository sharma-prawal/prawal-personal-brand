import { motion } from "framer-motion";
import { DocCheck, DiagArrow, WorkMark, CheckCircleMark, NodeMark, VerifyCircle, StarMark } from "../components/icons.jsx";
import { MiniCase, MotionCard, MotionGroup, PageFrame, ProofImage, ProofIndex, Reveal, MotionRouterLink, handleCardMouseMove } from "../components/shared.jsx";
import { imageAlt, imageCaption, imageSrc } from "../data/imageMetadata.js";
import { aiProjects } from "../data/showcase.js";
import { aiProjectsWithSlugs, professionalCasesWithSlugs } from "../data/derived.js";
import { itemReveal, premiumEase, scaleReveal, tapPress } from "../lib/motion.js";

function ProjectEvidence({ project }) {
  return (
    <div className="project-evidence" aria-label={`${project.name} evidence summary`}>
      <span><strong>{project.images.length}</strong> proof image{project.images.length === 1 ? "" : "s"}</span>
      <span><strong>{project.link ? "Live" : "Proof"}</strong>{project.link ? " external evidence" : " local evidence"}</span>
      <span><strong>{project.stack.length}</strong> capability tags</span>
    </div>
  );
}

function ProjectFeaturedBuild({ project }) {
  return (
    <MotionCard
      className="project-featured-build glass-card spotlight-card"
      priority
      immediate
      onMouseMove={handleCardMouseMove}
    >
      <div className="project-featured-copy">
        <div className="project-masthead">
          <span>{project.type} | {project.stage}</span>
          <strong>Featured</strong>
        </div>
        <h2>{project.name}</h2>
        <p>{project.summary}</p>
        <ProjectEvidence project={project} />
        <div className="case-study-intro">
          <span>Why it matters</span>
          <strong>{project.problem}</strong>
        </div>
        <div className="project-actions">
          <MotionRouterLink className="project-link project-link--case" to={`/ai-projects/${project.slug}`} whileHover={{ y: -2, scale: 1.01 }} whileTap={tapPress} transition={{ duration: 0.22, ease: premiumEase }}>
            <DocCheck size={15} />
            <span>Read case study</span>
          </MotionRouterLink>
          {project.link ? (
            <motion.a className="project-link" href={project.link} target={project.link.startsWith("/") ? undefined : "_blank"} rel={project.link.startsWith("/") ? undefined : "noreferrer"} whileHover={{ y: -2, scale: 1.01 }} whileTap={tapPress} transition={{ duration: 0.22, ease: premiumEase }}>
              <DiagArrow size={15} />
              <span>{project.linkLabel || "Open evidence"}</span>
            </motion.a>
          ) : null}
        </div>
      </div>
      <div className="project-featured-visual">
        <ProofImage src={imageSrc(project.images[0])} alt={imageAlt(project.images[0], `${project.name} screenshot`)} caption={imageCaption(project.images[0], project.summary)} eager priority />
        <span>{project.images.length} screenshot proofs</span>
      </div>
    </MotionCard>
  );
}

function ProjectPortfolioCard({ project, index }) {
  const isMobileApp = project.type === "Android app";
  const primaryImageSrc = imageSrc(project.images[0]);
  const mobilePreviewImages = isMobileApp ? [project.images[0], project.images[4] || project.images[1]].filter(Boolean) : [];
  const proofLabel = primaryImageSrc.includes("placeholder") ? "Proof pending" : project.images.length > 1 ? `${project.images.length} proofs` : "1 proof";
 
  return (
    <MotionCard
      className={["project-portfolio-card glass-card spotlight-card", isMobileApp ? "project-portfolio-card--mobile" : ""].filter(Boolean).join(" ")}
      immediate
      onMouseMove={handleCardMouseMove}
    >
      <div className="project-portfolio-media">
        {isMobileApp ? (
          <div className="project-mobile-preview">
            {mobilePreviewImages.map((image, imageIndex) => (
              <ProofImage src={imageSrc(image)} alt={imageAlt(image, `${project.name} mobile screenshot ${imageIndex + 1}`)} caption={imageCaption(image, `${project.name} mobile screenshot ${imageIndex + 1}`)} eager priority={index < 3} key={imageSrc(image)} />
            ))}
          </div>
        ) : (
          <ProofImage src={primaryImageSrc} alt={imageAlt(project.images[0], `${project.name} screenshot`)} caption={imageCaption(project.images[0], project.summary)} eager priority={index < 3} />
        )}
        <span>{proofLabel}</span>
      </div>
      <div className="project-portfolio-body">
        <div className="project-masthead">
          <span>{project.type} | {project.stage}</span>
          <strong>Case {String(index + 1).padStart(2, "0")}</strong>
        </div>
        <h3>{project.name}</h3>
        <p>{project.summary}</p>
        {project.aiUsage && (
          <div className="project-card-ai-method">
            <StarMark size={13} />
            <span>{project.aiUsage}</span>
          </div>
        )}
        <div className="project-card-signal">
          <NodeMark size={15} />
          <span>{project.outcome}</span>
        </div>
        <div className="project-actions">
          <MotionRouterLink className="project-link project-link--case" to={`/ai-projects/${project.slug}`} whileHover={{ y: -2, scale: 1.01 }} whileTap={tapPress} transition={{ duration: 0.22, ease: premiumEase }}>
            <DocCheck size={15} />
            <span>Case study</span>
          </MotionRouterLink>
          {project.link ? (
            <motion.a className="project-link" href={project.link} target={project.link.startsWith("/") ? undefined : "_blank"} rel={project.link.startsWith("/") ? undefined : "noreferrer"} whileHover={{ y: -2, scale: 1.01 }} whileTap={tapPress} transition={{ duration: 0.22, ease: premiumEase }}>
              <DiagArrow size={15} />
              <span>{project.linkLabel || "Open"}</span>
            </motion.a>
          ) : null}
        </div>
        <div className="chip-list">
          {project.stack.slice(0, 4).map((item) => <span key={item}>{item}</span>)}
        </div>
      </div>
    </MotionCard>
  );
}

function CareerCaseStudyCard({ project, featured = false }) {
  return (
    <article
      className={["career-case-card glass-card spotlight-card", featured ? "career-case-card--featured" : ""].filter(Boolean).join(" ")}
      onMouseMove={handleCardMouseMove}
    >
      <div className="career-case-card__top">
        <span>{project.evidenceMode}</span>
        <strong>Case {project.caseNo}</strong>
        <VerifyCircle size={16} />
      </div>
      <h3>{project.name}</h3>
      <p>{project.signal}</p>
      {(project.role || project.tenure) ? (
        <div className="career-case-card__tenure">
          {project.role ? <small>{project.role}</small> : null}
          {project.tenure ? <span>{project.tenure}</span> : null}
        </div>
      ) : null}
      {project.systems?.length ? (
        <div className="career-case-card__systems" aria-label={`${project.name} system modules`}>
          {project.systems.slice(0, featured ? 8 : 5).map((system) => <span key={system}>{system}</span>)}
        </div>
      ) : null}
      <ul>
        {project.points.map((point) => <li key={point}>{point}</li>)}
      </ul>
      {project.outcome ? (
        <div className="career-case-card__outcome">
          <span>Signal</span>
          <p>{project.outcome}</p>
        </div>
      ) : null}
      <MotionRouterLink className="professional-case-link" to={`/ai-projects/professional/${project.slug}`} whileHover={{ y: -2, scale: 1.01 }} whileTap={tapPress} transition={{ duration: 0.22, ease: premiumEase }}>
        <DocCheck size={15} />
        <span>Open dossier</span>
      </MotionRouterLink>
      <div className="career-case-card__footer">
        <span>{project.access}</span>
        <CheckCircleMark size={15} />
      </div>
    </article>
  );
}

const supportingOrder = ["Personal Branding Site", "Sunrise Public School Website", "Anniversary RPG Web Game", "Android Notes App", "Published Visual Novel Game", "Interactive Lovebook Experience"];

export default function AIProjectsPage() {
  const featuredProject = aiProjectsWithSlugs.find((p) => p.name === "AI-Driven Datastream Intelligence POC") || aiProjectsWithSlugs[0];
  const supportingProjects = supportingOrder
    .map((name) => aiProjectsWithSlugs.find((p) => p.name === name))
    .filter(Boolean)
    .concat(aiProjectsWithSlugs.filter((p) => p.name !== featuredProject.name && !supportingOrder.includes(p.name)));

  const careerCaseStudies = professionalCasesWithSlugs.map((project, index) => ({ ...project, featured: index < 2 }));
  const featuredCareerCases = careerCaseStudies.filter((p) => p.featured);
  const supportingCareerCases = careerCaseStudies.filter((p) => !p.featured);

  const domainSignals = [
    { value: "3", label: "Media advertising systems", text: "Data Refinery, Taxonomy, connector workflows, data serving, campaign taxonomy, and enterprise media-data operations." },
    { value: "2", label: "Fintech and banking systems", text: "BIM payment workflows, ACH debit tender, fraud operations, transaction reporting, and banking URL/reporting utilities." },
    { value: "1", label: "Transportation operations", text: "TruckBoard fleet tracking, booking, map visibility, driver records, and admin workflows for a US transportation business." },
    { value: "2", label: "Internal automation systems", text: "StormSmart operational admin plus meeting-room booking, HR letter generation, PDFs, calendar invites, and notifications." }
  ];

  const portfolioStats = [
    { icon: <VerifyCircle size={17} />, value: professionalCasesWithSlugs.length, label: "resume-backed professional systems" },
    { icon: <NodeMark size={17} />, value: domainSignals.length, label: "domain families represented" },
    { icon: <StarMark size={17} />, value: aiProjects.length, label: "independent AI/product builds" },
    { icon: <WorkMark size={17} />, value: "10", label: "years of professional delivery" }
  ];

  return (
    <div data-theme="projects">
    <PageFrame
      eyebrow="Project portfolio"
      title="Enterprise systems, NDA-safe case studies, and independent AI product proof."
      intro="A senior project dossier: professional systems first, public builds second, and clear separation between client-confidential work and inspectable experiments."
    >
      <ProofIndex
        label="Project index"
        meta={`${aiProjects.length + careerCaseStudies.length} portfolio signals`}
        items={[
          { id: "professional-systems", label: "Professional systems" },
          { id: "project-domain-map", label: "Domain map" },
          { id: "independent-builds", label: "Independent builds" },
          { id: "case-study-model", label: "Case study model" }
        ]}
      />

      <Reveal as={motion.section} className="project-portfolio-thesis" id="portfolio-thesis">
        <div>
          <span className="eyebrow">Portfolio thesis</span>
          <h2>Professional systems lead. Experiments support.</h2>
        </div>
        <div className="project-thesis-copy">
          <p>Professional systems carry the weight. Enterprise delivery is documented first — NDA-safe but evidence-backed. Independent builds serve as inspectable craft proof, not as the headline.</p>
          <div className="project-thesis-signals" aria-label="Portfolio structure signals">
            <span>{professionalCasesWithSlugs.length} professional case summaries</span>
            <span>{aiProjects.length} independent public builds</span>
            <span>documented to case-study standard</span>
          </div>
        </div>
      </Reveal>

      <MotionGroup className="project-proof-strip" immediate>
        {portfolioStats.map((stat) => (
          <motion.div className="project-proof-item" variants={itemReveal} key={stat.label}>
            {stat.icon}
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </motion.div>
        ))}
      </MotionGroup>

      <MotionGroup
        as={motion.section}
        className="project-domain-map"
        id="project-domain-map"
        immediate
      >
        {domainSignals.map((domain) => (
          <motion.article
            className="project-domain-card glass-card spotlight-card"
            variants={itemReveal}
            onMouseMove={handleCardMouseMove}
            key={domain.label}
          >
            <strong>{domain.value}</strong>
            <span>{domain.label}</span>
            <p>{domain.text}</p>
          </motion.article>
        ))}
      </MotionGroup>

      <Reveal as={motion.section} className="professional-project-dossier" id="professional-systems">
        <div className="professional-project-dossier__header">
          <div>
            <span className="eyebrow">Professional systems</span>
            <h2>The real portfolio is enterprise delivery, not only public screenshots.</h2>
          </div>
          <div className="professional-project-dossier__disclaimer">
            <VerifyCircle size={18} className="disclaimer-icon" />
            <p>Client names, links, and images stay private where NDA boundaries apply. The page still exposes the domain, role, system type, responsibility, and resume-backed evidence signal.</p>
          </div>
        </div>
        <MotionGroup className="professional-feature-grid" immediate>
          {featuredCareerCases.map((project) => <CareerCaseStudyCard project={project} key={project.name} featured />)}
        </MotionGroup>
        <MotionGroup className="career-case-grid career-case-grid--expanded" immediate>
          {supportingCareerCases.map((project) => <CareerCaseStudyCard project={project} key={project.name} />)}
        </MotionGroup>
      </Reveal>

      <Reveal as={motion.section} className="chapter-band project-experiments-chapter" id="independent-builds">
        <div className="premium-section-divider project-section-divider">
          <span className="premium-divider-label">AI experiments across domains</span>
          <hr />
          <span className="premium-divider-count-pill">{aiProjects.length} PUBLIC BUILDS</span>
        </div>

        <Reveal as={motion.div} className="project-experiments-thesis">
          <h2>Same methodology. Different domain.</h2>
          <p>These weren&apos;t built in my professional domain. That&apos;s the point. Each one uses AI tooling as the primary methodology — for a school, a game, a narrative app, a mobile workflow. Different domains, same AI-first approach. The signal is that the methodology transfers, not just the tech stack.</p>
        </Reveal>

        <div className="project-portfolio-hero">
          <Reveal variants={scaleReveal}>
            <ProjectFeaturedBuild project={featuredProject} />
          </Reveal>
        </div>

        <MotionGroup className="project-portfolio-grid" id="project-library" immediate>
          {supportingProjects.map((project, index) => <ProjectPortfolioCard project={project} index={index + 1} key={project.name} />)}
        </MotionGroup>
      </Reveal>

      <Reveal as={motion.section} className="case-study-model" id="case-study-model">
        <div>
          <span className="eyebrow">How work is documented</span>
          <h2>Each case study covers the same four dimensions.</h2>
        </div>
        <div className="case-study-model-grid">
          <MiniCase title="Business context" text="What problem mattered, who was affected, and what risk or opportunity shaped the work." />
          <MiniCase title="Your role" text="The decisions you owned, the team shape, stakeholder model, and delivery pressure." />
          <MiniCase title="System design" text="Architecture, data flow, integration boundaries, reliability tradeoffs, and AI leverage where relevant." />
          <MiniCase title="Outcome" text="The measurable result, operational improvement, client trust signal, or delivery learning." />
        </div>
      </Reveal>
    </PageFrame>
    </div>
  );
}
