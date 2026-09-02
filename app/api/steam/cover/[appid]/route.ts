// Steam store art, proxied. Going straight to the CDN from the browser would
// mean allow-listing a third-party host in the CSP, and the obvious host is a
// trap: cdn.cloudflare.steamstatic.com 301s to cdn.steamstatic.com for some
// appids, and CSP matches the redirect target too. Proxying keeps img-src at
// 'self', resolves the redirect server-side, and lets Vercel's CDN cache the
// bytes — the URL is stable per appid, so it's a one-time fetch per game.
export const revalidate = 86400;

const UPSTREAM = "https://cdn.cloudflare.steamstatic.com/steam/apps";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ appid: string }> },
) {
  const { appid } = await params;
  // Path segment goes into an upstream URL — digits only, nothing to inject.
  if (!/^\d{1,10}$/.test(appid)) return new Response(null, { status: 400 });

  try {
    const res = await fetch(`${UPSTREAM}/${appid}/header.jpg`, {
      next: { revalidate },
    });
    // Not every appid has store art (delisted titles, some betas). 404 lets
    // the widget's <img> onError swap in the ▶ glyph.
    if (!res.ok) return new Response(null, { status: 404 });

    return new Response(res.body, {
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "image/jpeg",
        "Cache-Control": `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate * 7}`,
      },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
}
