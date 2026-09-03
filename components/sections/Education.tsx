"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp } from "@/lib/motion";
import { Panel } from "@/components/ui/Panel";
import { useI18n } from "@/components/i18n/LocaleProvider";

// Deliberately a panel of rows rather than a second timeline: Experience
// already owns that shape, and two of them would imply the two sections
// carry the same weight. Studies are supporting evidence here, not the
// argument — the section sits after Skills for the same reason.
export function Education() {
  const { dict } = useI18n();
  const { items, extras } = dict.education;

  return (
    <Section id="education">
      <SectionHeader
        id={dict.education.slug}
        title={dict.education.title}
        subtitle={dict.education.subtitle}
      />

      <motion.div variants={fadeUp}>
        <Panel className="divide-y divide-border">
          {items.map((item) => (
            <div
              key={item.degree}
              className="grid gap-x-6 gap-y-1 px-5 py-4 sm:grid-cols-[11rem_1fr]"
            >
              <p className="font-mono text-xs text-amber sm:pt-0.5">
                {item.period}
              </p>
              <div className="min-w-0">
                <h3 className="font-mono text-sm font-semibold text-fg">
                  {item.degree}
                </h3>
                <p className="font-mono text-sm text-cyan">{item.org}</p>
                <p className="mt-1.5 text-sm text-muted">{item.note}</p>
              </div>
            </div>
          ))}
        </Panel>
      </motion.div>

      <motion.ul variants={fadeUp} className="mt-4 grid gap-3 sm:grid-cols-2">
        {extras.map((extra) => (
          <li
            key={extra.label}
            className="rounded-lg border border-border bg-surface/60 px-4 py-3"
          >
            <p className="font-mono text-xs text-purple">{extra.label}</p>
            <p className="mt-1 text-sm text-muted">{extra.value}</p>
          </li>
        ))}
      </motion.ul>
    </Section>
  );
}
