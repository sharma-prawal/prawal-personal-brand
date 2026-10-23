import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { CheckCircleMark, DownloadMark, DocMark } from "../components/icons.jsx";
import { Button } from "../components/ui/button.jsx";
import {
  ResumeDownloadButton,
  ExecutiveProfileDownloadButton,
  LinkedInButton,
  MotionCard,
  MotionGroup,
  MotionRouterLink,
  ProofImage,
  Reveal,
  SectionHeader,
  getPillarIcon,
  handleCardMouseMove
} from "../components/shared.jsx";
import { profile } from "../data/profile.js";
import { profilePortrait } from "../data/mediaAssets.js";
import { executivePrinciples } from "../data/showcase.js";
import { fadeUp, heroWord, heroWordContainer, itemReveal, premiumEase, rowReveal, scaleReveal, slideLeft, slideRight, splitStagger, tapPress, viewportReveal } from "../lib/motion.js";

// Helper to format metric display strings by wrapping symbols for precise CSS spacing
function formatDisplay(str) {
  if (typeof str !== "string") return str;
  const parts = str.split(/([\+\-%K])/);
  return parts.map((part, index) => {
    if (part === "+") {
      return <span key={index} className="metric-symbol metric-symbol--plus">+</span>;
    } else if (part === "-") {
      return <span key={index} className="metric-symbol metric-symbol--dash">-</span>;
    } else if (part === "%") {
      return <span key={index} className="metric-symbol metric-symbol--percent">%</span>;
    } else if (part === "K") {
      return <span key={index} className="metric-suffix">K</span>;
    }
    return part;
  });
}

// Count-up animation for numeric stat values
function CountUp({ value }) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState(shouldReduceMotion ? value : "0");

  useEffect(() => {
    if (!inView || shouldReduceMotion) { setDisplay(value); return; }
    // Parse leading number and trailing suffix
    const match = value.match(/^(\d+(?:\.\d+)?)(.*)/);
    if (!match) { setDisplay(value); return; }
    const target = parseFloat(match[1]);
    const suffix = match[2];
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v) + suffix)
    });
    return () => controls.stop();
  }, [inView, value, shouldReduceMotion]);

  return <span ref={ref}>{formatDisplay(display)}</span>;
}

// Word-by-word clip-path reveal for the hero headline
function HeroHeadlineReveal({ text }) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");
  if (shouldReduceMotion) return <h1>{text}</h1>;
  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      variants={heroWordContainer}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={i} className="hero-word-wrap" aria-hidden="true">
          <motion.span className="hero-word" variants={heroWord}>{word}</motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </motion.h1>
  );
}

function ExecutiveSnapshot() {
  const metrics = profile.executiveSnapshot.slice(0, 4);

  return (
    <Reveal className="executive-snapshot-container">
      <div
        className="executive-snapshot"
        aria-label="Executive career snapshot"
      >
        <motion.div className="executive-snapshot__lead" variants={fadeUp} transition={{ duration: 0.72, ease: premiumEase }}>
          <span className="eyebrow">Executive snapshot</span>
          <h2>Executive summary, in four signals.</h2>
          <p>Four signals define the record: tenure, scale, AI-enabled productivity, and cloud credibility — each backed by dedicated proof.</p>
        </motion.div>
        <div className="executive-snapshot__grid">
          {metrics.map((point) => (
            <motion.article
              className="executive-snapshot__metric glass-card spotlight-card"
              variants={itemReveal}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.42, ease: premiumEase }}
              onMouseMove={handleCardMouseMove}
              key={point.label}
            >
              <strong><CountUp value={point.value} /></strong>
              <span>{point.label}</span>
              <p>{point.detail}</p>
            </motion.article>
          ))}
        </div>
        <div className="executive-snapshot__supporting-line">
          <span>Supporting proof</span>
          <p>US / UK / South Africa stakeholder exposure, 10 awards, and a dedicated proof archive across projects, recommendations, certifications, conferences, and highlights.</p>
        </div>
      </div>
    </Reveal>
  );
}


