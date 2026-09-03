"""Build the downloadable CVs the hero and contact CTAs offer.

    python scripts/build_cv.py   ->  public/joao-romao-cv.pdf + -cv-pt.pdf

Kept as a script rather than a hand-made file so the CV and the site never
drift: everything below is sourced from CLAUDE.md (the editorial source of
truth) and content/projects.json. Edit here, re-run, commit the PDF.

Two constraints from CLAUDE.md §8 are load-bearing, not stylistic:
  - No phone number. The PDF is downloadable from a public URL, so it is as
    public as the site, and §4 keeps the number off the site.
  - Nothing confidential about SIMF: no internal module names, hostnames or
    process identifiers, and no claim of people management — João's lead role
    is technical decision-making and product ownership.

A4 rather than Letter: the audience is international, and A4 is the default
everywhere outside the US.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
)

INK = HexColor("#1A1D21")
MUTED = HexColor("#5A6169")
# The site's light-theme green (app/globals.css). The dark-theme one is too
# pale to survive printing on white.
ACCENT = HexColor("#1A7F37")

BODY = ParagraphStyle(
    "body",
    fontName="Helvetica",
    fontSize=8.8,
    leading=11.1,
    textColor=INK,
    alignment=TA_JUSTIFY,
)
NAME = ParagraphStyle(
    "name", fontName="Helvetica-Bold", fontSize=21, leading=23, textColor=INK
)
ROLE = ParagraphStyle(
    "role", fontName="Helvetica", fontSize=10.5, leading=13, textColor=ACCENT
)
CONTACT = ParagraphStyle(
    "contact", fontName="Helvetica", fontSize=8.4, leading=11.5, textColor=MUTED
)
SECTION = ParagraphStyle(
    "section",
    fontName="Helvetica-Bold",
    fontSize=9.3,
    leading=11,
    textColor=ACCENT,
    spaceBefore=0,
    spaceAfter=0,
)
JOB = ParagraphStyle(
    "job", fontName="Helvetica-Bold", fontSize=9.6, leading=12, textColor=INK
)
META = ParagraphStyle(
    "meta", fontName="Helvetica-Oblique", fontSize=8.4, leading=11, textColor=MUTED
)
BULLET = ParagraphStyle(
    "bullet",
    parent=BODY,
    leftIndent=8,
    bulletIndent=0,
    spaceBefore=1.4,
)


def section(title):
    return [
        Spacer(1, 5.5),
        Paragraph(title.upper(), SECTION),
        Spacer(1, 2),
        HRFlowable(width="100%", thickness=0.7, color=ACCENT, spaceAfter=4),
    ]


def job(role, org, period, bullets):
    out = [
        Table(
            [[Paragraph(role, JOB), Paragraph(period, META)]],
            colWidths=[124 * mm, 56 * mm],
            style=TableStyle(
                [
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("ALIGN", (1, 0), (1, 0), "RIGHT"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                    ("TOPPADDING", (0, 0), (-1, -1), 0),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
                ]
            ),
        ),
        Paragraph(org, META),
        Spacer(1, 2),
    ]
    out += [Paragraph(b, BULLET, bulletText="•") for b in bullets]
    out.append(Spacer(1, 3.5))
    return out


# ---- content, one entry per locale -------------------------------------------
# The Portuguese side is not a machine translation of the English one: it reuses
# the wording the /pt pages already use for the same roles and projects, so the
# CV and the site say the same thing in the same voice.
CONTENT = {
    "en": {
        "file": "public/joao-romao-cv.pdf",
        "role": "Full-Stack Software Engineer &nbsp;·&nbsp; TypeScript · React · Next.js · Python",
        "where": "Belém, Pará, Brazil (UTC-3) &nbsp;·&nbsp; open to remote / relocation",
        "sections": {
            "profile": "Profile",
            "experience": "Experience",
            "projects": "Selected projects",
            "skills": "Technical skills",
            "education": "Education, languages and recognition",
        },
        "profile": (
            "Full-stack engineer inside the Pará State Department of Education (SEDUC-PA) since "
            "2023, where I grew from intern to technical lead and product owner of the platform "
            "its finance directorates run on — Next.js 15, React, TypeScript and PostgreSQL, used "
            "every day by around 50 people. I own systems end to end: data model, business logic, "
            "interface, deployment and the people who depend on them. My depth is in financial "
            "operations software — budget execution, settlements, payments, reconciliation, and the "
            "anomaly detection that catches what a spreadsheet quietly hides."
        ),
        "jobs": [
            (
                "Tech Lead &amp; Product Owner — SIMF",
                "Montreal Informática · SEDUC-PA — Belém, Brazil",
                "2026 — present",
                [
                    "Technical decision-maker and product owner of an internal platform that monitors "
                    "budget and financial execution for the state education department — in active "
                    "daily use by around 50 people across two directorates, from operational staff to "
                    "the deputy secretary.",
                    "Built with Next.js 15 (App Router), React, Tailwind and Supabase/PostgreSQL, reading "
                    "from the state financial system; covers budget execution, settlements, payments and "
                    "bank-account tracking, with role-based access control.",
                    "Own the deployment: Ubuntu 24.04 server behind Nginx with PM2, internal DNS and HTTPS "
                    "across the corporate network.",
                ],
            ),
            (
                "Developer",
                "Kapa · SEDUC-PA — Belém, Brazil",
                "Nov 2025 — Mar 2026",
                [
                    "Built and shipped the automation that tracks daily instalments paid to municipalities "
                    "under two state programmes (school transport and school meals) — from the raw financial "
                    "report through to the PDFs and messages the Secretary receives.",
                    "Replaced a two-spreadsheet Google Sheets + Apps Script process, and added anomaly "
                    "detection that surfaced duplicate payment orders the previous process silently hid.",
                    "Python, Streamlit, SQLite, Selenium and Google Sheets, with the domain logic isolated "
                    "in pure Python so it could later migrate into the main platform.",
                ],
            ),
            (
                "Intern",
                "SEDUC-PA — Belém, Brazil",
                "Sep 2023 — 2025",
                [
                    "Joined the department as an intern and worked across data and automation for two "
                    "years — the ground the systems above were built on.",
                ],
            ),
        ],
        "projects": [
            "<b>ClickContas</b> — modular accounting SaaS, in production with real clients. "
            "Gemini-based OCR reads handwritten timesheets; collaborative cash book; two data "
            "stores (PostgreSQL and Google Sheets) chosen per access pattern.",
            "<b>Sensse</b> (sensse.com.br) — my own e-commerce in Next.js, catalogue through "
            "back-office, in production.",
            "<b>Balcão de Atendimento</b> — scheduling and auditable proof of service for a federal "
            "education programme. Sole developer; public demo repository.",
            "<b>Cherry Bomb</b> — vending machine that takes no card terminal: a QR code opens a "
            "mobile storefront mirroring the physical grid, and one Pix charge covers the basket. "
            "FastAPI, PostgreSQL, Mercado Pago, Railway. Software in production; the hardware "
            "release is specified but not built.",
        ],
        "projects_note": (
            "Case studies, with screenshots, at "
            '<a href="https://www.romaodev.com/projects" color="#1A7F37">romaodev.com/projects</a>.'
        ),
        "skills": [
            ("Languages", "Python, TypeScript, JavaScript, SQL"),
            ("Frontend", "React, Next.js 15, Tailwind CSS, Streamlit"),
            ("Backend &amp; infra", "Node.js, PostgreSQL, Supabase, SQLite, REST APIs, Ubuntu (Nginx, PM2)"),
            ("Data &amp; automation", "Pandas, Selenium, web scraping, RPA, anomaly detection, OCR"),
            ("Practices", "Git, testing with Vitest, Google Apps Script, generative AI for productivity"),
        ],
        "education": [
            "<b>Three postgraduate specialisations (lato sensu)</b> — FAMEESP, in progress "
            "(due 2027): Generative AI and Intelligent Agents for Business; Data Science and "
            "Big Data Analytics; Software Engineering",
            "<b>BSc in Computer Science</b> — Universidade Cruzeiro do Sul, Brazil (2021–2025)",
            "<b>Languages</b> — Portuguese (native); English B2 Upper Intermediate (EF SET, 2025)",
            "<b>Outstanding Achievement, I2A2 &ldquo;AI for Sustainable Projects — Towards COP 30&rdquo;</b> "
            "(Dec 2025) — co-led EcoPredict, a machine-learning project on sustainability metrics for "
            "Belém, selected among the top 7 worldwide.",
        ],
        "title": "João Romão — Full-Stack Software Engineer — CV",
    },
    "pt": {
        "file": "public/joao-romao-cv-pt.pdf",
        "role": "Desenvolvedor Full Stack &nbsp;·&nbsp; TypeScript · React · Next.js · Python",
        "where": "Belém, Pará (UTC-3) &nbsp;·&nbsp; aberto a trabalho remoto / realocação",
        "sections": {
            "profile": "Perfil",
            "experience": "Experiência",
            "projects": "Projetos selecionados",
            "skills": "Competências técnicas",
            "education": "Formação, idiomas e reconhecimento",
        },
        "profile": (
            "Desenvolvedor full stack dentro da Secretaria de Estado de Educação do Pará "
            "(SEDUC-PA) desde 2023, onde fui de estagiário a responsável técnico e product owner "
            "da plataforma que as diretorias financeiras usam todo dia — Next.js 15, React, "
            "TypeScript e PostgreSQL, com cerca de 50 pessoas usando diariamente. Assumo o sistema "
            "de ponta a ponta: modelo de dados, regra de negócio, interface e deploy. Minha "
            "profundidade está em software de operação financeira — execução orçamentária, "
            "liquidação, pagamento, conciliação e a detecção de anomalia que pega o que a "
            "planilha esconde."
        ),
        "jobs": [
            (
                "Tech Lead &amp; Product Owner — SIMF",
                "Montreal Informática · SEDUC-PA — Belém, Pará",
                "2026 — atual",
                [
                    "Responsável pelas decisões técnicas e product owner de uma plataforma interna que "
                    "monitora a execução orçamentária e financeira da secretaria de educação do estado "
                    "— em uso diário por cerca de 50 pessoas em duas diretorias, do operacional à "
                    "secretária adjunta.",
                    "Feita em Next.js 15 (App Router), React, Tailwind e Supabase/PostgreSQL, lendo do "
                    "sistema financeiro do estado; cobre execução orçamentária, liquidações, pagamentos e "
                    "acompanhamento de contas bancárias, com controle de acesso por perfil.",
                    "Cuido também do deploy: servidor Ubuntu 24.04 atrás de Nginx com PM2, DNS interno e "
                    "HTTPS na rede corporativa.",
                ],
            ),
            (
                "Desenvolvedor",
                "Kapa · SEDUC-PA — Belém, Pará",
                "nov/2025 — mar/2026",
                [
                    "Construí e coloquei em produção a automação que acompanha diariamente as parcelas "
                    "pagas às prefeituras em dois programas estaduais (transporte escolar e alimentação "
                    "escolar) — do relatório financeiro bruto até os PDFs e as mensagens que chegam à "
                    "Secretária.",
                    "Substituí um processo de duas planilhas no Google Sheets com Apps Script, e "
                    "acrescentei detecção de anomalia que expôs ordens bancárias duplicadas que o "
                    "processo anterior escondia.",
                    "Python, Streamlit, SQLite, Selenium e Google Sheets, com a regra de negócio isolada "
                    "em Python puro para poder migrar depois para a plataforma principal.",
                ],
            ),
            (
                "Estagiário",
                "SEDUC-PA — Belém, Pará",
                "set/2023 — 2025",
                [
                    "Entrei na secretaria como estagiário e atuei dois anos em dados e automação — o "
                    "terreno onde os sistemas acima foram construídos.",
                ],
            ),
        ],
        "projects": [
            "<b>ClickContas</b> — SaaS contábil modular, em produção com clientes reais. OCR com Gemini "
            "lê folha de ponto manuscrita; livro caixa colaborativo; dois bancos de dados (PostgreSQL e "
            "Google Sheets) escolhidos por padrão de acesso.",
            "<b>Sensse</b> (sensse.com.br) — e-commerce próprio em Next.js, do catálogo ao back-office, "
            "em produção.",
            "<b>Balcão de Atendimento</b> — agendamento e prova auditável de atendimento para um programa "
            "federal de educação. Desenvolvedor único; repositório de demonstração público.",
            "<b>Cherry Bomb</b> — máquina de vendas sem terminal de pagamento: um QR Code abre uma vitrine "
            "mobile que espelha a grade física, e um único Pix cobre a sacola inteira. FastAPI, "
            "PostgreSQL, Mercado Pago, Railway. Software em produção; a liberação física está "
            "especificada, mas não construída.",
        ],
        "projects_note": (
            "Estudos de caso, com telas, em "
            '<a href="https://www.romaodev.com/pt/projetos" color="#1A7F37">romaodev.com/pt/projetos</a>.'
        ),
        "skills": [
            ("Linguagens", "Python, TypeScript, JavaScript, SQL"),
            ("Frontend", "React, Next.js 15, Tailwind CSS, Streamlit"),
            ("Backend &amp; infra", "Node.js, PostgreSQL, Supabase, SQLite, APIs REST, Ubuntu (Nginx, PM2)"),
            ("Dados &amp; automação", "Pandas, Selenium, web scraping, RPA, detecção de anomalia, OCR"),
            ("Práticas", "Git, testes com Vitest, Google Apps Script, IA generativa para produtividade"),
        ],
        "education": [
            "<b>Três pós-graduações lato sensu</b> — FAMEESP, em andamento (prazo 2027): "
            "IA Generativa e Agentes Inteligentes para Negócios; Ciência de Dados e Big Data "
            "Analytics; Engenharia de Software",
            "<b>Bacharelado em Ciência da Computação</b> — Universidade Cruzeiro do Sul (2021–2025)",
            "<b>Idiomas</b> — Português (nativo); Inglês B2 Upper Intermediate (EF SET, 2025)",
            "<b>Outstanding Achievement, I2A2 &ldquo;AI for Sustainable Projects — Towards COP 30&rdquo;</b> "
            "(dez/2025) — co-liderei o EcoPredict, projeto de machine learning sobre métricas de "
            "sustentabilidade para Belém, entre os 7 melhores do mundo.",
        ],
        "title": "João Romão — Desenvolvedor Full Stack — CV",
    },
}


def build(locale):
    c = CONTENT[locale]
    story = [
        Paragraph("João Romão", NAME),
        Spacer(1, 1.5),
        Paragraph(c["role"], ROLE),
        Spacer(1, 3),
        Paragraph(
            c["where"] + "<br/>"
            '<a href="mailto:joaoromaodev@gmail.com" color="#1A7F37">joaoromaodev@gmail.com</a>'
            " &nbsp;·&nbsp; "
            '<a href="https://www.romaodev.com" color="#1A7F37">www.romaodev.com</a>'
            " &nbsp;·&nbsp; "
            '<a href="https://www.linkedin.com/in/joaoromao-data/" color="#1A7F37">linkedin.com/in/joaoromao-data</a>'
            " &nbsp;·&nbsp; "
            '<a href="https://github.com/joaoromaodev" color="#1A7F37">github.com/joaoromaodev</a>',
            CONTACT,
        ),
    ]

    story += section(c["sections"]["profile"])
    story += [Paragraph(c["profile"], BODY)]

    story += section(c["sections"]["experience"])
    for role, org, period, bullets in c["jobs"]:
        story += job(role, org, period, bullets)

    story += section(c["sections"]["projects"])
    story += [Paragraph(p, BULLET, bulletText="•") for p in c["projects"]]
    story += [Paragraph(c["projects_note"], BODY)]

    story += section(c["sections"]["skills"])
    story.append(
        Table(
            [
                [
                    Paragraph("<b>%s</b>" % k, BODY),
                    Paragraph(v, ParagraphStyle("s", parent=BODY, alignment=0)),
                ]
                for k, v in c["skills"]
            ],
            colWidths=[34 * mm, 146 * mm],
            style=TableStyle(
                [
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                    ("TOPPADDING", (0, 0), (-1, -1), 0.8),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 0.8),
                ]
            ),
        )
    )

    story += section(c["sections"]["education"])
    story += [Paragraph(e, BULLET, bulletText="•") for e in c["education"]]

    doc = SimpleDocTemplate(
        c["file"],
        pagesize=A4,
        leftMargin=15 * mm,
        rightMargin=15 * mm,
        topMargin=13 * mm,
        bottomMargin=12 * mm,
        title=c["title"],
        author="João Romão",
        subject="Curriculum vitae",
        creator="scripts/build_cv.py",
    )
    doc.build(story)
    print("wrote", c["file"])


for loc in CONTENT:
    build(loc)
