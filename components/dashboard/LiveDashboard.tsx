"use client";

import { motion } from "framer-motion";
import { stagger, inView } from "@/lib/motion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GitHubWidget } from "./GitHubWidget";
import { SpotifyWidget } from "./SpotifyWidget";
import { SteamWidget } from "./SteamWidget";
import { AskPortfolio } from "./AskPortfolio";

export function LiveDashboard() {
  return (
    <Section id="dashboard">
      <SectionHeader
        id="live"
        title="A dashboard that's actually alive"
        subtitle="Live tiles fed by real APIs — GitHub, Steam and Spotify — each proxied through its own Next.js Route Handler, so the keys never touch the browser. Ask the assistant below anything about the work."
      />

      <motion.div variants={stagger} {...inView} className="space-y-4 md:space-y-5">
        {/* GitHub carries the densest visual (the heatmap) → 2/3 of the row;
            Steam's short list fits the remaining third. */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          <GitHubWidget className="md:col-span-2" />
          <SteamWidget />
        </div>

        {/* Spotify is deliberately a slim status strip, not a tile — music is
            flavor, not a headline. Its "top tracks" expander is the
            interactive bit. */}
        <SpotifyWidget />

        {/* The AI assistant closes the dashboard — the most interactive
            panel gets the most room. Degrades to a "not connected yet"
            message with no ANTHROPIC_API_KEY, same fallback discipline as
            every other widget. */}
        <AskPortfolio className="h-[440px]" />
      </motion.div>
    </Section>
  );
}
