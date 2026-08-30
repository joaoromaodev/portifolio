"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { stagger, inView, fadeUp } from "@/lib/motion";
import { homeProjects, projects } from "@/lib/site";
import { PROJECTS_INDEX } from "@/lib/i18n/config";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { ProjectTile } from "./ProjectTile";

// The front page shows the featured work only, as an even grid — enough to
// judge the range at a glance without three screens of scrolling. The full
// list, with the problem → solution → impact reasoning, is one click away.
export function Projects() {
  const { dict, locale } = useI18n();

  return (
    <Section id="projects">
      <SectionHeader
        id={dict.projects.slug}
        title={dict.projects.title}
        subtitle={dict.projects.subtitle}
      />

      <motion.div
        variants={stagger}
        {...inView}
        className="grid gap-4 sm:grid-cols-2"
      >
        {homeProjects.map((p) => (
          <ProjectTile key={p.slug} project={p} />
        ))}
      </motion.div>

      <motion.div variants={fadeUp} {...inView} className="mt-8">
        <Link
          href={PROJECTS_INDEX[locale]}
          className="inline-flex items-center gap-2 rounded-lg border border-green/40 px-5 py-2.5 font-mono text-sm text-green transition-colors hover:bg-green/10"
        >
          {dict.projects.seeAll}
          <span className="text-comment">
            ({dict.projects.count.replace("{n}", String(projects.length))})
          </span>
          →
        </Link>
      </motion.div>
    </Section>
  );
}
