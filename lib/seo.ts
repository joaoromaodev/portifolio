// Canonical origin for metadata, sitemap, robots and JSON-LD.
// Server-side only — keep it out of client bundles so the non-public Vercel
// env vars below never leak into the browser build.
//
// Precedence: an explicit NEXT_PUBLIC_SITE_URL (set this once a custom domain
// is live) → the Vercel production URL → the current preview deployment → the
// local dev server.
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit;

  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prod) return `https://${prod}`;

  const preview = process.env.VERCEL_URL;
  if (preview) return `https://${preview}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl().replace(/\/+$/, "");

export const OG = {
  title: "João Romão — Data Analyst & Developer",
  description:
    "A living dashboard about me: real-time data, Python automation and full-stack Next.js. Open to remote work and relocation.",
} as const;
