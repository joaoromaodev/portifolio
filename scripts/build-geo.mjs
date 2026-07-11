// Build-time: project a world landmass into a fixed SVG viewBox (equirectangular,
// so latitude/longitude reads as a straight grid — the "GPS" look) and emit only
// path strings + the projected Belém pin position + its DMS coordinates.
// Output (lib/geo/world-paths.json) is what the client renders — no map lib,
// no topojson, no d3 ship to the browser.
//
//   node scripts/build-geo.mjs
//
// Source topojson: scripts/_countries-50m.json (world-atlas@2, gitignored).

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { geoEquirectangular, geoPath, geoGraticule10 } from "d3-geo";
import { feature } from "topojson-client";

const W = 420;
const H = 210;
const PAD = 6;
const BELEM = [-48.4902, -1.4558]; // [lng, lat]

const topo = JSON.parse(readFileSync("scripts/_countries-50m.json", "utf8"));
const land = feature(topo, topo.objects.land);

const projection = geoEquirectangular().fitExtent(
  [
    [PAD, PAD],
    [W - PAD, H - PAD],
  ],
  { type: "Sphere" },
);
const path = geoPath(projection);

function toDMS(deg, isLat) {
  const abs = Math.abs(deg);
  const d = Math.floor(abs);
  const mFull = (abs - d) * 60;
  const m = Math.floor(mFull);
  const s = Math.round((mFull - m) * 60);
  const dir = isLat ? (deg >= 0 ? "N" : "S") : deg >= 0 ? "E" : "W";
  return `${String(d).padStart(2, "0")}°${String(m).padStart(2, "0")}'${String(s).padStart(2, "0")}"${dir}`;
}

const [bx, by] = projection(BELEM);

// Round every coordinate in an SVG path to 1 decimal — imperceptible at this
// scale, meaningfully smaller payload.
const round = (d) => d.replace(/-?\d+\.\d+/g, (n) => (+n).toFixed(1));

const out = {
  viewBox: `0 0 ${W} ${H}`,
  land: round(path(land)),
  graticule: round(path(geoGraticule10())),
  outline: round(path({ type: "Sphere" })),
  belem: { x: Math.round(bx * 10) / 10, y: Math.round(by * 10) / 10 },
  coords: { lat: toDMS(BELEM[1], true), lng: toDMS(BELEM[0], false) },
};

mkdirSync("lib/geo", { recursive: true });
writeFileSync("lib/geo/world-paths.json", JSON.stringify(out));
console.log(
  `✓ lib/geo/world-paths.json — pin at (${out.belem.x}, ${out.belem.y}), ` +
    `${out.coords.lat} ${out.coords.lng}`,
);
