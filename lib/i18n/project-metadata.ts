import type { Metadata } from "next";
import { getDictionary } from "./index";
import { projectPath, t, type Locale } from "./config";
import { siteUrl } from "../seo";
import type { Project } from "../projects";

// Metadata for one project's case-study page. Each locale's page declares its
// own canonical and points hreflang at its counterpart, exactly like the two
// home pages do.
export function projectMetadata(project: Project, locale: Locale): Metadata {
  const dict = getDictionary(locale);
  const title = dict.projectDetail.metaTitle.replace("{title}", project.title);
  const description = t(project.summary, locale);
  const path = projectPath(locale, project.slug);

  return {
    title: { absolute: `${title} · ${dict.meta.title.split(" — ")[0]}` },
    description,
    alternates: {
      canonical: path,
      languages: {
        "en-US": projectPath("en", project.slug),
        "pt-BR": projectPath("pt", project.slug),
        "x-default": projectPath("en", project.slug),
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${path}`,
      type: "article",
      locale: dict.ogLocale,
      // The card screenshot doubles as the social image when there is one.
      ...(project.image ? { images: [{ url: project.image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(project.image ? { images: [project.image] } : {}),
    },
  };
}
