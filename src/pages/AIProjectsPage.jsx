import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageFrame, ProofImage, ProofIndex, Reveal } from "../components/shared.jsx";
import { imageAlt, imageCaption, imageSrc } from "../data/imageMetadata.js";
import { aiProjectsWithSlugs, professionalCasesWithSlugs } from "../data/derived.js";
import SystemFlowPreview from "../components/SystemFlowPreview.jsx";

// Domains are counted from the case data so the numbers always add up.
const domainGroups = [
  { label: "Media advertising", domains: ["Media advertising"], text: "Data Refinery's connectors and data serving, and campaign taxonomy." },
  { label: "Banking and payments", domains: ["Fintech / banking", "Banking"], text: "ACH payments, fraud and settlements, and promotional-link tooling for a bank." },
  { label: "Transportation", domains: ["Transportation"], text: "Fleet tracking, bookings and driver records for a US carrier." },
  { label: "Operations and internal tools", domains: ["Operations / services", "Internal automation"], text: "Services operations admin, meeting-room booking and HR letters." }
];

const caseDimensions = [
  { title: "Context", text: "What problem mattered, who was affected, and what risk or opportunity shaped the work." },
  { title: "Role and team", text: "The decisions I owned, the team shape and the delivery pressure." },
  { title: "System design", text: "Architecture, data flow, integration boundaries, reliability trade-offs and where AI helped." },
  { title: "Outcome", text: "The measurable result, operational improvement or effect on client trust." }
];

function TextLink({ href, to, children }) {
  if (to) {
    return (
      <Link className="projects-link" to={to}>
        <span>{children}</span>
        <ArrowRight size={15} aria-hidden="true" />
      </Link>
    );
  }
  if (!href) return null;
  const internal = href.startsWith("/");
  return (
    <a className="projects-link" href={href} target={internal ? undefined : "_blank"} rel={internal ? undefined : "noreferrer"}>
      <span>{children}</span>
      <ArrowUpRight size={15} aria-hidden="true" />
    </a>
  );
}

function BuildLinks({ project, caseLabel = "Read the case study" }) {
  return (
    <div className="projects-links">
      <TextLink to={`/ai-projects/${project.slug}`}>{caseLabel}</TextLink>
      {project.link ? <TextLink href={project.link}>{project.linkLabel || "Open"}</TextLink> : null}
      {project.repo ? <TextLink href={project.repo}>Code</TextLink> : null}
    </div>
  );
}

function FlagshipCase({ project }) {
  return (
    <li className="projects-case projects-case--flagship">
      <div className="projects-case__meta">
        <span className="projects-case__no">{project.domain}</span>
        {project.role ? <span>{project.role}</span> : null}
        {project.tenure ? <span>{project.tenure}</span> : null}
        {project.team ? <span>{project.team}</span> : null}
      </div>
      <div className="projects-case__body">
        <h3>{project.name}</h3>
        <p className="projects-case__headline">{project.preview?.result || project.headline}</p>
        <div className="projects-case__proof">
          {project.preview && <SystemFlowPreview diagram={project.preview.diagram} />}
          <div className="projects-case__outcome-wrap">
            {project.outcome ? <p className="projects-case__outcome">{project.outcome}</p> : null}
            <TextLink to={`/ai-projects/professional/${project.slug}`}>Read the case study</TextLink>
          </div>
        </div>
      </div>
    </li>
  );
}

function EarlierCase({ project }) {
  return (
    <li>
      <Link to={`/ai-projects/professional/${project.slug}`}>
        <span className="projects-earlier__name">{project.name}</span>
        <span className="projects-earlier__meta">{project.domain} · {project.role}</span>
        <span className="projects-earlier__outcome">{project.outcome}</span>
        <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </li>
  );
}

function Media({ project, eager = false, priority = false }) {
  const image = project.images[0];
  return (
    <ProofImage
      src={imageSrc(image)}
      alt={imageAlt(image, `${project.name} screenshot`)}
      caption={imageCaption(image, project.summary)}
      eager={eager}
      priority={priority}
    />
  );
}

function FeaturedBuild({ project }) {
  return (
    <article className="projects-featured">
      <div className="projects-featured__media">
        <Media project={project} eager />
      </div>
      <div className="projects-featured__copy">
        <p className="projects-kicker">{project.type} · {project.stage}</p>
        <h3>{project.name}</h3>
        <p>{project.summary}</p>
        <p className="projects-featured__why">{project.problem}</p>
        <p className="projects-featured__stack">{project.stack.join(" · ")}</p>
        <BuildLinks project={project} caseLabel="Read the case study" />
      </div>
    </article>
  );
}

