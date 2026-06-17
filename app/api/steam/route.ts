import { ok, fail } from "@/lib/api";

// Steam recently played (DESIGN.md §4). Needs STEAM_API_KEY + STEAM_ID,
// public profile. Falls back gracefully if private/empty. Cached ~1h.
export const revalidate = 3600;

export async function GET() {
  const key = process.env.STEAM_API_KEY;
  const steamId = process.env.STEAM_ID;
  if (!key || !steamId) return fail("unconfigured");

  try {
    const url = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${key}&steamid=${steamId}&count=3&format=json`;
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) return fail("error");

    const json = await res.json();
    const games = json?.response?.games;
    if (!games || games.length === 0) return fail("empty");

    return ok(
      {
        games: games.slice(0, 3).map(
          (g: { name: string; playtime_2weeks?: number }) => ({
            name: g.name,
            hours: Math.round(((g.playtime_2weeks ?? 0) / 60) * 10) / 10,
          }),
        ),
      },
      revalidate,
    );
  } catch {
    return fail("error");
  }
}
