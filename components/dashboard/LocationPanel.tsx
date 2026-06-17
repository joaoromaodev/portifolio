"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Panel } from "@/components/ui/Panel";
import { useBelemTime } from "@/components/useBelemTime";
import { profile } from "@/lib/site";

// Stylized Amazon-basin map with a pulsing Belém pin (DESIGN.md §5).
// Abstract SVG — no heavy 3D. Pin reveals a card on hover/focus.
export function LocationPanel({ className = "" }: { className?: string }) {
  const time = useBelemTime();
  const [open, setOpen] = useState(false);

  return (
    <motion.div variants={fadeUp} className={className}>
      <Panel interactive className="relative flex h-full flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <span className="font-mono text-xs font-medium text-fg">
            Belém · gateway to the Amazon
          </span>
          <span className="font-mono text-[11px] text-amber tabular-nums">
            {time ?? "--:--:--"}
          </span>
        </div>

        <div className="relative flex-1">
          <svg
            viewBox="0 0 400 220"
            className="h-full w-full"
            role="img"
            aria-label="Stylized map of the Amazon basin with a pin on Belém, Pará"
          >
            <defs>
              <radialGradient id="canopy" cx="45%" cy="55%" r="70%">
                <stop offset="0%" stopColor="var(--color-green)" stopOpacity="0.22" />
                <stop offset="100%" stopColor="var(--color-green)" stopOpacity="0.04" />
              </radialGradient>
            </defs>

            {/* canopy landmass */}
            <path
              d="M30,150 C20,90 70,40 140,46 C190,50 230,30 280,52 C330,72 360,60 380,96 C394,120 372,150 350,158 C300,176 250,150 210,168 C170,186 120,176 92,182 C56,190 40,180 30,150 Z"
              fill="url(#canopy)"
              stroke="var(--color-green)"
              strokeOpacity="0.35"
              strokeWidth="1"
            />

            {/* river network flowing toward the mouth (Belém) */}
            <g
              fill="none"
              stroke="var(--color-cyan)"
              strokeOpacity="0.55"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <path d="M70,96 C140,110 220,120 332,150" className="river" />
              <path d="M120,70 C170,96 230,104 300,120" className="river" />
              <path d="M150,150 C210,150 260,140 332,150" className="river" />
            </g>

            {/* Belém pin near the mouth */}
            <g transform="translate(332,150)">
              <circle r="6" className="pin-ping" fill="var(--color-green)" />
              <circle r="3.4" fill="var(--color-green)" />
              <circle r="3.4" fill="none" stroke="var(--color-bg)" strokeWidth="1" />
            </g>

            <style>{`
              .pin-ping { transform-origin: center; animation: pin-pulse 2.4s ease-out infinite; }
              .river { stroke-dasharray: 4 6; animation: river-flow 6s linear infinite; }
              @keyframes river-flow { to { stroke-dashoffset: -40; } }
              @media (prefers-reduced-motion: reduce) {
                .pin-ping { animation: none; opacity: 0; }
                .river { animation: none; }
              }
            `}</style>
          </svg>

          {/* invisible hit-area over the pin to toggle the card */}
          <button
            type="button"
            aria-label="Show Belém details"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onClick={() => setOpen((v) => !v)}
            className="absolute"
            style={{ left: "78%", top: "58%", width: 44, height: 44, transform: "translate(-50%,-50%)" }}
          />

          {open ? (
            <div className="pointer-events-none absolute bottom-3 left-3 right-3 rounded-lg border border-border bg-bg/95 p-3 backdrop-blur">
              <p className="font-mono text-xs text-fg">
                {profile.location}
              </p>
              <p className="mt-1 font-mono text-[11px] text-muted">
                local time{" "}
                <span className="text-amber tabular-nums">{time ?? "--:--"}</span> ·{" "}
                <span className="text-green">{profile.status}</span>
              </p>
            </div>
          ) : null}
        </div>
      </Panel>
    </motion.div>
  );
}
