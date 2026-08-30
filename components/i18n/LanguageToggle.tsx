"use client";

import Link from "next/link";
import { useI18n } from "./LocaleProvider";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";

// A link, not a button: each language is a real, indexable, shareable URL, so
// switching should behave like navigation (middle-click, copy link, back
// button all work). `hrefLang` also tells crawlers what sits on the other end.
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, dict, altPath } = useI18n();
  const other = locale === DEFAULT_LOCALE ? "pt" : DEFAULT_LOCALE;

  return (
    <Link
      href={altPath}
      hrefLang={other === "pt" ? "pt-BR" : "en"}
      aria-label={`${dict.language.switchLabel}: ${dict.language.other}`}
      title={`${dict.language.switchLabel}: ${dict.language.other}`}
      className={`flex h-9 flex-none items-center justify-center rounded-lg border border-border px-2.5 font-mono text-xs text-muted transition-colors hover:border-green/40 hover:text-fg ${className}`}
    >
      {dict.language.otherShort}
    </Link>
  );
}
