import { motion } from "framer-motion";
import { PageFrame, Reveal } from "../components/shared.jsx";
import { profile } from "../data/profile.js";

const journeyArc = [
  { label: "Foundation", title: "Built from implementation depth", text: "Started close to the code, delivery details, production constraints, and practical engineering habits." },
  { label: "Scale", title: "Moved into accountable systems ownership", text: "Grew into platform architecture, multi-pod delivery, client-facing execution, and enterprise reliability." },
  { label: "Leadership", title: "Leading through judgment and leverage", text: "Combines architecture, global stakeholders, team leadership, and AI-assisted engineering workflows." }
];

const roleTags = [
  ["AI Delivery", "Global Stakeholders", "Productivity Leverage", "Team Mentorship", "Cloud Strategy"],
  ["System Architecture", "Enterprise Data Pipelines", "Payment Integration", "Team Leadership", "GraphQL"],
  ["React & Redux", "Node.js", "GraphQL", "Technical Pod Lead"],
  ["API Optimization", "Node.js", "Team Delivery", "PHP"],
  ["Internal Tools", "Automation", "JavaScript"]
];

const roleResults = [
  "Improved engineering productivity by about 20–30% through structured AI adoption.",
  "Built a data platform that connected 90+ sources and enabled self-service reporting.",
  "Led three application pods for a global advertising enterprise.",
  "Improved customer satisfaction by approximately 50% through performance and reliability work.",
  "Built internal tools for meeting bookings and HR document automation."
];

function formatRoleYears(period) {
  const years = period.match(/\d{4}|Present/g);
  if (!years?.length) return period;
  return `${years[0]} – ${years[years.length - 1]}`;
}

export default function JourneyPage() {
  const successive = profile.experience[0];
  const facts = [
    { value: "9", label: "Years at Successive Digital" },
    { value: String(successive.roles.length), label: "Roles, trainee to technology manager" },
    { value: "3", label: "Client regions: US, UK, South Africa" },
    { value: "10", label: "Awards along the way" }
  ];

  return (
    <div data-theme="journey">
      <PageFrame
        eyebrow="Career"
        title="Trainee in 2017, technology manager by 2024."
        intro="How hands-on engineering grew into owning systems, leading global delivery and building an AI-assisted way of working."
      >
        <div className="ledger-page">
          <Reveal as={motion.section} className="home-section ledger-page__lead career-timeline" aria-labelledby="journey-roles-title">
            <header className="home-section__head">
              <h2 id="journey-roles-title">Successive Digital, {successive.location}</h2>
            </header>
            <ol className="role-ledger role-ledger--timeline">
              {successive.roles.map((role, idx) => (
                <li key={role.title} aria-current={idx === 0 ? "true" : undefined}>
                  <div className="role-ledger__when">
                    <span>{formatRoleYears(role.period)}</span>
                    {idx === 0 ? <span className="role-ledger__current">Current role</span> : null}
                  </div>
                  <div className="role-ledger__what">
                    <h3>{role.title}</h3>
                    {roleResults[idx] && <p className="role-ledger__summary">{roleResults[idx]}</p>}
                    <details className="role-ledger__details">
                      <summary><span className="summary-closed">Role details</span><span className="summary-open">Hide details</span></summary>
                      <ul>
                        {role.details.map((detail) => <li key={detail}>{detail}</li>)}
                      </ul>
                      {roleTags[idx]?.length ? (
                        <p className="role-ledger__focus"><span>Focus</span> {roleTags[idx].join(" · ")}</p>
                      ) : null}
                    </details>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <dl className="home-facts" aria-label="Career at a glance">
            {facts.map((fact) => (
              <div className="home-facts__item" key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

          <Reveal as={motion.section} className="home-section" aria-labelledby="journey-stages-title">
            <header className="home-section__head">
              <h2 id="journey-stages-title">How the work changed</h2>
              <p>Titles changed along the way, but the bigger shift was the size of the problems: larger systems, higher stakes and more judgment calls.</p>
            </header>
            <ol className="stage-cols">
              {journeyArc.map((item, index) => (
                <li key={item.title}>
                  <span className="stage-cols__no">{String(index + 1).padStart(2, "0")} · {item.label}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal as={motion.section} className="home-section" aria-labelledby="journey-before-title">
            <header className="home-section__head">
              <h2 id="journey-before-title">Before that, and education</h2>
            </header>
            <ol className="role-ledger role-ledger--compact">
              <li>
                <div className="role-ledger__when"><span>2014 – 2016</span></div>
                <div className="role-ledger__what">
                  <h3>Early roles</h3>
                  <p className="role-ledger__summary">
                    Software trainee at GirnarSoft (CarDekho and BikeDekho, 2016), and summer internships at NIIT Technologies (2015) and Aptech (2014).
                  </p>
                </div>
              </li>
              <li>
                <div className="role-ledger__when"><span>{profile.education.period}</span></div>
                <div className="role-ledger__what">
                  <h3>{profile.education.school}</h3>
                  <p className="role-ledger__summary">{profile.education.degree}</p>
                </div>
              </li>
            </ol>
          </Reveal>
        </div>
      </PageFrame>
    </div>
  );
}
