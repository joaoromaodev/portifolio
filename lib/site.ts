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

export type ProjectFlag = "case-study" | "live" | "building" | "award" | "side";

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  flag: ProjectFlag;
  featured: boolean;
  summary: string;
  problem: string;
  solution: string;
  impact?: string;
  stack: string[];
  links?: { label: string; href: string }[];
  // true → no repo/live link (private gov system or course project)
  privateNote?: string;
};

export const projects: Project[] = [
  {
    slug: "simf",
    title: "SIMF",
    kicker: "Internal Financial Management System",
    flag: "case-study",
    featured: true,
    summary:
      "Internal web platform that monitors budget & financial execution for the Pará State Department of Education. Anchor project — I'm the tech lead and product owner.",
    problem:
      "Budget and financial execution were tracked across scattered tools, with no single real-time view for the directors who answer for it.",
    solution:
      "A role-based web platform that reads SIAFE data in real time, with modules for budget execution, settlements, payments and bank accounts — in active use by DFIN and DPPC.",
    impact:
      "In active production use, serving SAPF. Deployed on an Ubuntu VM (Nginx + PM2) behind internal DNS with SSL.",
    stack: ["Next.js 15", "React", "Tailwind", "Supabase", "PostgreSQL"],
    privateNote:
      "Private gov system — case study only, with fictional-data screenshots. No code or real data is published.",
  },
  {
    slug: "pete-peae",
    title: "Monitor PETE/PEAE",
    kicker: "Financial automation",
    flag: "live",
    featured: true,
    summary:
      "Production system that tracks daily installments paid to municipalities under two state programs — school transport (PETE) and school meals (PEAE).",
    problem:
      "Tracking lived in two Google Sheets + AppScripts that hid a real failure mode: a second payment order on the same installment went unnoticed.",
    solution:
      "An end-to-end pipeline from raw SIAFE report to WhatsApp message + PDFs sent to the Secretary, with anomaly detection and an interactive per-municipality dashboard.",
    impact:
      "Replaced 2 Google Sheets + AppScripts and surfaced anomalies the old system hid, improving correction and reliability.",
    stack: ["Python", "Streamlit", "SQLite", "Selenium", "Google Sheets"],
    links: [{ label: "GitHub", href: "https://github.com/joaoromaodev" }],
  },
  {
    slug: "rootlab",
    title: "RootLab",
    kicker: "Root-Cause Analysis platform",
    flag: "building",
    featured: true,
    summary:
      "Local-first tool that chains Ishikawa → GUT Matrix → 5 Whys → 5W2H into a single, auditable cascade with PDF export. Runs offline in the browser.",
    problem:
      "Root-cause analysis is usually scattered across disconnected templates, so the reasoning behind a fix is hard to audit.",
    solution:
      "A cascading flow where each step's output feeds the next — built offline-first with no server. Aimed at quality (ISO 9001 / IATF 16949), production and Scrum teams.",
    stack: ["React", "TypeScript", "Vite", "Tailwind", "Zustand", "Dexie", "Vitest"],
    privateNote:
      "Pre-MVP, in active development — co-developed with a colleague (name may change before launch).",
  },
  {
    slug: "ecopredict",
    title: "EcoPredict",
    kicker: "AI for Sustainability",
    flag: "award",
    featured: false,
    summary:
      "AI + sustainability project in the I2A2 \"AI for Sustainable Projects — Towards COP 30\" program. Top 7 globally, \"Outstanding Achievement\" (Dec 2025).",
    problem:
      "Applying ML and sustainability metrics to a real local context — Belém and the Amazon.",
    solution:
      "Co-led the project as data analyst, building the ML models and sustainability metrics.",
    impact: "Top 7 projects · Outstanding Achievement (Dec 2025).",
    stack: ["Python", "Machine Learning", "Data Analysis"],
    privateNote: "Course project — recognised as an award highlight; not published.",
  },
  {
    slug: "diarias",
    title: "Diárias",
    kicker: "Financial automation (gov)",
    flag: "live",
    featured: false,
    summary:
      "Sibling of PETE/PEAE: generates the monthly standardized load file that HR uploads into ERGON, SEDUC's legacy system.",
    problem: "A manual, error-prone monthly export feeding a legacy system.",
    solution: "Automated generation of the standardized ERGON load file.",
    stack: ["Python", "Automation"],
  },
  {
    slug: "mago-mercador",
    title: "Mago Mercador",
    kicker: "E-commerce / personal venture",
    flag: "side",
    featured: false,
    summary:
      "My tabletop-RPG dice & accessories shop — product, brand and social. magomercador.com.br · @magomercador.",
    problem: "Building a real brand and storefront for a niche audience.",
    solution: "An e-commerce venture spanning product, branding and social media.",
    stack: ["E-commerce", "Branding", "Social"],
    links: [
      { label: "Store", href: "https://magomercador.com.br" },
      { label: "Instagram", href: "https://www.instagram.com/magomercador/" },
    ],
  },
  {
    slug: "cherry-bomb",
    title: "Cherry Bomb Vending Machine",
    kicker: "UI / branding",
    flag: "side",
    featured: false,
    summary:
      "Mobile-first neobrutalist UI (red/black/white) with Pix payment logic for a handmade-goods vending machine.",
    problem: "A vending machine for handmade goods needed a bold, simple buy flow.",
    solution: "A mobile-first neobrutalist UI with Pix payment logic.",
    stack: ["UI Design", "Branding", "Pix"],
  },
];

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

export const flagMeta: Record<ProjectFlag, { label: string; color: string }> = {
  "case-study": { label: "case study", color: "text-purple" },
  live: { label: "live", color: "text-green" },
  building: { label: "building", color: "text-amber" },
  award: { label: "award", color: "text-cyan" },
  side: { label: "side project", color: "text-muted" },
};
