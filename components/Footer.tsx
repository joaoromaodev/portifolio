import { profile } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-5 py-8 font-mono text-xs text-comment md:flex-row md:items-center md:px-8">
        <p>
          <span className="text-green">$</span> built by {profile.name} · Next.js
          · Tailwind · Framer Motion
        </p>
        <p>© {year} · {profile.location}</p>
      </div>
    </footer>
  );
}
