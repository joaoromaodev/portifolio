"use client";

import Image from "next/image";
import { flagColor, type Project } from "@/lib/projects";
import { useI18n } from "@/components/i18n/LocaleProvider";

// A screenshot when there is one; otherwise a deliberate placeholder in the
// site's own terminal idiom, rather than an empty frame. Some projects here
// can't publish screenshots at all (private gov systems), so the fallback is a
// normal case, not an error state.
//
// Two framings, because the thumbnail is used in two places: "edge" runs to
// the card's edges under its own bottom border (the home tiles, where the card
// has no padding of its own), and "inset" is a rounded, fully bordered frame
// for cards that sit inside padding (/projects).
export function ProjectThumb({
  project,
  variant = "edge",
  sizes,
  className = "",
}: {
  project: Project;
  variant?: "edge" | "inset";
  sizes: string;
  className?: string;
}) {
  const { tx } = useI18n();

  const frame =
    variant === "edge"
      ? "border-b border-border"
      : "rounded-lg border border-border";

  const shell = `relative aspect-[16/6] w-full flex-none overflow-hidden bg-bg ${frame} ${className}`;

  if (project.image) {
    return (
      <div className={shell}>
        <Image
          src={project.image}
          alt={tx(project.imageAlt) || `${project.title} — ${tx(project.kicker)}`}
          fill
          sizes={sizes}
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className={`${shell} flex items-center justify-center`}>
      {/* the same grid motif as the hero, held very quiet */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--color-border) 90%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-border) 90%, transparent) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <p className="relative font-mono text-sm text-comment">
        <span className={flagColor[project.flag]}>$</span> {project.slug}
      </p>
    </div>
  );
}
