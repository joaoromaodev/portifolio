"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { Panel, TerminalChrome } from "@/components/ui/Panel";
import { profile } from "@/lib/site";
import { useI18n } from "@/components/i18n/LocaleProvider";
import type { Dictionary } from "@/lib/i18n";

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
function resolveCommand(raw: string, dict: Dictionary): Resolved {
  const cmd = raw.trim().toLowerCase();
  const nav = dict.nav.items;
  const c = dict.commandPalette;

  if (cmd === "help") {
    const list = nav.map((n) => `  ${n.label}`).join("\n");
    return {
      text: `${c.available}\n${list}\n  whoami\n  github\n  linkedin\n  clear\n\n${c.typeSection}`,
    };
  }

  if (cmd === "whoami") {
    return {
      text: `${profile.name} — ${dict.profile.role}\n${dict.profile.location} · ${dict.profile.status}`,
    };
  }

  if (cmd.startsWith("sudo")) return { text: c.sudo };

  if (cmd === "triforce" || cmd === "zelda") return { text: c.triforce };

  if (cmd === "github") {
    return {
      text: `${c.opening} GitHub ↗`,
      tone: "green",
      openUrl: profile.links.github,
    };
  }

  if (cmd === "linkedin") {
    return {
      text: `${c.opening} LinkedIn ↗`,
      tone: "green",
      openUrl: profile.links.linkedin,
    };
  }

  const match = nav.find((n) => n.id === cmd || n.label === cmd);
  if (match) {
    return {
      text: c.jumping.replace("{label}", match.label),
      tone: "green",
      navigateTo: match.id,
    };
  }

  return {
    text: `${c.notFound.replace("{cmd}", raw)}\n${c.tryHelp}`,
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
  const { dict } = useI18n();
  const c = dict.commandPalette;
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

    const resolved = resolveCommand(cmd, dict);
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

  // The empty-state hint names four commands and highlights each one, so it's
  // assembled from the template rather than concatenated — the section names
  // are the localized nav labels, which is what the palette actually accepts.
  const navLabel = (id: string) =>
    dict.nav.items.find((n) => n.id === id)?.label ?? id;
  const hintCommands = [
    navLabel("about"),
    navLabel("projects"),
    "whoami",
    "help",
  ];
  const emptyHint = c.empty
    .split(/(\{[abcd]\})/)
    .map((part, i) => {
      const slot = { "{a}": 0, "{b}": 1, "{c}": 2, "{d}": 3 }[part];
      return slot === undefined ? (
        part
      ) : (
        <span key={i} className="text-green">
          {hintCommands[slot]}
        </span>
      );
    });

  return (
    <>
      <motion.button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={c.open}
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
        <span>{c.trigger}</span>
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
              aria-label={c.label}
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
                <TerminalChrome title={c.chrome} />

                <div
                  ref={logRef}
                  aria-live="polite"
                  className="max-h-72 space-y-2.5 overflow-y-auto p-4 font-mono text-sm"
                >
                  {log.length === 0 ? (
                    <p className="text-muted">{emptyHint}</p>
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
                      placeholder={c.placeholder}
                      autoComplete="off"
                      spellCheck={false}
                      className="flex-1 bg-transparent font-mono text-sm text-fg placeholder:text-comment"
                    />
                  </div>
                </form>

                <div className="border-t border-border px-4 py-1.5 font-mono text-[10px] text-comment">
                  {c.hint}
                </div>
              </Panel>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
