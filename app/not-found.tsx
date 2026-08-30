import Link from "next/link";
import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";

// The 404 sits above both locale routes, so it can't know which language the
// visitor was heading for — it uses the site's default and offers a way back.
const dict = getDictionary(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: dict.notFound.metaTitle,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const copy = dict.notFound;

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-2xl flex-col justify-center px-5 md:px-8">
      <p className="font-mono text-sm text-comment">
        joao@belem ~ % <span className="text-fg">{copy.prompt}</span> .
      </p>
      <p className="mt-2 font-mono text-sm text-red">{copy.error}</p>

      <h1 className="mt-8 text-5xl font-semibold tracking-tight text-fg sm:text-6xl">
        {copy.title}
      </h1>
      <p className="mt-4 max-w-md text-muted">{copy.body}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-lg bg-green px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
        >
          {copy.home}
        </Link>
        <Link
          href="/#projects"
          className="rounded-lg border border-border px-5 py-2.5 text-sm text-fg transition-colors hover:border-fg/30"
        >
          {copy.work}
        </Link>
      </div>
    </main>
  );
}
