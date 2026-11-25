import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageFrame, ProofIndex, RecoveryPage, Reveal } from "../components/shared.jsx";
import { professionalCasesWithSlugs } from "../data/derived.js";

// Detailed system flow for the client case study.
function CaseFlow({ steps }) {
  return (
    <ol className="case-flow" aria-label="System flow">
      {steps.map((step, index) => (
        <li key={step.label}>
          <span className="case-flow__no">{String(index + 1).padStart(2, "0")}</span>
          <strong>{step.label}</strong>
          {step.detail ? <span className="case-flow__detail">{step.detail}</span> : null}
        </li>
      ))}
    </ol>
  );
}

function Section({ id, title, children }) {
  return (
    <Reveal as={motion.section} className="case-section" id={id} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      <div className="case-section__body">{children}</div>
    </Reveal>
  );
}

export default function ProfessionalCaseStudyPage() {
  const { caseSlug } = useParams();
  const caseIndex = professionalCasesWithSlugs.findIndex((p) => p.slug === caseSlug);
  const project = professionalCasesWithSlugs[caseIndex];

  if (!project) return <RecoveryPage />;

  const previousCase = professionalCasesWithSlugs[(caseIndex - 1 + professionalCasesWithSlugs.length) % professionalCasesWithSlugs.length];
  const nextCase = professionalCasesWithSlugs[(caseIndex + 1) % professionalCasesWithSlugs.length];
  const facts = [
    { label: "Role", value: project.role },
    { label: "Period", value: project.tenure },
    { label: "Team", value: project.team },
    { label: "Domain", value: project.domain }
  ].filter((fact) => fact.value);

  const showOutcome = Boolean(project.outcome && (project.headline ? project.headline !== project.outcome : project.context));

  return (
    <div data-theme="projects" id={showOutcome ? undefined : "case-outcome"}>
      <PageFrame eyebrow={project.headline ? `${project.name} · ${project.meta}` : project.meta} title={project.headline || project.name} intro={project.context || project.outcome}>
        <ProofIndex
          label="On this page"
          backHref="/ai-projects"
          items={[
            { id: "case-role", label: "Role" },
            ...(project.flow ? [{ id: "case-design", label: "System design" }] : []),
            { id: "case-work", label: "What I did" },
            ...(showOutcome ? [{ id: "case-outcome", label: "Outcome" }] : [])
          ]}
        />

        <div className="case-page">
          <dl id="case-role" className="case-facts" aria-label="Role and team">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

          {project.flow ? (
            <Section id="case-design" title="System design">
              <CaseFlow steps={project.flow} />
              <p className="case-note">Client names, source code and screenshots stay private; this is the system's shape.</p>
            </Section>
          ) : null}

          <Section id="case-work" title="What I did">
            <ul className="case-points">
              {project.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
            {project.systems?.length ? (
              <p className="case-modules"><span>Modules</span> {project.systems.join(" · ")}</p>
            ) : null}
          </Section>

          {showOutcome && (
            <Section id="case-outcome" title="Outcome">
              <p className="case-outcome">{project.outcome}</p>
            </Section>
          )}

          <nav className="case-nav" aria-label="More client systems">
            <Link to={`/ai-projects/professional/${previousCase.slug}`}>
              <span><ArrowLeft size={14} aria-hidden="true" /> Previous</span>
              <strong>{previousCase.name}</strong>
            </Link>
            <Link to={`/ai-projects/professional/${nextCase.slug}`}>
              <span>Next <ArrowRight size={14} aria-hidden="true" /></span>
              <strong>{nextCase.name}</strong>
            </Link>
          </nav>
        </div>
      </PageFrame>
    </div>
  );
}
