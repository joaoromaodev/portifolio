// Project catalogue. The data lives in content/projects.json so it can be
// edited through the local admin panel (/admin, dev-only) without touching
// code. The JSON is imported statically, so the site stays fully static —
// there is no database and no runtime read.
import data from "@/content/projects.json";

export type ProjectFlag = "case-study" | "live" | "building" | "award" | "side";

export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  flag: ProjectFlag;
  /** Featured projects render as full-width case-study rows, strongest first. */
  featured: boolean;
  /** Unpublished projects are drafts — kept in the file, hidden from the site. */
  published: boolean;
  /** Sort key within each group; lower comes first. */
  order: number;
  summary: string;
  problem: string;
  solution: string;
  impact?: string;
  stack: string[];
  links: ProjectLink[];
  /** Shown instead of a repo link when the code can't be published. */
  privateNote?: string;
  /** Screenshot under /public, e.g. "/projects/simf.png". */
  image?: string;
  /** Alt text for the screenshot — required whenever `image` is set. */
  imageAlt?: string;
};

export const FLAGS: ProjectFlag[] = [
  "case-study",
  "live",
  "building",
  "award",
  "side",
];

export const flagMeta: Record<ProjectFlag, { label: string; color: string }> = {
  "case-study": { label: "case study", color: "text-purple" },
  live: { label: "live", color: "text-green" },
  building: { label: "building", color: "text-amber" },
  award: { label: "award", color: "text-cyan" },
  side: { label: "side project", color: "text-muted" },
};

// Fill in defaults for fields the admin may omit, so hand-edited JSON and
// panel-written JSON behave identically.
export function normalizeProject(raw: unknown, index = 0): Project {
  const p = raw as Partial<Project>;
  return {
    slug: p.slug ?? `project-${index}`,
    title: p.title ?? "Untitled",
    kicker: p.kicker ?? "",
    flag: FLAGS.includes(p.flag as ProjectFlag) ? (p.flag as ProjectFlag) : "side",
    featured: p.featured === true,
    published: p.published !== false,
    order: typeof p.order === "number" ? p.order : index,
    summary: p.summary ?? "",
    problem: p.problem ?? "",
    solution: p.solution ?? "",
    impact: p.impact || undefined,
    stack: Array.isArray(p.stack) ? p.stack : [],
    links: Array.isArray(p.links) ? p.links.filter((l) => l?.href && l?.label) : [],
    privateNote: p.privateNote || undefined,
    image: p.image || undefined,
    imageAlt: p.imageAlt || undefined,
  };
}

/** Every project in the file, drafts included — for the admin panel. */
export const allProjects: Project[] = (data.projects as unknown[])
  .map(normalizeProject)
  .sort((a, b) => a.order - b.order);

/** What the public site renders. */
export const projects: Project[] = allProjects.filter((p) => p.published);

export const featuredProjects = projects.filter((p) => p.featured);
export const secondaryProjects = projects.filter((p) => !p.featured);
