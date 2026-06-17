"use client";

import { motion } from "framer-motion";
import { stagger, inView } from "@/lib/motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GitHubWidget } from "./GitHubWidget";
import { SpotifyWidget } from "./SpotifyWidget";
import { WeatherWidget } from "./WeatherWidget";
import { SteamWidget } from "./SteamWidget";
import { LocationPanel } from "./LocationPanel";
import { AskPortfolio } from "./AskPortfolio";

export function LiveDashboard() {
  return (
    <section
      id="dashboard"
      className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28"
    >
      <SectionHeader
        id="live"
        title="A dashboard that's actually alive"
        subtitle="Every tile is a real widget — GitHub, Spotify, weather, Steam, an Amazon map and an AI assistant. Each one has its own loading and fallback state, so it never looks broken. (API keys land next; shown with snapshots for now.)"
      />

      <motion.div
        variants={stagger}
        {...inView}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <GitHubWidget />
        <LocationPanel />
        <SpotifyWidget />
        <WeatherWidget />
        <SteamWidget />
        <AskPortfolio className="sm:col-span-2 lg:col-span-1" />
      </motion.div>
    </section>
  );
}
