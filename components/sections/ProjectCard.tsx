"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Panel } from "@/components/ui/Panel";
import { flagColor, type Project } from "@/lib/site";
import { hasDetailPage } from "@/lib/projects";
import { projectPath } from "@/lib/i18n/config";
import { useI18n } from "@/components/i18n/LocaleProvider";

// Two shapes, one card language: featured projects are full-width horizontal
// case studies (identity left, problem→solution→impact right); secondary
// projects are compact tiles with just the pitch.
export function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  return featured ? (
    <FeaturedCard project={project} />
  ) : (
    <CompactCard project={project} />
  );
}

function FlagChip({ project }: { project: Project }) {
  const { dict } = useI18n();
  return (
    <span
      className={`flex-none rounded-full border border-border px-2 py-0.5 font-mono text-[10px] ${flagColor[project.flag]}`}
    >
      {dict.projects.flags[project.flag]}
    </span>
  );
}

function StackChips({ stack }: { stack: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {stack.map((s) => (
        <li
          key={s}
          className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted"
        >
          {s}
        </li>
      ))}
    </ul>
  );
}

// The title is the link to the case study — but only for projects that have
// one, so a card never promises a page that doesn't exist.
function ProjectTitleLink({ project }: { project: Project }) {
  const { locale } = useI18n();
  if (!hasDetailPage(project)) return <>{project.title}</>;
  return (
    <Link
      href={projectPath(locale, project.slug)}
      className="transition-colors hover:text-green"
    >
      {project.title}
    </Link>
  );
}

function CardLinks({ project }: { project: Project }) {
  const { dict, locale, tx } = useI18n();
  const detail = hasDetailPage(project);
  if (!detail && !project.links?.length && !project.privateNote) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      {detail ? (
        <Link
          href={projectPath(locale, project.slug)}
          className="font-mono text-xs text-cyan transition-colors hover:underline"
        >
          {dict.projectDetail.caseStudy} →
        </Link>
      ) : null}
      {project.links?.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-xs text-green transition-colors hover:underline"
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
  );
}

function FeaturedCard({ project }: { project: Project }) {
  const { dict, tx } = useI18n();
  const terms = dict.projects.terms;

  return (
    <motion.div variants={fadeUp}>
      <Panel
        as="article"
        interactive
        className="grid gap-x-8 gap-y-5 p-6 md:grid-cols-[1fr_1.4fr]"
      >
        {/* Identity — who this project is */}
        <div className="flex min-w-0 flex-col gap-4">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-mono text-xl font-semibold text-fg">
                <ProjectTitleLink project={project} />
              </h3>
              <FlagChip project={project} />
            </div>
            <p className="font-mono text-xs text-comment">{tx(project.kicker)}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              {tx(project.summary)}
            </p>
          </div>
          <div className="mt-auto space-y-3">
            <StackChips stack={project.stack} />
            <CardLinks project={project} />
          </div>
        </div>

        {/* Case study — the reasoning, in a quiet column */}
        <dl className="space-y-3 border-t border-border pt-5 text-sm md:border-l md:border-t-0 md:pl-8 md:pt-0">
          <Row term={terms.problem} desc={tx(project.problem)} />
          <Row term={terms.solution} desc={tx(project.solution)} />
          {project.impact ? (
            <Row term={terms.impact} desc={tx(project.impact)} accent />
          ) : null}
        </dl>
      </Panel>
    </motion.div>
  );
}

function CompactCard({ project }: { project: Project }) {
  const { tx } = useI18n();

  return (
    <motion.div variants={fadeUp} className="h-full">
      <Panel as="article" interactive className="flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-mono text-base font-semibold text-fg">
              <ProjectTitleLink project={project} />
            </h3>
            <p className="font-mono text-xs text-comment">{tx(project.kicker)}</p>
          </div>
          <FlagChip project={project} />
        </div>

        <p className="mt-2.5 text-sm leading-relaxed text-muted">
          {tx(project.summary)}
        </p>

        <div className="mt-auto space-y-2.5 pt-4">
          <StackChips stack={project.stack} />
          <CardLinks project={project} />
        </div>
      </Panel>
    </motion.div>
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
    <div className="grid grid-cols-[4.5rem_1fr] gap-2">
      <dt className="font-mono text-xs leading-5 text-comment">{term}</dt>
      <dd className={accent ? "text-fg" : "text-muted"}>{desc}</dd>
    </div>
  );
}
