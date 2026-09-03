import { existsSync } from "node:fs";
import path from "node:path";
import { RESUME_PATHS } from "./site";
import type { Locale } from "./i18n";

// Server-only: the CVs are plain files in public/. Drop one in and its
// language's download CTAs appear on the next build; until then they stay
// hidden, so the site never offers a link that 404s. Resolve this in a Server
// Component and pass the href down — a client component can't read the disk.
export function resumeHref(locale: Locale): string | null {
  const href = RESUME_PATHS[locale];
  const file = path.join(process.cwd(), "public", href.slice(1));
  return existsSync(file) ? href : null;
}
