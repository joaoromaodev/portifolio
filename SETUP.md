# Setup — chaves de API e deploy

Guia rápido pra ligar os widgets ao vivo. O site **funciona sem nenhuma chave**
(os cards caem pro snapshot estático; o clima de Belém já é real). Preencha só o
que quiser ativar. Copie `.env.example` → `.env.local` e cole os valores.

> ⚠️ Nunca comite `.env.local` (já está no `.gitignore`). As chaves `*_SECRET` e
> tokens ficam **só no servidor**.

---

## 1. Anthropic — chatbot "Ask my portfolio" (`ANTHROPIC_API_KEY`)

1. https://console.anthropic.com → **API Keys** → **Create Key**.
2. Cole em `ANTHROPIC_API_KEY=`.
3. **Backstop de custo (faça isso! — DESIGN.md §6.1):** em **Billing**, adicione
   um valor **pré-pago** e **DESLIGUE o auto-recharge**. Assim, quando o crédito
   acabar, a API para — nunca vem conta-surpresa. Perda máxima = o que carregou.
   Custo real esperado: centavos/mês (Haiku 4.5 ≈ US$0,002–0,004 por pergunta).

## 2. GitHub — heatmap de contribuições (`GITHUB_TOKEN`)

1. https://github.com/settings/tokens → **Generate new token (classic)**.
2. Não precisa marcar **nenhum** escopo (dados públicos bastam). Se seu perfil de
   contribuições for privado, marque só `read:user`.
3. Cole em `GITHUB_TOKEN=`. (Opcional: `GITHUB_USERNAME=` se for diferente de `joaoromaodev`.)

## 3. Spotify — "tocando agora" (`SPOTIFY_*`)

1. https://developer.spotify.com/dashboard → **Create app**.
2. Em **Redirect URIs**, adicione exatamente: `http://127.0.0.1:8888/callback`
3. Copie **Client ID** e **Client Secret** → `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET`.
4. Rode o helper pra pegar o refresh token (abre o navegador, você clica "Agree"):
   ```bash
   SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/get-spotify-token.mjs
   ```
   Cole o resultado em `SPOTIFY_REFRESH_TOKEN=`. O token não expira.

## 4. Steam — jogos recentes (`STEAM_API_KEY`, `STEAM_ID`)

1. Chave: https://steamcommunity.com/dev/apikey → `STEAM_API_KEY=`.
2. Seu SteamID64 (17 dígitos): https://steamid.io → `STEAM_ID=`.
3. O perfil + "detalhes do jogo" precisam estar **públicos** (senão cai no fallback).

## 5. Cloudflare Turnstile — anti-bot do chatbot (opcional)

1. https://dash.cloudflare.com → **Turnstile** → **Add site** (modo *Managed*).
2. **Site Key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY=` (pública).
   **Secret Key** → `TURNSTILE_SECRET_KEY=`.
3. Se ficar em branco, o check é pulado (os rate-limits por IP continuam valendo).

---

## Rodar local

```bash
npm run dev      # http://localhost:3000
```

## Deploy na Vercel

1. https://vercel.com → **Add New → Project** → importe o repo do GitHub.
2. Framework: **Next.js** (detecta sozinho). Build: `next build`.
3. Em **Settings → Environment Variables**, cole as mesmas chaves do `.env.local`.
4. Em `ALLOWED_ORIGINS`, ponha a URL final (ex.: `https://joaoromao.dev`) pra
   liberar o chatbot no domínio de produção.
5. Deploy. Depois é só apontar o domínio próprio em **Settings → Domains**.
