"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Panel } from "@/components/ui/Panel";
import { flagColor, hasDetailPage, type Project } from "@/lib/projects";
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
      <Thumb project={project} />

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

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
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
    <motion.div variants={fadeUp} className="h-full">
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

// A screenshot when there is one; otherwise a deliberate placeholder in the
// site's own terminal idiom, rather than an empty frame. Most projects here
// can't publish screenshots at all (private gov systems), so the fallback is
// the normal case, not an error state.
function Thumb({ project }: { project: Project }) {
  const { tx } = useI18n();

  if (project.image) {
    return (
      <div className="relative aspect-[16/6] w-full flex-none overflow-hidden border-b border-border bg-bg">
        <Image
          src={project.image}
          alt={tx(project.imageAlt) || `${project.title} — ${tx(project.kicker)}`}
          fill
          sizes="(min-width: 768px) 45vw, 92vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="relative flex aspect-[16/6] w-full flex-none items-center justify-center overflow-hidden border-b border-border bg-bg"
    >
      {/* the same grid motif as the hero, held very quiet */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--color-border) 90%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-border) 90%, transparent) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <p className="relative font-mono text-sm text-comment">
        <span className={flagColor[project.flag]}>$</span> {project.slug}
      </p>
    </div>
  );
}
