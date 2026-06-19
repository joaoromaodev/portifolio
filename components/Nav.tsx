"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { nav, profile } from "@/lib/site";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile sheet on resize back to desktop or on hash navigation.
  useEffect(() => {
    if (!open) return;
    const closeOnHash = () => setOpen(false);
    const closeOnDesktop = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("hashchange", closeOnHash);
    window.addEventListener("resize", closeOnDesktop);
    return () => {
      window.removeEventListener("hashchange", closeOnHash);
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, [open]);

  return (
    <header
      className={[
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled || open
          ? "border-border bg-bg/80 backdrop-blur-md"
          : "border-transparent bg-transparent",
      ].join(" ")}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <a
          href="#top"
          className="font-mono text-sm font-semibold text-fg transition-colors hover:text-green"
        >
          <span className="text-green">~/</span>
          {profile.name.toLowerCase().replace(" ", "-")}
        </a>

        <ul className="hidden items-center gap-5 lg:flex">
          {nav.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="font-mono text-sm text-muted transition-colors hover:text-fg"
              >
                <span className="text-comment">/</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="hidden rounded-lg border border-green/40 px-3 py-1.5 font-mono text-sm text-green transition-colors hover:bg-green/10 sm:inline-block"
          >
            get in touch
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex size-9 flex-none items-center justify-center rounded-lg border border-border text-fg transition-colors hover:border-green/40 lg:hidden"
          >
            <span className="relative flex h-3.5 w-4 flex-col justify-between" aria-hidden="true">
              <span
                className={`h-px w-full bg-fg transition-transform duration-300 ${
                  open ? "translate-y-[6.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-full bg-fg transition-opacity duration-300 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-px w-full bg-fg transition-transform duration-300 ${
                  open ? "-translate-y-[6.5px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="overflow-hidden border-t border-border bg-bg/95 backdrop-blur-md lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 py-4">
              {nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-2 py-2.5 font-mono text-sm text-muted transition-colors hover:bg-surface hover:text-fg"
                  >
                    <span className="text-comment">/</span> {item.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg border border-green/40 px-3 py-2 text-center font-mono text-sm text-green transition-colors hover:bg-green/10"
                >
                  get in touch
                </a>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
