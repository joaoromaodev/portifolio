"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { useI18n } from "@/components/i18n/LocaleProvider";
import type { GalleryItem } from "@/lib/projects";

// Screens grid + a lightbox. The thumbnails are real buttons rather than
// clickable divs, so the whole gallery is reachable by keyboard; the lightbox
// traps focus while open and hands it back to the thumbnail that opened it.
export function Gallery({ items }: { items: GalleryItem[] }) {
  const { dict, tx } = useI18n();
  const copy = dict.projectDetail;
  const reduce = useReducedMotion();

  const [open, setOpen] = useState<number | null>(null);
  const triggersRef = useRef<(HTMLButtonElement | null)[]>([]);
  const dialogRef = useRef<HTMLDivElement>(null);
  // Which thumbnail to focus once the lightbox closes.
  const openedFrom = useRef<number | null>(null);

  const show = (i: number) => {
    openedFrom.current = i;
    setOpen(i);
  };

  const close = useCallback(() => {
    setOpen(null);
    const i = openedFrom.current;
    if (i != null) triggersRef.current[i]?.focus();
  }, []);

  const step = useCallback(
    (delta: 1 | -1) =>
      setOpen((cur) =>
        cur == null ? cur : (cur + delta + items.length) % items.length,
      ),
    [items.length],
  );

  useEffect(() => {
    if (open == null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "Tab") {
        // Keep Tab inside the dialog while it's open.
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled])",
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    // Don't let the page scroll behind the overlay.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, close, step]);

  // Move focus into the dialog when it opens.
  useEffect(() => {
    if (open == null) return;
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
  }, [open]);

  if (!items.length) return null;

  const current = open == null ? null : items[open];

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map((item, i) => (
          <li key={item.src}>
            <button
              type="button"
              ref={(el) => {
                triggersRef.current[i] = el;
              }}
              onClick={() => show(i)}
              aria-label={`${tx(item.alt)} — ${copy.openImage}`}
              className="group block w-full overflow-hidden rounded-lg border border-border bg-bg text-left transition-colors hover:border-green/50"
            >
              <span className="relative block aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={item.src}
                  alt={tx(item.alt)}
                  fill
                  sizes="(min-width: 640px) 45vw, 92vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </span>
              {item.caption ? (
                <span className="block border-t border-border px-3 py-2 font-mono text-[11px] leading-relaxed text-muted">
                  {tx(item.caption)}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      {/* Mounted and unmounted outright, with no exit animation. An
          AnimatePresence exit here left the faded-out overlay in the DOM at
          opacity 0 — still fixed inset-0, still capturing pointer events, so
          the whole page became unclickable after closing the lightbox once.
          A fade-out isn't worth that; closing instantly is normal for a
          lightbox anyway. */}
      {current ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          >
            <div
              onClick={close}
              aria-hidden="true"
              className="absolute inset-0 bg-bg/90 backdrop-blur-sm"
            />

            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={tx(current.alt)}
              className="relative flex max-h-full w-full max-w-5xl flex-col gap-3 overflow-y-auto"
            >
              <div className="flex items-center justify-between gap-3 font-mono text-xs text-muted">
                <span>
                  {copy.counter
                    .replace("{n}", String((open ?? 0) + 1))
                    .replace("{total}", String(items.length))}
                </span>
                <button
                  type="button"
                  onClick={close}
                  className="rounded border border-border px-2 py-1 transition-colors hover:border-green/50 hover:text-fg"
                >
                  {copy.close} ✕
                </button>
              </div>

              <div className="relative overflow-hidden rounded-lg border border-border bg-bg">
                {/* Intrinsic sizing: the screenshots are 1440x900, so this
                    keeps the aspect ratio without hardcoding a crop. */}
                <Image
                  src={current.src}
                  alt={tx(current.alt)}
                  width={1440}
                  height={900}
                  sizes="(min-width: 1024px) 1024px, 92vw"
                  className="h-auto w-full"
                  priority
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label={copy.previous}
                  className="rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-green/50 hover:text-fg"
                >
                  ←
                </button>
                {current.caption ? (
                  <p className="min-w-0 flex-1 text-center text-sm text-muted">
                    {tx(current.caption)}
                  </p>
                ) : (
                  <span className="flex-1" />
                )}
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label={copy.next}
                  className="rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-green/50 hover:text-fg"
                >
                  →
                </button>
              </div>
            </div>
          </motion.div>
      ) : null}
    </>
  );
}
