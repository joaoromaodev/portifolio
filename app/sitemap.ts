import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { LOCALES, localePath } from "@/lib/i18n/config";

// One entry per locale. The sections are anchors, and search engines don't
// index fragments separately, so each language page is a single URL — with an
// `alternates.languages` map pointing at its counterpart.
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${siteUrl}${path === "/" ? "" : path}`;
  const languages = Object.fromEntries(
    LOCALES.map((l) => [l === "pt" ? "pt-BR" : "en-US", url(localePath(l))]),
  );

  return LOCALES.map((locale) => ({
    url: url(localePath(locale)),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: locale === "en" ? 1 : 0.9,
    alternates: { languages },
  }));
}
