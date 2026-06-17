# CLAUDE.md — Portfólio de João Romão

> Arquivo de contexto para o Claude Code. É a **fonte de verdade** do conteúdo/estrutura.
> **Identidade visual e comportamento dos painéis: ver `DESIGN.md`** (arquivo companheiro).
> Instruções/notas em português; o **conteúdo do site é em inglês** (público-alvo internacional).
> Atualize este arquivo conforme o projeto evoluir.

---

## 1. O que estamos construindo

Um **site de portfólio pessoal**, em inglês, para João Romão — Data Analyst & Developer
brasileiro buscando **trabalho remoto internacional** (ganhar em dólar) ou **imigração via
tecnologia**. O site precisa:

- Posicionar João como perfil **híbrido Data + Dev**, com automação, dados e full-stack.
- Mostrar projetos reais com **estudos de caso** (alguns com código no GitHub, outros não — ver §6).
- Ter uma seção **"About"** com a narrativa pessoal (é o diferencial humano — ver §5).
- Ser, ele mesmo, **uma peça de portfólio**: código limpo, performático, bem feito.

O site complementa o currículo (já pronto) e o LinkedIn — não os repete, aprofunda.

---

## 2. Quem é João (resumo para gerar conteúdo)

- **Nome:** João Romão (completo: João Gomes Romão Neto). Usar "João Romão" no site.
- **Local:** Belém, Pará, Brasil. Aberto a remoto / relocação.
- **Formação:** BSc in Computer Science — Universidade Cruzeiro do Sul (Nov 2025).
- **Inglês:** B2 Upper Intermediate (EF SET, 2025).
- **Posicionamento:** Data Analyst & Developer (Python automation + full-stack Next.js/React).
- **Experiência:** ~2,5 anos no SEDUC-PA (Secretaria de Educação do Pará), progressão
  estágio → Kapa → Montreal Informática (mesma instituição, contratantes diferentes).
  Hoje é **tech lead / product owner do SIMF** e braço direito da diretora da DPPC.
- **Objetivo de vida:** construir uma vida no exterior com a esposa, com qualidade de vida e
  liberdade financeira e física.

### Contato (para a seção Contact / footer)
- **Email:** joaoromaodev@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/joaoromao-data/
- **GitHub:** https://github.com/joaoromaodev
- **Telefone:** existe (+55 91 99356-9185), mas **não publicar no site** (spam). Contato por
  email + LinkedIn. Considerar formulário de contato ou ofuscar o email.

---

## 3. Stack e convenções (para o Claude Code)

**Stack (decidida):**
- **Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion** (animações).
- **Route Handlers** (`/app/api/...`) como proxy das APIs ao vivo — segredos só no server, com cache/ISR.
- Deploy na **Vercel** (gratuito; depois apontar domínio próprio).
- Formulário de contato via serviço (ex.: Formspree) ou `mailto:` ofuscado — decidir com o João.

**Env vars previstas (APIs ao vivo — ver `DESIGN.md` §4/§6/§11):**
`GITHUB_TOKEN`, `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`,
`STEAM_API_KEY`, `STEAM_ID`, `ANTHROPIC_API_KEY`. (Clima via Open-Meteo: sem chave.)

**Convenções:**
- Todo o **conteúdo visível em inglês**. Comentários de código em inglês.
- TypeScript estrito; componentes pequenos e reutilizáveis.
- Responsivo e mobile-first; acessível (semântica, contraste, alt text).
- Performance: imagens otimizadas, sem libs desnecessárias.
- Commits pequenos e descritivos.
- Antes de gerar qualquer UI, consultar a skill **frontend-design** se disponível.

---

## 4. Estrutura do site

> **Conceito (ver `DESIGN.md`): "dashboard vivo sobre você"** — tema dark, motivo terminal/IDE
> como *acento* (não a pele toda), paleta de syntax highlight. Visual completo no `DESIGN.md`.

Seções (uma página, scroll, navegação âncora):

1. **Hero / console** — intro estilo terminal "digitando" (`> whoami`), status `open to remote / relocation`, hora local de Belém, CTAs. Fundo: grade synthwave sutil (DESIGN.md §10b).
2. **Painéis ao vivo (dashboard)** — widgets de API: GitHub, Spotify (tocando agora), Clima de Belém, Steam, mapa estilizado da Amazônia + relógio de Belém, e o **"Ask my portfolio"** (chatbot IA). Specs em DESIGN.md §4–§6.
3. **About** — narrativa pessoal (§5).
4. **Experience** — arco SEDUC-PA (estágio → dev → tech lead).
5. **Projects** — cards dos estudos de caso (§6); mais fortes primeiro.
6. **Skills** — agrupadas por domínio (§7); motivo de abas opcional.
7. **Contact** — email + LinkedIn + GitHub (sem telefone).

