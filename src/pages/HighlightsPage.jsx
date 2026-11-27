import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { DiagArrow } from "../components/icons.jsx";
import { ImageCarousel, PageFrame, ProofImage, Reveal } from "../components/shared.jsx";
import { imageAlt, imageCaption, imageSrc } from "../data/imageMetadata.js";
import { projectSlug } from "../data/derived.js";
import { internationalExposure, professionalHighlights } from "../data/mediaAssets.js";

// A map label whose background chip is sized from the rendered text, so it fits
// whatever font is in use instead of a per-character estimate. Phones get a
// larger font from CSS (see .global-routes-svg text), so it measures again
// when that breakpoint is crossed.
function MapLabel({ x, y, anchor, label, textFill, chipStroke, weight, spacing, size = 9 }) {
  const textRef = useRef(null);
  const [box, setBox] = useState(null);
  useLayoutEffect(() => {
    let active = true;
    const measure = () => {
      const bounds = active ? textRef.current?.getBBox() : null;
      if (bounds) setBox({ x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height });
    };
    measure();
    document.fonts?.ready.then(measure);
    const phone = window.matchMedia("(max-width: 540px)");
    phone.addEventListener("change", measure);
    return () => {
      active = false;
      phone.removeEventListener("change", measure);
    };
  }, [label]);
  return (
    <>
      {box ? (
        <rect x={box.x - 4} y={box.y - 1.5} width={box.width + 8} height={box.height + 3} rx="3" fill="rgba(251, 250, 246, 0.96)" stroke={chipStroke} strokeWidth="0.5" />
      ) : null}
      <text ref={textRef} x={x} y={y} fill={textFill} fontSize={size} fontWeight={weight} fontFamily="var(--font-sans)" letterSpacing={spacing} textAnchor={anchor}>{label}</text>
    </>
  );
}

