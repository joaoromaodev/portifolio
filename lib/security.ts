// Request-level guards for the Ask-my-portfolio endpoint (DESIGN.md §6.5):
// a same-origin check + Cloudflare Turnstile verification.

// Reject cross-origin POSTs (cheap, no external dependency). Same-origin
// browser requests send an Origin header that must match the host.
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  // Non-browser callers (curl, server-to-server) send no Origin — allow them
  // through to the rate limiter rather than hard-blocking.
  if (!origin) return true;

  const host = req.headers.get("host");
  const extra = (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  try {
    const originHost = new URL(origin).host;
    return originHost === host || extra.includes(origin);
  } catch {
    return false;
  }
}

// Verify a Turnstile token with Cloudflare. Returns true when the token is
// valid OR when Turnstile isn't configured (graceful, like the data widgets).
export async function verifyTurnstile(
  token: string | undefined,
  ip: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured — skip (rate limits still apply)
  if (!token) return false;

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret,
          response: token,
          ...(ip && ip !== "unknown" ? { remoteip: ip } : {}),
        }),
        cache: "no-store",
      },
    );
    const json = await res.json();
    return json?.success === true;
  } catch {
    return false;
  }
}
