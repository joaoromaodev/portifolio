// Two locales, two statically-generated pages: English at `/` (the primary
// audience, and the URL already shared publicly) and Portuguese at `/pt`.
// No middleware and no auto-redirect — the language toggle in the nav is the
// only switch, so both URLs stay stable and independently indexable.

export const LOCALES = ["en", "pt"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Site-root-relative path for a locale. English lives at `/`. */
export function localePath(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "/" : `/${locale}`;
}

/**
 * Per-project detail page. The path segment is translated too — the folders are
 * separate routes anyway (app/projects vs app/pt/projetos), so a Portuguese URL
 * costs nothing and reads properly to a Brazilian visitor.
 */
export function projectPath(locale: Locale, slug: string): string {
  return locale === "pt" ? `/pt/projetos/${slug}` : `/projects/${slug}`;
}

/** The `hreflang` map both pages advertise, so each points at the other. */
export const LANGUAGE_ALTERNATES: Record<string, string> = {
  "en-US": "/",
  "pt-BR": "/pt",
  "x-default": "/",
};

// Text that differs per locale in the project catalogue. `pt` is optional so a
// project can be added in English first and translated later without the site
// falling over — an empty translation transparently falls back to English.
export type LocalizedText = { en: string; pt?: string };

export function t(value: LocalizedText | undefined, locale: Locale): string {
  if (!value) return "";
  if (locale === "pt") return value.pt?.trim() || value.en;
  return value.en;
}
