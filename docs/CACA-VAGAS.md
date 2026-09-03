# Caça-vagas — contexto para a sessão de busca

> Documento de handoff. Uma sessão nova do Claude Code lê **este arquivo** e o
> `CLAUDE.md` e já tem tudo que precisa sobre o João sem perguntar de novo.
> Escrito em 02/09/2026. Datas relativas envelhecem — confira antes de usar.

---

## 1. O que essa sessão faz (e o que não faz)

**Faz:** estratégia de busca e posicionamento, palavras-chave e empresas-alvo,
adaptação do CV por vaga, texto do LinkedIn, mensagens de abordagem e
acompanhamento das candidaturas. E, com o navegador do Claude, **também
opera os canais**: buscar e filtrar vagas no LinkedIn, Indeed, Remotive,
We Work Remotely, Wellfound e afins; abrir cada vaga, ler o texto completo e
avaliar o fit; preencher formulário de candidatura; e escrever rascunho de
publicação, headline e mensagens no LinkedIn.

**Não faz — e não adianta insistir, é limite de segurança:**
- **Não faz login e não digita senha, token, 2FA nem dado de documento.**
  O João entra na conta antes; a sessão trabalha na janela já autenticada.
- **Não cria conta em lugar nenhum** e não resolve CAPTCHA. Onde o site
  exigir cadastro novo, ele cria e devolve a sessão.
- **Não aperta "enviar" sozinha.** Antes de submeter uma candidatura, mandar
  uma mensagem ou publicar qualquer coisa no LinkedIn, ela mostra o conteúdo
  exato e espera um "pode enviar" — por item, não uma autorização geral.
  Preencher e revisar é dela; o envio é uma decisão dele.

**Aviso sobre o LinkedIn:** automatizar navegação e envio em massa viola os
termos de uso e a plataforma bloqueia conta por isso. O uso aqui é assistido e
no ritmo humano — buscar, ler, redigir, e ele confirma cada envio. Nada de
disparar convite ou InMail em série.

## 2. A decisão que vem antes de tudo: posicionamento

O portfólio vende **"Data Analyst & Developer"**. É verdade e é o diferencial
dele — mas **num funil de recrutamento, híbrido costuma perder para específico**.
Um filtro de ATS procurando "Data Analyst" não gosta de metade do currículo
falando de Next.js; um filtro procurando "Full-stack" não gosta da metade de
Pandas e Selenium. Para uma vaga só, os dois lados parecem raso.

A sessão **precisa fechar isso com o João antes de listar vagas**, porque muda
CV, LinkedIn, palavras-chave e empresas-alvo:

- **Opção A — Full-stack / Software Engineer (recomendada como principal).**
  É onde está o volume de vagas remotas internacionais, é o que o trabalho atual
  dele realmente é (tech lead de uma plataforma Next.js em produção), e é o que
  o portfólio prova melhor: cinco sistemas em produção, todos web.
- **Opção B — Data / Analytics Engineer.** Menos vagas remotas para fora do
  país, mais concorrência com quem tem stack de dados moderno (dbt, Airflow,
  Snowflake, Spark) — que o João **não tem**. A experiência dele com dados é
  automação em Python e SQL, o que é real mas não é o que essas vagas pedem.
- **Opção C — Manter o híbrido.** Só funciona em vaga de empresa pequena ou
  early-stage, onde "faz de tudo" é o requisito. É uma pista legítima, mas
  estreita: trate como terceira, não como padrão.

**Recomendação:** A como principal, C como secundária oportunista, B só se
aparecer vaga que peça exatamente automação em Python + SQL + dashboards.
Confirme com o João antes de seguir.

---

## 3. Perfil factual (não invente, não infle)

- **Nome:** João Romão · Belém, Pará, Brasil · UTC−3, sem horário de verão.
- **Trajetória:** SEDUC-PA desde **set/2023**, mesma instituição, contratantes
  diferentes — estágio set/2023–2025 → Kapa nov/2025–mar/2026 → Montreal
  Informática 2026–atual. Hoje é **tech lead e product owner do SIMF**.
- **Formação:** Bacharelado em Ciência da Computação, Universidade Cruzeiro do
  Sul, 2021 – nov/2025 (os dois últimos anos junto com o trabalho). Três
  **pós-graduações lato sensu** na FAMEESP em andamento, prazo 2027.
