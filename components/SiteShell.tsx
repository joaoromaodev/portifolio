import { Nav } from "@/components/Nav";
import { Hero } from "@/components/hero/Hero";
import { LiveDashboard } from "@/components/dashboard/LiveDashboard";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/Footer";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { getDictionary, type Locale } from "@/lib/i18n";
import { resumeHref } from "@/lib/resume";

// The whole page, once per locale. `/` and `/pt` are separate static routes
// that render this with a different dictionary — nothing about the language is
// decided at runtime, so both are plain prerendered HTML.
export function SiteShell({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  // Resolved on the server at build time — the CV CTAs only render once this
  // locale's PDF actually exists in public/.
  const resume = resumeHref(locale);

  return (
    <LocaleProvider locale={locale} dict={dict}>
      {/* Lives here rather than in the root layout so it speaks the page's
          language — a root layout can't know which locale is rendering. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:border focus:border-green/50 focus:bg-surface focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-green"
      >
        {dict.a11y.skipToContent}
      </a>
      <Nav />
      <main id="main-content">
        <Hero resume={resume} />
        <LiveDashboard />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact resume={resume} />
      </main>
      <Footer />
      <CommandPalette />
    </LocaleProvider>
  );
}
