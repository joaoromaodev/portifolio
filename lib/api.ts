import { NextResponse } from "next/server";

// Uniform widget API envelope. The client renders its static fallback whenever
// `ok` is false, so a missing key or upstream error never looks broken.
export type WidgetResponse<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "unconfigured" | "error" | "empty" };

export function ok<T>(data: T, revalidate?: number) {
  const res = NextResponse.json<WidgetResponse<T>>({ ok: true, data });
  if (revalidate) {
    res.headers.set(
      "Cache-Control",
      `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate * 2}`,
    );
  }
  return res;
}

export function fail(reason: "unconfigured" | "error" | "empty") {
  // 200 with ok:false — the widget shows its fallback snapshot, not an error UI.
  return NextResponse.json<WidgetResponse<never>>({ ok: false, reason });
}
