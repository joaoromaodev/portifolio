# DESIGN.md — Identidade visual & conceito do portfólio de João Romão

> Especificação completa de design e comportamento. Use no **Claude Design** para explorar
> mockups; o `CLAUDE.md` (Claude Code) constrói o site seguindo este arquivo. Manter alinhados.
> Notas em português; tokens (cores/fontes) universais; copy do site em inglês.

---

## 1. Conceito-mestre: "dashboard vivo sobre você"

O portfólio é um **dashboard vivo** sobre o João — exatamente o tipo de produto que ele
constrói no trabalho (SIMF). É uma demonstração meta: "eu integro dados em tempo real em
painéis — este painel sou eu." Tudo no site é **um painel desse dashboard**.

O motivo **terminal/IDE é só acento** (hero, labels de seção, uma peça ou outra) — **não** a
pele inteira do site. O resto é um dashboard escuro, limpo e moderno.

## 2. Princípios de coesão (anti-carnaval)

1. **Um sistema de painel/card** para tudo (widgets, projetos, terminal compartilham a mesma linguagem).
2. **Uma paleta** (acentos de syntax, com disciplina — §7).
3. **Uma linguagem de movimento** (mesma curva/tempo — §9).
4. **Curadoria:** poucos painéis bons, não todos possíveis.
5. **Conteúdo > tema:** SIMF, PETE/PEAE e o impacto (métrica das 9 VMs) achados em ~10s.

## 3. Estrutura da página

1. **Hero / console** — linha de comando que "digita" `> whoami` revelando nome + cargo;
   status `open to remote / relocation`; hora local de Belém; CTAs (projects, GitHub, contact).
2. **Faixa de painéis ao vivo** — grid dos widgets (§4 e §5). É onde o conceito fica concreto.
3. **`// about`** — narrativa pessoal (copy no CLAUDE.md).
4. **`// experience`** — arco SEDUC-PA (estágio → Kapa → Montreal).
5. **`// projects`** — SIMF (case study, privado), PETE/PEAE (link + demo), RootLab, e secundários.
6. **`// skills`** — agrupadas (motivo de abas/tabs opcional).
7. **`// contact`** — email + LinkedIn + GitHub (sem telefone).

## 4. Painéis ao vivo (APIs)

Para cada um: o que mostra · fonte · auth · cache · estado vazio/erro. **Todos** têm skeleton de
loading e fallback — o site nunca pode parecer quebrado.

- **GitHub** — heatmap de contribuições + último repo/commit. Fonte: GitHub REST/GraphQL.
  Auth: token read-only (server). Cache: ~1h (ISR). Fallback: snapshot estático.
- **Spotify** — "tocando agora" ou "último ouvido". Fonte: Spotify Web API (OAuth refresh token,
  server). Atualiza ~30–60s. Vazio: "not playing — last played: X".
- **Clima de Belém** — temp/condição. Fonte: **Open-Meteo** (grátis, sem chave). Cache ~1h.
- **Steam** — jogos recentes. Fonte: Steam Web API (chave + SteamID, perfil público). Fallback se privado.
- **Relógio de Belém** — hora local ao vivo (timezone `America/Belem`). Sem API; só client + Intl.
  Vive junto do mapa (§5).
- **Ask my portfolio** — chatbot IA (§6).

**Arquitetura (vale ouro p/ recrutador):** toda API com segredo passa por **Route Handlers**
do Next.js (`/app/api/...`); o client chama o *próprio* endpoint, nunca a chave. Cache/ISR p/
evitar rate limit e custo.

## 5. Painel de localização — globo radar (versão atual)

- **Globo ortográfico em SVG** (hemisfério do Atlântico: América do Sul à esquerda, África à
  direita, Belém fora do centro), pré-projetado em build time (`scripts/build-geo.mjs`, d3-geo
  só no build) — nenhuma lib de mapa chega ao browser.
