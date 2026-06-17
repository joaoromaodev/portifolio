"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp } from "@/lib/motion";
import { Panel } from "@/components/ui/Panel";
import { about } from "@/lib/site";

export function About() {
  return (
    <Section id="about">
      <SectionHeader id="about" title="The human behind the dashboard" />

      <div className="grid gap-8 md:grid-cols-[1.6fr_1fr]">
        <motion.div variants={fadeUp} className="space-y-4 text-[17px] leading-relaxed text-fg/90">
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </motion.div>

        <motion.div variants={fadeUp}>
          <Panel className="p-5">
            <p className="font-mono text-sm text-comment">{"// beyond code"}</p>
            <ul className="mt-3 space-y-3">
              {about.beyondCode.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-muted">
                  <span className="mt-1 size-1.5 flex-none rounded-full bg-purple" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </motion.div>
      </div>
    </Section>
  );
}
