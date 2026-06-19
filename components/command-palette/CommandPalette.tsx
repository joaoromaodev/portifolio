"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { Panel, TerminalChrome } from "@/components/ui/Panel";
import { nav, profile } from "@/lib/site";

type LogEntry =
  | { type: "command"; text: string }
  | { type: "response"; text: string; tone?: "green" | "comment" };

type Resolved = {
  text: string;
  tone?: "green" | "comment";
  navigateTo?: string;
  openUrl?: string;
};

// The DESIGN.md §10 "CLI easter egg" — a real ⌘K command palette, built from
// the exact panel/terminal-chrome language already used everywhere else
// (Panel + TerminalChrome), so it reads as part of the system, not a bolted-
// on widget. Commands mirror the existing nav — single source of truth.
function resolveCommand(raw: string): Resolved {
  const cmd = raw.trim().toLowerCase();

  if (cmd === "help") {
    const list = nav.map((n) => `  ${n.label}`).join("\n");
    return {
      text: `Available commands:\n${list}\n  whoami\n  github\n  linkedin\n  clear\n\nType a section name to jump there.`,
    };
  }

  if (cmd === "whoami") {
    return {
      text: `${profile.name} — ${profile.role}\n${profile.location} · ${profile.status}`,
    };
  }

  if (cmd.startsWith("sudo")) {
    return {
      text: "Nice try. This terminal only has read access — same as you. 🥪",
    };
  }

  if (cmd === "triforce" || cmd === "zelda") {
    return {
      text: "Wisdom, Power, Courage.\nSame kid who replayed Ocarina of Time until the emulator gave up. Still chasing all three. 🔺",
    };
  }

  if (cmd === "github") {
    return { text: "Opening GitHub ↗", tone: "green", openUrl: profile.links.github };
  }

  if (cmd === "linkedin") {
    return { text: "Opening LinkedIn ↗", tone: "green", openUrl: profile.links.linkedin };
  }

  const match = nav.find((n) => n.id === cmd || n.label === cmd);
  if (match) {
    return { text: `Jumping to // ${match.label}…`, tone: "green", navigateTo: match.id };
  }

  return {
    text: `command not found: ${raw}\nType "help" to see what's available.`,
    tone: "comment",
  };
}

function scrollToSection(id: string) {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const shouldReduceMotion = useReducedMotion();

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  // Global ⌘K / Ctrl+K toggle, Escape-to-close, and a minimal focus trap
  // (the input is the only focusable control while the palette is open).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isShortcut = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isShortcut) {
        e.preventDefault();
        if (open) close();
        else setOpen(true);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") close();
      else if (e.key === "Tab") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [log]);

  const submit = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;

    setHistory((h) => [...h, cmd]);
    setHistoryIndex(null);
    setValue("");

    if (cmd.toLowerCase() === "clear") {
      setLog([]);
      return;
    }

    const resolved = resolveCommand(cmd);
    setLog((l) => [
      ...l,
      { type: "command", text: cmd },
      { type: "response", text: resolved.text, tone: resolved.tone },
    ]);

    if (resolved.navigateTo || resolved.openUrl) {
      setTimeout(() => {
        if (resolved.navigateTo) scrollToSection(resolved.navigateTo);
        if (resolved.openUrl) window.open(resolved.openUrl, "_blank", "noopener,noreferrer");
        close();
      }, 250);
    }
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setValue(history[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(null);
        setValue("");
      } else {
        setHistoryIndex(next);
        setValue(history[next]);
      }
    }
  };

  return (
    <>
      <motion.button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Open command palette (Ctrl+K)"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.5,
          ease: EASE,
          delay: shouldReduceMotion ? 0 : 1.2,
        }}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-1.5 rounded-full border border-border bg-surface/90 px-3 py-2 font-mono text-xs text-muted shadow-lg backdrop-blur transition-colors hover:border-green/40 hover:text-fg"
      >
        <span className="text-green">{">"}</span>
        <span>terminal</span>
        <kbd className="hidden rounded border border-border bg-bg px-1 py-0.5 text-[10px] text-comment sm:inline-block">
          ⌘K
        </kbd>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-24 sm:pt-32">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: EASE }}
              className="fixed inset-0 bg-bg/80 backdrop-blur-sm"
              onClick={close}
              aria-hidden="true"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              initial={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : -12,
                scale: shouldReduceMotion ? 1 : 0.98,
              }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : -12,
                scale: shouldReduceMotion ? 1 : 0.98,
              }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: EASE }}
              className="relative w-full max-w-lg"
            >
              <Panel className="overflow-hidden">
                <TerminalChrome title="joao@belem — command palette" />

                <div
                  ref={logRef}
                  aria-live="polite"
                  className="max-h-72 space-y-2.5 overflow-y-auto p-4 font-mono text-sm"
                >
                  {log.length === 0 ? (
                    <p className="text-muted">
                      Try <span className="text-green">about</span>,{" "}
                      <span className="text-green">projects</span>, or just say{" "}
                      <span className="text-green">whoami</span>. Type{" "}
                      <span className="text-green">help</span> for more.
                    </p>
                  ) : (
                    log.map((entry, i) =>
                      entry.type === "command" ? (
                        <p key={i} className="text-fg">
                          <span className="text-green">{">"}</span> {entry.text}
                        </p>
                      ) : (
                        <p
                          key={i}
                          className={`whitespace-pre-line ${
                            entry.tone === "green"
                              ? "text-green"
                              : entry.tone === "comment"
                                ? "text-comment"
                                : "text-muted"
                          }`}
                        >
                          {entry.text}
                        </p>
                      ),
                    )
                  )}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit(value);
                  }}
                  className="border-t border-border"
                >
                  <div className="flex items-center gap-2 px-4 py-3">
                    <span className="font-mono text-sm text-green">{">"}</span>
                    <input
                      ref={inputRef}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      onKeyDown={onInputKeyDown}
                      placeholder="type a command…"
                      autoComplete="off"
                      spellCheck={false}
                      className="flex-1 bg-transparent font-mono text-sm text-fg placeholder:text-comment"
                    />
                  </div>
                </form>

                <div className="border-t border-border px-4 py-1.5 font-mono text-[10px] text-comment">
                  type &quot;help&quot; · ↑/↓ history · esc to close
                </div>
              </Panel>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
