import { aiProjects } from "./showcase.js";
import { profile } from "./profile.js";

function projectSlug(name) {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export { projectSlug };

const portfolioOrder = [
  "AI-Driven Datastream Intelligence POC",
  "Personal Branding Site",
  "Sunrise Public School Website",
  "Anniversary RPG Web Game",
  "Android Notes App",
  "Published Visual Novel Game",
  "Interactive Lovebook Experience"
];

export const aiProjectsWithSlugs = aiProjects
  .map((project) => ({ ...project, slug: projectSlug(project.name) }))
  .sort((a, b) => {
    const ai = portfolioOrder.indexOf(a.name);
    const bi = portfolioOrder.indexOf(b.name);
    return (ai === -1 ? portfolioOrder.length : ai) - (bi === -1 ? portfolioOrder.length : bi);
  });

export const professionalCasesWithSlugs = profile.projects.map((project, index) => ({
  ...project,
  caseNo: String(index + 1).padStart(2, "0"),
  evidenceMode: project.evidence || "Resume-backed",
  access: project.access || "NDA-safe summary",
  signal: `${project.domain} | ${project.meta}`,
  slug: projectSlug(project.name)
}));
