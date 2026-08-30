import { ok, fail } from "@/lib/api";
import { weatherGlyph } from "@/lib/weather";

// Belém weather via Open-Meteo (no API key). Cached ~1h (DESIGN.md §4).
// Returns the raw WMO code rather than a description, so the same cached
// response serves both locales — the client picks the label from its
// dictionary (lib/weather.ts).
export const revalidate = 3600;

const BELEM = { lat: -1.4558, lon: -48.4902 };

export async function GET() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${BELEM.lat}&longitude=${BELEM.lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=America/Belem`;
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) return fail("error");

    const json = await res.json();
    const c = json?.current;
    if (!c) return fail("empty");

    const code = Number(c.weather_code) || 0;
    return ok(
      {
        tempC: Math.round(c.temperature_2m),
        code,
        humidity: Math.round(c.relative_humidity_2m),
        glyph: weatherGlyph(code),
      },
      revalidate,
    );
  } catch {
    return fail("error");
  }
}
