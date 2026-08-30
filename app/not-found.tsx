import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-2xl flex-col justify-center px-5 md:px-8">
      <p className="font-mono text-sm text-comment">
        joao@belem ~ % <span className="text-fg">cd</span> .
      </p>
      <p className="mt-2 font-mono text-sm text-red">
        cd: no such file or directory
      </p>

      <h1 className="mt-8 text-5xl font-semibold tracking-tight text-fg sm:text-6xl">
        404
      </h1>
      <p className="mt-4 max-w-md text-muted">
        That page doesn&apos;t exist. Everything on this site lives on one page —
        head back and scroll.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-lg bg-green px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
        >
          Back home
        </Link>
        <Link
          href="/#projects"
          className="rounded-lg border border-border px-5 py-2.5 text-sm text-fg transition-colors hover:border-fg/30"
        >
          See the work
        </Link>
      </div>
    </main>
  );
}
