/**
 * Generates the LinkedIn cover for romaodev.com's owner.
 *
 * A dendritic drainage basin seen from above: one trunk entering at the mouth,
 * branching upstream into finer tributaries, enclosed by its drainage divide.
 * It reads as an Amazonian river system and as a network topology at once, so
 * the "technology" note comes from the structure rather than from any
 * neon/circuit iconography. Palette is locked to the site's own tokens
 * (app/globals.css).
 *
 * The branching is generated, not drawn: recursive structure is what an
 * algorithm renders convincingly — unlike the procedural foliage this script
 * tried first, which came out as spikes and shards.
 *
 * Two outputs. `cover.png` is the one to ship: no type, because LinkedIn
 * prints the name, headline and location as real text directly beneath the
 * cover, so anything written here is a duplicate of what sits 40px below it.
 * `cover-site.png` is the fallback if a payload is wanted anyway, carrying the
 * one thing LinkedIn does NOT surface above the fold — the website.
 *
 *   node scripts/build-linkedin-cover.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const W = 1584;
const H = 396;
const OUT = new URL("../docs/linkedin/", import.meta.url);
const RAD = Math.PI / 180;

// Seeded PRNG so the basin is byte-identical across runs.
let seed = 20261113;
const reseed = (s) => {
  seed = s;
};
const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const jitter = (a) => (rnd() - 0.5) * 2 * a;

/**
 * One meandering channel segment, as a quadratic with its control point pushed
 * perpendicular to the flow — straight lines read as pipes, not rivers.
 */
function segment(x1, y1, x2, y2, bow) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const cx = (x1 + x2) / 2 + (-dy / len) * bow;
  const cy = (y1 + y2) / 2 + (dx / len) * bow;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

/**
 * Walks the basin upstream. Each tributary carries a share of the parent's
 * flow, so width decays on its own and the system fades into filigree.
 *
 * The floor is 1.0px, not 0.4: sub-pixel ink is pure noise at every scale
 * LinkedIn displays this at (71% on desktop, 24% on mobile) and it was what
 * dissolved the small-size reading into a uniform grey film.
 */
function basin(x, y, angle, len, width, depth, out, tips) {
  if (width < 1.0 || depth > 16) return;

  // A channel wanders over its run rather than changing direction only at
  // junctions.
  let cx = x;
  let cy = y;
  let a = angle;
  for (let i = 0; i < 2; i++) {
    a += jitter(7);
    const sl = len / 2;
    const nx = cx + Math.cos(a * RAD) * sl;
    const ny = cy + Math.sin(a * RAD) * sl;
    out.push({ d: segment(cx, cy, nx, ny, jitter(sl * 0.18)), w: width });
    cx = nx;
    cy = ny;
    tips.push([cx, cy]);
  }

  // The first generations stay a single trunk, so the river travels in from
  // the mouth and crosses the banner before it starts fanning out. Branching
  // too early piles the whole basin left of centre — on the same side as
  // LinkedIn's profile photo and name block.
  if (depth < 2) {
    basin(cx, cy, a + jitter(9), len * 0.95, width * 0.93, depth + 1, out, tips);
    return;
  }

  const n = rnd() < 0.34 ? 3 : 2;
  const spread = 26 + rnd() * 20;
  const shares = Array.from({ length: n }, () => 0.55 + rnd() * 0.5);
  const total = shares.reduce((s, v) => s + v, 0);

  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    let a2 = angle - spread + 2 * spread * t + jitter(10);

    // Steer channels back toward the horizon so the basin spreads across the
    // banner instead of running off the top or bottom edge.
    const edge = Math.min(cy, H - cy) / H;
    if (edge < 0.24) a2 += (cy < H / 2 ? 1 : -1) * (0.24 - edge) * 160;

    basin(cx, cy, a2, len * (0.62 + rnd() * 0.14), width * (shares[i] / total) * 1.62, depth + 1, out, tips);
  }
}

/** Convex hull, monotone chain. Used as the seed for the drainage divide. */
function hull(points) {
  const pts = [...points].sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (src) => {
    const out = [];
    for (const p of src) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], p) <= 0) out.pop();
      out.push(p);
    }
    out.pop();
    return out;
  };
  return [...half(pts), ...half([...pts].reverse())];
}

/**
 * The drainage divide: a closed, irregular ridge around the catchment.
 *
 * This is the element that makes the figure read as hydrology at all. Without
 * a plane to be read against, a branching figure reads as growth or discharge
 * — root system, Lichtenberg figure, nerve — because those are what branch in
 * a void. One enclosing outline turns it into "basin, seen from above".
 */
