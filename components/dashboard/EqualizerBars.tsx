"use client";

// Equalizer / KITT voicebox bars. Shared by Spotify ("now playing") and the
// Ask-my-portfolio chatbot (DESIGN.md §6). Static when not `active` or under
// prefers-reduced-motion (handled globally in globals.css).
export function EqualizerBars({
  active = true,
  bars = 5,
  color = "var(--color-green)",
  className = "",
}: {
  active?: boolean;
  bars?: number;
  color?: string;
  className?: string;
}) {
  // Deterministic per-bar timing so SSR markup is stable.
  const delays = ["0ms", "120ms", "240ms", "90ms", "200ms", "60ms", "180ms"];
  const durations = ["680ms", "520ms", "760ms", "600ms", "700ms"];

  return (
    <div
      aria-hidden="true"
      className={`flex items-end gap-[3px] ${className}`}
      style={{ height: 20 }}
    >
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="w-[3px] flex-none rounded-full"
          style={{
            height: "100%",
            backgroundColor: color,
            transformOrigin: "bottom",
            transform: active ? undefined : "scaleY(0.3)",
            animation: active
              ? `eq-bounce ${durations[i % durations.length]} ease-in-out ${
                  delays[i % delays.length]
                } infinite`
              : "none",
          }}
        />
      ))}
    </div>
  );
}