Cada **projeto** tem detalhe: problema → solução → stack → impacto → (link ou screenshots).
Headers de seção em estilo comentário (`// about`, `// projects`). Constraints em §6 e §8.

---

## 5. Conteúdo pronto — Seção "About" (copy em inglês)

> Esta é a narrativa de origem do João — o diferencial humano do site. Use como base; pode
> refinar o tom com ele. **NÃO reproduzir o discurso "The Crazy Ones" / "Think Different" da
> Apple** (é material protegido por direitos autorais) — apenas *referenciar* a inspiração,
> como abaixo.

```
I've been a gamer and a geek for as long as I can remember. It started around 2007 on my
older brother's hand-me-down PC, where I replayed The Legend of Zelda: Ocarina of Time on an
emulator more times than I can count — it was the only game I had.

I was coding before I knew what code was: tweaking my Tumblr's CSS, editing Minecraft files in
Notepad so I could spin up a server over Hamachi and play with my friends. I grew up googling
whatever I needed to learn — the sworn enemy of "I don't know how to do that."

That curiosity set the direction for my whole life. Watching Steve Jobs talk about the people
crazy enough to think they can change the world, I knew I wanted to be one of them — using
technology to actually change things.

As a kid I built games; as a teenager I moved into design and launched one venture after
another (and failed at plenty of them). That same drive still shows up everywhere: restoring an
SG guitar, running @magomercador (my tabletop-RPG accessories shop), gaming when I can, and
trying to move my body more often.

My long-term goal is simple: to build a life abroad with my wife — somewhere with real quality
of life, and the financial and physical freedom to enjoy it.
```

