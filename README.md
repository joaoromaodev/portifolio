# João Romão — Portfolio

A dark "living dashboard" portfolio for **João Romão**, Data Analyst & Developer
(Belém, Brazil) — open to remote / relocation. The site is itself a portfolio
piece: a real-time dashboard about its author.

**Live:** https://portifolio-lime-three-64.vercel.app

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion ·
deployed on Vercel.

## What's inside

- **Hero** — terminal-typed intro, synthwave grid, live Belém clock.
- **Live dashboard** — GitHub, Spotify, weather, Steam, a stylized Amazon map,
  and an "Ask my portfolio" AI chatbot. Every widget is served by its own
  Next.js Route Handler so API keys stay server-side, and each falls back to a
  static snapshot when a key is unset (it never looks broken).
- **About · Experience · Projects · Skills · Contact** — the written content.

## Managing projects

Projects live in [`content/projects.json`](content/projects.json), not in code.
Edit them through the admin panel:

```bash
npm run dev
```

Then open **http://localhost:3000/admin**. You can add and delete projects,
reorder them, edit every field, and toggle two flags per project:

| Flag | Meaning |
| --- | --- |
| ★ **featured** | Renders as a full-width case-study row (problem → solution → impact) instead of a compact tile. |
| ◉ **published** | Off keeps the project in the file as a draft, hidden from the site. |

Saving writes `content/projects.json`. **Commit that file** and Vercel publishes
the change. `⌘/Ctrl+S` saves; unsaved edits warn before you close the tab.

The panel is **development-only** — in a production build `/admin` and
`/api/admin/*` both return 404, so the deployed site ships no write endpoint and
no login to secure. The file is also plain JSON with a
[schema](content/projects.schema.json), so you can hand-edit it if you prefer.

**Screenshots:** drop images in `public/projects/` and set a project's `image`
and `imageAlt` fields. See [public/projects/README.md](public/projects/README.md)
— government screenshots must use fictional data.

**CV:** put the PDF at `public/joao-romao-cv.pdf`. The download buttons in the
hero and contact section appear automatically once the file exists, and stay
hidden until then.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in keys (optional — site works without them)
npm run dev                  # http://localhost:3000
```

See [SETUP.md](SETUP.md) for how to obtain each API key and how the deploy works.
Weather (Open-Meteo) needs no key and works out of the box.

## Deploy

Connected to Vercel — pushes to `main` deploy to production automatically.

Security headers (including a CSP) are set in `next.config.ts` and applied in
production only; verify them with `npm run build && npm start`, not `next dev`.
