import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { profile } from "@/lib/site";
import { OG, siteUrl } from "@/lib/seo";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: OG.title,
    template: "%s · João Romão",
  },
  description:
    "Portfolio of João Romão — a hybrid Data + Dev profile from Belém, Brazil. Python automation, real-time dashboards and full-stack Next.js. Open to remote / relocation.",
  applicationName: "João Romão — Portfolio",
  keywords: [
    "João Romão",
    "Data Analyst",
    "Developer",
    "Python automation",
    "Next.js",
    "Belém",
    "remote",
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    title: OG.title,
    description: OG.description,
    url: siteUrl,
    siteName: OG.title,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: OG.title,
    description: OG.description,
  },
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
  jobTitle: profile.role,
  description: OG.description,
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
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:border focus:border-green/50 focus:bg-surface focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-green"
        >
          Skip to content
        </a>
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