**Toques pessoais opcionais** (para um bloco "Beyond code" ou easter eggs):
rock do clássico ao metal (já foi a shows do Slipknot e Guns N' Roses), puzzles, anime, séries,
filmes; e os hiperfocos rotativos (guitarra, Mago Mercador, games, treino).

---

## 6. Banco de projetos (estudos de caso)

> ⚠️ **Flags de publicação importam.** Respeitar rigorosamente o que é publicável vs. privado.

### A. SIMF — Internal Financial Management System  ⭐ projeto-âncora
- **O quê:** plataforma web interna de monitoramento da execução orçamentária/financeira da
  SAPF/SEDUC-PA. João é **tech lead e product owner** (não gestor de pessoas — decisor técnico).
- **Stack:** Next.js 15 (App Router), React, Tailwind, Supabase/PostgreSQL.
- **Detalhes:** lê dados do SIAFE em tempo real; módulos CEO (execução orçamentária), CLIQ
  (liquidações), CPAG (pagamentos), ACONT (contas bancárias); auth com controle de acesso por
  perfil; identidade visual do Governo do Pará; deploy em VM Ubuntu 24.04 (Nginx + PM2), DNS
  interno e SSL para HTTPS na rede corporativa. **Em uso ativo** por DFIN e DPPC; atende SAPF.
- 🔒 **PRIVADO / NÃO PUBLICAR CÓDIGO.** Repo é privado e o sistema é gov em produção. No site:
  **estudo de caso apenas**, com **screenshots de dados fictícios** (ou borrados). **Nunca**
  expor dados reais, IPs/DNS internos, ou identificadores institucionais sensíveis. Sem link de repo.

### B. Monitor PETE/PEAE — Financial automation  ✅ publicável
- **O quê:** sistema em produção que acompanha diariamente parcelas pagas a prefeituras nos
  programas estaduais PETE (transporte escolar) e PEAE (alimentação escolar).
- **Stack:** Python, Streamlit, SQLite, Selenium, Google Sheets.
- **Destaques:** vai do relatório bruto do SIAFE até mensagem de WhatsApp + PDFs enviados à
  Secretária; **substituiu 2 planilhas Google + AppScripts**; **detecção de anomalia** (2ª OB na
  mesma parcela, que o sistema antigo escondia) → melhora correção/confiabilidade; dashboard
  interativo + visão por município; arquitetura limpa (`core/` Python puro pensado para migrar
  ao SIMF).
- ✅ **Publicável.** Tem demo com **dados fictícios** (`gerar_dados_fake.py`), sem dado real.
  Pode **linkar GitHub** e usar screenshots da demo.

### C. RootLab — Root-Cause Analysis platform  🚧 building MVP
- **O quê:** ferramenta local-first de Análise de Causa Raiz que encadeia **Ishikawa → Matriz
  GUT → 5 Porquês → 5W2H** em um fluxo único e auditável, com export PDF. Roda offline, no
  navegador, sem servidor. Diferencial: o **encadeamento em cascata** (saída de uma etapa
  alimenta a próxima). Público: qualidade (ISO 9001 / IATF 16949), produção/manutenção, Scrum.
- **Stack:** React + TypeScript + Vite + Tailwind, Zustand, IndexedDB (Dexie), **Vitest**.
- **Notas honestas:** está em **pré-MVP / em desenvolvimento** (não dizer "pronto"). É
  **co-desenvolvido com um colega** (papel = co-developer, não dono único). **O nome vai mudar**
  — confirmar o nome final com o João antes de fixar no site.

### D. EcoPredict — AI for Sustainability  🏆 (prêmio)
- IA + sustentabilidade no programa I2A2 "AI for Sustainable Projects – Towards COP 30".
  **Top 7 projetos** globais, reconhecimento "Outstanding Achievement" (Dez 2025). João foi
  co-líder e analista de dados (ML + métricas de sustentabilidade, foco em Belém).
- **Não publicado** (projeto de curso). Sem link de repo; tratar como destaque/award.

### E. Diárias — Financial automation (gov)
- Sistema irmão do PETE/PEAE; gera mensalmente o arquivo padronizado de carga para o RH subir no
  **ERGON** (sistema legado da SEDUC). Mesma família (automação financeira). Card secundário.

### F. Mago Mercador — E-commerce / personal venture
- Loja de dados e acessórios para RPG de mesa. magomercador.com.br · @magomercador (IG/TikTok).
  Mostra empreendedorismo, produto, marca e social. Card "side project".

### G. Career-ops — Career automation
- Ferramenta que pontua compatibilidade currículo↔vaga para o mercado internacional. Python.
  Card secundário (meta, demonstra interesse pelo próprio objetivo de imigração).

### H. Cherry Bomb Vending Machine — UI / branding
- UI mobile-first neobrutalista (vermelho/preto/branco) + lógica de pagamento Pix para uma
  máquina de vendas de itens artesanais. Card de design (opcional; mostra senso visual).

**Curadoria sugerida:** destacar **A, B, C** no topo (os mais fortes); **D** como award;
**E, F, G, H** como cards secundários/"more projects". Decidir a ordem final com o João.

---

## 7. Skills (agrupadas)

- **Languages:** Python, JavaScript, TypeScript, SQL
- **Frontend:** React, Next.js 15, Tailwind CSS, Streamlit
- **Data & Automation:** Pandas, Selenium, web scraping, RPA, anomaly detection, Gspread
- **Backend & Infra:** Supabase, PostgreSQL, SQLite, REST APIs, Ubuntu (Nginx, PM2), IndexedDB/Dexie
- **Practices:** TypeScript testing (Vitest), Git, Google Apps Script, Generative AI for productivity

---

## 8. Constraints críticas (NÃO violar)

1. **Confidencialidade do SIMF e dados gov:** nunca publicar código do SIMF, nem dados reais,
   nem identificadores internos (IPs, DNS, nomes de sistemas/processos sensíveis). Só estudo de
   caso com dados fictícios. Em dúvida, o João confirma o que pode aparecer.
2. **Copyright:** não reproduzir o discurso da Apple ("The Crazy Ones"/"Think Different") nem
   letras/obras de terceiros no site. Referenciar, não copiar.
3. **Honestidade do conteúdo:** RootLab = pré-MVP e co-autoral; "liderança" do João = decisão
   técnica/product ownership, **não** gestão de pessoas. Não inflar.
4. **Privacidade:** sem telefone público; preferir formulário/email ofuscado.

---

## 9. Primeiros passos (primeira sessão com o Claude Code)

1. Stack já decidida (§3). Confirmar com o João o **deploy** (Vercel) e planejar as
   **credenciais das APIs** (ver DESIGN.md §6/§11) — podem entrar depois, com placeholders/fallback.
2. Scaffold do projeto + Tailwind + Framer Motion + estrutura de pastas + layout base responsivo.
3. Montar o esqueleto das seções (§4) com o conteúdo de §5–§7 já preenchido.
4. **Direção visual: seguir o `DESIGN.md`** (tema dark "dashboard vivo", acento terminal/IDE,
   paleta de syntax, mono nos títulos + Inter no corpo, Framer Motion). Ignorar qualquer paleta antiga.
5. Implementar os cards de projeto (A, B, C primeiro), respeitando as flags de publicação (§6).
6. Placeholders para screenshots (o João gera os de dados fictícios depois).
7. Deploy de uma primeira versão cedo, iterar a partir daí.

> **Prompt sugerido para abrir a sessão:**
> "Read CLAUDE.md and DESIGN.md. Scaffold my portfolio: a Next.js + TypeScript + Tailwind +
> Framer Motion site, dark 'living dashboard' direction from DESIGN.md, with the section skeleton
> and the ready content. Start with layout + hero + the live-widget shells (with loading/fallback
> states); we'll wire the API keys after. Ask me before big design or structure decisions."
