import { motion } from "framer-motion";
import { DiagArrow } from "../components/icons.jsx";
import { ImageCarousel, MotionCard, MotionGroup, PageFrame, ProofImage, Reveal } from "../components/shared.jsx";
import { Button } from "../components/ui/button.jsx";
import { imageAlt, imageCaption, imageSrc } from "../data/imageMetadata.js";
import { internationalExposure, professionalHighlights } from "../data/mediaAssets.js";
import { itemReveal } from "../lib/motion.js";

function HighlightCard({ highlight, priority, isBook }) {
  return (
    <MotionCard className={`highlight-card${isBook ? " highlight-card--book" : ""}`} priority={priority}>
      <div className="highlight-media-gallery">
        <ImageCarousel
          images={highlight.images}
          onSlideClick={(e) => { const btn = e.currentTarget.querySelector(".proof-image-button"); if (btn) btn.click(); }}
          renderImage={(image) => (
            <ProofImage
              src={imageSrc(image)}
              alt={imageAlt(image, `${highlight.title} proof`)}
              caption={imageCaption(image, highlight.context)}
              priority={priority}
            />
          )}
        />
      </div>
      <div className="highlight-copy">
        <div className="highlight-category-header">
          <span className="highlight-category-pill">{highlight.category.toUpperCase()}</span>
        </div>
        <h3 className="premium-highlight-title">{highlight.title}</h3>
        <p className="premium-highlight-description">{highlight.context}</p>
        <div className="takeaway-panel highlight-takeaway-panel">
          <strong>Why it matters</strong>
          <p>{highlight.story}</p>
        </div>
        {highlight.links.length > 0 ? (
          <div className="highlight-links">
            {highlight.links.map((link) => (
              <Button asChild variant="secondary" size="compact" className="highlight-links__item" key={link.url}>
                <a href={link.url} target="_blank" rel="noreferrer">
                  <DiagArrow size={14} />
                  <span>{link.label}</span>
                </a>
              </Button>
            ))}
          </div>
        ) : null}
      </div>
    </MotionCard>
  );
}

function FeaturedHighlight({ highlight }) {
  if (!highlight) return null;

  return (
    <Reveal as={motion.section} className="featured-highlight">
      <div className="featured-highlight__media">
        <ImageCarousel
          images={highlight.images}
          onSlideClick={(e) => { const btn = e.currentTarget.querySelector(".proof-image-button"); if (btn) btn.click(); }}
          renderImage={(image) => (
            <ProofImage
              src={imageSrc(image)}
              alt={imageAlt(image, `${highlight.title} featured proof`)}
              caption={imageCaption(image, highlight.context)}
              priority
              eager
            />
          )}
        />
      </div>
      <div className="featured-highlight__copy">
        <span className="eyebrow">{highlight.category}</span>
        <h2>{highlight.title}</h2>
        <p>{highlight.context}</p>
        <div className="featured-highlight__why">
          <span>Executive signal</span>
          <strong>{highlight.story}</strong>
        </div>
        <div className="featured-highlight__signals">
          <span>{highlight.images.length} documentary proofs</span>
          <span>B1/B2 business visa</span>
          <span>US onsite client delivery</span>
        </div>
      </div>
    </Reveal>
  );
}

