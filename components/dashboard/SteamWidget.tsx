"use client";

import { useState } from "react";
import { WidgetShell, SkeletonLine, useLiveWidget } from "./WidgetShell";
import { useI18n } from "@/components/i18n/LocaleProvider";

type SteamGame = { appid: number; name: string; hours: number };

type SteamData = {
  games: SteamGame[];
  profileUrl?: string;
};

// Store header art, served through our own /api/steam/cover proxy so the CSP
// can stay at `img-src 'self'` (see that route for why). The thumbnail is
// square, so the 460x215 header is cropped to its middle 215x215 by
// object-cover — still enough pixels for a 2x screen. Art is missing for some
// appids the API can return (delisted titles, some betas); the proxy 404s and
// `Cover` degrades to the ▶ glyph rather than leaving a broken frame.
function coverUrl(appid: number) {
  return `/api/steam/cover/${appid}`;
}

function Cover({ appid }: { appid: number }) {
  const [failed, setFailed] = useState(false);

  return (
    <span className="flex size-11 flex-none items-center justify-center overflow-hidden rounded border border-border bg-bg font-mono text-xs text-cyan">
      {failed ? (
        "▶"
      ) : (
        // Plain <img>: next/image is unoptimized site-wide (next.config.ts)
        // and these are remote URLs, so it would add config for nothing.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverUrl(appid)}
          alt=""
          width={460}
          height={215}
          // Eager on purpose: three 42px thumbnails cost almost nothing, and
          // lazy loading depends on IntersectionObserver, which never fires in
          // contexts that don't paint (headless captures, a hidden preview
          // pane) — there the covers simply never appeared.
          decoding="async"
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
      )}
    </span>
  );
}

// Fallback until STEAM_API_KEY + STEAM_ID + /api/steam are wired.
// Falls back gracefully if the profile is private (DESIGN.md §4). No CTA in
// the fallback — there's no real Steam ID to link to until the API is
// actually configured (CLAUDE.md §8, content honesty).
const FALLBACK: SteamData = {
  games: [
    { appid: 1245620, name: "Elden Ring", hours: 2.4 },
    { appid: 1145350, name: "Hades II", hours: 1.1 },
    { appid: 2379780, name: "Balatro", hours: 0.6 },
  ],
};

export function SteamWidget() {
  const { dict } = useI18n();
  const { status, data } = useLiveWidget<SteamData>("/api/steam", FALLBACK);

  return (
    <WidgetShell
      title={dict.dashboard.steam.title}
      source={dict.dashboard.steam.source}
      status={status}
    >
      {status === "loading" ? (
        <div className="flex h-full flex-col gap-4">
          <ul className="flex flex-1 flex-col justify-center space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="skeleton size-11 flex-none rounded" />
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
                  <Cover appid={g.appid} />
                  <span className="truncate text-sm text-fg" title={g.name}>
                    {g.name}
                  </span>
                </span>
                <span className="flex-none font-mono text-xs text-muted tabular-nums">
                  {g.hours}h
                  <span className="text-comment">
                    {" "}
                    {dict.dashboard.steam.perTwoWeeks}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          {data.profileUrl ? (
            <a
              href={data.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-6 w-fit items-center gap-1 font-mono text-sm text-green transition-colors hover:underline"
            >
              {dict.dashboard.viewProfile} ↗
            </a>
          ) : null}
        </div>
      )}
    </WidgetShell>
  );
}
