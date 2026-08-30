import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { profile } from "@/lib/site";
import { siteUrl } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n";
import { DEFAULT_LOCALE, LANGUAGE_ALTERNATES } from "@/lib/i18n/config";
import { THEME_BOOTSTRAP } from "@/lib/theme";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const base = getDictionary(DEFAULT_LOCALE);

// Site-wide defaults. Each locale page overrides title/description/OG through
// lib/i18n/metadata.ts.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: base.meta.title,
    template: "%s · João Romão",
  },
  description: base.meta.description,
  applicationName: "João Romão — Portfolio",
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  alternates: { canonical: "/", languages: LANGUAGE_ALTERNATES },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

// Structured data so search engines resolve "João Romão" to a person with a
// role, a location and verified profiles — not just a page of text.
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: base.profile.role,
  description: base.meta.ogDescription,
  url: siteUrl,
  email: `mailto:${profile.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Belém",
    addressRegion: "PA",
    addressCountry: "BR",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Universidade Cruzeiro do Sul",
  },
  knowsLanguage: ["pt-BR", "en"],
  knowsAbout: [
    "Data analysis",
    "Python automation",
    "Next.js",
    "React",
    "TypeScript",
    "PostgreSQL",
  ],
  sameAs: [profile.links.linkedin, profile.links.github],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: THEME_BOOTSTRAP rewrites data-theme (and, on
    // /pt, lang) before React hydrates, which is the whole point — it must run
    // before first paint. lang="en" is the correct no-JS default for `/`.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body className="min-h-full">
        {children}
        <script
          type="application/ld+json"
          // Serialised from a local object literal — no user input involved.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
