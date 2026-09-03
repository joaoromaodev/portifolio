import { ImageResponse } from "next/og";
import { getDictionary } from "@/lib/i18n";
import { t, type Locale } from "@/lib/i18n/config";
import type { Project } from "@/lib/projects";

// Social card for one case study. Shared by /projects/<slug> and
// /pt/projetos/<slug> so the two languages can't drift apart.
//
// This replaces pointing og:image straight at the card screenshot. That
// screenshot is a .webp, and several crawlers — LinkedIn's among them, which
// is where these links actually get shared — render nothing at all for WebP.
// It was also the wrong shape: a 16:9 screenshot cropped to the 1.91:1 card
// loses whichever part of the UI the crop lands on, and carried no title, so
// the preview never said which project it was. This renders PNG at exactly
// 1200x630, with the name on it.
export const OG_SIZE = { width: 1200, height: 630 };

export function projectOgImage(project: Project, locale: Locale) {
  const dict = getDictionary(locale);
  // Truncate here rather than with line-clamp: Satori, which rasterises this
  // card, ignores -webkit-line-clamp, so a long summary just keeps adding
  // lines and pushes the stack row off the bottom. The longest summary in the
  // catalogue is 232 characters.
  const full = t(project.summary, locale);
  const summary = full.length > 150 ? `${full.slice(0, 149).trimEnd()}…` : full;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0d1117",
        backgroundImage:
          "linear-gradient(#2a2f37 1px, transparent 1px), linear-gradient(90deg, #2a2f37 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        padding: "68px 80px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ fontSize: 28, color: "#6e7681" }}>
          {`// ${dict.projects.slug}`}
        </div>
        <div style={{ fontSize: 28, color: "#39c5cf" }}>
          {t(project.kicker, locale)}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 88,
            fontWeight: 700,
            color: "#e6edf3",
            letterSpacing: -2,
          }}
        >
          {project.title}
        </div>
        <div
          style={{
            fontSize: 34,
            color: "#8b949e",
            marginTop: 16,
            maxWidth: 1000,
          }}
        >
          {summary}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #2a2f37",
          paddingTop: 26,
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          {project.stack.slice(0, 5).map((tech) => (
            <div
              key={tech}
              style={{
                fontSize: 24,
                color: "#c678dd",
                border: "1px solid #2a2f37",
                borderRadius: 8,
                padding: "6px 14px",
              }}
            >
              {tech}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 26, color: "#56d364" }}>romaodev.com</div>
      </div>
    </div>,
    OG_SIZE,
  );
}
