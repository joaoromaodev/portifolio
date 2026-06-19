"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Panel } from "@/components/ui/Panel";

export type WidgetStatus = "loading" | "ready" | "empty" | "error";

const STATUS_DOT: Record<WidgetStatus, string> = {
  loading: "bg-amber",
  ready: "bg-green",
  empty: "bg-comment",
  error: "bg-red",
};

const STATUS_LABEL: Record<WidgetStatus, string> = {
  loading: "fetching",
  ready: "live",
  empty: "idle",
  error: "offline",
};

// Shared frame for every live widget: title + status dot + body.
// Every widget renders through this so loading/empty/error look identical.
export function WidgetShell({
  title,
  source,
  status,
  className = "",
  children,
}: {
  title: string;
  source: string;
  status: WidgetStatus;
  className?: string;
  children: ReactNode;
}) {
  return (
    // min-w-0 keeps truncated text from blowing out a CSS grid track when
    // this widget sits in a multi-column dashboard grid.
    <motion.div variants={fadeUp} className={`min-w-0 ${className}`}>
      <Panel interactive className="flex h-full flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <span className="font-mono text-xs font-medium text-fg">{title}</span>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
            <span
              className={`size-1.5 rounded-full ${STATUS_DOT[status]} ${
                status === "loading" ? "animate-pulse" : ""
              }`}
            />
            {STATUS_LABEL[status]}
          </span>
        </div>
        <div className="flex-1 p-4">{children}</div>
        <div className="border-t border-border px-4 py-1.5 font-mono text-[10px] text-comment">
          source: {source}
        </div>
      </Panel>
    </motion.div>
  );
}

// Loading bar / line skeleton.
export function SkeletonLine({ w = "100%", h = 10 }: { w?: string; h?: number }) {
  return (
    <div
      className="skeleton rounded"
      style={{ width: w, height: h }}
    />
  );
}

type Envelope<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "unconfigured" | "error" | "empty" };

// Fetches a widget's Route Handler and maps the envelope to a status.
// Live data → "ready"; unset key → "empty" (idle); failure → "error" (offline).
// In every non-live case it returns the static `fallback` so the tile is never
// blank — the widget renders `data` identically whether live or fallback.
export function useLiveWidget<T>(
  endpoint: string,
  fallback: T,
  opts?: { refreshMs?: number },
): { status: WidgetStatus; data: T } {
  const [state, setState] = useState<{ status: WidgetStatus; data: T }>({
    status: "loading",
    data: fallback,
  });

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const res = await fetch(endpoint);
        const json = (await res.json()) as Envelope<T>;
        if (cancelled) return;
        if (json.ok) {
          setState({ status: "ready", data: json.data });
        } else {
          setState({
            status: json.reason === "unconfigured" ? "empty" : "error",
            data: fallback,
          });
        }
      } catch {
        if (!cancelled) setState({ status: "error", data: fallback });
      }
    };

    run();
    const id = opts?.refreshMs ? setInterval(run, opts.refreshMs) : undefined;
    return () => {
      cancelled = true;
      if (id) clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  return state;
}