function GlobalRoutesMap() {
  const professionalRoutes = [
    { id: "usa", label: "US (onsite)", x: 60, y: 70, dx: -10, dy: -10 },
    { id: "uk", label: "UK", x: 120, y: 55, dx: -8, dy: -12 },
    { id: "sa", label: "South Africa", x: 140, y: 220, dx: -8, dy: 16 }
  ];
  const personalRoutes = [
    { id: "dubai", label: "Dubai", x: 168, y: 118, dx: -8, dy: -10 },
    { id: "nepal", label: "Nepal", x: 252, y: 98, dx: 8, dy: -10 },
    { id: "phuket", label: "Phuket", x: 286, y: 186, dx: 8, dy: 14 },
    { id: "vietnam", label: "Vietnam", x: 318, y: 158, dx: 8, dy: 12 }
  ];
  const center = { x: 225, y: 135, label: "Delhi (HQ)" };

  return (
    <div className="global-routes-container" aria-hidden="true">
      <svg viewBox="0 0 380 260" width="100%" height="100%" className="global-routes-svg">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glowPersonal" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(180,210,230,0.35)" stopOpacity="1" />
            <stop offset="100%" stopColor="rgba(180,210,230,0)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--gold)" />
            <stop offset="50%" stopColor="var(--gold)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
          </linearGradient>
          <linearGradient id="routeGradPersonal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(180,210,230,0.85)" />
            <stop offset="100%" stopColor="rgba(180,210,230,0.35)" />
          </linearGradient>
        </defs>
        <g stroke="rgba(255,255,255,0.03)" strokeWidth="0.5">
          {Array.from({ length: 13 }).map((_, i) => <line key={`x-${i}`} x1={i * 30} y1="0" x2={i * 30} y2="260" />)}
          {Array.from({ length: 9 }).map((_, i) => <line key={`y-${i}`} x1="0" y1={i * 30} x2={380} y2={i * 30} />)}
        </g>
        {professionalRoutes.map((r) => {
          const cx = (center.x + r.x) / 2;
          const cy = Math.min(center.y, r.y) - 40;
          return (
            <g key={`path-${r.id}`}>
              <path d={`M ${center.x} ${center.y} Q ${cx} ${cy} ${r.x} ${r.y}`} fill="none" stroke="url(#routeGrad)" strokeWidth="1.8" strokeOpacity="0.85" className="route-path-animated" />
              <path d={`M ${center.x} ${center.y} Q ${cx} ${cy} ${r.x} ${r.y}`} fill="none" stroke="var(--gold)" strokeWidth="0.5" strokeOpacity="0.3" />
            </g>
          );
        })}
        {personalRoutes.map((r) => {
          const cx = (center.x + r.x) / 2;
          const cy = Math.min(center.y, r.y) - 38;
          return (
            <g key={`path-${r.id}`}>
              <path d={`M ${center.x} ${center.y} Q ${cx} ${cy} ${r.x} ${r.y}`} fill="none" stroke="url(#routeGradPersonal)" strokeWidth="1.2" strokeOpacity="0.65" className="route-path-animated route-path--personal" />
            </g>
          );
        })}
        {professionalRoutes.map((r) => {
          const textWidth = r.label.length * 5.8 + 6;
          const textHeight = 12;
          const rx = r.dx < 0 ? r.x + r.dx - textWidth + 1 : r.x + r.dx - 1;
          const ry = r.y + r.dy - 9;
          return (
            <g key={`dot-${r.id}`} className="route-dot route-dot--professional">
              <circle cx={r.x} cy={r.y} r="10" fill="url(#glow)" className="pulse-glow" />
              <circle cx={r.x} cy={r.y} r="3.5" fill="var(--gold)" />
              <rect x={rx - 3} y={ry} width={textWidth + 6} height={textHeight} rx="3" fill="rgba(40, 30, 14, 0.75)" stroke="rgba(209,176,106,0.42)" strokeWidth="0.5" />
              <text x={r.x + r.dx} y={r.y + r.dy} fill="rgba(209,176,106,0.92)" fontSize="9" fontWeight="900" fontFamily="var(--font-sans)" letterSpacing="0.04em" textAnchor={r.dx < 0 ? "end" : "start"}>{r.label}</text>
            </g>
          );
        })}
        {personalRoutes.map((r) => {
          const textWidth = r.label.length * 5.8 + 6;
          const textHeight = 12;
          const rx = r.dx < 0 ? r.x + r.dx - textWidth + 1 : r.x + r.dx - 1;
          const ry = r.y + r.dy - 9;
          return (
            <g key={`dot-${r.id}`} className="route-dot route-dot--personal">
              <circle cx={r.x} cy={r.y} r="9" fill="url(#glowPersonal)" className="pulse-glow" />
              <circle cx={r.x} cy={r.y} r="2.5" fill="rgba(190,215,235,0.9)" />
              <rect x={rx - 3} y={ry} width={textWidth + 6} height={textHeight} rx="3" fill="rgba(14, 22, 30, 0.72)" stroke="rgba(180,210,230,0.32)" strokeWidth="0.5" />
              <text x={r.x + r.dx} y={r.y + r.dy} fill="rgba(210,230,245,0.88)" fontSize="9" fontWeight="600" fontFamily="var(--font-sans)" letterSpacing="0.03em" textAnchor={r.dx < 0 ? "end" : "start"}>{r.label}</text>
            </g>
          );
        })}
        <circle cx={center.x} cy={center.y} r="14" fill="rgba(209, 176, 106, 0.18)" />
        <circle cx={center.x} cy={center.y} r="4" fill="#fff" />
        <circle cx={center.x} cy={center.y} r="2" fill="var(--gold)" />
        <rect x={center.x - 32} y={center.y + 11} width={64} height={13} rx="3" fill="rgba(15, 20, 18, 0.82)" stroke="rgba(209, 176, 106, 0.2)" strokeWidth="0.5" />
        <text x={center.x} y={center.y + 20} fill="var(--gold)" fontSize="10" fontWeight="900" fontFamily="var(--font-sans)" letterSpacing="0.08em" textAnchor="middle">{center.label}</text>
      </svg>
      <div className="global-routes-legend" aria-hidden="true">
        <span><i className="legend-dot legend-dot--professional" />Client delivery — US (onsite, B1/B2 visa) · UK · South Africa</span>
        <span><i className="legend-dot legend-dot--personal" />Cultural exposure — Phuket · Nepal · Vietnam · Dubai</span>
      </div>
    </div>
  );
}

