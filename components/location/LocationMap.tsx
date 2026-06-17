"use client";

import geo from "@/lib/geo/brazil-paths.json";

// Real geographic map of Brazil (+ faint neighbours) with an animated pin on
// Belém. Geometry is pre-projected at build time (scripts/build-geo.mjs) — the
// browser only renders SVG paths, no map library or topojson at runtime.
export function LocationMap({ className = "" }: { className?: string }) {
  const { viewBox, brazil, others, belem } = geo;

  return (
    <svg
      viewBox={viewBox}
      className={className}
      role="img"
      aria-label="Map of Brazil with a pin marking Belém, Pará"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* neighbouring countries — faint context */}
      <g fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="0.5">
        {others.map((d, i) => (
          <path key={i} d={d} opacity={0.5} />
        ))}
      </g>

      {/* Brazil — highlighted */}
      <path
        d={brazil}
        fill="color-mix(in srgb, var(--color-green) 12%, transparent)"
        stroke="color-mix(in srgb, var(--color-green) 45%, transparent)"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />

      {/* Belém pin */}
      <g transform={`translate(${belem.x} ${belem.y})`}>
        <circle r="7" className="loc-ping" fill="var(--color-green)" />
        <circle r="3.4" fill="var(--color-green)" />
        <circle r="3.4" fill="none" stroke="var(--color-bg)" strokeWidth="1.2" />
        <text
          x="9"
          y="3.5"
          fontSize="11"
          className="font-mono"
          fill="var(--color-fg)"
        >
          Belém
        </text>
      </g>

      <style>{`
        .loc-ping { transform-origin: center; animation: pin-pulse 2.4s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) { .loc-ping { animation: none; opacity: 0; } }
      `}</style>
    </svg>
  );
}