function SignatureFramework() {
  const framework = profile.signatureFramework;
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className="signature-framework chapter-band chapter-band--quiet"
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={viewportReveal}
      variants={shouldReduceMotion ? undefined : splitStagger}
    >
      <motion.div
        className="signature-framework__copy"
        variants={shouldReduceMotion ? undefined : slideLeft}
        transition={{ duration: 0.72, ease: premiumEase }}
      >
        <span className="eyebrow">Signature asset</span>
        <h2>{framework.title}</h2>
        <p>{framework.subtitle}</p>
        <div className="signature-framework__meta" aria-label="Framework coverage">
          <span>AI adoption</span>
          <span>Engineering judgment</span>
          <span>Delivery discipline</span>
        </div>
        <div className="signature-framework__actions">
          <Button asChild className="primary-link">
            <a href={framework.downloadHref} download>
              <DownloadMark size={18} />
              <span>Download framework</span>
            </a>
          </Button>
          <Button asChild variant="secondary" className="secondary-link">
            <a href={framework.fallbackHref} target="_blank" rel="noreferrer">
              <DocMark size={18} />
              <span>View artifact</span>
            </a>
          </Button>
        </div>
      </motion.div>
      <motion.div
        className="framework-diagram"
        aria-label={`${framework.title} diagram`}
        variants={shouldReduceMotion ? undefined : slideRight}
        transition={{ duration: 0.72, ease: premiumEase }}
      >
        {framework.pillars.map((pillar) => (
          <article
            className="framework-node glass-card spotlight-card"
            key={pillar.title}
            onMouseMove={handleCardMouseMove}
          >
            <div className="framework-node__index">
              <span className="card-icon-container">{getPillarIcon(pillar.label)}</span>
              <strong>{pillar.label}</strong>
            </div>
            <div>
              <h3>{pillar.title}</h3>
              <p>{pillar.detail}</p>
            </div>
          </article>
        ))}
      </motion.div>
    </motion.section>
  );
}

function EvidenceIndexItem({ to, title, text, index }) {
  return (
    <MotionRouterLink
      className="evidence-index-item"
      to={to}
      variants={itemReveal}
      whileHover={{ x: 4 }}
      whileTap={tapPress}
      transition={{ duration: 0.22, ease: premiumEase }}
    >
      <span>{String(index).padStart(2, "0")}</span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      <ChevronRight size={17} />
    </MotionRouterLink>
  );
}

