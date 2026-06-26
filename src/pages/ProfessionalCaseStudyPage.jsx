import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import { MiniCase, MotionGroup, PageFrame, ProofIndex, Reveal } from "../components/shared.jsx";
import { professionalCasesWithSlugs } from "../data/derived.js";
import { itemReveal } from "../lib/motion.js";

export default function ProfessionalCaseStudyPage() {
  const { caseSlug } = useParams();
  const caseIndex = professionalCasesWithSlugs.findIndex((p) => p.slug === caseSlug);
  const project = professionalCasesWithSlugs[caseIndex];
  const previousCase = professionalCasesWithSlugs[(caseIndex - 1 + professionalCasesWithSlugs.length) % professionalCasesWithSlugs.length];
  const nextCase = professionalCasesWithSlugs[(caseIndex + 1) % professionalCasesWithSlugs.length];

  if (!project) {
    return (
      <div data-theme="projects">
        <PageFrame eyebrow="Professional case study" title="Professional case study not found." intro="Return to the project dossier to browse the available NDA-safe systems.">
          <div className="case-study-not-found">
            <Button asChild variant="secondary" className="secondary-link">
              <Link to="/ai-projects">
                <ChevronRight size={18} />
                <span>Back to project dossier</span>
              </Link>
            </Button>
          </div>
        </PageFrame>
      </div>
    );
  }

  return (
    <div data-theme="projects">
    <PageFrame
      eyebrow={`${project.domain} | ${project.evidenceMode}`}
      title={project.name}
      intro={project.outcome || "NDA-safe professional system summary from resume-backed delivery evidence."}
    >
      <ProofIndex
        label="Dossier index"
        meta={`Professional case ${project.caseNo}`}
        backHref="/ai-projects"
        items={[
          { id: "professional-overview", label: "Overview" },
          { id: "professional-systems", label: "Systems" },
          { id: "professional-breakdown", label: "Breakdown" },
          { id: "professional-next", label: "Cases" }
        ]}
      />

      <Reveal as={motion.section} className="professional-case-hero" id="professional-overview">
        <div className="professional-case-hero__copy">
          <div className="project-masthead">
            <span>{project.domain} | {project.meta}</span>
            <strong>Case {project.caseNo}</strong>
          </div>
          <h2>NDA-safe {project.domain.charAt(0).toLowerCase() + project.domain.slice(1)} brief.</h2>
          <p>{project.outcome}</p>
          <div className={["professional-case-meta", project.tenure ? "professional-case-meta--tenure" : ""].filter(Boolean).join(" ")} aria-label={`${project.name} professional evidence`}>
            <span><strong>{project.role}</strong>Role</span>
            {project.tenure ? <span><strong>{project.tenure}</strong>Management tenure</span> : null}
            <span><strong>{project.evidenceMode}</strong>Evidence mode</span>
            <span><strong>{project.access}</strong>Access boundary</span>
          </div>
          <div className="project-actions">
            <Button asChild variant="secondary" className="secondary-link">
              <Link to="/ai-projects">
                <ChevronRight size={18} />
                <span>Back to project dossier</span>
              </Link>
            </Button>
          </div>
        </div>
        <div className="professional-case-hero__panel" aria-label="NDA-safe project dossier">
          <div className="professional-case-hero__panel-top">
            <span className="eyebrow">Confidential delivery dossier</span>
            <strong>{project.domain}</strong>
            <p>Client names, internal URLs, source code, screenshots, and implementation details are intentionally withheld. Scope, system shape, role, and delivery signal remain visible.</p>
          </div>
          {project.points?.length > 0 && (
            <div className="professional-case-contributions">
              {project.points.map((pt, i) => <blockquote key={i}>{pt}</blockquote>)}
            </div>
          )}
          <div className="professional-case-hero__chips">
            {(project.systems || []).map((sys) => <span key={sys}>{sys}</span>)}
          </div>
        </div>
      </Reveal>

      <MotionGroup className="professional-system-ledger" id="professional-systems" immediate>
        {(project.systems || []).map((system, index) => (
          <motion.article className="professional-system-ledger__item" variants={itemReveal} key={system}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{system}</strong>
          </motion.article>
        ))}
      </MotionGroup>

      <Reveal as={motion.section} className="professional-breakdown-header" id="professional-breakdown">
        <span className="eyebrow">Case breakdown</span>
        <p>Scope, role, evidence access, and system contribution — in four dimensions.</p>
      </Reveal>

      <MotionGroup className={`project-case-breakdown professional-case-breakdown${!project.tenure ? " professional-case-breakdown--no-tenure" : ""}`}>
        <MiniCase title="Business context" text={project.signal} />
        <MiniCase title="Role" text={project.role || "Professional delivery contributor with NDA-safe public summary."} />
        {project.tenure ? <MiniCase title="Management tenure" text={project.tenure} /> : null}
        <MiniCase title="Evidence boundary" text={`${project.evidenceMode}. ${project.access}.`} />
        <MiniCase title="System contribution" text={project.points.join(" ")} className="mini-case--wide" />
      </MotionGroup>

      <Reveal as={motion.section} className="case-study-nav" id="professional-next">
        <Link to={`/ai-projects/professional/${previousCase.slug}`}>
          <span>Previous professional case</span>
          <strong>{previousCase.name}</strong>
        </Link>
        <Link to={`/ai-projects/professional/${nextCase.slug}`}>
          <span>Next professional case</span>
          <strong>{nextCase.name}</strong>
        </Link>
      </Reveal>
    </PageFrame>
    </div>
  );
}
