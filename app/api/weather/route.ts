import { ok, fail } from "@/lib/api";

// Belém weather via Open-Meteo (no API key). Cached ~1h (DESIGN.md §4).
export const revalidate = 3600;

const BELEM = { lat: -1.4558, lon: -48.4902 };

// WMO weather codes → human condition + glyph.
function describe(code: number): { condition: string; glyph: string } {
  if (code === 0) return { condition: "Clear sky", glyph: "☀️" };
  if (code <= 2) return { condition: "Partly cloudy", glyph: "⛅" };
  if (code === 3) return { condition: "Overcast", glyph: "☁️" };
  if (code <= 48) return { condition: "Fog", glyph: "🌫️" };
  if (code <= 67) return { condition: "Rain", glyph: "🌧️" };
  if (code <= 77) return { condition: "Snow", glyph: "🌨️" };
  if (code <= 82) return { condition: "Rain showers", glyph: "🌦️" };
  if (code <= 99) return { condition: "Thunderstorm", glyph: "⛈️" };
  return { condition: "—", glyph: "🌡️" };
}

export async function GET() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${BELEM.lat}&longitude=${BELEM.lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=America/Belem`;
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) return fail("error");

    const json = await res.json();
    const c = json?.current;
    if (!c) return fail("empty");

    const { condition, glyph } = describe(c.weather_code);
    return ok(
      {
        tempC: Math.round(c.temperature_2m),
        condition,
        humidity: Math.round(c.relative_humidity_2m),
        glyph,
      },
      revalidate,
    );
  } catch {
    return fail("error");
  }
}
