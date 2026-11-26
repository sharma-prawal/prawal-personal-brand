import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Check, ChevronDown, ChevronRight, Copy, Linkedin, Menu, X } from "lucide-react";
import { ExecutiveProfileDownloadButton, LinkedInButton, RecoveryPage, ResumeDownloadButton, ScrollToTop, downloadResume, generateExecutiveProfile } from "./components/shared.jsx";
import OverlayDialog from "./components/OverlayDialog.jsx";
// The homepage is where most visitors land, so it ships in the main bundle
// instead of waiting on a second request; the other pages stay lazy.
import ExecutivePage from "./pages/ExecutivePage.jsx";
import { getDirectContact, profile } from "./data/profile.js";
import { pageEntrance, exitEase, premiumEase } from "./lib/motion.js";

const LazyAIBrandChatbot = lazy(() => import("./components/AIBrandChatbot.jsx"));

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
  { label: "Home", path: "/", match: (path) => path === "/" },
  { label: "Career", path: "/journey", match: (path) => path.startsWith("/journey") },
  { label: "Projects", path: "/ai-projects", match: (path) => path.startsWith("/ai-projects") },
  {
    label: "Recognition",
    path: "/awards",
    match: (path) => ["/awards", "/certifications", "/recommendations"].some((prefix) => path.startsWith(prefix)),
    children: [
      { label: "Awards", path: "/awards", text: "Ten awards at Successive Digital" },
      { label: "Certifications", path: "/certifications", text: "Cloud, AI and architecture" },
      { label: "Recommendations", path: "/recommendations", text: "What colleagues say" }
    ]
  },
  {
    label: "Events",
    path: "/conferences",
    match: (path) => ["/conferences", "/highlights"].some((prefix) => path.startsWith(prefix)),
    children: [
      { label: "Conferences", path: "/conferences", text: "AI, cloud and data events" },
      { label: "Highlights", path: "/highlights", text: "Client visits and publications" }
    ]
  }
];

function NotFoundPage() {
  return (
    <RecoveryPage title="Page not found" description="Head back to the homepage or pick a page from the menu." to="/" label="Back to Home" />
  );
}

function PageSuspenseFallback() {
  return <div className="page-suspense-fallback" aria-hidden="true" />;
}

function DirectContactPanel() {
  const [copied, setCopied] = useState(false);
  const { email } = getDirectContact();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="direct-contact-panel">
      <h2 className="direct-contact-panel__header">Get in touch</h2>
      <div className="direct-contact-panel__row">
        <a href={`mailto:${email}`}>{email}</a>
        <button type="button" onClick={copyEmail} aria-live="polite">
          {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <ul className="direct-contact-panel__links">
        <li><a href={profile.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
        <li><a href={profile.contact.github} target="_blank" rel="noreferrer">GitHub</a></li>
        <li><a href={profile.contact.credly} target="_blank" rel="noreferrer">Credly</a></li>
        <li><a href={profile.contact.hackerrank} target="_blank" rel="noreferrer">HackerRank</a></li>
      </ul>
    </div>
  );
}

// Closing call to action for every page except the homepage, which has its own.
function ContactBand() {
  return (
    <section className="contact-band" aria-labelledby="contact-band-title">
      <h2 id="contact-band-title">Want to talk about engineering leadership or AI adoption?</h2>
      <p>LinkedIn is the quickest way to reach me. My CV and executive profile are here too.</p>
      <div className="home-actions">
        <LinkedInButton />
        <ResumeDownloadButton />
        <ExecutiveProfileDownloadButton />
      </div>
    </section>
  );
}

const pageTitles = {
  "/": "Prawal Sharma | Engineering Leader",
  "/journey": "Career | Prawal Sharma",
  "/awards": "Awards | Prawal Sharma",
  "/certifications": "Certifications | Prawal Sharma",
  "/ai-projects": "Projects | Prawal Sharma",
  "/conferences": "Conferences | Prawal Sharma",
  "/highlights": "Highlights | Prawal Sharma",
  "/recommendations": "Recommendations | Prawal Sharma"
};

// Case-study pages set their own title from the project name.
function useRouteTitle(pathname) {
  useEffect(() => {
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
    if (path.startsWith("/ai-projects/") || path === "/references") return;
    document.title = pageTitles[path] || "Page not found | Prawal Sharma";
  }, [pathname]);
}

// After an in-app navigation, move focus to the new page so keyboard and
// screen-reader users start at the content rather than on the old nav link.
function useFocusMainOnNavigate(pathname) {
  const previousPath = useRef(pathname);
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname]);
}

