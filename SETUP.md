# Setup — chaves de API e deploy

Guia rápido pra ligar os widgets ao vivo. O site **funciona sem nenhuma chave**
(os cards caem pro snapshot estático; o clima de Belém já é real). Preencha só o
que quiser ativar. Copie `.env.example` → `.env.local` e cole os valores.

> ⚠️ Nunca comite `.env.local` (já está no `.gitignore`). As chaves `*_SECRET` e
> tokens ficam **só no servidor**.

---

## 0. Site URL, currículo e projetos (sem chave)

- **`NEXT_PUBLIC_SITE_URL`** — **opcional, e hoje está em branco de propósito.**
  Em branco, a Vercel resolve sozinha para o domínio de produção
  (`https://www.romaodev.com`) — ver "Domínio próprio". Preencha só para fixar
  um host à mão; se preencher, exige redeploy. É o que alimenta o `sitemap.xml`,
  o `robots.txt`, o card social e o JSON-LD.
- **Currículo** — coloque o PDF em `public/joao-romao-cv.pdf`. Os botões
  "Download CV" (hero) e "CV (PDF)" (contato) aparecem sozinhos no próximo
  build; enquanto o arquivo não existir, ficam escondidos.
- **Projetos** — rode `npm run dev` e abra **http://localhost:3000/admin**.
  Cadastre/edite/reordene, marque ★ destaque e ◉ publicado, salve, e **commite
  o `content/projects.json`**. O painel não existe em produção (404). Cada campo
  de texto tem caixa **EN** e **PT**: o inglês é obrigatório, o português é
  opcional e cai pro inglês se ficar vazio (o painel mostra quantos faltam).
- **Página de estudo de caso** — um projeto ganha página própria
  (`/projects/<slug>` e `/pt/projetos/<slug>`) assim que tiver `overview`,
  `highlights` (notas de engenharia) ou `gallery`. Sem isso, o card não linka
  pra lugar nenhum — o site nunca promete uma página que não existe. As imagens
  da galeria vão em `public/projects/<projeto>/`; `.gif` é servido sem
  otimização pra continuar animando, e toda imagem precisa de alt.
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
4. `ALLOWED_ORIGINS` **não** precisa da URL do próprio site. O guarda de origem
   (`lib/security.ts:20`) já aceita quando o host da origem é igual ao host da
   requisição, então o chatbot funciona no domínio novo sozinho. Essa variável
   é só pra liberar uma origem **de fora** (outro domínio consumindo a API).
5. Deploy.

---

## Domínio próprio — `www.romaodev.com`  ✅ no ar

Comprado na **Namecheap** e ligado à Vercel em **02/09/2026**. Já está
funcionando; o que segue é o registro de como foi feito, para refazer ou migrar.

> **O endereço oficial é `https://www.romaodev.com`** — é ele que vai no
> currículo, no LinkedIn e no GitHub. O apex (`romaodev.com`) responde com um
> **308** para o www, com certificado válido.
>
> É a configuração que a Vercel monta por padrão, e o João decidiu mantê-la
> (02/09/2026). O que importa não é qual dos dois hosts vence, e sim que o
> **canonical aponte para o host que serve o site** — se um dia inverter para o
> apex, veja "Trocar de host" no fim desta seção.

**1. Vercel → Settings → Domains.** Adicione **os dois**: `romaodev.com` e
`www.romaodev.com`. A Vercel deixa o `www` como *Production* e cria o 308 do
apex sozinha.

**2. Namecheap → Domain List → Manage → Advanced DNS.** Com a nameserver em
**Namecheap BasicDNS**:

- **Apague os registros de parking** que vêm por padrão — o `CNAME` de `www`
  apontando pra `parkingpage.namecheap.com` e o *URL Redirect Record* do `@`
  (`romaodev.com` → `http://www.romaodev.com/`). Enquanto eles existirem, o
  domínio continua na página de estacionamento — e o redirect ocupa o host `@`,
  então nem dá pra criar o A Record.
- Crie os dois registros que a Vercel pediu:

| Type | Host | Value |
|---|---|---|
| A Record | `@` | `216.198.79.1` |
| CNAME Record | `www` | `6508b26e6fec3409.vercel-dns-017.com` |