- **O globo inteiro é a tela de radar:** graticule como grade, anéis de alcance, varredura
  girando em sentido horário sobre o hemisfério. Ao passar sobre Belém, um **blip vermelho
  pisca** — sincronizado por `animation-delay` negativo calculado do bearing do pin
  (única exceção permitida ao "vermelho só para erro": é um "alvo" de radar, 1 lugar só).
- Vive no painel de Contact junto do relógio de Belém + clima (Open-Meteo) + status.
- Sem 3D pesado. Performático. `prefers-reduced-motion`: varredura parada, blip estático aceso.

## 6. "Ask my portfolio" — chatbot IA (Claude)

- **O quê:** um painel de chat onde o visitante pergunta sobre o João e a IA responde a partir
  dos dados do portfólio. Demonstra integração de IA em produto.
- **Como:** Claude via **API da Anthropic** atrás de um Route Handler (chave no server). Usar o
  modelo mais barato (**Claude Haiku 4.5**, `claude-haiku-4-5`). O contexto do João (resumo,
  projetos, skills) vai no system prompt, com **prompt caching** (~90% mais barato na parte fixa).
- **Custo de referência (jun/2026):** Haiku 4.5 = US$1/MTok entrada, US$5/MTok saída → ~US$0,002–0,004
  por pergunta. Uso real ≈ centavos/mês. O risco é só abuso/bot.

**Animação (estilo "Super Máquina"/KITT):** enquanto o bot responde (streaming), mostrar uma
fileira de barras de áudio que oscilam (voicebox), em **verde/ciano** (vermelho do KITT é
reservado a erro). Paradas quando ocioso; estado estático com `prefers-reduced-motion`. É o
**mesmo motivo** do equalizer do painel do Spotify — reaproveitar amarra o visual.

**Proteções anti-abuso (todas obrigatórias):**
1. **Teto pré-pago (backstop):** créditos pré-pagos na Console com **recarga automática DESLIGADA**
   → quando o crédito acaba, a API para. Nunca há conta-surpresa; perda máxima = o que foi carregado.
