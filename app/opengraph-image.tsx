import { ImageResponse } from "next/og";
import { profile } from "@/lib/site";

// Social preview card (LinkedIn, X, WhatsApp, Slack). Generated at build time
// from the same palette as the site — DESIGN.md §7. Also reused as the Twitter
// card via app/twitter-image.tsx.
export const alt = "João Romão — Data Analyst & Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0d1117",
          // Synthwave grid, echoing the hero (DESIGN.md §10b).
          backgroundImage:
            "linear-gradient(#2a2f37 1px, transparent 1px), linear-gradient(90deg, #2a2f37 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#56d364",
            }}
          />
          <div style={{ fontSize: 26, color: "#56d364" }}>{profile.status}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 34, color: "#6e7681" }}>
            joao@belem ~ % whoami
          </div>
          <div
            style={{
              fontSize: 104,
              fontWeight: 700,
              color: "#e6edf3",
              letterSpacing: -3,
              marginTop: 8,
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              fontSize: 38,
              color: "#8b949e",
              marginTop: 14,
              maxWidth: 900,
            }}
          >
            {`${profile.role} · ${profile.tagline}`}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            color: "#6e7681",
            borderTop: "1px solid #2a2f37",
            paddingTop: 26,
          }}
        >
          <div>{profile.location}</div>
          <div style={{ color: "#39c5cf" }}>github.com/joaoromaodev</div>
        </div>
      </div>
    ),
    size,
  );
}
