// Project catalogue. The data lives in content/projects.json so it can be
// edited through the local admin panel (/admin, dev-only) without touching
// code. The JSON is imported statically, so the site stays fully static —
// there is no database and no runtime read.
//
// Text fields are bilingual: `{ en, pt }`. `pt` is optional and falls back to
// `en`, so a project can be added in English and translated later without the
// Portuguese page breaking.
import data from "@/content/projects.json";
import type { LocalizedText } from "./i18n/config";

export type ProjectFlag = "case-study" | "live" | "building" | "award" | "side";

export type ProjectLink = { label: string; href: string };

/** One screenshot (or animated GIF) on a project's detail page. */
export type GalleryItem = {
  /** Path under /public, e.g. "/projects/balcao/painel.png". */
  src: string;
  /** Required — this is what screen readers announce. */
  alt: LocalizedText;
  /** Optional caption shown under the image. */
  caption?: LocalizedText;
};

/** An engineering decision worth explaining — the interview material. */
export type ProjectHighlight = {
  title: LocalizedText;
  body: LocalizedText;
};

export type Project = {
  slug: string;
  /** Product name — the same in both languages. */
  title: string;
  kicker: LocalizedText;
  flag: ProjectFlag;
  /** Featured projects render as full-width case-study rows, strongest first. */
  featured: boolean;
  /** Unpublished projects are drafts — kept in the file, hidden from the site. */
  published: boolean;
  /** Sort key within each group; lower comes first. */
  order: number;
  summary: LocalizedText;
  problem: LocalizedText;
  solution: LocalizedText;
  impact?: LocalizedText;
  /** Technology names — not translated. */
  stack: string[];
  links: ProjectLink[];
  /** Shown instead of a repo link when the code can't be published. */
  privateNote?: LocalizedText;
  /** Screenshot under /public, e.g. "/projects/simf.png". */
  image?: string;
  /** Alt text for the screenshot — required whenever `image` is set. */
  imageAlt?: LocalizedText;
  /** What João did on this project, for the detail page. */
  role?: LocalizedText;
  /** Longer narrative shown only on the detail page. */
  overview?: LocalizedText;
  highlights: ProjectHighlight[];
  gallery: GalleryItem[];
};

export const FLAGS: ProjectFlag[] = [
  "case-study",
  "live",
  "building",
  "award",
  "side",
];

// Flag → accent colour. The visible label comes from the dictionary, so the
// badge reads "case study" in English and "estudo de caso" in Portuguese.
export const flagColor: Record<ProjectFlag, string> = {
  "case-study": "text-purple",
  live: "text-green",
  building: "text-amber",
  award: "text-cyan",
  side: "text-muted",
};

// Accepts a bare string as well as `{ en, pt }` so hand-edited or older
// entries keep working — a plain string is read as English.
function localized(raw: unknown): LocalizedText {
  if (typeof raw === "string") return { en: raw };
  if (raw && typeof raw === "object") {
    const v = raw as Partial<LocalizedText>;
    return { en: v.en ?? "", pt: v.pt?.trim() || undefined };
  }
  return { en: "" };
}

/** `undefined` when there's no text in either language, so callers can skip it. */
function optionalLocalized(raw: unknown): LocalizedText | undefined {
  const value = localized(raw);
  return value.en || value.pt ? value : undefined;
}

// Fill in defaults for fields the admin may omit, so hand-edited JSON and
// panel-written JSON behave identically.
export function normalizeProject(raw: unknown, index = 0): Project {
  const p = raw as Record<string, unknown>;
  return {
    slug: (p.slug as string) ?? `project-${index}`,
    title: (p.title as string) ?? "Untitled",
    kicker: localized(p.kicker),
    flag: FLAGS.includes(p.flag as ProjectFlag)
      ? (p.flag as ProjectFlag)
      : "side",
    featured: p.featured === true,
    published: p.published !== false,
    order: typeof p.order === "number" ? p.order : index,
    summary: localized(p.summary),
    problem: localized(p.problem),
    solution: localized(p.solution),
    impact: optionalLocalized(p.impact),
    stack: Array.isArray(p.stack) ? (p.stack as string[]) : [],
    links: Array.isArray(p.links)
      ? (p.links as ProjectLink[]).filter((l) => l?.href && l?.label)
      : [],
    privateNote: optionalLocalized(p.privateNote),
    image: (p.image as string) || undefined,
    imageAlt: optionalLocalized(p.imageAlt),
    role: optionalLocalized(p.role),
    overview: optionalLocalized(p.overview),
    highlights: Array.isArray(p.highlights)
      ? (p.highlights as unknown[])
          .map((h) => {
            const raw = h as Record<string, unknown>;
            return { title: localized(raw.title), body: localized(raw.body) };
          })
          .filter((h) => h.title.en || h.body.en)
      : [],
    gallery: Array.isArray(p.gallery)
      ? (p.gallery as unknown[])
          .map((g) => {
            const raw = g as Record<string, unknown>;
            return {
              src: (raw.src as string) ?? "",
              alt: localized(raw.alt),
              caption: optionalLocalized(raw.caption),
            };
          })
          .filter((g) => g.src)
      : [],
  };
}

/**
 * A project earns its own page only when there's more to show than the card
 * already says — otherwise linking to it would promise depth that isn't there.
 */
export function hasDetailPage(p: Project): boolean {
  return p.gallery.length > 0 || p.highlights.length > 0 || Boolean(p.overview);
}

export function projectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Published projects that have a detail page — drives generateStaticParams. */
export function detailProjects(): Project[] {
  return projects.filter(hasDetailPage);
}

/** Every project in the file, drafts included — for the admin panel. */
export const allProjects: Project[] = (data.projects as unknown[])
  .map((p, i) => normalizeProject(p, i))
  .sort((a, b) => a.order - b.order);

/** What the public site renders. */
export const projects: Project[] = allProjects.filter((p) => p.published);

export const featuredProjects = projects.filter((p) => p.featured);
export const secondaryProjects = projects.filter((p) => !p.featured);
