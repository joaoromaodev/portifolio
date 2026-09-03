// A quiet echo of the hero's grid, for one section's background.
//
// Deliberately not the hero's grid (components/hero/SynthwaveGrid.tsx): that
// one is the site's single signature flourish — perspective, cyan and purple,
// animated — and DESIGN.md §10b says to use it once. Repeating it everywhere
// turns a gesture into wallpaper; we tried the page-wide version and it also
// stacked two grids in the hero, which reads as moiré.
//
// So this is flat, static, drawn in the border colour rather than an accent,
// and masked to nothing well before the edges: texture behind the panels, not
// lines competing with their 1px borders. It goes behind the dashboard, the
// most terminal-looking block on the page.
//
// It stays inside the section's content column rather than going full-bleed:
// a `w-screen` layer would count the scrollbar and reintroduce the horizontal
// overflow the mobile pass just cleared. The radial mask dissolves the edges
// anyway, so the boundary is invisible.
export function SectionGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="section-grid absolute inset-0" />
      <style>{`
        .section-grid {
          background-image:
            linear-gradient(to right, color-mix(in srgb, var(--color-border) var(--section-grid-alpha), transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in srgb, var(--color-border) var(--section-grid-alpha), transparent) 1px, transparent 1px);
          /* Same 48px rhythm as the hero, so the two read as one system. */
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 65% 55% at 50% 45%, black, transparent 78%);
          -webkit-mask-image: radial-gradient(ellipse 65% 55% at 50% 45%, black, transparent 78%);
        }
      `}</style>
    </div>
  );
}
