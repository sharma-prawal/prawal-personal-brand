import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import SystemFlowPreview from "../components/SystemFlowPreview.jsx";
import { DownloadMark } from "../components/icons.jsx";
import {
  ExecutiveProfileDownloadButton,
  KeepRanges,
  LinkedInButton,
  ProofImage,
  ResumeDownloadButton
} from "../components/shared.jsx";
import { professionalCasesWithSlugs } from "../data/derived.js";
import { awardAssets, conferenceAssets, professionalHighlights, profilePortrait } from "../data/mediaAssets.js";
import { profile } from "../data/profile.js";

const featuredWork = professionalCasesWithSlugs.filter(({ preview }) => preview);

const fieldPhotos = [
  { records: conferenceAssets, title: "AI Impact Summit", photoIndex: 1, to: "/conferences#featured-event", label: "AI Impact Summit", caption: "On the exhibition floor at the 2026 summit.", lead: true },
  { records: professionalHighlights, title: "USA Client Business Visit", photoIndex: 0, to: "/highlights#usa-client-business-visit", label: "Client visit, USA", caption: "A trip for onsite client collaboration." },
  { records: conferenceAssets, title: "Deloitte Fast 50", photoIndex: 7, to: "/conferences#deloitte-fast-50", label: "Deloitte Fast 50", caption: "Onstage at the 2023 recognition event." }
].map(({ records, title, photoIndex, ...photo }) => ({
  ...photo,
  image: records.find((record) => record.title === title)?.images?.[photoIndex]
})).filter(({ image }) => image);

const recentAwards = ["ESOP Ownership Achievement Award", "Outstanding Contribution Award", "Employee of the Year (2023)", "Key Contributor Award"]
  .map((title) => awardAssets.find((award) => award.title === title))
  .filter(Boolean);

const featuredQuote = profile.recommendations.find(({ name }) => name === "Preet Saxena") || profile.recommendations[0];

function Hero() {
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero__copy">
        <h1 id="home-hero-title">{profile.shortHeadline}</h1>
        <p className="home-hero__summary">
          I’m an engineering manager with 10 years of experience delivering enterprise payment and advertising data platforms. I lead two client engagements across the US, UK and South Africa, from architecture and production releases to AI-assisted delivery.
        </p>
        <div className="home-actions home-hero__actions">
          <a className="primary-link" href="#selected-work">
            View selected work <ArrowDown size={16} aria-hidden="true" />
          </a>
          <ResumeDownloadButton />
        </div>
      </div>
      <figure className="home-hero__portrait">
        <ProofImage src={profilePortrait.src} alt={profilePortrait.alt} caption={profilePortrait.caption} priority />
      </figure>
    </section>
  );
}

function SelectedWork() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (window.location.hash !== "#selected-work") return;
    const frame = requestAnimationFrame(() => sectionRef.current?.scrollIntoView({ behavior: "instant" }));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section ref={sectionRef} id="selected-work" className="home-work" aria-labelledby="home-work-title" tabIndex={-1}>
      <header className="home-heading">
        <h2 id="home-work-title">Selected work</h2>
        <Link className="home-link" to="/ai-projects">All projects <ArrowRight size={16} aria-hidden="true" /></Link>
      </header>
      <div className="home-work__grid">
        {featuredWork.map((project) => {
          const { result, diagram } = project.preview;
          const title = project.name;
          return (
            <article className="home-case" key={project.slug}>
              <div className="home-case__copy">
                <h3>{title}</h3>
                <p className="home-case__role">{project.role}</p>
                <p className="home-case__result"><KeepRanges text={result} /></p>
              </div>
              <SystemFlowPreview diagram={diagram} />
              <Link className="home-link" to={`/ai-projects/professional/${project.slug}`} aria-label={`Read the ${title} case study`}>
                Read case study <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Recognition() {
  if (!recentAwards.length) return null;
  return (
    <section className="home-recognition" aria-labelledby="home-recognition-title">
      <header className="home-heading">
        <h2 id="home-recognition-title">Recognition</h2>
        <Link className="home-link" to="/awards">All {awardAssets.length} awards <ArrowRight size={16} aria-hidden="true" /></Link>
      </header>
      <p className="home-recognition__intro">
        {awardAssets.length} awards in ten years at Successive Digital, for delivery, client work and long-term ownership.
      </p>
      <ul className="home-recognition__list">
        {recentAwards.map((award) => (
          <li key={award.title}>
            <strong>{award.title.replace(/ \(\d{4}\)$/, "")}</strong>
            <span>{award.date}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FieldStrip() {
  if (!fieldPhotos.length) return null;
  return (
    <section className="home-field" aria-labelledby="home-field-title">
      <h2 id="home-field-title">In the field</h2>
      <ul className="home-field__grid">
        {fieldPhotos.map(({ to, label, image, caption, lead }) => (
          <li className={lead ? "home-field__lead" : "home-field__support"} key={label}>
            <Link to={to}>
              <figure>
                <img src={encodeURI(image.src)} alt="" loading="lazy" decoding="async" />
                <figcaption>
                  <span><strong>{label}</strong><span>{caption}</span></span>
                  <ArrowRight size={16} aria-hidden="true" />
                </figcaption>
              </figure>
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
    <section className="home-quote" aria-label="Recommendation">
      <blockquote><p>{featuredQuote.quote}</p></blockquote>
      <div className="home-quote__by">
        <div className="home-quote__person">
          {featuredQuote.photo ? <img src={featuredQuote.photo} alt="" loading="lazy" /> : null}
          <div>
            <strong>{featuredQuote.name}</strong>
            <span>{featuredQuote.role}</span>
          </div>
        </div>
        <Link className="home-link" to="/recommendations">
          All recommendations <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

function Framework() {
  const framework = profile.signatureFramework;
  return (
    <section className="home-framework" aria-labelledby="home-framework-title">
      <div>
        <h2 id="home-framework-title">{framework.title}</h2>
        <p>{framework.subtitle}</p>
      </div>
      <div className="home-framework__actions">
        <a className="secondary-link" href={framework.fallbackHref} target="_blank" rel="noreferrer">
          Read the framework <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <a className="home-link" href={framework.downloadHref} download>
          <DownloadMark size={16} /> Download PDF
        </a>
      </div>
    </section>
  );
}

function Writing() {
  return (
    <section className="home-notes" aria-labelledby="home-writing-title">
      <header className="home-heading">
        <h2 id="home-writing-title">Writing</h2>
        <a className="home-link" href={profile.linkedinActivity} target="_blank" rel="noreferrer">
          All posts <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </header>
      <ul className="home-writing">
        {profile.writing.map((post) => (
          <li key={post.url}>
            <a href={post.url} target="_blank" rel="noreferrer">
              <span className="home-writing__date">{post.date}</span>
              <strong>{post.title}</strong>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Contact() {
  return (
    <section className="home-section home-contact" aria-labelledby="home-contact-title">
      <h2 id="home-contact-title">Get in touch</h2>
      <p>Available for architecture reviews, AI adoption strategy and technology leadership work.</p>
      <div className="home-actions">
        <LinkedInButton />
        <ExecutiveProfileDownloadButton />
        <ResumeDownloadButton />
      </div>
    </section>
  );
}

export default function ExecutivePage() {
  return (
    <div className="home" data-theme="executive">
      <Hero />
      <SelectedWork />
      <PullQuote />
      <Recognition />
      <FieldStrip />
      <Framework />
      <Writing />
      <Contact />
    </div>
  );
}