export default function ExecutivePage() {
  const shouldReduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-300, 300], [8, -8]), { stiffness: 180, damping: 24 });
  const rotateY = useSpring(useTransform(x, [-300, 300], [-8, 8]), { stiffness: 180, damping: 24 });

  const handleMouseMove = (event) => {
    if (shouldReduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const heroSignals = ["AI-enabled delivery", "Cloud architecture", "Global stakeholder execution"];
  const evidencePathways = [
    { to: "/awards", title: "Recognition", text: "Awards for ownership, contribution, longevity, and client trust." },
    { to: "/certifications", title: "Credentials", text: "Cloud, AI, engineering, data, and leadership certification depth." },
    { to: "/ai-projects", title: "Project Proof", text: "Public builds, AI-assisted systems, and NDA-safe case studies." },
    { to: "/conferences", title: "Industry Presence", text: "Conference participation, learning signals, and community exposure." },
    { to: "/highlights", title: "Career Signals", text: "Client travel, publication contribution, and professional proof moments." }
  ];

  return (
    <div data-theme="executive">
      <section className="hero-section">
        <div className="hero-copy">
          <motion.div
            className="hero-kicker"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: premiumEase, delay: 0.08 }}
          >
            <span className="status-dot" />
            <span>Based in {profile.location} | Global engineering delivery</span>
          </motion.div>
          <HeroHeadlineReveal text={profile.shortHeadline} />
          <motion.p
            className="hero-summary"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.62, ease: premiumEase, delay: 0.56 }}
          >
            {profile.summary}
          </motion.p>
          <motion.div
            className="hero-editorial-thesis"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: premiumEase, delay: 0.72 }}
            aria-label="Executive leadership thesis"
          >
            <span>Executive thesis</span>
            <p>AI-enabled teams that ship faster, break less, and don't need oversight to stay accountable — that's the operating model I build.</p>
          </motion.div>
          <motion.div
            className="hero-signal-line"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: premiumEase, delay: 0.86 }}
            aria-label="Executive credibility markers"
          >
            {heroSignals.map((signal) => (
              <span key={signal}>{signal}</span>
            ))}
          </motion.div>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: premiumEase, delay: 0.98 }}
          >
            <ExecutiveProfileDownloadButton variant="primary" />
            <LinkedInButton />
          </motion.div>
        </div>
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: premiumEase, delay: 0.2 }}
          style={{
            rotateX: shouldReduceMotion ? 0 : rotateX,
            rotateY: shouldReduceMotion ? 0 : rotateY,
            transformStyle: "preserve-3d",
            perspective: 1000
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.aside className="executive-card portrait-card" aria-label="Executive profile portrait">
            <ProofImage src={profilePortrait.src} alt={profilePortrait.alt} caption={profilePortrait.caption} priority />
            <div className="portrait-annotation" aria-hidden="true">
              <span>10 yrs</span>
              <strong>Successive Digital</strong>
            </div>
          </motion.aside>
          <div className="hero-portrait-caption" aria-label="Executive profile summary">
            <span>Engineering Leader</span>
            <strong>AI-enabled engineering, cloud systems, and global delivery leadership.</strong>
          </div>
        </motion.div>
      </section>

      <ExecutiveSnapshot />

      <Reveal as={motion.section} className="content-band impact-band chapter-band chapter-band--light">
        <SectionHeader
          eyebrow="Selected impact"
          title="Delivery record, backed by dedicated proof archives."
          intro="Every impact claim connects to a dedicated proof area: projects, awards, certifications, conferences, and recommendations — each with its own depth."
        />
        <MotionGroup className="impact-ledger">
          {profile.impactHighlights.map((item) => {
            const isTextMetric = /[a-zA-Z]/.test(item.metric);
            return (
              <MotionCard className="impact-ledger-row" revealVariant={rowReveal} key={item.title}>
                <div className={`impact-ledger-metric ${isTextMetric ? 'impact-ledger-metric--text' : ''}`}>
                  <strong>{item.metric}</strong>
                  <span>{item.label}</span>
                </div>
                <div className="impact-ledger-copy">
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              </MotionCard>
            );
          })}
        </MotionGroup>
      </Reveal>

      <div className="exec-thinking-note" aria-label="Executive thinking note">
        <p>"AI is most valuable when reducing engineering friction rather than replacing engineering judgment."</p>
      </div>

      <Reveal as={motion.section} className="content-band split-showcase operating-style-section chapter-band chapter-band--quiet chapter-band--light">
        <SectionHeader
          eyebrow="Operating style"
          title="Leadership with hands-on engineering credibility."
          intro={profile.focus}
        />
        <div className="operating-style-section__body">
          <MotionGroup className="principle-list">
            {executivePrinciples.map((item) => (
              <motion.div className="principle-item" variants={itemReveal} key={item.title}>
                <CheckCircleMark size={18} />
                <div className="principle-item__content">
                  <h4 className="principle-item__title">{item.title}</h4>
                  <p className="principle-item__detail">{item.detail}</p>
                </div>
              </motion.div>
            ))}
          </MotionGroup>
          <MotionGroup className="evidence-index" aria-label="Evidence index">
            {evidencePathways.map((item, index) => (
              <EvidenceIndexItem {...item} index={index + 1} key={item.to} />
            ))}
          </MotionGroup>
        </div>
      </Reveal>

      <SignatureFramework />

      <div className="exec-break-statement" aria-hidden="true">
        <p className="exec-break-statement__text">Ten years. Five roles. One company. No shortcuts.</p>
      </div>

      <Reveal as={motion.section} className="final-cta exec-colophon">
        <div className="final-cta__copy">
          <span className="eyebrow">Work with me</span>
          <h2>Reach out for architecture reviews, AI adoption strategy, and technology leadership engagements.</h2>
          <p>Start on LinkedIn or with a direct note below — architecture advisory, AI adoption consulting, and delivery leadership engagements welcome.</p>
        </div>
        <div className="exec-colophon__frame">
          <dl className="final-cta__signal exec-colophon__signal" aria-label="Engagement signal">
            <dt>Available for</dt>
            <dd>AI adoption</dd>
            <dd>Architecture</dd>
            <dd>Delivery</dd>
            <dd className="final-cta__signal-detail">Consulting, architecture review, delivery leadership, and practical adoption playbooks.</dd>
          </dl>
          <div className="exec-colophon__actions">
            <LinkedInButton className="exec-colophon__primary" />
            <div className="exec-colophon__secondary">
              <ExecutiveProfileDownloadButton />
              <ResumeDownloadButton />
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
