"use client";

import { motion } from "framer-motion";
import { stagger, inView } from "@/lib/motion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GitHubWidget } from "./GitHubWidget";
import { SpotifyWidget } from "./SpotifyWidget";
import { SteamWidget } from "./SteamWidget";

// Live panels are coming back one at a time — GitHub, Spotify and Steam are
// wired today. The AI assistant returns to this section once it gets its own
// polish pass (see components/dashboard/AskPortfolio.tsx).
export function LiveDashboard() {
  return (
    <Section id="dashboard">
      <SectionHeader
        id="live"
        title="A dashboard that's actually alive"
        subtitle="Live tiles fed by real APIs — GitHub, Steam and Spotify — each proxied through its own Next.js Route Handler, so the keys never touch the browser."
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
      </motion.div>
    </Section>
  );
}
