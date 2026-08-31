import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { getDictionary, type Locale } from "@/lib/i18n";
import { DEFAULT_LOCALE, localePath, PROJECTS_INDEX } from "@/lib/i18n/config";
import { featuredProjects, secondaryProjects } from "@/lib/projects";

// The "see all projects" page. The home page trades depth for scannability —
// a grid of four tiles — so this is where the full problem → solution → impact
// reasoning lives for every project, including the ones that don't have enough
// material for a case-study page of their own.
export function ProjectsIndex({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const copy = dict.projects;
  const other: Locale = locale === DEFAULT_LOCALE ? "pt" : DEFAULT_LOCALE;

  return (
    <LocaleProvider
      locale={locale}
      dict={dict}
      altPath={PROJECTS_INDEX[other]}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:border focus:border-green/50 focus:bg-surface focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-green"
      >
        {dict.a11y.skipToContent}
      </a>
      <Nav />

      <main
        id="main-content"
        className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24"
      >
        <Link
          href={localePath(locale)}
          className="font-mono text-sm text-comment transition-colors hover:text-green"
        >
          ← {dict.projectDetail.backHome}
        </Link>

        <header className="mb-10 mt-8">
          <p className="font-mono text-sm text-comment">{`// ${copy.indexSlug}`}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
            {copy.indexTitle}
          </h1>
          <p className="mt-2 max-w-2xl text-muted">{copy.indexSubtitle}</p>
        </header>

        <div className="space-y-4">
          {featuredProjects.map((p) => (
            <ProjectCard key={p.slug} project={p} featured />
          ))}
        </div>

        {secondaryProjects.length ? (
          <>
            <p className="mb-4 mt-12 font-mono text-sm text-comment">
              {`// ${copy.more}`}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {secondaryProjects.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </>
        ) : null}
      </main>

      <Footer />
    </LocaleProvider>
  );
}