export default function HighlightsPage() {
  const featuredHighlight = professionalHighlights[0];
  const supportingHighlights = professionalHighlights.slice(1);
  const highlightProofSignals = [
    { value: "Onsite", label: "client-facing alignment" },
    { value: "Published", label: "communication contribution" },
    { value: "Global", label: "cross-border operating range" }
  ];
  const globalSignalLedger = [
    { label: "US onsite delivery", value: "B1/B2 business visa — can appear in person with US clients" },
    { label: "Remote stakeholder alignment", value: "UK / South Africa — multi-year delivery relationships" },
    { label: "Cultural operating range", value: "Phuket · Nepal · Vietnam · Dubai — not limited to one geography" }
  ];

  return (
    <div data-theme="highlights">
    <PageFrame
      eyebrow="Professional highlights"
      title="Selected signals of client-facing trust."
      intro="A tight evidence set for the moments that matter outside ordinary delivery metrics: onsite trust, global stakeholder exposure, and communication credibility."
      className="highlights-page-hero"
      heroAside={
        <motion.div className="highlights-hero-ledger" variants={itemReveal}>
          {highlightProofSignals.map((item) => (
            <div className="highlights-hero-ledger__item" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </motion.div>
      }
    >
      <FeaturedHighlight highlight={featuredHighlight} />

      <div className="premium-section-divider highlight-section-divider">
        <span className="premium-divider-label">Selected proof notes</span>
        <hr />
      </div>

      <div className="highlight-supporting-layout">
        <MotionGroup className="highlight-grid highlight-grid--supporting">
          {supportingHighlights.map((highlight, index) => (
            <HighlightCard
              highlight={highlight}
              priority={index === 0}
              key={highlight.title}
              isBook={highlight.links && highlight.links.length > 0}
            />
          ))}
        </MotionGroup>
        <Reveal as={motion.section} className="international-note">
          <div className="international-note__copy">
            <span>{internationalExposure.category}</span>
            <h3 className="international-note__title">{internationalExposure.title}</h3>
            <p>{internationalExposure.summary}</p>
            <small>{internationalExposure.note}</small>
            <div className="global-signal-ledger">
              {globalSignalLedger.map((item) => (
                <div className="global-signal-ledger__item" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal as={motion.section} className="global-map-card">
        <div className="global-map-card__header">
          <span className="eyebrow">Interactive footprint</span>
          <h2>Lived global travel & connection range</h2>
        </div>
        <div className="global-map-card__body">
          <GlobalRoutesMap />
        </div>
      </Reveal>
    </PageFrame>
    </div>
  );
}
