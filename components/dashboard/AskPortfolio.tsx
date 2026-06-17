"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Panel, TerminalChrome } from "@/components/ui/Panel";
import { EqualizerBars } from "./EqualizerBars";
import { useTurnstile } from "./useTurnstile";

const SUGGESTIONS = [
  "What does João do at SEDUC?",
  "Show me the strongest project",
  "Is he open to remote work?",
];

type Msg = { role: "user" | "assistant"; text: string };

// "Ask my portfolio" chat (DESIGN.md §6). Streams Claude Haiku 4.5 from
// /api/ask; the KITT voicebox bars animate while the answer streams in.
export function AskPortfolio({ className = "" }: { className?: string }) {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const turnstile = useTurnstile();

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || streaming) return;

    setError(null);
    setValue("");
    setMessages((m) => [
      ...m,
      { role: "user", text: question },
      { role: "assistant", text: "" },
    ]);
    setStreaming(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          turnstileToken: turnstile.getToken(),
        }),
      });

      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "The assistant is unavailable right now.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      // Stream chunks into the last (assistant) message.
      for (;;) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        const piece = decoder.decode(chunk, { stream: true });
        setMessages((m) => {
          const next = [...m];
          next[next.length - 1] = {
            role: "assistant",
            text: next[next.length - 1].text + piece,
          };
          return next;
        });
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
      }
    } catch (e) {
      setMessages((m) => m.slice(0, -1)); // drop the empty assistant bubble
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setStreaming(false);
    }
  };

  const hasChat = messages.length > 0;

  return (
    <motion.div variants={fadeUp} className={className}>
      <Panel className="flex h-full flex-col overflow-hidden">
        <TerminalChrome title="ask-my-portfolio · claude" />

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto"
            style={{ maxHeight: 240 }}
          >
            {/* assistant intro */}
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 flex-none">
                <EqualizerBars
                  active={streaming}
                  bars={5}
                  color="var(--color-cyan)"
                />
              </span>
              <p className="text-sm text-fg">
                Ask me anything about João&apos;s work, projects or background.{" "}
                <span className="text-muted">
                  Powered by Claude — answers stay within the portfolio.
                </span>
              </p>
            </div>

            {/* conversation */}
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "text-right" : "text-left"}
              >
                <span
                  className={[
                    "inline-block max-w-[85%] rounded-lg px-3 py-2 text-sm",
                    m.role === "user"
                      ? "bg-green/15 text-fg"
                      : "border border-border bg-bg text-fg",
                  ].join(" ")}
                >
                  {m.text || (
                    <span className="text-comment">
                      <EqualizerBars active bars={4} color="var(--color-cyan)" />
                    </span>
                  )}
                </span>
              </div>
            ))}

            {error ? (
              <p className="font-mono text-xs text-red">{error}</p>
            ) : null}
          </div>

          {/* suggestion chips (only before first message) */}
          {!hasChat ? (
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={streaming}
                  onClick={() => send(s)}
                  className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-muted transition-colors enabled:hover:border-cyan/50 enabled:hover:text-cyan disabled:opacity-60"
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(value);
            }}
            className="mt-auto"
          >
            <div className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2">
              <span className="font-mono text-sm text-green">{">"}</span>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={streaming}
                maxLength={500}
                placeholder={streaming ? "Thinking…" : "Type a question…"}
                className="flex-1 bg-transparent font-mono text-sm text-fg placeholder:text-comment focus:outline-none disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={streaming || !value.trim()}
                className="rounded-md bg-cyan px-2.5 py-1 font-mono text-xs font-medium text-bg transition-opacity disabled:opacity-40"
              >
                send
              </button>
            </div>
            {/* Cloudflare Turnstile widget — only renders when configured */}
            {turnstile.enabled ? (
              <div ref={turnstile.containerRef} className="mt-2" />
            ) : null}
            <p className="mt-1.5 font-mono text-[10px] text-comment">
              rate-limited · max 300 tokens · no SIMF / gov data
            </p>
          </form>
        </div>
      </Panel>
    </motion.div>
  );
}
