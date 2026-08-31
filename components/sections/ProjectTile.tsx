"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Panel } from "@/components/ui/Panel";
import { flagColor, hasDetailPage, type Project } from "@/lib/projects";
import { ProjectThumb } from "@/components/sections/ProjectThumb";
import { projectPath } from "@/lib/i18n/config";
import { useI18n } from "@/components/i18n/LocaleProvider";

// Compact grid card for the home page: one thumbnail, the pitch, the stack.
// The full problem → solution → impact reasoning lives on /projects and on each
// project's own case-study page, so the front page stays skimmable.
export function ProjectTile({ project }: { project: Project }) {
  const { dict, locale, tx } = useI18n();
  const detail = hasDetailPage(project);
  const href = detail ? projectPath(locale, project.slug) : null;

  const body = (
    <>
      <ProjectThumb
        project={project}
        sizes="(min-width: 768px) 45vw, 92vw"
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-mono text-base font-semibold text-fg">
              {project.title}
            </h3>
            <p className="truncate font-mono text-xs text-comment">
              {tx(project.kicker)}
            </p>
          </div>
          <span
            className={`flex-none rounded-full border border-border px-2 py-0.5 font-mono text-[10px] ${flagColor[project.flag]}`}
          >
            {dict.projects.flags[project.flag]}
          </span>
        </div>

        {/* Clamped only in the two-column grid, where tiles sit side by side
            and uneven text would misalign them. In one column there is nothing
            to align against, so the pitch runs in full — no ellipsis, and no
            fighting the fact that Portuguese runs ~20% longer than English. */}
        <p className="mt-3 text-sm leading-relaxed text-muted sm:line-clamp-4">
          {tx(project.summary)}
        </p>

        <ul className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {project.stack.slice(0, 4).map((s) => (
            <li
              key={s}
              className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted"
            >
              {s}
            </li>
          ))}
          {project.stack.length > 4 ? (
            <li className="px-1 py-0.5 font-mono text-[10px] text-comment">
              +{project.stack.length - 4}
            </li>
          ) : null}
        </ul>

        {detail ? (
          <p className="mt-3 font-mono text-xs text-cyan">
            {dict.projectDetail.caseStudy} →
          </p>
        ) : null}
      </div>
    </>
  );

  return (
    // min-w-0: a grid item defaults to min-width:auto, so the kicker's
    // `truncate` (white-space: nowrap) sets a min-content floor wider than the
    // track and pushes the whole page into horizontal scroll on mobile.
    <motion.div variants={fadeUp} className="h-full min-w-0">
      {href ? (
        // The whole tile is the link when there's a page to go to.
        <Link href={href} className="group block h-full">
          <Panel
            as="article"
            interactive
            className="flex h-full flex-col overflow-hidden"
          >
            {body}
          </Panel>
        </Link>
      ) : (
        <Panel
          as="article"
          className="flex h-full flex-col overflow-hidden border-border"
        >
          {body}
        </Panel>
      )}
    </motion.div>
  );
}
