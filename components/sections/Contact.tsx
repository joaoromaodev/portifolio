"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp } from "@/lib/motion";
import { Panel } from "@/components/ui/Panel";
import { profile } from "@/lib/site";
import { LocationCard } from "@/components/location/LocationCard";

export function Contact() {
  // Assemble the address at runtime so it isn't sitting in the static HTML
  // for scrapers (CLAUDE.md §8 — obfuscate email, no phone).
  const email = useMemo(() => {
    const [user, domain] = ["joaoromaodev", "gmail.com"];
    return `${user}@${domain}`;
  }, []);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard may be blocked — the mailto link still works */
    }
  };

  return (
    <Section id="contact">
      <SectionHeader
        id="contact"
        title="Let's talk"
        subtitle="Open to remote roles and relocation. The fastest way to reach me is email or LinkedIn."
      />

      <div className="mb-4">
        <LocationCard />
      </div>

      <motion.div variants={fadeUp}>
        <Panel className="p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-sm text-comment">{"// email"}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${email}`}
                  className="font-mono text-lg text-green hover:underline"
                >
                  {email}
                </a>
                <button
                  type="button"
                  onClick={copy}
                  className="rounded border border-border px-2 py-0.5 font-mono text-xs text-muted transition-colors hover:border-green/50 hover:text-green"
                >
                  {copied ? "copied ✓" : "copy"}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-border px-4 py-2.5 font-mono text-sm text-fg transition-colors hover:border-cyan/50 hover:text-cyan"
              >
                LinkedIn ↗
              </a>
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-border px-4 py-2.5 font-mono text-sm text-fg transition-colors hover:border-green/50 hover:text-green"
              >
                GitHub ↗
              </a>
            </div>
          </div>
        </Panel>
      </motion.div>
    </Section>
  );
}
