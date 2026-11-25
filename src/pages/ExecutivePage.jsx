import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { DownloadMark, DocMark } from "../components/icons.jsx";
import {
  ResumeDownloadButton,
  ExecutiveProfileDownloadButton,
  LinkedInButton,
  ProofImage,
  Reveal
} from "../components/shared.jsx";
import { profile } from "../data/profile.js";
import { profilePortrait } from "../data/mediaAssets.js";
import { executivePrinciples } from "../data/showcase.js";
import { premiumEase } from "../lib/motion.js";

// Headline figures shown under the hero. Picked so none repeats a row in the impact ledger.
const heroFactLabels = ["Years", "Daily transactions", "Awards earned", "Cloud certified"];
const heroFacts = heroFactLabels
  .map((label) => profile.executiveSnapshot.find((item) => item.label === label))
  .filter(Boolean)
  .map((item) => ({ ...item, value: item.value.replaceAll(" / ", " · ") }));

const recordLinks = [
  { to: "/journey", title: "Career", text: "Roles and progression since 2014." },
  { to: "/ai-projects", title: "Projects", text: "Enterprise case studies and independent AI builds." },
  { to: "/awards", title: "Awards", text: "Ten awards for ownership, longevity and client trust." },
  { to: "/certifications", title: "Certifications", text: "Cloud, AI, data and leadership certifications." },
  { to: "/recommendations", title: "Recommendations", text: "What managers, peers and clients have said." },
  { to: "/conferences", title: "Conferences", text: "Industry events on AI, cloud and data." },
  { to: "/highlights", title: "Highlights", text: "Client visits, publications and other milestones." }
];

function SectionHead({ title, intro, children }) {
  return (
    <header className="home-section__head">
      <h2>{title}</h2>
      {intro ? <p>{intro}</p> : null}
      {children}
    </header>
  );
}

function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const enter = (delay) =>
    shouldReduceMotion
      ? {}
      : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: premiumEase, delay } };

  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero__copy">
        <motion.p className="home-hero__kicker" {...enter(0)}>
          {profile.location} · Delivery for teams in the US, UK and South Africa
        </motion.p>
        <motion.h1 id="home-hero-title" {...enter(0.05)}>
          {profile.shortHeadline}
        </motion.h1>
        <motion.p className="home-hero__summary" {...enter(0.12)}>
          {profile.summary}
        </motion.p>
        <motion.blockquote className="home-hero__thesis" {...enter(0.18)}>
          AI-enabled teams that ship faster, break less, and don't need oversight to stay accountable — that's the
          operating model I build.
        </motion.blockquote>
        <motion.div className="home-actions" {...enter(0.24)}>
          <ExecutiveProfileDownloadButton variant="primary" />
          <LinkedInButton />
        </motion.div>
      </div>

      <motion.figure className="home-hero__portrait" {...enter(0.1)}>
        <ProofImage src={profilePortrait.src} alt={profilePortrait.alt} caption={profilePortrait.caption} priority />
      </motion.figure>

      <dl className="home-facts" aria-label="Career at a glance">
        {heroFacts.map((fact) => (
          <div className="home-facts__item" key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ImpactLedger() {
  return (
    <Reveal as={motion.section} className="home-section home-section--light" aria-labelledby="home-impact-title">
      <SectionHead
        title={<span id="home-impact-title">Selected impact</span>}
        intro="Outcomes from ten years at Successive Digital, across banking, media data and enterprise platforms."
      />
      <ol className="home-ledger">
        {profile.impactHighlights.map((item) => (
          <li className="home-ledger__row" key={item.title}>
            <div className="home-ledger__metric">
              <strong>{item.metric}</strong>
              <span>{item.label}</span>
            </div>
            <div className="home-ledger__copy">
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

function HowILead() {
  return (
    <Reveal as={motion.section} className="home-section home-section--split" aria-labelledby="home-lead-title">
      <SectionHead title={<span id="home-lead-title">How I lead</span>} intro={profile.focus} />
      <ul className="home-rules">
        {executivePrinciples.map((item) => (
          <li key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

function Framework() {
  const framework = profile.signatureFramework;
  return (
    <Reveal as={motion.section} className="home-section home-section--split" aria-labelledby="home-framework-title">
      <SectionHead title={<span id="home-framework-title">{framework.title}</span>} intro={framework.subtitle}>
        <div className="home-text-links">
          <a href={framework.downloadHref} download>
            <DownloadMark size={16} />
            <span>Download PDF</span>
          </a>
          <a href={framework.fallbackHref} target="_blank" rel="noreferrer">
            <DocMark size={16} />
            <span>Read online</span>
          </a>
        </div>
      </SectionHead>
      <ol className="home-rules home-rules--numbered">
        {framework.pillars.map((pillar) => (
          <li key={pillar.title}>
            <span className="home-rules__num">{pillar.label}</span>
            <h3>{pillar.title}</h3>
            <p>{pillar.detail}</p>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

function RecordIndex() {
  return (
    <Reveal as={motion.section} className="home-section" aria-labelledby="home-record-title">
      <SectionHead
        title={<span id="home-record-title">The full record</span>}
        intro="Career, projects, awards and talks, each on its own page."
      />
      <ul className="home-index">
        {recordLinks.map((item) => (
          <li key={item.to}>
            <Link to={item.to}>
              <span className="home-index__title">{item.title}</span>
              <span className="home-index__text">{item.text}</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

function Contact() {
  return (
    <Reveal as={motion.section} className="home-section home-contact" aria-labelledby="home-contact-title">
      <h2 id="home-contact-title">
        Available for architecture reviews, AI adoption strategy and technology leadership work.
      </h2>
      <p>LinkedIn is the quickest way to reach me. My executive profile and CV are here if you'd rather start with those.</p>
      <div className="home-actions">
        <LinkedInButton />
        <ExecutiveProfileDownloadButton />
        <ResumeDownloadButton />
      </div>
    </Reveal>
  );
}

export default function ExecutivePage() {
  return (
    <div className="home" data-theme="executive">
      <Hero />
      <ImpactLedger />
      <HowILead />
      <Framework />
      <RecordIndex />
      <Contact />
    </div>
  );
}
