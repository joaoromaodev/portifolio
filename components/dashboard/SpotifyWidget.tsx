"use client";

import { WidgetShell, SkeletonLine, useLiveWidget } from "./WidgetShell";
import { EqualizerBars } from "./EqualizerBars";

// Fallback until Spotify OAuth (refresh token) + /api/spotify are wired.
const FALLBACK = {
  playing: false,
  track: "Duality",
  artist: "Slipknot",
  album: "Vol. 3: The Subliminal Verses",
};

export function SpotifyWidget() {
  const { status, data } = useLiveWidget("/api/spotify", FALLBACK, {
    refreshMs: 45000,
  });

  return (
    <WidgetShell
      title="Spotify"
      source="Spotify Web API · ~30s"
      status={status}
    >
      {status === "loading" ? (
        <div className="flex items-center gap-3">
          <div className="skeleton size-12 flex-none rounded-md" />
          <div className="flex-1 space-y-2">
            <SkeletonLine w="80%" />
            <SkeletonLine w="50%" />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex size-12 flex-none items-center justify-center rounded-md border border-border bg-bg">
            <EqualizerBars active={data.playing} bars={4} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[11px] uppercase tracking-wide text-comment">
              {data.playing ? "now playing" : "last played"}
            </p>
            <p className="truncate text-sm font-medium text-fg">{data.track}</p>
            <p className="truncate font-mono text-xs text-muted">
              {data.artist}
            </p>
          </div>
        </div>
      )}
    </WidgetShell>
  );
}
