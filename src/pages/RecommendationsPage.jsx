import { motion } from "framer-motion";
import { QuoteMark, VerifyCircle } from "../components/icons.jsx";
import { MotionCard, MotionGroup, Reveal, handleCardMouseMove } from "../components/shared.jsx";
import { profile } from "../data/profile.js";
import { itemReveal } from "../lib/motion.js";

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

export default function RecommendationsPage() {
  const leadRecommendation = profile.recommendations[0];
  const sapnaRecommendation = profile.recommendations.find(rec => rec.name === "Sapna Upreti");
  const supportingRecommendations = profile.recommendations.slice(1, 3);
  const secondaryRecommendations = profile.recommendations.slice(3).filter(rec => rec.name !== "Sapna Upreti");

  const recommendationThemes = [
    { title: "Calm ownership under client pressure", text: "Recommendations repeatedly describe composure, patience, and accountability when delivery conditions are difficult." },
    { title: "Technical breadth without ego", text: "Cloud, full-stack systems, React, GraphQL, automation, and multi-project execution appear as practical usefulness." },
    { title: "Team influence and mentoring", text: "The strongest language is not only about skill. It is about availability, motivation, and helping teams move." },
    { title: "Adaptability and learning speed", text: "Multiple recommendations point to fast learning, change readiness, and the ability to operate across unfamiliar contexts." }
  ];
  const referenceSignals = [
    { value: "12", label: "recommendations", text: "A broad recommendation base across managers, peers, leads, and specialists." },
    { value: "4 yrs", label: "time span", text: "Recommendations span multiple roles and operating contexts over four years." },
    { value: "5", label: "leadership patterns", text: "Ownership, composure, mentoring, adaptability, and technical breadth repeat." }
  ];
  const referenceLedger = [
    { value: "12", label: "LinkedIn recommendations" },
    { value: "4 yrs", label: "Consistent over" },
    { value: "5", label: "Repeated signals" }
  ];
  const referenceVoices = [
    { label: "Managerial voice", text: "Leadership, ownership, and client-facing calm." },
    { label: "Technical voice", text: "Cloud, full-stack, React, GraphQL, and multi-project delivery." },
    { label: "Team voice", text: "Mentorship, availability, motivation, and execution support." }
  ];

  return (
    <div data-theme="references">
      <Reveal as={motion.section} className="reference-hero">
        <div className="reference-hero__copy">
          <span className="eyebrow">What colleagues say</span>
          <h1>How the work is experienced by others.</h1>
          <p>The strongest signal is the pattern — the same qualities repeating across managers, peers, technical collaborators, and team members.</p>
        </div>
        <div className="reference-hero__ledger" aria-label="Reference proof ledger">
          {referenceLedger.map((item) => (
            <div className="reference-hero__ledger-item" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal as={motion.section} className="reference-dossier">
        <MotionCard
          className="reference-lead-quote glass-card spotlight-card"
          priority
          immediate
          onMouseMove={handleCardMouseMove}
        >
          <div className="recommendation-card-header">
            <RecommenderAvatar rec={leadRecommendation} senior={isSeniorRole(leadRecommendation.role)} />
            <LinkedInVerify url={leadRecommendation.linkedinUrl} />
          </div>
          <p className="recommendation-quote">{leadRecommendation.quote}</p>
          <div className="recommendation-author-info">
            <strong>{leadRecommendation.name}</strong>
            <span>{leadRecommendation.role}</span>
            <small>{leadRecommendation.date}</small>
          </div>
        </MotionCard>

        <div className="reference-dossier__analysis">
          <span className="eyebrow">What stands out</span>
          <h2>The same qualities repeat across every relationship.</h2>
          <p>The recommendations point to the same operating qualities from different angles: ownership under pressure, technical usefulness, team steadiness, and the ability to learn quickly without creating noise.</p>
          <div className="reference-voice-list">
            {referenceVoices.map((voice) => (
              <div className="reference-voice-item" key={voice.label}>
                <strong>{voice.label}</strong>
                <span>{voice.text}</span>
              </div>
            ))}
          </div>
        </div>

        {sapnaRecommendation && (
          <MotionCard
            className="reference-lead-quote glass-card spotlight-card"
            onMouseMove={handleCardMouseMove}
          >
            <div className="recommendation-card-header">
              <RecommenderAvatar rec={sapnaRecommendation} senior={isSeniorRole(sapnaRecommendation.role)} />
              <LinkedInVerify url={sapnaRecommendation.linkedinUrl} />
            </div>
            <p className="recommendation-quote">{sapnaRecommendation.quote}</p>
            <div className="recommendation-author-info">
              <strong>{sapnaRecommendation.name}</strong>
              <span>{sapnaRecommendation.role}</span>
              <small>{sapnaRecommendation.date}</small>
            </div>
          </MotionCard>
        )}

        <MotionGroup className="reference-supporting-quotes">
          {supportingRecommendations.map((rec) => (
            <motion.article
              className="reference-supporting-quote glass-card spotlight-card"
              variants={itemReveal}
              onMouseMove={handleCardMouseMove}
              key={rec.name}
            >
              <QuoteMark className="recommendation-quote-icon" size={36} />
              <p>{rec.quote}</p>
              <div className="reference-supporting-quote__author">
                <RecommenderAvatar rec={rec} senior={isSeniorRole(rec.role)} />
                <div className="reference-supporting-quote__author-info">
                  <strong>{rec.name}</strong>
                  <span>{rec.role}</span>
                </div>
                <LinkedInVerify url={rec.linkedinUrl} compact />
              </div>
            </motion.article>
          ))}
        </MotionGroup>
      </Reveal>

      <Reveal as={motion.section} className="reference-signal-map-container">
        <div className="reference-signal-map">
          <div className="reference-signal-map__lead">
            <span className="eyebrow">Reference signal map</span>
            <h2>What the testimonials validate.</h2>
            <p>The strongest recommendations do more than praise performance. They confirm how the work feels to people around it: calm under pressure, technically useful, and reliable for teams.</p>
          </div>
          <MotionGroup className="reference-signal-map__grid">
            {referenceSignals.map((signal) => (
              <motion.article
                className="glass-card spotlight-card"
                variants={itemReveal}
                onMouseMove={handleCardMouseMove}
                key={signal.label}
              >
                <strong>{signal.value}</strong>
                <span>{signal.label}</span>
                <p>{signal.text}</p>
              </motion.article>
            ))}
          </MotionGroup>
        </div>
      </Reveal>

      <Reveal className="recommendation-themes-container">
        <div className="recommendation-themes">
          <div>
            <span className="eyebrow">Leadership themes</span>
            <h2>Patterns that show up across the recommendations.</h2>
          </div>
          <div className="recommendation-theme-list">
            {recommendationThemes.map((theme) => (
              <div className="recommendation-theme-item" key={theme.title}>
                <strong>{theme.title}</strong>
                <span>{theme.text}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="reference-archive-heading">
        <span className="premium-divider-label">Recommendation archive</span>
        <hr />
        <span className="premium-divider-count-pill">{secondaryRecommendations.length} MORE</span>
      </div>

      <MotionGroup className="reference-archive" aria-label="Recommendation archive">
        {secondaryRecommendations.map((rec) => (
          <motion.article
            className={[
              "reference-archive-row glass-card spotlight-card",
              isSeniorRole(rec.role) ? "reference-archive-row--highlighted" : ""
            ].filter(Boolean).join(" ")}
            variants={itemReveal}
            onMouseMove={handleCardMouseMove}
            key={rec.name}
          >
            <div className="reference-archive-row__meta">
              <RecommenderAvatar rec={rec} senior={isSeniorRole(rec.role)} />
              <div>
                <strong>{rec.name}</strong>
                <span>{rec.role}</span>
              </div>
            </div>
            <p className="recommendation-quote">{rec.quote}</p>
            <div className="reference-archive-row__footer">
              <small>{rec.date}</small>
              <LinkedInVerify url={rec.linkedinUrl} compact />
            </div>
          </motion.article>
        ))}
      </MotionGroup>

      <div className="reference-source-note">
        <VerifyCircle size={15} />
        <span>Recommendations are curated from the public LinkedIn recommendation record.</span>
        <a href={profile.profileUrl} target="_blank" rel="noreferrer">Verify source &rarr;</a>
      </div>
    </div>
  );
}
