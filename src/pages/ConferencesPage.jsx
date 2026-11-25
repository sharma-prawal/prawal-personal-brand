import { motion } from "framer-motion";
import { ImageCarousel, PageFrame, ProofImage, Reveal } from "../components/shared.jsx";
import { imageAlt, imageCaption, imageSrc } from "../data/imageMetadata.js";
import { projectSlug } from "../data/derived.js";
import { conferenceAssets } from "../data/mediaAssets.js";

const whyIGo = [
  { title: "AI adoption judgment", text: "Separating what enterprises are really adopting from what only sounds good on stage." },
  { title: "Platform modernisation", text: "Reading cloud, data and developer-ecosystem shifts before they turn into delivery pressure." },
  { title: "Business context", text: "Connecting technology choices to growth, operating models and stakeholder confidence." }
];

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

export default function ConferencesPage() {
  const featuredMoment = conferenceAssets[0];
  const yearOf = (moment) => Number(String(moment.year || "").match(/\d{4}/)?.[0]) || 0;
  const others = conferenceAssets
    .filter((moment) => moment.title !== featuredMoment?.title)
    .sort((a, b) => yearOf(b) - yearOf(a));
  const years = conferenceAssets.map((m) => Number(String(m.year || "").match(/\d{4}/)?.[0])).filter(Boolean);
  const facts = [
    { value: String(conferenceAssets.length), label: "Industry events" },
    { value: years.length ? `${Math.min(...years)}–${Math.max(...years)}` : "", label: "Years attended" },
    { value: "3", label: "Topics: AI, cloud and data, business" },
    { value: "1", label: "GenAI hackathon (dentsu, 2023)" }
  ].filter((fact) => fact.value);

  return (
    <div data-theme="conferences">
      <PageFrame
        title="Conferences"
        intro="Forums I attend to keep up with AI adoption, cloud modernisation and data platforms, and the business decisions behind them."
        className="conferences-page-hero event-index-hero"
      >
        <div className="ledger-page">
          {featuredMoment ? <ConferenceFeature moment={featuredMoment} /> : null}

          <Reveal as={motion.section} className="home-section home-section--split" aria-labelledby="conf-why-title">
            <header className="home-section__head">
              <h2 id="conf-why-title">Why I go</h2>
              <p>An early view of where platforms and client expectations are heading, before those changes reach our delivery work.</p>
            </header>
            <ol className="home-rules home-rules--numbered">
              {whyIGo.map((item, index) => (
                <li key={item.title}>
                  <span className="home-rules__num">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal as={motion.section} className="home-section" id="event-archive" aria-labelledby="conf-all-title">
            <header className="home-section__head">
              <h2 id="conf-all-title">Other events</h2>
              <p>Newest first. Select a photo to view it full size.</p>
            </header>
            <ol className="ledger-rows ledger-rows--events">
              {others.map((moment) => (
                <li key={moment.title} id={projectSlug(moment.title)}>
                  <div className="ledger-rows__row">
                    <span className="ledger-rows__date">
                      {moment.year}
                      {moment.eventType ? <span className="ledger-rows__sub">{moment.eventType}</span> : null}
                    </span>
                    <span className="ledger-rows__main">
                      <strong>{moment.title}</strong>
                      <span>{moment.theme}</span>
                      {moment.takeaway ? <span className="ledger-rows__takeaway">Takeaway: {moment.takeaway}</span> : null}
                    </span>
                    <span className="ledger-rows__strip">
                      {moment.images.slice(0, 3).map((image) => (
                        <span className="ledger-rows__thumb" key={imageSrc(image)}>
                          <ProofImage src={imageSrc(image)} alt={imageAlt(image, `${moment.title} photo`)} caption={imageCaption(image, moment.theme)} />
                        </span>
                      ))}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
            <p className="also-attended">
              Also: dentsu&apos;s{" "}
              <a href="https://www.linkedin.com/posts/sharma-prawal_chatgpt-generativeai-artificialintelligence-activity-7137813697678168065-F-03" target="_blank" rel="noreferrer">
                “Building Generative AI Solutions” hackathon
              </a>{" "}
              (December 2023).
            </p>
          </Reveal>
          <dl className="home-facts" aria-label="Events at a glance">
            {facts.map((fact) => (
              <div className="home-facts__item" key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

        </div>
      </PageFrame>
    </div>
  );
}
