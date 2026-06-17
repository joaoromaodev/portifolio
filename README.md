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
