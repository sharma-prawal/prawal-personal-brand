import React, { createContext, useContext, useEffect, useRef, useState } from "react";
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
import { imageAlt, imageCaption, imageSrc, thumbSrc } from "../data/imageMetadata.js";
import { Button } from "./ui/button.jsx";
import OverlayDialog from "./OverlayDialog.jsx";
import { fadeUp,
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

/** Sets the browser-tab title, e.g. "Awards | Prawal Sharma". */
export function usePageTitle(title) {
  useEffect(() => {
    if (title) document.title = `${title} | Prawal Sharma`;
  }, [title]);
}

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

// ─── ImageCarousel ────────────────────────────────────────────────────────────

// ProofImage plays a short fade-and-settle intro when it is a priority image.
// Inside a carousel that intro belongs to the first slide only: replaying it on
// every Next would leave the frame blank while the new slide fades in.
const ImageIntroContext = createContext(true);

export function ImageCarousel({ images, renderImage, size = "default", onSlideClick }) {
  const shouldReduceMotion = useReducedMotion();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [hasNavigated, setHasNavigated] = useState(false);
  const isCompact = size === "compact";
  const rootRef = useRef(null);
  const last = images.length - 1;

  // Fetch the slides either side of the current one so Next/Previous shows a
  // ready image instead of the empty frame. It starts once the carousel is near
  // the viewport (or a visitor points at, focuses or touches it), so a page full
  // of carousels does not download every slide on load.
  const [warm, setWarm] = useState(false);
  const preloaded = useRef(new Map());
  const preload = (index) => {
    const src = imageSrc(images[index]);
    if (!src) return null;
    let img = preloaded.current.get(src);
    if (!img) {
      img = new Image();
      img.decoding = "async";
      img.src = src;
      preloaded.current.set(src, img);
    }
    return img;
  };
  useEffect(() => {
    if (warm || images.length < 2) return undefined;
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) setWarm(true);
    }, { rootMargin: "300px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [warm, images.length]);
  useEffect(() => {
    if (!warm || images.length < 2) return;
    preload(activeImageIndex === last ? 0 : activeImageIndex + 1);
    preload(activeImageIndex === 0 ? last : activeImageIndex - 1);
    // preload only reads images, which is covered by last/images below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warm, activeImageIndex, images, last]);
  const warmUp = () => { if (!warm) setWarm(true); };

  // Switch slides only once the next image is decoded (or after a short cap on
  // a slow connection), so the outgoing photo stays up instead of an empty frame.
  // targetIndex tracks the latest request, so quick repeated clicks still step.
  const targetIndex = useRef(0);
  const goTo = (index) => {
    targetIndex.current = index;
    const show = () => {
      if (targetIndex.current !== index) return;
      setActiveImageIndex(index);
      setHasNavigated(true);
    };
    const img = preload(index);
    if (!img || typeof img.decode !== "function") {
      show();
      return;
    }
    Promise.race([
      img.decode().catch(() => {}),
      new Promise((resolve) => { setTimeout(resolve, 450); })
    ]).then(show);
  };
  const step = (delta) => {
    const from = Math.min(targetIndex.current, last);
    goTo(delta > 0 ? (from === last ? 0 : from + 1) : (from === 0 ? last : from - 1));
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    step(-1);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    step(1);
  };

  // Touch swipe: a horizontal drag of 40px or more changes the image.
  const swipeStart = useRef(null);
  const swiped = useRef(false);
  const handlePointerDown = (e) => {
    swiped.current = false;
    swipeStart.current = e.pointerType === "mouse" ? null : { x: e.clientX, y: e.clientY };
  };
  const handlePointerUp = (e) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start || images.length < 2) return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(e.clientY - start.y)) return;
    swiped.current = true;
    step(dx < 0 ? 1 : -1);
  };

  // A click anywhere on the slide opens the image's own zoom button. Ignore clicks
  // that come from the open viewer (rendered in a portal but bubbling through
  // React), clicks on the zoom button itself, and the click that ends a swipe.
  const handleSlideClick = (e) => {
    if (!onSlideClick) return;
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    if (!e.currentTarget.contains(e.target) || e.target.closest(".proof-image-button")) return;
    onSlideClick(e);
  };

  return (
    <div
      ref={rootRef}
      className={`image-carousel${isCompact ? " image-carousel--compact" : ""}`}
      onPointerEnter={warmUp}
      onPointerDown={warmUp}
      onFocus={warmUp}
    >
      <div
        className={`image-carousel__slide-area${onSlideClick ? " image-carousel__slide-area--zoomable" : ""}`}
        onClick={handleSlideClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {/* Slides share one grid cell: the outgoing slide stays mounted and
            opaque underneath while the incoming one fades in over it. */}
        <ImageIntroContext.Provider value={!hasNavigated}>
          <AnimatePresence initial={false}>
            <motion.div
              key={activeImageIndex}
              className="image-carousel__slide"
              style={{ zIndex: 1 }}
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : { zIndex: 0, opacity: 0, transition: { zIndex: { duration: 0 }, opacity: { delay: 0.3, duration: 0 } } }
              }
              transition={{ duration: 0.3, ease: premiumEase }}
            >
              {renderImage(images[activeImageIndex], activeImageIndex)}
            </motion.div>
          </AnimatePresence>
        </ImageIntroContext.Provider>
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
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 }
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
      whileTap={shouldReduceMotion ? undefined : tapPress}
      {...props}
    >
      {children}
    </motion.article>
  );
}

