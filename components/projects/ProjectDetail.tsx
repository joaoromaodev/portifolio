import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { Gallery } from "./Gallery";
import { getDictionary, type Locale } from "@/lib/i18n";
import {
  DEFAULT_LOCALE,
  projectPath,
  PROJECTS_INDEX,
  t,
} from "@/lib/i18n/config";
import { flagColor, type Project } from "@/lib/projects";

// One case-study page per project, rendered once per locale. Everything comes
// from content/projects.json, so a project gets a page the moment it has a
// gallery, engineering notes or an overview — and none before that.
export function ProjectDetail({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const copy = dict.projectDetail;
  const tx = (v: Parameters<typeof t>[0]) => t(v, locale);
  const other: Locale = locale === DEFAULT_LOCALE ? "pt" : DEFAULT_LOCALE;

  return (
    <LocaleProvider
      locale={locale}
      dict={dict}
      altPath={projectPath(other, project.slug)}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:border focus:border-green/50 focus:bg-surface focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-green"
      >
        {dict.a11y.skipToContent}
      </a>
      <Nav />

      <main id="main-content" className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24">
        <Link
          href={PROJECTS_INDEX[locale]}
          className="font-mono text-sm text-comment transition-colors hover:text-green"
        >
          ← {copy.back}
        </Link>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-3xl font-semibold tracking-tight text-fg md:text-4xl">
              {project.title}
            </h1>
            <span
              className={`rounded-full border border-border px-2 py-0.5 font-mono text-[10px] ${flagColor[project.flag]}`}
            >
              {dict.projects.flags[project.flag]}
            </span>
          </div>
          <p className="mt-1 font-mono text-sm text-comment">
            {tx(project.kicker)}
          </p>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg/90">
            {tx(project.summary)}
          </p>

          <ul className="mt-6 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <li
                key={s}
                className="rounded border border-border px-2 py-1 font-mono text-[11px] text-muted"
              >
                {s}
              </li>
            ))}
          </ul>

          {project.links.length || project.privateNote ? (
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              {project.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-green/40 px-4 py-2 font-mono text-sm text-green transition-colors hover:bg-green/10"
                >
                  {l.label} ↗
                </a>
              ))}
              {project.privateNote ? (
                <p className="font-mono text-[11px] text-muted">
                  <span className="text-amber">●</span> {tx(project.privateNote)}
                </p>
              ) : null}
            </div>
          ) : null}
        </header>

        {/* problem → solution → impact, the same spine as the card */}
        <Section title={copy.theCase}>
          <dl className="space-y-4">
            <Row term={dict.projects.terms.problem} desc={tx(project.problem)} />
            <Row term={dict.projects.terms.solution} desc={tx(project.solution)} />
            {project.impact ? (
              <Row
                term={dict.projects.terms.impact}
                desc={tx(project.impact)}
                accent
              />
            ) : null}
          </dl>
        </Section>

        {project.role ? (
          <Section title={copy.role}>
            <p className="max-w-2xl leading-relaxed text-muted">
              {tx(project.role)}
            </p>
          </Section>
        ) : null}

        {project.overview ? (
          <Section title={copy.overview}>
            <div className="max-w-2xl space-y-4 leading-relaxed text-muted">
              {tx(project.overview)
                .split("\n\n")
                .map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
            </div>
          </Section>
        ) : null}

        {project.highlights.length ? (
          <Section title={copy.highlights}>
            <ul className="space-y-6">
              {project.highlights.map((h, i) => (
                <li key={i} className="max-w-2xl border-l border-border pl-5">
                  <h3 className="font-mono text-sm font-semibold text-fg">
                    {tx(h.title)}
                  </h3>
                  <p className="mt-1.5 leading-relaxed text-muted">{tx(h.body)}</p>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {project.gallery.length ? (
          <Section title={copy.gallery}>
            <Gallery items={project.gallery} />
          </Section>
        ) : null}

        <div className="mt-16 border-t border-border pt-8">
          <Link
            href={PROJECTS_INDEX[locale]}
            className="font-mono text-sm text-green transition-colors hover:underline"
          >
            ← {copy.back}
          </Link>
        </div>
      </main>

      <Footer />
    </LocaleProvider>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14">
      <h2 className="mb-5 font-mono text-sm text-comment">{`// ${title}`}</h2>
      {children}
    </section>
  );
}

function Row({
  term,
  desc,
  accent = false,
}: {
  term: string;
  desc: string;
  accent?: boolean;
}) {
  return (
    <div className="grid max-w-2xl gap-1 sm:grid-cols-[6rem_1fr] sm:gap-4">
      <dt className="font-mono text-xs leading-6 text-comment">{term}</dt>
      <dd className={`leading-relaxed ${accent ? "text-fg" : "text-muted"}`}>
        {desc}
      </dd>
    </div>
  );
}
