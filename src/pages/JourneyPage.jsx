import { motion } from "framer-motion";
import { MotionGroup, Reveal } from "../components/shared.jsx";
import { profile } from "../data/profile.js";
import { itemReveal, premiumEase, slideLeft, slideRight, splitStagger, tapPress } from "../lib/motion.js";

const journeyArc = [
  { label: "Foundation", title: "Built from implementation depth", text: "Started close to the code, delivery details, production constraints, and practical engineering habits." },
  { label: "Scale", title: "Moved into accountable systems ownership", text: "Grew into platform architecture, multi-pod delivery, client-facing execution, and enterprise reliability." },
  { label: "Leadership", title: "Now leads through judgment and leverage", text: "Combines architecture, global stakeholders, team leadership, and AI-assisted engineering workflows." }
];

const roleTags = [
  ["AI Delivery", "Global Stakeholders", "Productivity Leverage", "Team Mentorship", "Cloud Strategy"],
  ["System Architecture", "Enterprise Data Pipelines", "Payment Integration", "Team Leadership", "GraphQL"],
  ["React & Redux", "Node.js", "GraphQL", "Technical Pod Lead"],
  ["API Optimization", "Node.js", "Team Delivery", "PHP"],
  ["Internal Tools", "Automation", "JavaScript"]
];

const roleProofs = [
  { summary: "Leads a direct engineering team while serving as cross-organizational technical lead across fintech and media programs spanning India, UK, and South Africa — zero-escalation delivery record and 20–30% productivity gain through structured AI adoption.", points: ["Reduced debugging and code review cycle time through AI-assisted workflows across three global teams.", "Maintains stakeholder trust across US, UK, and South Africa with zero formal escalations over 10 years."] },
  { summary: "Converted technical ownership into enterprise-grade systems — payment platforms, data pipelines, and cloud infrastructure — trusted by banking and media clients for years.", points: ["Built a unified data platform connecting 90+ external sources, enabling self-service reporting without manual engineering.", "Delivered ACH payment and fraud detection systems processing 160K+ daily banking transactions with 99.9% uptime."] },
  { summary: "Stepped into pod-level leadership across three parallel applications, delivering production-grade releases without losing hands-on engineering depth.", points: ["Led three application pods for a global advertising enterprise across Node.js, React, Redux, and GraphQL.", "Maintained release quality benchmarks while scaling from individual contributor to team lead."] },
  { summary: "Built the early ownership pattern: small-team leadership, reliability improvements, and independent delivery across client-critical systems.", points: ["Led four engineers while independently owning end-to-end project delivery.", "Improved customer satisfaction by approximately 50% through performance and reliability enhancements."] },
  { summary: "Started with operational tools and automation, establishing a bias toward practical systems that solve real problems efficiently.", points: ["Developed internal meeting booking and HR automation tools.", "Built early delivery habits across JavaScript and internal systems."] }
];

function formatRoleYears(period) {
  const years = period.match(/\d{4}|Present/g);
  if (!years?.length) return period;
  return `${years[0]} - ${years[years.length - 1]}`;
}

