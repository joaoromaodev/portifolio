// Spotify album art, proxied — same reasoning as /api/steam/cover: keeps the
// CSP at `img-src 'self'` instead of allow-listing i.scdn.co. The route takes
// the bare image id (the API payload carries ids, not URLs) so there is no
// caller-supplied URL to sanitize and no chance of turning this into an open
// image proxy. Art is immutable per id, so it caches hard.
export const revalidate = 604800; // 7 days

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // Spotify image ids are lowercase alphanumeric hashes.
  if (!/^[a-z0-9]{16,64}$/.test(id)) return new Response(null, { status: 400 });

  try {
    const res = await fetch(`https://i.scdn.co/image/${id}`, {
      next: { revalidate },
    });
    // 404 lets the widget's <img> onError swap in the ♪ glyph.
    if (!res.ok) return new Response(null, { status: 404 });

    return new Response(res.body, {
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "image/jpeg",
        "Cache-Control": `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}, immutable`,
      },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
}
