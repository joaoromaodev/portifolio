# Alimentar o portfólio — guia de continuidade

> Para retomar de outra máquina ou em outra sessão sem perder contexto.
> Notas em português; o conteúdo do site é bilíngue (ver `CLAUDE.md` §3.1).
> Última atualização: 31/08/2026.

---

## 1. Onde as coisas moram

| O quê | Onde |
|---|---|
| Catálogo de projetos | `content/projects.json` (schema em `content/projects.schema.json`) |
| Carregador e tipos | `lib/projects.ts` |
| Imagens dos projetos | `public/projects/<slug>/` |
| Painel de edição | `/admin` — **só existe em `npm run dev`**, em produção dá 404 |
| Textos de interface | `lib/i18n/dictionaries/{en,pt}.ts` |

Um projeto ganha **página de estudo de caso** automaticamente assim que tiver
`overview`, `highlights` ou `gallery` — ver `hasDetailPage()` em
`lib/projects.ts`. Sem isso o card não vira link, de propósito: o site nunca
promete uma profundidade que não existe.

A home mostra os **4 primeiros** destaques (`HOME_FEATURED_LIMIT`), porque a
grade é de duas colunas e um 5º tile deixaria a última linha pela metade. O
`/admin` avisa quando um destaque cai fora desse corte.

---

## 2. Estado atual (31/08/2026)

**No site (7):**

| Projeto | Destaque | Página de caso | Telas |
|---|---|---|---|
| SIMF | ★ (home) | sim | 5 |
| ClickContas | ★ (home) | sim | 6 |
| Balcão de Atendimento | ★ (home) | sim | 8 |
| Sensse | ★ (home) | sim | 8 |
| RootLab | ★ (fora do corte de 4) | não | — |
| Diárias | — | não | — |
| Cherry Bomb Vending Machine | — | não | — |

**Em rascunho** (`published: false`, recuperável com um toggle no `/admin`):

- **Monitor PETE/PEAE** — tirado porque faz scraping do SIAFE, que é sigiloso,
  e o João não quis print do sistema rodando. *Nota: o motivo justifica tirar as
  imagens, não necessariamente o projeto — ele pode voltar como card só de
  texto, como o SIMF era antes.*
- **EcoPredict** — tirado a pedido.
- **Mago Mercador** — tirado por não ser código nem sistema.

---

## 3. Como adicionar um projeto novo

### Passo 1 — pedir o pacote

Existe um prompt pronto para mandar à sessão que tem o código do projeto na
mão. Ele pede exatamente os campos que o catálogo consome. O modelo está no
histórico da conversa do Sensse; o essencial é pedir:

- **`case-study.md`** com: `kicker`, `summary` (máx. 165 caracteres),
  `problem`, `solution`, `impact`, `role`, `overview` (2 parágrafos), `stack`,
  `highlights` (3 a 5, título + parágrafo), `status`.
- **`mockups/`** — páginas HTML autocontidas, 1280px de largura, sem
  dependência de rede. (Print direto também serve.)
- Marcação do que é **verificável no código** versus **afirmação de negócio**.
- Uma lista explícita do que **não** pode ser publicado.

O que funcionou melhor: ClickContas e Sensse vieram nesse formato e foram os
mais rápidos de integrar.

### Passo 2 — verificar os dados **antes** de publicar

Não confie na nota que diz "dados fictícios" — confira. Isto é `CLAUDE.md` §8,
e já pegou coisa de verdade:

```bash
# CNPJ/CPF, e-mails, telefones, URLs externas
grep -ohE '[0-9]{2}\.[0-9]{3}\.[0-9]{3}/[0-9]{4}-[0-9]{2}' *.html | sort -u
grep -ohE '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}' *.html | sort -u
```

**Já aconteceu:** o `simfdemo.html` continha `joao.romao@seduc.pa.gov.br` e
mais três colegas no domínio real da SEDUC. Foram trocados por
`@exemplo.gov.br` antes de renderizar.

Confira também: nome de cliente real, número sequencial de pedido (conta
quantas vendas houve), faturamento/margem, credenciais, IPs e DNS internos.

### Passo 3 — renderizar os mockups HTML

Chrome headless, sem instalar nada. **Use caminhos com barra normal e letra de
drive** — caminho POSIX do git bash não funciona, e `$var` dentro de caminho
escapado com `\\` não expande.

```bash
BASE="C:/caminho/para/scratchpad"
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
"$CHROME" --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
  --user-data-dir="$BASE/chrome-profile" --virtual-time-budget=3000 \
  --window-size=1280,900 --screenshot="$BASE/shots/tela.png" \
  "http://localhost:3000/_mock/tela.html"
```

