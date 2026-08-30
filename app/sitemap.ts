import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import {
  LOCALES,
  localePath,
  projectPath,
  PROJECTS_INDEX,
} from "@/lib/i18n/config";
import { detailProjects } from "@/lib/projects";

// Every page in both languages: the two home pages, plus one case-study page
// per project that has one. Each entry carries the `alternates.languages` map
// so search engines pair the locales instead of treating them as duplicates.
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${siteUrl}${path === "/" ? "" : path}`;
  const lang = (l: (typeof LOCALES)[number]) => (l === "pt" ? "pt-BR" : "en-US");

  const home: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: url(localePath(locale)),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: locale === "en" ? 1 : 0.9,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((l) => [lang(l), url(localePath(l))]),
      ),
    },
  }));

  const index: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: url(PROJECTS_INDEX[locale]),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: locale === "en" ? 0.9 : 0.8,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((l) => [lang(l), url(PROJECTS_INDEX[l])]),
      ),
    },
  }));

  const projects: MetadataRoute.Sitemap = detailProjects().flatMap((project) =>
    LOCALES.map((locale) => ({
      url: url(projectPath(locale, project.slug)),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: locale === "en" ? 0.8 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [lang(l), url(projectPath(l, project.slug))]),
        ),
      },
    })),
  );

  return [...home, ...index, ...projects];
}
