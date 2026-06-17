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
        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 84 }).map((_, i) => (
              <div key={i} className="skeleton aspect-square rounded-sm" />
            ))}
          </div>
          <SkeletonLine w="70%" />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-1">
            {levels.map((lvl, i) => (
              <div
                key={i}
                className={`aspect-square rounded-sm ${LEVEL_BG[lvl] ?? LEVEL_BG[0]}`}
                title={`${lvl} contributions`}
              />
            ))}
          </div>
          <div className="font-mono text-xs leading-relaxed">
            <p className="text-muted">
              <span className="text-green">@{data.handle}</span> ·{" "}
              {data.total != null ? `${data.total} contributions` : `${data.weeks} weeks`}
            </p>
            {data.lastRepo ? (
              <p className="mt-1 truncate text-comment">
                <span className="text-cyan">{data.lastRepo}</span>{" "}
                {data.lastCommit}
              </p>
            ) : null}
          </div>
        </div>
      )}
    </WidgetShell>
  );
}
