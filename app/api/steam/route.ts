import { ok, fail } from "@/lib/api";

// Steam recently played (DESIGN.md §4). Needs STEAM_API_KEY + STEAM_ID,
// public profile. Falls back gracefully if private/empty. Cached ~1h.
export const revalidate = 3600;

const API = "https://api.steampowered.com/IPlayerService";
const COUNT = 3;

type RecentGame = { appid: number; name: string; playtime_2weeks?: number };
type OwnedGame = {
  appid: number;
  name?: string;
  playtime_forever?: number;
  rtime_last_played?: number;
};

type SteamGameOut = {
  appid: number;
  name: string;
  hours: number;
  /** "recent" = hours in the last 2 weeks; "total" = lifetime hours. */
  window: "recent" | "total";
};

const toHours = (minutes = 0) => Math.round((minutes / 60) * 10) / 10;

async function steam<T>(method: string, params: string): Promise<T | null> {
  const res = await fetch(`${API}/${method}/v1/?${params}&format=json`, {
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`steam ${method} ${res.status}`);
  return (await res.json())?.response ?? null;
}

export async function GET() {
  const key = process.env.STEAM_API_KEY?.trim();
  const steamId = process.env.STEAM_ID?.trim();
  if (!key || !steamId) return fail("unconfigured");

  const auth = `key=${encodeURIComponent(key)}&steamid=${encodeURIComponent(steamId)}`;

  try {
    // GetRecentlyPlayedGames only sees the last 14 days, so it comes back
    // empty after two weeks without playing — the tile used to die then.
    const recent = await steam<{ games?: RecentGame[] }>(
      "GetRecentlyPlayedGames",
      `${auth}&count=${COUNT}`,
    );
    let games: SteamGameOut[] = (recent?.games ?? [])
      .slice(0, COUNT)
      .map((g) => ({
        appid: g.appid,
        name: g.name,
        hours: toHours(g.playtime_2weeks),
        window: "recent",
      }));

    // Fallback: the owned library, most recently played first, lifetime hours.
    if (games.length === 0) {
      const owned = await steam<{ games?: OwnedGame[] }>(
        "GetOwnedGames",
        `${auth}&include_appinfo=1&include_played_free_games=1`,
      );
      games = (owned?.games ?? [])
        .filter((g) => g.name && (g.rtime_last_played ?? 0) > 0)
        .sort((a, b) => (b.rtime_last_played ?? 0) - (a.rtime_last_played ?? 0))
        .slice(0, COUNT)
        .map((g) => ({
          appid: g.appid,
          name: g.name!,
          hours: toHours(g.playtime_forever),
          window: "total",
        }));
    }

    // Both empty means "Game details" is private on the Steam profile.
    if (games.length === 0) return fail("empty");

    return ok(
      {
        games,
        profileUrl: `https://steamcommunity.com/profiles/${steamId}`,
      },
      revalidate,
    );
  } catch {
    return fail("error");
  }
}
