// Lightweight in-memory rate limiter for the Ask-my-portfolio endpoint
// (DESIGN.md §6: per-IP cap + global daily cap + per-request cap).
//
// NOTE: this is a per-instance backstop. On serverless (Vercel) each instance
// has its own memory, so for hard guarantees move this to Vercel KV / Upstash.
// The real safety net is the prepaid-credit cap with auto-recharge OFF (§6.1).

const PER_IP_PER_DAY = 8; // messages per IP per day
const GLOBAL_PER_DAY = 400; // total messages per day (abuse circuit-breaker)
const DAY_MS = 24 * 60 * 60 * 1000;

type Bucket = { count: number; resetAt: number };

const perIp = new Map<string, Bucket>();
let global: Bucket = { count: 0, resetAt: Date.now() + DAY_MS };

function take(bucket: Bucket, limit: number): { ok: boolean; bucket: Bucket } {
  const now = Date.now();
  if (now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + DAY_MS };
  }
  if (bucket.count >= limit) return { ok: false, bucket };
  bucket.count += 1;
  return { ok: true, bucket };
}

export type RateResult = { ok: true } | { ok: false; scope: "ip" | "global" };

export function checkRateLimit(ip: string): RateResult {
  const g = take(global, GLOBAL_PER_DAY);
  global = g.bucket;
  if (!g.ok) return { ok: false, scope: "global" };

  const current = perIp.get(ip) ?? { count: 0, resetAt: Date.now() + DAY_MS };
  const r = take(current, PER_IP_PER_DAY);
  perIp.set(ip, r.bucket);
  if (!r.ok) return { ok: false, scope: "ip" };

  return { ok: true };
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
