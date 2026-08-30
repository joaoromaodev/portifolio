import type { Metadata } from "next";
import { getDictionary } from "./index";
import { PROJECTS_INDEX, type Locale } from "./config";
import { siteUrl } from "../seo";

// Metadata for the "all projects" index, one per locale.
export function projectsIndexMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  const path = PROJECTS_INDEX[locale];

  return {
    title: { absolute: `${dict.projects.indexTitle} · João Romão` },
    description: dict.projects.indexSubtitle,
    alternates: {
      canonical: path,
      languages: {
        "en-US": PROJECTS_INDEX.en,
        "pt-BR": PROJECTS_INDEX.pt,
        "x-default": PROJECTS_INDEX.en,
      },
    },
    openGraph: {
      title: dict.projects.indexTitle,
      description: dict.projects.indexSubtitle,
      url: `${siteUrl}${path}`,
      type: "website",
      locale: dict.ogLocale,
    },
  };
}
