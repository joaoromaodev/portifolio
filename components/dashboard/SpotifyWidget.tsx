"use client";

import { WidgetShell, SkeletonLine, useLiveWidget } from "./WidgetShell";
import { EqualizerBars } from "./EqualizerBars";

type SpotifyData = {
  playing: boolean;
  track: string;
  artist: string;
  album: string;
  url?: string;
};

// Fallback until Spotify OAuth (refresh token) + /api/spotify are wired.
const FALLBACK: SpotifyData = {
  playing: false,
  track: "Duality",
  artist: "Slipknot",
  album: "Vol. 3: The Subliminal Verses",
  url: "https://open.spotify.com/search/Duality%20Slipknot",
};

export function SpotifyWidget() {
  const { status, data } = useLiveWidget<SpotifyData>("/api/spotify", FALLBACK, {
    refreshMs: 45000,
  });

  return (
    <WidgetShell title="Spotify" source="Spotify Web API · ~30s" status={status}>
      {status === "loading" ? (
        <div className="flex h-full flex-col justify-between gap-6">
          <div className="space-y-2">
            <SkeletonLine w="35%" />
            <SkeletonLine w="75%" h={20} />
            <SkeletonLine w="45%" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="skeleton size-12 flex-none rounded-md" />
            <SkeletonLine w="30%" />
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col justify-between gap-6">
          {/* Track info — the primary content, same weight as the GitHub stats. */}
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-comment">
              {data.playing ? (
                <span className="relative flex size-1.5 flex-none">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-green opacity-70" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-green" />
                </span>
              ) : (
                <span className="size-1.5 flex-none rounded-full bg-comment" />
              )}
              {data.playing ? "now playing" : "last played"}
            </p>
            <p className="mt-2 truncate text-xl font-semibold text-fg">
              {data.track}
            </p>
            <p className="mt-1 truncate font-mono text-sm text-cyan">
              {data.artist}
            </p>
            {data.album ? (
              <p className="mt-0.5 truncate text-xs text-muted">{data.album}</p>
            ) : null}
          </div>

          {/* Equalizer + CTA — anchored to the bottom, same rhythm as the
              GitHub "View profile" row. */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex size-12 flex-none items-center justify-center rounded-md border border-border bg-bg">
              <EqualizerBars active={data.playing} bars={4} />
            </div>
            {data.url ? (
              <a
                href={data.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-1 font-mono text-sm text-green transition-colors hover:underline"
              >
                Open in Spotify ↗
              </a>
            ) : null}
          </div>
        </div>
      )}
    </WidgetShell>
  );
}