function BuildCard({ project, priority }) {
  const isMobileApp = project.type === "Android app";
  return (
    <li className={["projects-build", isMobileApp ? "projects-build--mobile" : ""].filter(Boolean).join(" ")}>
      <div className="projects-build__media">
        <Media project={project} eager priority={priority} />
      </div>
      <p className="projects-kicker">{project.type} · {project.stage}</p>
      <h3>{project.name}</h3>
      <p>{project.summary}</p>
      <BuildLinks project={project} />
    </li>
  );
}

export default function AIProjectsPage() {
  const flagship = professionalCasesWithSlugs.filter((p) => p.featured);
  const earlier = professionalCasesWithSlugs.filter((p) => !p.featured);
  const byGroup = (group) => aiProjectsWithSlugs.filter((p) => p.group === group);
  const aiBuilds = byGroup("ai");
  const featuredBuild = aiBuilds.find((p) => p.name === "OpsPilot AI") || aiBuilds[0];
  const otherAiBuilds = aiBuilds.filter((p) => p !== featuredBuild);
  const productBuilds = byGroup("product");
  const funBuilds = byGroup("fun");

  const domains = domainGroups.map((group) => ({
    ...group,
    count: professionalCasesWithSlugs.filter((p) => group.domains.includes(p.domain)).length
  }));

  return (
    <div data-theme="projects">
      <PageFrame
        className="projects-index-hero"
        eyebrow="Projects"
        title="Client systems first, then the AI I build on my own time."
        intro="Client systems across payments, media, banking and operations, alongside independent AI and product builds."
      >
        <ProofIndex
          label="On this page"
          items={[
            { id: "professional-systems", label: "Client systems" },
            { id: "ai-builds", label: "AI builds" },
            { id: "product-builds", label: "Product builds" },
            { id: "case-study-model", label: "How cases are written" }
          ]}
        />

        <div className="projects">
          <Reveal as={motion.section} className="home-section projects-section" id="professional-systems" aria-labelledby="projects-pro-title">
            <header className="home-section__head">
              <h2 id="projects-pro-title">Client systems</h2>
            </header>

            <ol className="projects-cases">
              {flagship.map((project) => <FlagshipCase project={project} key={project.name} />)}
            </ol>

            <h3 className="projects-subhead">Earlier client work</h3>
            <ul className="projects-earlier">
              {earlier.map((project) => <EarlierCase project={project} key={project.name} />)}
            </ul>

            <ul className="projects-domains" aria-label="Domains covered">
              {domains.map((domain) => (
                <li key={domain.label}>
                  <strong>{domain.label}</strong>
                  <span className="projects-domains__count">{domain.count} {domain.count === 1 ? "system" : "systems"}</span>
                  <p>{domain.text}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal as={motion.section} className="home-section projects-section" id="ai-builds" aria-labelledby="projects-ai-title">
            <header className="home-section__head">
              <h2 id="projects-ai-title">AI builds</h2>
              <p>Agents, retrieval and MCP, built hands-on to stay close to the tools my teams use.</p>
            </header>
            <FeaturedBuild project={featuredBuild} />
            <ul className="projects-builds">
              {otherAiBuilds.map((project, index) => <BuildCard project={project} priority={index < 3} key={project.name} />)}
            </ul>
          </Reveal>

          <Reveal as={motion.section} className="home-section projects-section" id="product-builds" aria-labelledby="projects-product-title">
            <header className="home-section__head">
              <h2 id="projects-product-title">Product builds</h2>
              <p>Shipped sites and apps outside my day job, built AI-assisted from idea to release.</p>
            </header>
            <ul className="projects-builds">
              {productBuilds.map((project) => <BuildCard project={project} key={project.name} />)}
            </ul>

            {funBuilds.length ? (
              <div className="projects-fun">
                <h3 className="projects-subhead">For fun</h3>
                <ul>
                  {funBuilds.map((project) => (
                    <li key={project.name}>
                      <Link to={`/ai-projects/${project.slug}`}>
                        <span className="projects-fun__thumb">
                          <img src={encodeURI(imageSrc(project.images[0]))} alt="" loading="lazy" decoding="async" />
                        </span>
                        <span className="projects-fun__name">{project.name}</span>
                        <span className="projects-fun__type">{project.type}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Reveal>

          <Reveal as={motion.section} className="home-section home-section--split projects-section" id="case-study-model" aria-labelledby="projects-model-title">
            <header className="home-section__head">
              <h2 id="projects-model-title">How each case is written</h2>
              <p>Every case study, client or independent, covers the same four things.</p>
            </header>
            <ol className="home-rules home-rules--numbered">
              {caseDimensions.map((item, index) => (
                <li key={item.title}>
                  <span className="home-rules__num">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </PageFrame>
    </div>
  );
}
