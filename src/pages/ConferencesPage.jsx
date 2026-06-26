import { motion } from "framer-motion";
import { ImageCarousel, MotionCard, MotionGroup, PageFrame, ProofImage, Reveal, handleCardMouseMove } from "../components/shared.jsx";
import { imageAlt, imageCaption, imageSrc } from "../data/imageMetadata.js";
import { conferenceAssets } from "../data/mediaAssets.js";
import { itemReveal } from "../lib/motion.js";

function ConferenceSignalLedger({ signals }) {
  return (
    <Reveal as={motion.section} className="conference-signal-ledger" aria-label="Conference signal ledger">
      {signals.map((signal) => (
        <div className="conference-signal-ledger__item" key={signal.label}>
          <strong>{signal.value}</strong>
          <span>{signal.label}</span>
        </div>
      ))}
    </Reveal>
  );
}

function ConferenceArchiveIntro({ count, groups }) {
  return (
    <Reveal as={motion.section} className="conference-archive-intro">
      <div>
        <span className="eyebrow">Supporting event archive</span>
        <h2>Broader signals, grouped by what they sharpen.</h2>
      </div>
      <div className="conference-archive-intro__copy">
        <p>The following {count} conferences cover AI adoption, cloud platforms, data architecture, and business strategy — grouped by what each sharpens.</p>
        <div aria-label="Supporting event signals">
          {groups.map((group) => (
            <article key={group.title}>
              <strong>{group.title}</strong>
              <span>{group.text}</span>
            </article>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function ConferenceFeature({ moment }) {
  return (
    <Reveal as={motion.section} className="conference-feature" id="featured-event">
      <div className="conference-feature__copy">
        <h2>{moment.title}</h2>
        <p>{moment.theme}</p>
        <div className="conference-feature__takeaway">
          <span>Leadership takeaway</span>
          <strong>{moment.takeaway}</strong>
        </div>
        <div className="conference-feature__signals">
          <span>{moment.location}</span>
          <span>Documented signal</span>
          <span>AI adoption judgment</span>
        </div>
        <div className="conference-feature__meta-row">
          <span className="eyebrow">Featured event</span>
          {moment.eventType && <span className="conference-type-pill conference-type-pill--featured">{moment.eventType}</span>}
          {moment.year && <span className="conference-year-badge">{moment.year}</span>}
        </div>
      </div>
      <div className="conference-feature__media">
        <ImageCarousel
          images={moment.images}
          onSlideClick={(e) => { const btn = e.currentTarget.querySelector(".proof-image-button"); if (btn) btn.click(); }}
          renderImage={(image) => (
            <ProofImage
              src={imageSrc(image)}
              alt={imageAlt(image, `${moment.title} featured conference moment`)}
              caption={imageCaption(image, moment.theme)}
              priority
              eager
            />
          )}
        />
      </div>
    </Reveal>
  );
}

function ConferenceCard({ moment, index, priority }) {
  const isFeatured = index === 0;

  return (
    <MotionCard
      className={[
        isFeatured ? "conference-card conference-card--feature" : "conference-card",
        "glass-card spotlight-card"
      ].join(" ")}
      priority={priority}
      onMouseMove={handleCardMouseMove}
    >
      <div className="conference-media-gallery">
        <ImageCarousel
          images={moment.images}
          size="compact"
          onSlideClick={(e) => { const btn = e.currentTarget.querySelector(".proof-image-button"); if (btn) btn.click(); }}
          renderImage={(image) => (
            <ProofImage
              src={imageSrc(image)}
              alt={imageAlt(image, `${moment.title} conference moment`)}
              caption={imageCaption(image, moment.theme)}
              priority={priority}
            />
          )}
        />
      </div>

      <div className="conference-card-body">
        <div className="conference-card-meta-row">
          <strong className="slot-number-inline">Event {String(index + 1).padStart(2, "0")}</strong>
          {moment.eventType && <span className="conference-type-pill">{moment.eventType}</span>}
          {moment.year && <span className="conference-year-badge">{moment.year}</span>}
        </div>
        <span className="conference-location-tag">{moment.location}</span>
        <h3>{moment.title}</h3>
        <p className="conference-theme-text">{moment.theme}</p>
        <div className="takeaway-panel takeaway-panel--compact">
          <strong>Takeaway</strong>
          <p>{moment.takeaway}</p>
        </div>
      </div>
    </MotionCard>
  );
}

function ConferenceJudgmentBlock({ items }) {
  return (
    <Reveal as={motion.section} className="conference-judgment-block">
      <div className="conference-judgment-block__copy">
        <span className="eyebrow">Leadership judgment</span>
        <h2>How the signal translates into operating perspective.</h2>
        <p>The value is repeated exposure to where markets, platforms, and business expectations are moving — before those pressures arrive in delivery.</p>
      </div>
      <div className="conference-judgment-block__grid">
        {items.map((item) => (
          <article
            key={item.title}
            className="glass-card spotlight-card"
            onMouseMove={handleCardMouseMove}
          >
            <strong>{item.title}</strong>
            <span>{item.text}</span>
          </article>
        ))}
      </div>
    </Reveal>
  );
}

export default function ConferencesPage() {
  const featuredMoment = conferenceAssets[0];
  const archiveEvents = conferenceAssets.filter((moment) => moment.title !== featuredMoment?.title);
  const conferenceSignals = [
    { value: String(conferenceAssets.length), label: "industry forums" },
    { value: "AI / Cloud / Data", label: "focus areas" },
    { value: "2023-2026", label: "years attended" }
  ];
  const conferenceSignalGroups = [
    { title: "AI & emerging technology", text: "AI Impact Summit, Convergence India, and IAMAI keep the page anchored in current technology direction." },
    { title: "Cloud & data platforms", text: "AWS and MongoDB events connect market signals to practical platform and architecture choices." },
    { title: "Business forums", text: "Deloitte Fast 50 and commerce forums add the business context behind engineering prioritization." }
  ];
  const leadershipJudgment = [
    { title: "AI adoption judgment", text: "Separating useful enterprise adoption signals from event-stage excitement." },
    { title: "Platform modernization", text: "Reading cloud, data, and developer ecosystem shifts before they become delivery pressure." },
    { title: "Business context", text: "Connecting technology choices to growth, operating models, and stakeholder confidence." }
  ];

  return (
    <div data-theme="conferences">
    <PageFrame
      eyebrow="Public presence"
      title="Market exposure translated into engineering judgment."
      intro="Selected industry forums that sharpen perspective on AI adoption, cloud modernization, data platforms, and the business context behind technical decisions."
      className="conferences-page-hero"
    >
      <ConferenceSignalLedger signals={conferenceSignals} />
      {featuredMoment ? <ConferenceFeature moment={featuredMoment} /> : null}
      <ConferenceArchiveIntro count={archiveEvents.length} groups={conferenceSignalGroups} />
      <MotionGroup className="conference-grid" id="event-archive">
        {archiveEvents.map((moment, index) => (
          <ConferenceCard moment={moment} index={index + 1} priority={index === 0} key={moment.title} />
        ))}
      </MotionGroup>
      <ConferenceJudgmentBlock items={leadershipJudgment} />
    </PageFrame>
    </div>
  );
}
