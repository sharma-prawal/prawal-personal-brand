import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Code2,
  Info,
  Linkedin,
  Mail,
  Search,
  X,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { CheckCircleMark, DiagArrow, DocMark, DownloadMark, NodeMark, StarMark, VerifyCircle, WorkMark } from "./icons.jsx";
import { getDirectContact, profile } from "../data/profile.js";
import { imageAlt, imageCaption, imageSrc } from "../data/imageMetadata.js";
import { Button } from "./ui/button.jsx";
import {
  cardHover,
  fadeUp,
  itemReveal,
  premiumEase,
  stagger,
  tapPress,
  viewportReveal
} from "../lib/motion.js";

// ─── Utilities ───────────────────────────────────────────────────────────────

export function proxyToProofImage(event) {
  if (event.target.closest(".proof-image-button")) return;
  const btn = event.currentTarget.querySelector(".proof-image-button");
  if (btn) btn.click();
}

export function handleCardMouseMove(event) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  card.style.setProperty("--mouse-x", `${x}px`);
  card.style.setProperty("--mouse-y", `${y}px`);
}

export { imageSrc, imageAlt, imageCaption };

export const MotionRouterLink = motion.create(Link);

// ─── Icon helpers ─────────────────────────────────────────────────────────────

export const getNoteIcon = (topic) => {
  switch (topic.toLowerCase()) {
    case "ai adoption": return <StarMark size={18} />;
    case "engineering leadership": return <WorkMark size={18} />;
    case "architecture": return <Code2 size={18} />;
    case "delivery": return <CheckCircleMark size={18} />;
    default: return <Info size={18} />;
  }
};

export const getPillarIcon = (label) => {
  switch (label) {
    case "01": return <Search size={18} />;
    case "02": return <VerifyCircle size={18} />;
    case "03": return <NodeMark size={18} />;
    case "04": return <CheckCircleMark size={18} />;
    default: return <Info size={18} />;
  }
};

export const getSystemIcon = (label) => {
  switch (label) {
    case "01": return <Search size={18} />;
    case "02": return <NodeMark size={18} />;
    case "03": return <StarMark size={18} />;
    case "04": return <VerifyCircle size={18} />;
    default: return <Info size={18} />;
  }
};

// ─── ScrollToTop ──────────────────────────────────────────────────────────────

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

// ─── ImageCarousel ────────────────────────────────────────────────────────────

export function ImageCarousel({ images, renderImage, size = "default", onSlideClick }) {
  const shouldReduceMotion = useReducedMotion();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const isCompact = size === "compact";

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={`image-carousel${isCompact ? " image-carousel--compact" : ""}`}>
      <div
        className={`image-carousel__slide-area${onSlideClick ? " image-carousel__slide-area--zoomable" : ""}`}
        onClick={onSlideClick}
        onKeyDown={onSlideClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSlideClick(e); } } : undefined}
        role={onSlideClick ? "button" : undefined}
        tabIndex={onSlideClick ? 0 : undefined}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImageIndex}
            className="image-carousel__slide"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25, ease: premiumEase }}
          >
            {renderImage(images[activeImageIndex], activeImageIndex)}
          </motion.div>
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <>
          <button
            className={`carousel-nav-btn carousel-nav-btn--prev${isCompact ? " carousel-nav-btn--compact" : ""}`}
            onClick={handlePrev}
            aria-label="Previous image"
            type="button"
          >
            <ChevronLeft size={isCompact ? 14 : 16} />
          </button>
          <button
            className={`carousel-nav-btn carousel-nav-btn--next${isCompact ? " carousel-nav-btn--compact" : ""}`}
            onClick={handleNext}
            aria-label="Next image"
            type="button"
          >
            <ChevronRight size={isCompact ? 14 : 16} />
          </button>
          <span className="carousel-indicator">{activeImageIndex + 1} / {images.length}</span>
        </>
      )}
    </div>
  );
}

// ─── Reveal / MotionGroup / MotionCard / Magnetic ────────────────────────────