export default function JourneyPage() {
  const successive = profile.experience[0];

  return (
    <div data-theme="journey">
      <Reveal as={motion.section} className="journey-hero">
        <div className="journey-hero__copy">
          <span className="eyebrow">Career</span>
          <h1>From trainee to technology manager in ten years.</h1>
          <p>How hands-on engineering grew into owning systems, leading global delivery and building an AI-assisted way of working.</p>
        </div>
        <div className="journey-hero__ledger" aria-label="Journey proof ledger">
          {[
            { value: "10", label: "Years in engineering" },
            { value: "5", label: "Role transitions" },
            { value: "3", label: "Client regions: US, UK, South Africa" }
          ].map((item) => (
            <div className="journey-hero__ledger-item" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal as={motion.section} className="journey-arc">
        <div className="journey-arc__lead">
          <span className="eyebrow">Three stages</span>
          <h2>How the work changed.</h2>
          <p>Titles changed along the way, but the bigger shift was the size of the problems: larger systems, higher stakes and more judgment calls.</p>
        </div>
        <MotionGroup className="journey-arc__grid">
          {journeyArc.map((item) => (
            <motion.article className="journey-arc-card" variants={itemReveal} key={item.title}>
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </motion.article>
          ))}
        </MotionGroup>
      </Reveal>

      <section className="successive-flagship">
        <Reveal as={motion.div} className="successive-dossier-heading" variants={splitStagger}>
          <motion.div
            className="successive-dossier-signal"
            aria-label="Career signal"
            variants={slideLeft}
            transition={{ duration: 0.72, ease: premiumEase }}
          >
            <span>Primary tenure</span>
            <strong>
              <span>10 yr</span>
            </strong>
            <p>Five role transitions, ten recognitions, and delivery exposure across US, UK, and South Africa stakeholders.</p>
          </motion.div>
          <motion.div
            variants={slideRight}
            transition={{ duration: 0.72, ease: premiumEase }}
          >
            <span className="eyebrow">Successive Digital</span>
            <h2>Most of my career has been at one company.</h2>
            <p>Ten years at Successive Digital, from trainee to technology manager, with each step earned through delivery rather than time served.</p>
          </motion.div>
        </Reveal>
        <div className="successive-flagship-layout">
          <aside className="successive-side-panel">
            <div className="successive-side-sticky">
              <span className="eyebrow">At a glance</span>
              <h2 className="successive-company-title">{successive.company}</h2>
              <span className="successive-company-loc">{successive.location}</span>
              <p className="successive-tagline">5 promotions in 10 years</p>
              <div className="successive-side-stats">
                {[
                  { value: "5", label: "Role transitions", numeric: true },
                  { value: "10", label: "Recognitions", numeric: true },
                  { value: "US·UK·SA", label: "Delivery regions", numeric: false },
                  { value: "10yr", label: "At Successive", numeric: true }
                ].map((s) => (
                  <div className="successive-side-stat" key={s.label}>
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="progression-mini-rail">
                <span className="eyebrow">Roles</span>
                <div className="progression-mini-rail__list">
                  {successive.roles.map((role, idx) => (
                    <div className={`progression-rail-item ${idx === 0 ? "active" : ""}`} key={role.title}>
                      <div className="progression-rail-dot" />
                      <div className="progression-rail-info">
                        <strong>{role.title}</strong>
                        <span>{formatRoleYears(role.period)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="successive-roles-timeline">
            <div className="journey-timeline-rail" />
            <div className="successive-roles">
              {successive.roles.map((role, idx) => {
                const isCurrent = idx === 0;
                const roleProof = roleProofs[idx];
                return (
                  <div className="journey-timeline-item" key={role.title}>
                    <div className={`journey-timeline-marker ${isCurrent ? "journey-timeline-marker--active" : ""}`}>
                      <span className="journey-timeline-year">{formatRoleYears(role.period).split(" - ")[0]}</span>
                    </div>
                    <motion.article
                      className={["successive-role glass-card spotlight-card", isCurrent ? "successive-role--current" : ""].filter(Boolean).join(" ")}
                      variants={itemReveal}
                      whileTap={tapPress}
                      transition={{ duration: 0.42, ease: premiumEase }}
                    >
                      <div className="successive-role-header">
                        <div>
                          <h3>{role.title}</h3>
                          <span className="role-period">{role.period}</span>
                        </div>
                        {isCurrent && <span className="current-badge">Current</span>}
                      </div>
                      <div className="role-dossier-grid">
                        <p className="role-summary">{roleProof.summary}</p>
                        <ul>
                          {roleProof.points.map((detail) => (
                            <li key={detail}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="journey-capability-tags">
                        {roleTags[idx]?.map((tag) => (
                          <span className="journey-tag" key={tag}>{tag}</span>
                        ))}
                      </div>
                    </motion.article>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Reveal className="earlier-career earlier-career--compact">
        <p>
          <strong>Before Successive Digital:</strong> software trainee at GirnarSoft (CarDekho and BikeDekho, 2016),
          and summer internships at NIIT Technologies (2015) and Aptech (2014).
        </p>
      </Reveal>

      <Reveal className="education-block">
        <div className="education-card">
          <span className="eyebrow">Education</span>
          <div className="education-main">
            <h3>{profile.education.school}</h3>
            <span>{profile.education.degree}</span>
          </div>
          <div className="education-meta">
            <span className="education-period">{profile.education.period}</span>
          </div>
        </div>
      </Reveal>

    </div>
  );
}
