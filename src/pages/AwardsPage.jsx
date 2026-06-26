import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, X, ZoomIn } from "lucide-react";
import { MotionGroup, PageFrame, ReflectionBlock, Reveal } from "../components/shared.jsx";
import { imageSrc } from "../data/imageMetadata.js";
import { awardAssets } from "../data/mediaAssets.js";
import { itemReveal, premiumEase, rowReveal, rowStagger, viewportReveal } from "../lib/motion.js";

const awardSignals = {
  "ESOP Ownership Achievement Award": { signal: "Ownership maturity", meaning: "Long-term commitment translated into trust, accountability, and organization-level contribution." },
  "Outstanding Contribution Award": { signal: "Growth contribution", meaning: "Recognition for engineering initiatives, collaboration, and measurable contribution beyond assigned delivery." },
  "Employee of the Year (2023)": { signal: "Delivery excellence", meaning: "A peak annual recognition that reinforces consistency, execution quality, and organizational impact." },
  "Key Contributor Award": { signal: "Sustained leverage", meaning: "Proof of being relied on when delivery quality and engineering ownership mattered." },
  "Longevity Award": { signal: "Staying power", meaning: "A durable contribution signal across changing teams, delivery demands, and organizational stages." },
  "Exceptional Performer": { signal: "Performance bar", meaning: "A marker of consistently exceeding expectations during demanding delivery cycles." },
  "Extra Achiever's Award": { signal: "Resilience", meaning: "Recognition for extra effort and reliability through lockdown-era delivery pressure." },
  "Client Happiness Award": { signal: "Client trust", meaning: "Evidence that delivery quality was visible to stakeholders, not only internally appreciated." },
  "Star Performer of the Month": { signal: "Early ownership", meaning: "Early-career proof of reliability, momentum, and the habit of earning trust." }
};

function getSignal(award) {
  return awardSignals[award.title] || { signal: "Recognition signal", meaning: award.description };
}

