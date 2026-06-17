import type { ReactNode } from "react";

// One panel/card language for everything (DESIGN.md §2.1).
export function Panel({
  children,
  className = "",
  as: Tag = "div",
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "section";
  interactive?: boolean;
}) {
  return (
    <Tag
      className={[
        "rounded-xl border border-border bg-surface",
        interactive
          ? "transition-colors duration-300 hover:border-green/40"
          : "",
        className,
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}

// Optional terminal-window chrome (3 dots + title) for key panels (DESIGN.md §10).
export function TerminalChrome({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
      <span className="flex gap-1.5" aria-hidden="true">
        <span className="size-2.5 rounded-full bg-red/70" />
        <span className="size-2.5 rounded-full bg-amber/70" />
        <span className="size-2.5 rounded-full bg-green/70" />
      </span>
      <span className="ml-1 font-mono text-xs text-comment">{title}</span>
    </div>
  );
}
