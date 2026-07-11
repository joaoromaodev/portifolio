import { ok, fail } from "@/lib/api";

// Spotify "now playing" / "last played" + the listener's actual top tracks
// (DESIGN.md §4). OAuth refresh-token flow — secrets stay server-side.
// Short cache (~30s) for the now-playing part; top tracks ride along.
export const revalidate = 30;

type TopTrack = {
  rank: number;
  track: string;
  artist: string;
  url?: string;
};

type SpotifyData = {
  playing: boolean;
  track: string;
  artist: string;
  album: string;
  url?: string;
  top: TopTrack[];
};

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

type SpotifyTrackItem = {
  name: string;
  artists?: { name: string }[];
  album?: { name: string };
  external_urls?: { spotify?: string };
};

function artistNames(item: SpotifyTrackItem): string {
  return (item.artists ?? []).map((a) => a.name).join(", ");
}

function toNow(item: SpotifyTrackItem, playing: boolean) {
  return {
    playing,
    track: item.name,
    artist: artistNames(item),
    album: item.album?.name ?? "",
    url: item.external_urls?.spotify,
  };
}

export async function GET() {
  if (!process.env.SPOTIFY_REFRESH_TOKEN) return fail("unconfigured");

  try {
    const token = await getAccessToken();
    if (!token) return fail("error");
    const auth = { Authorization: `Bearer ${token}` };

    // Now playing (204 = nothing playing) + top tracks, in parallel.
    // Top tracks needs the user-top-read scope — if the token predates it,
    // the call 403s and we degrade to an empty list (the widget hides the
    // expander). Re-run scripts/get-spotify-token.mjs to grant the scope.
    const [now, top] = await Promise.all([
      fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: auth,
        cache: "no-store",
      }),
      fetch(
        "https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=5",
        { headers: auth, next: { revalidate: 86400 } },
      ),
    ]);

    let topTracks: TopTrack[] = [];
    if (top.ok) {
      const tjson = await top.json();
      topTracks = ((tjson?.items ?? []) as SpotifyTrackItem[]).map(
        (item, i) => ({
          rank: i + 1,
          track: item.name,
          artist: artistNames(item),
          url: item.external_urls?.spotify,
        }),
      );
    }

    if (now.status === 200) {
      const json = await now.json();
      if (json?.item) {
        return ok<SpotifyData>(
          { ...toNow(json.item, json.is_playing), top: topTracks },
          revalidate,
        );
      }
    }

    // Fall back to most recently played.
    const recent = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      { headers: auth, cache: "no-store" },
    );
    if (recent.ok) {
      const json = await recent.json();
      const item = json?.items?.[0]?.track;
      if (item) {
        return ok<SpotifyData>(
          { ...toNow(item, false), top: topTracks },
          revalidate,
        );
      }
    }

    return fail("empty");
  } catch {
    return fail("error");
  }
}
