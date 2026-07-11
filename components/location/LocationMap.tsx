"use client";

import geo from "@/lib/geo/world-paths.json";

// Radar-screen math for the Belém pin: range rings + crosshair (static),
// and a solid, fading wedge approximated with thin triangular slices — SVG
// has no conic gradient, so a sweep of narrow sectors with decaying opacity
// reads as one smooth cone once it's spinning.
const RADAR_R = 14;
const SWEEP_SPAN = 85;
const SWEEP_SECTORS = 22;

function polar(deg: number, r: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [Math.sin(rad) * r, -Math.cos(rad) * r];
}

const sweepSectors = Array.from({ length: SWEEP_SECTORS }, (_, i) => {
  const step = SWEEP_SPAN / SWEEP_SECTORS;
  const [x0, y0] = polar(-i * step, RADAR_R);
  const [x1, y1] = polar(-(i + 1) * step, RADAR_R);
  return {
    d: `M0,0 L${x0.toFixed(2)},${y0.toFixed(2)} L${x1.toFixed(2)},${y1.toFixed(2)} Z`,
    opacity: 0.75 * Math.pow(1 - i / SWEEP_SECTORS, 1.4),
  };
});

// World map, GPS-panel styling: faint lat/long graticule, a dim landmass, and
// a radar screen locked on Belém — range rings, crosshair, a rotating sweep
// and DMS coordinates. Geometry is pre-projected at build time
// (scripts/build-geo.mjs) — the browser only renders SVG paths, no map
// library or topojson at runtime.
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

      {/* Belém — a radar screen: static range rings + crosshair, a solid
          sweep cone rotating clockwise, and a blip that brightens once per
          revolution as the sweep passes back over it. */}
      <g transform={`translate(${belem.x} ${belem.y})`}>
        {/* dark backdrop so the rings/sweep read clearly over the landmass */}
        <circle r={RADAR_R} fill="var(--color-bg)" opacity={0.55} />

        <g className="radar-grid" fill="none" stroke="var(--color-green)" strokeWidth="0.5" opacity={0.55}>
          <circle r={RADAR_R * 0.25} />
          <circle r={RADAR_R * 0.5} />
          <circle r={RADAR_R * 0.75} />
          <circle r={RADAR_R} />
          <line x1={-RADAR_R} y1="0" x2={RADAR_R} y2="0" />
          <line x1="0" y1={-RADAR_R} x2="0" y2={RADAR_R} />
        </g>

        <g className="sonar-sweep">
          {sweepSectors.map((s, i) => (
            <path key={i} d={s.d} fill="var(--color-green)" opacity={s.opacity} />
          ))}
          <line x1="0" y1="0" x2="0" y2={-RADAR_R} stroke="var(--color-green)" strokeWidth="0.8" opacity={0.9} />
        </g>

        <circle r="2.2" className="sonar-blip" fill="var(--color-green)" />
        <circle r="2.2" fill="none" stroke="var(--color-bg)" strokeWidth="0.8" />

        <text x={RADAR_R + 3} y="-2" fontSize="9" className="font-mono" fill="var(--color-fg)">
          Belém
        </text>
        <text x={RADAR_R + 3} y="7.5" fontSize="6" className="font-mono" fill="var(--color-comment)">
          {coords.lat} {coords.lng}
        </text>
      </g>
    </svg>
  );
}
