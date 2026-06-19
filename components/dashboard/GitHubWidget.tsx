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

export function GitHubWidget() {
  const { status, data } = useLiveWidget<GitHubData>("/api/github", FALLBACK);
  const levels = data.levels?.length ? data.levels : FALLBACK_LEVELS;

  return (
    <WidgetShell title="GitHub activity" source="GitHub REST · ISR ~1h" status={status}>
      {status === "loading" ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-1.5 sm:gap-2">
              {Array.from({ length: 84 }).map((_, i) => (
                <div key={i} className="skeleton aspect-square rounded-sm" />
              ))}
            </div>
            <SkeletonLine w="55%" />
          </div>
          <div className="flex flex-col gap-4 border-t border-border pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <SkeletonLine w="70%" />
            <SkeletonLine w="40%" h={26} />
            <SkeletonLine w="85%" />
            <SkeletonLine w="35%" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.4fr_1fr]">
          {/* Heatmap — the primary visual. */}
          <div className="space-y-3">
            <div
              role="img"
              aria-label={`GitHub contribution heatmap — ${
                data.total != null
                  ? `${data.total} contributions`
                  : `${data.weeks} weeks tracked`
              } for @${data.handle}`}
              className="grid grid-cols-12 gap-1.5 sm:gap-2"
            >
              {levels.map((lvl, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  className={`aspect-square rounded-sm ${LEVEL_BG[lvl] ?? LEVEL_BG[0]}`}
                  title={`${lvl} contributions`}
                />
              ))}
            </div>
            <p className="font-mono text-xs text-comment">
              last {data.weeks} weeks of activity
            </p>
          </div>

          {/* Stats — secondary column, same split as LocationCard. */}
          <div className="flex flex-col gap-4 border-t border-border pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <div>
              <p className="font-mono text-xs text-comment">handle</p>
              <p className="mt-1 truncate font-mono text-base text-green">
                @{data.handle}
              </p>
            </div>

            <div>
              <p className="font-mono text-xs text-comment">
                {data.total != null ? "contributions" : "tracked"}
              </p>
              <p className="mt-1 font-mono text-2xl tabular-nums text-amber">
                {data.total != null ? data.total : `${data.weeks}w`}
              </p>
            </div>

            {data.lastRepo ? (
              <div className="min-w-0">
                <p className="font-mono text-xs text-comment">last commit</p>
                <p className="mt-1 truncate font-mono text-sm text-cyan">
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
              className="mt-auto inline-flex w-fit items-center gap-1 font-mono text-sm text-green transition-colors hover:underline"
            >
              View profile ↗
            </a>
          </div>
        </div>
      )}
    </WidgetShell>
  );
}
