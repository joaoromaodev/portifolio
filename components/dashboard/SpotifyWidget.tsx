"use client";

import { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, EASE } from "@/lib/motion";
import { Panel } from "@/components/ui/Panel";
import { useLiveWidget, type WidgetStatus } from "./WidgetShell";
import { EqualizerBars } from "./EqualizerBars";

type TopTrack = {
  rank: number;
  track: string;
  artist: string;
  url?: string;
};

type SpotifyData = {
  playing: boolean;
  track: string;
  artist: string;
  album: string;
  url?: string;
  top: TopTrack[];
};

// Fallback until Spotify OAuth (refresh token) + /api/spotify are wired.
// The top list mirrors real taste (rock/metal) so the strip is never blank.
const FALLBACK: SpotifyData = {
  playing: false,
  track: "Duality",
  artist: "Slipknot",
  album: "Vol. 3: The Subliminal Verses",
  url: "https://open.spotify.com/search/Duality%20Slipknot",
  top: [
    { rank: 1, track: "Duality", artist: "Slipknot" },
    { rank: 2, track: "Sweet Child O' Mine", artist: "Guns N' Roses" },
    { rank: 3, track: "Before I Forget", artist: "Slipknot" },
    { rank: 4, track: "Welcome to the Jungle", artist: "Guns N' Roses" },
    { rank: 5, track: "Snuff", artist: "Slipknot" },
  ],
};

const STATUS_DOT: Record<WidgetStatus, string> = {
  loading: "bg-amber",
  ready: "bg-green",
  empty: "bg-comment",
  error: "bg-red",
};

// Deliberately quieter than the dashboard tiles: a slim status-bar strip —
// what's on right now — with a "top tracks" expander that unfolds the actual
// most-played list from the Spotify API (user-top-read).
export function SpotifyWidget() {
  const { status, data } = useLiveWidget<SpotifyData>("/api/spotify", FALLBACK, {
    refreshMs: 45000,
  });
  const [open, setOpen] = useState(false);
  const listId = useId();
  const top = data.top?.length ? data.top : FALLBACK.top;

  return (
    <motion.div variants={fadeUp} className="min-w-0">
      <Panel interactive className="overflow-hidden">
        {/* Collapsed strip — one line of music status */}
        <div className="flex items-center gap-3 px-4 py-2.5">
          <EqualizerBars
            active={data.playing}
            bars={4}
            className="flex-none scale-75"
          />

          <p className="min-w-0 flex-1 truncate text-sm">
            <span className="font-mono text-[11px] uppercase tracking-wide text-comment">
              {data.playing ? "now playing" : "last played"}
            </span>{" "}
            <span className="text-fg">
              {status === "loading" ? "…" : data.track}
            </span>{" "}
            <span className="text-muted">—</span>{" "}
            <span className="font-mono text-cyan">
              {status === "loading" ? "" : data.artist}
            </span>
          </p>

          {data.url ? (
            <a
              href={data.url}
              target="_blank"
              rel="noreferrer"
              className="hidden flex-none font-mono text-xs text-green transition-colors hover:underline sm:inline"
            >
              open ↗
            </a>
          ) : null}

          <button
            type="button"
            aria-expanded={open}
            aria-controls={listId}
            onClick={() => setOpen((v) => !v)}
            className="flex-none rounded border border-border px-2 py-1 font-mono text-xs text-muted transition-colors hover:border-green/50 hover:text-green"
          >
            top tracks {open ? "▴" : "▾"}
          </button>

          <span
            aria-hidden="true"
            className={`size-1.5 flex-none rounded-full ${STATUS_DOT[status]} ${
              status === "loading" ? "animate-pulse" : ""
            }`}
            title={`Spotify Web API · ${status}`}
          />
        </div>

        {/* Expanded — the most-played list, straight from the API */}
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              id={listId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="border-t border-border px-4 py-3">
                <p className="font-mono text-xs text-comment">
                  {"// most played · last ~6 months"}
                </p>
                <ol className="mt-2.5 space-y-1.5">
                  {top.map((t) => (
                    <li
                      key={t.rank}
                      className="flex items-baseline gap-3 text-sm"
                    >
                      <span className="w-4 flex-none text-right font-mono text-xs tabular-nums text-amber">
                        {t.rank}
                      </span>
                      <span className="min-w-0 flex-1 truncate">
                        <span className="text-fg">{t.track}</span>{" "}
                        <span className="font-mono text-xs text-muted">
                          · {t.artist}
                        </span>
                      </span>
                      {t.url ? (
                        <a
                          href={t.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-none font-mono text-xs text-green opacity-80 transition-opacity hover:opacity-100 hover:underline"
                        >
                          ↗
                        </a>
                      ) : null}
                    </li>
                  ))}
                </ol>
                <p className="mt-3 font-mono text-[10px] text-comment">
                  source: Spotify Web API · top tracks
                </p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Panel>
    </motion.div>
  );
}
