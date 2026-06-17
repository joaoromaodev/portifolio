import { ok, fail } from "@/lib/api";

// GitHub contributions heatmap + latest repo/commit (DESIGN.md §4).
// Needs GITHUB_TOKEN (read-only). Cached ~1h.
export const revalidate = 3600;

const LOGIN = process.env.GITHUB_USERNAME || "joaoromaodev";

// Map a daily contribution count to a 0–4 heat level (matches the widget grid).
function level(count: number): number {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return fail("unconfigured");

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "joao-romao-portfolio",
    };

    // Contributions via GraphQL.
    const query = `query($login:String!){
      user(login:$login){
        contributionsCollection{
          contributionCalendar{
            totalContributions
            weeks{ contributionDays{ contributionCount } }
          }
        }
      }
    }`;
    const gql = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables: { login: LOGIN } }),
      next: { revalidate },
    });
    if (!gql.ok) return fail("error");
    const gjson = await gql.json();
    const cal =
      gjson?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) return fail("empty");

    const days: number[] = cal.weeks
      .flatMap((w: { contributionDays: { contributionCount: number }[] }) =>
        w.contributionDays.map((d) => d.contributionCount),
      );
    const levels = days.slice(-84).map(level); // last 12 weeks → 84 cells

    // Latest pushed repo + its most recent commit message (best-effort).
    let lastRepo = "";
    let lastCommit = "";
    try {
      const repos = await fetch(
        `https://api.github.com/users/${LOGIN}/repos?sort=pushed&per_page=1`,
        { headers, next: { revalidate } },
      );
      const rjson = await repos.json();
      const repo = rjson?.[0];
      if (repo) {
        lastRepo = repo.name;
        const commits = await fetch(
          `https://api.github.com/repos/${LOGIN}/${repo.name}/commits?per_page=1`,
          { headers, next: { revalidate } },
        );
        const cjson = await commits.json();
        lastCommit = cjson?.[0]?.commit?.message?.split("\n")[0] ?? "";
      }
    } catch {
      /* heatmap is enough — repo/commit is a bonus */
    }

    return ok(
      {
        handle: LOGIN,
        weeks: Math.ceil(levels.length / 7),
        total: cal.totalContributions as number,
        levels,
        lastRepo,
        lastCommit,
      },
      revalidate,
    );
  } catch {
    return fail("error");
  }
}