Armadilhas já pagas:

- **`--force-device-scale-factor=2` não funciona** nesse modo. A captura sai em
  1280 nativo. Não redimensione para cima depois — isso incha o arquivo.
- Se a página for um app de `100vh` com `overflow:hidden`, injete CSS de
  captura (`body{height:auto;overflow:visible}`) senão a tela é cortada.
- Se o mockup respeitar `prefers-color-scheme`, o headless sai **escuro**.
  Fixe o tema prefixando `<html data-theme="light">`.
- Meça a altura real de cada tela antes (num iframe no navegador) e capture com
  `--window-size` correspondente.

### Passo 4 — converter para WebP

**A otimização de imagem da Vercel está desligada** (`images.unoptimized` no
`next.config.ts`), porque é recurso medido e a cota do plano free estourou —
o `/_next/image` passou a responder 402 e **todas** as imagens do site
quebraram. Então o formato commitado é o que o visitante baixa.

Regra: teste os dois e fique com o menor.

- **Lossless** ganha em tela de UI chapada (economiza 60–70% contra PNG).
- **q95** ganha quando há gradiente grande (a home do Sensse: 141KB lossless
  contra 36KB em q95).

```js
const ll  = await sharp(f).webp({ lossless: true, effort: 6 }).toBuffer();
const q95 = await sharp(f).webp({ quality: 95, effort: 6 }).toBuffer();
// grave o menor
```

Nunca commite PNG cru em `public/projects/`.

### Passo 5 — cadastrar

Pelo `/admin` (`npm run dev` → http://localhost:3000/admin) ou editando o JSON
direto. Todo campo de texto é bilíngue `{ en, pt }`; o `pt` é opcional e cai
para o `en`, e o painel mostra quantos campos ainda faltam traduzir.

Toda imagem de galeria precisa de `alt` — o painel sinaliza as que estão sem.

### Passo 6 — verificar e publicar

```bash
npx tsc --noEmit && npx eslint . && npm run build
```

Depois suba um `next start` e confira: rotas 200 nos dois idiomas, imagens
servindo como `image/webp`, sem overflow horizontal em 375px, e nenhum link
externo indevido no artigo. Commit → push → a Vercel publica sozinha em ~45s.

---

## 4. Armadilhas do código que já custaram caro

**`AnimatePresence` só desmonta filho direto que seja `motion.*` com `key`.**
Um `<div>` comum como filho direto deixa a subárvore montada para sempre — e um
overlay `fixed inset-0` invisível engole **todo clique da página**. Aconteceu
duas vezes (paleta de comandos e lightbox da galeria). Em modal, prefira montar
e desmontar direto, sem animação de saída.

**Item de grade precisa de `min-w-0`.** O padrão é `min-width:auto`, então
qualquer `truncate` (que é `white-space: nowrap`) vira um piso maior que a
pista e joga a página inteira em rolagem horizontal no mobile.

**Nenhuma cor hardcoded em `components/`.** Tudo resolve por token `--color-*`
em `app/globals.css`. Um hex solto quebra o modo claro sem avisar.

**O CSP só vale em produção.** Em dev ele briga com o `eval()` do React e o
websocket do HMR. Para testar os headers de verdade: `npm run build && npm start`.

---

## 5. Pendências

- [ ] **CV** — colocar o PDF em `public/joao-romao-cv.pdf`. Os botões de
      download no hero e no contato aparecem sozinhos quando o arquivo existir;
      até lá ficam escondidos. **É o último item aberto do checklist de
      divulgação** (`SETUP.md`).
- [ ] **RootLab** — está marcado como destaque mas fica fora do corte de 4 da
      home. Decidir: mandar material (telas + notas) para ele brigar por uma
      vaga, ou tirar o destaque e deixá-lo no `/projects`.
- [ ] **Sensse** — o site usa os **mockups** com arte abstrata no lugar da foto
      de produto, porque o público é recrutador internacional. Os prints da loja
      real estão no pacote entregue; se a decisão mudar, é trocar arquivo em
      `public/projects/sensse/`, não refazer.
- [ ] **SIMF** — publicar ou não o código como repo demo público continua em
      aberto. `CLAUDE.md` §8.1 diz que não; se mudar, precisa ser decisão
      explícita, e o pacote tem de ser revisado arquivo por arquivo antes
      (tirar `supabase/.temp/` e os docs organizacionais internos).
- [ ] **Projetos que ainda pediriam material:** Cherry Bomb (é um projeto de
      design **sem nenhuma imagem** — a contradição mais gritante do catálogo) e
      Diárias (esse pode ficar como tile compacto para sempre; inventar
      profundidade ali seria encher linguiça).
