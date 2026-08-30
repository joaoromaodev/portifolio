import { existsSync } from "node:fs";
import path from "node:path";
import { RESUME_PATH } from "./site";

// Server-only: the CV is a plain file in public/. Drop the PDF in and the
// download CTAs appear on the next build; until then they stay hidden, so the
// site never offers a link that 404s. Resolve this in a Server Component and
// pass the boolean down — client components import RESUME_PATH from lib/site.
export function hasResume(): boolean {
  return existsSync(path.join(process.cwd(), "public", RESUME_PATH.slice(1)));
}
