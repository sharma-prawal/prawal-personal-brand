import { motion } from "framer-motion";
import { ImageCarousel, MotionCard, MotionGroup, PageFrame, ProofImage, Reveal } from "../components/shared.jsx";
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
        <span className="eyebrow">More events</span>
        <h2>Other conferences, grouped by topic.</h2>
      </div>
      <div className="conference-archive-intro__copy">
        <p>The following {count} conferences cover AI adoption, cloud platforms, data architecture and business strategy.</p>
        <div aria-label="Supporting event signals">
          {groups.map((group) => (
            <article key={group.title}>
              <strong>{group.title}</strong>
              <span>{group.text}</span>
            </article>
          ))}
        </div>
        <p className="also-attended">
          Also: dentsu&apos;s <a href="https://www.linkedin.com/posts/sharma-prawal_chatgpt-generativeai-artificialintelligence-activity-7137813697678168065-F-03" target="_blank" rel="noreferrer">“Building Generative AI Solutions” hackathon</a> (December 2023).
        </p>
      </div>
    </Reveal>
  );
}

function ConferenceFeature({ moment }) {
  const meta = ["Featured event", moment.eventType, moment.year].filter(Boolean).join(" · ");
  return (
    <Reveal as={motion.section} className="conf-feature" id="featured-event" aria-labelledby="conf-feature-title">
      <div className="conf-feature__media">
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
      <div className="conf-feature__copy">
        <p className="conf-feature__meta">{meta}</p>
        <h2 id="conf-feature-title">{moment.title}</h2>
        <p className="conf-feature__theme">{moment.theme}</p>
        <div className="conf-feature__takeaway">
          <span>What I took away</span>
          <p>{moment.takeaway}</p>
        </div>
        {moment.location ? <p className="conf-feature__location">{moment.location}</p> : null}
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
        <span className="eyebrow">Why I go</span>
        <h2>What I bring back to the team.</h2>
        <p>An early view of where platforms and client expectations are heading, before those changes reach our delivery work.</p>
      </div>
      <div className="conference-judgment-block__grid">
        {items.map((item) => (
          <article
            key={item.title}
            className="glass-card spotlight-card"
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
    { title: "Cloud & data platforms", text: "AWS and MongoDB events connect what the market is doing to practical platform and architecture choices." },
    { title: "Business forums", text: "Deloitte Fast 50 and commerce forums add the business context behind engineering prioritization." }
  ];
  const leadershipJudgment = [
    { title: "AI adoption judgment", text: "Separating what enterprises are really adopting from what only sounds good on stage." },
    { title: "Platform modernization", text: "Reading cloud, data, and developer ecosystem shifts before they become delivery pressure." },
    { title: "Business context", text: "Connecting technology choices to growth, operating models, and stakeholder confidence." }
  ];

  return (
    <div data-theme="conferences">
    <PageFrame
      eyebrow="Conferences"
      title="Industry events on AI, cloud and data."
      intro="Forums I attend to keep up with AI adoption, cloud modernisation and data platforms, and the business decisions behind them."
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