function AppShell() {
  const location = useLocation();
  useRouteTitle(location.pathname);
  useFocusMainOnNavigate(location.pathname);
  const shouldReduceMotion = useReducedMotion();
  const topNavRef = useRef(null);
  const mobileNavTrigger = useRef(null);
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
    setMobileNavOpen(false);
    closeTopMenu();
  }, [location.pathname]);

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
    <div className={`site-shell${mobileNavOpen ? " nav-open" : ""}`} data-theme={currentTheme}>
      <ScrollToTop />
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
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
            ref={mobileNavTrigger}
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

      {mobileNavOpen && (
        <OverlayDialog
          className="mobile-nav-overlay"
          label="Site menu"
          returnFocusRef={mobileNavTrigger}
          onDismiss={() => setMobileNavOpen(false)}
        >
          <motion.nav
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={shouldReduceMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.34, ease: premiumEase }}
          >
            <div className="mobile-nav-header">
              <strong className="mobile-nav-name">{profile.name}</strong>
              <button type="button" aria-label="Close navigation" data-dialog-initial-focus onClick={() => setMobileNavOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="mobile-nav-section">
              {topNavItems.filter((item) => !item.children).map((item) => (
                <NavLink end={item.path === "/"} className={({ isActive }) => (isActive ? "mobile-nav-link active" : "mobile-nav-link")} to={item.path} key={item.path} onClick={() => setMobileNavOpen(false)}>
                  {item.label}
                </NavLink>
              ))}
            </div>
            {topNavItems.filter((item) => item.children).map((group) => (
              <div className="mobile-nav-section" key={group.label}>
                <span>{group.label}</span>
                {group.children.map((route) => (
                  <NavLink className={({ isActive }) => (isActive ? "mobile-nav-link active" : "mobile-nav-link")} to={route.path} key={route.path} onClick={() => setMobileNavOpen(false)}>
                    {route.label}
                  </NavLink>
                ))}
              </div>
            ))}
            <div className="mobile-nav-cta">
              <LinkedInButton />
            </div>
          </motion.nav>
        </OverlayDialog>
      )}

      <main id="main" tabIndex={-1} aria-label="Main content">
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
        {location.pathname !== "/" ? <ContactBand /> : null}
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="footer-brand">
            <strong>{profile.name}</strong>
            <p>Engineering leader · {profile.location}</p>
            <small>&copy; {CURRENT_YEAR} {profile.name}</small>
          </div>
          <nav className="footer-nav" aria-label="Footer">
            <div>
              <h2>Work</h2>
              <Link to="/">Home</Link>
              <Link to="/journey">Career</Link>
              <Link to="/ai-projects">Projects</Link>
              <Link to="/conferences">Conferences</Link>
              <Link to="/highlights">Highlights</Link>
            </div>
            <div>
              <h2>Recognition</h2>
              <Link to="/awards">Awards</Link>
              <Link to="/certifications">Certifications</Link>
              <Link to="/recommendations">Recommendations</Link>
            </div>
          </nav>
          <div className="footer-contact">
            <DirectContactPanel />
          </div>
        </div>
      </footer>

      <Suspense fallback={null}>
        <LazyAIBrandChatbot downloadResume={downloadResume} generateExecutiveProfile={generateExecutiveProfile} />
      </Suspense>
    </div>
  );
}

export default function App() {
  return <AppShell />;
}
