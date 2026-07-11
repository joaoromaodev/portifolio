"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Panel } from "@/components/ui/Panel";
import { profile } from "@/lib/site";
import { useBelemTime } from "@/components/useBelemTime";
import { useLiveWidget } from "@/components/dashboard/WidgetShell";
import { LocationMap } from "./LocationMap";

const WEATHER_FALLBACK = {
  tempC: 31,
  condition: "Scattered thunderstorms",
  humidity: 78,
  glyph: "⛈️",
};

// Location cluster: GPS-styled world map + Belém clock + inline weather +
// status, placed contextually next to Contact (DESIGN.md §5, refactored).
export function LocationCard() {
  const time = useBelemTime();
  const { data: weather } = useLiveWidget("/api/weather", WEATHER_FALLBACK, {
    refreshMs: 600000,
  });

  return (
    <motion.div variants={fadeUp}>
      <Panel className="grid items-stretch gap-px overflow-hidden md:grid-cols-2">
        {/* Left: the facts */}
        <div className="flex flex-col justify-between gap-6 p-6">
          <div>
            <p className="font-mono text-sm text-comment">{"// based in"}</p>
            <h3 className="mt-1 text-2xl font-semibold text-fg">
              Belém, Pará
            </h3>
            <p className="text-muted">{profile.location} · gateway to the Amazon</p>
            <p className="mt-1 font-mono text-xs text-comment">
              01°27&apos;21&quot;S · 48°29&apos;25&quot;W
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="font-mono text-xs text-comment">local time</dt>
              <dd className="mt-0.5 font-mono text-xl tabular-nums text-amber">
                {time ?? "--:--:--"}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs text-comment">weather now</dt>
              <dd className="mt-0.5 flex items-baseline gap-1.5">
                <span aria-hidden="true">{weather.glyph}</span>
                <span className="font-mono text-xl tabular-nums text-cyan">
                  {weather.tempC}°
                </span>
                <span className="truncate text-xs text-muted">
                  {weather.condition}
                </span>
              </dd>
            </div>
          </dl>

          <p className="inline-flex items-center gap-2 font-mono text-sm text-green">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-green opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-green" />
            </span>
            {profile.status}
          </p>
        </div>

        {/* Right: the globe radar */}
        <div className="relative min-h-[300px] border-t border-border bg-bg/40 md:border-l md:border-t-0">
          <LocationMap className="absolute inset-0 h-full w-full p-4" />
        </div>
      </Panel>
    </motion.div>
  );
}
