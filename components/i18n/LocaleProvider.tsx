"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n";
import {
  DEFAULT_LOCALE,
  localePath,
  t,
  type Locale,
  type LocalizedText,
} from "@/lib/i18n/config";

type LocaleContextValue = {
  locale: Locale;
  dict: Dictionary;
  /** Resolve a bilingual project field for the current locale. */
  tx: (value: LocalizedText | undefined) => string;
  /** Where the language toggle goes — this same page in the other locale. */
  altPath: string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

// The locale is fixed per page (both `/` and `/pt` are statically generated),
// so this is a plain read-only context — no state, no re-renders, and nothing
// to hydrate incorrectly.
export function LocaleProvider({
  locale,
  dict,
  altPath,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  /**
   * The counterpart URL for the language toggle. Defaults to the other
   * locale's home page; pages that exist in both locales (project case
   * studies) pass their own, so switching language keeps you on the same
   * content instead of dumping you back at the top.
   */
  altPath?: string;
  children: ReactNode;
}) {
  const other: Locale = locale === DEFAULT_LOCALE ? "pt" : DEFAULT_LOCALE;
  return (
    <LocaleContext.Provider
      value={{
        locale,
        dict,
        tx: (value) => t(value, locale),
        altPath: altPath ?? localePath(other),
      }}
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
