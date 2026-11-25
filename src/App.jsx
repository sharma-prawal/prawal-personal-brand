import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Check, ChevronDown, ChevronLeft, ChevronRight, Copy, Linkedin, Menu, X } from "lucide-react";
import { LinkedInButton, ScrollToTop, downloadResume, generateExecutiveProfile } from "./components/shared.jsx";
import { getDirectContact, profile } from "./data/profile.js";
import { pageEntrance, exitEase, premiumEase } from "./lib/motion.js";

const LazyAIBrandChatbot = lazy(() => import("./components/AIBrandChatbot.jsx"));

const ExecutivePage = lazy(() => import("./pages/ExecutivePage.jsx"));
const JourneyPage = lazy(() => import("./pages/JourneyPage.jsx"));
const AwardsPage = lazy(() => import("./pages/AwardsPage.jsx"));
const CertificationsPage = lazy(() => import("./pages/CertificationsPage.jsx"));
const AIProjectsPage = lazy(() => import("./pages/AIProjectsPage.jsx"));
const ProfessionalCaseStudyPage = lazy(() => import("./pages/ProfessionalCaseStudyPage.jsx"));
const ProjectCaseStudyPage = lazy(() => import("./pages/ProjectCaseStudyPage.jsx"));
const ConferencesPage = lazy(() => import("./pages/ConferencesPage.jsx"));
const HighlightsPage = lazy(() => import("./pages/HighlightsPage.jsx"));
const RecommendationsPage = lazy(() => import("./pages/RecommendationsPage.jsx"));

const CURRENT_YEAR = new Date().getFullYear();

const topNavItems = [
  { label: "Executive", path: "/", match: (path) => path === "/" },
  { label: "Journey", path: "/journey", match: (path) => path.startsWith("/journey") },
  {
    label: "Portfolio",
    path: "/ai-projects",
    match: (path) => ["/ai-projects", "/awards", "/conferences", "/highlights"].some((prefix) => path.startsWith(prefix)),
    children: [
      { label: "Projects", path: "/ai-projects", text: "Builds and case studies" },
      { label: "Awards", path: "/awards", text: "Recognition archive" },
      { label: "Conferences", path: "/conferences", text: "Industry presence" },
      { label: "Highlights", path: "/highlights", text: "Key moments" }
    ]
  },
  { label: "Credentials", path: "/certifications", match: (path) => path.startsWith("/certifications") },
  { label: "Recommendations", path: "/recommendations", match: (path) => path.startsWith("/recommendations") }
];