- **Inglês:** **B2 Upper Intermediate (EF SET, 2025).** Ver §5 — é a restrição
  mais importante do processo, não um detalhe do CV.
- **Stack real:** Python, TypeScript, JavaScript, SQL · React, Next.js 15,
  Tailwind, Streamlit · Pandas, Selenium, scraping, RPA, OCR · PostgreSQL,
  Supabase, SQLite, APIs REST, Ubuntu (Nginx, PM2) · Git, Vitest.
- **Reconhecimento:** Outstanding Achievement, I2A2 "AI for Sustainable
  Projects — Towards COP 30" (dez/2025), top 7 mundial, co-liderou o EcoPredict.

**Números que ele tem** (use, são o que convence): o SIMF é usado diariamente
por ~50 pessoas — dois diretores, uma secretária adjunta, cinco coordenadores e
mais de quarenta operacionais. O Balcão agenda ~110 escolas em 200 vagas
presenciais. O monitor PETE/PEAE substituiu duas planilhas com Apps Script e
expôs ordens bancárias duplicadas que o processo anterior escondia.

**Números que ele não tem:** ClickContas, Sensse e Cherry Bomb não têm métrica
nenhuma publicada. Se a vaga pedir impacto quantificado, peça os números ao
João — **não estime**.

---

## 4. Ativos prontos

| O quê | Onde |
| --- | --- |
| Portfólio | https://www.romaodev.com (inglês) · /pt (português) |
| CV inglês | https://www.romaodev.com/joao-romao-cv.pdf |
| CV português | https://www.romaodev.com/joao-romao-cv-pt.pdf |
| Fonte dos CVs | `scripts/build_cv.py` — edite e rode, nunca edite o PDF |
| LinkedIn | https://www.linkedin.com/in/joaoromao-data/ |
| GitHub | https://github.com/joaoromaodev |
| E-mail | joaoromaodev@gmail.com |

Adaptar o CV para uma vaga = editar `scripts/build_cv.py`, rodar
`python scripts/build_cv.py`, commitar. Para uma versão sob medida que não deve
ir pro site, gere num caminho fora de `public/`.

---

## 5. Restrições — leia antes de prometer qualquer coisa

1. **Inglês B2 é o gargalo real.** Dá para ler, escrever e trabalhar; entrevista
   comportamental em inglês nativo, ao vivo, é outra coisa. Isso deve influenciar
   a **escolha de pista**: empresas com times em LatAm, processos assíncronos ou
   entrevista técnica escrita são mais favoráveis que startup americana com
   quatro rodadas de conversa. Não trate como detalhe a corrigir depois — trate
   como critério de seleção de vaga. E se o João quiser subir para C1, isso é um
   projeto de meses que deve começar em paralelo, não depois.
2. **Ele está empregado.** Busca discreta: nada de "open to work" público sem
   ele decidir, nada que chegue a colegas da SEDUC.
3. **Sem telefone em documento público.** O número existe, mas CV e site não o
   carregam (CLAUDE.md §4). Em formulário de candidatura ele decide caso a caso.
4. **Honestidade — as três armadilhas que o portfólio já evita:**
   - *lato sensu* é **especialização**, nunca "mestrado"/"master's".
   - "tech lead" dele é **decisão técnica e product ownership**, não gestão de
     pessoas. Nunca escreva que ele lidera um time.
   - Nada confidencial do SIMF: sem nomes de módulos internos, hostnames ou
     identificadores de processo.
5. **Visto e relocação mudam de regra o tempo todo.** Se a conversa for para
   Portugal, Espanha, Alemanha, Holanda, Irlanda ou Canadá, **verifique as
   exigências atuais na fonte oficial** em vez de confiar na memória do modelo.

---

## 6. As três pistas de vaga (são processos diferentes, não a mesma lista)

**Pista 1 — Remoto internacional como contratado, morando no Brasil.**
É a de maior volume e a mais rápida. Formatos: empresas com EOR (Deel, Remote,
Oyster e afins), consultorias e staffing focados em LatAm, e produto americano
ou europeu que contrata PJ. Vantagem do João: UTC−3 cobre o dia inteiro da Costa
Leste dos EUA e as manhãs da Europa — isso está escrito no site, use nas
mensagens. Ponto de atenção: pagamento em dólar como PJ tem implicação fiscal;
isso é assunto de contador, não do agente.

