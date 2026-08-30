# Setup — chaves de API e deploy

Guia rápido pra ligar os widgets ao vivo. O site **funciona sem nenhuma chave**
(os cards caem pro snapshot estático; o clima de Belém já é real). Preencha só o
que quiser ativar. Copie `.env.example` → `.env.local` e cole os valores.

> ⚠️ Nunca comite `.env.local` (já está no `.gitignore`). As chaves `*_SECRET` e
> tokens ficam **só no servidor**.

---

## 0. Site URL, currículo e projetos (sem chave)

- **`NEXT_PUBLIC_SITE_URL`** — só precisa quando você apontar um domínio próprio
  (ex.: `https://joaoromao.dev`). Em branco, a Vercel usa a URL do deploy
  sozinha. É o que alimenta o `sitemap.xml`, o `robots.txt`, o card social e o
  JSON-LD.
- **Currículo** — coloque o PDF em `public/joao-romao-cv.pdf`. Os botões
  "Download CV" (hero) e "CV (PDF)" (contato) aparecem sozinhos no próximo
  build; enquanto o arquivo não existir, ficam escondidos.
- **Projetos** — rode `npm run dev` e abra **http://localhost:3000/admin**.
  Cadastre/edite/reordene, marque ★ destaque e ◉ publicado, salve, e **commite
  o `content/projects.json`**. O painel não existe em produção (404). Cada campo
  de texto tem caixa **EN** e **PT**: o inglês é obrigatório, o português é
  opcional e cai pro inglês se ficar vazio (o painel mostra quantos faltam).
- **Idiomas** — inglês em `/` e português em `/pt`, com botão PT/EN na navbar.
  Textos de interface ficam em `lib/i18n/dictionaries/{en,pt}.ts`.
- **Tema** — claro/escuro seguindo o sistema, com toggle na navbar. As cores
  ficam todas em tokens no `app/globals.css`; nunca escreva hex direto no
  componente, senão o modo claro quebra sem avisar.

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
5. Deploy. Depois é só apontar o domínio próprio em **Settings → Domains** — e
   aí sim preencher `NEXT_PUBLIC_SITE_URL` com esse domínio.

### Analytics

**Vercel Analytics** e **Speed Insights** já estão no código. Ative os dois no
painel do projeto (aba **Analytics** / **Speed Insights**) — plano grátis, sem
cookie e sem banner de consentimento. Fora da Vercel eles simplesmente não
coletam nada.

### Checklist antes de divulgar

- [ ] `npm run build` passa sem erro.
- [ ] `NEXT_PUBLIC_SITE_URL` preenchido (se já tiver domínio).
- [ ] CV em `public/joao-romao-cv.pdf`.
- [ ] Screenshots dos projetos em `public/projects/` (dados fictícios!).
- [ ] Traduções dos projetos completas (o `/admin` avisa se faltar alguma).
- [ ] Cole a URL no https://www.linkedin.com/post-inspector/ pra forçar o
      LinkedIn a buscar o card social novo.
- [ ] Registre o site no https://search.google.com/search-console e envie o
      `sitemap.xml` (ele já lista `/` e `/pt` com hreflang).
