"use client";

import { WidgetShell, SkeletonLine, useFakeLoad } from "./WidgetShell";

// Open-Meteo needs no key — this will call /api/weather (cache ~1h) once wired.
// Belém is tropical: warm + humid year-round, frequent afternoon rain.
const FALLBACK = {
  tempC: 31,
  condition: "Scattered thunderstorms",
  humidity: 78,
  glyph: "⛈",
};

export function WeatherWidget() {
  const { status, data } = useFakeLoad(FALLBACK, 850);

  return (
    <WidgetShell
      title="Belém weather"
      source="Open-Meteo · cache ~1h"
      status={status}
    >
      {status === "loading" ? (
        <div className="space-y-3">
          <SkeletonLine w="40%" h={28} />
          <SkeletonLine w="70%" />
          <SkeletonLine w="55%" />
        </div>
      ) : (
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl" aria-hidden="true">
              {data.glyph}
            </span>
            <span className="font-mono text-3xl font-semibold tabular-nums text-amber">
              {data.tempC}°
            </span>
            <span className="font-mono text-sm text-muted">C</span>
          </div>
          <p className="mt-2 text-sm text-fg">{data.condition}</p>
          <p className="mt-1 font-mono text-xs text-muted">
            humidity{" "}
            <span className="text-cyan tabular-nums">{data.humidity}%</span> ·
            America/Belem
          </p>
        </div>
      )}
    </WidgetShell>
  );
}
