// Build-time: project the visible hemisphere of an orthographic globe into a
// fixed square SVG viewBox and emit only path strings + the projected Belém
// position + globe center/radius + DMS coordinates. Output
// (lib/geo/world-paths.json) is what the client renders — no map lib, no
// topojson, no d3 ship to the browser.
//
//   node scripts/build-geo.mjs
//
// Source topojson: scripts/_countries-50m.json (world-atlas@2, gitignored).

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { geoOrthographic, geoPath, geoGraticule10 } from "d3-geo";
import { feature } from "topojson-client";

const SIZE = 240;
const PAD = 6;
const BELEM = [-48.4902, -1.4558]; // [lng, lat]

// Center the visible hemisphere on the mid-Atlantic: South America on the
// left, West Africa/Europe on the right, and Belém sitting off-center — the
// radar sweep needs the blip away from the pivot to read as a "pass".
const VIEW_CENTER = [-25, -8]; // [lng, lat]

const topo = JSON.parse(readFileSync("scripts/_countries-50m.json", "utf8"));
const land = feature(topo, topo.objects.land);

const projection = geoOrthographic()
  .rotate([-VIEW_CENTER[0], -VIEW_CENTER[1]])
  .fitExtent(
    [
      [PAD, PAD],
      [SIZE - PAD, SIZE - PAD],
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
const [cx, cy] = projection.translate();
const r = projection.scale(); // orthographic: scale === sphere radius in px

// Round every coordinate in an SVG path to 1 decimal — imperceptible at this
// scale, meaningfully smaller payload.
const round = (d) => d.replace(/-?\d+\.\d+/g, (n) => (+n).toFixed(1));
const r1 = (n) => Math.round(n * 10) / 10;

const out = {
  viewBox: `0 0 ${SIZE} ${SIZE}`,
  land: round(path(land)),
  graticule: round(path(geoGraticule10())),
  outline: round(path({ type: "Sphere" })),
  belem: { x: r1(bx), y: r1(by) },
  globe: { cx: r1(cx), cy: r1(cy), r: r1(r) },
  coords: { lat: toDMS(BELEM[1], true), lng: toDMS(BELEM[0], false) },
};

mkdirSync("lib/geo", { recursive: true });
writeFileSync("lib/geo/world-paths.json", JSON.stringify(out));
console.log(
  `✓ lib/geo/world-paths.json — globe r=${out.globe.r} @ (${out.globe.cx}, ${out.globe.cy}), ` +
    `Belém at (${out.belem.x}, ${out.belem.y}), ${out.coords.lat} ${out.coords.lng}`,
);