function HighlightFeature({ highlight, reverse = false, priority = false }) {
  if (!highlight) return null;
  const id = projectSlug(highlight.title);
  return (
    <Reveal as={motion.section} className={`conf-feature${reverse ? " conf-feature--reverse" : ""}`} id={id} aria-labelledby={`${id}-title`}>
      <div className={`conf-feature__media${highlight.title === "Book Contributor" ? " conf-feature__media--publication" : ""}`}>
        <ImageCarousel
          images={highlight.images}
          onSlideClick={(e) => { const btn = e.currentTarget.querySelector(".proof-image-button"); if (btn) btn.click(); }}
          renderImage={(image) => (
            <ProofImage
              src={imageSrc(image)}
              alt={imageAlt(image, `${highlight.title} photo`)}
              caption={imageCaption(image, highlight.context)}
              priority={priority}
              eager={priority}
            />
          )}
        />
      </div>
      <div className="conf-feature__copy">
        <p className="conf-feature__meta">{highlight.category}</p>
        <h2 id={`${id}-title`}>{highlight.title}</h2>
        <p className="conf-feature__theme">{highlight.context}</p>
        <div className="conf-feature__takeaway">
          <span>Why it matters</span>
          <p>{highlight.story}</p>
        </div>
        {highlight.links?.length ? (
          <div className="projects-links">
            {highlight.links.map((link) => (
              <a className="projects-link" href={link.url} target="_blank" rel="noreferrer" key={link.url}>
                <span>{link.label}</span>
                <DiagArrow size={14} />
              </a>
            ))}
          </div>
        ) : null}
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
    <div className="global-routes-container">
      <svg aria-hidden="true" viewBox="-20 0 400 260" width="100%" height="100%" className="global-routes-svg">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glowPersonal" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(84, 79, 71, 0.35)" stopOpacity="1" />
            <stop offset="100%" stopColor="rgba(84, 79, 71, 0)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--gold)" />
            <stop offset="50%" stopColor="var(--gold)" />
            <stop offset="100%" stopColor="rgba(84, 79, 71, 0.4)" />
          </linearGradient>
          <linearGradient id="routeGradPersonal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(84, 79, 71, 0.85)" />
            <stop offset="100%" stopColor="rgba(84, 79, 71, 0.35)" />
          </linearGradient>
        </defs>
        <g stroke="rgba(23, 21, 15, 0.05)" strokeWidth="0.5">
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
          return (
            <g key={`dot-${r.id}`} className="route-dot route-dot--professional">
              <circle cx={r.x} cy={r.y} r="10" fill="url(#glow)" className="pulse-glow" />
              <circle cx={r.x} cy={r.y} r="3.5" fill="var(--gold)" />
              <MapLabel x={r.x + r.dx} y={r.y + r.dy} anchor={r.dx < 0 ? "end" : "start"} label={r.label} textFill="rgb(21, 94, 78)" chipStroke="rgba(21, 94, 78, 0.45)" weight="600" spacing="0.04em" />
            </g>
          );
        })}
        {personalRoutes.map((r) => {
          return (
            <g key={`dot-${r.id}`} className="route-dot route-dot--personal">
              <circle cx={r.x} cy={r.y} r="9" fill="url(#glowPersonal)" className="pulse-glow" />
              <circle cx={r.x} cy={r.y} r="2.5" fill="rgba(84, 79, 71, 0.9)" />
              <MapLabel x={r.x + r.dx} y={r.y + r.dy} anchor={r.dx < 0 ? "end" : "start"} label={r.label} textFill="rgb(23, 21, 15)" chipStroke="rgba(23, 21, 15, 0.18)" weight="500" spacing="0.03em" />
            </g>
          );
        })}
        <g className="route-dot">
          <circle cx={center.x} cy={center.y} r="14" fill="rgba(21, 94, 78, 0.14)" />
          <circle cx={center.x} cy={center.y} r="4" fill="#fff" />
          <circle cx={center.x} cy={center.y} r="2" fill="rgb(21, 94, 78)" />
          <MapLabel x={center.x} y={center.y + 21} anchor="middle" label={center.label} textFill="rgb(23, 21, 15)" chipStroke="rgba(21, 94, 78, 0.35)" weight="600" spacing="0.08em" size={10} />
        </g>
      </svg>
      <div className="global-routes-legend">
        <div><strong>Based in</strong><span>{center.label}</span></div>
        <div><strong>Client delivery</strong><span>{professionalRoutes.map(({ label }) => label).join(", ")}</span></div>
        <div><strong>Travel</strong><span>{personalRoutes.map(({ label }) => label).join(", ")}</span></div>
      </div>
    </div>
  );
}

export default function HighlightsPage() {
  const workAbroad = [
    { title: "US onsite delivery", text: "Worked in person with US clients on a B1/B2 business visa." },
    { title: "UK and South Africa", text: "Multi-year delivery relationships with remote stakeholders." },
    { title: "Travel", text: "Dubai, Nepal, Phuket and Vietnam." }
  ];

  return (
    <div data-theme="highlights">
      <PageFrame
        eyebrow="Highlights"
        title="Client visits, publications and other milestones."
        intro="The moments that don’t show up in delivery numbers: working onsite with clients, international exposure and published writing."
        className="highlights-page-hero"
      >
        <div className="ledger-page">
          {professionalHighlights.map((highlight, index) => (
            <HighlightFeature highlight={highlight} reverse={index % 2 === 1} priority={index === 0} key={highlight.title} />
          ))}

          <Reveal as={motion.section} className="home-section home-section--split" aria-labelledby="hl-abroad-title">
            <header className="home-section__head">
              <h2 id="hl-abroad-title">Working across borders</h2>
              <p>{internationalExposure.summary}</p>
            </header>
            <ol className="home-rules">
              {workAbroad.map((item) => (
                <li key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal as={motion.section} className="home-section global-map-section" aria-labelledby="hl-map-title">
            <header className="home-section__head">
              <h2 id="hl-map-title">Where work and travel have taken me</h2>
            </header>
            <div className="global-map-card__body">
              <GlobalRoutesMap />
            </div>
          </Reveal>
        </div>
      </PageFrame>
    </div>
  );
}
