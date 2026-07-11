"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { stagger, inView } from "@/lib/motion";
import { projects } from "@/lib/site";
import { ProjectCard } from "./ProjectCard";

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  const secondary = projects.filter((p) => !p.featured);

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
        {featured.map((p) => (
          <ProjectCard key={p.slug} project={p} featured />
        ))}
      </motion.div>

      <motion.p
        variants={stagger}
        {...inView}
        className="mb-4 mt-12 font-mono text-sm text-comment"
      >
        {"// more projects"}
      </motion.p>

      {/* Secondary — 4 compact tiles, an even 2×2. */}
      <motion.div
        variants={stagger}
        {...inView}
        className="grid gap-4 sm:grid-cols-2"
      >
        {secondary.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </motion.div>
    </Section>
  );
}
