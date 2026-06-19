"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp } from "@/lib/motion";
import { about } from "@/lib/site";

export function About() {
  return (
    <Section id="about">
      <SectionHeader id="about" title="The human behind the dashboard" />

      <motion.div
        variants={fadeUp}
        className="max-w-2xl space-y-4 text-[17px] leading-relaxed text-fg/90"
      >
        {about.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </motion.div>

      {/* A quiet footnote, not a sidebar — a short tag list never balances a
          5-paragraph essay in a boxed 2-column layout, so it doesn't try. */}
      <motion.div variants={fadeUp} className="mt-8 max-w-2xl border-t border-border pt-6">
        <p className="font-mono text-sm text-comment">{"// beyond code"}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {about.beyondCode.map((item) => (
            <li
              key={item}
              className="rounded-md border border-border bg-bg px-2.5 py-1 font-mono text-xs text-muted"
            >
              {item}
            </li>
          ))}
        </ul>
      </motion.div>
    </Section>
  );
}
