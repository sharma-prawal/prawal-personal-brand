import { motion } from "framer-motion";
import { VerifyCircle } from "../components/icons.jsx";
import { PageFrame, Reveal } from "../components/shared.jsx";
import { profile } from "../data/profile.js";

function LinkedInVerify({ url, compact = false }) {
  if (!url) return (
    <div className="recommendation-verification">
      <VerifyCircle size={14} />
      <span>LinkedIn source</span>
    </div>
  );
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`recommendation-verification recommendation-verification--link${compact ? " recommendation-verification--compact" : ""}`}
      aria-label="Verify on LinkedIn"
    >
      <VerifyCircle size={14} />
      <span>{compact ? "LinkedIn" : "Verify on LinkedIn"}</span>
    </a>
  );
}

function getInitials(name) {
  if (!name) return "";
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function RecommenderAvatar({ rec, senior }) {
  const cls = `recommendation-avatar ${senior ? "recommendation-avatar--senior" : "recommendation-avatar--engineer"}`;
  if (rec.photo) {
    return (
      <div
        className={`${cls} recommendation-avatar--photo`}
        style={{ "--avatar-photo": `url(${rec.photo})` }}
        role="img"
        aria-label={rec.name}
      />
    );
  }
  return <div className={cls}>{getInitials(rec.name)}</div>;
}

function isSeniorRole(role) {
  if (!role) return false;
  return /manager|vp|director|lead|chief|head|president|executive|founder|principal/i.test(role);
}

function Person({ rec }) {
  return (
    <div className="quote-person">
      <RecommenderAvatar rec={rec} senior={isSeniorRole(rec.role)} />
      <div>
        <strong>{rec.name}</strong>
        <span>{rec.role}</span>
      </div>
    </div>
  );
}

export default function RecommendationsPage() {
  const recs = profile.recommendations;
  const featured = [recs[0], recs.find((rec) => rec.name === "Sapna Upreti")].filter(Boolean);
  const rest = recs.filter((rec) => !featured.includes(rec));
  const seniorCount = recs.filter((rec) => isSeniorRole(rec.role)).length;
  const years = recs.map((rec) => Number(String(rec.date || "").match(/\d{4}/)?.[0])).filter(Boolean);

  const themes = [
    { title: "Calm ownership under client pressure", text: "Composure, patience and accountability when delivery conditions are difficult." },
    { title: "Technical breadth without ego", text: "Cloud, full-stack systems, React, GraphQL and automation, described as practical help." },
    { title: "Team influence and mentoring", text: "Availability, motivation and helping teams move, not only individual skill." },
    { title: "Adaptability and learning speed", text: "Fast learning and working well in unfamiliar contexts." }
  ];

  const facts = [
    { value: String(recs.length), label: "LinkedIn recommendations" },
    { value: String(seniorCount), label: "From managers and leads" },
    { value: years.length ? `${Math.min(...years)}–${Math.max(...years)}` : "", label: "Years written" },
    { value: String(themes.length), label: "Recurring themes" }
  ].filter((fact) => fact.value);

  return (
    <div data-theme="references">
      <PageFrame
        eyebrow="Recommendations"
        title="What colleagues say about working with me."
        intro="LinkedIn recommendations from managers, peers and the engineers I have led."
      >
        <div className="ledger-page">
          <dl className="home-facts" aria-label="Recommendations at a glance">
            {facts.map((fact) => (
              <div className="home-facts__item" key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

          <Reveal as={motion.section} className="home-section" aria-label="Featured recommendations">
            <ul className="quote-pair">
              {featured.map((rec) => (
                <li key={rec.name}>
                  <blockquote><p>{rec.quote}</p></blockquote>
                  <Person rec={rec} />
                  <LinkedInVerify url={rec.linkedinUrl} />
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal as={motion.section} className="home-section home-section--split" aria-labelledby="recs-themes-title">
            <header className="home-section__head">
              <h2 id="recs-themes-title">The same qualities come up again and again</h2>
              <p>Read together, the recommendations keep returning to four things.</p>
            </header>
            <ol className="home-rules home-rules--numbered">
              {themes.map((theme, index) => (
                <li key={theme.title}>
                  <span className="home-rules__num">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{theme.title}</h3>
                  <p>{theme.text}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal as={motion.section} className="home-section" aria-labelledby="recs-all-title">
            <header className="home-section__head">
              <h2 id="recs-all-title">All recommendations</h2>
              <p>
                Taken from my public LinkedIn profile, where each one can be{" "}
                <a className="inline-link" href={profile.profileUrl} target="_blank" rel="noreferrer">verified</a>.
              </p>
            </header>
            <ol className="quote-rows">
              {rest.map((rec) => (
                <li key={rec.name}>
                  <div className="quote-rows__who">
                    <Person rec={rec} />
                    <span className="quote-rows__date">{rec.date}</span>
                  </div>
                  <div className="quote-rows__what">
                    <p>{rec.quote}</p>
                    <LinkedInVerify url={rec.linkedinUrl} compact />
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </PageFrame>
    </div>
  );
}
