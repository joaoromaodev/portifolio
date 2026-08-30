import type { Dictionary } from "./i18n";

// WMO weather codes. The /api/weather route returns the raw code rather than a
// human string, so one cached response serves both locales — the label is
// resolved on the client from the active dictionary.

export function weatherGlyph(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 2) return "⛅";
  if (code === 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "🌨️";
  if (code <= 82) return "🌦️";
  if (code <= 99) return "⛈️";
  return "🌡️";
}

export function weatherLabel(code: number, dict: Dictionary): string {
  const w = dict.weather;
  if (code === 0) return w.clear;
  if (code <= 2) return w.partlyCloudy;
  if (code === 3) return w.overcast;
  if (code <= 48) return w.fog;
  if (code <= 67) return w.rain;
  if (code <= 77) return w.snow;
  if (code <= 82) return w.showers;
  if (code <= 99) return w.thunderstorm;
  return w.unknown;
}
