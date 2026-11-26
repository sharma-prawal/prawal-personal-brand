import { aiProjectsWithSlugs, professionalCasesWithSlugs } from "./derived.js";

export const SITE_TITLE_SUFFIX = " | Prawal Sharma";
export const NOT_FOUND_TITLE = `Page not found${SITE_TITLE_SUFFIX}`;

export const pageTitles = {
  "/": "Prawal Sharma | Engineering Leader",
  "/journey": "Career | Prawal Sharma",
  "/awards": "Awards | Prawal Sharma",
  "/certifications": "Certifications | Prawal Sharma",
  "/ai-projects": "Projects | Prawal Sharma",
  "/conferences": "Conferences | Prawal Sharma",
  "/highlights": "Highlights | Prawal Sharma",
  "/recommendations": "Recommendations | Prawal Sharma"
};

export const projectCasePath = (slug) => `/ai-projects/${slug}`;
export const professionalCasePath = (slug) => `/ai-projects/professional/${slug}`;

/**
 * Every URL that ships as its own static HTML file at build time, with the
 * <title> it should carry before JavaScript runs. Case studies come from the
 * data, so adding a project adds its page without touching this file.
 */
export function prerenderRoutes() {
  return [
    ...Object.entries(pageTitles).map(([path, title]) => ({ path, title })),
    ...aiProjectsWithSlugs.map((project) => ({ path: projectCasePath(project.slug), title: `${project.name}${SITE_TITLE_SUFFIX}` })),
    ...professionalCasesWithSlugs.map((project) => ({ path: professionalCasePath(project.slug), title: `${project.name}${SITE_TITLE_SUFFIX}` }))
  ];
}
