"use client";

import { WidgetShell, SkeletonLine, useFakeLoad } from "./WidgetShell";

// Fallback snapshot until GITHUB_TOKEN + /api/github are wired (DESIGN.md §4).
const FALLBACK = {
  handle: "joaoromaodev",
  weeks: 17,
  lastRepo: "monitor-pete-peae",
  lastCommit: "feat: anomaly detection on duplicate OBs",
};

// Deterministic heatmap so server/client markup matches (no hydration drift).
function heat(i: number) {
  const levels = [0, 1, 1, 2, 0, 3, 4, 2, 1, 0, 2, 3];
  return levels[i % levels.length];
}

const LEVEL_BG = [
  "bg-border",
  "bg-green/25",
  "bg-green/45",
  "bg-green/70",
  "bg-green",
];

export function GitHubWidget() {
  const { status, data } = useFakeLoad(FALLBACK, 700);

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
            {Array.from({ length: 84 }).map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-sm ${LEVEL_BG[heat(i)]}`}
                title={`${heat(i)} contributions`}
              />
            ))}
          </div>
          <div className="font-mono text-xs leading-relaxed">
            <p className="text-muted">
              <span className="text-green">@{data.handle}</span> ·{" "}
              {data.weeks} weeks
            </p>
            <p className="mt-1 truncate text-comment">
              <span className="text-cyan">{data.lastRepo}</span>{" "}
              {data.lastCommit}
            </p>
          </div>
        </div>
      )}
    </WidgetShell>
  );
}
