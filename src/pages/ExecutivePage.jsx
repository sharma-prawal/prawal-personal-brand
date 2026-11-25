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
import { awardAssets, conferenceAssets, professionalHighlights, profilePortrait } from "../data/mediaAssets.js";
import { executivePrinciples } from "../data/showcase.js";
import { premiumEase } from "../lib/motion.js";

// Headline figures shown under the hero. None repeats a row in the impact ledger.
const heroFacts = [
  { value: "10", label: "Years at Successive Digital" },
  { value: "2 × 5–12", label: "Engineers across two teams" },
  { value: "160K+", label: "Daily banking transactions" },
  { value: String(awardAssets.length), label: "Awards earned" }
];

const firstImage = (record) => record?.images?.[0]?.src;
const pick = (list, title) => list.find((item) => item.title === title);

// Real photos only, chosen to show the work happening in the room rather than more paragraphs.
const fieldPhotos = [
  { record: pick(conferenceAssets, "AI Impact Summit"), to: "/conferences", label: "AI Impact Summit" },
  { record: pick(professionalHighlights, "USA Client Business Visit"), to: "/highlights", label: "Client visit, USA" },
  { record: pick(conferenceAssets, "AWS Symposium"), to: "/conferences", label: "AWS Symposium" },
  { record: pick(conferenceAssets, "Deloitte Fast 50"), to: "/conferences", label: "Deloitte Fast 50" }
].filter((photo) => firstImage(photo.record));

const awardPhotos = ["Employee of the Year (2023)", "Outstanding Contribution Award", "Key Contributor Award", "ESOP Ownership Achievement Award"]
  .map((title) => pick(awardAssets, title))
  .filter((award) => firstImage(award));

const featuredQuote = profile.recommendations.find((item) => item.name === "Preet Saxena") || profile.recommendations[0];


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
        <motion.div className="home-actions" {...enter(0.24)}>
          <LinkedInButton />
          <ResumeDownloadButton />
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

function FieldStrip() {
  if (!fieldPhotos.length) return null;
  return (
    <section className="home-field" aria-label="In the field">
      <ul className="home-field__grid">
        {fieldPhotos.map((photo) => (
          <li key={photo.label}>
            <Link to={photo.to}>
              <img src={encodeURI(firstImage(photo.record))} alt={photo.record.images[0].alt || photo.label} loading="lazy" decoding="async" />
              <span>{photo.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PullQuote() {
  if (!featuredQuote) return null;
  return (
    <Reveal as={motion.section} className="home-quote" aria-label="Recommendation">
      <blockquote>
        <p>{featuredQuote.quote}</p>
      </blockquote>
      <div className="home-quote__by">
        {featuredQuote.photo ? <img src={featuredQuote.photo} alt="" loading="lazy" /> : null}
        <div>
          <strong>{featuredQuote.name}</strong>
          <span>{featuredQuote.role}</span>
        </div>
        <Link className="home-quote__more" to="/recommendations">
          Read all {profile.recommendations.length} recommendations
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </Reveal>
  );
}

function Recognition() {
  if (!awardPhotos.length) return null;
  return (
    <Reveal as={motion.section} className="home-section" aria-labelledby="home-awards-title">
      <SectionHead
        title={<span id="home-awards-title">Recognition</span>}
        intro="Ten awards at Successive Digital, from Star Performer in 2018 to the ESOP Ownership award in 2026."
      />
      <ul className="home-awards">
        {awardPhotos.map((award) => (
          <li key={award.title}>
            <Link to="/awards">
              <span className="home-awards__img">
                <img src={encodeURI(firstImage(award))} alt={award.images[0].alt || award.title} loading="lazy" decoding="async" />
              </span>
              <strong>{award.title}</strong>
              <span>{award.date}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Reveal>
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
    <Reveal as={motion.section} className="home-section home-section--split home-section--dark" aria-labelledby="home-framework-title">
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

function Writing() {
  return (
    <Reveal as={motion.section} className="home-section" aria-labelledby="home-writing-title">
      <SectionHead
        title={<span id="home-writing-title">Writing</span>}
        intro="Notes on AI in engineering, shared with about 5,000 followers on LinkedIn."
      />
      <ul className="home-writing">
        {profile.writing.map((post) => (
          <li key={post.url}>
            <a href={post.url} target="_blank" rel="noreferrer">
              <span className="home-writing__date">{post.date}</span>
              <strong>{post.title}</strong>
              <span className="home-writing__note">{post.note}</span>
              <span className="home-writing__more">
                Read on LinkedIn <ArrowUpRight size={14} aria-hidden="true" />
              </span>
            </a>
          </li>
        ))}
      </ul>
      <a className="home-quote__more home-writing__all" href={profile.linkedinActivity} target="_blank" rel="noreferrer">
        All posts <ArrowUpRight size={15} aria-hidden="true" />
      </a>
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
      <FieldStrip />
      <ImpactLedger />
      <PullQuote />
      <HowILead />
      <Framework />
      <Recognition />
      <Writing />
      <Contact />
    </div>
  );
}
