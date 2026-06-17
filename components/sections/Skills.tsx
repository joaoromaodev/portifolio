"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp } from "@/lib/motion";
import { Panel } from "@/components/ui/Panel";
import { skills } from "@/lib/site";

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeader id="skills" title="Toolbox" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group) => (
          <motion.div key={group.group} variants={fadeUp}>
            <Panel className="h-full p-5">
              <h3 className="font-mono text-sm text-purple">{group.group}</h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-border bg-bg px-2 py-1 font-mono text-xs text-fg/90"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Panel>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
