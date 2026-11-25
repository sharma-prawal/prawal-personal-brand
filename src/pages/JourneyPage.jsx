import { motion } from "framer-motion";
import { PageFrame, Reveal } from "../components/shared.jsx";
import { profile } from "../data/profile.js";

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
  return `${years[0]} – ${years[years.length - 1]}`;
}

export default function JourneyPage() {
  const successive = profile.experience[0];
  const facts = [
    { value: "10", label: "Years at Successive Digital" },
    { value: String(successive.roles.length), label: "Roles, trainee to technology manager" },
    { value: "3", label: "Client regions: US, UK, South Africa" },
    { value: "10", label: "Awards along the way" }
  ];

  return (
    <div data-theme="journey">
      <PageFrame
        eyebrow="Career"
        title="From trainee to technology manager in ten years."
        intro="How hands-on engineering grew into owning systems, leading global delivery and building an AI-assisted way of working."
      >
        <div className="ledger-page">
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

          <Reveal as={motion.section} className="home-section" aria-labelledby="journey-roles-title">
            <header className="home-section__head">
              <h2 id="journey-roles-title">Successive Digital, {successive.location}</h2>
              <p>Most of my career has been at one company: five roles in ten years, each earned through delivery rather than time served.</p>
            </header>
            <ol className="role-ledger">
              {successive.roles.map((role, idx) => (
                <li key={role.title}>
                  <div className="role-ledger__when">
                    <span>{formatRoleYears(role.period)}</span>
                    {idx === 0 ? <span className="role-ledger__current">Current role</span> : null}
                  </div>
                  <div className="role-ledger__what">
                    <h3>{role.title}</h3>
                    {roleProofs[idx]?.summary ? <p className="role-ledger__summary">{roleProofs[idx].summary}</p> : null}
                    <ul>
                      {role.details.map((detail) => <li key={detail}>{detail}</li>)}
                    </ul>
                    {roleTags[idx]?.length ? (
                      <p className="role-ledger__focus"><span>Focus</span> {roleTags[idx].join(" · ")}</p>
                    ) : null}
                  </div>
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
