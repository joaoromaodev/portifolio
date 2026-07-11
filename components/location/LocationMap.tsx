"use client";

import geo from "@/lib/geo/world-paths.json";

// The whole globe is the radar screen: an orthographic hemisphere (projected
// at build time — scripts/build-geo.mjs) with a sweep hand rotating clockwise
// around the globe's center. Belém's blip is phase-locked to the sweep: it
// flashes red exactly as the hand passes its bearing, once per revolution.
const SWEEP_SPAN = 70;
const SWEEP_SECTORS = 24;
const PERIOD_S = 6; // must match --radar-period in globals.css

const { viewBox, land, graticule, outline, belem, globe, coords } = geo;

function polar(deg: number, r: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [Math.sin(rad) * r, -Math.cos(rad) * r];
}

// SVG has no conic gradient — a fan of thin triangular slices with decaying
// opacity reads as one smooth cone once it's spinning. Slices trail behind
// the leading edge (drawn at negative angles = counterclockwise).
const sweepSectors = Array.from({ length: SWEEP_SECTORS }, (_, i) => {
  const step = SWEEP_SPAN / SWEEP_SECTORS;
  const [x0, y0] = polar(-i * step, globe.r);
  const [x1, y1] = polar(-(i + 1) * step, globe.r);
  return {
    d: `M0,0 L${x0.toFixed(2)},${y0.toFixed(2)} L${x1.toFixed(2)},${y1.toFixed(2)} Z`,
    opacity: 0.55 * Math.pow(1 - i / SWEEP_SECTORS, 1.4),
  };
});

// Bearing of Belém from the globe center, clockwise from north. The sweep's
// leading edge points north at t=0, so it crosses Belém at bearing/360 of a
// period — a negative animation-delay phase-locks the blip to that instant.
const bearing =
  (Math.atan2(belem.x - globe.cx, -(belem.y - globe.cy)) * 180) / Math.PI;
const blipDelay = `${(-((1 - ((bearing + 360) % 360) / 360) * PERIOD_S)).toFixed(3)}s`;

export function LocationMap({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox={viewBox}
      className={className}
      role="img"
      aria-label={`Globe with a rotating radar sweep — the red blip marks Belém, Pará at ${coords.lat} ${coords.lng}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* sphere backdrop — slightly lifted from the panel so the disc reads */}
      <circle
        cx={globe.cx}
        cy={globe.cy}
        r={globe.r}
        fill="color-mix(in srgb, var(--color-green) 4%, var(--color-bg))"
      />

      {/* lat/long graticule — doubles as the radar grid */}
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

      {/* range rings — radar chrome over the whole globe */}
      <g
        fill="none"
        stroke="var(--color-green)"
        strokeWidth="0.5"
        opacity={0.28}
      >
        <circle cx={globe.cx} cy={globe.cy} r={globe.r * 0.33} />
        <circle cx={globe.cx} cy={globe.cy} r={globe.r * 0.66} />
      </g>

      {/* sphere limb */}
      <path
        d={outline}
        fill="none"
        stroke="color-mix(in srgb, var(--color-green) 45%, var(--color-border))"
        strokeWidth="1"
      />

      {/* sweep — rotates clockwise about the globe center. The invisible
          full-radius circle makes the group's fill-box symmetric around the
          pivot, so transform-origin:center is exactly the globe center. */}
      <g transform={`translate(${globe.cx} ${globe.cy})`}>
        <g className="radar-sweep">
          <circle r={globe.r} fill="none" />
          {sweepSectors.map((s, i) => (
            <path key={i} d={s.d} fill="var(--color-green)" opacity={s.opacity} />
          ))}
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={-globe.r}
            stroke="var(--color-green)"
            strokeWidth="0.9"
            opacity={0.9}
          />
        </g>
      </g>

      {/* Belém — red blip, flashing as the sweep passes over it */}
      <g transform={`translate(${belem.x} ${belem.y})`}>
        <circle
          r="2.4"
          className="radar-ping"
          fill="none"
          stroke="var(--color-red)"
          strokeWidth="0.8"
          style={{ animationDelay: blipDelay }}
        />
        <circle
          r="2.4"
          className="radar-blip"
          fill="var(--color-red)"
          style={{ animationDelay: blipDelay }}
        />
      </g>

      <text
        x={belem.x}
        y={belem.y - 7}
        textAnchor="middle"
        fontSize="9"
        className="font-mono"
        fill="var(--color-fg)"
      >
        Belém
      </text>
      <text
        x={belem.x}
        y={belem.y + 12.5}
        textAnchor="middle"
        fontSize="5.5"
        className="font-mono"
        fill="var(--color-comment)"
      >
        {coords.lat} {coords.lng}
      </text>
    </svg>
  );
}