export function Reveal({ as: Component = motion.div, className, children, delay = 0, variants: variantsOverride, ...props }) {
  const shouldReduceMotion = useReducedMotion();
  const revealVariants = variantsOverride || {
    hidden: { opacity: 0, y: 22, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" }
  };

  return (
    <Component
      className={className}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={viewportReveal}
      variants={shouldReduceMotion ? undefined : revealVariants}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.72, ease: premiumEase, delay }}
      {...props}
    >
      {children}
    </Component>
  );
}

export function MotionGroup({ as: Component = motion.div, className, children, delay = 0, immediate = false, ...props }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Component
      className={className}
      initial={shouldReduceMotion || immediate ? false : "hidden"}
      animate={immediate && !shouldReduceMotion ? "visible" : undefined}
      whileInView={shouldReduceMotion || immediate ? undefined : "visible"}
      viewport={immediate ? undefined : viewportReveal}
      variants={shouldReduceMotion ? undefined : stagger}
      transition={shouldReduceMotion ? { duration: 0 } : { delay }}
      {...props}
    >
      {children}
    </Component>
  );
}

export function MotionCard({ className, children, priority = false, immediate = false, revealVariant, ...props }) {
  const shouldReduceMotion = useReducedMotion();
  const variant = revealVariant || itemReveal;

  return (
    <motion.article
      className={className}
      variants={shouldReduceMotion || priority || immediate ? undefined : variant}
      initial={immediate ? false : undefined}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.56, ease: premiumEase }}
      whileHover={shouldReduceMotion ? undefined : cardHover}
      whileTap={shouldReduceMotion ? undefined : tapPress}
      {...props}
    >
      {children}
    </motion.article>
  );
}

