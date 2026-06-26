import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { DiagArrow } from "../components/icons.jsx";
import { Button } from "../components/ui/button.jsx";
import { MiniCase, MotionCard, MotionGroup, PageFrame, ProofImage, ProofIndex, Reveal, MotionRouterLink } from "../components/shared.jsx";
import { imageAlt, imageCaption, imageSrc } from "../data/imageMetadata.js";
import { aiProjectsWithSlugs } from "../data/derived.js";
import { itemReveal, tapPress, premiumEase } from "../lib/motion.js";

function ProjectEvidence({ project }) {
  return (
    <div className="project-evidence" aria-label={`${project.name} evidence summary`}>
      <span><strong>{project.images.length}</strong> proof image{project.images.length === 1 ? "" : "s"}</span>
      <span><strong>{project.link ? "Live" : "Proof"}</strong>{project.link ? " external evidence" : " local evidence"}</span>
      <span><strong>{project.stack.length}</strong> capability tags</span>
    </div>
  );
}

export default function ProjectCaseStudyPage() {
  const { projectSlug: activeProjectSlug } = useParams();
  const projectIndex = aiProjectsWithSlugs.findIndex((p) => p.slug === activeProjectSlug);
  const project = aiProjectsWithSlugs[projectIndex];
  const previousProject = aiProjectsWithSlugs[(projectIndex - 1 + aiProjectsWithSlugs.length) % aiProjectsWithSlugs.length];
  const nextProject = aiProjectsWithSlugs[(projectIndex + 1) % aiProjectsWithSlugs.length];

  if (!project) {
    return (
      <div data-theme="projects">
        <PageFrame eyebrow="Project case study" title="Project case study not found." intro="Return to the project proof library to browse the available work.">
          <div className="case-study-not-found">
            <Button asChild variant="secondary" className="secondary-link">
              <Link to="/ai-projects">
                <ChevronRight size={18} />
                <span>Back to project proof</span>
              </Link>
            </Button>
          </div>
        </PageFrame>
      </div>
    );
  }

  return (
    <div data-theme="projects">
    <PageFrame eyebrow={`${project.type} | ${project.stage}`} title={project.name} intro={project.summary}>
      <ProofIndex
        label="Case study index"
        meta={`Case ${String(projectIndex + 1).padStart(2, "0")}`}
        items={[
          { id: "case-overview", label: "Overview" },
          { id: "case-proof", label: "Proof" },
          { id: "case-breakdown", label: "Breakdown" },
          { id: "case-next", label: "Next" }
        ]}
      />

      <Reveal className="project-case-hero-container">
        <div className="project-case-hero" id="case-overview">
          <div className="project-case-visual">
            <div className="project-case-visual-inner">
              <ProofImage
                src={imageSrc(project.images[0])}
                alt={imageAlt(project.images[0], `${project.name} primary proof`)}
                caption={imageCaption(project.images[0], project.summary)}
                priority
                eager
              />
              <span className="project-case-proof-count">{project.images.length} proof image{project.images.length === 1 ? "" : "s"}</span>
            </div>
            {project.images.length > 1 ? (
              <div className="project-case-proof-strip" aria-label={`${project.name} supporting proof preview`}>
                {project.images.slice(1, 4).map((image, imageIndex) => {
                  const isLastVisible = imageIndex === 2;
                  const hasMore = project.images.length > 4;
                  const moreCount = project.images.length - 4;
                  return (
                    <div className="project-case-proof-thumbnail" key={imageSrc(image)} style={{ position: "relative" }}>
                      <ProofImage src={imageSrc(image)} alt={imageAlt(image, `${project.name} supporting proof ${imageIndex + 2}`)} caption={imageCaption(image, `${project.name} supporting proof ${imageIndex + 2}`)} eager />
                      {isLastVisible && hasMore && (
                        <div className="proof-more-overlay">
                          <span>+{moreCount} more</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
          <div className="project-case-summary">
            <div className="project-masthead">
              <span>{project.type} | {project.stage}</span>
              <strong>Case {String(projectIndex + 1).padStart(2, "0")}</strong>
            </div>
            <h2>{project.name}</h2>
            <p>{project.summary}</p>
            <ProjectEvidence project={project} />
            <div className="project-actions">
              {project.link ? (
                <motion.a className="project-link" href={project.link} target={project.link.startsWith("/") ? undefined : "_blank"} rel={project.link.startsWith("/") ? undefined : "noreferrer"} whileHover={{ y: -2, scale: 1.01 }} whileTap={tapPress} transition={{ duration: 0.22, ease: premiumEase }}>
                  <DiagArrow size={15} />
                  <span>{project.linkLabel || "Open evidence"}</span>
                </motion.a>
              ) : null}
              <Button asChild variant="secondary" className="secondary-link">
                <Link to="/ai-projects">
                  <ChevronRight size={18} />
                  <span>Back to all projects</span>
                </Link>
              </Button>
            </div>
            <div className="chip-list">
              {project.stack.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        </div>
      </Reveal>

      <MotionGroup className="case-proof-gallery" id="case-proof" immediate>
        {project.images.map((image, index) => (
          <MotionCard className={index === 0 ? "case-proof-card case-proof-card--lead" : "case-proof-card"} immediate key={imageSrc(image)}>
            <ProofImage src={imageSrc(image)} alt={imageAlt(image, `${project.name} proof ${index + 1}`)} caption={imageCaption(image, `${project.name} proof ${index + 1}`)} eager priority={index < 3} />
            <span>{String(index + 1).padStart(2, "0")}</span>
          </MotionCard>
        ))}
      </MotionGroup>

      <MotionGroup className="project-case-breakdown" id="case-breakdown">
        <MiniCase title="Problem" text={project.problem} />
        <MiniCase title="Solution" text={project.solution} />
        <MiniCase title="AI usage" text={project.aiUsage} />
        <MiniCase title="Outcome" text={project.outcome} />
      </MotionGroup>

      <Reveal as={motion.section} className="case-study-nav" id="case-next">
        <Link to={`/ai-projects/${previousProject.slug}`}>
          <span>Previous case</span>
          <strong>{previousProject.name}</strong>
        </Link>
        <Link to={`/ai-projects/${nextProject.slug}`}>
          <span>Next case</span>
          <strong>{nextProject.name}</strong>
        </Link>
      </Reveal>
    </PageFrame>
    </div>
  );
}
