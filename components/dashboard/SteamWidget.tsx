"use client";

import { WidgetShell, SkeletonLine, useLiveWidget } from "./WidgetShell";

// Fallback until STEAM_API_KEY + STEAM_ID + /api/steam are wired.
// Falls back gracefully if the profile is private (DESIGN.md §4).
const FALLBACK = {
  games: [
    { name: "Elden Ring", hours: 2.4 },
    { name: "Hades II", hours: 1.1 },
    { name: "Balatro", hours: 0.6 },
  ],
};

export function SteamWidget() {
  const { status, data } = useLiveWidget("/api/steam", FALLBACK);

  return (
    <WidgetShell
      title="Steam · recently played"
      source="Steam Web API · public profile"
      status={status}
    >
      {status === "loading" ? (
        <ul className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3">
              <div className="skeleton size-8 flex-none rounded" />
              <SkeletonLine w={`${70 - i * 12}%`} />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-2.5">
          {data.games.map((g) => (
            <li key={g.name} className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="flex size-7 flex-none items-center justify-center rounded border border-border bg-bg font-mono text-[10px] text-cyan">
                  ▶
                </span>
                <span className="truncate text-sm text-fg">{g.name}</span>
              </span>
              <span className="flex-none font-mono text-xs text-muted tabular-nums">
                {g.hours}h<span className="text-comment"> / 2wk</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </WidgetShell>
  );
}
