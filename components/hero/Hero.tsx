"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/lib/site";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { EASE } from "@/lib/motion";
import { useBelemTime } from "@/components/useBelemTime";
import { SynthwaveGrid } from "./SynthwaveGrid";
import { Typewriter } from "./Typewriter";

export function Hero({ resume = null }: { resume?: string | null }) {
  const { dict } = useI18n();
  const time = useBelemTime();
  const [typed, setTyped] = useState(false);

  // Reveal the headline once the `whoami` prompt finishes typing.
  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: typed ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    transition: { duration: 0.5, ease: EASE, delay },
  });

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <SynthwaveGrid />

      <div className="mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-5 py-24 md:px-8">
        {/* terminal prompt — the one signature, kept small */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="mb-6 text-sm"
        >
          <span className="font-mono text-comment">joao@belem </span>
          <Typewriter lines={[dict.hero.prompt]} onDone={() => setTyped(true)} />
        </motion.div>

        {/* Name — the answer to whoami. Inter, editorial scale. */}
        <motion.h1
          {...reveal(0)}
          className="max-w-4xl text-5xl font-semibold tracking-tight text-fg sm:text-6xl md:text-7xl"
        >
          João Romão
        </motion.h1>

        {/* Positioning statement — specific, not a role label. */}
        <motion.p
          {...reveal(0.08)}
          className="mt-6 max-w-2xl text-balance text-xl leading-snug text-fg/85 sm:text-2xl"
        >
          {dict.hero.headline.lead}
          <span className="text-green">{dict.hero.headline.accent}</span>
          {dict.hero.headline.tail}
        </motion.p>

        {/* Supporting line — role + place, muted. */}
        <motion.p {...reveal(0.16)} className="mt-4 max-w-2xl text-muted">
          {dict.hero.roleLine}
        </motion.p>

        {/* Live status + local time */}
        <motion.div
          {...reveal(0.24)}
          className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-sm"
        >
          <span className="inline-flex items-center gap-2 text-green">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-green opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-green" />
            </span>
            {dict.profile.status}
          </span>
          <span className="text-border">·</span>
          <span className="text-muted">
            {dict.hero.cityLabel}{" "}
            <span className="tabular-nums text-amber">{time ?? "--:--:--"}</span>
          </span>
        </motion.div>

        {/* CTAs */}
        <motion.div {...reveal(0.32)} className="mt-9 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="rounded-lg bg-green px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            {dict.hero.ctaWork}
          </a>
          {resume ? (
            <a
              href={resume}
              download
              className="rounded-lg border border-border px-5 py-2.5 text-sm text-fg transition-colors hover:border-fg/30"
            >
              {dict.hero.ctaCv}
            </a>
          ) : null}
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-border px-5 py-2.5 text-sm text-fg transition-colors hover:border-fg/30"
          >
            GitHub ↗
          </a>
          <a
            href="#contact"
            className="rounded-lg px-5 py-2.5 text-sm text-muted transition-colors hover:text-fg"
          >
            {dict.hero.ctaContact}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
