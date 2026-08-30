"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n";
import { t, type Locale, type LocalizedText } from "@/lib/i18n/config";

type LocaleContextValue = {
  locale: Locale;
  dict: Dictionary;
  /** Resolve a bilingual project field for the current locale. */
  tx: (value: LocalizedText | undefined) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

// The locale is fixed per page (both `/` and `/pt` are statically generated),
// so this is a plain read-only context — no state, no re-renders, and nothing
// to hydrate incorrectly.
export function LocaleProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider
      value={{ locale, dict, tx: (value) => t(value, locale) }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useI18n(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside a <LocaleProvider>.");
  }
  return ctx;
}
