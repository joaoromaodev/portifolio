"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { stagger, inView } from "@/lib/motion";
import { featuredProjects, secondaryProjects } from "@/lib/site";
import { ProjectCard } from "./ProjectCard";

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeader
        id="projects"
        title="Selected work"
        subtitle="Real systems, mostly in production. Strongest first. Government work is shown as a case study only — no real data, no private code."
      />

      {/* Featured — full-width case-study rows, strongest first. Stacked
          rows give each anchor project room to state problem → solution →
          impact without ballooning into tall columns. */}
      <motion.div variants={stagger} {...inView} className="space-y-4">
        {featuredProjects.map((p) => (
          <ProjectCard key={p.slug} project={p} featured />
        ))}
      </motion.div>

      {secondaryProjects.length > 0 ? (
        <>
          <motion.p
            variants={stagger}
            {...inView}
            className="mb-4 mt-12 font-mono text-sm text-comment"
          >
            {"// more projects"}
          </motion.p>

          {/* Secondary — compact tiles in a two-column grid. */}
          <motion.div
            variants={stagger}
            {...inView}
            className="grid gap-4 sm:grid-cols-2"
          >
            {secondaryProjects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </motion.div>
        </>
      ) : null}
    </Section>
  );
}
