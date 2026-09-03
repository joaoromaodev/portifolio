"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp } from "@/lib/motion";
import { useI18n } from "@/components/i18n/LocaleProvider";

export function Experience() {
  const { dict } = useI18n();
  const experience = dict.experience.items;

  return (
    <Section id="experience">
      <SectionHeader
        id={dict.experience.slug}
        title={dict.experience.title}
        subtitle={dict.experience.subtitle}
      />

      <ol className="relative border-l border-border pl-6">
        {experience.map((job) => (
          <motion.li
            key={job.role}
            variants={fadeUp}
            className="relative mb-9 last:mb-0"
          >
            {/* Sits on the rule, not near it: pull back the list's pl-6, then
                half the dot (6px) and half the 1px border, so the dot's centre
                and the rule's centre are the same x. The old hand-picked
                -1.65rem left it 4px to the right. */}
            <span className="absolute left-[calc(-1.5rem_-_6.5px)] top-1.5 size-3 rounded-full border-2 border-bg bg-green" />
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