**Pista 2 — Relocação com patrocínio.** Ciclo bem mais longo, exige inglês mais
forte e normalmente empresa grande. Vale manter como aposta de fundo, não como
foco inicial.

**Pista 3 — Brasil, empresa boa, salário em real.** Não é o objetivo declarado
dele, mas é a rede de segurança e o melhor lugar para treinar entrevista. Vale
discutir com ele se entra ou não.

---

## 7. Estado real do portfólio (o que um recrutador vê hoje)

O João considera o site pronto. Está bom — mas nem tudo está ligado, e a sessão
deve saber disso antes de mandar recrutador olhar:

- ✅ **Funciona ao vivo:** GitHub (heatmap real), Steam com capas, clima, e o
  **chatbot** (crédito comprado em 02/09/2026 — responde no idioma da pergunta).
- ⚠️ **Spotify mostra dados de exemplo,** rotulado como tal. A API exige conta
  **Premium** do dono do app e a dele é Free. Sem conserto no código.
- ⚠️ **Cherry Bomb está publicado sem link de repo nem demo**, porque a senha do
  admin vazou no histórico do repositório público. Precisa rotacionar no Railway
  antes de divulgar (`docs/ALIMENTAR-PORTFOLIO.md` §5).
- ⚠️ **Quatro dos cinco projetos não têm métrica** — só o SIMF tem. Se a sessão
  for otimizar algo do portfólio para a busca, é aqui que está o maior ganho.
- ❌ **Não há nenhum texto técnico publicado.** Para vaga remota internacional,
  escrever é o diferencial mais forte e mais barato que falta. Ele tem material
  pronto (a detecção de anomalia que achou ordens duplicadas, por exemplo).

---

## 8. O que a sessão deve entregar, em ordem

1. **Fechar o posicionamento** (§2) com o João. Tudo depende disso.
2. **Vocabulário de busca:** títulos que essa pista usa de verdade, em inglês e
   em português, com as variações que os filtros usam.
3. **Lista de empresas-alvo** por pista, com o motivo de cada uma caber no
   perfil — não uma lista genérica de "empresas que contratam remoto".
4. **LinkedIn:** headline, "about" e experiência alinhados com a pista escolhida
   e com o CV, sem contradizer o site.
5. **CV mestre + regra de adaptação:** o que muda por vaga e o que nunca muda.
6. **Modelos de abordagem** (candidatura, mensagem fria a engenheiro da empresa,
   follow-up), curtos e específicos — nada de carta genérica.
7. **Planilha ou markdown de acompanhamento:** vaga, empresa, pista, data,
   estágio, próximo passo.
8. **Preparação de entrevista em inglês**, por ser a restrição de §5: respostas
   ensaiadas para as perguntas previsíveis sobre o SIMF, sobre o arco
   estágio→tech lead, e sobre por que quer sair do setor público.

---

## 9. Prompt para abrir a sessão nova

```
Leia docs/CACA-VAGAS.md e CLAUDE.md neste repositório.

Sou o João. Meu portfólio está no ar em www.romaodev.com e agora quero
organizar a busca por vagas — o objetivo é trabalho remoto internacional
(receber em dólar/euro) ou imigração via tecnologia.

Comece pelo §2 do documento: me faça decidir o posicionamento antes de
qualquer lista de vagas, e me diga sua recomendação com o motivo. Depois
siga a ordem do §8.

Depois disso quero que você opere comigo os canais de vaga com foco em
remoto (LinkedIn, Indeed, Remotive, We Work Remotely, Wellfound):
buscar, filtrar, ler as vagas, avaliar o fit e preencher as
candidaturas. Eu faço o login antes; você trabalha na janela já aberta.

Duas regras: não invente número nem experiência que não esteja no
documento — se faltar dado, me pergunte. E me mostre o conteúdo exato
antes de submeter candidatura, mandar mensagem ou publicar no LinkedIn:
eu confirmo cada envio.
```

---

## 10. Onde estão as outras fontes de verdade

- `CLAUDE.md` — perfil, projetos, e as regras de honestidade (§8).
- `docs/ALIMENTAR-PORTFOLIO.md` — pendências do portfólio, incluindo a
  segurança do Cherry Bomb (§5).
- `scripts/build_cv.py` — os dois CVs, gerados de uma fonte só.
