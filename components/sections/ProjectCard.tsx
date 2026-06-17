"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Panel } from "@/components/ui/Panel";
import { flagMeta, type Project } from "@/lib/site";

export function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  const flag = flagMeta[project.flag];

  return (
    <motion.div variants={fadeUp} className="h-full">
      <Panel
        as="article"
        interactive
        className="flex h-full flex-col p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-mono text-lg font-semibold text-fg">
              {project.title}
            </h3>
            <p className="font-mono text-xs text-comment">{project.kicker}</p>
          </div>
          <span
            className={`flex-none rounded-full border border-border px-2 py-0.5 font-mono text-[10px] ${flag.color}`}
          >
            {flag.label}
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted">
          {project.summary}
        </p>

        {featured ? (
          <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <Row term="problem" desc={project.problem} />
            <Row term="solution" desc={project.solution} />
            {project.impact ? <Row term="impact" desc={project.impact} accent /> : null}
          </dl>
        ) : null}

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <li
              key={s}
              className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted"
            >
              {s}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-3">
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
            <p className="font-mono text-[11px] text-comment">
              <span className="text-amber">●</span> {project.privateNote}
            </p>
          ) : null}
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
    <div className="grid grid-cols-[5rem_1fr] gap-2">
      <dt className="font-mono text-xs text-comment">{term}</dt>
      <dd className={accent ? "text-fg" : "text-muted"}>{desc}</dd>
    </div>
  );
}
