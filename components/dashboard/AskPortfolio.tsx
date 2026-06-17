"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Panel, TerminalChrome } from "@/components/ui/Panel";
import { EqualizerBars } from "./EqualizerBars";

const SUGGESTIONS = [
  "What does João do at SEDUC?",
  "Show me the strongest project",
  "Is he open to remote work?",
];

// Chat shell for "Ask my portfolio" (DESIGN.md §6). UI + KITT voicebox only —
// the Anthropic (Claude Haiku 4.5) Route Handler, rate-limits and guardrails
// get wired after the API keys land. Until then the composer is disabled.
export function AskPortfolio({ className = "" }: { className?: string }) {
  const [value, setValue] = useState("");
  const wired = false; // flip on once /api/ask is live

  return (
    <motion.div variants={fadeUp} className={className}>
      <Panel className="flex h-full flex-col overflow-hidden">
        <TerminalChrome title="ask-my-portfolio · claude" />

        <div className="flex flex-1 flex-col gap-3 p-4">
          {/* assistant intro */}
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex-none">
              <EqualizerBars active={false} bars={5} color="var(--color-cyan)" />
            </span>
            <p className="text-sm text-fg">
              Ask me anything about João&apos;s work, projects or background.{" "}
              <span className="text-muted">
                Powered by Claude — answers stay within the portfolio.
              </span>
            </p>
          </div>

          {/* suggestion chips */}
          <div className="mt-1 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                disabled={!wired}
                onClick={() => setValue(s)}
                className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-muted transition-colors enabled:hover:border-cyan/50 enabled:hover:text-cyan disabled:opacity-60"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="mt-auto">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2">
              <span className="font-mono text-sm text-green">{">"}</span>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={!wired}
                maxLength={500}
                placeholder={
                  wired ? "Type a question…" : "Coming soon — connecting Claude"
                }
                className="flex-1 bg-transparent font-mono text-sm text-fg placeholder:text-comment focus:outline-none disabled:cursor-not-allowed"
              />
              <button
                type="button"
                disabled={!wired || !value.trim()}
                className="rounded-md bg-cyan px-2.5 py-1 font-mono text-xs font-medium text-bg transition-opacity disabled:opacity-40"
              >
                send
              </button>
            </div>
            <p className="mt-1.5 font-mono text-[10px] text-comment">
              rate-limited · max 300 tokens · no SIMF / gov data
            </p>
          </div>
        </div>
      </Panel>
    </motion.div>
  );
}
