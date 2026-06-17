"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/site";

// Live local time in Belém (America/Belem) — client only, no API (DESIGN.md §4).
export function useBelemTime(withSeconds = true) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      ...(withSeconds ? { second: "2-digit" } : {}),
      hour12: false,
      timeZone: profile.timezone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [withSeconds]);

  return time;
}
