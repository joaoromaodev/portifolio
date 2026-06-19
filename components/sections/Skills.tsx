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

      {/* 5 groups don't divide evenly into 2 or 3 columns — same fix as the
          secondary project cards: flex-wrap + justify-center centers the
          incomplete last row instead of leaving an empty grid cell. */}
      <div className="flex flex-wrap justify-center gap-4">
        {skills.map((group) => (
          <motion.div
            key={group.group}
            variants={fadeUp}
            className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]"
          >
            <Panel className="flex h-full flex-col p-5">
              <h3 className="font-mono text-sm text-purple">{group.group}</h3>
              <ul className="mt-3 flex flex-1 flex-wrap content-center gap-1.5">
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
