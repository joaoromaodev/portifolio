"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp } from "@/lib/motion";
import { Panel } from "@/components/ui/Panel";
import { profile } from "@/lib/site";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { LocationCard } from "@/components/location/LocationCard";

export function Contact({ resume = null }: { resume?: string | null }) {
  const { dict } = useI18n();
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
        id={dict.contact.slug}
        title={dict.contact.title}
        subtitle={dict.contact.subtitle}
      />

      <div className="mb-4">
        <LocationCard />
      </div>

      {/* The two facts a hiring manager abroad has to dig for otherwise:
          whether the working days overlap, and whether we can talk. Stated
          next to the contact details, where the decision is being made. */}
      <motion.ul variants={fadeUp} className="mb-4 grid gap-3 sm:grid-cols-2">
        {dict.contact.working.map((fact) => (
          <li
            key={fact.label}
            className="rounded-lg border border-border bg-surface/60 px-4 py-3"
          >
            <p className="font-mono text-xs text-purple">{fact.label}</p>
            <p className="mt-1 text-sm text-muted">{fact.value}</p>
          </li>
        ))}
      </motion.ul>

      <motion.div variants={fadeUp}>
        <Panel className="p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-sm text-comment">{`// ${dict.contact.emailLabel}`}</p>
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
                  className="min-h-6 rounded border border-border px-2 py-0.5 font-mono text-xs text-muted transition-colors hover:border-green/50 hover:text-green"
                >
                  {copied ? dict.contact.copied : dict.contact.copy}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {resume ? (
                <a
                  href={resume}
                  download
                  className="rounded-lg border border-amber/40 px-4 py-2.5 font-mono text-sm text-amber transition-colors hover:bg-amber/10"
                >
                  {dict.contact.cv}
                </a>
              ) : null}
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
