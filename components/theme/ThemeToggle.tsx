"use client";

import { useCallback, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";
import { useI18n } from "@/components/i18n/LocaleProvider";

// The `data-theme` attribute on <html> is the single source of truth: the
// bootstrap script sets it before first paint, and this button flips it. That
// makes it an external store, so it's read with useSyncExternalStore rather
// than mirrored into component state — no effect, no cascading render, and the
// server snapshot matches the markup React ships.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

// Dark is what the static HTML is authored against.
const getServerSnapshot = (): Theme => "dark";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { dict } = useI18n();
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next: Theme =
      document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* private mode — the choice just won't persist across reloads */
    }
  }, []);

  const label = theme === "light" ? dict.theme.toDark : dict.theme.toLight;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`flex size-9 flex-none items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-green/40 hover:text-fg ${className}`}
    >
      {/* Which glyph shows is decided in CSS (globals.css), so the right one is
          painted on the first frame — before this component hydrates. */}
      <svg
        className="theme-icon-dark size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
      <svg
        className="theme-icon-light size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