2. **Rate limit por IP/sessão** (ex.: 5–10 msgs/IP/dia) via KV (Vercel KV / Upstash, free tier).
3. **Teto diário global:** passou de N chamadas no dia → desativa o widget ("assistente
   descansando, volte amanhã").
4. **Cap por requisição:** `max_tokens` baixo (~300) + limite no tamanho da pergunta (~500 chars).
5. **Anti-bot leve:** Cloudflare Turnstile (CAPTCHA invisível, grátis) na 1ª mensagem + checar origem.

- ⚠️ **Guardrails de conteúdo (críticos):** o system prompt deve **proibir vazar qualquer coisa
  confidencial do SIMF / dados de governo / detalhes internos**, mesmo se perguntado diretamente;
  manter tom profissional; responder só sobre o escopo do portfólio; ter fallback se a API falhar.

## 7. Paleta (inspirada em syntax highlighting) — tema escuro

| Papel | Hex | Uso |
| :--- | :--- | :--- |
| Background | `#0D1117` | fundo |
| Surface/painel | `#161B22` | cards, painéis |
| Border | `#2A2F37` | bordas/divisores |
| Text primary | `#E6EDF3` | corpo e títulos |
| Text muted | `#8B949E` | legendas/metadados |
| Comment | `#6E7681` | headers `// ...`, hints |
| String green ⭐ | `#56D364` | acento primário (links/destaques/Amazônia) |
| Function cyan | `#39C5CF` | acento secundário |
| Keyword purple | `#C678DD` | tags/labels |
| Number amber | `#E3A857` | números/métricas (ex.: "~600h → meio dia") |
| Error red | `#F85149` | só com parcimônia |

```css
:root{
  --bg:#0D1117; --surface:#161B22; --border:#2A2F37;
  --text:#E6EDF3; --muted:#8B949E; --comment:#6E7681;
  --green:#56D364; --cyan:#39C5CF; --purple:#C678DD; --amber:#E3A857; --red:#F85149;
}
```
Acentos só em **acento** (rótulos, links, tags, números) — nunca em parágrafos.

## 8. Tipografia

- **Headings / labels / UI / terminal:** monoespaçada — **JetBrains Mono** ou **IBM Plex Mono**.
- **Corpo (textos longos):** **Inter** (sans legível) — recomendado p/ legibilidade. (Full-mono
  no corpo é possível, com `line-height:1.7`.)
- Sentence case; corpo ≥16px; hierarquia por tamanho + cor, não por peso pesado.

## 9. Sistema de movimento

- Lib: **Framer Motion**. Uma curva de easing e uma escala de duração para tudo.
- Hero: efeito "digitando" (typewriter). Scroll: reveals sutis e rápidos (200–300ms), com stagger
  nos grids. Métricas: contadores que sobem (a das 9 VMs). Spotify: barrinhas de equalizer.
  Mapa: pin pulsando. Hover de card: leve elevação/realce de borda.
- **`prefers-reduced-motion` obrigatório:** tudo degrada para estados estáticos.

## 10. Motivos terminal/IDE (acento)

- Chrome de janela de terminal (3 pontinhos + barra de título) em painéis-chave.
- Headers de seção estilo comentário: `// about`, `// projects`.
- Tags coloridas por "tipo" (como syntax highlight).
- Opcional: um CLI-easter-egg (digitar `whoami`, `projects`, `contact`).

## 10b. Elemento assinatura — grade synthwave (1 lugar só)

- **Só a grade em perspectiva + glow de horizonte** do synthwave/retrowave — **tingida na nossa
  paleta** (ciano/roxo sobre fundo escuro). **Sem** pôr do sol magenta / cromado / rosa-choque
  (isso brigaria com a paleta e viraria carnaval).
- **Onde:** fundo do **hero** (ou atrás do mapa da Amazônia). **O que representa:** o caminho à
  frente, "Belém → mundo" — amarra o visual ao objetivo remoto/internacional.
- Usar **uma vez**, sutil, com `prefers-reduced-motion` (grade estática). Explorar no Claude Design.

## 11. Arquitetura & segurança (handoff p/ Claude Code)

- Stack: **Next.js (App Router) + TypeScript + Tailwind + Framer Motion**; deploy **Vercel**.
- Segredos em **env vars** (Vercel); nunca no client. Cada API atrás de Route Handler. Cache/ISR.
- Cada widget com estado de loading + erro/vazio.
- **Env vars previstas:** `GITHUB_TOKEN`, `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`,
  `SPOTIFY_REFRESH_TOKEN`, `STEAM_API_KEY`, `STEAM_ID`, `ANTHROPIC_API_KEY`. (Open-Meteo: nenhuma.)
- Fontes via Google Fonts.

## 12. Guardrails de conteúdo (recap — NÃO violar)

- **SIMF:** só case study com screenshots de dados fictícios; sem código/dados reais; o chatbot
  IA (§6) não pode revelar nada do SIMF.
- **Sem telefone** público.
- **Honestidade:** RootLab = pré-MVP e co-autoral; "liderança" = decisão técnica/product owner,
  não gestão de pessoas. Não reproduzir o discurso da Apple (copyright) — referenciar.

## 13. Fluxo de trabalho

1. **Claude Design:** explorar mockups (hero, card de projeto, mapa, paleta em contexto, layout).
2. **Aprovação:** registrar a versão final aqui.
3. **Claude Code:** constrói via `CLAUDE.md`, que referencia este arquivo.

> **Prompt p/ abrir no Claude Design:**
> "Read DESIGN.md. Design a dark 'living dashboard' portfolio for João Romão: a hero with a
> subtle terminal-typed intro, a grid of live widgets (now-playing, GitHub activity, weather,
> a stylized Amazon map with a Belém pin), using the syntax-highlight palette and monospace
> labels with readable body text. Bold but clean and scannable. Show me 2–3 hero variations."