> Valores de 02/09/2026. O CNAME é **específico deste projeto** — não é o
> `cname.vercel-dns.com` genérico dos tutoriais. Se for refazer, pegue de novo
> em **View DNS configuration** na tela de Domains.
>
> Cole o CNAME **sem o ponto final**: a Vercel exibe em notação absoluta
> (`...com.`) e a Namecheap acrescenta sozinha; com o ponto, às vezes dá erro de
> validação. No Host vai só `www`, não o domínio inteiro.
>
> Ignore os valores *legacy* que a Vercel cita no aviso cinza
> (`cname.vercel-dns.com` e `76.76.21.21`) — funcionam, mas são a faixa antiga.

Propagação costuma levar de minutos a algumas horas. Confira com
`nslookup romaodev.com` — enquanto responder `192.64.119.114`, ainda é parking;
quando responder `216.198.79.1`, chegou.

**3. `NEXT_PUBLIC_SITE_URL` não precisou ser preenchida.** O `lib/seo.ts` tenta,
nesta ordem: `NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` →
`VERCEL_URL` → localhost. A Vercel passou a preencher a segunda com o domínio de
produção assim que ele ficou válido, e o deploy seguinte já saiu com o canonical,
o `og:url`, o `hreflang`, o `sitemap.xml`, o `robots.txt` e o JSON-LD todos em
`www.romaodev.com` — verificado, zero ocorrência de `.vercel.app`.

Defina a variável só se quiser **fixar** o host (blindando contra uma mudança
futura nos domínios da Vercel). Se definir, ela tem de bater **exatamente** com
o host de *Production*, e exige **redeploy**: ela entra no build, não em runtime.

**4. Turnstile.** Se o anti-bot do chatbot estiver configurado (§5), o widget da
Cloudflare é travado por hostname: abra **Turnstile → seu site → Settings** e
adicione `www.romaodev.com`. Sem isso o formulário quebra só no domínio novo — e
funcionando na `.vercel.app`, é o tipo de falha que demora pra descobrir.

**5. Depois de tudo no ar:** registre no Search Console — prefira **propriedade
de domínio** (`romaodev.com`), que cobre apex e www de uma vez — e envie o
`sitemap.xml`. Passe a URL nova no LinkedIn Post Inspector pra derrubar o cache
do card social.

### Trocar de host (www ↔ apex)

Se um dia quiser inverter, são **dois passos, os dois obrigatórios**:

1. **Vercel → Domains → Edit** no host desejado → torná-lo o de *Production*.
   O 308 se inverte sozinho.
2. **Redeploy.** O HTML é estático: sem rebuild, o canonical continua apontando
   para o host antigo enquanto o novo serve o site — que é exatamente a
   divergência que faz o Google enxergar duas versões.

Se `NEXT_PUBLIC_SITE_URL` estiver definida, atualize-a junto — ela vence a
inferência da Vercel. Confira depois:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://<host-novo>/
curl -s https://<host-novo>/sitemap.xml | head -5   # não pode citar o host antigo
```

### Analytics

**Vercel Analytics** e **Speed Insights** já estão no código. Ative os dois no
painel do projeto (aba **Analytics** / **Speed Insights**) — plano grátis, sem
cookie e sem banner de consentimento. Fora da Vercel eles simplesmente não
coletam nada.

### Checklist antes de divulgar

- [ ] `npm run build` passa sem erro.
- [x] Domínio `www.romaodev.com` no ar, com o apex em 308 e certificado válido
      (02/09/2026). Canonical, `hreflang`, sitemap, robots e JSON-LD conferidos:
      zero ocorrência de `.vercel.app`.
- [ ] CV em `public/joao-romao-cv.pdf`.
- [ ] Screenshots dos projetos em `public/projects/` (dados fictícios!).
- [ ] Traduções dos projetos completas (o `/admin` avisa se faltar alguma).
- [ ] Cole a URL no https://www.linkedin.com/post-inspector/ pra forçar o
      LinkedIn a buscar o card social novo.
- [ ] Registre o site no https://search.google.com/search-console e envie o
      `sitemap.xml` (ele já lista `/` e `/pt` com hreflang).
