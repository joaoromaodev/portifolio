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
        subtitle="Three live tiles now — GitHub activity, Spotify and Steam — each served by its own Next.js Route Handler so the keys never touch the browser. The AI assistant is coming back online next."
      />

      <motion.div variants={stagger} {...inView} className="space-y-8 md:space-y-10">
        {/* GitHub is the only widget with a wide-format visual (the heatmap),
            so it gets a full-width row instead of being squeezed into a
            3-up grid. */}
        <GitHubWidget />

        {/* Spotify carries richer content (track + artist + album + equalizer)
            than Steam's short list, so the split is weighted rather than a
            mechanical 50/50 — echoes the 1.4fr/1fr ratio used inside GitHub. */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.3fr_1fr] md:gap-8">
          <SpotifyWidget />
          <SteamWidget />
        </div>
      </motion.div>
    </Section>
  );
}
