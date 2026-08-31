import type { Dictionary } from "./en";

// Brazilian Portuguese. Written for a Brazilian reader, not translated
// word-for-word from the English — the About narrative in particular keeps
// João's voice rather than mirroring the English sentence structure.
//
// Deliberately left in English: technology names, the code-comment section
// slugs (`// about`), and the widget status words (`live`, `idle`) — they read
// as terminal output, and translating them would break the motif.
export const pt: Dictionary = {
  locale: "pt",
  htmlLang: "pt-BR",
  ogLocale: "pt_BR",
  label: "Português",
  shortLabel: "PT",

  meta: {
    title: "João Romão — Analista de Dados & Desenvolvedor",
    description:
      "Portfólio de João Romão — perfil híbrido de Dados + Dev, de Belém, Pará. Automação em Python, dashboards em tempo real e full-stack com Next.js. Aberto a trabalho remoto e realocação.",
    ogDescription:
      "Um dashboard vivo sobre mim: dados em tempo real, automação em Python e full-stack com Next.js. Aberto a trabalho remoto e realocação.",
    keywords: [
      "João Romão",
      "Analista de Dados",
      "Desenvolvedor",
      "Automação Python",
      "Next.js",
      "Belém",
      "remoto",
    ],
  },

  profile: {
    role: "Analista de Dados & Desenvolvedor",
    tagline: "automação em Python · dados em tempo real · full-stack Next.js",
    location: "Belém, Pará — Brasil",
    status: "aberto a remoto / realocação",
  },

  a11y: {
    skipToContent: "Pular para o conteúdo",
  },

  nav: {
    items: [
      { id: "dashboard", label: "live" },
      { id: "about", label: "sobre" },
      { id: "experience", label: "experiência" },
      { id: "projects", label: "projetos" },
      { id: "skills", label: "skills" },
      { id: "contact", label: "contato" },
    ],
    cta: "fale comigo",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
  },

  theme: {
    toLight: "Mudar para o tema claro",
    toDark: "Mudar para o tema escuro",
  },

  language: {
    switchLabel: "Trocar idioma",
    other: "English",
    otherShort: "EN",
  },

  hero: {
    prompt: "whoami",
    headline: {
      lead: "Eu construo os sistemas em tempo real que sustentam as ",
      accent: "finanças do setor público",
      tail: " — transformando dado bruto em automação e em produtos full-stack que aguentam produção.",
    },
    roleLine: "Analista de Dados & Desenvolvedor, de Belém do Pará.",
    cityLabel: "Belém",
    ctaWork: "Ver projetos",
    ctaCv: "Baixar CV",
    ctaContact: "Contato",
  },

  dashboard: {
    slug: "live",
    title: "Um dashboard que está mesmo vivo",
    subtitle:
      "Cards alimentados por APIs de verdade — GitHub, Steam e Spotify — cada um servido pelo seu próprio Route Handler do Next.js, então as chaves nunca chegam ao navegador. Pergunte qualquer coisa sobre o trabalho ao assistente abaixo.",
    status: {
      loading: "fetching",
      ready: "live",
      empty: "idle",
      error: "offline",
    },
    sourceLabel: "fonte",
    viewProfile: "Ver perfil",
    github: {
      title: "Atividade no GitHub",
      source: "GitHub REST · ISR ~1h",
      contributions: "contribuições",
      tracked: "monitoradas",
      lastWeeks: "últimas {weeks} semanas",
    },
    steam: {
      title: "Steam · jogados recentemente",
      source: "Steam Web API · perfil público",
      perTwoWeeks: "/ 2sem",
    },
    spotify: {
      title: "Spotify",
      loading: "carregando",
      nowPlaying: "tocando agora",
      lastPlayed: "tocou por último",
      exampleTrack: "faixa de exemplo",
      open: "abrir",
      topTracks: "mais ouvidas",
    },
    ask: {
      title: "Pergunte ao meu portfólio",
      placeholder: "Digite uma pergunta…",
      thinking: "Pensando…",
      send: "Enviar",
      intro: "Pergunte o que quiser sobre o trabalho, os projetos ou a trajetória do João.",
      poweredBy: "Movido a Claude — as respostas ficam dentro do portfólio.",
      sendShort: "enviar",
      footnote: "limite de uso · máx. 300 tokens · sem dados do SIMF / do governo",
      unavailable: "O assistente está indisponível no momento.",
      genericError: "Algo deu errado.",
      suggestions: [
        "O que o João faz na SEDUC?",
        "Qual é o projeto mais forte dele?",
        "Ele está aberto a trabalho remoto?",
      ],
    },
  },

  about: {
    slug: "about",
    title: "A pessoa por trás do dashboard",
    paragraphs: [
      "Sou gamer e nerd desde que me entendo por gente. Começou lá por 2007, no PC de segunda mão que meu irmão mais velho me passou, onde rejoguei The Legend of Zelda: Ocarina of Time no emulador mais vezes do que consigo contar — era o único jogo que eu tinha.",
      "Eu já programava antes de saber o que era código: mexendo no CSS do meu Tumblr, editando arquivos do Minecraft no Bloco de Notas pra subir um servidor por Hamachi e jogar com os amigos. Cresci pesquisando no Google tudo que precisava aprender — inimigo declarado do \"não sei fazer isso\".",
      [
        "Essa curiosidade definiu o rumo da minha vida inteira. O ",
        {
          text: "Think Different",
          href: "https://pt.wikipedia.org/wiki/Think_different",
        },
        ", da Apple — aquele que diz que as pessoas loucas o bastante pra achar que podem mudar o mundo são as que mudam —, me pegou exatamente na idade certa. Ali eu soube que queria ser uma delas, usando tecnologia pra mudar alguma coisa de verdade.",
      ],
      "Quando criança, eu fazia jogos; adolescente, migrei pro design e emendei um negócio no outro (e fui à falência em vários). Essa mesma vontade aparece em tudo até hoje: um projeto de luthieria que estou começando, um empreendimento novo sempre que enxergo uma oportunidade, e jogar com os amigos.",
      "Meu objetivo de longo prazo: construir uma vida com a minha esposa — em algum lugar com qualidade de vida de verdade, e com a liberdade financeira e física pra aproveitar.",
    ],
    beyondCodeLabel: "além do código",
    beyondCode: [
      "Rock & metal",
      "Quebra-cabeças",
      "Anime & cinema",
      "Guitarra",
      "Luthieria",
      "Games",
      "Treino",
    ],
  },

  experience: {
    slug: "experience",
    title: "De estagiário a tech lead",
    subtitle:
      "~2,5 anos dentro da Secretaria de Estado de Educação do Pará (SEDUC-PA) — mesma instituição, escopo crescendo.",
    items: [
      {
        period: "2024 — atual",
        role: "Tech Lead & Product Owner — SIMF",
        org: "Montreal Informática · SEDUC-PA",
        note: "Responsável pelas decisões técnicas e product owner de uma plataforma interna de monitoramento financeiro. Braço direito da diretora da DPPC.",
      },
      {
        period: "2023 — 2024",
        role: "Desenvolvedor",
        org: "Kapa · SEDUC-PA",
        note: "Construí automações financeiras em produção (PETE/PEAE, Diárias) — do relatório bruto do SIAFE até os relatórios e o envio das mensagens.",
      },
      {
        period: "2022 — 2023",
        role: "Estagiário → Desenvolvedor",
        org: "SEDUC-PA",
        note: "Comecei como estagiário na Secretaria de Educação do Pará e cresci para uma vaga de desenvolvedor, atuando em dados e automação.",
      },
    ],
  },

  projects: {
    slug: "projects",
    title: "Trabalhos selecionados",
    subtitle:
      "Sistemas reais, a maioria em produção. Os mais fortes primeiro. Trabalho de governo aparece só como estudo de caso — sem dado real, sem código privado.",
    more: "outros projetos",
    seeAll: "Ver todos os projetos",
    indexTitle: "Tudo que eu construí",
    indexSubtitle:
      "Todos os projetos, os mais fortes primeiro — inclusive os menores, que não aparecem na página inicial.",
    indexSlug: "todos os projetos",
    count: "{n} projetos",
    terms: {
      problem: "problema",
      solution: "solução",
      impact: "impacto",
    },
    flags: {
      "case-study": "estudo de caso",
      live: "em produção",
      building: "em construção",
      award: "premiado",
      side: "projeto paralelo",
    },
  },

  projectDetail: {
    back: "Todos os projetos",
    backHome: "Início",
    caseStudy: "Estudo de caso",
    theCase: "o caso",
    role: "meu papel",
    overview: "visão geral",
    highlights: "notas de engenharia",
    gallery: "telas",
    stack: "stack",
    metaTitle: "{title} — estudo de caso",
    close: "Fechar",
    previous: "Tela anterior",
    next: "Próxima tela",
    counter: "{n} de {total}",
    openImage: "Ampliar",
  },

  skills: {
    slug: "skills",
    title: "Caixa de ferramentas",
    groups: [
      { group: "Linguagens", items: ["Python", "JavaScript", "TypeScript", "SQL"] },
      {
        group: "Frontend",
        items: ["React", "Next.js 15", "Tailwind CSS", "Streamlit"],
      },
      {
        group: "Dados & Automação",
        items: [
          "Pandas",
          "Selenium",
          "Web scraping",
          "RPA",
          "Detecção de anomalias",
          "Gspread",
        ],
      },
      {
        group: "Backend & Infra",
        items: [
          "Supabase",
          "PostgreSQL",
          "SQLite",
          "APIs REST",
          "Ubuntu (Nginx, PM2)",
          "IndexedDB / Dexie",
        ],
      },
      {
        group: "Práticas",
        items: [
          "Vitest",
          "Git",
          "Google Apps Script",
          "IA generativa para produtividade",
        ],
      },
    ],
  },

  contact: {
    slug: "contact",
    title: "Vamos conversar",
    subtitle:
      "Aberto a vagas remotas e realocação. O jeito mais rápido de falar comigo é por e-mail ou LinkedIn.",
    emailLabel: "e-mail",
    copy: "copiar",
    copied: "copiado ✓",
    cv: "CV (PDF)",
    location: {
      basedIn: "morando em",
      city: "Belém, Pará",
      gateway: "porta de entrada da Amazônia",
      localTime: "hora local",
      weatherNow: "clima agora",
    },
  },

  weather: {
    clear: "Céu limpo",
    partlyCloudy: "Parcialmente nublado",
    overcast: "Encoberto",
    fog: "Neblina",
    rain: "Chuva",
    snow: "Neve",
    showers: "Pancadas de chuva",
    thunderstorm: "Tempestade",
    unknown: "—",
  },

  footer: {
    builtBy: "feito por",
  },

  commandPalette: {
    trigger: "terminal",
    open: "Abrir paleta de comandos (Ctrl+K)",
    label: "Paleta de comandos",
    chrome: "joao@belem — paleta de comandos",
    placeholder: "digite um comando…",
    hint: 'digite "help" · ↑/↓ histórico · esc para fechar',
    empty: "Tente {a}, {b}, ou simplesmente {c}. Digite {d} para mais.",
    available: "Comandos disponíveis:",
    typeSection: "Digite o nome de uma seção para pular até ela.",
    jumping: "Pulando para // {label}…",
    notFound: "comando não encontrado: {cmd}",
    tryHelp: 'Digite "help" para ver o que existe.',
    opening: "Abrindo",
    sudo: "Boa tentativa. Este terminal só tem acesso de leitura — igual a você. 🥪",
    triforce:
      "Sabedoria, Poder, Coragem.\nO mesmo moleque que rejogou Ocarina of Time até o emulador desistir. Ainda atrás das três. 🔺",
  },

  notFound: {
    title: "404",
    prompt: "cd",
    error: "cd: arquivo ou diretório inexistente",
    body: "Essa página não existe. Tudo neste site mora em uma página só — volta e rola pra baixo.",
    home: "Voltar ao início",
    work: "Ver os projetos",
    metaTitle: "404 — página não encontrada",
  },
};