function PremiumProofGalleryModal({ award, signal, onClose }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.cssText = `overflow:hidden;position:fixed;top:-${scrollY}px;width:100%;`;
    return () => {
      document.body.style.cssText = "";
      window.scrollTo({ top: scrollY, behavior: "instant" });
    };
  }, []);

  const activeImage = award.images?.[activeImageIndex];

  return createPortal(
    <div className="award-modal-overlay" onClick={onClose} data-theme="awards">
      <motion.div
        className="award-modal"
        initial={{ y: 18, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 18, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.34, ease: premiumEase }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${award.title} proof viewer`}
      >
        <div className="award-modal__stage">
          <button className="award-modal__close" type="button" onClick={onClose} aria-label="Close proof viewer">
            <X size={17} />
          </button>
          <div className="award-artifact-stage award-artifact-stage--modal">
            {activeImage && <img src={imageSrc(activeImage)} alt={award.title} />}
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
            <span>Recognition signal</span>
            <strong>{signal.signal}</strong>
            <p>{award.description}</p>
          </aside>
        </div>

        {award.images && award.images.length > 1 && (
          <div className="award-modal__thumbs" aria-label="Award proof thumbnails">
            {award.images.map((img, idx) => (
              <button
                className={idx === activeImageIndex ? "is-active" : undefined}
                type="button"
                key={img.src || idx}
                onClick={() => setActiveImageIndex(idx)}
                aria-label={`View proof image ${idx + 1}`}
              >
                <img src={imageSrc(img)} alt={`${award.title} proof thumbnail ${idx + 1}`} />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
}

export default function AwardsPage() {
  const [selectedAward, setSelectedAward] = useState(null);

  const heroAward = awardAssets[0];
  const gridAwards = awardAssets.slice(1, 4);
  const archiveAwards = awardAssets.slice(4);
  const recognitionLedger = [
    { value: "10", label: "awards", text: "Repeated recognition across ownership, client trust, delivery, and long-term contribution." },
    { value: "8", label: "year span", text: "A pattern from early performer signals to recent leadership offsite recognition." },
    { value: "4", label: "signal types", text: "Ownership, contribution, delivery excellence, and client happiness across different moments." },
    { value: "2026", label: "latest proof", text: "Recent recognition still connected to growth initiatives, not nostalgia." }
  ];

  const signatureAwards = gridAwards.map((award) => ({ ...award, ...getSignal(award) }));
  const archiveEntries = archiveAwards.map((award) => ({ ...award, ...getSignal(award) }));
  const heroProofImage = heroAward?.images?.[0];
  const heroSignal = heroAward ? getSignal(heroAward) : null;
  const proofCount = awardAssets.reduce((count, award) => count + (award.images?.length || 0), 0);

  return (
    <div data-theme="awards" style={{ position: "relative" }}>
      {/* Ambient gold glow — non-fixed, scrolls with content for visible gold atmosphere */}
      <div aria-hidden="true" style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "140%",
        height: "680px",
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(209,176,106,0.22) 0%, rgba(180,148,78,0.10) 40%, transparent 72%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />
    <PageFrame
      eyebrow="Recognition"
      title="10 awards across 10 years — consistent delivery, client trust, and leadership impact."
      intro="Recognition earned across delivery milestones, client moments, and organizational growth cycles at Successive Digital."
    >
      {heroAward && (
        <Reveal as={motion.section} className="awards-recognition-hero">
          <div className="awards-recognition-hero__copy">
            <div className="award-metadata-row">
              <span>{heroAward.issuer}</span>
              <small>{heroAward.date}</small>
            </div>
            <h2>A long-running pattern of being trusted when contribution has to compound.</h2>
            <p>The awards matter less as trophies and more as a signal: ownership was visible across years, delivery phases, client moments, and organizational growth cycles.</p>
            <div className="awards-recognition-hero__signal">
              <span>{heroSignal.signal}</span>
              <strong>{heroAward.title}</strong>
              <p>{heroSignal.meaning}</p>
            </div>
            <button className="award-proof-button" type="button" onClick={() => setSelectedAward(heroAward)}>
              <ZoomIn size={15} />
              <span>Inspect proof</span>
            </button>
          </div>
          <button className="awards-recognition-hero__proof" type="button" onClick={() => setSelectedAward(heroAward)} aria-label={`Inspect ${heroAward.title}`}>
            <span className="award-proof-kicker">Featured proof</span>
            <span className="award-artifact-stage award-artifact-stage--hero">
              {heroProofImage && <img src={imageSrc(heroProofImage)} alt={heroAward.title} />}
            </span>
          </button>
        </Reveal>
      )}

      <MotionGroup as={motion.section} className="awards-recognition-ledger" aria-label="Recognition proof ledger">
        {recognitionLedger.map((item) => (
          <motion.article className="awards-recognition-ledger__item" variants={itemReveal} key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
            <p>{item.text}</p>
          </motion.article>
        ))}
      </MotionGroup>

      <Reveal as={motion.section} className="awards-section-intro">
        <div>
          <span className="eyebrow">Signature recognition</span>
          <h2>Recent awards, interpreted as operating signals.</h2>
        </div>
        <p className="awards-section-intro__copy">
          Each recognition is interpreted for what it signals: not a trophy, but a moment where ownership, contribution, or delivery reliability was made visible to the organization.
        </p>
      </Reveal>

      <MotionGroup className="signature-awards-grid">
        {signatureAwards.map((award) => (
          <motion.button className="signature-award-card" type="button" variants={itemReveal} key={award.title} onClick={() => setSelectedAward(award)}>
            <span className="award-artifact-stage signature-award-card__media">
              {award.images?.[0] && <img src={imageSrc(award.images[0])} alt={award.title} />}
            </span>
            <span className="signature-award-card__body">
              <span className="award-metadata-row">
                <span>{award.issuer}</span>
                <small>{award.date}</small>
              </span>
              <strong>{award.title}</strong>
              <span className="signature-award-card__signal">{award.signal}</span>
              <p>{award.meaning}</p>
            </span>
          </motion.button>
        ))}
      </MotionGroup>

      <Reveal as={motion.section} className="awards-archive-ledger" aria-label="Award archive ledger">
        <div className="awards-archive-ledger__header">
          <div>
            <span className="eyebrow">Recognition ledger</span>
            <h2>The archive is useful because the pattern repeats.</h2>
          </div>
          <span>{archiveEntries.length} archive entries - {proofCount} proof images</span>
        </div>
        <motion.div
          className="awards-archive-ledger__rows"
          initial="hidden"
          whileInView="visible"
          viewport={viewportReveal}
          variants={rowStagger}
        >
          {archiveEntries.map((award) => (
            <motion.button
              className="awards-archive-row"
              type="button"
              key={`${award.title}-${award.date}`}
              onClick={() => setSelectedAward(award)}
              variants={rowReveal}
              transition={{ duration: 0.42, ease: premiumEase }}
            >
              <span className="awards-archive-row__date">{award.date}</span>
              <span className="awards-archive-row__main">
                <strong>{award.title}</strong>
                <p className="awards-archive-row__meaning">{award.meaning}</p>
                <small>{award.issuer}</small>
              </span>
              <span className="awards-archive-row__signal">{award.signal}</span>
              <ChevronRight size={16} />
            </motion.button>
          ))}
        </motion.div>
      </Reveal>

      <AnimatePresence>
        {selectedAward && (
          <PremiumProofGalleryModal
            award={selectedAward}
            signal={getSignal(selectedAward)}
            onClose={() => setSelectedAward(null)}
          />
        )}
      </AnimatePresence>

      <ReflectionBlock
        eyebrow="Recognition reflection"
        title="The senior signal is consistency, not decoration."
        text="Across the archive, the strongest message is not that awards were collected. It is that ownership, contribution, client trust, and delivery reliability kept becoming visible to the organization over time."
      />
    </PageFrame>
    </div>
  );
}
