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

      <motion.div
        variants={stagger}
        {...inView}
        className="grid gap-4 md:grid-cols-3"
      >
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

      {/*
        5 cards don't divide evenly into 2 or 3 columns — a plain grid would
        leave a hole at the end of the last row. Flex-wrap + justify-center
        centers that incomplete row instead of leaving it ragged-left.
      */}
      <motion.div
        variants={stagger}
        {...inView}
        className="flex flex-wrap justify-center gap-4"
      >
        {secondary.map((p) => (
          <div
            key={p.slug}
            className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]"
          >
            <ProjectCard project={p} />
          </div>
        ))}
      </motion.div>
    </Section>
  );
}
