import type { Metadata } from "next";
import { getDictionary, localePath, type Locale } from "./index";
import { LANGUAGE_ALTERNATES } from "./config";
import { siteUrl } from "../seo";

// Per-locale page metadata. Both pages advertise the same `hreflang` map, so
// each tells search engines where its counterpart lives, and each declares its
// own URL as canonical — no duplicate-content ambiguity between `/` and `/pt`.
export function localeMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  const path = localePath(locale);

  return {
    // `absolute` opts out of the root layout's "%s · João Romão" template —
    // the locale title already ends with his name.
    title: { absolute: dict.meta.title },
    description: dict.meta.description,
    keywords: dict.meta.keywords,
    alternates: {
      canonical: path,
      languages: LANGUAGE_ALTERNATES,
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.ogDescription,
      url: `${siteUrl}${path === "/" ? "" : path}`,
      siteName: dict.meta.title,
      type: "website",
      locale: dict.ogLocale,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.ogDescription,
    },
  };
}
