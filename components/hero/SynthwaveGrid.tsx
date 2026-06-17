// Signature element (DESIGN.md §10b): a single perspective grid + horizon glow,
// tinted in our cyan/purple palette. No magenta sunset. Static under reduced-motion.
export function SynthwaveGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* horizon glow */}
      <div className="absolute left-1/2 top-[58%] h-64 w-[120%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--color-cyan)_22%,transparent),transparent_60%)] blur-2xl" />
      <div className="absolute left-1/2 top-[55%] h-40 w-[80%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--color-purple)_18%,transparent),transparent_60%)] blur-2xl" />

      {/* perspective grid */}
      <div className="synth-grid absolute inset-x-0 bottom-0 top-1/2" />

      {/* fade the grid into the page */}
      <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-b from-transparent via-transparent to-bg" />

      <style>{`
        .synth-grid {
          background-image:
            linear-gradient(to right, color-mix(in srgb, var(--color-cyan) 16%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in srgb, var(--color-purple) 16%, transparent) 1px, transparent 1px);
          background-size: 48px 48px;
          transform: perspective(420px) rotateX(62deg);
          transform-origin: bottom center;
          mask-image: linear-gradient(to bottom, transparent, black 60%);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 60%);
          animation: synth-scroll 8s linear infinite;
        }
        @keyframes synth-scroll {
          from { background-position-y: 0; }
          to { background-position-y: 48px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .synth-grid { animation: none; }
        }
      `}</style>
    </div>
  );
}
