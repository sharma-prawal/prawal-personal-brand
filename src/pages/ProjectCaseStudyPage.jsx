import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { PageFrame, ProofImage, ProofIndex, RecoveryPage, Reveal, usePageTitle } from "../components/shared.jsx";
import { imageAlt, imageCaption, imageSrc } from "../data/imageMetadata.js";
import { aiProjectsWithSlugs } from "../data/derived.js";

function Section({ id, title, children }) {
  return (
    <Reveal as={motion.section} className="case-section" id={id} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      <div className="case-section__body">{children}</div>
    </Reveal>
  );
}

function ExternalLink({ href, children }) {
  const internal = href.startsWith("/");
  return (
    <a className="projects-link" href={href} target={internal ? undefined : "_blank"} rel={internal ? undefined : "noreferrer"}>
      <span>{children}</span>
      <ArrowUpRight size={15} aria-hidden="true" />
    </a>
  );
}

export default function ProjectCaseStudyPage() {
  const { projectSlug: activeProjectSlug } = useParams();
  const projectIndex = aiProjectsWithSlugs.findIndex((p) => p.slug === activeProjectSlug);
  const project = aiProjectsWithSlugs[projectIndex];
  usePageTitle(project ? project.name : "Case study not found");

  if (!project) return <RecoveryPage />;

  const previousProject = aiProjectsWithSlugs[(projectIndex - 1 + aiProjectsWithSlugs.length) % aiProjectsWithSlugs.length];
  const nextProject = aiProjectsWithSlugs[(projectIndex + 1) % aiProjectsWithSlugs.length];
  const facts = [
    { label: "Type", value: project.type },
    { label: "Status", value: project.stage },
    { label: "Built with", value: project.stack.join(", ") }
  ];
  const [leadImage, ...galleryImages] = project.images;
  const isMobileApp = project.type === "Android app";
  const leadCaption = imageCaption(leadImage, `${project.name} preview`);

  return (
    <div data-theme="projects">
      <PageFrame
        className="project-case-hero"
        eyebrow={`${project.type} · ${project.stage}`}
        title={project.name}
        intro={project.summary}
        heroAside={
          <figure id={galleryImages.length ? "case-preview" : "case-gallery"} className={`case-lead${isMobileApp ? " case-lead--mobile" : ""}`}>
            <div className="case-lead__media">
              <ProofImage src={imageSrc(leadImage)} alt={imageAlt(leadImage, `${project.name} screenshot`)} caption={leadCaption} eager />
            </div>
            <figcaption>{leadCaption}</figcaption>
          </figure>
        }
      >
        <ProofIndex
          label="On this page"
          backHref="/ai-projects"
          items={[
            { id: "case-problem", label: "Problem" },
            { id: "case-built", label: "What I built" },
            { id: "case-outcome", label: "Outcome" },
            { id: "case-gallery", label: galleryImages.length ? "Screenshots" : "Screenshot" }
          ]}
        />

        <div className="case-page">
          <dl className="case-facts case-facts--project">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>
                  {String(fact.value).includes(" · ")
                    ? String(fact.value).split(" · ").map((part, i) => (
                        // "Experimental · v0.12": break only at the dot, never inside a part
                        <span key={part}>{i ? " · " : null}<span className="nowrap-part">{part}</span></span>
                      ))
                    : fact.value}
                </dd>
              </div>
            ))}
          </dl>

          {project.link || project.repo ? (
            <div className="projects-links case-links">
              {project.link ? <ExternalLink href={project.link}>{project.linkLabel || "Open"}</ExternalLink> : null}
              {project.repo ? <ExternalLink href={project.repo}>View the code</ExternalLink> : null}
            </div>
          ) : null}

          <Section id="case-problem" title="Problem">
            <p>{project.problem}</p>
          </Section>

          <Section id="case-built" title="What I built">
            <p>{project.solution}</p>
          </Section>

          {project.aiUsage ? (
            <Section id="case-ai" title="How AI was used">
              <p>{project.aiUsage}</p>
            </Section>
          ) : null}

          <Section id="case-outcome" title="Outcome">
            <p className="case-outcome">{project.outcome}</p>
          </Section>

          {galleryImages.length > 0 && (
            <Reveal as={motion.section} className="case-gallery-section" id="case-gallery" aria-labelledby="case-gallery-title">
              <h2 id="case-gallery-title">More screenshots</h2>
              <ul className={`case-gallery${isMobileApp ? " case-gallery--mobile" : ""}`}>
                {galleryImages.map((image, index) => (
                  <li key={imageSrc(image)}>
                    <ProofImage
                      src={imageSrc(image)}
                      alt={imageAlt(image, `${project.name} screenshot ${index + 2}`)}
                      caption={imageCaption(image, `${project.name} screenshot ${index + 2}`)}
                    />
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          <nav className="case-nav" aria-label="More projects">
            <Link to={`/ai-projects/${previousProject.slug}`}>
              <span><ArrowLeft size={14} aria-hidden="true" /> Previous</span>
              <strong>{previousProject.name}</strong>
            </Link>
            <Link to={`/ai-projects/${nextProject.slug}`}>
              <span>Next <ArrowRight size={14} aria-hidden="true" /></span>
              <strong>{nextProject.name}</strong>
            </Link>
          </nav>
        </div>
      </PageFrame>
    </div>
  );
}
