"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp } from "@/lib/motion";
import { Panel } from "@/components/ui/Panel";
import { skills } from "@/lib/site";

// One quiet panel, one row per domain — reads like a config file, not five
// competing cards. The section is an index, not a headline.
export function Skills() {
  return (
    <Section id="skills">
      <SectionHeader id="skills" title="Toolbox" />

      <motion.div variants={fadeUp}>
        <Panel className="divide-y divide-border">
          {skills.map((group) => (
            <div
              key={group.group}
              className="grid gap-x-6 gap-y-2 px-5 py-4 sm:grid-cols-[11rem_1fr] sm:items-baseline"
            >
              <h3 className="font-mono text-sm text-purple">{group.group}</h3>
              <ul className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-border bg-bg px-2 py-1 font-mono text-xs text-fg/90"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Panel>
      </motion.div>
    </Section>
  );
}