function divide(tips) {
  const h = hull(tips);
  const cx = h.reduce((s, p) => s + p[0], 0) / h.length;
  const cy = h.reduce((s, p) => s + p[1], 0) / h.length;

  // Push each vertex outward past the headwaters, and break the straight runs
  // with an outward-displaced midpoint so the ridge is irregular, not a polygon.
  const ring = [];
  for (let i = 0; i < h.length; i++) {
    const a = h[i];
    const b = h[(i + 1) % h.length];
    for (const [px, py, extra] of [
      [a[0], a[1], 0],
      [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 1],
    ]) {
      const dx = px - cx;
      const dy = py - cy;
      const d = Math.hypot(dx, dy) || 1;
      const push = 22 + jitter(14) + extra * (10 + jitter(16));
      ring.push([px + (dx / d) * push, py + (dy / d) * push]);
    }
  }

  // Smooth the ring: quadratics through the vertices, anchored on the midpoints.
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  let d = `M ${mid(ring[0], ring[1]).map((v) => v.toFixed(1)).join(" ")}`;
  for (let i = 1; i <= ring.length; i++) {
    const c = ring[i % ring.length];
    const m = mid(c, ring[(i + 1) % ring.length]);
    d += ` Q ${c[0].toFixed(1)} ${c[1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`;
  }
  return `<path d="${d} Z" fill="none" stroke="#1e2f35" stroke-width="1.6"/>`;
}

/**
 * Segments are grouped into one path per width band rather than emitted
 * individually: semi-transparent strokes that overlap at a junction blend
 * twice and leave a bright bead on the trunk. Within a single path element
 * they do not. It also takes the output from ~21k paths down to a few dozen.
 */
function render(channels) {
  const bands = new Map();
  for (const seg of channels) {
    const key = Math.max(1, Math.round(seg.w * 4) / 4).toFixed(2);
    if (!bands.has(key)) bands.set(key, []);
    bands.get(key).push(seg.d);
  }

  // Thin filigree first, trunk last, so junctions read as confluences.
  const keys = [...bands.keys()].sort((a, b) => Number(a) - Number(b));

  // Every stroke is fully opaque and the hierarchy is carried by COLOUR, not
  // alpha. Semi-transparent strokes blend twice wherever two width bands meet,
  // which studded the trunk with bright beads at every confluence.
  //
  // The dim end is a present teal rather than near-background, and the ramp is
  // flattened, because the bulk of the ink is thin: a steep ramp put ~93% of
  // the image under 1.3:1 and left the mid tones hollow, which is what read as
  // mud once downscaled. The bright end is green, by the owner's call: the
  // critique argued for cyan on the grounds that water reads cyan and leaves
  // read green, but saturated cyan came out clinical — closer to a vascular
  // diagram than to a river. Teal -> green is still a natural ramp.
  const ramp = (t) => {
    const from = [0x2d, 0x64, 0x6d];
    const to = [0x4f, 0xb7, 0x5f];
    const c = from.map((v, i) => Math.round(v + (to[i] - v) * t));
    return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
  };

  return keys
    .map((k) => {
      const w = Number(k);
      const t = Math.max(0.18, Math.min(1, Math.pow(w / 26, 0.35)));
      // Blunt headwaters: a round cap on a hairline is a point, and tapering
      // points are a root/nerve cue. Real headwater tips end blunt.
      const cap = w < 1.6 ? "butt" : "round";
      return `<path d="${bands.get(k).join(" ")}" fill="none" stroke="${ramp(
        t
      )}" stroke-width="${k}" stroke-linecap="${cap}" stroke-linejoin="round"/>`;
    })
    .join("\n  ");
}

function svg(payload) {
  const channels = [];
  const tips = [];
  // One system only: mouth at the right edge, flowing upstream to the west and
  // fanning out across the middle. Two systems left a dead void between them.
  reseed(20261113);
  basin(W + 60, 334, 191, 270, 12, 0, channels, tips);

  // The website is the one thing LinkedIn does not surface above the fold, so
  // it is the only payload worth the space. One line, large enough to survive
  // the 24% mobile downscale (68px native → 16px rendered).
  const text = payload
    ? `<g font-family="ui-monospace, Menlo, Consolas, monospace">
    <text x="${W - 84}" y="96" text-anchor="end" font-size="68" letter-spacing="1">
      <tspan fill="#56d364">~/</tspan><tspan fill="#e6edf3">romaodev.com</tspan>
    </text>
  </g>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.15" y2="1">
      <stop offset="0" stop-color="#0b1216"/>
      <stop offset="0.5" stop-color="#0d1117"/>
      <stop offset="1" stop-color="#080e0d"/>
    </linearGradient>
    <radialGradient id="shaft" cx="0.55" cy="0.95" r="0.7">
      <stop offset="0" stop-color="#56d364" stop-opacity="0.06"/>
      <stop offset="1" stop-color="#56d364" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="vig" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#05080a" stop-opacity="0.35"/>
      <stop offset="0.7" stop-color="#05080a" stop-opacity="0"/>
      <stop offset="1" stop-color="#05080a" stop-opacity="0.15"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#shaft)"/>
  ${divide(tips)}
  ${render(channels)}
  <rect width="${W}" height="${H}" fill="url(#vig)"/>
  ${text}
</svg>`;
}

mkdirSync(OUT, { recursive: true });
for (const [name, payload] of [
  ["cover", true],
  ["cover-notype", false],
]) {
  const s = svg(payload);
  writeFileSync(new URL(`${name}.svg`, OUT), s);
  await sharp(Buffer.from(s)).png({ compressionLevel: 9 }).toFile(fileURLToPath(new URL(`${name}.png`, OUT)));
  console.log("wrote", `docs/linkedin/${name}.png`);
}
