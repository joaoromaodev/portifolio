import { ok, fail } from "@/lib/api";

// Spotify "now playing" / "last played" (DESIGN.md §4).
// OAuth refresh-token flow — secrets stay server-side. Short cache (~30s).
export const revalidate = 30;

type Track = { playing: boolean; track: string; artist: string; album: string };

async function getAccessToken(): Promise<string | null> {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!id || !secret || !refresh) return null;

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh,
    }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.access_token ?? null;
}

function toTrack(item: {
  name: string;
  artists?: { name: string }[];
  album?: { name: string };
}, playing: boolean): Track {
  return {
    playing,
    track: item.name,
    artist: (item.artists ?? []).map((a) => a.name).join(", "),
    album: item.album?.name ?? "",
  };
}

export async function GET() {
  if (!process.env.SPOTIFY_REFRESH_TOKEN) return fail("unconfigured");

  try {
    const token = await getAccessToken();
    if (!token) return fail("error");
    const auth = { Authorization: `Bearer ${token}` };

    // Currently playing (204 = nothing playing).
    const now = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      { headers: auth, cache: "no-store" },
    );
    if (now.status === 200) {
      const json = await now.json();
      if (json?.item) return ok(toTrack(json.item, json.is_playing), revalidate);
    }

    // Fall back to most recently played.
    const recent = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      { headers: auth, cache: "no-store" },
    );
    if (recent.ok) {
      const json = await recent.json();
      const item = json?.items?.[0]?.track;
      if (item) return ok(toTrack(item, false), revalidate);
    }

    return fail("empty");
  } catch {
    return fail("error");
  }
}
