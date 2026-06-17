"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/lib/site";
import { EASE } from "@/lib/motion";
import { useBelemTime } from "@/components/useBelemTime";
import { SynthwaveGrid } from "./SynthwaveGrid";
import { Typewriter } from "./Typewriter";
import { TerminalChrome } from "@/components/ui/Panel";

const TERMINAL_LINES = [
  "whoami",
  `${profile.name} — ${profile.role}`,
  `${profile.tagline}`,
  `status: ${profile.status}`,
];

export function Hero() {
  const time = useBelemTime();
  const [typed, setTyped] = useState(false);

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <SynthwaveGrid />

      <div className="mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-5 py-24 md:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-5 font-mono text-sm text-comment"
        >
          {/* a living dashboard about me */}
          {"// a living dashboard about me"}
        </motion.p>

        {/* Terminal console */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
          className="max-w-2xl rounded-xl border border-border bg-surface/70 shadow-2xl shadow-black/40 backdrop-blur-sm"
        >
          <TerminalChrome title="joao@belem: ~" />
          <div className="px-4 py-5 sm:px-6">
            <Typewriter lines={TERMINAL_LINES} onDone={() => setTyped(true)} />
          </div>
        </motion.div>

        {/* Name + role as real headings (a11y) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.18 }}
          className="mt-9"
        >
          <h1 className="font-mono text-4xl font-semibold tracking-tight text-fg sm:text-5xl md:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-3 max-w-xl text-lg text-muted">
            {profile.role} from{" "}
            <span className="text-green">Belém, Brazil</span>. I build real-time
            dashboards, automation and full-stack products — and this site is one
            of them.
          </p>
        </motion.div>

        {/* Status row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: typed ? 1 : 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-sm"
        >
          <span className="inline-flex items-center gap-2 text-green">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-green opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-green" />
            </span>
            {profile.status}
          </span>
          <span className="text-comment">·</span>
          <span className="text-muted">
            Belém{" "}
            <span className="tabular-nums text-amber">{time ?? "--:--:--"}</span>
          </span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
          className="mt-9 flex flex-wrap gap-3"
        >
          <a
            href="#projects"
            className="rounded-lg bg-green px-4 py-2.5 font-mono text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            view projects
          </a>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-border px-4 py-2.5 font-mono text-sm text-fg transition-colors hover:border-cyan/50 hover:text-cyan"
          >
            GitHub ↗
          </a>
          <a
            href="#contact"
            className="rounded-lg border border-border px-4 py-2.5 font-mono text-sm text-fg transition-colors hover:border-green/50 hover:text-green"
          >
            contact
          </a>
        </motion.div>
      </div>
    </section>
  );
}
