"use client";

import { useEffect, useState } from "react";
import { nav, profile } from "@/lib/site";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled
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

        <ul className="hidden items-center gap-6 md:flex">
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

        <a
          href="#contact"
          className="rounded-lg border border-green/40 px-3 py-1.5 font-mono text-sm text-green transition-colors hover:bg-green/10"
        >
          get in touch
        </a>
      </nav>
    </header>
  );
}