function NotFoundPage() {
  return (
    <div data-theme="not-found">
      <section className="page-hero">
        <div className="page-hero__inner">
          <div className="page-hero__copy">
            <span className="eyebrow">404</span>
            <h1>Page not found.</h1>
            <p>The page you&apos;re looking for doesn&apos;t exist. Navigate back to explore the site.</p>
          </div>
        </div>
        <div className="case-study-not-found">
          <Link to="/" className="secondary-link" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <ChevronLeft size={18} />
            <span>Back to executive summary</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

function PageSuspenseFallback() {
  return <div className="page-suspense-fallback" aria-hidden="true" />;
}

function AIBrandChatbotFallback() {
  return (
    <div className="brand-chatbot is-collapsed" aria-hidden="true">
      <button className="chatbot-fab" tabIndex={-1} type="button">
        <span className="fab-glow" />
        <span className="fab-monogram">PS</span>
        <span className="fab-badge">AI</span>
      </button>
    </div>
  );
}

function DirectContactPanel() {
  const [name, setName] = useState("");
  const [context, setContext] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState("");
  const canReveal = name.trim().length >= 2 && context.trim().length >= 8;
  const contact = revealed ? getDirectContact() : null;

  const copyValue = async (label, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(""), 1800);
    } catch {
      setCopied("");
    }
  };

  return (
    <div className="direct-contact-panel" aria-label="Protected direct contact panel">
      <h2 className="direct-contact-panel__header">Email or phone</h2>
      <p className="direct-contact-panel__note">Add your name and a line of context to see my details.</p>
      {!revealed ? (
        <form
          className="direct-contact-panel__form"
          onSubmit={(event) => {
            event.preventDefault();
            if (canReveal) setRevealed(true);
          }}
        >
          <label>
            <span>Your name</span>
            <input
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Name"
              type="text"
            />
          </label>
          <label>
            <span>Context</span>
            <input
              value={context}
              onChange={(event) => setContext(event.target.value)}
              placeholder="Hiring, consulting, collaboration..."
              type="text"
            />
          </label>
          <button type="submit" disabled={!canReveal}>
            Reveal details
          </button>
        </form>
      ) : (
        <div className="direct-contact-panel__revealed" aria-live="polite">
          <div className="direct-contact-panel__row">
            <span>{contact.email}</span>
            <button type="button" onClick={() => copyValue("email", contact.email)}>
              {copied === "email" ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied === "email" ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <div className="direct-contact-panel__row">
            <span>{contact.phone}</span>
            <button type="button" onClick={() => copyValue("phone", contact.phone)}>
              {copied === "phone" ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied === "phone" ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <small>Shown after a human context check. LinkedIn remains the preferred first touch.</small>
        </div>
      )}
    </div>
  );
}

function AppShell() {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const topNavRef = useRef(null);
  const topNavPointerTypeRef = useRef("mouse");
  const topNavCloseTimerRef = useRef(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [openTopMenu, setOpenTopMenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const cancelTopMenuClose = () => {
    if (topNavCloseTimerRef.current) {
      window.clearTimeout(topNavCloseTimerRef.current);
      topNavCloseTimerRef.current = null;
    }
  };

  const closeTopMenu = () => {
    cancelTopMenuClose();
    setOpenTopMenu(null);
  };

  const scheduleTopMenuClose = () => {
    cancelTopMenuClose();
    topNavCloseTimerRef.current = window.setTimeout(() => {
      setOpenTopMenu(null);
      topNavCloseTimerRef.current = null;
    }, 180);
  };

  useEffect(() => {
    isNavigatingRef.current = true;
    setMobileNavOpen(false);
    closeTopMenu();
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  const mobileNavRef = useRef(null);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    if (mobileNavOpen) {
      const scrollY = window.scrollY;
      document.body.style.cssText = `overflow:hidden;position:fixed;top:-${scrollY}px;width:100%;`;
      return () => {
        document.body.style.cssText = "";
        window.scrollTo({ top: isNavigatingRef.current ? 0 : scrollY, behavior: "instant" });
        isNavigatingRef.current = false;
      };
    }
  }, [mobileNavOpen]);

  useEffect(() => {
    if (mobileNavOpen && mobileNavRef.current) {
      mobileNavRef.current.scrollTop = 0;
    }
  }, [mobileNavOpen]);

  useEffect(() => () => { cancelTopMenuClose(); }, []);

  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:40px;left:0;width:1px;height:1px;pointer-events:none;";
    document.body.prepend(sentinel);
    const observer = new IntersectionObserver(([entry]) => setIsScrolled(!entry.isIntersecting), { threshold: 0 });
    observer.observe(sentinel);
    return () => { observer.disconnect(); sentinel.remove(); };
  }, []);

  useEffect(() => {
    if (!openTopMenu) return undefined;
    const handler = (event) => {
      if (event.key === "Escape" || (event.type === "pointerdown" && !topNavRef.current?.contains(event.target))) {
        closeTopMenu();
        if (topNavRef.current?.contains(document.activeElement)) document.activeElement.blur();
      }
    };
    document.addEventListener("pointerdown", handler);
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("pointerdown", handler);
      document.removeEventListener("keydown", handler);
    };
  }, [openTopMenu]);

  const getThemeByPath = (path) => {
    if (path.startsWith("/journey")) return "journey";
    if (path.startsWith("/awards")) return "awards";
    if (path.startsWith("/certifications")) return "certifications";
    if (path.startsWith("/ai-projects")) return "projects";
    if (path.startsWith("/conferences")) return "conferences";
    if (path.startsWith("/highlights")) return "highlights";
    if (path.startsWith("/recommendations") || path.startsWith("/references")) return "references";
    return "executive";
  };

  const currentTheme = getThemeByPath(location.pathname);

  return (
    <div className="site-shell" data-theme={currentTheme}>
      <ScrollToTop />
      <header className={`topbar${isScrolled ? " is-scrolled" : ""}`}>
        <Link className="brand-lockup" to="/" aria-label="Prawal Sharma home">
          <strong>{profile.name}</strong>
          <small>Engineering leader</small>
        </Link>
        <nav aria-label="Primary navigation" className="topbar-nav" ref={topNavRef}>
          {topNavItems.map((item) => {
            const isActive = item.match(location.pathname);
            return item.children ? (
              <div
                className={`topbar-nav-group ${openTopMenu === item.label ? "is-open" : ""}`}
                key={item.path}
                onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) closeTopMenu(); }}
                onPointerEnter={(event) => { cancelTopMenuClose(); if (event.pointerType === "mouse") setOpenTopMenu(item.label); }}
                onPointerLeave={(event) => { if (event.pointerType === "mouse") scheduleTopMenuClose(); }}
              >
                <button
                  className={isActive ? "active" : undefined}
                  type="button"
                  aria-current={isActive ? "page" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openTopMenu === item.label}
                  onPointerDown={(event) => { topNavPointerTypeRef.current = event.pointerType; }}
                  onClick={(event) => {
                    const isKeyboardAction = event.detail === 0;
                    setOpenTopMenu((current) => (
                      (isKeyboardAction || topNavPointerTypeRef.current !== "mouse") && current === item.label ? null : item.label
                    ));
                  }}
                >
                  <span className="topbar-nav-label">
                    {item.label}
                    <ChevronDown size={14} aria-hidden="true" />
                  </span>
                </button>
                <div className="topbar-submenu" role="menu" aria-label={`${item.label} pages`}>
                  {item.children.map((child) => (
                    <Link
                      to={child.path}
                      key={child.path}
                      role="menuitem"
                      aria-label={`${child.label}: ${child.text}`}
                      className={location.pathname.startsWith(child.path) ? "active" : undefined}
                      onClick={closeTopMenu}
                    >
                      <span aria-hidden="true">{child.label}</span>
                      <small aria-hidden="true">{child.text}</small>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                className={isActive ? "active" : undefined}
                to={item.path}
                key={item.path}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="topbar-actions">
          <LinkedInButton compact />
          <button
            className="hamburger-btn"
            type="button"
            aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((prev) => !prev)}
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            className="mobile-nav-overlay"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.22, ease: premiumEase }}
            onClick={() => setMobileNavOpen(false)}
          >
            <motion.nav
              ref={mobileNavRef}
              className="mobile-nav"
              aria-label="Mobile navigation"
              initial={shouldReduceMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={shouldReduceMotion ? undefined : { x: "100%" }}
              transition={{ duration: 0.34, ease: premiumEase }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mobile-nav-header">
                <strong className="mobile-nav-name">{profile.name}</strong>
                <button type="button" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="mobile-nav-section">
                <span>Profile</span>
                {topNavItems.filter((item) => !item.children).map((item) => (
                  <NavLink className={({ isActive }) => (isActive ? "mobile-nav-link active" : "mobile-nav-link")} to={item.path} key={item.path}>
                    {item.label}
                  </NavLink>
                ))}
              </div>
              <div className="mobile-nav-section">
                <span>Portfolio</span>
                {topNavItems.find((item) => item.label === "Portfolio")?.children.map((route) => (
                  <NavLink className={({ isActive }) => (isActive ? "mobile-nav-link active" : "mobile-nav-link")} to={route.path} key={route.path}>
                    {route.label}
                  </NavLink>
                ))}
              </div>
              <div className="mobile-nav-cta">
                <LinkedInButton />
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main aria-label="Main content">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="route-motion"
            key={location.pathname}
            initial={shouldReduceMotion ? false : pageEntrance.initial}
            animate={shouldReduceMotion ? undefined : pageEntrance.animate}
            exit={shouldReduceMotion ? undefined : pageEntrance.exit}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: premiumEase, exit: { duration: 0.12, ease: exitEase } }}
          >
            <Suspense fallback={<PageSuspenseFallback />}>
              <Routes location={location}>
                <Route path="/" element={<ExecutivePage />} />
                <Route path="/journey" element={<JourneyPage />} />
                <Route path="/awards" element={<AwardsPage />} />
                <Route path="/certifications" element={<CertificationsPage />} />
                <Route path="/ai-projects" element={<AIProjectsPage />} />
                <Route path="/ai-projects/professional/:caseSlug" element={<ProfessionalCaseStudyPage />} />
                <Route path="/ai-projects/:projectSlug" element={<ProjectCaseStudyPage />} />
                <Route path="/conferences" element={<ConferencesPage />} />
                <Route path="/highlights" element={<HighlightsPage />} />
                <Route path="/recommendations" element={<RecommendationsPage />} />
                <Route path="/references" element={<Navigate to="/recommendations" replace />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="footer-brand">
            <strong>{profile.name}</strong>
            <p>Engineering leader · {profile.location}</p>
          </div>
          <nav className="footer-nav" aria-label="Footer">
            <div>
              <h2>About</h2>
              <Link to="/">Home</Link>
              <Link to="/journey">Career</Link>
              <Link to="/recommendations">Recommendations</Link>
            </div>
            <div>
              <h2>Work</h2>
              <Link to="/ai-projects">Projects</Link>
              <Link to="/awards">Awards</Link>
              <Link to="/certifications">Certifications</Link>
              <Link to="/conferences">Conferences</Link>
              <Link to="/highlights">Highlights</Link>
            </div>
          </nav>
          <div className="footer-contact">
            <DirectContactPanel />
          </div>
        </div>
        <div className="site-footer__base">
          <span>&copy; {CURRENT_YEAR} {profile.name}</span>
          <a href={profile.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </footer>

      <Suspense fallback={<AIBrandChatbotFallback />}>
        <LazyAIBrandChatbot downloadResume={downloadResume} generateExecutiveProfile={generateExecutiveProfile} />
      </Suspense>
    </div>
  );
}

export default function App() {
  return <AppShell />;
}
