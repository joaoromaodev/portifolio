"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp } from "@/lib/motion";
import { experience } from "@/lib/site";

export function Experience() {
  return (
    <Section id="experience">
      <SectionHeader
        id="experience"
        title="From intern to tech lead"
        subtitle="~2.5 years inside the Pará State Department of Education (SEDUC-PA) — same institution, growing scope."
      />

      <ol className="relative border-l border-border pl-6">
        {experience.map((job) => (
          <motion.li
            key={job.role}
            variants={fadeUp}
            className="relative mb-9 last:mb-0"
          >
            <span className="absolute -left-[1.65rem] top-1.5 size-3 rounded-full border-2 border-bg bg-green" />
            <p className="font-mono text-xs text-amber">{job.period}</p>
            <h3 className="mt-1 font-mono text-base font-semibold text-fg">
              {job.role}
            </h3>
            <p className="font-mono text-sm text-cyan">{job.org}</p>
            <p className="mt-1.5 max-w-2xl text-sm text-muted">{job.note}</p>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
