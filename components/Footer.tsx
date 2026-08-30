"use client";

import { profile } from "@/lib/site";
import { useI18n } from "@/components/i18n/LocaleProvider";

export function Footer() {
  const { dict } = useI18n();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-5 py-8 font-mono text-xs text-comment md:flex-row md:items-center md:px-8">
        <p>
          <span className="text-green">$</span> {dict.footer.builtBy}{" "}
          {profile.name} · Next.js · Tailwind · Framer Motion
        </p>
        <p>© {year} · {dict.profile.location}</p>
      </div>
    </footer>
  );
}
