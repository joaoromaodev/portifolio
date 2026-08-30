// Language-neutral facts about the site's owner. Everything with prose in it —
// the About narrative, experience notes, skill group names, section titles and
// UI labels — lives in lib/i18n/dictionaries/{en,pt}.ts instead, and the
// project catalogue lives in content/projects.json.

export const profile = {
  name: "João Romão",
  timezone: "America/Belem",
  email: "joaoromaodev@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/joaoromao-data/",
    github: "https://github.com/joaoromaodev",
  },
  /** Belém, for the location card's coordinate readout. */
  coordinates: "01°27'21\"S · 48°29'25\"W",
} as const;

// CV download. The file itself is optional — lib/resume.ts checks whether it
// exists at build time and the CTAs only render when it does.
export const RESUME_PATH = "/joao-romao-cv.pdf";

// Projects live in content/projects.json and are loaded/typed by lib/projects.ts
// (editable through the dev-only /admin panel). Re-exported here so `lib/site`
// stays the single import surface for the site's content.
export {
  projects,
  allProjects,
  featuredProjects,
  secondaryProjects,
  flagColor,
  FLAGS,
} from "./projects";
export type { Project, ProjectFlag, ProjectLink } from "./projects";
