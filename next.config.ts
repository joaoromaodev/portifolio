import type { NextConfig } from "next";

// Content Security Policy. The site loads no third-party images, fonts or
// styles (next/font self-hosts the Google fonts), so the only external origins
// are Cloudflare Turnstile (the chatbot's anti-bot check) and Vercel's
// analytics beacons.
//
// `unsafe-inline` on script-src is required by Next's hydration bootstrap;
// avoiding it would mean a nonce-issuing middleware on every request, which
// would make this otherwise fully static site dynamic. The policy still blocks
// script injection from unknown hosts, framing, and data exfiltration via
// connect-src — the attacks that actually matter for a static portfolio.
//
// It is applied in production only: the dev server needs eval() for React's
// debugging build and a websocket for HMR, and `upgrade-insecure-requests`
// breaks plain-http localhost. Verify the real policy with
// `next build && next start`, not `next dev`.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://challenges.cloudflare.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "frame-src https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const isProd = process.env.NODE_ENV === "production";

const securityHeaders = [
  ...(isProd ? [{ key: "Content-Security-Policy", value: csp }] : []),
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework version.
  poweredByHeader: false,
  images: {
    // Project screenshots are local files in public/ — no remote loaders, and
    // SVG stays off (it can carry script).
    dangerouslyAllowSVG: false,
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
