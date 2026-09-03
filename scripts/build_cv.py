"""Build public/joao-romao-cv.pdf — the CV the hero and contact CTAs offer.

    python scripts/build_cv.py

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
    fontSize=8.9,
    leading=11.6,
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
        Spacer(1, 7),
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
    out.append(Spacer(1, 5))
    return out


story = []

# ---- header -----------------------------------------------------------------
story += [
    Paragraph("João Romão", NAME),
    Spacer(1, 1.5),
    Paragraph("Data Analyst &amp; Developer", ROLE),
    Spacer(1, 3),
    Paragraph(
        'Belém, Pará, Brazil &nbsp;·&nbsp; open to remote / relocation<br/>'
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

# ---- summary ----------------------------------------------------------------
story += section("Profile")
story += [
    Paragraph(
        "Hybrid Data + Dev profile with ~2.5 years inside the Pará State Department of "
        "Education (SEDUC-PA), where I grew from intern to technical lead and product "
        "owner of the platform its finance directorates run on. I build Python automation "
        "and full-stack Next.js products that survive production: real users, real money, "
        "real deadlines. Comfortable owning a system end to end — data ingestion, "
        "anomaly detection, interface, deployment and the people who depend on it.",
        BODY,
    )
]

# ---- experience -------------------------------------------------------------
story += section("Experience")
story += job(
    "Tech Lead &amp; Product Owner — SIMF",
    "Montreal Informática · SEDUC-PA — Belém, Brazil",
    "2024 — present",
    [
        "Technical decision-maker and product owner of an internal platform that monitors "
        "budget and financial execution for the state education department. In active daily "
        "use by two directorates.",
        "Built with Next.js 15 (App Router), React, Tailwind and Supabase/PostgreSQL, reading "
        "from the state financial system; covers budget execution, settlements, payments and "
        "bank-account tracking, with role-based access control.",
        "Own the deployment: Ubuntu 24.04 server behind Nginx with PM2, internal DNS and HTTPS "
        "across the corporate network.",
    ],
)
story += job(
    "Developer",
    "Kapa · SEDUC-PA — Belém, Brazil",
    "2023 — 2024",
    [
        "Built and shipped the automation that tracks daily instalments paid to municipalities "
        "under two state programmes (school transport and school meals) — from the raw financial "
        "report through to the PDFs and messages the Secretary receives.",
        "Replaced a two-spreadsheet Google Sheets + Apps Script process, and added anomaly "
        "detection that surfaced duplicate payment orders the previous process silently hid.",
        "Python, Streamlit, SQLite, Selenium and Google Sheets, with the domain logic isolated "
        "in pure Python so it could later migrate into the main platform.",
    ],
)
story += job(
    "Intern → Developer",
    "SEDUC-PA — Belém, Brazil",
    "2022 — 2023",
    [
        "Started as an intern and grew into a developer role across data and automation work, "
        "which is where the financial-automation systems above came from.",
    ],
)

# ---- projects ---------------------------------------------------------------
story += section("Selected projects")
story += [
    Paragraph(
        "<b>ClickContas</b> — modular accounting SaaS, in production with real clients. "
        "Gemini-based OCR reads handwritten timesheets; collaborative cash book; two data "
        "stores (PostgreSQL and Google Sheets) chosen per access pattern.",
        BULLET,
        bulletText="•",
    ),
    Paragraph(
        "<b>Sensse</b> (sensse.com.br) — my own e-commerce in Next.js, catalogue through "
        "back-office, in production.",
        BULLET,
        bulletText="•",
    ),
    Paragraph(
        "<b>Balcão de Atendimento</b> — scheduling and auditable proof of service for a federal "
        "education programme. Sole developer; public demo repository.",
        BULLET,
        bulletText="•",
    ),
    Paragraph(
        "<b>Cherry Bomb</b> — vending machine that takes no card terminal: a QR code opens a "
        "mobile storefront mirroring the physical grid, and one Pix charge covers the basket. "
        "FastAPI, PostgreSQL, Mercado Pago, Railway. Software in production; the hardware "
        "release is specified but not built.",
        BULLET,
        bulletText="•",
    ),
    Paragraph(
        "Case studies, with screenshots, at <a href='https://www.romaodev.com/projects' "
        "color='#1A7F37'>romaodev.com/projects</a>.",
        BODY,
    ),
]

# ---- skills -----------------------------------------------------------------
story += section("Technical skills")
skills = [
    ("Languages", "Python, TypeScript, JavaScript, SQL"),
    ("Frontend", "React, Next.js 15, Tailwind CSS, Streamlit"),
    ("Data &amp; automation", "Pandas, Selenium, web scraping, RPA, anomaly detection, OCR"),
    ("Backend &amp; infra", "PostgreSQL, Supabase, SQLite, REST APIs, Ubuntu (Nginx, PM2)"),
    ("Practices", "Git, testing with Vitest, Google Apps Script, generative AI for productivity"),
]
story.append(
    Table(
        [
            [
                Paragraph(f"<b>{k}</b>", BODY),
                Paragraph(v, ParagraphStyle("s", parent=BODY, alignment=0)),
            ]
            for k, v in skills
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

# ---- education / languages / award ------------------------------------------
story += section("Education, languages and recognition")
story += [
    Paragraph(
        "<b>BSc in Computer Science</b> — Universidade Cruzeiro do Sul, Brazil (Nov 2025)",
        BULLET,
        bulletText="•",
    ),
    Paragraph(
        "<b>Languages</b> — Portuguese (native); English B2 Upper Intermediate (EF SET, 2025)",
        BULLET,
        bulletText="•",
    ),
    Paragraph(
        "<b>Outstanding Achievement, I2A2 &ldquo;AI for Sustainable Projects — Towards COP 30&rdquo;</b> "
        "(Dec 2025) — co-led EcoPredict, a machine-learning project on sustainability metrics for "
        "Belém, selected among the top 7 worldwide.",
        BULLET,
        bulletText="•",
    ),
]

doc = SimpleDocTemplate(
    "public/joao-romao-cv.pdf",
    pagesize=A4,
    leftMargin=15 * mm,
    rightMargin=15 * mm,
    topMargin=13 * mm,
    bottomMargin=12 * mm,
    title="João Romão — Data Analyst & Developer — CV",
    author="João Romão",
    subject="Curriculum vitae",
    creator="scripts/build_cv.py",
)
doc.build(story)
print("wrote public/joao-romao-cv.pdf")
