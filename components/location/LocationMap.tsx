"use client";

import geo from "@/lib/geo/world-paths.json";

// World map, GPS-panel styling: faint lat/long graticule, a dim landmass, and
// a locked-on reticle over Belém with a radar-ping pulse and DMS coordinates.
// Geometry is pre-projected at build time (scripts/build-geo.mjs) — the
// browser only renders SVG paths, no map library or topojson at runtime.
export function LocationMap({ className = "" }: { className?: string }) {
  const { viewBox, land, graticule, outline, belem, coords } = geo;

  return (
    <svg
      viewBox={viewBox}
      className={className}
      role="img"
      aria-label={`World map with a GPS pin locked on Belém, Pará — ${coords.lat} ${coords.lng}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <path d={outline} fill="var(--color-bg)" opacity={0.4} />

      {/* lat/long grid — the "GPS" read */}
      <path
        d={graticule}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="0.5"
      />

      {/* landmass */}
      <path
        d={land}
        fill="color-mix(in srgb, var(--color-green) 10%, transparent)"
        stroke="color-mix(in srgb, var(--color-green) 35%, transparent)"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />

      <path
        d={outline}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="0.8"
      />

      {/* Belém — sonar sweep: a clock-hand line rotating clockwise around the
          pin, trailed by a fading afterimage; the blip brightens once per
          revolution as the hand sweeps back over it. */}
      <g transform={`translate(${belem.x} ${belem.y})`}>
        <g className="sonar-sweep">
          {[0, -8, -16, -24, -32].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const r = 13;
            return (
              <line
                key={deg}
                x1="0"
                y1="0"
                x2={Math.sin(rad) * r}
                y2={-Math.cos(rad) * r}
                stroke="var(--color-red)"
                strokeWidth="0.9"
                strokeLinecap="round"
                opacity={[1, 0.55, 0.32, 0.16, 0.06][i]}
              />
            );
          })}
        </g>

        <circle r="2.2" className="sonar-blip" fill="var(--color-red)" />
        <circle r="2.2" fill="none" stroke="var(--color-bg)" strokeWidth="0.8" />

        <text x="10" y="-2" fontSize="9" className="font-mono" fill="var(--color-fg)">
          Belém
        </text>
        <text x="10" y="7.5" fontSize="6" className="font-mono" fill="var(--color-comment)">
          {coords.lat} {coords.lng}
        </text>
      </g>
    </svg>
  );
}
