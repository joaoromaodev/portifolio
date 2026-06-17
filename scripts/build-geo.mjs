// Build-time: project Brazil (+ neighbours for context) into a fixed SVG
// viewBox and emit only the path strings + the projected Belém pin position.
// Output (lib/geo/brazil-paths.json) is what the client renders — no map lib,
// no topojson, no d3 ship to the browser.
//
//   node scripts/build-geo.mjs
//
// Source topojson: scripts/_countries-50m.json (world-atlas@2, gitignored).

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { geoMercator, geoPath, geoBounds } from "d3-geo";
import { feature } from "topojson-client";

const W = 380;
const H = 440;
const PAD = 28;
const BELEM = [-48.4902, -1.4558]; // [lng, lat]

const topo = JSON.parse(readFileSync("scripts/_countries-50m.json", "utf8"));
const countries = feature(topo, topo.objects.countries).features;

const brazil = countries.find((c) => c.properties.name === "Brazil");
if (!brazil) throw new Error("Brazil not found in topojson");

// Fit the projection to Brazil's bounds with padding; neighbours peek in.
const projection = geoMercator().fitExtent(
  [
    [PAD, PAD],
    [W - PAD, H - PAD],
  ],
  brazil,
);
const path = geoPath(projection);

// Keep any country whose projected bounds intersect the viewBox (context).
function intersectsView(f) {
  const b = path.bounds(f); // [[x0,y0],[x1,y1]] in projected px
  const [[x0, y0], [x1, y1]] = b;
  return x1 >= 0 && x0 <= W && y1 >= 0 && y0 <= H;
}

const others = [];
for (const c of countries) {
  if (c === brazil) continue;
  if (!Number.isFinite(geoBounds(c)[0][0])) continue;
  if (!intersectsView(c)) continue;
  const d = path(c);
  if (d) others.push(d);
}

const [bx, by] = projection(BELEM);

// Round every coordinate in an SVG path to 1 decimal — imperceptible at this
// scale, ~60% smaller payload.
const round = (d) => d.replace(/-?\d+\.\d+/g, (n) => (+n).toFixed(0));

const out = {
  viewBox: `0 0 ${W} ${H}`,
  brazil: round(path(brazil)),
  others: others.map(round),
  belem: { x: Math.round(bx * 10) / 10, y: Math.round(by * 10) / 10 },
};

mkdirSync("lib/geo", { recursive: true });
writeFileSync("lib/geo/brazil-paths.json", JSON.stringify(out));
console.log(
  `✓ lib/geo/brazil-paths.json — ${others.length} context countries, ` +
    `Belém pin at (${out.belem.x}, ${out.belem.y})`,
);
