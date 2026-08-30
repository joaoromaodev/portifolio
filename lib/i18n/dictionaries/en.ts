// English dictionary — the source of truth for every visible string.
// pt.ts mirrors this shape exactly; the `Dictionary` type is inferred from here,
// so adding a key makes TypeScript demand the Portuguese translation too.

export const en = {
  locale: "en",
  htmlLang: "en",
  ogLocale: "en_US",
  label: "English",
  shortLabel: "EN",

  meta: {
    title: "João Romão — Data Analyst & Developer",
    description:
      "Portfolio of João Romão — a hybrid Data + Dev profile from Belém, Brazil. Python automation, real-time dashboards and full-stack Next.js. Open to remote / relocation.",
    ogDescription:
      "A living dashboard about me: real-time data, Python automation and full-stack Next.js. Open to remote work and relocation.",
    keywords: [
      "João Romão",
      "Data Analyst",
      "Developer",
      "Python automation",
      "Next.js",
      "Belém",
      "remote",
    ],
  },

  profile: {
    role: "Data Analyst & Developer",
    tagline: "Python automation · real-time data · full-stack Next.js",
    location: "Belém, Pará — Brazil",
    status: "open to remote / relocation",
  },

  a11y: {
    skipToContent: "Skip to content",
  },

  nav: {
    items: [
      { id: "dashboard", label: "live" },
      { id: "about", label: "about" },
      { id: "experience", label: "experience" },
      { id: "projects", label: "projects" },
      { id: "skills", label: "skills" },
      { id: "contact", label: "contact" },
    ],
    cta: "get in touch",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },

  theme: {
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
  },

  language: {
    /** Label for the control itself. */
    switchLabel: "Switch language",
    /** What the other locale is called, shown on the toggle. */
    other: "Português",
    otherShort: "PT",
  },

  hero: {
    prompt: "whoami",
    headline: {
      lead: "I build the real-time systems that ",
      accent: "public-sector finance",
      tail: " runs on — turning raw data into automation and full-stack products that hold up in production.",
    },
    roleLine: "Data Analyst & Developer from Belém, Brazil.",
    cityLabel: "Belém",
    ctaWork: "View work",
    ctaCv: "Download CV",
    ctaContact: "Contact",
  },

  dashboard: {
    slug: "live",
    title: "A dashboard that's actually alive",
    subtitle:
      "Live tiles fed by real APIs — GitHub, Steam and Spotify — each proxied through its own Next.js Route Handler, so the keys never touch the browser. Ask the assistant below anything about the work.",
    status: {
      loading: "fetching",
      ready: "live",
      empty: "idle",
      error: "offline",
    },
    sourceLabel: "source",
    viewProfile: "View profile",
    github: {
      title: "GitHub activity",
      source: "GitHub REST · ISR ~1h",
      contributions: "contributions",
      tracked: "tracked",
      /** `{weeks}` is replaced with the number of weeks in the heatmap. */
      lastWeeks: "last {weeks} weeks",
    },
    steam: {
      title: "Steam · recently played",
      source: "Steam Web API · public profile",
      perTwoWeeks: "/ 2wk",
    },
    spotify: {
      title: "Spotify",
      loading: "loading",
      nowPlaying: "now playing",
      lastPlayed: "last played",
      exampleTrack: "example track",
      open: "open",
      topTracks: "top tracks",
    },
    ask: {
      title: "Ask my portfolio",
      placeholder: "Type a question…",
      thinking: "Thinking…",
      send: "Send",
      intro: "Ask me anything about João's work, projects or background.",
      poweredBy: "Powered by Claude — answers stay within the portfolio.",
      sendShort: "send",
      footnote: "rate-limited · max 300 tokens · no SIMF / gov data",
      unavailable: "The assistant is unavailable right now.",
      genericError: "Something went wrong.",
      suggestions: [
        "What does João do at SEDUC?",
        "Show me the strongest project",
        "Is he open to remote work?",
      ],
    },
  },

  about: {
    slug: "about",
    title: "The human behind the dashboard",
    paragraphs: [
      "I've been a gamer and a geek for as long as I can remember. It started around 2007 on my older brother's hand-me-down PC, where I replayed The Legend of Zelda: Ocarina of Time on an emulator more times than I can count — it was the only game I had.",
      "I was coding before I knew what code was: tweaking my Tumblr's CSS, editing Minecraft files in Notepad so I could spin up a server over Hamachi and play with my friends. I grew up googling whatever I needed to learn — the sworn enemy of \"I don't know how to do that.\"",
      "That curiosity set the direction for my whole life. Watching Steve Jobs talk about the people crazy enough to think they can change the world, I knew I wanted to be one of them — using technology to actually change things.",
      "As a kid I built games; as a teenager I moved into design and launched one venture after another (and failed at plenty of them). That same drive still shows up everywhere: restoring an SG guitar, running @magomercador (my tabletop-RPG accessories shop), gaming when I can, and trying to move my body more often.",
      "My long-term goal is simple: to build a life abroad with my wife — somewhere with real quality of life, and the financial and physical freedom to enjoy it.",
    ],
    beyondCodeLabel: "beyond code",
    beyondCode: [
      "Rock & metal",
      "Puzzles",
      "Anime & film",
      "Guitar",
      "Mago Mercador",
      "Gaming",
      "Training",
    ],
  },

  experience: {
    slug: "experience",
    title: "From intern to tech lead",
    subtitle:
      "~2.5 years inside the Pará State Department of Education (SEDUC-PA) — same institution, growing scope.",
    items: [
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
    ],
  },

  projects: {
    slug: "projects",
    title: "Selected work",
    subtitle:
      "Real systems, mostly in production. Strongest first. Government work is shown as a case study only — no real data, no private code.",
    more: "more projects",
    seeAll: "See all projects",
    /** The /projects index page. */
    indexTitle: "Everything I've built",
    indexSubtitle:
      "Every project, newest and strongest first — including the smaller ones that don't make the front page.",
    indexSlug: "all projects",
    /** `{n}` is the project count. */
    count: "{n} projects",
    terms: {
      problem: "problem",
      solution: "solution",
      impact: "impact",
    },
    flags: {
      "case-study": "case study",
      live: "live",
      building: "building",
      award: "award",
      side: "side project",
    },
  },

  projectDetail: {
    back: "All projects",
    caseStudy: "Case study",
    theCase: "the case",
    role: "my role",
    overview: "overview",
    highlights: "engineering notes",
    gallery: "screens",
    stack: "stack",
    /** `{title}` is the project name. */
    metaTitle: "{title} — case study",
    close: "Close",
    previous: "Previous screen",
    next: "Next screen",
    /** `{n}` and `{total}` are the current and total screen numbers. */
    counter: "{n} of {total}",
    openImage: "Open larger",
  },

  skills: {
    slug: "skills",
    title: "Toolbox",
    groups: [
      { group: "Languages", items: ["Python", "JavaScript", "TypeScript", "SQL"] },
      {
        group: "Frontend",
        items: ["React", "Next.js 15", "Tailwind CSS", "Streamlit"],
      },
      {
        group: "Data & Automation",
        items: [
          "Pandas",
          "Selenium",
          "Web scraping",
          "RPA",
          "Anomaly detection",
          "Gspread",
        ],
      },
      {
        group: "Backend & Infra",
        items: [
          "Supabase",
          "PostgreSQL",
          "SQLite",
          "REST APIs",
          "Ubuntu (Nginx, PM2)",
          "IndexedDB / Dexie",
        ],
      },
      {
        group: "Practices",
        items: [
          "Vitest",
          "Git",
          "Google Apps Script",
          "Generative AI for productivity",
        ],
      },
    ],
  },

  contact: {
    slug: "contact",
    title: "Let's talk",
    subtitle:
      "Open to remote roles and relocation. The fastest way to reach me is email or LinkedIn.",
    emailLabel: "email",
    copy: "copy",
    copied: "copied ✓",
    cv: "CV (PDF)",
    location: {
      basedIn: "based in",
      city: "Belém, Pará",
      gateway: "gateway to the Amazon",
      localTime: "local time",
      weatherNow: "weather now",
    },
  },

  weather: {
    clear: "Clear sky",
    partlyCloudy: "Partly cloudy",
    overcast: "Overcast",
    fog: "Fog",
    rain: "Rain",
    snow: "Snow",
    showers: "Rain showers",
    thunderstorm: "Thunderstorm",
    unknown: "—",
  },

  footer: {
    builtBy: "built by",
  },

  commandPalette: {
    trigger: "terminal",
    open: "Open command palette (Ctrl+K)",
    label: "Command palette",
    chrome: "joao@belem — command palette",
    placeholder: "type a command…",
    hint: 'type "help" · ↑/↓ history · esc to close',
    /** `{a}` `{b}` `{c}` `{d}` are replaced with highlighted command names. */
    empty: "Try {a}, {b}, or just say {c}. Type {d} for more.",
    available: "Available commands:",
    typeSection: "Type a section name to jump there.",
    /** `{label}` is the section being jumped to. */
    jumping: "Jumping to // {label}…",
    /** `{cmd}` is what the visitor typed. */
    notFound: 'command not found: {cmd}',
    tryHelp: "Type \"help\" to see what's available.",
    opening: "Opening",
    sudo: "Nice try. This terminal only has read access — same as you. 🥪",
    triforce:
      "Wisdom, Power, Courage.\nSame kid who replayed Ocarina of Time until the emulator gave up. Still chasing all three. 🔺",
  },

  notFound: {
    title: "404",
    prompt: "cd",
    error: "cd: no such file or directory",
    body: "That page doesn't exist. Everything on this site lives on one page — head back and scroll.",
    home: "Back home",
    work: "See the work",
    metaTitle: "404 — page not found",
  },
};

// Structural shape every locale must satisfy. Inferred (not `as const`) so the
// members widen to string/string[] and pt.ts can supply its own text.
export type Dictionary = typeof en;
