import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { PageFrame, ProofImage, ProofIndex, Reveal } from "../components/shared.jsx";
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

  if (!project) {
    return (
      <div data-theme="projects">
        <PageFrame eyebrow="Project" title="Case study not found." intro="Go back to Projects to see every case study.">
          <Link className="projects-link" to="/ai-projects">
            <ArrowLeft size={15} aria-hidden="true" />
            <span>Back to Projects</span>
          </Link>
        </PageFrame>
      </div>
    );
  }

  const previousProject = aiProjectsWithSlugs[(projectIndex - 1 + aiProjectsWithSlugs.length) % aiProjectsWithSlugs.length];
  const nextProject = aiProjectsWithSlugs[(projectIndex + 1) % aiProjectsWithSlugs.length];
  const facts = [
    { label: "Type", value: project.type },
    { label: "Status", value: project.stage },
    { label: "Built with", value: project.stack.join(", ") }
  ];

  return (
    <div data-theme="projects">
      <PageFrame eyebrow={`${project.type} · ${project.stage}`} title={project.name} intro={project.summary}>
        <ProofIndex
          label="On this page"
          backHref="/ai-projects"
          items={[
            { id: "case-problem", label: "Problem" },
            { id: "case-built", label: "What I built" },
            { id: "case-outcome", label: "Outcome" },
            { id: "case-gallery", label: "Screenshots" }
          ]}
        />

        <div className="case-page">
          <dl className="case-facts">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
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

          <Reveal as={motion.section} className="case-gallery-section" id="case-gallery" aria-labelledby="case-gallery-title">
            <h2 id="case-gallery-title">Screenshots</h2>
            <ul className={["case-gallery", project.type === "Android app" ? "case-gallery--mobile" : ""].filter(Boolean).join(" ")}>
              {project.images.map((image, index) => (
                <li key={imageSrc(image)} className={index === 0 ? "case-gallery__lead" : undefined}>
                  <ProofImage
                    src={imageSrc(image)}
                    alt={imageAlt(image, `${project.name} screenshot ${index + 1}`)}
                    caption={imageCaption(image, `${project.name} screenshot ${index + 1}`)}
                    eager={index < 3}
                    priority={index === 0}
                  />
                </li>
              ))}
            </ul>
          </Reveal>

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
