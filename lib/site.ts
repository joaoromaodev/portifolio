// Single source of truth for the portfolio's textual content.
// Visible copy is in English (international audience) — see CLAUDE.md §3.

export const profile = {
  name: "João Romão",
  role: "Data Analyst & Developer",
  tagline: "Python automation · real-time data · full-stack Next.js",
  location: "Belém, Pará — Brazil",
  timezone: "America/Belem",
  status: "open to remote / relocation",
  email: "joaoromaodev@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/joaoromao-data/",
    github: "https://github.com/joaoromaodev",
  },
} as const;

// CV download. The file itself is optional — lib/resume.ts checks whether it
// exists at build time and the CTAs only render when it does.
export const RESUME_PATH = "/joao-romao-cv.pdf";

export const nav = [
  { id: "dashboard", label: "live" },
  { id: "about", label: "about" },
  { id: "experience", label: "experience" },
  { id: "projects", label: "projects" },
  { id: "skills", label: "skills" },
  { id: "contact", label: "contact" },
] as const;

// About — narrative from CLAUDE.md §5 (paragraphs, no Apple speech reproduced).
export const about = {
  paragraphs: [
    "I've been a gamer and a geek for as long as I can remember. It started around 2007 on my older brother's hand-me-down PC, where I replayed The Legend of Zelda: Ocarina of Time on an emulator more times than I can count — it was the only game I had.",
    "I was coding before I knew what code was: tweaking my Tumblr's CSS, editing Minecraft files in Notepad so I could spin up a server over Hamachi and play with my friends. I grew up googling whatever I needed to learn — the sworn enemy of \"I don't know how to do that.\"",
    "That curiosity set the direction for my whole life. Watching Steve Jobs talk about the people crazy enough to think they can change the world, I knew I wanted to be one of them — using technology to actually change things.",
    "As a kid I built games; as a teenager I moved into design and launched one venture after another (and failed at plenty of them). That same drive still shows up everywhere: restoring an SG guitar, running @magomercador (my tabletop-RPG accessories shop), gaming when I can, and trying to move my body more often.",
    "My long-term goal is simple: to build a life abroad with my wife — somewhere with real quality of life, and the financial and physical freedom to enjoy it.",
  ],
  // Short, tag-style — rendered as a compact chip strip, not prose.
  beyondCode: [
    "Rock & metal",
    "Puzzles",
    "Anime & film",
    "Guitar",
    "Mago Mercador",
    "Gaming",
    "Training",
  ],
} as const;

export const experience = [
  {
    period: "2024 — present",
    role: "Tech Lead & Product Owner — SIMF",
    org: "Montreal Informática · SEDUC-PA",
    note: "Technical decision-maker and product owner of an internal financial-monitoring platform. Right hand to the DPPC director.",
  },
  {
    period: "2023 — 2024",
    role: "Developer",
    org: "Kapa · SEDUC-PA",
    note: "Built financial automation in production (PETE/PEAE, Diárias) — from raw SIAFE reports to reports and messaging.",
  },
  {
    period: "2022 — 2023",
    role: "Intern → Developer",
    org: "SEDUC-PA",
    note: "Started as an intern at the State Department of Education of Pará; grew into a developer role across data and automation.",
  },
] as const;

// Projects live in content/projects.json and are loaded/typed by lib/projects.ts
// (editable through the dev-only /admin panel). Re-exported here so `lib/site`
// stays the single import surface for the site's content.
export {
  projects,
  allProjects,
  featuredProjects,
  secondaryProjects,
  flagMeta,
  FLAGS,
} from "./projects";
export type { Project, ProjectFlag, ProjectLink } from "./projects";

export const skills = [
  { group: "Languages", items: ["Python", "JavaScript", "TypeScript", "SQL"] },
  { group: "Frontend", items: ["React", "Next.js 15", "Tailwind CSS", "Streamlit"] },
  {
    group: "Data & Automation",
    items: ["Pandas", "Selenium", "Web scraping", "RPA", "Anomaly detection", "Gspread"],
  },
  {
    group: "Backend & Infra",
    items: ["Supabase", "PostgreSQL", "SQLite", "REST APIs", "Ubuntu (Nginx, PM2)", "IndexedDB / Dexie"],
  },
  {
    group: "Practices",
    items: ["Vitest", "Git", "Google Apps Script", "Generative AI for productivity"],
  },
] as const;