export function Magnetic({ children, strength = 10 }) {
  const shouldReduceMotion = useReducedMotion();
  const [hasFinePointer] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
  const active = !shouldReduceMotion && hasFinePointer;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 18, mass: 0.55 });
  const springY = useSpring(y, { stiffness: 120, damping: 18, mass: 0.55 });

  function handlePointerMove(event) {
    if (!active) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const relX = event.clientX - (rect.left + rect.width / 2);
    const relY = event.clientY - (rect.top + rect.height / 2);
    x.set((relX / rect.width) * strength);
    y.set((relY / rect.height) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      className="magnetic-shell"
      style={active ? { x: springX, y: springY } : undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      whileTap={active ? tapPress : undefined}
    >
      {children}
    </motion.span>
  );
}

// ─── ProofImage ───────────────────────────────────────────────────────────────

export function ProofImage({ src, alt, caption, priority = false, eager = false, zoomable = true, width = 800, height = 600 }) {
  const shouldReduceMotion = useReducedMotion();
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const frameStyle = { "--proof-image": `url("${src.replaceAll("\"", "\\\"")}")` };
  const zoomImageStyle =
    zoomScale === 1
      ? { width: "auto", maxWidth: "100%", maxHeight: "calc(100dvh - 194px)" }
      : { width: `${Math.round(zoomScale * 100)}%`, maxWidth: "none", maxHeight: "none" };
  const pageTheme = typeof document !== "undefined" ? document.querySelector("[data-theme]")?.dataset.theme : undefined;
  const lightbox =
    zoomable && typeof document !== "undefined"
      ? createPortal(
          <AnimatePresence>
            {isZoomed ? (
              <motion.div
                className="image-lightbox"
                data-theme={pageTheme}
                role="dialog"
                aria-modal="true"
                aria-label={alt}
                initial={shouldReduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: premiumEase }}
                onClick={() => setIsZoomed(false)}
              >
                <motion.div
                  className="image-lightbox__panel"
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.975, y: 18, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.985, y: 10, filter: "blur(8px)" }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.38, ease: premiumEase }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <button className="image-lightbox__close" type="button" aria-label="Close zoomed image" onClick={() => setIsZoomed(false)}>
                    <X size={18} />
                  </button>
                  <div className="image-lightbox__toolbar" onClick={(event) => event.stopPropagation()}>
                    <span>Fit</span>
                    <ZoomOut size={16} aria-hidden="true" />
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.1"
                      value={zoomScale}
                      aria-label="Image zoom level"
                      onInput={(event) => setZoomScale(Number(event.currentTarget.value))}
                      onChange={(event) => setZoomScale(Number(event.target.value))}
                    />
                    <ZoomIn size={16} aria-hidden="true" />
                    <output>{Math.round(zoomScale * 100)}%</output>
                  </div>
                  <div className="image-lightbox__viewport">
                    <img src={src} alt={alt} style={zoomImageStyle} />
                  </div>
                  <p>{caption || alt}</p>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body
        )
      : null;

  useEffect(() => {
    if (!zoomable || !isZoomed) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKeyDown(event) {
      if (event.key === "Escape") setIsZoomed(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isZoomed, zoomable]);

  return (
    <>
      <motion.span
        className="proof-image-frame"
        style={frameStyle}
        initial={shouldReduceMotion || !priority ? false : { opacity: 0, scale: 1.025, filter: "blur(8px)" }}
        animate={shouldReduceMotion || !priority ? undefined : { opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.82, ease: premiumEase }}
      >
        {zoomable ? (
          <button
            className="proof-image-button"
            type="button"
            aria-label={`Zoom ${alt}`}
            onClick={(event) => {
              event.stopPropagation();
              setZoomScale(1);
              setIsZoomed(true);
            }}
          >
            <img
              src={src}
              alt={alt}
              width={width}
              height={height}
              loading={priority || eager ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={priority ? "high" : "auto"}
            />
            <span className="proof-zoom-cue" aria-hidden="true">
              <ZoomIn size={15} />
            </span>
            <span className="proof-inspect-label" aria-hidden="true">View proof</span>
          </button>
        ) : (
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={priority || eager ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
          />
        )}
      </motion.span>
      {lightbox}
    </>
  );
}

// ─── Shared layout primitives ─────────────────────────────────────────────────

export function SectionHeader({ eyebrow, title, intro }) {
  return (
    <div className="section-header">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {intro ? <p>{intro}</p> : null}
    </div>
  );
}

export function ProofIndex({ label = "Proof index", items, meta, backHref }) {
  return (
    <nav className="proof-index" aria-label={label}>
      <div>
        {backHref ? (
          <Link to={backHref} className="proof-index-back">
            <ChevronLeft size={10} />
            Back
          </Link>
        ) : null}
        <span>{label}</span>
        {meta ? <strong>{meta}</strong> : null}
      </div>
      <div>
        {items.map((item) => (
          <a href={`#${item.id}`} key={item.id}>{item.label}</a>
        ))}
      </div>
    </nav>
  );
}

export function ReflectionBlock({ eyebrow, title, text }) {
  return (
    <Reveal as={motion.section} className="reflection-block">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </Reveal>
  );
}

export function PageFrame({ eyebrow, title, intro, children, className = "", heroAside = null }) {
  const heroClassName = ["page-hero", className].filter(Boolean).join(" ");

  return (
    <>
      <motion.section className={heroClassName} initial="hidden" animate="visible" variants={stagger}>
        <motion.div className="page-hero__inner" variants={fadeUp} transition={{ duration: 0.72, ease: premiumEase }}>
          <div className="page-hero__copy">
            <motion.span className="eyebrow" variants={itemReveal}>{eyebrow}</motion.span>
            <motion.h1 variants={fadeUp} transition={{ duration: 0.82, ease: premiumEase, delay: 0.02 }}>{title}</motion.h1>
            <motion.p variants={itemReveal}>{intro}</motion.p>
          </div>
          {heroAside}
        </motion.div>
      </motion.section>
      {children}
    </>
  );
}

export function MiniCase({ title, text, className }) {
  return (
    <motion.div className={["mini-case", className].filter(Boolean).join(" ")} variants={itemReveal}>
      <strong>{title}</strong>
      <p>{text}</p>
    </motion.div>
  );
}

// ─── CTA buttons ──────────────────────────────────────────────────────────────

export function LinkedInButton({ compact = false }) {
  const button = (
    <Button asChild variant={compact ? "ghost" : "primary"} size={compact ? "compact" : "default"} className={compact ? "icon-link compact" : "primary-link linkedin-primary"}>
      <a href={profile.contact.linkedin} target="_blank" rel="noreferrer">
        <Linkedin size={compact ? 16 : 18} />
        <span>{compact ? "LinkedIn" : "Connect on LinkedIn"}</span>
        <DiagArrow size={compact ? 14 : 16} />
      </a>
    </Button>
  );

  return compact ? button : <Magnetic>{button}</Magnetic>;
}

export function EmailLinkButton() {
  const { email } = getDirectContact();
  return (
    <a href={`mailto:${email}`} className="email-text-link">
      <Mail size={16} />
      <span>Email Prawal</span>
      <DiagArrow size={14} className="arrow-icon" />
    </a>
  );
}

export function generateATSResume() {
  const directContact = getDirectContact();

  // Derived live from profile.skillGroups + certifications
  const atsSkills = profile.skillGroups.map((g) => ({
    label: g.label.charAt(0).toUpperCase() + g.label.slice(1),
    value: g.skills.join(", ")
  })).concat([{
    label: "Key Certifications",
    value: [
      ...profile.certifications[0].items.slice(0, 5),
      ...profile.certifications[2].items.slice(0, 3),
      "Graph Developer – Professional (Apollo GraphQL)"
    ].join(" | ")
  }]);

  const abbrevPeriod = (s) => s
    .replace(" - ", "–")
    .replace("November", "Nov").replace("October", "Oct").replace("September", "Sep")
    .replace("August", "Aug").replace("February", "Feb").replace("January", "Jan")
    .replace("March", "Mar").replace("April", "Apr").replace("July", "Jul").replace("June", "Jun");

  const successive = profile.experience[0];
  const successiveHTML = successive.roles
    .map((role) => {
      const bullets = role.details.map((d) => `<li>${d}</li>`).join("");
      return `
        <div class="exp-block">
          <div class="exp-header">
            <span class="exp-title">${role.title}</span>
            <span class="exp-date">${abbrevPeriod(role.period)}</span>
          </div>
          <div class="exp-header">
            <span class="exp-company">${successive.company}</span>
            <span class="exp-location">${successive.location}, India</span>
          </div>
          <ul>${bullets}</ul>
        </div>`;
    })
    .join("");

  // Derived live from profile.experience (all companies after Successive)
  const earlierHTML = profile.experience
    .slice(1)
    .map((co) => {
      const role = co.roles[0];
      const bullets = role.details.map((d) => `<li>${d}</li>`).join("");
      return `
        <div class="exp-block">
          <div class="exp-header">
            <span class="exp-title">${role.title}</span>
            <span class="exp-date">${co.duration}</span>
          </div>
          <div class="exp-header">
            <span class="exp-company">${co.company}</span>
            <span class="exp-location">${co.location}</span>
          </div>
          ${bullets ? `<ul>${bullets}</ul>` : ""}
        </div>`;
    })
    .join("");

  const awardHTML = profile.awards
    .slice(0, 6)
    .map((a) => `<div class="award-row"><strong>${a.title}</strong> – ${a.description}</div>`)
    .join("");

  const skillsHTML = atsSkills
    .map((s) => `<div class="skills-row"><span class="skills-label">${s.label}:</span> ${s.value}</div>`)
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Prawal Sharma — ATS Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'EB Garamond', Georgia, 'Times New Roman', serif; font-size: 10.5pt; line-height: 1.35; color: #000; background: #fff; padding: 0.5in 0.6in; }
    @media print { body { padding: 0; } @page { margin: 0.5in 0.6in; size: letter; } .no-print { display: none !important; } }
    h1 { font-size: 18pt; font-weight: 700; text-align: center; margin-bottom: 2pt; letter-spacing: 0.01em; }
    .contact-line { text-align: center; font-size: 9.5pt; margin-bottom: 12pt; color: #111; }
    h2 { font-size: 10.5pt; font-variant: small-caps; font-weight: 400; letter-spacing: 0.08em; border-bottom: 0.8pt solid #000; padding-bottom: 1pt; margin: 10pt 0 4pt; }
    p.summary { font-size: 10.5pt; line-height: 1.4; text-align: justify; }
    .skills-row { margin-bottom: 1.5pt; font-size: 10.5pt; }
    .skills-label { font-weight: 700; }
    .exp-block { margin-bottom: 6pt; }
    .exp-header { display: flex; justify-content: space-between; align-items: baseline; gap: 6pt; }
    .exp-title { font-weight: 700; font-size: 10.5pt; }
    .exp-date { font-size: 9.5pt; white-space: nowrap; flex-shrink: 0; }
    .exp-company { font-style: italic; font-size: 9.5pt; }
    .exp-location { font-size: 9.5pt; color: #333; }
    ul { padding-left: 14pt; margin-top: 2pt; }
    li { margin-bottom: 1.5pt; font-size: 10.5pt; line-height: 1.35; }
    .edu-block { margin-top: 3pt; }
    .edu-header { display: flex; justify-content: space-between; align-items: baseline; }
    .edu-name { font-weight: 700; font-size: 10.5pt; }
    .edu-date { font-size: 9.5pt; }
    .edu-degree { font-style: italic; font-size: 9.5pt; }
    .award-row { margin-bottom: 2pt; font-size: 10.5pt; line-height: 1.35; }
    .save-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 9999; display: flex; align-items: center; justify-content: space-between; padding: 10px 20px; background: #0f6b5c; color: #fff; font-family: system-ui, sans-serif; font-size: 13px; }
    .save-bar button { padding: 8px 20px; background: #fff; color: #0f6b5c; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; }
    .save-bar button:hover { background: #e8f4f2; }
    .content { margin-top: 48px; }
    @media print { .content { margin-top: 0; } }
  </style>
</head>
<body>
  <div class="save-bar no-print">
    <span>Prawal Sharma — ATS Resume &nbsp;&middot;&nbsp; Save as PDF to download</span>
    <button onclick="window.print()">&#8595; Save as PDF</button>
  </div>
  <div class="content">
    <h1>${profile.name}</h1>
    <p class="contact-line">${profile.location} &nbsp;|&nbsp; ${directContact.phone} &nbsp;|&nbsp; ${directContact.email} &nbsp;|&nbsp; linkedin.com/in/sharma-prawal</p>
    <h2>Summary</h2>
    <p class="summary">${profile.atsSummary}</p>
    <h2>Technical Skills</h2>
    ${skillsHTML}
    <h2>Experience</h2>
    ${successiveHTML}
    ${earlierHTML}
    <h2>Education</h2>
    <div class="edu-block">
      <div class="edu-header">
        <span class="edu-name">${profile.education.school}</span>
        <span class="edu-date">${profile.education.period}</span>
      </div>
      <div class="edu-degree">${profile.education.degree}</div>
    </div>
    <h2>Awards &amp; Recognition</h2>
    ${awardHTML}
  </div>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) {
    alert("Please allow pop-ups for this site to generate the resume.");
    return;
  }
  win.document.write(html);
  win.document.close();
  win.addEventListener("load", () => { win.focus(); win.print(); });
}

export function ATSResumeDownloadButton() {
  return (
    <Button asChild variant="secondary" className="secondary-link download-link ats-download-link">
      <button onClick={generateATSResume}>
        <DocMark size={18} />
        <span>Download CV</span>
      </button>
    </Button>
  );
}

export function generateExecutiveProfile() {
  const directContact = getDirectContact();
  const successive = profile.experience[0];
  const currentRole = successive.roles[0];
  const leadRole = successive.roles[1];

  const metricsHTML = profile.executiveSnapshot
    .map((m) => `
      <div class="metric-cell">
        <div class="metric-value">${m.value}</div>
        <div class="metric-label">${m.label}</div>
        <div class="metric-detail">${m.detail}</div>
      </div>`)
    .join("");

  const impactHTML = profile.impactHighlights
    .map((h) => `
      <div class="impact-row">
        <div class="impact-metric">${h.metric}</div>
        <div>
          <div class="impact-title">${h.title}</div>
          <div class="impact-detail">${h.detail}</div>
        </div>
      </div>`)
    .join("");

  const notesHTML = profile.leadershipNotes
    .map((n) => `
      <div class="note-row">
        <div class="note-topic">${n.topic}</div>
        <div class="note-text">${n.note}</div>
      </div>`)
    .join("");

  const frameworkHTML = profile.signatureFramework.pillars
    .map((p) => `
      <div class="framework-cell">
        <div class="framework-num">${p.label}</div>
        <div class="framework-title">${p.title}</div>
        <div class="framework-detail">${p.detail}</div>
      </div>`)
    .join("");

  const currentBullets = currentRole.details.map((d) => `<li>${d}</li>`).join("");
  const leadBullets = leadRole.details.map((d) => `<li>${d}</li>`).join("");

  const awardsHTML = profile.awards
    .slice(0, 6)
    .map((a) => `
      <div class="award-row">
        <div class="award-date">${a.date}</div>
        <div>
          <div class="award-title">${a.title}</div>
          <div class="award-desc">${a.description}</div>
        </div>
      </div>`)
    .join("");

  const recsHTML = profile.recommendations
    .slice(0, 4)
    .map((r) => `
      <div class="rec-card">
        <div class="rec-quote">&ldquo;${r.quote}&rdquo;</div>
        <div class="rec-name">${r.name}</div>
        <div class="rec-role">${r.role}</div>
      </div>`)
    .join("");

  const keyCerts = [
    ...profile.certifications[0].items.slice(0, 5),
    ...profile.certifications[2].items.slice(0, 3),
    "Graph Developer – Professional (Apollo GraphQL)"
  ].map((c) => `<li>${c}</li>`).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${profile.name} — Executive Profile</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'EB Garamond', Georgia, serif; font-size: 10.5pt; line-height: 1.45; color: #1a1714; background: #fff; padding: 0.55in 0.65in; }
    @media print { body { padding: 0; } @page { margin: 0.55in 0.65in; size: letter; } .no-print { display: none !important; } }

    /* Header */
    .doc-header { display: grid; grid-template-columns: 1fr auto; gap: 16pt; align-items: end; padding-bottom: 10pt; border-bottom: 1.5pt solid #0f6b5c; margin-bottom: 14pt; }
    h1 { font-family: 'EB Garamond', serif; font-size: 24pt; font-weight: 700; color: #0f6b5c; letter-spacing: -0.01em; line-height: 1; }
    .doc-role { font-family: 'Inter', sans-serif; font-size: 9pt; font-weight: 600; color: #4a4540; letter-spacing: 0.06em; text-transform: uppercase; margin-top: 4pt; }
    .doc-contact { font-family: 'Inter', sans-serif; font-size: 8.5pt; color: #4a4540; text-align: right; line-height: 1.7; }
    .doc-contact a { color: #0f6b5c; text-decoration: none; }

    /* Section headings */
    h2 { font-family: 'Inter', sans-serif; font-size: 7.5pt; font-weight: 600; letter-spacing: 0.10em; text-transform: uppercase; color: #0f6b5c; border-bottom: 0.5pt solid rgba(15,107,92,0.3); padding-bottom: 2pt; margin: 13pt 0 6pt; }

    /* Summary */
    p.summary { font-size: 10.5pt; line-height: 1.52; text-align: justify; color: #1a1714; }
    p.focus { font-size: 9.5pt; color: #4a4540; margin-top: 5pt; line-height: 1.45; font-style: italic; }

    /* Metrics */
    .metric-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7pt; margin: 4pt 0; }
    .metric-cell { border: 0.5pt solid rgba(15,107,92,0.22); border-top: 1.5pt solid #0f6b5c; border-radius: 2pt; padding: 6pt 9pt; }
    .metric-value { font-family: 'EB Garamond', serif; font-size: 15pt; font-weight: 700; color: #0f6b5c; line-height: 1; }
    .metric-label { font-family: 'Inter', sans-serif; font-size: 7pt; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; color: #7a7068; margin: 2pt 0 3pt; }
    .metric-detail { font-size: 8.5pt; color: #4a4540; line-height: 1.35; }

    /* Impact */
    .impact-row { display: flex; gap: 10pt; margin-bottom: 6pt; align-items: flex-start; }
    .impact-metric { font-family: 'EB Garamond', serif; font-size: 13pt; font-weight: 700; color: #c9972f; min-width: 52pt; line-height: 1; padding-top: 1pt; }
    .impact-title { font-weight: 600; font-size: 10.5pt; }
    .impact-detail { font-size: 9.5pt; color: #4a4540; line-height: 1.38; margin-top: 1.5pt; }

    /* Two-column layout */
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14pt; }

    /* Leadership notes */
    .note-row { display: flex; gap: 8pt; margin-bottom: 5pt; align-items: flex-start; }
    .note-topic { font-family: 'Inter', sans-serif; font-size: 7.5pt; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #0f6b5c; min-width: 72pt; padding-top: 2pt; }
    .note-text { font-size: 10pt; color: #1a1714; line-height: 1.42; font-style: italic; }

    /* Framework */
    .framework-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7pt; margin: 4pt 0; }
    .framework-cell { border-left: 2pt solid #c9972f; padding: 5pt 9pt; background: rgba(201,151,47,0.04); }
    .framework-num { font-family: 'Inter', sans-serif; font-size: 7pt; font-weight: 700; color: #c9972f; letter-spacing: 0.08em; }
    .framework-title { font-weight: 700; font-size: 10.5pt; margin: 1.5pt 0 2pt; }
    .framework-detail { font-size: 9pt; color: #4a4540; line-height: 1.35; }

    /* Experience */
    .exp-block { margin-bottom: 7pt; }
    .exp-row { display: flex; justify-content: space-between; align-items: baseline; gap: 8pt; }
    .exp-title { font-weight: 700; font-size: 10.5pt; }
    .exp-date { font-family: 'Inter', sans-serif; font-size: 8.5pt; color: #7a7068; white-space: nowrap; flex-shrink: 0; }
    .exp-co { font-family: 'Inter', sans-serif; font-style: normal; font-size: 8.5pt; color: #4a4540; }
    .exp-loc { font-family: 'Inter', sans-serif; font-size: 8.5pt; color: #7a7068; }
    ul { padding-left: 12pt; margin-top: 3pt; }
    li { font-size: 10pt; line-height: 1.38; margin-bottom: 1.5pt; }

    /* Awards */
    .award-row { display: flex; gap: 9pt; margin-bottom: 5pt; align-items: flex-start; }
    .award-date { font-family: 'Inter', sans-serif; font-size: 8pt; color: #c9972f; font-weight: 600; min-width: 54pt; padding-top: 1pt; }
    .award-title { font-weight: 700; font-size: 10.5pt; }
    .award-desc { font-size: 9pt; color: #4a4540; line-height: 1.35; margin-top: 1pt; }

    /* Recommendations */
    .rec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7pt; margin: 4pt 0; }
    .rec-card { border: 0.5pt solid rgba(15,107,92,0.18); border-radius: 2pt; padding: 7pt 9pt; }
    .rec-quote { font-style: italic; font-size: 9.5pt; line-height: 1.42; color: #1a1714; }
    .rec-name { font-family: 'Inter', sans-serif; font-weight: 600; font-size: 8.5pt; margin-top: 5pt; color: #1a1714; }
    .rec-role { font-family: 'Inter', sans-serif; font-size: 8pt; color: #7a7068; }

    /* Certs & edu */
    .cert-list { columns: 2; column-gap: 14pt; }
    .cert-list li { font-size: 9.5pt; break-inside: avoid; margin-bottom: 1.5pt; }
    .edu-row { display: flex; justify-content: space-between; align-items: baseline; gap: 8pt; }
    .edu-name { font-weight: 700; font-size: 10.5pt; }
    .edu-date { font-family: 'Inter', sans-serif; font-size: 8.5pt; color: #7a7068; }
    .edu-degree { font-family: 'Inter', sans-serif; font-size: 9pt; color: #4a4540; margin-top: 2pt; }

    /* Save bar */
    .save-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 9999; display: flex; align-items: center; justify-content: space-between; padding: 9px 20px; background: #0f6b5c; color: #fff; font-family: 'Inter', system-ui, sans-serif; font-size: 12px; gap: 12px; }
    .save-bar-info { font-size: 11px; opacity: 0.82; }
    .save-bar button { padding: 7px 18px; background: #fff; color: #0f6b5c; border: none; border-radius: 5px; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; }
    .save-bar button:hover { background: #e8f4f2; }
    .content { margin-top: 52px; }
    @media print { .content { margin-top: 0; } }

    /* Page break hint */
    .page-break { page-break-before: always; }
  </style>
</head>
<body>
  <div class="save-bar no-print">
    <div>
      <strong>${profile.name} — Executive Profile</strong>
      <span class="save-bar-info">&nbsp;&middot;&nbsp; Use &ldquo;Save as PDF&rdquo; with no margins for best results</span>
    </div>
    <button onclick="window.print()">&#8595; Save as PDF</button>
  </div>
  <div class="content">

    <!-- Header -->
    <div class="doc-header">
      <div>
        <h1>${profile.name}</h1>
        <div class="doc-role">${currentRole.title} &nbsp;&middot;&nbsp; ${successive.company} &nbsp;&middot;&nbsp; ${successive.location}</div>
      </div>
      <div class="doc-contact">
        ${profile.location}<br/>
        ${directContact.phone}<br/>
        ${directContact.email}<br/>
        linkedin.com/in/sharma-prawal
      </div>
    </div>

    <!-- Executive Brief -->
    <h2>Executive Brief</h2>
    <p class="summary">${profile.atsSummary}</p>
    <p class="focus">${profile.focus}</p>

    <!-- Impact Metrics -->
    <h2>Impact at a Glance</h2>
    <div class="metric-grid">${metricsHTML}</div>

    <!-- Impact Highlights -->
    <h2>Delivery Highlights</h2>
    ${impactHTML}

    <!-- Leadership Philosophy + Signature Framework side by side -->
    <div class="two-col">
      <div>
        <h2>Leadership Philosophy</h2>
        ${notesHTML}
      </div>
      <div>
        <h2>${profile.signatureFramework.title}</h2>
        <div style="font-size:8.5pt;color:#4a4540;margin-bottom:5pt;font-style:italic;">${profile.signatureFramework.subtitle}</div>
        <div class="framework-grid">${frameworkHTML}</div>
      </div>
    </div>

    <!-- Career Arc -->
    <div class="page-break"></div>
    <h2>Career Arc — ${successive.company} (${successive.duration})</h2>
    <div class="exp-block">
      <div class="exp-row">
        <span class="exp-title">${currentRole.title}</span>
        <span class="exp-date">${currentRole.period}</span>
      </div>
      <div class="exp-row">
        <span class="exp-co">${successive.company}</span>
        <span class="exp-loc">${successive.location}, India</span>
      </div>
      <ul>${currentBullets}</ul>
    </div>
    <div class="exp-block">
      <div class="exp-row">
        <span class="exp-title">${leadRole.title}</span>
        <span class="exp-date">${leadRole.period}</span>
      </div>
      <div class="exp-row">
        <span class="exp-co">${successive.company}</span>
        <span class="exp-loc">${successive.location}, India</span>
      </div>
      <ul>${leadBullets}</ul>
    </div>

    <!-- Awards + Recommendations side by side -->
    <div class="two-col">
      <div>
        <h2>Awards &amp; Recognition</h2>
        ${awardsHTML}
      </div>
      <div>
        <h2>Stakeholder Voice</h2>
        <div class="rec-grid">${recsHTML}</div>
      </div>
    </div>

    <!-- Certifications + Education -->
    <h2>Certifications</h2>
    <ul class="cert-list">${keyCerts}</ul>

    <h2>Education</h2>
    <div class="edu-row">
      <span class="edu-name">${profile.education.school}</span>
      <span class="edu-date">${profile.education.period}</span>
    </div>
    <div class="edu-degree">${profile.education.degree} &nbsp;&middot;&nbsp; ${profile.education.score}</div>

  </div>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) {
    alert("Please allow pop-ups for this site to generate the executive profile.");
    return;
  }
  win.document.write(html);
  win.document.close();
  win.addEventListener("load", () => { win.focus(); win.print(); });
}

export function ExecutiveProfileDownloadButton({ variant = "secondary" }) {
  const isPrimary = variant === "primary";
  return (
    <Button asChild variant={variant} className={isPrimary ? "primary-link download-link" : "secondary-link download-link"}>
      <button onClick={generateExecutiveProfile}>
        <DownloadMark size={18} />
        <span>Download executive profile</span>
      </button>
    </Button>
  );
}
