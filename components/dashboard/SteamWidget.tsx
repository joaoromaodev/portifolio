"use client";

import { WidgetShell, SkeletonLine, useLiveWidget } from "./WidgetShell";

type SteamData = {
  games: { name: string; hours: number }[];
  profileUrl?: string;
};

// Fallback until STEAM_API_KEY + STEAM_ID + /api/steam are wired.
// Falls back gracefully if the profile is private (DESIGN.md §4). No CTA in
// the fallback — there's no real Steam ID to link to until the API is
// actually configured (CLAUDE.md §8, content honesty).
const FALLBACK: SteamData = {
  games: [
    { name: "Elden Ring", hours: 2.4 },
    { name: "Hades II", hours: 1.1 },
    { name: "Balatro", hours: 0.6 },
  ],
};

export function SteamWidget() {
  const { status, data } = useLiveWidget<SteamData>("/api/steam", FALLBACK);

  return (
    <WidgetShell
      title="Steam · recently played"
      source="Steam Web API · public profile"
      status={status}
    >
      {status === "loading" ? (
        <div className="flex h-full flex-col gap-4">
          <ul className="flex flex-1 flex-col justify-center space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="skeleton size-7 flex-none rounded" />
                <SkeletonLine w={`${70 - i * 12}%`} />
              </li>
            ))}
          </ul>
          <SkeletonLine w="30%" />
        </div>
      ) : (
        <div className="flex h-full flex-col gap-4">
          {/* flex-1 + justify-center: the list fills (and centers within)
              whatever space is left above the CTA — or the full card height
              when the CTA isn't there, so there's never dead air below it. */}
          <ul className="flex flex-1 flex-col justify-center space-y-2.5">
            {data.games.map((g) => (
              <li
                key={g.name}
                className="flex items-center justify-between gap-3"
              >
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

          {data.profileUrl ? (
            <a
              href={data.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-1 font-mono text-sm text-green transition-colors hover:underline"
            >
              View profile ↗
            </a>
          ) : null}
        </div>
      )}
    </WidgetShell>
  );
}
