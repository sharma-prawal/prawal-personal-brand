import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { PageFrame, Reveal } from "../components/shared.jsx";
import { imageSrc, thumbSrc } from "../data/imageMetadata.js";
import { awardAssets } from "../data/mediaAssets.js";
import OverlayDialog from "../components/OverlayDialog.jsx";
import { projectSlug } from "../data/derived.js";

const titleCounts = awardAssets.reduce((counts, award) => counts.set(award.title, (counts.get(award.title) || 0) + 1), new Map());
// Anchor id for an award; repeated titles (e.g. Star Performer of the Month) also carry their date.
const awardId = (award) => projectSlug(titleCounts.get(award.title) > 1 ? `${award.title} ${award.date}` : award.title);

const awardSignals = {
  "ESOP Ownership Achievement Award": { signal: "Ownership maturity", meaning: "Long-term commitment translated into trust, accountability, and organization-level contribution." },
  "Outstanding Contribution Award": { signal: "Growth contribution", meaning: "Recognition for engineering initiatives, collaboration, and measurable contribution beyond assigned delivery." },
  "Employee of the Year (2023)": { signal: "Delivery excellence", meaning: "A peak annual recognition that reinforces consistency, execution quality, and organizational impact." },
  "Key Contributor Award": { signal: "Sustained leverage", meaning: "Proof of being relied on when delivery quality and engineering ownership mattered." },
  "Longevity Award": { signal: "Staying power", meaning: "Steady contribution across changing teams, delivery demands and company stages." },
  "Exceptional Performer": { signal: "Performance bar", meaning: "A marker of consistently exceeding expectations during demanding delivery cycles." },
  "Extra Achiever's Award": { signal: "Resilience", meaning: "Recognition for extra effort and reliability through lockdown-era delivery pressure." },
  "Client Happiness Award": { signal: "Client trust", meaning: "Evidence that delivery quality was visible to stakeholders, not only internally appreciated." },
  "Star Performer of the Month": { signal: "Early ownership", meaning: "Early-career proof of reliability, momentum, and the habit of earning trust." }
};

function getSignal(award) {
  return awardSignals[award.title] || { signal: "Recognition", meaning: award.description };
}

function AwardProofViewer({ award, signal, onClose, returnFocusRef }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImage = award.images?.[activeImageIndex];

  return createPortal(
    <OverlayDialog className="award-modal-overlay proof-modal" label={`${award.title} proof viewer`} onDismiss={onClose} returnFocusRef={returnFocusRef}>
      <div className="award-modal" data-theme="awards">
        <button className="award-modal__close" type="button" onClick={onClose} aria-label="Close award viewer" data-dialog-initial-focus>
          <X size={18} />
        </button>
        <div className="award-modal__stage">
          <div className="award-artifact-stage award-artifact-stage--modal">
            {activeImage && <img key={imageSrc(activeImage)} src={imageSrc(activeImage)} alt={activeImage.alt || award.title} />}
          </div>
        </div>

        <div className="award-modal__body">
          <div className="award-modal__copy">
            <div className="award-metadata-row">
              <span>{award.issuer}</span>
              <small>{award.date}</small>
            </div>
            <h2>{award.title}</h2>
            <p>{signal.meaning}</p>
          </div>
          <aside className="award-modal__signal">
            <span>What it was for</span>
            <strong>{signal.signal}</strong>
            <p>{award.description}</p>
          </aside>
        </div>

        {award.images && award.images.length > 1 && (
          <div className="award-modal__thumbs" aria-label="Award photos">
            {award.images.map((img, idx) => (
              <button
                className={idx === activeImageIndex ? "is-active" : undefined}
                type="button"
                key={img.src || idx}
                onClick={() => setActiveImageIndex(idx)}
                aria-label={`Show photo ${idx + 1} of ${award.images.length}`}
                aria-pressed={idx === activeImageIndex}
              >
                <img src={thumbSrc(imageSrc(img))} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>
    </OverlayDialog>,
    document.body
  );
}

export default function AwardsPage() {
  const [selectedAward, setSelectedAward] = useState(null);
  const awardTrigger = useRef(null);
  const openAward = (event, award) => {
    awardTrigger.current = event.currentTarget;
    setSelectedAward(award);
  };
  const recent = awardAssets.filter((award) => award.date?.includes("2026"));
  const earlier = awardAssets.filter((award) => !recent.includes(award));
  const years = awardAssets.map((award) => Number((award.date || "").match(/\d{4}/)?.[0])).filter(Boolean);
  const facts = [
    { value: String(awardAssets.length), label: "Awards at Successive Digital" },
    { value: `${Math.min(...years)}–${Math.max(...years)}`, label: "Years covered" },
    { value: String(recent.length), label: "At the 2026 leadership offsite" },
    { value: "2023", label: "Employee of the Year" }
  ];

  return (
    <div data-theme="awards">
      <PageFrame
        eyebrow="Awards"
        title="Ten awards at Successive Digital since 2018."
        intro="For delivery milestones, client work and long-term contribution. Select any award to see the certificate or photos."
      >
        <div className="ledger-page">
          <dl className="home-facts" aria-label="Awards at a glance">
            {facts.map((fact) => (
              <div className="home-facts__item" key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

          {recent.length ? (
            <Reveal as={motion.section} className="home-section" aria-labelledby="awards-recent-title">
              <header className="home-section__head">
                <h2 id="awards-recent-title">Most recent</h2>
                <p>Both presented at the Successive Digital Leadership Offsite in May 2026.</p>
              </header>
              <ul className="photo-pair">
                {recent.map((award) => (
                  <li key={award.title} id={awardId(award)}>
                    <button type="button" onClick={(event) => openAward(event, award)} aria-label={`View ${award.title}`}>
                      <span className="photo-pair__img">
                        {award.images?.[0] ? <img src={imageSrc(award.images[0])} alt={award.images[0].alt || award.title} /> : null}
                      </span>
                      <span className="photo-pair__meta">{award.date}</span>
                      <strong>{award.title}</strong>
                      <span className="photo-pair__text">{award.description}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}

          <Reveal as={motion.section} className="home-section" aria-labelledby="awards-all-title">
            <header className="home-section__head">
              <h2 id="awards-all-title">Earlier awards</h2>
              <p>Newest first.</p>
            </header>
            <ol className="ledger-rows">
              {earlier.map((award) => {
                const signal = getSignal(award);
                return (
                  <li key={`${award.title}-${award.date}`} id={awardId(award)}>
                    <button type="button" onClick={(event) => openAward(event, award)}>
                      <span className="ledger-rows__date">{award.date}</span>
                      <span className="ledger-rows__main">
                        <strong>{award.title}</strong>
                        <span>{award.description}</span>
                      </span>
                      <span className="ledger-rows__tag">{signal.signal}</span>
                      <span className="ledger-rows__thumb">
                        {award.images?.[0] ? <img src={thumbSrc(imageSrc(award.images[0]))} alt="" loading="lazy" /> : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </div>

        {selectedAward && (
          <AwardProofViewer
            award={selectedAward}
            signal={getSignal(selectedAward)}
            onClose={() => setSelectedAward(null)}
            returnFocusRef={awardTrigger}
          />
        )}
      </PageFrame>
    </div>
  );
}
