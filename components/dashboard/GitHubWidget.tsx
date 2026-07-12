"use client";

import { WidgetShell, SkeletonLine, useLiveWidget } from "./WidgetShell";

type GitHubData = {
  handle: string;
  weeks: number;
  total?: number;
  levels?: number[];
  lastRepo: string;
  lastCommit: string;
};

// Deterministic fallback heatmap so server/client markup matches (no hydration
// drift) when GITHUB_TOKEN / /api/github isn't wired yet (DESIGN.md §4).
const FALLBACK_LEVELS = Array.from({ length: 84 }, (_, i) => {
  const pattern = [0, 1, 1, 2, 0, 3, 4, 2, 1, 0, 2, 3];
  return pattern[i % pattern.length];
});

const FALLBACK: GitHubData = {
  handle: "joaoromaodev",
  weeks: 12,
  levels: FALLBACK_LEVELS,
  lastRepo: "monitor-pete-peae",
  lastCommit: "feat: anomaly detection on duplicate OBs",
};

const LEVEL_BG = [
  "bg-border",
  "bg-green/25",
  "bg-green/45",
  "bg-green/70",
  "bg-green",
];

export function GitHubWidget({ className = "" }: { className?: string }) {
  const { status, data } = useLiveWidget<GitHubData>("/api/github", FALLBACK);
  const levels = data.levels?.length ? data.levels : FALLBACK_LEVELS;

  return (
    <WidgetShell
      title="GitHub activity"
      source="GitHub REST · ISR ~1h"
      status={status}
      className={className}
    >
      {status === "loading" ? (
        <div className="flex h-full flex-col gap-5 sm:flex-row sm:items-center">
          <div className="grid w-fit flex-none grid-flow-col grid-rows-7 gap-1">
            {Array.from({ length: 84 }).map((_, i) => (
              <div key={i} className="skeleton size-3 rounded-[3px]" />
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-3 sm:border-l sm:border-border sm:pl-6">
            <SkeletonLine w="40%" h={24} />
            <SkeletonLine w="75%" />
            <SkeletonLine w="30%" />
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col gap-5 sm:flex-row sm:items-center">
          {/* Heatmap — GitHub's own orientation: columns are weeks, rows are
              days. Fixed small cells keep it a compact block instead of a
              full-width wall of squares. */}
          <div className="flex-none space-y-2">
            <div
              role="img"
              aria-label={`GitHub contribution heatmap — ${
                data.total != null
                  ? `${data.total} contributions`
                  : `${data.weeks} weeks tracked`
              } for @${data.handle}`}
              className="grid w-fit grid-flow-col grid-rows-7 gap-1"
            >
              {levels.map((lvl, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  className={`size-3 rounded-[3px] ${LEVEL_BG[lvl] ?? LEVEL_BG[0]}`}
                />
              ))}
            </div>
            <p className="font-mono text-xs text-comment">
              last {data.weeks} weeks
            </p>
          </div>

          {/* Stats — a quiet column beside the heatmap */}
          <div className="flex min-w-0 flex-1 flex-col gap-3 border-t border-border pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
            <div className="flex items-baseline gap-2">
              <p className="font-mono text-2xl tabular-nums text-amber">
                {data.total != null ? data.total : `${data.weeks}w`}
              </p>
              <p className="font-mono text-xs text-comment">
                {data.total != null ? "contributions" : "tracked"} ·{" "}
                <span className="text-muted">@{data.handle}</span>
              </p>
            </div>

            {data.lastRepo ? (
              <div className="min-w-0">
                <p className="truncate font-mono text-sm text-cyan">
                  {data.lastRepo}
                </p>
                {data.lastCommit ? (
                  <p className="mt-0.5 truncate text-sm text-muted">
                    {data.lastCommit}
                  </p>
                ) : null}
              </div>
            ) : null}

            <a
              href={`https://github.com/${data.handle}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-1 font-mono text-sm text-green transition-colors hover:underline"
            >
              View profile ↗
            </a>
          </div>
        </div>
      )}
    </WidgetShell>
  );
}
