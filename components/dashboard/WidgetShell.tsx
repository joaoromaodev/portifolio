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
    <motion.div variants={fadeUp} className={className}>
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

// Simulates an async load until the real Route Handler is wired in.
// Swap the body for `fetch('/api/...')` later — the shape stays the same.
export function useFakeLoad<T>(value: T, delay = 900): { status: WidgetStatus; data: T } {
  const [status, setStatus] = useState<WidgetStatus>("loading");
  useEffect(() => {
    const id = setTimeout(() => setStatus("ready"), delay);
    return () => clearTimeout(id);
  }, [delay]);
  return { status, data: value };
}