export function Magnetic({ children, strength = 10 }) {
  const shouldReduceMotion = useReducedMotion();
  // Read after mount: the pre-rendered HTML has no pointer, so the first
  // render must match it.
  const [hasFinePointer, setHasFinePointer] = useState(false);
  useEffect(() => {
    setHasFinePointer(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);
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

// `thumb` shows a small WebP copy in the frame (for thumbnail-sized slots);
// the lightbox always opens the original.
export function ProofImage({ src, alt, caption, priority = false, eager = false, zoomable = true, width = 800, height = 600, thumb = false }) {
  const shouldReduceMotion = useReducedMotion();
  const introAllowed = useContext(ImageIntroContext);
  const playIntro = priority && !shouldReduceMotion && introAllowed;
  const [isZoomed, setIsZoomed] = useState(false);
  const zoomTrigger = useRef(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [thumbFailed, setThumbFailed] = useState(false);
  const displaySrc = thumb && !thumbFailed ? thumbSrc(src) : src;
  const onImageError = displaySrc !== src ? () => setThumbFailed(true) : undefined;
  const frameStyle = { "--proof-image": `url("${displaySrc.replaceAll("\"", "\\\"")}")` };
  const zoomImageStyle =
    zoomScale === 1
      ? { width: "auto", maxWidth: "100%", maxHeight: "calc(100dvh - 194px)" }
      : { width: `${Math.round(zoomScale * 100)}%`, maxWidth: "none", maxHeight: "none" };
  const pageTheme = typeof document !== "undefined" ? document.querySelector("[data-theme]")?.dataset.theme : undefined;
  const lightbox = zoomable && isZoomed && createPortal(
    <OverlayDialog
      className="image-lightbox proof-modal"
      label={alt}
      returnFocusRef={zoomTrigger}
      onDismiss={() => setIsZoomed(false)}
    >
      <div className="image-lightbox__panel" data-theme={pageTheme}>
        <button className="image-lightbox__close" type="button" aria-label="Close zoomed image" data-dialog-initial-focus onClick={() => setIsZoomed(false)}>
          <X size={18} />
        </button>
        <div className="image-lightbox__toolbar">
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
      </div>
    </OverlayDialog>,
    document.body
  );

  return (
    <>
      <motion.span
        className="proof-image-frame"
        style={frameStyle}
        initial={playIntro ? { opacity: 0, scale: 1.025 } : false}
        animate={playIntro ? { opacity: 1, scale: 1 } : undefined}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.82, ease: premiumEase }}
      >
        {zoomable ? (
          <button
            ref={zoomTrigger}
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
              src={displaySrc}
              onError={onImageError}
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
            src={displaySrc}
            onError={onImageError}
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

/** Keeps numeric ranges such as "1–2 days" or "20–30%" on one line. */
export function KeepRanges({ text }) {
  if (typeof text !== "string") return text;
  const parts = text.split(/(\d[\d.,+]*\s?[–-]\s?\d[\d.,+%]*(?:\s(?:days?|years?|weeks?))?)/);
  return parts.map((part, index) => (index % 2 ? <span className="nowrap" key={index}>{part}</span> : part));
}

export function PageFrame({ eyebrow, title, intro, children, className = "", heroAside = null }) {
  const { hash, key } = useLocation();
  // The title animates in when you move between pages, but not on the first
  // load (React Router's initial location key is "default"), where the fade
  // only delayed the first readable text.
  const [animateIn] = useState(() => key !== "default");
  const heroClassName = ["page-hero", className].filter(Boolean).join(" ");

  useEffect(() => {
    if (!hash) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  return (
    <>
      <motion.section className={heroClassName} initial={animateIn ? "hidden" : false} animate="visible" variants={stagger}>
        <motion.div className="page-hero__inner" variants={fadeUp} transition={{ duration: 0.72, ease: premiumEase }}>
          <div className="page-hero__copy">
            {eyebrow && <motion.span className="eyebrow" variants={itemReveal}>{eyebrow}</motion.span>}
            <motion.h1 variants={fadeUp} transition={{ duration: 0.82, ease: premiumEase, delay: 0.02 }}>{title}</motion.h1>
            {intro && <motion.p variants={itemReveal}>{intro}</motion.p>}
          </div>
          {heroAside}
        </motion.div>
      </motion.section>
      {children}
    </>
  );
}

export function RecoveryPage({ title = "Case study not found", description = "Browse Projects to find the case study you were looking for.", to = "/ai-projects", label = "Back to Projects" }) {
  return (
    <section className="recovery-page">
      <h1>{title}</h1>
      <p>{description}</p>
      <Link className="primary-link" to={to}>
        <ChevronLeft size={16} aria-hidden="true" />
        {label}
      </Link>
    </section>
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

  return button;
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

/** The downloadable resume. It is generated in the prawal-the-series project (`npm run resume`) and copied here. */
export const RESUME_PDF = "/Prawal_Sharma_Resume.pdf";

export function downloadResume() {
  const link = document.createElement("a");
  link.href = RESUME_PDF;
  link.download = "Prawal_Sharma_Resume.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function ResumeDownloadButton() {
  return (
    <Button asChild variant="secondary" className="secondary-link download-link ats-download-link">
      <a href={RESUME_PDF} download="Prawal_Sharma_Resume.pdf">
        <DocMark size={18} />
        <span>Download CV</span>
      </a>
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
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Newsreader', Georgia, serif; font-size: 10.5pt; line-height: 1.45; color: #17150f; background: #fff; padding: 0.55in 0.65in; }
    @media print { body { padding: 0; } @page { margin: 0.55in 0.65in; size: letter; } .no-print { display: none !important; } }

    /* Header */
    .doc-header { display: grid; grid-template-columns: 1fr auto; gap: 16pt; align-items: end; padding-bottom: 10pt; border-bottom: 1.5pt solid #1a6c5a; margin-bottom: 14pt; }
    h1 { font-family: 'Newsreader', Georgia, serif; font-size: 24pt; font-weight: 500; color: #1a6c5a; letter-spacing: -0.01em; line-height: 1; }
    .doc-role { font-family: 'IBM Plex Sans', system-ui, sans-serif; font-size: 9pt; font-weight: 600; color: #4a463f; letter-spacing: 0; margin-top: 4pt; }
    .doc-contact { font-family: 'IBM Plex Sans', system-ui, sans-serif; font-size: 8.5pt; color: #4a463f; text-align: right; line-height: 1.7; }
    .doc-contact a { color: #1a6c5a; text-decoration: none; }

    /* Section headings */
    h2 { font-family: 'IBM Plex Sans', system-ui, sans-serif; font-size: 10pt; font-weight: 600; letter-spacing: 0; color: #1a6c5a; border-bottom: 0.5pt solid rgba(15,107,92,0.3); padding-bottom: 2pt; margin: 13pt 0 6pt; }

    /* Summary */
    p.summary { font-size: 10.5pt; line-height: 1.52; text-align: justify; color: #17150f; }
    p.focus { font-size: 9.5pt; color: #4a463f; margin-top: 5pt; line-height: 1.45; font-style: italic; }

    /* Metrics */
    .metric-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7pt; margin: 4pt 0; }
    .metric-cell { border: 0.5pt solid rgba(26,108,90,0.22); border-top: 1.5pt solid #1a6c5a; border-radius: 2pt; padding: 6pt 9pt; }
    .metric-value { font-family: 'Newsreader', Georgia, serif; font-size: 15pt; font-weight: 500; color: #1a6c5a; line-height: 1; }
    .metric-label { font-family: 'IBM Plex Sans', system-ui, sans-serif; font-size: 7pt; font-weight: 600; letter-spacing: 0; color: #736d63; margin: 2pt 0 3pt; }
    .metric-detail { font-size: 8.5pt; color: #4a463f; line-height: 1.35; }

    /* Impact */
    .impact-row { display: flex; gap: 10pt; margin-bottom: 6pt; align-items: flex-start; }
    .impact-metric { font-family: 'Newsreader', Georgia, serif; font-size: 13pt; font-weight: 500; color: #1a6c5a; min-width: 52pt; line-height: 1; padding-top: 1pt; }
    .impact-title { font-weight: 600; font-size: 10.5pt; }
    .impact-detail { font-size: 9.5pt; color: #4a463f; line-height: 1.38; margin-top: 1.5pt; }

    /* Two-column layout */
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14pt; }

    /* Leadership notes */
    .note-row { display: flex; gap: 8pt; margin-bottom: 5pt; align-items: flex-start; }
    .note-topic { font-family: 'IBM Plex Sans', system-ui, sans-serif; font-size: 7.5pt; font-weight: 600; letter-spacing: 0; color: #1a6c5a; min-width: 72pt; padding-top: 2pt; }
    .note-text { font-size: 10pt; color: #17150f; line-height: 1.42; font-style: italic; }

    /* Framework */
    .framework-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7pt; margin: 4pt 0; }
    .framework-cell { border-left: 2pt solid #1a6c5a; padding: 5pt 9pt; background: rgba(26,108,90,0.05); }
    .framework-num { font-family: 'IBM Plex Sans', system-ui, sans-serif; font-size: 7pt; font-weight: 700; color: #1a6c5a; letter-spacing: 0.08em; }
    .framework-title { font-weight: 700; font-size: 10.5pt; margin: 1.5pt 0 2pt; }
    .framework-detail { font-size: 9pt; color: #4a463f; line-height: 1.35; }

    /* Experience */
    .exp-block { margin-bottom: 7pt; }
    .exp-row { display: flex; justify-content: space-between; align-items: baseline; gap: 8pt; }
    .exp-title { font-weight: 700; font-size: 10.5pt; }
    .exp-date { font-family: 'IBM Plex Sans', system-ui, sans-serif; font-size: 8.5pt; color: #736d63; white-space: nowrap; flex-shrink: 0; }
    .exp-co { font-family: 'IBM Plex Sans', system-ui, sans-serif; font-style: normal; font-size: 8.5pt; color: #4a463f; }
    .exp-loc { font-family: 'IBM Plex Sans', system-ui, sans-serif; font-size: 8.5pt; color: #736d63; }
    ul { padding-left: 12pt; margin-top: 3pt; }
    li { font-size: 10pt; line-height: 1.38; margin-bottom: 1.5pt; }

    /* Awards */
    .award-row { display: flex; gap: 9pt; margin-bottom: 5pt; align-items: flex-start; }
    .award-date { font-family: 'IBM Plex Sans', system-ui, sans-serif; font-size: 8pt; color: #1a6c5a; font-weight: 600; min-width: 54pt; padding-top: 1pt; }
    .award-title { font-weight: 700; font-size: 10.5pt; }
    .award-desc { font-size: 9pt; color: #4a463f; line-height: 1.35; margin-top: 1pt; }

    /* Recommendations */
    .rec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7pt; margin: 4pt 0; }
    .rec-card { border: 0.5pt solid rgba(15,107,92,0.18); border-radius: 2pt; padding: 7pt 9pt; }
    .rec-quote { font-style: italic; font-size: 9.5pt; line-height: 1.42; color: #17150f; }
    .rec-name { font-family: 'IBM Plex Sans', system-ui, sans-serif; font-weight: 600; font-size: 8.5pt; margin-top: 5pt; color: #17150f; }
    .rec-role { font-family: 'IBM Plex Sans', system-ui, sans-serif; font-size: 8pt; color: #736d63; }

    /* Certs & edu */
    .cert-list { columns: 2; column-gap: 14pt; }
    .cert-list li { font-size: 9.5pt; break-inside: avoid; margin-bottom: 1.5pt; }
    .edu-row { display: flex; justify-content: space-between; align-items: baseline; gap: 8pt; }
    .edu-name { font-weight: 700; font-size: 10.5pt; }
    .edu-date { font-family: 'IBM Plex Sans', system-ui, sans-serif; font-size: 8.5pt; color: #736d63; }
    .edu-degree { font-family: 'IBM Plex Sans', system-ui, sans-serif; font-size: 9pt; color: #4a463f; margin-top: 2pt; }

    /* Save bar */
    .save-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 9999; display: flex; align-items: center; justify-content: space-between; padding: 9px 20px; background: #1a6c5a; color: #fff; font-family: 'IBM Plex Sans', system-ui, sans-serif; font-size: 12px; gap: 12px; }
    .save-bar-info { font-size: 11px; opacity: 0.82; }
    .save-bar button { padding: 7px 18px; background: #fff; color: #1a6c5a; border: none; border-radius: 5px; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; }
    .save-bar button:hover { background: #eef4f1; }
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
        <div style="font-size:8.5pt;color:#4a463f;margin-bottom:5pt;font-style:italic;">${profile.signatureFramework.subtitle}</div>
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
      <a href="/prawal-sharma-executive-profile.pdf" download>
        <DownloadMark size={18} />
        <span>Download executive profile</span>
      </a>
    </Button>
  );
}
